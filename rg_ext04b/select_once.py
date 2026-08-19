import json, hashlib, urllib.request, pathlib
from datetime import datetime, timezone

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
    p=obj.get('pulse')
    if not p: raise SystemExit('missing pulse')
    return p

def ts_ms(v):
    if isinstance(v,(int,float)): return int(v)
    s=str(v)
    if s.endswith('Z'): s=s[:-1]+'+00:00'
    return int(datetime.fromisoformat(s).timestamp()*1000)

# Frozen qualifying timestamp: the API returns the pulse at or immediately after this instant.
raw_q, jq = get(f'{BASE}/pulse/time/{QUALIFY_MS}')
q = pulse(jq)
idx = int(q['pulseIndex'])
chain = int(q['chainIndex'])

# Canonical explicit predecessor URI; no latest/last endpoint and no redraw.
raw_p, jp = get(f'{BASE}/chain/{chain}/pulse/{idx-1}')
p = pulse(jp)

(OUT/'QUALIFYING_PULSE_RAW.json').write_bytes(raw_q)
(OUT/'PREDECESSOR_PULSE_RAW.json').write_bytes(raw_p)

q_ms=ts_ms(q['timeStamp']); p_ms=ts_ms(p['timeStamp'])
q_status=int(q.get('statusCode', q.get('status', -1)))
p_status=int(p.get('statusCode', p.get('status', -1)))
assert chain == 2 and int(p['chainIndex']) == 2
assert q_status == 0 and p_status == 0
assert int(q['period']) == 60000 and int(p['period']) == 60000
assert int(p['pulseIndex']) + 1 == idx
assert p_ms <= FREEZE_MS < q_ms
assert q_ms == QUALIFY_MS

prev=[v for v in q.get('listValues',[]) if str(v.get('type','')).lower()=='previous']
assert len(prev) == 1
assert str(prev[0].get('value','')).upper() == str(p['outputValue']).upper()
assert str(prev[0].get('uri','')).rstrip('/') == f'{BASE}/chain/2/pulse/{idx-1}'

ov=str(q['outputValue']).upper()
preimage=f'RG-EXT-04-SELECTION|{UNIVERSE_SHA256}|{ov}'
digest=hashlib.sha256(preimage.encode()).hexdigest()
u64=int.from_bytes(bytes.fromhex(digest)[:8],'big',signed=False)
sel=u64 % 3
receipt={
 'suite_id':'RG-EXT-04B',
 'terminal_state':'ONE_SHOT_EXTERNAL_SELECTION_FROZEN_STOP_BEFORE_RECONCILIATION',
 'freeze_timestamp_utc':FREEZE_ISO,
 'universe_sha256':UNIVERSE_SHA256,
 'candidate_count':3,
 'qualifying_pulse_index':idx,
 'qualifying_timestamp_utc':q['timeStamp'],
 'qualifying_timestamp_ms':q_ms,
 'qualifying_output_value':ov,
 'predecessor_pulse_index':int(p['pulseIndex']),
 'predecessor_timestamp_utc':p['timeStamp'],
 'predecessor_timestamp_ms':p_ms,
 'predecessor_output_value':str(p['outputValue']).upper(),
 'chain_index':2,
 'status_code':q_status,
 'period_ms':60000,
 'strict_bracket_verified':True,
 'consecutive_index_verified':True,
 'direct_previous_value_verified':True,
 'direct_previous_uri_verified':True,
 'selector_preimage':preimage,
 'selector_digest_sha256':digest,
 'selector_uint64':u64,
 'selected_index':sel,
 'selected_candidate_id':CANDIDATES[sel],
 'redraw_permitted':False,
 'selector_applications':1,
 'transport_retrieval_attempts':2,
 'first_transport_attempt_selector_applied':False,
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
