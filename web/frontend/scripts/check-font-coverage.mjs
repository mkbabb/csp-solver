#!/usr/bin/env node
/**
 * FONT COVERAGE GATE (P1-W3) — the subset's cmap against the text the app actually renders.
 *
 * The defect this exists to prevent has already shipped once. The P5 Fraunces subset was cut
 * from the AUTHORED heading strings while `.section-heading` carried `text-transform:
 * uppercase`, so the file held `B D S` and no other capital: 6 of 41 rendered heading glyphs
 * were actually Fraunces (14.6%), and `NEW GAME` / `CHECK` contained ZERO — every other letter
 * painting as Georgia at `font-weight: 800`, i.e. synthetic bold on a fallback serif. The
 * `unicode-range` descriptor was honest the whole time; the bytes simply weren't there, and
 * nothing compared the two.
 *
 * THE RULE, enforced here: cut from RENDERED text, and for any string that passes through a
 * `text-transform`, cover BOTH CASES — the AUTHORED form and the form the transform actually
 * produces. That pair is exactly what the shipped bug got wrong (authored `Size` cut, rendered
 * `SIZE` painted), and covering both is what makes the cut survive a later change of transform.
 * It deliberately does NOT demand the full A–Z of a lowercase-transformed heading: that would
 * be asserting a transform the app does not have, and it is the +11,184 B option the owner
 * declined. That single line in the recipe is the actual fix; the woff2 is only its output.
 *
 * Zero dependencies: reads the woff2's `cmap` by walking the SFNT tables directly (the file is
 * woff2-compressed, so the `glyf`/`loca` tables can't be read without brotli — but `cmap` is
 * one of the tables woff2 stores with its own length, and this script only needs the
 * codepoints). If the format ever defeats it, it fails loudly rather than passing vacuously.
 *
 *   node scripts/check-font-coverage.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { brotliDecompressSync } from "node:zlib";
import process from "node:process";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const FONT = "src/assets/fonts/fraunces-subset.woff2";
const INDEX_CSS = "src/assets/index.css";

// ── The rendered corpus ─────────────────────────────────────────────────────────────────────
// Every string the Fraunces face is asked to paint, AS AUTHORED, with the `text-transform` it
// passes through on the way to the screen. Each string is required in both forms.
const CORPUS = [
  // `.section-heading` — `text-transform: lowercase` (assets/typography.css). The authored
  // strings are the games' `defineGame` sections, and after T4-P1's zone grammar that is ALL
  // of them: `New game` / `Marks` / `Check` / `Candidates` left this face for the pencil hand
  // (washi tape and row captions, Patrick Hand, no transform), so the display face now paints
  // exactly the two eyebrows that caption the staged inputs. The subset is deliberately NOT
  // re-cut for the four departures — it stays a superset, which costs nothing the gate can see
  // (§2 compares the declared unicode-range to the cmap, not to this corpus) and keeps a
  // string's return from being a font bug.
  {
    where: ".section-heading",
    transform: "lowercase",
    strings: ["Size", "Board Size", "Difficulty"],
  },
  // The wordmark (HandwrittenLogo `.logo-text`) and the gallery card names
  // (GameCard `.card-wordmark`) — no transform, the five registered game ids.
  {
    where: "wordmark + gallery card names",
    transform: "none",
    strings: ["sudoku", "futoshiki", "thermo", "killer", "kenken"],
  },
];

// ── cmap ────────────────────────────────────────────────────────────────────────────────────
function cmapCodepoints(buf) {
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

// ── unicode-range ───────────────────────────────────────────────────────────────────────────
function declaredRange(css) {
  const face = css.slice(css.indexOf('font-family: "Fraunces"'));
  const decl = face.slice(
    face.indexOf("unicode-range:"),
    face.indexOf(";", face.indexOf("unicode-range:")),
  );
  const out = new Set();
  for (const m of decl.matchAll(/U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?/g)) {
    const a = parseInt(m[1], 16);
    const b = m[2] ? parseInt(m[2], 16) : a;
    for (let c = a; c <= b; c++) out.add(c);
  }
  if (!out.size) throw new Error(`${INDEX_CSS}: no unicode-range parsed for Fraunces`);
  return out;
}

const buf = readFileSync(join(ROOT, FONT));
const cmap = cmapCodepoints(buf);
const declared = declaredRange(readFileSync(join(ROOT, INDEX_CSS), "utf8"));

const problems = [];

// 1. every rendered string is fully covered, in every case it can be rendered in.
for (const group of CORPUS) {
  for (const s of group.strings) {
    const forms = new Set([s]); // as authored
    if (group.transform === "lowercase") forms.add(s.toLowerCase());
    if (group.transform === "uppercase") forms.add(s.toUpperCase());
    for (const form of forms) {
      const missing = [...form].filter((ch) => !cmap.has(ch.codePointAt(0)));
      if (missing.length) {
        problems.push(
          `${group.where}: "${form}" misses ${missing.map((c) => JSON.stringify(c)).join(" ")}`,
        );
      }
    }
  }
}

// 2. the declared unicode-range equals the cmap — an honest descriptor, both directions.
const only = (a, b) => [...a].filter((c) => !b.has(c)).sort((x, y) => x - y);
const chars = (l) =>
  l
    .map(
      (c) =>
        `U+${c.toString(16).toUpperCase().padStart(4, "0")} ${JSON.stringify(String.fromCodePoint(c))}`,
    )
    .join(", ");
const rangeExtra = only(declared, cmap);
const cmapExtra = only(cmap, declared);
if (rangeExtra.length)
  problems.push(
    `${INDEX_CSS} unicode-range claims codepoints the file lacks: ${chars(rangeExtra)}`,
  );
if (cmapExtra.length)
  problems.push(
    `${FONT} carries codepoints the unicode-range gates out: ${chars(cmapExtra)}`,
  );

if (problems.length) {
  console.error("font coverage FAILED:");
  for (const p of problems) console.error(`  · ${p}`);
  process.exit(1);
}
console.log(
  `font coverage OK — ${cmap.size} codepoints, ${buf.length} B; ` +
    `${CORPUS.reduce((n, g) => n + g.strings.length, 0)} strings covered as authored AND as transformed`,
);
