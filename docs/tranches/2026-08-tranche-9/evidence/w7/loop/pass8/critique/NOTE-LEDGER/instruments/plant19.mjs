// plant19.mjs <orig> <out> : N19 — element-keyed, spoken-only line growth (the double evasion)
import { readFileSync, writeFileSync } from "node:fs";
const [o, out] = process.argv.slice(2); const s = readFileSync(o, "utf8"); const END = /<\/style>\s*$/;
if (!END.test(s)) process.exit(3);
writeFileSync(out, s.replace(END, ".margin-note-block > p:first-child:has(.margin-note-ink) {\n  line-height: 2.2;\n}\n</style>\n"));
