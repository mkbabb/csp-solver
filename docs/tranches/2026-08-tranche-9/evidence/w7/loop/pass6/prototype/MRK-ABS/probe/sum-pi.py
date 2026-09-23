import json,sys
CLAIMED = {  # the diff's own deltas, by (node key suffix, prop)
 "outline-color": "the base `* { outline-ring/50 }` deleted (every node) + the token ink",
}
CLAIM_NODE = {
 ("path.cell-ghost-path","stroke-opacity"): "tier 2 0.9 -> 0.95 (MRK-LIVE's rank)",
 ("div.game-cell","outline-offset"): "the struck .sudoku-cell:focus-within (outline none on both arms)",
 ("div.game-cell","border-radius"): "the struck .sudoku-cell:focus-within radius",
 ("div.game-cell","background-color"): "the struck .sudoku-cell:focus-within background",
 ("input.cell-native-input","outline-width"): "input ring: none on both arms",
 ("input.cell-native-input","outline-offset"): "input ring: none on both arms",
 ("div.game-card","outline-offset"): "deck card 4 -> token 3",
 ("div.game-card","border-radius"): "deck card radius struck",
 ("div.live-face-slot","border-radius"): "inherits the struck deck radius",
 ("div.gallery-viewport","outline-width"): "the viewport's own ring: none on both arms",
 ("div.gallery-viewport","outline-offset"): "the viewport's own ring: none on both arms",
 ("div.gallery-viewport","outline-style"): "the viewport's own ring",
}
for f in sys.argv[1:]:
    d=json.load(open(f)); e=d["engine"]
    for pose,v in d.items():
        if not isinstance(v,dict) or "controlVsLane" not in v: continue
        lv, cc = v["controlVsLane"], v["controlVsControl"]
        oc = sum(n for k,n in lv["paint"].items() if k.endswith(":: outline-color"))
        claimed=[]; unclaimed=[]
        for k,n in lv["paint"].items():
            node,prop=k.split(" :: ")
            if prop=="outline-color": continue
            why=CLAIM_NODE.get((node,prop))
            (claimed if why else unclaimed).append(f"{node} {prop} x{n} ({lv['ex'][k]})" + (f" [{why}]" if why else "") + (f" [C-v-C x{cc['paint'][k]}]" if k in cc["paint"] else ""))
        print(f"{e} {pose}: nodes {lv['nodes']} unmatched {lv['onlyA']}/{lv['onlyB']} (C-v-C {cc['onlyA']}/{cc['onlyB']}) | outline-color x{oc} | C-v-C paint keys {len(cc['paint'])} rect keys {len(cc['rect'])}")
        for c in claimed: print("   CLAIMED", c)
        for u in unclaimed: print("   UNCLAIMED", u)
        rects = {k:x for k,x in lv["rect"].items()}
        if rects: print("   RECT", ", ".join(f"{k} {x}" + (f" [C-v-C {cc['rect'][k]}]" if k in cc['rect'] else "") for k,x in rects.items()))
        if lv["onlyEx"]: print("   UNMATCHED e.g.", " | ".join(lv["onlyEx"][:4]))
