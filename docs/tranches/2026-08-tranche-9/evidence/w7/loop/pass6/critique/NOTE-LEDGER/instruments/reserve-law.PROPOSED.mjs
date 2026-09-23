// PROPOSED re-cut of MarginNote.test.ts's reserve law (critic, pass 6). Keys on the CASCADE'S SHAPE, not a
// spelling: every <style> block of the SFC (comments stripped), every rule at any depth whose selector's
// SUBJECT compound carries `.margin-note` (not -block/-previous/-ink/-meta), every min-height declaration in
// source order. Law: exactly ONE voice min-height in the SFC, value `inherit`, inside `@media (max-width:
// 1023.98px)`, no `!important` voice min-height anywhere, and the block's own reserve is a line (>= 1em).
// Usage: node reserve-law.PROPOSED.mjs <MarginNote.vue> [--plants]. Exit 1 on a breach / a green plant.
import { readFileSync } from "node:fs";
function rules(css, ctx = [], out = []) {
  let depth = 0, start = 0, open = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === "{" && depth++ === 0) open = i;
    else if (css[i] === "}" && --depth === 0) {
      const prelude = css.slice(start, open).trim(), body = css.slice(open + 1, i);
      if (prelude.startsWith("@")) rules(body, [...ctx, prelude], out);
      else out.push({ ctx, prelude, body });
      start = i + 1;
    }
  }
  return out;
}
const voiceSubject = (sel) => sel.split(",").some((s) => { const last = s.trim().split(/[\s>+~]+/).pop() ?? ""; return /\.margin-note(?![-\w])/.test(last); });
const decls = (body, prop) => [...body.matchAll(new RegExp(`(?:^|[;{\\s])${prop}\\s*:\\s*([^;}]+)`, "g"))].map((m) => m[1].trim());
export function law(sfc) {
  const css = [...sfc.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n").replace(/\/\*[\s\S]*?\*\//g, "");
  const all = rules(css), fails = [];
  const voice = all.filter((r) => voiceSubject(r.prelude)).flatMap((r) => decls(r.body, "min-height").map((v) => ({ ...r, v })));
  if (voice.length !== 1) fails.push(`voice min-height declared ${voice.length}× (want exactly 1): ${voice.map((d) => `${d.ctx.join(" ")} ${d.prelude}: ${d.v}`).join(" | ")}`);
  for (const d of voice) {
    if (d.v !== "inherit") fails.push(`voice min-height is '${d.v}', not inherit`);
    if (d.ctx.join(" ") !== "@media (max-width: 1023.98px)" || d.prelude !== ".margin-note") fails.push(`voice reserve seated at '${d.ctx.join(" ")} ${d.prelude}'`);
  }
  const block = all.filter((r) => r.prelude === ".margin-note-block" && r.ctx.length === 0).flatMap((r) => decls(r.body, "min-height"));
  const em = (v) => { const m = /^([\d.]+)(em|lh|rem)$/.exec(v ?? ""); return m ? +m[1] : 0; };
  if (block.length !== 1 || em(block[0]) < 1) fails.push(`the block's reserve is not a line: ${block.join(",") || "none"}`);
  return fails;
}
const f = process.argv[2]; const src = readFileSync(f, "utf8");
const clean = law(src); console.log(`clean: ${clean.length ? "RED " + clean.join(" / ") : "GREEN"}`);
let bad = clean.length ? 1 : 0;
if (process.argv.includes("--plants")) {
  const seat = /(@media \(max-width: 1023\.98px\) \{[\s\S]*?\.margin-note \{\s*)min-height: inherit;/;
  const P = {
    deleted: src.replace(seat, "$1"),
    zeroed: src.replace(seat, "$1min-height: 0;"),
    E1_shadowed: src.replace(seat, "$1min-height: inherit;\n    min-height: 0;"),
    E2_second_style_block: src + "\n<style scoped>\n.margin-note-block > .margin-note { min-height: 0; }\n</style>\n",
    E2b_compound_override: src.replace(/(  min-height: 1\.3em;\n\}\n)/, "$1\n.margin-note-block > .margin-note {\n  min-height: 0;\n}\n"),
    E3_block_1px: src.replace(/(\.margin-note-block \{[^}]*?min-height: )[^;]+;/, "$11px;"),
    E4_landscape_important: src.replace(/(@media \(max-width: 1023\.98px\) and \(orientation: landscape\) \{\n)/, "$1  .margin-note-block .margin-note {\n    min-height: 0 !important;\n  }\n"),
  };
  for (const [k, s] of Object.entries(P)) { const r = s === src ? ["PLANT DID NOT MOVE THE SOURCE"] : law(s); const red = r.length > 0 && s !== src; console.log(`${k}: ${red ? "RED" : "GREEN (hole)"}${red ? "" : " " + r.join(" / ")}`); if (!red) bad = 1; }
}
process.exit(bad);
