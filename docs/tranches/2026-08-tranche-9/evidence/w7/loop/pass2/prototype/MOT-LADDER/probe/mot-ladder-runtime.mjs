#!/usr/bin/env node
/**
 * T9-W7 pass 2 · MOT-LADDER — THE RUNTIME BATTERY, on the built dists.
 *
 * One script, five probes, chunked by `--probe` so no single run outlives the harness's
 * 180s silence window. Every probe takes BASE (the dist under test) and an engine, and
 * writes JSON. Nothing here writes to r0.
 *
 *   --probe=publish  the <style data-motion-rungs> node, and the reduce ROSTER: every live
 *                    rule with a nonzero duration under `reduce`, rule level (the shape
 *                    research/instruments/reduce-rule-roster.mjs cut), plus the resolved
 *                    --motion-* at :root and on four real elements.
 *   --probe=dock     the sheet's travel + worst 60Hz frame at the band's three poses and the
 *                    desk, and the settle: 700ms after open, 0 running animations and the
 *                    rest rect.
 *   --probe=tongue   the drawer tab's per-frame rect over open + close at 390x844: the
 *                    biggest frame-to-frame move while the tongue is NOT under the sheet.
 *   --probe=exit     the gallery exit on C06: the fold mover's live frames, and per-mover
 *                    enter-vs-exit travel.
 *   --probe=theme    six alternating theme flips at 4x CPU: long frames, and the painted
 *                    background-color sequence.
 *
 * Usage: node mot-ladder-runtime.mjs --probe=X --engine=chromium --base=http://… --out=f.json
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=").slice(1).join("=") ?? d;
const PROBE = arg("probe", "publish");
const ENGINE = arg("engine", "chromium");
const BASE = arg("base", "http://127.0.0.1:4246/");
const OUT = arg("out", `/tmp/mot-${PROBE}-${ENGINE}.json`);
const launcher = ENGINE === "webkit" ? webkit : chromium;

const VP = {
  "390x844": { width: 390, height: 844, dsf: 3, mobile: true },
  "768x1024": { width: 768, height: 1024, dsf: 2, mobile: true },
  "844x390": { width: 844, height: 390, dsf: 3, mobile: true },
  "1280x800": { width: 1280, height: 800, dsf: 2, mobile: false },
  "1440x900": { width: 1440, height: 900, dsf: 2, mobile: false },
};

async function ctxFor(browser, vpName, { theme = "light", reduce = false } = {}) {
  const v = VP[vpName];
  const ctx = await browser.newContext({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: v.dsf,
    hasTouch: v.mobile,
    isMobile: ENGINE === "chromium" ? v.mobile : undefined,
    colorScheme: theme,
    reducedMotion: reduce ? "reduce" : "no-preference",
  });
  return ctx;
}

async function settled(page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForTimeout(1500);
}

/** The rAF rect sampler + the animate() hook, armed before any app code runs. */
const HOOK = `
window.__mv = [];
const __origAnimate = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  let cls = ''; try { cls = typeof this.className === 'string' ? this.className : (this.getAttribute && this.getAttribute('class')) || ''; } catch {}
  window.__mv.push({ t: +performance.now().toFixed(1), cls: String(cls).slice(0, 70),
    kf: JSON.stringify(kf), dur: opts && opts.duration, easing: opts && opts.easing, id: opts && opts.id });
  return __origAnimate.call(this, kf, opts);
};
window.__sample = (sel, ms) => new Promise((res) => {
  const el = document.querySelector(sel);
  if (!el) return res([]);
  const out = []; const t0 = performance.now();
  const tick = (ts) => {
    const r = el.getBoundingClientRect();
    out.push({ t: +(ts - t0).toFixed(2), x: +r.left.toFixed(2), y: +r.top.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) });
    if (ts - t0 < ms) requestAnimationFrame(tick); else res(out);
  };
  requestAnimationFrame(tick);
});
window.__sample2 = (selA, selB, ms) => new Promise((res) => {
  const out = []; const t0 = performance.now();
  const tick = (ts) => {
    const a = document.querySelector(selA); const b = document.querySelector(selB);
    const ra = a && a.getBoundingClientRect(); const rb = b && b.getBoundingClientRect();
    out.push({ t: +(ts - t0).toFixed(2),
      a: ra ? { x: +ra.left.toFixed(2), y: +ra.top.toFixed(2), w: +ra.width.toFixed(2), h: +ra.height.toFixed(2) } : null,
      b: rb ? { x: +rb.left.toFixed(2), y: +rb.top.toFixed(2), w: +rb.width.toFixed(2), h: +rb.height.toFixed(2) } : null });
    if (ts - t0 < ms) requestAnimationFrame(tick); else res(out);
  };
  requestAnimationFrame(tick);
});
`;

/** What a 60Hz screen paints: resample the position trace at 16.67ms, read displacement off THAT. */
function hz60(samples) {
  if (samples.length < 2) return { frames: samples.length, maxPxPerFrame: 0, travelPx: 0 };
  const at = (t) => {
    if (t <= samples[0].t) return samples[0];
    for (let i = 1; i < samples.length; i++)
      if (samples[i].t >= t) {
        const a = samples[i - 1], b = samples[i], k = (t - a.t) / (b.t - a.t || 1);
        return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
      }
    return samples[samples.length - 1];
  };
  const end = samples[samples.length - 1].t;
  const f = [];
  for (let t = 16.67; t <= end; t += 16.67) {
    const p = at(t), q = at(t - 16.67);
    f.push(+Math.hypot(p.x - q.x, p.y - q.y).toFixed(1));
  }
  const total = Math.hypot(
    samples[samples.length - 1].x - samples[0].x,
    samples[samples.length - 1].y - samples[0].y,
  );
  return {
    frames: samples.length,
    travelPx: +total.toFixed(1),
    firstMovingFramePx: f.find((x) => x > 0.5) ?? 0,
    maxPxPerFrame: f.length ? Math.max(...f) : 0,
    framesOver40px: f.filter((x) => x > 40).length,
    frameCount: f.length,
    strip: f.slice(0, 10),
  };
}

const ROSTER = `() => {
  const ms = (v) => !v ? 0 : v.split(',').map(s => s.trim()).reduce((m, s) => {
    const n = s.endsWith('ms') ? parseFloat(s) : s.endsWith('s') ? parseFloat(s) * 1000 : 0;
    return Math.max(m, isFinite(n) ? n : 0); }, 0);
  const out = [];
  const walk = (rules, inPrm) => {
    for (const r of rules) {
      if (r.type === CSSRule.MEDIA_RULE || (r.media && !r.selectorText)) {
        const prm = inPrm || /prefers-reduced-motion/.test(r.conditionText || (r.media && r.media.mediaText) || '');
        if (r.cssRules) walk(r.cssRules, prm);
        continue;
      }
      if (!r.selectorText || !r.style) { if (r.cssRules) walk(r.cssRules, inPrm); continue; }
      if (r.cssRules && r.cssRules.length) walk(r.cssRules, inPrm);
      const decl = r.style.getPropertyValue('transition-duration') || r.style.getPropertyValue('animation-duration')
        || r.style.getPropertyValue('transition') || r.style.getPropertyValue('animation');
      if (!decl) continue;
      let n = 0; try { n = document.querySelectorAll(r.selectorText).length; } catch { n = -1; }
      if (n <= 0) continue;
      const el = document.querySelector(r.selectorText);
      const cs = el ? getComputedStyle(el) : null;
      const td = cs ? ms(cs.transitionDuration) : null;
      const ad = cs ? ms(cs.animationDuration) : null;
      out.push({ sel: r.selectorText.slice(0, 90), decl: decl.slice(0, 90), inPrm,
        readsRung: /var\\(\\s*--motion-/.test(r.cssText), matches: n,
        td, ad, liveMs: Math.max(td || 0, ad || 0) });
    }
  };
  for (const sh of document.styleSheets) { try { walk(sh.cssRules, false); } catch {} }
  return out;
}`;

const launch = async () => launcher.launch({ headless: true });

async function probePublish() {
  const browser = await launch();
  const out = { meta: { probe: "publish", engine: ENGINE, base: BASE, when: new Date().toISOString() }, runs: [] };
  for (const reduce of [false, true])
    for (const vpName of ["390x844", "1280x800"]) {
      const ctx = await ctxFor(browser, vpName, { reduce });
      const page = await ctx.newPage();
      await page.goto(BASE + "?size=3&difficulty=EASY");
      await settled(page);
      if (vpName === "390x844") {
        const tab = page.locator(".drawer-tab").first();
        if (await tab.count()) { await tab.click({ force: true }); await page.waitForTimeout(900); }
      }
      const node = await page.evaluate(() => {
        const el = document.querySelector("style[data-motion-rungs]");
        return { present: !!el, count: document.querySelectorAll("style[data-motion-rungs]").length,
          text: el ? el.textContent : null };
      });
      const rootVars = await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        const names = ["whisper", "leave", "note", "dusk", "step", "throw", "rise"];
        return Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(`--motion-${n}`).trim()]));
      });
      const onEls = await page.evaluate(() => {
        const sels = [".icon-btn", ".washi-label", ".drawer-tab-text", ".transition-colors", ".scene-controls", ".gallery-pip"];
        return sels.map((s) => {
          const el = document.querySelector(s);
          if (!el) return { sel: s, found: false };
          const cs = getComputedStyle(el);
          return { sel: s, found: true, transitionDuration: cs.transitionDuration,
            whisper: cs.getPropertyValue("--motion-whisper").trim(),
            throwV: cs.getPropertyValue("--motion-throw").trim() };
        });
      });
      const roster = await page.evaluate(`(${ROSTER})()`);
      // A LENGTH, not the floor: index.css's universal reset leaves every element at
      // `animation-duration: 0.01ms !important` under reduce, which is the same-frame cut,
      // not a tween. <= 1ms is not a length (the static gate's own rule).
      const live = roster.filter((r) => r.td > 1 || r.ad > 1);
      out.runs.push({ viewport: vpName, reduce, node, rootVars, onEls,
        rosterTotal: roster.length,
        liveNonzero: live.length,
        liveNonzeroReadingRung: live.filter((r) => r.readsRung).length,
        liveTransitions: live.filter((r) => r.td > 1).length,
        liveTransitionsReadingRung: live.filter((r) => r.td > 1 && r.readsRung).length,
        liveNonzeroRows: live.map((r) => ({ sel: r.sel, td: r.td, ad: r.ad, inPrm: r.inPrm, readsRung: r.readsRung, matches: r.matches })) });
      await ctx.close();
    }
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  for (const r of out.runs)
    console.log(`${ENGINE} ${r.viewport} reduce=${r.reduce} node=${r.node.count} rungs=${JSON.stringify(r.rootVars)} | live rules >1ms: ${r.liveNonzero} (transitions ${r.liveTransitions}, of those reading a rung ${r.liveTransitionsReadingRung})`);
  await browser.close();
}

async function probeDock() {
  const browser = await launch();
  const out = { meta: { probe: "dock", engine: ENGINE, base: BASE, when: new Date().toISOString() }, runs: [] };
  for (const vpName of ["768x1024", "390x844", "844x390", "1440x900"])
    for (const theme of ["light", "dark"]) {
      if (theme === "dark" && vpName !== "390x844") continue;
      const ctx = await ctxFor(browser, vpName, { theme });
      const page = await ctx.newPage();
      await page.addInitScript(HOOK);
      await page.goto(BASE + "?size=3&difficulty=EASY");
      await settled(page);
      await page.evaluate(() => { window.__mv = []; });
      const tab = page.locator(".drawer-tab").first();
      if (!(await tab.count())) { await ctx.close(); continue; }
      const sampling = page.evaluate(([s, ms]) => window.__sample(s, ms), [".scene-controls", 1200]);
      await tab.click({ force: true });
      const samples = await sampling;
      await page.waitForTimeout(700);
      const settle = await page.evaluate(() => {
        const el = document.querySelector(".scene-controls");
        const r = el ? el.getBoundingClientRect() : null;
        return { running: document.getAnimations().filter((a) => a.playState === "running").length,
          rect: r ? { x: +r.left.toFixed(2), y: +r.top.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) } : null };
      });
      const movers = (await page.evaluate(() => window.__mv)).map((m) => ({ cls: m.cls.split(" ")[0], dur: m.dur, id: m.id }));
      out.runs.push({ viewport: vpName, theme, open: hz60(samples), settle, movers });
      await ctx.close();
    }
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  for (const r of out.runs)
    console.log(`${ENGINE} ${r.viewport} ${r.theme} travel=${r.open.travelPx}px worst60Hz=${r.open.maxPxPerFrame}px >40:${r.open.framesOver40px}/${r.open.frameCount} clocks=[${r.movers.map((m) => m.dur).join(",")}] settle running=${r.settle.running} rect=${JSON.stringify(r.settle.rect)}`);
  await browser.close();
}

async function probeTongue() {
  const browser = await launch();
  const out = { meta: { probe: "tongue", engine: ENGINE, base: BASE, when: new Date().toISOString() }, runs: [] };
  for (const theme of ["light", "dark"]) {
    const ctx = await ctxFor(browser, "390x844", { theme });
    const page = await ctx.newPage();
    await page.addInitScript(HOOK);
    await page.goto(BASE + "?size=3&difficulty=EASY");
    await settled(page);
    const tab = page.locator(".drawer-tab").first();
    if (!(await tab.count())) { await ctx.close(); continue; }
    const legs = [];
    for (const leg of ["open", "close"]) {
      const sampling = page.evaluate(([a, b, ms]) => window.__sample2(a, b, ms), [".drawer-tab", ".scene-controls", 1400]);
      await tab.click({ force: true });
      const s = await sampling;
      await page.waitForTimeout(500);
      // A frame counts only while the tongue is NOT occluded by the sheet: the sheet's rect
      // must not cover the tongue's centre.
      const jumps = [];
      for (let i = 1; i < s.length; i++) {
        const p = s[i - 1].a, q = s[i].a, sheet = s[i].b;
        if (!p || !q) continue;
        const cx = q.x + q.w / 2, cy = q.y + q.h / 2;
        const occluded = sheet && cx >= sheet.x && cx <= sheet.x + sheet.w && cy >= sheet.y && cy <= sheet.y + sheet.h;
        jumps.push({ t: s[i].t, px: +Math.hypot(q.x - p.x, q.y - p.y).toFixed(1), occluded: !!occluded });
      }
      const unocc = jumps.filter((j) => !j.occluded);
      legs.push({ leg, frames: s.length,
        maxUnoccludedPx: unocc.length ? Math.max(...unocc.map((j) => j.px)) : 0,
        maxAnyPx: jumps.length ? Math.max(...jumps.map((j) => j.px)) : 0,
        biggestUnoccluded: unocc.sort((a, b) => b.px - a.px).slice(0, 3),
        biggestAny: jumps.slice().sort((a, b) => b.px - a.px).slice(0, 3) });
    }
    out.runs.push({ theme, legs });
    await ctx.close();
  }
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  for (const r of out.runs)
    for (const l of r.legs)
      console.log(`${ENGINE} 390x844 ${r.theme} ${l.leg}: max unoccluded frame ${l.maxUnoccludedPx}px (max any ${l.maxAnyPx}px)`);
  await browser.close();
}

function kfTravel(kf) {
  const m = /translate(?:X|Y)?\(([^)]+)\)/.exec(kf);
  if (!m) return null;
  const parts = m[1].split(",").map((t) => (t.includes("%") ? 0 : parseFloat(t) || 0));
  const isY = /translateY/.test(kf);
  const [a, b] = parts.length === 2 ? parts : isY ? [0, parts[0]] : [parts[0], 0];
  return +Math.hypot(a, b).toFixed(1);
}

async function probeExit() {
  const browser = await launch();
  const out = { meta: { probe: "exit", engine: ENGINE, base: BASE, when: new Date().toISOString() }, runs: [] };
  for (const vpName of ["1440x900", "390x844"]) {
    const ctx = await ctxFor(browser, vpName);
    const page = await ctx.newPage();
    await page.addInitScript(HOOK);
    await page.goto(BASE + "?size=3&difficulty=EASY");
    await settled(page);
    await page.evaluate(() => { document.activeElement?.blur?.(); window.__mv = []; });
    // ENTER
    await page.keyboard.press("g");
    await page.waitForTimeout(1800);
    const enter = (await page.evaluate(() => window.__mv)).map((m) => ({ cls: m.cls.split(" ")[0], dur: m.dur, travelPx: kfTravel(m.kf) }));
    // EXIT — sample the live board host for real frames, and catch the roster at +90ms.
    await page.evaluate(() => { window.__mv = []; });
    const sampling = page.evaluate(([s, ms]) => window.__sample(s, ms), [".board-peek-host", 900]);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(90);
    const roster90 = await page.evaluate(() =>
      document.getAnimations().map((a) => {
        const t = a.effect && a.effect.getTiming ? a.effect.getTiming() : {};
        let cls = "";
        try {
          cls = a.effect && a.effect.target ? String(a.effect.target.className).slice(0, 50) : "";
        } catch {
          cls = "";
        }
        return { name: a.animationName || a.id || "(waapi)", cls, dur: t.duration, easing: t.easing, state: a.playState };
      }),
    );
    const samples = await sampling;
    await page.waitForTimeout(900);
    const exit = (await page.evaluate(() => window.__mv)).map((m) => ({ cls: m.cls.split(" ")[0], dur: m.dur, travelPx: kfTravel(m.kf) }));
    const liveFrames = (() => {
      let n = 0;
      for (let i = 1; i < samples.length; i++)
        if (Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y) > 0.5) n++;
      return n;
    })();
    out.runs.push({ viewport: vpName, enter, exit, roster90, boardHost: hz60(samples), liveFrames });
    await ctx.close();
  }
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  for (const r of out.runs) {
    console.log(`${ENGINE} ${r.viewport} enter=[${r.enter.filter((m) => m.travelPx).map((m) => `${m.cls} ${m.travelPx}px/${m.dur}`).join(" | ")}]`);
    console.log(`${ENGINE} ${r.viewport} exit =[${r.exit.filter((m) => m.travelPx).map((m) => `${m.cls} ${m.travelPx}px/${m.dur}`).join(" | ")}]  boardHost live frames=${r.liveFrames} travel=${r.boardHost.travelPx}px`);
    console.log(`${ENGINE} ${r.viewport} roster@90ms n=${r.roster90.length}: ${r.roster90.map((a) => `${a.name}/${a.dur}/${a.easing}`).join(" , ")}`);
  }
  await browser.close();
}

async function probeTheme() {
  const browser = await launch();
  const out = { meta: { probe: "theme", engine: ENGINE, base: BASE, when: new Date().toISOString() }, runs: [] };
  const ctx = await ctxFor(browser, "1280x800");
  const page = await ctx.newPage();
  const cdp = ENGINE === "chromium" ? await ctx.newCDPSession(page) : null;
  if (cdp) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.goto(BASE + "?size=3&difficulty=EASY");
  await settled(page);
  const flips = [];
  for (let i = 0; i < 6; i++) {
    const trace = page.evaluate(() => new Promise((res) => {
      const f = []; const bg = []; const t0 = performance.now(); let last = t0;
      const tick = (ts) => {
        f.push(+(ts - last).toFixed(1)); last = ts;
        bg.push(getComputedStyle(document.body).backgroundColor);
        if (ts - t0 < 900) requestAnimationFrame(tick); else res({ f, bg });
      };
      requestAnimationFrame(tick);
    }));
    await page.locator(".sun-moon-toggle, [aria-label*='theme' i], [aria-label*='mode' i]").first().click({ force: true });
    const { f, bg } = await trace;
    await page.waitForTimeout(500);
    flips.push({ i, longFrames: f.filter((x) => x > 33).length, maxFrameMs: Math.max(...f),
      over100: f.filter((x) => x > 100).length, bgSeq: [...new Set(bg)].slice(0, 12) });
  }
  out.runs.push({ viewport: "1280x800", cpu: cdp ? "4x" : "1x (webkit: no CDP)", flips });
  await ctx.close();
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  for (const f of flips)
    console.log(`${ENGINE} flip ${f.i}: long(>33ms)=${f.longFrames} max=${f.maxFrameMs}ms over100=${f.over100} bgSteps=${f.bgSeq.length}`);
  await browser.close();
}

const PROBES = { publish: probePublish, dock: probeDock, tongue: probeTongue, exit: probeExit, theme: probeTheme };
await PROBES[PROBE]();
console.log(`WROTE ${OUT}`);
