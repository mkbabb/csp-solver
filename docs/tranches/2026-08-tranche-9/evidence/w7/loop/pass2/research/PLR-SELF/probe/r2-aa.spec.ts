/**
 * PLR-SELF pass-2 RESEARCH probe, part 4 — the two readings the first three left open:
 *   J · the live mark under a PROGRAMMATIC focus (WebKit will not Tab to a button in this rig,
 *       so the focus-visible arm of F was void there).
 *   K · the PAINTED contrast of the sheet's quiet rung where the wordmark bleeds under it,
 *       glyph pixels against their own local ground — not a token against a token.
 * Read-only on product files.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const DESK = { width: 1280, height: 800 };
const say = (o: unknown) => console.log(`R2AA|${JSON.stringify(o)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function invite(page: Page) {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
}
const lum = (r: number, g: number, b: number) => {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: number, b: number) =>
  (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

test("J + K · programmatic focus, and the painted rung over the bleed", async ({
  browser,
}, ti) => {
  const OUT =
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/PLR-SELF/probe";
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  for (let i = 0; i < 5; i++) {
    const p = await ctx.newPage();
    await p.goto(page.url());
    await settled(p);
  }
  await page.bringToFront();
  await page.waitForTimeout(1000);

  const m = page.locator("[data-player-mark]:visible");
  await page.mouse.move(640, 700);
  await page.waitForTimeout(700);
  const before = await m.evaluate((el) => getComputedStyle(el).color);
  // J — a programmatic focus, the only route this rig has to the mark on WebKit.
  await m.evaluate((el) => (el as HTMLElement).focus());
  await page.waitForTimeout(700);
  const afterFocus = await m.evaluate((el) => ({
    active: el === document.activeElement,
    focusVisible: el.matches(":focus-visible"),
    color: getComputedStyle(el).color,
    outline: `${getComputedStyle(el).outlineStyle} ${getComputedStyle(el).outlineWidth} ${getComputedStyle(el).outlineColor}`,
  }));
  say({ t: "J", engine: ti.project.name, before, afterFocus });

  // K — open the sheet, park the pointer away, then read painted pixels.
  await m.click();
  await page.waitForTimeout(800);
  await page.mouse.move(640, 740);
  await page.waitForTimeout(700);

  const boxes = await page.evaluate(() => {
    const vis = (s: string) =>
      [...document.querySelectorAll(s)].find(
        (e) => (e as HTMLElement).getClientRects().length > 0,
      ) as HTMLElement | undefined;
    const r = (el?: HTMLElement) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height, right: b.right, bottom: b.bottom };
    };
    return {
      state: r(vis("[data-lobby] .lobby-state")),
      qualifier: r(vis("[data-lobby] .lobby-qualifier")),
      wordmark: r(vis("svg.handwritten-logo")),
      sheet: r(vis("[data-lobby]")),
    };
  });

  const sample = async (name: string, box: any) => {
    if (!box) return null;
    const clip = {
      x: Math.max(0, Math.round(box.x)),
      y: Math.max(0, Math.round(box.y)),
      width: Math.max(1, Math.round(box.w)),
      height: Math.max(1, Math.round(box.h)),
    };
    const buf = await page.screenshot({ clip });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const W = info.width;
    const px: { x: number; L: number; rgb: string }[] = [];
    for (let i = 0, p = 0; i < data.length; i += info.channels, p++) {
      px.push({
        x: p % W,
        L: lum(data[i], data[i + 1], data[i + 2]),
        rgb: `${data[i]},${data[i + 1]},${data[i + 2]}`,
      });
    }
    // Split at the wordmark's left edge, in this crop's own coordinates.
    const cut = boxes.wordmark ? Math.round(boxes.wordmark.x - clip.x) : W;
    const halves: Record<string, unknown> = {};
    for (const [side, keep] of [
      ["clear", (q: { x: number }) => q.x < cut],
      ["over-wordmark", (q: { x: number }) => q.x >= cut],
    ] as const) {
      const set = px.filter(keep);
      if (!set.length) continue;
      const sorted = [...set].sort((a, b) => a.L - b.L);
      const ink = sorted[Math.floor(sorted.length * 0.02)]; // the 2nd-percentile: glyph core
      const ground = sorted[Math.floor(sorted.length * 0.9)]; // the 90th: the paper it sits on
      halves[side] = {
        n: set.length,
        ink: ink.rgb,
        ground: ground.rgb,
        ratio: +ratio(ink.L, ground.L).toFixed(2),
      };
    }
    return { clip, cut, halves };
  };

  const state = await sample("state", boxes.state);
  const qual = await sample("qualifier", boxes.qualifier);
  say({ t: "K", engine: ti.project.name, wordmarkX: boxes.wordmark?.x, state, qualifier: qual });

  if (ti.project.name === "chromium" && boxes.sheet) {
    const clip = {
      x: 0,
      y: Math.round(boxes.sheet.y),
      width: Math.round(boxes.sheet.w),
      height: Math.round(boxes.sheet.h),
    };
    const buf = await page.screenshot({ clip });
    await sharp(buf).png({ compressionLevel: 9 }).toFile(`${OUT}/sheet-desk-6line.png`);
  }
  await ctx.close();
});
