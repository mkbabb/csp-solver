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
 * adjudication, the adjudication never happened, and the string shipped anyway. It ships no
 * longer — T9-W7 · B1 recut it to `finishes the board for you` and struck its admission below,
 * so this arm is now the thing that reds if it ever comes back.
 *
 * T9-W7 · B1b · THE COPY TABLE, and the blind spot that hid two more sentences. This arm reads
 * copy by the SHAPE it is written in: a template text node, a rendered attribute, an object key
 * NAMED for copy (`COPY_KEYS`), a narration call. A table keyed by what the copy is ABOUT is
 * none of those, and `PAPER_NOTE_COPY` (`games/shared/solver/classifyError.ts`) is exactly that
 * — `{ budget, network, deal-timeout, unknown }`, four sentences a `role="alert"` card prints to
 * a player, two of which said `solver` while this gate called the tree clean (exec/B1 §7 gap 6).
 * THE RULE IS THE CONST'S NAME, not its keys: a declaration whose own name says COPY is a copy
 * table, so every string literal in its object literal is read as copy (`COPY_TABLE_NAME`). The
 * other half of that gap — a `Record<…, string>` whose declared TYPE says copy — needs a type
 * reader and stays booked to W5's gate estate; the control below states the blind spot that
 * leaves, so it is measured rather than implied.
 *
 * T9-W7 · G17 · THE SPOKEN SOURCE, and the literal grammar the arm could not read. Two shapes
 * of the same blindness, and the estate's law is that a gate over copy DISCOVERS its subjects
 * rather than enumerating them (W8's intake from W7 §2). FIRST: a cell's whole spoken name is
 * assembled in `useGameCell.ts` as "core = `solver's answer ${n}`" inside
 * `const ariaLabel = computed(…)` — copy a screen reader says out loud, in none of the shapes
 * above, so B1 had to find it by hand and a regression would have to be found by hand again.
 * The rule is the one `COPY_TABLE_NAME` already runs one seam over, applied to a declaration
 * instead of a table: a NAME that says the value is words a reader gets (`SPOKEN_SOURCE_NAME` —
 * `aria…`, or ending `Label`/`Text`/`Caption`/`Note`/`Line`/`Word`/`Name`/…) makes every literal
 * in its initializer copy. SECOND: a TEMPLATE LITERAL was read as one undifferentiated string
 * wherever it was read at all, so `${…}` — which is code — went to the lexicon with the copy.
 * Every arm now reads a backtick through one helper (`copyLiterals` → `staticParts`): the static
 * halves are copy, the interpolations are not, and what an interpolation resolves to is authored
 * somewhere this scan already reads.
 *
 * G17 · REPAIR r1 — FOUR MORE SHAPES, EACH ONE PLANTED BEFORE IT WAS CURED. A non-author
 * verifier wrote five `solver`s into five live sources in shapes r0 could not read and every one
 * shipped past this gate green: a SCREAMING_SNAKE copy table (`FURNITURE_NOTE`), a function that
 * RETURNS the sentence (`formatHintNote`), a spoken ref written by ASSIGNMENT
 * (`errorMessage.value = …`), and a BOUND accessible name in two spellings (a template literal at
 * `StagingBand.vue:200`, a ternary at `DarkModeToggle.vue:7`). All five RED now, each naming its
 * own line, and each has its colour in `--self-test` beside the twin that must stay green. Two
 * false-SUBJECT classes were found in the same pass and fenced with their own controls: a Vue tag
 * read as a declaration annotated `:attr` (the glued colon), and a TYPE alias read as a write.
 * `--reach` prints the rule's whole census: 51 subjects, 28 of them holding a literal, across 17
 * files — matches, distinct sources and copy-bearing sources reported as three numbers, because
 * r0 reported one of them as all three. A census enumerates REACH; only a plant proves a shape.
 *
 * WHAT THE ARM READS: RENDERED strings only — template text nodes, the attribute values that
 * reach a reader or a screen reader (`aria-label`, `title`, `placeholder`, `alt`, and this
 * estate's own copy props `text`/`sublabel`/`label`/`heading`/`caption`), `index.html`'s head,
 * and — T9-W3's fold — the NARRATION CALLS: every string literal handed to a composable whose
 * whole office is putting words in front of a reader (`NARRATION_CALLS`, currently
 * `useLiveRegion`). Spoken copy is copy; an ear is a reader, and the §3.4 cure moved two
 * product strings out of template text into exactly that shape.
 * NOT every string literal in `src/**`, and the distinction is the whole design: the
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
  // EMPTY, and that is the state to keep. Two entries have stood here and both are STRUCK:
  //   · `the solver finishes the board` (T9-W7 · B1, 2026-09-18) — the tape now reads
  //     `finishes the board for you`.
  //   · `candidates` (T9-W7 · B1b, 2026-09-18) — the row caption at GameControlPanel.vue:980
  //     now reads `what fits`, the tape's own words for what the toggle shows.
  // Each strike is the point of admitting a string HERE rather than narrowing the lexicon to
  // miss it: the carve-out goes with the cure, and the gate reds on the regression. The
  // self-test's stale-admission colour is minted from a SYNTHETIC entry (see `selfTest`), so
  // an empty ledger cannot make that check vacuous.
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
 * lookbehind splits the two grammars: `aria-label="…"` is a string, and `:aria-label="…"` is an
 * expression, read by the BOUND arm below.
 *
 * G17 repair r1 — THE BOUND ATTRIBUTE IS READ NOW, and the rationale that excluded it is gone.
 * The exclusion's stated reason was that "a BOUND value is an expression, not a string, and
 * reading its source text as copy would red on variable names". `staticParts` dissolved it: an
 * expression's string literals are separable from its identifiers, and the literals in a bound
 * accessible name are the sentence a screen reader says. Three live sites proved the gap —
 * `StagingBand.vue:200` (`` :aria-label="`deal a new ${name} board`" ``),
 * `HandwrittenLogo.vue:412` (a ternary with a template literal) and `DarkModeToggle.vue:7` (a
 * ternary with two quoted strings) — each of which took a planted `solver` past this gate green.
 * `:aria-label="solverLabel"` still reads nothing, which is the original point kept: the
 * VARIABLE's name is not copy, and its control below still wants 0.
 *
 * The attribute value is delimited by the double quotes Vue and prettier write it in; a
 * single-quoted attribute is outside this grammar and none exists in `src/`.
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
/**
 * NARRATION CALLS — the third rendered-copy surface, and the one the arm was born missing.
 *
 * T9-W3 §3.4 gave the estate a live-region idiom, and the cure it landed moved two product
 * strings OUT of template text and INTO a narration source in `<script setup>`:
 *
 *   const { text } = useLiveRegion(() => cond ? "connecting…" : "");
 *
 * The dash arm still saw both (it reads every literal in every script). The jargon arm did
 * not: a narration source is neither a template text node nor an object-literal copy key, so
 * the strings a screen reader is about to SPEAK fell outside the census the moment they became
 * spoken-only. Measured rather than argued — a `the solver is connecting…` planted in that
 * exact source shipped past this gate green (`evidence/w3/fold/FA3-3A3-jargon-arm-HEAD-BLIND.txt`).
 *
 * THE RULE IS THE CLASS, not the two sites: a composable whose whole office is putting words
 * in front of a reader renders copy, so every string literal in its ARGUMENTS is read as copy.
 * A new one joins this list; nothing else changes. Spoken copy is copy — an ear is a reader.
 */
const NARRATION_CALLS = ["useLiveRegion"];

/**
 * COPY TABLES (T9-W7 · B1b) — a declaration whose own NAME says copy, whatever its keys are
 * named. `PAPER_NOTE_COPY`'s keys are the fault domain (`budget`/`network`/`deal-timeout`/
 * `unknown`), so `COPY_KEYS` above could never see the four sentences it holds; the name can.
 * Every string literal inside such a declaration's object literal is copy.
 */
const COPY_TABLE_NAME =
  /(?<![\w.$])(?:const|let|var)\s+[A-Za-z0-9_$]*(?:COPY|Copy)[A-Za-z0-9_$]*\s*(?::[^=]*)?=\s*\{/g;

/**
 * SPOKEN SOURCES (T9-W7 · G17) — a declaration whose own NAME says it yields words a reader
 * hears or reads, and the last shape of this gate's blindness.
 *
 * `useGameCell.ts`'s cell name is built as "core = `solver's answer ${n}`" inside
 * `const ariaLabel = computed(…)`. That string is spoken by every screen reader that lands on a
 * filled cell, and it was invisible to every arm here: not a template text node (it is in
 * `<script>`), not a rendered attribute (it is bound), not a `COPY_KEY` (it is assigned, not
 * keyed), not a narration call (`computed` is not `useLiveRegion`), not a copy table. It had to
 * be found by hand at B1, and a regression would have to be found by hand again — the estate's
 * law is the opposite (W8's intake from W7 §2: a gate over copy DISCOVERS its subjects).
 *
 * THE RULE IS THE NAME, the same rule `COPY_TABLE_NAME` runs one seam over: an identifier that
 * ends in `Label`/`Text`/`Caption`/`Note`/`Line`/`Word`/`Name`/… , or begins `aria`, declares
 * copy, so every literal in its initializer is copy — including the template literals, which is
 * where a name with a digit in it is always written.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO: scan every template literal in `src/**`. A class name, a
 * `transform`, a thrown developer error and a `TechniqueId` are all template literals, and a
 * lexicon swept over them reds on the identifiers T8-W6 kept on purpose — the same argument the
 * header makes for the string arm. The name is the evidence.
 *
 * ── G17 repair r1 · FOUR SHAPES THE NAME RULE COULD NOT READ ───────────────────────────────
 * A non-author verifier planted five sentences this arm missed and every one of them was live
 * copy, so the rule was right and its GRAMMAR was short. All four shapes are the same rule:
 *
 *  · SCREAMING_SNAKE. The suffix list was TitleCase-only, and this estate writes its copy
 *    tables in caps — `FURNITURE_NOTE` and `HOUSE_WORD` (`techniqueVoice.ts`) are the margin's
 *    own words and were blind. The snake spelling of every suffix joins the name rule; the
 *    match is NOT case-folded, because a capital is this rule's word boundary (`Baseline` is not
 *    a `Line`, and `context` is not a `Text`).
 *  · A FUNCTION that returns the sentence. `formatHintNote(…): string` and
 *    `formatConflictNote(…): string` are the margin note a player reads, assembled in a function
 *    body rather than an initializer. The clause is the name AND the signature: a declared
 *    return type containing `string`, which is what keeps a `void` event handler named
 *    `onMessage` out of a copy census (its own control, below).
 *  · AN ASSIGNMENT, not a declaration. A Vue estate writes its sentences into a ref it declared
 *    empty — `errorMessage.value = "Solve failed"` (`useGameState.ts`) three times over. The
 *    `const|let|var` is now optional and `.value` is allowed, so the name rule reads the WRITE.
 *  · A BOUND attribute. See `RENDERED_ATTRS`.
 */
const SPOKEN_SUFFIXES = [
  "Label",
  "Text",
  "Caption",
  "Heading",
  "Sublabel",
  "Placeholder",
  "Title",
  "Note",
  "Line",
  "Word",
  "Name",
  "Message",
  "Sentence",
  "Announce",
  "Announcement",
];

const SPOKEN_NAME =
  String.raw`(?:aria[A-Za-z0-9_$]*|ARIA_[A-Z0-9_$]*|[A-Za-z0-9_$]*(?:` +
  SPOKEN_SUFFIXES.join("|") +
  String.raw`)|(?:[A-Z0-9$]+_)*(?:` +
  SPOKEN_SUFFIXES.map((w) => w.toUpperCase()).join("|") +
  String.raw`))`;

/**
 * A declaration OR a write. `(?:const|let|var)` is optional and `.value` is allowed, because the
 * sentence a ref finally holds is written after the ref is declared empty. `(?![=>])` keeps `==`,
 * `===` and `=>` out; an operator-assignment (`+=`) never matches, since `\s*` cannot cross the
 * operator.
 *
 * THE ANNOTATION'S COLON IS GLUED to the name, the same law `SPOKEN_SOURCE_PROP` carries and for
 * the same reason: with the keyword optional, `\s*:` let a Vue TAG in — `<SheetWashiLabel :id="…"`
 * read as a `SheetWashiLabel` annotated `:id`, whose "initializer" then ran through the markup to
 * the next `;`. Measured, not reasoned: it swallowed `StagingBand.vue:130`–`200` and reported one
 * planted sentence twice. A type annotation is written `name: T`; a bind is written `Tag :attr=`.
 */
const SPOKEN_SOURCE_NAME = new RegExp(
  String.raw`(?<![\w.$])(?:(?:const|let|var)\s+)?${SPOKEN_NAME}(?:\.value)?(?::[^=;]*)?\s*=(?![=>])`,
  "g",
);

/**
 * A FUNCTION whose name says copy and whose signature says it yields words: the margin note is
 * `return \`only ${valueChar} fits here\``, not an initializer. The return type is the second
 * half of the rule and it is load-bearing — `onMessage(…): void` and `applyTitle(g: GameId)` are
 * a relay handler and a `document.title` write, and a lexicon swept over a 70-line message
 * handler's protocol literals is the Vue-tag phantom again in another costume.
 *
 * KNOWN EDGE, stated: an un-annotated copy function is blind. Every copy function in `src/`
 * today declares `: string`, and the failure is a MISS a reviewer can plant for, not a false RED.
 */
const SPOKEN_SOURCE_FN = new RegExp(
  String.raw`(?<![\w.$])function\s+${SPOKEN_NAME}\s*\(`,
  "g",
);

/**
 * The same name rule on an object PROPERTY, because the estate writes half its accessible names
 * as one — `techniqueVoice.ts:190`'s `ariaLabel: \`level ${n} of ${total}\`` is a spoken name
 * with no declaration of its own. `COPY_KEYS` could not reach it: that list is lowercase keys
 * matched whole (`aria:`, `label:`), and every name here is a compound.
 *
 * The colon is GLUED to the name, and that is load-bearing rather than tidy: a Vue bind writes
 * its colon in front of the NEXT attribute (`<SheetWashiLabel :text="…">`), so a rule that let
 * whitespace in read the component's name as a key and the markup after it as copy — six such
 * phantom subjects in `src/` before the glue, each one a lexicon sweep over bound expressions.
 */
const SPOKEN_SOURCE_PROP = new RegExp(String.raw`(?<![\w.$-])${SPOKEN_NAME}:`, "g");

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
 * The source text of a call's argument list, parens BALANCED from the opening one. Quote-aware,
 * because a `)` inside a string would otherwise close the call early and cut the copy in half.
 * Returns `null` on an unbalanced tail rather than guessing at where the call ended.
 */
function callArgs(s, open) {
  return balanced(s, open, "(", ")");
}

/** The same walk for an object literal's braces — the copy table's body. */
function objectBody(s, open) {
  return balanced(s, open, "{", "}");
}

/**
 * An initializer: from the `=` of a declaration or the `:` of a property to the value's end,
 * quote- and bracket-aware. Ends at a depth-0 character in `stops`, at the closer of whatever
 * block it sits in, or at end of file. A property stops at a comma as well as a semicolon, so a
 * spoken name cannot swallow the siblings beside it in the same object.
 *
 * KNOWN EDGE, stated rather than implied: a declaration written without its semicolon runs on to
 * the next one. Prettier puts one on every statement in this estate, and the failure is loud in
 * the safe direction (a false RED a reviewer reads), not a silent miss.
 */
function initializer(s, eq, stops = ";") {
  let depth = 0;
  let quote = null;
  for (let i = eq + 1; i < s.length; i++) {
    const ch = s[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") {
      if (depth === 0) return { start: eq + 1, text: s.slice(eq + 1, i) };
      depth--;
    } else if (depth === 0 && stops.includes(ch))
      return { start: eq + 1, text: s.slice(eq + 1, i) };
  }
  return { start: eq + 1, text: s.slice(eq + 1) };
}

/**
 * A template literal's STATIC segments, with the offset each one sits at. `${…}` is an
 * EXPRESSION and is skipped: it is code, and reading code as copy reds on identifiers
 * (`${engine.id}`, `${state.unit}`), which is how a lexicon rots into an allowlist. What the
 * expression resolves to is authored somewhere this scan already reads.
 *
 * Brace-depth and quote-aware, so a `}` inside a nested string or a nested object in the
 * interpolation does not close it early.
 */
function staticParts(raw) {
  const out = [];
  let seg = "";
  let at = 0;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === "\\") {
      seg += raw.slice(i, i + 2);
      i++;
      continue;
    }
    if (raw[i] !== "$" || raw[i + 1] !== "{") {
      seg += raw[i];
      continue;
    }
    if (seg) out.push({ index: at, text: seg });
    let depth = 0;
    let quote = null;
    let j = i + 1;
    for (; j < raw.length; j++) {
      const ch = raw[j];
      if (quote) {
        if (ch === "\\") j++;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") quote = ch;
      else if (ch === "{") depth++;
      else if (ch === "}" && --depth === 0) break;
    }
    i = j;
    seg = "";
    at = i + 1;
  }
  if (seg) out.push({ index: at, text: seg });
  return out;
}

/**
 * Every literal inside a region of source, read as COPY: `'…'` and `"…"` whole, a template
 * literal by its static segments only. One helper, so the copy tables, the narration calls and
 * the spoken sources all read a backtick the same way.
 */
function* copyLiterals(text) {
  const lit = /(["'`])((?:(?!\1)[^\\]|\\.)*)\1/g;
  for (let m; (m = lit.exec(text));) {
    if (m[1] !== "`") {
      yield { index: m.index, text: m[2] };
      continue;
    }
    for (const p of staticParts(m[2]))
      yield { index: m.index + 1 + p.index, text: p.text };
  }
}

/** Source between a matching pair, BALANCED from the opening delimiter and quote-aware. */
function balanced(s, open, o, c) {
  let depth = 0;
  let quote = null;
  for (let i = open; i < s.length; i++) {
    const ch = s[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === o) depth++;
    else if (ch === c && --depth === 0)
      return { start: open + 1, text: s.slice(open + 1, i) };
  }
  return null;
}

/**
 * Every SPOKEN SUBJECT in one masked file — the three shapes of the name rule, in one place, so
 * the census below (`--reach`) enumerates what the gate actually reads rather than a second
 * implementation of it. Each subject carries the source text of its value: an initializer, a
 * property's value, or a function body.
 *
 * WHAT A CENSUS CAN AND CANNOT SHOW, stated because the distinction is the whole epistemics: it
 * enumerates this rule's REACH, and reach cannot prove that no unreached site exists. Only a
 * PLANT can do that — a sentence written into a live source in the shape under test, with the
 * gate run bare (repair r1's five, `evidence/w7/exec/G17/repair-r1/`).
 */
function* spokenSubjects(s) {
  SPOKEN_SOURCE_NAME.lastIndex = 0;
  for (let m; (m = SPOKEN_SOURCE_NAME.exec(s));) {
    // A TYPE is not a value and holds no copy: `type ThermoLine = number[]` matches the write
    // shape exactly, and a string-literal union inside one is an identifier set, never a
    // sentence — the very thing T8-W6 kept on purpose.
    if (/(?:type|interface|enum)\s+$/.test(s.slice(Math.max(0, m.index - 12), m.index)))
      continue;
    yield {
      index: m.index,
      kind: "declaration/write",
      name: m[0].replace(/\s+/g, " ").trim(),
      ...initializer(s, SPOKEN_SOURCE_NAME.lastIndex - 1),
    };
  }
  SPOKEN_SOURCE_PROP.lastIndex = 0;
  for (let m; (m = SPOKEN_SOURCE_PROP.exec(s));) {
    // A declaration's OWN type annotation writes the same colon (`let freshNote: string = …`)
    // and the arm above has already read that initializer — one source, one subject, not two
    // matches of the same words (which is what made the r0 census read 33 where it reads 30).
    if (/(?:const|let|var)\s+$/.test(s.slice(Math.max(0, m.index - 12), m.index)))
      continue;
    yield {
      index: m.index,
      kind: "property",
      name: m[0],
      ...initializer(s, SPOKEN_SOURCE_PROP.lastIndex - 1, ",;"),
    };
  }
  // A name that says copy plus a signature that says `string`.
  SPOKEN_SOURCE_FN.lastIndex = 0;
  for (let m; (m = SPOKEN_SOURCE_FN.exec(s));) {
    const params = balanced(s, SPOKEN_SOURCE_FN.lastIndex - 1, "(", ")");
    if (!params) continue;
    const close = params.start + params.text.length;
    const sig = /^\s*:([^{;]*)\{/.exec(s.slice(close + 1));
    if (!sig || !/\bstring\b/.test(sig[1])) continue;
    const body = balanced(s, close + sig[0].length, "{", "}");
    if (body) yield { index: m.index, kind: "function", name: m[0].trim(), ...body };
  }
}

/**
 * Every RENDERED string in one file: `{ line, kind, text }`. Deliberately narrower than the
 * dash arm's corpus — see the header. An interpolation (`{{ … }}`) is an expression and is
 * skipped; what it resolves to is authored somewhere this scan already reads.
 */
function rendered(rel, src) {
  const out = [];
  const s = mask(src);
  const at = (i) => s.slice(0, i).split("\n").length;
  // `index` is the offence's own byte offset in the masked source, and every arm records the
  // LITERAL's offset rather than the key's or the tag's — so two arms reaching one string
  // de-duplicate exactly (`jargon`), and two identical strings on one line stay two.
  const add = (i, kind, text) => {
    const t = text.trim();
    if (t && !t.startsWith("{{")) out.push({ index: i, line: at(i), kind, text: t });
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
        // The BOUND twin: the same attribute as an expression, read by its literals only.
        const bx = new RegExp(`(?<![\\w.$-])(?::|v-bind:)${attr}="([^"]*)"`, "g");
        bx.lastIndex = a;
        for (let m; (m = bx.exec(s)) && m.index < b;) {
          const open = m.index + m[0].length - m[1].length - 1;
          for (const q of copyLiterals(m[1])) add(open + q.index, `:${attr}`, q.text);
        }
      }
    }
  }
  for (const key of COPY_KEYS) {
    const rx = new RegExp(`(?<![\\w.$-])${key}:\\s*(?=["'\`])`, "g");
    while (rx.exec(s)) {
      const one = /^(["'`])((?:(?!\1)[^\\]|\\.)*)\1/.exec(s.slice(rx.lastIndex));
      const open = rx.lastIndex;
      if (one)
        for (const q of copyLiterals(one[0])) add(open + q.index, `${key}:`, q.text);
    }
  }
  // The copy tables: every literal inside a declaration whose own name says copy.
  COPY_TABLE_NAME.lastIndex = 0;
  while (COPY_TABLE_NAME.exec(s)) {
    const body = objectBody(s, COPY_TABLE_NAME.lastIndex - 1);
    if (!body) continue;
    for (const q of copyLiterals(body.text))
      add(body.start + q.index, "COPY table", q.text);
  }
  // The spoken sources: every literal in the initializer of a declaration whose own name says
  // it yields a name a reader hears or reads — the template-literal cores included.
  for (const sub of spokenSubjects(s))
    for (const q of copyLiterals(sub.text))
      add(sub.start + q.index, "spoken source", q.text);
  // The narration sources: every literal a spoken-copy composable is handed. All three quote
  // grammars, because a narration line is as likely to be a template literal as not.
  for (const fn of NARRATION_CALLS) {
    const call = new RegExp(`(?<![\\w.$])${fn}\\s*\\(`, "g");
    while (call.exec(s)) {
      const args = callArgs(s, call.lastIndex - 1);
      if (!args) continue;
      for (const q of copyLiterals(args.text))
        add(args.start + q.index, `${fn}()`, q.text);
    }
  }
  return out;
}

/**
 * Every jargon offence in one file, each ONCE. Two arms can reach the same string by two routes
 * (`aria:` is both a `COPY_KEY` and a spoken name), and one sentence is one offence however many
 * shapes it answers to.
 *
 * THE KEY IS THE BYTE OFFSET (G17 repair r1), not the line. Keyed on `line|text|word`, two
 * genuinely distinct strings that happen to be byte-identical on one line collapsed into one
 * hit — `{ ariaLabel: "the solver", ariaText: "the solver" }` reported 1 offence and there are
 * 2. Every arm records its literal's own offset, so the same string reached twice keys the same
 * and two strings key differently.
 */
function jargon(rel, src) {
  const hits = [];
  const seen = new Set();
  for (const { index, line, kind, text } of rendered(rel, src))
    for (const [re, register] of JARGON) {
      const m = re.exec(text);
      if (!m) continue;
      const key = `${index}|${m[0]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({ index, line, kind, text, word: m[0], register });
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
  // THE NARRATION ARM's own colours. Spoken copy is copy, and until T9-W3's fold these four
  // shapes were all invisible to the lexicon.
  {
    name: "a narration source speaks the machine's name",
    rel: "c.ts",
    src: 'const { text } = useLiveRegion(() => (busy ? "the solver is connecting…" : ""));',
    want: 1,
  },
  {
    name: "a narration source in a template literal",
    rel: "c.ts",
    src: "const { text } = useLiveRegion(() => `${n} candidates left in this house`);",
    want: 2,
  },
  {
    name: "a narration source whose string carries a close paren",
    rel: "c.ts",
    src: 'const { text } = useLiveRegion(() => (on ? "the worker (still) runs" : ""));',
    want: 1,
  },
  // THE COPY TABLE's own colours (T9-W7 · B1b). The first is the shape that shipped two
  // machine-naming sentences past this gate; the second is the blind spot the name-rule leaves.
  // NAMED for what it tests (G17 repair r1): the fixture is `PAPER_NOTE_COPY`, so what this
  // colour exercises is `COPY_TABLE_NAME` — the word COPY in the name — and not the office
  // suffix rule, which is the control two entries below.
  {
    name: "a copy table whose name carries the word COPY",
    rel: "c.ts",
    src: 'const PAPER_NOTE_COPY = { budget: "the solver ran out of steps on this board." };',
    want: 1,
  },
  {
    name: "a copy table whose type says copy and whose NAME does not — the arm is blind",
    rel: "c.ts",
    src: 'const NOTES: Record<string, Copy> = { budget: "the solver gave up." };',
    want: 0,
  },
  // THE SPOKEN SOURCE's own colours (T9-W7 · G17). The first is the shape B1 had to find by
  // hand — a cell's whole spoken name, built as a template literal in a computed.
  {
    name: "a spoken core built as a template literal in an accessible-name source",
    rel: "c.ts",
    src:
      "const ariaLabel = computed(() => {\n  let core: string;\n" +
      "  core = `the solver's answer ${glyph.value}`;\n  return core;\n});",
    want: 1,
  },
  {
    name: "a copy table keyed by its domain, its sentence a template literal",
    rel: "c.ts",
    src: "const PAPER_NOTE_COPY = { budget: `ask the solver about ${n} steps` };",
    want: 1,
  },
  {
    name: "a copy table keyed by its domain, its sentence a plain string",
    rel: "c.ts",
    src: 'const PAPER_NOTE_COPY = { budget: "ask the solver" };',
    want: 1,
  },
  {
    name: "a spoken name written as an object property, not a declaration",
    rel: "c.ts",
    src: "const voice = {\n  ariaLabel: `the solver filled ${n} of ${total}`,\n  id: `worker-${n}`,\n};",
    want: 1,
  },
  // ── G17 repair r1 · THE FOUR SHAPES A VERIFIER PLANTED AND THIS ARM MISSED ────────────────
  // Every one of these is a live shape in `src/` today, and each was measured blind before it
  // was cured: the plant shipped past the gate green, the twin beside it is the same sentence in
  // the player's words, and the fence beside that is what the rule must keep out.
  {
    name: "a copy table named in SCREAMING_SNAKE for its office",
    rel: "c.ts",
    src: 'const FURNITURE_NOTE: Record<string, string> = { cage: "check the solver cage" };',
    want: 1,
  },
  {
    name: "twin — the same SCREAMING_SNAKE table in the player's words",
    rel: "c.ts",
    src: 'const FURNITURE_NOTE: Record<string, string> = { cage: "check the cage" };',
    want: 0,
  },
  {
    name: "a function that RETURNS the sentence, its name and its type both saying copy",
    rel: "c.ts",
    src:
      "export function formatConflictNote(unit: ConflictUnit): string {\n" +
      '  if (!unit) return "no solution from here";\n' +
      "  return `check the solver's ${unit.kind}`;\n}",
    want: 1,
  },
  {
    name: "positive control — a void handler named for messages is not a copy source",
    rel: "c.ts",
    src:
      "function onMessage(kind: string): void {\n" +
      '  if (kind === "st") throw new Error("the worker died");\n}',
    want: 0,
  },
  {
    name: "a spoken ref written by ASSIGNMENT, long after it was declared empty",
    rel: "c.ts",
    src: 'const errorMessage = ref("");\nerrorMessage.value = "the solver failed";',
    want: 1,
  },
  {
    name: "positive control — a comparison is not an assignment",
    rel: "c.ts",
    src: 'if (errorMessage.value === "the solver failed") reset();\nconst n = 1;',
    want: 0,
  },
  {
    name: "a BOUND accessible name built as a template literal",
    rel: "c.vue",
    src: '<template><button :aria-label="`deal a new ${name} board from the solver`">x</button></template>',
    want: 1,
  },
  {
    name: "a BOUND accessible name built as a ternary over two quoted strings",
    rel: "c.vue",
    src: "<template><button :aria-label=\"isDark ? 'switch the solver off' : 'switch to dark mode'\">x</button></template>",
    want: 1,
  },
  {
    name: "twin — the same bound accessible name in the player's words",
    rel: "c.vue",
    src: '<template><button :aria-label="`deal a new ${name} board`">x</button></template>',
    want: 0,
  },
  // THE PHANTOM'S SECOND COSTUME, and its own colour. `<SheetWashiLabel :id="…"` is a component
  // and a bind, not a declaration annotated `:id` — before the glued colon this read the markup
  // after it as an initializer, all the way to the next `;` in the script block below.
  {
    name: "positive control — a TYPE whose name says copy holds identifiers, not copy",
    rel: "c.ts",
    src: 'export type CellLabel = "naked-single" | "hidden-single";',
    want: 0,
  },
  {
    name: "positive control — a component tag with a bind is not a spoken declaration",
    rel: "c.vue",
    src:
      '<template><SheetWashiLabel :id="seed" /></template>\n' +
      '<script setup>\nconst tid = "naked-single";\n</script>',
    want: 0,
  },
  {
    name: "two byte-identical sentences on one line are TWO offences",
    rel: "c.ts",
    src: 'const voice = { ariaLabel: "the solver", ariaText: "the solver" };',
    want: 2,
  },
  {
    name: "twin — the same spoken core in the player's words",
    rel: "c.ts",
    src:
      "const ariaLabel = computed(() => {\n  let core: string;\n" +
      "  core = `revealed answer ${glyph.value}`;\n  return core;\n});",
    want: 0,
  },
  {
    name: "twin — the same copy table in the player's words",
    rel: "c.ts",
    src: 'const PAPER_NOTE_COPY = { budget: "this board took too many steps to finish." };',
    want: 0,
  },
  {
    name: "positive control — an INTERPOLATION is code, not copy",
    rel: "c.ts",
    src: "const cellText = `${engine.unit} left`;",
    want: 0,
  },
  {
    name: "positive control — a template literal in a declaration that says nothing about copy",
    rel: "c.ts",
    src: "const id = `naked-single-${n}`;\nthrow new Error(`the worker died`);",
    want: 0,
  },
  {
    name: "positive control — an utterance region declares no copy at its call",
    rel: "c.ts",
    src: 'const { say } = useLiveRegion();\nconst id = "naked-single";',
    want: 0,
  },
  {
    name: "positive control — a narration source in plain English survives",
    rel: "c.ts",
    src: 'const { text } = useLiveRegion(() => (alone ? "you\'re the only one on this board." : ""));',
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
  // SYNTHETIC since T9-W7 · B1b, because the live ledger is empty and a colour minted from an
  // empty list is 0/0 — a check that passes by having nothing to check. This one always has one.
  const ghost = [
    {
      file: "src/games/shared/GameControlPanel.vue",
      text: "a caption nobody authored",
      why: "the self-test's own ghost — never a live admission",
      since: "synthetic",
    },
    ...ADMITTED.map((a) => ({ ...a, text: `${a.text} (never authored)` })),
  ];
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

/**
 * `--reach` — the name rule's own census, and the counting discipline it now states. A MATCH is
 * not a SOURCE: one `let freshNote: string = …` used to match twice (its declaration and the
 * colon of its own type annotation), and an interface member (`ariaSuffix: () => string;`) is a
 * type position holding no copy at all. Three numbers, so none of them can be read as another:
 * matches, distinct sources, and the sources that actually hold a literal.
 */
function reach() {
  const rows = [];
  for (const abs of [...walk(path.join(ROOT, "src"))]) {
    const rel = path.relative(ROOT, abs);
    if (ALLOW.has(rel)) continue;
    const s = mask(fs.readFileSync(abs, "utf8"));
    for (const sub of spokenSubjects(s))
      rows.push({
        rel,
        line: s.slice(0, sub.index).split("\n").length,
        kind: sub.kind,
        name: sub.name,
        copy: [...copyLiterals(sub.text)].filter((q) => q.text.trim()).length,
      });
  }
  rows.sort((a, b) => a.rel.localeCompare(b.rel) || a.line - b.line);
  const distinct = new Set(rows.map((r) => `${r.rel}:${r.line}:${r.name}`));
  const withCopy = rows.filter((r) => r.copy > 0);
  const filesSeen = new Set(rows.map((r) => r.rel));
  console.log(
    `\nspoken-source reach: ${rows.length} match(es), ${distinct.size} distinct source(s), ` +
      `${withCopy.length} holding a literal, across ${filesSeen.size} files`,
  );
  for (const r of rows)
    console.log(`  ${r.rel}:${r.line}  [${r.kind}]  ${r.name}  ${r.copy} literal(s)`);
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

if (process.argv.includes("--reach")) reach();

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
