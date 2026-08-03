#!/usr/bin/env node
/**
 * THE NEVER-WRITTEN-SELECTOR CENSUS (T7-W1 gate 1.1).
 *
 * A CSS rule keyed off an attribute nobody writes is not a cure, it's a decoy: it reads like
 * the theme is handled, it ships in the built CSS, and it never matches. `CageOverlay.vue` and
 * `ThermoTube.vue` carried `:root[data-theme="light"]` / `:root[data-theme="dark"]` blocks for
 * a whole campaign while `useTheme.ts` wrote `class="dark"` — the ruling landed, its enforcing
 * writer never did, and every gate in the estate read green. knip resolves modules, not
 * selectors, so nothing here watched this surface.
 *
 * Three checks, all evaluated before the verdict:
 *
 *   1  UNWRITTEN ATTRIBUTES  every `[data-…]` attribute selector in `src/**` style scope has a
 *                            RUNTIME WRITER somewhere in `src/**` (or index.html), or an
 *                            ALLOWLIST entry with a reason.
 *   2  UNHONORED MEDIA       every `prefers-color-scheme` block in `src/**` style scope is
 *                            allowlisted with a reason. There is no writer form for an OS media
 *                            query: the app's theme state is a class a human can override, so a
 *                            CSS-level `prefers-color-scheme` rule is a second, disagreeing
 *                            source of truth by construction. Wanting one is fine — saying so
 *                            in the table is the price.
 *   3  ALLOWLIST CLOSED      the table is a closed set. An entry that matches no site on disk,
 *                            an entry whose attribute has SINCE gained a writer, and an entry
 *                            without a usable reason all red — the record follows the code in
 *                            the same commit.
 *
 * `--dist [dir]` adds a fourth arm over `<dir>/assets/*.css` (default `dist`): the acceptance
 * clause is that no unwritten selector survives the BUILD, and src scope alone can't say that.
 * It REFUSES to run without a dist rather than degrading to a green. The dir argument is
 * `test:prod-shake`'s idiom — CI can point it at a build a prior job already produced.
 *
 * `--self-test` runs every check against fixture trees — negative controls that must go RED and
 * positive controls that must stay GREEN. A gate that cannot be shown failing is not a gate;
 * one that reds on everything is not one either.
 *
 * Run: `node scripts/check-theme-selectors.mjs [--dist [dir]] [--self-test]`, cwd web/frontend.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.join(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");

/* ── the allowlist ─────────────────────────────────────────────────────────────
 * Hand-maintained ON PURPOSE. Every other figure in this script is derived from the tree;
 * this table is the part a human has to mean. `selector` is the attribute name (`data-theme`)
 * or the literal `prefers-color-scheme`; `file` is the frontend-relative path.
 *
 * EMPTY at T7-W1's cure, and that is the whole point: the two blocks this gate was born RED on
 * are deleted, not excused.
 */
/** @type {{file: string, selector: string, why: string}[]} */
const ALLOWLIST = [];

/** Minimum reason length. An allowlist entry without a cite is a hole with paperwork. */
const WHY_FLOOR = 40;

/**
 * Attribute prefixes whose writer is the toolchain, not the app. Kept tiny and reasoned —
 * every entry here is a hole in check 1.
 */
const IGNORED_ATTR_PREFIXES = [
  {
    prefix: "data-v-",
    why:
      "Vue's SFC compiler stamps the scope id onto both the selector and the element in the " +
      "same compilation — the writer is the toolchain and cannot drift from the rule.",
  },
];

/* ── masking: offsets preserved, so every finding carries a real file:line ──── */

/** Same-length blank, newlines kept, so a masked region never moves a line number. */
const blank = (s) => s.replace(/[^\n]/g, " ");

const stripCssComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, blank);

/** `//` line comments and `/* *\/` blocks. The `:` guard keeps `https://…` intact. */
const stripJsComments = (text) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, lead) =>
      lead === undefined ? blank(m) : lead + blank(m.slice(lead.length)),
    );

const isStyleFile = (file) => file.endsWith(".css") || file.endsWith(".vue");

/** The regions a SELECTOR can live in: a .css file whole, a .vue file's `<style>` bodies. */
function styleMask(file, text) {
  if (file.endsWith(".css")) return stripCssComments(text);
  if (!file.endsWith(".vue")) return blank(text);
  let out = blank(text);
  for (const m of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const start = m.index + m[0].indexOf(m[1]);
    out = out.slice(0, start) + m[1] + out.slice(start + m[1].length);
  }
  return stripCssComments(out);
}

/** The regions a WRITER can live in: everything a .vue file is NOT styling, plus code/html. */
function writerMask(file, text) {
  if (file.endsWith(".css")) return blank(text);
  if (file.endsWith(".vue")) {
    let out = text;
    for (const m of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
      const start = m.index + m[0].indexOf(m[1]);
      out = out.slice(0, start) + blank(m[1]) + out.slice(start + m[1].length);
    }
    return stripJsComments(out);
  }
  return stripJsComments(text);
}

const at = (text, index) => {
  const before = text.slice(0, index);
  const line = before.split("\n").length;
  return { line, col: index - (before.lastIndexOf("\n") + 1) + 1 };
};

const around = (text, index, span = 72) =>
  text
    .slice(index, index + span)
    .split("\n")[0]
    .trim();

/* ── the writer forms ──────────────────────────────────────────────────────── */

const camel = (attr) =>
  attr.replace(/^data-/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/**
 * What counts as writing `attr` at runtime. Deliberately generous — a false GREEN here is the
 * defect this gate exists for, so each form is one the estate could plausibly ship, and nothing
 * looser. `removeAttribute` is absent on purpose: erasing an attribute never sets it.
 */
function writerForms(attr) {
  const q = `["'\`]`;
  return [
    ["setAttribute", new RegExp(`setAttribute\\(\\s*${q}${attr}${q}`)],
    ["toggleAttribute", new RegExp(`toggleAttribute\\(\\s*${q}${attr}${q}`)],
    ["dataset assignment", new RegExp(`\\.dataset\\.${camel(attr)}\\s*=(?!=)`)],
    // vueuse's useDark/useColorMode write through `attribute:` — no setAttribute in sight.
    ["vueuse attribute option", new RegExp(`attribute\\s*:\\s*${q}${attr}${q}`)],
    // A template/markup binding: `data-theme="…"`, `:data-theme="…"`, `v-bind:data-theme="…"`.
    ["markup binding", new RegExp(`(?:^|\\s)(?::|v-bind:)?${attr}\\s*=\\s*["']`, "m")],
  ];
}

/* ── the model ─────────────────────────────────────────────────────────────── */

const ignoredAttr = (attr) =>
  IGNORED_ATTR_PREFIXES.some((i) => attr.startsWith(i.prefix));

/** Every attribute-selector and `prefers-color-scheme` site in one file's style scope. */
function sitesIn(file, styleText) {
  const sites = [];
  for (const m of styleText.matchAll(/\[\s*(data-[A-Za-z0-9_-]+)/g)) {
    if (ignoredAttr(m[1])) continue;
    sites.push({
      file,
      kind: "attr",
      key: m[1],
      ...at(styleText, m.index),
      snippet: around(styleText, m.index),
    });
  }
  for (const m of styleText.matchAll(/prefers-color-scheme/g)) {
    const open = styleText.lastIndexOf("@media", m.index);
    const start = open >= 0 && m.index - open < 200 ? open : m.index;
    sites.push({
      file,
      kind: "media",
      key: "prefers-color-scheme",
      ...at(styleText, start),
      snippet: around(styleText, start),
    });
  }
  return sites;
}

/**
 * @param {{file: string, text: string}[]} files frontend-relative paths
 * @param {typeof ALLOWLIST} allowlist
 */
export function buildModel(files, allowlist) {
  const sites = [];
  const writerCorpus = [];
  for (const { file, text } of files) {
    if (isStyleFile(file)) sites.push(...sitesIn(file, styleMask(file, text)));
    writerCorpus.push({ file, text: writerMask(file, text) });
  }
  /** attr -> [{file, line, form}] */
  const writers = new Map();
  for (const attr of new Set(
    sites.filter((s) => s.kind === "attr").map((s) => s.key),
  )) {
    const found = [];
    for (const [form, re] of writerForms(attr))
      for (const { file, text } of writerCorpus) {
        const m = re.exec(text);
        if (m) found.push({ file, form, ...at(text, m.index) });
      }
    writers.set(attr, found);
  }
  return { files, sites, writers, allowlist };
}

const allowFor = (allowlist, site) =>
  allowlist.find((a) => a.file === site.file && a.selector === site.key);

/* ── the checks ────────────────────────────────────────────────────────────── */

function check1UnwrittenAttributes({ sites, writers, allowlist }) {
  const bad = [];
  for (const site of sites.filter((s) => s.kind === "attr")) {
    if (writers.get(site.key)?.length) continue;
    if (allowFor(allowlist, site)) continue;
    bad.push(
      `${site.file}:${site.line}:${site.col}  \`${site.snippet}\`\n` +
        `    NOTHING in src writes \`${site.key}\`. This rule can never match — it ships in ` +
        `the built CSS and paints nothing. Land the writer (setAttribute / dataset / vueuse ` +
        `\`attribute:\`), re-key the rule to what the app actually sets, or add an ALLOWLIST ` +
        `entry with the reason.`,
    );
  }
  return bad;
}

function check2UnhonoredMedia({ sites, allowlist }) {
  const bad = [];
  for (const site of sites.filter((s) => s.kind === "media")) {
    if (allowFor(allowlist, site)) continue;
    bad.push(
      `${site.file}:${site.line}:${site.col}  \`${site.snippet}\`\n` +
        `    The app's theme state is a class the user can override, so this block disagrees ` +
        `with the toggle in two of the four OS×app quadrants and there is no attribute to ` +
        `write that would reconcile them. Re-key it to the class, or allowlist it with the ` +
        `reason the OS preference — not the toggle — rules this surface.`,
    );
  }
  return bad;
}

function check3AllowlistClosed({ sites, writers, allowlist }) {
  const bad = [];
  for (const entry of allowlist) {
    const matched = sites.filter(
      (s) => s.file === entry.file && s.key === entry.selector,
    );
    if (!matched.length) {
      bad.push(
        `ALLOWLIST[${entry.file} · ${entry.selector}] matches no site on disk — stale entry, ` +
          `delete it in the commit that removed the selector.`,
      );
      continue;
    }
    const wrote = writers.get(entry.selector) ?? [];
    if (wrote.length)
      bad.push(
        `ALLOWLIST[${entry.file} · ${entry.selector}] excuses an attribute that NOW has a ` +
          `writer (${wrote[0].file}:${wrote[0].line}, ${wrote[0].form}). The excuse outlived ` +
          `its reason: delete the entry.`,
      );
    if (!entry.why || entry.why.length < WHY_FLOOR)
      bad.push(
        `ALLOWLIST[${entry.file} · ${entry.selector}] carries no usable reason — an ` +
          `allowlisted dead selector without a cite is the defect wearing a badge.`,
      );
  }
  return bad;
}

const CHECKS = [
  ["1 UNWRITTEN ATTRIBUTES", check1UnwrittenAttributes],
  ["2 UNHONORED MEDIA", check2UnhonoredMedia],
  ["3 ALLOWLIST CLOSED", check3AllowlistClosed],
];

/* ── the dist arm (opt-in, never degrades to green) ────────────────────────── */

function check4BuiltCss(allowlist, distDir) {
  const assets = path.resolve(ROOT, distDir, "assets");
  if (!fs.existsSync(assets))
    throw new Error(
      `--dist: no ${distDir}/assets/. This arm asserts the acceptance clause about the BUILT ` +
        `CSS and refuses to pass without the input. Run \`npm run build\` first, or name the ` +
        `dist a prior job already produced (\`--dist dist-throttle\`).`,
    );
  const bad = [];
  const files = fs
    .readdirSync(assets)
    .filter((f) => f.endsWith(".css"))
    .sort();
  for (const f of files) {
    const rel = path.join(distDir, "assets", f);
    const text = stripCssComments(fs.readFileSync(path.join(assets, f), "utf8"));
    // Chunk names are content-hashed, so the dist arm matches the allowlist by selector
    // alone — it is a backstop on the build, not a second closure on the table.
    for (const site of sitesIn(rel, text)) {
      if (allowlist.some((a) => a.selector === site.key)) continue;
      bad.push(
        `${site.file}:${site.line}:${site.col}  \`${site.snippet.slice(0, 60)}\`\n` +
          `    Survived the build. src scope may already be clean — a stale chunk, a vendored ` +
          `stylesheet, or an unrebuilt dist all land exactly here.`,
      );
    }
  }
  return { bad, files: files.length };
}

/* ── self-test: every check shown able to fail, and able to pass ───────────── */

const F = {
  deadAttr: {
    file: "src/games/shared/CageOverlay.vue",
    text: `<template><g class="cage" /></template>
<style>
:root[data-theme="dark"] .cage-boundary { stroke: rgba(198, 204, 214, 0.42); }
</style>`,
  },
  writerTs: {
    file: "src/composables/useTheme.ts",
    text: `document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");`,
  },
  writerVueuse: {
    file: "src/composables/useTheme.ts",
    text: `useDark({ selector: "html", attribute: "data-theme", valueDark: "dark" });`,
  },
  classWriter: {
    file: "src/composables/useTheme.ts",
    text: `useDark({ selector: "html", attribute: "class", valueDark: "dark" });`,
  },
  media: {
    file: "src/games/thermo/ThermoTube.vue",
    text: `<style>
@media (prefers-color-scheme: dark) { .thermo-bulb { fill: #c6ccd6; } }
</style>`,
  },
  commentedWriter: {
    file: "src/pencil/glyph/glyphAnimations.ts",
    text: `// once upon a time this did setAttribute("data-theme", mode) — it does not now
pathEl.setAttribute("d", baseD);`,
  },
  scopeId: {
    file: "src/games/shared/gameCell.css",
    text: `.cell[data-v-e87e9d7d] { color: red; }`,
  },
  classKeyed: {
    file: "src/games/shared/CageOverlay.vue",
    text: `<style>
.cage-boundary { stroke: rgba(60, 64, 72, 0.5); }
:root.dark .cage-boundary { stroke: rgba(198, 204, 214, 0.42); }
</style>`,
  },
};

const REASON =
  "the print sheet is ink-on-paper regardless of the app toggle — OS preference rules it";

/** [check, expectation, description, files, allowlist] */
const FIXTURES = [
  [
    "1 UNWRITTEN ATTRIBUTES",
    "RED",
    "the wave's exact shape — a [data-theme] rule with a class-only writer",
    [F.deadAttr, F.classWriter],
    [],
  ],
  [
    "1 UNWRITTEN ATTRIBUTES",
    "RED",
    "the only mention of the writer is inside a comment",
    [F.deadAttr, F.commentedWriter],
    [],
  ],
  [
    "1 UNWRITTEN ATTRIBUTES",
    "GREEN",
    "positive control — a real setAttribute writer lands",
    [F.deadAttr, F.writerTs],
    [],
  ],
  [
    "1 UNWRITTEN ATTRIBUTES",
    "GREEN",
    "positive control — vueuse writes through `attribute:`, no setAttribute in sight",
    [F.deadAttr, F.writerVueuse],
    [],
  ],
  [
    "1 UNWRITTEN ATTRIBUTES",
    "GREEN",
    "positive control — Vue's own scope id is not an app attribute",
    [F.scopeId, F.classWriter],
    [],
  ],
  [
    "1 UNWRITTEN ATTRIBUTES",
    "GREEN",
    "positive control — the cured, class-keyed block",
    [F.classKeyed, F.classWriter],
    [],
  ],
  [
    "2 UNHONORED MEDIA",
    "RED",
    "a prefers-color-scheme block with nothing said about it",
    [F.media, F.classWriter],
    [],
  ],
  [
    "2 UNHONORED MEDIA",
    "GREEN",
    "positive control — allowlisted with a reason",
    [F.media, F.classWriter],
    [
      {
        file: "src/games/thermo/ThermoTube.vue",
        selector: "prefers-color-scheme",
        why: REASON,
      },
    ],
  ],
  [
    "3 ALLOWLIST CLOSED",
    "RED",
    "a stale entry — the selector it excuses is gone",
    [F.classKeyed, F.classWriter],
    [
      {
        file: "src/games/shared/CageOverlay.vue",
        selector: "data-theme",
        why: REASON,
      },
    ],
  ],
  [
    "3 ALLOWLIST CLOSED",
    "RED",
    "the excused attribute gained a writer — the excuse outlived its reason",
    [F.deadAttr, F.writerTs],
    [
      {
        file: "src/games/shared/CageOverlay.vue",
        selector: "data-theme",
        why: REASON,
      },
    ],
  ],
  [
    "3 ALLOWLIST CLOSED",
    "RED",
    "an entry whose reason is a shrug",
    [F.media, F.classWriter],
    [
      {
        file: "src/games/thermo/ThermoTube.vue",
        selector: "prefers-color-scheme",
        why: "later",
      },
    ],
  ],
];

function selfTest() {
  const broken = [];
  for (const [target, expect, description, files, allowlist] of FIXTURES) {
    const [, fn] = CHECKS.find(([name]) => name === target);
    const found = fn(buildModel(files, allowlist));
    const got = found.length ? "RED" : "GREEN";
    console.log(`  [${target}] ${description}\n      → ${got} (want ${expect})`);
    if (got !== expect)
      broken.push(
        `check "${target}" answered ${got} where ${expect} was required, on: ${description}. ` +
          (expect === "RED"
            ? "It cannot fail for the defect it names, so it is not a gate."
            : "It reds on a healthy tree, so its greens mean nothing."),
      );
  }
  return broken;
}

/* ── main ──────────────────────────────────────────────────────────────────── */

/**
 * Colocated tests are OUT of the corpus, both arms. A spec that stubs
 * `setAttribute("data-theme", …)` to exercise a rule would green the very hole this gate
 * watches — the test is not the app, and it is the app that has to write the attribute.
 */
const isTest = (name) => /\.(test|spec)\.[cm]?[jt]sx?$/.test(name);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", "dist", "coverage", "__tests__"].includes(entry.name))
        continue;
      walk(full, out);
    } else if (/\.(vue|css|ts|js|mjs)$/.test(entry.name) && !isTest(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function collect() {
  const files = walk(SRC).map((full) => ({
    file: path.relative(ROOT, full),
    text: fs.readFileSync(full, "utf8"),
  }));
  const html = path.join(ROOT, "index.html");
  if (fs.existsSync(html))
    files.push({ file: "index.html", text: fs.readFileSync(html, "utf8") });
  return buildModel(files, ALLOWLIST);
}

/** `--dist` alone reads `dist/`; `--dist dist-throttle` reads a build a prior job produced. */
const distDir = (() => {
  const i = process.argv.indexOf("--dist");
  if (i < 0) return null;
  const next = process.argv[i + 1];
  return next && !next.startsWith("--") ? next : "dist";
})();
const wantSelfTest = process.argv.includes("--self-test");

const model = collect();
const styleFiles = model.files.filter((f) => isStyleFile(f.file)).length;
const attrSites = model.sites.filter((s) => s.kind === "attr");
const mediaSites = model.sites.filter((s) => s.kind === "media");

console.log(
  `THEME-SELECTOR CENSUS — ${styleFiles} style files, ${attrSites.length} data-attribute ` +
    `selector sites over ${model.writers.size} attribute(s), ${mediaSites.length} ` +
    `prefers-color-scheme site(s), ${ALLOWLIST.length} allowlisted`,
);
for (const [attr, found] of [...model.writers].sort())
  console.log(
    `  writers for \`${attr}\`: ${
      found.length
        ? found.map((w) => `${w.file}:${w.line} (${w.form})`).join(", ")
        : "NONE"
    }`,
  );

const failures = [];
for (const [name, fn] of CHECKS) {
  const found = fn(model);
  console.log(
    `  ${found.length ? "✗" : "✓"} ${name}${found.length ? ` — ${found.length}` : ""}`,
  );
  for (const f of found) failures.push(`[${name}] ${f}`);
}

if (distDir) {
  try {
    const { bad, files } = check4BuiltCss(ALLOWLIST, distDir);
    console.log(
      `  ${bad.length ? "✗" : "✓"} 4 BUILT CSS — ${files} chunk(s) scanned in ${distDir}/assets`,
    );
    for (const f of bad) failures.push(`[4 BUILT CSS] ${f}`);
  } catch (err) {
    console.error(`\ncheck-theme-selectors: ${err.message}`);
    process.exit(2);
  }
}

if (wantSelfTest) {
  console.log("\nSELF-TEST — each check against fixture trees:");
  failures.push(...selfTest().map((v) => `[SELF-TEST] ${v}`));
}

if (failures.length) {
  console.error(`\n${failures.length} failure(s):\n`);
  for (const f of failures) console.error(`  • ${f}\n`);
  process.exit(1);
}

console.log(
  `\nOK — every data-attribute selector has a runtime writer, every prefers-color-scheme ` +
    `block is allowlisted with a reason, and the table is closed.`,
);
