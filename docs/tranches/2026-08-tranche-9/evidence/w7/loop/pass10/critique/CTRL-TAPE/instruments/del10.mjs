// CTRL-TAPE pass-10 critic: DELETION siblings. The admitted list reds a declaration that is NOT on the roster; it never
// reds a roster entry that is no longer in the tree (no stale arm; the union roster cannot carry one). In memory.
import fs from "node:fs";
const W = process.env.FE; const { check } = await import(W + "/scripts/check-tape-foot.mjs");
const PANEL = "src/games/shared/GameControlPanel.vue", SCENE = "src/games/shared/scene.css";
const rd = (r) => fs.readFileSync(W + "/" + r, "utf8"); const live = { [PANEL]: rd(PANEL), [SCENE]: rd(SCENE) };
// delete ONE declaration inside the rule whose selector line is `sel {`
const del = (f, sel, decl) => {
  const s = live[f], i = s.indexOf("\n" + sel + " {\n"); if (i < 0) return null;
  const j = s.indexOf("}", i), body = s.slice(i, j), k = body.indexOf("  " + decl + "\n"); if (k < 0) return null;
  return { [f]: s.slice(0, i) + body.slice(0, k) + body.slice(k + decl.length + 3) + s.slice(j) };
};
const X = [
  ["D1 .card-foot { flex: none } deleted (the foot may shrink)", del(SCENE, ".card-foot", "flex: none;")],
  ["D2 .card-foot { padding-bottom } deleted", del(SCENE, ".card-foot", "padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));")],
  ["D3 .card-foot { z-index: 45 } deleted (the foot under the card's fade)", del(SCENE, ".card-foot", "z-index: 45;")],
  ["D4 .action-bar { display: grid } deleted", del(PANEL, ".action-bar", "display: grid;")],
  ["D5 .action-bar { padding-block } deleted", del(PANEL, ".action-bar", "padding-block: 0.4rem 0.15rem;")],
  ["D6 .action-bar { align-items: center } deleted", del(PANEL, ".action-bar", "align-items: center;")],
  ["D7 .action-verbs { display: flex } deleted (the verbs stack)", del(PANEL, ".action-verbs", "display: flex;")],
  ["D8 .action-verbs { justify-content: space-evenly } deleted", del(PANEL, ".action-verbs", "justify-content: space-evenly;")],
  ["D9 .action-verbs { flex: 1 } deleted", del(PANEL, ".action-verbs", "flex: 1;")],
];
const k0 = new Set(check()); let g = 0, n = 0;
for (const [name, p] of X) {
  if (!p) { console.log(`X NOT-APPLIED  ${name}`); continue; }
  n++; const f = check(p).filter((x) => !k0.has(x)); if (!f.length) g++;
  console.log(`X ${(f.length ? "RED  " + [...new Set(f.map((x) => x.split(":")[0]))].join("|") : "GREEN").padEnd(44)} ${name}`);
}
console.log(`deletion siblings GREEN ${g}/${n}`);
