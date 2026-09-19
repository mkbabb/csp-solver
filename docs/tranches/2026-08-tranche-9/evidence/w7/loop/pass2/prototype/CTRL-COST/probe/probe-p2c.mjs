#!/usr/bin/env node
/**
 * CTRL-COST · PASS 2 — PAINTED-BYTES CONTRAST + THE FOUR CROPS.
 *
 * Contrast is read from the ENGINE'S OWN PIXELS: clip the element's box, `sharp` raw, the
 * 2nd/98th percentile luminance pair, WCAG. The composited control (ink over paper, both from
 * `getComputedStyle`) rides beside it, because a painted read that disagrees with the algebra
 * is a read of something other than the text.
 *
 * G9′ is the row this exists for: the ASKED WORD on BARE card, light, both engines.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { chromium, webkit } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:4233";
const OUT = process.argv[2] || "./p2c.json";
const FRAMES = process.argv[3] || "./frames";

const lum = (r, g, b) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return +((hi + 0.05) / (lo + 0.05)).toFixed(3);
};

async function load(page, dark) {
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  if (dark)
    await page.evaluate(() => document.documentElement.classList.add("dark"));
  await page.waitForTimeout(1200);
  if (
    await page.evaluate(() =>
      document.documentElement.classList.contains("drawer-closed"),
    )
  ) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  await page.waitForTimeout(300);
}

async function painted(page, sel, label, out) {
  const meta = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    let paper = null;
    for (let p = el.parentElement; p; p = p.parentElement) {
      const bg = getComputedStyle(p).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        paper = bg;
        break;
      }
    }
    return {
      box: { x: r.x, y: r.y, width: r.width, height: r.height },
      color: cs.color,
      paper,
      visible: cs.visibility === "visible" && +cs.opacity > 0.5,
      text: el.textContent.trim().slice(0, 30),
      weight: cs.fontWeight,
      size: cs.fontSize,
    };
  }, sel);
  if (!meta || !meta.visible || meta.box.width < 2 || meta.box.height < 2) {
    out[label] = { error: "not painted", meta };
    return;
  }
  const vp = page.viewportSize();
  const clip = {
    x: Math.max(0, Math.floor(meta.box.x)),
    y: Math.max(0, Math.floor(meta.box.y)),
    width: Math.min(Math.ceil(meta.box.width), vp.width - Math.floor(meta.box.x)),
    height: Math.min(Math.ceil(meta.box.height), vp.height - Math.floor(meta.box.y)),
  };
  if (clip.width < 2 || clip.height < 2 || clip.y + clip.height > vp.height) {
    out[label] = { error: "off-screen", clip };
    return;
  }
  const buf = await page.screenshot({ clip });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ls = [];
  for (let i = 0; i < data.length; i += info.channels)
    ls.push(lum(data[i], data[i + 1], data[i + 2]));
  ls.sort((a, b) => a - b);
  const q = (p) => ls[Math.min(ls.length - 1, Math.max(0, Math.round((ls.length - 1) * p)))];
  const parse = (c) => (c?.match(/[\d.]+/g) || [255, 255, 255]).slice(0, 3).map(Number);
  const [cr, cg, cb] = parse(meta.color);
  const [pr, pg, pb] = parse(meta.paper);
  out[label] = {
    painted: ratio(q(0.02), q(0.98)),
    composited: ratio(lum(cr, cg, cb), lum(pr, pg, pb)),
    ink: meta.color,
    paper: meta.paper,
    weight: meta.weight,
    size: meta.size,
    text: meta.text,
  };
}

async function armDeal(page) {
  await page.locator('button[aria-label^="Fill in every cell"]').click();
  await page.waitForTimeout(900);
  await page.locator(".deal-face").scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.locator(".deal-btn").click();
  await page.waitForTimeout(400);
}

const out = {};
fs.mkdirSync(FRAMES, { recursive: true });

for (const [engine, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  out[engine] = {};
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    try {
      await load(page, theme === "dark");
      const t = {};
      await painted(page, ".cost-band-head .section-heading", "band name", t);
      await painted(page, ".band-row-caption", "caption", t);
      await armDeal(page);
      await painted(page, ".deal-btn .act-word.is-armed", "the asked word", t);
      await painted(page, ".deal-face .act-answer", "`no`", t);
      out[engine][theme] = t;

      // CROP 1/2 — the same box at rest and armed, side by side, the `no` foot visible.
      if (engine === "chromium") {
        const box = await page.locator(".deal-face").boundingBox();
        const pad = 10;
        const clip = {
          x: Math.max(0, box.x - pad),
          y: Math.max(0, box.y - pad),
          width: box.width + 2 * pad,
          height: box.height + 2 * pad,
        };
        const armedBuf = await page.screenshot({ clip });
        await page.locator(".deal-face .act-answer").click();
        await page.waitForTimeout(400);
        const restBuf = await page.screenshot({ clip });
        const a = await sharp(armedBuf).metadata();
        await sharp({
          create: {
            width: a.width * 2 + 16,
            height: a.height,
            channels: 3,
            background: theme === "dark" ? "#131211" : "#fdfdfc",
          },
        })
          .composite([
            { input: restBuf, left: 0, top: 0 },
            { input: armedBuf, left: a.width + 16, top: 0 },
          ])
          .png({ compressionLevel: 9 })
          .toFile(path.join(FRAMES, `ask-390-${theme}.png`));
      }
    } catch (e) {
      out[engine][theme] = { error: String(e).slice(0, 300) };
    }
    await ctx.close();
  }

  // CROP 3 — the pinned `looking` head at dock scrollTop 116, chips clear below it.
  if (engine === "chromium") {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await load(page, false);
    await page.evaluate(() => {
      document.querySelector(".controls-card").scrollTop = 116;
    });
    await page.waitForTimeout(300);
    const cardBox = await page.locator(".controls-card").boundingBox();
    await page.screenshot({
      clip: {
        x: cardBox.x,
        y: cardBox.y,
        width: cardBox.width,
        height: Math.min(200, cardBox.height),
      },
      path: path.join(FRAMES, "pinned-head-390-116.png"),
    });
    await ctx.close();

    // CROP 4 — the desk, `fill` hovered, its note in the `writing` head.
    const ctx2 = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const page2 = await ctx2.newPage();
    await load(page2, false);
    const fill = await page2.locator('button[aria-label^="Fill in every cell"]').boundingBox();
    await page2.mouse.move(fill.x + fill.width / 2, fill.y + fill.height / 2);
    await page2.waitForTimeout(400);
    const card2 = await page2.locator(".controls-card").boundingBox();
    await page2.screenshot({
      clip: { x: card2.x - 4, y: card2.y - 4, width: card2.width + 8, height: card2.height + 8 },
      path: path.join(FRAMES, "writing-note-1280.png"),
    });
    await ctx2.close();
  }
  await browser.close();
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("banked", OUT);
