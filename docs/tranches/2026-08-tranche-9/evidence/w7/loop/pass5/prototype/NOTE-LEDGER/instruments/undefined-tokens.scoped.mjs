/**
 * NOTE-LEDGER pass 5 · THE UNDEFINED-TOKEN CENSUS, SCOPE-KEYED (charter row 2).
 *
 * A COPY of MOT-VERB's pass-4 reverse census (`scripts/check-theme-tokens.mjs` `undefinedTokens`,
 * tree `wf_f72f3b5a-83a-59`, its comment masking and its TIMING_PROP read off the declaration),
 * re-cut on its critic's §2.4: a declaration is GLOBAL only when its innermost style rule is
 * `:root` / `html` / `*` or it sits in `@theme` (or it is a static `@property`, which gives the
 * name an initial value everywhere); every other static declaration is FILE-LOCAL. JS-emitted
 * declarations (`setProperty("--x")`, `"--x":` style keys, a `<style>` node built from a string)
 * are RUNTIME and never satisfy the census — "declared by nothing static" is the row it prints.
 *
 * Usage: node undefined-tokens.scoped.mjs <web/frontend root> [--self-test]
 *   --self-test plants, against the real corpus with one file's bytes replaced:
 *     PLANT B (MOT-VERB's critic): a bare timing var() in SolverErrorNote.vue whose only
 *       declaration is in MarginNote.vue's scoped style → must be UNRESOLVED (the flat census
 *       greens it: it is printed beside, as the control's reading).
 *     PLANT P (positive): the same token declared at `:root` in index.css → must resolve.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] ?? ".");
const SELF = process.argv.includes("--self-test");
const TIMING_PROP = /^(?:transition|animation)$|-(?:duration|delay)$/;

const keep = (m) => m.replace(/[^\n]/g, " ");
const mask = (t) =>
  t
    .replace(/\/\*[\s\S]*?\*\//g, keep)
    .replace(/<!--[\s\S]*?-->/g, keep)
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (m, pre) => pre + keep(m.slice(pre.length)));

function files(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) {
        if (!["node_modules", "dist", "coverage"].includes(e.name)) walk(f);
      } else if (/\.(vue|css|ts|html)$/.test(e.name)) out.push(f);
    }
  };
  walk(dir);
  return out;
}

/** The CSS a file carries: a .css file whole; a .vue file's `<style>` blocks (offsets kept by
 *  blanking everything else). */
function cssOf(f, masked) {
  if (f.endsWith(".css")) return masked;
  if (!f.endsWith(".vue")) return null;
  let out = masked.replace(/[^\n]/g, " ");
  for (const m of masked.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const at = m.index + m[0].indexOf(m[1]);
    out = out.slice(0, at) + m[1] + out.slice(at + m[1].length);
  }
  return out;
}

/** Walk braces; every `--x:` gets the chain of block preludes it sits in. */
function staticDecls(css) {
  const rows = [];
  const stack = [];
  let prelude = "";
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === "{") {
      stack.push(prelude.trim());
      prelude = "";
    } else if (c === "}") {
      stack.pop();
      prelude = "";
    } else if (c === ";") {
      const decl = prelude.trim();
      const m = /^(--[a-zA-Z0-9_-]+)\s*:/.exec(decl);
      if (m && stack.length) rows.push({ name: m[1], chain: [...stack] });
      prelude = "";
    } else prelude += c;
  }
  return rows;
}
const isGlobal = (chain) => {
  const styleRules = chain.filter((p) => !p.startsWith("@"));
  if (chain.some((p) => /^@theme\b/.test(p))) return true;
  const inner = styleRules.at(-1) ?? "";
  return inner
    .split(",")
    .map((s) => s.trim())
    .every((s) => /^(?::root|html|\*)(?![\w-])/.test(s));
};

export function census(extra = {}) {
  const fl = files(path.join(ROOT, "src"));
  const global = new Set();
  const local = new Map(); // file -> Set
  const runtime = new Set();
  const texts = new Map();
  for (const f of fl) {
    const masked = mask(extra[f] ?? fs.readFileSync(f, "utf8"));
    texts.set(f, masked);
    const css = cssOf(f, masked);
    if (css) {
      for (const m of css.matchAll(/@property\s+(--[a-zA-Z0-9_-]+)/g)) global.add(m[1]);
      for (const d of staticDecls(css))
        if (isGlobal(d.chain)) global.add(d.name);
        else (local.get(f) ?? local.set(f, new Set()).get(f)).add(d.name);
    }
    const script = css ? masked.replace(/<style[^>]*>[\s\S]*?<\/style>/g, keep) : masked;
    if (!f.endsWith(".css")) {
      for (const m of script.matchAll(/setProperty\(\s*["'`](--[a-zA-Z0-9_-]+)/g)) runtime.add(m[1]);
      for (const m of script.matchAll(/["'`](--[a-zA-Z0-9_-]+)["'`]\s*[:,)]/g)) runtime.add(m[1]);
      // a stylesheet written as a string: `--x:` / `@property --x` inside a template literal
      for (const m of script.matchAll(/(--[a-zA-Z0-9_-]+)(?:\$\{[^}]*\})?\s*:/g)) runtime.add(m[1]);
      for (const m of script.matchAll(/@property\s+(--[a-zA-Z0-9_-]+)/g)) runtime.add(m[1]);
    }
  }
  const rows = [];
  for (const [f, masked] of texts) {
    const lineAt = (at) => masked.slice(0, at).split("\n").length;
    for (const d of masked.matchAll(/(?:^|[;{}])\s*(-{0,2}[a-zA-Z][\w-]*)\s*:\s*([^;{}]*)/g)) {
      const [, prop, value] = d;
      const at = d.index + d[0].indexOf(value);
      for (const m of value.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)\s*(,?)/g)) {
        const [, name, comma] = m;
        if (comma || name.endsWith("-")) continue;
        if (global.has(name) || local.get(f)?.has(name)) continue;
        const declaredElsewhere = [...local].filter(([g, s]) => g !== f && s.has(name)).map(([g]) => path.relative(ROOT, g));
        rows.push({
          file: path.relative(ROOT, f),
          line: lineAt(at + m.index),
          token: name,
          prop,
          slot: TIMING_PROP.test(prop) ? "timing" : "other",
          kind: runtime.has(name) || [...runtime].some((r) => r.endsWith("-") && name.startsWith(r))
            ? "runtime-only (declared by nothing static)"
            : declaredElsewhere.length
              ? `file-local elsewhere (${declaredElsewhere.join(", ")})`
              : "undeclared",
        });
      }
    }
  }
  return { global: global.size, localFiles: local.size, rows };
}

const r = census();
console.log(`ROOT ${ROOT}`);
console.log(`static global declarations: ${r.global} · files with file-local declarations: ${r.localFiles}`);
console.log(`bare var() unresolved by any static declaration in scope: ${r.rows.length} (timing ${r.rows.filter((x) => x.slot === "timing").length})`);
for (const x of r.rows) console.log(`  ${x.file}:${x.line}  ${x.token}  [${x.prop} · ${x.slot}] ${x.kind}`);

if (SELF) {
  const sen = path.join(ROOT, "src/games/shared/SolverErrorNote.vue");
  const mn = path.join(ROOT, "src/pencil/chrome/MarginNote.vue");
  const idx = path.join(ROOT, "src/assets/index.css");
  const senT = fs.readFileSync(sen, "utf8");
  const plantSen = senT.replace(/<style([^>]*)>/, "<style$1>\n.critic-plant { animation: note-in var(--critic-ghost-ms) ease; }\n");
  const plantMn = fs.readFileSync(mn, "utf8").replace(/<style([^>]*)>/, "<style$1>\n.critic-host { --critic-ghost-ms: 250ms; }\n");
  const b = census({ [sen]: plantSen, [mn]: plantMn });
  const redB = b.rows.some((x) => x.token === "--critic-ghost-ms" && x.file.endsWith("SolverErrorNote.vue"));
  const plantIdx = fs.readFileSync(idx, "utf8").replace(/:root\s*\{/, ":root {\n  --critic-ghost-ms: 250ms;");
  const p = census({ [sen]: plantSen, [idx]: plantIdx });
  const greenP = !p.rows.some((x) => x.token === "--critic-ghost-ms");
  console.log(`PLANT B (declared only in another file's scoped style): ${redB ? "RED as required" : "FAILED — green"}`);
  console.log(`PLANT P (declared at :root in index.css): ${greenP ? "green as required" : "FAILED — red"}`);
  if (!redB || !greenP) process.exit(2);
}
process.exit(r.rows.length ? 1 : 0);
