/**
 * T9-W7 pass 3 · MRK-LIVE · the cited crops. Four at most, each ≤150 KB, each a frame a number
 * cannot say.
 *
 * Motion declared: crop 1 presses the dock tab and waits for the glide to END (the sheet SLIDES
 * — the settled pose is polled, never the tween); the rest are read at rest.
 */
import { test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "frames");
mkdirSync(OUT, { recursive: true });

async function boardReady(page: Page, q = "?game=sudoku") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}

async function stillOnTarget(page: Page) {
  await page.waitForFunction(
    () => {
      const a = document.activeElement as HTMLElement | null;
      if (!a) return true;
      const owned = a.getAttribute?.("aria-activedescendant");
      const box = (owned && document.getElementById(owned)) || a;
      const list: Animation[] = [];
      for (let e: Element | null = box; e; e = e.parentElement)
        list.push(...e.getAnimations());
      return (
        list.filter((x) =>
          Number.isFinite(x.effect?.getComputedTiming().endTime ?? Infinity),
        ).length === 0
      );
    },
    undefined,
    { timeout: 20000 },
  );
}

// CROP 1 — the defect's own frame, cured: the dock OPEN, settled, the ring ON the tab it
// travelled 190.11px with. 1280×800 is where the tab keeps focus through the press (on a phone
// the estate moves focus into the sheet — measured, PHONE-dock-*.json), so the defect lives here.
test("crop 1 · the ring on the travelled tab, dock open", async ({ page }) => {
  test.skip(test.info().project.name !== "chromium", "one engine per crop");
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  await page.keyboard.press("Tab");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".drawer-tab")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
  await stillOnTarget(page);
  await page.waitForTimeout(700);
  const box = await page.locator(".drawer-tab").boundingBox();
  if (!box) return;
  await page.screenshot({
    path: join(OUT, "1-ring-on-travelled-tab-dock-open-1280-chromium.png"),
    clip: {
      x: Math.max(0, box.x - 60),
      y: Math.max(0, box.y - 40),
      width: Math.min(260, 1280 - Math.max(0, box.x - 60)),
      height: 180,
    },
  });
});

// CROP 2 — the toggle's 212×212 ring around a 104×104 button: the one geometry the seam exists
// for, with `--toggle-bleed` reading −52px and NO `, 0px` behind it.
test("crop 2 · the toggle's seam, light", async ({ page }) => {
  test.skip(test.info().project.name !== "webkit", "one engine per crop");
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".sun-moon-toggle")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(900);
  const ring = await page.locator(".focus-ring").boundingBox();
  if (!ring) return;
  await page.screenshot({
    path: join(OUT, "2-toggle-ring-212-light-webkit.png"),
    clip: {
      x: Math.max(0, ring.x - 8),
      y: Math.max(0, ring.y - 8),
      width: Math.min(ring.width + 16, 1280 - Math.max(0, ring.x - 8)),
      height: Math.min(ring.height + 16, 800 - Math.max(0, ring.y - 8)),
    },
  });
});

// CROP 4 (optional) — the deck's first-option fallthrough: the scrollport is focused with no
// `aria-activedescendant` and the ring sits on the option a reader can act on.
test("crop 4 · the deck's fallthrough", async ({ page }) => {
  test.skip(test.info().project.name !== "chromium", "one engine per crop");
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", { timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const vp = document.querySelector<HTMLElement>(".gallery-viewport");
    vp?.removeAttribute("aria-activedescendant");
    vp?.focus();
  });
  await page.waitForTimeout(900);
  const ring = await page.locator(".focus-ring").boundingBox();
  if (!ring) return;
  await page.screenshot({
    path: join(OUT, "4-deck-first-option-fallthrough-chromium.png"),
    clip: {
      x: Math.max(0, ring.x - 14),
      y: Math.max(0, ring.y - 14),
      width: Math.min(ring.width + 28, 1280 - Math.max(0, ring.x - 14)),
      height: Math.min(ring.height + 28, 800 - Math.max(0, ring.y - 14)),
    },
  });
});
