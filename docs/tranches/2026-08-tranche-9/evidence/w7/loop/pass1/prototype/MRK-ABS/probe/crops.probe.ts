/**
 * MRK-ABS pass-2 (PROTOTYPE) · the crops. dpr 3, cropped to the region each one proves.
 *
 * The board frames are taken at r0's own window — `r0/r3-marks/frames/ring-on-grid.png` is
 * 444x444 device px at dpr 3, i.e. a 148x148 CSS-px square centred on the focused cell — so
 * this lane's crops sit beside it AT THE SAME SCALE with no resampling.
 */
import { test, type Page, type Browser } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const FR = join(dirname(new URL(import.meta.url).pathname), "..", "frames");
mkdirSync(FR, { recursive: true });

const WINDOW = 148; // CSS px, r0's own crop window

async function dealt(page: Page, query: string) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1400);
}

/** Focus one cell by keyboard so tier 2 arms, and crop r0's window around it. */
async function cellCrop(page: Page, index: number, out: string) {
  await page.evaluate((i) => {
    const el = document.querySelectorAll<HTMLInputElement>(".game-cell input")[i];
    el?.focus();
  }, index);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(450);
  const box = await page.evaluate((i) => {
    const c = document.querySelectorAll<HTMLElement>(".game-cell")[i];
    const r = c.getBoundingClientRect();
    return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
  }, index);
  await page.screenshot({
    path: out,
    clip: {
      x: Math.max(0, box.cx - WINDOW / 2),
      y: Math.max(0, box.cy - WINDOW / 2),
      width: WINDOW,
      height: WINDOW,
    },
  });
}

async function ctx3(browser: Browser, w: number, h: number, theme: "light" | "dark") {
  const c = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 3,
    colorScheme: theme,
  });
  const p = await c.newPage();
  await p.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
  return { c, p };
}

test("F1 the ring at 9x9 and 16x16, 1280x800 light — r0's own window", async ({
  browser,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "one engine per crop; the numbers carry both");
  const { c, p } = await ctx3(browser, 1280, 800, "light");
  await dealt(p, "?size=3&difficulty=EASY");
  await cellCrop(p, 40, join(FR, "ring-9x9-1280-light-chromium.png"));
  await dealt(p, "?size=4&difficulty=EASY");
  await cellCrop(p, 136, join(FR, "ring-16x16-1280-light-chromium.png"));
  await c.close();
});

test("F2 the ring at 9x9, 393x699 dark — the phone and the dark arm", async ({
  browser,
  browserName,
}) => {
  test.skip(browserName !== "webkit", "the second engine carries the phone crop");
  const { c, p } = await ctx3(browser, 393, 699, "dark");
  await dealt(p, "?size=3&difficulty=EASY");
  await cellCrop(p, 40, join(FR, "ring-9x9-phone-dark-webkit.png"));
  await c.close();
});

test("F3 the chrome composite — a verb, the tongue and the toggle, each focused", async ({
  browser,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "one engine per crop");
  const { c, p } = await ctx3(browser, 1280, 800, "light");
  await dealt(p, "?size=3&difficulty=EASY");
  for (const [sel, name, pad] of [
    [".ctrl-btn", "chrome-ctrlbtn-light-chromium.png", 16],
    [".drawer-tab", "chrome-tongue-light-chromium.png", 16],
    [".sun-moon-toggle", "chrome-toggle-light-chromium.png", 64],
  ] as const) {
    const el = p.locator(sel).first();
    await el.evaluate((n: HTMLElement) => n.focus());
    await p.waitForTimeout(450); // past transition-colors' own 250ms
    const b = await el.boundingBox();
    if (!b) continue;
    await p.screenshot({
      path: join(FR, name),
      clip: {
        x: Math.max(0, b.x - pad),
        y: Math.max(0, b.y - pad),
        width: Math.min(1280 - Math.max(0, b.x - pad), b.width + pad * 2),
        height: Math.min(800 - Math.max(0, b.y - pad), b.height + pad * 2),
      },
    });
  }
  await c.close();
});

test("F4 the deck's centre card, focused", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "one engine per crop");
  const { c, p } = await ctx3(browser, 1280, 800, "light");
  await p.goto("./?view=gallery&size=3&difficulty=EASY");
  await p.waitForSelector(".game-gallery", { timeout: 60000 });
  await p.waitForTimeout(1300);
  await p.evaluate(() => document.querySelector<HTMLElement>(".gallery-viewport")?.focus());
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(900);
  const b = await p.evaluate(() => {
    const vp = document.querySelector<HTMLElement>(".gallery-viewport");
    const card = document.getElementById(vp?.getAttribute("aria-activedescendant") ?? "");
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  if (b) {
    const pad = 14;
    await p.screenshot({
      path: join(FR, "deck-card-light-chromium.png"),
      clip: { x: b.x - pad, y: b.y - pad, width: b.w + pad * 2, height: b.h + pad * 2 },
    });
  }
  await c.close();
});
