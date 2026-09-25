/** NOTE-ERASE pass 7 · F-ERASE-2 arm 2 READ on s10 (charter row 4): the parked record (`h` then `g`) at 1280x800 and 1440x900 fine,
 *  arms: s10 (74a2b5d9 + pass6/integrate/s10.diff), the control (74a2b5d9 = arm 1's ink placement), the tree. Rect, clip, hit,
 *  the ink box's bytes, the glyph population (chair's glyph-pop, copied) and the parked square. One payload, read back. */
import { test, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { encodeSudoku } from "../e2e/wire";
// @ts-expect-error untyped instrument copy
import { glyphPopulation } from "./instruments/glyph-pop.mjs";
// @ts-expect-error untyped instrument copy
import { rgb } from "./instruments/paint-lib.mjs";
const GIVENS: Record<number, number> = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
const PAYLOAD = encodeSudoku(3, GIVENS, 81);
const EXPECTED = Array.from({ length: 81 }, (_, i) => (GIVENS[i] ? String(GIVENS[i]) : ".")).join("");
const ARMS = (process.env.ARMS ?? "s10:4245,control:4249,tree:4248").split(",").map((a) => a.split(":"));
const bs = (p: Page) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
const ga = (p: Page) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => /given clue (\S+)/.exec(i.getAttribute("aria-label") ?? "")?.[1] ?? ".").join(""));
for (const [w, h] of [[1280, 800], [1440, 900]])
  for (const [arm, port] of ARMS)
    test(`park ${arm} ${w}x${h}`, async ({ browser, browserName }) => {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${port}/?board=${PAYLOAD}`);
      await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
      for (let i = 0; i < 80 && (await bs(page)) !== EXPECTED; i++) await page.waitForTimeout(100);
      if ((await bs(page)) !== EXPECTED || (await ga(page)) !== EXPECTED) throw new Error("payload not dealt");
      const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "");
      await page.waitForTimeout(900);
      const sq = () => page.evaluate(() => { const g = document.querySelector('[role="grid"]')!.getBoundingClientRect(); return { w: +g.width.toFixed(2), h: +g.height.toFixed(2) }; });
      const before = await sq();
      await page.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
      await page.keyboard.press("h");
      await page.waitForTimeout(800);
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      await page.keyboard.press("g");
      let prev = "";
      for (let i = 0; i < 50; i++) { const r = await page.evaluate(() => JSON.stringify([document.querySelector(".margin-note-ink")?.getBoundingClientRect(), document.querySelector('[role="grid"]')?.getBoundingClientRect()])); if (r === prev && i > 6) break; prev = r; await page.waitForTimeout(100); }
      const parked = await page.evaluate(() => {
        const ink = document.querySelector<HTMLElement>(".margin-note-ink");
        if (!ink) return null;
        const r = ink.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        let clipBottom: number | null = null, clipper = "";
        for (let n: HTMLElement | null = ink.parentElement; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.overflow !== "visible" || cs.clipPath !== "none") { clipBottom = +n.getBoundingClientRect().bottom.toFixed(2); clipper = `${n.tagName.toLowerCase()}.${(n.getAttribute("class") || "").split(/\s+/)[0]}`; break; } }
        const face = document.querySelector(".board-peek-host");
        return { text: (document.querySelector(".margin-note")?.textContent || "").trim(), inFace: !!face?.classList.contains("in-live-face"), box: { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) }, hit: hit ? `${hit.tagName.toLowerCase()}.${(hit.getAttribute("class") || "").split(/\s+/)[0]}` : null, clipper, clipBottom };
      });
      const square = await sq();
      let bytes = null;
      if (parked && parked.box.w > 0) {
        const vw = page.viewportSize()!; const x = Math.max(0, Math.floor(parked.box.x)), y = Math.max(0, Math.floor(parked.box.y));
        const clip = { x, y, width: Math.min(vw.width - x, Math.ceil(parked.box.w)), height: Math.max(1, Math.min(vw.height - y, Math.ceil(parked.box.h))) };
        const im = await rgb(await page.screenshot({ clip }));
        const counts = new Map<string, number>();
        for (let i = 0; i < im.data.length; i += 3) { const k = `${im.data[i]},${im.data[i + 1]},${im.data[i + 2]}`; counts.set(k, (counts.get(k) ?? 0) + 1); }
        bytes = { px: im.data.length / 3, distinct: counts.size, top: [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${v}px rgb(${k})`) };
      }
      const glyph = parked ? await glyphPopulation(page, { subject: ".margin-note-ink" }) : null;
      const row = { engine: browserName, arm, id, viewport: `${w}x${h}`, payload: PAYLOAD, squareBefore: before, squareParked: square, parked, bytes, glyph: glyph && { red: glyph.red, why: glyph.why, population: glyph.population, coreMedian: glyph.coreMedian, fracUnder: glyph.fracUnder } };
      console.log(`E7PARK|${JSON.stringify(row)}`);
      writeFileSync(`${process.env.OUT}/park-${arm}-${w}-${browserName}.json`, JSON.stringify(row, null, 2));
      await ctx.close();
    });
