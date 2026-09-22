#!/usr/bin/env node
/** ACC-SIX pass-4 — THE COUNT IN PLACE, THE RESERVE'S PRICE, AND W2's BAND.
 *
 * Four questions, one run per engine, on the served dist:
 *
 *  1. IN PLACE (critique §2.1). A MutationObserver on `.board-margin` plus NODE IDENTITY on
 *     `.margin-note-meta` across writes 1→2→3, and an `animationstart` listener for
 *     `ink-write-in` on the strip. Pass = one node for the count's whole life, one write-in.
 *     The NEGATIVE CONTROL runs in the same page: `:key` cannot be re-added from outside, so
 *     the control replaces the node by hand (`replaceWith(cloneNode)`) and shows the same
 *     instruments catching it — an observer that cannot see a re-mount is not an instrument.
 *  2. THE RESERVE'S PRICE (critique §2.6) at 1280×800, 393×699 (dpr 3, hasTouch) and
 *     844×390 (W2 §2.2's landscape cell, hasTouch): strip height, board bottom, toolbar top,
 *     and the `2lh` reserve read against the meta line's own rung.
 *  3. W2's MECHANICS in the shared band (critique §2.6): the tongue's berth, the bottom tab's
 *     reachability and the `--tap-floor` token, asserted at both coarse cells with the
 *     coarse regime WITNESSED (`matchMedia('(pointer: coarse)')` on the page).
 *  4. THE 16×16 WRAP ARM (charter 6): the count at 16×16 inside the 258 px the tongue leaves
 *     — `scrollWidth` vs `clientWidth` and the line box count, measured, not pinned.
 *
 * usage: BASE=http://127.0.0.1:4237 node p4-geom.mjs <out.json>
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const LABEL = process.env.LABEL || "prototype";
const ONLY = process.env.ONLY || "";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: BASE=… node p4-geom.mjs <out.json>");

const CELLS = [
  { name: "desk-1280x800", viewport: { width: 1280, height: 800 }, dpr: 1, touch: false },
  { name: "phone-393x699", viewport: { width: 393, height: 699 }, dpr: 3, touch: true },
  { name: "landscape-844x390", viewport: { width: 844, height: 390 }, dpr: 3, touch: true },
];

const INSTRUMENT = () => {
  const w = window;
  w.__acc6 = { mutations: [], writeIns: 0, nodes: [] };
  const strip = document.querySelector(".board-margin");
  if (!strip) return false;
  new MutationObserver((recs) => {
    for (const r of recs) {
      for (const n of r.addedNodes)
        if (n.nodeType === 1 && n.classList.contains("margin-note-meta"))
          w.__acc6.mutations.push(`+${n.textContent.trim()}`);
      for (const n of r.removedNodes)
        if (n.nodeType === 1 && n.classList.contains("margin-note-meta"))
          w.__acc6.mutations.push(`-${n.textContent.trim()}`);
    }
  }).observe(strip, { childList: true, subtree: true });
  strip.addEventListener(
    "animationstart",
    (e) => {
      if (e.animationName === "ink-write-in" && e.target.classList.contains("margin-note-meta"))
        w.__acc6.writeIns++;
    },
    true,
  );
  return true;
};

const SNAP = () =>
  window.__acc6
    ? (() => {
        const el = document.querySelector(".margin-note-meta");
        if (el && !window.__acc6.nodes.includes(el)) window.__acc6.nodes.push(el);
        return {
          text: el ? el.textContent.trim() : null,
          distinctNodes: window.__acc6.nodes.length,
          writeIns: window.__acc6.writeIns,
          mutations: [...window.__acc6.mutations],
        };
      })()
    : null;

async function typeOne(page) {
  const ok = await page.evaluate(() => {
    const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
      (i) => !i.readOnly && !i.value,
    );
    if (!ins[0]) return false;
    ins[0].focus();
    return true;
  });
  if (!ok) return false;
  await page.keyboard.type("5");
  await page.waitForTimeout(260);
  await page.evaluate(() => document.activeElement?.blur?.());
  return true;
}

const geom = () => {
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return {
      x: +b.x.toFixed(2),
      y: +b.y.toFixed(2),
      w: +b.width.toFixed(2),
      h: +b.height.toFixed(2),
      bottom: +b.bottom.toFixed(2),
    };
  };
  const q = (s) => document.querySelector(s);
  const strip = q(".board-margin");
  const meta = q(".margin-note-meta");
  const cs = strip && getComputedStyle(strip);
  const metaCs = meta && getComputedStyle(meta);
  const root = getComputedStyle(document.documentElement);
  const tongue = q(".drawer-tab") || q(".dock-tab") || q(".sheet-tongue");
  return {
    coarse: matchMedia("(pointer: coarse)").matches,
    anyPointerCoarse: matchMedia("(any-pointer: coarse)").matches,
    strip: r(strip),
    stripMinHeight: cs?.minHeight ?? null,
    stripMarginRight: cs?.marginRight ?? null,
    stripPosition: cs?.position ?? null,
    meta: r(meta),
    metaLineHeight: metaCs?.lineHeight ?? null,
    metaFontSize: metaCs?.fontSize ?? null,
    metaScrollW: meta ? meta.scrollWidth : null,
    metaClientW: meta ? meta.clientWidth : null,
    metaLineBoxes: meta ? Math.round(meta.getClientRects().length) : null,
    metaWraps: meta
      ? meta.scrollHeight > parseFloat(metaCs.lineHeight) * 1.5 || meta.scrollWidth > meta.clientWidth
      : null,
    board: r(q("svg.hand-drawn-grid")),
    boardWrapper: r(q(".board-wrapper")),
    toolbar: r(q(".fold-tools") || q(".controls-card") || q(".play-controls")),
    tongue: r(tongue),
    tongueClass: tongue ? tongue.className : null,
    tapFloor: root.getPropertyValue("--tap-floor").trim() || null,
    bottomTab: (() => {
      const t = q(".drawer-tab") || q(".dock-tab");
      if (!t) return null;
      const b = t.getBoundingClientRect();
      const hit = document.elementFromPoint(
        Math.min(innerWidth - 1, Math.max(0, b.x + b.width / 2)),
        Math.min(innerHeight - 1, Math.max(0, b.y + b.height / 2)),
      );
      return {
        rect: r(t),
        minH: getComputedStyle(t).minHeight,
        inViewport: b.bottom <= innerHeight + 0.5 && b.top >= -0.5,
        hitIsSelfOrChild: !!hit && (hit === t || t.contains(hit) || hit.contains(t)),
        hitTag: hit ? hit.tagName + "." + (hit.className || "").toString().split(" ")[0] : null,
      };
    })(),
  };
};

const rows = { meta: { base: BASE, label: LABEL, control: "74a2b5d9" }, cells: {} };

for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  if (ONLY && ONLY !== eng) continue;
  const browser = await launcher.launch();
  for (const C of CELLS) {
    const key = `${eng}/${C.name}`;
    const R = (rows.cells[key] = {});
    const ctx = await browser.newContext({
      viewport: C.viewport,
      deviceScaleFactor: C.dpr,
      hasTouch: C.touch,
      isMobile: false,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1200);

    R.at0 = await page.evaluate(geom);
    R.instrumented = await page.evaluate(INSTRUMENT);

    R.writes = [];
    for (let k = 1; k <= 3; k++) {
      if (!(await typeOne(page))) break;
      await page.waitForTimeout(340);
      R.writes.push({ n: k, ...(await page.evaluate(SNAP)), geom: await page.evaluate(geom) });
    }
    // The negative control, in the same run: replace the node by hand and show the
    // instruments catching it. (A re-mount is exactly what `:key="meta"` used to do.)
    R.negativeControl = await page.evaluate(() => {
      const el = document.querySelector(".margin-note-meta");
      if (!el) return { ran: false };
      const clone = el.cloneNode(true);
      el.replaceWith(clone);
      return { ran: true };
    });
    await page.waitForTimeout(120);
    R.afterControl = await page.evaluate(SNAP);

    await page.waitForTimeout(900);
    R.afterLift = await page.evaluate(SNAP);
    R.atLift = await page.evaluate(geom);

    // ── THE 16×16 WRAP ARM, on the same cell ─────────────────────────────────────────────
    if (C.name !== "desk-1280x800") {
      await page.goto(`${BASE}/?size=4&difficulty=EASY`);
      await page.waitForSelector(".sudoku-cell", { timeout: 90000 });
      await page.waitForTimeout(1500);
      await page.evaluate(INSTRUMENT);
      await typeOne(page);
      await page.waitForTimeout(400);
      R.wrap16 = { ...(await page.evaluate(SNAP)), geom: await page.evaluate(geom) };
    }

    await ctx.close();
    console.error(`  done ${key}`);
  }
  await browser.close();
}

writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);
