// CTRL-TAPE pass-7 critic: pass-6's K1–K15 re-pointed (plant first), then new one-line breaks fed in memory to check().
import fs from "node:fs";
const W = process.env.FE ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27/web/frontend";
const { check } = await import(W + "/scripts/check-tape-foot.mjs");
const PANEL = "src/games/shared/GameControlPanel.vue", SCENE = "src/games/shared/scene.css", GS = "src/games/shared/GameScene.vue", APP = "src/App.vue";
const rd = (r) => fs.readFileSync(W + "/" + r, "utf8");
const live = { [PANEL]: rd(PANEL), [SCENE]: rd(SCENE), [GS]: rd(GS), [APP]: rd(APP) };
const need = (s, a) => { if (!(typeof a === "string" ? s.includes(a) : a.test(s))) throw new Error("anchor missing: " + a); return s; };
const addPanel = (rule) => ({ [PANEL]: need(live[PANEL], ".action-bar > .action-verbs,").replace(".action-bar > .action-verbs,", rule + "\n\n.action-bar > .action-verbs,") });
const addScene = (rule) => ({ [SCENE]: live[SCENE] + "\n" + rule + "\n" });
const bar = (d) => ({ [PANEL]: need(live[PANEL], /(\n\.action-bar \{[^}]*?)padding-block/).replace(/(\n\.action-bar \{[^}]*?)padding-block/, `$1${d};\n  padding-block`) });
const frame = (d) => ({ [PANEL]: need(live[PANEL], /(\.bar-frame \{[^}]*?)z-index: 0;/).replace(/(\.bar-frame \{[^}]*?)z-index: 0;/, `$1z-index: 0;\n  ${d};`) });
const barCls = (c) => ({ [PANEL]: need(live[PANEL], 'class="action-bar"').replace('class="action-bar"', `class="action-bar ${c}"`) });
const footCls = (c, rule) => ({ [GS]: need(live[GS], 'class="card-foot"').replace('class="card-foot"', `class="card-foot ${c}"`), ...(rule ? addScene(rule) : {}) });
const script = (line) => ({ [PANEL]: need(live[PANEL], "cardEl.value = card;").replace("cardEl.value = card;", "cardEl.value = card;\n    " + line) });
const DOCK = "calc(0.75rem + env(safe-area-inset-bottom))";
const dock = (v) => ({ [SCENE]: need(live[SCENE], DOCK).replace(DOCK, v) });
const K = [
  ["K1 overflow:hidden on .action-bar", bar("overflow: hidden")],
  ["K2 contain: paint on .action-bar", bar("contain: paint")],
  ["K3 filter: opacity(0.15) on .action-bar", bar("filter: opacity(0.15)")],
  ["K4 :deep(.outline-svg) display none", addPanel(".action-bar :deep(.outline-svg) { display: none; }")],
  ["K5 :first-child hidden", addPanel(".action-bar > :first-child { visibility: hidden; }")],
  ["K6 #card-foot pad 0", addScene("#card-foot { padding-bottom: 0; }")],
  ["K7 padding-block-end 0", addScene(".card-foot { padding-block-end: 0; }")],
  ["K8 padding 0", addScene(".card-foot { padding: 0; }")],
  ["K9 .card-foot overflow clip", addScene(".card-foot { overflow: clip; }")],
  ["K11 clip-path bar", bar("clip-path: inset(0)")],
  ["K12 mask-image bar", bar("mask-image: linear-gradient(transparent, transparent)")],
  ["K13 #card-foot z 0", addScene("#card-foot { z-index: 0; }")],
  ["K14 .drawer-case .card-foot pad 0", addScene(".drawer-case .card-foot { padding-bottom: 0; }")],
  ["K15 calc(pad+env-pad)", dock("calc(0.75rem + env(safe-area-inset-bottom) - 0.75rem)")],
];
const N = [
  // the pass-7 product seam (the flex column) — does anything witness it?
  ["F1 revert the column: .drawer-case { display: block }", addScene(".drawer-case { display: block; }")],
  ["F2 .controls-card { flex-shrink: 0 } (card never yields to the cap)", addScene(".controls-card { flex-shrink: 0; }")],
  ["F3 .card-foot { flex: 1 1 0; min-height: 0 } (foot yields)", addScene(".card-foot { flex: 1 1 0; min-height: 0; }")],
  ["F4 .drawer-case { flex-direction: row }", addScene(".drawer-case { flex-direction: row; }")],
  // the SHAPE law's siblings
  ["S1 alias class on the foot element + .foot-x { overflow: clip }", footCls("foot-x", ".foot-x { overflow: clip; }")],
  ["S2 .drawer-case > div:last-of-type { overflow: clip }", addScene(".drawer-case > div:last-of-type { overflow: clip; }")],
  ["S3 .drawer-case > div:last-of-type { padding-bottom: 0 }", addScene(".drawer-case > div:last-of-type { padding-bottom: 0; }")],
  ["S4 [id=\"card-foot\"] { padding-bottom: 0 }", addScene('[id="card-foot"] { padding-bottom: 0; }')],
  ["S5 [class~=\"action-bar\"] { overflow: hidden }", addPanel('[class~="action-bar"] { overflow: hidden; }')],
  ["S6 :where(.action-bar) { overflow: hidden }", addPanel(":where(.action-bar) { overflow: hidden; }")],
  ["S7 nested .drawer-case { & > .card-foot { overflow: clip } }", addScene(".drawer-case { & > .card-foot { overflow: clip; } }")],
  ["S8a utility opacity-[0.15] on bar el", barCls("opacity-[0.15]")],
  ["S8b utility sr-only on bar el", barCls("sr-only")],
  ["S8c utility blur-sm on bar el", barCls("blur-sm")],
  ["S8d utility contain-[paint] on bar el", barCls("contain-[paint]")],
  ["S8e utility translate-y-12 on bar el", barCls("translate-y-12")],
  ["S9a script bar.style.filter = opacity(0.1)", script('bar.style.filter = "opacity(0.1)";')],
  ["S9b script bar.style.cssText overflow hidden", script('bar.style.cssText = "overflow: hidden";')],
  ["S9c script setAttribute style", script('bar.setAttribute("style", "overflow: hidden");')],
  ["S9d script classList.add overflow-hidden", script('bar.classList.add("overflow-hidden");')],
  ["S9e App.vue writes #card-foot overflow", { [APP]: need(live[APP], "</script>").replace("</script>", 'document.getElementById("card-foot")!.style.overflow = "hidden";\n</script>') }],
  ["S10 .bar-frame { inset: 0 0 100% 0 } (whitelisted layout collapses the frame)", frame("inset: 0 0 100% 0")],
  ["S10b .bar-frame { position: static }", frame("position: static")],
  ["S11 overflow: var(--nope, hidden) on bar", bar("overflow: var(--nope, hidden)")],
  ["S12 calc(pad + env() * 0)", dock("calc(0.75rem + env(safe-area-inset-bottom) * 0)")],
  ["S13 .card-foot { translate: 0 2.875rem } (bar pushed into the inset band)", addScene(".card-foot { translate: 0 2.875rem; }")],
  ["S14 .action-bar { top: 2.875rem } (the bar is position:relative)", bar("top: 2.875rem")],
  ["S15 .card-foot { margin-bottom: -2.875rem }", addScene(".card-foot { margin-bottom: -2.875rem; }")],
  ["S16 .action-bar { transform: scaleY(0) }", bar("transform: scaleY(0)")],
];
let greenK = 0, greenN = 0;
const run = (list, tag) => { let g = 0; for (const [name, patch] of list) { const applied = Object.keys(patch).some((k) => patch[k] !== live[k]); const f = check(patch); const v = !applied ? "NOT-APPLIED" : f.length ? "RED  " + [...new Set(f.map((x) => x.split(":")[0]))].join("|") : "GREEN"; if (applied && !f.length) g++; console.log(`${tag} ${v.padEnd(28)} ${name}`); } return g; };
console.log(`live: ${check().length} fails`);
greenK = run(K, "K"); greenN = run(N, "N");
console.log(`pass-6 plants GREEN ${greenK}/${K.length}; new breaks GREEN ${greenN}/${N.length}`);
