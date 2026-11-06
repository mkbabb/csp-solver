// ACC-SIX pass 10 probe (scratch, never banked): voices per press, the record, and an overwrite of the press-2 cell.
import { chromium, webkit } from "@playwright/test";
const BASE = process.env.BASE ?? "http://127.0.0.1:4237";
const ENG = process.env.ENG === "webkit" ? webkit : chromium;
const VP = (process.env.VP ?? "1280x800").split("x").map(Number);
function mulberry(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const SOL16 = Array.from({ length: 256 }, (_, i) => { const r = Math.floor(i / 16); return ((4 * (r % 4) + Math.floor(r / 4) + (i % 16)) % 16) + 1; });
const keep = (seed) => { const rnd = mulberry(seed); const idx = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } return new Set(idx.slice(0, 86)); };
const enc = (sol, K) => "?board=" + Buffer.from(String.fromCharCode(1) + "4." + sol.map((v, i) => (K.has(i) ? v.toString(36) : "0")).join(""), "latin1").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const T = (sol) => Array.from({ length: 256 }, (_, i) => sol[(i % 16) * 16 + Math.floor(i / 16)]);
const boards = { base: enc(SOL16, keep(20260923)), transposed: enc(T(SOL16), new Set([...keep(20260923)].map((i) => (i % 16) * 16 + Math.floor(i / 16)))) };
for (const s of (process.env.SEEDS ?? "").split(",").filter(Boolean)) boards["seed" + s] = enc(SOL16, keep(Number(s)));
const snap = () => ({
  voice: document.querySelector(".margin-note")?.textContent?.trim() ?? "",
  meta: document.querySelector(".margin-note-meta")?.textContent?.trim() ?? null,
  rec: document.querySelector(".margin-note-previous:not(.is-hidden)")?.textContent?.trim() ?? null,
  written: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuetext"),
  cells: [...document.querySelectorAll(".board-shell .game-cell")].map((c) => (c.querySelector("input")?.getAttribute("aria-label") ?? c.getAttribute("aria-label") ?? "") + "=" + (c.querySelector("input")?.value ?? "") + (c.querySelector(".glyph-svg") ? "G" : "")),
});
const browser = await ENG.launch();
try {
  for (const [name, b] of Object.entries(boards)) {
    if (process.env.ONLY && process.env.ONLY !== name) continue;
    const ctx = await browser.newContext({ viewport: { width: VP[0], height: VP[1] }, hasTouch: VP[0] < 900 });
    try {
      const page = await ctx.newPage();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(BASE + "/" + b);
      await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1500);
      let prev = await page.evaluate(snap);
      let wcell = -1;
      for (let k = 1; k <= Number(process.env.PRESSES ?? 6); k++) {
        if (k === 4 && (process.env.OVER ?? "1") && wcell >= 0) {
          await page.locator(".board-shell .game-cell .cell-native-input").nth(wcell).focus();
          await page.keyboard.press((process.env.OVER ?? "1"));
          await page.waitForTimeout(1500);
          const o = await page.evaluate(snap);
          console.log(`${name} OVER cell ${wcell} key ${(process.env.OVER ?? "1")}: voice(${o.voice.length}) "${o.voice}" meta ${o.meta} rec ${o.rec ? '"' + o.rec + '"' : "-"} written ${o.written} cell ${o.cells[wcell]}`);
          prev = o;
        }
        await page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click());
        await page.waitForTimeout(1500);
        const s = await page.evaluate(snap);
        const changed = s.cells.map((c, i) => (c !== prev.cells[i] ? i + ":" + c : null)).filter(Boolean);
        if (k === 2 && changed.length) wcell = Number(changed[0].split(":")[0]);
        console.log(`${name} ${VP.join("x")} press${k} voice(${s.voice.length}) "${s.voice}" meta ${s.meta} rec ${s.rec ? '"' + s.rec + '"' : "-"} written ${s.written} changed ${changed.join(" | ").slice(0, 160)}`);
        prev = s;
      }
      if ((process.env.OVER ?? "1") && wcell >= 0) {
        await page.locator(".board-shell .game-cell .cell-native-input").nth(wcell).focus();
        await page.keyboard.press((process.env.OVER ?? "1"));
        await page.waitForTimeout(1500);
        const s = await page.evaluate(snap);
        console.log(`${name} OVER cell ${wcell} key ${(process.env.OVER ?? "1")}: voice(${s.voice.length}) "${s.voice}" meta ${s.meta} rec ${s.rec ? '"' + s.rec + '"' : "-"} written ${s.written} cell ${s.cells[wcell]}`);
      }
    } finally { await ctx.close(); }
  }
} finally { await browser.close(); }
