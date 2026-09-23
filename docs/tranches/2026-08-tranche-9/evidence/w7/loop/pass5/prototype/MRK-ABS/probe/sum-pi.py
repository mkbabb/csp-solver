# Classify pi-*.json: lane-vs-control paint deltas by PROPERTY, each checked against the same run's
# control-vs-control (head-vs-head) floor; rect deltas by class with the head-vs-head floor beside.
import json, glob, os, collections
L = os.path.dirname(os.path.abspath(__file__)).replace('/probe', '/logs')
for f in sorted(glob.glob(L + '/pi-*.json')):
    d = json.load(open(f))
    for th in ('light', 'dark'):
        lv, cc = d[th]['laneVsControl'], d[th]['controlVsControl']
        byProp = collections.Counter(); noise = collections.Counter()
        for k, n in lv['paint'].items(): byProp[k.rsplit(' ', 1)[1]] += n
        for k, n in cc['paint'].items(): noise[k.rsplit(' ', 1)[1]] += n
        unexplained = {k: n for k, n in lv['paint'].items() if not k.endswith(' outline-color') and k not in cc['paint']}
        rects = {k: v for k, v in lv['rect'].items() if k not in cc['rect']}
        print(f"{os.path.basename(f)[3:-5]:18} {th:5} nodes {lv['nodes']} tags {lv['tagSame']} | L-v-C by prop {dict(byProp)} | C-v-C by prop {dict(noise)} rectMax {cc['rectMax']} | L-v-C rectMax {lv['rectMax']}")
        print(f"   unexplained paint (not outline-color, not in C-v-C): {unexplained}")
        print(f"   rect deltas not in C-v-C: {rects}")
