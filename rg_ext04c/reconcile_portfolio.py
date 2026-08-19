import hashlib, json, platform, subprocess
import numpy as np
from scipy import sparse

CANDIDATE_ID='CAND-E04-002'
CONTRACT_HASH='559a0af0948b99933712a242d258da74781f7ae336e1a6a24155faa13012b581'
SOURCE_COMMIT='1572ae068e9ce9ca723cf8223548ade1ff7acc29'
SOURCE_PATH='docs/examples/portfolio.rst'
SOURCE_BLOB_SHA1='e980ce32cff4fd0613f04a5cf23db4cf13c1287d'
OSQP_PY_COMMIT='dcc6384845e27b275fc41b2106dd2c379d5d5db4'
BANK=[.02,.03,.05,.08,.12,.20,.35,.60,1.00]
EXPECTED_G9={'atlas_count':485100,'nested':{'0.5':7101,'0.75':40936,'1.0':111800},'in_window':111800}
RMIN=1e-5; RMAX=.30


def pip_hash():
    raw=subprocess.check_output(['python','-m','pip','freeze'],text=True).encode()
    return hashlib.sha256(raw).hexdigest()

def arr_bytes(a):
    if sparse.issparse(a):
        x=a.tocsc()
        return b'|'.join([x.data.tobytes(),x.indices.tobytes(),x.indptr.tobytes(),str(x.shape).encode()])
    x=np.asarray(a)
    return x.tobytes()+str(x.shape).encode()

def data_hash(parts):
    h=hashlib.sha256()
    for name,x in parts:
        h.update(name.encode()+b'\0'+arr_bytes(x)+b'\0')
    return h.hexdigest()

def build_source_problem(cap):
    np.random.seed(1)
    n=100; k=10
    F=sparse.random(n,k,density=.7,format='csc')
    D=sparse.diags(np.random.rand(n)*np.sqrt(k),format='csc')
    mu=np.random.randn(n); gamma=1
    P=sparse.block_diag([D,sparse.eye(k)],format='csc')
    q=np.hstack([-mu/(2*gamma),np.zeros(k)])
    A=sparse.bmat([[F.T,-sparse.eye(k)],[np.ones((1,n)),None],[sparse.eye(n),None]],format='csc')
    l=np.hstack([np.zeros(k),1.,np.zeros(n)])
    u=np.hstack([np.zeros(k),1.,float(cap)*np.ones(n)])
    return {'n':n,'k':k,'F':F,'D':D,'mu':mu,'P':P,'q':q,'A':A,'l':l,'u':u}

def structure_checks(d,cap):
    n=d['n']; k=d['k']; A=d['A'].tocsr(); l=d['l']; u=d['u']
    # Exact row ordering: 0..9 factor equalities; 10 budget; 11..110 identity allocation bounds.
    top=A[:k,:].toarray()
    budget=A[k:k+1,:].toarray()
    ident=A[k+1:k+1+n,:].toarray()
    exp_top=np.hstack([d['F'].T.toarray(),-np.eye(k)])
    exp_budget=np.hstack([np.ones((1,n)),np.zeros((1,k))])
    exp_ident=np.hstack([np.eye(n),np.zeros((n,k))])
    return {
      'shape_ok':A.shape==(k+1+n,n+k),
      'factor_rows_exact':bool(np.array_equal(top,exp_top)),
      'budget_row_exact':bool(np.array_equal(budget,exp_budget)),
      'identity_rows_exact':bool(np.array_equal(ident,exp_ident)),
      'lower_identity_zero_exact':bool(np.array_equal(l[k+1:k+1+n],np.zeros(n))),
      'upper_identity_cap_exact':bool(np.array_equal(u[k+1:k+1+n],float(cap)*np.ones(n))),
      'response_row_start_zero_based':k+1,
      'response_row_stop_exclusive_zero_based':k+1+n,
    }

def solve_cap(cap):
    import osqp
    d=build_source_problem(cap)
    sc=structure_checks(d,cap)
    prob=osqp.OSQP(); prob.setup(d['P'],d['q'],d['A'],d['l'],d['u'],verbose=False,warm_starting=False)
    res=prob.solve()
    z=np.asarray(res.x); y=np.asarray(res.y)
    obj_native=float(res.info.obj_val)
    obj_direct=.5*float(z@(d['P']@z))+float(d['q']@z)
    ycap=y[d['k']+1:d['k']+1+d['n']]
    mu_total=float(np.sum(np.maximum(ycap,0.0)))
    return {
      'cap':float(cap),'status':str(res.info.status),'solved':str(res.info.status).lower()=='solved',
      'objective_native':obj_native,'objective_direct':obj_direct,
      'objective_abs_error':abs(obj_native-obj_direct),
      'mu_total':mu_total,'dual_subgradient':-mu_total,
      'prim_res':float(res.info.prim_res),'dual_res':float(res.info.dual_res),
      'structure':sc,
      'source_data_hash':data_hash([('F',d['F']),('D',d['D']),('mu',d['mu']),('P',d['P']),('q',d['q']),('A',d['A'])]),
    }

def beta_atlas():
    # Exact frozen source-only generator from RG-EXT-04A G9. No native solve and no fitted beta.
    np.random.seed(1); n=100; k=10
    F=sparse.random(n,k,density=.7,format='csc').toarray()
    d=np.random.rand(n)*np.sqrt(k)
    qs=[]
    for i in range(n-2):
      for j in range(i+1,n-1):
        for l in range(j+1,n):
          tri=(i,j,l)
          for pos in tri:
            dx=np.zeros(n); dx[list(tri)]=-.5; dx[pos]=1.
            dy=F.T@dx
            qs.append(.5*(float(np.dot(d*dx,dx))+float(np.dot(dy,dy))))
    q=np.asarray(qs,float); qmin=float(q.min()); qmax=float(q.max())
    g=(q-qmin)/(qmax-qmin)
    nested={str(f):int(np.sum((g>=RMIN)&(g<=RMAX*f))) for f in (.5,.75,1.0)}
    return {'atlas_count':int(len(q)),'q_min':qmin,'q_max':qmax,'nondegenerate':bool(qmax>qmin),'all_finite':bool(np.all(np.isfinite(q))),'nested':nested,'in_window':nested['1.0']}

def main():
    # Deterministic seeded construction check before native bank solve.
    a=build_source_problem(BANK[0]); b=build_source_problem(BANK[0])
    ha=data_hash([('F',a['F']),('D',a['D']),('mu',a['mu']),('P',a['P']),('q',a['q']),('A',a['A'])])
    hb=data_hash([('F',b['F']),('D',b['D']),('mu',b['mu']),('P',b['P']),('q',b['q']),('A',b['A'])])
    deterministic=(ha==hb)

    solves=[solve_cap(p) for p in BANK]
    all_solved=all(x['solved'] for x in solves)
    rowmap=all(all(v for k,v in x['structure'].items() if k.endswith('_exact') or k=='shape_ok') for x in solves)
    data_same=all(x['source_data_hash']==solves[0]['source_data_hash'] for x in solves)
    obj_tol_pass=all(x['objective_abs_error'] <= 1e-7*(1+abs(x['objective_native'])) for x in solves)
    monotone=all(solves[i+1]['objective_native'] <= solves[i]['objective_native'] + 1e-8 for i in range(len(solves)-1))

    brackets=[]
    for i in range(1,len(solves)-1):
        x0,x1,x2=solves[i-1],solves[i],solves[i+1]
        left=(x1['objective_native']-x0['objective_native'])/(x1['cap']-x0['cap'])
        right=(x2['objective_native']-x1['objective_native'])/(x2['cap']-x1['cap'])
        g=x1['dual_subgradient']
        lo=min(left,right); hi=max(left,right)
        tol=max(2e-6,2e-5*max(1.0,abs(left),abs(right),abs(g)))
        passed=(lo-tol <= g <= hi+tol)
        brackets.append({'cap':x1['cap'],'left_secant':left,'dual_subgradient':g,'right_secant':right,'tolerance':tol,'pass':bool(passed)})
    dual_bracket_pass=all(x['pass'] for x in brackets)

    atlas=beta_atlas()
    atlas_pass=(atlas['atlas_count']==EXPECTED_G9['atlas_count'] and atlas['nested']==EXPECTED_G9['nested'] and atlas['in_window']==EXPECTED_G9['in_window'] and atlas['all_finite'] and atlas['nondegenerate'])

    checks={
      'deterministic_seeded_source_instance':deterministic,
      'all_nine_frozen_bank_points_solved':all_solved,
      'resource_bound_row_mapping_exact':rowmap,
      'same_seeded_source_data_across_bank':data_same,
      'native_objective_matches_direct_qp_objective':obj_tol_pass,
      'objective_nonincreasing_under_cap_relaxation':monotone,
      'upper_dual_envelope_secant_reconciliation':dual_bracket_pass,
      'frozen_source_only_beta_atlas_reproduced':atlas_pass,
      'cold_start_fresh_osqp_object_each_bank_point':True,
      'alpha_estimator_invoked':False,
      'beta_estimator_invoked':False,
      'theta_computed':False,
    }
    passed=all(v for k,v in checks.items() if k not in ('alpha_estimator_invoked','beta_estimator_invoked','theta_computed')) and not checks['alpha_estimator_invoked'] and not checks['beta_estimator_invoked'] and not checks['theta_computed']
    receipt={
      'suite_id':'RG-EXT-04C','candidate_id':CANDIDATE_ID,'candidate_measurement_contract_hash':CONTRACT_HASH,
      'source_commit':SOURCE_COMMIT,'source_path':SOURCE_PATH,'source_git_blob_sha1':SOURCE_BLOB_SHA1,'osqp_python_commit':OSQP_PY_COMMIT,
      'bank':BANK,'checks':checks,'deterministic_source_hash':ha,'native_bank':solves,'dual_secant_checks':brackets,'beta_atlas_reconciliation':atlas,
      'pip_freeze_sha256':pip_hash(),'python_version':platform.python_version(),'machine':platform.machine(),
      'terminal_state':'NATIVE_MEASUREMENT_CONTRACT_RECONCILED_STOP_BEFORE_CONDITION_1' if passed else 'NATIVE_MEASUREMENT_CONTRACT_MISMATCH_STOP_BEFORE_CONDITION_1',
      'condition_1_authorized':False,'alpha_estimated':False,'beta_estimated':False,'theta_computed':False,'class_locked':False,
    }
    with open('RG_EXT_04C_RECONCILIATION_RECEIPT.json','w') as f: json.dump(receipt,f,indent=2,sort_keys=True)
    print(receipt['terminal_state'])
    if not passed: raise SystemExit(2)

if __name__=='__main__': main()
