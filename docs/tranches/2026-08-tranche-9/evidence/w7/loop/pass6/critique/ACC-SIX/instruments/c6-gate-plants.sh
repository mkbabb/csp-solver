#!/bin/bash
# ACC-SIX pass-6 CRITIC break test (non-author): shapes the lane's pass-6 plants do not enumerate, planted on a
# scratch MIRROR of the tree (src/ scripts/ e2e/ package.json copied; node_modules symlinked), each restored from
# the tree after its run (cp, sha-checked at the end). A plant that exits 0 is a door still open.
# usage: c6-gate-plants.sh <mirror web/frontend> <tree web/frontend>     (no rm; no set -e)
M=$1; W=$2; cd $M
GG=src/pencil/chrome/GameGallery/GameGallery.vue
CP=src/games/shared/GameControlPanel.vue
tt() { node scripts/check-theme-tokens.mjs > /dev/null 2>&1; echo $?; }
fc() { node scripts/check-font-coverage.mjs > /dev/null 2>&1; echo $?; }
put() { # file, anchor-line-regex, text: insert text BEFORE the first line matching anchor
  node -e 'const fs=require("fs");const [f,a,t]=process.argv.slice(1);const s=fs.readFileSync(f,"utf8").split("\n");const i=s.findIndex(l=>new RegExp(a).test(l));if(i<0){console.error("NO ANCHOR",a);process.exit(3)}s.splice(i,0,t);fs.writeFileSync(f,s.join("\n"))' "$@"; }
restore() { cp $W/$GG $GG; cp $W/$CP $CP; }
echo "clean mirror: theme-tokens $(tt) · font-coverage $(fc)"
# ── law 20 (check-theme-tokens) ──
put $CP '^<template>' '<!-- plant -->'; restore
put $CP '<\/template>\s*$' '  <svg><path d="M0 0" stroke="url(#solver-ink)" /></svg>'; echo "LAW20 CONTROL a literal url(#solver-ink) in the panel template: $(tt) (must be 1)"; restore
put $CP '^<\/script>' 'const inkId = "solver-ink"; const inkUrl = `url(#${inkId})`;'; put $CP '<\/template>\s*$' '  <svg><path d="M0 0" :stroke="inkUrl" /></svg>'; echo "LAW20 T1 dynamic url(#\${id}) built in script, bound by NAME (:stroke=\"inkUrl\"): $(tt)"; restore
put $CP '<\/template>\s*$' "  <svg><path d=\"M0 0\" :stroke=\"'url(#' + 'solver-ink' + ')'\" /></svg>"; echo "LAW20 T2 string concatenation :stroke=\"'url(#' + 'solver-ink' + ')'\": $(tt)"; restore
put $CP '^<\/script>' 'const inkHref = "#solver-ink";'; put $CP '<\/template>\s*$' '  <svg><defs><linearGradient id="plant-grad" :href="inkHref" /></defs></svg>'; echo "LAW20 T3 gradient href by NAME (:href=\"inkHref\"): $(tt)"; restore
put $CP '<\/template>\s*$' '  <input accept="image/*" /><svg><path d="M0 0" stroke="url(#solver-ink)" /></svg>'; echo "LAW20 T4 a /* inside a string (accept=\"image/*\") swallows a literal consumer up to the next */: $(tt)"; restore
put $CP '<\/template>\s*$' '  <svg><path d="M0 0" :style="{ stroke: `url(#${inkId})` }" /></svg>'; echo "LAW20 CONTROL-2 the lane's own :style dynamic shape: $(tt) (must be 1)"; restore
# ── font census (check-font-coverage) ──
put $GG '<!-- THE STAGING BAND' '    <StagingBand :safe-verb="plantedVerb" />'; echo "FONT CONTROL <StagingBand :safe-verb=plantedVerb>: $(fc) (must be 1)"; restore
put $GG '<!-- THE STAGING BAND' '    <component :is="StagingBand" :safe-verb="plantedVerb" />'; echo "FONT F1 dynamic component <component :is=\"StagingBand\" :safe-verb>: $(fc)"; restore
put $GG '^import StagingBand' 'const Band2 = defineAsyncComponent(() => import("./StagingBand.vue"));'; put $GG '<!-- THE STAGING BAND' '    <Band2 :safe-verb="plantedVerb" />'; echo "FONT F2 defineAsyncComponent alias <Band2 :safe-verb>: $(fc)"; restore
put $GG '^import StagingBand' 'import { default as Band3 } from "./StagingBand.vue";'; put $GG '<!-- THE STAGING BAND' '    <Band3 :safe-verb="plantedVerb" />'; echo "FONT F3 named-default import alias <Band3 :safe-verb>: $(fc)"; restore
put $GG '^<\/script>' 'const planted = () => h(StagingBand, { safeVerb: plantedVerb });'; echo "FONT F4 render function h(StagingBand, { safeVerb }): $(fc)"; restore
restore; for f in $GG $CP; do cmp -s $W/$f $f && echo "restored $f OK" || echo "RESTORE FAILED $f"; done
echo "clean mirror again: theme-tokens $(tt) · font-coverage $(fc)"
