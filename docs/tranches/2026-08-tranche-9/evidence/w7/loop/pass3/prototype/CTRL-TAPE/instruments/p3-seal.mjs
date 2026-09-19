/**
 * T9-W7 pass 2 · CTRL-TAPE — the iPad coarse seal, re-priced by named in-page ablation, and
 * the short-landscape arm's two poses. Both engines. Read-only on the product.
 *
 *   node p2-seal.mjs
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = "http://127.0.0.1:4230";
const PANEL_H = () => {
  const p = document.querySelector(".controls-card .control-panel-wrap");
  return p ? +p.getBoundingClientRect().height.toFixed(2) : null;
};

/** each row: a name, and the ONE declaration reverted in page to read its price. */
const ABLATIONS = [
  ["pin band 43.87 → 20 (p-5's own top)", `.controls-card { padding-top: 20px !important }`],
  [
    "well padding-top 33.67 → 5.6 (the hang unpaid)",
    `.tray-well { padding-top: 0.35rem !important }`,
  ],
  [
    "first well margin 0.35rem → 2rem (pass 1's own)",
    `.tray-well:first-child { margin-top: 2rem !important }`,
  ],
  [
    "the bar back in flow inside the card (its reserve)",
    `.controls-card { padding-bottom: calc(3.5rem + 64.81px) !important }`,
  ],
  ["tape leading 1.2 → 1.5", `.washi-tag { line-height: 1.5 !important }`],
  [
    "the lever: lift 3px → 40% of the tape",
    `.tray-well { --washi-tag-lift: calc(0.4 * var(--washi-tag-h)) !important }`,
  ],
];

for (const [name, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await eng.launch();
  // ── the seal cell ───────────────────────────────────────────────────────────────────────
  const ctx = await b.newContext({
    baseURL: BASE,
    viewport: { width: 1280, height: 800 },
    hasTouch: true,
    isMobile: true,
  });
  const p = await ctx.newPage();
  await p.goto("/?size=3&difficulty=EASY");
  await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await p.waitForSelector(".ctrl-btn", { timeout: 30000 });
  const regime = await p.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    row: matchMedia("(min-width: 1024px)").matches,
    rail: !!document.querySelector(".controls-card .control-panel-wrap"),
  }));
  const base = await p.evaluate(PANEL_H);
  console.log(`\n== ${name} · iPad coarse 1280×800 · regime ${JSON.stringify(regime)}`);
  console.log(`   base .control-panel-wrap = ${base}px   (seal 1283.5)`);
  for (const [label, css] of ABLATIONS) {
    const tag = await p.addStyleTag({ content: css });
    await p.waitForTimeout(150);
    const h = await p.evaluate(PANEL_H);
    await p.evaluate((t) => t.remove(), tag);
    await p.waitForTimeout(100);
    const d = (h - base).toFixed(2);
    console.log(`   ${String(d).padStart(8)}  ${label}`);
  }
  await ctx.close();

  // ── the short-landscape arm, both poses of --sheet-chrome ───────────────────────────────
  const c2 = await b.newContext({
    baseURL: BASE,
    viewport: { width: 844, height: 390 },
    hasTouch: true,
  });
  const p2 = await c2.newPage();
  await p2.goto("/?size=3&difficulty=EASY");
  await p2.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await p2.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await p2.locator(".drawer-tab").click();
  await p2.waitForTimeout(900);
  const read = () =>
    p2.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const rail = document.querySelector("#controls-drawer");
      const stroke = document.querySelector(
        "#controls-drawer .drawer-case > .outline-svg .boil-pose.is-active path",
      );
      const logo = document.querySelector("svg.handwritten-logo");
      return {
        chrome: getComputedStyle(rail).getPropertyValue("--sheet-chrome").trim(),
        cardMaxH: getComputedStyle(card).maxHeight,
        cardH: +card.getBoundingClientRect().height.toFixed(2),
        clientH: card.clientHeight,
        scrollH: card.scrollHeight,
        seam: +(
          stroke.getBoundingClientRect().top - logo.getBoundingClientRect().bottom
        ).toFixed(2),
      };
    });
  console.log(`\n== ${name} · 844×390 landscape · derived arm (this prototype)`);
  console.log("  ", JSON.stringify(await read()));
  const t = await p2.addStyleTag({
    content: `#controls-drawer { --sheet-chrome: 4rem !important }`,
  });
  await p2.waitForTimeout(250);
  console.log(`   shipped arm (--sheet-chrome: 4rem):`);
  console.log("  ", JSON.stringify(await read()));
  await p2.evaluate((x) => x.remove(), t);
  await c2.close();
  await b.close();
}
