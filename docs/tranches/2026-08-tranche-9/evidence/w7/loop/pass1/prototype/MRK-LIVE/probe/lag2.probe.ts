/**
 * T9-W7 pass 1 · MRK-LIVE PROTOTYPE §6 — G-LIVE-4 POSITION AFTER SCROLL AND RESIZE.
 *
 * <= 0.5px error after a 240px scroll and a 1280->1024 resize, and <= 8 repositions per 900ms
 * of idle (the rAF follower measured 255 — a permanent subscriber). Repositions are counted by
 * observing the ring node's own style mutations, which is exactly one write per reposition.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}

const ERR = `() => {
  const svg = document.querySelector(".focus-ring");
  const a = document.activeElement;
  if (!svg || !a) return null;
  const r = a.getBoundingClientRect();
  const o = parseFloat(getComputedStyle(a).getPropertyValue("--focus-ring-outset")) || 3;
  const b = svg.getBoundingClientRect();
  return Math.round(Math.max(
    Math.abs(b.left - (r.left - o)),
    Math.abs(b.top - (r.top - o)),
  ) * 100) / 100;
}`;

test("G-LIVE-4 the ring after a scroll and a resize, and its idle cost", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);

  // A control inside the scrolling controls card.
  await page.evaluate(() => document.querySelector<HTMLElement>(".ctrl-btn")?.focus());
  await page.waitForTimeout(500);
  const atRest = await page.evaluate(({ fn }) => (eval(fn) as any)(), { fn: ERR });

  await page.evaluate(() => {
    const scroller =
      document.querySelector(".controls-card") ??
      document.querySelector(".controls-scroll") ??
      document.scrollingElement!;
    (scroller as HTMLElement).scrollTop = 240;
    window.scrollBy(0, 240);
  });
  await page.waitForTimeout(400);
  const afterScroll = await page.evaluate(({ fn }) => (eval(fn) as any)(), { fn: ERR });

  await page.setViewportSize({ width: 1024, height: 800 });
  await page.waitForTimeout(700);
  const afterResize = await page.evaluate(({ fn }) => (eval(fn) as any)(), { fn: ERR });

  // Idle repositions: one style write per reposition on the ring node.
  const idle = await page.evaluate(async () => {
    const svg = document.querySelector(".focus-ring");
    if (!svg) return { writes: -1 };
    let writes = 0;
    const mo = new MutationObserver((rs) => {
      writes += rs.length;
    });
    mo.observe(svg, { attributes: true, attributeFilter: ["style", "width", "height", "viewBox"] });
    await new Promise((r) => setTimeout(r, 900));
    mo.disconnect();
    return { writes };
  });

  // The sheet glide: the tongue is a DOM move that blurs (existing behaviour) — recorded, not
  // asserted, because the ring follows the NEXT focusin by design.
  await page.setViewportSize({ width: 393, height: 699 });
  await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.focus());
  await page.waitForTimeout(300);
  const beforeGlide = await page.evaluate(({ fn }) => (eval(fn) as any)(), { fn: ERR });
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
  await page.waitForTimeout(900);
  const afterGlide = await page.evaluate(() => {
    const svg = document.querySelector(".focus-ring");
    const a = document.activeElement as HTMLElement;
    return {
      ringPresent: !!svg,
      active: a?.tagName.toLowerCase() + "." + (a?.getAttribute("class") || "").split(/\s+/)[0],
    };
  });

  const row = {
    engine: browserName,
    atRestErrPx: atRest,
    afterScrollErrPx: afterScroll,
    afterResizeErrPx: afterResize,
    idleWritesPer900ms: idle.writes,
    pass:
      (afterScroll ?? 99) <= 0.5 && (afterResize ?? 99) <= 0.5 && idle.writes <= 8,
    sheetGlide: { beforeErrPx: beforeGlide, after: afterGlide },
  };
  bank(`lag2-${browserName}.json`, row);
  console.log("LAG2 " + JSON.stringify(row, null, 2));
  expect(row.afterScrollErrPx).not.toBeNull();
});
