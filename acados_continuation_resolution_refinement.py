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
GRIDS=[100,200,400]
SEED_TERMINAL_ANGLE=0.2*math.pi

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
        spec=importlib.util.spec_from_file_location('resolution_diag_example',example)
        mod=importlib.util.module_from_spec(spec); assert spec and spec.loader
        spec.loader.exec_module(mod); return mod
    finally:
        os.chdir(cwd)

def run_grid(mod, grid_steps):
    solver=mod.setup_solver(N=N,dt=DT,u_max=UMAX)
    seed=np.zeros(4)
    for n,tau in enumerate(np.linspace(0.0,1.0,N+1)):
        seed[1]=tau*SEED_TERMINAL_ANGLE
        solver.set(n,'x',seed)
    observations=[]; failure=None
    for j,theta in enumerate(np.linspace(0.0,math.pi,grid_steps+1)):
        x0=np.array([0.0,float(theta),0.0,0.0])
        try:
            solver.solve_for_x0(x0)
            observations.append({'index':j,'theta_over_pi':float(theta/math.pi),'theta_rad':float(theta),'status':int(solver.status),'J_star':float(solver.get_cost())})
        except Exception as e:
            failure={'index':j,'theta_over_pi':float(theta/math.pi),'theta_rad':float(theta),'exception_type':type(e).__name__,'exception':str(e),'traceback':traceback.format_exc()}
            break
    return {
      'grid_steps':grid_steps,
      'delta_theta_over_pi':1.0/grid_steps,
      'successful_points':len(observations),
      'reached_pi':failure is None and len(observations)==grid_steps+1,
      'last_success':observations[-1] if observations else None,
      'failure':failure,
      'observations':observations,
    }

def main():
    root=Path(os.environ['ACADOS_SOURCE_DIR']).resolve()
    out=Path(os.environ.get('DIAG_OUT','resolution_diag_out')).resolve(); out.mkdir(parents=True,exist_ok=True)
    identity={'acados':sh(root,'rev-parse','HEAD'),'blasfeo':sh(root/'external/blasfeo','rev-parse','HEAD'),'hpipm':sh(root/'external/hpipm','rev-parse','HEAD'),'tera_renderer':sh(root/'interfaces/acados_template/tera_renderer','rev-parse','HEAD')}
    assert identity=={'acados':ACADOS_COMMIT,'blasfeo':BLASFEO_SHA,'hpipm':HPIPM_SHA,'tera_renderer':TERA_SHA}
    mod=load_example(root)
    runs=[run_grid(mod,g) for g in GRIDS]
    result={
      'diagnostic':'SOURCE_NATIVE_CONTINUATION_RESOLUTION_REFINEMENT',
      'source_identity':identity,
      'u_max_N':UMAX,
      'fixed_grids_before_execution':GRIDS,
      'delta_theta_over_pi':[1.0/g for g in GRIDS],
      'initial_seed_rule':'upstream-example-style theta_n=(n/N)*0.2*pi, other states zero',
      'each_grid_restarted_independently':True,
      'external_or_independent_trajectory_used':False,
      'adaptive_refinement_used':False,
      'additional_grids_authorized':False,
      'runs':runs,
    }
    (out/'CONTINUATION_RESOLUTION_REFINEMENT.json').write_text(json.dumps(result,indent=2,sort_keys=True)+'\n')
    compact=[]
    for r in runs:
        compact.append({'grid_steps':r['grid_steps'],'delta_theta_over_pi':r['delta_theta_over_pi'],'reached_pi':r['reached_pi'],'last_success_theta_over_pi':None if r['last_success'] is None else r['last_success']['theta_over_pi'],'last_success_J_star':None if r['last_success'] is None else r['last_success']['J_star'],'failure_theta_over_pi':None if r['failure'] is None else r['failure']['theta_over_pi'],'failure':None if r['failure'] is None else r['failure']['exception']})
    print(json.dumps(compact,indent=2))

if __name__=='__main__': main()
