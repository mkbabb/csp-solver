// CTRL-COST · the band names priced as a woff2 re-cut.
//
// The family mints three NEW rendered strings — `looking` / `writing` / `starting over` —
// and R6 law 30 says a rendered-string change mints a font ransom note. This prices it by
// reading the shipped subsets' own cmaps with the estate gate's reader (imported, not
// re-implemented) and asking one question per face: is every codepoint of the three names
// ALREADY in the cut, as authored and as `text-transform`ed.
//
//   node band-names-price.mjs
//
import { readFileSync } from "node:fs";
import { brotliDecompressSync } from "node:zlib";
import { join } from "node:path";

const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";

// ── the estate gate's own cmap walker, lifted verbatim from
//    scripts/check-font-coverage.mjs (the file is read, the function is the same body) ──
const gateSrc = readFileSync(join(FE, "scripts/check-font-coverage.mjs"), "utf8");
const start = gateSrc.indexOf("function cmapCodepoints");
let depth = 0;
let end = start;
for (let i = gateSrc.indexOf("{", start); i < gateSrc.length; i++) {
  if (gateSrc[i] === "{") depth++;
  else if (gateSrc[i] === "}") {
    depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}
const body = gateSrc.slice(start, end);
const cmapCodepoints = new Function(
  "brotliDecompressSync",
  `${body}; return cmapCodepoints;`,
)(brotliDecompressSync);

const FACES = {
  Fraunces: "src/assets/fonts/fraunces-subset.woff2",
  "Patrick Hand": "src/assets/fonts/patrickhand-subset.woff2",
};

// The three band names, in both the shapes the estate authors names in:
//  · lowercase-authored (the washi tapes' own shape: "new game", "pencils", "players")
//  · Capitalised-authored + `text-transform: lowercase` (the section headings' shape: "Size")
const NAMES = ["looking", "writing", "starting over"];
const SHAPES = {
  "authored lowercase": NAMES,
  "authored capitalised (+ CSS lowercase)": NAMES.map(
    (s) => s[0].toUpperCase() + s.slice(1),
  ),
};
// What they would REPLACE, if the eight-name census collapses to three.
const RETIRED = [
  "new game",
  "pencils",
  "checking",
  "players",
  "marks",
  "candidates",
  "Size",
  "Level",
];

const out = { faces: {}, verdict: [] };
for (const [family, rel] of Object.entries(FACES)) {
  const buf = readFileSync(join(FE, rel));
  const cps = cmapCodepoints(buf, rel);
  const have = new Set(cps);
  const bytes = buf.length;
  const f = { file: rel, bytes, codepoints: [...cps].length, shapes: {} };
  for (const [shape, strings] of Object.entries(SHAPES)) {
    const missing = new Set();
    for (const s of strings)
      for (const ch of s) if (!have.has(ch.codePointAt(0))) missing.add(ch);
    // and the transformed arm the gate also checks
    for (const s of strings)
      for (const ch of s.toLowerCase())
        if (!have.has(ch.codePointAt(0))) missing.add(ch);
    f.shapes[shape] = {
      covered: missing.size === 0,
      missing: [...missing],
    };
  }
  // Which retired names' letters become dead weight (letters no other string needs).
  f.retiredOnlyLetters = null;
  out.faces[family] = f;
}

// The union the three names need, against what the eight retired names needed.
const need = new Set([...NAMES.join(""), ...NAMES.join("").toUpperCase()].filter((c) => c !== " "));
const had = new Set(RETIRED.join("").toLowerCase().split("").filter((c) => c !== " "));
out.letters = {
  bandNamesNeed: [...need].filter((c) => c === c.toLowerCase()).sort().join(""),
  retiredNamesHeld: [...had].sort().join(""),
  newLettersLowercase: [...need]
    .filter((c) => c === c.toLowerCase() && !had.has(c))
    .sort()
    .join(""),
};

console.log(JSON.stringify(out, null, 2));
