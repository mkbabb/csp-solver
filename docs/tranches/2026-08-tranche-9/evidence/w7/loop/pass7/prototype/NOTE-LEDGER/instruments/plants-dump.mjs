// prints each RESERVE plant's first red line, reading the landed law on a given frontend
import { readFileSync } from "node:fs";
import { join } from "node:path";
const fe = process.argv[2];
const { reserveLaw } = await import(join(process.argv[3], "scripts/shape/reserve-law.mjs"));
const MN = join(fe, "src/pencil/chrome/MarginNote.vue");
const SEAT = /(@media \(max-width: 1023\.98px\) \{[\s\S]*?\.margin-note \{\s*)min-height: inherit;/;
const BLOCK = /(\.margin-note-block \{[^}]*?min-height: )[^;]+;/;
const LANDSCAPE = /(@media \(max-width: 1023\.98px\) and \(orientation: landscape\) \{\n)/;
const P = {
  "seat deleted": (s) => s.replace(SEAT, "$1"),
  E1: (s) => s.replace(SEAT, "$1min-height: inherit;\n    min-height: 0;"),
  E2: (s) => `${s}\n<style scoped>\n.margin-note-block > .margin-note { min-height: 0; }\n</style>\n`,
  E2b: (s) => s.replace("</style>", ".margin-note-block > .margin-note {\n  min-height: 0;\n}\n</style>"),
  E3: (s) => s.replace(BLOCK, "$11px;"),
  E4: (s) => s.replace(LANDSCAPE, "$1  .margin-note-block .margin-note {\n    min-height: 0 !important;\n  }\n"),
  half: (s) => s.replace(BLOCK, "$1calc(1lh / 2);"),
};
const base = readFileSync(MN, "utf8");
const clean = reserveLaw(fe).fails;
console.log(`clean ${clean.length ? "RED " + clean[0].split("\n")[0] : "GREEN"}`);
for (const [k, f] of Object.entries(P)) {
  const t = f(base);
  if (t === base) { console.log(`${k}: ANCHOR MISSING`); continue; }
  const r = reserveLaw(fe, { read: (x) => (x === MN ? t : readFileSync(x, "utf8")) }).fails;
  console.log(`${k}: ${r.length ? "RED  " + r[0].split("\n")[0].slice(0, 140) : "GREEN (HOLE)"}`);
}
