// scratch probe: the seam (case top vs wordmark ink) as a RECT and on PAINT (post-paint photographs), fine cells.
import { playwright, load } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/e2e/lib/paint-lib.mjs";
const arms = { tree: "http://127.0.0.1:4231/", control: "http://127.0.0.1:4252/" };
for (const engine of ["chromium", "webkit"]) {
  const browser = await playwright()[engine].launch();
  for (const vp of [{ width: 360, height: 800 }, { width: 390, height: 844 }]) for (const dpr of [1, 2]) for (const [arm, url] of Object.entries(arms)) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dpr, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(url + "?size=3&difficulty=EASY");
    await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
    await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
    if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await page.locator(".drawer-tab").click();
    let last = NaN; for (let i = 0; i < 60; i++) { const t = await page.evaluate(() => document.querySelector(".drawer-case").getBoundingClientRect().top); if (Math.abs(t - last) < 0.01) break; last = t; await page.waitForTimeout(100); }
    const g = await page.evaluate(() => { const ink = document.querySelector("svg.handwritten-logo").getBoundingClientRect(); const c = document.querySelector(".drawer-case").getBoundingClientRect(); return { inkB: ink.bottom, caseT: c.top, x0: Math.max(0, Math.floor(Math.min(ink.left, c.left))), x1: Math.ceil(Math.min(innerWidth, Math.max(ink.right, c.right))) }; });
    const y0 = Math.max(0, Math.floor(g.inkB - 40)), y1 = Math.ceil(g.caseT + 30);
    const clip = { x: g.x0, y: y0, width: g.x1 - g.x0, height: y1 - y0 };
    const shot = async (css) => { const t = css ? await page.addStyleTag({ content: css }) : null; await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); const b = (await page.screenshot({ clip })).toString("base64"); if (t) await t.evaluate((n) => n.remove()); return b; };
    const on = await shot(null), on2 = await shot(null), noLogo = await shot("svg.handwritten-logo { visibility: hidden !important; }"), noCase = await shot(".drawer-case { visibility: hidden !important; }");
    const r = await page.evaluate(async ({ on, on2, noLogo, noCase, h }) => {
      const px = async (b64) => { const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + b64)).blob()); const c = new OffscreenCanvas(bmp.width, bmp.height); const q = c.getContext("2d"); q.drawImage(bmp, 0, 0); return q.getImageData(0, 0, bmp.width, bmp.height); };
      const [a, a2, l, c] = [await px(on), await px(on2), await px(noLogo), await px(noCase)];
      const d = (p, q, o) => Math.max(Math.abs(p.data[o] - q.data[o]), Math.abs(p.data[o + 1] - q.data[o + 1]), Math.abs(p.data[o + 2] - q.data[o + 2]));
      let logoLow = -1, caseTop = -1;
      for (let y = 0; y < a.height; y++) for (let x = 0; x < a.width; x++) { const o = (y * a.width + x) * 4; if (d(a, a2, o) > 8) continue; if (d(a, l, o) > 24) logoLow = Math.max(logoLow, y); if (caseTop < 0 && d(a, c, o) > 24) caseTop = y; }
      return { logoLow, caseTop, dpr: a.height / h };
    }, { on, on2, noLogo, noCase, h: clip.height });
    const paintAir = r.logoLow < 0 || r.caseTop < 0 ? null : +((r.caseTop - (r.logoLow + 1)) / r.dpr).toFixed(2);
    console.log(`${engine} ${vp.width}x${vp.height} dpr${dpr} ${arm}: rect air ${(g.caseT - g.inkB).toFixed(2)} · painted air ${paintAir} (logo ink low ${(y0 + (r.logoLow + 1) / r.dpr).toFixed(2)}, case paint top ${(y0 + r.caseTop / r.dpr).toFixed(2)}, case rect top ${g.caseT.toFixed(2)})`);
    await ctx.close();
  }
  await browser.close();
}
console.log("LOAD " + load());
