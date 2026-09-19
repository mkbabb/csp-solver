#!/usr/bin/env node
// T9-W7 pass-3 research · MOT-LADDER · THE CLOCK CENSUS
//
// Two rosters over the SHIPPED estate (src/, minus src/pencil/dev/, minus *.test.ts /
// *.spec.ts):
//
//   CSS  — every `transition:` / `animation:` (+ the long-hand duration/delay props) term,
//          with its FIRST time value (the duration) and its later ones (the delays).
//   CODE — every clock that lives in TS or in a .vue <script>: setTimeout/setInterval
//          intervals, WAAPI `duration:` / `delay:` in an `.animate(` options object, and
//          `*Ms` / `*_MS` numeric constants.
//
// The CODE roster is the thing pass 2's B1/B2 could not see (critique §2.2). Read-only.
//
// usage: node clock-census.mjs [<frontend root>]   (default: cwd)

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = process.argv[2] ?? process.cwd();
const SRC = join(ROOT, "src");
const SKIP_DIR = /(^|\/)(dev|node_modules|dist)(\/|$)/;
const SKIP_FILE = /\.(test|spec)\.[tj]s$|\.d\.ts$/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (!SKIP_DIR.test(relative(SRC, p))) walk(p, out);
    } else if (!SKIP_FILE.test(name) && [".ts", ".vue", ".css"].includes(extname(name))) {
      out.push(p);
    }
  }
  return out;
}

const files = walk(SRC).sort();

// ── slicing a .vue into its <style> text and its <script> text ────────────────
function slices(path, text) {
  const ext = extname(path);
  if (ext === ".css") return { css: [[text, 0]], code: [] };
  if (ext === ".ts") return { css: [], code: [[text, 0]] };
  const css = [];
  const code = [];
  const re = /<(style|script)\b[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(text))) {
    const start = m.index + m[0].indexOf(m[2]);
    (m[1] === "style" ? css : code).push([m[2], start]);
  }
  return { css, code };
}

const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;

// ── CSS roster ────────────────────────────────────────────────────────────────
const TIME = /(-?\d*\.?\d+)\s*(ms|s)\b/g;
const cssRows = [];
const DECL =
  /\b(transition|animation)(-duration|-delay)?\s*:\s*([^;}]+)[;}]/g;

for (const path of files) {
  const text = readFileSync(path, "utf8");
  const { css } = slices(path, text);
  for (const [chunk, off] of css) {
    let m;
    const re = new RegExp(DECL.source, "g");
    while ((m = re.exec(chunk))) {
      const prop = m[1] + (m[2] ?? "");
      const body = m[3].trim();
      if (/^\s*(none|inherit|initial|unset|revert)\s*$/.test(body)) continue;
      const line = lineOf(text, off + m.index);
      // split on top-level commas
      let depth = 0;
      let cur = "";
      const terms = [];
      for (const ch of body) {
        if (ch === "(") depth++;
        else if (ch === ")") depth--;
        if (ch === "," && depth === 0) {
          terms.push(cur);
          cur = "";
        } else cur += ch;
      }
      terms.push(cur);
      for (const term of terms) {
        const times = [...term.matchAll(new RegExp(TIME.source, "g"))].map((t) => {
          const n = parseFloat(t[1]);
          return t[2] === "s" ? n * 1000 : n;
        });
        const vars = [...term.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)/g)].map((v) => v[1]);
        // a longhand -delay declaration is ALL delay
        const isDelayProp = m[2] === "-delay";
        cssRows.push({
          file: relative(ROOT, path),
          line,
          prop,
          term: term.trim().replace(/\s+/g, " "),
          duration: isDelayProp ? null : (times[0] ?? null),
          delays: isDelayProp ? times : times.slice(1),
          vars,
          named: vars.some((v) => /^--motion-/.test(v)),
          ease: vars.filter((v) => /^--ease-/.test(v)),
          bareEase: /(^|\s)(ease|ease-in|ease-out|ease-in-out|linear)(\s|$)/.test(
            term.trim()
          ),
        });
      }
    }
  }
}

// ── CODE roster ───────────────────────────────────────────────────────────────
const codeRows = [];
for (const path of files) {
  const text = readFileSync(path, "utf8");
  const { code } = slices(path, text);
  for (const [chunk, off] of code) {
    const push = (idx, kind, value, snippet) =>
      codeRows.push({
        file: relative(ROOT, path),
        line: lineOf(text, off + idx),
        kind,
        value,
        snippet: snippet.replace(/\s+/g, " ").slice(0, 110),
      });

    // setTimeout / setInterval — second argument
    for (const m of chunk.matchAll(
      /\b(?:window\.)?(setTimeout|setInterval)\s*\(([\s\S]{0,400}?)\)\s*[;,)]/g
    )) {
      // find the top-level comma of the call
      let depth = 0;
      let arg2 = null;
      const body = m[2];
      for (let i = 0; i < body.length; i++) {
        const ch = body[i];
        if ("([{".includes(ch)) depth++;
        else if (")]}".includes(ch)) depth--;
        else if (ch === "," && depth === 0) {
          arg2 = body.slice(i + 1).trim();
          break;
        }
      }
      if (arg2 === null) continue;
      push(m.index, m[1], arg2.split(/\s*[,)]/)[0].trim(), m[0]);
    }

    // WAAPI options / animate() / any `duration:`|`delay:` key
    for (const m of chunk.matchAll(/\b(duration|delay|durationMs|delayMs)\s*:\s*([^,}\n]+)/g)) {
      push(m.index, m[1], m[2].trim(), m[0]);
    }

    // *Ms / *_MS numeric constants
    for (const m of chunk.matchAll(
      /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*(?:Ms|_MS))\s*(?::[^=]+)?=\s*([^;\n]+)/g
    )) {
      push(m.index, "const", `${m[1]} = ${m[2].trim()}`, m[0]);
    }
  }
}

// ── report ────────────────────────────────────────────────────────────────────
const hist = (xs) => {
  const h = new Map();
  for (const x of xs) h.set(x, (h.get(x) ?? 0) + 1);
  return [...h.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
};

const durations = cssRows.map((r) => r.duration).filter((d) => d !== null);
const delays = cssRows.flatMap((r) => r.delays);

console.log(`# CSS roster — ${cssRows.length} terms in ${new Set(cssRows.map((r) => r.file)).size} files`);
console.log(`  terms with a duration: ${durations.length}`);
console.log(`  DURATION histogram (ms × count):`);
for (const [v, n] of hist(durations)) console.log(`    ${String(v).padStart(6)} × ${n}`);
console.log(`  DELAY histogram (ms × count):`);
for (const [v, n] of hist(delays)) console.log(`    ${String(v).padStart(6)} × ${n}`);
console.log(
  `  terms reading a var(--motion-*): ${cssRows.filter((r) => r.named).length}`
);
console.log(
  `  terms with a bare UA ease keyword: ${cssRows.filter((r) => r.bareEase).length}`
);
console.log(
  `  terms with NO --ease-* and no bare keyword: ${
    cssRows.filter((r) => !r.ease.length && !r.bareEase).length
  }`
);

for (const target of (process.env.SHOW_MS ?? "520,500,600,440").split(",")) {
  const v = Number(target);
  const rows = cssRows.filter((r) => r.duration === v || r.delays.includes(v));
  console.log(`\n## every CSS site at ${v}ms (${rows.length})`);
  for (const r of rows)
    console.log(
      `  ${r.file}:${r.line}  ${r.duration === v ? "DUR" : "DELAY"}  ${r.term}`
    );
}

console.log(`\n# CODE roster — ${codeRows.length} clocks in ${new Set(codeRows.map((r) => r.file)).size} files`);
const byKind = hist(codeRows.map((r) => r.kind));
for (const [k, n] of byKind) console.log(`  ${k}: ${n}`);
const literal = codeRows.filter((r) => /^\d+(\.\d+)?$/.test(String(r.value).trim()));
console.log(`  of those, a BARE NUMERIC LITERAL: ${literal.length}`);
console.log(`\n## every code clock (kind · value · site)`);
for (const r of codeRows)
  console.log(`  ${r.file}:${r.line}  ${r.kind.padEnd(11)} ${String(r.value).slice(0, 48)}`);

if (process.env.JSON_OUT) {
  const { writeFileSync } = await import("node:fs");
  writeFileSync(process.env.JSON_OUT, JSON.stringify({ cssRows, codeRows }, null, 1));
}
