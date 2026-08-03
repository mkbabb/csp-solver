#!/usr/bin/env node
/**
 * THE COPY REGISTER (T8-W6, M16) — no em dash reaches a reader, ever.
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
 * `--self-test` mints both colours: an injected template dash and an injected literal dash must
 * each turn the census RED, and the same dash inside a comment must not. A gate that cannot be
 * shown failing is not a gate.
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

const blank = (s, re) => s.replace(re, (m) => m.replace(/[^\n]/g, " "));
/** Comments and `<style>` blocks out, indices preserved. */
function mask(src) {
  let s = blank(src, /<!--[\s\S]*?-->/g);
  s = blank(s, /<style[\s\S]*?<\/style>/g);
  s = blank(s, /\/\*[\s\S]*?\*\//g);
  return blank(s, /(^|[^:])\/\/.*$/gm);
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
  for (const abs of files) {
    const rel = path.relative(ROOT, abs);
    if (ALLOW.has(rel)) continue;
    for (const h of census(rel, fs.readFileSync(abs, "utf8")))
      offences.push({ file: rel, ...h });
  }
  return { files, offences };
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
];

function selfTest() {
  let ok = true;
  console.log("\nself-test (both colours):");
  for (const c of CONTROLS) {
    const got = census(c.rel, c.src).length;
    ok &&= got === c.want;
    const verdict =
      got === c.want ? (c.want ? "RED as required" : "GREEN as required") : "FAILED";
    console.log(`  ${c.name}  →  ${got} offence(s), ${verdict}`);
  }
  return ok;
}

const { files, offences } = scan();
console.log(`copy register scanned across ${files.length} files`);
console.log(`allowlisted: ${[...ALLOW].map(([f, r]) => `${f} (${r})`).join(", ")}`);
console.log(`em/en dashes in product copy: ${offences.length}`);
for (const o of offences) console.log(`  ${o.file}:${o.line}  [${o.kind}]  ${o.text}`);

const testing = process.argv.includes("--self-test");
if (testing && !selfTest()) process.exit(2);
if (offences.length) {
  console.error(
    `\ncheck-copy-register: ${offences.length} em/en dash(es) in product copy`,
  );
  process.exit(1);
}
console.log("\ncheck-copy-register: 0 em/en dashes in product copy");
