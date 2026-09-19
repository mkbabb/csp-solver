/**
 * CTRL-FACE pass 2 — SWEEP 3, the last two levers, at lead 1 / lift 0 (the arm where the tape's
 * paper still covers its own ink: +0.71px both engines). The row caption's own leading and the
 * well's gap under `mobile` — the second is free at the sealed 1280 cell, which is the row
 * regime, the same reason the tab row's headroom is free there. Every arm reports the CARD
 * HEIGHT at the dock and at 1280 coarse, so nothing is bought on credit.
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const BASECSS =
  ".tray-well .washi-tag { line-height: 1 !important; }\n.tray-well { --washi-tag-lift: 0px !important; }\n";
const ARMS = [
  { id: "lead1/lift0 (base)", css: "" },
  { id: "+ caption leading 1", css: ".zone-row-label { line-height: 1 !important; }" },
  { id: "+ caption leading 0.9", css: ".zone-row-label { line-height: 0.9 !important; }" },
  { id: "+ well gap 0.65rem", css: ".tray-well { margin-block: 0.65rem !important; }" },
  { id: "+ well gap 0.8rem", css: ".tray-well { margin-block: 0.8rem !important; }" },
  {
    id: "+ well pad-bottom 0.35rem",
    css: ".tray-well { padding-bottom: 0.35rem !important; }",
  },
];

function read(worst) {
  const card = document.querySelector(".controls-card");
  const R = (r) => ({ t: r.top, b: r.bottom, l: r.left, r: r.right, h: r.height });
  const inkBox = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return R(range.getBoundingClientRect());
  };
  const tapes = Array.from(card.querySelectorAll(".tray-well > .washi-tag"));
  const caps = Array.from(card.querySelectorAll(".zone-row-label"));
  const heads = Array.from(card.querySelectorAll(".mobile-heading-btn .section-heading"));
  const out = { cardH: +card.scrollHeight.toFixed(2) };
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
  return out;
}

for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();
  for (const cell of [
    { name: "dock-390x844", w: 390, h: 844, mobile: true },
    { name: "seal-1280x800-coarse", w: 1280, h: 800, mobile: false, coarse: true },
  ]) {
    const ctx = await b.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile || cell.coarse,
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
      await p.evaluate(
        (css) => {
          let s = document.getElementById("sweep3");
          if (!s) {
            s = document.createElement("style");
            s.id = "sweep3";
            document.head.appendChild(s);
          }
          s.textContent = css;
        },
        BASECSS + arm.css,
      );
      await p.waitForTimeout(140);
      const r = await p.evaluate(read, "pgjqy");
      console.log(`${eng} ${cell.name} ${arm.id}`, JSON.stringify(r));
    }
    await ctx.close();
  }
  await b.close();
}
