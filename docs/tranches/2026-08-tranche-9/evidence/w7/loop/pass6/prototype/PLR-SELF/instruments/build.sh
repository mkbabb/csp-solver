#!/bin/bash
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend; S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself6; HS=$W/src/pencil/chrome/AttributionCard/HeadSheet.vue
mv $W/.plr-self $S/hold-plr-self
cd $W
npx vite build --config $S/vite.build-full.mts > $S/logs/build-full.log 2>&1; echo "full exit $?"
before=$(shasum $HS | cut -c1-12)
cp $HS $S/HeadSheet.hold.vue
sed -i '' 's/const EDGE_QUIET = false;/const EDGE_QUIET = true;/' $HS
grep -c 'const EDGE_QUIET = true;' $HS
npx vite build --config $S/vite.build-quiet.mts > $S/logs/build-quiet.log 2>&1; echo "quiet exit $?"
cp $S/HeadSheet.hold.vue $HS
after=$(shasum $HS | cut -c1-12); echo "HeadSheet sha $before -> $after"
mv $S/hold-plr-self $W/.plr-self
ls $S/dist-full/assets | grep -E '^index-.*\.js$'; ls $S/dist-full -R | grep -c '\.' ; find $S/dist-full -type f | wc -l; find $S/dist-quiet -type f | wc -l
ls $S/dist-quiet/assets | grep -E '^index-.*\.js$'
echo BUILD-DONE
