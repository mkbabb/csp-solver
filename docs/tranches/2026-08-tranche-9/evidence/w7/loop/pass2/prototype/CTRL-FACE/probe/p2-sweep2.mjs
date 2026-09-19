/**
 * CTRL-FACE pass 2 — SWEEP 2. The first sweep said the leading buys the clearance and costs no
 * flow; it did not say whether the PAPER still covers the WORD. A washi tape whose line box is
 * shorter than the ink it carries is a tape with letters hanging out of it, which is a worse
 * defect than the clearance it buys. This reads paper-vs-ink at every arm, and sweeps the
 * card's own `--washi-tag-lift` (a pure translation: the covenant's net flow is lift-free).
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const ARMS = [
  { lead: "1.05", lift: "3px" },
  { lead: "1.05", lift: "0px" },
  { lead: "1", lift: "0px" },
  { lead: "0.95", lift: "0px" },
  { lead: "0.9", lift: "0px" },
  { lead: "0.9", lift: "3px" },
  { lead: "0.85", lift: "0px" },
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
  const checking = tapes.find((t) => t.innerText.trim() === "checking");
  const cands = caps.find((c) => c.innerText.trim() === "candidates");
  const out = { cardH: +card.scrollHeight.toFixed(2) };
  // paper vs ink, on the tape with both an ascender and a descender
  if (checking) {
    const prev = checking.style.transform;
    checking.style.transform = "none";
    const paper = R(checking.getBoundingClientRect());
    const cs = getComputedStyle(checking);
    const cv = document.createElement("canvas").getContext("2d");
    cv.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = cv.measureText("checking");
    checking.style.transform = prev;
    const inkH = (m.actualBoundingBoxAscent ?? 0) + (m.actualBoundingBoxDescent ?? 0);
    out.paperH = +paper.h.toFixed(2);
    out.inkH = +inkH.toFixed(2);
    out.paperOverInk = +(paper.h - inkH).toFixed(2);
    if (cands) {
      const tb = R(checking.getBoundingClientRect());
      const ci = inkBox(cands);
      const ccs = getComputedStyle(cands);
      const cv2 = document.createElement("canvas").getContext("2d");
      cv2.font = `${ccs.fontStyle} ${ccs.fontWeight} ${ccs.fontSize} ${ccs.fontFamily}`;
      const ownDesc = cv2.measureText(cands.innerText.trim()).actualBoundingBoxDescent ?? 0;
      const wDesc = cv2.measureText(worst).actualBoundingBoxDescent ?? 0;
      out.renderedGap = +(tb.t - ci.b).toFixed(2);
      out.worstGap = +(tb.t - (ci.b - ownDesc + wDesc)).toFixed(2);
    }
  }
  if (tapes[0] && heads.length) {
    const tb = R(tapes[0].getBoundingClientRect());
    const hi = inkBox(heads[0]);
    out.daylight = +(hi.t - tb.b).toFixed(2);
    out.firstClear = +(tb.t - R(card.getBoundingClientRect()).t).toFixed(2);
  }
  return out;
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
  for (const arm of ARMS) {
    await p.evaluate((a) => {
      let s = document.getElementById("sweep2");
      if (!s) {
        s = document.createElement("style");
        s.id = "sweep2";
        document.head.appendChild(s);
      }
      s.textContent =
        `.tray-well .washi-tag { line-height: ${a.lead} !important; }\n` +
        `.tray-well { --washi-tag-lift: ${a.lift} !important; }`;
    }, arm);
    await p.waitForTimeout(140);
    const r = await p.evaluate(read, "pgjqy");
    console.log(`${eng} lead=${arm.lead} lift=${arm.lift}`, JSON.stringify(r));
  }
  await b.close();
}
