// CTRL-TABS pass 4 — row 6: no live `url(#…)` filter inside a shut tray. Built dist, both engines,
// desk fine + phone coarse (sheet open). Counts elements under `.tray[inert]` whose computed
// `filter` or `filter` attribute names a url(#…); control: the same count over the whole card.
import { chromium, webkit } from "@playwright/test";
const PORT = process.argv[2];
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const count = (sel) => [...document.querySelectorAll(sel)].filter((e) => /url\(/.test(getComputedStyle(e).filter) || /url\(#/.test(e.getAttribute("filter") || "")).length;
for (const [n, e] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await e.launch();
  for (const [w, h, coarse] of [[1280, 800, false], [390, 844, true]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: coarse, isMobile: coarse && n === "chromium" })).newPage();
    await p.goto(`http://127.0.0.1:${PORT}/?board=${BOARD}`);
    await p.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 45000 });
    await p.waitForTimeout(1000);
    if (coarse) { await p.locator(".drawer-tab").first().tap(); await p.waitForTimeout(900); }
    const r = await p.evaluate((c) => ({ inertTrays: document.querySelectorAll(".tray[inert]").length, inShut: eval(`(${c})`)(".tray[inert] *"), inCard: eval(`(${c})`)(".controls-card *"), inDoc: eval(`(${c})`)("*") }), count.toString());
    console.log(n, `${w}x${h}`, coarse ? "coarse(hasTouch)" : "fine", JSON.stringify(r));
  }
  await b.close();
}
