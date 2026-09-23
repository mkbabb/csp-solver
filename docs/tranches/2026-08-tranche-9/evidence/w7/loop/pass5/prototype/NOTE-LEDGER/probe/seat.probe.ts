/**
 * NOTE-LEDGER pass 5 · THE SEATING (registry §6.6, LEDGER first) and A RECT IS NOT PAINT.
 * At the populated pose (P3: two lines), every cell: is line two PAINTED (elementFromPoint at its
 * own centre lands on it, its box inside every clipping ancestor), what does it cost the column
 * (the board and the controls against the control arm at the same pose), how much air does it
 * keep to the next thing below, and what would a `2lh` in-flow reserve cost on the same tree.
 */
import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { encodeSudoku } from "../e2e/wire";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/NOTE-LEDGER/logs";
const G: Record<number, number> = {
  0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3,
  36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9,
  71: 5, 76: 8, 79: 7, 80: 9,
};
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const BOARD = encodeSudoku(3, G, 81);
const RIGS = [
  { name: "390x844-coarse", w: 390, h: 844, coarse: true },
  { name: "393x699-coarse", w: 393, h: 699, coarse: true },
  { name: "1024x768-fine", w: 1024, h: 768, coarse: false },
  { name: "1280x800-fine", w: 1280, h: 800, coarse: false },
];

async function open(browser: Browser, base: string, rig: (typeof RIGS)[number], engine: string) {
  const ctx = await browser.newContext({ viewport: { width: rig.w, height: rig.h }, deviceScaleFactor: 2, hasTouch: rig.coarse, isMobile: rig.coarse && engine === "chromium" });
  const page = await ctx.newPage();
  await page.goto(`${base}/?board=${BOARD}`);
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1500);
  return { ctx, page };
}
async function p3(page: Page) {
  const once = async (answer: boolean) => {
    await page.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
    await page.keyboard.press("h");
    await page.waitForTimeout(800);
    if (!answer) return;
    const s = await page.evaluate(() => document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "");
    const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1];
    const i = await page.evaluate(([d, sol]) => [...document.querySelectorAll(".game-cell")].findIndex((c, i) => c.querySelector(".cell-because") && !(c.querySelector("input") as HTMLInputElement).value && sol[i] === d), [d, SOL] as const);
    await page.locator(".game-cell input").nth(i).focus();
    await page.keyboard.type(d!);
    await page.waitForTimeout(800);
  };
  await once(true);
  await once(false);
  await page.waitForTimeout(500);
}
const read = (page: Page) =>
  page.evaluate(() => {
    const two = document.querySelector<HTMLElement>(".board-margin .margin-note-previous");
    const r = two?.getBoundingClientRect();
    const hit = r ? document.elementFromPoint(r.left + Math.min(r.width / 2, 20), r.top + r.height / 2) : null;
    const clips: { el: string; inside: boolean }[] = [];
    for (let el = two?.parentElement; el && r; el = el.parentElement) {
      const cs = getComputedStyle(el);
      if (cs.overflowX !== "visible" || cs.overflowY !== "visible" || cs.clipPath !== "none") {
        const c = el.getBoundingClientRect();
        clips.push({ el: el.className.toString().split(" ")[0] || el.tagName, inside: r.top >= c.top - 0.5 && r.bottom <= c.bottom + 0.5 && r.left >= c.left - 0.5 });
      }
    }
    const pc = document.querySelector(".play-controls")?.getBoundingClientRect();
    const grid = document.querySelector('[role="grid"]')?.getBoundingClientRect();
    const voice = document.querySelector<HTMLElement>(".board-margin .margin-note");
    const vs = voice ? getComputedStyle(voice) : null;
    return {
      two: two?.textContent?.trim() ?? "",
      twoBox: r ? { top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) } : null,
      painted: !!(hit && two && (hit === two || two.contains(hit))),
      hitIs: hit ? (hit.className?.toString?.() || hit.tagName) : null,
      clips,
      airToControls: pc && r && pc.top > r.top ? +(pc.top - r.bottom).toFixed(2) : null,
      gridTop: grid ? +grid.top.toFixed(2) : null,
      controlsTop: pc ? +pc.top.toFixed(2) : null,
      scrollHeight: document.documentElement.scrollHeight,
      voiceLine: vs ? parseFloat(vs.fontSize) * 1.3 : null,
      twoLh: r?.height ?? null,
    };
  });

test("seat: line two painted, its cost and its air at P3", async ({ browser, browserName }) => {
  const rows = [];
  for (const rig of RIGS) {
    const a = await open(browser, "http://127.0.0.1:4249", rig, browserName);
    const b = await open(browser, "http://127.0.0.1:4248", rig, browserName);
    await p3(a.page);
    await p3(b.page);
    const [ra, rb] = [await read(a.page), await read(b.page)];
    const row = {
      rig: rig.name,
      proto: ra,
      control: { gridTop: rb.gridTop, controlsTop: rb.controlsTop, scrollHeight: rb.scrollHeight },
      column: { grid: ra.gridTop !== null && rb.gridTop !== null ? +(ra.gridTop - rb.gridTop).toFixed(2) : null, controls: ra.controlsTop !== null && rb.controlsTop !== null ? +(ra.controlsTop - rb.controlsTop).toFixed(2) : null },
      twoLhReserveWouldAdd: ra.voiceLine,
    };
    rows.push(row);
    console.log(`SEAT|${browserName}|${rig.name}|${JSON.stringify(row)}`);
    await a.ctx.close();
    await b.ctx.close();
  }
  writeFileSync(`${OUT}/seat-${browserName}.json`, JSON.stringify(rows, null, 1));
});
