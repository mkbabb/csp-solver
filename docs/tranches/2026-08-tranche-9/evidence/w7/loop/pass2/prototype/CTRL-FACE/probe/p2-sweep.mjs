/**
 * CTRL-FACE pass 2 — THE TWO CLEARANCES, SWEPT ON THE REAL SURFACE. The synthesis priced the
 * tape's leading and the tab row's headroom by interpolation; both read short. This sweeps the
 * two levers independently at the dock and reports every arm, so the number that ships is the
 * one that was measured.
 *
 *   BASE=http://127.0.0.1:4234/ node p2-sweep.mjs
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const LEADS = (process.env.LEADS || "1.5,1.2,1.1,1.05,1,0.95,0.9,0.85,0.8").split(",");
const PADS = (process.env.PADS || "0.35,0.5,0.65,0.8").split(",");

function read(worst) {
  const card = document.querySelector(".controls-card");
  const R = (r) => ({ t: r.top, b: r.bottom, l: r.left, r: r.right });
  const inkBox = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return R(range.getBoundingClientRect());
  };
  const tapes = Array.from(card.querySelectorAll(".tray-well > .washi-tag"));
  const caps = Array.from(card.querySelectorAll(".zone-row-label"));
  const heads = Array.from(card.querySelectorAll(".mobile-heading-btn .section-heading"));
  const checking = tapes.find((t) => t.innerText.trim() === "checking");
  const cands = caps.find((c) => c.innerText.trim() === "candidates");
  const first = tapes[0];
  let renderedGap = null;
  let worstGap = null;
  if (checking && cands) {
    const tb = R(checking.getBoundingClientRect());
    const ci = inkBox(cands);
    const cs = getComputedStyle(cands);
    const cv = document.createElement("canvas").getContext("2d");
    cv.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const ownDesc = cv.measureText(cands.innerText.trim()).actualBoundingBoxDescent ?? 0;
    const wDesc = cv.measureText(worst).actualBoundingBoxDescent ?? 0;
    renderedGap = +(tb.t - ci.b).toFixed(2);
    worstGap = +(tb.t - (ci.b - ownDesc + wDesc)).toFixed(2);
  }
  let daylight = null;
  let px2 = 0;
  if (first && heads.length) {
    const tb = R(first.getBoundingClientRect());
    const hi = inkBox(heads[0]);
    daylight = +(hi.t - tb.b).toFixed(2);
    const x = Math.min(tb.r, hi.r) - Math.max(tb.l, hi.l);
    const y = Math.min(tb.b, hi.b) - Math.max(tb.t, hi.t);
    px2 = x > 0 && y > 0 ? +(x * y).toFixed(1) : 0;
  }
  return {
    renderedGap,
    worstGap,
    daylight,
    px2,
    cardH: +card.scrollHeight.toFixed(2),
    firstClear: first ? +(R(first.getBoundingClientRect()).t - R(card.getBoundingClientRect()).t).toFixed(2) : null,
  };
}

for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: eng === "chromium",
    deviceScaleFactor: 3,
  });
  const p = await ctx.newPage();
  await p.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await p.waitForTimeout(1400);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await p.locator(".drawer-tab").click({ force: true });
    await p.waitForTimeout(950);
  }
  const base = await p.evaluate(read, "pgjqy");
  console.log(`${eng} AS BUILT`, JSON.stringify(base));
  for (const lead of LEADS) {
    await p.evaluate((l) => {
      let s = document.getElementById("sweep-lead");
      if (!s) {
        s = document.createElement("style");
        s.id = "sweep-lead";
        document.head.appendChild(s);
      }
      s.textContent = `.tray-well .washi-tag { line-height: ${l} !important; }`;
    }, lead);
    await p.waitForTimeout(120);
    const r = await p.evaluate(read, "pgjqy");
    console.log(`${eng} lead=${lead}`, JSON.stringify(r));
  }
  await p.evaluate(() => document.getElementById("sweep-lead")?.remove());
  for (const pad of PADS) {
    await p.evaluate((v) => {
      let s = document.getElementById("sweep-pad");
      if (!s) {
        s = document.createElement("style");
        s.id = "sweep-pad";
        document.head.appendChild(s);
      }
      s.textContent = `.mobile-heading-row { padding-top: ${v}rem !important; }`;
    }, pad);
    await p.waitForTimeout(120);
    const r = await p.evaluate(read, "pgjqy");
    console.log(`${eng} pad=${pad}rem`, JSON.stringify(r));
  }
  await b.close();
}
