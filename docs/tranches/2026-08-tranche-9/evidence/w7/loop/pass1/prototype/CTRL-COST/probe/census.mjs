#!/usr/bin/env node
/**
 * CTRL-COST PROTOTYPE · CENSUS + I2′ + I3′ + THE PEEK — measured on the real surface, both
 * engines, against the worktree's dev server (127.0.0.1:4233).
 *
 * Rows, each named where the brief names it:
 *   G1/G2  the band names: how many, in how many voices, how many are document headings, and
 *          the name/chip ratio (the r0 spec asserts the same three rows; this reads them raw).
 *   G3     I2′ — no strip lies over an option group, and any strip that exists is drawn.
 *   G4     I3′ — at every scroll state the PINNED name is the band that owns the most of the
 *          scrollport; a state with nothing pinned is a VACUOUS state and is counted as one.
 *   G8     `.controls-card` scrollHeight against the family's ceilings.
 *   G10    the 44×44 floor per dimension, with the three negative controls.
 *   G11    the DOM filter population and the drawn-box count (the boil budget's own number is
 *          read from source by r0's law probe; this is the browser's side of it).
 *   π      hold-to-peek still peeks: the board string changes under a 600ms hold on the
 *          divider and comes back on release (the unit battery's peek row is RED under the
 *          re-cut, so the gesture is measured where it actually runs).
 *
 * Usage:  node census.mjs [outfile]      (BASE=http://127.0.0.1:4233 by default)
 */
import fs from "node:fs";
import { chromium, webkit } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:4233";
const OUT = process.argv[2] || "./census.json";

const CELLS = [
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
  { name: "dock-390x844", w: 390, h: 844, mobile: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true },
];

async function load(page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
  await page.waitForTimeout(1200);
  if (
    await page.evaluate(() =>
      document.documentElement.classList.contains("drawer-closed"),
    )
  ) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES — settle before a box is read
  }
}

/** The whole census, read inside the page. */
const census = () => {
  const card = document.querySelector(".controls-card");
  const voiceOf = (el) => {
    const cs = getComputedStyle(el);
    return [
      cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      (+parseFloat(cs.fontSize)).toFixed(2),
      cs.fontWeight,
      cs.textTransform,
    ].join(" · ");
  };
  const heads = Array.from(card.querySelectorAll(".section-heading"));
  const names = heads.map((el) => ({
    text: el.innerText.replace(/\s+/g, " ").trim(),
    voice: voiceOf(el),
    rank: el.closest("h1,h2,h3,h4,h5,h6")?.tagName ?? "—",
  }));
  const groups = Array.from(card.querySelectorAll("[role=group]")).map((g) => {
    const namer = document.getElementById(g.getAttribute("aria-labelledby") || "");
    return {
      name: namer?.innerText.replace(/\s+/g, " ").trim() ?? null,
      namerTag: namer?.tagName ?? null,
      voice: namer ? voiceOf(namer) : null,
    };
  });

  // ── I2′ · a strip is a full-width bar that lies OVER content; it must not cover an option
  //    group, and if one exists at all it must be drawn (a border or a HandDrawnOutline).
  const port = card.getBoundingClientRect();
  const strips = Array.from(card.querySelectorAll(".action-bar"));
  const over = (a, b) => {
    const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return (x * y) / Math.max(1, b.width * b.height);
  };
  let worstStrip = 0;
  for (const s of strips)
    for (const g of card.querySelectorAll("[role=group]"))
      worstStrip = Math.max(worstStrip, over(s.getBoundingClientRect(), g.getBoundingClientRect()));

  // ── the five settings' CHOSEN chips, wholly inside the scrollport at scrollTop 0
  card.scrollTop = 0;
  const chosen = Array.from(card.querySelectorAll('.ctrl-btn[aria-pressed="true"]'));
  const inPort = (r) => r.top >= port.top - 0.5 && r.bottom <= port.bottom + 0.5;
  const chosenOnScreen = chosen.filter((c) => inPort(c.getBoundingClientRect())).length;

  // ── the tap floor, per dimension, with the negative controls in the same run
  const FLOOR = 44;
  const ok = (w, h) => ({ wOK: w >= FLOOR - 0.01, hOK: h >= FLOOR - 0.01 });
  const targets = Array.from(
    card.querySelectorAll("button.icon-btn, button.ctrl-btn, .act-face, a.leave-link"),
  ).filter((el) => el.getBoundingClientRect().width > 0);
  const boxes = targets.map((el) => {
    const r = el.getBoundingClientRect();
    return {
      what: el.className.toString().slice(0, 40),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      ...ok(r.width, r.height),
    };
  });

  const filters = Array.from(document.querySelectorAll("svg filter")).map((f) => f.id);

  return {
    names: names.map((n) => n.text),
    nameRows: names,
    voices: [...new Set(names.map((n) => n.voice))],
    docHeadings: names.filter((n) => n.rank !== "—").length,
    groups,
    groupVoices: [...new Set(groups.map((g) => g.voice))],
    groupsNamedByH2: groups.filter((g) => g.namerTag === "H2").length,
    optionPx: +parseFloat(getComputedStyle(card.querySelector(".ctrl-btn")).fontSize).toFixed(2),
    namePx: +parseFloat(getComputedStyle(heads[0]).fontSize).toFixed(2),
    strips: strips.length,
    worstStripCoverage: +worstStrip.toFixed(3),
    chosenChips: chosen.length,
    chosenOnScreen,
    cardScrollHeight: card.scrollHeight,
    cardClientHeight: card.clientHeight,
    tapTargets: boxes.length,
    tapFloorFails: boxes.filter((b) => !b.wOK || !b.hOK),
    tapWorst: {
      w: Math.min(...boxes.map((b) => b.w)),
      h: Math.min(...boxes.map((b) => b.h)),
    },
    negativeControls: [
      { w: 43, h: 60, ...ok(43, 60) },
      { w: 60, h: 43, ...ok(60, 43) },
      { w: 44, h: 44, ...ok(44, 44) },
    ],
    filterCount: filters.length,
    filterIds: filters,
    drawnBoxes: card.querySelectorAll("svg.outline-svg").length,
  };
};

/** I3′ — the pinned name against the band that owns the scrollport, over 5 scroll states. */
const pinSweep = () => {
  const card = document.querySelector(".controls-card");
  // THE SCROLLPORT IS THE PADDING BOX, not the border box: a sticky child's `top: 0` parks it
  // at the CONTENT edge, which is the card's padding-top below its border box. Reading the
  // border box is how a correct pin reads as no pin at all (measured: 5 vacuous states).
  const cs = getComputedStyle(card);
  const pad = { t: parseFloat(cs.paddingTop) || 0, b: parseFloat(cs.paddingBottom) || 0 };
  const box = card.getBoundingClientRect();
  const port = {
    top: box.top + pad.t,
    bottom: box.bottom - pad.b,
    height: box.height - pad.t - pad.b,
  };
  const bands = Array.from(card.querySelectorAll(".cost-band"));
  const states = [];
  const max = card.scrollHeight - card.clientHeight;
  for (let i = 0; i < 5; i++) {
    card.scrollTop = Math.round((max * i) / 4);
    // read after the layout the assignment forces
    const owner = bands
      .map((b) => {
        const r = b.getBoundingClientRect();
        const vis =
          Math.max(0, Math.min(r.bottom, port.bottom) - Math.max(r.top, port.top)) /
          Math.max(1, port.height);
        return {
          name: b.querySelector(".section-heading").innerText.trim(),
          vis: +vis.toFixed(3),
        };
      })
      .sort((a, b) => b.vis - a.vis)[0];
    // PINNED = a band head whose own top is within a hair of the scrollport's top edge.
    const pinned = bands
      .map((b) => b.querySelector(".cost-band-head"))
      .filter((h) => Math.abs(h.getBoundingClientRect().top - port.top) < 2.5)
      .map((h) => h.querySelector(".section-heading").innerText.trim());
    states.push({
      scrollTop: card.scrollTop,
      pinned: pinned.length ? pinned[pinned.length - 1] : null,
      owner,
    });
  }
  card.scrollTop = 0;
  return {
    states,
    violations: states.filter((s) => s.pinned !== s.owner.name).length,
    vacuous: states.filter((s) => s.pinned === null).length,
  };
};

async function peekCheck(page) {
  // The laminate MOUNTS on the first peek (`v-if="peekTouched"`) and carries `.is-shown`
  // while the hold lasts — so its birth proves the recognizer fired and its class proves the
  // key is down. Nothing about the board's own text moves, which is why a digit diff reads
  // false here whether the peek works or not.
  const state = () =>
    page.evaluate(() => {
      const l = document.querySelector(".answer-key-laminate");
      return { mounted: !!l, shown: !!l?.classList.contains("is-shown") };
    });
  const box = await page.locator(".peek-hold-surface").first().boundingBox();
  if (!box) return { ran: false };
  const before = await state();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(700);
  const during = await state();
  await page.mouse.up();
  await page.waitForTimeout(400);
  const after = await state();
  return {
    ran: true,
    before,
    peeked: during.mounted && during.shown,
    released: !after.shown,
  };
}

const out = {};
for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const cell of CELLS) {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && engine === "chromium",
      deviceScaleFactor: cell.mobile ? 3 : 1,
      baseURL: BASE,
    });
    const page = await ctx.newPage();
    await load(page);
    const key = `${cell.name}-${engine}`;
    out[key] = await page.evaluate(census);
    out[key].ratio = +(out[key].namePx / out[key].optionPx).toFixed(4);
    if (cell.name !== "land-900x500") out[key].i3prime = await page.evaluate(pinSweep);
    if (cell.name === "desk-1280x800") out[key].peek = await peekCheck(page);
    console.log(
      key,
      JSON.stringify({
        names: out[key].names.length,
        voices: out[key].voices.length,
        h2: out[key].groupsNamedByH2,
        ratio: out[key].ratio,
        strips: out[key].strips,
        chips: `${out[key].chosenOnScreen}/${out[key].chosenChips}`,
        scrollH: out[key].cardScrollHeight,
        floorFails: out[key].tapFloorFails.length,
        i3: out[key].i3prime
          ? `${out[key].i3prime.violations} viol / ${out[key].i3prime.vacuous} vacuous`
          : "—",
        peek: out[key].peek ?? "—",
      }),
    );
    await ctx.close();
  }
  await browser.close();
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("wrote", OUT);
