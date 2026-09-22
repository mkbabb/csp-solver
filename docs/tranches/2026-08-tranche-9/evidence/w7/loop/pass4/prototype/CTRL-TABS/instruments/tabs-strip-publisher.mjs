// CTRL-TABS pass 4 — the --strip-len publisher's born-RED (row 13). Desk cells, both engines.
// GATE: the desk berth equals the strip's own height + the 6px seam, and no tab box intersects
// the face-up tray. Arm A = the publisher as shipped (must be GREEN); arm B = the publisher
// DELETED (its write outranked by `--strip-len: initial !important`, so the registered
// initial takes over; must be RED). Exit 0 only when A is GREEN and B is RED in the same run, on every cell and engine.
import { chromium, webkit } from "@playwright/test";
const PORT = process.argv[2] ?? "4232";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const gate = () => {
  const d = document.querySelector(".desk-control-panel"), strip = document.querySelector(".tab-strip");
  const tray = [...document.querySelectorAll(".tray")].find((t) => !t.hasAttribute("inert"));
  const pad = parseFloat(getComputedStyle(d).paddingTop), sh = strip.scrollHeight;
  const tr = tray.getBoundingClientRect();
  const hit = [...strip.querySelectorAll(".tab")].filter((t) => { const b = t.getBoundingClientRect(); return b.bottom > tr.top + 0.5 && b.top < tr.bottom; }).length;
  const ok = Math.abs(pad - (Math.ceil(sh) + 6)) <= 0.5 && hit === 0;
  return { pad, stripH: sh, tabsOverTray: hit, ok };
};
let bites = true;
for (const [n, e] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await e.launch();
  for (const [w, h] of [[1280, 800], [1440, 900]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(`http://127.0.0.1:${PORT}/?board=${BOARD}`);
    await p.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 45000 });
    await p.waitForTimeout(1000);
    const A = await p.evaluate(gate);
    // The publisher re-runs on every resize (a ResizeObserver), so removing its write is undone
    // by the resize the removal causes. Deletion is modelled as the write never landing: an
    // !important author rule outranks the inline style, and `initial` IS the registered value.
    await p.addStyleTag({ content: ".controls-card { --strip-len: initial !important; }" });
    await p.waitForTimeout(150);
    const B = await p.evaluate(gate);
    console.log(`${n} ${w}x${h} A(publisher) ${A.ok ? "GREEN" : "RED"} ${JSON.stringify(A)} · B(deleted) ${B.ok ? "GREEN" : "RED"} ${JSON.stringify(B)}`);
    if (!A.ok || B.ok) bites = false;
  }
  await b.close();
}
console.log(bites ? "GATE BITES: control GREEN, ablation RED on every cell" : "GATE FAILED ITS OWN CONTROL");
process.exit(bites ? 0 : 1);
