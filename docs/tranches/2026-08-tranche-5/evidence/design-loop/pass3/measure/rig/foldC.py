import json,sys
for eng in ["chromium","webkit"]:
    j=json.load(open(f"{sys.argv[1]}/out/C-cells-{eng}.json"))
    print(f"=== LANE C cells · {eng} ===")
    cells=[k.split("/",1)[1] for k in j if k.startswith("base/")]
    for c in cells:
        b=j[f"base/{c}"]; h=j[f"head/{c}"]
        def ok(r,coarse):
            g=r["regime"]
            return (g["mqCoarse"] and not g["mqHover"] and g["sublabelBlock"]) if coarse else ((not g["mqCoarse"]) and g["mqHover"])
        coarse = c.startswith("coarse")
        print(f"{c:26s} regimeOk b={ok(b,coarse)}/h={ok(h,coarse)}  panelH {b['panelH']:8.2f} -> {h['panelH']:8.2f}  Δ={h['panelH']-b['panelH']:+7.2f}  names {b['nameCount']}->{h['nameCount']} ranks {b['byRank']}->{h['byRank']}  chipFloor {b['chipFloorMin']}->{h['chipFloorMin']}  ariaPressedMissing {b['ariaPressedMissing']}->{h['ariaPressedMissing']}  poses(panel) {b['poses']['painted']}p/{b['poses']['promoted']}wc -> {h['poses']['painted']}p/{h['poses']['promoted']}wc  estate {b['posesEstate']['painted']}/{b['posesEstate']['promoted']} -> {h['posesEstate']['painted']}/{h['posesEstate']['promoted']}")
