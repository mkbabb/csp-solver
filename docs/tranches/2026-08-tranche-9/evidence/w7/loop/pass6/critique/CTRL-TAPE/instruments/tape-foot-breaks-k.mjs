// CTRL-TAPE pass-6 critic: one-line real regressions fed in memory to the lane's check().
import fs from "node:fs";
const W = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27/web/frontend";
const { check } = await import(W + "/scripts/check-tape-foot.mjs");
const live = {
  scene: fs.readFileSync(W + "/src/games/shared/scene.css", "utf8"),
  panel: fs.readFileSync(W + "/src/games/shared/GameControlPanel.vue", "utf8"),
  ribbon: fs.readFileSync(W + "/src/games/shared/ConfirmRibbon.vue", "utf8"),
};
const addPanel = (rule) => ({ panel: live.panel.replace(".action-bar > .action-verbs,", rule + "\n\n.action-bar > .action-verbs,") });
const addScene = (rule) => ({ scene: live.scene + "\n" + rule + "\n" });
const bar = (d) => ({ panel: live.panel.replace(/(\.action-bar \{[^}]*?)padding-block/, `$1${d};\n  padding-block`) });
const breaks = [
  ["K1 overflow:hidden on .action-bar (clips the whole outset frame)", bar("overflow: hidden")],
  ["K2 contain: paint on .action-bar", bar("contain: paint")],
  ["K3 filter: opacity(0.15) on .action-bar", bar("filter: opacity(0.15)")],
  ["K4 descendant selector hides the frame svg", addPanel(".action-bar :deep(.outline-svg) { display: none; }")],
  ["K5 first-child hides the frame", addPanel(".action-bar > :first-child { visibility: hidden; }")],
  ["K6 #card-foot padding-bottom 0 (id selector)", addScene("#card-foot { padding-bottom: 0; }")],
  ["K7 .card-foot padding-block-end 0 (logical)", addScene(".card-foot { padding-block-end: 0; }")],
  ["K8 .card-foot padding shorthand 0", addScene(".card-foot { padding: 0; }")],
  ["K9 .card-foot overflow: clip (clips the top stroke)", addScene(".card-foot { overflow: clip; }")],
  ["K10 <template v-if=false> around the lip", { panel: live.panel.replace('<HandDrawnOutline\n          class="bar-frame"', '<template v-if="false"><HandDrawnOutline\n          class="bar-frame"').replace(/(class="bar-frame"[\s\S]*?aria-hidden="true"\n        \/>)/, "$1</template>") }],
  ["K11 clip-path on .action-bar", bar("clip-path: inset(0)")],
  ["K12 mask-image on .action-bar", bar("mask-image: linear-gradient(transparent, transparent)")],
  ["K13 #card-foot z-index 0 (id selector, clause 2)", addScene("#card-foot { z-index: 0; }")],
  ["K14 .drawer-case .card-foot { padding-bottom: 0 } (compound selector)", addScene(".drawer-case .card-foot { padding-bottom: 0; }")],
  ["K15 calc(0.75rem + env() - 0.75rem)", { scene: live.scene.replace("calc(0.75rem + env(safe-area-inset-bottom))", "calc(0.75rem + env(safe-area-inset-bottom) - 0.75rem)") }],
];
let green = 0;
for (const [name, patch] of breaks) {
  const src = { ...live, ...patch };
  const applied = Object.keys(patch).some((k) => patch[k] !== live[k]);
  const f = check(src);
  const verdict = !applied ? "NOT-APPLIED" : f.length ? "RED  " + f.map((x) => x.split(":")[0]).join("|") : "GREEN";
  if (applied && !f.length) green++;
  console.log(verdict.padEnd(20), name);
}
console.log(`live: ${check(live).length} fails; breaks GREEN ${green}/${breaks.length}`);
