/**
 * MRK-WASH pass-1 PROTOTYPE · THE PHONE, THE FRAMES, AND FORCED COLORS.
 *
 *   MOBILE    393×699 dpr3, 9×9: the rim's visible width at this scale, the mark by state
 *             difference, tap = the wash, and the crop the brief asks for.
 *   FRAMES    a rAF trace across 14 arrow presses, REPEATED n = 5 per engine (the research lane
 *             saw ONE 34ms webkit frame in 92 on a single run; a single sample prices nothing).
 *   FORCED    `2px solid Highlight` at offset −2px survives the repaint, both engines.
 */
import { chromium, webkit, devices } from "playwright";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { FRAMES, bank, decode, sampleRect, lum, ratio, r2, cellCensus } from "./lib.mjs";

const lstar = (rgb) => {
  const y = lum(rgb);
  const f = y > 216 / 24389 ? Math.cbrt(y) : ((24389 / 27) * y) / 116 + 16 / 116;
  return 116 * f - 16;
};
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const medPx = (px) => [med(px.map((p) => p[0])), med(px.map((p) => p[1])), med(px.map((p) => p[2]))];

function isolate(on, off, rect, dpr, grow = 6) {
  const x0 = Math.max(0, Math.round((rect.x - grow) * dpr));
  const x1 = Math.min(on.w, Math.round((rect.x + rect.width + grow) * dpr));
  const y0 = Math.max(0, Math.round((rect.y - grow) * dpr));
  const y1 = Math.min(on.h, Math.round((rect.y + rect.height + grow) * dpr));
  const onPx = [], offPx = [], dPx = [];
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = (y * on.w + x) * on.ch;
      const a = [on.data[i], on.data[i + 1], on.data[i + 2]];
      const b = [off.data[i], off.data[i + 1], off.data[i + 2]];
      if (Math.abs(lstar(a) - lstar(b)) >= 1.0) { onPx.push(a); offPx.push(b); dPx.push(Math.abs(lstar(a) - lstar(b))); }
    }
  if (!onPx.length) return { areaPx: 0 };
  const order = dPx.map((d, i) => [d, i]).sort((a, b) => b[0] - a[0]);
  const top = order.slice(0, Math.max(1, Math.floor(order.length * 0.02)));
  return {
    areaPx: Math.round(onPx.length / (dpr * dpr)),
    body: medPx(onPx),
    edge: medPx(top.map((t) => onPx[t[1]])),
  };
}

const out = {};
for (const engineName of ["chromium", "webkit"]) {
  const engine = engineName === "chromium" ? chromium : webkit;
  const browser = await engine.launch();

  // ── the phone pose ──
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 393, height: 699 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      colorScheme: theme,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto("http://127.0.0.1:4240/?size=3&difficulty=EASY");
    await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
    await page.waitForTimeout(1600);

    const census = await cellCensus(page);
    const sel = census.filter((c) => c.empty && c.i > 20 && c.i < 60)[1];
    await page.evaluate(() => document.querySelector("button")?.focus());
    await page.waitForTimeout(260);
    const off = await decode(await page.screenshot({ type: "png" }));
    await page.locator(".game-cell").nth(sel.i).tap();
    await page.waitForTimeout(500);
    const on = await decode(await page.screenshot({ type: "png" }));
    const c2 = await cellCensus(page);
    const neutral = c2.find((c) => !c.peer && c.empty && !c.focused);
    const nb = sampleRect(on, neutral.rect, 3, 0.28);
    const iso = isolate(on, off, sel.rect, 3);

    const geom = await page.evaluate(() => {
      const cell = document.querySelector(".game-cell:has(input:focus-visible)");
      const p = cell?.querySelector(".cell-ghost-path");
      const svg = p?.ownerSVGElement;
      if (!p || !svg) return null;
      const cs = getComputedStyle(p);
      const vb = svg.viewBox.baseVal;
      const scale = svg.clientWidth / (vb.width || 1000);
      return {
        strokeWidthUser: parseFloat(cs.strokeWidth),
        scale: Math.round(scale * 10000) / 10000,
        strokeWidthPx: Math.round(parseFloat(cs.strokeWidth) * scale * 100) / 100,
        strokeOpacity: cs.strokeOpacity,
        fillOpacity: cs.fillOpacity,
        paintOrder: cs.paintOrder,
        tapFocusVisible: document.querySelectorAll(".game-cell:has(input:focus-visible)").length,
      };
    });

    const r = sel.rect;
    const clip = {
      x: Math.max(0, Math.round(r.x - 130)),
      y: Math.max(0, Math.round(r.y - 70)),
      width: 330,
      height: 210,
    };
    writeFileSync(join(FRAMES, `wash-phone-${theme}-${engineName}.png`), await page.screenshot({ clip, type: "png" }));

    out[`phone-${engineName}-${theme}`] = {
      geom,
      rimVisiblePx: geom ? r2(geom.strokeWidthPx / 2) : null,
      markEdge: iso.edge ? ratio(iso.edge, nb.median) : null,
      markBody: iso.body ? ratio(iso.body, nb.median) : null,
      areaPx: iso.areaPx,
    };
    console.log(
      `PHONE ${engineName}-${theme} :: rim ${geom?.strokeWidthPx}px (${r2(geom.strokeWidthPx / 2)} outside) ` +
        `paint-order=${geom?.paintOrder} tapFocusVisible=${geom?.tapFocusVisible} ` +
        `edge=${out[`phone-${engineName}-${theme}`].markEdge} body=${out[`phone-${engineName}-${theme}`].markBody}`,
    );
    await ctx.close();
  }

  // ── the frame trace, n = 5 ──
  const runs = [];
  for (let n = 0; n < 5; n++) {
    const ctx = await browser.newContext({
      viewport: { width: 393, height: 699 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      colorScheme: "light",
    });
    const page = await ctx.newPage();
    await page.goto("http://127.0.0.1:4240/?size=3&difficulty=EASY");
    await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
    await page.waitForTimeout(1800);
    await page.evaluate(() => document.querySelectorAll(".game-cell input")[30]?.focus());
    await page.waitForTimeout(400);
    await page.evaluate(() => {
      window.__f = [];
      let last = performance.now();
      const tick = (t) => { window.__f.push(t - last); last = t; requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press(i % 2 ? "ArrowRight" : "ArrowDown");
      await page.waitForTimeout(140);
    }
    const f = await page.evaluate(() => window.__f.slice(2));
    const s = [...f].sort((a, b) => a - b);
    runs.push({
      frames: f.length,
      median: r2(s[Math.floor(s.length / 2)]),
      p95: r2(s[Math.floor(s.length * 0.95)]),
      over33: f.filter((x) => x > 33).length,
      max: r2(Math.max(...f)),
    });
    await ctx.close();
  }
  out[`frames-${engineName}`] = runs;
  console.log(
    `FRAMES ${engineName} n=5 :: ` +
      runs.map((r) => `[${r.frames}f med=${r.median} p95=${r.p95} >33ms=${r.over33} max=${r.max}]`).join(" "),
  );

  // ── forced colors ──
  const fc = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: "light",
    forcedColors: "active",
    reducedMotion: "reduce",
  });
  const p = await fc.newPage();
  await p.goto("http://127.0.0.1:4240/?size=3&difficulty=EASY");
  await p.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await p.waitForTimeout(1400);
  await p.evaluate(() => document.querySelectorAll(".game-cell input")[40]?.focus());
  await p.waitForTimeout(400);
  out[`forced-${engineName}`] = await p.evaluate(() => {
    const cell = document.querySelector(".game-cell:has(input:focus-visible)");
    const cs = cell ? getComputedStyle(cell) : null;
    return cs
      ? { outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`, offset: cs.outlineOffset }
      : null;
  });
  console.log(`FORCED ${engineName} :: ${JSON.stringify(out[`forced-${engineName}`])}`);
  await fc.close();
  await browser.close();
}
bank("phone-frames-forced.json", out);
