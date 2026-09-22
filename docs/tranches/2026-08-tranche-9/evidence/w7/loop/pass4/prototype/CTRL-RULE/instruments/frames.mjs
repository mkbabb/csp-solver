// T9-W7 pass 4 · CTRL-RULE — the four cited crops, each a REPLACEMENT for a swept pass-3 crop.
// Built dist (:4233), one encoded board, hasTouch for the coarse frames (regime witnessed).
import { mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "frames");
mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || "http://127.0.0.1:4233/";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const FRAMES = [
  { f: "f1-confirm-armed-390x844-light-coarse-chromium.png", E: "chromium", theme: "light", w: 390, h: 844, coarse: true, arm: true, retires: "pass3 prototype 2-confirm-390-dark-fullwidth.png" },
  { f: "f2-confirm-armed-390x844-dark-coarse-webkit.png", E: "webkit", theme: "dark", w: 390, h: 844, coarse: true, arm: true, retires: "pass3 critique ribbon-armed-webkit-dark.png" },
  { f: "f3-rail-pinned-1280x800-light-fine-chromium.png", E: "chromium", theme: "light", w: 1280, h: 800, coarse: false, scroll: 0.5, retires: "pass3 prototype 1-rail-1280-light-pinned.png" },
  { f: "f4-foot-rest-390x844-light-coarse-webkit.png", E: "webkit", theme: "light", w: 390, h: 844, coarse: true, retires: "pass3 prototype 3-margin-320-short-arm.png" },
];
for (const fr of FRAMES) {
  const b = await (fr.E === "webkit" ? webkit : chromium).launch();
  const ctx = await b.newContext({ viewport: { width: fr.w, height: fr.h }, deviceScaleFactor: 1, hasTouch: fr.coarse, isMobile: fr.coarse && fr.E === "chromium", colorScheme: fr.theme });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, fr.theme);
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&board=${BOARD}`); await p.waitForSelector(".sudoku-cell"); await p.waitForTimeout(2200);
  const coarse = await p.evaluate(() => matchMedia("(pointer: coarse)").matches);
  if (fr.arm) {
    const blank = await p.evaluate(() => { const c = document.querySelectorAll(".sudoku-cell"); for (let i = 0; i < c.length; i++) if (!c[i].querySelector(".glyph-svg")) return i; return -1; });
    await p.locator(".sudoku-cell").nth(blank).click({ force: true });
    await p.evaluate((i) => { const inp = document.querySelectorAll(".sudoku-cell input")[i]; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(inp, "1"); inp.dispatchEvent(new Event("input", { bubbles: true })); }, blank);
    await p.waitForTimeout(500);
  }
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) { await p.locator(".drawer-tab").first().click({ force: true }); }
  await p.waitForTimeout(1100);
  if (fr.scroll != null) await p.evaluate((f) => { const c = document.querySelector(".controls-card"); c.scrollTop = (c.scrollHeight - c.clientHeight) * f; }, fr.scroll);
  if (fr.arm) { await p.locator('.action-bar button[aria-label="Clear the board"]').click(); await p.waitForTimeout(400); }
  await p.waitForTimeout(400);
  const clip = fr.coarse
    ? { x: 0, y: fr.h - 240, width: fr.w, height: 240 }
    : await p.evaluate(() => { const r = document.querySelector(".drawer-case").getBoundingClientRect(); return { x: Math.max(0, r.x - 4), y: Math.max(0, r.y - 4), width: r.width + 8, height: Math.min(innerHeight - r.y, r.height + 8) }; });
  await p.screenshot({ path: join(OUT, fr.f), clip });
  console.log(fr.f, `coarse=${coarse}`, `${statSync(join(OUT, fr.f)).size} B`, "retires:", fr.retires);
  await b.close();
}
