import { readFileSync } from "node:fs";
const css = readFileSync(process.argv[2], "utf8");
const FIGURE = /(?<!\d\.)(?<!\d)\d+\.\d{2,}(?!\d|\.\d)/g;
function ledger(css) {
  const at = css.indexOf("--color-focus-sketch:");
  const comment = css.slice(at, css.indexOf("*/", at));
  const op = comment.match(/WORST of (\d+) samples, tier 2 at stroke-opacity (\d+(?:\.\d+)?)/);
  const rows = []; const guarded = op ? [op[2]] : [];
  for (const m of comment.matchAll(/(16×16|9×9) (paper|frame)\s+light (\d+\.\d+) \/ (\d+\.\d+)\s+dark (\d+\.\d+) \/ (\d+\.\d+)/g)) { rows.push(m.slice(1)); guarded.push(m[3], m[4], m[5], m[6]); }
  const unguarded = [...comment.matchAll(FIGURE)].map((m) => m[0]);
  for (const g of guarded) unguarded.splice(unguarded.indexOf(g), 1);
  return { opacity: op ? +op[2] : null, rows: rows.length, unguarded };
}
const base = ledger(css);
console.log("tree:", JSON.stringify(base));
const plant = (label, from, to) => { const c = css.replace(from, to); if (c === css) { console.log(label, "PLANT MISSED"); return; } const L = ledger(c); console.log(label.padEnd(44), "unguarded", JSON.stringify(L.unguarded), L.unguarded.length === 0 ? "=> FIGURE CLAUSE GREEN (hole)" : "=> red"); };
plant("two-decimal stray 4.15", "Until the owner rules,", "The guard's faces read 4.15. Until the owner rules,");
plant("one-decimal stray 3.9", "Until the owner rules,", "The guard's faces read 3.9 dark. Until the owner rules,");
plant("ratio form 2.4:1", "Until the owner rules,", "The frame reads 2.4:1 dark. Until the owner rules,");
plant("percent 35%", "Until the owner rules,", "35% of the ring reads under the floor. Until the owner rules,");
plant("integer px 4", "Until the owner rules,", "The deck card clears by 4 px. Until the owner rules,");
plant("comma decimal 2,40", "Until the owner rules,", "Worst 2,40. Until the owner rules,");
// splice-with-indexOf(-1) hazard: guarded figure missing from the FIGURE list removes the LAST element
plant("opacity written 0.9 + stray 4.15", /stroke-opacity 0\.95/, "stroke-opacity 0.9 (read 4.15)");
