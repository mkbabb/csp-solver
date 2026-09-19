/**
 * tape-cost.mjs — what a visible meter label COSTS in font bytes, answered against the
 * shipped cut rather than assumed. The charter carries the risk "digits in Patrick Hand are
 * unverified in the subset"; index.css:94-96 declares the face's unicode-range and
 * scripts/check-font-coverage.mjs asserts that range EQUALS the woff2's cmap in BOTH
 * directions, so the declared range IS the cut.
 */
import { readFileSync } from "node:fs";
const css = readFileSync("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/assets/index.css", "utf8");
const block = css.slice(css.indexOf('font-family: "Patrick Hand"'));
const range = block.slice(block.indexOf("unicode-range:"), block.indexOf(";", block.indexOf("unicode-range:")));
const set = new Set();
for (const tok of range.replace("unicode-range:", "").split(",")) {
  const t = tok.trim().replace(/^U\+/i, "");
  if (!t) continue;
  if (t.includes("-")) { const [a, b] = t.split("-").map((x) => parseInt(x, 16)); for (let i = a; i <= b; i++) set.add(i); }
  else set.add(parseInt(t, 16));
}
const CANDIDATES = [
  "3 of 20 filled", "12 of 81 filled", "0 of 20 filled", "3 of 20 written",
  "half filled", "board fill", "board 40% filled", "3/20 filled", "filled",
];
console.log("Patrick Hand cut:", set.size, "codepoints");
for (const s of CANDIDATES) {
  const miss = [...new Set([...s])].filter((ch) => !set.has(ch.codePointAt(0)));
  console.log(
    (miss.length ? "RE-CUT" : "FREE  ") + "  " + JSON.stringify(s) +
    (miss.length ? "  missing: " + miss.map((c) => `${JSON.stringify(c)} U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`).join(", ") : ""),
  );
}
