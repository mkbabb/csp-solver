/** T9-W7 pass 5 · MRK-LIVE · does the pass-4 WebKit stray ring REPRODUCE, and under which
 *  gesture? 393×699, hasTouch, dpr 2 (isMobile on chromium, pass 4's B4 context verbatim).
 *  Two gestures (pass 4's programmatic `.click()` pair; a real `.tap()` pair), each read at the
 *  same instants twice: RAW (the DOM right after the call) and FRAMED (after one rAF — what a
 *  frame could paint). MRKLIVE_TAG = cure | nocure (the nine lines deleted, B4). */
import { test } from "@playwright/test";
import fs from "node:fs";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MRK-LIVE/logs";

for (const gesture of ["click", "tap", "click-no-reversal"] as const)
  test(`P5-DEPARTURE · ${gesture}`, async ({ browser, browserName }) => {
    const ctx = await browser.newContext({
      viewport: { width: 393, height: 699 },
      hasTouch: true,
      isMobile: browserName === "chromium",
      deviceScaleFactor: 2,
      baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238",
    });
    const page = await ctx.newPage();
    await page.goto("./?game=sudoku");
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
    await page.waitForTimeout(1500);
    const regime = await page.evaluate(() => ({
      coarse: matchMedia("(pointer: coarse)").matches,
      noHover: matchMedia("(hover: none)").matches,
    }));
    const snap = (framed: boolean) =>
      page.evaluate(async (framed) => {
        if (framed) await new Promise<void>((r) => requestAnimationFrame(() => r()));
        const a = document.activeElement as HTMLElement | null;
        const rings = Array.from(document.querySelectorAll(".focus-ring"));
        const owned = a?.getAttribute?.("aria-activedescendant");
        const claim = ((owned && document.getElementById(owned)) || a) as HTMLElement | null;
        const onBody = !a || a === document.body;
        let err: number | null = null;
        if (rings[0] && claim && !onBody) {
          const o = parseFloat(getComputedStyle(claim).getPropertyValue("--focus-ring-outset"));
          const rb = rings[0].getBoundingClientRect();
          const bb = claim.getBoundingClientRect();
          err = +Math.max(Math.abs(rb.left - (bb.left - o)), Math.abs(rb.top - (bb.top - o))).toFixed(2);
        }
        // Against the TAB, whatever focus says: where the ring sits relative to what it rang.
        const tab = document.querySelector(".drawer-tab")!.getBoundingClientRect();
        const rb = rings[0]?.getBoundingClientRect();
        return {
          on: onBody ? "body" : claim!.tagName.toLowerCase() + "." + String(claim!.className).split(" ")[0],
          rings: rings.length,
          err,
          ringVsTab: rb ? +Math.hypot(rb.left + rb.width / 2 - (tab.left + tab.width / 2), rb.top + rb.height / 2 - (tab.top + tab.height / 2)).toFixed(2) : null,
          expanded: document.querySelector(".drawer-tab")!.getAttribute("aria-expanded"),
        };
      }, framed);
    const press = async () =>
      gesture === "tap"
        ? page.locator(".drawer-tab").tap()
        : page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
    await page.keyboard.press("Tab");
    await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.focus({ preventScroll: true }));
    await page.waitForTimeout(500);
    const out: Record<string, unknown> = { regime, before: await snap(true) };
    await press();
    out.t0raw = await snap(false);
    out.t0framed = await snap(true);
    await page.waitForTimeout(140);
    out.t140raw = await snap(false);
    out.t140framed = await snap(true);
    if (gesture === "click-no-reversal") {
      // The PHONE TABLE (charter row 6): one activation, no reversal, read to settle.
      await page.waitForTimeout(1140);
      out.t1280framed = await snap(true);
      await page.waitForTimeout(1200);
      out.t2480framed = await snap(true);
      const line = `${process.env.MRKLIVE_TAG ?? "cure"} ${browserName} ${gesture} ${JSON.stringify(out)}`;
      console.log("DEPART " + line);
      fs.appendFileSync(`${OUT}/P5-departure.log`, line + "\n");
      await ctx.close();
      return;
    }
    await press();
    out.revRaw = await snap(false);
    out.revFramed = await snap(true);
    await page.waitForTimeout(400);
    out.t400framed = await snap(true);
    await page.waitForTimeout(1500);
    out.settleRaw = await snap(false);
    out.settleFramed = await snap(true);
    const tag = process.env.MRKLIVE_TAG ?? "cure";
    const line = `${tag} ${browserName} ${gesture} ${JSON.stringify(out)}`;
    console.log("DEPART " + line);
    fs.appendFileSync(`${OUT}/P5-departure.log`, line + "\n");
    await ctx.close();
  });
