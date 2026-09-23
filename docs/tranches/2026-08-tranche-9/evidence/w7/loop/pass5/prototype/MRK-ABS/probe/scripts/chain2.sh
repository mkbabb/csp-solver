#!/bin/zsh
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
export W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
cd $W; : > $S/logs/chain2.log
lr() { local tag=$1 base=$2 grep=$3; echo "== $tag $(date +%T)" >> $S/logs/chain2.log; BASE=$base npx playwright test --config .mrkabs/pw.landed.config.ts ${grep:+-g "$grep"} > $S/logs/$tag.log 2>&1; echo "EXIT[$tag] $? $(grep -E '[0-9]+ (passed|failed)' $S/logs/$tag.log | tr '\n' ' ')" >> $S/logs/chain2.log; }
brk() { local tag=$1 file=$2 edit=$3 base=$4 grep=$5; local h0=$(shasum $file | cut -c1-40); python3 $S/breaks.py $edit; echo "BREAK $tag edited $(basename $file) $(shasum $file | cut -c1-40)" >> $S/logs/chain2.log; lr $tag $base "$grep"; cp $S/brk-$(basename $file) $file; local h1=$(shasum $file | cut -c1-40); [[ $h0 == $h1 ]] && echo "RESTORED $tag sha1 $h1" >> $S/logs/chain2.log || echo "RESTORE MISMATCH $tag" >> $S/logs/chain2.log; }
for f in src/assets/index.css src/games/shared/gameCell.css src/pencil/config/pencilConfig.ts; do cp $f $S/brk-$(basename $f); done
lr landed-3 http://127.0.0.1:4239
lr landed-HEAD http://127.0.0.1:4240
brk break-B1-nine src/assets/index.css nine http://127.0.0.1:4239 "G-ABS-5"
brk break-B3-op src/games/shared/gameCell.css op http://127.0.0.1:4239 "G-ABS-5"
brk break-B4-inset1 src/pencil/config/pencilConfig.ts inset1 http://127.0.0.1:4244 "G-ABS-7"
brk arm-D-inset09 src/pencil/config/pencilConfig.ts inset09 http://127.0.0.1:4243 "G-ABS-7"
echo CHAIN2-DONE >> $S/logs/chain2.log
