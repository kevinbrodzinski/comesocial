import argparse, hashlib, json, math, os, platform, subprocess, sys, tempfile
import numpy as np
from scipy import sparse
import lqmpc

AUTH_TOKEN = "1d74abf8c0aac88c80547e2782488e50907596d1aa5a5223bc0ff3ac586c01b0"
CANDIDATE = "CAND-E03-002"
INSTANCE_HASH = "ecda92017d1f60e2d15901a36bcf65ffc05c648a938987ad14efeac8a469f66d"
POINTS = [5.0, 7.5, 10.0, 12.5, 15.0]
REPS = 4
N = 25
M = 20


def source_constants():
    A = np.array([[1, -6.66e-13, -2.03e-9, -4.14e-6],
                  [9.83e-4, 1, -4.09e-8, -8.32e-5],
                  [4.83e-7, 9.83e-4, 1, -5.34e-4],
                  [1.58e-10, 4.83e-7, 9.83e-4, .9994]], dtype=float)
    B = np.array([[9.83e-4, 4.83e-7, 1.58e-10, 3.89e-14]], dtype=float).T
    C = np.array([[-.0096, .0135, .005, -.0095]], dtype=float)
    return A, B, C


def build_ref(A, B, C, t_step=0.001, t_sim=0.25):
    L = 120
    ref_len = (L + N) * int(t_sim/t_step)
    inv = np.linalg.inv
    I = np.eye(4)
    zr = 0.1 * np.sin(np.linspace(0, 2*np.pi, ref_len) * 8) + 0.2
    yr = (np.log(zr) + 5.468) / 61.4
    yr = np.array([yr])
    ur = inv(C @ inv(I-A) @ B) @ yr
    return inv(I-A) @ B @ ur


def solve_child(p):
    A, B, C = source_constants()
    n, m = B.shape
    t_step = 0.001
    t_sim = 0.25
    Q = C.T @ C
    R = sparse.eye(m) * 1e-6
    x0 = np.zeros(n)
    u0 = np.zeros(m)
    xr = build_ref(A, B, C, t_step, t_sim)
    xr_step = xr[:, :N*int(t_sim/t_step)]
    mpc = lqmpc.LQMPC(t_step, A, B, C)
    mpc.set_control(Q=Q, R=R, N=N, M=M)
    mpc.set_constraints(umin=np.array([0.0]), umax=np.array([float(p)]))
    try:
        result = mpc.step(t_sim, x0, u0, xr_step, out=False)
        status = str(getattr(result.info, "status", ""))
        y = getattr(result, "y", None)
        start = 2*N*n
        upper_rows = y[start:start+M*m] if isinstance(y, np.ndarray) and y.ndim == 1 and y.size >= start+M*m else None
        if upper_rows is None:
            raise RuntimeError("registered dual rows unavailable")
        mu_total = float(np.maximum(upper_rows, 0.0).sum())
        out = {
            "ok": status == "solved",
            "status": status,
            "status_val": int(getattr(result.info, "status_val", -999)),
            "prim_res": float(getattr(result.info, "prim_res", math.nan)),
            "dual_res": float(getattr(result.info, "dual_res", math.nan)),
            "iter": int(getattr(result.info, "iter", -1)),
            "mu_total": mu_total,
            "dual_rows_count": int(len(upper_rows)),
            "dual_rows_finite": bool(np.all(np.isfinite(upper_rows))),
            "objective_serialized": False,
            "primal_serialized": False
        }
    except Exception as exc:
        out = {"ok": False, "status": "EXCEPTION", "exception_class": type(exc).__name__, "objective_serialized": False, "primal_serialized": False}
    print(json.dumps(out, sort_keys=True))


def beta_atlas():
    A, B, C = source_constants()
    n, m = B.shape
    t_step = 0.001
    t_sim = 0.25
    n_sim = int(t_sim/t_step)
    Q = C.T @ C
    R = sparse.eye(m) * 1e-6
    S = sparse.eye(m) * 0.0
    Px = sparse.kron(sparse.eye(N), Q)
    Pu1 = sparse.kron(sparse.eye(M), 2*S + R)
    Pu2 = sparse.kron(sparse.eye(M,k=-1)+sparse.eye(M,k=1), -S)
    Pu3 = sparse.block_diag([sparse.eye((M-1)*m)*0, -S])
    Pu = Pu1 + Pu2 + Pu3
    P = 2*sparse.block_diag([Px, Pu]).tocsc()

    Axs = np.linalg.matrix_power(A, n_sim)
    Aus = np.zeros_like(A)
    for i in range(n_sim):
        Aus += np.linalg.matrix_power(A, i)
    Ax = sparse.kron(sparse.eye(N), -sparse.eye(n)) + sparse.kron(sparse.eye(N,k=-1), Axs)
    B0 = sparse.csc_matrix((1,M))
    Bstep = sparse.eye(M)
    Bend = sparse.hstack([sparse.csc_matrix((N-M-1,M-1)), np.ones((N-M-1,1))])
    Bu = sparse.kron(sparse.vstack([B0,Bstep,Bend]), Aus @ B).tocsc()

    dirs=[]
    for i in range(M):
        du=np.zeros(M); du[i]=-1.0; dirs.append(du)
    for i in range(M):
        for j in range(i+1,M):
            for k in range(1,9):
                lam=k/9.0
                du=np.zeros(M); du[i]=-lam; du[j]=-(1.0-lam); dirs.append(du)
    if len(dirs) != 1540:
        raise RuntimeError(f"atlas count {len(dirs)} != 1540")

    # Ax is square and nonsingular under the source slow-update construction.
    from scipy.sparse.linalg import spsolve
    qs=[]
    for du in dirs:
        dx=spsolve(Ax.tocsc(), -(Bu @ du))
        dz=np.concatenate([np.asarray(dx,dtype=float), du])
        q=float(0.5 * dz @ (P @ dz))
        qs.append(q)
    qs=np.asarray(qs,dtype=float)
    qmin=float(qs.min()); qmax=float(qs.max())
    if not np.isfinite(qmin) or not np.isfinite(qmax) or qmax <= qmin:
        return {"ok":False,"reason":"BETA_GEOMETRY_DEGENERATE","count":len(qs)}
    gaps=(qs-qmin)/(qmax-qmin)
    return {
        "ok": True,
        "count": int(len(gaps)),
        "gaps": [float(x) for x in gaps],
        "q_min": qmin,
        "q_max": qmax,
        "all_finite": bool(np.all(np.isfinite(gaps))),
        "source_only": True,
        "native_primal_used": False,
        "native_objective_used": False
    }


def pip_hash():
    raw=subprocess.check_output([sys.executable,"-m","pip","freeze"], text=True).encode()
    return hashlib.sha256(raw).hexdigest()


def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--child", type=float); args=ap.parse_args()
    if args.child is not None:
        solve_child(args.child); return
    projected=[]
    for p in POINTS:
        reps=[]
        for rep in range(REPS):
            cp=subprocess.run([sys.executable, __file__, "--child", str(p)], capture_output=True, text=True, check=False)
            try:
                row=json.loads(cp.stdout.strip().splitlines()[-1])
            except Exception:
                row={"ok":False,"status":"CHILD_PARSE_FAILURE","objective_serialized":False,"primal_serialized":False}
            row["replicate"]=rep
            reps.append(row)
        projected.append({"p_native":p,"replicates":reps})
    atlas=beta_atlas()
    all_native_ok=all(r.get("ok") for point in projected for r in point["replicates"])
    firewall_ok=all((r.get("objective_serialized") is False and r.get("primal_serialized") is False) for point in projected for r in point["replicates"])
    receipt={
        "suite_id":"RG-EXT-03E",
        "candidate_id":CANDIDATE,
        "candidate_instance_hash":INSTANCE_HASH,
        "authorization_token_sha256":AUTH_TOKEN,
        "authorization_consumed":True,
        "fresh_native_calls":len(POINTS)*REPS,
        "resource_bank":POINTS,
        "replicates_per_point":REPS,
        "projected_native_measurements":projected,
        "beta_atlas":atlas,
        "all_native_ok":all_native_ok,
        "firewall_intact":firewall_ok,
        "scientific_fields_embargoed":{"J_star":True,"optimal_primal":True,"H":True,"K":True,"mass_response":True,"boundary_outcome":True},
        "python_version":platform.python_version(),
        "machine":platform.machine(),
        "pip_freeze_sha256":pip_hash(),
        "condition1_projection_complete":bool(all_native_ok and firewall_ok and atlas.get("ok"))
    }
    with open("RG_EXT_03E_PROJECTED_MEASUREMENT.json","w") as f:
        json.dump(receipt,f,indent=2,sort_keys=True)
    print(json.dumps({"projection_complete":receipt["condition1_projection_complete"],"fresh_native_calls":receipt["fresh_native_calls"],"atlas_count":atlas.get("count")},sort_keys=True))
    raise SystemExit(0 if receipt["condition1_projection_complete"] else 1)

if __name__=="__main__":
    main()
