/**
 * MRK-WASH pass-1 · W5–W8 — the phone, the modality, the tree, the wobble law, and the frames.
 *
 *   A  THE INVERTED GROUND, by pixels. `invert.mjs` reads it through computed styles, which
 *      this lane has already caught lying inside a 150ms colour transition; this arm reads the
 *      painted bytes instead, which is the number the record stands on.
 *   B  393×699 dpr3 — the wash at phone scale, and R3-i re-read: which mark paints on TAP.
 *   C  R3-j re-read: mouse click vs key, under the wash.
 *   D  `a11y.spec.ts:536`'s own census (`getByRole('img')` total vs named) under the wash: the
 *      wash changes paint, never nodes, so the count must not move.
 *   E  R3-a's LAW under the wash. The geometry is the SAME `wobbleRect` path; filling it
 *      instead of stroking it cannot move σ. What moves is whether σ is the right question:
 *      a wash has no edge to be straight, so the ring's 7.9×-below-the-floor reading stops
 *      being a defect and starts being undefined. Both readings are banked.
 *   F  A rAF trace during arrow traversal at 393×699 dpr3, CONTROL and wash.
 */
import { chromium, webkit, devices } from "playwright";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HERE, bank, decode, sampleRect, ratio, boardReady, cellCensus, focusCell } from "./lib.mjs";

const WASH_CSS = readFileSync(join(HERE, "..", "proto", "wash-board.css"), "utf8");
const GROUND_CSS = readFileSync(join(HERE, "..", "proto", "wax-ground.css"), "utf8");
const INVERT_CSS = readFileSync(join(HERE, "..", "proto", "wax-ground-invert.css"), "utf8");

const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const medPx = (px) => [med(px.map((p) => p[0])), med(px.map((p) => p[1])), med(px.map((p) => p[2]))];
function boxPixels(img, rect, dpr, inset = 0.12) {
  const x0 = Math.max(0, Math.round((rect.x + rect.width * inset) * dpr));
  const x1 = Math.min(img.w, Math.round((rect.x + rect.width * (1 - inset)) * dpr));
  const y0 = Math.max(0, Math.round((rect.y + rect.height * inset) * dpr));
  const y1 = Math.min(img.h, Math.round((rect.y + rect.height * (1 - inset)) * dpr));
  const px = [];
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = (y * img.w + x) * img.ch;
      px.push([img.data[i], img.data[i + 1], img.data[i + 2]]);
    }
  return px;
}

const out = {};
for (const engineName of ["chromium", "webkit"]) {
  const engine = engineName === "chromium" ? chromium : webkit;
  const browser = await engine.launch();
  const key = engineName;
  out[key] = {};

  // ── A · THE INVERTED GROUND, BY PIXELS (desk, light and dark) ──
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await boardReady(page);
    await page.keyboard.press("Tab");
    const rect = await page.evaluate(() => {
      const el = document.querySelector(".controls-card .icon-btn");
      const b = el.getBoundingClientRect();
      return { x: b.x, y: b.y, width: b.width, height: b.height };
    });
    const rows = [];
    // CONTROL first, with nothing injected.
    await page.evaluate(() => document.querySelector(".controls-card .icon-btn").blur());
    await page.waitForTimeout(400);
    const base = medPx(boxPixels(await decode(await page.screenshot({ type: "png" })), rect, 1));
    await page.addStyleTag({ content: GROUND_CSS });
    await page.addStyleTag({ content: INVERT_CSS });
    for (const a of ["0%", "40%", "55%", "65%", "75%", "85%"]) {
      await page.evaluate((a) => document.documentElement.style.setProperty("--ground-a", a), a);
      await page.evaluate(() => {
        const el = document.querySelector(".controls-card .icon-btn");
        el.focus();
        if (!el.matches(":focus-visible")) el.classList.add("wax-probe-focus");
      });
      await page.waitForTimeout(450); // settle `transition-colors 150ms`
      const img = await decode(await page.screenshot({ type: "png" }));
      const px = boxPixels(img, rect, 1);
      const byL = px.map((p) => [0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2], p]).sort((x, y) => x[0] - y[0]);
      const ground = medPx(px);
      const ink = medPx(byL.slice(0, Math.max(1, Math.floor(byL.length * 0.05))).map((r) => r[1]));
      const inkLight = medPx(byL.slice(-Math.max(1, Math.floor(byL.length * 0.05))).map((r) => r[1]));
      rows.push({
        alpha: a,
        ground,
        findRatio: ratio(ground, base),
        textRatioDark: ratio(ink, ground),
        textRatioLight: ratio(inkLight, ground),
      });
    }
    out[key][`invert-${theme}`] = { base, rows };
    console.log(
      `INVERTPX ${key} ${theme} :: ` +
        rows.map((r) => `${r.alpha} find=${r.findRatio} text=${Math.max(r.textRatioDark, r.textRatioLight)}`).join(" | "),
    );
    await ctx.close();
  }

  // ── B–F · THE PHONE ──
  const ctx = await browser.newContext({
    viewport: { width: 393, height: 699 },
    deviceScaleFactor: 3,
    isMobile: engineName === "chromium",
    hasTouch: true,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await boardReady(page);

  const readTier = () =>
    page.evaluate(() => {
      const p = document.querySelector(".game-cell.is-active .cell-ghost-path, .game-cell:has(input:focus-visible) .cell-ghost-path");
      if (!p) return null;
      const cs = getComputedStyle(p);
      return {
        stroke: cs.stroke,
        strokeWidth: cs.strokeWidth,
        strokeOpacity: cs.strokeOpacity,
        fill: cs.fill,
        fillOpacity: cs.fillOpacity,
        filter: cs.filter,
      };
    });

  const traverse = async () => {
    await page.evaluate(() => {
      window.__f = [];
      let last = performance.now();
      const tick = (t) => {
        window.__f.push(t - last);
        last = t;
        window.__raf = requestAnimationFrame(tick);
      };
      window.__raf = requestAnimationFrame(tick);
    });
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(110);
    }
    return page.evaluate(() => {
      cancelAnimationFrame(window.__raf);
      const f = window.__f.slice(2);
      f.sort((a, b) => a - b);
      return {
        frames: f.length,
        median: Math.round(f[Math.floor(f.length / 2)] * 100) / 100,
        p95: Math.round(f[Math.floor(f.length * 0.95)] * 100) / 100,
        over33: f.filter((x) => x > 33).length,
        max: Math.round(f[f.length - 1] * 100) / 100,
      };
    });
  };

  const imageCensus = async () => {
    const total = await page.getByRole("img").count();
    const named = await page.getByRole("img", { name: /\S/ }).count();
    return { total, named, unnamed: total - named };
  };

  const ghostSigma = () =>
    page.evaluate(() => {
      const el = document.querySelector(".game-cell:has(input:focus-visible) .cell-ghost-path");
      if (!el) return null;
      const svg = el.ownerSVGElement;
      const scale = svg.getBoundingClientRect().width / (svg.viewBox.baseVal.width || 1);
      const total = el.getTotalLength();
      const pts = [];
      for (let i = 0; i <= 32; i++) {
        const p = el.getPointAtLength(total * (0.02 + 0.2 * (i / 32)));
        pts.push([p.x * scale, p.y * scale]);
      }
      const [ax, ay] = pts[0];
      const [bx, by] = pts[pts.length - 1];
      const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
      let s = 0;
      for (const [x, y] of pts) {
        const d = Math.abs((x - ax) * dy - (y - ay) * dx) / len;
        s += d * d;
      }
      return Math.round(Math.sqrt(s / pts.length) * 1000) / 1000;
    });

  const cells = await cellCensus(page);
  const mid = cells.filter((c) => c.empty && c.i > 20 && c.i < 60);
  const sel = mid[Math.floor(mid.length / 2)];

  const arm = async (label) => {
    // TAP
    await page.tap(`.game-cell >> nth=${sel.i}`).catch(() => {});
    await page.waitForTimeout(350);
    const onTap = await readTier();
    const tapFocusVisible = await page.evaluate(
      () => document.querySelectorAll(".game-cell:has(input:focus-visible)").length,
    );
    // MOUSE CLICK
    await page.mouse.click(sel.rect.x + sel.rect.width / 2, sel.rect.y + sel.rect.height / 2);
    await page.waitForTimeout(350);
    const onClick = await readTier();
    // KEY
    await focusCell(page, sel.i);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(350);
    const onKey = await readTier();
    const img = await decode(await page.screenshot({ type: "png" }));
    const c2 = await cellCensus(page);
    const focused = c2.find((c) => c.focused) ?? c2[sel.i];
    const neutral = c2.find((c) => !c.peer && c.empty && !c.focused);
    const washPx = medPx(boxPixels(img, focused.rect, 3, 0.28));
    const neutralPx = medPx(boxPixels(img, neutral.rect, 3, 0.28));
    return {
      arm: label,
      onTap,
      onClick,
      onKey,
      tapFocusVisible,
      phoneScale: Math.round((focused.rect.width / (1000 / 9)) * 1000) / 1000,
      washVsNeutral: ratio(washPx, neutralPx),
      sigma: await ghostSigma(),
      images: await imageCensus(),
      frames: await traverse(),
    };
  };

  out[key].phoneControl = await arm("CONTROL-head");
  await page.addStyleTag({ content: WASH_CSS });
  await page.evaluate(() => {
    const s = document.documentElement.style;
    s.setProperty("--wash-a", "0.12");
    s.setProperty("--wash-rim-w", "3");
    s.setProperty("--wash-rim-o", "0.95");
  });
  out[key].phoneWash = await arm("wash-a12-rim3");

  console.log(`PHONE ${key} CONTROL ${JSON.stringify(out[key].phoneControl)}`);
  console.log(`PHONE ${key} WASH    ${JSON.stringify(out[key].phoneWash)}`);
  await ctx.close();
  await browser.close();
}
bank("phone-invert-frames.json", out);
