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
 * ── T9-W5 §5.4 — THE CORPUS STOPS BEING A LIST SOMEONE REMEMBERS TO EDIT ──────────────────
 * The gate above compares a HAND-WRITTEN corpus to the cmap, and that is one containment out
 * of the two the claim needs. It answers "does the cut hold the strings we wrote down"; the
 * shipped defect answers "no" to a different question — "are the strings we wrote down the
 * strings the app renders". T8's ransom-note trap is that second question: a rendered string
 * moves, nobody re-cuts the subset, and the gate that exists to catch exactly this stays green
 * because its subject is the list, not the tree. V5 measured the drift in BOTH directions.
 *
 * So the corpus is now checked against the tree it claims to describe. Every group carries a
 * `derive` — one or more named extractors that read the AUTHORED construct the strings come
 * from (`heading: "…"` in the five `spec.ts` files, `name:`/`label:` in `games/cards.ts`, the
 * static `text="…"` on `<SheetWashiLabel>`, the text of a `.zone-row-label` span) — and check 3
 * requires DERIVED ⊆ DECLARED. A new tooltip, a renamed eyebrow, a sixth game: the derived set
 * grows, containment breaks, and the red names the string and the file it was authored in. The
 * corpus stays declared, because a subset cut is a decision someone has to mean and a
 * fully-derived corpus would re-cut itself silently; what dies is its authority to disagree
 * with the tree.
 *
 * Containment is ONE-WAY on purpose. A declared string the tree no longer renders is a
 * DEPARTURE, and this estate keeps departures deliberately (the subset stays a superset, so a
 * string's return is not a font bug). Departures are printed, never red.
 *
 * Check 4 keeps the derivation from going blind: a `:text="…"` BOUND to an expression cannot
 * be read statically, so the census of those bindings is PINNED. A new one reds, and whoever
 * adds it has to say which register it renders in — which is the moment the question is
 * answerable. Silence there is how a derived corpus rots into a hand-written one again.
 *
 * Check 5 is `playerIdentity.ts`'s WRITEABLE regex, which has claimed since T6 that the hand
 * subset "ships a–i, k–w, y and z — no j, no x" and has never been compared to the file. It is
 * compared here, both directions: a re-cut that adds `x` leaves the generator refusing a name
 * the page can now draw, and one that drops a letter puts a half-drawn slug on a roster row.
 *
 *   node scripts/check-font-coverage.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { brotliDecompressSync } from "node:zlib";
import process from "node:process";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const INDEX_CSS = "src/assets/index.css";
const SRC = "src";

// ── The tree, read once ─────────────────────────────────────────────────────────────────────
function walk(dir, out = []) {
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(rel, out);
    else if (!/\.(test|spec)\.[cm]?[jt]sx?$/.test(e.name)) out.push(rel);
  }
  return out;
}
const TREE = walk(SRC).map((rel) => ({
  rel,
  text: readFileSync(join(ROOT, rel), "utf8"),
}));
const pick = (re) => TREE.filter((f) => re.test(f.rel));
const grab = (files, re) =>
  files.flatMap((f) =>
    [...f.text.matchAll(re)].map((m) => ({ s: m[1], where: f.rel })),
  );

/**
 * THE EXTRACTORS — each names the authored construct it reads. A derivation nobody can check
 * is a second hand-written list wearing a machine's badge, so every one of these points at a
 * literal a reader can open and see.
 */
const EXTRACT = {
  specHeadings: {
    what: '`heading: "…"` in the five src/games/*/spec.ts',
    run: () => grab(pick(/^src\/games\/[^/]+\/spec\.ts$/), /heading:\s*"([^"]+)"/g),
  },
  cardNames: {
    what: '`name: "…"` in src/games/cards.ts (the wordmark and the gallery cards)',
    run: () => grab(pick(/^src\/games\/cards\.ts$/), /\bname:\s*"([^"]+)"/g),
  },
  cardAxisLabels: {
    what: '`label: "…"` in src/games/cards.ts (the picker\'s axis captions)',
    run: () => grab(pick(/^src\/games\/cards\.ts$/), /\blabel:\s*"([^"]+)"/g),
  },
  washiTapes: {
    what: 'static `text="…"` on <SheetWashiLabel> across src/**/*.vue',
    run: () =>
      pick(/\.vue$/).flatMap((f) =>
        [...f.text.matchAll(/<SheetWashiLabel\b[\s\S]*?\/?>/g)]
          .map((m) => /(?<![:\w-])text="([^"]*)"/.exec(m[0]))
          .filter(Boolean)
          .map((m) => ({ s: m[1], where: f.rel })),
      ),
  },
  zoneRowLabels: {
    what: "the static text of a `.zone-row-label` span",
    run: () =>
      pick(/\.vue$/).flatMap((f) =>
        [
          ...f.text.matchAll(/class="[^"]*\bzone-row-label\b[^"]*"[^>]*>([^<{]*)</g),
        ].map((m) => ({ s: m[1].trim(), where: f.rel })),
      ),
  },
};

/** The bindings the derivation cannot read. Pinned, so a new one is a decision, not a gap. */
const BOUND_TAPES = [
  {
    where: "src/games/shared/GameBoard.vue",
    expr: "hoveredAuthor.slug",
    why: "a playerIdentity slug — its repertoire is check 5's subject, not this corpus'",
  },
  {
    where: "src/games/shared/GameControlPanel.vue",
    expr: "inviteAct.washi.value",
    why: "the invite verb's three states, authored in GameControlPanel.vue's INVITE constants",
  },
  {
    where: "src/games/shared/GameControlPanel.vue",
    expr: "shareAct.washi.value",
    why: "the share verb's three states, authored in GameControlPanel.vue's SHARE constants",
  },
];

// ── The rendered corpus ─────────────────────────────────────────────────────────────────────
// Every string the Fraunces face is asked to paint, AS AUTHORED, with the `text-transform` it
// passes through on the way to the screen. Each string is required in both forms — and each
// group names the extractor whose output it must CONTAIN (check 3).
const FACES = [
  {
    family: "Fraunces",
    font: "src/assets/fonts/fraunces-subset.woff2",
    corpus: [
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
        // "Difficulty" → "Level" at the T8 live-pass cures (the drawer eyebrow now speaks
        // the staging band's word). The subset stays a superset over the departure's
        // letters, per the standing no-re-narrowing note above. "Board Size" is a DEPARTURE
        // and check 3 prints it as one — the specs say `Size` today.
        derive: ["specHeadings"],
        strings: ["Size", "Board Size", "Level"],
      },
      // The wordmark (HandwrittenLogo `.logo-text`) and the gallery card names
      // (GameCard `.card-wordmark`) — no transform, the five registered game ids. A sixth
      // family's card lands in `cards.ts` and reds here until the cut holds its letters.
      {
        where: "wordmark + gallery card names",
        transform: "none",
        derive: ["cardNames"],
        strings: ["sudoku", "futoshiki", "thermo", "killer", "kenken"],
      },
    ],
  },
  // THE SECOND FACE (T4-P1, stage BC). The hand register was never in this gate, and the zone
  // grammar moved four names into it — then minted a caption (`board changed · Ask again`)
  // whose `·` and `A` sit outside the cut, so it painted in two faces at the rank the grammar
  // exists to define. The corpus below is the register this loop owns: the compartment tapes,
  // the row captions and the four status lines. It is deliberately NOT the whole hand estate —
  // the icon sublabels and the keycaps carry capitals the cut has never held, a pre-existing
  // and now-LEDGERED population (`e2e/font-census.spec.ts`), and claiming them here would be a
  // gate that reds on a condition this pass did not create and cannot cure without a re-cut.
  {
    family: "Patrick Hand",
    font: "src/assets/fonts/patrickhand-subset.woff2",
    corpus: [
      // T9-W5 \u00a75.4 \u2014 this group used to hold FOUR strings, and the derivation found TWELVE
      // `<SheetWashiLabel text="\u2026">` on the tree. The eight it did not hold are not a defect
      // the wave introduced; they are eight sentences that have been painting in a
      // 46-codepoint subset with nothing comparing them to it, which is the trap stated
      // exactly. All twelve are declared here and all twelve clear the cut (measured \u2014 the
      // hand's repertoire is lowercase, and the tooltips are written in it).
      {
        where: ".washi-tag (compartment names) + the tapes",
        transform: "none",
        derive: ["washiTapes"],
        strings: [
          "new game",
          "pencils",
          "teacher's",
          "hold to peek",
          "normal writes a digit. corner and center write small pencil marks",
          "show every digit that still fits in a cell",
          "checking",
          "when your mistakes get checked",
          "players",
          "share this board and everyone writes on the same grid",
          "wipe every digit you've written",
          "fill the cells that have only one digit left",
          "finishes the board for you",
        ],
      },
      {
        where: ".zone-row-label (row captions)",
        transform: "none",
        derive: ["zoneRowLabels"],
        strings: ["marks", "candidates"],
      },
      // T8-W1 M3 \u2014 `.check-status`'s four states left the corpus with the line that painted
      // them. The cut is NOT re-narrowed: `level` (the picker's difficulty caption, the string
      // the band's own comment pins this face for) and the two row captions above still hold
      // every codepoint the subset must carry, and a shrunk subset is a re-cut this pass has
      // no order for.
      {
        where: ".staging-axis-label (the picker's axis captions)",
        transform: "none",
        derive: ["cardAxisLabels"],
        strings: ["size", "level"],
      },
    ],
  },
];

// ── cmap ────────────────────────────────────────────────────────────────────────────────────
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

// ── unicode-range ───────────────────────────────────────────────────────────────────────────
function declaredRange(css, family) {
  const face = css.slice(css.indexOf(`font-family: "${family}"`));
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
  if (!out.size) throw new Error(`${INDEX_CSS}: no unicode-range parsed for ${family}`);
  return out;
}

const css = readFileSync(join(ROOT, INDEX_CSS), "utf8");
const problems = [];
const departures = [];
const only = (a, b) => [...a].filter((c) => !b.has(c)).sort((x, y) => x - y);
const chars = (l) =>
  l
    .map(
      (c) =>
        `U+${c.toString(16).toUpperCase().padStart(4, "0")} ${JSON.stringify(String.fromCodePoint(c))}`,
    )
    .join(", ");
const banked = [];
for (const face of FACES) {
  const buf = readFileSync(join(ROOT, face.font));
  const cmap = cmapCodepoints(buf, face.font);
  const declared = declaredRange(css, face.family);

  // 1. every rendered string is fully covered, in every case it can be rendered in.
  for (const group of face.corpus) {
    for (const s of group.strings) {
      const forms = new Set([s]); // as authored
      if (group.transform === "lowercase") forms.add(s.toLowerCase());
      if (group.transform === "uppercase") forms.add(s.toUpperCase());
      for (const form of forms) {
        const missing = [...form].filter((ch) => !cmap.has(ch.codePointAt(0)));
        if (missing.length)
          problems.push(
            `${face.family} · ${group.where}: "${form}" misses ${missing.map((c) => JSON.stringify(c)).join(" ")}`,
          );
      }
    }
  }

  // 2. the declared unicode-range equals the cmap — an honest descriptor, both directions.
  const rangeExtra = only(declared, cmap);
  const cmapExtra = only(cmap, declared);
  if (rangeExtra.length)
    problems.push(
      `${INDEX_CSS} unicode-range for ${face.family} claims codepoints the file lacks: ${chars(rangeExtra)}`,
    );
  if (cmapExtra.length)
    problems.push(
      `${face.font} carries codepoints the unicode-range gates out: ${chars(cmapExtra)}`,
    );

  // 3. RENDERED CENSUS ⊆ CORPUS. The tree is the subject; the list only gets to be a superset.
  for (const group of face.corpus) {
    if (!group.derive) {
      problems.push(
        `${face.family} · ${group.where}: the group declares ${group.strings.length} string(s) ` +
          `and NO \`derive\`. A corpus nobody compares to the tree is the T8 trap re-armed — ` +
          `name the extractor that reads where these are authored (${Object.keys(EXTRACT).join(", ")}).`,
      );
      continue;
    }
    const declared = new Set(group.strings);
    const seen = new Set();
    for (const id of group.derive) {
      const ex = EXTRACT[id];
      if (!ex) {
        problems.push(
          `${face.family} · ${group.where}: derives from \`${id}\`, which is not an extractor.`,
        );
        continue;
      }
      const found = ex.run();
      if (!found.length)
        problems.push(
          `${face.family} · ${group.where}: extractor \`${id}\` (${ex.what}) found NOTHING. ` +
            `An empty derivation contains anything, so this check would pass on a blind read ` +
            `— the construct was renamed, or the file moved.`,
        );
      for (const { s, where } of found) {
        seen.add(s);
        if (declared.has(s)) continue;
        problems.push(
          `${face.family} · ${group.where}: ${where} renders "${s}" and the corpus does not ` +
            `hold it. THIS IS THE RANSOM NOTE: the subset was cut from the list, the app ` +
            `paints the tree, and the letters this string needs were never asked for. Add it ` +
            `here and re-cut the woff2 if check 1 then reds.`,
        );
      }
    }
    for (const s of declared)
      if (!seen.has(s)) departures.push(`${face.family} · ${group.where}: "${s}"`);
  }

  banked.push(
    `${face.family}: ${cmap.size} codepoints, ${buf.length} B, ` +
      `${face.corpus.reduce((n, g) => n + g.strings.length, 0)} declared strings over ` +
      `${face.corpus.length} group(s), each derived`,
  );
}

// 4. THE BOUND CENSUS. `:text="expr"` cannot be read statically, so the set of them is pinned:
// a new binding reds until someone says which register it paints in. Closed both ways — a
// pinned binding that is gone reds too, because a stale pin is a claim about a file that has
// moved on.
{
  const live = [];
  for (const f of pick(/\.vue$/))
    for (const m of f.text.matchAll(/<SheetWashiLabel\b[\s\S]*?\/?>/g)) {
      const bound = /:text="([^"]*)"/.exec(m[0]);
      if (bound) live.push({ where: f.rel, expr: bound[1] });
    }
  const key = (b) => `${b.where} :text="${b.expr}"`;
  const pinned = new Set(BOUND_TAPES.map(key));
  const found = new Set(live.map(key));
  for (const b of live)
    if (!pinned.has(key(b)))
      problems.push(
        `${b.where} binds \`:text="${b.expr}"\` and the pinned census does not carry it. The ` +
          `derivation cannot read an expression, so an unpinned binding is a string this gate ` +
          `is blind to. Pin it in BOUND_TAPES with the register it renders in, or make it a ` +
          `static \`text="…"\` the extractor can see.`,
      );
  for (const p of pinned)
    if (!found.has(p))
      problems.push(
        `the bound-tape census pins \`${p}\` and no such binding is on the tree. A stale pin ` +
          `is a claim about a file that has moved on — strike the entry.`,
      );
}

// 5. THE WRITEABLE COMPARATOR (T9-W5 §5.4). `playerIdentity.ts` filters the name dictionaries
// to the letters it says the hand subset can draw. That claim has never been compared to the
// file it is about; it is compared here, both directions.
const WRITEABLE_SRC = "src/games/shared/playerIdentity.ts";
{
  const text = TREE.find((f) => f.rel === WRITEABLE_SRC)?.text;
  const m = text && /const WRITEABLE = \/\^\[([^\]]+)\]\+\$\//.exec(text);
  if (!m)
    problems.push(
      `${WRITEABLE_SRC}: no \`const WRITEABLE = /^[…]+$/\` found. The comparator refuses to ` +
        `run rather than pass over a claim it cannot read.`,
    );
  else {
    const claimed = new Set();
    for (const r of m[1].matchAll(/(.)-(.)|(.)/g)) {
      if (r[3]) claimed.add(r[3]);
      else
        for (let c = r[1].codePointAt(0); c <= r[2].codePointAt(0); c++)
          claimed.add(String.fromCodePoint(c));
    }
    const hand = FACES.find((f) => f.family === "Patrick Hand");
    const cmap = cmapCodepoints(readFileSync(join(ROOT, hand.font)), hand.font);
    const drawable = new Set(
      [..."abcdefghijklmnopqrstuvwxyz"].filter((c) => cmap.has(c.codePointAt(0))),
    );
    const missing = [...drawable].filter((c) => !claimed.has(c)).sort();
    const phantom = [...claimed].filter((c) => !drawable.has(c)).sort();
    if (phantom.length)
      problems.push(
        `${WRITEABLE_SRC}: WRITEABLE admits ${phantom.map((c) => `\`${c}\``).join(" ")}, and ` +
          `${hand.font} cannot draw ${phantom.length > 1 ? "them" : "it"}. Every slug carrying ` +
          `that letter comes out half in the hand and half in the system cursive, mid-word, on ` +
          `every roster row that draws it — the exact defect the regex was written to prevent.`,
      );
    if (missing.length)
      problems.push(
        `${WRITEABLE_SRC}: ${hand.font} draws ${missing.map((c) => `\`${c}\``).join(" ")} and ` +
          `WRITEABLE refuses ${missing.length > 1 ? "them" : "it"}. The cut was widened and ` +
          `the generator was not told: names the page can paint are being thrown away.`,
      );
  }
}

if (problems.length) {
  console.error("font coverage FAILED:");
  for (const p of problems) console.error(`  · ${p}`);
  process.exit(1);
}
console.log(
  `font coverage OK — ${FACES.length} subset faces, each covered as authored AND as ` +
    `transformed, each corpus a superset of what ${TREE.length} src files actually render:\n  ` +
    banked.join("\n  "),
);
console.log(
  `  bound tapes: ${BOUND_TAPES.length} pinned · WRITEABLE == the hand cut, both directions`,
);
if (departures.length)
  console.log(
    `  departures (declared, no longer rendered — the cut stays a superset on purpose):\n    ` +
      departures.join("\n    "),
  );
