#!/usr/bin/env python3
"""PLR-COUNT pass 5 — the break battery. Each break edits ONE product file on the work tree, runs
the LANDED row it should red (both engines, dev :4242), restores the file byte-for-byte and checks
its sha1. Usage: breaks.py <name>... (default: all). Output: one EXIT line per break."""
import hashlib, os, subprocess, sys, time
FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
UTS = FE + "/src/pencil/composables/useTallyStrokes.ts"
PM = FE + "/src/pencil/chrome/PlayerMark/PlayerMark.vue"
PL = FE + "/src/pencil/chrome/PlayerMark/PlayerLobby.vue"
BREAKS = {
  "B-S settle() without its stop lines": (UTS,
    "    for (const k of keys) {\n      draws.get(k)?.stop();\n      draws.delete(k);\n      reveal[k] = 1;",
    "    for (const k of keys) {\n      reveal[k] = 1;", "mid-draw"),
  "B-W the reduced-motion watch struck": (PM,
    "watch(reducedMotion, (reduced) => reduced && settle(ids.value));", "", "mid-draw"),
  "B-G drawIn a global cancel (pass 2)": (UTS,
    "    keys.forEach((k, pos) => {\n      draws.get(k)?.stop(); // only THIS",
    "    stop();\n    keys.forEach((k, pos) => {\n      draws.get(k)?.stop(); // only THIS", "two arrivals"),
  "B-14 the shipped ground translucent": (PL,
    "  background: var(--color-popover);",
    "  background: color-mix(in srgb, var(--color-popover) 80%, transparent);", "ground is opaque"),
  "B-16 the written count at the heading rung": (PM,
    ".pt-count {\n  font-size: var(--type-title);",
    ".pt-count {\n  font-size: var(--type-heading);", "rung below would not"),
}
sha = lambda f: hashlib.sha1(open(f, "rb").read()).hexdigest()
names = sys.argv[1:] or list(BREAKS)
for name in names:
    key = next(k for k in BREAKS if k.startswith(name))
    f, old, new, grep = BREAKS[key]
    before = sha(f); src = open(f).read()
    assert src.count(old) == 1, f"{key}: anchor count {src.count(old)}"
    open(f, "w").write(src.replace(old, new)); time.sleep(2)
    print(f"### {key} :: {os.path.basename(f)} planted (sha1 {before[:12]} -> {sha(f)[:12]}) :: -g '{grep}'", flush=True)
    r = subprocess.run(["npx", "playwright", "test", "--config", ".plr-count/pw.config.ts",
                        "player-tally.spec.ts", "-g", grep], cwd=FE, capture_output=True, text=True)
    for line in r.stdout.splitlines():
        if any(s in line for s in ("✓", "✘", "passed", "failed", "Error:", "PRM MID", "TWO MOVERS", "G14", "G16")):
            print("   ", line[:260])
    open(f, "w").write(src); time.sleep(1)
    print(f"EXIT[{key}]={r.returncode} restored={'OK' if sha(f) == before else 'MISMATCH ' + sha(f)}", flush=True)
