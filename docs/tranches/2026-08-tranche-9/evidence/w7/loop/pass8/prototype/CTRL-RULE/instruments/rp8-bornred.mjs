// scratch born-RED transcript: the pass-7 readers against the pass-8 plants, beside the pass-8 readers.
import { readFileSync } from "node:fs";
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/e2e/lib/paint-lib.mjs";
import { INK_PLANTS } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/e2e/lib/edge-bands.mjs";
// (a) row 28: pass 7's source regex, verbatim, on planted copies of scene.css
const css0 = readFileSync("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/src/games/shared/scene.css", "utf8");
const p7 = (css) => { const c = css.replace(/\/\*[\s\S]*?\*\//g, ""); const foot = c.match(/\.card-foot\s*\{[^}]*\}/g) ?? []; return foot.some((b) => /padding-bottom:\s*calc\([^;]*\+\s*env\(safe-area-inset-bottom\)\s*\)/.test(b)); };
const plants = {
  shipped: css0,
  "E4 !important max() coarse": css0 + "\n@media (pointer: coarse) { .card-foot { padding-bottom: max(0.15rem, env(safe-area-inset-bottom)) !important; } }",
  "E3 #card-foot.card-foot": css0 + "\n#card-foot.card-foot { padding-bottom: 0.15rem; }",
  "shadow in the same block": css0.replace(/(\.card-foot\s*\{[^}]*padding-bottom:\s*calc\([^;]*\);)/, "$1\n  padding-bottom: 0.15rem;"),
};
for (const [k, c] of Object.entries(plants)) console.log(`ROW28 pass-7 regex ${k}: ${p7(c) ? "GREEN" : "RED"}`);
// (b) M18: the pass-7 reference (re-stroke only) vs the pass-8 reference (neutral longhands forced) under each ink plant
const G = "var(--color-pencil-graphite, var(--grid-line-color))";
const SVG = "#card-foot svg.ruled-line";
const inkPlants = { none: null, ...INK_PLANTS(SVG, 0.81) };
for (const engine of ["chromium", "webkit"]) {
  const browser = await playwright()[engine].launch();
  for (const vp of [{ width: 1280, height: 800, touch: false }, { width: 390, height: 844, touch: true }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.touch && engine === "chromium", hasTouch: vp.touch });
    const page = await ctx.newPage();
    await page.goto("http://127.0.0.1:4231/?size=3&difficulty=EASY");
    await page.waitForSelector(".sudoku-cell .glyph-svg");
    await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
    if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) { if (vp.touch) await page.locator(".drawer-tab").tap(); else await page.locator(".drawer-tab").click(); }
    await page.waitForTimeout(2500);
    const box = await page.locator(SVG).boundingBox();
    const clip = { x: box.x, y: box.y - 3, width: box.width, height: box.height + 6 };
    const shot = async (css) => { const t = css ? await page.addStyleTag({ content: css }) : null; const b = (await page.screenshot({ clip })).toString("base64"); if (t) await t.evaluate((n) => n.remove()); return b; };
    for (const [pk, pcss] of Object.entries(inkPlants)) {
      const tag = pcss ? await page.addStyleTag({ content: pcss }) : null;
      const n = await page.evaluate((sel) => { const s = document.querySelector(sel), p = s.querySelector("path"); const [a, b] = [getComputedStyle(s), getComputedStyle(p)]; return [a.opacity === "1", a.filter === "none", b.opacity === "1", b.filter === "none", b.strokeOpacity === "1"]; }, SVG);
      const S2 = "#card-foot#card-foot svg.ruled-line";
      const ref8 = [n[0] ? "" : S2 + "{opacity:1!important}", n[1] ? "" : S2 + "{filter:none!important}", n[2] ? "" : S2 + " path{opacity:1!important}", n[3] ? "" : S2 + " path{filter:none!important}", n[4] ? "" : S2 + " path{stroke-opacity:1!important}", S2 + " path{stroke:" + G + "!important}"].join(" ");
      const ref7 = SVG + " path { stroke: " + G + " !important; }";
      const on = await shot(null), off = await shot(SVG + " { visibility: hidden !important; }");
      const out = {};
      for (const [rk, ref] of [["p7", ref7], ["p8", ref8]]) {
        const full = await shot(ref);
        out[rk] = await page.evaluate(async ({ on, off, full }) => {
          const px = async (b64) => { const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + b64)).blob()); const c = new OffscreenCanvas(bmp.width, bmp.height); const g = c.getContext("2d"); g.drawImage(bmp, 0, 0); return g.getImageData(0, 0, bmp.width, bmp.height); };
          const [a, b, f] = [await px(on), await px(off), await px(full)];
          const mv = [];
          for (let o = 0; o < a.data.length; o += 4) { let k = 0; for (let c = 1; c < 3; c++) if (Math.abs(f.data[o + c] - b.data[o + c]) > Math.abs(f.data[o + k] - b.data[o + k])) k = c; const d = Math.abs(f.data[o + k] - b.data[o + k]); if (d > 24) mv.push({ d, o, k }); }
          const ds = mv.map((m) => m.d).sort((x, y) => x - y); const ref = ds[Math.floor(0.98 * (ds.length - 1))];
          const al = mv.filter((m) => m.d >= 0.5 * ref).map((m) => (a.data[m.o + m.k] - b.data[m.o + m.k]) / (f.data[m.o + m.k] - b.data[m.o + m.k])).sort((x, y) => x - y);
          return +al[al.length >> 1].toFixed(3);
        }, { on, off, full });
      }
      if (tag) await tag.evaluate((x) => x.remove());
      console.log(`M18 ${engine} ${vp.width}x${vp.height} light plant ${pk}: alpha pass-7 ref ${out.p7} (${out.p7 >= 0.62 ? "GREEN" : "RED"}) · pass-8 ref ${out.p8} (${out.p8 >= 0.62 ? "GREEN" : "RED"})`);
    }
    await ctx.close();
  }
  await browser.close();
}
