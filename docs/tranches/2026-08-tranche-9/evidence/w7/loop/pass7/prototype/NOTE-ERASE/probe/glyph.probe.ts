/** NOTE-ERASE pass 7 · T9-R8 per cell (charter row 3). 1280x800 fine, DPR 1 and 2, both themes, both engines.
 *  Two statistics on ONE photograph pair each: the pass-6 GLYPH-TEXT (core median over coverage >= 0.5, copied as p6aa.ts)
 *  and the chair's WHOLE glyph population (glyph-pop.mjs, copied). Arms: the tree's FRESH line, its SETTLED line (the rung),
 *  the control's line. In-run plants on the settled subject (FAINT30, TAIL12, TAIL35, EMPTY) must each RED. One payload. */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { encodeSudoku } from "../e2e/wire";
import { glyphText, settle } from "./p6aa";
// @ts-expect-error untyped instrument copy
import { glyphPopulation, TEXT_PLANTS, applyTail, undoTail } from "./instruments/glyph-pop.mjs";
const GIVENS: Record<number, number> = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
const PAYLOAD = encodeSudoku(3, GIVENS, 81);
const EXPECTED = Array.from({ length: 81 }, (_, i) => (GIVENS[i] ? String(GIVENS[i]) : ".")).join("");
const bs = (p: Page) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
const ga = (p: Page) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => /given clue (\S+)/.exec(i.getAttribute("aria-label") ?? "")?.[1] ?? ".").join(""));
const SUBJ = ".margin-note-ink";
const pick = (g: any) => g && { red: g.red, why: g.why, pop: g.population, med: g.coreMedian, frac: g.fracUnder };
const both = async (page: Page, fracBound: number | null = null) => {
  const t = await glyphText(page);
  const g = await glyphPopulation(page, { subject: SUBJ, fracBound });
  return { age: t.age, spec: t.spec, text: { n: t.gate.n, med: t.gate.median, frac: t.gate.fraction }, pop: pick(g) };
};
for (const scheme of ["light", "dark"] as const)
  for (const dpr of [1, 2])
    test(`glyph ${scheme} dpr${dpr}`, async ({ browser, browserName }) => {
      test.setTimeout(300000);
      const row: Record<string, unknown> = { engine: browserName, scheme, dpr, cell: "1280x800 fine", payload: PAYLOAD };
      for (const [arm, port] of [["tree", 4248], ["control", 4249]] as const) {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, colorScheme: scheme });
        const page = await ctx.newPage();
        await page.goto(`http://127.0.0.1:${port}/?board=${PAYLOAD}`);
        await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
        for (let i = 0; i < 80 && (await bs(page)) !== EXPECTED; i++) await page.waitForTimeout(100);
        if ((await bs(page)) !== EXPECTED || (await ga(page)) !== EXPECTED) throw new Error("payload not dealt");
        row[`${arm}Id`] = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "");
        await page.waitForTimeout(900);
        await page.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
        await page.keyboard.press("h");
        await page.waitForTimeout(320);
        row[`${arm}Text`] = await page.evaluate(() => (document.querySelector(".margin-note")?.textContent || "").trim());
        row[`${arm}Fresh`] = await both(page);
        if (arm === "tree") {
          await settle(page);
          const s = await both(page);
          row.treeSettled = s;
          // G3's bound until the estate stamps T9-R8: the SHIPPED reading + 0.05 (LAWS P6 §E).
          const bound = +((s.pop?.frac ?? 1) + 0.05).toFixed(3);
          row.bound = bound;
          const plants: Record<string, unknown> = {};
          const P = TEXT_PLANTS(SUBJ);
          for (const k of ["FAINT30_fill", "TAIL12_a25", "TAIL35_a25", "EMPTY_hidden"]) {
            const pl = P[k];
            let tag: any = null;
            if (typeof pl === "string") tag = await page.addStyleTag({ content: pl }); else await applyTail(page, SUBJ, pl.tail);
            await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
            plants[k] = pick(await glyphPopulation(page, { subject: SUBJ, fracBound: bound }));
            if (tag) await tag.evaluate((e: Element) => e.remove()); else await undoTail(page, SUBJ);
          }
          row.plants = plants;
          row.treeSettledBounded = pick(await glyphPopulation(page, { subject: SUBJ, fracBound: bound }));
          expect(await page.evaluate((s) => document.querySelector(s)?.getAttribute("data-note-age"), SUBJ)).toBe("settled");
        }
        await ctx.close();
      }
      console.log(`E7GLYPH|${JSON.stringify(row)}`);
      writeFileSync(`${process.env.OUT}/glyph-${browserName}-${scheme}-dpr${dpr}.json`, JSON.stringify(row, null, 2));
    });
