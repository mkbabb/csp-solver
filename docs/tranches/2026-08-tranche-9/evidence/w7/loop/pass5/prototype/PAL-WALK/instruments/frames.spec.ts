// PRM: live — PAL-WALK pass-5 frame instrument (scratch; banked under pass5/prototype/PAL-WALK/instruments).
// Every frame loads ONE encoded board (?board=, minted from the 74a2b5d9 control's deal) and writes the
// SOLVED digit into the same empty cells, so a pair differs by the one variable its caption names.
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const SOLVED: Record<number, string> = { 11: "5", 12: "1", 14: "9", 16: "7", 21: "2", 22: "4", 23: "5", 24: "1" };
const OUT = process.env.FRAME_OUT!;
const MODE = process.env.FRAME_MODE!; // hands | room | tape
async function ready(p: Page) {
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  const g = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
  expect(g, "the encoded board decoded").toBe(GIVENS);
}
/** Rows 0–2 of the board: every written cell is there. */
async function band(p: Page) {
  const a = (await p.locator(".game-cell").nth(0).boundingBox())!;
  const z = (await p.locator(".game-cell").nth(26).boundingBox())!;
  return { x: Math.floor(a.x - 8), y: Math.floor(a.y - 8), width: Math.ceil(z.x + z.width - a.x + 16), height: Math.ceil(z.y + z.height - a.y + 16) };
}
async function theme(p: Page, t: string) {
  await p.evaluate((x) => { document.documentElement.classList.toggle("dark", x === "dark"); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, t);
  await p.waitForTimeout(800); // sleep-ok: the theme's own transition settles before a byte is read
}
test("frame", async ({ context }, info) => {
  test.slow();
  const tag = `${process.env.FRAME_TAG}-${info.project.name}`;
  if (MODE === "hands") {
    // n hands bound on the eight cells the way the product binds an author's entry (the cell's own
    // --color-user-ink); the source is the TREE's own: WALK's inkFor(i), TIN's var(--color-peer-k).
    const p = await context.newPage();
    await p.goto(`./?board=${BOARD}`);
    await ready(p);
    for (const [pos, v] of Object.entries(SOLVED)) { await p.locator(".sudoku-cell input").nth(+pos).click(); await p.locator(".sudoku-cell input").nth(+pos).fill(v); }
    await p.mouse.move(2, 2);
    await theme(p, process.env.FRAME_THEME || "light");
    const n = Number(process.env.FRAME_HANDS);
    const inks = await p.evaluate(async ([n, src]) => {
      const out: string[] = [];
      if (src === "tin") for (let k = 0; k < n; k++) out.push(`var(--color-peer-${(k % 5) + 1})`);
      else { const m = (await import(/* @vite-ignore */ "/src/games/shared/playerIdentity.ts")) as { inkFor: (i: number) => Record<string, string> }; for (let k = 0; k < n; k++) out.push(m.inkFor(k)["--color-user-ink"]); }
      return out;
    }, [n, process.env.RING_SRC || "walk"] as const);
    await p.evaluate(([cells, inks]) => {
      (cells as number[]).forEach((pos, j) => {
        const cell = document.querySelectorAll<HTMLElement>(".game-cell")[pos];
        const ink = (inks as string[])[j % (inks as string[]).length];
        const set = () => cell.style.setProperty("--color-user-ink", ink);
        set(); new MutationObserver(() => { if (cell.style.getPropertyValue("--color-user-ink") !== ink) set(); }).observe(cell, { attributes: true, attributeFilter: ["style"] });
      });
    }, [Object.keys(SOLVED).map(Number), inks] as const);
    await p.waitForTimeout(2500); // sleep-ok: the boil parks before the photograph
    writeFileSync(`${OUT}/${tag}.png`, await p.screenshot({ clip: await band(p) }));
    console.log(`FRAME ${tag} hands ${n} inks ${inks.join(" ; ")}`);
    return;
  }
  // room + tape: two pages in one context, ?wire=local (dev), the product's invite verb.
  const a = await context.newPage();
  await a.goto(`./?board=${BOARD}&wire=local`);
  await ready(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled(); await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await context.newPage();
  await b.goto(a.url()); await ready(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2, { timeout: 45000 });
  const write = async (p: Page, pos: number) => { await p.locator(".sudoku-cell input").nth(pos).click(); await p.locator(".sudoku-cell input").nth(pos).fill(SOLVED[pos]); await expect.poll(() => (p === a ? b : a).locator(".sudoku-cell input").nth(pos).inputValue()).toBe(SOLVED[pos]); };
  if (MODE === "room") {
    // F1: A (the starter, index 0) writes 11 and 14; B (index 1) writes 12 and 16. A's board is photographed.
    await write(a, 11); await write(b, 12); await write(a, 14); await write(b, 16);
    await b.locator(".sudoku-cell input").nth(40).click({ force: true });
    await a.mouse.move(2, 2); await a.locator(".sudoku-cell input").nth(0).blur();
    await theme(a, process.env.FRAME_THEME || "light");
    await a.waitForTimeout(2500); // sleep-ok: the boil parks before the photograph
    const inks = await a.evaluate(() => [11, 12, 14, 16].map((i) => { const g = document.querySelectorAll(".game-cell")[i].querySelector(".glyph-svg path, .glyph-svg"); return `${i}:${g ? getComputedStyle(g).stroke || getComputedStyle(g).color : "?"}`; }));
    writeFileSync(`${OUT}/${tag}.png`, await a.screenshot({ clip: await band(a) }));
    console.log(`FRAME ${tag} room · ${inks.join(" ; ")}`);
    return;
  }
  // tape: B writes 12 (a given above it: the tape crosses the grid line), A hovers it at night.
  await write(b, 12);
  await b.locator(".sudoku-cell input").nth(40).click({ force: true });
  await theme(a, "dark");
  await a.waitForTimeout(2500); // sleep-ok: the boil parks
  await a.locator(".game-cell").nth(12).hover();
  const label = a.locator(".attribution-tape .washi-label");
  await expect(label).toBeVisible();
  const cell = (await a.locator(".game-cell").nth(12).boundingBox())!;
  const clip = { x: Math.floor(cell.x - cell.width * 0.9), y: Math.floor(cell.y - cell.height * 0.9), width: Math.ceil(cell.width * 2.8), height: Math.ceil(cell.height * 1.5) };
  for (const [arm, bg] of [["b-card", ""], ["a-translucent", "var(--sheet-washi-neutral)"]] as const) {
    await label.evaluate((l, v) => { (l as HTMLElement).style.background = v; }, bg);
    await a.waitForTimeout(300); // sleep-ok: one paint
    writeFileSync(`${OUT}/${tag}-${arm}.png`, await a.screenshot({ clip }));
    const bgc = await label.evaluate((l) => getComputedStyle(l).backgroundColor + " / " + getComputedStyle(l).backgroundImage.slice(0, 60));
    console.log(`FRAME ${tag}-${arm} tape background ${bgc}`);
  }
});
