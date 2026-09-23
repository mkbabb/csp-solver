#!/bin/bash
# PLANT K: the coverage mask defeated by CSS (!important beats the inline style), so every pose
# box paints a SOLID square of ink over the board; the inline mask URL is untouched.
WT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
G=$WT/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue
cp $G <critic-scratch>/bak/G; shasum $G > <critic-scratch>/bak/shaG
perl -0pi -e 's/<style scoped>/<style scoped>\n.grid-ink .boil-frame-bitmap { mask-image: none !important; -webkit-mask-image: none !important; }/' $G
grep -c "mask-image: none !important" $G
cd $WT && npx vite build --config <critic-scratch>/build.mts --outDir <critic-scratch>/dist-plantK --emptyOutDir > <critic-scratch>/plantK-build.log 2>&1; echo "BUILD EXIT $?"
cp <critic-scratch>/bak/G $G; shasum -c <critic-scratch>/bak/shaG
ls <critic-scratch>/dist-plantK/assets | grep "^index-"
