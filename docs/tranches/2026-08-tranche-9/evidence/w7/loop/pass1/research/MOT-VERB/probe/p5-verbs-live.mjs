#!/usr/bin/env node
/**
 * P5 — THE VERBS, LIVE.  Against a BUILT dist, both engines, before and after the diff.
 *
 * Five readings, each answering one of the family's questions with a number:
 *
 *  A · LIFT'S TWINS      the computed transition on BOTH declared twins — `.scene-controls`
 *                        under `html.gallery-leaving` (scene.css:617/:629) and
 *                        `.gallery-fade-leave-active` (App.vue:1142). One curve, one duration,
 *                        or two. Read off the CASCADE, not off the source: the rule that wins
 *                        is the fact.
 *  B · THE TWINS' COST   what the two curves actually do to a leaving thing: opacity at the
 *                        window's midpoint, sampled from the two cubic-beziers the cascade
 *                        reports. A "twin" whose halves differ here is not a twin.
 *  C · THE DUSK          six alternating theme flips at 4x CPU on the built dist: max frame,
 *                        frames >33ms, and the painted body colour count (the tween's own
 *                        evidence). P1-W3's +23.5 fps is the thing at risk.
 *  D · RUB OUT           injected over the LIVE margin note. Measures glyph-box stability
 *                        through the erase (text must not boil), the clip retreat, and the
 *                        PRM arm in the same frame.
 *  E · PRM               `prefers-reduced-motion: reduce`: every verb's arm, asserted as a
 *                        computed `none` / same-frame.
 *
 * BASE=http://127.0.0.1:4248/ ENGINE=chromium node p5-verbs-live.mjs out.json
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const BASE = process.env.BASE ?? "http://127.0.0.1:4248/";
const ENGINE = process.env.ENGINE ?? "chromium";
const OUT = process.argv[2] ?? "/tmp/p5.json";
const engine = ENGINE === "webkit" ? webkit : chromium;

const bez = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
function yAt(c, x) {
  let lo = 0, hi = 1;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (bez(c[0], c[2], m) < x) lo = m; else hi = m;
  }
  return bez(c[1], c[3], (lo + hi) / 2);
}
const parse = (s) => {
  const m = /cubic-bezier\(([^)]+)\)/.exec(s ?? "");
  return m ? m[1].split(",").map(Number) : null;
};

const browser = await engine.launch({ headless: true });
const out = { base: BASE, engine: ENGINE, at: new Date().toISOString() };

// ── A + B · THE TWINS ────────────────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: ENGINE !== "webkit" });
  const page = await ctx.newPage();
  await page.goto(BASE + "?game=sudoku", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  out.twins = await page.evaluate(() => {
    // Read the twins off the CASCADE by arming each one's state on a probe element.
    const read = (el) => {
      const cs = getComputedStyle(el);
      return { prop: cs.transitionProperty, dur: cs.transitionDuration, ease: cs.transitionTimingFunction, delay: cs.transitionDelay };
    };
    const res = {};
    // twin 1 — the chrome leave: arm html.gallery-leaving over the live .scene-controls
    const chrome = document.querySelector(".scene-controls");
    if (chrome) {
      document.documentElement.classList.add("gallery-leaving");
      res.chromeLeave = read(chrome);
      document.documentElement.classList.remove("gallery-leaving");
    }
    // twin 2 — the deck leave: the class is a Vue transition class in App.vue's SCOPED
    // block, so the probe must wear App's scope attribute or the rule cannot match. Take
    // the scopes off `.app-layout` (App's own root) and try each; the one that yields a
    // non-zero duration is the rule that ships.
    const host = document.querySelector(".app-layout");
    const scopes = host ? [...host.attributes].map((a) => a.name).filter((n) => n.startsWith("data-v-")) : [];
    for (const sc of scopes) {
      const probe = document.createElement("div");
      probe.className = "gallery-fade-leave-active";
      probe.setAttribute(sc, "");
      (host ?? document.body).appendChild(probe);
      const r = read(probe);
      probe.remove();
      if (r.dur !== "0s") { res.deckLeave = { ...r, scope: sc }; break; }
      res.deckLeave = { ...r, scope: sc };
    }
    return res;
  });
  for (const [k, v] of Object.entries(out.twins)) {
    const c = parse(v.ease);
    if (!c) continue;
    let auc = 0;
    for (let i = 0; i < 1000; i++) auc += yAt(c, (i + 0.5) / 1000) / 1000;
    v.progressAtMid = +yAt(c, 0.5).toFixed(4);
    v.opacityAtMid = +(1 - yAt(c, 0.5)).toFixed(4);
    v.auc = +auc.toFixed(4);
  }
  out.twinsVerdict = (() => {
    const a = out.twins.chromeLeave, b = out.twins.deckLeave;
    if (!a || !b) return "unread";
    const sameEase = a.ease === b.ease, sameDur = a.dur === b.dur;
    const ratio = b.opacityAtMid && a.opacityAtMid ? +(Math.max(a.opacityAtMid, b.opacityAtMid) / Math.max(1e-6, Math.min(a.opacityAtMid, b.opacityAtMid))).toFixed(2) : null;
    return { sameEase, sameDur, opacityRatioAtMid: ratio, oneVerb: sameEase && sameDur };
  })();
  await ctx.close();
}

// ── C · THE DUSK, six alternating flips at 4x ────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: ENGINE !== "webkit" });
  const page = await ctx.newPage();
  let cdp = null;
  if (ENGINE === "chromium") {
    cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }
  await page.goto(BASE + "?game=sudoku", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const flips = [];
  for (let i = 0; i < 6; i++) {
    const r = await page.evaluate(async () => {
      const deltas = [], colours = new Set();
      let last = performance.now(), stop = false;
      const root = document.querySelector(".page-root, .bg-background") ?? document.body;
      const tick = () => {
        const n = performance.now();
        deltas.push(+(n - last).toFixed(1));
        last = n;
        colours.add(getComputedStyle(root).backgroundColor);
        if (!stop) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      const btn = document.querySelector(".sun-moon-toggle, [aria-label*='dark' i], [aria-label*='theme' i], [aria-label*='light' i]");
      if (btn) btn.click();
      await new Promise((r2) => setTimeout(r2, 1400));
      stop = true;
      return { deltas, colours: colours.size, dark: document.documentElement.classList.contains("dark") };
    });
    const d = r.deltas.slice(2);
    flips.push({
      i, dark: r.dark, colours: r.colours,
      max: +Math.max(...d).toFixed(1),
      over33: d.filter((x) => x > 33).length,
      over100: d.filter((x) => x > 100).length,
      medianFps: +(1000 / d.sort((a, b) => a - b)[Math.floor(d.length / 2)]).toFixed(1),
    });
    await page.waitForTimeout(400);
  }
  out.dusk = flips;
  out.duskSummary = {
    firstMax: flips[0].max,
    warmMaxWorst: Math.max(...flips.slice(1).map((f) => f.max)),
    warmMedianFps: +(flips.slice(1).reduce((s, f) => s + f.medianFps, 0) / 5).toFixed(1),
    over33Total: flips.reduce((s, f) => s + f.over33, 0),
    colourStepsWarm: Math.max(...flips.slice(1).map((f) => f.colours)),
  };
  await ctx.close();
}

// ── D · RUB OUT over the live note ───────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: ENGINE !== "webkit" });
  const page = await ctx.newPage();
  await page.goto(BASE + "?game=sudoku", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  out.rubOut = await page.evaluate(async () => {
    // The note is always mounted and USUALLY empty (the voice speaks on an act). Give it
    // a line under its OWN scope attribute so the shipped scoped rule matches: the element,
    // the class and the cascade are the product's, only the text is the probe's.
    let ink = document.querySelector(".margin-note-ink");
    if (!ink) {
      const note = document.querySelector(".margin-note");
      if (!note) return { present: false };
      const sc = [...note.attributes].map((a) => a.name).find((n) => n.startsWith("data-v-"));
      ink = document.createElement("span");
      ink.className = "margin-note-ink";
      if (sc) ink.setAttribute(sc, "");
      ink.textContent = "only 4 fits here";
      note.appendChild(ink);
      await new Promise((r) => requestAnimationFrame(r));
    }
    const hasVerb = getComputedStyle(document.documentElement).getPropertyValue("--verb-rubOut-ease").trim();
    // If the tree carries no RUB OUT, inject the tuple so the verb can be SHOWN either way;
    // the `native` flag says whether the product already owns it.
    const noteForScope = document.querySelector(".margin-note");
    const noteScope = noteForScope ? [...noteForScope.attributes].map((a) => a.name).find((n) => n.startsWith("data-v-")) : null;
    const native = !!hasVerb && (() => {
      const probe = document.createElement("span");
      probe.className = "margin-note-ink is-rubbing-out";
      if (noteScope) probe.setAttribute(noteScope, "");
      (noteForScope ?? document.body).appendChild(probe);
      const n = getComputedStyle(probe).animationName;
      probe.remove();
      return n && n !== "none" && n.startsWith("ink-rub-out");
    })();
    if (!native) {
      const s = document.createElement("style");
      s.textContent = `@keyframes ink-rub-out-inj{from{clip-path:inset(0 0 0 0);opacity:1}to{clip-path:inset(0 0 0 100%);opacity:0}}
        .margin-note-ink.is-rubbing-out{animation:ink-rub-out-inj 200ms cubic-bezier(0.32,0,0.67,0) forwards!important}`;
      document.head.appendChild(s);
    }
    // sample the glyph box + paint through the erase: text must NOT boil (no reflow, no
    // per-frame geometry change other than the clip).
    const before = ink.getBoundingClientRect();
    const beforeFont = getComputedStyle(ink).font;
    const samples = [];
    ink.classList.add("is-rubbing-out");
    for (let i = 0; i < 14; i++) {
      await new Promise((r) => requestAnimationFrame(r));
      const cs = getComputedStyle(ink), r = ink.getBoundingClientRect();
      samples.push({ w: +r.width.toFixed(2), h: +r.height.toFixed(2), x: +r.x.toFixed(2), y: +r.y.toFixed(2), op: +cs.opacity, clip: cs.clipPath.slice(0, 40) });
    }
    await new Promise((r) => setTimeout(r, 260));
    // getComputedStyle returns a LIVE declaration: snapshot the number BEFORE the class
    // comes off, or the read reports the rest pose instead of the held end pose.
    const endOpacity = +getComputedStyle(ink).opacity;
    const endClip = getComputedStyle(ink).clipPath.slice(0, 40);
    const boxes = new Set(samples.map((s) => `${s.w}x${s.h}@${s.x},${s.y}`));
    ink.classList.remove("is-rubbing-out");
    return {
      present: true, native,
      text: ink.textContent.trim().slice(0, 40),
      beforeBox: `${before.width.toFixed(2)}x${before.height.toFixed(2)}`,
      fontUnchanged: beforeFont === getComputedStyle(ink).font,
      distinctBoxes: boxes.size,
      boxStable: boxes.size === 1,
      clipMoved: new Set(samples.map((s) => s.clip)).size > 1,
      opacityStart: samples[0]?.op, opacityEnd: endOpacity, endClip,
      frames: samples.length,
    };
  });
  // PRM arm, same page
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  out.rubOutPrm = await page.evaluate(async () => {
    const ink = document.querySelector(".margin-note-ink");
    if (!ink) return { present: false };
    ink.classList.add("is-rubbing-out");
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));
    const cs = getComputedStyle(ink);
    const r = { animName: cs.animationName, animDur: cs.animationDuration, opacity: +cs.opacity };
    ink.classList.remove("is-rubbing-out");
    return r;
  });
  await ctx.close();
}

// ── E · PRM over the whole set ───────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: ENGINE !== "webkit", reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "?game=sudoku", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  out.prm = await page.evaluate(() => {
    const res = {};
    const chrome = document.querySelector(".scene-controls");
    if (chrome) {
      document.documentElement.classList.add("gallery-leaving");
      res.chromeLeave = getComputedStyle(chrome).transitionDuration;
      document.documentElement.classList.remove("gallery-leaving");
    }
    const probe = document.createElement("div");
    probe.className = "gallery-fade-leave-active";
    document.body.appendChild(probe);
    res.deckLeave = getComputedStyle(probe).transitionDuration;
    probe.remove();
    const body = document.body;
    document.documentElement.classList.add("theme-turning");
    res.duskBody = getComputedStyle(body).transitionDuration;
    document.documentElement.classList.remove("theme-turning");
    return res;
  });
  await ctx.close();
}

await browser.close();
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify({ twins: out.twins, twinsVerdict: out.twinsVerdict, duskSummary: out.duskSummary, rubOut: out.rubOut, rubOutPrm: out.rubOutPrm, prm: out.prm }, null, 1));
