#!/bin/bash
# stamp plants on a scratch copy of the tree's web/frontend (dist + .face-engine included); exits bare to the log
SRC=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/CTRL-FACE/stamp
FE=$S/fe; LOG=$1; : > $LOG
rsync -a --checksum --delete --exclude node_modules "$SRC/" "$FE/"; [ -e $FE/node_modules ] || ln -s "$SRC/node_modules" $FE/node_modules
cd $FE
F=src/assets/fonts
run() { node scripts/check-face-engine-identity.mjs --self-test > $S/last.log 2>&1; e=$?; echo "$e | $1 | $(grep -m1 'RED\|BLIND' $S/last.log | cut -c1-120) | $(tail -1 $S/last.log)" >> $LOG; }
restore() { rsync -a --checksum "$SRC/src/" "$FE/src/"; }
run "CLEAN (the tree as built)"
cp -p $F/patrickhand-subset.woff2 $S/orig.woff2; printf '\0' >> $F/patrickhand-subset.woff2; touch -r $S/orig.woff2 $F/patrickhand-subset.woff2; run "P1 patrickhand one byte appended, mtime restored"; restore
cp -p $F/firacode-subset.woff2 $S/orig.woff2; cp $F/fraunces-subset.woff2 $F/firacode-subset.woff2; touch -r $S/orig.woff2 $F/firacode-subset.woff2; run "P2 firacode replaced by the Fraunces bytes, mtime restored"; restore
cp -p $F/fraunces-subset.woff2 $S/orig.woff2; python3 -c "
import sys; p='$F/fraunces-subset.woff2'; b=bytearray(open(p,'rb').read()); print('offset127 before', hex(b[127])); b[127]^=1; open(p,'wb').write(b)"  >> $LOG; touch -r $S/orig.woff2 $F/fraunces-subset.woff2; cmp $S/orig.woff2 $F/fraunces-subset.woff2 >> $LOG 2>&1; run "P3 fraunces offset 127 flipped, mtime restored"; restore
cp -p src/pencil/chrome/AttributionCard/avatar.png $S/orig.png; printf '\0' >> src/pencil/chrome/AttributionCard/avatar.png; touch -r $S/orig.png src/pencil/chrome/AttributionCard/avatar.png; run "P4 avatar.png one byte appended, mtime restored"; restore
cp -p src/games/shared/scene.css $S/orig.css; printf '\n.controls-card{letter-spacing:.02em}\n' >> src/games/shared/scene.css; touch -r $S/orig.css src/games/shared/scene.css; run "NEG scene.css letter-spacing (the pass-7 plant), mtime restored"; restore
run "RESTORED"
echo DONE >> $LOG
