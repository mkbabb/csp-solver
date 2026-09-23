// T9-W7 pass 6 · CTRL-RULE — the critic's 1.7 census, re-cut as a script: every `var(--x…)` in
// src (every stylesheet and every SFC <style>, comments stripped) whose --x has NO declaration
// anywhere in src (a `--x:` in CSS, a `setProperty("--x"`, a `'--x':` style key, an `@property`),
// fallback or not. Run as a DIFF: tree minus control. node fallback-census.mjs <tree fe> <control fe>
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
function census(fe) {
  const files = walk(join(fe, "src")).filter((f) => /\.(vue|css|ts)$/.test(f) && !/\.test\.ts$/.test(f));
  const decl = new Set(), uses = [];
  for (const f of files) {
    const raw = readFileSync(f, "utf8");
    const s = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    for (const m of s.matchAll(/(--[\w-]+)\s*:/g)) decl.add(m[1]);
    for (const m of s.matchAll(/setProperty\(\s*["'`](--[\w-]+)/g)) decl.add(m[1]);
    for (const m of s.matchAll(/["'](--[\w-]+)["']\s*:/g)) decl.add(m[1]);
    for (const m of s.matchAll(/@property\s+(--[\w-]+)/g)) decl.add(m[1]);
    for (const m of s.matchAll(/var\(\s*(--[\w-]+)/g)) uses.push([m[1], f.slice(fe.length + 5)]);
  }
  const undecl = new Map();
  for (const [t, f] of uses) if (!decl.has(t) && !t.startsWith("--tw-")) undecl.set(t, [...(undecl.get(t) || []), f]);
  return undecl;
}
const [T, C] = process.argv.slice(2);
const a = census(T), b = census(C);
const plus = [...a.keys()].filter((k) => !b.has(k)), minus = [...b.keys()].filter((k) => !a.has(k));
console.log(`tree ${a.size} · control ${b.size} · diff +${plus.length} −${minus.length}`);
for (const k of plus) console.log("  +", k, [...new Set(a.get(k))].join(", "));
for (const k of minus) console.log("  −", k);
process.exit(plus.length ? 1 : 0);
