#!/bin/bash
# ACC-SIX pass-6 — the pass-5 CRITIC's plants (pass5/critique/ACC-SIX/instruments/c5-gate-plants.sh), COPIED
# and re-pointed: no rm, no /tmp (LAWS P5); backups under the lane's scratch; runs on a scratch MIRROR of the
# work tree (node_modules symlinked), never on the tree. Each plant: applied to the REAL file, the gate run BARE
# with the pass-6 script AND the pass-5 script (the negative control: the pass-5 shape must stay green on the
# plants it was blind to), then restored (sha1 checked).
# usage: p6-gate-plants.sh <mirror web/frontend> <dir holding the pass-5 check-font-coverage.mjs + check-theme-tokens.mjs> <backup dir>
M=$1; P5=$2; B=$3; cd "$M" || exit 2
cp "$P5/check-font-coverage.mjs" scripts/p5-check-font-coverage.mjs; cp "$P5/check-theme-tokens.mjs" scripts/p5-check-theme-tokens.mjs
GG=src/pencil/chrome/GameGallery/GameGallery.vue; cp $GG $B/gg; G0=$(shasum $GG | cut -c1-12)
fc() { cp $B/gg $GG; python3 - "$GG" "$2" "$3" <<'PY'
import sys
f,imp,tag=sys.argv[1:]; s=open(f).read()
if imp: s=s.replace('import StagingBand from "./StagingBand.vue";','import StagingBand from "./StagingBand.vue";\n'+imp,1)
i=s.rindex('</template>'); j=s.rindex('</',0,i); s=s[:j]+tag+'\n'+s[j:]; open(f,'w').write(s)
PY
  node scripts/check-font-coverage.mjs >/dev/null 2>&1; a=$?; node scripts/p5-check-font-coverage.mjs >/dev/null 2>&1; b=$?; echo "font · $1 -> pass6 exit $a · pass5 exit $b"; }
fc "CONTROL plain <StagingBand :safe-verb>" "" '<StagingBand :safe-verb="planted" />'
fc "alias import <Band :safe-verb>" 'import Band from "./StagingBand.vue";' '<Band :safe-verb="planted" />'
fc "kebab tag <staging-band :safe-verb>" "" '<staging-band :safe-verb="planted" />'
fc "v-bind variable" "" '<StagingBand v-bind="plantedProps" />'
fc "unquoted :safe-verb=planted" "" '<StagingBand :safe-verb=planted />'
fc "dynamic arg v-bind:[k]" "" '<StagingBand v-bind:[plantedKey]="planted" />'
fc "CONTROL-GREEN a commented binding" "" '<!-- <StagingBand :safe-verb="planted" /> -->'
cp $B/gg $GG; echo "restored GameGallery $( [ "$(shasum $GG | cut -c1-12)" = "$G0" ] && echo sha-ok || echo SHA-MISMATCH)"
node scripts/check-font-coverage.mjs >/dev/null 2>&1; echo "font · the mirror as it stands -> exit $?"
SF=src/pencil/chrome/SvgFilters.vue; GP=src/games/shared/GameControlPanel.vue; HG=src/pencil/glyph/HandwrittenGlyph.vue
cp $SF $B/sf; cp $GP $B/gp; cp $HG $B/hg
tt() { node scripts/check-theme-tokens.mjs >/dev/null 2>&1; a=$?; node scripts/p5-check-theme-tokens.mjs >/dev/null 2>&1; b=$?; echo "law20 · $1 -> pass6 exit $a · pass5 exit $b"; }
sed -i '' 's/url(#sparkle-rainbow)/url(#solver-ink)/g' $GP; tt "CONTROL panel re-aimed"; cp $B/gp $GP
python3 - $SF <<'PY'
import sys; f=sys.argv[1]; s=open(f).read(); a=s.index('<linearGradient id="sparkle-rainbow"'); b=s.index('</linearGradient>',a)
s=s[:a]+'<linearGradient id="sparkle-rainbow" href="#solver-ink" x1="0%" y1="0%" x2="100%" y2="100%">\n      '+s[b:]; open(f,'w').write(s)
PY
tt "A sparkle-rainbow inherits #solver-ink's stops (href, no own stops)"; cp $B/sf $SF
python3 - $GP <<'PY'
import sys; f=sys.argv[1]; s=open(f).read(); i=s.index('<template>')+len('<template>'); j=s.index('>',s.index('<',i))+1
s=s[:j]+'\n<svg><path d="M0 0" :stroke="`url(#${inkId})`" /></svg>'+s[j:]; s=s.replace('<script setup lang="ts">','<script setup lang="ts">\nconst inkId = "solver-ink";',1); open(f,'w').write(s)
PY
tt "B chrome :stroke=\`url(#\${inkId})\` (the estate's own idiom)"; cp $B/gp $GP
python3 - $HG <<'PY'
import sys; f=sys.argv[1]; s=open(f).read(); s=s.replace('return "url(#solver-ink)";','return "url(#sparkle-rainbow)"; // was url(#solver-ink)',1); open(f,'w').write(s)
PY
tt "C admitted consumer struck, a comment keeps the count"; cp $B/hg $HG
node scripts/check-theme-tokens.mjs >/dev/null 2>&1; echo "law20 · the mirror as it stands -> exit $?"
mv scripts/p5-check-font-coverage.mjs scripts/p5-check-theme-tokens.mjs "$B/"
