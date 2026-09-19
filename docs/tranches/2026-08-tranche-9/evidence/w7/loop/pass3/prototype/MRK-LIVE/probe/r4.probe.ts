/**
 * T9-W7 pass 3 · MRK-LIVE PROTOTYPE · ROUND 4 — π AT REST.
 *
 * Round 3's census read the board while its entrance stagger was still running: chromium showed
 * 5–68 px on three of twelve cells, and a SECOND run on the same server showed them on three
 * DIFFERENT cells, which is the signature of a moving board, not of a moved pixel. This row
 * waits until nothing finite is animating anywhere in the document before it reads, and the
 * same file runs against both servers.
 *
 * Motion declared (lint:motion grammar): the row is FROZEN by construction — it blocks on
 * `document.getAnimations()` going quiet and reads rects at rest. PRM is not emulated because
 * the wait, not a preference, is what freezes it.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function quiet(page: Page) {
  await page.waitForFunction(
    () =>
      document
        .getAnimations()
        .filter((a) =>
          Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity),
        )
        .filter((a) => a.playState === "running").length === 0,
    undefined,
    { timeout: 40000 },
  );
  await page.waitForTimeout(600);
}

test("π at rest", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("./?game=sudoku");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(2500);
  await quiet(page);
  const read = await page.evaluate(() => {
    const box = (e: Element | null) => {
      const r = e?.getBoundingClientRect();
      return r
        ? [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)]
        : null;
    };
    const named = [
      "button.logo-trigger",
      ".sun-moon-toggle",
      '[role="grid"]',
      "main",
      ".drawer-tab",
      ".masthead",
    ].map((s) => ({ sel: s, r: box(document.querySelector(s)) }));
    const cells = Array.from(
      document.querySelectorAll('[role="grid"] [role="gridcell"]'),
    ).map(box);
    const ghosts = Array.from(document.querySelectorAll(".cell-ghost-path")).map(box);
    const root = getComputedStyle(document.documentElement);
    return {
      named,
      cells,
      ghosts,
      cellCount: cells.length,
      ghostCount: ghosts.length,
      teacherRed: root.getPropertyValue("--color-teacher-red").trim(),
      focusSketch: root.getPropertyValue("--color-focus-sketch").trim(),
      ringInk: root.getPropertyValue("--ring-ink").trim(),
      motionNote: root.getPropertyValue("--motion-note").trim(),
      filtered: Array.from(document.querySelectorAll("*")).filter(
        (e) => getComputedStyle(e).filter !== "none",
      ).length,
    };
  });
  bank(`R4-pi-${browserName}-${process.env.PI_TAG || "proto"}.json`, {
    engine: browserName,
    base: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238",
    ...read,
  });
  console.log(
    `π ${browserName} ${process.env.PI_TAG} cells=${read.cellCount} ghosts=${read.ghostCount} filtered=${read.filtered}`,
  );
});
