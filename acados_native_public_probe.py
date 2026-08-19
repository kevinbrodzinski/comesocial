#!/usr/bin/env python3
from __future__ import annotations
import hashlib, importlib.util, json, math, os, platform, subprocess, sys
from pathlib import Path
import numpy as np

ACADOS_COMMIT = '21376cb1af6b7dd45f675367272d3ba8100b26c0'
BLASFEO_SHA = 'd6251233923c9b475fe894fb729fb63ab693e301'
HPIPM_SHA = 'e3a56c1caddd7f12d125d84f337b9a9e5c186271'
TERA_SHA = 'a480a64b0a2cc15d4b1e6146e986388709ac0716'
EXAMPLE = 'examples/acados_python/pendulum_on_cart/ocp/example_optimal_value_derivative.py'
MODEL = 'examples/acados_python/pendulum_on_cart/common/pendulum_model.py'
N = 25
DT = 0.05
U0 = 60.0
EPS = 0.01
X0 = np.array([0.0, np.pi, 0.0, 0.0])


def sh(repo: Path, *args: str) -> str:
    return subprocess.check_output(['git','-C',str(repo),*args], text=True).strip()


def sha256(path: Path) -> str:
    h=hashlib.sha256()
    with path.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024), b''):
            h.update(b)
    return h.hexdigest()


def load_example(root: Path):
    example = root / EXAMPLE
    common = root / 'examples/acados_python/pendulum_on_cart/common'
    sys.path.insert(0, str(common))
    cwd=os.getcwd()
    try:
        os.chdir(example.parent)
        spec=importlib.util.spec_from_file_location('native_probe_example', example)
        mod=importlib.util.module_from_spec(spec)
        assert spec and spec.loader
        spec.loader.exec_module(mod)
        return mod
    finally:
        os.chdir(cwd)


def set_bound(solver, umax: float):
    for k in range(N):
        solver.constraints_set(k, 'lbu', np.array([-umax]))
        solver.constraints_set(k, 'ubu', np.array([+umax]))


def solve(solver, umax: float):
    set_bound(solver, umax)
    status=int(solver.solve_for_x0(X0))
    if status != 0:
        raise RuntimeError(f'solve failed: umax={umax}, status={status}')
    forces=[]; lams=[]; lower=[]; upper=[]; active=[]
    for k in range(N):
        u=np.asarray(solver.get(k,'u'), dtype=float).reshape(-1)
        lam=np.asarray(solver.get(k,'lam'), dtype=float).reshape(-1)
        if len(u)!=1 or len(lam)%2:
            raise RuntimeError(f'unexpected dimensions at stage {k}: u={len(u)}, lam={len(lam)}')
        half=len(lam)//2
        ll=float(lam[0]); lu=float(lam[half])
        forces.append(float(u[0])); lams.append([float(x) for x in lam])
        lower.append(ll); upper.append(lu)
        if ll > 1e-8 or lu > 1e-8:
            active.append(k)
    total=float(np.sum(lower)+np.sum(upper))
    return {
        'u_max':umax,
        'status':status,
        'J_star':float(solver.get_cost()),
        'force_trajectory':forces,
        'lambda_vectors':lams,
        'lambda_lower_assumed':lower,
        'lambda_upper_assumed':upper,
        'lambda_total_bound_sum_assumed':total,
        'active_bound_stages_assumed':active,
        'active_bound_stage_count_assumed':len(active),
        'envelope_dJ_du_max_assumed':-total,
    }


def main():
    root=Path(os.environ['ACADOS_SOURCE_DIR']).resolve()
    out=Path(os.environ.get('PROBE_OUT','native_probe_out')).resolve()
    out.mkdir(parents=True, exist_ok=True)
    assert sh(root,'rev-parse','HEAD') == ACADOS_COMMIT
    assert sh(root/'external/blasfeo','rev-parse','HEAD') == BLASFEO_SHA
    assert sh(root/'external/hpipm','rev-parse','HEAD') == HPIPM_SHA
    assert sh(root/'interfaces/acados_template/tera_renderer','rev-parse','HEAD') == TERA_SHA
    assert not sh(root,'status','--porcelain')
    mod=load_example(root)
    solver=mod.setup_solver(N=N, dt=DT, u_max=U0)
    ocp=solver.ocp
    semantics={
        'N_horizon':int(ocp.solver_options.N_horizon),
        'tf':float(ocp.solver_options.tf),
        'qp_solver':str(ocp.solver_options.qp_solver),
        'hessian_approx':str(ocp.solver_options.hessian_approx),
        'integrator_type':str(ocp.solver_options.integrator_type),
        'nlp_solver_type':str(ocp.solver_options.nlp_solver_type),
        'nlp_solver_max_iter':int(ocp.solver_options.nlp_solver_max_iter),
        'x0':[float(x) for x in np.asarray(ocp.constraints.x0).reshape(-1)],
        'lbu':[float(x) for x in np.asarray(ocp.constraints.lbu).reshape(-1)],
        'ubu':[float(x) for x in np.asarray(ocp.constraints.ubu).reshape(-1)],
    }
    assert semantics['N_horizon']==25
    assert math.isclose(semantics['tf'],1.25,abs_tol=1e-12)
    assert semantics['qp_solver']=='PARTIAL_CONDENSING_HPIPM'
    assert semantics['hessian_approx']=='EXACT'
    assert semantics['integrator_type']=='IRK'
    assert semantics['nlp_solver_type']=='SQP'
    assert semantics['nlp_solver_max_iter']==600
    minus=solve(solver,U0-EPS)
    center=solve(solver,U0)
    plus=solve(solver,U0+EPS)
    fd=(plus['J_star']-minus['J_star'])/(2*EPS)
    libs=[]
    for p in sorted((root/'lib').glob('*')):
        if p.is_file():
            libs.append({'name':p.name,'bytes':p.stat().st_size,'sha256':sha256(p)})
    result={
        'probe':'public-native-acados-pendulum-value-and-bound-sensitivity',
        'source_commit':ACADOS_COMMIT,
        'submodules':{'blasfeo':BLASFEO_SHA,'hpipm':HPIPM_SHA,'tera_renderer':TERA_SHA},
        'canonical_source':{'example':EXAMPLE,'example_sha256':sha256(root/EXAMPLE),'model':MODEL,'model_sha256':sha256(root/MODEL)},
        'runtime':{'python':sys.version,'platform':platform.platform(),'machine':platform.machine()},
        'semantics':semantics,
        'epsilon_N':EPS,
        'minus':minus,
        'center':center,
        'plus':plus,
        'finite_difference_dJ_du_max':fd,
        'compiled_libraries':libs,
    }
    (out/'NATIVE_ACADOS_PUBLIC_PROBE.json').write_text(json.dumps(result,indent=2,sort_keys=True)+'\n')
    print(json.dumps({
        'J_star_60':center['J_star'],
        'finite_difference_dJ_du_max':fd,
        'envelope_dJ_du_max_assumed':center['envelope_dJ_du_max_assumed'],
        'active_bound_stage_count_assumed':center['active_bound_stage_count_assumed'],
        'active_bound_stages_assumed':center['active_bound_stages_assumed'],
        'compiled_library_count':len(libs),
    },indent=2))

if __name__=='__main__':
    main()
