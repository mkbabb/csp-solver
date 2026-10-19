// nplant.mjs <orig> <out> <name> | --list : writes a planted MarginNote.vue (exit 3 if the anchor is absent)
import { readFileSync, writeFileSync } from "node:fs";
const [orig, out, name] = process.argv.slice(2);
const SEATDECL = /(\n  \.margin-note \{\n    min-height: inherit;\n  \}\n)/;
const END = /<\/style>\s*$/;
const VOICE_LH = /(\n\.margin-note \{\n(?:[^}]*?\n)??  font-size: var\(--type-body\);\n)  line-height: var\(--type-leading-caption\);\n/;
const VOICE_FS = /(\n\.margin-note \{\n(?:[^}]*?\n)??)  font-size: var\(--type-body\);\n/;
const AT = "@";
const P = {
  N3: (x) => x.replace(SEATDECL, "\n  .margin-note {\n    --seat: inherit;\n    min-height: var(--seat);\n  }\n"),
  N4: (x) => x.replace(END, ".margin-note-block > p:first-child {\n  font-size: 40px;\n}\n</style>\n"),
  N5: (x) => x.replace(SEATDECL, `\n  ${AT}supports (display: nonsense) {\n    .margin-note {\n      min-height: inherit;\n    }\n  }\n`),
  N6: (x) => x.replace(SEATDECL, `\n  ${AT}container (min-width: 5000px) {\n    .margin-note {\n      min-height: inherit;\n    }\n  }\n`),
  N7: (x) => x.replace(SEATDECL, "\n  .margin-note:not([role]) {\n    min-height: inherit;\n  }\n"),
  N19: (x) => x.replace(END, ".margin-note-block > p:first-child:has(.margin-note-ink) {\n  line-height: 2.2;\n}\n</style>\n"),
  N19b: (x) => x.replace(END, ".margin-note-block > p:first-child:not(:empty) {\n  line-height: 2.2;\n}\n</style>\n"),
  M10: (x) => x.replace(END, `${AT}supports (display: nonsense) {\n  .margin-note-block {\n    min-height: 0;\n  }\n}\n</style>\n`),
  F1: (x) => x.replace(VOICE_LH, "$1"),
  F2: (x) => x.replace(VOICE_FS, "$1"),
  NN5: (x) => x.replace(SEATDECL, `\n  ${AT}supports (display: grid) {\n    .margin-note {\n      min-height: inherit;\n    }\n  }\n`),
};
if (orig === "--list") { console.log(Object.keys(P).join(" ")); process.exit(0); }
const s = readFileSync(orig, "utf8");
const t = P[name](s);
if (t === s) { console.error(`anchor absent: ${name}`); process.exit(3); }
writeFileSync(out, t);
