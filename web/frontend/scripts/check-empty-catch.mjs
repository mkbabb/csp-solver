#!/usr/bin/env node
/**
 * THE SWALLOW CENSUS (T5-W2 2.4b) — a `catch` body must run a statement or SAY something.
 *
 * The ruling lands with its enforcing config, same commit as its eleven deletions. Every one of
 * the eleven read `try { handle.stop() } catch { /* ignore *\/ }` — a guard against a contract
 * pencil-boil did not state until 0.11.0, where `stop()` cannot throw in any lifecycle phase
 * (`src/vue.ts` §THE stop() NO-THROW CONTRACT; `proofs/stop-contract.proof.ts`, 26 assertions
 * including a hostile host whose `cancelAnimationFrame` throws). Adopting the contract is the
 * cure; this census is what stops the swallow growing back around the next handle.
 *
 * WHY NOT A STOCK LINT RULE. Core `no-empty` does not see these: a block holding a comment is
 * not empty to it. The obvious selector — `CatchClause[body.body.length=0]` — over-reaches the
 * other way: it reds 11 legitimate sites in this estate whose catch bodies hold a real sentence
 * (`localStorage unavailable / over quota — persistence is best-effort`), where the honest
 * content IS the sentence and there is no statement to write. Neither instrument measures the
 * ruling, so the ruling gets its own.
 *
 * THE RULE. A catch body with no statement is RED unless its comments say something. A word
 * from NON_EXPLANATIONS, alone, is not saying something; a bare `catch {}` says less still.
 * SCOPE: all of `src/**`, `src/pencil/dev/**` included — a dev-only swallow is still a swallow,
 * and a rule with one file's carve-out is the config-flag disease this estate keeps deleting.
 *
 * TWO CLAUSE GRAMMARS (T7-W6). The census shipped seeing one — the `catch (e) {` STATEMENT —
 * and JavaScript has a second: `.catch(() => {})`, the promise HANDLER. `App.vue:224` swallowed
 * four dynamic-import rejections in that form for three tranches under a green census, and the
 * miss was structural rather than a tuning slip: on `.catch(() => {` the old head could not
 * match at any offset (`\([^)]*\)` cannot span the arrow's own parens), so no threshold, list or
 * exception would ever have reached it. `--self-test` now carries the arrow control AND the
 * frozen old regex beside it, so the gate proves at every run that its cure still bites the
 * thing it was blind to.
 *
 * WHY THE MASK. Heads are matched over a comment-blanked copy of the file (indices preserved;
 * bodies still read from the original, because the body's PROSE is what the rule grades).
 * Without it the arrow arm reds `relayWire.ts:16`, which quotes `.catch(() => {})` in prose to
 * record the swallow it cured — a census that reds the documentation of a fix is a worse
 * instrument than one that misses the fix. Reach: comments only. A swallow spelled inside a
 * string literal still reds, which is loud and wrong in the safe direction.
 *
 * WHAT STILL ISN'T SEEN, stated rather than implied: an EXPRESSION-bodied handler,
 * `.catch(() => null)`. It has no body to grade, so the rule as written ("a catch body must run
 * a statement or say something") does not reach it — that would be a second rule, not a wider
 * regex. Zero such sites live in `src/` today; the day one lands is the day the rule earns its
 * second clause.
 *
 * `--self-test` mints three negative controls: an injected `catch { /* ignore *\/ }` and an
 * injected `.catch(() => {})` must each turn the census RED, and a swallow QUOTED in a comment
 * must not. A census that cannot be shown failing is not a gate.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.join(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");

/** Words that occupy a catch body without explaining it. Matched whole, case-insensitively. */
const NON_EXPLANATIONS = new Set([
  "ignore",
  "ignored",
  "noop",
  "no-op",
  "nothing",
  "swallow",
  "silent",
  "",
]);

/**
 * The clause head in both grammars, wherever it appears (.ts and .vue templates):
 * the statement — `catch {` / `catch (e) {` — and the promise handler — `.catch(() => {`,
 * `.catch(e => {`, `.catch(async () => {`. Both alternatives end on the body's `{`.
 */
const CATCH_HEAD =
  /\bcatch\s*(?:\([^)]*\)\s*)?\{|\.catch\s*\(\s*(?:async\s+)?(?:\([^)]*\)|[\w$]+)\s*=>\s*\{/g;

/** The head as it stood before T7-W6 — the arrow-blind spelling, kept as the self-test's control. */
const LEGACY_CATCH_HEAD = /\bcatch\s*(?:\([^)]*\)\s*)?\{/g;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|vue)$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** Blank every comment, offsets and line breaks preserved, so a head match lands in real code. */
function maskComments(text) {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return text.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/\/\/[^\n]*/g, blank);
}

/**
 * The body text between a clause head's `{` and its matching `}`. Braces are counted over the
 * MASKED copy — a `}` inside a comment is prose, not a brace — and the slice is taken from the
 * original, because the body's comments are exactly what the rule grades.
 */
function bodyOf(text, masked, openIndex) {
  let depth = 1;
  for (let i = openIndex + 1; i < masked.length; i++) {
    if (masked[i] === "{") depth++;
    else if (masked[i] === "}" && --depth === 0) return text.slice(openIndex + 1, i);
  }
  return null; // unbalanced — the parse, not the code, is wrong; leave it to tsc
}

/** Strip comments out of a body, returning the code that remains and the prose that was there. */
function split(body) {
  const prose = [];
  const code = body
    .replace(/\/\*[\s\S]*?\*\//g, (m) => {
      prose.push(m.slice(2, -2));
      return " ";
    })
    .replace(/\/\/[^\n]*/g, (m) => {
      prose.push(m.slice(2));
      return " ";
    });
  return { code: code.trim(), prose: prose.join(" ") };
}

/** Does the prose say anything? A single non-explanation word does not. */
function explains(prose) {
  const words = prose
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return false;
  return !(words.length === 1 && NON_EXPLANATIONS.has(words[0]));
}

function census(files, head = CATCH_HEAD) {
  const swallows = [];
  for (const file of files) {
    const text = typeof file === "string" ? fs.readFileSync(file, "utf8") : file.text;
    const label = typeof file === "string" ? path.relative(ROOT, file) : file.label;
    const masked = maskComments(text);
    head.lastIndex = 0;
    let m;
    while ((m = head.exec(masked))) {
      const open = m.index + m[0].length - 1;
      const body = bodyOf(text, masked, open);
      if (body === null) continue;
      const { code, prose } = split(body);
      if (code === "" && !explains(prose))
        swallows.push({
          file: label,
          line: text.slice(0, m.index).split("\n").length,
          body: prose.trim() || "(empty)",
        });
    }
  }
  return swallows;
}

/**
 * The controls. Two must RED (one per clause grammar) and one must stay GREEN (the over-reach
 * arm). The arrow control carries the ablation with it: the frozen pre-W6 head is run on the
 * same string and must see NOTHING, which is what makes this row a proof rather than a claim.
 */
const CONTROLS = [
  {
    name: "statement form  `catch { /* ignore */ }`",
    text: "try { a(); } catch { /* ignore */ }",
    want: 1,
  },
  {
    name: "arrow form      `.catch(() => {})`",
    text: "warm().catch(() => {});",
    want: 1,
    legacyBlind: true, // the pre-W6 head must see 0 — the miss this row cures
  },
  {
    name: "quoted in prose `/** … .catch(() => {}) … */`",
    text: "/** the shape T6 cured: `.catch(() => {})`, wordless. */\nwarm();",
    want: 0,
  },
];

function selfTest() {
  let ok = true;
  console.log("\nnegative controls:");
  for (const c of CONTROLS) {
    const got = census([{ label: "<control>", text: c.text }]).length;
    let note =
      got === c.want ? (c.want ? "RED as required" : "GREEN as required") : "FAILED";
    if (c.legacyBlind) {
      const legacy = census(
        [{ label: "<control>", text: c.text }],
        LEGACY_CATCH_HEAD,
      ).length;
      if (legacy !== 0) {
        note =
          "FAILED — the control is not discriminating; the pre-W6 head sees it too";
      } else if (got === c.want) {
        note += "; the pre-W6 head saw 0 — the structural miss this cures";
      }
      ok &&= legacy === 0;
    }
    ok &&= got === c.want;
    console.log(`  ${c.name}  →  ${got} swallow(s), ${note}`);
  }
  return ok;
}

function main() {
  const files = walk(SRC);
  const swallows = census(files);

  console.log(`catch clauses scanned across ${files.length} src files`);
  console.log(`swallows (no statement, no explanation): ${swallows.length}`);
  for (const s of swallows) console.log(`  ${s.file}:${s.line}  /* ${s.body} */`);

  if (process.argv.includes("--self-test") && !selfTest()) process.exit(2);

  if (swallows.length) {
    console.error(`\ncheck-empty-catch: ${swallows.length} swallowed catch bodies`);
    process.exit(1);
  }
  console.log("\ncheck-empty-catch: 0 swallowed catch bodies");
}

main();
