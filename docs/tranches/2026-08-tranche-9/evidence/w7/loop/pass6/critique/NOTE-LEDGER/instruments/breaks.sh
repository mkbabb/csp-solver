#!/bin/bash
# NOTE-LEDGER pass-6 CRITIC — plants on a scratch REPLICA of the work tree (never the lane's tree).
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
T=$SP/nlcrit6-tree/web/frontend; L=$SP/nlcrit6-logs/breaks; mkdir -p $L; cd $T
F=src/games/shared/GameBoard.vue; M=src/pencil/chrome/MarginNote.vue; C=scripts/check-font-coverage.mjs
R=src/games/shared/GameBoard.receipt.test.ts
cp $F $L/gb.vue; cp $M $L/mn.vue; cp $C $L/fc.mjs; cp $R $L/rc.ts
S0="$(shasum $F $M $C $R | cut -d' ' -f1 | tr '\n' ' ')"
TT="src/games/shared/GameBoard.receipt.test.ts src/games/shared/GameBoard.notes.test.ts src/pencil/chrome/MarginNote.test.ts"
flip() { sed -i '' "s/^const LEDGER_FULFILLED = \"[a-z]*\" as/const LEDGER_FULFILLED = \"$1\" as/" $F; grep -q "const LEDGER_FULFILLED = \"$1\" as" $F || echo "FLIP FAILED $1"; }
unit() { npx vitest run $TT > $L/$1.log 2>&1; local c=$?; echo "$1 exit=$c $(grep -E '^ +Tests ' $L/$1.log | tr -s ' ')"; grep -E '^ +×' $L/$1.log | sed 's/^/    /' | head -6; }
restore() { cp $L/gb.vue $F; cp $L/mn.vue $M; cp $L/fc.mjs $C; cp $L/rc.ts $R; }
for a in hold age step tint; do flip $a; unit "census-$a"; done; restore
for a in hold step tint; do flip $a; perl -0pi -e 's/  else if \(live\.spent\) live\.spent = undefined;\n//' $F; grep -q "else if (live.spent) live.spent = undefined" $F && echo "PLANT FAILED"; unit "unspend-deleted-$a"; restore; done
perl -0pi -e 's/            displacedInk \|\|\n//' $M; grep -q "displacedInk ||" $M && echo "PLANT FAILED"; unit kf0-reverted; restore
# K1 · the pre-read moved to post flush (reads the NEW record's class)
perl -0pi -e 's/(      : "";\n  \},\n)\);/$1  { flush: "post" },\n);/' $M; grep -c 'flush: "post"' $M | sed 's/^/    post-flush count (want 2): /'; unit K1-preread-postflush; restore
# K2 · the pre-read keyed on is-spent removed: ALWAYS read line one's ink (an open record then ages from its own full ink, not the graphite token)
perl -0pi -e 's/displacedInk = live\?\.classList\.contains\("is-spent"\)\n      \? getComputedStyle\(live\)\.color\n      : "";/displacedInk = live ? getComputedStyle(live).color : "";/' $M; grep -q 'displacedInk = live ? getComputedStyle' $M || echo "PLANT FAILED K2"; unit K2-preread-unkeyed; restore
perl -0pi -e 's/  \.margin-note \{\n    min-height: inherit;\n  \}\n//' $M; grep -q "min-height: inherit" $M && echo "PLANT FAILED"; unit reserve-deleted; restore
# E1 · shadowed: a second min-height after inherit in the SAME rule (the cascade takes the last)
perl -0pi -e 's/(  \.margin-note \{\n    min-height: inherit;\n)/$1    min-height: 0;\n/' $M; unit E1-reserve-shadowed; restore
# E2 · overridden by a compound selector at top level (specificity beats the <1024 rule)
printf '%s\n' '<style scoped>' '.margin-note-block > .margin-note { min-height: 0; }' '</style>' >> $M; unit E2-reserve-overridden; restore
# E2b · the same override INSIDE the one style block the law reads
perl -0pi -e 's/(  min-height: 1\.3em;\n\}\n)/$1\n.margin-note-block > .margin-note {\n  min-height: 0;\n}\n/' $M; grep -q "^.margin-note-block > .margin-note {" $M || echo "PLANT FAILED E2b"; unit E2b-reserve-overridden-same-block; restore
# E3 · the block's reserve cut to one pixel (inherit then takes 1px)
perl -0pi -e 's/(\.margin-note-block \{[^}]*?min-height: )[^;]+;/${1}1px;/' $M; grep -A12 '^\.margin-note-block {' $M | grep min-height | sed 's/^/    /'; unit E3-block-reserve-1px; restore
# E4 · !important zero in the landscape block (the narrower media wins at 844x390)
perl -0pi -e 's/(\@media \(max-width: 1023\.98px\) and \(orientation: landscape\) \{\n)/$1  .margin-note-block .margin-note {\n    min-height: 0 !important;\n  }\n/' $M; unit E4-reserve-landscape-override; restore
# font coverage
perl -pi -e 's/^\s*setMargin\("solved it!", "gold-star", "empty"\);\n//' $F; grep -q 'setMargin("solved it!"' $F && echo "PLANT FAILED"; node $C > $L/fc-callsite.log 2>&1; echo "fc call-site-deleted exit=$?"; restore
perl -pi -e 's/setMargin\("solved it!", "gold-star", "empty"\)/setMargin("solved it !", "gold-star", "empty")/' $F; node $C > $L/fc-reworded.log 2>&1; echo "fc call-site-reworded exit=$? :: $(grep -m1 -o 'solved it ![^.]*' $L/fc-reworded.log)"; restore
perl -pi -e 's/^\s*closed: true,\n//' $C; perl -pi -e 's/^\s*setMargin\("solved it!", "gold-star", "empty"\);\n//' $F; node $C > $L/fc-unclosed-callsite.log 2>&1; echo "fc closed-flag-removed + call-site-deleted exit=$?"; restore
perl -pi -e 's/^\s*"solved it!",\n//' $C; node $C > $L/fc-declared.log 2>&1; echo "fc declared-deleted exit=$?"; restore
node $C > $L/fc-clean.log 2>&1; echo "fc clean exit=$?"
# stub-iso
node $SP/nlcrit6-stub-iso.mjs $T > $L/si-clean.log 2>&1; echo "stub-iso clean exit=$? $(tail -1 $L/si-clean.log)"
perl -0pi -e 's/ role="status" aria-live="polite" aria-atomic="true"//' $R; node $SP/nlcrit6-stub-iso.mjs $T > $L/si-plant.log 2>&1; echo "stub-iso a11y-stripped-from-receipt-stub exit=$? $(tail -1 $L/si-plant.log)"; restore
S1="$(shasum $F $M $C $R | cut -d' ' -f1 | tr '\n' ' ')"; [ "$S0" = "$S1" ] && echo "RESTORED $S0" || echo "RESTORE MISMATCH"
echo BREAKS-DONE
