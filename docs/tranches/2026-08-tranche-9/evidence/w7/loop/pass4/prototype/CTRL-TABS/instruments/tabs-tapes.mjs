// CTRL-TABS pass 4 — the four tags in the fallback (row 1): each tab raised in turn, the face-up
// tray's tag read for presence, position, legibility and §2.5 (a tape never covers an
// interactive element — rect ∩ over every button/input/[role=tab]/[tabindex] in the card).
import { chromium, webkit } from "@playwright/test";
const PORT = process.argv[2] ?? "4232";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const read = () => {
  const tray = [...document.querySelectorAll(".tray")].find((t) => !t.hasAttribute("inert"));
  const tag = tray?.querySelector(".washi-tag");
  if (!tag) return { tray: tray?.id, tag: null };
  const b = tag.getBoundingClientRect();
  const hits = [...document.querySelectorAll(".controls-card button, .controls-card input, .controls-card [tabindex]")].filter((e) => {
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return false;
    return Math.min(b.right, r.right) - Math.max(b.left, r.left) > 0.5 && Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top) > 0.5;
  }).map((e) => e.getAttribute("aria-label") || e.textContent.trim().slice(0, 16));
  const cs = getComputedStyle(tag);
  return { tag: tag.textContent.trim(), pos: cs.position, vis: cs.visibility, h: +b.height.toFixed(2), y: +b.y.toFixed(2), covers: hits, trayLabel: tray.getAttribute("aria-labelledby") };
};
for (const [n, e] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await e.launch();
  for (const [w, h, coarse] of [[390, 844, true], [1280, 800, false]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: coarse, isMobile: coarse && n === "chromium" })).newPage();
    await p.goto(`http://127.0.0.1:${PORT}/?board=${BOARD}`);
    await p.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 45000 });
    await p.waitForTimeout(1000);
    if (coarse) { await p.locator(".drawer-tab").first().tap(); await p.waitForTimeout(900); }
    const rows = [];
    for (const word of ["new game", "pencils", "checking", "players"]) {
      await p.locator(".tab", { hasText: word }).first().click();
      await p.waitForTimeout(250);
      rows.push(await p.evaluate(read));
    }
    const cardH = await p.evaluate(() => { const c = document.querySelector(".controls-card"); return `${c.scrollHeight}/${c.clientHeight}`; });
    console.log(`${n} ${w}x${h} ${coarse ? "coarse(hasTouch)" : "fine"} card ${cardH} ${JSON.stringify(rows)}`);
  }
  await b.close();
}
