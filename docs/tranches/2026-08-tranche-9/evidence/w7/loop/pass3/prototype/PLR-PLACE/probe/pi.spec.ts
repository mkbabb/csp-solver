import { test, expect, type Browser, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

/**
 * π — THE RECT CENSUS, BOTH PAGES IN ONE DECLARED REGIME (G18, pass 3).
 *
 * The control is the MAIN tree at `74a2b5d9` on :4244; the prototype is :4243. Both pages are
 * built from the SAME context options, so the regime is a property of the census rather than of
 * whichever page happened to be opened first (pass-2 critique §2's whole finding).
 */

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-PLACE/logs";

const PROTO = "http://127.0.0.1:4243";
const HEAD = "http://127.0.0.1:4244";

const SURFACES = [
  ".controls-card",
  ".action-bar",
  ".players-well",
  ".board-wrapper",
  ".sudoku-grid",
  ".page-root",
  ".zone-row",
  ".mobile-attribution",
  ".corner-left",
  ".corner-right",
];

async function boot(page: Page, base: string, q: string) {
  await page.goto(`${base}/${q}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(600);
}

async function census(page: Page) {
  return page.evaluate((sels) => {
    const out: Record<string, number[] | null> = {};
    for (const s of sels) {
      const el = document.querySelector(s);
      if (!el) {
        out[s] = null;
        continue;
      }
      const b = el.getBoundingClientRect();
      out[s] = [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)];
    }
    return out;
  }, SURFACES);
}

async function run(browser: Browser, w: number, h: number, coarse: boolean) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    hasTouch: coarse,
    isMobile: coarse,
    deviceScaleFactor: 1,
  });
  const a = await ctx.newPage();
  const b = await ctx.newPage();
  await boot(a, PROTO, "?size=3&difficulty=EASY");
  await boot(b, HEAD, "?size=3&difficulty=EASY");
  const witness = await a.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    hoverNone: matchMedia("(hover: none)").matches,
    tall: matchMedia("(min-height: 800px)").matches,
  }));
  const witnessHead = await b.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    hoverNone: matchMedia("(hover: none)").matches,
    tall: matchMedia("(min-height: 800px)").matches,
  }));
  const proto = await census(a);
  const head = await census(b);
  const delta: Record<string, string> = {};
  for (const s of SURFACES) {
    const p = proto[s];
    const q = head[s];
    if (!p || !q) {
      delta[s] = `${p ? "proto-only" : q ? "head-only" : "absent both"}`;
      continue;
    }
    const d = p.map((v, i) => +(v - q[i]).toFixed(2));
    delta[s] = d.every((v) => v === 0) ? "pi" : `[${d.join(", ")}]`;
  }
  await ctx.close();
  return { witness, witnessHead, proto, head, delta };
}

test("pi at phone coarse and desk fine, solo", async ({ browser }) => {
  test.setTimeout(300000);
  const out = {
    "390x844 coarse": await run(browser, 390, 844, true),
    "1280x800 fine": await run(browser, 1280, 800, false),
    "1280x800 coarse (the P1 seal's iPad cell)": await run(browser, 1280, 800, true),
  };
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/pi-census.json`, JSON.stringify(out, null, 2));
  for (const [k, v] of Object.entries(out)) {
    // eslint-disable-next-line no-console
    console.log(k, JSON.stringify(v.witness), JSON.stringify(v.delta));
  }
});
