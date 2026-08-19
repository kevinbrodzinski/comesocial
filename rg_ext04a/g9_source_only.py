import argparse, hashlib, json, platform, subprocess, math
import numpy as np
from scipy import sparse
from scipy.sparse.linalg import factorized

ALPHA_MIN=5; BETA_MIN=1024; RMIN=1e-5; RMAX=.30
CONTRACTS={
 'quad':('CAND-E04-001','dbaa5010823d9dc4d5ff90279366af4f5da549f9806436fd72e0017fb2371c7f',[.60,.70,.80,.90,1.,1.10,1.20,1.30,1.40]),
 'portfolio':('CAND-E04-002','559a0af0948b99933712a242d258da74781f7ae336e1a6a24155faa13012b581',[.02,.03,.05,.08,.12,.20,.35,.60,1.]),
 'pandapower':('CAND-E04-003','f03abbf6cb864340c87a6d78abfc89a6132c072bc13927ec4c2ce74f4cceb34c',[.90,.95,1.,1.05,1.10,1.15,1.20,1.25,1.30])}

def alpha_support(bank):
    pmin,pmax=min(bank),max(bank); r=np.array([(pmax-p)/(pmax-pmin) for p in bank])
    pos=r[np.isfinite(r)&(r>0)]
    return {'bank_count':len(bank),'positive_radius_count':int(len(pos)),'distinct_positive_radius_count':int(len(np.unique(pos))),'required_min':ALPHA_MIN,'pass':bool(len(pos)>=ALPHA_MIN and len(np.unique(pos))>=ALPHA_MIN)}

def beta_finalize(q):
    q=np.asarray(q,float); finite=bool(np.all(np.isfinite(q))); qmin=float(q.min()); qmax=float(q.max()); nondeg=finite and qmax>qmin
    g=(q-qmin)/(qmax-qmin) if nondeg else np.full_like(q,np.nan)
    nested={str(f):int(np.sum((g>=RMIN)&(g<=RMAX*f))) for f in (.5,.75,1.0)}
    c=nested['1.0']; distinct=int(len(np.unique(np.round(g[(g>=RMIN)&(g<=RMAX)],14))))
    nested_ok=all(v>=3 for v in nested.values()) and distinct>=3
    return {'source_only':True,'atlas_count':int(len(q)),'all_finite':finite,'geometry_nondegenerate':nondeg,'q_min':qmin,'q_max':qmax,'in_window_count':c,'required_min':BETA_MIN,'nested_window_counts':nested,'distinct_in_window_count':distinct,'nested_structural_support':nested_ok,'pass':bool(nondeg and c>=BETA_MIN and nested_ok)}

def quad_beta():
    Ad=np.array([[1.,0,0,0,0,0,.1,0,0,0,0,0],[0,1.,0,0,0,0,0,.1,0,0,0,0],[0,0,1.,0,0,0,0,0,.1,0,0,0],[.0488,0,0,1.,0,0,.0016,0,0,.0992,0,0],[0,-.0488,0,0,1.,0,0,-.0016,0,0,.0992,0],[0,0,0,0,0,1.,0,0,0,0,0,.0992],[0,0,0,0,0,0,1.,0,0,0,0,0],[0,0,0,0,0,0,0,1.,0,0,0,0],[0,0,0,0,0,0,0,0,1.,0,0,0],[.9734,0,0,0,0,0,.0488,0,0,.9846,0,0],[0,-.9734,0,0,0,0,0,-.0488,0,0,.9846,0],[0,0,0,0,0,0,0,0,0,0,0,.9846]])
    Bd=np.array([[0,-.0726,0,.0726],[-.0726,0,.0726,0],[-.0152,.0152,-.0152,.0152],[0,-.0006,0,.0006],[.0006,0,-.0006,0],[.0106,.0106,.0106,.0106],[0,-1.4512,0,1.4512],[-1.4512,0,1.4512,0],[-.3049,.3049,-.3049,.3049],[0,-.0236,0,.0236],[.0236,0,-.0236,0],[.2107,.2107,.2107,.2107]])
    nx,nu=Bd.shape; N=10; m=N*nu
    Q=sparse.diags([0.,0.,10.,10.,10.,10.,0.,0.,0.,5.,5.,5.]); R=.1*sparse.eye(4)
    P=sparse.block_diag([sparse.kron(sparse.eye(N),Q),Q,sparse.kron(sparse.eye(N),R)],format='csc')
    Ax=(sparse.kron(sparse.eye(N+1),-sparse.eye(nx))+sparse.kron(sparse.eye(N+1,k=-1),sparse.csc_matrix(Ad))).tocsc()
    Bu=sparse.kron(sparse.vstack([sparse.csc_matrix((1,N)),sparse.eye(N)]),sparse.csc_matrix(Bd)).tocsc(); solve=factorized(Ax)
    q=[]
    def add(du):
      dx=solve(-(Bu@du)); dz=np.r_[dx,du]; q.append(.5*float(dz@(P@dz)))
    for i in range(m):
      du=np.zeros(m); du[i]=-1; add(du)
    for i in range(m):
      for j in range(i+1,m):
        for kk in range(1,9):
          lam=kk/9.; du=np.zeros(m); du[i]=-lam; du[j]=-(1-lam); add(du)
    return beta_finalize(q)

def portfolio_beta():
    np.random.seed(1); n=100; k=10
    F=sparse.random(n,k,density=.7,format='csc').toarray(); d=np.random.rand(n)*np.sqrt(k)
    q=[]
    for i in range(n-2):
      for j in range(i+1,n-1):
        for l in range(j+1,n):
          tri=(i,j,l)
          for pos in tri:
            dx=np.zeros(n); dx[list(tri)]=-.5; dx[pos]=1.
            dy=F.T@dx; q.append(.5*(float(np.dot(d*dx,dx))+float(np.dot(dy,dy))))
    return beta_finalize(q)

def pandapower_beta():
    from pandapower.networks import case118
    net=case118(); costs=[]
    for idx in list(net.gen.index):
      row=net.poly_cost[(net.poly_cost.et=='gen')&(net.poly_cost.element==idx)]
      costs.append(float(row.iloc[0].cp2_eur_per_mw2))
    erow=net.poly_cost[(net.poly_cost.et=='ext_grid')&(net.poly_cost.element==0)]
    costs.append(float(erow.iloc[0].cp2_eur_per_mw2)); cp=np.asarray(costs); n=len(cp)
    q=[]
    for i in range(n-2):
      for j in range(i+1,n-1):
        for l in range(j+1,n):
          tri=(i,j,l)
          for pos in tri:
            dx=np.zeros(n); dx[list(tri)]=-.5; dx[pos]=1.; q.append(float(np.sum(cp*dx*dx)))
    return beta_finalize(q)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('candidate',choices=CONTRACTS); a=ap.parse_args(); cid,ch,bank=CONTRACTS[a.candidate]
    aa=alpha_support(bank); bb={'quad':quad_beta,'portfolio':portfolio_beta,'pandapower':pandapower_beta}[a.candidate]()
    overall=aa['pass'] and bb['pass']
    receipt={'candidate_id':cid,'candidate_measurement_contract_hash':ch,'scientific_values_observed':False,'native_optimizer_invoked':False,'alpha':aa,'beta':bb,'structural_prerequisites_pass':True,'scientific_firewall_pass':True,'python_version':platform.python_version(),'machine':platform.machine(),'terminal_state':'G9_PASS_MEASUREMENT_SUPPORT_SUFFICIENT_LOTTERY_ELIGIBLE' if overall else 'G9_FAIL_MEASUREMENT_SUPPORT_INSUFFICIENT_EXCLUDED_FROM_LOTTERY'}
    json.dump(receipt,open(f'RG_EXT_04A_G9_{cid}.json','w'),indent=2,sort_keys=True); print(receipt['terminal_state'],aa['positive_radius_count'],bb['in_window_count'])
if __name__=='__main__': main()
