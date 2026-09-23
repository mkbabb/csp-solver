import fs from 'node:fs'; import path from 'node:path';
const W = process.argv[2];
const { check } = await import(path.join(W, 'scripts/check-tape-foot.mjs'));
const rd = (f) => fs.readFileSync(path.join(W, f), 'utf8');
const live = { scene: rd('src/games/shared/scene.css'), panel: rd('src/games/shared/GameControlPanel.vue'), ribbon: rd('src/games/shared/ConfirmRibbon.vue') };
const once = (s, a, b) => { if (!s.includes(a)) throw new Error('anchor missing: ' + a); return s.replace(a, b); };
const breaks = {
  'B1 pad 0 (the stroke on the viewport edge on a flat phone)': { scene: once(live.scene, 'calc(0.75rem + env(safe-area-inset-bottom))', 'max(0rem, env(safe-area-inset-bottom))') },
  'B2 lip hidden (.bar-frame visibility:hidden)': { panel: once(live.panel, '.bar-frame {\n  position: absolute;', '.bar-frame {\n  visibility: hidden;\n  position: absolute;') },
  'B3 lip unmounted (v-if="false")': { panel: once(live.panel, '<HandDrawnOutline\n          class="bar-frame"', '<HandDrawnOutline\n          v-if="false"\n          class="bar-frame"') },
  'B4 logical border on the bar (border-block-start 2.5px)': { panel: live.panel.replace(/(\.action-bar \{[^}]*?)padding-block/, '$1border-block-start: 2.5px solid;\n  padding-block') },
  'B5 box-shadow rule on the bar': { panel: live.panel.replace(/(\.action-bar \{[^}]*?)padding-block/, '$1box-shadow: inset 0 2px 0 currentColor;\n  padding-block') },
  'B6 foot z below card (z 0, positioned)': { scene: live.scene.replace(/(\.card-foot \{[^}]*?)z-index: 45;/, '$1z-index: 0;') },
  'B7 slab via background-image on the bar': { panel: live.panel.replace(/(\.action-bar \{[^}]*?)padding-block/, '$1background-image: linear-gradient(var(--color-card), var(--color-card));\n  padding-block') },
  'B8 lip stroke via a later override (.bar-frame :deep path stroke-width 0)': { panel: once(live.panel, '.action-bar > .action-verbs,', '.bar-frame :deep(path) { stroke-width: 0; }\n\n.action-bar > .action-verbs,') },
};
console.log('LIVE', JSON.stringify(check(live)));
for (const [k, patch] of Object.entries(breaks)) {
  const changed = Object.keys(patch).some((f) => patch[f] !== live[f]);
  const f = check({ ...live, ...patch });
  console.log((f.length ? 'RED   ' : 'GREEN ') + k + (changed ? '' : ' [PLANT DID NOT APPLY]') + (f.length ? ' :: ' + f.join(' | ').slice(0, 140) : ''));
}
