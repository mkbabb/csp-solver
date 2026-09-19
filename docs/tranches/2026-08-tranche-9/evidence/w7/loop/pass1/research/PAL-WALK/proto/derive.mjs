/**
 * PAL-WALK · THE DERIVATION. Prints the reserved set with bounds, the open arc, the walk, the
 * separations, the sRGB gamut at the wax chroma and the arithmetic contrast. Every input is read
 * from `web/frontend/src/assets/index.css` at run time. Run bare (a pipe eats the exit code).
 */
import fs from "fs";
import {
  ROOT,
  GUARD_DEG,
  STEP_DEG,
  CHROMA,
  buildWalk,
  meanCrayonChroma,
  measure,
  gap,
  inGamut,
  oklchToSrgb255,
  contrast,
  srgbToOklch,
} from "./arcWalk.mjs";

const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const say = (s = "") => console.log(s);

// grounds, read from the file (hsl -> rgb)
function hsl(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}
const GROUNDS = {
  "light/background": hsl(48, 15, 98),
  "light/card": hsl(60, 9.1, 99.2),
  "dark/background": hsl(24, 8, 6),
  "dark/card": hsl(24, 6, 7),
};
const BAND = { light: 0.5, dark: 0.8 };

say("═══ 1 · THE ANCHOR SET CLEARED (read from index.css at run time) ═══");
const wax = meanCrayonChroma(css);
say(`mean crayon chroma from ${wax.hexes.join(" ")} = ${wax.chroma.toFixed(4)} → CHROMA ${CHROMA}`);

for (const variant of ["literal", "scaled"]) {
  const w = buildWalk(css, variant);
  if (variant === "literal") {
    say(`reserved ink hexes: ${w.reserved.length}`);
    const byHue = [...w.reserved].sort((a, b) => a.h - b.h);
    say("name | hex | oklch h | arc [h-12, h+12]");
    for (const r of byHue)
      say(
        `  ${r.name.padEnd(16)} ${r.hex}  h=${r.h.toFixed(1).padStart(5)}  ` +
          `[${(r.h - GUARD_DEG).toFixed(1)}, ${(r.h + GUARD_DEG).toFixed(1)}]`,
      );
    say();
    say("═══ 2 · THE ARCS ═══");
    say(`merged reserved arcs (${w.arcs.length}), total ${measure(w.arcs).toFixed(1)}deg:`);
    for (const [a, b] of w.arcs) say(`  RESERVED [${a.toFixed(1)}, ${b.toFixed(1)}]  ${(b - a).toFixed(1)}deg`);
    say(`open arcs (${w.open.length}), total OPEN = ${w.L.toFixed(1)}deg:`);
    for (const [a, b] of w.open) say(`  OPEN     [${a.toFixed(1)}, ${b.toFixed(1)}]  ${(b - a).toFixed(1)}deg`);
    say();
  }

  say(`═══ 3 · THE WALK (${variant}) — step ${w.step.toFixed(4)}deg of arclength on OPEN=${w.L.toFixed(1)} ═══`);
  const N = 40;
  const hues = Array.from({ length: N }, (_, i) => w.hueAt(i));
  say("first 16: " + hues.slice(0, 16).map((h) => h.toFixed(1)).join(" "));
  for (const n of [4, 8, 16, 24, 40]) {
    let minHue = 360,
      pairH = null,
      minPos = 1e9;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) {
        const d = gap(hues[i], hues[j]);
        if (d < minHue) (minHue = d), (pairH = [i, j]);
        const dp = Math.min(
          Math.abs(w.posAt(i) - w.posAt(j)),
          w.L - Math.abs(w.posAt(i) - w.posAt(j)),
        );
        if (dp < minPos) minPos = dp;
      }
    say(
      `  min separation over first ${String(n).padStart(2)}: HUE ${minHue.toFixed(2)}deg (i=${pairH[0]}, j=${pairH[1]})` +
        ` · arclength ${minPos.toFixed(2)}deg`,
    );
  }
  // nearest reserved, by construction
  const wk = buildWalk(css, variant);
  let worst = { d: 360 };
  for (let i = 0; i < 16; i++)
    for (const r of wk.reserved) {
      const d = gap(wk.hueAt(i), r.h);
      if (d < worst.d) worst = { d, i, name: r.name, hex: r.hex, h: r.h };
    }
  say(
    `  closest approach to a reserved ink over the first 16: ${worst.d.toFixed(2)}deg ` +
      `(i=${worst.i} vs --color-${worst.name} ${worst.hex} h=${worst.h.toFixed(1)})`,
  );
  say();
}

// ── the chosen variant for everything downstream ────────────────────────────────────────
const VARIANT = process.env.PAL_WALK_VARIANT || "literal";
const w = buildWalk(css, VARIANT);
say(`═══ 4 · sRGB GAMUT at C ${CHROMA} (variant=${VARIANT}) ═══`);
for (const [theme, L] of Object.entries(BAND)) {
  let out = 0;
  const outIdx = [];
  for (let i = 0; i < 144; i++) if (!inGamut(L, CHROMA, w.hueAt(i))) (out++, outIdx.push(i));
  // distinct painted colours after the engine clips
  const painted = new Set(
    Array.from({ length: 144 }, (_, i) => oklchToSrgb255(L, CHROMA, w.hueAt(i)).join(",")),
  );
  const painted16 = new Set(
    Array.from({ length: 16 }, (_, i) => oklchToSrgb255(L, CHROMA, w.hueAt(i)).join(",")),
  );
  // how many clipped PAIRS land within 1 byte of each other (paint alike)
  let alike = 0;
  for (let i = 0; i < 16; i++)
    for (let j = i + 1; j < 16; j++) {
      const a = oklchToSrgb255(L, CHROMA, w.hueAt(i));
      const b = oklchToSrgb255(L, CHROMA, w.hueAt(j));
      if (a.every((v, k) => Math.abs(v - b[k]) <= 2)) alike++;
    }
  say(
    `  ${theme} L=${L}: out of sRGB ${out}/144 (first 16: ${outIdx.filter((i) => i < 16).join(",") || "none"})` +
      ` · distinct painted 144→${painted.size}, 16→${painted16.size} · within-2-byte pairs in first 16: ${alike}`,
  );
  // the same at the SHIPPED chroma, for the delta
  let out11 = 0;
  for (let i = 0; i < 144; i++) if (!inGamut(L, 0.11, ((i * STEP_DEG) % 360))) out11++;
  say(`    (shipped walk, C 0.110, full circle: out of sRGB ${out11}/144)`);
}
say();

say(`═══ 5 · CONTRAST, arithmetic (engine bytes are the probe's job) ═══`);
for (const [name, rgb] of Object.entries(GROUNDS)) {
  const L = name.startsWith("light") ? BAND.light : BAND.dark;
  let worst = { r: 99 },
    best = { r: 0 };
  for (let i = 0; i < 144; i++) {
    const r = contrast(oklchToSrgb255(L, CHROMA, w.hueAt(i)), rgb);
    if (r < worst.r) worst = { r, i, h: w.hueAt(i) };
    if (r > best.r) best = { r, i };
  }
  say(
    `  ${name.padEnd(18)} worst ${worst.r.toFixed(2)}:1 @ i=${worst.i} (h=${worst.h.toFixed(1)}) · best ${best.r.toFixed(2)}:1`,
  );
  // the drawn pressures
  for (const [label, alpha] of [["cursor ring 0.55", 0.55], ["join trace 0.95", 0.95]]) {
    let wr = { r: 99 };
    for (let i = 0; i < 144; i++) {
      const fg = oklchToSrgb255(L, CHROMA, w.hueAt(i));
      const blended = fg.map((v, k) => Math.round(alpha * v + (1 - alpha) * rgb[k]));
      const r = contrast(blended, rgb);
      if (r < wr.r) wr = { r, i };
    }
    say(`      ${label}: worst ${wr.r.toFixed(2)}:1 @ i=${wr.i}  ${wr.r >= 3 ? "PASS" : "FAIL"} (3:1 non-text)`);
  }
}
say();

say("═══ 6 · THE FIRST SIXTEEN, printed ═══");
say(" i | hue   | light hex | dark hex");
for (let i = 0; i < 16; i++) {
  const h = w.hueAt(i);
  const lt = oklchToSrgb255(0.5, CHROMA, h);
  const dk = oklchToSrgb255(0.8, CHROMA, h);
  const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
  say(
    `${String(i).padStart(2)} | ${h.toFixed(1).padStart(5)} | ${hex(lt)}   | ${hex(dk)}`,
  );
}
