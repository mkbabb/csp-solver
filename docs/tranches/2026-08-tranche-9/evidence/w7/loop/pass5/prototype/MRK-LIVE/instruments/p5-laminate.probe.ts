/** T9-W7 pass 5 · MRK-LIVE · THE HINT LAMINATE, raised on one route (charter row 13).
 *  Route: `?size=3&board=<payload>`; a blank cell focused by a real click; `h` once (the two-press
 *  hint's first press) raises `.is-because`. Read, per theme: the laminate's computed body and
 *  rim on the ASKED (selected) cell vs an unselected because-cell, and the painted L* of the
 *  selected cell's interior (a pixel clear of ring and glyph) before vs after the laminate. */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import fs from "node:fs";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MRK-LIVE/logs";
function mintSudoku(sub: number): string {
  const n = sub * sub;
  let cells = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const i = r * n + c;
      const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1;
      cells += (i > 1 && (r * 7 + c * 3) % 5 < 2 ? v : 0).toString(36);
    }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
const lab = ([r, g, b]: number[]) => {
  const f = (c: number) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const Y = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  return Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y;
};
async function px(page: Page, x: number, y: number) {
  const buf = await page.screenshot({ clip: { x: Math.round(x), y: Math.round(y), width: 1, height: 1 }, scale: "css" });
  const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return [data[0], data[1], data[2]];
}
test("P5-LAMINATE · the because-laminate on the asked cell and beside it", async ({ page }, info) => {
  const P = mintSudoku(3);
  const rows: unknown[] = [];
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(`./?size=3&board=${P}`);
    await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 });
    await page.waitForTimeout(1500);
    const blank = await page.evaluate(() =>
      [...document.querySelectorAll(".sudoku-cell")].findIndex((c) => !c.querySelector(".glyph-svg")),
    );
    await page.locator(".sudoku-cell input").nth(blank).click();
    await page.waitForTimeout(600);
    const box = (await page.locator(".sudoku-cell").nth(blank).boundingBox())!;
    const ix = box.x + box.width * 0.2, iy = box.y + box.height * 0.8;
    const before = await px(page, ix, iy);
    await page.keyboard.press("h");
    await expect(page.locator(".sudoku-cell.is-because").first()).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(600);
    const after = await px(page, ix, iy);
    const read = await page.evaluate((blank) => {
      const cells = [...document.querySelectorAll(".sudoku-cell")];
      const asked = cells[blank];
      const other = cells.find((c, i) => i !== blank && c.classList.contains("is-because"));
      const r = (c: Element | undefined) => {
        const l = c?.querySelector(".cell-because");
        if (!l) return null;
        const cs = getComputedStyle(l);
        return { bg: cs.backgroundColor, rim: cs.boxShadow };
      };
      return {
        askedIsBecause: asked.classList.contains("is-because"),
        askedFocused: !!asked.querySelector("input:focus-visible"),
        asked: r(asked),
        other: r(other),
        becauseCount: cells.filter((c) => c.classList.contains("is-because")).length,
      };
    }, blank);
    // THE COMPOSITE: select the because-cell itself (keyboard focus on its input), then read its
    // laminate and difference its interior with the laminate hidden — the body must yield (ΔL* 0)
    // and the rim must rise to 70%.
    const bi = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].findIndex((c) => c.classList.contains("is-because")));
    await page.evaluate((i) => document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")[i]?.focus(), bi);
    await page.waitForTimeout(700);
    const bbox = (await page.locator(".sudoku-cell").nth(bi).boundingBox())!;
    const bx = bbox.x + bbox.width * 0.2, by = bbox.y + bbox.height * 0.8;
    const selWith = await px(page, bx, by);
    const selLam = await page.evaluate((i) => {
      const c = document.querySelectorAll(".sudoku-cell")[i];
      const l = c.querySelector(".cell-because");
      const cs = l ? getComputedStyle(l) : null;
      return { stillBecause: c.classList.contains("is-because"), focused: !!c.querySelector("input:focus-visible"), bg: cs?.backgroundColor ?? null, rim: cs?.boxShadow ?? null };
    }, bi);
    await page.addStyleTag({ content: ".cell-because { display: none !important; }" });
    await page.waitForTimeout(300);
    const selWithout = await px(page, bx, by);
    const row = { engine: info.project.name, theme, payload: P, blank, ...read, interiorBefore: before, interiorAfter: after, dLstar: +(lab(after) - lab(before)).toFixed(2),
      selectedBecause: { index: bi, ...selLam, interiorWithLaminate: selWith, interiorLaminateHidden: selWithout, dLstar: +(lab(selWith) - lab(selWithout)).toFixed(2) } };
    rows.push(row);
    console.log("LAMINATE " + JSON.stringify(row));
  }
  fs.appendFileSync(`${OUT}/P5-laminate.log`, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
});
