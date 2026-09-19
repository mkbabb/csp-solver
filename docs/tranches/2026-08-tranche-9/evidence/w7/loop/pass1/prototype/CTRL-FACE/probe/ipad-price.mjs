/**
 * CTRL-FACE pass-1 — THE iPAD SEAL, PRICED BY ABLATION. `visual-regression` test "the iPad
 * coarse card stays under the P1 seal" reds under this family (1270.75 chromium / 1276.63
 * webkit against a 1227.5 seal; HEAD passes on the same lane). A number that big is three
 * declarations, not one, so each is reverted IN-PAGE at the cell the seal is measured at and
 * the card is re-read: the difference is that declaration's price.
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const BASE = process.env.BASE || "http://127.0.0.1:4242/";

const ABLATIONS = [
  ["as built", ""],
  [
    "first well back to 0.35rem",
    ".controls-card .tray-well:first-child { margin-top: 0.35rem !important; }",
  ],
  [
    "captions back to the hand rung",
    ".zone-row-label { font-size: var(--type-tag) !important; line-height: 1.1 !important; " +
      "font-family: var(--font-hand) !important; font-weight: 400 !important; }",
  ],
  [
    "tapes back to the hand rung",
    ".washi-tag { font-size: var(--type-tag) !important; font-family: var(--font-hand) !important; " +
      "font-weight: 400 !important; --washi-tag-lh: 1.5 !important; }",
  ],
  [
    "all three reverted",
    ".controls-card .tray-well:first-child { margin-top: 0.35rem !important; }" +
      ".zone-row-label { font-size: var(--type-tag) !important; line-height: 1.1 !important; font-family: var(--font-hand) !important; font-weight: 400 !important; }" +
      ".washi-tag { font-size: var(--type-tag) !important; font-family: var(--font-hand) !important; font-weight: 400 !important; --washi-tag-lh: 1.5 !important; }",
  ],
];

const PANEL_H = () => {
  const el = document.querySelector(".controls-card .control-panel-wrap");
  return el ? +el.getBoundingClientRect().height.toFixed(2) : null;
};

for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();
  for (const [name, css] of ABLATIONS) {
    const ctx = await b.newContext({
      viewport: { width: 1280, height: 800 },
      hasTouch: true,
      isMobile: true,
    });
    const p = await ctx.newPage();
    await p.goto(BASE, { waitUntil: "domcontentloaded" });
    await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await p.waitForSelector(".ctrl-btn", { timeout: 60000 });
    await p.waitForTimeout(1200);
    if (css) {
      await p.addStyleTag({ content: css });
      await p.waitForTimeout(400);
    }
    console.log(
      JSON.stringify({
        eng,
        ablation: name,
        cardH: await p.evaluate(PANEL_H),
        seal: 1227.5,
      })
    );
    await ctx.close();
  }
  await b.close();
}
