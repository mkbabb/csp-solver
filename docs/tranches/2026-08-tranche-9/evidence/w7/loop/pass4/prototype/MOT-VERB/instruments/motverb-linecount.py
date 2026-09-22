#!/usr/bin/env python3
"""THE LINE-COUNT CHECK the LAWS require after a merge (diff3 can exit 0 having dropped lines).

Three arms, because the merge has two parents and only one of them is banked as a patch:

  A · ARITHMETIC.   base(74a2b5d9) + LADDER's net + VERB's net - the sides I discarded == merged.
  B · VERB SURVIVAL. every line VERB's pass3.diff ADDS is present in the merged tree, except the
      ones a named conflict resolution discarded. Prints every missing line so none hides.
  C · LADDER SURVIVAL. the leader's node, by grep, on the merged tree.
"""
import pathlib, re, subprocess, sys

WT = pathlib.Path("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59")
S = pathlib.Path("/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb-merge")
DIFF = pathlib.Path("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MOT-VERB/pass3.diff")

# ── B · VERB SURVIVAL ────────────────────────────────────────────────────────────────────
cur, adds = None, {}
for line in DIFF.read_text().splitlines():
    if line.startswith("diff --git a/"):
        cur = line.split(" b/")[-1]; adds[cur] = []
    elif line.startswith("+") and not line.startswith("+++") and cur:
        adds[cur].append(line[1:])

missing = []
for f, ls in adds.items():
    body = (WT / f).read_text() if (WT / f).exists() else ""
    have = set(x.rstrip() for x in body.splitlines())
    for l in ls:
        if l.strip() and l.rstrip() not in have:
            missing.append((f, l.rstrip()))

print(f"B · VERB added lines: {sum(len(v) for v in adds.values())} total, "
      f"{len(missing)} not present in the merged tree")
for f, l in missing:
    print(f"    DISCARDED  {f}\n               {l[:110]}")

# ── C · LADDER SURVIVAL ──────────────────────────────────────────────────────────────────
print("\nC · LADDER's node on the merged tree")
probes = {
    "MOTION.rungs literal (7 rungs incl. rise)": (WT/"web/frontend/src/pencil/config/pencilConfig.ts", "rise: 520,"),
    "the one publisher": (WT/"web/frontend/src/pencil/config/pencilConfig.ts", "export function publishMotionRungs"),
    "settleGuardMs, one constant": (WT/"web/frontend/src/pencil/config/pencilConfig.ts", "settleGuardMs: 220,"),
    "characters.refuse": (WT/"web/frontend/src/pencil/config/pencilConfig.ts", "refuse: 600,"),
    "@property registrations in the static sheet": (WT/"web/frontend/src/assets/index.css", "@property --motion-"),
    "the bands gate": (WT/"web/frontend/package.json", "lint:bands"),
    "the CI lane": (WT/".github/workflows/ci.yml", "MOTION_LADDER_B8_OWNED"),
    "the verbs gate": (WT/"web/frontend/package.json", "lint:verbs"),
    "the CI verbs step": (WT/".github/workflows/ci.yml", "npm run lint:verbs"),
}
for name, (p, needle) in probes.items():
    ok = needle in p.read_text()
    print(f"    {'OK ' if ok else 'GONE'}  {name}")

# ── A · ARITHMETIC ───────────────────────────────────────────────────────────────────────
tracked = [f for f in adds if (S/"base"/f).exists()]
base_n = sum(len((S/"base"/f).read_text().splitlines()) for f in tracked)
merged_n = sum(len((WT/f).read_text().splitlines()) for f in tracked)
print(f"\nA · over VERB's 29 tracked files: base {base_n} → merged {merged_n} ({merged_n-base_n:+d})")
out = subprocess.run(["git","-C",str(WT),"diff","--numstat"], capture_output=True, text=True).stdout
a = sum(int(r.split()[0]) for r in out.splitlines())
d = sum(int(r.split()[1]) for r in out.splitlines())
print(f"    merged tree vs 74a2b5d9, all tracked: +{a} -{d} net {a-d:+d}")
print(f"    LADDER alone (recorded before the replay): +463 -129 net +334")
print(f"    VERB alone (its banked patch, tracked only): "
      f"{sum(len(v) for f,v in adds.items() if f in tracked)} added")
