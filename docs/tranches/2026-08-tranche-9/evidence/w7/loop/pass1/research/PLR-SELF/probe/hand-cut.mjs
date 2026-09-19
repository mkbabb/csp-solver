// PLR-SELF pass-1 · the hand cut, read from the shipped woff2.
// `cmapCodepoints` is LIFTED VERBATIM from web/frontend/scripts/check-font-coverage.mjs:245-381
// (sed-extracted, not retyped) so the repertoire this lane prices is the gate's own.
import { readFileSync } from "node:fs";
import { brotliDecompressSync } from "node:zlib";
function cmapCodepoints(buf, FONT) {
  if (buf.toString("latin1", 0, 4) !== "wOF2") throw new Error(`${FONT}: not a woff2`);
  const numTables = buf.readUInt16BE(12);
  // woff2 TableDirectoryEntry: flags(1) [tag(4) if flags&0x3f === 0x3f] origLength(UIntBase128)
  // [transformLength(UIntBase128) if transformed]. The compressed stream follows the directory.
  const KNOWN = [
    "cmap",
    "head",
    "hhea",
    "hmtx",
    "maxp",
    "name",
    "OS/2",
    "post",
    "cvt ",
    "fpgm",
    "glyf",
    "loca",
    "prep",
    "CFF ",
    "VORG",
    "EBDT",
    "EBLC",
    "gasp",
    "hdmx",
    "kern",
    "LTSH",
    "PCLT",
    "VDMX",
    "vhea",
    "vmtx",
    "BASE",
    "GDEF",
    "GPOS",
    "GSUB",
    "EBSC",
    "JSTF",
    "MATH",
    "CBDT",
    "CBLC",
    "COLR",
    "CPAL",
    "SVG ",
    "sbix",
    "acnt",
    "avar",
    "bdat",
    "bloc",
    "bsln",
    "cvar",
    "fdsc",
    "feat",
    "fmtx",
    "fvar",
    "gvar",
    "hsty",
    "just",
    "lcar",
    "mort",
    "morx",
    "opbd",
    "prop",
    "trak",
    "Zapf",
    "Silf",
    "Glat",
    "Gloc",
    "Feat",
    "Sill",
  ];
  let p = 48;
  const readBase128 = () => {
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
    const origLength = readBase128();
    const transformVersion = (flags >> 6) & 0x03;
    const transformed =
      tag === "glyf" || tag === "loca"
        ? transformVersion === 0
        : transformVersion !== 0;
    const len = transformed ? readBase128() : origLength;
    tables.push({ tag, offset, len });
    offset += len;
  }
  if (!tables.some((t) => t.tag === "cmap")) throw new Error(`${FONT}: no cmap table`);
  // The table data is a single brotli stream; decompress with node's own zlib (no dependency).
  const data = brotliDecompressSync(buf.subarray(p));
  const t = tables.find((x) => x.tag === "cmap");
  const cmap = data.subarray(t.offset, t.offset + t.len);
  const out = new Set();
  const n = cmap.readUInt16BE(2);
  for (let i = 0; i < n; i++) {
    const sub = cmap.readUInt32BE(4 + i * 8 + 4);
    const format = cmap.readUInt16BE(sub);
    if (format === 4) {
      const segX2 = cmap.readUInt16BE(sub + 6);
      const segs = segX2 / 2;
      const endBase = sub + 14;
      const startBase = endBase + segX2 + 2;
      for (let s = 0; s < segs; s++) {
        const end = cmap.readUInt16BE(endBase + s * 2);
        const start = cmap.readUInt16BE(startBase + s * 2);
        if (start === 0xffff) continue;
        for (let c = start; c <= end; c++) out.add(c);
      }
    } else if (format === 12) {
      const groups = cmap.readUInt32BE(sub + 12);
      for (let g = 0; g < groups; g++) {
        const b = sub + 16 + g * 12;
        const start = cmap.readUInt32BE(b);
        const end = cmap.readUInt32BE(b + 4);
        for (let c = start; c <= end; c++) out.add(c);
      }
    }
  }
  if (!out.size)
    throw new Error(
      `${FONT}: cmap parsed to zero codepoints — the check would be vacuous`,
    );
  return out;
}

// ── PLR-SELF's own main ────────────────────────────────────────────────────────────────────
// Every string this family would RENDER in --font-hand, priced against the cut. An aria-label
// is not priced: nothing draws it.
const FONT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/assets/fonts/patrickhand-subset.woff2";
const cps = cmapCodepoints(readFileSync(FONT), "patrickhand-subset.woff2");
const have = new Set([...cps].map((c) => String.fromCodePoint(c)));
const repertoire = [...cps].sort((a, b) => a - b).map((c) => String.fromCodePoint(c));
console.log(`hand cut: ${cps.size} codepoints`);
console.log(`repertoire: ${JSON.stringify(repertoire.join(""))}`);
console.log(`digits present: ${"0123456789".split("").filter((d) => have.has(d)).join("") || "(none)"}`);

const MINTED = {
  "state line, solo": "only you",
  "state line, N (digit)": "3 on this board",
  "state line, N (spelled)": "three on this board",
  "the qualifier (exists today)": "you",
  "the foot, recent": "last heard from just now",
  "the foot, recent (no j)": "last heard from a moment ago",
  "the foot, aged (digit)": "last heard from 30 seconds ago",
  "the foot, aged (spelled)": "last heard from half a minute ago",
  "the compression (digit)": "and 7 more",
  "the compression (spelled)": "and seven more",
  "the well's verbs (exist today)": "leave",
  "the link act": "copy link",
  "identity loss A": "this board gave you a new name",
  "identity loss B": "you have a new name on this board",
  "identity loss C": "another tab has your name",
  "the sheet's own title": "who is on this board",
};
let bad = 0;
for (const [where, s] of Object.entries(MINTED)) {
  const miss = [...new Set(s.split(""))].filter((ch) => !have.has(ch));
  if (miss.length) bad++;
  console.log(
    `${miss.length ? "MISS" : "ok  "}  ${where.padEnd(32)} ${JSON.stringify(s)}` +
      (miss.length ? `  missing ${JSON.stringify(miss.join(""))}` : ""),
  );
}
console.log(bad ? `\n${bad} string(s) need a re-cut.` : "\nevery minted string is inside the cut.");
