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
 *
 * THE LADDER'S REGISTRATION IS STATIC AND COMPLETE (T9-W7 §7, the @property law's first clause).
 * Every rung of `MOTION.rungs` (pencilConfig.ts, the one home) is read BARE by its consumers and
 * falls to `initial-value: 0ms` when the publisher is absent — only if `index.css` registers it.
 * A deleted block or one nested in a rule (where the at-rule is invalid) leaves that rung
 * unregistered, and nothing else reds: the verb silently loses its declared failure mode. So
 * each rung must have exactly one `@property --motion-<rung>` at brace depth 0, `syntax:
 * "<time>"`, `inherits: true`, `initial-value: 0ms`, and no other `--motion-*` is registered.
 * `--self-test` deletes `--motion-whisper`'s block and nests all seven in `:root {}`; each must
 * red. Uniqueness across homes and script emitters are the fold's `check-property-block`'s.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.join(import.meta.dirname, "..", "..");
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

/**
 * Comments out, strings kept. A `/*` inside a quoted string never opens a comment (a CSS
 * `content: "/*"` before a real rule ate the rule under the old regex); in script, `//` opens one
 * too and backticks quote. The SHAPE law's string-aware stripper (the chair's
 * `pass7/instruments/shape-census.mjs` `stripCss`/`stripJs`), inlined because a product gate does
 * not import from the evidence tree; the self-test below plants the string case.
 */
function stripComments(text, script = false) {
  const c = text.replace(/\/\*[\s\S]*?\*\//g, "");
  return script ? c.replace(/(^|[^:])\/\/[^\n]*/g, "$1") : c;
}

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
  for (let changed = true; changed;) {
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

const PENCIL_CONFIG = path.join(ROOT, "src", "pencil", "config", "pencilConfig.ts");

/** The rung keys, read off `MOTION.rungs`' own block (comments stripped). */
export function rungKeys(tsText) {
  const code = tsText.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  const open = code.search(/\brungs:\s*\{/);
  if (open < 0) throw new Error("check-theme-tokens: no `rungs: {` in pencilConfig.ts");
  const body = code.slice(code.indexOf("{", open) + 1, code.indexOf("}", open));
  return [...body.matchAll(/(\w+)\s*:\s*\d+/g)].map((m) => m[1]);
}

/** Every `@property --motion-*` in `cssText`, with its brace depth and descriptors. */
function motionRegistrations(cssText, file = "src/assets/index.css") {
  const css = stripComments(cssText);
  const out = [];
  let depth = 0;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === "@" && css.startsWith("@property", i)) {
      const m = /^@property\s+(--[\w-]+)\s*\{([^}]*)\}/.exec(css.slice(i));
      if (!m || !m[1].startsWith("--motion-")) continue;
      const desc = Object.fromEntries(
        [...m[2].matchAll(/([\w-]+)\s*:\s*([^;]+);?/g)].map((d) => [d[1], d[2].trim()]),
      );
      out.push({ name: m[1], depth, desc, file });
      i += m[0].length - 1;
    }
  }
  return out;
}

/**
 * EVERY OTHER STYLESHEET, AND EVERY SCRIPT THAT COULD EMIT ONE (T9-W7 §7, pass 7). The row read
 * `index.css` alone, so a second `@property --motion-whisper { inherits: false }` in
 * `typography.css` passed it (pass-6 critique §1A). A registration can reach the page from any
 * of: a `.css` under `src/` or `public/`, EVERY `<style>` block of an SFC (a second block too),
 * `index.html`, or a script (`CSS.registerProperty`, or `@property` text a script appends). Each
 * is returned as a sheet `{ file, css }`; a script's text counts when it names both the at-rule
 * or the API and a `--motion-` name (comments stripped; test files are not the product).
 */
export function otherSheets(root = ROOT) {
  const out = [];
  const walk = (dir, keep) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, keep);
      else if (keep(e.name)) out.push(p);
    }
  };
  walk(path.join(root, "src"), (n) => /\.(css|vue|ts|tsx|js|mjs)$/.test(n));
  walk(path.join(root, "public"), (n) => /\.(css|html)$/.test(n));
  out.push(path.join(root, "index.html"));
  return out
    .filter((p) => p !== INDEX_CSS && !/\.(test|spec)\.[jt]sx?$/.test(p) && fs.existsSync(p))
    .flatMap((p) => sheetsOf(path.relative(root, p), fs.readFileSync(p, "utf8")));
}

/** The sheets ONE file contributes (the reader the walk and every plant share, so a plant proves
 *  the extraction, not only the rule): a `.css` whole, each `<style>` block of an SFC or an HTML
 *  file, and a script that names the at-rule or the API beside a `--motion-` name. */
export function sheetsOf(file, text) {
  const sheets = [];
  if (file.endsWith(".css")) sheets.push({ file, css: text });
  else if (/\.(vue|html)$/.test(file))
    for (const m of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) sheets.push({ file, css: m[1] });
  if (/\.(vue|ts|tsx|js|mjs)$/.test(file)) {
    const src = file.endsWith(".vue")
      ? [...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n")
      : text;
    const code = stripComments(src, true);
    if (/(@property|registerProperty)[\s\S]{0,240}--motion-|--motion-[\s\S]{0,240}registerProperty/.test(code))
      sheets.push({ file, css: "", script: true });
  }
  return sheets;
}

export function registrationRow(cssText, rungs, others = otherSheets()) {
  const regs = [
    ...motionRegistrations(cssText),
    ...others.flatMap((o) => motionRegistrations(o.css, o.file)),
  ];
  const red = others
    .filter((o) => o.script)
    .map((o) => `${o.file} registers a --motion-* rung from script (the ladder has one static home)`);
  for (const rung of rungs) {
    const name = `--motion-${rung}`;
    const mine = regs.filter((r) => r.name === name);
    if (mine.length !== 1) {
      red.push(
        `${name} registered ${mine.length}× (want exactly 1)` +
          (mine.length ? ` in ${mine.map((r) => r.file).join(", ")}` : ""),
      );
      continue;
    }
    const { depth, desc, file } = mine[0];
    if (file !== "src/assets/index.css")
      red.push(`${name} registered in ${file}, not the ladder's home src/assets/index.css`);
    if (depth !== 0)
      red.push(`${name} registered at brace depth ${depth}, not file scope`);
    if (desc.syntax !== '"<time>"') red.push(`${name} syntax ${desc.syntax}`);
    if (desc.inherits !== "true") red.push(`${name} inherits ${desc.inherits}`);
    if (desc["initial-value"] !== "0ms")
      red.push(`${name} initial-value ${desc["initial-value"]}`);
  }
  for (const r of regs)
    if (!rungs.includes(r.name.slice("--motion-".length)))
      red.push(`${r.name} registered in ${r.file} but no rung of MOTION.rungs`);
  return red;
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

  const rungs = rungKeys(fs.readFileSync(PENCIL_CONFIG, "utf8"));
  const regRed = registrationRow(cssText, rungs);
  console.log(
    `\nladder registration: ${rungs.length} rungs, ${regRed.length} breaches`,
  );
  for (const r of regRed) console.log(`  ${r}`);

  if (selfTest) {
    // NEGATIVE CONTROLS for the registration row: a deletion and a nest, each must red.
    // Keyed on the rule's SHAPE, not on this file's layout: every `@property --motion-*` block,
    // wherever it sits, so the plant holds on any tree that carries the ladder.
    const REG = /@property\s+--motion-[\w-]+\s*\{[^}]*\}/g;
    const deleted = cssText.replace(/@property\s+--motion-whisper\s*\{[^}]*\}/, "");
    const nested = cssText.replace(REG, (m) => `:root {\n${m}\n}`);
    // Pass 7: a registration at every OTHER site a sheet reaches the page from. Each is the
    // live sheet set plus ONE planted sheet, so the tree's own sheets stay in every plant.
    // Each plant is the REAL file's text with the plant appended, read through `sheetsOf` (the
    // walk's own reader), so a plant that the extraction cannot see stays green here too.
    const others = otherSheets();
    const dup = '@property --motion-whisper { syntax: "<time>"; inherits: false; initial-value: 0ms; }';
    const real = (f) => (fs.existsSync(path.join(ROOT, f)) ? fs.readFileSync(path.join(ROOT, f), "utf8") : "");
    const plus = (file, tail) => [
      ...others.filter((o) => o.file !== file),
      ...sheetsOf(file, real(file) + "\n" + tail),
    ];
    const plants = [
      ["delete --motion-whisper's block", deleted],
      [`nest every rung in :root {} (${(cssText.match(REG) ?? []).length})`, nested],
      ["a second registration in typography.css", cssText, plus("src/assets/typography.css", dup)],
      ["one in a SECOND <style> block of an SFC", cssText, plus("src/pencil/chrome/MarginNote.vue", `<style>\n${dup}\n</style>`)],
      ["one in index.html", cssText, plus("index.html", `<style>${dup}</style>`)],
      ["one in public/", cssText, plus("public/x.css", dup)],
      ["a script emitter", cssText, plus("src/main.ts", 'CSS.registerProperty({ name: "--motion-whisper", syntax: "<time>", inherits: false, initialValue: "0ms" });')],
      ["a stray rung in another sheet", cssText, plus("src/games/shared/scene.css", dup.replace("whisper", "erase"))],
      ["one after a CSS string holding /*", cssText, plus("src/assets/typography.css", `.x::before { content: "/*"; }\n${dup}\n/* */`)],
      ["the home's own copy after a CSS string holding /*", `${cssText}\n.x::before { content: "/*"; }\n${dup}\n/* */`],
    ];
    for (const [label, text, sheets] of plants) {
      const caught =
        (text !== cssText || !!sheets) && registrationRow(text, rungs, sheets).length > 0;
      console.log(
        `negative control (${label}): ${caught ? "RED as required" : "FAILED — the row did not catch it"}`,
      );
      }

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

  if (dead.length || regRed.length) {
    console.error(
      `\ncheck-theme-tokens: ${dead.length} unreferenced @theme tokens, ${regRed.length} registration breaches`,
    );
    process.exit(1);
  }
  console.log("\ncheck-theme-tokens: 0 unreferenced @theme tokens");
}

main();
