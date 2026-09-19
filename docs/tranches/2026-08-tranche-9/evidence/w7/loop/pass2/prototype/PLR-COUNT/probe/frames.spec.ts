/**
 * PLR-COUNT pass 2 — THE PAINTED BYTES and the four cited crops.
 *
 * Strips: the mark's own box at dpr 3, N = 1…6, light and dark, both engines — the input
 * `pixels.mjs` counts runs and hues off. Sheet shots: the register at N=16 over the wordmark,
 * both themes, for the AA reading on the opaque ground. Crops: the four the brief names.
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const STRIPS = process.env.STRIP_DIR || path.resolve(__dirname, "..", "strips");
const FRAMES = process.env.FRAME_DIR || path.resolve(__dirname, "..", "frames");
const OUT = path.resolve(__dirname, "..", "readings");
for (const d of [STRIPS, FRAMES, OUT]) fs.mkdirSync(d, { recursive: true });

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
let cursor = 0;
async function peers(page: Page, room: string, k: number) {
  if (k <= 0) return;
  const from = cursor;
  cursor += k;
  await page.evaluate(
    ({ room, k, from }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `fp-${from + i}` });
    },
    { room, k, from },
  );
  await page.waitForTimeout(700);
}
const markBox = (page: Page) =>
  page.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    )!;
    const b = m.getBoundingClientRect();
    return { x: b.x, y: b.y, width: b.width, height: b.height };
  });

// ── the strips pixels.mjs reads ────────────────────────────────────────────────────────────
test("strips N=1..6, both themes", async ({ browser }, info) => {
  for (const scheme of ["light", "dark"] as const) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      colorScheme: scheme,
      deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    const room = `strip-${scheme}-${info.project.name}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    let at = 1;
    for (const N of [1, 2, 3, 4, 5, 6]) {
      await peers(page, room, N - at);
      at = N;
      await page.waitForTimeout(400);
      const b = await markBox(page);
      const buf = await page.screenshot({
        clip: { x: b.x, y: b.y, width: b.width, height: b.height },
      });
      fs.writeFileSync(
        path.join(STRIPS, `n${N}-${scheme}-${info.project.name}.png`),
        buf,
      );
    }
    await ctx.close();
  }
});

// ── the sheet's painted ground at N=16, both themes ────────────────────────────────────────
test("sheet bytes at N=16", async ({ browser }, info) => {
  const out: Record<string, unknown> = {};
  for (const scheme of ["light", "dark"] as const) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      colorScheme: scheme,
      deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    const room = `sheet-${scheme}-${info.project.name}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 15);
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800);
    const geo = await page.evaluate(() => {
      const r = (el: Element | null) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { x: b.x, y: b.y, w: b.width, h: b.height };
      };
      const l = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement;
      const lb = l.getBoundingClientRect();
      const runs: Record<string, unknown> = {};
      for (const sel of [".pl-state", ".pl-name", ".pl-qualifier", ".pl-more"]) {
        const e = l.querySelector(sel);
        const b = e?.getBoundingClientRect();
        runs[sel] = b
          ? {
              x: +(b.x - lb.x).toFixed(2),
              y: +(b.y - lb.y).toFixed(2),
              w: +b.width.toFixed(2),
              h: +b.height.toFixed(2),
              color: getComputedStyle(e!).color,
            }
          : null;
      }
      return {
        box: r(l),
        ground: getComputedStyle(l).backgroundColor,
        wordmark: r(document.querySelector("svg.handwritten-logo")),
        runs,
      };
    });
    const buf = await page.screenshot({
      clip: {
        x: (geo as any).box.x,
        y: (geo as any).box.y,
        width: (geo as any).box.w,
        height: (geo as any).box.h,
      },
    });
    fs.writeFileSync(
      path.join(STRIPS, `sheet16-${scheme}-${info.project.name}.png`),
      buf,
    );
    out[scheme] = geo;
    await ctx.close();
  }
  fs.writeFileSync(
    path.join(OUT, `sheet16-geom-${info.project.name}.json`),
    JSON.stringify(out, null, 1),
  );
});

// ── the four cited crops ───────────────────────────────────────────────────────────────────
test("the cited crops", async ({ browser }, info) => {
  // 1 · the head strip N=1/3/5/6 at 390 coarse light, one image per N, stitched by the reader
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    const room = `crop-head-${info.project.name}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    let at = 1;
    for (const N of [1, 3, 5, 6]) {
      await peers(page, room, N - at);
      at = N;
      await page.waitForTimeout(400);
      const buf = await page.screenshot({
        clip: { x: 0, y: 0, width: 200, height: 52 },
      });
      fs.writeFileSync(
        path.join(FRAMES, `head-n${N}-390-light-${info.project.name}.png`),
        buf,
      );
    }
    await ctx.close();
  }
  // 2 · the desk register open over the board, with the @mbabb card NOT painting
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const room = `crop-desk-${info.project.name}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 2);
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800);
    const buf = await page.screenshot({
      clip: { x: 0, y: 0, width: 470, height: 300 },
    });
    fs.writeFileSync(
      path.join(FRAMES, `desk-register-over-board-${info.project.name}.png`),
      buf,
    );
    await ctx.close();
  }
  // 3 · phone 664 at N=16
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 664 },
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    const room = `crop-664-${info.project.name}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 15);
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800);
    const buf = await page.screenshot({
      clip: { x: 0, y: 0, width: 300, height: 190 },
    });
    fs.writeFileSync(path.join(FRAMES, `phone664-n16-${info.project.name}.png`), buf);
    await ctx.close();
  }
  // 4 · N=3 dark, 1280
  {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: "dark",
    });
    const page = await ctx.newPage();
    const room = `crop-dark-${info.project.name}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 2);
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800);
    const buf = await page.screenshot({
      clip: { x: 0, y: 0, width: 400, height: 220 },
    });
    fs.writeFileSync(path.join(FRAMES, `dark-n3-1280-${info.project.name}.png`), buf);
    await ctx.close();
  }
});
