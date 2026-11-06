// CTRL-TAPE pass-10 critic: NEW one-line siblings of the pass-10 clauses (12 admitted list, 11b constantOf,
// 11c, 12s), fed in memory to check() (no tree file written). Run from a web/frontend: FE=$PWD node <this>.
// A plant marked (paint) is one this critic expects to move the verbs on paint; GREEN = escape.
import fs from "node:fs";
const W = process.env.FE;
if (!W) throw new Error("FE unset");
const { check, constantOf } = await import(W + "/scripts/check-tape-foot.mjs");
const PANEL = "src/games/shared/GameControlPanel.vue", SCENE = "src/games/shared/scene.css", IDX = "src/assets/index.css",
  APP = "src/App.vue", HTML = "index.html", WASHI = "src/pencil/sheet/SheetWashiLabel.vue";
const rd = (r) => fs.readFileSync(W + "/" + r, "utf8");
const live = Object.fromEntries([PANEL, SCENE, IDX, APP, HTML, WASHI].map((f) => [f, rd(f)]));
const once = (f, a, b) => (live[f].includes(a) ? { [f]: live[f].replace(a, b) } : null);
const app = (s) => once(APP, "</script>", s + "\n</script>");
const X = [
  // N1 content-keyed roster: a byte-identical COPY of an admitted declaration, appended after its desk override
  ["N1 (paint) scene.css appends a copy of the admitted base `.card-foot { padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)) }` after the desk rule (cascade order not in the key)",
    { [SCENE]: live[SCENE] + "\n.card-foot {\n  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));\n}\n" }],
  ["N1b (paint) scene.css swaps nothing, re-declares the admitted mobile cap at desk order: `.drawer-case { max-height: calc(100dvh - 4rem - 1.5rem) }` inside the admitted @media (max-width: 1023.98px) appended last (control-ish: no desk paint)",
    { [SCENE]: live[SCENE] + "\n@media (max-width: 1023.98px) {\n  .drawer-case {\n    max-height: calc(100dvh - 4rem - 1.5rem);\n  }\n}\n" }],
  // N2 the union roster: a WAVE-only declaration re-planted on the tree
  ["N2 (paint) panel `.action-bar { grid-template-columns: 1fr }` (the WAVE's value, admitted from the WAVE)",
    once(PANEL, "  display: grid;\n  grid-template-columns: 1fr auto;\n  align-items: center;", "  display: grid;\n  grid-template-columns: 1fr;\n  align-items: center;")],
  // N3 11b reads only the template: the constant moved into the script
  ["N3 (paint) footBerth pinned false in the script (`… && false`): the Teleport never moves",
    once(PANEL, 'footBerth.value = !!document.getElementById("card-foot");', 'footBerth.value = !!document.getElementById("card-foot") && false;')],
  ["N3b (paint) footBerth reads a wrong id (`card-foot-x`): constant false at runtime",
    once(PANEL, 'footBerth.value = !!document.getElementById("card-foot");', 'footBerth.value = !!document.getElementById("card-foot-x");')],
  ["N4 :disabled=\"footBerth !== footBerth\" (true only for NaN; constant false on a boolean ref: the bar always teleports, the guest case breaks)",
    once(PANEL, ':disabled="!footBerth"', ':disabled="footBerth !== footBerth"')],
  ["N4b :disabled=\"!footBerth && footBerth === footBerth\" (equivalent to !footBerth on booleans; control: must stay GREEN)",
    once(PANEL, ':disabled="!footBerth"', ':disabled="!footBerth && footBerth === footBerth"')],
  // N5 script writes outside WATCHED
  ["N5 (paint) App.vue writes the verbs' transform: translateY(100vh)", app('document.querySelector<HTMLElement>(".action-verbs")!.style.transform = "translateY(100vh)";')],
  ["N5b (paint) App.vue writes the bar's zoom", app('document.querySelector<HTMLElement>(".action-bar")!.style.setProperty("zoom", "4");')],
  ["N5c (paint) App.vue writes the words' visibility", app('document.querySelectorAll<HTMLElement>(".icon-sublabel").forEach((e) => (e.style.visibility = "hidden"));')],
  ["N5d (paint) App.vue sets a style attribute string on the bar", app('document.querySelector(".action-bar")!.setAttribute("style", "padding-top: 100vh");')],
  ["N5e (paint) App.vue cssText on the foot", app('document.getElementById("card-foot")!.style.cssText = "padding-top: 100vh";')],
  // N6 selectors the matcher may not read
  ["N6 (paint) index.css `[class*=\"sublabel\"] { font-size: 0 }`", { [IDX]: live[IDX] + '\n[class*="sublabel"] { font-size: 0; }\n' }],
  ["N6b (paint) index.css `#card-foot > * > * { min-height: 100vh }`", { [IDX]: live[IDX] + "\n#card-foot > * > * { min-height: 100vh; }\n" }],
  ["N6c (paint) index.css `:is(div, section):has(> .icon-sublabel) { padding-top: 100vh }`", { [IDX]: live[IDX] + "\n:is(div, section, button):has(> .icon-sublabel) { padding-top: 100vh; }\n" }],
  ["N6d (paint) index.html <style> `.action-bar .icon-sublabel { font-size: 0 }`", once(HTML, "</head>", "<style>.action-bar .icon-sublabel { font-size: 0 }</style>\n</head>")],
  // N7 inheritance from an ancestor outside the subjects
  ["N7 (paint) index.css `body { writing-mode: vertical-rl }` (inherited by every subject)", { [IDX]: live[IDX] + "\nbody { writing-mode: vertical-rl; }\n" }],
  ["N7b (paint) index.css `#app { line-height: 6 }` (inherited by the words)", { [IDX]: live[IDX] + "\n#app { line-height: 6; }\n" }],
  // N8 cascade-layer order (an @-prelude the gate skips)
  ["N8 (paint) index.css prepends `@layer utilities, components, base, theme;` (base beats every utility)", { [IDX]: "@layer utilities, components, base, theme;\n" + live[IDX] }],
  // N9 the seed: the tilt drawn by a second statement the regex does not read
  ["N9 (paint) SheetWashiLabel: `const tilt = (rng() - 0.5) * 3;` kept, a later `* 2` scale on the returned tilt",
    once(WASHI, "tilt: `${tilt.toFixed(2)}deg`", "tilt: `${(tilt * 2).toFixed(2)}deg`")],
];
let g = 0, gp = 0, np = 0;
const base = check();
console.log(`live: ${base.length} fails`);
const k0 = new Set(base);
for (const [name, patch] of X) {
  if (!patch) { console.log(`X NOT-APPLIED (anchor absent on this tree)                 ${name}`); continue; }
  let f; try { f = check(patch).filter((x) => !k0.has(x)); } catch (e) { console.log(`X THREW ${String(e.message).slice(0, 100)}  ${name}`); continue; }
  const v = f.length ? "RED  " + [...new Set(f.map((x) => x.split(":")[0]))].join("|").slice(0, 40) : "GREEN";
  if (!f.length) { g++; if (/\(paint\)/.test(name)) gp++; }
  if (/\(paint\)/.test(name)) np++;
  console.log(`X ${v.padEnd(44)} ${name}`);
  if (f.length && process.env.V) console.log("   " + f.slice(0, 2).join("\n   ").slice(0, 400));
}
console.log(`pass-10 critic siblings: GREEN ${g}/${X.length}; paint-moving GREEN ${gp}/${np}`);
for (const e of ["!footBerth", "footBerth !== footBerth", "!footBerth && footBerth === footBerth", "!(footBerth ?? true)", "typeof footBerth === 'symbol'", "!footBerth.value", "[].includes(footBerth)", "footBerth > Infinity"])
  console.log(`constantOf(${JSON.stringify(e)}) = ${constantOf(e)}`);
