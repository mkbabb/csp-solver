#!/bin/bash
# NOTE-ERASE pass 6 · the three re-cut gates, each with its plants, in ONE batch; restore by sha1.
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
cd $FE
CFG=src/pencil/config/pencilConfig.ts; SFC=src/pencil/chrome/MarginNote.vue; CSS=src/assets/index.css
T=src/pencil/chrome/marginNote.motion.test.ts
for f in $CFG $SFC $CSS; do cp $f $SP/erase6-bak/$(basename $f); done
S0=$(shasum $CFG $SFC $CSS | awk '{print $1}' | tr '\n' ' ')
echo "sha1 before: $S0"
unit() { npx vitest run $T > $SP/erase6-logs/brk-unit.log 2>&1; local e=$?; echo "  unit exit $e :: $(grep -E 'Tests +[0-9]' $SP/erase6-logs/brk-unit.log | tr -s ' ') :: $(grep -oE '(G5|G16 \(CI half\))[^>]*' $SP/erase6-logs/brk-unit.log | grep -v '✓' | head -2 | tr '\n' ';')"; grep -E '^ +(×|✓|FAIL)' $SP/erase6-logs/brk-unit.log | grep -E 'G5|G16' | sed 's/^/    /'; }
tok() { node scripts/check-theme-tokens.mjs > $SP/erase6-logs/brk-tok.log 2>&1; echo "  check-theme-tokens (bare) exit $? :: $(grep -E 'ladder registration|^  --motion' $SP/erase6-logs/brk-tok.log | head -3 | tr '\n' ';')"; }
restore() { for f in $CFG $SFC $CSS; do cp $SP/erase6-bak/$(basename $f) $f; done; }
echo "== AS BUILT"; unit; tok
echo "== G5 plant 1: SWAP whisper<->dusk (150<->350)"; perl -0pi -e 's/whisper: 150,/whisper: 350,/; s/dusk: 350,/dusk: 150,/' $CFG; grep -nE '^\s+(whisper|dusk): ' $CFG | head -2; unit; restore
echo "== G5 plant 2: rise 520 -> 600"; perl -0pi -e 's/rise: 520,/rise: 600,/' $CFG; unit; restore
echo "== G5 plant 3: step 440 -> 1"; perl -0pi -e 's/step: 440,/step: 1,/' $CFG; unit; restore
echo "== G5 plant 4: whisper 150 -> 125"; perl -0pi -e 's/whisper: 150,/whisper: 125,/' $CFG; unit; restore
echo "== G5 plant 5: MINT erase: 125"; perl -0pi -e 's/(    rise: 520,\n)/$1    erase: 125,\n/' $CFG; unit; restore
echo "== G16 plant: the DEAD HOOK, text intact (if (el) return;)"; perl -0pi -e 's/(function stopTheClock\(el: Element\): void \{\n)/$1  if (el) return;\n/' $SFC; grep -n -A1 'function stopTheClock' $SFC; unit; restore
echo "== REG plant 1: delete @property --motion-whisper (file)"; perl -0pi -e 's/\@property --motion-whisper \{[^}]*\}\n//' $CSS; tok; unit; restore
echo "== REG plant 2: nest all seven in :root {} (file)"; perl -0pi -e 's/(\@property --motion-whisper \{)/:root {\n$1/; s/(\@property --motion-rise \{[^}]*\})/$1\n}/' $CSS; tok; unit; restore
echo "== REG plant 3: inherits false on --motion-whisper"; perl -0pi -e 's/(\@property --motion-whisper \{\n  syntax: "<time>";\n  inherits: )true/${1}false/' $CSS; tok; restore
echo "== REG plant 4: a stray --motion-erase registration"; perl -0pi -e 's/(\@property --motion-whisper \{)/\@property --motion-erase {\n  syntax: "<time>";\n  inherits: true;\n  initial-value: 0ms;\n}\n$1/' $CSS; tok; restore
echo "== RESTORED"; unit; tok
S1=$(shasum $CFG $SFC $CSS | awk '{print $1}' | tr '\n' ' ')
echo "sha1 after:  $S1"; [ "$S0" = "$S1" ] && echo "RESTORE OK" || echo "RESTORE MISMATCH"
