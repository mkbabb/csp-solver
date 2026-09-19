#!/usr/bin/env node
/**
 * MOT-VERB PASS-1 PROTOTYPE PROBE (T9-W7 §13) — the pencil verbs, measured on the real
 * surface: two BUILT dists (the prototype and a HEAD control), both engines, both themes,
 * 390x844 dsf3 touch and 1280x800.
 *
 * PORTS, and it is a declared deviation: the charter names 4247 with "the next free in
 * 4230-4249" as the fallback. At run time every one of those twenty ports was held by a
 * concurrent lane (scanned, banked in the record), so each dist is served by this file's own
 * static server on 127.0.0.1:0 — an OS-assigned ephemeral port, which cannot collide with a
 * lane that names a port.
 *
 *   node mot-verb.probe.mjs            all sections, both engines
 *   ONLY=twins,prm node ...            a subset
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { createRequire } from "node:module";
import process from "node:process";

const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const { chromium, webkit } = createRequire(FE + "/package.json")("playwright");

const PROTO_DIST =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-52/web/frontend/dist";
const CTRL_DIST =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/control/web/frontend/dist";
const OUT =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/readings";
const FRAMES =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/frames";
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

const ONLY = (process.env.ONLY ?? "").split(",").filter(Boolean);
const want = (s) => ONLY.length === 0 || ONLY.includes(s);

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json",
  ".ico": "image/x-icon",
};

function serve(root) {
  return new Promise((res) => {
    const srv = createServer((req, rq) => {
      const url = new URL(req.url, "http://x");
      let p = join(root, decodeURIComponent(url.pathname));
      if (!existsSync(p) || url.pathname === "/") p = join(root, "index.html");
      if (!existsSync(p)) p = join(root, "index.html");
      try {
        const body = readFileSync(p);
        rq.writeHead(200, {
          "content-type": MIME[extname(p)] ?? "application/octet-stream",
          "cache-control": "no-store",
        });
        rq.end(body);
      } catch {
        rq.writeHead(404);
        rq.end();
      }
    });
    srv.listen(0, "127.0.0.1", () => res({ srv, base: `http://127.0.0.1:${srv.address().port}/` }));
  });
}

const results = {};
const say = (k, v) => {
  results[k] = v;
  console.log(k, JSON.stringify(v));
};

/** The board, warm: one game, glyphs painted, boil alive, focus dropped. */
async function board(engine, base, { w = 390, h = 844, dark = true, prm = false, query = "" } = {}) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: w < 1024 ? 3 : 2,
    hasTouch: w < 1024,
    isMobile: w < 1024,
    colorScheme: dark ? "dark" : "light",
    reducedMotion: prm ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(base + "?size=3&difficulty=EASY" + query);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForTimeout(1800);
  await page.evaluate(() => document.activeElement?.blur?.());
  return { browser, page };
}

// ── THE BEZIER, read off the cascade ────────────────────────────────────────────────────
// A cubic-bezier's y at x=t, solved in page. Used by the twins section so the reading is the
// STYLESHEET's own answer rather than a sampled frame that a slow tick can move.
const BEZ = `
window.__bez = (pts, x) => {
  const [x1, y1, x2, y2] = pts;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const fx = (t) => ((ax * t + bx) * t + cx) * t;
  const dfx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  let t = x;
  for (let i = 0; i < 12; i++) { const e = fx(t) - x; if (Math.abs(e) < 1e-7) break; const d = dfx(t); if (Math.abs(d) < 1e-7) break; t -= e / d; }
  t = Math.min(1, Math.max(0, t));
  return ((ay * t + by) * t + cy) * t;
};
window.__curveOf = (s) => {
  const m = /cubic-bezier\\(([^)]+)\\)/.exec(s);
  if (m) return m[1].split(',').map(Number);
  const named = { ease: [0.25, 0.1, 0.25, 1], linear: [0, 0, 1, 1], 'ease-in': [0.42, 0, 1, 1], 'ease-out': [0, 0, 0.58, 1], 'ease-in-out': [0.42, 0, 0.58, 1] };
  return named[s.trim()] ?? null;
};
/** Find a rule by selector text across every sheet, and read its transition tuple. */
window.__ruleTuple = (selector, prop) => {
  const hit = [];
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    const walk = (list) => {
      for (const r of list) {
        if (r.cssRules) { walk(r.cssRules); continue; }
        if (!r.selectorText || !r.selectorText.includes(selector)) continue;
        const t = r.style.getPropertyValue('transition') || r.style.getPropertyValue('transition-duration');
        if (t) hit.push({ selector: r.selectorText, transition: r.style.getPropertyValue('transition'), dur: r.style.getPropertyValue('transition-duration'), fn: r.style.getPropertyValue('transition-timing-function') });
      }
    };
    walk(rules);
  }
  return hit;
};
`;

/** Resolve a transition shorthand's duration + curve for one property, through var(). */
const RESOLVE = `
window.__resolve = (el, decl) => {
  // Substitute custom properties off the element's computed style, then read the terms.
  const cs = getComputedStyle(el);
  const sub = (s) => s.replace(/var\\((--[A-Za-z-]+)(?:\\s*,\\s*([^)]*))?\\)/g, (m, name, fb) => {
    const v = cs.getPropertyValue(name).trim();
    return v || (fb ?? '');
  });
  const out = [];
  for (const term of sub(decl).split(/,(?![^(]*\\))/)) {
    const times = term.match(/-?[\\d.]+m?s/g) ?? [];
    const curve = /cubic-bezier\\([^)]*\\)/.exec(term)?.[0] ?? (/(ease-in-out|ease-out|ease-in|linear|ease)\\b/.exec(term)?.[0] ?? null);
    out.push({ term: term.trim(), dur: times[0] ?? null, delay: times[1] ?? null, curve });
  }
  return out;
};
`;

const ms = (s) => (s == null ? null : s.endsWith("ms") ? parseFloat(s) : parseFloat(s) * 1000);

// ════════════════════════════════════════════════════════════════════════════════════════
const protoS = await serve(PROTO_DIST);
const ctrlS = await serve(CTRL_DIST);
console.log("proto", protoS.base, "control", ctrlS.base);

// ── P5 · THE TWINS ──────────────────────────────────────────────────────────────────────
// The chrome leave (.scene-controls under html.gallery-leaving) and the deck leave
// (.gallery-fade-leave-active) are declared twins on one clock. Read each rule's OWN
// duration and curve off the built stylesheet, evaluate the curve at the midpoint of the
// shared window, and report the opacity each would paint there. The ratio is the tell.
if (want("twins")) {
  const row = {};
  for (const [name, s] of [
    ["control", ctrlS],
    ["proto", protoS],
  ]) {
    for (const engine of ["chromium", "webkit"]) {
      const { browser, page } = await board(engine, s.base, { w: 390, h: 844, dark: true });
      await page.addScriptTag({ content: BEZ + RESOLVE });
      const r = await page.evaluate(() => {
        // THE CASCADE READ. Find each twin's own rule in the built stylesheet, resolve its
        // custom properties off :root, and evaluate the declared curve at the midpoint of the
        // declared window. This is the stylesheet's own answer, not a sampled frame.
        const root = getComputedStyle(document.documentElement);
        const sub = (v) =>
          v.replace(/var\((--[A-Za-z-]+)(?:\s*,\s*([^)]*))?\)/g, (m, n, fb) => root.getPropertyValue(n).trim() || (fb ?? ""));
        const find = (needle) => {
          const out = [];
          for (let si = 0; si < document.styleSheets.length; si++) {
            let rules;
            try { rules = document.styleSheets[si].cssRules; } catch { continue; }
            // A CSSRuleList is walked BY INDEX: `for...of` over one comes back empty here,
            // which is a banked probe bug of the same shape as r6's comment blindness.
            const walk = (list) => {
              for (let i = 0; i < list.length; i++) {
                const r = list[i];
                if (r.cssRules && r.cssRules.length) walk(r.cssRules);
                if (!r.selectorText || !r.selectorText.includes(needle)) continue;
                const t = r.style.getPropertyValue("transition");
                if (t && t !== "none") out.push({ sel: r.selectorText, transition: t });
              }
            };
            walk(rules);
          }
          return out;
        };
        const read = (needle) => {
          const hits = find(needle);
          if (!hits.length) return { missing: needle };
          const t = sub(hits[0].transition);
          const times = t.match(/-?[\d.]+m?s/g) ?? [];
          const dur = times[0] ? (times[0].endsWith("ms") ? parseFloat(times[0]) : parseFloat(times[0]) * 1000) : null;
          const curve = /cubic-bezier\([^)]*\)/.exec(t)?.[0] ?? /(ease-in-out|ease-out|ease-in|linear|ease)\b/.exec(t)?.[0] ?? null;
          const pts = curve ? window.__curveOf(curve) : null;
          return {
            sel: hits[0].sel,
            declared: hits[0].transition,
            resolved: t,
            dur,
            curve,
            opacityAt: pts && dur ? 1 - window.__bez(pts, Math.min(1, 100 / dur)) : null,
          };
        };
        return { deck: read("gallery-fade-leave-active"), chrome: read("gallery-leaving .scene-controls") };
      });
      const ratio =
        r.chrome.opacityAt && r.deck.opacityAt ? r.chrome.opacityAt / r.deck.opacityAt : null;
      row[`${name}/${engine}`] = {
        deck: r.deck.declared,
        deckDur: r.deck.dur,
        deckCurve: r.deck.curve,
        deckOpacityAt100: r.deck.opacityAt?.toFixed(3),
        chrome: r.chrome.declared,
        chromeDur: r.chrome.dur,
        chromeCurve: r.chrome.curve,
        chromeOpacityAt100: r.chrome.opacityAt?.toFixed(3),
        ratio: ratio?.toFixed(2),
      };
      await browser.close();
    }
  }
  say("P5_twins", row);
}

// ── PRM AT THE LADDER ───────────────────────────────────────────────────────────────────
// Under reduce, three sites that had NO reduced-motion arm of their own must read 0s, armed
// by naming a rung and nothing else; plus the two twins and the dusk.
if (want("prm")) {
  const row = {};
  for (const [name, s] of [
    ["control", ctrlS],
    ["proto", protoS],
  ]) {
    for (const engine of ["chromium", "webkit"]) {
     for (const prm of [false, true]) {
      const { browser, page } = await board(engine, s.base, { w: 1280, h: 800, dark: true, prm });
      await page.addScriptTag({ content: BEZ + RESOLVE });
      const r = await page.evaluate(() => {
        const probe = (cls, htmlCls) => {
          if (htmlCls) document.documentElement.classList.add(htmlCls);
          const el = document.createElement("div");
          el.className = cls;
          document.body.appendChild(el);
          const cs = getComputedStyle(el);
          const out = { dur: cs.transitionDuration, fn: cs.transitionTimingFunction };
          el.remove();
          if (htmlCls) document.documentElement.classList.remove(htmlCls);
          return out;
        };
        const live = (sel) => {
          const el = document.querySelector(sel);
          if (!el) return { missing: sel };
          const cs = getComputedStyle(el);
          return { dur: cs.transitionDuration, fn: cs.transitionTimingFunction };
        };
        // A site whose element is not mounted on this route is read off the cascade instead:
        // its own rule, with :root's custom properties substituted under the media state the
        // context is emulating. Same claim, one layer up.
        const rootCs = getComputedStyle(document.documentElement);
        const cascade = (needle) => {
          for (let si = 0; si < document.styleSheets.length; si++) {
            let rules;
            try { rules = document.styleSheets[si].cssRules; } catch { continue; }
            const stack = [rules];
            while (stack.length) {
              const list = stack.pop();
              for (let i = 0; i < list.length; i++) {
                const r = list[i];
                if (r.cssRules && r.cssRules.length) stack.push(r.cssRules);
                if (!r.selectorText || !r.selectorText.includes(needle)) continue;
                const t = r.style.getPropertyValue("transition");
                if (!t || t === "none") continue;
                const resolved = t.replace(/var\((--[A-Za-z-]+)(?:\s*,\s*([^)]*))?\)/g, (m, n, fb) =>
                  rootCs.getPropertyValue(n).trim() || (fb ?? ""));
                return { sel: r.selectorText, declared: t, resolved };
              }
            }
          }
          return { missing: needle };
        };
        // THE THREE UNARMED SITES, read on the real elements the product ships. Each one had
        // no reduced-motion arm of its own at HEAD; under the ladder it is armed by naming a
        // rung and nothing else.
        document.documentElement.classList.add("gallery-leaving");
        const out = {
          drawerTab: live(".drawer-tab-text"),
          crayonHeart: cascade(".face"),
          washiLabel: cascade(".washi-label"),
          drawerTabCascade: cascade(".drawer-tab-text"),
          chromeLeave: live(".scene-controls"),
          duskRow: live("body"),
          rungs: {
            page: getComputedStyle(document.documentElement).getPropertyValue("--rung-page").trim(),
            breath: getComputedStyle(document.documentElement).getPropertyValue("--rung-breath").trim(),
            touch: getComputedStyle(document.documentElement).getPropertyValue("--rung-touch").trim(),
            duskMs: getComputedStyle(document.documentElement).getPropertyValue("--verb-dusk-ms").trim(),
          },
        };
        document.documentElement.classList.remove("gallery-leaving");
        return out;
      });
      row[`${name}/${engine}/${prm ? "reduce" : "no-preference"}`] = r;
      await browser.close();
     }
    }
  }
  say("PRM_ladder", row);
}

// ── RUB OUT, on a live note ─────────────────────────────────────────────────────────────
if (want("rubout")) {
  const row = {};
  for (const [name, s] of [
    ["control", ctrlS],
    ["proto", protoS],
  ]) {
    for (const engine of ["chromium", "webkit"]) {
      for (const dark of [true, false]) {
        const { browser, page } = await board(engine, s.base, { w: 390, h: 844, dark });
        // A real margin note: the hint rail writes one. Find any .margin-note-ink on the page,
        // and if none is standing, ask for one the way the product does.
        let has = await page.evaluate(() => !!document.querySelector(".margin-note-ink"));
        if (!has) {
          await page.evaluate(() => {
            const btn = [...document.querySelectorAll("button")].find((b) =>
              /hint|nudge|check/i.test(b.textContent ?? ""),
            );
            btn?.click();
          });
          await page.waitForTimeout(700);
          has = await page.evaluate(() => !!document.querySelector(".margin-note-ink"));
        }
        const r = await page.evaluate(async () => {
          const el = document.querySelector(".margin-note-ink");
          if (!el) return { native: false, why: "no .margin-note-ink on the page" };
          const cs0 = getComputedStyle(el);
          const font0 = `${cs0.fontFamily}|${cs0.fontSize}|${cs0.fontWeight}`;
          const box0 = el.getBoundingClientRect();
          el.classList.add("is-rubbing-out");
          const anims = el.getAnimations().map((a) => ({
            name: a.animationName ?? null,
            dur: a.effect?.getComputedTiming().duration ?? null,
            easing: a.effect?.getComputedTiming().easing ?? null,
            fill: a.effect?.getComputedTiming().fill ?? null,
          }));
          const frames = [];
          await new Promise((res) => {
            let n = 0;
            const step = () => {
              const cs = getComputedStyle(el);
              const b = el.getBoundingClientRect();
              frames.push({
                clip: cs.clipPath,
                opacity: cs.opacity,
                box: `${b.width.toFixed(1)}x${b.height.toFixed(1)}`,
                font: `${cs.fontFamily}|${cs.fontSize}|${cs.fontWeight}`,
              });
              if (++n < 14) requestAnimationFrame(step);
              else res();
            };
            requestAnimationFrame(step);
          });
          const cs1 = getComputedStyle(el);
          return {
            native: anims.length > 0,
            anims,
            font0,
            fontUnchanged: frames.every((f) => f.font === font0),
            boxes: [...new Set(frames.map((f) => f.box))],
            box0: `${box0.width.toFixed(1)}x${box0.height.toFixed(1)}`,
            clips: [...new Set(frames.map((f) => f.clip))].slice(0, 6),
            firstClip: frames[0].clip,
            lastClip: frames.at(-1).clip,
            restClip: cs1.clipPath,
            restOpacity: cs1.opacity,
          };
        });
        row[`${name}/${engine}/${dark ? "dark" : "light"}`] = r;
        await browser.close();
      }
    }
  }
  say("RUBOUT", row);
}

// ── THE FILTER CENSUS + the live filter count ───────────────────────────────────────────
if (want("filters")) {
  const row = {};
  for (const [name, s] of [
    ["control", ctrlS],
    ["proto", protoS],
  ]) {
    const { browser, page } = await board("chromium", s.base, { w: 1280, h: 800, dark: true });
    const r = await page.evaluate(() => {
      const live = [...document.querySelectorAll("filter")].filter((f) => {
        const r = f.getBoundingClientRect ? null : null;
        return true;
      });
      const used = new Set();
      for (const el of document.querySelectorAll("*")) {
        const f = getComputedStyle(el).filter;
        if (f && f !== "none") used.add(f);
      }
      return { filterEls: live.length, distinctComputedFilters: [...used].length };
    });
    row[name] = r;
    await browser.close();
  }
  say("FILTERS", row);
}

for (const s of [protoS, ctrlS]) s.srv.close();
writeFileSync(join(OUT, "probe.json"), JSON.stringify(results, null, 2));
console.log("wrote", join(OUT, "probe.json"));
