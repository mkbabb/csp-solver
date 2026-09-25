#!/usr/bin/env python3
"""MOT-LADDER pass 7 · the break battery through CI's EXACT invocation (`npm run lint:bands`, bare).
Every plant runs on a FRESH copy of the tree's web/frontend (shutil.copytree — nothing is deleted,
ever); the tree itself is never edited. Two regimes: D0 = BASE_REF reachable (GIT_DIR = the repo's
object store, which is what ci.yml's one-commit fetch gives CI), D1 = CI's old depth 1 (no git).
The pass-5 and pass-6 plants run FIRST (LAWS P5 F). Usage: break7.py <web/frontend> <scratch> <gitdir> [only...]"""
import os, re, sys, json, shutil, subprocess, hashlib
FE, SCR, GITDIR = sys.argv[1:4]
ONLY = set(sys.argv[4:])
os.makedirs(SCR, exist_ok=True)
KEEP = ["src", "scripts", "public", "index.html", "package.json"]
def fresh(name):
    d = os.path.join(SCR, f"atk-{name}", "web", "frontend")
    os.makedirs(d, exist_ok=True)
    for k in KEEP:
        s = os.path.join(FE, k)
        if os.path.isdir(s): shutil.copytree(s, os.path.join(d, k), dirs_exist_ok=True)
        else: shutil.copy2(s, os.path.join(d, k))
    return d
def edit(d, rel, fn):
    p = os.path.join(d, rel); t = open(p).read(); u = fn(t)
    assert u != t, f"plant did not land in {rel}"
    open(p, "w").write(u)
def sub1(old, new):
    def f(t):
        assert t.count(old) >= 1, f"anchor absent: {old[:60]!r}"
        return t.replace(old, new, 1)
    return f
def add_ledger(row):
    return sub1("const ADMITTED = [\n", "const ADMITTED = [\n  " + row + ",\n")
def restamp(d):
    j = json.load(open(os.path.join(d, "scripts/motion-bank.json")))
    s = lambda o: dict(sorted((o or {}).items()))
    dg = hashlib.sha256(json.dumps({"base": j["base"], "rungs": s(j["rungs"]), "sites": s(j["sites"]), "ts": s(j.get("ts"))}, separators=(",", ":"), ensure_ascii=False).encode()).hexdigest()
    edit(d, "scripts/check-motion-bands.mjs", lambda t: re.sub(r'const BANK_SHA256 =\s*"[0-9a-f]+";', f'const BANK_SHA256 = "{dg}";', t))
def bank(d, key, v, section="sites"):
    p = os.path.join(d, "scripts/motion-bank.json"); j = json.load(open(p)); j[section][key] = v
    open(p, "w").write(json.dumps(j, indent=2) + "\n")
CSS = "src/assets/index.css"; GATE = "scripts/check-motion-bands.mjs"; CFG = "src/pencil/config/pencilConfig.ts"
CARD = "src/pencil/chrome/GameGallery/GameCard.vue"; CARET = "src/games/futoshiki/CaretOverlay.vue"
DIGIT = "src/games/shared/DigitCell.vue"; GAL = "src/pencil/chrome/GameGallery/GameGallery.vue"
PATH = "src/pencil/grid/HandDrawnGrid/usePathAnimation.ts"; LAM = "src/pencil/sheet/AnswerKeyLaminate.vue"
REVEAL = "  .cell-reveal-animated {\n    animation: cell-reveal 0.3s var(--ease-anticipatePop);"
def total_rename(d, decoy=False):
    new = ("  .cell-reveal-animated-hold {\n    animation: cell-reveal 0.3s var(--ease-anticipatePop);\n  }\n" if decoy else "") + \
          "  @keyframes cell-pop {\n    0% {\n      transform: scale(0);\n      opacity: 0;\n    }\n    100% {\n      transform: scale(1);\n      opacity: 1;\n    }\n  }\n" + \
          "  .cell-pop {\n    animation: cell-pop var(--motion-whisper) var(--ease-anticipatePop);"
    edit(d, CSS, sub1(REVEAL, new))
    edit(d, CSS, sub1("    .cell-reveal-animated,\n", "    .cell-pop,\n"))
    edit(d, DIGIT, sub1("'cell-reveal-animated': revealArmed", "'cell-pop': revealArmed"))
P = {}
def plant(name, expect, why):
    def deco(fn): P[name] = (expect, why, fn); return fn
    return deco
# ── rows 0 ─────────────────────────────────────────────────────────────────────────────────
@plant("ROW0", 0, "the landed tree")
def _(d): pass
# ── the pass-5 plants, then pass 6's own break rows, FIRST ───────────────────────────────────
@plant("A1", 1, "pass-5 A1 verbatim: reveal 0.3s -> renamed head 0.15s, CHARACTER [150], MOVED newKey characters.refuse")
def _(d):
    edit(d, CSS, sub1(REVEAL, "  .cell-reveal-anim {\n    animation: cell-reveal 0.15s var(--ease-anticipatePop);"))
    edit(d, GATE, sub1('    ms: [300],\n    anchor: ".cell-reveal-animated",', '    ms: [150],\n    anchor: ".cell-reveal-anim {",'))
    edit(d, GATE, add_ledger('{ file: "src/assets/index.css", key: "src/assets/index.css :: .cell-reveal-animated :: cell-reveal", newKey: "MOTION.characters.refuse", ms: 300, cls: "MOVED", why: "renamed" }'))
@plant("A2", 1, "pass-5 A2 verbatim: bank 300 -> 150 + css 0.15s + CHARACTER [150] (no re-stamp)")
def _(d):
    edit(d, CSS, sub1(REVEAL, REVEAL.replace("0.3s", "0.15s")))
    edit(d, GATE, sub1('    ms: [300],\n    anchor: ".cell-reveal-animated",', '    ms: [150],\n    anchor: ".cell-reveal-animated",'))
    bank(d, "src/assets/index.css :: .cell-reveal-animated :: cell-reveal", 150)
@plant("A2b", 1, "pass-6 A2b: the same and BANK_SHA256 re-stamped")
def _(d):
    P["A2"][2](d); restamp(d)
@plant("A3", 1, "pass-5 A3 verbatim: CaretOverlay's one length leaves for index.css at whisper, zero rows")
def _(d):
    def cut(v):
        i = v.index("@media (prefers-reduced-motion: no-preference) {\n  .board-leaving .caret-layer"); j = v.index("}\n}\n", i) + 4
        return v[:i] + v[j:]
    edit(d, CARET, cut)
    edit(d, CSS, lambda c: c + "\n@media (prefers-reduced-motion: no-preference) {\n  .board-leaving .caret-layer {\n    opacity: 0;\n    transition: opacity var(--motion-whisper) var(--verb-lift-ease);\n  }\n}\n")
@plant("C4", 1, "clause 4: @property --motion-throw { inherits: false }")
def _(d): edit(d, CSS, lambda c: re.sub(r"(@property --motion-throw \{[^}]*inherits:\s*)true", r"\g<1>false", c, count=1))
@plant("C5", 1, "GC1: --live-fit initial 0 -> 0.99")
def _(d): edit(d, CSS, lambda c: re.sub(r"(@property --live-fit \{[^}]*initial-value:\s*)0", r"\g<1>0.99", c, count=1))
@plant("C6", 1, "value law: MOTION.dealStaggerMs 90 -> 10")
def _(d): edit(d, CFG, sub1("  dealStaggerMs: 90,", "  dealStaggerMs: 10,"))
@plant("C13", 1, "plant P5: --ease-starTuck: ease-in")
def _(d): edit(d, CSS, lambda c: re.sub(r"--ease-starTuck: cubic-bezier\(0\.42, 0, 1, 1\);", "--ease-starTuck: ease-in;", c, count=1))
@plant("P5-3", 1, "rise 520 -> 100 behind the valued RETUNE row")
def _(d): edit(d, CFG, sub1("    rise: 520,", "    rise: 100,"))
@plant("P5-7", 1, "GC1: var(--live-fit, 1) at GameCard")
def _(d): edit(d, CARD, sub1("scale(var(--live-fit));", "scale(var(--live-fit, 1));"))
# ── the pass-6 critic's attacks ──────────────────────────────────────────────────────────────
@plant("X2ctl", 1, "--ease-standard: ease-in (negative control)")
def _(d): edit(d, CSS, sub1("--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);", "--ease-standard: ease-in;"))
for nm, v in [("X2a", "EASE-IN"), ("X2b", "linear(0, 1)"), ("X2c", "var(--ease-nope, ease-in)"), ("X2d", "CUBIC-BEZIER(0.42, 0, 1, 1)")]:
    def mk(v):
        return lambda d: edit(d, CSS, sub1("--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);", f"--ease-standard: {v};"))
    P[nm] = (1, f"--ease-standard: {v}", mk(v))
@plant("X2e", 1, "transition-timing-function: ease-in !important after the dusk shorthand")
def _(d): edit(d, CSS, sub1("        color var(--motion-dusk) var(--verb-dusk-ease) !important;\n", "        color var(--motion-dusk) var(--verb-dusk-ease) !important;\n      transition-timing-function: ease-in !important;\n"))
@plant("X3", 1, "scale(max(var(--live-fit), 0.99))")
def _(d): edit(d, CARD, sub1("scale(var(--live-fit))", "scale(max(var(--live-fit), 0.99))"))
@plant("X3ctl", 1, "scale(var(--live-fit, 0.99))")
def _(d): edit(d, CARD, sub1("scale(var(--live-fit))", "scale(var(--live-fit, 0.99))"))
@plant("X4", 1, "usePathAnimation: duration: MOTION.rungs.whisper / 3")
def _(d): edit(d, PATH, sub1("duration: MOTION.rungs.whisper,", "duration: MOTION.rungs.whisper / 3,"))
@plant("X5", 1, "GameGallery: MOTION.dealStaggerMs / 9")
def _(d): edit(d, GAL, sub1("const stagger = MOTION.dealStaggerMs;", "const stagger = MOTION.dealStaggerMs / 9;"))
@plant("X6", 1, "a second @property --motion-throw { inherits: false } in an SFC <style>")
def _(d): edit(d, LAM, lambda v: v + '\n<style>\n@property --motion-throw { syntax: "<time>"; inherits: false; initial-value: 0ms; }\n</style>\n')
@plant("X7", 1, "the dead decoy keeps cell-reveal 0.3s; the real reveal renamed whole to .cell-pop at whisper")
def _(d):
    total_rename(d, decoy=True)
    edit(d, GATE, add_ledger('{ file: "src/assets/index.css", key: "src/assets/index.css :: .cell-reveal-animated :: cell-reveal", newKey: "src/assets/index.css :: .cell-reveal-animated-hold :: cell-reveal", ms: 300, cls: "MOVED", why: "renamed" }'))
@plant("X7p", 1, "X7 with the decoy's class planted as a live string in DigitCell.vue")
def _(d):
    P["X7"][2](d)
    edit(d, DIGIT, sub1("'cell-pop': revealArmed", "'cell-pop': revealArmed,\n        'cell-reveal-animated-hold': false"))
@plant("A2c", 1, "CaretOverlay leave -> whisper, bank 200 -> 150, BANK_SHA256 re-stamped (3 lines)")
def _(d):
    edit(d, CARET, sub1("transition: opacity var(--motion-leave) var(--verb-lift-ease);", "transition: opacity var(--motion-whisper) var(--verb-lift-ease);"))
    bank(d, "src/games/futoshiki/CaretOverlay.vue :: .board-leaving .caret-layer :: opacity", 150); restamp(d)
@plant("X8", 0, "LAWFUL: CaretOverlay's one site deleted, a DELETED row with ms 200 (pass 6: TypeError)")
def _(d):
    edit(d, CARET, sub1("\n    transition: opacity var(--motion-leave) var(--verb-lift-ease);", ""))
    edit(d, GATE, add_ledger('{ key: "src/games/futoshiki/CaretOverlay.vue :: .board-leaving .caret-layer :: opacity", ms: 200, cls: "DELETED", why: "the caret layer left the product — pass7/prototype/MOT-LADDER census" }'))
@plant("X1", 1, "the total rename onto whisper behind a DELETED row carrying 300")
def _(d):
    total_rename(d)
    edit(d, GATE, sub1('  {\n    file: "src/assets/index.css",\n    ms: [300],\n    anchor: ".cell-reveal-animated",', '  { key: "src/assets/index.css :: .cell-reveal-animated :: cell-reveal", ms: 300, cls: "DELETED", why: "retired" },\n  {\n    file: "src/assets/index.css",\n    ms: [150],\n    anchor: ".cell-pop {",'))
# ── pass 7's own ─────────────────────────────────────────────────────────────────────────────
@plant("T1", 1, "typography.css: a second @property --motion-whisper { inherits: false } (LAWS P6 §F)")
def _(d): edit(d, "src/assets/typography.css", lambda c: c + '\n@property --motion-whisper {\n  syntax: "<time>";\n  inherits: false;\n  initial-value: 0ms;\n}\n')
@plant("T2", 1, "public/peer.css registers --motion-throw")
def _(d): open(os.path.join(d, "public/peer.css"), "w").write('@property --motion-throw { syntax: "<time>"; inherits: false; initial-value: 0ms; }\n')
@plant("T3", 1, "index.html <style> registers --live-fit at 0.99")
def _(d): edit(d, "index.html", sub1("</head>", '<style>@property --live-fit { syntax: "<number>"; inherits: true; initial-value: 0.99; }</style></head>'))
@plant("T4", 1, "INTAKE-23 row 18: gridSubgrid 280 -> 250 and gridCell 200 -> 150, undocumented")
def _(d):
    edit(d, CFG, sub1("    duration: 280,", "    duration: 250,"))
    edit(d, CFG, sub1("  gridCell: {\n    duration: 200,", "  gridCell: {\n    duration: 150,"))
@plant("T4ok", 0, "LAWFUL: the same two as DELIBERATE shortenings, RETUNE rows citing INTAKE-23 §1 D9")
def _(d):
    P["T4"][2](d)
    for k, v in [("gridSubgrid", 250), ("gridCell", 150)]:
        edit(d, GATE, add_ledger(f'{{ ts: "DRAW_IN_PRESETS.{k}.duration", to: {v}, cls: "RETUNE", why: "the hand\'s tier (arm Q) — INTAKE-23 §1 D9, census/drawin" }}'))
@plant("T4n", 1, "the same with RETUNE rows that cite nothing")
def _(d):
    P["T4"][2](d)
    for k, v in [("gridSubgrid", 250), ("gridCell", 150)]:
        edit(d, GATE, add_ledger(f'{{ ts: "DRAW_IN_PRESETS.{k}.duration", to: {v}, cls: "RETUNE", why: "tuned by eye" }}'))
@plant("T5", 1, "INTAKE-23 row 17: MOTION gains hand: { stepMs: 17 } (a nested clock with no home)")
def _(d): edit(d, CFG, sub1("  dealStaggerMs: 90,", "  dealStaggerMs: 90,\n  hand: { stepMs: 17, lift: 0.6 },"))
@plant("T6", 1, "a script write: el.style.transitionTimingFunction = \"ease-in\"")
def _(d): edit(d, PATH, lambda v: v + '\nexport function plantT6(el: HTMLElement) {\n  el.style.transitionTimingFunction = "ease-in";\n}\n')
@plant("T7", 1, "public/: a longhand transition-timing-function: EASE-IN")
def _(d): open(os.path.join(d, "public/peer.css"), "w").write(".peer { transition-timing-function: EASE-IN; }\n")
@plant("T8", 1, "an admission row (GRADED) written with a numeric ms: class and shape disagree")
def _(d): edit(d, GATE, add_ledger('{ file: "src/x.css", ms: 200, anchor: "x", cls: "GRADED", why: "shape" }'))
@plant("T9", 1, "INTAKE-23 row 19: a --storybook-hinge-dark: 343ms literal typed into index.css (a second home)")
def _(d): edit(d, CSS, sub1("  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);", "  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);\n  --storybook-hinge-dark: 343ms;"))
@plant("T10", 1, "INTAKE-23 row 19: a component publishes '--storybook-beat' through :style")
def _(d): edit(d, "src/games/shared/GameBoard.vue", sub1('{ "--refuse-dur": ', '{ "--storybook-beat": "125ms", "--refuse-dur": '))
@plant("T11", 1, "B13 through a derived name on one line: Math.round(MOTION.rungs.throw * 0.42) / 4 in the deal")
def _(d): edit(d, GAL, sub1("const base = Math.round(MOTION.rungs.throw * (DEAL_AFTER_SETTLE ? 1 : 0.42));", "const base = Math.round(MOTION.rungs.throw * (DEAL_AFTER_SETTLE ? 1 : 0.42)) / 4;"))
@plant("T12", 1, "B13 through an object-literal GROUP alias: the draw-in runs at duration: preset.duration / 2")
def _(d): edit(d, PATH, sub1("          duration: preset.duration,", "          duration: preset.duration / 2,"))
@plant("FINAL", 0, "the landed tree again")
def _(d): pass

def run(d, regime):
    env = dict(os.environ)
    env.pop("GIT_DIR", None)
    if regime == "D0": env["GIT_DIR"] = GITDIR
    r = subprocess.run(["npm", "run", "--silent", "lint:bands"], cwd=d, env=env, capture_output=True, text=True)
    out = r.stdout + r.stderr
    reds = [l.strip() for l in out.splitlines() if re.match(r"^\s+✗ ", l)]
    why = [l.strip()[:200] for l in out.splitlines() if l.startswith("  • ")][:2]
    return r.returncode, reds, why, out
rows = []
for name, (expect, desc, fn) in P.items():
    if ONLY and name not in ONLY: continue
    d = fresh(name)
    fn(d)
    for regime in (["D0", "D1"] if name in ("ROW0", "A2c", "FINAL") else ["D0"]):
        rc, reds, why, out = run(d, regime)
        exp = expect if regime == "D0" else 1
        ok = "as expected" if rc == exp else "UNEXPECTED"
        open(os.path.join(SCR, f"out-{name}-{regime}.log"), "w").write(out)
        print(f"{name:6} {regime}  exit {rc} (expect {exp}) {ok}  :: {desc}")
        for r_ in reds: print(f"        {r_}")
        for w in why: print(f"        {w}")
        rows.append((name, regime, rc, exp))
        if name.startswith("X2") and regime == "D0":
            side = []
            for label, cmd in [("verbs", ["npm", "run", "--silent", "lint:verbs"]), ("contract", ["node", "scripts/check-motion-contract.mjs"]), ("tokens", ["node", "scripts/check-theme-tokens.mjs"])]:
                env = dict(os.environ); env["GIT_DIR"] = GITDIR
                side.append(f"{label}={subprocess.run(cmd, cwd=d, env=env, capture_output=True, text=True).returncode}")
            print("        beside it: " + " ".join(side))
bad = [r for r in rows if r[2] != r[3]]
print(f"\n{len(rows)} rows, {len(rows) - len(bad)} as expected, {len(bad)} unexpected")
sys.exit(1 if bad else 0)
