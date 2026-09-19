// PAL-WALK pass-2 · does the CHROMA rule (> 0.06, resolved per arm) find the same reserved set
// the pass-1 NAME LIST found? If it finds more, the arcs move and the whole walk is re-priced.
import { readFileSync } from "node:fs";
const CSS = new URL("../web/frontend/src/assets/index.css", import.meta.url);
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export function oklch(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C: Math.hypot(A, B), h };
}
const css = readFileSync(CSS, "utf8");
const darkIdx = css.search(/\n\.dark\s*\{/);
const arms = {
  light: darkIdx < 0 ? css : css.slice(0, darkIdx),
  dark: darkIdx < 0 ? "" : css.slice(darkIdx),
};
for (const [arm, text] of Object.entries(arms)) {
  const decls = [...text.matchAll(/(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map((m) => ({
    name: m[1],
    hex: m[2],
    ...oklch(m[2]),
  }));
  const chromatic = decls.filter((d) => d.C > 0.06);
  console.log(`\n## ${arm}: ${decls.length} hex declarations, ${chromatic.length} over chroma 0.06`);
  for (const d of chromatic.sort((a, b) => a.h - b.h))
    console.log(
      `  ${d.name.padEnd(30)} ${d.hex}  C ${d.C.toFixed(4)}  h ${d.h.toFixed(2)}  L ${d.L.toFixed(3)}`,
    );
  const near = decls.filter((d) => d.C > 0.03 && d.C <= 0.06);
  console.log(
    `  -- 0.03 < C <= 0.06: ${near.map((d) => `${d.name} ${d.C.toFixed(4)} h${d.h.toFixed(1)}`).join(", ") || "none"}`,
  );
}
console.log("\nuser-ink #2563eb ->", JSON.stringify(oklch("#2563eb")));
