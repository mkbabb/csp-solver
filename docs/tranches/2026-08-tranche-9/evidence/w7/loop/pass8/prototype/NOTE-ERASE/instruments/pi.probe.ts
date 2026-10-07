/** NOTE-ERASE pass 8 · π against 74a2b5d9: whole-DOM rects + computed line-height/min-height of every `#app *`,
 *  tree (:4248) vs the control (:4250, index-CubiZsMVSwTc), at rest and after speech (a hint), two cells, both
 *  engines. The in-run FLOOR is the control read twice (control vs control): the noise a byte-identical dist reads. */
import { test, type Page } from "@playwright/test";
import { encodeSudoku } from "../e2e/wire";
const GIVENS: Record<number, number> = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
const PAYLOAD = encodeSudoku(3, GIVENS, 81);
const EXPECTED = Array.from({ length: 81 }, (_, i) => (GIVENS[i] ? String(GIVENS[i]) : ".")).join("");
const bs = (p: Page) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
const snap = (p: Page) => p.evaluate(() => {
  const out: string[] = [];
  document.querySelectorAll("#app *").forEach((el, i) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); const inNote = !!el.closest(".margin-note-block"); out.push(`${i}|${el.tagName}.${(el.getAttribute("class") || "").split(/\s+/)[0]}|${inNote ? "NOTE" : ""}|${r.x.toFixed(2)},${r.y.toFixed(2)},${r.width.toFixed(2)},${r.height.toFixed(2)}|${cs.lineHeight}|${cs.minHeight}`); });
  return { rows: out, docH: document.documentElement.scrollHeight };
});
const CELLS = [[390, 844, true], [1280, 800, false]] as const;
for (const [w, h, coarse] of CELLS)
  test(`pi ${w}x${h}`, async ({ browser, browserName }) => {
    const got: Record<string, { rest: Awaited<ReturnType<typeof snap>>; spoke: Awaited<ReturnType<typeof snap>>; id: string; coarse: boolean }> = {};
    for (const [arm, port] of [["tree", 4248], ["ctl", 4250], ["ctl2", 4250]] as const) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${port}/?board=${PAYLOAD}`);
      await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
      for (let i = 0; i < 80 && (await bs(page)) !== EXPECTED; i++) await page.waitForTimeout(100);
      if ((await bs(page)) !== EXPECTED) throw new Error("payload not dealt");
      const c = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
      await page.waitForTimeout(1500);
      const rest = await snap(page);
      await page.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
      await page.keyboard.press("h");
      await page.waitForTimeout(1800);
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      await page.waitForTimeout(400);
      const spoke = await snap(page);
      got[arm] = { rest, spoke, coarse: c, id: await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "") };
      await ctx.close();
    }
    const cmp = (a: { rows: string[]; docH: number }, b: { rows: string[]; docH: number }) => {
      let note = 0, other = 0; const sample: string[] = [];
      const n = Math.max(a.rows.length, b.rows.length);
      for (let i = 0; i < n; i++) if (a.rows[i] !== b.rows[i]) { if ((a.rows[i] ?? "").includes("|NOTE|") || (b.rows[i] ?? "").includes("|NOTE|")) note++; else { other++; if (sample.length < 3) sample.push(`${a.rows[i]} ≠ ${b.rows[i]}`); } }
      return { nA: a.rows.length, nB: b.rows.length, noteDiffs: note, unclaimedDiffs: other, docH: [a.docH, b.docH], sample };
    };
    console.log(`E8PI|${browserName}|${w}x${h}|coarse=${got.tree.coarse}/${got.ctl.coarse}|${got.tree.id.slice(-24)} vs ${got.ctl.id.slice(-24)}|REST ${JSON.stringify(cmp(got.tree.rest, got.ctl.rest))}|SPOKE ${JSON.stringify(cmp(got.tree.spoke, got.ctl.spoke))}|FLOOR rest ${JSON.stringify(cmp(got.ctl.rest, got.ctl2.rest))} spoke ${JSON.stringify(cmp(got.ctl.spoke, got.ctl2.spoke))}`);
  });
