#!/usr/bin/env python3
from __future__ import annotations
import importlib.util, json, math, os, sys, traceback
from pathlib import Path
import numpy as np

ACADOS_COMMIT='21376cb1af6b7dd45f675367272d3ba8100b26c0'
BLASFEO_SHA='d6251233923c9b475fe894fb729fb63ab693e301'
HPIPM_SHA='e3a56c1caddd7f12d125d84f337b9a9e5c186271'
TERA_SHA='a480a64b0a2cc15d4b1e6146e986388709ac0716'
EXAMPLE='examples/acados_python/pendulum_on_cart/ocp/example_optimal_value_derivative.py'
N=25; DT=0.05; UMAX=60.0
STEPS=100
OFFICIAL_SEED_TERMINAL_ANGLE=0.2*math.pi

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
        spec=importlib.util.spec_from_file_location('continuation_diag_example',example)
        mod=importlib.util.module_from_spec(spec); assert spec and spec.loader
        spec.loader.exec_module(mod); return mod
    finally:
        os.chdir(cwd)

def main():
    root=Path(os.environ['ACADOS_SOURCE_DIR']).resolve()
    out=Path(os.environ.get('DIAG_OUT','continuation_diag_out')).resolve(); out.mkdir(parents=True,exist_ok=True)
    identity={'acados':sh(root,'rev-parse','HEAD'),'blasfeo':sh(root/'external/blasfeo','rev-parse','HEAD'),'hpipm':sh(root/'external/hpipm','rev-parse','HEAD'),'tera_renderer':sh(root/'interfaces/acados_template/tera_renderer','rev-parse','HEAD')}
    assert identity=={'acados':ACADOS_COMMIT,'blasfeo':BLASFEO_SHA,'hpipm':HPIPM_SHA,'tera_renderer':TERA_SHA}
    mod=load_example(root)
    solver=mod.setup_solver(N=N,dt=DT,u_max=UMAX)
    # Mirror the upstream example's explicit pre-solve state-trajectory initialization,
    # prospectively fixed before this diagnostic: angle ramp 0 -> 0.2*pi over N+1 nodes.
    seed=np.zeros(4)
    for n,tau in enumerate(np.linspace(0.0,1.0,N+1)):
        seed[1]=tau*OFFICIAL_SEED_TERMINAL_ANGLE
        solver.set(n,'x',seed)
    schedule=np.linspace(0.0,math.pi,STEPS+1)
    observations=[]
    terminal_status='REACHED_PI'
    failure=None
    for j,theta in enumerate(schedule):
        x0=np.array([0.0,float(theta),0.0,0.0])
        try:
            status=int(solver.solve_for_x0(x0))
            observations.append({'index':j,'theta_rad':float(theta),'theta_over_pi':float(theta/math.pi),'status':status,'J_star':float(solver.get_cost())})
        except Exception as e:
            terminal_status='CONTINUATION_FAILED_BEFORE_PI'
            failure={'index':j,'theta_rad':float(theta),'theta_over_pi':float(theta/math.pi),'exception_type':type(e).__name__,'exception':str(e),'traceback':traceback.format_exc()}
            break
    result={
      'diagnostic':'SOURCE_NATIVE_CONTINUATION_TO_PI',
      'source_identity':identity,
      'u_max_N':UMAX,
      'solver_reused_across_schedule':True,
      'external_or_independent_trajectory_used':False,
      'initial_seed_rule':'upstream-example-style state guess: theta_n=(n/N)*0.2*pi, other states zero',
      'schedule_rule':'theta_j = j*pi/100 for j=0..100',
      'schedule_points':STEPS+1,
      'terminal_status':terminal_status,
      'observations':observations,
      'failure':failure,
    }
    (out/'SOURCE_NATIVE_CONTINUATION_DIAGNOSTIC.json').write_text(json.dumps(result,indent=2,sort_keys=True)+'\n')
    print(json.dumps({'terminal_status':terminal_status,'successful_points':len(observations),'last_success_theta_over_pi':observations[-1]['theta_over_pi'] if observations else None,'last_success_J_star':observations[-1]['J_star'] if observations else None,'failure':None if failure is None else {k:v for k,v in failure.items() if k!='traceback'}},indent=2))
    return 0

if __name__=='__main__': raise SystemExit(main())
