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
 * `--self-test` mints a negative control: an injected `catch { /* ignore *\/ }` must turn the
 * census RED. A census that cannot be shown failing is not a gate.
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

/** `catch {` / `catch (e) {` — the clause head, wherever it appears (.ts and .vue templates). */
const CATCH_HEAD = /\bcatch\s*(?:\([^)]*\)\s*)?\{/g;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|vue)$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** The body text between a clause head's `{` and its matching `}`. */
function bodyOf(text, openIndex) {
  let depth = 1;
  for (let i = openIndex + 1; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return text.slice(openIndex + 1, i);
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

function census(files) {
  const swallows = [];
  for (const file of files) {
    const text = typeof file === "string" ? fs.readFileSync(file, "utf8") : file.text;
    const label = typeof file === "string" ? path.relative(ROOT, file) : file.label;
    CATCH_HEAD.lastIndex = 0;
    let m;
    while ((m = CATCH_HEAD.exec(text))) {
      const open = m.index + m[0].length - 1;
      const body = bodyOf(text, open);
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

function main() {
  const files = walk(SRC);
  const swallows = census(files);

  console.log(`catch clauses scanned across ${files.length} src files`);
  console.log(`swallows (no statement, no explanation): ${swallows.length}`);
  for (const s of swallows) console.log(`  ${s.file}:${s.line}  /* ${s.body} */`);

  if (process.argv.includes("--self-test")) {
    const injected = census([
      { label: "<negative control>", text: "try { a(); } catch { /* ignore */ }" },
    ]);
    const caught = injected.length === 1;
    console.log(
      `\nnegative control (inject one \`catch { /* ignore */ }\`): ${
        caught ? "RED as required" : "FAILED — the census did not catch it"
      }`,
    );
    if (!caught) process.exit(2);
  }

  if (swallows.length) {
    console.error(`\ncheck-empty-catch: ${swallows.length} swallowed catch bodies`);
    process.exit(1);
  }
  console.log("\ncheck-empty-catch: 0 swallowed catch bodies");
}

main();
