import json, math, platform, subprocess, hashlib
import numpy as np
from scipy import sparse
import lqmpc

POINTS=[5.0,7.5,10.0,12.5,15.0]
CONVENTION=[7.5,12.5]
N=25; M=20; n=4; m=1
CONTROL_UPPER_ROWS=list(range(N*n + N*n, N*n + N*n + M*m))  # 200..219
ABS_TOL=1e-7
REL_TOL=5e-3

A=np.array([[1,-6.66e-13,-2.03e-9,-4.14e-6],[9.83e-4,1,-4.09e-8,-8.32e-5],[4.83e-7,9.83e-4,1,-5.34e-4],[1.58e-10,4.83e-7,9.83e-4,.9994]])
B=np.array([[9.83e-4,4.83e-7,1.58e-10,3.89e-14]]).T
C=np.array([[-.0096,.0135,.005,-.0095]])
t_step=0.001; t_sim=0.25
Q=C.T@C; R=sparse.eye(1)*1e-6
x0=np.zeros(4); u0=np.zeros(1)

def build_ref():
    L=120; ref_len=(L+N)*int(t_sim/t_step); inv=np.linalg.inv; I=np.eye(4)
    zr=0.1*np.sin(np.linspace(0,2*np.pi,ref_len)*8)+0.2
    yr=np.array([(np.log(zr)+5.468)/61.4])
    ur=inv(C@inv(I-A)@B)@yr
    return inv(I-A)@B@ur
XR=build_ref(); XR_STEP=XR[:,:N*int(t_sim/t_step)]

def solve(p):
    mpc=lqmpc.LQMPC(t_step,A,B,C)
    mpc.set_control(Q=Q,R=R,N=N,M=M)
    mpc.set_constraints(umin=np.array([0.0]),umax=np.array([p]))
    res=mpc.step(t_sim,x0,u0,XR_STEP,out=False)
    if getattr(res.info,'status',None)!='solved':
        raise RuntimeError(f'OSQP status {getattr(res.info,"status",None)} at p={p}')
    y=np.asarray(res.y,dtype=float)
    if y.ndim!=1 or len(y)<=CONTROL_UPPER_ROWS[-1]:
        raise RuntimeError('unexpected OSQP dual vector shape')
    obj=float(res.info.obj_val)
    g=-float(np.maximum(y[CONTROL_UPPER_ROWS],0.0).sum())
    return obj,g,y

vals={}
for p in POINTS:
    obj,g,y=solve(p)
    vals[p]={'J_star':obj,'dual_subgradient':g,'dual_vector_length':int(len(y))}

checks=[]
for p in CONVENTION:
    i=POINTS.index(p); pl,pr=POINTS[i-1],POINTS[i+1]
    left=(vals[p]['J_star']-vals[pl]['J_star'])/(p-pl)
    right=(vals[pr]['J_star']-vals[p]['J_star'])/(pr-p)
    g=vals[p]['dual_subgradient']
    lo=min(left,right); hi=max(left,right)
    tol=ABS_TOL+REL_TOL*max(1.0,abs(lo),abs(hi),abs(g))
    bracket=(g>=lo-tol) and (g<=hi+tol)
    checks.append({'p':p,'left_secant':left,'right_secant':right,'dual_subgradient':g,'tolerance':tol,'bracket_pass':bracket})

# Additional global consistency: objective must be nonincreasing under larger upper resource.
mono=all(vals[POINTS[i+1]]['J_star'] <= vals[POINTS[i]]['J_star'] + (ABS_TOL+REL_TOL*max(1.0,abs(vals[POINTS[i]]['J_star']))) for i in range(len(POINTS)-1))
all_pass=all(c['bracket_pass'] for c in checks) and mono

receipt={
 'suite_id':'RG-EXT-03C',
 'candidate_id':'CAND-E03-002',
 'source_commit':'0895de48013fc9a676053a6a46fc0b0fd34f8987',
 'osqp_python_commit':'dcc6384845e27b275fc41b2106dd2c379d5d5db4',
 'probe_bank':POINTS,
 'convention_points':CONVENTION,
 'row_mapping':{'equality_rows':[0,99],'state_inequality_rows':[100,199],'control_inequality_rows':[200,219],'upper_resource_multiplier_rows':CONTROL_UPPER_ROWS},
 'sign_convention':'OSQP y>0 attaches upper bound; for common upper resource p, dJ*/dp = -sum(max(y_i,0)) over repeated control-upper rows',
 'reconciliation_rule':'At each frozen convention point, native dual subgradient must lie within the left/right secant interval from adjacent frozen-bank J* values, with predeclared ABS_TOL=1e-7 and REL_TOL=0.005.',
 'absolute_tolerance':ABS_TOL,
 'relative_tolerance':REL_TOL,
 'values':{str(k):v for k,v in vals.items()},
 'checks':checks,
 'objective_nonincreasing_with_resource':mono,
 'terminal_state':'SELECTED_LQMPC_NATIVE_SEMANTICS_RECONCILED_STOP_BEFORE_CONDITION_1_AUTHORIZATION' if all_pass else 'SELECTED_LQMPC_NATIVE_SEMANTICS_RECONCILIATION_REQUIRED_STOP_BEFORE_CONDITION_1',
 'condition_1_authorized':False,
 'alpha_estimated':False,'beta_estimated':False,'theta_estimated':False,'predicted_class_computed':False,'p_contact_predicted':False,'mass_response_measured':False,'boundary_H_observed':False,'boundary_K_observed':False,'primary_boundary_sweep_executed':False,
 'python_version':platform.python_version(),'machine':platform.machine(),
 'pip_freeze_sha256':hashlib.sha256(subprocess.check_output(['python','-m','pip','freeze'])).hexdigest()
}
with open('RG_EXT_03C_RECONCILIATION_RECEIPT.json','w') as f: json.dump(receipt,f,indent=2,sort_keys=True)
print(receipt['terminal_state'])
print(json.dumps(checks,indent=2))
raise SystemExit(0 if all_pass else 1)
