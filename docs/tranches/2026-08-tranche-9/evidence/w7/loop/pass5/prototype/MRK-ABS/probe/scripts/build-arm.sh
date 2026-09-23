#!/bin/zsh
# build-arm.sh <name> [python-edit-script] — apply an arm edit to the tree, build to scratch, restore by sha1.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
cd $W
NAME=$1; EDIT=$2
FILES=(src/assets/index.css src/games/shared/gameCell.css src/pencil/config/pencilConfig.ts)
typeset -A SHA
for f in $FILES; do SHA[$f]=$(shasum $f | cut -c1-40); cp $f $S/bak.$(basename $f); done
if [[ -n $EDIT ]]; then python3 $EDIT || { echo "EDIT FAILED"; exit 3; }; fi
for f in $FILES; do diff -u $S/bak.$(basename $f) $f | sed "s#$S/bak.$(basename $f)#a/web/frontend/$f#; s#^+++ $f#+++ b/web/frontend/$f#"; done > $S/dists/$NAME.diff
rm -rf $S/dists/$NAME
t0=$(date +%s)
npx vite build --config $S/cfg/build.mts --outDir $S/dists/$NAME --emptyOutDir > $S/logs/build-$NAME.log 2>&1; rc=$?
echo "BUILD[$NAME] exit $rc in $(( $(date +%s) - t0 ))s" 
for f in $FILES; do cp $S/bak.$(basename $f) $f; n=$(shasum $f | cut -c1-40); [[ $n == $SHA[$f] ]] && echo "restored $f sha1 $n" || echo "RESTORE MISMATCH $f"; done
ls $S/dists/$NAME/assets | grep '^index-.*\.js$'
