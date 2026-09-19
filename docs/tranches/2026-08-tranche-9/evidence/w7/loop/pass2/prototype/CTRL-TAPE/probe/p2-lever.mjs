/**
 * T9-W7 pass 2 · CTRL-TAPE — THE LEVER, AUDITIONED AGAINST ITS OWN RISK.
 *
 * The seal came in +19.9 over, and the spec names one lever: `--washi-tag-lift` 3px → 40% of
 * `--washi-tag-h`. It shortens the card by shrinking each well's hang — which moves the same
 * reserve from the well's PADDING into the inter-well GAP, where the tape may reach the well
 * ABOVE it. This reads both poses on the same page, in the same run: the §2.5 collision
 * (tape ∩ control), the crossing (tape vs its own well's drawn stroke), the tape's reach past
 * its well's top edge against the 16px of margin it has, and the panel's own height.
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = "http://127.0.0.1:4230";
const LEVER = `.tray-well { --washi-tag-lift: calc(0.4 * var(--washi-tag-h)) !important }`;

const READ = () => {
  const card = document.querySelector(".controls-card");
  const cb = card.getBoundingClientRect();
  const padTop = parseFloat(getComputedStyle(card).paddingTop) || 0;
  const liveTop = cb.top + card.clientTop + padTop;
  const inter = [
    ...card.querySelectorAll(
      'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  });
  let worstHit = 0;
  let who = null;
  for (const tape of card.querySelectorAll(".washi-tag, .zone-row-label")) {
    const ts = getComputedStyle(tape);
    if (+ts.opacity < 0.05) continue;
    const t = tape.getBoundingClientRect();
    for (const el of inter) {
      const b = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(b.right, t.right) - Math.max(b.left, t.left));
      const h = Math.max(
        0,
        Math.min(b.bottom, t.bottom) -
          Math.max(b.top, t.top, card.hasAttribute("data-fold-above") ? liveTop : -Infinity),
      );
      if (w * h > worstHit) {
        worstHit = w * h;
        who = `${(tape.textContent || "").trim().slice(0, 10)} ∩ ${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 14)}`;
      }
    }
  }
  const wells = [...card.querySelectorAll(".tray-well")];
  const rows = wells.map((well, i) => {
    const tape = well.querySelector(":scope > .washi-tag");
    const path = well.querySelector(":scope > .outline-svg .boil-pose.is-active path");
    const t = tape.getBoundingClientRect();
    const wb = well.getBoundingClientRect();
    const prev = wells[i - 1];
    const pb = prev ? prev.getBoundingClientRect() : null;
    return {
      text: (tape.textContent || "").trim().slice(0, 10),
      crossPx: path ? +(path.getBoundingClientRect().top + 0.75 - t.top).toFixed(2) : null,
      aboveOwnEdge: +(wb.top - t.top).toFixed(2),
      /** the daylight between the tape's top and the well above it (negative = it reaches in) */
      toPrevWell: pb ? +(t.top - pb.bottom).toFixed(2) : null,
      padTop: +parseFloat(getComputedStyle(well).paddingTop).toFixed(2),
    };
  });
  const panel = document.querySelector(".control-panel-wrap");
  return {
    worstHit: +worstHit.toFixed(2),
    who,
    wells: rows,
    panelH: +panel.getBoundingClientRect().height.toFixed(2),
  };
};

for (const [name, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await eng.launch();
  for (const [w, h, coarse] of [
    [1440, 900, false],
    [1280, 800, true],
    [390, 844, true],
  ]) {
    const ctx = await b.newContext({
      baseURL: BASE,
      viewport: { width: w, height: h },
      hasTouch: coarse,
      isMobile: w === 1280 ? true : undefined,
    });
    const p = await ctx.newPage();
    await p.goto("/?size=3&difficulty=EASY");
    await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await p.waitForSelector(".ctrl-btn", { timeout: 30000 });
    if (w < 1024) {
      await p.locator(".drawer-tab").click();
      await p.waitForTimeout(900);
    }
    const before = await p.evaluate(READ);
    const tag = await p.addStyleTag({ content: LEVER });
    await p.waitForTimeout(250);
    const after = await p.evaluate(READ);
    await p.evaluate((t) => t.remove(), tag);
    console.log(`\n== ${name} ${w}×${h}${coarse ? " coarse" : ""}`);
    console.log(`   lift 3px : panel ${before.panelH}  worst tape∩control ${before.worstHit} ${before.who ?? ""}`);
    for (const r of before.wells)
      console.log(`       ${r.text.padEnd(10)} cross ${String(r.crossPx).padStart(6)}  above own edge ${String(r.aboveOwnEdge).padStart(6)}  to prev well ${String(r.toPrevWell).padStart(7)}  padT ${r.padTop}`);
    console.log(`   LEVER    : panel ${after.panelH}  worst tape∩control ${after.worstHit} ${after.who ?? ""}`);
    for (const r of after.wells)
      console.log(`       ${r.text.padEnd(10)} cross ${String(r.crossPx).padStart(6)}  above own edge ${String(r.aboveOwnEdge).padStart(6)}  to prev well ${String(r.toPrevWell).padStart(7)}  padT ${r.padTop}`);
    await ctx.close();
  }
  await b.close();
}
