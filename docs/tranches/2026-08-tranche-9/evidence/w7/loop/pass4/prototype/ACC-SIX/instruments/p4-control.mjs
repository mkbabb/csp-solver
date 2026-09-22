#!/usr/bin/env node
/** ACC-SIX pass-4 — the three rows `p4-geom.mjs` could not answer in its own pass.
 *
 * 1. THE IN-PLACE ROW'S NEGATIVE CONTROL, RUN WHILE THE LINE IS ALIVE. geom's control fired
 *    after the lesson had already lifted, so it replaced nothing and proved nothing — a
 *    vacuous control, reported as such. Here the node is replaced by hand between write 1 and
 *    write 2, and the SAME observer + the SAME node-identity reading must catch it.
 * 2. THE 16×16 WRAP ARM AT ITS WORST STRING. The deal's own line is `1 of 64 …`; the widest
 *    the sentence can ever be is `200 of 200 on the board` (a 16×16 with 200 writable cells,
 *    six digits). Measured by writing that literal into the live node and reading
 *    `scrollWidth` against the 258 px the tongue's band leaves at 393.
 * 3. W2's TAP FLOOR, READ FROM THE CONSUMER (not the root: `--tap-floor` is declared on
 *    App.vue's shell, so a `documentElement` read returns "" and says nothing).
 *
 * usage: BASE=http://127.0.0.1:4237 node p4-control.mjs <out.json>
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: BASE=… node p4-control.mjs <out.json>");

const CELLS = [
  { name: "phone-393x699", viewport: { width: 393, height: 699 }, dpr: 3 },
  { name: "landscape-844x390", viewport: { width: 844, height: 390 }, dpr: 3 },
];

const INSTRUMENT = () => {
  window.__a6 = { muts: [], nodes: [] };
  const strip = document.querySelector(".board-margin");
  new MutationObserver((recs) => {
    for (const r of recs) {
      for (const n of r.addedNodes)
        if (n.nodeType === 1 && n.classList.contains("margin-note-meta"))
          window.__a6.muts.push(`+${n.textContent.trim()}`);
      for (const n of r.removedNodes)
        if (n.nodeType === 1 && n.classList.contains("margin-note-meta"))
          window.__a6.muts.push(`-${n.textContent.trim()}`);
    }
  }).observe(strip, { childList: true, subtree: true });
  return true;
};
const SNAP = () => {
  const el = document.querySelector(".margin-note-meta");
  if (el && !window.__a6.nodes.includes(el)) window.__a6.nodes.push(el);
  return { text: el?.textContent.trim() ?? null, distinctNodes: window.__a6.nodes.length, muts: [...window.__a6.muts] };
};

async function typeOne(page) {
  const ok = await page.evaluate(() => {
    const i = Array.from(document.querySelectorAll(".sudoku-cell input")).find(
      (x) => !x.readOnly && !x.value,
    );
    if (!i) return false;
    i.focus();
    return true;
  });
  if (!ok) return false;
  await page.keyboard.type("5");
  await page.waitForTimeout(240);
  await page.evaluate(() => document.activeElement?.blur?.());
  return true;
}

const rows = { meta: { base: BASE, control: "74a2b5d9" }, cells: {} };
for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  for (const C of CELLS) {
    const key = `${eng}/${C.name}`;
    const R = (rows.cells[key] = {});
    const ctx = await browser.newContext({
      viewport: C.viewport,
      deviceScaleFactor: C.dpr,
      hasTouch: true,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1200);
    R.coarseWitnessed = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
    await page.evaluate(INSTRUMENT);

    await typeOne(page);
    await page.waitForTimeout(260);
    R.afterWrite1 = await page.evaluate(SNAP);

    // ── 1. THE NEGATIVE CONTROL, while the line is alive ────────────────────────────────
    R.control = await page.evaluate(() => {
      const el = document.querySelector(".margin-note-meta");
      if (!el) return { ran: false };
      el.replaceWith(el.cloneNode(true));
      return { ran: true };
    });
    await page.waitForTimeout(140);
    R.afterControl = await page.evaluate(SNAP);

    await typeOne(page);
    await page.waitForTimeout(260);
    R.afterWrite2 = await page.evaluate(SNAP);

    // ── 2. THE WRAP ARM AT ITS WORST STRING ─────────────────────────────────────────────
    R.wrap = await page.evaluate(() => {
      const el = document.querySelector(".margin-note-meta");
      if (!el) return null;
      const cs = getComputedStyle(el);
      const strip = document.querySelector(".board-margin");
      const read = (s) => {
        const was = el.textContent;
        el.textContent = s;
        const r = {
          text: s,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          scrollHeight: el.scrollHeight,
          lineBoxes: el.getClientRects().length,
          stripHeight: +strip.getBoundingClientRect().height.toFixed(2),
        };
        el.textContent = was;
        return r;
      };
      return {
        lineHeightPx: cs.lineHeight,
        available: +strip.getBoundingClientRect().width.toFixed(2),
        asDealt: read(el.textContent),
        worst16: read("200 of 200 on the board"),
      };
    });

    // ── 3. THE TAP FLOOR, from the consumer ─────────────────────────────────────────────
    R.tapFloor = await page.evaluate(() => {
      const tab = document.querySelector(".drawer-tab") || document.querySelector(".dock-tab");
      const shell = document.querySelector(".app-shell") || document.body;
      const cs = tab && getComputedStyle(tab);
      return {
        tokenOnShell: getComputedStyle(shell).getPropertyValue("--tap-floor").trim() || null,
        tokenOnRoot:
          getComputedStyle(document.documentElement).getPropertyValue("--tap-floor").trim() || null,
        tabMinHeight: cs?.minHeight ?? null,
        tabMinWidth: cs?.minWidth ?? null,
        tabRect: tab
          ? (() => {
              const b = tab.getBoundingClientRect();
              return { w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
            })()
          : null,
      };
    });

    await ctx.close();
    console.error(`  done ${key}`);
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);
