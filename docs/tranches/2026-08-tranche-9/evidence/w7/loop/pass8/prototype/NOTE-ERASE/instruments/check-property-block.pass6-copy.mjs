#!/usr/bin/env node
/**
 * CHECK-PROPERTY-BLOCK — the @property census (T9-W7 pass 6, the chair's instruments lane;
 * registry-v5 §2.13, LAWS P5 "THE @PROPERTY LAW … clause 4 reads `inherits`").
 *
 * A textual merge is SILENT on a duplicated registration: §13 laid onto §10 seated every rung
 * three times with no conflict (pass5/rehearsal). This census is the fold gate that reads it.
 *
 *   C1  names unique      — every `@property --x` name is registered ONCE across the source homes,
 *                           and once across the SERVED CSS (every dist/assets/*.css).
 *   C2  one block a home  — a home's registrations form ONE contiguous run (only whitespace and
 *                           comments between them). A home is a `.css` file or a `.vue` `<style>`.
 *   C3  none nested       — every registration sits at brace depth 0 of its home (inside `:root {}`
 *                           or `@media {}` it is illegal and only the bundler's hoist rescues it).
 *   C4  none from script  — no `@property` token and no `CSS.registerProperty(` in the CODE (comments
 *                           masked) of a .ts/.js/.mjs file or a `.vue` `<script>`: a registration its
 *                           publisher emits dies with the publisher (NOTE-LEDGER's `motionRungs.ts`).
 *                           Unit tests (`*.test.*`, `*.spec.*`) ship nothing and are skipped.
 *   C5  ladder inherits   — every LADDER registration (keyed on SHAPE: `syntax: "<time>"`, or a
 *                           `--motion-*` name) declares `inherits: true`. LADDER's critic: `inherits:
 *                           false` on a `<time>` set on `:root` reads 0s in every descendant, both
 *                           engines. Read in source AND in the served CSS.
 *   C6  well-formed       — (this lane's addition, PROPOSED to the chair) `syntax` and `inherits`
 *                           present, `initial-value` present unless `syntax: "*"`: a malformed rule is
 *                           dropped silently by both engines, which is C1–C5's subject vanishing.
 *
 * Usage (from anywhere; nothing is written):
 *   node check-property-block.mjs --fe <web/frontend> [--dist <dist dir>] [--served <http://127.0.0.1:port>]
 *   node check-property-block.mjs --fe <web/frontend> --self-test      (plants one breach per clause
 *                                                                        on in-memory copies of THIS
 *                                                                        tree's real corpus; each must
 *                                                                        red ITS clause)
 * --dist defaults to <fe>/dist when it exists. --served reads the page's index-*.js name and REDS
 * when it is not the dist's (LAWS: a browserless gate reading a browser artifact stamps the SERVED
 * artifact). Exit 0 GREEN · 1 RED · 2 self-test failure (a plant that did not red its clause).
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const arg = (k) => {
  const i = process.argv.indexOf(k);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const FE = path.resolve(arg("--fe") ?? process.env.FE ?? ".");
const DIST = arg("--dist") ?? (fs.existsSync(path.join(FE, "dist")) ? path.join(FE, "dist") : null);
const SERVED = arg("--served");
const SELF_TEST = process.argv.includes("--self-test");
if (!fs.existsSync(path.join(FE, "src"))) {
  console.error(`check-property-block: no src/ under ${FE} (pass --fe <web/frontend>)`);
  process.exit(2);
}

/** Blank comments, preserving offsets and newlines. `css` masks block comments only (a `//` in
 *  CSS is a URL or a value); code masks both, leaving `//` inside a URL or string alone. */
const keep = (m) => m.replace(/[^\n]/g, " ");
const maskCss = (t) => t.replace(/\/\*[\s\S]*?\*\//g, keep);
const maskCode = (t) =>
  t
    .replace(/\/\*[\s\S]*?\*\//g, keep)
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (m, pre) => pre + keep(m.slice(pre.length)));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!["node_modules", "dist", "coverage"].includes(e.name)) walk(f, out);
    } else out.push(f);
  }
  return out;
}

/** The corpus as {file: text}. `over` REPLACES a file's bytes (the self-test's plants). */
function corpus(over = {}) {
  const files = walk(path.join(FE, "src")).filter((f) => /\.(css|vue|ts|js|mjs|tsx|jsx)$/.test(f));
  for (const f of Object.keys(over)) if (!files.includes(f)) files.push(f);
  return Object.fromEntries(files.map((f) => [f, over[f] ?? fs.readFileSync(f, "utf8")]));
}

/** Homes: [{file, start, text}] — a .css file whole; each `<style>` of a .vue. */
function homes(texts) {
  const out = [];
  for (const [f, raw] of Object.entries(texts)) {
    if (f.endsWith(".css")) out.push({ file: f, start: 0, text: raw });
    else if (f.endsWith(".vue"))
      for (const m of raw.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) {
        const start = m.index + m[0].indexOf(">") + 1;
        out.push({ file: f, start, text: m[1] });
      }
  }
  return out;
}

/** Every `@property` rule in a CSS text: name, depth, [at, end), descriptors. */
function registrations(cssText) {
  const t = maskCss(cssText);
  const out = [];
  let depth = 0;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === "@" && t.startsWith("@property", i)) {
      const m = /^@property\s+(--[A-Za-z0-9_-]+)\s*\{([^}]*)\}/.exec(t.slice(i));
      if (!m) {
        out.push({ name: "(unparsed)", depth, at: i, end: i + 9, desc: {}, raw: t.slice(i, i + 60) });
        continue;
      }
      const desc = {};
      for (const d of m[2].split(";")) {
        const k = /^\s*([a-z-]+)\s*:\s*([\s\S]*?)\s*$/.exec(d);
        if (k) desc[k[1]] = k[2];
      }
      out.push({ name: m[1], depth, at: i, end: i + m[0].length, desc });
      i += m[0].length - 1; // the rule's own braces are consumed here, depth unchanged
    }
  }
  return out;
}

const TEST_FILE = /\.(test|spec)\.[cm]?[jt]sx?$|[\\/]__tests__[\\/]/;
const isLadder = (r) => /^["']<time>["']$/.test(r.desc.syntax ?? "") || /^--motion-/.test(r.name);
const lineOf = (text, at) => text.slice(0, at).split("\n").length;

function census(over = {}) {
  const texts = corpus(over);
  const rel = (f) => path.relative(FE, f);
  const red = { C1: [], C2: [], C3: [], C4: [], C5: [], C6: [] };
  const seen = new Map(); // name -> [site]
  let total = 0;
  for (const h of homes(texts)) {
    const regs = registrations(h.text);
    if (!regs.length) continue;
    const masked = maskCss(h.text);
    const where = (r) => `${rel(h.file)}:${lineOf(texts[h.file], h.start + r.at)}`;
    total += regs.length;
    for (const r of regs) {
      (seen.get(r.name) ?? seen.set(r.name, []).get(r.name)).push(where(r));
      if (r.depth !== 0) red.C3.push(`${where(r)} ${r.name} registered INSIDE a brace (depth ${r.depth})`);
      if (isLadder(r) && r.desc.inherits !== "true")
        red.C5.push(`${where(r)} ${r.name} is a ladder registration with inherits: ${r.desc.inherits ?? "(absent)"}`);
      const bad = [];
      if (!r.desc.syntax) bad.push("syntax");
      if (!r.desc.inherits) bad.push("inherits");
      if (!("initial-value" in r.desc) && !/^["']\*["']$/.test(r.desc.syntax ?? "")) bad.push("initial-value");
      if (bad.length) red.C6.push(`${where(r)} ${r.name} lacks ${bad.join(", ")} — dropped silently`);
    }
    // C2: count the contiguous runs (the gap between two registrations holds only whitespace).
    let runs = 1;
    for (let k = 1; k < regs.length; k++) if (masked.slice(regs[k - 1].end, regs[k].at).trim() !== "") runs++;
    if (runs > 1) red.C2.push(`${rel(h.file)} holds ${runs} @property blocks — one block per home`);
  }
  for (const [name, sites] of seen) if (sites.length > 1) red.C1.push(`${name} registered ${sites.length}× — ${sites.join(" · ")}`);
  for (const [f, raw] of Object.entries(texts)) {
    if (TEST_FILE.test(f)) continue; // a unit test ships nothing (NOTE-ERASE's asserts the ABSENCE)
    let code = null;
    if (/\.(ts|js|mjs|tsx|jsx)$/.test(f)) code = maskCode(raw);
    else if (f.endsWith(".vue")) {
      // blank everything but the <script> blocks, preserving offsets
      code = raw.replace(/[^\n]/g, " ");
      for (const m of raw.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
        const s = m.index + m[0].indexOf(">") + 1;
        code = code.slice(0, s) + maskCode(m[1]) + code.slice(s + m[1].length);
      }
    }
    if (code == null) continue;
    for (const m of code.matchAll(/@property\b|\bregisterProperty\s*\(/g))
      red.C4.push(`${rel(f)}:${lineOf(code, m.index)} emits \`${m[0].trim()}\` from script`);
  }
  return { red, total, names: seen.size };
}

function served() {
  const out = { red: { C1: [], C3: [], C5: [] }, files: [], total: 0, stamp: null };
  if (!DIST) return out;
  const dir = path.join(DIST, "assets");
  const css = fs.readdirSync(dir).filter((f) => f.endsWith(".css"));
  const js = fs.readdirSync(dir).filter((f) => /^index-.*\.js$/.test(f));
  out.stamp = js.join(",");
  const seen = new Map();
  for (const f of css) {
    const regs = registrations(fs.readFileSync(path.join(dir, f), "utf8"));
    out.files.push(`${f}:${regs.length}`);
    out.total += regs.length;
    for (const r of regs) {
      (seen.get(r.name) ?? seen.set(r.name, []).get(r.name)).push(f);
      if (r.depth !== 0) out.red.C3.push(`served ${f} ${r.name} at depth ${r.depth}`);
      if (isLadder(r) && r.desc.inherits !== "true") out.red.C5.push(`served ${f} ${r.name} inherits: ${r.desc.inherits}`);
    }
  }
  for (const [n, s] of seen) if (s.length > 1) out.red.C1.push(`served ${n} registered ${s.length}× — ${s.join(" · ")}`);
  return out;
}

const flat = (red) => Object.entries(red).flatMap(([k, v]) => v.map((x) => `${k}  ${x}`));

// ── the run ──────────────────────────────────────────────────────────────────────────────
const src = census();
const dist = served();
console.log(`check-property-block · ${FE}`);
console.log(`source: ${src.total} registrations, ${src.names} names`);
if (DIST) console.log(`served: ${dist.total} registrations in ${dist.files.length} css (${dist.files.join(" ")}) · stamp ${dist.stamp}`);
else console.log("served: no dist (source only — the served clause is UNREAD, say so)");
let stampRed = [];
if (SERVED) {
  try {
    const html = await (await fetch(SERVED)).text();
    const got = (html.match(/index-[A-Za-z0-9_-]+\.js/) ?? [""])[0];
    console.log(`served at ${SERVED}: ${got}`);
    if (!dist.stamp || !dist.stamp.split(",").includes(got)) stampRed.push(`STAMP  ${SERVED} serves ${got}, the dist read is ${dist.stamp}`);
  } catch (e) {
    stampRed.push(`STAMP  ${SERVED} unreachable: ${e.message}`);
  }
}
const reds = [...flat(src.red), ...flat(dist.red), ...stampRed];
for (const r of reds) console.log(`  RED ${r}`);

if (SELF_TEST) {
  // Plants on in-memory copies of THIS tree's corpus, keyed on SHAPE: the first home that holds
  // a registration (or a synthetic one in the first .css when the tree registers nothing).
  const texts = corpus();
  const host = homes(texts).find((h) => registrations(h.text).length) ?? null;
  const anyCss = Object.keys(texts).find((f) => f.endsWith(".css"));
  const anyTs = Object.keys(texts).find((f) => f.endsWith(".ts") && !f.endsWith(".d.ts") && !TEST_FILE.test(f));
  const anyVue = Object.keys(texts).find((f) => f.endsWith(".vue") && /<style\b/.test(texts[f]));
  const RUNG = `@property --motion-plant {\n  syntax: "<time>";\n  inherits: true;\n  initial-value: 0ms;\n}\n`;
  const put = (file, at, s) => texts[file].slice(0, at) + s + texts[file].slice(at);
  // A clean base: this tree's own reds are subtracted, so a plant is judged by what it ADDS.
  // Compared as line-free keys, so a plant that shifts lines is judged only by the reds it adds.
  const key = (m) => m.replace(/:\d+/g, "");
  const base = Object.fromEntries(Object.entries(src.red).map(([k, v]) => [k, v.map(key)]));
  const added = (red, clause) => {
    const left = [...base[clause]];
    return red[clause].map(key).filter((m) => { const i = left.indexOf(m); if (i < 0) return true; left.splice(i, 1); return false; });
  };
  const adds = (over, clause) => added(census(over).red, clause).length > 0;
  const hf = host?.file ?? anyCss;
  const hStart = host ? host.start + registrations(host.text)[0].at : 0;
  const withHost = host ? {} : { [anyCss]: RUNG + texts[anyCss] };
  const hostText = withHost[hf] ?? texts[hf];
  const firstReg = host ? registrations(host.text)[0] : registrations(RUNG)[0];
  const regText = hostText.slice(hStart, hStart + (firstReg.end - firstReg.at));
  const styleOpen = anyVue ? texts[anyVue].search(/<style\b[^>]*>/) + texts[anyVue].match(/<style\b[^>]*>/)[0].length : 0;
  const plants = [
    ["C1", "the first registration copied into a SECOND home (a component's <style>, file scope)",
      { ...withHost, [anyVue]: put(anyVue, styleOpen, `\n${regText}\n`) }],
    ["C2", "a rule seated between the home's registrations (two blocks, no duplicate name)",
      { [hf]: hostText.slice(0, hStart) + `${RUNG}.plant-split { color: red; }\n` + hostText.slice(hStart) }],
    ["C3", "a registration nested in @media screen {}",
      { [hf]: hostText.slice(0, hStart) + `@media screen {\n${RUNG.replace("plant", "plant-nested")}}\n` + hostText.slice(hStart) }],
    ["C4", "NOTE-LEDGER's shape: a publisher emitting `@property --motion-${n}` from script",
      { ...withHost, [anyTs]: texts[anyTs] + "\nexport const __plant = (n: string) => `@property --motion-${n} { syntax: \"<time>\"; inherits: true; initial-value: 0ms; }`;\n" }],
    ["C5", "`inherits: false` on a <time> ladder registration",
      { [hf]: hostText.slice(0, hStart) + RUNG.replace("inherits: true", "inherits: false") + hostText.slice(hStart) }],
    ["C6", "a registration without `syntax` (dropped silently)",
      { [hf]: hostText.slice(0, hStart) + RUNG.replace('  syntax: "<time>";\n', "").replace("plant", "plant-nosyntax") + hostText.slice(hStart) }],
  ];
  let failed = 0;
  console.log(`\nself-test plants (host: ${path.relative(FE, hf)}${host ? "" : " — synthetic rung, the tree registers nothing"}):`);
  for (const [clause, what, over] of plants) {
    const ok = adds(over, clause);
    if (!ok) failed++;
    console.log(`  ${clause} ${ok ? "RED as required" : "FAILED — stayed green"} · ${what}`);
  }
  // the negative-negative: a registration added INSIDE the host block (same home, contiguous,
  // unique name, inherits true) must add NO red anywhere.
  const clean = { [hf]: hostText.slice(0, hStart) + RUNG.replace("plant", "plant-clean") + hostText.slice(hStart) };
  const cr = census(clean).red;
  const quiet = Object.keys(cr).every((k) => added(cr, k).length === 0 && cr[k].length === base[k].length);
  if (!quiet) failed++;
  console.log(`  --  ${quiet ? "green as required" : "FAILED — reds"} · a lawful registration added inside the host block`);
  if (failed) {
    console.error(`\ncheck-property-block: SELF-TEST FAILED (${failed})`);
    process.exit(2);
  }
}

if (reds.length) {
  console.error(`\ncheck-property-block: RED — ${reds.length} breach(es)`);
  process.exit(1);
}
console.log("\ncheck-property-block: GREEN — names unique, one block per home, none nested, none from script, every ladder inherits");
