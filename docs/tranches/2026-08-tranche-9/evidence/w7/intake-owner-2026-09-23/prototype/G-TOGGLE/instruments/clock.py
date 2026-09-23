# clock.py <run.json>... — the cold flip's clock: rAF frames where the digit colour, the grid href or the
# paper changes, or where a gap > 30 ms opens (the stall). Prints click (actAt) first.
import json, sys
for p in sys.argv[1:]:
    d = json.load(open(p)); r = d['runs'][0]
    print(p.split('/')[-1], 'click', r['actAt'])
    prev = None
    for f in r['frames']:
        if -10 < f['t'] < 800 and (prev is None or f['dig'] != prev['dig'] or f['gA'] != prev['gA'] or f['t'] - prev['t'] > 30):
            gap = round(f['t'] - prev['t']) if prev else 0
            print('  t', round(f['t']), 'gap', gap, 'turning', f['tt'], 'paper', f['bw'], 'dig', f['dig'], 'grid', f['gA'])
        prev = f
