#!/bin/zsh
# PAL-WALK pass 4 — every born-RED row, its negative control landed on THIS tree, the gate run
# BARE (exit code captured unpiped), the tree restored and re-verified. Family-scoped name.
set -u
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1
F=$W/web/frontend
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/PAL-WALK
L=$E/readings/born-red-logs
mkdir -p $L
cd $F || exit 1
B=$F/.pal-walk/bak; mkdir -p $B
for f in src/assets/index.css src/games/shared/useSession.ts src/games/shared/useSession.test.ts src/games/shared/GameBoard.vue; do cp $f $B/$(basename $f); done
cp $W/.github/workflows/ci.yml $B/ci.yml
restore() { for f in src/assets/index.css src/games/shared/useSession.ts src/games/shared/useSession.test.ts src/games/shared/GameBoard.vue; do cp $B/$(basename $f) $f; done; cp $B/ci.yml $W/.github/workflows/ci.yml; }
landed() { if grep -qF -- "$2" "$1"; then echo "     control landed"; return 0; else echo "     !! CONTROL DID NOT LAND — verdict void"; return 1; fi }
bare() { local log=$1; shift; "$@" > $L/$log 2>&1; local rc=$?; echo "     $log → exit $rc"; return 0; }
vt() { grep -E "Tests +[0-9]" $L/$1 | tail -1; grep -E "^ +(×|✗|FAIL)| × " $L/$1 | sed 's/^ */       /' | head -6; }
PW="npx playwright test --config .pal-walk/pw.walk.config.ts --project chromium --project webkit"

echo "=== 1 · LANE: the ci.yml step deleted ==="
python3 - <<'PY'
p='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/.github/workflows/ci.yml'
s=open(p).read(); a=s.index('            # T9-W7 §11c — the player'); b=s.index('run: npm run lint:arcs\n',a)+len('run: npm run lint:arcs\n'); open(p,'w').write(s[:a]+s[b:])
PY
grep -q "lint:arcs" $W/.github/workflows/ci.yml && echo "     !! control did not land" || echo "     control landed"
bare lane-control.log node scripts/check-lane-membership.mjs
restore; bare lane-restored.log node scripts/check-lane-membership.mjs

echo "=== 2 · THE INVITED EDIT: --peer-ring-l 0.32 → 0.2 on the sheet alone ==="
perl -pi -e 's/--peer-ring-l: 0\.32;/--peer-ring-l: 0.2;/' src/assets/index.css
landed src/assets/index.css "--peer-ring-l: 0.2;" && {
  bare bands-control-tier1.log node scripts/check-peer-arcs.mjs
  grep -E "BANDS AGREE\]" $L/bands-control-tier1.log | head -2 | cut -c1-200
  LAW_FE=$F bare bands-control-L6.log node $E/instruments/law-probe.PROPOSED.mjs
  grep -E "^L6" $L/bands-control-L6.log | cut -c1-40
  sleep 2
  bare bands-control-tier3A.log zsh -c "$PW -g '§A'"
  grep -E "ring painted hue|ring band 0.2|passed|failed|Error:" $L/bands-control-tier3A.log | cut -c1-220 | head -8
}
restore

echo "=== 3 · TIER 2 on ROUNDED bytes: the ring painted at 0.2 while bisected at 0.32 (the runtime ablation, replayed) ==="
perl -pi -e 's/\["--color-peer-cursor-ink", RING_BANDS\],/["--color-peer-cursor-ink", [0.2, 0.79]],/' src/games/shared/useSession.test.ts
landed src/games/shared/useSession.test.ts '["--color-peer-cursor-ink", [0.2, 0.79]],' && {
  bare rounded-control.log npx vitest run src/games/shared/useSession.test.ts -t "ROUNDED"
  vt rounded-control.log; grep -oE "rounds to [0-9.]+°" $L/rounded-control.log | head -2
}
restore

echo "=== 4 · THE WIRE RULE's discriminating case: every st authoritative ==="
perl -pi -e 's/from === e\[1\]\);/true);/' src/games/shared/useSession.ts
landed src/games/shared/useSession.ts "?? {}, true);" && { bare wire-first-speaker.log npx vitest run src/games/shared/useSession.test.ts; vt wire-first-speaker.log; }
restore

echo "=== 5a · (round 3 re-run) nothing is ever AGREED ==="
perl -pi -e 's/from === e\[1\]\);/false);/' src/games/shared/useSession.ts
landed src/games/shared/useSession.ts "?? {}, false);" && { bare br3-noagree.log npx vitest run src/games/shared/useSession.test.ts; vt br3-noagree.log; }
restore
echo "=== 5b · (round 3 re-run) the SOLO page takes a colour ==="
perl -pi -e 's/ink: id === selfId\.value && !roomHasOthers\(map\) \? \{\} : ident!\.inkFor\(index\),/ink: ident!.inkFor(index),/' src/games/shared/useSession.ts
grep -q "!roomHasOthers(map) ? {}" src/games/shared/useSession.ts && echo "     !! control did not land" || { echo "     control landed"; bare br3-solo.log npx vitest run src/games/shared/useSession.test.ts; vt br3-solo.log; }
restore
echo "=== 5c · (round 3 re-run) the UNNAMED hand keeps a claimed index ==="
perl -0pi -e 's/    inkIndex\[id\] = \+\+top;\n    claimed\.set\(top, id\);\n    next\[id\] = \{ \.\.\.next\[id\], ink: inkOf\(id\) \};//s' src/games/shared/useSession.ts
grep -q "inkIndex\[id\] = ++top;" src/games/shared/useSession.ts && echo "     !! control did not land" || { echo "     control landed"; bare br3-reseat.log npx vitest run src/games/shared/useSession.test.ts; vt br3-reseat.log; }
restore

echo "=== 6 · F1 NO arm: the switch flipped — which units hold the lean ==="
perl -pi -e 's/const SELF_TAKES_A_HAND: boolean = true;/const SELF_TAKES_A_HAND: boolean = false;/' src/games/shared/useSession.ts
landed src/games/shared/useSession.ts "SELF_TAKES_A_HAND: boolean = false;" && { bare f1-no-arm-units.log npx vitest run src/games/shared/useSession.test.ts src/games/shared/BoardHost.authors.test.ts; vt f1-no-arm-units.log; }
restore

echo "=== 7 · THE TAPE: the name back in the digit's string ==="
perl -pi -e 's/  color: var\(--color-peer-cursor-ink\);/  color: var(--color-user-ink);/' src/games/shared/GameBoard.vue
landed src/games/shared/GameBoard.vue "  color: var(--color-user-ink);" && {
  sleep 2
  bare tape-control-tier3C.log zsh -c "$PW -g '§C'"
  grep -E "tape name|passed|failed" $L/tape-control-tier3C.log | cut -c1-200 | head -6
}
restore

echo "=== restored; verifying ==="
for f in src/assets/index.css src/games/shared/useSession.ts src/games/shared/useSession.test.ts src/games/shared/GameBoard.vue; do cmp -s $f $B/$(basename $f) && echo "  $f identical to pre-battery" || echo "  !! $f DIFFERS"; done
cmp -s $W/.github/workflows/ci.yml $B/ci.yml && echo "  ci.yml identical" || echo "  !! ci.yml DIFFERS"
node scripts/check-peer-arcs.mjs --self-test > /dev/null 2>&1; echo "  tier1 exit $?"
node scripts/check-lane-membership.mjs > /dev/null 2>&1; echo "  lanes exit $?"
echo done
