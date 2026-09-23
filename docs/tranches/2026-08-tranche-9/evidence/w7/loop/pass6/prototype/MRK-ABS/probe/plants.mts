import { readFileSync } from "node:fs";
const { ledger } = await import(process.argv[3]);
const css = readFileSync(process.argv[2], "utf8");
const at = "Until the owner rules,";
let bad = 0;
for (const [plant, want] of [["The deck card reads 4.15.", ["4.15"]], ["The deck card reads 1.8 dark.", ["1.8"]], ["It is 2.4:1 there.", ["2.4", "1"]], ["About 35 % of it.", ["35"]], ["It sits 4 px out.", ["4"]], ["It reads 2,40 there.", ["2,40"]]] as [string, string[]][]) {
  const got = ledger(css.replace(at, `${plant} ${at}`)).unguarded; const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) bad++; console.log(ok ? "RED-as-wanted" : "MISMATCH", plant, JSON.stringify(got));
}
const one = ledger(css.replace(/(tier 2 at\s+stroke-opacity )\d+(?:\.\d+)?/, (_m: string, h: string) => `${h}1.0`).replace(at, `The guard's faces read 4.15. ${at}`));
console.log("oneDecimal", one.opacity, JSON.stringify(one.unguarded));
const rc = ledger(css.replace(/(under 3:1 of 240\s+light )\d+ \/ \d+/, "$10 / 0")); console.log("recount", JSON.stringify(rc.whole));
const fz = ledger(css.replace(/(\b(?:light|dark) )(\d+\.\d+) \/ (\d+\.\d+)/g, "$19.99 / 9.99")); console.log("falsified rows", fz.rows.length, JSON.stringify(fz.rows[0]), JSON.stringify(fz.unguarded));
process.exit(bad);
