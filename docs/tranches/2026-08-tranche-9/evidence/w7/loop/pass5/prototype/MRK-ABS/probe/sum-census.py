# Summarise census-*.json into one classified table (banked; the raw JSON is summarised, not banked whole).
import json, glob, os, sys
L = os.path.dirname(os.path.abspath(__file__)).replace('/probe', '/logs')
out = []
for f in sorted(glob.glob(L + '/census-*.json')):
    d = json.load(open(f)); tag = os.path.basename(f)[7:-5]
    for theme in ('light', 'dark'):
        for route in ('home', 'deck', 'guard'):
            rows = d.get(theme, {}).get(route)
            if not isinstance(rows, list): out.append(f"{tag:22} {theme:5} {route:5} {rows}"); continue
            for r in rows:
                if r.get('key') == 'input.cell-native-input': continue
                c = r.get('core') or {}; s = {x['at']: f"{x['worst']}({x['under3']})" for x in (r.get('sensitivity') or [])}
                out.append(f"{tag:22} {theme:5} {route:5} {r['key'][:42]:42} {str(r.get('outline',''))[:34]:34} worst {c.get('worst','-')!s:6} p30 {c.get('p30','-')!s:6} med {c.get('median','-')!s:6} f<3 {c.get('fracUnder3','-')!s:5} 90% {s.get('90%','-'):12} owner {r.get('groundOwner','-')}")
print('\n'.join(out))
