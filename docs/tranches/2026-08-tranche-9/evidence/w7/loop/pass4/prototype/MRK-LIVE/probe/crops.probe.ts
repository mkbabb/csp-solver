/**
 * T9-W7 pass 4 · MRK-LIVE · the four cited crops, each a REPLACEMENT.
 *
 * PRM: live, because every pose here is read after the ring's own settle on the real surface.
 */
import { test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/MRK-LIVE";
mkdirSync(FRAMES, { recursive: true });

async function boardReady(page: Page, q = "?game=sudoku") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1500);
}

// crop 1 — RETIRES pass3 `1-ring-on-travelled-tab-dock-open-1280-chromium.png`.
// chromium · DARK · 393×699 · POINTER CLASS coarse (hasTouch, `(pointer: coarse)` asserted).
test("crop 1 · phone dark coarse", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium");
  const ctx = await browser.newContext({
    viewport: { width: 393, height: 699 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
    colorScheme: "dark",
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238",
  });
  const page = await ctx.newPage();
  await boardReady(page);
  const regime = await page.evaluate(() => ({
    coarse: window.matchMedia("(pointer: coarse)").matches,
    dark: document.documentElement.classList.contains("dark"),
  }));
  await page.keyboard.press("Tab");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".drawer-tab")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(900);
  const box = await page.locator(".drawer-tab").boundingBox();
  console.log("crop1 regime " + JSON.stringify({ ...regime, box }));
  await page.screenshot({
    path: join(FRAMES, "1-phone-393x699-dark-coarse-ring-on-tab-chromium.png"),
    clip: box
      ? {
          x: Math.max(0, box.x - 34),
          y: Math.max(0, box.y - 34),
          width: box.width + 68,
          height: box.height + 68,
        }
      : undefined,
  });
  await ctx.close();
});

// crops 2 and 3 — the PAIR that answers "does a mouse click paint the 212 px ring?".
// RETIRE pass3 `2-toggle-ring-212-light-webkit.png` and `3-coarse-tape-over-ring-9x9-*.png`.
// webkit · DARK · 1280×800 · POINTER CLASS fine (a desktop mouse, hasTouch false).
test("crops 2+3 · the toggle, keyboard vs mouse", async ({ page, browserName }) => {
  test.skip(browserName !== "webkit");
  await page.emulateMedia({ colorScheme: "dark" });
  await boardReady(page);
  const box = await page.locator(".sun-moon-toggle").boundingBox();
  const clip = box
    ? { x: Math.max(0, box.x - 60), y: Math.max(0, box.y - 60), width: box.width + 120, height: box.height + 120 }
    : undefined;

  await page.keyboard.press("Tab");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".sun-moon-toggle")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(1200);
  console.log(
    "crop2 " +
      JSON.stringify(
        await page.evaluate(() => {
          const r = document.querySelector<SVGElement>(".focus-ring");
          return {
            fv: !!document.activeElement?.matches(":focus-visible"),
            rings: document.querySelectorAll(".focus-ring").length,
            ring: r ? [+r.getBoundingClientRect().width.toFixed(2), +r.getBoundingClientRect().height.toFixed(2)] : null,
          };
        }),
      ),
  );
  await page.screenshot({
    path: join(FRAMES, "2-toggle-ring-212-keyboard-dark-webkit.png"),
    clip,
  });

  await boardReady(page);
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.up();
  }
  await page.waitForTimeout(1400);
  console.log(
    "crop3 " +
      JSON.stringify(
        await page.evaluate(() => ({
          active: document.activeElement?.tagName.toLowerCase() ?? null,
          fv: !!document.activeElement?.matches(":focus-visible"),
          rings: document.querySelectorAll(".focus-ring").length,
        })),
      ),
  );
  await page.screenshot({
    path: join(FRAMES, "3-toggle-mouse-landing-no-ring-dark-webkit.png"),
    clip,
  });
});

// crop 4 — RETIRES pass3 `4-deck-first-option-fallthrough-chromium.png`.
// chromium · LIGHT · 1280×800 · POINTER CLASS fine. The board's own hand at tier 2, 0.95 —
// the subject of the painted-contrast read (3.571 over its own fill).
test("crop 4 · the board's tier-2 ink", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium");
  await page.emulateMedia({ colorScheme: "light" });
  await boardReady(page);
  await page.evaluate(() =>
    document.querySelector<HTMLInputElement>(".game-cell input")?.focus(),
  );
  await page.waitForTimeout(1200);
  const box = await page.evaluate(() => {
    const c = document
      .querySelector<HTMLElement>(".game-cell input")
      ?.closest<HTMLElement>(".game-cell");
    if (!c) return null;
    const b = c.getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });
  console.log("crop4 " + JSON.stringify(box));
  await page.screenshot({
    path: join(FRAMES, "4-board-tier2-ink-095-light-chromium.png"),
    clip: box
      ? { x: Math.max(0, box.x - 22), y: Math.max(0, box.y - 22), width: box.w + 44, height: box.h + 44 }
      : undefined,
  });
});
