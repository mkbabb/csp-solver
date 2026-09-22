// CTRL-TABS critic: the floor's acts vs the card's bottom edge at scrollTop 0 (desk, fine), both engines, tree.
import { chromium, webkit } from "@playwright/test";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
for (const [n, e] of [["chromium", chromium], ["webkit", webkit]]) { const b = await e.launch();
for (const [w, h] of [[1024, 768], [1280, 800], [1440, 900], [1600, 900]]) {
const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
await p.goto(`http://127.0.0.1:4235/?board=${BOARD}`); await p.waitForSelector('[role="grid"] [role="gridcell"]'); await p.waitForTimeout(1000);
const r = await p.evaluate(() => { const card = document.querySelector(".controls-card"); const cb = card.getBoundingClientRect(); const bar = card.querySelector(".action-bar"); const bs = [...bar.querySelectorAll("button")]; const rows = new Set(bs.map((x) => Math.round(x.getBoundingClientRect().top))); const worst = Math.max(...bs.map((x) => x.getBoundingClientRect().bottom - cb.bottom)); const hitSelf = bs.filter((x) => { const r = x.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return hit && x.contains(hit); }).length; return { floorRows: rows.size, clippedPx: +worst.toFixed(2), centresHittable: `${hitSelf}/${bs.length}` }; });
console.log(n, `${w}x${h}`, JSON.stringify(r)); }
await b.close(); }
