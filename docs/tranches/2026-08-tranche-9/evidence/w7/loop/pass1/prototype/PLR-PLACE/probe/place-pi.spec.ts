/**
 * PLR-PLACE · π — THE RECTS THIS FAMILY DOES NOT CLAIM.
 *
 * A rect census of the surfaces the design does not touch, run against TWO servers and
 * differenced: the prototype worktree (127.0.0.1:4246) and HEAD (127.0.0.1:4243, the pass-1
 * research lane's own dev server, serving the MAIN tree). Same probe, same viewport, same
 * engine, same seed board — so a non-zero delta on an unclaimed surface is this family's, and
 * a zero is π.
 *
 * `PLC_BASE` picks the server; the two runs are written to two files and diffed by hand.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.PLC_BASE || "http://127.0.0.1:4246";
const TAG = process.env.PLC_TAG || "proto";
const SOLO = "/?size=3&difficulty=EASY&wire=local";
const HOME =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PLR-PLACE";
const OUT = join(HOME, "logs");

const SURFACES = [
  ".attribution-trigger",
  ".corner-right",
  ".toggle-icon",
  "h1",
  ".board-group",
  '[role="grid"]',
  ".controls-card",
  ".play-controls",
  ".action-bar",
  ".tray-well",
  ".drawer-tab",
  ".sudoku-cell",
];

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

test("π — the unclaimed rects", async ({ browser }, info) => {
  mkdirSync(OUT, { recursive: true });
  const eng = info.project.name;
  const out: Record<string, unknown> = { base: BASE, engine: eng };

  for (const [name, vp] of [
    ["desk", { width: 1280, height: 800 }],
    ["phone", { width: 390, height: 844 }],
  ] as const) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    await page.goto(BASE + SOLO);
    await settled(page);
    await page.waitForTimeout(1200);
    out[name] = await page.evaluate((sels) => {
      const rows: Record<string, [number, number, number, number] | null> = {};
      for (const s of sels) {
        const el = document.querySelector(s) as HTMLElement | null;
        if (!el) {
          rows[s] = null;
          continue;
        }
        const r = el.getBoundingClientRect();
        rows[s] = [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)];
      }
      return rows;
    }, SURFACES);
    await ctx.close();
  }
  writeFileSync(join(OUT, `pi-${TAG}-${eng}.json`), JSON.stringify(out, null, 1));
  console.log(`PLC|pi.${TAG}.${eng}|${JSON.stringify(out)}`);
});
