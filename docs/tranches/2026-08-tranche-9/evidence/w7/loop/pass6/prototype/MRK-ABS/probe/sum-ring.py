import json,sys,glob
rows=[]
for f in sys.argv[1:]: rows+=json.load(open(f))
def sens(h,at): 
    s=[x for x in h["sensitivity"] if abs(x["at"]-at)<1e-9][0]; return f'{s["worst"]} {s["underInclDropped"]}/60 (n{s["n"]})'
print("engine dpr arm theme cell | L left worst | L whole under/240 (unpainted) | L sides worst/under | H core med / worst / under incl dropped | H 2nd-photo worst | H sens 90% (worst, under incl dropped/60, n counted) | H sens 70%")
for r in rows:
    L=r["L"]; s=L["sides"]
    print(f'{r["engine"]:8} {r["dpr"]} {r["arm"]:4} {r["theme"]:5} {r["on"]:5} | {s["left"]["worst"]} | {L["whole"]["under"]}/240 ({L["whole"]["unpainted"]}) | T {s["top"]["worst"]}/{s["top"]["under"]} R {s["right"]["worst"]}/{s["right"]["under"]} B {s["bottom"]["worst"]}/{s["bottom"]["under"]} L {s["left"]["worst"]}/{s["left"]["under"]} | {r["H1"]["core"]["median"]} / {r["H1"]["core"]["worst"]} / {r["H1"]["core"]["underInclDropped"]}/60 | {r["H2"]["core"]["worst"]} | {sens(r["H1"],0.9)} | {sens(r["H1"],0.7)}')
