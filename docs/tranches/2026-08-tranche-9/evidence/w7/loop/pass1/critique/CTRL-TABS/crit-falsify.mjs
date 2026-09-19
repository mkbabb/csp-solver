// T9-W7 pass-1 CRITIC — CAN THE NO-SCROLL GATE FAIL? `scrollHeight <= clientHeight` on a box
// whose content is laid out in one grid cell with the losers `visibility: hidden` is exactly the
// shape a gate takes when it cannot fail. Three tests:
//   (a) a viewport far below anything the family priced — does it still report FIT?
//   (b) is the tray's own content CLIPPED by the card (bottom beyond the card's bottom)?
//   (c) an injected overflow — force one tray 400px taller and see whether the row reds.
import { chromium, webkit } from "playwright";
const BASE = "http://127.0.0.1:4240/";
const CELLS = [
  { w: 390, h: 844 }, { w: 320, h: 480 }, { w: 360, h: 400 }, { w: 900, h: 500 }, { w: 844, h: 390 },
];
const read = () => {
  const card = document.querySelector(".controls-card");
  if (!card) return { none: true };
  const cb = card.getBoundingClientRect();
  const cs = getComputedStyle(card);
  const panels = [...document.querySelectorAll('[role="tabpanel"]')].map((p) => {
    const r = p.getBoundingClientRect();
    return { inert: p.hasAttribute("inert"), vis: getComputedStyle(p).visibility, h: +r.height.toFixed(1), bottomOver: +(r.bottom - cb.bottom).toFixed(1), sh: p.scrollHeight, ch: p.clientHeight };
  });
  // deepest descendant bottom inside the face-up tray, against the card's own bottom
  const live = document.querySelector('[role="tabpanel"]:not([inert])');
  let deepest = -1e9;
  if (live) for (const e of live.querySelectorAll("*")) { const r = e.getBoundingClientRect(); if (r.height) deepest = Math.max(deepest, r.bottom); }
  const bar = document.querySelector(".action-bar");
  return {
    sh: card.scrollHeight, ch: card.clientHeight, fits: card.scrollHeight <= card.clientHeight,
    overflowY: cs.overflowY, overflowX: cs.overflowX, cardH: +cb.height.toFixed(1), cardBottom: +cb.bottom.toFixed(1),
    liveContentBottomOverCard: live ? +(deepest - cb.bottom).toFixed(1) : null,
    barBottomOverViewport: bar ? +(bar.getBoundingClientRect().bottom - window.innerHeight).toFixed(1) : null,
    cardBottomOverViewport: +(cb.bottom - window.innerHeight).toFixed(1),
    panels,
  };
};
for (const engine of ["chromium", "webkit"]) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  for (const c of CELLS) {
    const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, deviceScaleFactor: 1, hasTouch: true, isMobile: engine === "chromium" ? true : undefined, colorScheme: "light" });
    const page = await ctx.newPage();
    await page.addInitScript(`try{localStorage.clear();localStorage.setItem("sudoku-color-scheme","light")}catch{}`);
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.waitForTimeout(1200);
    try { await page.locator(".drawer-tab").click({ force: true, timeout: 8000 }); await page.waitForTimeout(1100); } catch {}
    const plain = await page.evaluate(read);
    // (c) INJECTED OVERFLOW — the control the gate owes
    const injected = await page.evaluate(() => {
      const live = document.querySelector('[role="tabpanel"]:not([inert])');
      if (!live) return { none: true };
      const d = document.createElement("div");
      d.style.cssText = "height:400px";
      live.appendChild(d);
      const card = document.querySelector(".controls-card");
      return { sh: card.scrollHeight, ch: card.clientHeight, fits: card.scrollHeight <= card.clientHeight };
    });
    console.log(
      `${engine} ${c.w}x${c.h}: ${plain.sh}/${plain.ch} fits=${plain.fits} overflowY=${plain.overflowY} cardH=${plain.cardH} ` +
      `liveContentOverCardBottom=${plain.liveContentBottomOverCard} cardBottomOverViewport=${plain.cardBottomOverViewport} ` +
      `| INJECT+400 -> ${injected.sh}/${injected.ch} fits=${injected.fits}`,
    );
    if (plain.panels) console.log(`   panels: ${plain.panels.map((p) => `${p.inert ? "inert" : "LIVE"}/${p.vis}/h${p.h}/over${p.bottomOver}`).join(" ")}`);
    await ctx.close();
  }
  await browser.close();
}
