# Serve dir for the painted census: every arm as <arm>.svg plus <arm>-ng.svg (the paper alone, the
# coverage ground), main's favicon.svg as the in-run control (+ -nf, its filter removed).
# usage: python3 prep.py <worktree> <main-favicon.svg> <census strip.html> <out dir>
import sys, re, os, shutil
wt, mainfav, strip, out = sys.argv[1:5]
os.makedirs(out, exist_ok=True)
A = f"{wt}/docs/tranches/2026-08-tranche-9/evidence/w7/intake-owner-2026-09-23/prototype/G-FAVICON/arms"
arms = {
    "W": f"{wt}/web/frontend/public/icon.svg",
    "B": f"{A}/icon-armB.svg",
    "P": f"{A}/icon-printed.svg",
    "fable": f"{A}/fable-icon.svg",
    "opus": f"{A}/opus-icon.svg",
}
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
