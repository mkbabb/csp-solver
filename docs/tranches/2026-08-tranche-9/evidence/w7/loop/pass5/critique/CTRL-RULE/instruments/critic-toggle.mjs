// T9-W7 pass 5 · CRITIC · CTRL-RULE — W2 §2.4 BEYOND ITS ONE CELL. The gate (viewport-law:287) and the
// lane's zone-grammar:731 read 1024×768 only; the cure is a runtime publisher (`publishHeadClear`, card
// top vs the derived `--toggle-foot`). This probe hovers the toggle (the 1.08 bound) and reads the
// toggle's box ∩ every interactive in the case (clipped to the card's scrollport) at other desk cells,
// AND after a live resize (1440×900 → cell) so a stale publisher would show. Both arms, one payload.
// node critic-toggle.mjs <chromium|webkit> <LANE> <CTRL>
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
const [ENGINE, LANE, CTRL] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const CELLS = [[1024, 768], [1024, 640], [1024, 600], [1100, 700], [1280, 720], [1366, 768], [1024, 1366]];
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const READ = () => {
  const t = document.querySelector("button.sun-moon-toggle").getBoundingClientRect();
  const card = document.querySelector(".controls-card"), cb = card.getBoundingClientRect();
  const clipT = cb.top + card.clientTop, clipB = clipT + card.clientHeight;
  let worst = 0, who = "";
  for (const c of document.querySelectorAll('.drawer-case button, .drawer-case [role="button"], .drawer-case input, .drawer-case a[href]')) {
    if (c.closest("[inert]") || getComputedStyle(c).visibility === "hidden") continue;
    const r = c.getBoundingClientRect(); if (!r.width || !r.height) continue;
    let tp = r.top, bt = r.bottom; if (card.contains(c)) { tp = Math.max(tp, clipT); bt = Math.min(bt, clipB); }
    const ix = Math.max(0, Math.min(t.right, r.right) - Math.max(t.left, r.left)), iy = Math.max(0, Math.min(t.bottom, bt) - Math.max(t.top, tp));
    if (ix * iy > worst) { worst = ix * iy; who = c.getAttribute("aria-label") || c.textContent.trim().slice(0, 16); }
  }
  const wrap = document.querySelector(".control-panel-wrap");
  return { overlapPx2: +worst.toFixed(1), who, toggleBottom: +t.bottom.toFixed(2), headClear: wrap ? getComputedStyle(wrap).paddingTop : null, docScroll: document.documentElement.scrollHeight - innerHeight };
};
async function probe(base, w, h, viaResize) {
  const ctx = await browser.newContext({ viewport: viaResize ? { width: 1440, height: 900 } : { width: w, height: h }, deviceScaleFactor: 1, colorScheme: "light" });
  await ctx.addInitScript(() => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", "light"); } catch {} });
  const p = await ctx.newPage();
  await p.goto(`${base}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(1800);
  if (viaResize) { await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(1200); }
  const tb = await p.locator("button.sun-moon-toggle").boundingBox();
  await p.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2);
  await p.waitForTimeout(700);
  const r = await p.evaluate(READ);
  await ctx.close();
  return r;
}
const rows = [];
for (const [w, h] of CELLS) for (const via of [false, true]) {
  const a = await probe(LANE, w, h, via), b = await probe(CTRL, w, h, via);
  rows.push({ cell: `${w}x${h}${via ? " via resize" : ""}`, lane: a, control: b });
  console.log(ENGINE, `${w}x${h}${via ? "R" : ""}`, "lane", JSON.stringify(a), "ctrl", JSON.stringify(b));
}
writeFileSync(join(OUT, `critic-toggle-${ENGINE}.json`), JSON.stringify({ engine: ENGINE, board: BOARD, control: "74a2b5d9", rows }, null, 1));
await browser.close();
console.log("EXIT OK");
