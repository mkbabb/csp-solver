// usage: node plant.mjs <orig> <out> <name> | --list — writes a planted SFC; exit 3 if the anchor is missing
import { readFileSync, writeFileSync } from "node:fs";
const [orig, out, name] = process.argv.slice(2);
const s = readFileSync(orig, "utf8");
const SEAT = /(@media \(max-width: 1023\.98px\) \{\n  \.margin-note-block \{\n    position: relative;)/;
const SEATDECL = /(\n  \.margin-note \{\n    min-height: inherit;\n  \}\n)/;
const LAND = /(@media \(max-width: 1023\.98px\) and \(orientation: landscape\) \{\n)/;
const END = /<\/style>\s*$/;
const seatIn = (pre) => (x) => x.replace(SEATDECL, "\n").replace(END, `${pre} {\n  .margin-note {\n    min-height: inherit;\n  }\n}\n</style>\n`);
const P = {
  // ---- pass-7 critic's plants, FIRST (M1-M10 + OLD three), adapted anchors
  "P7-M1 block min-height 1px inside <1024": (x) => x.replace(SEAT, "$1\n    min-height: 1px;"),
  "P7-M2 seat under not all and": seatIn("@media not all and (max-width: 1023.98px)"),
  "P7-M3 seat in landscape block only": (x) => x.replace(SEATDECL, "\n").replace(LAND, "$1  .margin-note {\n    min-height: inherit;\n  }\n"),
  "P7-M4 block font-size 1px <1024 (NN on the lh seat)": (x) => x.replace(SEAT, "$1\n    font-size: 1px;"),
  "P7-M5 display:contents on the voice <1024": (x) => x.replace(SEATDECL, "\n  .margin-note {\n    min-height: inherit;\n    display: contents;\n  }\n"),
  "P7-M6 > p:first-child min-height 0": (x) => x.replace(END, ".margin-note-block > p:first-child {\n  min-height: 0;\n}\n</style>\n"),
  "P7-M7 [role=status] min-height 0": (x) => x.replace(END, "[role=\"status\"] {\n  min-height: 0;\n}\n</style>\n"),
  "P7-M8 seat under unsatisfiable conjunction": seatIn("@media (min-width: 2000px) and (max-width: 1023.98px)"),
  "P7-M9 NN block max-height 0 <1024": (x) => x.replace(SEAT, "$1\n    max-height: 0;"),
  "P7-M10 NN dead @supports zero": (x) => x.replace(END, "@supports (display: nonsense) {\n  .margin-note-block {\n    min-height: 0;\n  }\n}\n</style>\n"),
  "P7-OLD number 1.3em": (x) => x.replace(SEATDECL, "\n  .margin-note {\n    min-height: 1.3em;\n  }\n"),
  "P7-OLD wide seat at top level": (x) => x.replace(SEATDECL, "\n").replace(/\n\.margin-note \{\n/, "\n.margin-note {\n  min-height: inherit;\n"),
  "P7-OLD desk seat under min-width 1024": (x) => x.replace(SEATDECL, "\n").replace(/@media \(min-width: 1024px\) \{\n/, "@media (min-width: 1024px) {\n  .margin-note {\n    min-height: inherit;\n  }\n"),
  // ---- critic-8's new evasions
  "C8-N1 voice min-block-size 0 <1024 (logical longhand)": (x) => x.replace(SEATDECL, "\n  .margin-note {\n    min-height: inherit;\n    min-block-size: 0;\n  }\n"),
  "C8-N2 block min-block-size 1px <1024": (x) => x.replace(SEAT, "$1\n    min-block-size: 1px;"),
  "C8-N3 seat through a guaranteed-invalid var (--seat: inherit)": (x) => x.replace(SEATDECL, "\n  .margin-note {\n    --seat: inherit;\n    min-height: var(--seat);\n  }\n"),
  "C8-N4 voice font by element: > p:first-child font-size 40px": (x) => x.replace(END, ".margin-note-block > p:first-child {\n  font-size: 40px;\n}\n</style>\n"),
  "C8-N5 seat inside a dead @supports": (x) => x.replace(SEATDECL, "\n  @supports (display: nonsense) {\n    .margin-note {\n      min-height: inherit;\n    }\n  }\n"),
  "C8-N6 seat inside @container (min-width: 5000px)": (x) => x.replace(SEATDECL, "\n  @container (min-width: 5000px) {\n    .margin-note {\n      min-height: inherit;\n    }\n  }\n"),
  "C8-N7 seat selector never matches: :not([role])": (x) => x.replace(SEATDECL, "\n  .margin-note:not([role]) {\n    min-height: inherit;\n  }\n"),
  "C8-N8 seat under (hover: hover) (dead on touch phones)": seatIn("@media (max-width: 1023.98px) and (hover: hover)"),
  "C8-N9 seat under (prefers-color-scheme: dark) (light voice 0)": seatIn("@media (max-width: 1023.98px) and (prefers-color-scheme: dark)"),
  "C8-N10 seat under (pointer: fine)": seatIn("@media (max-width: 1023.98px) and (pointer: fine)"),
  "C8-N11 voice line grows only when spoken (:not(:empty))": (x) => x.replace(END, ".margin-note:not(:empty) {\n  line-height: 2.2;\n}\n</style>\n"),
  "C8-N12 voice font-size 30px <1024 by class (control: law should RED)": (x) => x.replace(SEATDECL, "\n  .margin-note {\n    min-height: inherit;\n    font-size: 30px;\n  }\n"),
  "C8-N13 block reserve 1lh -> calc(1lh - 12px)": (x) => x.replace("  min-height: 1lh;\n}", "  min-height: calc(1lh - 12px);\n}"),
  "C8-N14 block line-height spelled 1px <1024 via longhand-free shorthand font": (x) => x.replace(SEAT, "$1\n    font: 16px/1px serif;"),
  "C8-N15 seat inside @layer (layered loses to nothing here; NN?)": (x) => x.replace(SEATDECL, "\n  @layer seat {\n    .margin-note {\n      min-height: inherit;\n    }\n  }\n"),
  "C8-N16 voice zeroed via :where(.margin-note-block) > * min-height 0 !important": (x) => x.replace(END, ":where(.margin-note-block) > * {\n  min-height: 0 !important;\n}\n</style>\n"),
  "C8-N17 seat under (orientation: portrait) only (landscape voice 0)": seatIn("@media (max-width: 1023.98px) and (orientation: portrait)"),
  "C8-N18 seat under (min-resolution: 3dppx)": seatIn("@media (max-width: 1023.98px) and (min-resolution: 3dppx)"),
};
if (name === "--list") { console.log(Object.keys(P).join("\n")); process.exit(0); }
const t = P[name](s);
if (t === s) { console.error("ANCHOR MISSING"); process.exit(3); }
writeFileSync(out, t);
