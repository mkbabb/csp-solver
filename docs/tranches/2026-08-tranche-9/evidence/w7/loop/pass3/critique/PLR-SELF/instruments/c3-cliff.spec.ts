/**
 * C7 — the row budget's cliff. `ROWS = {tall: 5, short: 2}` is switched on ONE module MQL,
 * `(min-height: 800px)`, with the reason given as the phone's board top. A desktop window one
 * pixel short of 800 is not a phone; this reads what it gets.
 */
import { expect, test } from "@playwright/test";
import { SOLO, addPeers, invite, lobby, openSheet, say, settled } from "./harness";

for (const h of [800, 799, 780]) {
  test(`C7 — 1280x${h}: what the budget draws with seven at the table`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: h } });
    const a = await ctx.newPage();
    await a.goto(SOLO);
    await settled(a);
    await invite(a);
    await addPeers(a, 6);
    await a.waitForTimeout(700);
    await openSheet(a);
    const got = await a.evaluate(() => {
      const l = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => getComputedStyle(e).visibility === "visible",
      )!;
      const r = l.getBoundingClientRect();
      const grid = document.querySelector(".board-wrapper")!.getBoundingClientRect();
      return {
        tallMQ: window.matchMedia("(min-height: 800px)").matches,
        rows: l.querySelectorAll(".pl-row").length,
        state: (l.querySelector(".pl-state")?.textContent || "").trim(),
        more: (l.querySelector(".pl-more")?.textContent || "").trim(),
        sheetBottom: +r.bottom.toFixed(1),
        sheetH: +r.height.toFixed(1),
        boardTop: +grid.top.toFixed(1),
        viewportH: window.innerHeight,
      };
    });
    say({ c: "C7", h, ...got });
    expect(await lobby(a).isVisible()).toBe(true);
    await ctx.close();
  });
}
