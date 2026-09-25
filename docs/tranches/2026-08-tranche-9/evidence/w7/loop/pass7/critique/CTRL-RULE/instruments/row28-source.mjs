import { readFileSync } from "node:fs";
const css0 = readFileSync("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/src/games/shared/scene.css", "utf8");
// the spec's source arm, verbatim (zone-grammar.spec.ts row 28)
const arm = (css) => { css = css.replace(/\/\*[\s\S]*?\*\//g, ""); const foot = css.match(/\.card-foot\s*\{[^}]*\}/g) ?? []; return foot.some((b) => /padding-bottom:\s*calc\([^;]*\+\s*env\(safe-area-inset-bottom\)\s*\)/.test(b)); };
const plants = {
  shipped: css0,
  "E4 !important max() in a coarse media block (last wins)": css0 + "\n@media (pointer: coarse) { .card-foot { padding-bottom: max(0.15rem, env(safe-area-inset-bottom)) !important; } }\n",
  "E3 compound override #card-foot.card-foot": css0 + "\n#card-foot.card-foot { padding-bottom: 0.15rem; }\n",
  "shadowing decl after, same block": css0.replace("padding-bottom: calc(0.15rem + env(safe-area-inset-bottom));", "padding-bottom: calc(0.15rem + env(safe-area-inset-bottom));\n  padding-bottom: 0.15rem;"),
};
for (const [k, v] of Object.entries(plants)) console.log(k.padEnd(60), "source arm GREEN =", arm(v));
