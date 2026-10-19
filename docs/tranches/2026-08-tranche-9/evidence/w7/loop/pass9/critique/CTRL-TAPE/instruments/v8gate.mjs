// V8/V9: the verbs' own labels (`.icon-sublabel`) and glyphs, sized to nothing, through the gate's check().
import fs from "node:fs";
const W = process.env.FE; const { check } = await import(W + "/scripts/check-tape-foot.mjs");
const PANEL = "src/games/shared/GameControlPanel.vue"; const live = fs.readFileSync(W + "/" + PANEL, "utf8");
const add = (rule) => ({ [PANEL]: live.replace(".action-bar > .action-verbs,", rule + "\n\n.action-bar > .action-verbs,") });
for (const [n, r] of [["V8 .action-bar .icon-sublabel { font-size: 0 }", ".action-bar .icon-sublabel { font-size: 0; }"], ["V9 .action-bar .icon-sublabel { opacity: 0 }", ".action-bar .icon-sublabel { opacity: 0; }"], ["V10 .action-bar svg { display: none }", ".action-bar svg { display: none; }"]]) {
  const f = check(add(r)); console.log((f.length ? "RED   " + f.map((x) => x.split(":")[0]).join("|").slice(0, 40) : "GREEN").padEnd(48), n);
}
