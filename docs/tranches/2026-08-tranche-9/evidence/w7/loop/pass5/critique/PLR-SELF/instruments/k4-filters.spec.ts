/** CRITIC k4 — filter population by the estate's counting rule (own filter != none, own display != none),
 *  built dist vs built control, shut / card open / lobby open, both themes, desk fine + phone coarse. */
import { test, expect, type Page } from "@playwright/test";
const ARMS = { control: "http://127.0.0.1:4244", mine: "http://127.0.0.1:4245" };
const count = (p: Page) => p.evaluate(() => { const out: string[] = []; for (const el of document.querySelectorAll("*")) { const cs = getComputedStyle(el); if (cs.filter && cs.filter !== "none" && cs.display !== "none") out.push(`${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 2).join(".")}`); } return out; });
async function stableCount(p: Page) { let last = ""; await expect.poll(async () => { const v = JSON.stringify(await count(p)); const s = v === last; last = v; return s; }, { intervals: [400], timeout: 20000 }).toBe(true); return JSON.parse(last) as string[]; }
for (const [w, h, coarse] of [[1280, 800, false], [390, 844, true]] as const) for (const theme of ["light", "dark"] as const)
  test(`k4 ${w}x${h} ${theme}`, async ({ browser }, info) => {
    const line: string[] = [];
    for (const [name, base] of Object.entries(ARMS)) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse, colorScheme: theme });
      const p = await ctx.newPage();
      await p.goto(base + "/?size=3&difficulty=EASY");
      await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
      await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
      await expect.poll(() => p.locator("svg.hand-drawn-grid g.boil-frame-layer.baked-hidden").count(), { timeout: 30000 }).toBe(0).catch(() => {});
      const shut = await stableCount(p);
      const trig = p.locator(coarse ? ".mobile-attribution .attribution-trigger" : ".corner-left .attribution-trigger");
      if (coarse) await trig.tap(); else await trig.hover();
      await p.waitForTimeout(400);
      const card = await stableCount(p);
      let lobby: string[] | null = null;
      const mk = p.locator("[data-player-mark]:visible");
      if (await mk.count()) { if (coarse) { await trig.tap(); await mk.tap(); } else { await p.mouse.move(700, 700); await mk.click(); } await p.waitForTimeout(400); lobby = await stableCount(p); }
      line.push(`${name} ${shut.length}/${card.length}/${lobby ? lobby.length : "-"}`);
      if (name === "mine" && theme === "dark") console.log(`K4-DETAIL ${info.project.name} ${w}x${h} ${JSON.stringify(shut)}`);
      await ctx.close();
    }
    console.log(`K4 ${info.project.name} ${w}x${h} ${theme} shut/card/lobby :: ${line.join(" | ")}`);
  });
