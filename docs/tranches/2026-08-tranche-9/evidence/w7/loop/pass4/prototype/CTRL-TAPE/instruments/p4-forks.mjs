/**
 * T9-W7 pass 4 · CTRL-TAPE — THE TWO TESTS THAT DECIDE A FORK (charter §"The tests").
 *
 * TEST 1 · THE VOICE TEST (FACE vs TAPE). Set the card's tape at CTRL-FACE's printed rung
 *   (`--face-printed`, 25.888px) — which is what `--type-name` already resolves to — and then
 *   at the rungs either side of it, and re-read the seal, the crossing and §2.5's closed form
 *   at every cell in both engines. The question the fork asks is whether ONE voice at the
 *   printed rung survives the card's own geometry, so the sweep is over the RUNG and the
 *   answers are the three numbers that break first.
 *
 * TEST 2 · THE PIN-BAND TEST (the COST merge watch). On this tree `--pin-band` is ALREADY
 *   COST's derived calc (`scene.css`: `0.6rem + --washi-tag-h`, no JS). What IS published is
 *   `--card-pad-t`, a ResizeObserver SAMPLE of the card's computed `padding-top` — which is
 *   `var(--pin-band)` and nothing else. So the test this tree can actually run is the one the
 *   merge watch means: kill the sampler and point its three readers straight at the derived
 *   band. The probe does it in page — `--card-pad-t: var(--pin-band)` written on the card,
 *   which is exactly what the source change would compute — and re-reads §2.5's closed form
 *   at every cell, both engines. If it holds, the sampler dies and COST's centre is a graft.
 *
 *   node p4-forks.mjs <out.json> <baseURL>
 */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:4230";

const INTERACTIVE =
  'button, [role="tab"], [role="button"], a[href], input, select, textarea, [tabindex="0"]';

/** §2.5's closed form, read: worst pinned-tape bottom against the exempt line, and any overlap. */
const PIN = (sel) => {
  const card = document.querySelector(".controls-card");
  if (!card) return { error: "no card" };
  const cb = card.getBoundingClientRect();
  const cs = getComputedStyle(card);
  const padTop = parseFloat(cs.paddingTop) || 0;
  const liveTop = cb.top + card.clientTop + padTop;
  const inter = [...card.querySelectorAll(sel)].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  });
  const overlaps = [];
  let worstBelow = -Infinity;
  for (const tape of card.querySelectorAll(".washi-tag")) {
    const t = tape.getBoundingClientRect();
    const tcs = getComputedStyle(tape);
    if (tcs.display === "none" || t.width === 0 || t.height === 0) continue;
    const pinned = tcs.position === "sticky";
    const below = +(t.bottom - liveTop).toFixed(2);
    if (pinned && t.top <= liveTop + 0.5 && below > worstBelow) worstBelow = below;
    for (const el of inter) {
      const b = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(b.right, t.right) - Math.max(b.left, t.left));
      const h = Math.max(0, Math.min(b.bottom, t.bottom) - Math.max(b.top, t.top, liveTop));
      if (w * h > 0.5)
        overlaps.push({
          tape: (tape.textContent || "").trim().slice(0, 16),
          target: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 16),
          px: +(w * h).toFixed(1),
        });
    }
  }
  return {
    worstBelow: worstBelow === -Infinity ? null : worstBelow,
    overlaps,
    padTop: +padTop.toFixed(2),
    pinBand: cs.getPropertyValue("--pin-band").trim(),
    cardPadT: cs.getPropertyValue("--card-pad-t").trim(),
    tapeFont: (() => {
      const t = card.querySelector(".washi-tag");
      return t ? getComputedStyle(t).fontSize : null;
    })(),
    panelH: (() => {
      const p = document.querySelector(".controls-card .control-panel-wrap");
      return p ? +p.getBoundingClientRect().height.toFixed(2) : null;
    })(),
  };
};

/** The crossing, against the declared reference line (see p4-seal.mjs's header). */
const CROSS = () => {
  const out = [];
  for (const well of document.querySelectorAll(".controls-card .tray-well")) {
    const tape = well.querySelector(":scope > .washi-tag");
    const pose = [...well.querySelectorAll(":scope > svg.outline-svg > g.boil-pose")].find(
      (p) => getComputedStyle(p).display !== "none",
    );
    const path = pose && pose.querySelector("path");
    if (!tape || !path) continue;
    const t = tape.getBoundingClientRect();
    const l = path.getBoundingClientRect();
    out.push({
      name: (tape.textContent || "").trim(),
      aboveLine: +(l.top - t.top).toFixed(2),
      belowLine: +(t.bottom - l.top).toFixed(2),
    });
  }
  return out;
};

async function open(page, cell) {
  await page.goto("/?size=3&difficulty=EASY&board=fork");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  if (cell.dock) {
    await page.locator(".drawer-tab").click();
    await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
    await page.waitForTimeout(900); // the sheet SLIDES — settle before a box is read
  }
  await page.waitForSelector(".controls-card .washi-tag", { timeout: 30000 });
  await page.waitForTimeout(400);
}

/** A pinned tape only pins once the card has scrolled; read where the design turns on. */
async function scrollHalf(page) {
  await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    if (c) c.scrollTop = Math.round((c.scrollHeight - c.clientHeight) * 0.5);
  });
  await page.waitForTimeout(320);
}

const CELLS = [
  { name: "rail-1440x900", w: 1440, h: 900, touch: false, dock: false },
  { name: "ipad-1280x800", w: 1280, h: 800, touch: true, mobile: true, dock: false },
  { name: "dock-390x844", w: 390, h: 844, touch: true, dock: true },
  { name: "dock-375x812", w: 375, h: 812, touch: true, dock: true },
  { name: "land-844x390", w: 844, h: 390, touch: true, dock: true },
];

const RUNGS = [
  ["printed 25.888 (shipped)", null],
  ["FACE's printed rung, spelled", `.controls-card { --type-name: 25.888px !important }`],
  ["one rung up 31.4", `.controls-card { --type-name: 31.4px !important }`],
  ["head's own 14.05", `.controls-card { --type-name: 14.05px !important }`],
];

const out = {};
for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const br = await launcher.launch();
  for (const cell of CELLS) {
    const ctx = await br.newContext({
      baseURL: BASE,
      viewport: { width: cell.w, height: cell.h },
      hasTouch: !!cell.touch,
      isMobile: !!cell.mobile,
    });
    const page = await ctx.newPage();
    const key = `${eng}|${cell.name}`;
    try {
      await open(page, cell);

      // ── TEST 1 · THE VOICE ────────────────────────────────────────────────────────────
      const voice = [];
      for (const [label, css] of RUNGS) {
        let tag = null;
        if (css) tag = await page.addStyleTag({ content: css });
        await page.waitForTimeout(300);
        await scrollHalf(page);
        voice.push({
          label,
          pin: await page.evaluate(PIN, INTERACTIVE),
          crossing: await page.evaluate(CROSS),
        });
        if (tag) await page.evaluate((t) => t.remove(), tag);
        await page.waitForTimeout(200);
      }

      // ── TEST 2 · THE PIN BAND, derived with no sampler ────────────────────────────────
      await scrollHalf(page);
      const before = await page.evaluate(PIN, INTERACTIVE);
      const derived = await page.evaluate((sel) => {
        const card = document.querySelector(".controls-card");
        // Kill the sampler's authority: the three readers take the derived band directly.
        card.style.setProperty("--card-pad-t", "var(--pin-band)");
        return null;
      }, INTERACTIVE);
      void derived;
      await page.waitForTimeout(400);
      await scrollHalf(page);
      const after = await page.evaluate(PIN, INTERACTIVE);
      const afterCross = await page.evaluate(CROSS);

      out[key] = { voice, pinBand: { sampled: before, derived: after, crossing: afterCross } };
    } catch (e) {
      out[key] = { error: String(e).slice(0, 240) };
    }
    await ctx.close();
  }
  await br.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
