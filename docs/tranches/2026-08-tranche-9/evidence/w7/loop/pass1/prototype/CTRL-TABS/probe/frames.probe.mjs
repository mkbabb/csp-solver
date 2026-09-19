// T9-W7 · pass 1 · CTRL-TABS — THE FRAMES, and the authored ring read by A/B DIFF.
//
// The ring's painted read is a DIFFERENCE: the same crop with the outline on and off, and the
// ring's colour is whatever changed. (Reading the band's extreme pixel instead catches the tab's
// own drawn stroke at `outset: 3`, which is a different ink at a different opacity — measured,
// and the reason this probe exists.)
//
//   node .scratch-w7/frames.probe.mjs
import { chromium, webkit } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4238/";
const DIR = process.env.FRAMES || "/tmp/ctrl-tabs-frames";
const OUT = process.env.OUT || "/tmp/ctrl-tabs-ring.json";
mkdirSync(DIR, { recursive: true });

const lum = (r, g, b) => {
  const f = (x) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [a, b].sort((x, y) => y - x);
  return +(((l1 + 0.05) / (l2 + 0.05))).toFixed(2);
};

async function shot(page, name, clip, cap = 150 * 1024) {
  const buf = await page.screenshot({ clip });
  let out = await sharp(buf).png({ compressionLevel: 9, palette: true }).toBuffer();
  let scale = 1;
  while (out.length > cap && scale > 0.4) {
    scale -= 0.15;
    out = await sharp(buf)
      .resize({ width: Math.round(clip.width * scale) })
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();
  }
  writeFileSync(join(DIR, name), out);
  return { name, bytes: out.length, scale: +scale.toFixed(2), clip };
}

async function boot(engine, { w, h, mobile, scheme }) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: mobile && engine === "chromium" ? true : undefined,
    hasTouch: mobile,
    colorScheme: scheme,
  });
  await ctx.addInitScript((s) => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("sudoku-color-scheme", s);
    } catch {}
  }, scheme);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  return { browser, page };
}
const openSheet = async (page) => {
  await page.locator(".drawer-tab").click({ force: true });
  await page.waitForTimeout(950); // the sheet SLIDES
};

const frames = [];
const ring = {};

for (const engine of ["chromium", "webkit"]) {
  // ── F1 · 390×844 dark, sheet up, `pencils` raised ────────────────────────────────────────
  {
    const { browser, page } = await boot(engine, { w: 390, h: 844, mobile: true, scheme: "dark" });
    await openSheet(page);
    await page.locator('[role="tab"]').nth(1).click();
    await page.waitForTimeout(220);
    const clip = await page.evaluate(() => {
      const c = document.querySelector(".controls-card").getBoundingClientRect();
      return { x: Math.max(0, c.x - 6), y: Math.max(0, c.y - 10), width: Math.min(390, c.width + 12), height: c.height + 20 };
    });
    frames.push(await shot(page, `f1-strip-tray-floor-390x844-${engine}-dark.png`, clip));
    await browser.close();
  }
  // ── F2 · 900×500 light — one tray in 284, the edge strip on the right flank ──────────────
  {
    const { browser, page } = await boot(engine, { w: 900, h: 500, mobile: true, scheme: "light" });
    await openSheet(page);
    frames.push(await shot(page, `f2-binding-cell-900x500-${engine}-light.png`, { x: 0, y: 0, width: 900, height: 500 }));
    await browser.close();
  }
  // ── F3 · 1280×800 light — the flank tabs, the rail pinned, the board's left edge ─────────
  {
    const { browser, page } = await boot(engine, { w: 1280, h: 800, mobile: false, scheme: "light" });
    const clip = await page.evaluate(() => {
      const card = document.querySelector(".controls-card").getBoundingClientRect();
      const board = document.querySelector(".board-wrapper, .sudoku-board").getBoundingClientRect();
      const x = Math.max(0, Math.min(card.x, board.x) - 16);
      return { x, y: Math.max(0, card.y - 24), width: Math.min(1280 - x, board.x + 160 - x), height: Math.min(800 - Math.max(0, card.y - 24), card.height + 48) };
    });
    frames.push(await shot(page, `f3-desk-flank-1280x800-${engine}-light.png`, clip));
    await browser.close();
  }
  // ── F4 · the ribbon in the floor's row at 390 ────────────────────────────────────────────
  {
    const { browser, page } = await boot(engine, { w: 390, h: 844, mobile: true, scheme: "light" });
    await page.evaluate(() => {
      const i = [...document.querySelectorAll(".sudoku-cell input")].filter((x) => !x.readOnly && !x.disabled && !x.value)[0];
      i?.focus();
    });
    await page.keyboard.type("5");
    await page.waitForTimeout(400);
    await openSheet(page);
    await page.locator('.action-verbs [data-verb="clear"]').click();
    await page.waitForTimeout(420);
    const clip = await page.evaluate(() => {
      const bar = document.querySelector(".action-bar").getBoundingClientRect();
      return { x: Math.max(0, bar.x - 6), y: Math.max(0, bar.y - 14), width: bar.width + 12, height: bar.height + 24 };
    });
    frames.push(await shot(page, `f4-ribbon-floor-row-390x844-${engine}-light.png`, clip));
    await browser.close();
  }

  // ── THE RING, by A/B difference ──────────────────────────────────────────────────────────
  for (const [cell, scheme] of [
    [{ w: 390, h: 844, mobile: true }, "light"],
    [{ w: 390, h: 844, mobile: true }, "dark"],
    [{ w: 1280, h: 800, mobile: false }, "light"],
    [{ w: 1280, h: 800, mobile: false }, "dark"],
  ]) {
    const key = `${cell.w}x${cell.h}-${engine}-${scheme}`;
    const { browser, page } = await boot(engine, { ...cell, scheme });
    if (cell.mobile) await openSheet(page);
    const face = page.locator('[role="tab"]').nth(1).locator(".tab-face");
    const b = await face.boundingBox();
    const pad = 8;
    const clip = { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: b.width + 2 * pad, height: b.height + 2 * pad };
    const off = await page.screenshot({ clip });
    await page.evaluate(() => {
      const t = document.querySelectorAll('[role="tab"]')[1];
      t.classList.add("proto-ring");
    });
    await page.addStyleTag({
      content: ".proto-ring .tab-face{outline:2px solid var(--ring-ink);outline-offset:4px}",
    });
    await page.waitForTimeout(150);
    const on = await page.screenshot({ clip });
    const A = await sharp(off).raw().toBuffer({ resolveWithObject: true });
    const B = await sharp(on).raw().toBuffer({ resolveWithObject: true });
    const ch = A.info.channels;
    const hist = new Map();
    const groundHist = new Map();
    for (let i = 0; i < A.data.length; i += ch) {
      const a = [A.data[i], A.data[i + 1], A.data[i + 2]];
      const c = [B.data[i], B.data[i + 1], B.data[i + 2]];
      const d = Math.abs(a[0] - c[0]) + Math.abs(a[1] - c[1]) + Math.abs(a[2] - c[2]);
      if (d > 24) {
        hist.set(c.join(","), (hist.get(c.join(",")) || 0) + 1);
        groundHist.set(a.join(","), (groundHist.get(a.join(",")) || 0) + 1);
      }
    }
    if (!hist.size) {
      ring[key] = { error: "no pixel changed — the ring did not paint" };
    } else {
      const ringPx = [...hist.entries()].sort((x, y) => y[1] - x[1])[0][0].split(",").map(Number);
      const groundPx = [...groundHist.entries()].sort((x, y) => y[1] - x[1])[0][0].split(",").map(Number);
      ring[key] = {
        ring: `rgb(${ringPx.join(",")})`,
        groundUnder: `rgb(${groundPx.join(",")})`,
        ratio: ratio(lum(...ringPx), lum(...groundPx)),
        changedPx: [...hist.values()].reduce((a, b2) => a + b2, 0),
      };
    }
    console.log(`[ring ${key}]`, JSON.stringify(ring[key]));
    await browser.close();
  }
}

writeFileSync(OUT, JSON.stringify({ ring, frames }, null, 1));
for (const f of frames) console.log(`${f.name}  ${(f.bytes / 1024).toFixed(1)} KB  scale ${f.scale}`);
console.log("\nbanked " + OUT + " · frames in " + DIR);
