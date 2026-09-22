// CTRL-TABS critic: does the desk tab strip (the card's navigation) stay reachable when the card scrolls?
import { chromium, webkit } from "@playwright/test";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
for (const [n, e] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await e.launch();
  for (const [w, h] of [[1024, 768], [1280, 800], [1440, 900]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(`http://127.0.0.1:4235/?board=${BOARD}`);
    await p.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 45000 });
    await p.waitForTimeout(1000);
    const r = await p.evaluate(async () => {
      const card = document.querySelector(".controls-card"); const max = card.scrollHeight - card.clientHeight;
      const read = () => { const cb = card.getBoundingClientRect(); return [...document.querySelectorAll(".tab")].map((t) => { const b = t.getBoundingClientRect(); const cx = b.left + b.width / 2, cy = b.top + b.height / 2; const hit = document.elementFromPoint(cx, cy); return { w: t.textContent.trim().slice(0, 9), raised: t.classList.contains("is-raised") || t.getAttribute("aria-selected") === "true", yRel: +(b.top - cb.top).toFixed(1), hittable: !!(hit && t.contains(hit)) }; }); };
      const at0 = read(); card.scrollTop = max; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const atMax = read();
      return { isDesk: card.classList.contains("desk-control-panel"), sh: card.scrollHeight, ch: card.clientHeight, max, hittable0: at0.filter((t) => t.hittable).length + "/" + at0.length, hittableMax: atMax.filter((t) => t.hittable).length + "/" + atMax.length, raisedMax: atMax.find((t) => t.raised), lost: atMax.filter((t) => !t.hittable).map((t) => t.w) };
    });
    console.log(n, `${w}x${h}`, JSON.stringify(r));
  }
  await b.close();
}
