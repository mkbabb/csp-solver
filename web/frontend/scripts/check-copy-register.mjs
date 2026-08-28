#!/usr/bin/env node
/**
 * THE COPY REGISTER (T8-W6, M16) — no em dash reaches a reader, and no jargon either.
 *
 * The owner's mark is categorical and has three clauses: contrived, metaphorical, meta and
 * jargon copy is deleted wholesale; whatever survives is plain English; and "if we ever do
 * display language, we can never us an em dash". Two of those three are judgements a script
 * cannot make. The third is a CHARACTER, so it gets the config the ruling lands with — the
 * estate's own rule that a ruling without an enforcing gate is a ruling that comes back
 * (lessons §2, and this family's second bite is exactly what W1's surviving keeps were).
 *
 * THE RULE. Inside `src/**` — every `<template>` text node, and every string literal in every
 * script — an em dash (—) or an en dash (–) is RED. Also `index.html`'s rendered head, which is
 * product copy served before a line of Vue runs.
 *
 * WHY THE MASK. Comments are matched-and-blanked first, indices preserved. This estate's prose
 * is written in em dashes and always has been; a gate that reds its own documentation is worse
 * than no gate. The mask is comments and `<style>` blocks only — a dash inside a string still
 * reds even when that string is a quoted example, which is loud in the safe direction.
 *
 * WHAT IT DOES NOT SEE, stated rather than implied: a dash assembled at runtime
 * (`"a" + DASH + "b"`), and prose held outside the tree (a fixture, a JSON blob). Neither exists
 * in `src/` today; the day one lands is the day the rule earns a second clause.
 *
 * THE ALLOWLIST is per-file and carries a REASON, because a carve-out without one is how a
 * rule rots. Two entries, both genuinely outside the product: the DEV-only filter tuner (gated
 * `import.meta.env.DEV`, never in a production bundle) and the filter census, whose strings are
 * read by another gate and by no reader.
 *
 * ── T9-W5 §5.4 · THE JARGON ARM, and the gap it closes ─────────────────────────────────────
 * Everything above polices ONE CHARACTER. The law's stated subject is jargon, metaphor,
 * meta-language and the machine's name — "'a naked single'--what?" is the owner's own example —
 * and until this wave that half had no detector at all: it was a one-time census run by hand at
 * T8-W6, and a one-time census is a snapshot, not a law. The T8 recap booked it as the LAW-M16
 * gap and named the proof: the live pass flagged `the solver finishes the board` for
 * adjudication, the adjudication never happened, and the string is still shipping.
 *
 * WHAT THE ARM READS: RENDERED strings only — template text nodes, the attribute values that
 * reach a reader or a screen reader (`aria-label`, `title`, `placeholder`, `alt`, and this
 * estate's own copy props `text`/`sublabel`/`label`/`heading`/`caption`), and `index.html`'s
 * head. NOT every string literal in `src/**`, and the distinction is the whole design: the
 * technique engine's `TechniqueId`s are the literal strings `"naked-single"` and
 * `"hidden-single"`, they are ENGINE identifiers by explicit ruling (techniqueVoice.ts), and a
 * lexicon swept over all literals would red on the very identifiers T8-W6 kept on purpose. The
 * dash arm can afford a wide net because a dash in an identifier is always wrong; a lexicon
 * cannot.
 *
 * THE LEXICON IS CURATED, not clever. Every entry is a word this product has no business
 * saying to a player, with the register it belongs to named beside it. It is not a synonym
 * engine and will never catch a fresh contrivance — that judgement stays the reviewer's, as
 * M16's first two clauses always were. What it does catch is the CLASS that has already shipped
 * twice: solver vocabulary, and the machine talking about itself.
 *
 * ADMISSIONS carry a date and a cite, and are closed both ways: an admission whose string is
 * no longer on the tree REDS, so the record cannot outlive the copy it excuses.
 *
 * `--self-test` mints both colours: an injected template dash and an injected literal dash must
 * each turn the census RED, and the same dash inside a comment must not; a jargon word in a
 * rendered attribute must RED, the same word in an engine identifier must not, and a stale
 * admission must RED. A gate that cannot be shown failing is not a gate.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.join(import.meta.dirname, "..");
const DASH = /[—–]/;

/** Outside the product, with the reason it is outside. */
const ALLOW = new Map([
  [
    "src/pencil/dev/FilterTuner.vue",
    "DEV-only tool, gated import.meta.env.DEV — never shipped",
  ],
  [
    "src/pencil/config/filterBudget.ts",
    "census reasons read by check-prod-shake, never by a reader",
  ],
]);

/**
 * THE JARGON LEXICON (T9-W5 §5.4). Curated, each entry with the register it comes from. Word
 * boundaries on both sides, case-insensitive — `Solve` the verb on a button is the player's
 * word and stays; `the solver` is the machine naming itself and does not.
 */
const JARGON = [
  // The solver's own vocabulary — the "naked single" class, M16's cited example.
  [/\bnaked (?:single|pair|triple|quad)\b/i, "solver technique name"],
  [/\bhidden (?:single|pair|triple|quad)\b/i, "solver technique name"],
  [/\bx-wing\b/i, "solver technique name"],
  [/\bswordfish\b/i, "solver technique name"],
  [/\bpointing (?:pair|triple)\b/i, "solver technique name"],
  [/\bbox-line\b/i, "solver technique name"],
  [/\bforcing chain\b/i, "solver technique name"],
  [/\bcandidates?\b/i, "solver vocabulary for what a player calls a pencil mark"],
  [/\bhouse\b/i, "solver vocabulary for a row, a column or a box"],
  [/\bunit\b/i, "solver vocabulary for a row, a column or a box"],
  [/\bconstraints?\b/i, "solver vocabulary"],
  [/\barc[- ]consisten/i, "solver vocabulary"],
  [/\bbacktrack/i, "solver vocabulary"],
  [/\bpropagat/i, "solver vocabulary"],
  [/\bheuristic/i, "solver vocabulary"],
  [/\bCSP\b/, "solver vocabulary"],
  // The machine naming itself — M16's "meta language".
  [/\bsolver\b/i, "the machine's name"],
  [/\balgorithm/i, "the machine's name"],
  [/\bengine\b/i, "the machine's name"],
  [/\bwasm\b/i, "the machine's name"],
  [/\bworker\b/i, "the machine's name"],
  [/\bAI\b/, "the machine's name"],
  // Meta-language — the product talking about the product.
  [/\bthis (?:app|application|site|page|tool)\b/i, "meta-language"],
  [/\bfeature\b/i, "meta-language"],
  [/\bUI\b/, "meta-language"],
];

/**
 * ADMISSIONS — a rendered string that trips the lexicon and is not cured here, each with the
 * seam that owns the cure. Closed both ways (check 3): if the string leaves the tree, the
 * entry reds and has to go with it.
 */
const ADMITTED = [
  {
    file: "src/games/shared/GameControlPanel.vue",
    text: "the solver finishes the board",
    why:
      "T8's live pass flagged this exact string, logged it 'for adjudication' (close-record " +
      "§6.1:184-185) and closed without adjudicating it; T9 re-derived it at F4 and booked the " +
      "cure to T9-W7 §9 (ballot B1), whose fence is src/**. This gate's fence is not, so the " +
      "row lands ARMED with the offender admitted rather than green with the lexicon narrowed " +
      "to miss it — the difference between a wave that cannot cure a defect and a wave that " +
      "cannot see it. Cure the copy and strike this entry in the same commit.",
    since: "2026-08-28",
  },
  {
    file: "src/games/shared/GameControlPanel.vue",
    text: "candidates",
    why:
      "the row caption over the toggle whose own tape reads 'show every digit that still fits " +
      "in a cell' — which is the plain-English sentence the caption is the solver's word for. " +
      "T8-W6 deleted the TECHNIQUE register (techniqueVoice.ts's nine proper names) and this " +
      "survived because that census was about technique names, not vocabulary; the arm landing " +
      "here found it on its first run over the live tree, which is the arm working. Naming the " +
      "replacement is a copy ruling and belongs to T9-W7 §9 (ballot B1) with its sibling above.",
    since: "2026-08-28",
  },
];

const blank = (s, re) => s.replace(re, (m) => m.replace(/[^\n]/g, " "));

/**
 * Comments and `<style>` blocks out, indices preserved.
 *
 * TWO CHANGES AT T9-W5 §5.4, and they are a CURE, not a tidy. The style mask used to be
 * `/<style[\s\S]*?<\/style>/` and used to run FIRST. `GameControlPanel.vue:255` mentions the
 * string `<style>` inside its own header prose, so that pattern opened there and closed at the
 * file's REAL `</style>` 103,706 characters later — blanking the entire single-file component,
 * template and script alike. The gate then found `<template>` at index -1, skipped its template
 * arm, ran its literal arm over 103KB of spaces, and reported the file scanned and clean. The
 * estate's densest product-copy surface, 1,300 lines of it, has been outside this census since
 * the gate shipped, and the console line said `scanned across N files` the whole time.
 *
 * The fix is both halves: comments are blanked BEFORE the style block (so prose that mentions
 * a tag cannot open one), and the style pattern is anchored to line starts (`^<style` …
 * `^</style>`), which is where an SFC's style block actually begins and ends. Either alone
 * closes this instance; both close the class.
 */
function mask(src) {
  let s = blank(src, /<!--[\s\S]*?-->/g);
  s = blank(s, /\/\*[\s\S]*?\*\//g);
  s = blank(s, /(^|[^:])\/\/.*$/gm);
  return blank(s, /^<style[\s\S]*?^<\/style>/gm);
}

/** Every offence in one file: `{ line, kind, text }`. */
function census(rel, src) {
  const hits = [];
  const s = mask(src);
  const at = (i) => s.slice(0, i).split("\n").length;
  const add = (i, kind, text) => hits.push({ line: at(i), kind, text: text.trim() });

  if (rel.endsWith(".vue")) {
    const a = s.indexOf("<template>");
    const b = s.lastIndexOf("</template>");
    if (a >= 0 && b > a) {
      // Template TEXT only: what sits between tags, never the markup itself.
      const re = />([^<>]*)</g;
      re.lastIndex = a;
      for (let m; (m = re.exec(s)) && m.index < b;)
        if (DASH.test(m[1])) add(m.index, "template", m[1]);
    }
  }
  if (rel.endsWith(".html")) {
    for (const re of [/<title>([^<]*)<\/title>/g, /content="([^"]*)"/g])
      for (let m; (m = re.exec(s));) if (DASH.test(m[1])) add(m.index, "head", m[1]);
    return hits;
  }
  // String literals, all three quote grammars.
  const lit = /(["'`])((?:(?!\1)[^\\]|\\.)*)\1/g;
  for (let m; (m = lit.exec(s));) if (DASH.test(m[2])) add(m.index, "literal", m[2]);
  return hits;
}

/**
 * The attributes that reach a reader or a screen reader, and this estate's own copy props. The
 * lookbehind refuses `:aria-label` and `v-bind:text` — a BOUND value is an expression, not a
 * string, and reading its source text as copy would red on variable names.
 */
const RENDERED_ATTRS = [
  "aria-label",
  "aria-description",
  "title",
  "placeholder",
  "alt",
  "text",
  "sublabel",
  "label",
  "heading",
  "caption",
];
/** Object-literal keys whose value is copy: the script-side half of the same surface. */
const COPY_KEYS = [
  "sublabel",
  "washi",
  "aria",
  "heading",
  "label",
  "caption",
  "note",
  "text",
  "title",
  "placeholder",
];

/**
 * Every RENDERED string in one file: `{ line, kind, text }`. Deliberately narrower than the
 * dash arm's corpus — see the header. An interpolation (`{{ … }}`) is an expression and is
 * skipped; what it resolves to is authored somewhere this scan already reads.
 */
function rendered(rel, src) {
  const out = [];
  const s = mask(src);
  const at = (i) => s.slice(0, i).split("\n").length;
  const add = (i, kind, text) => {
    const t = text.trim();
    if (t && !t.startsWith("{{")) out.push({ line: at(i), kind, text: t });
  };

  if (rel.endsWith(".html")) {
    for (const re of [/<title>([^<]*)<\/title>/g, /content="([^"]*)"/g])
      for (let m; (m = re.exec(s));) add(m.index, "head", m[1]);
    return out;
  }
  if (rel.endsWith(".vue")) {
    const a = s.indexOf("<template>");
    const b = s.lastIndexOf("</template>");
    if (a >= 0 && b > a) {
      const re = />([^<>]*)</g;
      re.lastIndex = a;
      for (let m; (m = re.exec(s)) && m.index < b;) add(m.index, "template", m[1]);
      for (const attr of RENDERED_ATTRS) {
        const rx = new RegExp(`(?<![:\\w-])${attr}="([^"]*)"`, "g");
        rx.lastIndex = a;
        for (let m; (m = rx.exec(s)) && m.index < b;) add(m.index, `@${attr}`, m[1]);
      }
    }
  }
  for (const key of COPY_KEYS) {
    const rx = new RegExp(`(?<![\\w.$-])${key}:\\s*"([^"]*)"`, "g");
    for (let m; (m = rx.exec(s));) add(m.index, `${key}:`, m[1]);
  }
  return out;
}

/** Every jargon offence in one file. */
function jargon(rel, src) {
  const hits = [];
  for (const { line, kind, text } of rendered(rel, src))
    for (const [re, register] of JARGON) {
      const m = re.exec(text);
      if (m) hits.push({ line, kind, text, word: m[0], register });
    }
  return hits;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(vue|ts)$/.test(e.name) && !e.name.endsWith(".test.ts")) out.push(p);
  }
  return out;
}

function scan() {
  const files = [...walk(path.join(ROOT, "src")), path.join(ROOT, "index.html")];
  const offences = [];
  const jargonHits = [];
  for (const abs of files) {
    const rel = path.relative(ROOT, abs);
    if (ALLOW.has(rel)) continue;
    const src = fs.readFileSync(abs, "utf8");
    for (const h of census(rel, src)) offences.push({ file: rel, ...h });
    for (const h of jargon(rel, src)) jargonHits.push({ file: rel, ...h });
  }
  // The admissions, closed both ways: an admitted string that has left the tree takes its
  // entry with it, and until it does the entry is a claim about copy that no longer exists.
  const admitted = [];
  const stale = [];
  for (const a of ADMITTED) {
    const hit = jargonHits.find((h) => h.file === a.file && h.text === a.text);
    if (hit) admitted.push({ ...a, ...hit });
    else stale.push(a);
  }
  const live = jargonHits.filter(
    (h) => !ADMITTED.some((a) => a.file === h.file && a.text === h.text),
  );
  return { files, offences, jargonHits, live, admitted, stale };
}

const CONTROLS = [
  {
    name: "template text dash",
    rel: "c.vue",
    src: "<template><p>a fresh 9×9 — naked single</p></template>",
    want: 1,
  },
  {
    name: "string literal dash",
    rel: "c.ts",
    src: 'export const s = "copied — check the bar";',
    want: 1,
  },
  {
    name: "dash inside a comment",
    rel: "c.ts",
    src: "// the caption — deleted at W6\nexport const s = 1;",
    want: 0,
  },
  {
    name: "dash inside a template comment",
    rel: "c.vue",
    src: "<template><!-- pruned — see M16 --><p>ok</p></template>",
    want: 0,
  },
  // THE MASK CURE'S OWN CONTROL. Prose that MENTIONS `<style>` used to open the style mask and
  // blank the rest of the file, so the dash three lines below went unseen. If this ever reads 0
  // again, GameControlPanel.vue has fallen out of the census a second time.
  {
    name: "a header that mentions `<style>`, then a template dash",
    rel: "c.vue",
    src:
      "<script setup>\n/**\n * The panel's own note about its `<style>` block.\n */\n</script>\n" +
      "<template><p>copied — check the bar</p></template>\n<style>\n.x { color: red; }\n</style>\n",
    want: 1,
  },
];

/** The jargon arm's controls: `[name, rel, src, wantHits]`. */
const JARGON_CONTROLS = [
  {
    name: "a technique name in an aria-label",
    rel: "c.vue",
    src: '<template><button aria-label="apply the naked single">go</button></template>',
    want: 1,
  },
  {
    name: "the machine naming itself on a washi tape",
    rel: "c.vue",
    src: '<template><SheetWashiLabel text="the solver finishes the board" /></template>',
    want: 1,
  },
  {
    name: "solver vocabulary in a script-side copy constant",
    rel: "c.ts",
    src: 'export const SHARE = { washi: "every candidate in this house" };',
    want: 2,
  },
  {
    name: "positive control — an ENGINE identifier is not display copy",
    rel: "c.ts",
    src: 'export type TechniqueId = "naked-single" | "hidden-single";',
    want: 0,
  },
  {
    name: "positive control — a BOUND attribute is an expression, not a string",
    rel: "c.vue",
    src: '<template><span :aria-label="solverLabel">x</span></template>',
    want: 0,
  },
  {
    name: "positive control — the player's own verb survives",
    rel: "c.vue",
    src: '<template><button aria-label="Solve puzzle">Solve</button></template>',
    want: 0,
  },
  {
    name: "positive control — jargon inside a comment is prose about the law",
    rel: "c.vue",
    src: "<template><!-- the naked single register died at W6 --><p>ok</p></template>",
    want: 0,
  },
];

function selfTest() {
  let ok = true;
  console.log("\nself-test (both colours):");
  for (const c of CONTROLS) {
    const got = census(c.rel, c.src).length;
    ok &&= got === c.want;
    const verdict =
      got === c.want ? (c.want ? "RED as required" : "GREEN as required") : "FAILED";
    console.log(`  dash · ${c.name}  →  ${got} offence(s), ${verdict}`);
  }
  for (const c of JARGON_CONTROLS) {
    const got = jargon(c.rel, c.src).length;
    ok &&= got === c.want;
    const verdict =
      got === c.want ? (c.want ? "RED as required" : "GREEN as required") : "FAILED";
    console.log(`  jargon · ${c.name}  →  ${got} offence(s), ${verdict}`);
  }
  // The admission ledger's own colour: an entry whose string is not on the tree must be STALE.
  const ghost = ADMITTED.map((a) => ({ ...a, text: `${a.text} (never authored)` }));
  const stale = ghost.filter(
    (a) =>
      !jargon(a.file, fs.readFileSync(path.join(ROOT, a.file), "utf8")).some(
        (h) => h.text === a.text,
      ),
  );
  const staleOk = stale.length === ghost.length;
  ok &&= staleOk;
  console.log(
    `  admissions · a ghost admission is detected stale  →  ${stale.length}/${ghost.length}, ` +
      `${staleOk ? "RED as required" : "FAILED"}`,
  );
  return ok;
}

const { files, offences, jargonHits, live, admitted, stale } = scan();
console.log(`copy register scanned across ${files.length} files`);
console.log(`allowlisted: ${[...ALLOW].map(([f, r]) => `${f} (${r})`).join(", ")}`);
console.log(`em/en dashes in product copy: ${offences.length}`);
for (const o of offences) console.log(`  ${o.file}:${o.line}  [${o.kind}]  ${o.text}`);
console.log(
  `jargon over RENDERED strings: ${jargonHits.length} hit(s), ${admitted.length} admitted, ` +
    `${live.length} unadmitted (lexicon: ${JARGON.length} entries)`,
);
for (const a of admitted)
  console.log(
    `  ~ ${a.file}:${a.line}  [${a.kind}]  "${a.word}" (${a.register}) — ADMITTED ${a.since}`,
  );
for (const h of live)
  console.log(
    `  ✗ ${h.file}:${h.line}  [${h.kind}]  "${h.word}" (${h.register})  ${h.text}`,
  );

const testing = process.argv.includes("--self-test");
if (testing && !selfTest()) process.exit(2);

const fatal = [];
for (const o of offences)
  fatal.push(`${o.file}:${o.line} em/en dash in product copy: "${o.text}"`);
for (const h of live)
  fatal.push(
    `${h.file}:${h.line} renders "${h.word}" (${h.register}) in \`${h.text}\`. M16: jargon, ` +
      `metaphor, meta-language and contrivance are deleted wholesale and what survives is ` +
      `plain English. Rewrite it in the player's words, or admit it in ADMITTED with the seam ` +
      `that owns the cure.`,
  );
for (const a of stale)
  fatal.push(
    `ADMITTED carries ${a.file} "${a.text}" and that string no longer trips the lexicon there. ` +
      `The admission outlived the copy it excused — strike the entry.`,
  );

if (fatal.length) {
  console.error(`\ncheck-copy-register: ${fatal.length} failure(s):`);
  for (const f of fatal) console.error(`  • ${f}`);
  process.exit(1);
}
console.log(
  `\ncheck-copy-register: 0 em/en dashes and 0 unadmitted jargon in product copy ` +
    `(${admitted.length} admitted, each with its cure's seam)`,
);
