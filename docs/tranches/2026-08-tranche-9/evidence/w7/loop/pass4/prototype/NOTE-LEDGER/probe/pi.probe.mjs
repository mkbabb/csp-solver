/**
 * NOTE-LEDGER · pass-4 probe 2 — π AGAINST THE NAMED CONTROL, ON A PINNED DEAL.
 *
 * Copied from pass-3's `pi.probe.mjs` and re-cut on two of the chair's rulings:
 *   · registry §2.13 — a π instrument reads computed PAINT properties AND tag names, not rects
 *     alone (TAPE's critic found two deltas a rect census could not see, one on a 0×0 element);
 *   · the same deal on both arms (`?board=`), which pass 3 could not do and banked as a caveat.
 *
 * The seed is taken from the CONTROL's own share act, so the pinned board is the control's and
 * the prototype is the one asked to reproduce it.
 *
 * Control: 74a2b5d9 on :4248 (`w7-control`, dist `index-CubiZsMVSwTc.js`). Prototype: :4249.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const PROTO = "http://127.0.0.1:4249/";
const CTRL = "http://127.0.0.1:4248/";
const r3 = (x) => Math.round(x * 1000) / 1000;

/** The chrome this wave does NOT claim. Line two and its block are the family's own surface
 *  and are excluded by name; everything else here must be identical, paint and tag. */
const KEYS = [
  "[role=grid]",
  ".board-margin",
  ".margin-note",
  "#fold-tools",
  ".app-layout",
  "#controls-drawer",
  ".masthead",
  ".board-card",
  ".play-controls",
];
const PAINT = [
  "display",
  "position",
  "fontFamily",
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "color",
  "backgroundColor",
  "opacity",
  "filter",
  "transform",
  "zIndex",
  "overflowX",
  "overflowY",
];

const census = (keys, paint) =>
  keys.map((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { sel, present: false };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const p = {};
    for (const k of paint) p[k] = cs[k];
    return {
      sel,
      present: true,
      tag: el.tagName,
      x: r.x,
      y: r.y,
      w: r.width,
      h: r.height,
      paint: p,
    };
  });

async function read(browser, url, board, rig, scheme) {
  const ctx = await browser.newContext({
    viewport: { width: rig[0], height: rig[1] },
    deviceScaleFactor: rig[0] < 500 ? 3 : 2,
    hasTouch: rig[0] < 500,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: "no-preference" });
  await page.goto(url + (board ? `?size=3&difficulty=EASY&board=${board}` : "?size=3&difficulty=EASY"));
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
  const out = {
    keys: await page.evaluate(([k, p]) => window.__census(k, p), [KEYS, PAINT]).catch(async () =>
      page.evaluate(
        ([k, p, src]) => new Function("keys", "paint", `return (${src})(keys, paint)`)(k, p),
        [KEYS, PAINT, census.toString()],
      ),
    ),
    scrollHeight: await page.evaluate(() => document.documentElement.scrollHeight),
    filters: await page.evaluate(() => {
      const all = [...document.querySelectorAll("*")];
      const f = all.filter((e) => {
        const v = getComputedStyle(e).filter;
        return v && v !== "none";
      });
      return {
        computed: f.length,
        url: f.filter((e) => getComputedStyle(e).filter.includes("url(")).length,
      };
    }),
  };
  await ctx.close();
  return out;
}

async function seed(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(CTRL + "?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1500);
  // The share act is the ONLY writer of `?board=`; the clipboard may reject in this context and
  // that is fine — `replaceState` has already landed by then.
  await page
    .evaluate(() => {
      const btn = [...document.querySelectorAll("button.icon-btn")].find((b) =>
        /share/i.test(b.getAttribute("aria-label") ?? ""),
      );
      btn?.click();
    })
    .catch(() => {});
  await page.waitForTimeout(1200);
  const board = await page.evaluate(
    () => new URLSearchParams(location.search).get("board") ?? "",
  );
  await ctx.close();
  return board;
}

const results = { rigs: [], board: null };
for (const engine of ["chromium", "webkit"]) {
  const browser = await pw[engine].launch();
  const board = await seed(browser);
  results.board = board;
  for (const rig of [
    [390, 844],
    [1280, 800],
  ]) {
    for (const scheme of ["light", "dark"]) {
      const a = await read(browser, PROTO, board, rig, scheme);
      const b = await read(browser, CTRL, board, rig, scheme);
      const deltas = [];
      for (let i = 0; i < a.keys.length; i++) {
        const p = a.keys[i];
        const c = b.keys[i];
        if (p.present !== c.present) {
          deltas.push({ sel: p.sel, kind: "presence", proto: p.present, ctrl: c.present });
          continue;
        }
        if (!p.present) continue;
        if (p.tag !== c.tag) deltas.push({ sel: p.sel, kind: "tag", proto: p.tag, ctrl: c.tag });
        for (const k of ["x", "y", "w", "h"]) {
          const d = Math.abs(p[k] - c[k]);
          if (d > 0.01) deltas.push({ sel: p.sel, kind: k, delta: r3(d) });
        }
        for (const k of PAINT)
          if (p.paint[k] !== c.paint[k])
            deltas.push({ sel: p.sel, kind: `paint.${k}`, proto: p.paint[k], ctrl: c.paint[k] });
      }
      results.rigs.push({
        engine,
        rig: `${rig[0]}x${rig[1]}`,
        scheme,
        boardPinned: !!board,
        scrollHeight: { proto: a.scrollHeight, ctrl: b.scrollHeight },
        filters: { proto: a.filters, ctrl: b.filters },
        deltaCount: deltas.length,
        deltas: deltas.slice(0, 30),
      });
      console.log(
        `${engine} ${rig[0]}x${rig[1]} ${scheme} pinned=${!!board} deltas=${deltas.length} ` +
          `scrollH ${a.scrollHeight}/${b.scrollHeight} filters ${a.filters.computed}/${b.filters.computed} ` +
          `url ${a.filters.url}/${b.filters.url}` +
          (deltas.length ? ` → ${JSON.stringify(deltas.slice(0, 4))}` : ""),
      );
    }
  }
  await browser.close();
}
writeFileSync(join(OUT, "pi.json"), JSON.stringify(results, null, 2));
