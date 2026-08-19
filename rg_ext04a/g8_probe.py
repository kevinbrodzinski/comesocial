import argparse, hashlib, json, platform, subprocess
import numpy as np
from scipy import sparse

CONTRACTS={
 'quad':('CAND-E04-001','dbaa5010823d9dc4d5ff90279366af4f5da549f9806436fd72e0017fb2371c7f'),
 'portfolio':('CAND-E04-002','559a0af0948b99933712a242d258da74781f7ae336e1a6a24155faa13012b581'),
 'pandapower':('CAND-E04-003','f03abbf6cb864340c87a6d78abfc89a6132c072bc13927ec4c2ce74f4cceb34c')}

def pip_hash():
    raw=subprocess.check_output(['python','-m','pip','freeze'],text=True).encode()
    return hashlib.sha256(raw).hexdigest()

def projected(ok,outcome,response,exc=None):
    otype=isinstance(outcome,(int,float,np.integer,np.floating))
    if isinstance(response,np.ndarray):
        rtype=response.ndim==1 and response.size>0
        rfinite=bool(np.all(np.isfinite(response))) if rtype else False
    else:
        rtype=isinstance(response,(int,float,np.integer,np.floating))
        rfinite=bool(np.isfinite(response)) if rtype else False
    r={
      'native_execution_success':bool(ok),'prohibited_native_status':not bool(ok),
      'outcome_present':outcome is not None,'outcome_type_valid':bool(otype),
      'outcome_finite':bool(np.isfinite(outcome)) if otype else False,'outcome_value_exposed':False,
      'response_present':response is not None,'response_type_valid':bool(rtype),
      'response_finite':rfinite,'response_value_exposed':False}
    if exc: r['exception_class']=exc
    return r

def quad_point(scale):
    import osqp
    try:
      Ad=sparse.csc_matrix([[1.,0.,0.,0.,0.,0.,.1,0.,0.,0.,0.,0.],[0.,1.,0.,0.,0.,0.,0.,.1,0.,0.,0.,0.],[0.,0.,1.,0.,0.,0.,0.,0.,.1,0.,0.,0.],[.0488,0.,0.,1.,0.,0.,.0016,0.,0.,.0992,0.,0.],[0.,-.0488,0.,0.,1.,0.,0.,-.0016,0.,0.,.0992,0.],[0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.,.0992],[0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.,0.],[0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.,0.],[0.,0.,0.,0.,0.,0.,0.,0.,1.,0.,0.,0.],[.9734,0.,0.,0.,0.,0.,.0488,0.,0.,.9846,0.,0.],[0.,-.9734,0.,0.,0.,0.,0.,-.0488,0.,0.,.9846,0.],[0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,0.,.9846]])
      Bd=sparse.csc_matrix([[0.,-.0726,0.,.0726],[-.0726,0.,.0726,0.],[-.0152,.0152,-.0152,.0152],[-0.,-.0006,-0.,.0006],[.0006,0.,-.0006,0.],[.0106,.0106,.0106,.0106],[0.,-1.4512,0.,1.4512],[-1.4512,0.,1.4512,0.],[-.3049,.3049,-.3049,.3049],[-0.,-.0236,0.,.0236],[.0236,0.,-.0236,0.],[.2107,.2107,.2107,.2107]])
      nx,nu=Bd.shape; N=10; u0=10.5916
      umin=np.array([9.6]*4)-u0; umax=(np.array([13.]*4)-u0)*float(scale)
      xmin=np.array([-np.pi/6,-np.pi/6,-np.inf,-np.inf,-np.inf,-1.,-np.inf,-np.inf,-np.inf,-np.inf,-np.inf,-np.inf])
      xmax=np.array([ np.pi/6, np.pi/6, np.inf,np.inf,np.inf,np.inf,np.inf,np.inf,np.inf,np.inf,np.inf,np.inf])
      Q=sparse.diags([0.,0.,10.,10.,10.,10.,0.,0.,0.,5.,5.,5.]); QN=Q; R=.1*sparse.eye(4)
      x0=np.zeros(12); xr=np.array([0.,0.,1.,0.,0.,0.,0.,0.,0.,0.,0.,0.])
      P=sparse.block_diag([sparse.kron(sparse.eye(N),Q),QN,sparse.kron(sparse.eye(N),R)],format='csc')
      q=np.hstack([np.kron(np.ones(N),-Q@xr),-QN@xr,np.zeros(N*nu)])
      Ax=sparse.kron(sparse.eye(N+1),-sparse.eye(nx))+sparse.kron(sparse.eye(N+1,k=-1),Ad)
      Bu=sparse.kron(sparse.vstack([sparse.csc_matrix((1,N)),sparse.eye(N)]),Bd)
      Aeq=sparse.hstack([Ax,Bu]); leq=np.hstack([-x0,np.zeros(N*nx)]); ueq=leq
      Aineq=sparse.eye((N+1)*nx+N*nu)
      lineq=np.hstack([np.kron(np.ones(N+1),xmin),np.kron(np.ones(N),umin)])
      uineq=np.hstack([np.kron(np.ones(N+1),xmax),np.kron(np.ones(N),umax)])
      A=sparse.vstack([Aeq,Aineq],format='csc'); l=np.hstack([leq,lineq]); u=np.hstack([ueq,uineq])
      prob=osqp.OSQP(); prob.setup(P,q,A,l,u,verbose=False,warm_starting=False)
      res=prob.solve(); ok=res.info.status=='solved'
      # inequality rows begin after (N+1)*nx equality rows; input variables start after (N+1)*nx state coordinates.
      first_input_upper=(N+1)*nx + (N+1)*nx
      y=np.asarray(res.y); response=y[first_input_upper:first_input_upper+N*nu] if y.size>=first_input_upper+N*nu else None
      return projected(ok,getattr(res.info,'obj_val',None),response)
    except Exception as e: return projected(False,None,None,type(e).__name__)

def portfolio_point(cap):
    import osqp
    try:
      np.random.seed(1); n=100; k=10
      F=sparse.random(n,k,density=.7,format='csc'); D=sparse.diags(np.random.rand(n)*np.sqrt(k),format='csc'); mu=np.random.randn(n); gamma=1
      P=sparse.block_diag([D,sparse.eye(k)],format='csc'); q=np.hstack([-mu/(2*gamma),np.zeros(k)])
      A=sparse.bmat([[F.T,-sparse.eye(k)],[np.ones((1,n)),None],[sparse.eye(n),None]],format='csc')
      l=np.hstack([np.zeros(k),1.,np.zeros(n)]); u=np.hstack([np.zeros(k),1.,float(cap)*np.ones(n)])
      prob=osqp.OSQP(); prob.setup(P,q,A,l,u,verbose=False,warm_starting=False)
      res=prob.solve(); ok=res.info.status=='solved'; y=np.asarray(res.y); response=y[k+1:k+1+n] if y.size>=k+1+n else None
      return projected(ok,getattr(res.info,'obj_val',None),response)
    except Exception as e: return projected(False,None,None,type(e).__name__)

def pandapower_point(scale):
    try:
      import pandapower as pp
      from pandapower.networks import case118
      from pandapower.pypower.idx_gen import MU_PMAX
      net=case118(); net.gen.at[38,'max_p_mw']=707.0*float(scale)
      pp.rundcopp(net,suppress_warnings=True)
      ok=bool(getattr(net,'OPF_converged',False)); outcome=getattr(net,'res_cost',None)
      lookup=net._pd2ppc_lookups['gen']; row=int(lookup[38]); response=float(net._ppc['gen'][row,MU_PMAX])
      return projected(ok,outcome,response)
    except Exception as e: return projected(False,None,None,type(e).__name__)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('candidate',choices=CONTRACTS); a=ap.parse_args()
    cid,ch=CONTRACTS[a.candidate]
    banks={'quad':[.60,.70,.80,.90,1.,1.10,1.20,1.30,1.40], 'portfolio':[.02,.03,.05,.08,.12,.20,.35,.60,1.], 'pandapower':[.90,.95,1.,1.05,1.10,1.15,1.20,1.25,1.30]}
    fn={'quad':quad_point,'portfolio':portfolio_point,'pandapower':pandapower_point}[a.candidate]
    results=[]
    for i,p in enumerate(banks[a.candidate]):
      r=fn(p); r['point_id']=f'P{i:02d}'; results.append(r)
    allpass=all(r['native_execution_success'] and not r['prohibited_native_status'] and r['outcome_present'] and r['outcome_type_valid'] and r['outcome_finite'] and r['response_present'] and r['response_type_valid'] and r['response_finite'] and not r['outcome_value_exposed'] and not r['response_value_exposed'] for r in results)
    receipt={'candidate_id':cid,'candidate_measurement_contract_hash':ch,'bank_count_expected':9,'bank_count_executed':len(results),'probe_results':results,'environment_verified':platform.machine()=='x86_64' and platform.python_version().startswith('3.12.'),'scientific_firewall_intact':True,'scientific_measurements_generated':False,'pip_freeze_sha256':pip_hash(),'python_version':platform.python_version(),'machine':platform.machine(),'terminal_state':'G8_PASS_LOTTERY_ELIGIBLE' if allpass else 'G8_FAIL_EXCLUDED_FROM_LOTTERY'}
    out=f'RG_EXT_04A_G8_{cid}.json'; json.dump(receipt,open(out,'w'),indent=2,sort_keys=True); print(receipt['terminal_state'])
if __name__=='__main__': main()
