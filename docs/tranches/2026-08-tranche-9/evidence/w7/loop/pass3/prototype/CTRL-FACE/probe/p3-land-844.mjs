// T9-W7 pass 3 · CTRL-FACE · the 844×390 landscape cell — the chair's §6.2 row.
//
// §6.2: at the landscape ≤500-tall ≥2:1 arm the control estate is reached through the tab on the
// board's bottom edge and the drawer it opens; the card is NOT asked to fit a 390px sheet beside
// the board. Every §10 lane asserts W2 §2.2's reachability probe there — a CUED path to deal and
// to level within ONE gesture, both engines — and reports the card's clientHeight as a READING,
// never a red.
//
// This closes the CTRL-FACE pass-3 README's gap 7 ("no 844×390 landscape reading. Not done.").
// It also re-reads the family's own face law at that cell, which no other run reached.
//
// Run: node p3-land-844.mjs   (servers: proto 4234, HEAD control 4235)

import { chromium, webkit } from "playwright";

const CELL = { width: 844, height: 390 };
const TREES = [
  ["proto", "http://127.0.0.1:4234"],
  ["head", "http://127.0.0.1:4235"],
];

const read = () => {
  const px = (n) => Math.round(n * 100) / 100;
  const vis = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      w: px(r.width),
      h: px(r.height),
      onscreen: r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0,
      inert: !!el.closest("[inert]"),
      hidden: cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0",
      name: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 28),
    };
  };
  const card = document.querySelector(".controls-card .control-panel-wrap");
  const deal = [...document.querySelectorAll("button")].find((b) =>
    /deal/i.test(b.getAttribute("aria-label") || b.textContent || ""),
  );
  // "level" is the section whose heading says so — open or shut, its value must be readable.
  const heads = [...document.querySelectorAll(".mobile-heading-btn, .section-heading")];
  const level = heads.find((h) => /level/i.test(h.textContent || ""));
  const printed = [...document.querySelectorAll(".controls-card .section-heading")].map((h) => {
    const cs = getComputedStyle(h);
    return `${cs.fontFamily.split(",")[0].replace(/["']/g, "")} · ${px(parseFloat(cs.fontSize))} · ${cs.fontWeight} · ${cs.textTransform}`;
  });
  return {
    cardH: card ? px(card.clientHeight) : null,
    tab: vis(document.querySelector(".drawer-tab")),
    deal: vis(deal),
    level: vis(level),
    caseOpen: !!document.querySelector("#controls-drawer .drawer-case"),
    printedVoices: [...new Set(printed)],
    printedN: printed.length,
  };
};

for (const [engine, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  console.log(`\n===== ${engine} · 844×390 landscape (coarse, touch) =====`);
  for (const [tree, base] of TREES) {
    const browser = await launcher.launch();
    const ctx = await browser.newContext({
      viewport: CELL,
      hasTouch: true,
      isMobile: engine === "chromium", // webkit refuses isMobile on desktop builds
    });
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(900);

    const before = await page.evaluate(read);
    console.log(
      `  ${tree} BEFORE  tab ${before.tab ? `"${before.tab.name}" ${before.tab.w}×${before.tab.h} onscreen=${before.tab.onscreen}` : "ABSENT"}` +
        `  deal ${before.deal ? `onscreen=${before.deal.onscreen} inert=${before.deal.inert}` : "ABSENT"}` +
        `  level ${before.level ? `onscreen=${before.level.onscreen}` : "ABSENT"}`,
    );

    // ONE GESTURE.
    let gestures = 0;
    if (before.tab && before.tab.onscreen) {
      await page.locator(".drawer-tab").tap();
      gestures = 1;
      await page.waitForTimeout(900); // the dock sheet SLIDES — settle before measuring
    }
    const after = await page.evaluate(read);

    const reach = (t) => (t && t.onscreen && !t.inert && !t.hidden ? "REACHED" : "NOT REACHED");
    console.log(
      `  ${tree} AFTER(${gestures} gesture)  case=${after.caseOpen}  ` +
        `deal ${reach(after.deal)}${after.deal ? ` ${after.deal.w}×${after.deal.h}` : ""}  ` +
        `level ${reach(after.level)}${after.level ? ` "${after.level.name}"` : ""}  ` +
        `| cardH ${after.cardH} (READING, not a red)  ` +
        `| printed n=${after.printedN} voices ${JSON.stringify(after.printedVoices)}`,
    );
    await browser.close();
  }
}
