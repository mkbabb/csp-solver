// T9-W7 · CTRL-TABS — F3 re-shot (the rail is on the board's RIGHT at 1280, so the first clip
// caught the board's left edge alone), plus the strip's MEMORY read without an init script that
// clears storage on every navigation (the first reading was the probe clearing its own subject).
import { chromium, webkit } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4238/";
const DIR = process.env.FRAMES || "/tmp/ctrl-tabs-frames";
const OUT = process.env.OUT || "/tmp/ctrl-tabs-frames2.json";
mkdirSync(DIR, { recursive: true });

async function shot(page, name, clip, cap = 150 * 1024) {
  const buf = await page.screenshot(clip ? { clip } : {});
  const w = clip ? clip.width : (await page.viewportSize()).width;
  let out = await sharp(buf).png({ compressionLevel: 9, palette: true }).toBuffer();
  let scale = 1;
  while (out.length > cap && scale > 0.35) {
    scale -= 0.12;
    out = await sharp(buf).resize({ width: Math.round(w * scale) }).png({ compressionLevel: 9, palette: true }).toBuffer();
  }
  writeFileSync(join(DIR, name), out);
  return { name, bytes: out.length, scale: +scale.toFixed(2) };
}

const res = { frames: [], memory: {}, deskBoxes: {} };
for (const engine of ["chromium", "webkit"]) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  // ── F3 · the desk, whole ───────────────────────────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, colorScheme: "light" });
    await ctx.addInitScript(() => { try { localStorage.setItem("sudoku-color-scheme", "light"); } catch {} });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await page.waitForTimeout(1500);
    res.deskBoxes[engine] = await page.evaluate(() => {
      const b = (s) => {
        const e = document.querySelector(s);
        if (!e) return null;
        const r = e.getBoundingClientRect();
        return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
      };
      return {
        card: b(".controls-card"),
        strip: b(".tab-strip"),
        board: b(".board-wrapper") || b(".sudoku-board"),
        rail: b(".controls-rail") || b(".sidebar") || null,
      };
    });
    res.frames.push(await shot(page, `f3-desk-whole-1280x800-${engine}-light.png`, null));
    const clip = await page.evaluate(() => {
      const c = document.querySelector(".controls-card").getBoundingClientRect();
      return { x: Math.max(0, c.x - 60), y: Math.max(0, c.y - 12), width: Math.min(innerWidth - Math.max(0, c.x - 60), c.width + 72), height: c.height + 24 };
    });
    res.frames.push(await shot(page, `f3b-desk-rail-1280x800-${engine}-light.png`, clip));
    await ctx.close();
  }
  // ── THE MEMORY, without a storage-clearing init script ─────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: engine === "chromium" ? true : undefined, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".drawer-tab", { timeout: 30000 });
    await page.waitForTimeout(1400);
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
    await page.locator('[role="tab"]').nth(1).click();
    await page.waitForTimeout(200);
    const stored = await page.evaluate(() => {
      try { return sessionStorage.getItem("sudoku-controls-tab"); } catch { return "THREW"; }
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector(".drawer-tab", { timeout: 30000 });
    await page.waitForTimeout(1400);
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
    const raised = await page.evaluate(() => document.querySelector('[role="tab"][aria-selected="true"]')?.innerText.trim());
    res.memory[engine] = { stored, raisedAfterReload: raised, holds: raised === "pencils" };
    console.log(`[memory ${engine}] stored=${stored} raisedAfterReload=${raised}`);
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res.deskBoxes, null, 1));
for (const f of res.frames) console.log(`${f.name}  ${(f.bytes / 1024).toFixed(1)} KB  scale ${f.scale}`);
