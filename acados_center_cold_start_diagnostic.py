#!/usr/bin/env python3
from __future__ import annotations
import importlib.util, json, os, sys, traceback
from pathlib import Path
import numpy as np

ACADOS_COMMIT='21376cb1af6b7dd45f675367272d3ba8100b26c0'
BLASFEO_SHA='d6251233923c9b475fe894fb729fb63ab693e301'
HPIPM_SHA='e3a56c1caddd7f12d125d84f337b9a9e5c186271'
TERA_SHA='a480a64b0a2cc15d4b1e6146e986388709ac0716'
EXAMPLE='examples/acados_python/pendulum_on_cart/ocp/example_optimal_value_derivative.py'
N=25; DT=0.05; UMAX=60.0
X0=np.array([0.0,np.pi,0.0,0.0])

def sh(repo,*args):
    import subprocess
    return subprocess.check_output(['git','-C',str(repo),*args],text=True).strip()

def load_example(root):
    example=root/EXAMPLE
    common=root/'examples/acados_python/pendulum_on_cart/common'
    sys.path.insert(0,str(common))
    cwd=os.getcwd()
    try:
        os.chdir(example.parent)
        spec=importlib.util.spec_from_file_location('center_diag_example',example)
        mod=importlib.util.module_from_spec(spec); assert spec and spec.loader
        spec.loader.exec_module(mod); return mod
    finally:
        os.chdir(cwd)

def main():
    root=Path(os.environ['ACADOS_SOURCE_DIR']).resolve()
    out=Path(os.environ.get('DIAG_OUT','center_diag_out')).resolve(); out.mkdir(parents=True,exist_ok=True)
    identity={
      'acados':sh(root,'rev-parse','HEAD'),
      'blasfeo':sh(root/'external/blasfeo','rev-parse','HEAD'),
      'hpipm':sh(root/'external/hpipm','rev-parse','HEAD'),
      'tera_renderer':sh(root/'interfaces/acados_template/tera_renderer','rev-parse','HEAD')}
    assert identity=={'acados':ACADOS_COMMIT,'blasfeo':BLASFEO_SHA,'hpipm':HPIPM_SHA,'tera_renderer':TERA_SHA}
    mod=load_example(root)
    solver=mod.setup_solver(N=N,dt=DT,u_max=UMAX)
    result={'diagnostic':'SOURCE_DEFAULT_CENTER_COLD_START_ONLY','source_identity':identity,'u_max_N':UMAX,'x0':[0.0,'pi',0.0,0.0],'warm_start_applied':False}
    try:
        status=int(solver.solve_for_x0(X0))
        result['solve_returned']=True; result['status']=status; result['J_star']=float(solver.get_cost())
        forces=[]; lambdas=[]
        for k in range(N):
            forces.append(float(np.asarray(solver.get(k,'u')).reshape(-1)[0]))
            lambdas.append([float(v) for v in np.asarray(solver.get(k,'lam')).reshape(-1)])
        result['force_trajectory']=forces; result['lambda_vectors']=lambdas
    except Exception as e:
        result['solve_returned']=False; result['exception_type']=type(e).__name__; result['exception']=str(e); result['traceback']=traceback.format_exc()
    (out/'CENTER_COLD_START_DIAGNOSTIC.json').write_text(json.dumps(result,indent=2,sort_keys=True)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k not in {'force_trajectory','lambda_vectors','traceback'}},indent=2))
    return 0

if __name__=='__main__': raise SystemExit(main())
