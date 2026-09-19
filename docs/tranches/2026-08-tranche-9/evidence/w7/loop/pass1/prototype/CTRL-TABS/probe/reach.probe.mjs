// T9-W7 · pass 1 · CTRL-TABS — REACH, the floor's hit test, and the strip's memory.
//   node .scratch-w7/reach.probe.mjs
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4238/";
const OUT = process.env.OUT || "/tmp/ctrl-tabs-reach.json";
const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true, sheet: true },
  { name: "land-844x390", w: 844, h: 390, mobile: true, sheet: true },
];

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const key = `${cell.name}-${engine}`;
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    try {
      const ctx = await browser.newContext({
        viewport: { width: cell.w, height: cell.h },
        deviceScaleFactor: 1,
        isMobile: cell.mobile && engine === "chromium" ? true : undefined,
        hasTouch: cell.mobile,
        colorScheme: "light",
      });
      await ctx.addInitScript(() => {
        try {
          localStorage.clear();
          sessionStorage.clear();
          localStorage.setItem("sudoku-color-scheme", "light");
        } catch {}
      });
      const page = await ctx.newPage();
      await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
      await page.waitForTimeout(1400);

      // ZERO TAPS — the tools on the board's edge, sheet shut, hit-tested at their centres.
      const zero = await page.evaluate(() =>
        [...document.querySelectorAll(".edge-tools button")].map((b) => {
          const r = b.getBoundingClientRect();
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return { label: (b.getAttribute("aria-label") || "").slice(0, 14), hit: !!hit && (hit === b || b.contains(hit)) };
        }),
      );

      await page.locator(".drawer-tab").click({ force: true });
      await page.waitForTimeout(950);

      // THE FLOOR, hit-tested: every act's centre must resolve to the act (a floor under a
      // cover is not a floor). This is the row Playwright's own actionability check reads.
      const floorHits = await page.evaluate(() =>
        [...document.querySelectorAll(".action-verbs button")].map((b) => {
          const r = b.getBoundingClientRect();
          const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return {
            label: (b.getAttribute("aria-label") || b.innerText || "").replace(/\s+/g, " ").trim().slice(0, 20),
            hit: !!el && (el === b || b.contains(el)),
            covering: el && !(el === b || b.contains(el)) ? (el.className?.toString?.() || el.tagName).slice(0, 40) : null,
          };
        }),
      );

      // TAPS from the playing view: the face-up tray's rows are 2, another tray's are 3.
      const taps = await page.evaluate(() => {
        const faceUp = document.querySelector('[role="tab"][aria-selected="true"]')?.innerText.trim();
        const rowsIn = (panelSel) =>
          [...document.querySelectorAll(`${panelSel} .zone-row-label`)].map((s) => s.textContent.trim());
        const panels = [...document.querySelectorAll('[role="tabpanel"]')].map((p) => ({
          id: p.id.replace(/^.*panel-/, ""),
          rows: rowsIn(`#${CSS.escape(p.id)}`),
          chips: p.querySelectorAll(".ctrl-btn").length,
        }));
        return { faceUp, panels };
      });

      // THE MEMORY — a per-viewer convenience: raise `pencils`, reload, read the raised tab.
      await page.locator('[role="tab"]').nth(1).click();
      await page.waitForTimeout(150);
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
      await page.waitForTimeout(1400);
      if (cell.sheet) {
        await page.locator(".drawer-tab").click({ force: true });
        await page.waitForTimeout(950);
      }
      const remembered = await page.evaluate(
        () => document.querySelector('[role="tab"][aria-selected="true"]')?.innerText.trim(),
      );

      // AND WITHOUT STORAGE — a private window must still render the strip.
      const ctx2 = await browser.newContext({
        viewport: { width: cell.w, height: cell.h },
        deviceScaleFactor: 1,
        isMobile: cell.mobile && engine === "chromium" ? true : undefined,
        hasTouch: cell.mobile,
        colorScheme: "light",
      });
      await ctx2.addInitScript(() => {
        const thrower = {
          getItem() { throw new Error("blocked"); },
          setItem() { throw new Error("blocked"); },
          removeItem() { throw new Error("blocked"); },
          clear() { throw new Error("blocked"); },
        };
        try {
          Object.defineProperty(window, "sessionStorage", { get: () => thrower });
        } catch {}
      });
      const p2 = await ctx2.newPage();
      await p2.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
      await p2.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
      await p2.waitForTimeout(1400);
      if (cell.sheet) {
        await p2.locator(".drawer-tab").click({ force: true });
        await p2.waitForTimeout(950);
      }
      const noStorage = await p2.evaluate(() => ({
        tabs: document.querySelectorAll('[role="tab"]').length,
        raised: document.querySelector('[role="tab"][aria-selected="true"]')?.innerText.trim(),
      }));
      await ctx2.close();

      out[key] = { zero, floorHits, taps, remembered, noStorage };
      console.log(
        `[${key}] zeroTap ${zero.filter((z) => z.hit).length}/${zero.length}` +
          ` · floor hits ${floorHits.filter((f) => f.hit).length}/${floorHits.length}` +
          (floorHits.some((f) => !f.hit) ? ` COVERED BY ${floorHits.find((f) => !f.hit).covering}` : "") +
          ` · faceUp ${taps.faceUp} · remembered ${remembered} · noStorage ${noStorage.tabs} tabs raised ${noStorage.raised}`,
      );
    } catch (e) {
      out[key] = { error: String(e).slice(0, 300) };
      console.log(`[${key}] ERROR ${String(e).slice(0, 200)}`);
    }
    await browser.close();
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("\nbanked " + OUT);
