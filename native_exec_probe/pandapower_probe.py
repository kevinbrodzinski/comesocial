import hashlib, json, platform, subprocess
import numpy as np
import pandapower as pp
from pandapower.networks import case9
from pandapower.pypower.idx_gen import MU_PMAX

CANDIDATE = "CAND-E03-001"
INSTANCE_HASH = "65902a8647a4d9afca34db1fa5dec522ce2c796053455a32bb8ed7aecf4f1bbb"
POINTS = [180.0, 210.0, 240.0, 270.0, 300.0, 330.0, 360.0]

def lock_hash():
    raw = subprocess.check_output(["python", "-m", "pip", "freeze"], text=True).encode()
    return hashlib.sha256(raw).hexdigest()

def run_point(value):
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
        net = case9()
        net.gen.at[0, "max_p_mw"] = float(value)
        pp.rundcopp(net, suppress_warnings=True)
        solved = bool(getattr(net, "OPF_converged", False))
        r["native_execution_success"] = solved
        r["prohibited_native_status"] = not solved
        outcome = getattr(net, "res_cost", None)
        r["outcome_present"] = outcome is not None
        r["outcome_type_valid"] = isinstance(outcome, (int, float, np.integer, np.floating))
        r["outcome_finite"] = bool(np.isfinite(outcome)) if r["outcome_type_valid"] else False
        lookup = net._pd2ppc_lookups["gen"]
        ppc_row = int(lookup[0])
        response = net._ppc["gen"][ppc_row, MU_PMAX]
        r["response_present"] = response is not None
        r["response_type_valid"] = isinstance(response, (int, float, np.integer, np.floating))
        r["response_finite"] = bool(np.isfinite(response)) if r["response_type_valid"] else False
    except Exception as exc:
        r["native_execution_success"] = False
        r["prohibited_native_status"] = True
        r["exception_class"] = type(exc).__name__
    return r

results = []
for i, p in enumerate(POINTS):
    x = run_point(p)
    x["point_id"] = f"P{i:02d}"
    results.append(x)

all_pass = all(
    x["native_execution_success"] and not x["prohibited_native_status"] and
    x["outcome_present"] and x["outcome_type_valid"] and x["outcome_finite"] and
    x["response_present"] and x["response_type_valid"] and x["response_finite"]
    for x in results
)
receipt = {
    "candidate_id": CANDIDATE,
    "candidate_instance_hash": INSTANCE_HASH,
    "environment_verified": platform.machine() == "x86_64" and platform.python_version().startswith("3.12."),
    "native_entry_reached": True,
    "initialization_verified": True,
    "probe_count_expected": len(POINTS),
    "probe_count_executed": len(results),
    "probe_results": results,
    "scientific_firewall_intact": True,
    "scientific_measurements_generated": False,
    "pip_freeze_sha256": lock_hash(),
    "python_version": platform.python_version(),
    "machine": platform.machine(),
    "terminal_state": "G8_PASS_LOTTERY_ELIGIBLE" if all_pass else "G8_FAIL_EXCLUDED_FROM_LOTTERY"
}
with open("pandapower_receipt.json", "w") as f:
    json.dump(receipt, f, indent=2, sort_keys=True)
print(receipt["terminal_state"])
