// Is a planted media-scoped faint ring LIVE on the served page? Reads the computed opacity of the chrome
// ring and the living cell's ghost with the ring on a stop, in the regime named on the command line.
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("@playwright/test");
const [url, regime] = process.argv.slice(2);
for (const e of ["chromium", "webkit"]) {
  const b = await pw[e].launch();
  const ctxOpts = { viewport: { width: 1280, height: 800 } };
  if (regime === "coarse") Object.assign(ctxOpts, { viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: e === "chromium" });
  const ctx = await b.newContext(ctxOpts); const p = await ctx.newPage();
  if (regime === "nopref") await p.emulateMedia({ reducedMotion: "no-preference" });
  if (regime === "reduce") await p.emulateMedia({ reducedMotion: "reduce" });
  if (regime === "more") await p.emulateMedia({ contrast: "more", reducedMotion: "reduce" });
  if (regime === "dark") await p.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  if (regime === "light") await p.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await p.goto(url + "/?game=sudoku");
  await p.waitForSelector(".board-shell .game-cell .cell-native-input", { timeout: 60000 });
  await p.waitForTimeout(1500);
  await p.keyboard.press("Tab");
  await p.evaluate(() => document.querySelector("button.tuner-toggle")?.focus());
  await p.waitForTimeout(900);
  const chrome = await p.evaluate(() => { const r = document.querySelector(".focus-ring"); return { dark: document.documentElement.classList.contains("dark"), more: matchMedia("(prefers-contrast: more)").matches, ring: !!r, opacity: r ? getComputedStyle(r).opacity : null, coarse: matchMedia("(pointer: coarse)").matches, prm: matchMedia("(prefers-reduced-motion: reduce)").matches }; });
  await p.locator(".board-shell .game-cell .cell-native-input").nth(40).focus();
  await p.keyboard.press("Shift"); await p.waitForTimeout(900);
  const t2 = await p.evaluate(() => { const g = document.querySelector(".game-cell:has(input:focus-visible) .cell-ghost"); return g ? getComputedStyle(g).opacity : null; });
  console.log(e, regime, JSON.stringify({ ...chrome, tier2GhostOpacity: t2 }));
  await b.close();
}
