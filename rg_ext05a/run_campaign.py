from __future__ import annotations

import hashlib
import json
import math
import platform
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy import sparse

ROOT = Path(__file__).resolve().parent
CFG = json.loads((ROOT / "frozen_config.json").read_text())
OUT = ROOT / "out"
OUT.mkdir(exist_ok=True)


def canon(x):
    return json.dumps(x, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode()


def sha(x):
    if isinstance(x, bytes):
        b = x
    elif isinstance(x, str):
        b = x.encode()
    else:
        b = canon(x)
    return hashlib.sha256(b).hexdigest()


def pip_hash():
    raw = subprocess.check_output([sys.executable, "-m", "pip", "freeze"], text=True).encode()
    return hashlib.sha256(raw).hexdigest()


def matrix_hash(P, q, w):
    P = sparse.csc_matrix(P)
    h = hashlib.sha256()
    for part in (P.data.tobytes(), P.indices.tobytes(), P.indptr.tobytes(), q.tobytes(), w.tobytes()):
        h.update(part)
    return h.hexdigest()


def build_problem(c):
    wcfg = c["workload"]
    n = int(wcfg["n"])
    diag = np.linspace(float(wcfg["diagonal_start"]), float(wcfg["diagonal_stop"]), n)
    P = np.diag(diag)
    fam = wcfg["family"]
    if fam == "deterministic_diagonal_rank1_qp":
        v = np.linspace(-1.0, 1.0, n)
        v /= np.linalg.norm(v)
        P += float(wcfg["rank1_strength"]) * np.outer(v, v)
    elif fam == "deterministic_diagonal_chain_qp":
        s = float(wcfg["chain_strength"])
        D = np.zeros((n - 1, n))
        for i in range(n - 1):
            D[i, i] = -1.0
            D[i, i + 1] = 1.0
        P += s * (D.T @ D)
    elif fam == "deterministic_block_coupled_qp":
        s = float(wcfg["block_rank1_strength"])
        bs = int(wcfg["block_size"])
        for j in range(0, n, bs):
            k = min(bs, n - j)
            v = np.ones(k) / math.sqrt(k)
            P[j:j+k, j:j+k] += s * np.outer(v, v)
    else:
        raise ValueError(f"unknown workload {fam}")
    w = np.linspace(float(wcfg["weight_start"]), float(wcfg["weight_stop"]), n)
    p_release = float(wcfg["p_release"])
    x_release = p_release * w
    q = -(P @ x_release)
    return sparse.csc_matrix(P), np.asarray(q, float), np.asarray(w, float)


def solve_clarabel(P, q, w, p):
    import clarabel
    n = len(q)
    A = sparse.vstack([sparse.eye(n, format="csc"), -sparse.eye(n, format="csc")], format="csc")
    b = np.r_[p * w, np.zeros(n)]
    settings = clarabel.DefaultSettings()
    settings.verbose = False
    for name, val in (("tol_gap_abs", 1e-10), ("tol_gap_rel", 1e-10), ("tol_feas", 1e-10)):
        if hasattr(settings, name):
            setattr(settings, name, val)
    if hasattr(settings, "presolve_enable"):
        settings.presolve_enable = False
    solver = clarabel.DefaultSolver(P, q, A, b, [clarabel.NonnegativeConeT(2*n)], settings)
    sol = solver.solve()
    status = str(sol.status)
    ok = status in ("Solved", "AlmostSolved")
    x = np.asarray(sol.x, float)
    z = np.asarray(sol.z, float)
    obj = float(sol.obj_val)
    deriv = -float(np.dot(z[:n], w))
    return ok, status, x, obj, deriv


def solve_scs(P, q, w, p):
    import scs
    n = len(q)
    A = sparse.vstack([sparse.eye(n, format="csc"), -sparse.eye(n, format="csc")], format="csc")
    b = np.r_[p * w, np.zeros(n)]
    data = {"P": P, "A": A, "b": b, "c": q}
    sol = scs.solve(data, {"l": 2*n}, verbose=False, eps_abs=1e-9, eps_rel=1e-9,
                    max_iters=100000, adaptive_scale=False, acceleration_lookback=0,
                    normalize=True, warm_start=False)
    status = str(sol["info"]["status"])
    ok = status.lower().startswith("solved")
    x = np.asarray(sol["x"], float)
    y = np.asarray(sol["y"], float)
    obj = float(sol["info"]["pobj"])
    deriv = -float(np.dot(y[:n], w))
    return ok, status, x, obj, deriv


def solve_highs(P, q, w, p):
    import highspy
    n = len(q)
    inf = highspy.kHighsInf
    model = highspy.HighsModel()
    lp = model.lp_
    lp.num_col_ = n
    lp.num_row_ = n
    lp.sense_ = highspy.ObjSense.kMinimize
    lp.col_cost_ = np.asarray(q, dtype=np.double)
    lp.col_lower_ = np.zeros(n, dtype=np.double)
    lp.col_upper_ = np.full(n, inf, dtype=np.double)
    lp.row_lower_ = np.full(n, -inf, dtype=np.double)
    lp.row_upper_ = np.asarray(p*w, dtype=np.double)
    lp.a_matrix_.format_ = highspy.MatrixFormat.kColwise
    lp.a_matrix_.start_ = np.arange(n+1, dtype=np.int32)
    lp.a_matrix_.index_ = np.arange(n, dtype=np.int32)
    lp.a_matrix_.value_ = np.ones(n, dtype=np.double)
    tri = sparse.tril(P, format="csc")
    model.hessian_.dim_ = n
    model.hessian_.format_ = highspy.HessianFormat.kTriangular
    model.hessian_.start_ = np.asarray(tri.indptr, dtype=np.int32)
    model.hessian_.index_ = np.asarray(tri.indices, dtype=np.int32)
    model.hessian_.value_ = np.asarray(tri.data, dtype=np.double)
    h = highspy.Highs()
    h.setOptionValue("output_flag", False)
    h.setOptionValue("presolve", "off")
    for name, val in (("primal_feasibility_tolerance", 1e-9), ("dual_feasibility_tolerance", 1e-9), ("ipm_optimality_tolerance", 1e-10)):
        try:
            h.setOptionValue(name, val)
        except Exception:
            pass
    h.passModel(model)
    h.run()
    status_enum = h.getModelStatus()
    status = h.modelStatusToString(status_enum)
    ok = status_enum == highspy.HighsModelStatus.kOptimal
    sol = h.getSolution()
    info = h.getInfo()
    x = np.asarray(sol.col_value, float)
    row_dual = np.asarray(sol.row_dual, float)
    obj = float(info.objective_function_value)
    deriv = float(np.dot(row_dual[:n], w))
    return ok, status, x, obj, deriv


def solve(c, P, q, w, p):
    cid = c["candidate_id"]
    if cid == "CAND-E05-001":
        return solve_clarabel(P, q, w, p)
    if cid == "CAND-E05-002":
        return solve_scs(P, q, w, p)
    if cid == "CAND-E05-003":
        return solve_highs(P, q, w, p)
    raise KeyError(cid)


def obj_direct(P, q, x):
    return 0.5 * float(x @ (P @ x)) + float(q @ x)


def allowance(spec, *vals):
    scale = max([1.0] + [abs(float(v)) for v in vals])
    return max(float(spec["absolute_floor"]), float(spec["relative_factor"]) * scale)


def source_gates(c, P, q, w):
    eig_min = float(np.linalg.eigvalsh(P.toarray()).min())
    bank = [float(x) for x in c["resource_bank"]]
    rel = float(c["workload"]["p_release"])
    finite = np.isfinite(P.data).all() and np.isfinite(q).all() and np.isfinite(w).all()
    positive_weights = bool(np.all(w > 0))
    distinct = len(set(bank)) == len(bank)
    below_release = max(bank) < rel
    g = {
        "G1": bool(finite and eig_min > 0),
        "G2": bool(positive_weights and all(p > 0 for p in bank)),
        "G3": bool(eig_min > 0 and distinct),
        "G4": bool(below_release),
        "G5": bool(c["alpha_measurement_map"]["response"].startswith("U=-dJ_star/dp")),
        "G6": bool(len(bank) >= 9 and distinct),
        "G7": bool(c["alpha_measurement_map"]["scientific_epoch"].startswith("fresh calls only after lottery")),
    }
    return g, {"min_eigenvalue": eig_min, "bank_count": len(bank), "all_bank_below_release": below_release}


def g8(c, P, q, w):
    rows = []
    ok_all = True
    for p in c["resource_bank"]:
        try:
            ok, status, x, obj, deriv = solve(c, P, q, w, float(p))
            direct = obj_direct(P, q, x)
            finite = bool(np.isfinite(obj) and np.isfinite(deriv) and np.isfinite(x).all())
            obj_ok = abs(obj-direct) <= allowance(CFG["g10"]["objective_allowance"], obj, direct)
            row_ok = bool(ok and finite and obj_ok)
            rows.append({"p": p, "ok": row_ok, "status": status, "objective_finite": bool(np.isfinite(obj)),
                         "response_finite": bool(np.isfinite(deriv)), "objective_crosscheck": obj_ok})
            ok_all &= row_ok
        except Exception as e:
            rows.append({"p": p, "ok": False, "exception": type(e).__name__, "message": str(e)[:240]})
            ok_all = False
    return bool(ok_all), rows


def g9(c, P):
    bank = np.asarray(c["resource_bank"], float)
    rel = float(c["workload"]["p_release"])
    rho = (rel-bank)/rel
    pos = rho[(rho > 0) & np.isfinite(rho)]
    alpha_pass = len(np.unique(np.round(pos, 14))) >= int(CFG["g9"]["alpha_min_distinct_positive_radii"])
    Pd = P.toarray()
    n = Pd.shape[0]
    qs = []
    for i in range(n-2):
        for j in range(i+1, n-1):
            for k in range(j+1, n):
                tri = (i,j,k)
                for pos_idx in tri:
                    dx = np.zeros(n)
                    dx[list(tri)] = -0.5
                    dx[pos_idx] = 1.0
                    qs.append(0.5 * float(dx @ (Pd @ dx)))
    qv = np.asarray(qs, float)
    qmin, qmax = float(qv.min()), float(qv.max())
    nondeg = bool(np.isfinite(qv).all() and qmax > qmin)
    gv = (qv-qmin)/(qmax-qmin) if nondeg else np.full_like(qv, np.nan)
    rmin, rmax = float(CFG["g9"]["beta_r_min"]), float(CFG["g9"]["beta_r_max"])
    nested = {str(f): int(np.sum((gv >= rmin) & (gv <= rmax*float(f)))) for f in CFG["g9"]["nested_fractions"]}
    inwin = nested["1.0"]
    vals = gv[(gv >= rmin) & (gv <= rmax)]
    distinct = len(np.unique(np.round(vals, 14)))
    beta_pass = bool(nondeg and inwin >= int(CFG["g9"]["beta_min_in_window"]) and
                     distinct >= int(CFG["g9"]["beta_min_distinct_in_window"]) and
                     all(v >= int(CFG["g9"]["beta_min_each_nested_window"]) for v in nested.values()))
    return bool(alpha_pass and beta_pass), {
        "alpha_positive_distinct": int(len(np.unique(np.round(pos, 14)))),
        "beta_atlas_count": int(len(qv)), "beta_in_window": int(inwin), "beta_nested": nested,
        "beta_distinct_in_window": int(distinct), "geometry_nondegenerate": nondeg,
        "alpha_support_pass": bool(alpha_pass), "beta_support_pass": bool(beta_pass)
    }


def g10(c, P, q, w):
    h = float(CFG["g10"]["micro_h"])
    passes = []
    all_ok = True
    raw = []
    for pass_name in ("A", "B"):
        centers = []
        for p0 in c["resource_bank"]:
            p = float(p0)
            try:
                om, sm, xm, jm, dm = solve(c, P, q, w, p-h)
                oc, sc, xc, jc, dc = solve(c, P, q, w, p)
                op, sp, xp, jp, dp = solve(c, P, q, w, p+h)
                direct = obj_direct(P, q, xc)
                obj_ok = abs(jc-direct) <= allowance(CFG["g10"]["objective_allowance"], jc, direct)
                fd = (jp-jm)/(2*h)
                tol = allowance(CFG["g10"]["response_fd_allowance"], fd, dc)
                resp_ok = abs(fd-dc) <= tol
                ok = bool(om and oc and op and obj_ok and resp_ok and np.isfinite([jm,jc,jp,dc,fd]).all())
                centers.append({"p": p, "ok": ok, "status": [sm,sc,sp], "objective_crosscheck": obj_ok,
                                "response_fd_reconciled": resp_ok, "response_fd_abs_error": abs(fd-dc), "response_fd_allowance": tol})
                raw.append({"pass": pass_name, "p": p, "j_minus": jm, "j_center": jc, "j_plus": jp,
                            "dual_derivative": dc, "fd_derivative": fd, "objective_direct": direct})
                all_ok &= ok
            except Exception as e:
                centers.append({"p": p, "ok": False, "exception": type(e).__name__, "message": str(e)[:240]})
                all_ok = False
        passes.append({"pass": pass_name, "centers": centers})
    # Determinism is checked only after both predeclared passes exist.
    bykey = {(r["pass"], r["p"]): r for r in raw}
    det_rows = []
    for p0 in c["resource_bank"]:
        p = float(p0)
        a, b = bykey.get(("A",p)), bykey.get(("B",p))
        if not a or not b:
            det_rows.append({"p": p, "pass": False})
            all_ok = False
            continue
        tol = allowance(CFG["g10"]["determinism_allowance"], a["j_center"], b["j_center"], a["dual_derivative"], b["dual_derivative"])
        err = max(abs(a["j_center"]-b["j_center"]), abs(a["dual_derivative"]-b["dual_derivative"]))
        good = err <= tol
        det_rows.append({"p": p, "pass": bool(good), "max_abs_error": err, "allowance": tol})
        all_ok &= good
    return bool(all_ok), {"native_passes": passes, "determinism": det_rows}, raw


def candidate_hashes(c, P, q, w):
    ident = {"candidate_id": c["candidate_id"], "system": c["system"], "source_identity": c["source_identity"],
             "workload": c["workload"], "resource_bank": c["resource_bank"]}
    contract = {"alpha_measurement_map": c["alpha_measurement_map"], "beta_source_only_geometry": c["beta_source_only_geometry"]}
    return {
        "candidate_identity_sha256": sha(ident),
        "workload_sha256": matrix_hash(P, q, w),
        "measurement_contract_sha256": sha(contract),
        "g10_profile_sha256": sha(c["g10_native_reconciliation_profile"]),
    }


def main():
    config_sha = sha(CFG)
    env = {"python": platform.python_version(), "machine": platform.machine(), "platform": platform.platform(),
           "pip_freeze_sha256": pip_hash()}
    env_sha = sha(env)
    public_rows = []
    raw_records = {}
    survivors = []

    for c in sorted(CFG["candidates"], key=lambda x: x["candidate_id"]):
        P, q, w = build_problem(c)
        hashes = candidate_hashes(c, P, q, w)
        gates, static_evidence = source_gates(c, P, q, w)
        g8_pass = g9_pass = g10_pass = False
        g8_evidence = []
        g9_evidence = {}
        g10_evidence = {}
        raw = []
        if all(gates.values()):
            g8_pass, g8_evidence = g8(c, P, q, w)
        gates["G8"] = bool(g8_pass)
        if g8_pass:
            g9_pass, g9_evidence = g9(c, P)
        gates["G9"] = bool(g9_pass)
        if g9_pass:
            g10_pass, g10_evidence, raw = g10(c, P, q, w)
        gates["G10"] = bool(g10_pass)
        allpass = all(gates.get(f"G{i}", False) for i in range(1,11))
        terminal = "G1_G10_PASS_LOTTERY_ELIGIBLE" if allpass else f"EXCLUDED_AT_{next((f'G{i}' for i in range(1,11) if not gates.get(f'G{i}',False)), 'UNKNOWN')}"
        raw_obj = {"candidate_id": c["candidate_id"], "static_evidence": static_evidence, "g8": g8_evidence,
                   "g9": g9_evidence, "g10": g10_evidence, "raw_g10_values": raw}
        raw_sha = sha(raw_obj)
        raw_records[c["candidate_id"]] = raw_obj
        row = {"candidate_id": c["candidate_id"], **hashes, "g1_g10_gate_booleans": gates,
               "terminal_state": terminal, "raw_evidence_sha256": raw_sha, "environment_sha256": env_sha}
        public_rows.append(row)
        if allpass:
            survivors.append(row)

    universe_payload = {
        "suite_id": "RG-EXT-05A",
        "canonical_order": [r["candidate_id"] for r in survivors],
        "candidate_count": len(survivors),
        "candidates": survivors,
        "selector_id": CFG["selector"]["id"]
    }
    universe_sha = sha(universe_payload) if survivors else None
    terminal = ("ALL_G1_G10_PASS_LOTTERY_UNIVERSE_AND_SELECTOR_FROZEN_STOP_BEFORE_NIST"
                if survivors else "NO_G1_G10_PASS_CANDIDATES_STOP_BEFORE_NIST")
    summary = {
        "suite_id": "RG-EXT-05A", "config_sha256": config_sha, "environment": env,
        "candidate_results": public_rows, "survivor_count": len(survivors),
        "survivor_ids": [r["candidate_id"] for r in survivors],
        "lottery_universe_sha256": universe_sha,
        "selector": CFG["selector"],
        "nist_queried": False, "selector_applied": False, "scientific_alpha_computed": False,
        "scientific_beta_computed": False, "theta_computed": False, "class_locked": False,
        "mass_response_measured": False, "boundary_sweep_executed": False,
        "terminal_state": terminal
    }
    (OUT / "RG_EXT_05A_TERMINAL_SUMMARY.json").write_text(json.dumps(summary, indent=2, sort_keys=True))
    (OUT / "RG_EXT_05A_LOTTERY_UNIVERSE.json").write_text(json.dumps(universe_payload, indent=2, sort_keys=True))
    (OUT / "RG_EXT_05A_SACRIFICIAL_RAW_EVIDENCE.json").write_text(json.dumps(raw_records, indent=2, sort_keys=True))
    manifest = {p.name: sha(p.read_bytes()) for p in sorted(OUT.glob("*.json"))}
    (OUT / "SHA256_MANIFEST.json").write_text(json.dumps(manifest, indent=2, sort_keys=True))
    print(json.dumps({"terminal_state": terminal, "survivors": summary["survivor_ids"],
                      "lottery_universe_sha256": universe_sha,
                      "candidate_gates": {r["candidate_id"]: r["g1_g10_gate_booleans"] for r in public_rows}}, sort_keys=True))


if __name__ == "__main__":
    main()
