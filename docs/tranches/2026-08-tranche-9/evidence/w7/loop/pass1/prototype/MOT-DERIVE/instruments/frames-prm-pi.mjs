#!/usr/bin/env node
/**
 * THE THREE CHECKS A CLOCK CHANGE OWES (T9-W7 pass 1, MOT-DERIVE).
 *
 *  A · FRAMES — r0's r4-frame-probe re-run against THIS dist: dock open + close, 1× and 4×
 *      CPU, both themes. Success = 1× zero frames >33.4ms (r0 max 29.9ms), 4× no frame above
 *      r0's 53.0ms, no new long frame, nothing shortened. 4× needs CDP, so it is chromium's.
 *
 *  B · PRM — `emulateMedia({reducedMotion:'reduce'})`, open and close on both viewports:
 *      `getAnimations()` must stay EMPTY (same-frame swap, no tween), the rest pose must be
 *      the same frame, and the layout count must show one step per gesture.
 *
 *  C · π — the desk keyframes and duration, byte-compared against r0's r4-probe3.json at
 *      1440×900. This family claims the dock only; the desk must move by zero pixels.
 *
 * Usage: node frames-prm-pi.mjs <out.json> [--engine=chromium|webkit]
 */
import { chromium, webkit } from "playwright";
import { writeFileSync, readFileSync } from "node:fs";
import process from "node:process";

const BASE = process.env.BASE ?? "http://127.0.0.1:4248/";
const OUT = process.argv[2] ?? "/tmp/frames-prm-pi.json";
const ENGINE = process.argv.find((a) => a.startsWith("--engine="))?.split("=")[1] ?? "chromium";
const R0 =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/r4-transition-grammar/data/r4-probe3.json";

const ARM = `
window.__r4 = { t: [], gen: 0 };
window.__r4start = () => { const g = ++window.__r4.gen; window.__r4.t = [];
  const tick = (ts) => { if (window.__r4.gen !== g) return; window.__r4.t.push(ts); requestAnimationFrame(tick); };
  requestAnimationFrame(tick); };
window.__r4stop = () => { window.__r4.gen++; return window.__r4.t.slice(); };
window.__anims = () => document.getAnimations().map((a) => {
  const e = a.effect; const tm = e && e.getTiming ? e.getTiming() : {};
  let cls = null; try { const t = e && e.target; cls = t ? (typeof t.className === 'string' ? t.className : t.getAttribute('class')) : null; } catch {}
  return { dur: tm.duration, easing: tm.easing, cls: cls ? String(cls).slice(0,60) : null };
});
window.__mv = [];
const orig = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  let cls = ''; try { cls = typeof this.className === 'string' ? this.className : (this.getAttribute('class') || ''); } catch {}
  window.__mv.push({ tag: this.tagName, cls: String(cls).slice(0,60), kf: JSON.stringify(kf).slice(0,220), opts: JSON.stringify(opts).slice(0,160) });
  return orig.call(this, kf, opts);
};
window.__rect = (sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect();
  return { x: +r.left.toFixed(2), y: +r.top.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) }; };
`;

function stats(ts) {
  const d = [];
  for (let i = 1; i < ts.length; i++) d.push(ts[i] - ts[i - 1]);
  if (!d.length) return { frames: ts.length };
  const s = [...d].sort((a, b) => a - b);
  return {
    frames: ts.length,
    medianMs: +s[Math.floor(s.length / 2)].toFixed(2),
    maxMs: +s[s.length - 1].toFixed(2),
    over33: d.filter((x) => x > 33.4).length,
    over50: d.filter((x) => x > 50).length,
    long: d.filter((x) => x > 33.4).map((x) => +x.toFixed(1)),
  };
}

const launcher = ENGINE === "webkit" ? webkit : chromium;
const browser = await launcher.launch({ headless: true });
const out = { meta: { engine: ENGINE, when: new Date().toISOString() }, frames: [], prm: [], pi: null };

async function boot(ctx, { prm } = {}) {
  const page = await ctx.newPage();
  await page.addInitScript(ARM);
  if (prm) await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(BASE + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForTimeout(1800);
  return page;
}

// ── A · FRAMES ────────────────────────────────────────────────────────────
for (const cpu of ENGINE === "chromium" ? [1, 4] : [1]) {
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      hasTouch: true,
      isMobile: ENGINE === "chromium",
      colorScheme: theme,
      reducedMotion: "no-preference",
    });
    const page = await boot(ctx);
    let cdp = null;
    if (ENGINE === "chromium") {
      cdp = await ctx.newCDPSession(page);
      await cdp.send("Performance.enable");
      if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
    }
    const tab = page.locator(".drawer-tab").first();
    for (const label of ["dock-open", "dock-close"]) {
      await page.evaluate("window.__r4start()");
      await tab.click({ force: true });
      await page.waitForTimeout(1000);
      const ts = await page.evaluate("window.__r4stop()");
      out.frames.push({ cpu, theme, label, ...stats(ts) });
      await page.waitForTimeout(900);
    }
    await ctx.close();
  }
}

// ── B · PRM ───────────────────────────────────────────────────────────────
for (const vp of [
  { name: "390x844", w: 390, h: 844, dsf: 3, mobile: true },
  { name: "1440x900", w: 1440, h: 900, dsf: 2, mobile: false },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.dsf,
    hasTouch: vp.mobile,
    isMobile: ENGINE === "chromium" ? vp.mobile : undefined,
    reducedMotion: "reduce",
  });
  const page = await boot(ctx, { prm: true });
  const tab = page.locator(".drawer-tab").first();
  const row = { viewport: vp.name };
  await page.evaluate(() => (window.__mv = []));
  const closedRect = await page.evaluate('window.__rect(".scene-controls")');
  await tab.click({ force: true });
  row.animsRightAfterOpen = await page.evaluate("window.__anims()");
  row.moversOnOpen = await page.evaluate(() => window.__mv.length);
  await page.waitForTimeout(80);
  row.openRectAt80ms = await page.evaluate('window.__rect(".scene-controls")');
  await page.waitForTimeout(800);
  row.openRectSettled = await page.evaluate('window.__rect(".scene-controls")');
  await tab.click({ force: true });
  row.animsRightAfterClose = await page.evaluate("window.__anims()");
  row.moversOnClose = await page.evaluate(() => window.__mv.length);
  await page.waitForTimeout(800);
  row.closedRectAfter = await page.evaluate('window.__rect(".scene-controls")');
  row.closedRectBefore = closedRect;
  out.prm.push(row);
  await ctx.close();
}

// ── C · π — the desk drawer's keyframes, against r0 ───────────────────────
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await boot(ctx);
  await page.evaluate(() => (window.__mv = []));
  const tab = page.locator(".drawer-tab").first();
  await tab.click({ force: true });
  await page.waitForTimeout(1400);
  const mine = await page.evaluate(() => window.__mv);
  const r0 = JSON.parse(readFileSync(R0, "utf8"))["1440x900-desk"].movers.filter((m) => m.kf);
  const r0open = [];
  for (const m of JSON.parse(readFileSync(R0, "utf8"))["1440x900-desk"].movers) {
    if (m.mark === "drawer-toggle-open") r0open.length = 0;
    else if (m.mark) break;
    else if (m.kf) r0open.push(m);
  }
  out.pi = {
    r0Count: r0open.length,
    mineCount: mine.length,
    rows: mine.map((m, i) => ({
      cls: m.cls,
      kfMatch: r0open[i] ? r0open[i].kf === m.kf : null,
      optsMatch: r0open[i] ? r0open[i].opts === m.opts : null,
      mineKf: m.kf,
      r0Kf: r0open[i]?.kf ?? null,
      mineOpts: m.opts,
      r0Opts: r0open[i]?.opts ?? null,
    })),
    allR0: r0.length,
  };
  await ctx.close();
}

writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(`— ${ENGINE} —`);
for (const f of out.frames)
  console.log(
    `FRAMES ${f.cpu}x ${f.theme.padEnd(5)} ${f.label.padEnd(11)} frames=${f.frames} median=${f.medianMs}ms max=${f.maxMs}ms >33.4:${f.over33} >50:${f.over50} long=[${f.long.join(" ")}]`,
  );
for (const p of out.prm)
  console.log(
    `PRM ${p.viewport} movers(open/close)=${p.moversOnOpen}/${p.moversOnClose} anims(open/close)=${p.animsRightAfterOpen.length}/${p.animsRightAfterClose.length} closed=${JSON.stringify(p.closedRectBefore)} open@80ms=${JSON.stringify(p.openRectAt80ms)} openSettled=${JSON.stringify(p.openRectSettled)} closedAfter=${JSON.stringify(p.closedRectAfter)}`,
  );
console.log(`PI desk movers: r0=${out.pi.r0Count} mine=${out.pi.mineCount}`);
for (const r of out.pi.rows)
  console.log(
    `   ${r.kfMatch && r.optsMatch ? "IDENTICAL" : "DIFF     "} ${String(r.cls).split(" ")[0].padEnd(18)} kf=${r.kfMatch} opts=${r.optsMatch}` +
      (r.kfMatch && r.optsMatch ? "" : `\n      mine: ${r.mineKf} ${r.mineOpts}\n      r0  : ${r.r0Kf} ${r.r0Opts}`),
  );
await browser.close();
