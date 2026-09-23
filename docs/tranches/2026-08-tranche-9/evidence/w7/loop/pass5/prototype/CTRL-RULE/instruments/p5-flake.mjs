// T9-W7 pass 5 · CTRL-RULE — THE DESTRUCTIVE FLAKE (charter row 6), N runs per engine at 320×568.
// Pass 4 saw 1 of 6 chromium runs fail to ARM at the mid scroll state and then read the board
// clean (a Clear fired unarmed). Each iteration here is ribbon-case's state loop in a fresh
// context: dirty the board, open the sheet, and at scroll 0 / 0.5 / 1 press Clear once, then
// read: did the question stand? did the board lose its digit? The TRACE is in-page: every click
// on the Clear verb logs {detail, pointerType, coarse, dirtyGlyphs, scrollTop, t}, and every
// arm/fire is read back from the DOM 350 ms later.
// node p5-flake.mjs <chromium|webkit> <BASE> <N>
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
mkdirSync(OUT, { recursive: true });
const [ENGINE = "chromium", BASE = "http://127.0.0.1:4231/", N = "20"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const runs = [];
for (let n = 0; n < +N; n++) {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 568 }, deviceScaleFactor: 1, hasTouch: true, isMobile: ENGINE === "chromium" });
  await ctx.addInitScript(() => { try { localStorage.clear(); } catch {}
    window.__trace = [];
    document.addEventListener("click", (e) => { const b = e.target.closest?.('button[aria-label="Clear the board"]'); if (!b) return;
      window.__trace.push({ ev: "click", detail: e.detail, coarse: matchMedia("(pointer: coarse)").matches, glyphs: document.querySelectorAll(".sudoku-cell .glyph-svg").length,
        scrollTop: Math.round(document.querySelector(".controls-card")?.scrollTop ?? -1), t: Math.round(performance.now()) }); }, true); });
  const page = await ctx.newPage();
  const run = { n, states: [] };
  try {
    await page.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".sudoku-cell", { timeout: 45000 });
    await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await page.waitForTimeout(1500);
    const glyphs = () => page.evaluate(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length);
    const givens = await glyphs();
    const blank = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].findIndex((c) => !c.querySelector(".glyph-svg")));
    await page.locator(".sudoku-cell").nth(blank).click({ force: true });
    await page.evaluate((i) => { const input = document.querySelectorAll(".sudoku-cell input")[i];
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "1"); input.dispatchEvent(new Event("input", { bubbles: true })); }, blank);
    await page.waitForTimeout(400);
    const dirty = await glyphs();
    if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(1000);
    const clearBtn = page.locator('.action-bar button[aria-label="Clear the board"]').first();
    for (const frac of [0, 0.5, 1]) {
      await page.evaluate((f) => { const c = document.querySelector(".controls-card"); c.scrollTop = (c.scrollHeight - c.clientHeight) * f; }, frac);
      await page.waitForTimeout(250);
      await clearBtn.click();
      await page.waitForTimeout(350);
      const armed = (await page.locator(".confirm-ribbon").count()) === 1;
      const g = await glyphs();
      run.states.push({ frac, armed, glyphs: g, firedUnarmed: !armed && g < dirty });
      if (armed) { await page.locator(".confirm-ribbon .confirm-keep").click(); await page.waitForTimeout(300); }
      else break;
    }
    run.givens = givens; run.dirty = dirty;
    run.trace = await page.evaluate(() => window.__trace);
  } catch (e) { run.error = String(e.message || e).slice(0, 200); }
  run.fail = !!run.error || run.states.some((s) => !s.armed);
  runs.push(run);
  console.log(n, run.fail ? "FAIL" : "ok", JSON.stringify(run.states.map((s) => `${s.frac}:${s.armed ? "A" : "-"}${s.firedUnarmed ? "!" : ""}`)), run.error ?? "");
  await ctx.close();
}
const out = { engine: ENGINE, base: BASE, n: runs.length, fails: runs.filter((r) => r.fail).length, firedUnarmed: runs.filter((r) => r.states.some((s) => s.firedUnarmed)).length, runs };
writeFileSync(join(OUT, `p5-flake-${ENGINE}.json`), JSON.stringify(out, null, 1));
console.log(JSON.stringify({ engine: ENGINE, n: out.n, fails: out.fails, firedUnarmed: out.firedUnarmed }));
await browser.close();
console.log("EXIT OK");
