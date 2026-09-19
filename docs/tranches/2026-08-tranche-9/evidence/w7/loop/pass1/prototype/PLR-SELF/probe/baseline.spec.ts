/**
 * The A/B read: the SAME server, the same viewport, HEAD and then the prototype.
 *
 * The per-cell print is deal-dependent (a fresh deal every load), so what it hashes here is the
 * board's PALETTE — the distinct (computed colour · `--color-user-ink` · glyph stroke) triples
 * over the first 24 cells — which is exactly the claim `mint`'s change could break and nothing
 * the deal can move. Plus the filter census, the live-region roll, and the well's box.
 */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function settleFilters(page: Page) {
  const count = () =>
    page.evaluate(
      () =>
        [...document.querySelectorAll("*")].filter((e) => {
          const cs = getComputedStyle(e);
          return cs.filter && cs.filter !== "none" && cs.display !== "none";
        }).length,
    );
  let last = -1;
  for (let i = 0; i < 40; i++) {
    const n = await count();
    if (n === last) return n;
    last = n;
    await page.waitForTimeout(250);
  }
  return last;
}

test("baseline — palette, census, regions, well", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(SOLO);
  await settled(page);
  const filters = await settleFilters(page);
  const read = await page.evaluate(() => {
    const cells = [...document.querySelectorAll(".sudoku-cell")].slice(0, 24);
    const palette = [
      ...new Set(
        cells.map((c) => {
          const cs = getComputedStyle(c);
          const g = c.querySelector(".glyph-svg path") as SVGElement | null;
          return [
            cs.color,
            cs.getPropertyValue("--color-user-ink").trim(),
            g ? getComputedStyle(g).stroke : "",
          ].join("|");
        }),
      ),
    ].sort();
    return {
      palette,
      regions: [...document.querySelectorAll("[aria-live],[role=log],[role=status]")].map(
        (e) => `${e.tagName.toLowerCase()}.${(e.className || "").toString().split(" ")[0]}`,
      ),
      roster: {
        srOnly: document.querySelector(".players-roster")?.classList.contains("sr-only"),
        tabindex: document.querySelector(".players-roster")?.getAttribute("tabindex"),
        role: document.querySelector(".players-roster")?.getAttribute("role"),
      },
      marks: document.querySelectorAll("[data-player-mark]").length,
      lobbies: document.querySelectorAll("[data-lobby]").length,
      // π on the surfaces this family does not claim: the grid's own drawn geometry, which is
      // seeded and deal-independent, and the wordmark's. Byte-compared, not eyeballed.
      gridPaths: [...document.querySelectorAll("svg path")]
        .map((p) => p.getAttribute("d") ?? "")
        .filter((d) => d.length > 80)
        .map((d) => d.length)
        .slice(0, 12),
      gridPathSum: [...document.querySelectorAll("svg path")]
        .map((p) => (p.getAttribute("d") ?? "").length)
        .reduce((a, b) => a + b, 0),
      logoPathLen: (
        document.querySelector("svg.handwritten-logo path")?.getAttribute("d") ?? ""
      ).length,
    };
  });
  // frame times: the rAF cadence of a settled page, 2s, and the long tasks in it
  const frames = await page.evaluate(
    () =>
      new Promise<{ ticks: number; longTasks: number; worstGap: number }>((res) => {
        let ticks = 0;
        let longTasks = 0;
        let worst = 0;
        let last = performance.now();
        try {
          new PerformanceObserver((l) => (longTasks += l.getEntries().length)).observe({
            entryTypes: ["longtask"],
          });
        } catch {
          /* webkit has no longtask observer */
        }
        const t0 = performance.now();
        const step = (t: number) => {
          ticks++;
          worst = Math.max(worst, t - last);
          last = t;
          if (t - t0 < 2000) requestAnimationFrame(step);
          else res({ ticks, longTasks, worstGap: +worst.toFixed(1) });
        };
        requestAnimationFrame(step);
      }),
  );
  // the well, with a room up (its height is the M14 claim)
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await verb.click();
  await page.waitForTimeout(700);
  const room = new URL(page.url()).searchParams.get("s")!;
  await page.evaluate((r) => {
    const ch = new BroadcastChannel(`board:${r}`);
    ch.postMessage({ kind: "hi", data: {}, from: "synth-a" });
    ch.postMessage({ kind: "hi", data: {}, from: "synth-b" });
    ch.close();
  }, room);
  await page.waitForTimeout(400);
  const well = await page.evaluate(() => {
    const w = document.querySelector(".players-roster")?.closest(".tray-well");
    if (!w) return null;
    const r = w.getBoundingClientRect();
    return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
  });
  console.log(
    `BASE|${JSON.stringify({ engine: info.project.name, filters, well, frames, ...read })}`,
  );
});
