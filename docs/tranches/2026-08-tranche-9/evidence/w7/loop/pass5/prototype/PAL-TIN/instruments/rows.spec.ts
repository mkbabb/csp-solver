// PRM: frozen — PAL-TIN pass-5 scratch instrument (banked under pass5/prototype/PAL-TIN/instruments, deleted from the tree).
// MODE=f1 | tally | tape | cross | census. Every page loads ONE encoded board (?board=, the 74a2b5d9 control's deal).
import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { writeFileSync } from "node:fs";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const SOLVED: Record<number, string> = { 11: "5", 12: "1", 14: "9", 16: "7", 21: "2", 22: "4", 23: "5", 24: "1" };
const OUT = process.env.FRAME_OUT || "/tmp";
const MODE = process.env.MODE!;
async function ready(p: Page, decode = true) {
  await p.waitForSelector("svg.handwritten-logo", { timeout: 90000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 90000 }).toBeGreaterThan(0);
  if (decode) {
    const g = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
    expect(g, "the encoded board decoded").toBe(GIVENS);
  }
}
async function theme(p: Page, t: string) {
  await p.evaluate((x) => document.documentElement.classList.toggle("dark", x === "dark"), t);
  await p.waitForTimeout(900); // sleep-ok: the theme's own transition settles
}
async function room(ctx: BrowserContext, n: number, query = "") {
  const a = await ctx.newPage();
  await a.emulateMedia({ reducedMotion: "reduce" });
  await a.goto(`./?board=${BOARD}&wire=local${query}`);
  await ready(a);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const pages = [a];
  for (let i = 1; i < n; i++) {
    const p = await ctx.newPage();
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.goto(link);
    await ready(p, false);
    pages.push(p);
  }
  return { a, pages, link };
}
const write = async (p: Page, reader: Page, pos: number, v: string) => {
  await p.locator(".sudoku-cell input").nth(pos).click();
  await p.locator(".sudoku-cell input").nth(pos).fill(v);
  await expect.poll(() => reader.locator(".sudoku-cell input").nth(pos).inputValue()).toBe(v);
};
const band = async (p: Page) => {
  const a = (await p.locator(".game-cell").nth(0).boundingBox())!;
  const z = (await p.locator(".game-cell").nth(26).boundingBox())!;
  return { x: Math.floor(a.x - 8), y: Math.floor(a.y - 8), width: Math.ceil(z.x + z.width - a.x + 16), height: Math.ceil(z.y + z.height - a.y + 16) };
};
test("row", async ({ context }, info) => {
  test.slow();
  const eng = info.project.name;
  if (MODE === "f1") {
    // ONE variable: `?selfink=0` on A. Same board, same four cells, the same two writers.
    const q = process.env.SELFINK === "0" ? "&selfink=0" : "";
    const { a, pages } = await room(context, 2, q);
    const b = pages[1];
    await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2, { timeout: 60000 });
    const selfinkKept = new URL(a.url()).searchParams.get("selfink");
    for (const pos of [11, 14]) await write(a, a, pos, SOLVED[pos]);
    for (const pos of [12, 16]) await write(b, a, pos, SOLVED[pos]);
    await a.locator(".sudoku-cell input").nth(22).click(); // A's focus parks on an empty cell off the four
    await a.mouse.move(2, 2);
    await a.waitForTimeout(2500); // sleep-ok: the boil parks before the photograph
    const inks = await a.evaluate(() => [11, 14, 12, 16].map((i) => getComputedStyle(document.querySelectorAll(".game-cell")[i].querySelector(".glyph-svg path")!).stroke));
    writeFileSync(`${OUT}/f1-${process.env.SELFINK === "0" ? "no" : "yes"}-${eng}.png`, await a.screenshot({ clip: await band(a) }));
    console.log(`F1 ${eng} selfink=${process.env.SELFINK ?? "default"} (url keeps selfink: ${selfinkKept}) · A's 11/14 ${inks[0]} / ${inks[1]} · B's 12/16 ${inks[2]} / ${inks[3]}`);
    return;
  }
  if (MODE === "tally") {
    const { a } = await room(context, 6);
    await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(6, { timeout: 90000 });
    const row = a.locator(".players-roster .player-row").filter({ has: a.locator(".roster-tick") });
    await expect(row).toHaveCount(1);
    await row.scrollIntoViewIfNeeded();
    await a.waitForTimeout(800); // sleep-ok: the scroller settles
    const r = (await row.boundingBox())!;
    const text = await row.innerText();
    const tick = await a.locator(".roster-tick").evaluate((s) => { const b = s.getBoundingClientRect(); const n = s.closest(".player-name")!; const rg = document.createRange(); rg.setStart(n.firstChild!, 0); rg.setEnd(n.firstChild!, n.firstChild!.textContent!.length); const t = rg.getBoundingClientRect(); return { w: +b.width.toFixed(2), h: +b.height.toFixed(2), gap: +(b.left - t.right).toFixed(2), paths: s.querySelectorAll("path").length, stroke: getComputedStyle(s.querySelector("path")!).stroke }; });
    writeFileSync(`${OUT}/tally-${eng}.png`, await a.screenshot({ clip: { x: Math.floor(r.x - 6), y: Math.floor(r.y - 6), width: Math.ceil(r.width + 12), height: Math.ceil(r.height + 12) } }));
    console.log(`TALLY ${eng} row "${text.replace(/\n/g, " ")}" · tick ${JSON.stringify(tick)}`);
    return;
  }
  if (MODE === "tape" || MODE === "cross") {
    const { a, pages } = await room(context, 2);
    const b = pages[1];
    await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2, { timeout: 60000 });
    for (const pos of [11, 12, 8]) await write(b, a, pos, pos === 8 ? "5" : SOLVED[pos]);
    await b.locator(".sudoku-cell input").nth(1).click({ force: true });
    await a.waitForTimeout(2500); // sleep-ok: the boil parks
    if (MODE === "tape") {
      await theme(a, "dark");
      const label = a.locator(".attribution-tape .washi-label");
      for (const [tag, bind] of [["stick", "var(--color-user-ink)"], ["ring", ""]] as const) {
        await a.mouse.move(2, 2);
        await a.locator(".game-cell").nth(12).hover();
        await expect(label).toBeVisible();
        if (bind) await label.evaluate((l, v) => ((l as HTMLElement).style.color = v), bind);
        const col = await label.evaluate((l) => getComputedStyle(l).color);
        const r = (await label.boundingBox())!;
        await a.waitForTimeout(300); // sleep-ok: one paint after the rebinding
        writeFileSync(`${OUT}/tape-${tag}-${eng}.png`, await a.screenshot({ clip: { x: Math.floor(r.x - 40), y: Math.floor(r.y - 30), width: Math.ceil(r.width + 80), height: Math.ceil(r.height + 90) } }));
        console.log(`TAPE-FRAME ${eng} dark cell 12 ${tag} name ${col}`);
        await label.evaluate((l) => ((l as HTMLElement).style.color = ""));
      }
      return;
    }
    // W2 §2.5 — the painted tape vs every INTERACTIVE element, each intersection clipped to the
    // scrollport (every clipping ancestor of the element, and the viewport).
    for (const pos of [11, 12, 8]) {
      await a.mouse.move(2, 2);
      await a.locator(".game-cell").nth(pos).hover();
      const label = a.locator(".attribution-tape .washi-label");
      await expect(label).toBeVisible();
      const r = await label.evaluate((l, hovered) => {
        const t = l.getBoundingClientRect();
        const clipOf = (e: Element) => {
          let x0 = 0, y0 = 0, x1 = innerWidth, y1 = innerHeight;
          for (let p = e.parentElement; p; p = p.parentElement) {
            const cs = getComputedStyle(p);
            if (cs.overflowX !== "visible" || cs.overflowY !== "visible") { const b = p.getBoundingClientRect(); x0 = Math.max(x0, b.left); y0 = Math.max(y0, b.top); x1 = Math.min(x1, b.right); y1 = Math.min(y1, b.bottom); }
          }
          return { x0, y0, x1, y1 };
        };
        const hits: string[] = []; let area = 0;
        const cells = [...document.querySelectorAll(".sudoku-cell input")];
        for (const [i, e] of [...document.querySelectorAll("input, button, a[href], [tabindex]:not([tabindex='-1'])")].entries()) {
          const b = e.getBoundingClientRect(); const c = clipOf(e);
          const w = Math.min(t.right, b.right, c.x1) - Math.max(t.left, b.left, c.x0);
          const h = Math.min(t.bottom, b.bottom, c.y1) - Math.max(t.top, b.top, c.y0);
          if (w > 0 && h > 0) { const ci = cells.indexOf(e); hits.push(`${ci >= 0 ? `cell ${ci}${ci === hovered ? "(hovered)" : ""}` : e.tagName.toLowerCase()} ${(w * h).toFixed(1)}`); area += w * h; void i; }
        }
        return { tape: `${t.width.toFixed(2)}x${t.height.toFixed(2)}`, n: hits.length, area: area.toFixed(2), hits };
      }, pos);
      console.log(`CROSS ${eng} ${process.env.ARM} cell ${pos} · tape ${r.tape} · interactive elements under it ${r.n} · ${r.area} px² · ${r.hits.join(" ; ")}`);
    }
    return;
  }
  if (MODE === "census") {
    const n = Number(process.env.N || 16);
    const { pages } = await room(context, n);
    const t0 = Date.now();
    let counts: number[] = [];
    while (Date.now() - t0 < 150000) {
      counts = await Promise.all(pages.map((p) => p.locator(".controls-card .players-roster .player-row").count()));
      if (counts.every((c) => c === n)) break;
      await pages[0].waitForTimeout(3000); // sleep-ok: the poll's own beat
    }
    console.log(`CENSUS ${eng} n=${n} after ${((Date.now() - t0) / 1000).toFixed(0)} s · roster rows per page ${counts.join(",")} · converged ${counts.filter((c) => c === n).length}/${n}`);
  }
});
