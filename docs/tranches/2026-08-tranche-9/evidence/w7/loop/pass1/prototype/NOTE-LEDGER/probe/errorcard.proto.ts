/**
 * THE UNMEASURED COMBINATION — the error card over a two-line column, at 390×844.
 *
 * `SolverErrorNote` mounts on `solveState === "error"`. The honest way to that state on the
 * real surface is to take the wasm away from the DEAL's own leashed worker (a fresh worker per
 * deal, `transport.ts` runLeashed): the request fails, `classifyError` answers paper-note, and
 * the card mounts. Then the column is rebuilt from acts that never touch the solver (a hint
 * off the in-page technique engine; a refusal off the board's own predicate).
 */
import { test, expect } from "@playwright/test";
import { boardReady, armHint, armRefusal, ledger, geometry, bank, r2 } from "./lib";

test("ERROR CARD — over a two-line column", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: browserName === "chromium",
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  const rows: Record<string, unknown> = {};

  // Two records deep, BEFORE the fault.
  await armHint(page);
  await armRefusal(page);
  rows.beforeFault = await ledger(page);
  rows.geomBefore = await geometry(page);

  // Take the wasm away and ask for a deal.
  // Take BOTH the wasm and the worker module away: a deal builds a FRESH leashed worker
  // (`transport.ts` runLeashed), so the next deal is the one request that cannot be served
  // from an already-warm resident worker.
  let aborted = 0;
  await ctx.route(/\.wasm(\?.*)?$/, (route) => {
    aborted += 1;
    return route.abort();
  });
  await ctx.route(/solver\.worker/, (route) => {
    aborted += 1;
    return route.abort();
  });
  // The deal verb lives in the dock sheet at this width: raise the sheet (it slides ~700ms).
  await page.locator(".drawer-tab").click({ timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(900);
  const deal = page.locator('button:has-text("Deal")').first();
  await deal.click({ timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(8000);
  // Put the sheet back down: the ledger is read with the sheet shut.
  await page.locator(".drawer-tab").click({ timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(900);
  rows.abortedRequests = aborted;
  rows.solveStateProbe = await page.evaluate(() => ({
    card: !!document.querySelector(".error-note"),
    alert: !!document.querySelector('[role="alert"]'),
  }));
  rows.cardMounted = await page.evaluate(() => !!document.querySelector(".error-note"));

  // Rebuild the column: both acts are local (technique engine / the board's own predicate).
  await armHint(page);
  await page.waitForTimeout(400);
  rows.withCardOneLine = await ledger(page);
  await armRefusal(page);
  await page.waitForTimeout(400);
  rows.withCard = await ledger(page);
  rows.geomWithCard = await geometry(page);
  const g = rows.geomWithCard as Awaited<ReturnType<typeof geometry>>;
  rows.cardFootAboveRibbon =
    g.errorCard && g.ribbon ? r2(g.ribbon.y - g.errorCard.bottom) : null;
  rows.lineTwoDisplay = (rows.withCard as { twoDisplay: string | null }).twoDisplay;

  // THE HONEST HALF, since the fault would not come: the RULE, read on the real element.
  // `is-hidden` is what `:hide-previous` binds, so this reads the CSS half on the real
  // surface; the binding itself is gated in the unit battery, and the card's own foot over a
  // two-line column stays UNMEASURED (declared, not assumed).
  rows.ruleProbe = await page.evaluate(() => {
    const el = document.querySelector(".board-margin .margin-note-previous") as HTMLElement | null;
    const board = document.querySelector(".board-wrapper") as HTMLElement;
    if (!el) return null;
    const before = {
      display: getComputedStyle(el).display,
      boardY: Math.round(board.getBoundingClientRect().y * 100) / 100,
      scrollH: document.scrollingElement?.scrollHeight ?? null,
    };
    el.classList.add("is-hidden");
    const after = {
      display: getComputedStyle(el).display,
      boardY: Math.round(board.getBoundingClientRect().y * 100) / 100,
      scrollH: document.scrollingElement?.scrollHeight ?? null,
    };
    el.classList.remove("is-hidden");
    return { before, after };
  });
  bank(`errorcard-${browserName}.json`, rows);
  console.log("ERRORCARD", JSON.stringify(rows));
  if (rows.cardMounted) {
    expect(rows.lineTwoDisplay, "line two stands down for the card").toBe("none");
  } else {
    const rp = rows.ruleProbe as { after: { display: string } } | null;
    expect(rp?.after.display, "the rule itself, on the real element").toBe("none");
  }
  await ctx.close();
});
