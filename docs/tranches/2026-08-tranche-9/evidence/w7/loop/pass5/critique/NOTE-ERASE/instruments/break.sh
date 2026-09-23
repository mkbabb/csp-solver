#!/bin/zsh
# NOTE-ERASE pass-5 CRITIC break-tests. Edits the lane's tree, runs the LANDED gate bare, restores by sha1.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
cd $W || exit 9
T=src/pencil/chrome/marginNote.motion.test.ts
CFG=src/pencil/config/pencilConfig.ts; SFC=src/pencil/chrome/MarginNote.vue; CSS=src/assets/index.css
S_CFG=$(shasum $CFG|cut -c1-40); S_SFC=$(shasum $SFC|cut -c1-40); S_CSS=$(shasum $CSS|cut -c1-40)
for f in $CFG $SFC $CSS; do cp $f /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/bak.$(basename $f); done
BK=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
run() { npx vitest run $T > $BK/v.out 2>&1; e=$?; echo "  vitest $T exit=$e :: $(grep -E 'Tests +[0-9]' $BK/v.out | tr -s ' ')"; grep -E '^ +(×|✗|FAIL)| ✗ | × ' $BK/v.out | head -3 | sed 's/^/    /'; }
restore() { for f in $CFG $SFC $CSS; do cp $BK/bak.$(basename $f) $f; done; echo "  restored: cfg $( [ $(shasum $CFG|cut -c1-40) = $S_CFG ] && echo ok) sfc $( [ $(shasum $SFC|cut -c1-40) = $S_SFC ] && echo ok) css $( [ $(shasum $CSS|cut -c1-40) = $S_CSS ] && echo ok)"; }
echo "B0 as built"; run
echo "B1 RETUNE a §13 rung in §7's graft: whisper 150 -> 125 (a ladder row §7 may not write)"; sed -i '' 's/^    whisper: 150,/    whisper: 125,/' $CFG; grep -c 'whisper: 125' $CFG; run; restore
echo "B2 RETUNE rise 520 -> 600 (T9-B11's other arm, decided by the owner, not §7)"; sed -i '' 's/^    rise: 520,/    rise: 600,/' $CFG; grep -c 'rise: 600' $CFG; run; restore
echo "B3 DEAD HOOK, text intact: stopTheClock returns before its write"; sed -i '' 's/^function stopTheClock(el: Element): void {/function stopTheClock(el: Element): void {\n  if (el) return;/' $SFC; grep -n -A2 '^function stopTheClock' $SFC | head -3; run; restore
echo "B4 DELETE the @property --motion-rise registration (the rung the graft grew)"; perl -0pi -e 's/\@property --motion-rise \{[^}]*\}\n//' $CSS; grep -c 'motion-rise' $CSS; run; node scripts/check-theme-tokens.mjs >/dev/null 2>&1; echo "  check-theme-tokens exit=$?"; node scripts/check-motion-contract.mjs >/dev/null 2>&1; echo "  check-motion-contract exit=$?"; restore
echo "B5 DELETE @property --motion-whisper (the rung the verb spends)"; perl -0pi -e 's/\@property --motion-whisper \{[^}]*\}\n//' $CSS; grep -c '@property --motion-whisper' $CSS; run; node scripts/check-theme-tokens.mjs >/dev/null 2>&1; echo "  check-theme-tokens exit=$?"; node scripts/check-motion-contract.mjs >/dev/null 2>&1; echo "  check-motion-contract exit=$?"; restore
echo "B6 NEST the seven @property blocks inside :root{} (the LAWS' brace-nested RED)"; perl -0pi -e 's/(\@property --motion-whisper)/:root{\n$1/; s/(\@property --motion-rise \{[^}]*\})/$1\n}/' $CSS; grep -n -B1 '@property --motion-whisper' $CSS | head -2; run; node scripts/check-theme-tokens.mjs >/dev/null 2>&1; echo "  check-theme-tokens exit=$?"; node scripts/check-motion-contract.mjs >/dev/null 2>&1; echo "  check-motion-contract exit=$?"; restore
echo DONE
