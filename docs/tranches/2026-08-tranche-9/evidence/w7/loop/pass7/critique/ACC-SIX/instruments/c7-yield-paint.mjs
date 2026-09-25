// ACC-SIX pass-7 CRITIC (non-author). Three rows the landed yield row (e2e/count-yield.spec.ts) does not hold.
//   MODE=paint  POST-PAINT frames across the yielding press: P16 at 393x699 coarse (hasTouch, DPR 2, PRM), the product's
//               hint pressed twice (the count lays down), a sampler installed (rAF -> MessageChannel task = a post-paint
//               read, LAWS P6 §D), the third press (a real hidden-single line, the yield), 1200 ms sampled. Counts the
//               frames on which the count is PRESENT and on ROW TWO (below the voice's mid-line; unclipped since pass 7).
//               The claim under test: "the owner takes the meta down in the same frame, before paint" (MarginNote.vue).
//   MODE=fit    THE FIT ARM: where the pair FITS, a long hint must NOT end the lesson. P16, hint-first, 4 presses,
//               1280x800 fine and 844x390 coarse; per press: written, voice, meta.
//   MODE=strip  the note's own wrap on a real hint (the spec's differential premise), per arm: strip + tab at rest and
//               after each of 4 presses, 393x699 and 812x375 coarse.
// usage: MODE=paint ARMS='tree=http://127.0.0.1:4232,late150=http://127.0.0.1:4235' node c7-yield-paint.mjs
import { chromium, webkit, BOARD16 } from "./p7-common.mjs";
import { execSync } from "node:child_process";
const ARMS = Object.fromEntries(process.env.ARMS.split(",").map((a) => a.split("=")));
const MODE = process.env.MODE;
const ENG = { chromium, webkit };
const load = () => execSync("uptime").toString().split("averages:")[1].trim().split(" ")[0];
const hint = (page) => page.evaluate(() => { const b = document.querySelector('[aria-label*="Hint" i]:not([disabled])'); b?.click(); return !!b; });
const read = (page) => page.evaluate(() => {
  const m = document.querySelector(".margin-note-meta"), v = document.querySelector(".margin-note");
  let row2 = false;
  if (m && v) { const r = document.createRange(); r.selectNodeContents(m); const t = r.getBoundingClientRect(), b = v.getBoundingClientRect(); row2 = t.top > b.top + b.height / 2; }
  const tab = document.querySelector(".drawer-tab");
  return { w: Number(document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuetext")?.split(" ")[0] ?? -1), voice: v?.textContent?.trim() ?? "", meta: m?.textContent?.trim() ?? null, row2,
    strip: Math.round((document.querySelector(".board-margin")?.getBoundingClientRect().height ?? -1) * 100) / 100,
    tab: tab ? Math.round((tab.getBoundingClientRect().y + scrollY) * 100) / 100 : null, coarse: matchMedia("(pointer: coarse)").matches };
});
async function open(br, base, viewport, touch) {
  const ctx = await br.newContext({ viewport, deviceScaleFactor: 2, hasTouch: touch, reducedMotion: "reduce" });
  const page = await ctx.newPage(); await page.goto(base + "/" + BOARD16);
  await page.waitForSelector(".sudoku-cell", { timeout: 90000 }); await page.waitForTimeout(1500);
  return { ctx, page };
}
for (const e of (process.env.ENGINES || "chromium,webkit").split(",")) {
  const br = await ENG[e].launch();
  for (const [arm, base] of Object.entries(ARMS)) {
    if (MODE === "paint") for (let run = 1; run <= +(process.env.RUNS || 2); run++) {
      const { ctx, page } = await open(br, base, { width: 393, height: 699 }, true);
      for (let k = 0; k < 2; k++) { await hint(page); await page.waitForTimeout(700); }
      const laid = await read(page);
      await page.evaluate(() => {
        window.__f = []; window.__on = true; const t0 = performance.now();
        const loop = () => { if (!window.__on) return; requestAnimationFrame((ts) => { const ch = new MessageChannel(); ch.port1.onmessage = () => {
          const m = document.querySelector(".margin-note-meta"), v = document.querySelector(".margin-note"); let row2 = false;
          if (m && v) { const r = document.createRange(); r.selectNodeContents(m); const t = r.getBoundingClientRect(), b = v.getBoundingClientRect(); row2 = t.top > b.top + b.height / 2; }
          window.__f.push({ t: Math.round(ts - t0), present: !!m, row2 }); }; ch.port2.postMessage(0); loop(); }); };
        loop();
      });
      await hint(page); await page.waitForTimeout(1200);
      const f = await page.evaluate(() => { window.__on = false; return window.__f; });
      const after = await read(page);
      const row2 = f.filter((x) => x.present && x.row2), pres = f.filter((x) => x.present);
      const span = row2.length ? `${row2[0].t}..${row2[row2.length - 1].t} ms` : "-";
      console.log(`PAINT ${e} ${arm} run${run} load ${load()} coarse ${laid.coarse} · laid w${laid.w} meta "${laid.meta}" · press3 voice "${after.voice.slice(0, 40)}" · frames ${f.length} · present ${pres.length} · ROW2 ${row2.length} (${span}) · after meta ${after.meta ?? "-"}`);
      await ctx.close();
    }
    if (MODE === "fit") for (const [name, vp, touch] of [["1280x800 fine", { width: 1280, height: 800 }, false], ["844x390 coarse", { width: 844, height: 390 }, true]]) {
      const { ctx, page } = await open(br, base, vp, touch); const tr = [];
      for (let k = 1; k <= 4; k++) { await hint(page); await page.waitForTimeout(700); const r = await read(page); tr.push(`p${k} w${r.w} "${r.voice.slice(0, 34)}"(${r.voice.length}) meta ${r.meta ?? "-"}${r.row2 ? " ROW2" : ""}`); }
      const longMet = tr.some((s) => / w[12] .*\((2[1-9]|[3-9]\d)\) meta -/.test(s));
      console.log(`FIT ${e} ${arm} ${name} load ${load()} · ${tr.join(" · ")} · LESSON CUT ON A FITTING CELL: ${longMet ? "YES" : "no"}`);
      await ctx.close();
    }
    if (MODE === "resize") {
      // RESIZE AT REST (LAWS P6 §D): the count laid and a long hint spoken where the pair FITS (844x390 coarse), then the
      // viewport narrowed at rest to 393x699: the yield must fire on the resize alone, with no frame on row two.
      const { ctx, page } = await open(br, base, { width: 844, height: 390 }, true);
      for (let k = 0; k < 3; k++) { await hint(page); await page.waitForTimeout(700); }
      const before = await read(page);
      await page.evaluate(() => { window.__f = []; window.__on = true; const t0 = performance.now();
        const loop = () => { if (!window.__on) return; requestAnimationFrame((ts) => { const ch = new MessageChannel(); ch.port1.onmessage = () => {
          const m = document.querySelector(".margin-note-meta"), v = document.querySelector(".margin-note"); let row2 = false;
          if (m && v) { const r = document.createRange(); r.selectNodeContents(m); const t = r.getBoundingClientRect(), b = v.getBoundingClientRect(); row2 = t.top > b.top + b.height / 2; }
          window.__f.push({ t: Math.round(ts - t0), present: !!m, row2 }); }; ch.port2.postMessage(0); loop(); }); }; loop(); });
      await page.setViewportSize({ width: 393, height: 699 }); await page.waitForTimeout(1200);
      const f = await page.evaluate(() => { window.__on = false; return window.__f; });
      const after = await read(page);
      console.log(`RESIZE ${e} ${arm} load ${load()} · 844x390 w${before.w} voice(${before.voice.length}) meta "${before.meta}"${before.row2 ? " ROW2" : ""} → 393x699 · frames ${f.length} · present ${f.filter((x) => x.present).length} · ROW2 ${f.filter((x) => x.present && x.row2).length} · after meta ${after.meta ?? "-"}`);
      await ctx.close();
    }
    if (MODE === "strip") for (const [name, vp] of [["393x699", { width: 393, height: 699 }], ["812x375", { width: 812, height: 375 }]]) {
      const { ctx, page } = await open(br, base, vp, true); const r0 = await read(page); const tr = [`rest strip ${r0.strip} tab ${r0.tab}`];
      for (let k = 1; k <= 4; k++) { await hint(page); await page.waitForTimeout(700); const r = await read(page); tr.push(`p${k} w${r.w} strip ${r.strip} tab ${r.tab} voice(${r.voice.length}) meta ${r.meta ?? "-"}`); }
      console.log(`STRIP ${e} ${arm} ${name} coarse ${r0.coarse} load ${load()} · ${tr.join(" · ")}`);
      await ctx.close();
    }
  }
  await br.close();
}
console.log("ALLDONE");
