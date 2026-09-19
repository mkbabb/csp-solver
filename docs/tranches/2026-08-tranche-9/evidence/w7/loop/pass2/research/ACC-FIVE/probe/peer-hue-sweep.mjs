/**
 * peer-hue-sweep.mjs — ACC-FIVE pass 2, row 3. The 40-index sweep the charter asks for, and
 * PLR-SELF / PLR-PLACE / PAL-TIN's to consume.
 *
 * `playerIdentity.ts:68` is `inkFor(i) = { "--color-user-ink":
 * "oklch(var(--peer-ink-l) 0.11 ((i*137.5)%360)deg)" }` with NO avoid-list. `--peer-ink-l` is
 * 0.5 light (index.css:162) and 0.8 dark (index.css:375). The nominal hue is arithmetic; the
 * PAINTED hue is not — an out-of-sRGB oklch() is gamut-mapped by the engine and the hue can
 * rotate. So this reads the painted bytes for all 40 indices in both engines and both themes,
 * and measures each index's OKLCH hue distance to every reserved accent the family claims.
 *
 * Reserved set (painted values, ACC-FIVE pass-1 readings re-resolved live here):
 *   progress-ink  (the fill gauge's trace, pre-win)
 *   gold-star     (the wax the trace lifts to at the win)
 *   user-ink      (your own pen -- a peer must not be you)
 *   focus-sketch  (the board's keyboard ring)
 *   red-ink       (the teacher's mark)
 *
 *   BASE=http://127.0.0.1:4236 OUT=<dir> node peer-hue-sweep.mjs
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const OUT = process.env.OUT || ".";
const RESERVED = [
  "--color-progress-ink",
  "--color-gold-star",
  "--color-user-ink",
  "--color-focus-sketch",
  "--color-red-ink",
];
const dHue = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return +Math.min(d, 360 - d).toFixed(2);
};

const out = {};
for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
    await page.waitForTimeout(500);

    const read = await page.evaluate((reserved) => {
      // getComputedStyle().color hands back `oklch(...)` verbatim in both engines, so every
      // colour here is resolved to sRGB BYTES through a 1x1 canvas -- the same read-back the
      // pass-1 lane used for the glow. A fillStyle the engine rejects is reported, never
      // silently read as black.
      const el = document.createElement("span");
      el.style.position = "absolute";
      el.style.opacity = "0";
      document.body.appendChild(el);
      const cv = document.createElement("canvas");
      cv.width = cv.height = 1;
      const g = cv.getContext("2d", { willReadFrequently: true });
      const bytesOf = (css) => {
        el.style.color = css;
        const computed = getComputedStyle(el).color;
        g.clearRect(0, 0, 1, 1);
        g.fillStyle = "#000000";
        g.fillStyle = computed;
        const accepted = g.fillStyle !== "#000000" || /^(rgb\(0, 0, 0\)|#000000)$/.test(computed);
        g.fillRect(0, 0, 1, 1);
        const d = g.getImageData(0, 0, 1, 1).data;
        return { computed, accepted, rgb: [d[0], d[1], d[2]] };
      };
      const band = getComputedStyle(document.documentElement)
        .getPropertyValue("--peer-ink-l")
        .trim();
      const peers = [];
      for (let i = 0; i < 40; i++) {
        const nominal = +(((i * 137.5) % 360).toFixed(1));
        peers.push({ i, nominalHue: nominal, ...bytesOf(`oklch(${band} 0.11 ${nominal}deg)`) });
      }
      const res = {};
      for (const t of reserved) res[t] = bytesOf(`var(${t})`);
      el.remove();
      return { band, peers, res };
    }, RESERVED);

    const resolved = {};
    for (const [k, v] of Object.entries(read.res)) {
      const [r, g, b] = v.rgb;
      const c = rgbToOklch(r, g, b);
      resolved[k] = {
        computed: v.computed,
        rgb: v.rgb,
        L: +c.L.toFixed(3),
        C: +c.C.toFixed(3),
        h: +c.h.toFixed(2),
      };
    }

    const rows = read.peers.map((p) => {
      const [r, g, b] = p.rgb;
      const c = rgbToOklch(r, g, b);
      const row = {
        i: p.i,
        nominalHue: p.nominalHue,
        computed: p.computed,
        rgb: p.rgb,
        accepted: p.accepted,
        L: +c.L.toFixed(3),
        C: +c.C.toFixed(3),
        h: +c.h.toFixed(2),
        hueRotationFromNominal: dHue(c.h, p.nominalHue),
        chromaHeld: +(c.C / 0.11).toFixed(3),
        d: {},
      };
      for (const t of RESERVED) row.d[t] = dHue(c.h, resolved[t].h);
      row.worst = Math.min(...Object.values(row.d));
      row.worstAgainst = Object.entries(row.d).find(([, v]) => v === row.worst)[0];
      return row;
    });

    const under = (deg) => rows.filter((r) => r.worst < deg).map((r) => r.i);
    out[`${engine}/${scheme}`] = {
      band: read.band,
      resolved,
      rows,
      collisionsUnder5: under(5),
      collisionsUnder10: under(10),
      collisionsUnder17_7: under(17.7),
      minSeparation: Math.min(...rows.map((r) => r.worst)),
    };
    console.log(
      `== ${engine} ${scheme} band ${read.band} | min separation ${Math.min(...rows.map((r) => r.worst))}° | <5°: [${under(5)}] | <10°: [${under(10)}] | <17.7°: [${under(17.7)}]`,
    );
    for (const r of rows.filter((x) => x.worst < 17.7))
      console.log(
        `    i=${String(r.i).padStart(2)} h=${String(r.h).padStart(6)} (nominal ${r.nominalHue}, rot ${r.hueRotationFromNominal}°, C ${r.C}) worst ${r.worst}° vs ${r.worstAgainst}`,
      );
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(`${OUT}/peer-hue-sweep.json`, JSON.stringify(out, null, 2));
console.log("banked", `${OUT}/peer-hue-sweep.json`);
