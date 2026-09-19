#!/usr/bin/env node
/**
 * CTRL-COST · G9's RED, and the two cures PRICED IN PAINTED BYTES.
 *
 * The family's own tier-3 ground is what breaks its own token promise: `--color-red-ink` is
 * 4.99:1 over `--color-card`, but the asking face paints `color-mix(foreground 8%)` UNDER the
 * word, and over that mixed paper the same red measures 4.2:1 at 390 light. This probe reads
 * the shipped state and then two candidate grounds — INJECTED, never written to the product —
 * so the chair has numbers rather than a hope:
 *   A · the ground clears while the face ASKS (weight at rest, paper when it asks)
 *   B · the ground at 4% instead of 8%, everywhere
 * `no` is read too: the prototype already took the foreground cure (measured before: 3.94).
 *
 * Usage: node contrast-cures.mjs <out.json>
 */
import fs from "node:fs";
import sharp from "sharp";
import { chromium, webkit } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:4233";
const OUT = process.argv[2];

const lum = (r, g, b) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);

async function painted(page, sel) {
  const box = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    el.scrollIntoView({ block: "center" });
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  }, sel);
  if (!box || box.width < 2) return null;
  const vp = page.viewportSize();
  const clip = {
    x: Math.max(0, Math.floor(box.x)),
    y: Math.max(0, Math.floor(box.y)),
    width: Math.min(Math.ceil(box.width), vp.width - Math.floor(box.x)),
    height: Math.min(Math.ceil(box.height), vp.height - Math.floor(box.y)),
  };
  const buf = await page.screenshot({ clip });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ls = [];
  for (let i = 0; i < data.length; i += info.channels)
    ls.push(lum(data[i], data[i + 1], data[i + 2]));
  ls.sort((a, b) => a - b);
  const p = (q) => ls[Math.round((ls.length - 1) * q)];
  return ratio(p(0.02), p(0.98));
}

const out = {};
for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const arm of ["shipped", "A · ground clears on the ask", "B · ground at 4%"]) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: engine === "chromium",
      deviceScaleFactor: 3,
      colorScheme: "light",
      baseURL: BASE,
    });
    await ctx.addInitScript(() => localStorage.setItem("sudoku-color-scheme", "light"));
    const page = await ctx.newPage();
    await page.goto("./?size=3&difficulty=EASY");
    await page.waitForSelector("g.boil-frame-layer.is-active", {
      state: "attached",
      timeout: 30000,
    });
    await page.waitForTimeout(1200);
    if (
      await page.evaluate(() =>
        document.documentElement.classList.contains("drawer-closed"),
      )
    ) {
      await page.locator(".drawer-tab").click({ force: true });
      await page.waitForTimeout(950);
    }
    if (arm.startsWith("A"))
      await page.addStyleTag({
        content: ".deal-btn .act-face.is-heavy, .clear-btn .act-face.is-heavy { background: transparent }",
      });
    if (arm.startsWith("B"))
      await page.addStyleTag({
        content:
          ".act-face.is-heavy { background: color-mix(in srgb, var(--color-foreground) 4%, transparent) }",
      });
    const fill = page.locator('button[aria-label^="Fill in every cell"]').first();
    await fill.scrollIntoViewIfNeeded().catch(() => {});
    await fill.click({ force: true });
    await page.waitForTimeout(1500);
    const deal = page.locator(".deal-btn").first();
    await deal.scrollIntoViewIfNeeded().catch(() => {});
    await deal.click({ force: true });
    await page.waitForTimeout(350);
    out[`${arm} · ${engine}`] = {
      askedWord: await painted(page, ".deal-btn .act-word.is-armed"),
      no: await painted(page, ".deal-btn .act-answer"),
    };
    console.log(`${arm} · ${engine}`, JSON.stringify(out[`${arm} · ${engine}`]));
    await ctx.close();
  }
  await browser.close();
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
