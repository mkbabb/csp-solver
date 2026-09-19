/**
 * PLR-PLACE · CRITIC · G18 — THE RECT CENSUS THE PROTOTYPE LANE DID NOT RUN.
 *
 * The lane declared G18 a gap ("NOT RUN AT ALL ... a knock-on would go uncaught"). This closes
 * it or reds it. Two servers, ONE pointer regime declared here and identical on both:
 * `hasTouch: false`, `isMobile: false`, `deviceScaleFactor: 1`, the same viewport, the same
 * engine, the same seed board. The pass-1 +32.83 was an emulation artefact of two regimes; it
 * cannot recur when the regime is a constant of the probe.
 *
 *   CRIT_BASE=http://127.0.0.1:4247  CRIT_TAG=proto   (the prototype worktree)
 *   CRIT_BASE=http://127.0.0.1:4248  CRIT_TAG=head    (the MAIN tree at a8fee1f5, read-only)
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.CRIT_BASE || "http://127.0.0.1:4247";
const TAG = process.env.CRIT_TAG || "proto";
const SOLO = "/?size=3&difficulty=EASY&wire=local";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PLR-PLACE/logs";

/** The surfaces this family does NOT claim, plus the two it does (declared, read as a control). */
const SURFACES = [
  ".attribution-trigger",
  ".attribution-card",
  ".corner-right",
  ".toggle-icon",
  "h1",
  "svg.handwritten-logo",
  ".board-group",
  '[role="grid"]',
  ".sudoku-cell",
  ".controls-card",
  ".play-controls",
  ".action-bar",
  ".tray-well",
  ".drawer-tab",
  ".zone-row",
  ".players-status",
];

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

test("pi — the unclaimed rects, one regime", async ({ browser }, info) => {
  mkdirSync(OUT, { recursive: true });
  const eng = info.project.name;
  const out: Record<string, unknown> = {
    base: BASE,
    engine: eng,
    regime: { hasTouch: false, isMobile: false, deviceScaleFactor: 1 },
  };

  for (const [name, vp] of [
    ["desk", { width: 1280, height: 800 }],
    ["phone", { width: 390, height: 844 }],
  ] as const) {
    const ctx = await browser.newContext({
      viewport: vp,
      hasTouch: false,
      isMobile: false,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + SOLO);
    await settled(page);
    await page.waitForTimeout(1500);
    out[name] = await page.evaluate((sels) => {
      const rows: Record<string, unknown> = {};
      for (const s of sels) {
        // the VISIBLE one: the head mounts a desktop card and a mobile card
        const el = [...document.querySelectorAll(s)].find(
          (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
        ) as HTMLElement | undefined;
        rows[s] = el
          ? [
              +el.getBoundingClientRect().x.toFixed(2),
              +el.getBoundingClientRect().y.toFixed(2),
              +el.getBoundingClientRect().width.toFixed(2),
              +el.getBoundingClientRect().height.toFixed(2),
            ]
          : null;
      }
      rows["__cellCount"] = document.querySelectorAll(".sudoku-cell").length;
      return rows;
    }, SURFACES);
    await ctx.close();
  }
  writeFileSync(join(OUT, `pi-${TAG}-${eng}.json`), JSON.stringify(out, null, 1));
  console.log(`CRIT|pi.${TAG}.${eng}|written`);
});
