/** NOTE-ERASE pass 7 · π for the ONE paint-bearing CSS move since pass 6 (the block's line-height + `min-height: 1lh`):
 *  whole-DOM rects + computed line-height/min-height of every element, tree vs the pass-6 dist (index-B5bclKNTuHnj.js),
 *  four cells, at rest and after speech (a hint). One payload, read back. */
import { test, type Page } from "@playwright/test";
import { encodeSudoku } from "../e2e/wire";
const GIVENS: Record<number, number> = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
const PAYLOAD = encodeSudoku(3, GIVENS, 81);
const EXPECTED = Array.from({ length: 81 }, (_, i) => (GIVENS[i] ? String(GIVENS[i]) : ".")).join("");
const bs = (p: Page) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
const snap = (p: Page) => p.evaluate(() => {
  const out: string[] = [];
  document.querySelectorAll("#app *").forEach((el, i) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); out.push(`${i}|${el.tagName}.${(el.getAttribute("class") || "").split(/\s+/)[0]}|${r.x.toFixed(2)},${r.y.toFixed(2)},${r.width.toFixed(2)},${r.height.toFixed(2)}|${el.classList.contains("margin-note-block") ? "BLOCK" : cs.lineHeight}|${cs.minHeight}`); });
  return { n: out.length, rows: out, docH: document.documentElement.scrollHeight, block: (() => { const b = document.querySelector(".margin-note-block"); if (!b) return null; const cs = getComputedStyle(b); return { lh: cs.lineHeight, mh: cs.minHeight, h: +b.getBoundingClientRect().height.toFixed(2) }; })() };
});
const CELLS = [[390, 844, true], [1280, 800, false], [844, 390, true], [812, 375, true]] as const;
for (const [w, h, coarse] of CELLS)
  test(`pi ${w}x${h}`, async ({ browser, browserName }) => {
    test.setTimeout(240000);
    const got: Record<string, any> = {};
    for (const [arm, port] of [["tree", 4248], ["p6", Number(process.env.P6_PORT)]] as const) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${port}/?board=${PAYLOAD}`);
      await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
      for (let i = 0; i < 80 && (await bs(page)) !== EXPECTED; i++) await page.waitForTimeout(100);
      if ((await bs(page)) !== EXPECTED) throw new Error("payload not dealt");
      const coarseSeen = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
      await page.waitForTimeout(1200);
      const rest = await snap(page);
      await page.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
      await page.keyboard.press("h");
      await page.waitForTimeout(1800);
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      await page.waitForTimeout(400);
      const spoke = await snap(page);
      got[arm] = { rest, spoke, coarseSeen, id: await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "") };
      await ctx.close();
    }
    const cmp = (a: any, b: any) => { const d: string[] = []; const n = Math.min(a.rows.length, b.rows.length); for (let i = 0; i < n; i++) { if (a.rows[i] !== b.rows[i]) d.push(`${a.rows[i]}  ≠  ${b.rows[i]}`); } return { nA: a.rows.length, nB: b.rows.length, diffs: d.length, sample: d.slice(0, 4), docH: [a.docH, b.docH], block: [a.block, b.block] }; };
    console.log(`E7PI|${browserName}|${w}x${h}|coarse=${got.tree.coarseSeen}/${got.p6.coarseSeen}|${got.tree.id.slice(-24)} vs ${got.p6.id.slice(-24)}|REST ${JSON.stringify(cmp(got.tree.rest, got.p6.rest))}|SPOKE ${JSON.stringify(cmp(got.tree.spoke, got.p6.spoke))}`);
  });
