# TAB-PEN pass 7: the intake's prep.py (prototype/G-FAVICON/instruments/prep.py) re-pointed. Serve dir for the painted
# census: every arm as <arm>.svg plus <arm>-ng.svg (the paper alone, the coverage ground), main's favicon.svg as the
# in-run control (+ -nf, its filter removed). Arm H is the tree's own template with ARM = "H" (scripts/icons.mjs).
# usage: python3 prep7.py <tree web/frontend> <H svg> <intake G-FAVICON dir> <main favicon.svg> <strip.html> <out dir>
import sys, re, os, shutil
wt, hsvg, A, mainfav, strip, out = sys.argv[1:7]
os.makedirs(out, exist_ok=True)
arms = {"W": f"{wt}/public/icon.svg", "H": hsvg, "B": f"{A}/arms/icon-armB.svg", "P": f"{A}/arms/icon-printed.svg",
        "fable": f"{A}/arms/fable-icon.svg", "opus": f"{A}/arms/opus-icon.svg"}
for k, p in arms.items():
    s = open(p).read()
    open(f"{out}/{k}.svg", "w").write(s)
    open(f"{out}/{k}-ng.svg", "w").write(re.sub(r"<path\b[^>]*/>", "", s))
m = open(mainfav).read()
open(f"{out}/main.svg", "w").write(m)
open(f"{out}/main-ng.svg", "w").write(re.sub(r"<g clip-path[\s\S]*?</g>\s*</g>", "", m))
open(f"{out}/main-nf.svg", "w").write(m.replace(' filter="url(#w)"', ""))
shutil.copy(strip, f"{out}/strip.html")
print(sorted(os.listdir(out)))
