#!/usr/bin/env python3
"""MOT-LADDER pass-7 CRITIC plants — new attacks, through CI's exact `npm run lint:bands`, D0 (base
reachable through GIT_DIR = a depth-1 clone that fetched 74a2b5d9 by SHA, i.e. ci.yml's regime).
Fresh copy per plant; the tree is never edited. Usage: crit7.py <fe> <scratch> <gitdir> [only...]"""
import os, re, sys, json, shutil, subprocess, hashlib
FE, SCR, GITDIR = sys.argv[1:4]; ONLY = set(sys.argv[4:])
KEEP = ["src", "scripts", "public", "e2e", "index.html", "package.json", "eslint.config.js", "tsconfig.json", "tsconfig.node.json", "tsconfig.e2e.json", "env.d.ts", "config-node.d.ts", "vite.config.ts", "playwright.config.ts", "knip.json", ".prettierrc.json", ".prettierignore"]
def fresh(name):
    d = os.path.join(SCR, f"c-{name}", "web", "frontend"); os.makedirs(d, exist_ok=True)
    for k in KEEP:
        s = os.path.join(FE, k)
        if os.path.isdir(s): shutil.copytree(s, os.path.join(d, k), dirs_exist_ok=True)
        else: shutil.copy2(s, os.path.join(d, k))
    nm = os.path.join(d, "node_modules")
    if not os.path.exists(nm): os.symlink(os.path.join(FE, "node_modules"), nm)
    return d
def edit(d, rel, fn):
    p = os.path.join(d, rel); t = open(p).read(); u = fn(t); assert u != t, f"plant did not land in {rel}"; open(p, "w").write(u)
def sub1(old, new):
    def f(t):
        assert old in t, f"anchor absent: {old[:60]!r}"; return t.replace(old, new, 1)
    return f
def restamp(d):
    j = json.load(open(os.path.join(d, "scripts/motion-bank.json"))); s = lambda o: dict(sorted((o or {}).items()))
    dg = hashlib.sha256(json.dumps({"base": j["base"], "rungs": s(j["rungs"]), "sites": s(j["sites"]), "ts": s(j.get("ts"))}, separators=(",", ":"), ensure_ascii=False).encode()).hexdigest()
    edit(d, "scripts/check-motion-bands.mjs", lambda t: re.sub(r'const BANK_SHA256 =\s*"[0-9a-f]+";', f'const BANK_SHA256 = "{dg}";', t))
def bank(d, key, v, section):
    p = os.path.join(d, "scripts/motion-bank.json"); j = json.load(open(p)); j[section][key] = v; open(p, "w").write(json.dumps(j, indent=2) + "\n")
CSS="src/assets/index.css"; CFG="src/pencil/config/pencilConfig.ts"; CARD="src/pencil/chrome/GameGallery/GameCard.vue"
PATH="src/pencil/grid/HandDrawnGrid/usePathAnimation.ts"; LAM="src/pencil/sheet/AnswerKeyLaminate.vue"; APP="src/App.vue"; SCENE="src/games/shared/scene.css"
REVEAL="  .cell-reveal-animated {\n    animation: cell-reveal 0.3s var(--ease-anticipatePop);\n"
P = {}
def plant(name, expect, why):
    def deco(fn): P[name] = (expect, why, fn); return fn
    return deco
@plant("R0", 0, "the landed tree (control of the harness)")
def _(d): pass
# ── the ratchet: shortenings through doors the pass-7 cure did not name ───────────────────────
for rk, (a, b) in {"whisper": (150, 140), "leave": (200, 190), "note": (250, 240), "dusk": (350, 340), "step": (440, 430), "throw": (520, 510), "rise": (600, 590)}.items():
    def mk(rk=rk, a=a, b=b):
        def f(d):
            edit(d, CFG, sub1(f"    {rk}: {a},", f"    {rk}: {b},")); bank(d, rk, b, "rungs"); restamp(d)
        return f
    P[f"K-{rk}"] = (1, f"RUNG RE-STAMP: MOTION.rungs.{rk} {a} -> {b} + bank.rungs.{rk} {b} + BANK_SHA256 re-stamped (3 lines; rungs have no base floor)", mk())
@plant("L1", 1, "LONGHAND DURATION in the banked rule: `animation-duration: var(--motion-whisper)` after the 0.3s shorthand (cell reveal 300 -> 150)")
def _(d): edit(d, CSS, sub1(REVEAL, REVEAL + "    animation-duration: var(--motion-whisper);\n"))
@plant("L2", 1, "LONGHAND DURATION in another sheet: scene.css `.cell-reveal-animated { animation-duration: var(--motion-whisper); }`")
def _(d): edit(d, SCENE, lambda t: t + "\n.cell-reveal-animated {\n  animation-duration: var(--motion-whisper);\n}\n")
@plant("L3", 1, "NO SEMICOLON: index.css `.cell-reveal-animated { animation-duration: 50ms }` (last declaration, legal CSS)")
def _(d): edit(d, CSS, lambda t: t + "\n.cell-reveal-animated { animation-duration: 50ms }\n")
@plant("L4", 1, "index.html <style>: `.cell-reveal-animated{animation-duration:50ms;}` (a shipped stylesheet outside src/)")
def _(d): edit(d, "index.html", sub1("  </head>", "    <style>.cell-reveal-animated{animation-duration:50ms;}</style>\n  </head>"))
@plant("L5", 1, "TS CONSUMER RUNG SWAP: AnswerKeyLaminate `LIFT_MS = MOTION.rungs.leave` -> `.whisper` (200 -> 150, no arithmetic)")
def _(d): edit(d, LAM, sub1("const LIFT_MS = MOTION.rungs.leave;", "const LIFT_MS = MOTION.rungs.whisper;"))
@plant("L6", 1, "TS CONSUMER RUNG SWAP: App.vue beat-0 `}, MOTION.rungs.leave);` -> `.whisper`")
def _(d): edit(d, APP, sub1("}, MOTION.rungs.leave);", "}, MOTION.rungs.whisper);"))
@plant("M1", 1, "B13 by CLAMP: usePathAnimation `duration: Math.min(MOTION.rungs.whisper, 40)` (a 40 ms WAAPI clock, no operator)")
def _(d): edit(d, PATH, sub1("        duration: MOTION.rungs.whisper,", "        duration: Math.min(MOTION.rungs.whisper, 40),"))
@plant("M2", 1, "B13 by BRACKET: `duration: MOTION.rungs[\"whisper\"] / 3`")
def _(d): edit(d, PATH, sub1("        duration: MOTION.rungs.whisper,", "        duration: MOTION.rungs[\"whisper\"] / 3,"))
@plant("M3", 1, "B13 by SHIFT: `duration: MOTION.rungs.whisper >> 2` (37 ms)")
def _(d): edit(d, PATH, sub1("        duration: MOTION.rungs.whisper,", "        duration: MOTION.rungs.whisper >> 2,"))
@plant("M4", 1, "B13 by LET alias: `let w = MOTION.rungs.whisper;` then `duration: w / 3`")
def _(d):
    edit(d, PATH, sub1("        duration: MOTION.rungs.whisper,", "        duration: w / 3,"))
    edit(d, PATH, sub1("      return {\n        el,", "      let w = MOTION.rungs.whisper;\n      return {\n        el,"))
@plant("F1", 1, "GC1 by a CSS DEFAULT: `--live-fit: 0.99;` declared in GameCard's .live-face-fit rule (paints a board with no fit measured)")
def _(d): edit(d, CARD, sub1("  transform: translate(-50%, -50%) scale(var(--live-fit));", "  --live-fit: 0.99;\n  transform: translate(-50%, -50%) scale(var(--live-fit));"))
@plant("F2", 1, "GC1 by a PUBLISHER fallback: App.vue setProperty('--live-fit', String(Math.min(...) || 0.99))")
def _(d): edit(d, APP, sub1('String(Math.min(faceW / bw, faceH / bh))', 'String(Math.min(faceW / bw, faceH / bh) || 0.99)'))
@plant("E1", 1, "B8 by a SCRIPT-PUBLISHED curve token: main.ts setProperty('--ease-anticipatePop', 'ease-in')")
def _(d): edit(d, "src/main.ts", lambda t: t + '\ndocument.documentElement.style.setProperty("--ease-anticipatePop", "ease-in");\n')
@plant("E2", 1, "B8 near-keyword: --ease-anticipatePop re-declared `cubic-bezier(0.42, 0, 1, 0.9999)` in scene.css (ease-in to 1e-4)")
def _(d): edit(d, SCENE, lambda t: t + "\n:root {\n  --ease-anticipatePop: cubic-bezier(0.42, 0, 1, 0.9999);\n}\n")
@plant("E3", 1, "B8 via ANIMATION shorthand keyword: `.cell-reveal-animated` animation curve -> ease-in")
def _(d): edit(d, CSS, sub1("animation: cell-reveal 0.3s var(--ease-anticipatePop);", "animation: cell-reveal 0.3s ease-in;"))
@plant("L7a", 1, "COMPOUND OVERRIDE, full shorthand: index.css `html .cell-reveal-animated { animation: cell-reveal var(--motion-whisper) var(--ease-anticipatePop); }` (a new key on the banked SUBJECT)")
def _(d): edit(d, CSS, lambda t: t + "\nhtml .cell-reveal-animated {\n  animation: cell-reveal var(--motion-whisper) var(--ease-anticipatePop);\n}\n")
@plant("L7b", 1, "COMPOUND OVERRIDE in another sheet: scene.css `.cell.cell-reveal-animated { animation: cell-reveal var(--motion-whisper) var(--ease-anticipatePop); }`")
def _(d): edit(d, SCENE, lambda t: t + "\n.cell.cell-reveal-animated {\n  animation: cell-reveal var(--motion-whisper) var(--ease-anticipatePop);\n}\n")
@plant("R1", 0, "the landed tree again")
def _(d): pass
def run(d):
    env = dict(os.environ); env["GIT_DIR"] = GITDIR
    r = subprocess.run(["npm", "run", "--silent", "lint:bands"], cwd=d, env=env, capture_output=True, text=True)
    return r.returncode, (r.stdout + r.stderr)
SIDE = [("propblock", ["node", "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs", "--fe", "."]), ("census", ["node", "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/undefined-token-census.mjs"]), ("verbs", ["npm", "run", "--silent", "lint:verbs"]), ("motion", ["npm", "run", "--silent", "lint:motion"]), ("tokens", ["npm", "run", "--silent", "lint:theme-tokens"])]
bad = []
for name, (exp, why, fn) in P.items():
    if ONLY and name not in ONLY: continue
    d = fresh(name)
    try: fn(d)
    except AssertionError as e: print(f"{name:10} PLANT FAILED {e}", flush=True); bad.append(name); continue
    rc, out = run(d)
    reds = [l.strip() for l in out.splitlines() if l.strip().startswith("•")][:3]
    side = []
    if name not in ("R0", "R1"):
        for lab, cmd in SIDE:
            env = dict(os.environ); env["GIT_DIR"] = GITDIR; env["FE"] = d
            side.append(f"{lab}={subprocess.run(cmd, cwd=d, env=env, capture_output=True, text=True).returncode}")
    ok = "as expected" if rc == exp else "** HOLE **"
    if rc != exp: bad.append(name)
    print(f"{name:10} bands exit {rc} (a lawful gate: {exp}) {ok}  {' '.join(side)}  :: {why}", flush=True)
    for r_ in reds: print(f"             {r_[:200]}", flush=True)
print(f"\n{len(P) if not ONLY else len(ONLY)} rows; unexpected: {bad}", flush=True)
