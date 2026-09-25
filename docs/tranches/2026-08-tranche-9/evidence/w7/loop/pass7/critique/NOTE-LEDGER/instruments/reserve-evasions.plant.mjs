// usage: node plant.mjs <orig> <out> <name>  — writes a planted SFC; exits 3 if the anchor is missing
import { readFileSync, writeFileSync } from "node:fs";
const [orig, out, name] = process.argv.slice(2);
const s = readFileSync(orig, "utf8");
const SEAT = /(@media \(max-width: 1023\.98px\) \{\n  \.margin-note-block \{\n    position: relative;)/;
const SEATDECL = /(\n  \.margin-note \{\n    min-height: inherit;\n  \}\n)/;
const LAND = /(@media \(max-width: 1023\.98px\) and \(orientation: landscape\) \{\n)/;
const END = /<\/style>\s*$/;
const P = {
  clean: (x) => x,
  "M1 E3 inside the <1024 block (block min-height 1px there)": (x) => x.replace(SEAT, "$1\n    min-height: 1px;"),
  "M2 seat moved to @media not all and (max-width: 1023.98px)": (x) => x.replace(SEATDECL, "\n").replace(END, "@media not all and (max-width: 1023.98px) {\n  .margin-note {\n    min-height: inherit;\n  }\n}\n</style>\n"),
  "M3 seat moved to the landscape block only": (x) => x.replace(SEATDECL, "\n").replace(LAND, "$1  .margin-note {\n    min-height: inherit;\n  }\n"),
  "M4 block font-size 1px under <1024 (1.3em -> 1.3px)": (x) => x.replace(SEAT, "$1\n    font-size: 1px;"),
  "M5 display: contents on the voice under <1024": (x) => x.replace(SEATDECL, "\n  .margin-note {\n    min-height: inherit;\n    display: contents;\n  }\n"),
  "M6 the voice by another name: .margin-note-block > p:first-child { min-height: 0 }": (x) => x.replace(END, ".margin-note-block > p:first-child {\n  min-height: 0;\n}\n</style>\n"),
  "M7 the voice by role: [role=\"status\"] { min-height: 0 } last": (x) => x.replace(END, "[role=\"status\"] {\n  min-height: 0;\n}\n</style>\n"),
  "M8 seat under an unsatisfiable (min-width: 2000px) and (max-width: 1023.98px)": (x) => x.replace(SEATDECL, "\n").replace(END, "@media (min-width: 2000px) and (max-width: 1023.98px) {\n  .margin-note {\n    min-height: inherit;\n  }\n}\n</style>\n"),
  "M9 max-height: 0 + overflow hidden on the block under <1024 (min wins; expect harmless)": (x) => x.replace(SEAT, "$1\n    max-height: 0;"),
  "M10 the block's reserve as 1.3em but block line reserve killed by height:0 !important? (block height: 0 no effect) -> block min-height: 1.3em in a @supports-never at top": (x) => x.replace(END, "@supports (display: nonsense) {\n  .margin-note-block {\n    min-height: 0;\n  }\n}\n</style>\n"),
  "OLD number (1.3em for inherit)": (x) => x.replace(SEATDECL, "\n  .margin-note {\n    min-height: 1.3em;\n  }\n"),
  "OLD wide (seat at top level)": (x) => x.replace(SEATDECL, "\n").replace(/\n\.margin-note \{\n/, "\n.margin-note {\n  min-height: inherit;\n"),
  "OLD desk (seat under min-width 1024)": (x) => x.replace(SEATDECL, "\n").replace(/@media \(min-width: 1024px\) \{\n/, "@media (min-width: 1024px) {\n  .margin-note {\n    min-height: inherit;\n  }\n"),
};
if (name === "--list") { console.log(Object.keys(P).join("\n")); process.exit(0); }
const t = P[name](s);
if (name !== "clean" && t === s) { console.error("ANCHOR MISSING"); process.exit(3); }
writeFileSync(out, t);
