// What the RESOLVED census sees that the hex-only one did not, and what each new one is.
// Run from web/frontend: node <this file>
import { readFileSync } from "node:fs";
import process from "node:process";

const css = readFileSync("src/assets/index.css", "utf8");
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function oklchOf(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return { C: Math.hypot(A, B), h: h < 0 ? h + 360 : h };
}
function hslToHex(h, s, l) {
  const S = s / 100;
  const L = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = (n) => L - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const byte = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${byte(f(0))}${byte(f(8))}${byte(f(4))}`;
}
function carve(text, opener) {
  const at = text.indexOf(opener);
  if (at < 0) return null;
  let depth = 0;
  for (let i = at + opener.length - 1; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0)
      return [text.slice(at + opener.length, i), text.slice(0, at) + text.slice(i + 1)];
  }
  return null;
}
const DECLS = /(--[a-z0-9-]+):\s*([^;{}]+);/g;
function armsOf(t) {
  let rest = t;
  for (const opener of ["@media print {", "@media (forced-colors: active) {"]) {
    let cut;
    while ((cut = carve(rest, opener))) rest = cut[1];
  }
  const dark = carve(rest, ".dark {");
  const light = dark ? dark[1] : rest;
  const read = (x) => new Map([...x.matchAll(DECLS)].map((m) => [m[1], m[2].trim()]));
  return { light: read(light), dark: read(dark ? dark[0] : "") };
}
function resolve(value, arm, root, depth = 0) {
  const v = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toLowerCase();
  const hsl = v.match(/^hsl\(\s*([\d.]+)\s*,?\s*([\d.]+)%\s*,?\s*([\d.]+)%\s*\)$/i);
  if (hsl) return hslToHex(Number(hsl[1]), Number(hsl[2]), Number(hsl[3]));
  const alias = v.match(/^var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^)]*))?\)$/i);
  if (alias && depth < 8) {
    const next = arm.get(alias[1]) ?? root.get(alias[1]) ?? alias[2];
    if (next) return resolve(next, arm, root, depth + 1);
  }
  return null;
}

const HEX = /(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\b/g;
const old = [...css.matchAll(HEX)]
  .map((m) => ({ name: m[1], hex: m[2].toLowerCase(), ...oklchOf(m[2]) }))
  .filter((d) => d.C > 0.06);

const { light, dark } = armsOf(css);
const now = [];
for (const [armName, arm] of [
  ["light", light],
  ["dark", dark],
]) {
  for (const [name, raw] of arm) {
    const hex = resolve(raw, arm, light);
    if (!hex) continue;
    const { C, h } = oklchOf(hex);
    if (C > 0.06) now.push({ name, arm: armName, raw, hex, C, h });
  }
}

console.log(`hex-only rule (pass 2): ${old.length}`);
console.log(`resolved rule  (pass 3): ${now.length}`);
const oldKeys = new Set(old.map((d) => `${d.name}|${d.hex}`));
console.log("\nSEEN ONLY BY THE RESOLVED RULE:");
for (const d of now)
  if (!oldKeys.has(`${d.name}|${d.hex}`))
    console.log(
      `  [${d.arm}] ${d.name}: ${d.raw}  ->  ${d.hex}  h=${d.h.toFixed(2)} C=${d.C.toFixed(4)}`,
    );
console.log("\nALL RESOLVED CHROMATICS, by arm:");
for (const d of now)
  console.log(`  [${d.arm}] ${d.name} ${d.hex} h=${d.h.toFixed(2)} C=${d.C.toFixed(4)}`);
process.exit(0);
