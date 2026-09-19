/**
 * T9-W7 pass 3 · MRK-LIVE · the two rows the board route could not reach: G-LIVE-15's gallery
 * stops (`.staging-btn`, `.guard-btn`, which exist only with the deck open / armed) and the
 * hint laminate's ground (G-LIVE-11, the 0.70 rim under selection).
 *
 * Motion declared: the deck's entry is waited out (its glide ends before any read); no row
 * samples a tween.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, q = "?size=3&difficulty=EASY") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}

async function galleryReady(page: Page) {
  await boardReady(page);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", { timeout: 60000 });
  await page.waitForTimeout(1500);
}

test("G · G-LIVE-15 on the gallery's own stops", async ({ page, browserName }) => {
  await galleryReady(page);
  const read = `(() => {
    const a = document.activeElement;
    const list = [];
    for (let e = a; e; e = e.parentElement) list.push(...e.getAnimations());
    return {
      active: a ? a.tagName.toLowerCase() + '.' + (a.className || '').toString().split(/\\s+/)[0] : null,
      all: list.length,
      finite: list.filter((x) => Number.isFinite(x.effect?.getComputedTiming().endTime ?? Infinity)).length,
      rings: document.querySelectorAll('.focus-ring').length,
    };
  })()`;
  const rows: unknown[] = [];
  for (const sel of [".staging-btn", ".guard-btn", ".game-card.is-center"]) {
    const n = await page.locator(sel).count();
    if (!n) {
      rows.push({ sel, present: 0 });
      continue;
    }
    await page.evaluate((s) => {
      document.querySelector<HTMLElement>(s)?.focus({ preventScroll: true });
    }, sel);
    await page.waitForTimeout(900);
    rows.push({ sel, present: n, ...(await page.evaluate(read)) });
  }
  bank(`STOPS-gallery-${browserName}.json`, { engine: browserName, rows });
  console.log("G " + JSON.stringify(rows));
});

test("H · the hint laminate's ground under selection", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  const out = await page.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
    const cell = cells[40] ?? cells[0];
    const because = cell.querySelector<HTMLElement>(".cell-because");
    if (!because) return { because: false };
    const input = cell.querySelector<HTMLInputElement>("input.cell-native-input");
    input?.focus();
    const cs = getComputedStyle(because);
    return {
      because: true,
      background: cs.background.slice(0, 60),
      backgroundColor: cs.backgroundColor,
      boxShadow: cs.boxShadow.slice(0, 80),
      animationDuration: cs.animationDuration,
      animationName: cs.animationName,
    };
  });
  bank(`LAMINATE-${browserName}.json`, { engine: browserName, ...out });
  console.log("H " + JSON.stringify(out));
});
