import json, hashlib, urllib.request, pathlib, sys

FREEZE_ISO = '2026-08-19T21:39:26.167485Z'
FREEZE_MS = 1787175566167
QUALIFY_MS = 1787175600000
UNIVERSE_SHA256 = '57aa4a32db0923ef3ea433a95c0e28c6875d6fdfaaaad7b9fb5d9504bddc45b7'
CANDIDATES = ['CAND-E04-001','CAND-E04-002','CAND-E04-003']
BASE='https://beacon.nist.gov/beacon/2.0'
OUT=pathlib.Path('rg_ext04b/out'); OUT.mkdir(parents=True,exist_ok=True)

def get(url):
    with urllib.request.urlopen(url, timeout=30) as r:
        raw=r.read()
    return raw, json.loads(raw)

def pulse(obj):
    p=obj.get('pulse') or obj.get('pulse',{})
    if not p: raise SystemExit('missing pulse')
    return p

raw_q, jq = get(f'{BASE}/pulse/time/{QUALIFY_MS}')
q = pulse(jq)
idx = int(q['pulseIndex'])
raw_p, jp = get(f'{BASE}/pulse/{idx-1}')
p = pulse(jp)

(OUT/'QUALIFYING_PULSE_RAW.json').write_bytes(raw_q)
(OUT/'PREDECESSOR_PULSE_RAW.json').write_bytes(raw_p)

assert int(q['chainIndex']) == 2
assert int(p['chainIndex']) == 2
assert int(q['status']) == 0 and int(p['status']) == 0
assert int(q['period']) == 60000 and int(p['period']) == 60000
assert int(p['pulseIndex']) + 1 == int(q['pulseIndex'])
assert int(p['timeStamp']) <= FREEZE_MS < int(q['timeStamp'])
assert int(q['timeStamp']) == QUALIFY_MS

# NIST Beacon 2.0 embeds a previous-value witness in listValues. Verify direct linkage if present.
prev_values=[]
for v in q.get('listValues',[]):
    if str(v.get('type','')).lower() == 'previous':
        prev_values.append(str(v.get('value','')).upper())
if prev_values:
    assert str(p['outputValue']).upper() in prev_values

ov=str(q['outputValue']).upper()
preimage=f'RG-EXT-04-SELECTION|{UNIVERSE_SHA256}|{ov}'
digest=hashlib.sha256(preimage.encode()).hexdigest()
u64=int.from_bytes(bytes.fromhex(digest)[:8],'big',signed=False)
sel=u64 % len(CANDIDATES)
receipt={
 'suite_id':'RG-EXT-04B',
 'terminal_state':'ONE_SHOT_EXTERNAL_SELECTION_FROZEN_STOP_BEFORE_RECONCILIATION',
 'freeze_timestamp_utc':FREEZE_ISO,
 'universe_sha256':UNIVERSE_SHA256,
 'candidate_count':len(CANDIDATES),
 'qualifying_pulse_index':idx,
 'qualifying_timestamp_ms':int(q['timeStamp']),
 'predecessor_pulse_index':int(p['pulseIndex']),
 'predecessor_timestamp_ms':int(p['timeStamp']),
 'chain_index':int(q['chainIndex']),
 'status':int(q['status']),
 'period_ms':int(q['period']),
 'strict_bracket_verified':True,
 'consecutive_index_verified':True,
 'direct_previous_linkage_verified': bool(prev_values),
 'selector_preimage':preimage,
 'selector_digest_sha256':digest,
 'selector_uint64':u64,
 'selected_index':sel,
 'selected_candidate_id':CANDIDATES[sel],
 'redraw_permitted':False,
 'selection_executions':1,
 'native_reconciliation_started':False,
 'condition_1_authorized':False,
 'alpha_exposed':False,
 'beta_exposed':False,
 'theta_exposed':False,
 'class_locked':False,
 'p_contact_predicted':False,
 'mass_response_measured':False,
 'boundary_contact_observed':False,
 'primary_boundary_sweep_executed':False,
}
(OUT/'SELECTION_RECEIPT.json').write_text(json.dumps(receipt,indent=2,sort_keys=True)+'\n')
for name in ['QUALIFYING_PULSE_RAW.json','PREDECESSOR_PULSE_RAW.json','SELECTION_RECEIPT.json']:
    b=(OUT/name).read_bytes(); print(hashlib.sha256(b).hexdigest(), name)
print(json.dumps(receipt,sort_keys=True))
