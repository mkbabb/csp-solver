#!/usr/bin/env node
/**
 * NOTE-LEDGER pass-3 RESEARCH — the numbers the pass-3 spec has to be written against, read
 * off the NEW BASE (main at 74a2b5d9), both engines. READ-ONLY on the product: it drives the
 * HEAD server on :4249 and writes nothing but JSON into this lane's own dir.
 *
 *   P1  THE BERTH, re-derived (critic row 4 / charter row 13). The strip's foot, the NEAREST
 *       PAINTED BOX below it with its identity and whether it is INTERACTIVE, the gap, and
 *       what one caption line box would cost — measured, not assumed, on four phone rigs.
 *   P2  LANDSCAPE 844x390 + 900x500 under chair §6.2 (the card is reached through the tab).
 *   P3  THE DESK BERTH (critic row 6 / L14's zero-width hole): the block's width, the tally's
 *       real width with DEBUG on, the caption tier's `1ch`, and the longest record's ink at
 *       the caption tier — the four numbers a minimum-readable-width assertion needs.
 *   P4  THE RANSOM NOTE, LIVE (charter row 14): the estate's own `font-census` algorithm run
 *       over the strip with a hint ARMED, on a 9x9. The margin is outside that census's CELLS,
 *       so no gate has ever read this surface.
 *   P5  the leave-class audit (NOTE-ERASE's graft): every `data-*` on the ink node + the PRM
 *       reading on `.margin-note-ink`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4249";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/research/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n, d) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));
const r2 = (n) => (typeof n === "number" ? Math.round(n * 10000) / 10000 : n);

const PHONES = [
  { id: "360x740 coarse", w: 360, h: 740, dsf: 3, mobile: true },
  { id: "390x844", w: 390, h: 844, dsf: 2, mobile: true },
  { id: "393x699", w: 393, h: 699, dsf: 2, mobile: true },
  { id: "390x664", w: 390, h: 664, dsf: 2, mobile: true },
];
const LAND = [
  { id: "844x390", w: 844, h: 390, dsf: 2, mobile: true },
  { id: "900x500", w: 900, h: 500, dsf: 2, mobile: true },
];
const DESK = [
  { id: "1024x768", w: 1024, h: 768, dsf: 1, mobile: false },
  { id: "1280x800", w: 1280, h: 800, dsf: 1, mobile: false },
];

async function open(browser, name, rig, debug = false) {
  const ctx = await browser.newContext({
    viewport: { width: rig.w, height: rig.h },
    deviceScaleFactor: rig.dsf,
    isMobile: rig.mobile && name === "chromium",
    hasTouch: !!rig.mobile,
  });
  if (debug)
    await ctx.addInitScript(() =>
      localStorage.setItem("sudoku-debug", "true"),
    );
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
  return { ctx, page };
}

/** Arm the hint on the nth empty cell; returns the margin text. */
async function armHint(page, nth = 0) {
  await page.evaluate((n) => {
    const inputs = [...document.querySelectorAll(".board-cells input")];
    const open = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
    open[n % Math.max(1, open.length)]?.focus();
  }, nth);
  await page.keyboard.press("h");
  await page.waitForTimeout(650);
  return page.evaluate(
    () => document.querySelector(".margin-note")?.textContent?.trim() ?? "",
  );
}

/** The strip, the first painted box under it, and what a second caption line costs. */
const BERTH = () => {
  const px = (v) => parseFloat(v) || 0;
  const block = document.querySelector(".margin-note-block");
  const strip = document.querySelector(".board-margin");
  const voice = document.querySelector(".margin-note");
  const board = document.querySelector('[role="grid"]');
  const tools = document.getElementById("fold-tools");
  const br = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, bottom: r.bottom };
  };
  const foot = block ? block.getBoundingClientRect().bottom : null;
  // every painted box that starts at or below the strip's foot, nearest first
  const below = [];
  if (foot != null)
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) continue;
      if (r.top < foot - 0.5) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0")
        continue;
      const interactive =
        el.matches("input,button,a,select,textarea,[role=button],[tabindex]") ||
        !!el.querySelector("input,button,a,select,textarea,[role=button]");
      below.push({
        sel:
          el.tagName.toLowerCase() +
          (el.id ? `#${el.id}` : "") +
          (typeof el.className === "string" && el.className
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : ""),
        top: r.top,
        gap: r.top - foot,
        interactive,
        mt: px(cs.marginTop),
        pt: px(cs.paddingTop),
      });
    }
  below.sort((a, b) => a.top - b.top);
  // what one caption line costs, measured with the tally's own five declarations
  let captionLine = null,
    capCh = null;
  if (block) {
    const p = document.createElement("p");
    p.style.cssText =
      "margin:0;width:fit-content;font-family:var(--font-hand);letter-spacing:var(--type-tracking-wide);font-size:var(--type-caption);line-height:var(--type-leading-caption);white-space:nowrap";
    p.textContent = "D goes nowhere else in this column";
    block.appendChild(p);
    const r = p.getBoundingClientRect();
    captionLine = { h: r.height, inkW: r.width, fs: getComputedStyle(p).fontSize };
    p.textContent = "0";
    capCh = p.getBoundingClientRect().width;
    p.remove();
  }
  return {
    block: br(block),
    strip: br(strip),
    voice: br(voice),
    board: br(board),
    foldTools: br(tools),
    foldToolsCS: tools
      ? {
          mt: px(getComputedStyle(tools).marginTop),
          pt: px(getComputedStyle(tools).paddingTop),
          display: getComputedStyle(tools).display,
        }
      : null,
    stripCS: strip
      ? {
          mt: px(getComputedStyle(strip).marginTop),
          mr: px(getComputedStyle(strip).marginRight),
          gap: px(getComputedStyle(strip).gap),
          position: getComputedStyle(strip).position,
        }
      : null,
    blockCS: block
      ? {
          minHeight: getComputedStyle(block).minHeight,
          flexWrap: getComputedStyle(block).flexWrap,
          columnGap: getComputedStyle(block).columnGap,
        }
      : null,
    nearestBelow: below.slice(0, 4),
    captionLine,
    capCh,
    scrollHeight: document.documentElement.scrollHeight,
    innerH: window.innerHeight,
    tally: (() => {
      const m = document.querySelector(".margin-note-meta");
      if (!m) return null;
      const r = m.getBoundingClientRect();
      return { text: m.textContent.trim(), w: r.width, h: r.height };
    })(),
  };
};

/** The estate's own font census (e2e/font-census.spec.ts MIXED_FACE), scoped to the strip. */
const MIXED_IN_STRIP = () => {
  const ranges = {};
  for (const sheet of [...document.styleSheets]) {
    let rules;
    try {
      rules = [...sheet.cssRules];
    } catch {
      continue;
    }
    for (const r of rules) {
      const f = r;
      if (!f.style || !f.style.getPropertyValue("unicode-range")) continue;
      const fam = f.style.getPropertyValue("font-family").replace(/["']/g, "").trim();
      const set = new Set();
      for (const m of f.style
        .getPropertyValue("unicode-range")
        .matchAll(/U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?/g)) {
        const a = parseInt(m[1], 16);
        const b = m[2] ? parseInt(m[2], 16) : a;
        for (let c = a; c <= b; c++) set.add(c);
      }
      if (set.size) ranges[fam] = set;
    }
  }
  const out = [];
  const strip = document.querySelector(".board-margin");
  if (!strip) return { faces: Object.keys(ranges), mixed: out };
  const walker = document.createTreeWalker(strip, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const text = n.nodeValue;
    if (!text || !text.trim()) continue;
    const el = n.parentElement;
    if (!el) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 3 || box.height < 3) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
    const set = ranges[fam];
    if (!set) continue;
    const missing = [...new Set([...text.trim()])].filter(
      (ch) => ch !== " " && !set.has(ch.codePointAt(0)),
    );
    if (missing.length)
      out.push({
        face: fam,
        shown: text.trim(),
        missing: missing.map(
          (c) => "U+" + c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0"),
        ),
        sel:
          el.tagName.toLowerCase() +
          (typeof el.className === "string" && el.className
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : ""),
      });
  }
  return { faces: Object.keys(ranges).sort(), mixed: out };
};

async function run(name, launcher) {
  const browser = await launcher.launch();
  const res = { engine: name, base: BASE, control: "74a2b5d9", P1: [], P2: [], P3: [], P4: null, P5: null };

  for (const rig of PHONES) {
    const { ctx, page } = await open(browser, name, rig);
    const text = await armHint(page);
    const b = await page.evaluate(BERTH);
    res.P1.push({ rig: rig.id, note: text, ...b });
    await ctx.close();
  }
  for (const rig of LAND) {
    const { ctx, page } = await open(browser, name, rig);
    const text = await armHint(page);
    const b = await page.evaluate(BERTH);
    const tab = await page.evaluate(() => {
      const t = document.querySelector(".drawer-tab, [class*='drawer-tab']");
      if (!t) return null;
      const r = t.getBoundingClientRect();
      return { sel: t.className, x: r.x, y: r.y, w: r.width, h: r.height };
    });
    res.P2.push({ rig: rig.id, note: text, tab, ...b });
    await ctx.close();
  }
  for (const rig of DESK) {
    const { ctx, page } = await open(browser, name, rig, true); // DEBUG on: the tally mounts
    const text = await armHint(page);
    // a solve, so the tally has real numbers
    const b = await page.evaluate(BERTH);
    res.P3.push({ rig: rig.id, note: text, ...b });
    await ctx.close();
  }
  // P4 — the ransom note, live, on a 9x9 with a hint armed; hunt a box-axis hidden single
  {
    const { ctx, page } = await open(browser, name, PHONES[1]);
    const seen = [];
    for (let i = 0; i < 14; i++) {
      const t = await armHint(page, i);
      const m = await page.evaluate(MIXED_IN_STRIP);
      seen.push({ nth: i, note: t, mixed: m.mixed });
      if (/ box$/.test(t)) break;
    }
    res.P4 = { faces: (await page.evaluate(MIXED_IN_STRIP)).faces, runs: seen };
    await ctx.close();
  }
  // P5 — the leave-class audit + PRM
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      hasTouch: true,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
    await page.waitForTimeout(1200);
    await armHint(page);
    res.P5 = await page.evaluate(() => {
      const ink = document.querySelector(".margin-note-ink");
      const note = document.querySelector(".margin-note");
      const cs = ink ? getComputedStyle(ink) : null;
      return {
        prm: matchMedia("(prefers-reduced-motion: reduce)").matches,
        inkAttrs: ink ? [...ink.attributes].map((a) => a.name) : null,
        noteAttrs: note ? [...note.attributes].map((a) => a.name) : null,
        inkAnim: cs
          ? { name: cs.animationName, dur: cs.animationDuration, fill: cs.animationFillMode }
          : null,
        userSelect: note ? getComputedStyle(note).userSelect : null,
        pointerEvents: note ? getComputedStyle(note).pointerEvents : null,
        roles: [...document.querySelectorAll(".board-margin [role]")].map(
          (e) => `${e.tagName.toLowerCase()}[role=${e.getAttribute("role")}]`,
        ),
      };
    });
    await ctx.close();
  }
  await browser.close();
  // round
  const round = (o) =>
    JSON.parse(
      JSON.stringify(o, (k, v) => (typeof v === "number" ? r2(v) : v)),
    );
  bank(`r1-${name}.json`, round(res));
  return round(res);
}

const which = process.argv[2] || "both";
if (which === "chromium" || which === "both") await run("chromium", chromium);
if (which === "webkit" || which === "both") await run("webkit", webkit);
console.log("DONE");
