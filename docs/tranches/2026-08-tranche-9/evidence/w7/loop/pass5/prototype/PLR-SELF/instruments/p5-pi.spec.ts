/** PLR-SELF pass 5 — π dist-vs-dist (built dist 4231 vs control dist 4230 at 74a2b5d9) + the filter
 *  census in both themes, on ONE minted payload, with a control-vs-control noise arm. */
import { test, expect, type Browser, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
const CTRL = "http://127.0.0.1:4230", PROTO = "http://127.0.0.1:4231";
const OUT = process.env.PLR_OUT ?? "/tmp";
const KEYS = [".corner-left", ".mobile-attribution", ".attribution-trigger", ".hover-card", ".corner-right", ".masthead", ".controls-card", ".board-wrapper", ".drawer-tab", ".page-root", ".players-roster", ".sudoku-cell"];
const PROPS = ["display", "position", "color", "background-color", "font-family", "font-size", "line-height", "font-weight", "filter", "opacity", "visibility", "border-top-width", "border-top-style", "border-top-color", "border-radius", "padding-top", "z-index", "transform"];
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  await page.evaluate(() => document.fonts.ready.then(() => 0));
  let last = ""; await expect.poll(async () => { const v = await page.evaluate(() => JSON.stringify([document.querySelector(".board-wrapper")?.getBoundingClientRect(), document.querySelector(".corner-left")?.getBoundingClientRect(), document.querySelector(".mobile-attribution")?.getBoundingClientRect()])); const s = v === last; last = v; return s; }, { intervals: [250], timeout: 20000 }).toBe(true);
}
const givens = (page: Page) => page.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")].map((i) => (/given clue/.test(i.getAttribute("aria-label") ?? "") && i.value ? i.value : "0")).join(""));
async function census(page: Page) {
  return page.evaluate(({ KEYS, PROPS }) => {
    const out: Record<string, unknown[]> = {};
    for (const k of KEYS) out[k] = [...document.querySelectorAll<HTMLElement>(k)].slice(0, k === ".sudoku-cell" ? 1 : 8).map((el) => {
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      return { tag: el.tagName, rect: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(2)), ...Object.fromEntries(PROPS.map((p) => [p, cs.getPropertyValue(p)])), frame: el.querySelectorAll(":scope > .head-sheet-edge .outline-svg").length };
    });
    const filtered = [...document.querySelectorAll<Element>("*")].filter((e) => { const cs = getComputedStyle(e); return cs.filter !== "none" && cs.display !== "none"; }).map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].join(".")} ${getComputedStyle(e).filter}`);
    return { out, filtered };
  }, { KEYS, PROPS });
}
function diff(a: any, b: any) {
  const d: string[] = [];
  for (const k of Object.keys(a)) { const A = a[k], B = b[k]; if (A.length !== B.length) d.push(`${k} count ${A.length}→${B.length}`); for (let i = 0; i < Math.min(A.length, B.length); i++) for (const p of Object.keys(A[i])) if (JSON.stringify(A[i][p]) !== JSON.stringify(B[i][p])) d.push(`${k}[${i}].${p}: ${JSON.stringify(A[i][p])} → ${JSON.stringify(B[i][p])}`); }
  return d;
}
const CELLS = [{ name: "desk-fine", w: 1280, h: 800, coarse: false }, { name: "phone-coarse", w: 390, h: 844, coarse: true }];
for (const cell of CELLS) for (const theme of ["light", "dark"] as const)
  test(`pi ${cell.name} ${theme}`, async ({ browser }, info) => {
    const mk = async (base: string, q: string) => { const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h }, hasTouch: cell.coarse, colorScheme: theme }); const p = await ctx.newPage(); await p.goto(base + "/?size=3&difficulty=EASY" + q); await settled(p); return { ctx, p }; };
    // MINT from the control's own givens.
    const m = await mk(CTRL, "");
    const g = await givens(m.p);
    const payload = await m.p.evaluate((g) => btoa(String.fromCharCode(1) + "3." + g).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), g);
    await m.ctx.close();
    const q = `&board=${payload}`;
    const arms: Record<string, any> = {};
    const filters: Record<string, any> = {};
    for (const [name, base] of [["A", CTRL], ["B", PROTO], ["A2", CTRL]] as const) {
      const { ctx, p } = await mk(base, q);
      expect(await p.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(cell.coarse);
      expect(await givens(p), `${name} reads the payload's given-set`).toBe(g);
      const shut = await census(p);
      // DRIVE: open the @mbabb card by its own gesture.
      const trig = p.locator(cell.coarse ? ".mobile-attribution .attribution-trigger" : ".corner-left .attribution-trigger");
      if (cell.coarse) await trig.tap(); else await trig.hover();
      const card = p.locator(".hover-card.is-open").first();
      await expect(card).toBeVisible();
      let last = ""; await expect.poll(async () => { const v = await card.evaluate((e) => e.getBoundingClientRect().height + getComputedStyle(e).opacity); const s = v === last; last = v; return s; }, { intervals: [150] }).toBe(true);
      const open = await census(p);
      let lobby: any = null;
      if (name === "B") {
        if (cell.coarse) await trig.tap(); else await p.mouse.move(cell.w - 5, cell.h - 5);
        await expect(p.locator(".hover-card.is-open")).toHaveCount(0);
        const mark = p.locator("[data-player-mark]:visible");
        if (cell.coarse) await mark.tap(); else await mark.click();
        await expect(p.locator("[data-lobby].is-open")).toHaveCount(1);
        let l2 = ""; await expect.poll(async () => { const v = await p.locator("[data-lobby].is-open").evaluate((e) => e.getBoundingClientRect().height + getComputedStyle(e).opacity); const s = v === l2; l2 = v; return s; }, { intervals: [150] }).toBe(true);
        lobby = await census(p);
      }
      arms[name] = { shut: shut.out, open: open.out };
      filters[name] = { shut: shut.filtered.length, open: open.filtered.length, lobby: lobby?.filtered.length ?? null, list: shut.filtered };
      await ctx.close();
    }
    const res = {
      engine: info.project.name, cell: cell.name, theme, payload, givens: g.replace(/0/g, "").length,
      noise: { shut: diff(arms.A.shut, arms.A2.shut), open: diff(arms.A.open, arms.A2.open) },
      delta: { shut: diff(arms.A.shut, arms.B.shut), open: diff(arms.A.open, arms.B.open) },
      filters,
    };
    mkdirSync(OUT, { recursive: true });
    writeFileSync(`${OUT}/pi-${info.project.name}-${cell.name}-${theme}.json`, JSON.stringify(res, null, 1));
    console.log(`PI ${info.project.name} ${cell.name} ${theme} payload=${payload.slice(0, 16)}… givens=${res.givens} noise=${res.noise.shut.length}/${res.noise.open.length} delta=${res.delta.shut.length}/${res.delta.open.length} filters A ${filters.A.shut}/${filters.A.open} B ${filters.B.shut}/${filters.B.open}/${filters.B.lobby} A2 ${filters.A2.shut}/${filters.A2.open}`);
  });
