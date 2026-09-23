# Classified summary of board-arms-*.json: per arm × theme × board × ground, chromium | webkit:
# ledger (left side, WORST of 60), whole ring (core worst, p30, median, fraction < 3), the 90 % and 70 %
# sensitivity rows, and the stations under 3 by side with their ground.
import json, os
L = os.path.dirname(os.path.abspath(__file__)).replace('/probe', '/logs')
D = {e: json.load(open(f'{L}/board-arms-{e}.json')) for e in ('chromium', 'webkit')}
key = lambda r: (r['arm'], r['theme'], r['board'], r['on'])
idx = {e: {key(r): r for r in D[e]['rows']} for e in D}
print('payload 16x16:', D['chromium']['payloads']['A-alias-0.95-4']['payload'])
print('payload 9x9:  ', D['chromium']['payloads']['A-alias-0.95-3']['payload'])
print('given-sets identical across arms, both engines:', all(len({v['givens'] for k, v in D[e]['payloads'].items() if k.endswith(s)}) == 1 for e in D for s in ('-4', '-3')))
print(f"{'arm':14} {'theme':5} {'board':5} {'on':5} | {'ledger L c|w':13} | {'ring worst c|w':15} {'f<3 c|w':11} | {'90% c|w':21} | {'70% c|w':21} | under-3 stations (side r ground) chromium ; webkit")
for k in idx['chromium']:
    c, w = idx['chromium'][k], idx['webkit'].get(k)
    if not w: continue
    s = lambda r, at: next(x for x in r['ring']['sensitivity'] if x['at'] == at)
    u = lambda r: ' '.join(f"{x['side'][0]}{x['r']}{tuple(x['ground'])}" for x in r['ring']['under3Stations'])
    print(f"{k[0]:14} {k[1]:5} {k[2]:5} {k[3]:5} | {c['ledger']['worst']}|{w['ledger']['worst']:<7} | {c['ring']['core']['worst']}|{w['ring']['core']['worst']:<9} {c['ring']['core']['fracUnder3']}|{w['ring']['core']['fracUnder3']:<6} | {s(c,'90%')['worst']}({s(c,'90%')['under3']})|{s(w,'90%')['worst']}({s(w,'90%')['under3']}) | {s(c,'70%')['worst']}({s(c,'70%')['under3']})|{s(w,'70%')['worst']}({s(w,'70%')['under3']}) | {u(c)} ; {u(w)}")
