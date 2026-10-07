// CTRL-TAPE pass-8 critic: NEW one-line siblings fed in memory to the element-keyed check() (no tree file written).
// Run from the lane's web/frontend: FE=$PWD node <this>. Pass 7's 43 plants run first via pass7/critique/.../breaks7.mjs.
import fs from "node:fs";
const W = process.env.FE ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27/web/frontend";
const { check } = await import(W + "/scripts/check-tape-foot.mjs");
const PANEL = "src/games/shared/GameControlPanel.vue", SCENE = "src/games/shared/scene.css", GS = "src/games/shared/GameScene.vue", IDX = "src/assets/index.css";
const rd = (r) => fs.readFileSync(W + "/" + r, "utf8");
const live = { [PANEL]: rd(PANEL), [SCENE]: rd(SCENE), [GS]: rd(GS), [IDX]: rd(IDX) };
const need = (s, a) => { if (!(typeof a === "string" ? s.includes(a) : a.test(s))) throw new Error("anchor missing: " + a); return s; };
const addPanel = (rule) => ({ [PANEL]: need(live[PANEL], ".action-bar > .action-verbs,").replace(".action-bar > .action-verbs,", rule + "\n\n.action-bar > .action-verbs,") });
const addScene = (rule) => ({ [SCENE]: live[SCENE] + "\n" + rule + "\n" });
const addIdx = (rule) => ({ [IDX]: live[IDX] + "\n" + rule + "\n" });
const bar = (d) => ({ [PANEL]: need(live[PANEL], /(\n\.action-bar \{[^}]*?)padding-block/).replace(/(\n\.action-bar \{[^}]*?)padding-block/, `$1${d};\n  padding-block`) });
const footTpl = (from, to) => ({ [GS]: need(live[GS], from).replace(from, to) });
const barTpl = (from, to) => ({ [PANEL]: need(live[PANEL], from).replace(from, to) });
const X = [
  // --- the regime set's blind spots (REGIMES = 7 cells, no prm/contrast/forced/dpr/portrait-tablet/>1440)
  ["M1 @media (min-width: 1600px) { .drawer-case { display: block } } (a 1920 desk)", addScene("@media (min-width: 1600px) { .drawer-case { display: block; } }")],
  ["M2 @media (min-resolution: 2dppx) { .card-foot { overflow: clip } } (every retina/phone)", addScene("@media (min-resolution: 2dppx) { .card-foot { overflow: clip; } }")],
  ["M3 @media (prefers-reduced-motion: reduce) { .card-foot { opacity: 0 } }", addScene("@media (prefers-reduced-motion: reduce) { .card-foot { opacity: 0; } }")],
  ["M4 @media (prefers-contrast: more) { .action-bar { visibility: hidden } }", addPanel("@media (prefers-contrast: more) { .action-bar { visibility: hidden; } }")],
  ["M5 @media (orientation: portrait) and (min-width: 700px) { .drawer-case { display: block } } (iPad portrait)", addScene("@media (orientation: portrait) and (min-width: 700px) { .drawer-case { display: block; } }")],
  ["M6 @media (prefers-color-scheme: dark) { .card-foot { padding-bottom: 0 } }", addScene("@media (prefers-color-scheme: dark) { .card-foot { padding-bottom: 0; } }")],
  ["M7 @media (min-height: 1000px) { .drawer-case { flex-direction: row } }", addScene("@media (min-height: 1000px) { .drawer-case { flex-direction: row; } }")],
  ["M8 @media (forced-colors: active) { .bar-frame { display: none } }", addPanel("@media (forced-colors: active) { .bar-frame { display: none; } }")],
  // --- the column: automatic minimum and line-breaking
  ["C1 .controls-card { overflow-y: visible } (automatic min = content: the card cannot shrink)", addScene("@media (min-width: 1024px) { .controls-card { overflow-y: visible; } }")],
  ["C2 .drawer-case { flex-wrap: wrap } (the foot wraps to a second column)", addScene(".drawer-case { flex-wrap: wrap; }")],
  ["C3 .drawer-case { flex-direction: column-reverse }", addScene(".drawer-case { flex-direction: column-reverse; }")],
  ["C4 .card-foot { order: -1 } (the foot above the card)", addScene(".card-foot { order: -1; }")],
  ["C5 .controls-card { flex: 1 0 auto }", addScene(".controls-card { flex: 1 0 auto; }")],
  ["C6 .drawer-case { max-height: 999rem } (a vacuous cap)", addScene("@media (min-width: 1024px) { .drawer-case { max-height: 999rem; } }")],
  ["C7 .controls-card { overflow-y: clip } (clip is not a scrollport)", addScene("@media (min-width: 1024px) { .controls-card { overflow-y: clip; } }")],
  ["C8 .drawer-case { display: grid }", addScene(".drawer-case { display: grid; }")],
  ["C9 .card-foot { margin-top: 100vh }", addScene(".card-foot { margin-top: 100vh; }")],
  ["C10 .card-foot { padding-top: 100vh }", addScene(".card-foot { padding-top: 100vh; }")],
  ["C11 .card-foot { height: 0 }", addScene(".card-foot { height: 0; }")],
  ["C12 .action-bar { height: 0 } (the frame collapses to the bar's box)", bar("height: 0")],
  ["C13 .controls-card { z-index: 99; margin-bottom: -4rem } (the card laps the foot)", addScene(".controls-card { z-index: 99; margin-bottom: -4rem; }")],
  ["C14 .drawer-case { padding-bottom: 100vh }", addScene(".drawer-case { padding-bottom: 100vh; }")],
  // --- paint that is not a named prop
  ["P1 .card-foot { display: none }", addScene(".card-foot { display: none; }")],
  ["P2 .action-bar { visibility: hidden }", bar("visibility: hidden")],
  ["P3 .card-foot { content-visibility: hidden }", addScene(".card-foot { content-visibility: hidden; }")],
  ["P4 .card-foot { animation: tapefade 1ms forwards } + @keyframes to{opacity:0}", addScene("@keyframes tapefade { to { opacity: 0; } }\n.card-foot { animation: tapefade 1ms forwards; }")],
  ["P5 .card-foot::after paper slab over the bar", addScene('.card-foot::after { content: ""; position: absolute; inset: 0; background: var(--color-card); z-index: 99; }')],
  ["P6 .action-bar { color: transparent }", bar("color: transparent")],
  ["P7 .action-bar { font-size: 0 }", bar("font-size: 0")],
  ["P8 .card-foot { overflow: var(--foot-ov) } + :root { --foot-ov: hidden }", addScene(":root { --foot-ov: hidden; }\n.card-foot { overflow: var(--foot-ov); }")],
  ["P9 .card-foot { @apply overflow-hidden }", addScene(".card-foot { @apply overflow-hidden; }")],
  ["P10 index.css: * { contain: paint }", addIdx("* { contain: paint; }")],
  ["P11 index.css: body .card-foot { overflow: clip }", addIdx("body .card-foot { overflow: clip; }")],
  ["P12 .drawer-case > * { overflow: clip }", addScene(".drawer-case > * { overflow: clip; }")],
  ["P13 .card-foot { mix-blend-mode: multiply; opacity: 1 } + isolation (control: harmless)", addScene(".card-foot { isolation: isolate; }")],
  // --- the template
  ["T1 inline style=overflow:hidden on #card-foot", footTpl('class="card-foot"', 'class="card-foot"\n          style="overflow: hidden"')],
  ["T2 :style binding opacity on the bar", barTpl('class="action-bar"', 'class="action-bar"\n        :style="{ opacity: 0 }"')],
  ["T3 v-if=false on the bar", barTpl('class="action-bar"', 'class="action-bar"\n        v-if="false"')],
  ["T4 v-show=false on #card-foot", footTpl('class="card-foot"', 'class="card-foot"\n          v-show="false"')],
  ["T5 Teleport disabled always", barTpl(':disabled="!footBerth"', ':disabled="true"')],
  ["T6 hidden attribute on #card-foot", footTpl('class="card-foot"', 'class="card-foot"\n          hidden')],
];
let g = 0;
console.log(`live: ${check().length} fails`);
for (const [name, patch] of X) {
  const applied = Object.keys(patch).some((k) => patch[k] !== live[k]);
  let f; try { f = check(patch); } catch (e) { console.log(`X THREW ${String(e.message).slice(0, 80)}  ${name}`); continue; }
  const v = !applied ? "NOT-APPLIED" : f.length ? "RED  " + [...new Set(f.map((x) => x.split(":")[0]))].join("|") : "GREEN";
  if (applied && !f.length) g++;
  console.log(`X ${v.padEnd(34)} ${name}`);
}
console.log(`pass-8 new siblings GREEN ${g}/${X.length}`);
