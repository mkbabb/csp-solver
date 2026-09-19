#!/bin/bash
# The re-cut L6, and its negative control: a LITERAL HUE TABLE in a scratch copy of the module
# must red the row. A law probe that cannot fail is not a law probe.
set -u
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/web/frontend
SC=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/scratch
cd "$SC/instruments" || exit 2
cp "$FE/src/games/shared/playerIdentity.ts" "$SC/hold-pi-l6.ts"
restore() { cp "$SC/hold-pi-l6.ts" "$FE/src/games/shared/playerIdentity.ts"; }
trap restore EXIT

echo "=== L6 as the tree stands ==="
node law-probe.mjs 2>&1 | grep -A2 "^L6"

echo
echo "=== NEGATIVE CONTROL · a literal hue table replaces the walk ==="
python3 - "$FE/src/games/shared/playerIdentity.ts" <<'PY'
import sys
p = sys.argv[1]
s = open(p).read()
table = '''
const PALETTE = [
  "#e8315b", "#2dc653", "#4a90d9", "#f4a236", "#8b5cf6", "#047857",
];
'''
s = s.replace("export const inkFor", table + "\nexport const inkFor", 1)
s = s.replace(
  'ink = `oklch(var(--peer-ink-l) ${chromaAt(h).toFixed(4)} ${h.toFixed(2)}deg)`;',
  'ink = PALETTE[index % PALETTE.length];',
  1,
)
open(p, "w").write(s)
PY
node law-probe.mjs 2>&1 | grep -A2 "^L6"
