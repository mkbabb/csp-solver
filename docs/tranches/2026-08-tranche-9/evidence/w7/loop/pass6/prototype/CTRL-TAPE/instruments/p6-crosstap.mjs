// T9-W7 pass 6 · CTRL-TAPE — THE CROSS TAP (registry-v5 §2.2): one question standing, tap the OTHER
// guarded verb. Reads the ribbons standing (their aria-label = the ask) after each tap, both
// directions, both engines, 390×844 hasTouch dock, dirty board.  node crosstap.mjs <base>
import { ENGINES, CELLS, open, givens } from "./p6-lib.mjs";
const BASE = process.argv[2];
const CLEAR = '#card-foot .action-bar button[aria-label="Clear the board"], .action-bar button[aria-label="Clear the board"]';
const DEAL = 'button[aria-label="Deal a new board"]';
let exit = 0;
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const [first, second] of [[CLEAR, DEAL], [DEAL, CLEAR]]) {
    const { ctx, page } = await open(br, BASE, CELLS.dock390, { dpr: 1 });
    const g = await givens(page);
    const blank = await page.evaluate(() => {
      const cells = document.querySelectorAll(".sudoku-cell");
      for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector(".glyph-svg")) return i;
      return -1;
    });
    await page.evaluate((idx) => {
      const input = document.querySelectorAll(".sudoku-cell input")[idx];
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "1");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, blank);
    await page.waitForTimeout(500);
    const asks = () => page.evaluate(() => [...document.querySelectorAll(".confirm-ribbon")].map((r) => r.getAttribute("aria-label")));
    const subs = () => page.evaluate(() => [...document.querySelectorAll(".icon-sublabel")].map((s) => s.textContent.trim()).join("|"));
    await page.locator(first).first().tap();
    await page.waitForTimeout(300);
    const a1 = await asks();
    const el = page.locator(second).first();
    const vis = await el.isVisible().catch(() => false);
    let hit = null;
    if (vis) {
      await el.scrollIntoViewIfNeeded();
      hit = await el.evaluate((b) => { const r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return !!e && (e === b || b.contains(e)); });
      await el.tap();
    }
    await page.waitForTimeout(300);
    const a2 = await asks();
    const s2 = await subs();
    const firstName = first === CLEAR ? "clear" : "deal";
    const secondAsk = first === CLEAR ? "start a new board?" : "clear the board?";
    const ok = a2.length === 1 && a2[0] === secondAsk; const armsBoth = (s2.match(/sure\?/g) || []).length;
    if (!ok) exit = 1;
    console.log(`${eng} ${firstName}→${firstName === "clear" ? "deal" : "clear"} givens=${g} after1=${JSON.stringify(a1)} secondVisible=${vis} hitIsTarget=${hit} after2=${JSON.stringify(a2)} ${ok ? "RETARGETED" : armsBoth ? `ARMS-${armsBoth}-VERBS(sure?)` : "DEAD"} subs=${s2}`);
    await ctx.close();
  }
  await br.close();
}
process.exit(exit);
