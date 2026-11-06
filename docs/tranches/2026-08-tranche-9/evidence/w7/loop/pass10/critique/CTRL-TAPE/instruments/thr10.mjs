// CTRL-TAPE pass-10 critic: threshold/disjunct sabotage of 4a (the words' voice) and 12s (the seed), in memory.
import fs from "node:fs";
const W = process.env.FE; const { check } = await import(W + "/scripts/check-tape-foot.mjs");
const PANEL = "src/games/shared/GameControlPanel.vue", IDX = "src/assets/index.css", WASHI = "src/pencil/sheet/SheetWashiLabel.vue";
const rd = (r) => fs.readFileSync(W + "/" + r, "utf8"); const live = { [PANEL]: rd(PANEL), [IDX]: rd(IDX), [WASHI]: rd(WASHI) };
const once = (f, a, b) => { if (!live[f].includes(a)) throw new Error("anchor " + a); return { [f]: live[f].replace(a, b) }; };
const words = (d) => once(PANEL, ".action-bar > .action-verbs,", `.action-bar .icon-sublabel { ${d}; }\n\n.action-bar > .action-verbs,`);
const X = [
  ["4a font-size: 9.99px", words("font-size: 9.99px"), "RED4"], ["4a font-size: 10px", words("font-size: 10px"), "GREEN4"],
  ["4a font-size: 10.01px", words("font-size: 10.01px"), "GREEN4"], ["4a font-size: x-small (≈10px)", words("font-size: x-small"), "?"],
  ["4a font-size: xx-small (≈9px)", words("font-size: xx-small"), "RED4"], ["4a font-size: smaller", words("font-size: smaller"), "?"],
  ["4a font-size: 0.5em", words("font-size: 0.5em"), "RED4"], ["4a font-size: 1%", words("font-size: 1%"), "RED4"],
  ["4a font: 9px serif", words("font: 9px serif"), "RED4"], ["4a font: italic 9px/1 serif", words("font: italic 9px/1 serif"), "RED4"],
  ["4a font-size: calc(10px - 0.01px)", words("font-size: calc(10px - 0.01px)"), "RED4"],
  ["4a font-size: max(1px, 0.1rem)", words("font-size: max(1px, 0.1rem)"), "RED4"],
  ["4a font-size: clamp(1px, 1vw, 2px)", words("font-size: clamp(1px, 1vw, 2px)"), "RED4"],
  ["4a scale: 0.1 (collapses the words, not a font)", words("scale: 0.1"), "RED-any"],
  ["12s band 1.5deg -> 1.49deg", once(IDX, "--washi-tilt-band: 1.5deg;", "--washi-tilt-band: 1.49deg;"), "RED"],
  ["12s literal * 3 -> * 3.0000001", once(WASHI, "const tilt = (rng() - 0.5) * 3;", "const tilt = (rng() - 0.5) * 3.0000001;"), "RED"],
  ["12s literal * 3 -> * (3)", once(WASHI, "const tilt = (rng() - 0.5) * 3;", "const tilt = (rng() - 0.5) * (3);"), "RED"],
  ["12s cap 15rem -> 16rem", once(IDX, "--washi-wide-cap: 15rem;", "--washi-wide-cap: 16rem;"), "RED"],
  ["12s cap 15rem -> 240px (same length, other unit)", once(IDX, "--washi-wide-cap: 15rem;", "--washi-wide-cap: 240px;"), "?"],
  ["12s band in turn: 1.5deg -> 0.00416667turn", once(IDX, "--washi-tilt-band: 1.5deg;", "--washi-tilt-band: 0.0041666667turn;"), "?"],
];
const k0 = new Set(check());
for (const [n, p, exp] of X) { const f = check(p).filter((x) => !k0.has(x)); const ids = [...new Set(f.map((x) => x.split(":")[0]))].join("|"); console.log(`${(f.length ? "RED  " + ids : "GREEN").padEnd(48)} expect ${exp.padEnd(8)} ${n}`); }
