#!/usr/bin/env node
/**
 * THE LEDGER'S KEY, AND WHERE IT COLLIDES (T9-W7 pass 2, MOT-VERB research).
 *
 * `check-pencil-verbs.mjs` keys both the admission ledger and `seen` on
 * `file :: declaration text`. Two identical declarations in one file share that key, so
 * admitting one admits the other invisibly and `seen` can never tell them apart. This
 * counts every collision in the prototype's own tree and names the pairs, so the ordinal
 * the charter asks for has a measured size.
 *
 *   SRC=<a src dir> node ledger-collisions.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import process from "node:process";

const SRC = resolve(process.env.SRC ?? ".");
const DECL = /(?:transition|animation)(?:-[a-z]+)?\s*:\s*/;

function* walk(dir) {
  for (const n of readdirSync(dir).sort()) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) { if (n !== "dev") yield* walk(p); }
    else if (/\.(vue|css)$/.test(n)) yield p;
  }
}
function strip(text) {
  let out = "";
  for (let i = 0, n = text.length; i < n;) {
    if (text[i] === "/" && text[i + 1] === "*") {
      const e = text.indexOf("*/", i + 2), end = e < 0 ? n : e + 2;
      for (let k = i; k < end; k++) out += text[k] === "\n" ? "\n" : " ";
      i = end;
    } else if (text[i] === "/" && text[i + 1] === "/") {
      while (i < n && text[i] !== "\n") { out += " "; i++; }
    } else out += text[i++];
  }
  return out;
}

const keys = new Map();
for (const file of walk(SRC)) {
  const lines = strip(readFileSync(file, "utf8")).split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (!DECL.test(lines[i])) continue;
    let buf = lines[i], j = i;
    while (!buf.includes(";") && j - i < 8 && j + 1 < lines.length) buf += " " + lines[++j];
    const body = buf.slice(buf.search(DECL)).replace(DECL, "").split(";")[0].replace(/\s+/g, " ").trim();
    const at = `${relative(SRC, file)}:${i + 1}`;
    i = j;
    if (!body || body.startsWith("none")) continue;
    const key = `${relative(SRC, file)} :: ${body}`;
    if (!keys.has(key)) keys.set(key, []);
    keys.get(key).push(at);
  }
}
let n = 0;
for (const [k, at] of keys) {
  if (at.length < 2) continue;
  n++;
  console.log(`x${at.length}  ${k}`);
  console.log(`      at ${at.join(" · ")}`);
}
console.log(`\ndistinct keys ${keys.size} · colliding keys ${n} · declarations ${[...keys.values()].reduce((a, b) => a + b.length, 0)}`);
