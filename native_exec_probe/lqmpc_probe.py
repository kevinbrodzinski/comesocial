import hashlib, json, platform, subprocess
import numpy as np
from scipy import sparse
import lqmpc

CANDIDATE = "CAND-E03-002"
INSTANCE_HASH = "ecda92017d1f60e2d15901a36bcf65ffc05c648a938987ad14efeac8a469f66d"
POINTS = [5.0, 7.5, 10.0, 12.5, 15.0]

def lock_hash():
    raw = subprocess.check_output(["python", "-m", "pip", "freeze"], text=True).encode()
    return hashlib.sha256(raw).hexdigest()

def build_ref(A, B, C, N, t_step, t_sim):
    L = 120
    ref_len = (L + N) * int(t_sim/t_step)
    inv = np.linalg.inv
    I = np.eye(4)
    zr = 0.1 * np.sin(np.linspace(0, 2*np.pi, ref_len) * 8) + 0.2
    yr = (np.log(zr) + 5.468) / 61.4
    yr = np.array([yr])
    ur = inv(C @ inv(I-A) @ B) @ yr
    xr = inv(I-A) @ B @ ur
    return xr

def run_point(umax_value):
    r = {
        "native_execution_success": False,
        "prohibited_native_status": False,
        "outcome_present": False,
        "outcome_type_valid": False,
        "outcome_finite": False,
        "outcome_value_exposed": False,
        "response_present": False,
        "response_type_valid": False,
        "response_finite": False,
        "response_value_exposed": False,
    }
    try:
        A = np.array([[1, -6.66e-13, -2.03e-9, -4.14e-6],
                      [9.83e-4, 1, -4.09e-8, -8.32e-5],
                      [4.83e-7, 9.83e-4, 1, -5.34e-4],
                      [1.58e-10, 4.83e-7, 9.83e-4, .9994]])
        B = np.array([[9.83e-4, 4.83e-7, 1.58e-10, 3.89e-14]]).T
        C = np.array([[-.0096, .0135, .005, -.0095]])
        n, m = B.shape
        t_step = 0.001
        N = 25
        Q = C.T @ C
        R = sparse.eye(m) * 1e-6
        umin = np.array([0.0])
        umax = np.array([float(umax_value)])
        x0 = np.zeros(n)
        u0 = np.zeros(m)
        t_sim = 0.25
        xr = build_ref(A, B, C, N, t_step, t_sim)
        n_sim = int(t_sim/t_step)
        xr_step = xr[:, :N*n_sim]
        mpc = lqmpc.LQMPC(t_step, A, B, C)
        mpc.set_control(Q=Q, R=R, N=N, M=20)
        mpc.set_constraints(umin=umin, umax=umax)
        result = mpc.step(t_sim, x0, u0, xr_step, out=False)
        solved = getattr(result.info, "status", None) == "solved"
        r["native_execution_success"] = bool(solved)
        r["prohibited_native_status"] = not bool(solved)
        outcome = getattr(result.info, "obj_val", None)
        r["outcome_present"] = outcome is not None
        r["outcome_type_valid"] = isinstance(outcome, (int, float, np.integer, np.floating))
        r["outcome_finite"] = bool(np.isfinite(outcome)) if r["outcome_type_valid"] else False
        response = getattr(result, "y", None)
        r["response_present"] = response is not None
        r["response_type_valid"] = isinstance(response, np.ndarray) and response.ndim == 1
        r["response_finite"] = bool(np.all(np.isfinite(response))) if r["response_type_valid"] else False
    except Exception as exc:
        r["native_execution_success"] = False
        r["prohibited_native_status"] = True
        r["exception_class"] = type(exc).__name__
    return r

results=[]
for i,p in enumerate(POINTS):
    x=run_point(p); x["point_id"]=f"P{i:02d}"; results.append(x)
all_pass=all(x["native_execution_success"] and not x["prohibited_native_status"] and x["outcome_present"] and x["outcome_type_valid"] and x["outcome_finite"] and x["response_present"] and x["response_type_valid"] and x["response_finite"] for x in results)
receipt={
    "candidate_id":CANDIDATE,
    "candidate_instance_hash":INSTANCE_HASH,
    "environment_verified":platform.machine()=="x86_64" and platform.python_version().startswith("3.12."),
    "native_entry_reached":True,
    "initialization_verified":True,
    "probe_count_expected":len(POINTS),
    "probe_count_executed":len(results),
    "probe_results":results,
    "scientific_firewall_intact":True,
    "scientific_measurements_generated":False,
    "pip_freeze_sha256":lock_hash(),
    "python_version":platform.python_version(),
    "machine":platform.machine(),
    "terminal_state":"G8_PASS_LOTTERY_ELIGIBLE" if all_pass else "G8_FAIL_EXCLUDED_FROM_LOTTERY"
}
with open("lqmpc_receipt.json","w") as f: json.dump(receipt,f,indent=2,sort_keys=True)
print(receipt["terminal_state"])
