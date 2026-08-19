import hashlib, json, pathlib, platform
import pandapower as pp
from pandapower.networks import case118

net = case118()

def rows(df, cols):
    out=[]
    for idx,row in df.iterrows():
        x={'index':int(idx)}
        for c in cols:
            if c in df.columns:
                v=row[c]
                if hasattr(v,'item'): v=v.item()
                if isinstance(v,float) and (v != v): v=None
                x[c]=v
        out.append(x)
    return out

pp_dir = pathlib.Path(pp.__file__).resolve().parent
case_path = pp_dir/'networks'/'power_system_test_case_jsons'/'case118.json'
sha = hashlib.sha256(case_path.read_bytes()).hexdigest()

receipt={
  'source_only': True,
  'native_solver_invoked': False,
  'network':'case118',
  'pandapower_version': getattr(pp,'__version__',None),
  'python_version':platform.python_version(),
  'machine':platform.machine(),
  'case118_json_sha256':sha,
  'counts':{
    'bus':len(net.bus),'gen':len(net.gen),'ext_grid':len(net.ext_grid),'sgen':len(net.sgen),
    'load':len(net.load),'poly_cost':len(net.poly_cost),'pwl_cost':len(net.pwl_cost)
  },
  'gen':rows(net.gen,['bus','p_mw','min_p_mw','max_p_mw','controllable','in_service']),
  'ext_grid':rows(net.ext_grid,['bus','min_p_mw','max_p_mw','controllable','in_service']),
  'poly_cost':rows(net.poly_cost,['element','et','cp0_eur','cp1_eur_per_mw','cp2_eur_per_mw2']),
}
with open('PANDAPOWER_CASE118_SOURCE_METADATA.json','w') as f:
    json.dump(receipt,f,indent=2,sort_keys=True)
print(json.dumps(receipt['counts'],sort_keys=True))
