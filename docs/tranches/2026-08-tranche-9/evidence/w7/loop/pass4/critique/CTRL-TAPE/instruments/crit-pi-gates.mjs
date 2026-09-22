/**
 * CRITIC probes · CTRL-TAPE pass 4
 *  A) π from computed PAINT, PROTO DIST vs CONTROL DIST (prod vs prod — the lane compared a dev
 *     server against a preview build).
 *  B) the @property discriminator's mechanism: is "0px" the INITIAL or an inherited value?
 *  C) the moved-bar row's scope: can a bar cover a control the row cannot see?
 *   node crit-pi-gates.mjs <protoURL> <controlURL>
 */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const PROTO = process.argv[2] || "http://127.0.0.1:4245";
const CTL = process.argv[3] || "http://127.0.0.1:4244";

const PAINT = () => {
  const pick = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      text: (el.textContent || "").trim().slice(0, 18),
      box: [+r.width.toFixed(2), +r.height.toFixed(2)],
      font: cs.fontSize,
      family: cs.fontFamily.split(",")[0],
      weight: cs.fontWeight,
      lh: cs.lineHeight,
      color: cs.color,
      ls: cs.letterSpacing,
    };
  };
  const deckTape = [...document.querySelectorAll(".washi-tag")].filter(
    (e) => !e.closest(".controls-card"),
  );
  const axis = document.querySelector(".staging-axis-label");
  const board = document.querySelector(".board-paper, .puzzle-board, svg.board");
  return {
    deck: deckTape.slice(0, 3).map(pick),
    axis: pick(axis),
    board: board
      ? [
          +board.getBoundingClientRect().width.toFixed(2),
          +board.getBoundingClientRect().height.toFixed(2),
        ]
      : null,
    h2InDoc: document.querySelectorAll("h2").length,
  };
};

const cells = [
  { w: 1440, h: 900, touch: false },
  { w: 390, h: 844, touch: true },
];

for (const [name, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await eng.launch();
  for (const c of cells) {
    const read = {};
    for (const [arm, base] of [
      ["proto", PROTO],
      ["control", CTL],
    ]) {
      const ctx = await b.newContext({
        baseURL: base,
        viewport: { width: c.w, height: c.h },
        hasTouch: c.touch,
        isMobile: c.touch,
      });
      const p = await ctx.newPage();
      await p.goto("/?view=gallery&board=critpi");
      await p.waitForTimeout(1400);
      read[arm] = await p.evaluate(PAINT);
      await ctx.close();
    }
    const same = JSON.stringify(read.proto) === JSON.stringify(read.control);
    console.log(
      `PI ${name} ${c.w}x${c.h} touch=${c.touch} identical=${same}\n  proto=${JSON.stringify(read.proto)}\n  ctrl =${JSON.stringify(read.control)}`,
    );
  }

  // B + C on the proto only, at the rail.
  const ctx = await b.newContext({
    baseURL: PROTO,
    viewport: { width: 1440, height: 900 },
  });
  const p = await ctx.newPage();
  await p.goto("/?size=3&difficulty=EASY&board=critgate");
  await p.waitForSelector(".ctrl-btn", { timeout: 30000 });
  await p.waitForTimeout(800);

  const regB = await p.evaluate(() => {
    const card = document.querySelector(".controls-card");
    const root = document.documentElement;
    const readCard = () => getComputedStyle(card).getPropertyValue("--pin-band").trim();
    const live = readCard();
    card.style.setProperty("--pin-band", "zzz-not-a-length");
    const invalidNoAncestor = readCard();
    card.style.removeProperty("--pin-band");
    // now give the ANCESTOR a different value and repeat
    root.style.setProperty("--pin-band", "7px");
    card.style.setProperty("--pin-band", "zzz-not-a-length");
    const invalidWithAncestor = readCard();
    card.style.removeProperty("--pin-band");
    root.style.removeProperty("--pin-band");
    return { live, invalidNoAncestor, invalidWithAncestor };
  });
  console.log(`PROPERTY ${name} ${JSON.stringify(regB)}`);

  const regC = await p.evaluate(() => {
    const card = document.querySelector(".controls-card");
    const bar = document.querySelector(".action-bar");
    const probe = () => {
      const c = card.getBoundingClientRect();
      const b = bar.getBoundingClientRect();
      const clipTop = c.top + card.clientTop;
      const clipBottom = clipTop + card.clientHeight;
      let covers = 0;
      for (const el of card.querySelectorAll(
        'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])',
      )) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const vt = Math.max(r.top, clipTop),
          vb = Math.min(r.bottom, clipBottom);
        if (vb - vt <= 0) continue;
        const w = Math.max(0, Math.min(r.right, b.right) - Math.max(r.left, b.left));
        const h = Math.max(0, Math.min(vb, b.bottom) - Math.max(vt, b.top));
        covers = Math.max(covers, w * h);
      }
      return +covers.toFixed(2);
    };
    // how many interactive elements does the bar bury OUTSIDE the card, once laid on the board?
    const st = document.createElement("style");
    st.textContent =
      ".action-bar { position: fixed !important; left: 0 !important; top: 30% !important; width: 40vw !important; height: 180px !important; }";
    document.head.appendChild(st);
    const b = bar.getBoundingClientRect();
    let buriedOutside = 0;
    for (const el of document.querySelectorAll(
      'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])',
    )) {
      if (card.contains(el) || bar.contains(el)) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const w = Math.max(0, Math.min(r.right, b.right) - Math.max(r.left, b.left));
      const h = Math.max(0, Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top));
      if (w * h > 0) buriedOutside += w * h;
    }
    const rowSees = probe();
    st.remove();
    return { rowSees, buriedOutsidePx2: +buriedOutside.toFixed(1) };
  });
  console.log(`BARSCOPE ${name} ${JSON.stringify(regC)}`);
  await ctx.close();
  await b.close();
}
