// cplant.mjs <orig> <out> <name> | --list : the critic's class plants (spoken-half growth by a property R4 does not read)
import { readFileSync, writeFileSync } from "node:fs";
const [orig, out, name] = process.argv.slice(2);
const END = /<\/style>\s*$/;
const add = (css) => (x) => x.replace(END, css + "\n</style>\n");
const P = {
  C1pad: add(".margin-note-ink {\n  padding-block: 6px;\n}"),
  C2inkfs: add(".margin-note-ink {\n  font-size: 30px;\n}"),
  C3voicepad: add(".margin-note:has(.margin-note-ink) {\n  padding-top: 8px;\n}"),
  C4spanmargin: add(".margin-note-block > p > span {\n  margin-top: 10px;\n}"),
  C5valign: add(".margin-note-ink {\n  vertical-align: 12px;\n}"),
  C6inklh: add(".margin-note-ink {\n  line-height: 2.2;\n}"),
};
if (orig === "--list") { console.log(Object.keys(P).join(" ")); process.exit(0); }
const s = readFileSync(orig, "utf8");
const t = P[name](s);
if (t === s) { console.error(`anchor absent: ${name}`); process.exit(3); }
writeFileSync(out, t);
