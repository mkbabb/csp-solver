#!/usr/bin/env node
/**
 * MOT-VERB PASS-2 PROTOTYPE PROBE (T9-W7 §13) — the pencil verbs, measured on the real
 * surface: two BUILT dists (the prototype and a control that is HEAD + W8 C06 alone), both
 * engines, 390x844 dsf3 touch and 1280x800, both themes.
 *
 * Every reading here is taken off the SHIPPED stylesheet in a live page — computed style on a
 * real element wherever one exists, and the CSSOM rule where the state cannot be reached
 * without a second player at the table (the players well). Which of the two a number came
 * from is stated in the JSON, per row.
 *
 *   node mot-verb-p2.probe.mjs                 all sections, both engines
 *   ONLY=beats,prm node mot-verb-p2.probe.mjs  a subset
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { createRequire } from "node:module";
import process from "node:process";

const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const { chromium, webkit } = createRequire(FE + "/package.json")("playwright");

const WT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-64";
const SC = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad";
const PROTO_DIST = `${WT}/web/frontend/dist`;
const CTRL_DIST = `${SC}/control/web/frontend/dist`;
const OUT = process.env.OUT ?? `${SC}/readings`;
mkdirSync(OUT, { recursive: true });

const ONLY = (process.env.ONLY ?? "").split(",").filter(Boolean);
const want = (s) => ONLY.length === 0 || ONLY.includes(s);

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json", ".ico": "image/x-icon",
};

function serve(root, port) {
  return new Promise((res, rej) => {
    const srv = createServer((req, rq) => {
      const url = new URL(req.url, "http://x");
      let p = join(root, decodeURIComponent(url.pathname));
      if (!existsSync(p) || url.pathname === "/") p = join(root, "index.html");
      if (!existsSync(p)) p = join(root, "index.html");
      try {
        const body = readFileSync(p);
        rq.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream", "cache-control": "no-store" });
        rq.end(body);
      } catch {
        rq.writeHead(404);
        rq.end();
      }
    });
    srv.on("error", rej);
    srv.listen(port, "127.0.0.1", () => res({ srv, base: `http://127.0.0.1:${port}/` }));
  });
}

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true };
const DESK = { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 };

async function page(browser, opts, base, path = "") {
  const ctx = await browser.newContext(opts);
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  return { ctx, p };
}

// ── THE READINGS ─────────────────────────────────────────────────────────────────────

/** Rule 8, on the real surface: the toggle's computed beats while the gesture runs. */
const BEATS = `(() => {
  const ms = (s) => s.split(',').map((v) => Math.round(parseFloat(v) * (v.trim().endsWith('ms') ? 1 : 1000)));
  const read = (el, prop) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const props = cs.transitionProperty.split(',').map((s) => s.trim());
    const durs = ms(cs.transitionDuration), dels = ms(cs.transitionDelay);
    const i = props.indexOf(prop);
    if (i < 0) return { missing: prop, props: cs.transitionProperty, duration: durs[0], delay: dels[0] };
    return { duration: durs[i % durs.length], delay: dels[i % dels.length] };
  };
  const icons = [...document.querySelectorAll('.toggle-icon')];
  const off = icons.find((e) => !e.classList.contains('is-active'));
  const on = icons.find((e) => e.classList.contains('is-active'));
  return {
    icons: icons.length,
    out:   read(off, 'opacity'),
    rise:  read(on, 'opacity'),
    wring: read(off ? off.querySelector('.warp') : null, 'transform'),
    bloom: read(on ? on.querySelector('.warp') : null, 'transform'),
    tuck:  read(off ? off.querySelector('.twinkle-star') : null, 'scale'),
    star1: read(on ? on.querySelector('.twinkle-star') : null, 'scale'),
    star2: read(on ? on.querySelector('.twinkle-star-2') : null, 'scale'),
    star3: read(on ? on.querySelector('.twinkle-star-3') : null, 'scale'),
  };
})()`;

/** The players well: the state needs a second player, so the rule is read off the CSSOM and
 *  then PROVEN on a live node wearing the component's own scope attribute. */
const WELL = `(() => {
  const rules = [];
  for (const sheet of document.styleSheets) {
    let rs; try { rs = sheet.cssRules; } catch { continue; }
    for (const r of rs) if (r.selectorText && /player-row\\.is-(arriving|returning|leaving)/.test(r.selectorText))
      rules.push({ selector: r.selectorText, animation: r.style.animation || r.style.animationName });
  }
  const host = document.querySelector('.controls-card') || document.querySelector('[class*="controls"]');
  const scope = host ? [...host.attributes].map((a) => a.name).find((n) => n.startsWith('data-v-')) : null;
  const live = {};
  if (scope && host) {
    for (const state of ['is-arriving', 'is-returning', 'is-leaving']) {
      const row = document.createElement('div');
      row.className = 'player-row ' + state;
      row.setAttribute(scope, '');
      const name = document.createElement('div');
      name.className = 'player-name';
      name.setAttribute(scope, '');
      row.appendChild(name);
      host.appendChild(row);
      const cs = getComputedStyle(row), cn = getComputedStyle(name);
      live[state] = {
        row: { name: cs.animationName, duration: Math.round(parseFloat(cs.animationDuration) * 1000), delay: Math.round(parseFloat(cs.animationDelay) * 1000) },
        playerName: { name: cn.animationName, duration: Math.round(parseFloat(cn.animationDuration) * 1000), delay: Math.round(parseFloat(cn.animationDelay) * 1000) },
      };
      row.remove();
    }
  }
  return { scope: scope || null, rules, live };
})()`;

/** P5, the twins: the chrome-leave and the deck-leave, and where each is at t=100ms. */
const TWINS = `(() => {
  const bez = (x1, y1, x2, y2) => (x) => {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    let t = x;
    for (let i = 0; i < 24; i++) {
      const xt = ((ax * t + bx) * t + cx) * t - x;
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(xt) < 1e-6 || d === 0) break;
      t -= xt / d;
    }
    return ((ay * t + by) * t + cy) * t;
  };
  const find = (re) => {
    const hit = (r) => r.selectorText && re.test(r.selectorText) && r.style && r.style.transition;
    for (const sheet of document.styleSheets) {
      let rs; try { rs = sheet.cssRules; } catch { continue; }
      for (const r of rs) {
        if (hit(r)) return { selector: r.selectorText, transition: r.style.transition };
        if (r.cssRules) for (const q of r.cssRules) if (hit(q)) return { selector: q.selectorText, transition: q.style.transition };
      }
    }
    return null;
  };
  const probe = document.createElement('div');
  document.body.appendChild(probe);
  const resolve = (row) => {
    if (!row) return null;
    probe.style.transition = row.transition;
    const cs = getComputedStyle(probe);
    const dur = parseFloat(cs.transitionDuration) * 1000;
    const tf = cs.transitionTimingFunction;
    const m = /cubic-bezier\\(([^)]+)\\)/.exec(tf);
    const pts = m ? m[1].split(',').map(Number) : null;
    const at100 = pts && dur ? 1 - bez(pts[0], pts[1], pts[2], pts[3])(Math.min(1, 100 / dur)) : null;
    return { selector: row.selector, transition: row.transition, duration: dur, timing: tf, opacityAt100ms: at100 };
  };
  const deck = resolve(find(/gallery-fade-leave-active/));
  const chrome = resolve(find(/scene-leaving .*scene-controls/));
  probe.remove();
  const ratio = deck && chrome && deck.opacityAt100ms != null && chrome.opacityAt100ms != null
    ? Math.max(deck.opacityAt100ms, chrome.opacityAt100ms) / Math.max(1e-9, Math.min(deck.opacityAt100ms, chrome.opacityAt100ms))
    : null;
  return { deck, chrome, ratio };
})()`;

/** PRM at the ladder: every rung zero at the root, three sites zero, two fallbacks alive. */
const PRM = `(() => {
  const root = getComputedStyle(document.documentElement);
  const rungs = {};
  for (const r of ['page', 'step', 'sheet', 'mark', 'breath', 'touch']) rungs['--rung-' + r] = root.getPropertyValue('--rung-' + r).trim();
  rungs['--verb-dusk-ms'] = root.getPropertyValue('--verb-dusk-ms').trim();
  const dur = (sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).transitionDuration : 'no element';
  };
  const fallbacks = [];
  for (const sheet of document.styleSheets) {
    let rs; try { rs = sheet.cssRules; } catch { continue; }
    const walk = (list) => { for (const r of list) { if (r.style && r.style.transition && /200ms ease|150ms linear/.test(r.style.transition)) fallbacks.push({ selector: r.selectorText, transition: r.style.transition }); if (r.cssRules) walk(r.cssRules); } };
    walk(rs);
  }
  return {
    rungs,
    sites: {
      'DrawerTab .drawer-tab-text': dur('.drawer-tab-text'),
      'SheetWashiLabel': dur('.sheet-washi-label, [class*="washi"]'),
      'CrayonHeart .face': dur('.face'),
    },
    fallbacks,
  };
})()`;

/** RUB OUT, live: the class goes on a real margin note and the animation is read off it. */
const RUBOUT = `(async () => {
  const ink = document.querySelector('.margin-note-ink');
  if (!ink) return { note: 'no margin note on this surface' };
  ink.classList.add('is-rubbing-out');
  const cs = getComputedStyle(ink);
  const shorthand = { name: cs.animationName, duration: cs.animationDuration, timing: cs.animationTimingFunction, fill: cs.animationFillMode };
  const frames = [];
  const t0 = performance.now();
  await new Promise((res) => {
    const step = () => {
      frames.push({ t: Math.round(performance.now() - t0), clip: getComputedStyle(ink).clipPath, opacity: getComputedStyle(ink).opacity, boxes: ink.getClientRects().length });
      if (performance.now() - t0 < 260) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
  ink.classList.remove('is-rubbing-out');
  return { shorthand, frameCount: frames.length, first: frames[0], last: frames[frames.length - 1], boxes: [...new Set(frames.map((f) => f.boxes))] };
})()`;

/** π: the filter census on a bare load — the allowlist is 9, exactly. */
const FILTERS = `(() => {
  const used = new Set();
  for (const el of document.querySelectorAll('*')) {
    const f = getComputedStyle(el).filter;
    if (f && f !== 'none') for (const m of f.matchAll(/url\\(["']?#([^)"']+)/g)) used.add(m[1].replace(/["']/g, ''));
  }
  return { count: used.size, ids: [...used].sort() };
})()`;

/** The frame trace: fifteen gestures at 1x, every frame longer than 33ms named. */
const FRAMES_JS = `(async () => {
  const long = [];
  let last = performance.now();
  let stop = false;
  const tick = () => {
    const now = performance.now();
    if (now - last > 33) long.push(Math.round(now - last));
    last = now;
    if (!stop) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  for (let i = 0; i < 15; i++) {
    const el = document.querySelector('.sun-moon-toggle');
    if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 120));
  }
  await new Promise((r) => setTimeout(r, 400));
  stop = true;
  return { longFrames: long, count: long.length, worst: long.length ? Math.max(...long) : 0 };
})()`;

/** The dusk: six alternating flips, the painted background at each settle. */
const DUSK = `(async () => {
  const seq = [];
  const long = [];
  let last = performance.now();
  let stop = false;
  const tick = () => { const n = performance.now(); if (n - last > 33) long.push(Math.round(n - last)); last = n; if (!stop) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  for (let i = 0; i < 6; i++) {
    const el = document.querySelector('.sun-moon-toggle');
    if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 600));
    seq.push(getComputedStyle(document.body).backgroundColor);
  }
  stop = true;
  return { sequence: seq, duskMs: getComputedStyle(document.documentElement).getPropertyValue('--verb-dusk-ms').trim(), longFrames: long };
})()`;

async function readAll(browser, base, label, engine) {
  const out = { label, engine };
  {
    const { ctx, p } = await page(browser, DESK, base);
    if (want("beats")) {
      await p.click(".sun-moon-toggle", { timeout: 4000 }).catch(() => {});
      await p.waitForTimeout(40);
      out.beats = await p.evaluate(BEATS);
    }
    if (want("well")) out.well = await p.evaluate(WELL);
    if (want("twins")) out.twins = await p.evaluate(TWINS);
    if (want("filters")) out.filters = await p.evaluate(FILTERS);
    if (want("rubout")) out.rubout = await p.evaluate(RUBOUT);
    if (want("frames")) out.frames = await p.evaluate(FRAMES_JS);
    if (want("dusk")) out.dusk = await p.evaluate(DUSK);
    await ctx.close();
  }
  if (want("phone")) {
    const { ctx, p } = await page(browser, PHONE, base);
    await p.click(".sun-moon-toggle", { timeout: 4000 }).catch(() => {});
    await p.waitForTimeout(40);
    out.beatsPhone = await p.evaluate(BEATS);
    out.filtersPhone = await p.evaluate(FILTERS);
    await ctx.close();
  }
  if (want("prm")) {
    const ctx = await browser.newContext({ ...DESK, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(base, { waitUntil: "networkidle" });
    await p.waitForTimeout(300);
    out.prm = await p.evaluate(PRM);
    await ctx.close();
  }
  if (want("dark")) {
    const ctx = await browser.newContext({ ...DESK, colorScheme: "dark" });
    const p = await ctx.newPage();
    await p.goto(base, { waitUntil: "networkidle" });
    await p.waitForTimeout(300);
    await p.click(".sun-moon-toggle", { timeout: 4000 }).catch(() => {});
    await p.waitForTimeout(40);
    out.beatsDark = await p.evaluate(BEATS);
    out.rubOutDark = await p.evaluate(RUBOUT);
    await ctx.close();
  }
  return out;
}

const proto = await serve(PROTO_DIST, Number(process.env.PORT_A ?? 4247));
const ctrl = await serve(CTRL_DIST, Number(process.env.PORT_B ?? 4248));
console.log(`prototype ${proto.base}  ·  control ${ctrl.base}`);

const readings = [];
for (const [name, launch] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await launch.launch();
  readings.push(await readAll(browser, proto.base, "prototype", name));
  readings.push(await readAll(browser, ctrl.base, "control", name));
  await browser.close();
  console.log(`${name} done`);
}
writeFileSync(join(OUT, "p2-readings.json"), JSON.stringify(readings, null, 2));
proto.srv.close();
ctrl.srv.close();
console.log(`banked ${readings.length} readings to ${join(OUT, "p2-readings.json")}`);
process.exit(0);
