/** CTRL-TAPE pass-3 CRITIC — an independent re-run of the lane's two headline rows on the
 *  CLAIMED surface: THE PUBLISHER RAN (390x844 after settle) and THE CONFIRM'S FACE.
 *  node c3-reverify.mjs <out.json> <base> */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const OUT = process.argv[2], BASE = process.argv[3];
const out = {};
for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await eng.launch();
  for (const scheme of ["light", "dark"]) {
    const key = `${name}|${scheme}`;
    const ctx = await browser.newContext({ baseURL: BASE, viewport: { width: 390, height: 844 }, colorScheme: scheme, hasTouch: true, isMobile: name === "chromium" });
    const page = await ctx.newPage();
    try {
      await page.goto("/?size=3&difficulty=EASY");
      await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
      await page.locator(".drawer-tab").click();
      await page.waitForTimeout(1000);
      const tokens = await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        const card = document.querySelector(".controls-card");
        const cc = card ? getComputedStyle(card) : null;
        const foot = document.querySelector("#card-foot");
        const fb = foot?.getBoundingClientRect();
        return {
          mastheadFoot: cs.getPropertyValue("--masthead-foot").trim(),
          sheetChrome: (document.querySelector(".scene-controls") ? getComputedStyle(document.querySelector(".scene-controls")).getPropertyValue("--sheet-chrome").trim() : null),
          cardPadT: cc?.getPropertyValue("--card-pad-t").trim(), cardFootH: cc?.getPropertyValue("--card-pad-t") ? cc.getPropertyValue("--card-foot-h").trim() : null,
          pinBand: cc?.getPropertyValue("--pin-band").trim(), padTop: cc?.paddingTop,
          footBottom: fb ? +fb.bottom.toFixed(2) : null, innerH: window.innerHeight,
          footPadB: foot ? getComputedStyle(foot).paddingBottom : null,
          bg: getComputedStyle(document.body).backgroundColor,
          cardBg: cc?.backgroundColor,
        };
      });
      // DIRTY THE BOARD — the two-tap only arms on a coarse pointer over a dirty board.
      await page.locator(".sudoku-cell").first().dispatchEvent("pointerdown", { detail: 1, pointerType: "touch" });
      await page.locator(".sudoku-cell").first().dispatchEvent("click", { detail: 1 });
      await page.waitForTimeout(200);
      await page.keyboard.press("5");
      await page.waitForTimeout(300);
      // arm `clear` with a POINTER-shaped click (detail 1); dispatchEvent dodges the DEV tuner overlay.
      await page.locator('button[aria-label="Clear the board"]').dispatchEvent("click", { detail: 1 });
      await page.waitForTimeout(400);
      const face = await page.evaluate(() => {
        const rib = document.querySelector(".confirm-ribbon");
        if (!rib) return { armed: false };
        const r = (e) => { const b = e.getBoundingClientRect(); return { w: +b.width.toFixed(2), h: +b.height.toFixed(2), t: +b.top.toFixed(2), l: +b.left.toFixed(2) }; };
        const row = rib.parentElement;
        const answers = [...rib.querySelectorAll(".confirm-answer")].map((btn) => {
          const path = btn.querySelector("svg path, svg polyline, svg rect");
          const ps = path ? getComputedStyle(path) : null;
          return {
            text: btn.textContent.trim(), box: r(btn), color: getComputedStyle(btn).color,
            strokeWidth: ps?.strokeWidth ?? null, strokeColor: ps?.stroke ?? null,
            pathLen: path?.getTotalLength ? +path.getTotalLength().toFixed(1) : null,
          };
        });
        // ∩ with any live control outside the ribbon inside the card
        const rb = rib.getBoundingClientRect();
        let inter = 0;
        for (const el of document.querySelectorAll(".controls-card button, .controls-card [role='radio'], #card-foot button")) {
          if (rib.contains(el)) continue;
          const b = el.getBoundingClientRect();
          const w = Math.max(0, Math.min(rb.right, b.right) - Math.max(rb.left, b.left));
          const h = Math.max(0, Math.min(rb.bottom, b.bottom) - Math.max(rb.top, b.top));
          inter += w * h;
        }
        return { armed: true, ribbon: r(rib), row: row ? r(row) : null, ask: rib.querySelector(".confirm-ask")?.textContent.trim(), answers, intersect: +inter.toFixed(2) };
      });
      out[key] = { tokens, face };
    } catch (e) { out[key] = { error: String(e).slice(0, 240) }; }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
