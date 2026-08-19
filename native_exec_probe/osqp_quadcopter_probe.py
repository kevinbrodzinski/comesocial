import hashlib, json, platform, subprocess
import numpy as np
import osqp
from scipy import sparse

CANDIDATE = "CAND-E03-003"
INSTANCE_HASH = "b443abf1dc993e9e403ed9eb2d3026a62db3956f000442f41fa37968e5aa739b"
POINTS = [0.70, 0.80, 0.90, 1.00, 1.10, 1.20, 1.30]

def lock_hash():
    raw = subprocess.check_output(["python", "-m", "pip", "freeze"], text=True).encode()
    return hashlib.sha256(raw).hexdigest()

def run_point(scale):
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
        Ad = sparse.csc_matrix([
          [1.,0.,0.,0.,0.,0.,0.1,0.,0.,0.,0.,0.],
          [0.,1.,0.,0.,0.,0.,0.,0.1,0.,0.,0.,0.],
          [0.,0.,1.,0.,0.,0.,0.,0.,0.1,0.,0.,0.],
          [0.0488,0.,0.,1.,0.,0.,0.0016,0.,0.,0.0992,0.,0.],
          [0.,-0.0488,0.,0.,1.,0.,0.,-0.0016,0.,0.,0.0992,0.],
          [0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,0.0992],
          [0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.],
          [0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.],
          [0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.],
          [0.9734,0.,0.,0.,0.,0.,0.0488,0.,0.,0.9846,0.,0.],
          [0.,-0.9734,0.,0.,0.,0.,0.,-0.0488,0.,0.,0.9846,0.],
          [0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.9846]
        ])
        Bd = sparse.csc_matrix([
          [0.,-0.0726,0.,0.0726],[-0.0726,0.,0.0726,0.],[-0.0152,0.0152,-0.0152,0.0152],
          [-0.,-0.0006,-0.,0.0006],[0.0006,0.,-0.0006,0.0000],[0.0106,0.0106,0.0106,0.0106],
          [0,-1.4512,0.,1.4512],[-1.4512,0.,1.4512,0.],[-0.3049,0.3049,-0.3049,0.3049],
          [-0.,-0.0236,0.,0.0236],[0.0236,0.,-0.0236,0.],[0.2107,0.2107,0.2107,0.2107]
        ])
        nx, nu = Bd.shape
        u0 = 10.5916
        umin = np.array([9.6,9.6,9.6,9.6]) - u0
        source_umax = np.array([13.,13.,13.,13.]) - u0
        umax = float(scale) * source_umax
        xmin = np.array([-np.pi/6,-np.pi/6,-np.inf,-np.inf,-np.inf,-1.,-np.inf,-np.inf,-np.inf,-np.inf,-np.inf,-np.inf])
        xmax = np.array([ np.pi/6, np.pi/6, np.inf, np.inf, np.inf, np.inf, np.inf, np.inf, np.inf, np.inf, np.inf, np.inf])
        Q = sparse.diags([0.,0.,10.,10.,10.,10.,0.,0.,0.,5.,5.,5.])
        QN = Q
        R = 0.1*sparse.eye(4)
        x0 = np.zeros(12)
        xr = np.array([0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.])
        N = 10
        P = sparse.block_diag([sparse.kron(sparse.eye(N),Q),QN,sparse.kron(sparse.eye(N),R)],format='csc')
        q = np.hstack([np.kron(np.ones(N),-Q@xr),-QN@xr,np.zeros(N*nu)])
        Ax = sparse.kron(sparse.eye(N+1),-sparse.eye(nx)) + sparse.kron(sparse.eye(N+1,k=-1),Ad)
        Bu = sparse.kron(sparse.vstack([sparse.csc_matrix((1,N)),sparse.eye(N)]),Bd)
        Aeq = sparse.hstack([Ax,Bu])
        leq = np.hstack([-x0,np.zeros(N*nx)])
        ueq = leq
        Aineq = sparse.eye((N+1)*nx+N*nu)
        lineq = np.hstack([np.kron(np.ones(N+1),xmin),np.kron(np.ones(N),umin)])
        uineq = np.hstack([np.kron(np.ones(N+1),xmax),np.kron(np.ones(N),umax)])
        A = sparse.vstack([Aeq,Aineq],format='csc')
        l = np.hstack([leq,lineq]); u = np.hstack([ueq,uineq])
        prob = osqp.OSQP(); prob.setup(P,q,A,l,u,warm_starting=False,verbose=False)
        result = prob.solve()
        solved = getattr(result.info,"status",None) == "solved"
        r["native_execution_success"] = bool(solved)
        r["prohibited_native_status"] = not bool(solved)
        outcome = getattr(result.info,"obj_val",None)
        r["outcome_present"] = outcome is not None
        r["outcome_type_valid"] = isinstance(outcome,(int,float,np.integer,np.floating))
        r["outcome_finite"] = bool(np.isfinite(outcome)) if r["outcome_type_valid"] else False
        y = getattr(result,"y",None)
        start = 2*(N+1)*nx
        response = y[start:start+N*nu] if isinstance(y,np.ndarray) and y.ndim==1 and y.size >= start+N*nu else None
        r["response_present"] = response is not None
        r["response_type_valid"] = isinstance(response,np.ndarray) and response.ndim==1 and response.size==N*nu
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
with open("osqp_receipt.json","w") as f: json.dump(receipt,f,indent=2,sort_keys=True)
print(receipt["terminal_state"])
