#!/bin/bash
# ACC-SIX pass-7 CRITIC break test (non-author): shapes the lane's pass-7 plants do not enumerate, planted on a scratch
# MIRROR of the tree (src/ scripts/ e2e/ public/ copied; node_modules symlinked), each restored by cp from the tree after
# its run (cmp-checked at the end). A plant that exits 0 is a door still open. usage: c7-gate-plants.sh <mirror fe> <tree fe>
# (no rm; no set -e; a created file is emptied with : > and never deleted — the chair's scratch)
M=$1; W=$2; cd $M
GG=src/pencil/chrome/GameGallery/GameGallery.vue
CP=src/games/shared/GameControlPanel.vue
APP=src/App.vue
tt() { node scripts/check-theme-tokens.mjs > /dev/null 2>&1; echo $?; }
fc() { node scripts/check-font-coverage.mjs > /dev/null 2>&1; echo $?; }
put() { node -e 'const fs=require("fs");const [f,a,t]=process.argv.slice(1);const s=fs.readFileSync(f,"utf8").split("\n");const i=s.findIndex(l=>new RegExp(a).test(l));if(i<0){console.error("NO ANCHOR",a);process.exit(3)}s.splice(i,0,t);fs.writeFileSync(f,s.join("\n"))' "$@"; }
restore() { cp $W/$GG $GG; cp $W/$CP $CP; cp $W/$APP $APP; }
echo "sha1 check-theme-tokens $(shasum scripts/check-theme-tokens.mjs | cut -c1-12) check-font-coverage $(shasum scripts/check-font-coverage.mjs | cut -c1-12) shape-census $(shasum scripts/lib/shape-census.mjs | cut -c1-12)"
echo "clean mirror: theme-tokens $(tt) · font-coverage $(fc)"
echo "── the lane's pass-6 doors, re-run first (must all be 1) ──"
put $CP '^<\/script>' 'const inkId = "solver-ink"; const inkUrl = `url(#${inkId})`;'; put $CP '<\/template>\s*$' '  <svg><path d="M0 0" :stroke="inkUrl" /></svg>'; echo "LAW20 T1 (pass 6) bound by name: $(tt)"; restore
put $CP '<\/template>\s*$' '  <input accept="image/*" /><svg><path d="M0 0" stroke="url(#solver-ink)" /></svg>'; echo "LAW20 T4 (pass 6) accept=image/*: $(tt)"; restore
put $GG '<!-- THE STAGING BAND' '    <component :is="StagingBand" :safe-verb="plantedVerb" />'; echo "FONT F1 (pass 6) component :is: $(fc)"; restore
put $GG '^<\/script>' 'const planted = () => h(StagingBand, { safeVerb: plantedVerb });'; echo "FONT F4 (pass 6) h(): $(fc)"; restore
echo "── law 20, new shapes ──"
put $CP '<\/template>\s*$' '  <svg><path d="M0 0" stroke="url(#solver-ink)" /></svg>'; echo "LAW20 CONTROL literal consumer: $(tt) (must be 1)"; restore
put $CP '^<\/script>' 'const inkId = "solver-ink"; const filter = `url(#${inkId})`;'; put $CP '<\/template>\s*$' '  <svg><path d="M0 0" :stroke="filter" /></svg>'; echo "LAW20 T6 the holding NAME spells a non-paint property (const filter = \`url(#\${inkId})\`; :stroke=\"filter\"): $(tt)"; restore
put $CP '^<\/script>' 'const inkId = "solver-ink"; const clipPath = `url(#${inkId})`;'; put $CP '<\/template>\s*$' '  <svg><path d="M0 0" :fill="clipPath" /></svg>'; echo "LAW20 T6b the same, const clipPath bound to :fill: $(tt)"; restore
put $CP '^<\/script>' 'const inkId = "solver-ink"; const base = ""; const inkUrl = `url(${base}#${inkId})`;'; put $CP '<\/template>\s*$' '  <svg><path d="M0 0" :stroke="inkUrl" /></svg>'; echo "LAW20 T7 the base-URL idiom url(\${base}#\${id}) (the Safari <base href> cure): $(tt)"; restore
put $CP '^<\/script>' 'const inkId = "solver-ink";'; put $CP '<\/template>\s*$' "  <svg><path d=\"M0 0\" :stroke=\"\`url(\${'#' + inkId})\`\" /></svg>"; echo "LAW20 T8 the hash inside the interpolation url(\${'#' + inkId}): $(tt)"; restore
put $CP '<\/template>\s*$' '  <svg><path d="M0 0" stroke="url(&#35;solver-ink)" /></svg>'; echo "LAW20 T9 an HTML entity in a static attribute (url(&#35;solver-ink); Vue decodes it): $(tt)"; restore
put $CP '<\/template>\s*$' '  <svg><path class="plant-esc" d="M0 0" /></svg>'; printf '\n<style>\n.plant-esc { stroke: url(#solver\\-ink); }\n</style>\n' >> $CP; echo "LAW20 T10 a CSS escape in a url token (url(#solver\\-ink)): $(tt)"; restore
echo "── font census, new shapes ──"
put $GG '<!-- THE STAGING BAND' '    <StagingBand :safe-verb="plantedVerb" />'; echo "FONT CONTROL plain tag: $(fc) (must be 1)"; restore
put $GG '^<\/script>' 'const planted = () => h(StagingBand, { ...bandProps });'; echo "FONT F5 a SPREAD in h()'s props (h(StagingBand, { ...bandProps })): $(fc)"; restore
put $GG '^<\/script>' 'const planted = () => h(StagingBand, { ["safeVerb"]: plantedVerb });'; echo "FONT F6 a computed KEY in h()'s props ({ [\"safeVerb\"]: x }): $(fc)"; restore
put $GG '^<\/script>' 'const planted = () => createVNode(StagingBand, { safeVerb: plantedVerb });'; echo "FONT F7 createVNode(StagingBand, { safeVerb }): $(fc)"; restore
printf 'export { default as Band } from "./StagingBand.vue";\n' > src/pencil/chrome/GameGallery/plantBands.ts
put $GG '^import StagingBand' 'import { Band as Band8 } from "./plantBands";'; put $GG '<!-- THE STAGING BAND' '    <Band8 :safe-verb="plantedVerb" />'; echo "FONT F8 a barrel re-export alias (import { Band as Band8 } from \"./plantBands\"): $(fc)"; restore
put $GG '<!-- THE STAGING BAND' '    <NoSuchSink :safe-verb="plantedVerb" />'; echo "FONT F9 a PascalCase tag the map cannot resolve to any file (fail-open?): $(fc)"; restore
: > src/pencil/chrome/GameGallery/plantBands.ts
put $APP ':is="sceneFor\(scene\)"' '          :safe-verb="plantedVerb"'; echo "FONT F10 a SECOND bind at a PINNED unresolved site (the pin's prose says one bind, :leaving): $(fc)"; restore
restore; for f in $GG $CP $APP; do cmp -s $W/$f $f && echo "restored $f OK" || echo "RESTORE FAILED $f"; done
echo "clean mirror again: theme-tokens $(tt) · font-coverage $(fc)   (src/pencil/chrome/GameGallery/plantBands.ts left EMPTY in the mirror, chair's scratch)"
