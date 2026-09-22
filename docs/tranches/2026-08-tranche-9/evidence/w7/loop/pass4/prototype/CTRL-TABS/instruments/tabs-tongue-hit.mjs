// CTRL-TABS pass 4 — is the cued entry (the `controls` tongue) hittable where it paints? A 7×9
// grid of points over the tongue's box; each is hit-tested and counted as the tongue's only if
// elementFromPoint lands inside `.drawer-tab`. Landscape coarse cells, both engines, both arms.
import { chromium, webkit } from "@playwright/test";
const ARMS = process.argv[2].split(",").map((a) => a.split("="));
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const probe = () => {
  const t = document.querySelector(".drawer-tab"); const b = t.getBoundingClientRect();
  let own = 0, n = 0; const thieves = {};
  for (let i = 1; i <= 7; i++) for (let j = 1; j <= 9; j++) {
    const x = b.left + (b.width * i) / 8, y = b.top + (b.height * j) / 10; n++;
    const e = document.elementFromPoint(x, y);
    if (e && t.contains(e)) own++; else { const k = e ? (e.closest("button")?.getAttribute("aria-label") || e.closest("[class]")?.className?.toString().slice(0, 30) || e.tagName) : "null"; thieves[k] = (thieves[k] || 0) + 1; }
  }
  const tools = [...document.querySelectorAll(".play-controls button")].map((x) => x.getBoundingClientRect());
  const tb = tools.length ? { top: Math.min(...tools.map((r) => r.top)), bottom: Math.max(...tools.map((r) => r.bottom)), left: Math.min(...tools.map((r) => r.left)), right: Math.max(...tools.map((r) => r.right)) } : null;
  const ov = tb ? Math.max(0, Math.min(b.bottom, tb.bottom) - Math.max(b.top, tb.top)) * Math.max(0, Math.min(b.right, tb.right) - Math.max(b.left, tb.left)) / (b.width * b.height) : 0;
  return { tongue: [+b.x.toFixed(1), +b.y.toFixed(1), b.width, b.height], hitOwn: `${own}/${n}`, thieves, toolsRectOverlap: +ov.toFixed(3) };
};
for (const [n, e] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await e.launch();
  for (const [w, h] of [[844, 390], [812, 375], [900, 500]]) {
    const p = await (await br.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: n === "chromium" })).newPage();
    for (const [tag, port] of ARMS) {
      await p.goto(`http://127.0.0.1:${port}/?board=${BOARD}`);
      await p.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 45000 });
      await p.waitForTimeout(1000);
      console.log(n, `${w}x${h}`, tag, JSON.stringify(await p.evaluate(probe)));
    }
  }
  await br.close();
}
