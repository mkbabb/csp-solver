#!/usr/bin/env node
/**
 * CTRL-COST PROTOTYPE · G7 the seam · G9 contrast from painted bytes · the crops.
 *
 *   G7  `.drawer-case` top − the wordmark's bottom at 390×844 / 375×812 / 430×932, sheet
 *       settled ≥950ms, both engines. ≥ 0 is the guard.
 *   G9  the asked word, the band name, a row caption and the `no` line, each read from the
 *       ENGINE'S OWN PIXELS: clip → `sharp` raw → the 2nd/98th percentile luminance pair →
 *       WCAG ratio. The composited ratio (computed colour over computed paper, the estate's
 *       own `access.spec.ts` method) is printed beside it as the control: painted bytes are
 *       the truth about what a reader sees and antialiasing pulls them DOWN, so the pair
 *       together is the honest reading and a single number is not.
 *   CROPS the poses the brief names, each ≤150 KB.
 *
 * Usage: node seam-contrast-crops.mjs <readings.json> <frames-dir>
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { chromium, webkit } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:4233";
const [OUT, FRAMES] = process.argv.slice(2);
fs.mkdirSync(FRAMES, { recursive: true });

const lum = (r, g, b) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);

async function load(page, { open = true } = {}) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
  await page.waitForTimeout(1200);
  const shut = await page.evaluate(() =>
    document.documentElement.classList.contains("drawer-closed"),
  );
  if (open && shut) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
}

/** Dirty the board (fill), then arm `deal` — the ask only exists on a dirty board. */
async function armDeal(page) {
  const fill = page.locator('button[aria-label^="Fill in every cell"]').first();
  await fill.scrollIntoViewIfNeeded().catch(() => {});
  await fill.click({ force: true });
  await page.waitForTimeout(1500);
  const deal = page.locator(".deal-btn").first();
  await deal.scrollIntoViewIfNeeded().catch(() => {});
  await deal.click({ force: true });
  await page.waitForTimeout(350);
  return page.evaluate(() => {
    const w = document.querySelector(".deal-btn .act-word.is-armed");
    return {
      armed: !!w && getComputedStyle(w).visibility === "visible",
      word: w?.innerText.trim(),
    };
  });
}

/** Painted-bytes ratio over one node's own box, plus the composited control. */
async function inkRatio(page, sel, label, out, tag) {
  const meta = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    el.scrollIntoView({ block: "center" });
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    // the painted paper behind it: walk up to the first non-transparent background
    let p = el;
    let paper = "";
    while (p && !paper) {
      const bg = getComputedStyle(p).backgroundColor;
      if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) paper = bg;
      p = p.parentElement;
    }
    return {
      box: { x: r.x, y: r.y, width: r.width, height: r.height },
      color: cs.color,
      paper,
      text: el.innerText.trim().slice(0, 20),
      visible: cs.visibility === "visible" && +cs.opacity > 0.05,
    };
  }, sel);
  if (!meta || !meta.visible || meta.box.width < 2 || meta.box.height < 2) {
    out[`${label} · ${tag}`] = { error: "not painted", meta };
    return;
  }
  await page.waitForTimeout(120);
  const vp = page.viewportSize();
  const clip = {
    x: Math.max(0, Math.floor(meta.box.x)),
    y: Math.max(0, Math.floor(meta.box.y)),
    width: Math.min(Math.ceil(meta.box.width), vp.width - Math.floor(meta.box.x)),
    height: Math.min(Math.ceil(meta.box.height), vp.height - Math.floor(meta.box.y)),
  };
  if (clip.width < 2 || clip.height < 2 || clip.y + clip.height > vp.height) {
    out[`${label} · ${tag}`] = { error: "off-screen", clip };
    return;
  }
  const buf = await page.screenshot({ clip });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ls = [];
  for (let i = 0; i < data.length; i += info.channels)
    ls.push(lum(data[i], data[i + 1], data[i + 2]));
  ls.sort((a, b) => a - b);
  const p = (q) => ls[Math.min(ls.length - 1, Math.max(0, Math.round((ls.length - 1) * q)))];
  const painted = ratio(p(0.02), p(0.98));
  // the composited control, the estate's own method (colour over paper, both computed)
  const parse = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  const [cr, cg, cb] = parse(meta.color);
  const [pr, pg, pb] = parse(meta.paper || "rgb(255,255,255)");
  out[`${label} · ${tag}`] = {
    painted,
    composited: ratio(lum(cr, cg, cb), lum(pr, pg, pb)),
    n: ls.length,
    ink: meta.color,
    paper: meta.paper,
    text: meta.text,
  };
}

const out = { seam: {}, contrast: {}, crops: [] };

for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();

  // ── G7 · the seam sweep ────────────────────────────────────────────────────────────────
  for (const [w, h] of [
    [390, 844],
    [375, 812],
    [430, 932],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      hasTouch: true,
      isMobile: engine === "chromium",
      deviceScaleFactor: 2,
      baseURL: BASE,
    });
    const page = await ctx.newPage();
    await load(page);
    const r = await page.evaluate(() => {
      const c = document.querySelector(".drawer-case")?.getBoundingClientRect();
      const l = document.querySelector("svg.handwritten-logo")?.getBoundingClientRect();
      return c && l
        ? { caseTop: +c.top.toFixed(2), wordmarkBottom: +l.bottom.toFixed(2) }
        : null;
    });
    out.seam[`${w}x${h}-${engine}`] = { ...r, gap: +(r.caseTop - r.wordmarkBottom).toFixed(2) };
    if (w === 430 && out.seam[`${w}x${h}-${engine}`].gap < 0) {
      const f = path.join(FRAMES, `seam-430x932-${engine}.png`);
      await page.screenshot({
        path: f,
        clip: { x: 0, y: Math.max(0, r.wordmarkBottom - 90), width: w, height: 170 },
      });
      out.crops.push(f);
    }
    await ctx.close();
  }

  // ── G9 · contrast, light and dark, at the dock ─────────────────────────────────────────
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: engine === "chromium",
      deviceScaleFactor: 3,
      colorScheme: theme,
      baseURL: BASE,
    });
    await ctx.addInitScript(
      ([t]) => localStorage.setItem("sudoku-color-scheme", t),
      [theme],
    );
    const page = await ctx.newPage();
    await load(page);
    await inkRatio(page, ".section-heading", "band name", out.contrast, `${engine}-${theme}`);
    await inkRatio(page, ".band-row-caption", "caption", out.contrast, `${engine}-${theme}`);
    const armed = await armDeal(page);
    out.contrast[`arm · ${engine}-${theme}`] = armed;
    await inkRatio(
      page,
      ".deal-btn .act-word.is-armed",
      "asked word",
      out.contrast,
      `${engine}-${theme}`,
    );
    await inkRatio(page, ".deal-btn .act-answer", "no", out.contrast, `${engine}-${theme}`);

    // the two crops of the same box: armed now, then disarmed at rest
    const band = page.locator(".cost-band").nth(2);
    const b = await band.boundingBox();
    const shot = async (name) => {
      const f = path.join(FRAMES, name);
      await page.screenshot({
        path: f,
        clip: { x: b.x, y: b.y, width: b.width, height: Math.min(b.height + 6, 200) },
      });
      out.crops.push(f);
    };
    await shot(`starting-over-armed-${engine}-${theme}.png`);
    await page.locator(".deal-btn .act-answer").first().click({ force: true });
    await page.waitForTimeout(300);
    await shot(`starting-over-rest-${engine}-${theme}.png`);
    await ctx.close();
  }

  // ── the rail, and the shut ribbon ──────────────────────────────────────────────────────
  if (engine === "chromium") {
    let ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      baseURL: BASE,
    });
    let page = await ctx.newPage();
    await load(page);
    const card = await page.locator(".controls-card").boundingBox();
    const f1 = path.join(FRAMES, "rail-1280-ladder.png");
    await page.screenshot({ path: f1, clip: card });
    out.crops.push(f1);
    await ctx.close();

    ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 2,
      baseURL: BASE,
    });
    page = await ctx.newPage();
    await load(page, { open: false });
    const ribbon = await page.locator(".fold-tools").first().boundingBox();
    if (ribbon) {
      const f2 = path.join(FRAMES, "ribbon-hint-boxed.png");
      await page.screenshot({
        path: f2,
        clip: { x: 0, y: ribbon.y - 4, width: 390, height: Math.min(ribbon.height + 8, 140) },
      });
      out.crops.push(f2);
    }
    await ctx.close();
  }
  await browser.close();
}

fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
for (const c of out.crops) console.log(path.basename(c), (fs.statSync(c).size / 1024).toFixed(1), "KB");
console.log(JSON.stringify(out.seam, null, 1));
console.log(JSON.stringify(out.contrast, null, 1));
