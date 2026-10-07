// critic-8 plant: NARROW a margin extractor so the setMargin verdicts are no longer "margin strings",
// read them through a new extractor NOT named /^margin/, move them to an OPEN group, delete a call site.
const fs = require("fs");
const p = "scripts/check-font-coverage.mjs";
let s = fs.readFileSync(p, "utf8");
const n0 = s.length;
// (a) marginVerdictCopy stops reading setMargin literals
const grabLine = '      ...grab(pick(/^src\\/games\\/shared\\/GameBoard\\.vue$/), /setMargin\\(\\s*"([^"]+)"/g),\n';
if (!s.includes(grabLine)) { console.error("ANCHOR grab"); process.exit(3); }
s = s.replace(grabLine, "");
// (b) a new extractor, boardVerdicts, reads them
s = s.replace("  zoneRowLabels: {", '  boardVerdicts: {\n    what: "setMargin literals",\n    run: () => grab(pick(/^src\\/games\\/shared\\/GameBoard\\.vue$/), /setMargin\\(\\s*"([^"]+)"/g),\n  },\n  zoneRowLabels: {');
// (c) the setMargin strings leave the closed group
const moved = ['"that\'s a given clue",', '"the board is clear",', '"still solving…",', '"solved it!",'];
for (const m of moved) { const line = `          ${m}\n`; if (!s.includes(line)) { console.error("ANCHOR " + m); process.exit(3); } s = s.replace(line, ""); }
// (d) an OPEN group derives them
s = s.replace('      {\n        where: ".zone-row-label (row captions)",', '      {\n        where: "the board verdicts",\n        transform: "none",\n        derive: ["boardVerdicts"],\n        strings: ["that\'s a given clue", "the board is clear", "still solving…", "solved it!"],\n      },\n      {\n        where: ".zone-row-label (row captions)",');
if (s.length === n0) { console.error("NO CHANGE"); process.exit(3); }
fs.writeFileSync(p, s);
// (e) the call site deleted
const g = "src/games/shared/GameBoard.vue";
let v = fs.readFileSync(g, "utf8");
const call = '      setMargin("solved it!", "gold-star", "empty");';
if (!v.includes(call)) { console.error("ANCHOR call"); process.exit(3); }
fs.writeFileSync(g, v.replace(call, "      // (planted: call deleted)"));
console.log("planted");
