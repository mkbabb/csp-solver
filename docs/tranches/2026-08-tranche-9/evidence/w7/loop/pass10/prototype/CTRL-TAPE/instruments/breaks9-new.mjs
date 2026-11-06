// CTRL-TAPE pass-9 critic: NEW one-line siblings of the pass-9 clauses (9a-9f, 4a, apply, 11a/11b), fed in memory
// to the element-keyed check() (no tree file written). Run from a web/frontend: FE=$PWD node <this>.
// The pass-7 43 (breaks7.mjs) and pass-8 41 (breaks8.mjs) run first. A plant that MOVES PAINT and reads GREEN is a
// class escape; one marked (control) moves no paint and must stay GREEN.
import fs from "node:fs";
const W = process.env.FE;
if (!W) throw new Error("FE unset");
const { check } = await import(W + "/scripts/check-tape-foot.mjs");
const PANEL = "src/games/shared/GameControlPanel.vue", SCENE = "src/games/shared/scene.css", GS = "src/games/shared/GameScene.vue", IDX = "src/assets/index.css";
const rd = (r) => fs.readFileSync(W + "/" + r, "utf8");
const live = { [PANEL]: rd(PANEL), [SCENE]: rd(SCENE), [GS]: rd(GS), [IDX]: rd(IDX) };
const need = (s, a) => { if (!(typeof a === "string" ? s.includes(a) : a.test(s))) throw new Error("anchor missing: " + a); return s; };
const addPanel = (rule) => ({ [PANEL]: need(live[PANEL], ".action-bar > .action-verbs,").replace(".action-bar > .action-verbs,", rule + "\n\n.action-bar > .action-verbs,") });
const addScene = (rule) => ({ [SCENE]: live[SCENE] + "\n" + rule + "\n" });
const desk = (rule) => addScene("@media (min-width: 1024px) { " + rule + " }");
const addIdx = (rule) => ({ [IDX]: live[IDX] + "\n" + rule + "\n" });
const bar = (d) => ({ [PANEL]: need(live[PANEL], /(\n\.action-bar \{[^}]*?)padding-block/).replace(/(\n\.action-bar \{[^}]*?)padding-block/, `$1${d};\n  padding-block`) });
const gsTpl = (from, to) => ({ [GS]: need(live[GS], from).replace(from, to) });
const barTpl = (from, to) => ({ [PANEL]: need(live[PANEL], from).replace(from, to) });
const X = [
  // --- 9b: the cap HAS a value, but other properties beat it
  ["B1 desk .drawer-case { min-height: 200vh } (min beats max)", desk(".drawer-case { min-height: 200vh; }")],
  ["B2 desk .drawer-case { min-block-size: 200vh }", desk(".drawer-case { min-block-size: 200vh; }")],
  ["B3 desk .drawer-case { max-block-size: 999rem } (logical twin of the cap)", desk(".drawer-case { max-block-size: 999rem; }")],
  ["B4 desk .drawer-case { max-height: 100vmax } (1440 > 900)", desk(".drawer-case { max-height: 100vmax; }")],
  ["B5 desk .drawer-case { max-height: 50in }", desk(".drawer-case { max-height: 50in; }")],
  ["B6 desk .drawer-case { max-height: 1e4px }", desk(".drawer-case { max-height: 1e4px; }")],
  ["B7 desk .drawer-case { max-height: 200svh }", desk(".drawer-case { max-height: 200svh; }")],
  ["B8 desk .drawer-case { max-height: 100cqh }", desk(".drawer-case { max-height: 100cqh; }")],
  ["B9 :root{--cap:999rem} desk .drawer-case { max-height: var(--cap) } (a PUBLISHED vacuous var)", addScene(":root { --tcap9: 999rem; }\n@media (min-width: 1024px) { .drawer-case { max-height: var(--tcap9); } }")],
  ["B10 @media (min-width: 1600px) { .drawer-case { max-height: none } } (a 1920 desk)", addScene("@media (min-width: 1600px) { .drawer-case { max-height: none; } }")],
  ["B11 @supports (display: grid) { .drawer-case { max-height: none } }", addScene("@supports (display: grid) { .drawer-case { max-height: none; } }")],
  ["B12 desk .drawer-case { max-height: 1000ex }", desk(".drawer-case { max-height: 1000ex; }")],
  // --- 9a: the card is a scrollport but cannot shrink
  ["A1 desk .controls-card { min-height: 100vh }", desk(".controls-card { min-height: 100vh; }")],
  ["A2 desk .controls-card { min-block-size: 100vh }", desk(".controls-card { min-block-size: 100vh; }")],
  ["A3 desk .controls-card { flex-shrink: 0; height: 200vh }", desk(".controls-card { flex-shrink: 0; height: 200vh; }")],
  ["A4 desk .controls-card { overflow-block: visible } (the logical twin)", desk(".controls-card { overflow-block: visible; }")],
  // --- the column: gaps, writing mode, shorthand flow
  ["G1 .drawer-case { row-gap: 100vh }", addScene(".drawer-case { row-gap: 100vh; }")],
  ["G2 .drawer-case { gap: 100vh 0 }", addScene(".drawer-case { gap: 100vh 0; }")],
  ["G3 .drawer-case { writing-mode: vertical-rl } (the column turns)", addScene(".drawer-case { writing-mode: vertical-rl; }")],
  ["G4 .drawer-case { flex-flow: column-reverse }", addScene(".drawer-case { flex-flow: column-reverse; }")],
  ["G5 .drawer-case::after { content:''; height:100vh; flex:none } (a box after the foot)", addScene('.drawer-case::after { content: ""; display: block; height: 100vh; flex: none; }')],
  ["G6 .drawer-case { border-bottom: 100vh solid transparent }", addScene(".drawer-case { border-bottom: 100vh solid transparent; }")],
  ["G7 .drawer-case { justify-content: space-between } (control: harmless when the cap binds)", addScene(".drawer-case { justify-content: flex-start; }")],
  // --- 9d: nothing above the tape, by other means
  ["D1 .card-foot { position: relative; top: 100vh }", addScene(".card-foot { top: 100vh; }")],
  ["D2 .card-foot { inset-block-start: 100vh }", addScene(".card-foot { inset-block-start: 100vh; }")],
  ["D3 .card-foot { transform: translateY(100vh) }", addScene(".card-foot { transform: translateY(100vh); }")],
  ["D4 .card-foot { translate: 0 100vh }", addScene(".card-foot { translate: 0 100vh; }")],
  ["D5 .card-foot { border-top: 100vh solid transparent }", addScene(".card-foot { border-top: 100vh solid transparent; }")],
  ["D6 .card-foot::before { content:''; display:block; height:100vh }", addScene('.card-foot::before { content: ""; display: block; height: 100vh; }')],
  ["D7 .card-foot { line-height: 100vh }", addScene(".card-foot { line-height: 100vh; }")],
  ["D8 .card-foot { scale: 1 0 }", addScene(".card-foot { scale: 1 0; }")],
  ["D9 .card-foot { zoom: 0.01 }", addScene(".card-foot { zoom: 0.01; }")],
  ["D10 #card-foot { margin-top: 100vh } (id selector)", addScene("#card-foot { margin-top: 100vh; }")],
  ["D11 :where(.card-foot) { margin-top: 100vh }", addScene(":where(.card-foot) { margin-top: 100vh; }")],
  ["D12 .drawer-case > :last-child { margin-top: 100vh }", addScene(".drawer-case > :last-child { margin-top: 100vh; }")],
  ["D13 [id='card-foot'] { padding-top: 100vh }", addScene("[id='card-foot'] { padding-top: 100vh; }")],
  ["D14 @supports (display: flex) { .card-foot { margin-top: 100vh } }", addScene("@supports (display: flex) { .card-foot { margin-top: 100vh; } }")],
  ["D15 .card-foot { margin-top: auto } (control: the foot is already last)", addScene(".card-foot { margin-top: auto; }")],
  // --- 9f / the bar: grows or lifts by other means
  ["F1 .action-bar { min-height: 100vh }", bar("min-height: 100vh")],
  ["F2 .action-bar { min-block-size: 100vh }", bar("min-block-size: 100vh")],
  ["F3 .action-bar { margin-top: 100vh }", bar("margin-top: 100vh")],
  ["F4 .action-bar { padding-top: 100vh }", bar("padding-top: 100vh")],
  ["F5 .action-bar { line-height: 0; overflow: clip }", bar("line-height: 0")],
  ["F6 .action-bar { order: 5 } (inside the foot)", bar("order: 5")],
  // --- 4a: the voice the verbs take, by other means
  ["V1 .action-bar { font-size: xx-small } (9px)", bar("font-size: xx-small")],
  ["V2 .action-bar { font-size: 0.1em }", bar("font-size: 0.1em")],
  ["V3 .action-bar { font-size: calc(1rem - 15px) }", bar("font-size: calc(1rem - 15px)")],
  ["V4 .action-bar { font-size: 1% }", bar("font-size: 1%")],
  ["V5 .action-bar > .action-verbs { font-size: 0 } (the verbs, not the bar)", addPanel(".action-bar > .action-verbs { font-size: 0; }")],
  ["V6 .action-bar button { font-size: 1px }", addPanel(".action-bar button { font-size: 1px; }")],
  ["V7 .action-bar { font-size: 50vh } (a voice that overflows the foot)", bar("font-size: 50vh")],
  // --- 11a/11b: the template, by other spellings
  ["T7 v-show=false on .scene-controls (the case's ancestor)", gsTpl('class="scene-controls', 'v-show="false"\n      class="scene-controls')],
  ["T8 class 'hidden' utility on #card-foot", gsTpl('class="card-foot"', 'class="card-foot hidden"')],
  ["T9 :class bound 'hidden' on #card-foot", gsTpl(":class=\"rowRegime ? 'px-5' : 'px-2'\"\n        ></div>", ":class=\"rowRegime ? 'px-5 hidden' : 'px-2 hidden'\"\n        ></div>")],
  ["T10 Teleport :disabled=\"!undefined\" (an identifier that is a constant)", barTpl(':disabled="!footBerth"', ':disabled="!undefined"')],
  ["T11 Teleport :disabled=\"Boolean(1)\"", barTpl(':disabled="!footBerth"', ':disabled="Boolean(1)"')],
  ["T12 Teleport :disabled=\"!footBerth || true\"", barTpl(':disabled="!footBerth"', ':disabled="!footBerth || true"')],
  ["T13 Teleport :to=\"'body'\" (bound target)", barTpl('to="#card-foot"', ":to=\"'body'\"")],
  ["T14 inline style on .drawer-case HandDrawnOutline: display:block", gsTpl('class="drawer-case"', 'class="drawer-case"\n        style="display: block"')],
  ["T15 :style on #card-foot { marginTop: '100vh' }", gsTpl('class="card-foot"', 'class="card-foot"\n          :style="{ marginTop: \'100vh\' }"')],
  ["T16 utility mt-[100vh] on #card-foot", gsTpl('class="card-foot"', 'class="card-foot mt-[100vh]"')],
  ["T17 utility translate-y-full on #card-foot", gsTpl('class="card-foot"', 'class="card-foot translate-y-full"')],
  ["T18 utility min-h-screen on .controls-card", gsTpl('class="controls-card bg-card"', 'class="controls-card bg-card lg:min-h-screen"')],
];
let g = 0, ctl = 0;
const LIVE = new Set(check()); console.log(`live: ${LIVE.size} fails (a sibling must add one)`);
for (const [name, patch] of X) {
  const applied = Object.keys(patch).some((k) => patch[k] !== live[k]);
  let f; try { f = check(patch).filter((x) => !LIVE.has(x)); } catch (e) { console.log(`X THREW ${String(e.message).slice(0, 80)}  ${name}`); continue; }
  const v = !applied ? "NOT-APPLIED" : f.length ? "RED  " + [...new Set(f.map((x) => x.split(":")[0]))].join("|").slice(0, 40) : "GREEN";
  const isCtl = /control:/.test(name);
  if (applied && !f.length) (isCtl ? ctl++ : g++);
  console.log(`X ${v.padEnd(44)} ${name}`);
}
console.log(`pass-9 critic siblings: escapes GREEN ${g}/${X.filter(([n]) => !/control:/.test(n)).length}; controls GREEN ${ctl}/${X.filter(([n]) => /control:/.test(n)).length}`);
