#!/bin/bash
# PLANT K (MOT-VERB's pass-5 critic, critique/MOT-VERB.md §2.2) — the ONE copy (pass6/instruments).
# The grid's coverage mask defeated by CSS (`!important` beats the inline style), so every pose
# box paints a SOLID square of ink over the board while the inline mask URL is untouched. A gate
# that reads computed style (theme-bake-freshness's grid half, visual-regression) stays green;
# a gate that reads PAINT must red. Ship it beside any re-cut off a bake or a blob (LAWS P5).
#
#   plant-k.sh <tree web/frontend> <scratch dir> <vite build config .mts>
# Builds the PLANTED dist to <scratch>/dist-plantK and restores the file (cp + shasum -c).
# No rm: the backup is overwritten by redirection; <scratch> is lane-unique and the chair's to clean.
WT=$1; S=$2; CFG=$3
G=$WT/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue
mkdir -p $S/bak
cp $G $S/bak/HandDrawnGrid.vue; shasum $G > $S/bak/shaG
perl -0pi -e 's/<style scoped>/<style scoped>\n.grid-ink .boil-frame-bitmap { mask-image: none !important; -webkit-mask-image: none !important; }/' $G
echo "planted: $(grep -c 'mask-image: none !important' $G) rule(s)"
(cd $WT && npx vite build --config $CFG --outDir $S/dist-plantK --emptyOutDir > $S/plantK-build.log 2>&1); echo "BUILD EXIT $?"
cp $S/bak/HandDrawnGrid.vue $G; shasum -c $S/bak/shaG
ls $S/dist-plantK/assets | grep '^index-.*\.js$'
