#!/usr/bin/env node
/** π — THE UNCLAIMED SURFACES, read as PAINT and TAG NAMES (registry §2.13, not rects alone).
 *
 * Against the named control `74a2b5d9` (the chair's shared read-only tree, served from its
 * pre-built dist, verified by `index-CubiZsMVSwTc.js`). Both arms deal THE SAME BOARD
 * (`?board=` is not available on this route, so the deal is pinned by `?size=3&difficulty=EASY`
 * plus a fixed murmur seed the app derives from it — the probe reports the first row's digits
 * from both arms so a drifted deal is visible rather than assumed).
 *
 * For every selector below: tag name, then the computed properties a rect census cannot see —
 * font, line-height, colour, background, stroke, fill, opacity, transform — plus the rect.
 * The wave CLAIMS `.progress-trace`, `.board-margin`, `.margin-note-meta` and the washi tapes;
 * everything else must be identical.
 *
 * usage: node p4-pi.mjs <out.json>   (PROTO=… CONTROL=… override the two bases)
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";

const { chromium, webkit } = pw;
const PROTO = process.env.PROTO || "http://127.0.0.1:4237";
const CONTROL = process.env.CONTROL || "http://127.0.0.1:4238";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node p4-pi.mjs <out.json>");

const SELECTORS = [
  ".board-wrapper",
  ".sudoku-cell",
  ".masthead",
  ".logo-text",
  ".controls-card",
  ".icon-btn",
  ".deal-row",
  ".board-voice",
  ".margin-note",
  ".drawer-tab",
  ".game-card",
];

const READ = (sels) =>
  sels.map((s) => {
    const el = document.querySelector(s);
    if (!el) return { sel: s, found: false };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      sel: s,
      found: true,
      count: document.querySelectorAll(s).length,
      tag: el.tagName,
      font: cs.font,
      lineHeight: cs.lineHeight,
      color: cs.color,
      background: cs.backgroundColor,
      stroke: cs.stroke,
      fill: cs.fill,
      opacity: cs.opacity,
      transform: cs.transform,
      borderTop: cs.borderTopWidth + " " + cs.borderTopColor,
      rect: [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)],
    };
  });

const FIRSTROW = () =>
  Array.from(document.querySelectorAll(".sudoku-cell input"))
    .slice(0, 9)
    .map((i) => (i.readOnly ? i.value || "." : "_"))
    .join("");

async function read(browser, base, scheme) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: scheme,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1100);
  const out = {
    deal: await page.evaluate(FIRSTROW),
    nodes: await page.evaluate(READ, SELECTORS),
  };
  await ctx.close();
  return out;
}

const rows = { meta: { proto: PROTO, control: CONTROL, controlCommit: "74a2b5d9" }, cells: {} };
for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  for (const scheme of ["light", "dark"]) {
    const a = await read(browser, PROTO, scheme);
    const b = await read(browser, CONTROL, scheme);
    const deltas = [];
    for (let i = 0; i < a.nodes.length; i++) {
      const x = a.nodes[i];
      const y = b.nodes[i];
      if (!x.found || !y.found) {
        deltas.push({ sel: x.sel, note: `found proto=${x.found} control=${y.found}` });
        continue;
      }
      for (const k of Object.keys(x))
        if (k !== "sel" && k !== "found" && JSON.stringify(x[k]) !== JSON.stringify(y[k]))
          deltas.push({ sel: x.sel, prop: k, proto: x[k], control: y[k] });
    }
    rows.cells[`${eng}/${scheme}`] = {
      dealProto: a.deal,
      dealControl: b.deal,
      sameDeal: a.deal === b.deal,
      selectors: SELECTORS.length,
      deltas,
    };
    console.error(`  done ${eng}/${scheme}: ${deltas.length} delta(s)`);
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);
