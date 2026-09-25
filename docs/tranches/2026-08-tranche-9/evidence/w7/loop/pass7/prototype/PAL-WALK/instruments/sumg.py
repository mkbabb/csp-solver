import sys, re, glob, os
# sumg.py <tag> — per config: clean rows green/red, required plants red/holes, printed readings, exit
tag = sys.argv[1]; S = os.path.dirname(os.path.abspath(__file__))
for f in sorted(glob.glob(f"{S}/logs/{tag}-*.log")):
    L = open(f).read().splitlines()
    ex = next((l for l in L if l.startswith("EXIT=")), "EXIT=?")
    clean = [l for l in L if re.search(r'" in (oklch|rgb)', l)]
    cg = sum("→ GREEN" in l for l in clean); cr = [l for l in clean if "→ RED" in l]
    pl = [l for l in L if re.search(r"\bPLANT ", l)]
    pr = sum("→ RED" in l for l in pl); holes = [l for l in pl if "GREEN (a hole)" in l]
    rd = [l for l in L if re.search(r"\bREADING (FADE|PAPER|FAINT|TAIL|EMPTY)", l)]
    rdr = sum("→ RED" in l for l in rd)
    fails = [l.strip() for l in L if re.search(r"^\s+\d+\) |✘|Error:", l)][:4]
    pas = next((l.strip() for l in L if re.search(r"\d+ (passed|failed)", l)), "")
    print(f"{os.path.basename(f)[:-4]:26s} {ex} · clean {cg} GREEN / {len(cr)} RED · required plants {pr}/{len(pl)} RED, holes {len(holes)} · printed readings {len(rd)} ({rdr} red) · {pas}")
    for l in cr[:3]: print("   CLEAN RED:", re.sub(r'.*?(\[[^]]+\].*?cell \d+).*(→ RED.*)', r'\1 \2', l)[:220])
    for l in holes[:3]: print("   HOLE:", l[:220])
