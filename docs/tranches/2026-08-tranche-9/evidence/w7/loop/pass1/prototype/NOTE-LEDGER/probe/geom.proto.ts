/**
 * NOTE-LEDGER pass-1 PROTOTYPE — the geometry gates, against the BUILD's own second line.
 * L3 the board · L4 the fold · L5 the clearance · L10 the type-scale tripwire.
 * Depth 1 = one record standing. Depth 2 = the record displaced by the next sentence.
 */
import { test, expect } from "@playwright/test";
import { boardReady, armHint, armRefusal, geometry, ledger, bank, RIGS, r2 } from "./lib";

for (const rig of RIGS) {
  for (const theme of ["light", "dark"] as const) {
    test(`GEOM — ${rig.name} ${theme}`, async ({ browser, browserName }) => {
      const ctx = await browser.newContext({
        viewport: { width: rig.width, height: rig.height },
        deviceScaleFactor: rig.dsf,
        isMobile: rig.mobile && browserName === "chromium",
        hasTouch: rig.mobile,
      });
      const page = await ctx.newPage();
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await boardReady(page);

      const depth0 = await geometry(page);
      await armHint(page);
      const depth1 = await geometry(page);
      const line1 = await ledger(page);
      await armRefusal(page);
      const depth2 = await geometry(page);
      const line2 = await ledger(page);

      // The strip's own width against the two longest strings side by side (the desk berth's
      // ballot number). Measured on a clone of line two, off-screen, in the strip's own font.
      const widths = await page.evaluate(() => {
        const host =
          (document.querySelector(".board-margin .margin-note-previous") as HTMLElement) ||
          (document.querySelector(".board-margin .margin-note") as HTMLElement);
        const strip = document.querySelector(".board-margin") as HTMLElement;
        const probe = host.cloneNode(false) as HTMLElement;
        probe.style.position = "fixed";
        probe.style.left = "-9999px";
        probe.style.right = "auto";
        probe.style.top = "0";
        probe.style.width = "auto";
        probe.style.display = "inline-block";
        probe.style.whiteSpace = "nowrap";
        probe.setAttribute("data-nl-probe", "1");
        document.body.appendChild(probe);
        const measure = (s: string) => {
          probe.textContent = s;
          return Math.round(probe.getBoundingClientRect().width * 100) / 100;
        };
        const longest = measure("8 goes nowhere else in this column");
        const second = measure("check the greater than signs");
        const gap = parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.45;
        probe.remove();
        return {
          stripWidth: Math.round(strip.getBoundingClientRect().width * 100) / 100,
          longest,
          second,
          gapPx: Math.round(gap * 100) / 100,
          twoLongestPlusGap: Math.round((longest * 2 + gap) * 100) / 100,
          longestPlusSecondPlusGap: Math.round((longest + second + gap) * 100) / 100,
        };
      });

      const clearance =
        depth2.ribbon && depth2.lineTwo ? r2(depth2.ribbon.y - depth2.lineTwo.bottom) : null;
      const row = {
        rig: rig.name,
        theme,
        engine: browserName,
        texts: { one: line2.one, two: line2.two, depth1: line1.one },
        boardY: { depth0: depth0.board?.y, depth1: depth1.board?.y, depth2: depth2.board?.y },
        boardMovedDepth1to2: r2((depth2.board?.y ?? 0) - (depth1.board?.y ?? 0)),
        boardMovedDepth0to2: r2((depth2.board?.y ?? 0) - (depth0.board?.y ?? 0)),
        strip: { depth1: depth1.strip, depth2: depth2.strip },
        lineTwo: depth2.lineTwo,
        lineTwoBox: depth2.lineTwo?.h ?? null,
        ribbon: depth2.ribbon,
        clearance,
        scrollHeight: {
          depth0: depth0.scrollHeight,
          depth1: depth1.scrollHeight,
          depth2: depth2.scrollHeight,
        },
        widths,
      };
      bank(`geom-${rig.name}-${theme}-${browserName}.json`, row);
      console.log(
        `GEOM ${rig.name} ${theme} ${browserName} boardY ${row.boardY.depth1}→${row.boardY.depth2} (Δ${row.boardMovedDepth1to2}) lineTwo h=${row.lineTwoBox} clearance=${clearance} scrollH ${row.scrollHeight.depth1}→${row.scrollHeight.depth2} strip=${widths.stripWidth} 2×longest+gap=${widths.twoLongestPlusGap}`,
      );

      // L3 — the board is invariant when the column takes a second line.
      expect(Math.abs(row.boardMovedDepth1to2), "L3 board y invariant").toBeLessThanOrEqual(0.5);
      // L4 — the page gains no scroll.
      expect(row.scrollHeight.depth2, "L4 the fold").toBe(row.scrollHeight.depth1);
      // L5 — the phone rigs clear the ribbon.
      if (rig.mobile && clearance !== null) {
        expect(clearance, "L5 clearance over the ribbon").toBeGreaterThanOrEqual(4.0);
      }
      await ctx.close();
    });
  }
}
