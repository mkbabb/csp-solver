// critic: the ring on "Clear the board" at coarse 1280x800, both themes, proto vs control (the same verb, the ground it abuts on each tree).
import { ENGINES, CELLS, open, differential, coreContrast, givens } from "./p6-lib.mjs";
const BASE = process.argv[2];
for (const [en, eng] of ENGINES) {
  const b = await eng.launch();
  for (const theme of ["dark", "light"]) for (const shotN of [1, 2]) {
    const { ctx, page } = await open(b, BASE, CELLS.coarse1280, { theme, dpr: 2, prm: "reduce" });
    const g = await givens(page);
    const sel = '[aria-label="Clear the board"]';
    const box = await page.evaluate((sel) => { const e = [...document.querySelectorAll(sel)].find((x) => x.getBoundingClientRect().width > 0); e.scrollIntoView({ block: "center" }); const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, inFoot: !!e.closest("#card-foot"), inWell: !!e.closest(".tray-well") }; }, sel);
    await page.keyboard.press(en === "webkit" ? "Alt+Tab" : "Tab");
    await page.evaluate((sel) => [...document.querySelectorAll(sel)].find((x) => x.getBoundingClientRect().width > 0).focus(), sel);
    await page.waitForTimeout(400);
    const fv = await page.evaluate(() => document.activeElement?.matches(":focus-visible"));
    const clip = { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: box.w + 16, height: box.h + 16 };
    const d = await differential(page, clip, "*:focus, *:focus-visible { outline: none !important; box-shadow: none !important }");
    const c = coreContrast(d, 3.0);
    console.log(JSON.stringify({ en, theme, shot: shotN, base: BASE, givens: g, fv, where: box.inFoot ? "foot" : box.inWell ? "well" : "card", median: c?.median, fracUnder3: c?.fracUnder, coreN: c?.coreN, s90: c?.sens?.["90%"] }));
    await ctx.close();
  }
  await b.close();
}
