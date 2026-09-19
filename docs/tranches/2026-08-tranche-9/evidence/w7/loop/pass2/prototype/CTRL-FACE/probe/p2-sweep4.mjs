/**
 * CTRL-FACE pass 2 — SWEEP 4. `--washi-tag-lift: 3px` is NOT free (its own comment: at 3px the
 * tape's tilted box stops 1.87px short of its own first row, and the tilt alone grows the box
 * ~0.95px), so the 3px it would have bought at the collision above is spent where it is. These
 * are the levers that remain, each reported with BOTH collisions, the tape-vs-its-own-first-row
 * clearance, and the card height at the dock and at the sealed 1280 coarse cell.
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const MOBILE_ONLY = (css) => `@media (max-width: 1023.98px) { ${css} }`;
const ARMS = [
  { id: "as built (lead 1)", css: "" },
  { id: "+ caption align-self start", css: ".zone-row-label { align-self: flex-start !important }" },
  {
    id: "+ caption start + well pad-b 0.35rem (mobile)",
    css:
      ".zone-row-label { align-self: flex-start !important }" +
      MOBILE_ONLY(".tray-well { padding-bottom: 0.35rem !important }"),
  },
  { id: "+ well pad-b 0.55rem (mobile)", css: MOBILE_ONLY(".tray-well { padding-bottom: 0.55rem !important }") },
];

function read(worst) {
  const card = document.querySelector(".controls-card");
  const R = (r) => ({ t: r.top, b: r.bottom, l: r.left, r: r.right, h: r.height });
  const inkBox = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return R(range.getBoundingClientRect());
  };
  const panel = document.querySelector(".controls-card .control-panel-wrap");
  const out = {
    cardH: +card.scrollHeight.toFixed(2),
    panelH: panel ? +panel.getBoundingClientRect().height.toFixed(2) : null,
  };
  const tapes = Array.from(card.querySelectorAll(".tray-well > .washi-tag"));
  const caps = Array.from(card.querySelectorAll(".zone-row-label"));
  const heads = Array.from(card.querySelectorAll(".mobile-heading-btn .section-heading"));
  const checking = tapes.find((t) => t.innerText.trim() === "checking");
  const cands = caps.find((c) => c.innerText.trim() === "candidates");
  if (checking && cands) {
    const tb = R(checking.getBoundingClientRect());
    const ci = inkBox(cands);
    const ccs = getComputedStyle(cands);
    const cv = document.createElement("canvas").getContext("2d");
    cv.font = `${ccs.fontStyle} ${ccs.fontWeight} ${ccs.fontSize} ${ccs.fontFamily}`;
    const ownDesc = cv.measureText(cands.innerText.trim()).actualBoundingBoxDescent ?? 0;
    const wDesc = cv.measureText(worst).actualBoundingBoxDescent ?? 0;
    out.renderedGap = +(tb.t - ci.b).toFixed(2);
    out.worstGap = +(tb.t - (ci.b - ownDesc + wDesc)).toFixed(2);
  }
  if (tapes[0] && heads.length) {
    const tb = R(tapes[0].getBoundingClientRect());
    const hi = inkBox(heads[0]);
    out.daylight = +(hi.t - tb.b).toFixed(2);
  }
  // THE TAPE AGAINST ITS OWN FIRST ROW — the collision `--washi-tag-lift` exists to prevent.
  let ownWorst = null;
  for (const t of tapes) {
    const well = t.closest(".tray-well");
    const first = well?.querySelector(".ctrl-btn, .zone-row-label");
    if (!first) continue;
    const tb = R(t.getBoundingClientRect());
    const fi = inkBox(first);
    const d = +(fi.t - tb.b).toFixed(2);
    if (ownWorst === null || d < ownWorst) ownWorst = d;
  }
  out.tapeOverOwnFirstRow = ownWorst;
  return out;
}

for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();
  for (const cell of [
    { name: "dock-390x844", w: 390, h: 844, mobile: true },
    { name: "seal-1280x800-coarse", w: 1280, h: 800, coarse: true },
  ]) {
    const ctx = await b.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: true,
      isMobile: cell.mobile && eng === "chromium",
      deviceScaleFactor: cell.mobile ? 3 : 1,
    });
    const p = await ctx.newPage();
    await p.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await p.waitForTimeout(1400);
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await p.locator(".drawer-tab").click({ force: true });
      await p.waitForTimeout(950);
    }
    for (const arm of ARMS) {
      await p.evaluate((css) => {
        let s = document.getElementById("sweep4");
        if (!s) {
          s = document.createElement("style");
          s.id = "sweep4";
          document.head.appendChild(s);
        }
        s.textContent = css;
      }, arm.css);
      await p.waitForTimeout(140);
      console.log(`${eng} ${cell.name} ${arm.id}`, JSON.stringify(await p.evaluate(read, "pgjqy")));
    }
    await ctx.close();
  }
  await b.close();
}
