/**
 * NOTE-ERASE pass 7 · T9-B-LEDGER RE-SHOT ON THE INTEGRATED TREE (charter row 1). 74a2b5d9 + pass6/integrate/s13-s7-s3.diff,
 * built four times with only `LEDGER_FULFILLED` flipped (HOLD = the integrator's own index-C4rwyft5SG8y.js). One payload
 * (the classic easy 9x9, 30 givens, read back through values AND the aria-label corpus). Panels: 390x844 coarse (hasTouch,
 * isMobile, witnessed) DPR 2, both engines, both schemes; P1 = ask, answer (+100 ms "just come true" and at rest), P2 = P1 +
 * the next write, at rest. Glyph population (the chair's glyph-pop.mjs, copied) on line one at rest, 1280x800 fine DPR 1.
 */
import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { encodeSudoku } from "../e2e/wire";
// @ts-expect-error untyped instrument copy
import { glyphPopulation } from "./instruments/glyph-pop.mjs";

const ARM = process.env.ARM ?? "hold";
const ARM_ID = process.env.ARM_ID ?? "";
const BASE = process.env.ARM_URL ?? "http://127.0.0.1:4246";
const PANELS = process.env.PANELS!;
const OUT = process.env.OUT!;
const GIVENS: Record<number, number> = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
const PAYLOAD = encodeSudoku(3, GIVENS, 81);
const EXPECTED = Array.from({ length: 81 }, (_, i) => (GIVENS[i] ? String(GIVENS[i]) : ".")).join("");
const SOLUTION = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const boardString = (p: Page) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
const givensAria = (p: Page) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => /given clue (\S+)/.exec(i.getAttribute("aria-label") ?? "")?.[1] ?? ".").join(""));
const lines = (page: Page) => page.evaluate(() => {
  const one = document.querySelector<HTMLElement>(".board-margin .margin-note");
  const ink = one?.querySelector<HTMLElement>(".margin-note-ink");
  const two = document.querySelector<HTMLElement>(".board-margin .margin-note-previous");
  return { one: one?.textContent?.trim() ?? "", two: two?.textContent?.trim() ?? "", inkColor: ink ? getComputedStyle(ink).color : null, age: ink?.getAttribute("data-note-age") ?? null, spent: !!one?.classList.contains("is-spent"), twoColor: two ? getComputedStyle(two).color : null, twoDisplay: two ? getComputedStyle(two).display : null, strip: document.querySelector(".board-margin")?.getBoundingClientRect().height ?? null, coarse: matchMedia("(pointer: coarse)").matches };
});
async function open(browser: Browser, o: { w: number; h: number; coarse: boolean; dpr: number; scheme: "light" | "dark" }) {
  const ctx = await browser.newContext({ viewport: { width: o.w, height: o.h }, deviceScaleFactor: o.dpr, hasTouch: o.coarse, isMobile: o.coarse && false, colorScheme: o.scheme });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?board=${PAYLOAD}`);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  for (let i = 0; i < 80 && (await boardString(page)) !== EXPECTED; i++) await page.waitForTimeout(100);
  if ((await boardString(page)) !== EXPECTED || (await givensAria(page)) !== EXPECTED) throw new Error("payload not dealt");
  const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "");
  if (!id.includes(ARM_ID)) throw new Error(`${BASE} serves ${id}, expected ${ARM_ID}`);
  await page.waitForTimeout(900);
  return { ctx, page };
}
async function ask(page: Page) {
  await page.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
  await page.keyboard.press("h");
  await page.waitForTimeout(350);
}
async function answer(page: Page) {
  const s = (await lines(page)).one;
  const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1];
  if (!d) throw new Error(`no digit in "${s}"`);
  const target = await page.evaluate(([d, sol]) => [...document.querySelectorAll(".game-cell")].map((c, i) => ({ c, i })).filter(({ c, i }) => c.querySelector(".cell-because") && !(c.querySelector("input") as HTMLInputElement).value && sol[i] === d).map(({ i }) => i), [d, SOLUTION] as const);
  if (target.length !== 1) throw new Error(`"${s}": ${target.length} target cells`);
  await page.locator(".game-cell input").nth(target[0]).focus();
  await page.keyboard.type(d);
}
async function nextWrite(page: Page) {
  const i = await page.evaluate(() => { const all = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]; const el = all.find((x) => !x.value); el?.focus(); return el ? all.indexOf(el) : -1; });
  await page.keyboard.type(SOLUTION[i]);
}
async function shot(page: Page, name: string) {
  await page.mouse.move(1, 1).catch(() => {});
  const clip = await page.evaluate(() => {
    const g = document.querySelector('[role="grid"]')!.getBoundingClientRect();
    const m = document.querySelector(".board-margin")!.getBoundingClientRect();
    const top = Math.floor(g.bottom - 10);
    return { x: Math.floor(g.left), y: top, width: Math.ceil(g.width), height: Math.ceil(Math.max(m.bottom, g.bottom) - top + 22) };
  });
  await page.screenshot({ path: `${PANELS}/${name}-${ARM}.png`, clip });
  return clip;
}
test(`ledger re-shoot: ${ARM}`, async ({ browser, browserName }) => {
  test.setTimeout(400000);
  const rows: Record<string, unknown> = { arm: ARM, id: ARM_ID, payload: PAYLOAD, engine: browserName };
  for (const scheme of ["light", "dark"] as const) {
    // P1 — just come true (+100 ms), then at rest (+1.6 s: past arrival + 8 beats + the 350 ms settle)
    {
      const { ctx, page } = await open(browser, { w: 390, h: 844, coarse: true, dpr: 2, scheme });
      await ask(page);
      const asked = await lines(page);
      await answer(page);
      await page.waitForTimeout(100);
      const fresh = await lines(page);
      const c1 = scheme === "light" ? await shot(page, `${browserName}-${scheme}-P1fresh`) : null;
      await page.waitForTimeout(1600);
      const rest = await lines(page);
      const c2 = await shot(page, `${browserName}-${scheme}-P1rest`);
      rows[`390-${scheme}-P1`] = { asked, fresh, rest, clipFresh: c1, clipRest: c2 };
      await ctx.close();
    }
    // P2 — P1 + the next write, at rest
    if (scheme === "light") {
      const { ctx, page } = await open(browser, { w: 390, h: 844, coarse: true, dpr: 2, scheme });
      await ask(page); await answer(page); await page.waitForTimeout(700);
      await nextWrite(page); await page.waitForTimeout(1600);
      rows[`390-${scheme}-P2rest`] = { rest: await lines(page), clip: await shot(page, `${browserName}-${scheme}-P2rest`) };
      await ctx.close();
    }
    // Glyph population, line one at rest, 1280x800 fine DPR 1
    {
      const { ctx, page } = await open(browser, { w: 1280, h: 800, coarse: false, dpr: 1, scheme });
      await ask(page); await answer(page); await page.waitForTimeout(1700);
      const l = await lines(page);
      const g = l.one ? await glyphPopulation(page, { subject: ".board-margin .margin-note-ink" }) : { red: true, why: ["line one empty"] };
      const g2 = l.two ? await glyphPopulation(page, { subject: ".board-margin .margin-note-previous" }) : null;
      rows[`1280-${scheme}-P1rest`] = { lines: l, glyphOne: g, glyphTwo: g2 };
      await ctx.close();
    }
  }
  writeFileSync(`${OUT}/ledger-${ARM}-${browserName}.json`, JSON.stringify(rows, null, 2));
  console.log(`E7LEDGER|${ARM}|${browserName}|${JSON.stringify(rows)}`);
});
