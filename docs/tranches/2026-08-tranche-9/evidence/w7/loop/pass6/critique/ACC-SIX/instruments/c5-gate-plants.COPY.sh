#!/bin/zsh
# CRITIC COPY (pass6/critique/ACC-SIX) of pass5/critique/ACC-SIX/instruments/c5-gate-plants.sh: /tmp re-pointed to the critic scratch; plants unchanged.
# ACC-SIX pass-5 CRITIC — try to green the two re-cut gates on a BROKEN tree. Runs on a scratch MIRROR of the
# work tree (rsync minus node_modules/dist/test-results, node_modules symlinked); each plant is applied,
# the gate run BARE, and the file restored (sha1 checked). Never touches the work tree.
# usage: c5-gate-plants.sh <mirror dir>
M=$1; cd $M || exit 2
GG=src/pencil/chrome/GameGallery/GameGallery.vue; cp $GG /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/gg
fc() { cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/gg $GG; python3 - "$GG" "$2" "$3" <<'PY'
import sys
f,imp,tag=sys.argv[1:]; s=open(f).read()
if imp: s=s.replace('import StagingBand from "./StagingBand.vue";','import StagingBand from "./StagingBand.vue";\n'+imp,1)
i=s.rindex('</template>'); j=s.rindex('</',0,i); s=s[:j]+tag+'\n'+s[j:]; open(f,'w').write(s)
PY
  node scripts/check-font-coverage.mjs >/dev/null 2>&1; echo "font · $1 -> exit $?"; }
fc "CONTROL plain <StagingBand :safe-verb>" "" '<StagingBand :safe-verb="planted" />'
fc "alias import <Band :safe-verb>" 'import Band from "./StagingBand.vue";' '<Band :safe-verb="planted" />'
fc "kebab tag <staging-band :safe-verb>" "" '<staging-band :safe-verb="planted" />'
fc "v-bind variable" "" '<StagingBand v-bind="plantedProps" />'
fc "unquoted :safe-verb=planted" "" '<StagingBand :safe-verb=planted />'
fc "dynamic arg v-bind:[k]" "" '<StagingBand v-bind:[plantedKey]="planted" />'
cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/gg $GG
SF=src/pencil/chrome/SvgFilters.vue; GP=src/games/shared/GameControlPanel.vue; HG=src/pencil/glyph/HandwrittenGlyph.vue
cp $SF /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/sf; cp $GP /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/gp; cp $HG /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/hg
tt() { node scripts/check-theme-tokens.mjs >/dev/null 2>&1; echo "law20 · $1 -> exit $?"; }
sed -i '' 's/url(#sparkle-rainbow)/url(#solver-ink)/g' $GP; tt "CONTROL panel re-aimed"; cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/gp $GP
python3 - $SF <<'PY'
import sys; f=sys.argv[1]; s=open(f).read(); a=s.index('<linearGradient id="sparkle-rainbow"'); b=s.index('</linearGradient>',a)
s=s[:a]+'<linearGradient id="sparkle-rainbow" href="#solver-ink" x1="0%" y1="0%" x2="100%" y2="100%">\n      '+s[b:]; open(f,'w').write(s)
PY
tt "A sparkle-rainbow inherits #solver-ink's stops (href, no own stops)"; cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/sf $SF
python3 - $GP <<'PY'
import sys; f=sys.argv[1]; s=open(f).read(); i=s.index('<template>')+len('<template>'); j=s.index('>',s.index('<',i))+1
s=s[:j]+'\n<svg><path d="M0 0" :stroke="`url(#${inkId})`" /></svg>'+s[j:]; s=s.replace('<script setup lang="ts">','<script setup lang="ts">\nconst inkId = "solver-ink";',1); open(f,'w').write(s)
PY
tt "B chrome :stroke=\`url(#\${inkId})\` (the estate's own idiom)"; cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/gp $GP
python3 - $HG <<'PY'
import sys; f=sys.argv[1]; s=open(f).read(); s=s.replace('return "url(#solver-ink)";','return "url(#sparkle-rainbow)"; // was url(#solver-ink)',1); open(f,'w').write(s)
PY
tt "C admitted consumer struck, a comment keeps the count"; cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/hg $HG
rm /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/gg /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/sf /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/gp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/p5plant/hg
