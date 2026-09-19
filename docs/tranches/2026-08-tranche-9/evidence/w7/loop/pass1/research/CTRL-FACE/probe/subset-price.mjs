#!/usr/bin/env node
/**
 * CTRL-FACE pass-1 — WHAT THE FACE LAW COSTS IN WOFF2 BYTES.
 *
 * `document.fonts.check()` answered "nothing missing" for every string in both faces, including
 * `p` in "pencils" against a Fraunces cut whose declared `unicode-range` has no U+0070. It is
 * not a per-codepoint coverage oracle in either engine, so the claim is taken from the FILES:
 * the woff2 `cmap` is walked directly (the same walk `scripts/check-font-coverage.mjs` does) and
 * the rendered repertoire of each register is differenced against it.
 *
 * It also reads `fvar`, because the family's stated kill-mitigation ("a lighter Fraunces weight
 * is a second woff2 subset and its bytes are the price") is a question about the axis, not about
 * the repertoire.
 *
 *   node probe/subset-price.mjs
 */
import { readFileSync } from "node:fs";
import { brotliDecompressSync } from "node:zlib";

const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const KNOWN = ["cmap","head","hhea","hmtx","maxp","name","OS/2","post","cvt ","fpgm","glyf","loca","prep","CFF ","VORG","EBDT","EBLC","gasp","hdmx","kern","LTSH","PCLT","VDMX","vhea","vmtx","BASE","GDEF","GPOS","GSUB","EBSC","JSTF","MATH","CBDT","CBLC","COLR","CPAL","SVG ","sbix","acnt","avar","bdat","bloc","bsln","cvar","fdsc","feat","fmtx","fvar","gvar","hsty","just","lcar","mort","morx","opbd","prop","trak","Zapf","Silf","Glat","Gloc","Feat","Sill"];

function sfnt(path) {
  const buf = readFileSync(path);
  const numTables = buf.readUInt16BE(12);
  let p = 48;
  const b128 = () => {
    let v = 0;
    for (let i = 0; i < 5; i++) {
      const b = buf[p++];
      v = (v << 7) | (b & 0x7f);
      if (!(b & 0x80)) return v;
    }
    throw new Error("UIntBase128 overflow");
  };
  const tables = [];
  let offset = 0;
  for (let i = 0; i < numTables; i++) {
    const flags = buf[p++];
    const idx = flags & 0x3f;
    let tag;
    if (idx === 0x3f) {
      tag = buf.toString("latin1", p, p + 4);
      p += 4;
    } else tag = KNOWN[idx];
    const origLength = b128();
    const tv = (flags >> 6) & 0x03;
    const transformed = tag === "glyf" || tag === "loca" ? tv === 0 : tv !== 0;
    const len = transformed ? b128() : origLength;
    tables.push({ tag, offset, len });
    offset += len;
  }
  return { tables, data: brotliDecompressSync(buf.subarray(p)), bytes: buf.length };
}

function cmapOf({ tables, data }) {
  const t = tables.find((x) => x.tag === "cmap");
  const cmap = data.subarray(t.offset, t.offset + t.len);
  const out = new Set();
  const n = cmap.readUInt16BE(2);
  for (let i = 0; i < n; i++) {
    const sub = cmap.readUInt32BE(4 + i * 8 + 4);
    const format = cmap.readUInt16BE(sub);
    if (format === 4) {
      const segX2 = cmap.readUInt16BE(sub + 6);
      const endBase = sub + 14;
      const startBase = endBase + segX2 + 2;
      for (let s = 0; s < segX2 / 2; s++) {
        const end = cmap.readUInt16BE(endBase + s * 2);
        const start = cmap.readUInt16BE(startBase + s * 2);
        if (start === 0xffff) continue;
        for (let c = start; c <= end; c++) out.add(c);
      }
    } else if (format === 12) {
      const groups = cmap.readUInt32BE(sub + 12);
      for (let g = 0; g < groups; g++) {
        const b = sub + 16 + g * 12;
        for (let c = cmap.readUInt32BE(b); c <= cmap.readUInt32BE(b + 4); c++) out.add(c);
      }
    }
  }
  return out;
}

function fvarOf({ tables, data }) {
  const t = tables.find((x) => x.tag === "fvar");
  if (!t) return null;
  const f = data.subarray(t.offset, t.offset + t.len);
  const axisOff = f.readUInt16BE(4);
  const axisCount = f.readUInt16BE(8);
  const axisSize = f.readUInt16BE(10);
  const axes = [];
  for (let i = 0; i < axisCount; i++) {
    const b = axisOff + i * axisSize;
    axes.push({
      tag: f.toString("latin1", b, b + 4),
      min: f.readInt32BE(b + 4) / 65536,
      def: f.readInt32BE(b + 8) / 65536,
      max: f.readInt32BE(b + 12) / 65536,
    });
  }
  return axes;
}

/* THE RENDERED REGISTERS UNDER THE FACE LAW. Every string is the one the page paints, taken
   from `readings/*.json` (the card's own innerText) and from `games/shared/selectors.ts`. */
const PRINTED_NAMES = ["size", "level", "new game", "pencils", "checking", "players", "marks", "candidates"];
const PRINTED_ACTS = ["undo", "redo", "hint", "peek", "deal", "play", "clear", "fill", "solve", "share"];
const ACT_TRANSIENTS = ["sure?", "copied!", "couldn't copy"];
const AUTHORED_NAMES = ["Size", "Level", "new game", "pencils", "checking", "players", "marks", "candidates"];
const AUTHORED_ACTS = ["Undo", "Redo", "Hint", "peek", "Deal", "Play", "Clear", "Fill", "Solve", "Share"];
const WRITTEN_VALUES_AUTHORED = ["4×4", "9×9", "16×16", "5×5", "6×6", "7×7", "Easy", "Medium", "Hard", "Normal", "Corner", "Center", "Off", "On", "Ask", "Live"];
const WRITTEN_VALUES_RENDERED = WRITTEN_VALUES_AUTHORED.map((s) => s.toLowerCase());

const cp = (arr) => {
  const s = new Set();
  for (const str of arr) for (const ch of str) s.add(ch.codePointAt(0));
  return s;
};
const show = (set) =>
  [...set]
    .sort((a, b) => a - b)
    .map((c) => `${JSON.stringify(String.fromCodePoint(c))} U+${c.toString(16).toUpperCase().padStart(4, "0")}`)
    .join(", ");
const missing = (need, have) => new Set([...need].filter((c) => !have.has(c)));

const fr = sfnt(`${FE}/src/assets/fonts/fraunces-subset.woff2`);
const ph = sfnt(`${FE}/src/assets/fonts/patrickhand-subset.woff2`);
const fc = sfnt(`${FE}/src/assets/fonts/firacode-subset.woff2`);
const FR = cmapOf(fr);
const PH = cmapOf(ph);

console.log(`Fraunces subset     ${fr.bytes} B · cmap ${FR.size} codepoints · fvar ${JSON.stringify(fvarOf(fr))}`);
console.log(`Patrick Hand subset ${ph.bytes} B · cmap ${PH.size} codepoints · fvar ${JSON.stringify(fvarOf(ph))}`);
console.log(`Fira Code subset    ${fc.bytes} B · cmap ${cmapOf(fc).size} codepoints · fvar ${JSON.stringify(fvarOf(fc))}`);

const rows = [
  ["PRINTED · the eight group names, rendered (lowercase)", PRINTED_NAMES, FR],
  ["PRINTED · the eight group names, AUTHORED (the gate's both-cases rule)", AUTHORED_NAMES, FR],
  ["PRINTED · the ten act verbs, rendered (lowercase)", PRINTED_ACTS, FR],
  ["PRINTED · the ten act verbs, AUTHORED", AUTHORED_ACTS, FR],
  ["PRINTED · the act transients (armed / copied)", ACT_TRANSIENTS, FR],
  ["WRITTEN · every option value, AUTHORED", WRITTEN_VALUES_AUTHORED, PH],
  ["WRITTEN · every option value, rendered lowercase", WRITTEN_VALUES_RENDERED, PH],
];
for (const [what, strings, have] of rows) {
  const need = cp(strings);
  const miss = missing(need, have);
  console.log(`\n${what}`);
  console.log(`  needs ${need.size} codepoints · MISSING ${miss.size}${miss.size ? ": " + show(miss) : ""}`);
}

console.log(`\nFraunces cut, for reference: ${show(FR)}`);
console.log(`\nPatrick Hand cut, for reference: ${show(PH)}`);
