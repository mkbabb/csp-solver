# sum.py <log> : per G14 cell — clean fractions vs control, bound, pin interval, near rungs; plus STATE / PLUS / QUIET / WIDE lines
import json, sys, re
for line in open(sys.argv[1], errors="replace"):
    line = line.strip()
    for tag in ("G14 ", "G14-PIN ", "STATE ", "PLUS ", "QUIET ", "G16 "):
        if line.startswith(tag):
            d = json.loads(line[len(tag):])
            if tag == "G14 ":
                out = []
                for q, l in d["lines"].items():
                    cu = re.search(r"<4\.5 ([\d.]+)", l["clean"]); ct = re.search(r"<4\.5 ([\d.]+)", l["control"])
                    out.append(f"{q} {cu and cu.group(1)}/{ct and ct.group(1)} b{l['bound']:.3f} printed{l['printed']} gated{l['gated']}")
                print("G14", d["engine"], d["cell"], "ctl", [c.split('/')[-1] for c in d["control"]], "chart", d["roomState"]["chart"], "rows", d["rows"], "|", " ; ".join(out))
            elif tag == "G14-PIN ":
                print("PIN", d["engine"], d["cell"], "slack", d["slack"], "held in", (d["pin"]["inside"], d["pin"]["past"]), "near", len(d["near"]), "inside", sum(1 for r in d["near"] if not r["past"]), "past", sum(1 for r in d["near"] if r["past"]), "wrong", sum(1 for r in d["near"] if r["past"] != r["g3"]))
            elif tag == "G16 ":
                print("G16", d["engine"], d["theme"], "one", d.get("onePoses"), "five", d.get("five"), "7:", d["table"].get("7"), "6:", d["table"].get("6"))
            else:
                print(tag.strip(), json.dumps(d)[:400])
