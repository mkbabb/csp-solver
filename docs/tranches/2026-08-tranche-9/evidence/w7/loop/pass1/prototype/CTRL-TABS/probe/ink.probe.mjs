// T9-W7 · CTRL-TABS — THE QUIET RUNG, computed rather than painted. WebKit's painted read of the
// unraised tab word came back 11.87–19.22 against chromium's 5.16–5.96, which is either a real
// ink difference (the quiet rung not resolving) or the crop catching a heavier antialias. This
// asks the engine for the colour it resolved.
import { chromium, webkit } from "playwright";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4238/";
for (const engine of ["chromium", "webkit"]) {
  for (const scheme of ["light", "dark"]) {
    const b = await (engine === "webkit" ? webkit : chromium).launch();
    const ctx = await b.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: engine === "chromium" ? true : undefined,
      hasTouch: true,
      colorScheme: scheme,
    });
    await ctx.addInitScript((s) => {
      try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", s); } catch {}
    }, scheme);
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".drawer-tab", { timeout: 30000 });
    await page.waitForTimeout(1400);
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
    const r = await page.evaluate(() => {
      const tabs = [...document.querySelectorAll('[role="tab"]')];
      const raised = tabs.find((t) => t.classList.contains("is-raised"));
      const quiet = tabs.find((t) => !t.classList.contains("is-raised"));
      const cs = (el) => (el ? getComputedStyle(el.querySelector(".tab-word")).color : null);
      const root = getComputedStyle(document.documentElement);
      return {
        raisedWord: cs(raised),
        quietWord: cs(quiet),
        inkPressQuiet: root.getPropertyValue("--ink-press-quiet").trim(),
        foreground: root.getPropertyValue("--color-foreground").trim(),
        card: getComputedStyle(document.querySelector(".tab-face")).backgroundColor,
        faceOpacity: getComputedStyle(document.querySelector(".tab-face")).opacity,
      };
    });
    console.log(`[${engine} ${scheme}]`, JSON.stringify(r));
    await b.close();
  }
}
