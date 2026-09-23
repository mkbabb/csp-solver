#!/bin/zsh
# chain4 — the final re-run after the scratchpad's logs/ vanished: landed spec on lane + control, the
# four source breaks (restored by sha1), then the filter census light/dark on lane + control. Logs land
# straight in evidence (durable).
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
L=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MRK-ABS/logs/final
mkdir -p $L
export W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
cd $W; C=$L/chain4.log; : > $C
lr() { local tag=$1 base=$2 grep=$3; echo "== $tag $(date +%T)" >> $C; BASE=$base npx playwright test --config $S/pwcfg/landed.config.ts ${grep:+-g "$grep"} > $L/$tag.log 2>&1; echo "EXIT[$tag] $? $(grep -E '[0-9]+ (passed|failed)' $L/$tag.log | tr '\n' ' ')" >> $C; }
brk() { local tag=$1 file=$2 edit=$3 base=$4 grep=$5; local h0=$(shasum $file | cut -c1-40); python3 $S/breaks.py $edit; echo "BREAK $tag edited $(basename $file) $(shasum $file | cut -c1-40) (clean $h0)" >> $C; lr $tag $base "$grep"; cp $S/brk-$(basename $file) $file; local h1=$(shasum $file | cut -c1-40); [[ $h0 == $h1 ]] && echo "RESTORED $tag sha1 $h1" >> $C || echo "RESTORE MISMATCH $tag" >> $C; }
for f in src/assets/index.css src/games/shared/gameCell.css src/pencil/config/pencilConfig.ts; do cp $f $S/brk-$(basename $f); done
lr landed-lane-A http://127.0.0.1:4239
lr landed-control-74a2b5d9 http://127.0.0.1:4240
brk break-B1-ledger-9.99 src/assets/index.css nine http://127.0.0.1:4239 "G-ABS-5"
brk break-B3-source-opacity-0.9 src/games/shared/gameCell.css op http://127.0.0.1:4239 "G-ABS-5"
brk break-B4-inset1-dist-E src/pencil/config/pencilConfig.ts inset1 http://127.0.0.1:4244 "G-ABS-7"
brk arm-D-inset0.9-dist-D src/pencil/config/pencilConfig.ts inset09 http://127.0.0.1:4243 "G-ABS-7"
fc() { local tag=$1 base=$2; echo "== $tag $(date +%T)" >> $C; BASE=$base npx playwright test --config $S/pwcfg/filter.config.ts > $L/$tag.log 2>&1; echo "EXIT[$tag] $? $(grep -E '[0-9]+ (passed|failed)' $L/$tag.log | tr '\n' ' ')" >> $C; }
fc filter-census-lane-A http://127.0.0.1:4239
fc filter-census-control-74a2b5d9 http://127.0.0.1:4240
echo CHAIN4-DONE $(date +%T) >> $C
