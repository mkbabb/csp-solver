/**
 * PLR-PLACE pass-1 CRITIQUE probe 3 — WHY THE RING NEVER PAINTS, and what opening the sheet
 * tells the room.
 *
 * The chain under test: `GameBoard.onGridFocusout` calls `noteFocus(null)` whenever focus
 * leaves the grid, and `noteFocus(null)` nulls `selfCursor` AND sends `cur {p:null}` on the
 * wire. Pressing the head's sign is exactly such a departure. So:
 *   A · after you focus a cell, is `.chart-self` ever in the DOM when the sheet is open?
 *   B · does the room lose your ghost the moment you open your own seating chart?
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const OUT = join(__dirname, "..", "logs");
const MARK = "[data-player-mark]";
const bank: Record<string, unknown> = {};
const rec = (k: string, v: unknown) => {
  bank[k] = v;
  console.log(`CRIT3|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);
};
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function visibleMark(page: Page) {
  const marks = page.locator(MARK);
  const n = await marks.count();
  for (let i = 0; i < n; i++) if (await marks.nth(i).isVisible()) return marks.nth(i);
  throw new Error("no visible mark");
}
const active = (p: Page) =>
  p.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return "none";
    return `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`;
  });
const ghosts = (p: Page) => p.locator(".game-cell.is-peer-cursor").count();

test("CRITIC 3 — the ring's mechanism, and the wire's word on opening", async ({
  browser,
}, info) => {
  const eng = info.project.name;
  mkdirSync(OUT, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await verb.first().click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await ctx.newPage();
  await b.goto(a.url());
  await settled(b);
  await a.bringToFront();

  // A · you focus a cell — the room should see your ghost
  await a.locator(".sudoku-cell").nth(60).click();
  await a.waitForTimeout(900);
  rec("a1.activeAfterCellClick", await active(a));
  rec("a2.peerSeesYourGhost", await ghosts(b));

  // now open the chart — with the MOUSE (the prototype's own press)
  await (await visibleMark(a)).click();
  await a.waitForTimeout(1200);
  rec("a3.activeAfterMarkClick", await active(a));
  rec("a4.ringWhileOpen", await a.locator("[data-lobby] .chart-self").count());
  rec("a5.dotsWhileOpen", await a.locator("[data-lobby] .chart-dot").count());
  rec("a6.peerStillSeesYourGhost", await ghosts(b));

  // and with the KEYBOARD (Space, the only activation that works — see probe 1)
  await a.mouse.click(640, 700); // shut it
  await a.waitForTimeout(400);
  await a.locator(".sudoku-cell").nth(62).click();
  await a.waitForTimeout(900);
  rec("b1.peerSeesGhostAgain", await ghosts(b));
  await (await visibleMark(a)).focus();
  await a.waitForTimeout(300);
  rec("b2.activeAfterMarkFocus", await active(a));
  rec("b3.peerGhostAfterFocusMove", await ghosts(b));
  await a.keyboard.press("Space");
  await a.waitForTimeout(1000);
  rec("b4.ringWhileOpenKeyboard", await a.locator("[data-lobby] .chart-self").count());
  rec("b5.peerGhostWhileOpen", await ghosts(b));

  writeFileSync(join(OUT, `critic3-${eng}.json`), JSON.stringify(bank, null, 2));
});
