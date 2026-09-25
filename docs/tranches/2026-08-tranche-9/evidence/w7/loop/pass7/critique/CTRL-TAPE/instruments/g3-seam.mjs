// CTRL-TAPE pass-7 critic: does keys-crib G3 (post-paint) see a revert of the pass-7 seam itself (the flex column)? merged tree :4243, 1280x800 fine.
import { ENGINES } from "./p6-lib.mjs";
const BASE = "http://127.0.0.1:4243";
const ARMS = [["clean", ""], ["F1 .drawer-case{display:block}", ".drawer-case{display:block !important}"], ["F2 .controls-card{flex-shrink:0}", ".controls-card{flex-shrink:0 !important}"], ["lane plant .drawer-case{max-height:none}", ".drawer-case{max-height:none !important}"]];
const sample = (page, ms) => page.evaluate((ms) => {
  const bar = [...document.querySelectorAll(".action-bar")].find((b) => b.getClientRects().length);
  const verbs = [...bar.querySelectorAll(".action-verbs button, .info-btn")].filter((e) => e.getClientRects().length);
  const at0 = verbs.map((e) => e.getBoundingClientRect());
  const off = () => verbs.reduce((m, e, k) => { const b = e.getBoundingClientRect(); return Math.max(m, Math.abs(b.top - at0[k].top), Math.abs(b.left - at0[k].left)); }, 0);
  return new Promise((res) => { let d = 0; const t0 = performance.now(); const tick = () => { const last = performance.now() - t0 >= ms; const ch = new MessageChannel(); ch.port1.onmessage = () => { d = Math.max(d, off()); if (last) res({ drift: +d.toFixed(2), vb: +Math.max(...verbs.map((e) => e.getBoundingClientRect().bottom)).toFixed(2), vh: innerHeight }); }; ch.port2.postMessage(0); if (!last) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
}, ms);
const press = async (page) => { const b = await page.evaluate(() => { const r = document.querySelector(".drawer-case .action-bar .info-btn").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, vis: r.bottom <= innerHeight }; }); await page.mouse.click(b.x, Math.min(b.y, 799)); await page.mouse.move(2, 2); return b; };
for (const [en, eng] of ENGINES) {
  const br = await eng.launch();
  for (const [name, css] of ARMS) {
    const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage();
    await page.goto(BASE + "/?size=3&difficulty=EASY"); await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" + css }); await page.waitForTimeout(900);
    const s = sample(page, 700); const b = await press(page); const r = await s;
    console.log(`${en.padEnd(8)} ${name.padEnd(42)} info-btn in view ${b.vis} (y ${b.y.toFixed(1)}) | G3 post-paint drift ${r.drift} | verbs bottom ${r.vb} vs vh ${r.vh}`);
    await ctx.close();
  }
  await br.close();
}
