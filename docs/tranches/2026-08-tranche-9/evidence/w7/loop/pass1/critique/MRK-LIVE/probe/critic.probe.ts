import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

/**
 * PASS-1 CRITIC re-measurement of MRK-LIVE, against the prototype worktree's own dev server.
 * Read-only on product files. Three questions the prototype's own probes did not ask:
 *   A. does the living mark's CASCADE reach cells it does not own? (`data-mark-pose` is written
 *      on the GRID, and the swap rules are descendant selectors)
 *   B. does the chrome ring RE-BAKE its four poses while the page scrolls under a held focus?
 *   C. the headline: swap count, final pose, and WHEN the first swap lands relative to focus.
 */

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/MRK-LIVE/logs";
mkdirSync(OUT, { recursive: true });

async function board(page: Page) {
  await page.goto("/?game=sudoku&size=9");
  await page.waitForSelector(".game-cell", { timeout: 60000 });
  await page.waitForTimeout(1200);
}

test("A · the living mark's cascade, on cells it does not own", async ({
  page,
  browserName,
}) => {
  await board(page);
  // Focus a cell for real, so the grid carries a real `data-mark-pose`.
  const cells = page.locator(".game-cell");
  await cells.nth(40).locator("input").focus();
  await page.waitForTimeout(900); // past the revolution; the grid rests at pose 0

  const rows = await page.evaluate(() => {
    const grid = document.querySelector<HTMLElement>('[data-mark-pose]');
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".game-cell"));
    const focused = cells.findIndex((c) => c.querySelector("input:focus"));
    // Three NEIGHBOURS the tier law says stay STILL, in the states that make them visible.
    const conflict = cells[5];
    const peer = cells[7];
    const hover = cells[9];
    conflict.classList.add("is-invalid");
    peer.classList.add("is-peer-cursor");
    hover.querySelector(".cell-ghost")?.classList.add("is-active");
    const sample = (el: HTMLElement) => {
      const p = el.querySelector<SVGPathElement>(".cell-ghost-path");
      const ghost = el.querySelector<HTMLElement>(".cell-ghost");
      return {
        pathOpacity: p ? getComputedStyle(p).opacity : "none",
        ghostOpacity: ghost ? getComputedStyle(ghost).opacity : "none",
        stroke: p ? getComputedStyle(p).stroke : "none",
      };
    };
    const out: Record<string, unknown>[] = [];
    for (const pose of ["0", "1", "2", "3"]) {
      grid!.setAttribute("data-mark-pose", pose);
      out.push({
        pose,
        focusedIdx: focused,
        pathsOnFocused: cells[focused].querySelectorAll(".cell-ghost-path").length,
        conflict: sample(conflict),
        peer: sample(peer),
        hover: sample(hover),
      });
    }
    return out;
  });
  writeFileSync(`${OUT}/A-cascade-${browserName}.json`, JSON.stringify(rows, null, 2));
  console.log("A", browserName, JSON.stringify(rows));
  expect(rows.length).toBe(4);
});

test("B · does the chrome ring re-bake while the page scrolls", async ({
  page,
  browserName,
}) => {
  await page.goto("/");
  await page.waitForSelector(".game-card", { timeout: 60000 });
  await page.waitForTimeout(1500);
  const res = await page.evaluate(async () => {
    // Focus something off the board that the ring takes.
    const btn = document.querySelector<HTMLElement>(
      ".logo-trigger, .sun-moon-toggle, button",
    );
    btn?.focus();
    await new Promise((r) => setTimeout(r, 900));
    const ring = document.querySelector<SVGElement>(".focus-ring");
    if (!ring) return { ring: false };
    let dWrites = 0;
    let styleWrites = 0;
    const mo = new MutationObserver((recs) => {
      for (const r of recs) {
        if (r.attributeName === "d") dWrites++;
        if (r.attributeName === "style" && r.target === ring) styleWrites++;
      }
    });
    mo.observe(ring, { attributes: true, subtree: true });
    const firstD = ring.querySelector("path")?.getAttribute("d") ?? "";
    // A real scroll of the page under a held focus.
    for (let i = 0; i < 24; i++) {
      window.scrollBy(0, 10);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    await new Promise((r) => setTimeout(r, 300));
    mo.disconnect();
    const lastD = ring.querySelector("path")?.getAttribute("d") ?? "";
    return {
      ring: true,
      dWrites,
      styleWrites,
      geometryChanged: firstD !== lastD,
      scrolled: window.scrollY,
    };
  });
  writeFileSync(`${OUT}/B-scroll-rebake-${browserName}.json`, JSON.stringify(res, null, 2));
  console.log("B", browserName, JSON.stringify(res));
});

test("C · the revolution: swaps, final pose, and when the first swap lands", async ({
  page,
  browserName,
}) => {
  await board(page);
  const res = await page.evaluate(async () => {
    const grid = document.querySelector<HTMLElement>('[data-mark-pose]');
    const input = document
      .querySelectorAll<HTMLElement>(".game-cell")[40]
      .querySelector<HTMLElement>("input");
    const swaps: { t: number; pose: string | null }[] = [];
    const mo = new MutationObserver(() => {
      swaps.push({
        t: Math.round(performance.now() - t0),
        pose: grid!.getAttribute("data-mark-pose"),
      });
    });
    const t0 = performance.now();
    mo.observe(grid!, { attributes: true, attributeFilter: ["data-mark-pose"] });
    input?.focus();
    await new Promise((r) => setTimeout(r, 3800));
    mo.disconnect();
    return {
      swaps,
      finalPose: grid!.getAttribute("data-mark-pose"),
      swapsAfter700: swaps.filter((s) => s.t > 700).length,
      drawOnMs: 180,
    };
  });
  writeFileSync(`${OUT}/C-revolution-${browserName}.json`, JSON.stringify(res, null, 2));
  console.log("C", browserName, JSON.stringify(res));
});
