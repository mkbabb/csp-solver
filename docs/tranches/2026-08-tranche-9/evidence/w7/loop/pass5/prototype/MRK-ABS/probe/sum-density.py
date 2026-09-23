# Summarise density JSONs (ghost-hidden ring-off differencing) per arm x regime x theme x ground.
import json, sys, glob, os
d = os.path.dirname(os.path.abspath(__file__)) + '/../logs'
rows = []
for f in sorted(glob.glob(d + '/density-coarse*.json')):
    rows += json.load(open(f))['rows']
seen = {}
for r in rows:
    k = (r['arm'], r['reg'], r['theme'], r['on'], r['engine'])
    seen[k] = r
print('arm | regime | theme | ground | engine | coarse | boardPx | median | worst | frac<3 | sens90 worst (n<3) | sens70')
for k in sorted(seen):
    r = seen[k]; g = r.get('ring') or {}
    c = g.get('core') or {}
    s = {x['at']: x for x in g.get('sensitivity', [])}
    s90 = s.get('90%', {}); s70 = s.get('70%', {})
    print(' | '.join(map(str, [k[0], k[1], k[2], k[3], k[4], r['media']['coarse'], r['media']['boardPx'],
          c.get('median'), c.get('worst'), c.get('fracUnder3'),
          '%s (%s)' % (s90.get('worst'), s90.get('under3')), '%s (%s)' % (s70.get('worst'), s70.get('under3'))])))
