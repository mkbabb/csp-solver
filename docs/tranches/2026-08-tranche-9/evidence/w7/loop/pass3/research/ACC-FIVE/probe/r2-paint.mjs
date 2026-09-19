#!/usr/bin/env node
/** ACC-FIVE pass-3 RESEARCH r2 — THE PAINT, ON THE HEAD CONTROL (74a2b5d9).
 *
 *  Five arms, all read-only, all on the frozen main tree served at :4236. Nothing here
 *  needs the prototype: the gauge's geometry (`stroke-width="8"` inside the frame's
 *  `stroke-width="12"`, both at `stroke-opacity="0.95"`) and its two grounds are the same
 *  at HEAD as under `poseFronts`, so a colour read taken here transfers, and the HEAD row
 *  the pass-2 record never measured comes free.
 *
 *  A · GROUND, uncontaminated by construction. At `progress === 0` the trace's `v-for`
 *      yields nothing (HandDrawnGrid.vue:463) — there is no trace in the DOM at all — so the
 *      frame line's painted bytes are read off a board that has no gauge on it. The critic
 *      sampled an untraced EDGE; this samples an untraced BOARD.
 *  B · THE WORST-OF-FOUR AT HEAD, PAINTED (critic row 3): the violet, both engines, both
 *      themes, against the ground of arm A.
 *  C · THE CANDIDATE SWEEP. `--color-progress-ink` is re-bound on the root and the band
 *      re-read: the incumbents, the pass-2 proposal, and r1's corridor picks — each at
 *      `stroke-opacity` 0.95 AND 1. The alpha is a real lever: at 0.95 the gauge blends 5%
 *      of the very line it must stay 3:1 below INTO itself.
 *  D · THE CROSSING PROFILE. A perpendicular scan through the top frame edge, traced and
 *      untraced, printed as pixel runs. This is what decides whether the frame line is an
 *      ADJACENT colour (so 1.4.11 binds against it) or an occluded one (so the card is the
 *      operative ground): a 12-unit graphite stroke under an 8-unit gold one leaves a
 *      graphite flank on each side, and here it is measured rather than reasoned.
 *  E · THE PHONE, 393x699 dpr3 (never measured): board box, painted stroke widths, and the
 *      same ratios at that scale.
 *  F · THE PAINT COST of the thing pass 2 asserted: four ~490-point `d` rewrites per frame,
 *      timed in a rAF loop against a no-rewrite control. This is the price of tweening the
 *      FRACTION (critic rows 11 and 12), in frames rather than in prose.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, srgbToLinear, hueDist } from "./oklch.COPY.mjs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4236";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node r2-paint.mjs <out.json>");

const lum = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};
const GOLD = { light: 83.7, dark: 95.2 };

const CANDIDATES = {
  light: [
    ["HEAD violet", "#8b5cf6"],
    ["pass2 gold", "#a47903"],
    ["r1 corridor C.122", "#a87e13"],
    ["r1 corridor C.126", "#aa7e06"],
  ],
  dark: [
    ["HEAD violet", "#7c3aed"],
    ["pass2 gold", "#7d6902"],
    ["r1 corridor C.100", "#79650f"],
    ["r1 corridor C.080", "#75662c"],
    ["r1 corridor C.076", "#74662f"],
  ],
};
const ALPHAS = [0.95, 1];

async function grid(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const at = (x, y) => {
    const o = (y * info.width + x) * ch;
    return [data[o], data[o + 1], data[o + 2]];
  };
  return { at, w: info.width, h: info.height };
}

/** the modal colour (the paper) and the achromatic extreme (the frame line) of a strip */
function groundOf(img, scheme) {
  const freq = new Map();
  let line = null;
  for (let y = 0; y < img.h; y++)
    for (let x = 0; x < img.w; x++) {
      const rgb = img.at(x, y);
      const o = rgbToOklch(...rgb);
      const k = rgb.join(",");
      freq.set(k, (freq.get(k) || 0) + 1);
      if (o.C > 0.03) continue;
      const better = scheme === "light" ? !line || o.L < line.L : !line || o.L > line.L;
      if (better) line = { rgb, ...o };
    }
  const paper = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  return { paper, line: line && { rgb: line.rgb, L: +line.L.toFixed(4) } };
}

/** the most chromatic pixel of a strip = the stroke's core */
function coreOf(img) {
  let core = null;
  for (let y = 0; y < img.h; y++)
    for (let x = 0; x < img.w; x++) {
      const rgb = img.at(x, y);
      const o = rgbToOklch(...rgb);
      if (!core || o.C > core.C) core = { rgb, ...o };
    }
  return core && { rgb: core.rgb, C: +core.C.toFixed(3), L: +core.L.toFixed(3), h: +core.h.toFixed(1) };
}

/** one perpendicular column through the top edge, as classified runs */
function column(img, x, paper) {
  const Lp = lum(paper);
  const out = [];
  for (let y = 0; y < img.h; y++) {
    const rgb = img.at(x, y);
    const o = rgbToOklch(...rgb);
    const kind =
      o.C >= 0.04 ? "ink" : Math.abs(lum(rgb) - Lp) < 0.02 ? "paper" : "graphite";
    out.push({ y, rgb, kind });
  }
  const runs = [];
  for (const p of out) {
    const last = runs[runs.length - 1];
    if (last && last.kind === p.kind) last.n++;
    else runs.push({ kind: p.kind, n: 1, first: p.rgb });
  }
  return { runs, px: out.map((p) => `${p.kind[0]}:${p.rgb.join(",")}`) };
}

const BENCH = () => {
  const paths = Array.from(document.querySelectorAll(".progress-trace"));
  if (!paths.length) return { error: "no .progress-trace" };
  const ds = paths.map((p) => p.getAttribute("d"));
  const points = ds.map((d) => (d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).length / 2);
  // 30 truncations per path, precomputed so the loop measures PAINT, not string work
  const variants = ds.map((d) => {
    const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
    const pts = [];
    for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
    const out = [];
    for (let k = 0; k < 30; k++) {
      const n = Math.max(2, Math.round((pts.length * (0.5 + k / 100)) / 1));
      out.push("M" + pts.slice(0, n).map((p) => p.join(",")).join("L"));
    }
    return out;
  });
  const run = (rewrite) =>
    new Promise((res) => {
      const frames = [];
      let i = 0;
      let last = performance.now();
      const tick = () => {
        const now = performance.now();
        frames.push(now - last);
        last = now;
        if (rewrite) for (let p = 0; p < paths.length; p++) paths[p].setAttribute("d", variants[p][i % 30]);
        i++;
        if (i < 62) requestAnimationFrame(tick);
        else {
          const f = frames.slice(2).sort((a, b) => a - b);
          res({
            n: f.length,
            medianMs: +f[f.length >> 1].toFixed(2),
            p95Ms: +f[Math.floor(f.length * 0.95)].toFixed(2),
            maxMs: +f[f.length - 1].toFixed(2),
            over20ms: f.filter((x) => x > 20).length,
          });
        }
      };
      requestAnimationFrame(tick);
    });
  return (async () => {
    const control = await run(false);
    const rewriting = await run(true);
    for (let p = 0; p < paths.length; p++) paths[p].setAttribute("d", ds[p]);
    return { pointsPerPath: points, control, rewriting };
  })();
};

const rows = { arms: {}, phone: {}, bench: {}, meta: { base: BASE, control: "74a2b5d9" } };

for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  for (const scheme of ["light", "dark"]) {
    const cell = `${eng}/${scheme}`;
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      colorScheme: scheme,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1200);

    const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    const strip = (x0, x1) => ({
      x: Math.round(box.x + box.width * x0),
      y: Math.round(box.y - 10),
      width: Math.max(2, Math.round(box.width * (x1 - x0))),
      height: 26,
    });
    const shot = (clip) => page.screenshot({ clip, type: "png" });

    // ── A · the ground, on a board with NO gauge (progress 0 renders no trace node) ──
    const traceNodes0 = await page.evaluate(() => document.querySelectorAll(".progress-trace").length);
    const g0 = await grid(await shot(strip(0.15, 0.55)));
    const ground = groundOf(g0, scheme);
    const prof0 = column(g0, Math.round(g0.w / 2), ground.paper);

    // ── two digits: the front lands mid-top-edge, as the critic's run did ──
    for (let k = 0; k < 2; k++) {
      const ok = await page.evaluate(() => {
        const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
          (i) => !i.readOnly && !i.value,
        );
        if (!ins[0]) return false;
        ins[0].focus();
        return true;
      });
      if (!ok) break;
      await page.keyboard.type("5");
      await page.waitForTimeout(140);
    }
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.waitForTimeout(700);
    const valuenow = await page.evaluate(() => {
      const el = document.querySelector('[role="progressbar"]');
      return el ? el.getAttribute("aria-valuenow") : null;
    });
    const geom = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const f = document.querySelector(".frame-line");
      const svg = document.querySelector("svg.hand-drawn-grid");
      const r = svg?.getBoundingClientRect();
      const seg = (el) => (el?.getAttribute("d")?.match(/[ML]/gi) || []).length;
      return {
        boardCssPx: r ? +r.width.toFixed(1) : null,
        viewBox: svg?.getAttribute("viewBox"),
        traceSegments: seg(t),
        frameSegments: seg(f),
        traceStrokeUnits: t ? +getComputedStyle(t).strokeWidth.replace("px", "") : null,
        frameStrokeUnits: f ? +getComputedStyle(f).strokeWidth.replace("px", "") : null,
        traceOpacity: t ? getComputedStyle(t).strokeOpacity : null,
        frameOpacity: f ? getComputedStyle(f).strokeOpacity : null,
        traceNodes: document.querySelectorAll(".progress-trace").length,
        bakedHidden: !!document.querySelector(".baked-hidden"),
      };
    });

    // ── C · the candidate sweep ──
    const sweep = [];
    for (const [name, hexv] of CANDIDATES[scheme]) {
      for (const alpha of ALPHAS) {
        await page.evaluate(
          ({ hexv, alpha }) => {
            document.documentElement.style.setProperty("--color-progress-ink", hexv);
            let s = document.getElementById("acc5-alpha");
            if (!s) {
              s = document.createElement("style");
              s.id = "acc5-alpha";
              document.head.appendChild(s);
            }
            s.textContent = `.progress-trace { stroke-opacity: ${alpha} !important; }`;
          },
          { hexv, alpha },
        );
        await page.waitForTimeout(260);
        const img = await grid(await shot(strip(0.15, 0.55)));
        const core = coreOf(img);
        sweep.push({
          name,
          hex: hexv,
          alpha,
          corePainted: core,
          vsFrameLine: core && ratio(core.rgb, ground.line.rgb),
          vsPaper: core && ratio(core.rgb, ground.paper),
          worstOfTwo: core && Math.min(ratio(core.rgb, ground.line.rgb), ratio(core.rgb, ground.paper)),
          dHueFromCrayonGold: core && +hueDist(core.h, GOLD[scheme]).toFixed(2),
        });
        console.log(
          `  ${cell} ${name} ${hexv} a=${alpha}: core ${core?.rgb} line ${sweep.at(-1).vsFrameLine} paper ${sweep.at(-1).vsPaper}`,
        );
      }
    }

    // ── D · the crossing profile, at the pass-2 ink and alpha ──
    await page.evaluate(({ hexv }) => {
      document.documentElement.style.setProperty("--color-progress-ink", hexv);
      document.getElementById("acc5-alpha").textContent =
        `.progress-trace { stroke-opacity: 0.95 !important; }`;
    }, { hexv: scheme === "dark" ? "#7d6902" : "#a47903" });
    await page.waitForTimeout(300);
    const gT = await grid(await shot(strip(0.2, 0.32))); // traced (front passes here)
    const gU = await grid(await shot(strip(0.78, 0.9))); // untraced at ~15%
    const profile = {
      tracedColumns: [0.25, 0.5, 0.75].map((f) =>
        column(gT, Math.round(gT.w * f), ground.paper),
      ),
      untracedColumns: [0.5].map((f) => column(gU, Math.round(gU.w * f), ground.paper)),
      atProgressZero: prof0,
    };

    rows.arms[cell] = {
      valuenow,
      traceNodesAtProgressZero: traceNodes0,
      ground,
      geom,
      sweep,
      profile,
    };
    console.log(`  ${cell} done (valuenow ${valuenow}, board ${geom.boardCssPx}px)`);
    await ctx.close();

    // ── E · the phone ──
    const pctx = await browser.newContext({
      viewport: { width: 393, height: 699 },
      deviceScaleFactor: 3,
      colorScheme: scheme,
      isMobile: eng === "chromium",
      hasTouch: true,
      reducedMotion: "reduce",
    });
    const ppage = await pctx.newPage();
    await ppage.goto(`${BASE}/?size=3&difficulty=EASY`);
    await ppage.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await ppage.waitForTimeout(1400);
    for (let k = 0; k < 2; k++) {
      const ok = await ppage.evaluate(() => {
        const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
          (i) => !i.readOnly && !i.value,
        );
        if (!ins[0]) return false;
        ins[0].focus();
        return true;
      });
      if (!ok) break;
      await ppage.keyboard.type("5");
      await ppage.waitForTimeout(140);
    }
    await ppage.evaluate(() => document.activeElement?.blur?.());
    await ppage.waitForTimeout(700);
    const pgeom = await ppage.evaluate(() => {
      const svg = document.querySelector("svg.hand-drawn-grid");
      const r = svg?.getBoundingClientRect();
      const t = document.querySelector(".progress-trace");
      const vb = +(svg?.getAttribute("viewBox")?.split(/\s+/)[2] ?? 1000);
      const w = t ? +getComputedStyle(t).strokeWidth.replace("px", "") : null;
      return {
        boardCssPx: r ? +r.width.toFixed(1) : null,
        viewBoxUnits: vb,
        traceStrokeCssPx: r && w ? +((w * r.width) / vb).toFixed(2) : null,
        frameStrokeCssPx: r ? +((12 * r.width) / vb).toFixed(2) : null,
        valuenow: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow"),
        dpr: window.devicePixelRatio,
      };
    });
    const pbox = await ppage.locator("svg.hand-drawn-grid").first().boundingBox();
    const pimg = await grid(
      await ppage.screenshot({
        clip: {
          x: Math.round(pbox.x + pbox.width * 0.2),
          y: Math.round(pbox.y - 6),
          width: Math.max(2, Math.round(pbox.width * 0.12)),
          height: 20,
        },
        type: "png",
      }),
    );
    const pground = groundOf(pimg, scheme);
    const pcore = coreOf(pimg);
    rows.phone[cell] = {
      ...pgeom,
      ground: pground,
      corePainted: pcore,
      vsFrameLine: pcore && pground.line && ratio(pcore.rgb, pground.line.rgb),
      vsPaper: pcore && ratio(pcore.rgb, pground.paper),
      column: column(pimg, Math.round(pimg.w / 2), pground.paper),
    };
    console.log(`  ${cell} phone: board ${pgeom.boardCssPx} trace ${pgeom.traceStrokeCssPx}px`);
    await pctx.close();
  }

  // ── F · the paint cost, light only ──
  const bctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: "light",
  });
  const bpage = await bctx.newPage();
  await bpage.goto(`${BASE}/?size=3&difficulty=EASY`);
  await bpage.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await bpage.waitForTimeout(1200);
  for (let k = 0; k < 2; k++) {
    await bpage.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !i.readOnly && !i.value,
      );
      if (ins[0]) ins[0].focus();
    });
    await bpage.keyboard.type("5");
    await bpage.waitForTimeout(140);
  }
  await bpage.waitForTimeout(600);
  rows.bench[eng] = await bpage.evaluate(BENCH);
  console.log(`  ${eng} bench:`, JSON.stringify(rows.bench[eng]));
  await bctx.close();
  await browser.close();
}

writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.log("banked", OUT);
console.log("EXIT_OK");
