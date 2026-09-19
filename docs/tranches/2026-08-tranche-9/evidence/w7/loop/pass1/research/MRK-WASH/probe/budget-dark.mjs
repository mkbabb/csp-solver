/**
 * MRK-WASH pass-1 · W5 — THE π-GUARD IN THE DARK.
 *
 * `wash.mjs` read ELEVEN live filters in dark mode on both engines where the round-zero
 * census (`r0/r3-marks/logs/budget-chromium.json`, light only) reads nine. This instrument
 * exists to say whether that is the overlay's doing or the tree's: it never injects anything,
 * it lists the rows by name in both regimes, and it runs before any prototype touches the page.
 *
 * Born-RED or green is not this lane's call to make on someone else's surface — the row is
 * banked with its NAMES so the count can be attributed rather than argued.
 */
import { chromium, webkit } from "playwright";
import { bank, boardReady } from "./lib.mjs";

const rows = (page) =>
  page.evaluate(() => {
    const live = [];
    for (const el of Array.from(document.querySelectorAll("*"))) {
      const cs = getComputedStyle(el);
      if (cs.filter !== "none" && cs.display !== "none")
        live.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.getAttribute("class") || "").slice(0, 44),
          filter: cs.filter.slice(0, 40),
          visible: !!el.getClientRects().length,
        });
    }
    return live;
  });

const out = {};
for (const engineName of ["chromium", "webkit"]) {
  const engine = engineName === "chromium" ? chromium : webkit;
  const browser = await engine.launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await boardReady(page);
    await page.waitForTimeout(2500); // the bake's own settle, generously
    const live = await rows(page);
    out[`${engineName}-${theme}`] = { total: live.length, rows: live };
    console.log(
      `BUDGET ${engineName} ${theme} total=${live.length} :: ` +
        live.map((r) => `${r.tag}.${r.cls.split(/\s+/)[0]}`).join(" | "),
    );
    await ctx.close();
  }
  await browser.close();
}
bank("budget-regimes.json", out);
