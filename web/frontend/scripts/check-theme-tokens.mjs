#!/usr/bin/env node
/**
 * THE THEME-TOKEN CENSUS (T5-W2 2.3a) — every `@theme` custom property must have a consumer.
 *
 * A design token nobody reads is not a palette, it's a decoy: the next hand to pick a colour
 * reads `--color-primary` off the theme block, uses it, and inherits shadcn's default greys in
 * a crayon estate. This script asserts the `@theme` block's declared surface equals its
 * consumed surface — 0 unreferenced — and prints the unreferenced ones by name when it fails.
 *
 * WHAT COUNTS AS A REFERENCE (the corpus is `src/**` minus this file, `e2e/**`, `index.html`):
 *   1. `var(--tok)` / `var(--tok, fallback)` anywhere in the corpus.
 *   2. A Tailwind v4 utility minted from the token's NAMESPACE — `--color-X` mints `bg-X`,
 *      `text-X`, `border-X` and the rest of the colour utilities; `--font-X` mints `font-X`;
 *      `--ease-X` mints `ease-X`. Namespaces Tailwind does not read from (`--sheet-*`,
 *      `--ink-press-*`, `--paper-*`, `--grid-*`, bare `--radius`) mint nothing, so var() is
 *      their only form.
 *   3. TRANSITIVE, inside `index.css` itself: a token read by a LIVE token is live. This arm is
 *      stronger than the wave-open instrument (which counted the corpus alone) and exists so an
 *      alias chain — `--color-easy: var(--color-crayon-green)` — cannot kill its own base. Both
 *      figures are printed; they must agree, and where they do not the transitive one rules.
 *
 * `--self-test` mints a negative control: re-declaring a known-dead token must turn the census
 * RED. A census that cannot be shown failing is not a gate.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.join(import.meta.dirname, "..");
const INDEX_CSS = path.join(ROOT, "src", "assets", "index.css");

/** Tailwind v4 utility namespaces that mint class names off a token prefix. */
const UTILITY_NAMESPACES = {
  "--color-": [
    "bg",
    "text",
    "border",
    "ring",
    "inset-ring",
    "shadow",
    "inset-shadow",
    "from",
    "via",
    "to",
    "fill",
    "stroke",
    "outline",
    "decoration",
    "accent",
    "caret",
    "divide",
    "placeholder",
  ],
  "--font-": ["font"],
  "--ease-": ["ease"],
  "--radius-": ["rounded"],
  "--spacing-": ["p", "m", "gap", "w", "h", "size"],
  "--text-": ["text"],
  "--tracking-": ["tracking"],
  "--leading-": ["leading"],
  "--breakpoint-": [],
};

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** The `@theme` block's body, brace-balanced. */
function themeBody(css) {
  const open = css.indexOf("@theme");
  if (open < 0) throw new Error("check-theme-tokens: no @theme block in index.css");
  let i = css.indexOf("{", open);
  let depth = 0;
  const start = i + 1;
  for (; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(start, i);
    }
  }
  throw new Error("check-theme-tokens: unbalanced @theme block");
}

/** Declaration names at the block's own depth — `--tok:` with no enclosing brace. */
function declaredIn(body) {
  const names = [];
  let depth = 0;
  for (const m of body.matchAll(/\{|\}|(--[a-zA-Z0-9-]+)\s*:/g)) {
    if (m[0] === "{") depth++;
    else if (m[0] === "}") depth--;
    else if (depth === 0) names.push(m[1]);
  }
  return [...new Set(names)];
}

function corpusFiles() {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (["node_modules", "dist", "coverage"].includes(entry.name)) continue;
        walk(full);
      } else if (full !== INDEX_CSS) {
        files.push(full);
      }
    }
  };
  walk(path.join(ROOT, "src"));
  const e2e = path.join(ROOT, "e2e");
  if (fs.existsSync(e2e)) walk(e2e);
  const html = path.join(ROOT, "index.html");
  if (fs.existsSync(html)) files.push(html);
  return files;
}

/** `bg-primary` matches; `text-muted-foreground` must NOT match `muted`. */
const utilityForms = (token) => {
  const forms = [];
  for (const [prefix, utils] of Object.entries(UTILITY_NAMESPACES)) {
    if (!token.startsWith(prefix)) continue;
    const stem = token.slice(prefix.length);
    for (const util of utils) forms.push(`${util}-${stem}`);
  }
  return forms;
};

const referencedBy = (text, token) => {
  if (text.includes(`var(${token})`) || text.includes(`var(${token},`)) return true;
  // The quoted form — `getPropertyValue("--color-crayon-green")`, the e2e contrast probes.
  if (text.includes(`"${token}"`) || text.includes(`'${token}'`)) return true;
  for (const form of utilityForms(token)) {
    const re = new RegExp(`(^|[^\\w-])${form}(?![\\w-])`);
    if (re.test(text)) return true;
  }
  return false;
};

export function census(cssText) {
  const css = stripComments(cssText);
  const declared = declaredIn(themeBody(css));
  const corpus = corpusFiles()
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("\n");

  // index.css's OWN rules are corpus too — `body { background-image: var(--paper-clean-texture) }`
  // is a consumer. Its custom-property DECLARATIONS are not: a dead token's value must not keep
  // its base alive, so every `--tok: …;` is stripped before the file joins the corpus.
  const internal = css.replace(/--[a-zA-Z0-9-]+\s*:[\s\S]*?;/g, " ");
  const directLive = new Set(
    declared.filter((t) => referencedBy(corpus, t) || referencedBy(internal, t)),
  );

  // Transitive arm: a token read by a LIVE token's value is itself live. Iterate to a fixed
  // point so an alias chain — `--color-easy: var(--color-crayon-green)` — resolves whole.
  const live = new Set(directLive);
  const declBodies = (token) =>
    [...css.matchAll(new RegExp(`${token}\\s*:([\\s\\S]*?);`, "g"))]
      .map((m) => m[1])
      .join(" ");
  for (let changed = true; changed; ) {
    changed = false;
    for (const token of [...live]) {
      const body = declBodies(token);
      for (const other of declared) {
        if (live.has(other)) continue;
        if (body.includes(`var(${other})`) || body.includes(`var(${other},`)) {
          live.add(other);
          changed = true;
        }
      }
    }
  }

  return {
    declared,
    directDead: declared.filter((t) => !directLive.has(t)),
    dead: declared.filter((t) => !live.has(t)),
  };
}

function main() {
  const selfTest = process.argv.includes("--self-test");
  const cssText = fs.readFileSync(INDEX_CSS, "utf8");
  const { declared, directDead, dead } = census(cssText);

  console.log(`@theme declared: ${declared.length}`);
  console.log(`unreferenced (corpus only):     ${directDead.length}`);
  console.log(`unreferenced (transitive rule): ${dead.length}`);
  if (dead.length) {
    console.log("\nDEAD TOKENS:");
    for (const t of dead) console.log(`  ${t}`);
  }
  const strays = directDead.filter((t) => !dead.includes(t));
  if (strays.length) {
    console.log("\nALIAS-ONLY (live through a live token, kept):");
    for (const t of strays) console.log(`  ${t}`);
  }

  if (selfTest) {
    // NEGATIVE CONTROL: re-add a known shadcn default and the census must go RED.
    const patched = cssText.replace(
      /(@theme\s*\{)/,
      "$1\n  --color-input: hsl(48 5% 89.8%);",
    );
    const probe = census(patched);
    const caught = probe.dead.includes("--color-input");
    console.log(
      `\nnegative control (re-add --color-input): ${caught ? "RED as required" : "FAILED — the census did not catch it"}`,
    );
    if (!caught) process.exit(2);
  }

  if (dead.length) {
    console.error(`\ncheck-theme-tokens: ${dead.length} unreferenced @theme tokens`);
    process.exit(1);
  }
  console.log("\ncheck-theme-tokens: 0 unreferenced @theme tokens");
}

main();
