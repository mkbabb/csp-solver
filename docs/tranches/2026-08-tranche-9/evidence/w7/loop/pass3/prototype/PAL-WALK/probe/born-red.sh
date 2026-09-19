#!/bin/zsh
# PAL-WALK pass-3 · the born-RED battery. Each control is applied to a COPY of the tree's file,
# the row is run, and the file is restored. Every row prints RED/GREEN and what it proves.
set -u
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
cd "$W" || exit 1

row() { printf "%-62s %s\n" "$1" "$2"; }

echo "=== A · the RING KEY and the ring band, reverted (the gate's own control) ==="
cp src/assets/index.css "$S/index.css.bak"
# revert --peer-ring-l to --peer-ink-l's own values: the ring becomes the digit again.
perl -0pi -e 's/--peer-ring-l: 0\.32;/--peer-ring-l: 0.44;/; s/--peer-ring-l: 0\.79;/--peer-ring-l: 0.65;/' src/assets/index.css
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4244 npx playwright test --config pw.walk.config.ts \
  --project chromium -g "painted law" > "$S/br-ringrevert.log" 2>&1
if grep -q "1 failed" "$S/br-ringrevert.log"; then row "ring band reverted to the digit's band" "RED (as required)"; else row "ring band reverted to the digit's band" "GREEN (the gate does not hold)"; fi
grep -E "ring band 0\.(44|65)" "$S/br-ringrevert.log" | head -4
cp "$S/index.css.bak" src/assets/index.css

echo
echo "=== B · tier 2 units, each control ==="
cp src/games/shared/playerIdentity.ts "$S/pi.bak"
# B1 — the module returns ONE key again: the ring-key unit and BoardHost's ring rows must red.
perl -0pi -e 's/return \{ "--color-user-ink": pair\[0\], "--color-peer-cursor-ink": pair\[1\] \};/return { "--color-user-ink": pair[0] };/' src/games/shared/playerIdentity.ts
npx vitest run src/games/shared/useSession.test.ts src/games/shared/BoardHost.authors.test.ts > "$S/br-onekey.log" 2>&1
if grep -qE "[0-9]+ failed" "$S/br-onekey.log"; then row "single-key inkFor (HEAD's module)" "RED (as required)"; else row "single-key inkFor (HEAD's module)" "GREEN (no gate holds the second key)"; fi
grep -E "✗|×|failed" "$S/br-onekey.log" | head -6
cp "$S/pi.bak" src/games/shared/playerIdentity.ts

# B2 — STEP = 0.5: the capacity row must red, the arc row is honest that it cannot.
perl -0pi -e 's/const STEP = SPAN \* \(\(3 - Math\.sqrt\(5\)\) \/ 2\);/const STEP = 0.5;/' src/games/shared/playerIdentity.ts
npx vitest run src/games/shared/useSession.test.ts > "$S/br-step.log" 2>&1
if grep -qE "[0-9]+ failed" "$S/br-step.log"; then row "STEP = 0.5" "RED (as required)"; else row "STEP = 0.5" "GREEN"; fi
grep -E "Tests +[0-9]" "$S/br-step.log" | head -2
cp "$S/pi.bak" src/games/shared/playerIdentity.ts

echo
echo "=== C · the SESSION units against HEAD's own useSession ==="
cp src/games/shared/useSession.ts "$S/us.bak"
# C1 — the wire rule's seam removed: every `st` is authoritative (HEAD before pass 2).
perl -0pi -e 's/adoptInk\(\(d\.k as Record<string, number>\) \?\? \{\}, from === e\[1\]\);/adoptInk((d.k as Record<string, number>) ?? {}, true);/' src/games/shared/useSession.ts
npx vitest run src/games/shared/useSession.test.ts > "$S/br-wire.log" 2>&1
if grep -qE "[0-9]+ failed" "$S/br-wire.log"; then row "every st is authoritative (no wire rule)" "RED (as required)"; else row "every st is authoritative (no wire rule)" "GREEN"; fi
grep -E "U[0-9] —" "$S/br-wire.log" | head -8
cp "$S/us.bak" src/games/shared/useSession.ts

# C2 — self binds on the FIRST id (the room of one recolours).
perl -0pi -e 's/if \(!me \|\| !roomHasOthers\(\) \|\| Object\.keys\(me\.ink\)\.length\) return;/if (!me || Object.keys(me.ink).length) return;/' src/games/shared/useSession.ts
npx vitest run src/games/shared/useSession.test.ts > "$S/br-self.log" 2>&1
if grep -qE "[0-9]+ failed" "$S/br-self.log"; then row "self binds on the first id (room of one inks)" "RED (as required)"; else row "self binds on the first id" "GREEN"; fi
grep -E "U[78] —" "$S/br-self.log" | head -4
cp "$S/us.bak" src/games/shared/useSession.ts

# C3 — the solo-era stamp deleted: U8's pre-room cells keep the house blue.
perl -0pi -e 's/for \(const pos of source\?\.writtenPositions\(\) \?\? \[\]\) ledger\.clock\[String\(pos\)\] \?\?= \[0, id\];//' src/games/shared/useSession.ts
npx vitest run src/games/shared/useSession.test.ts > "$S/br-stamp.log" 2>&1
if grep -qE "[0-9]+ failed" "$S/br-stamp.log"; then row "solo-era stamp deleted" "RED (as required)"; else row "solo-era stamp deleted" "GREEN"; fi
cp "$S/us.bak" src/games/shared/useSession.ts

echo
echo "=== D · the COPY gate reads the ring's clause ==="
cp src/games/shared/useGameCell.ts "$S/ugc.bak"
perl -0pi -e 's/\$\{props\.cursorName\} is here/cursor \${props.cursorName} is here/' src/games/shared/useGameCell.ts
node scripts/check-copy-register.mjs > "$S/br-copy.log" 2>&1
if [ $? -ne 0 ]; then row "the clause says 'cursor'" "RED (as required)"; else row "the clause says 'cursor'" "GREEN (the gate cannot see the clause)"; fi
grep -E "unadmitted|is here" "$S/br-copy.log" | head -4
cp "$S/ugc.bak" src/games/shared/useGameCell.ts

echo
echo "=== E · tier 1's two NEW controls against the PASS-2 gate (were they green-lit?) ==="
node "$S/pass2-gate-control.mjs" 2>&1 | head -12

echo
echo "restored; verifying the tree is back"
node scripts/check-peer-arcs.mjs --self-test >/dev/null 2>&1 && echo "tier1 GREEN" || echo "tier1 RED — TREE NOT RESTORED"
npx vitest run src/games/shared/useSession.test.ts src/games/shared/BoardHost.authors.test.ts 2>&1 | grep -E "Tests +[0-9]|failed"
node scripts/check-copy-register.mjs >/dev/null 2>&1 && echo "copy GREEN" || echo "copy RED — TREE NOT RESTORED"
echo done
