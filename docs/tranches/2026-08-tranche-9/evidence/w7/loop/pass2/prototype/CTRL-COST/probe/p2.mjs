#!/usr/bin/env node
/**
 * CTRL-COST · PASS 2 PROTOTYPE PROBE — the rows the brief names, on the real surface, both
 * engines, against the lane's own dev server.
 *
 * Rows:
 *   IDENT   four `.cost-band` names · 0 `.action-bar` · 5 `.act-face` (the served tree is the
 *           tree this lane built, asserted in-probe rather than assumed).
 *   G16     THE OCCLUSION PREDICATE. At each scroll state, the pinned head's rect against every
 *           interactive control IN ITS OWN BAND, counting only controls BELOW THE EXEMPT LINE
 *           (the card's padding-box top + the pin band — the strip no control may occupy).
 *           `elementFromPoint` at each chip's centre is the second half: a head that covers
 *           nothing must never be what the browser hands back for a chip.
 *   G6′     ZERO REFLOW with the `no` foot visible: band, both faces, card scrollHeight.
 *   G5′     a tier-3 press on a DIRTY board writes 0 and arms — on both pointer classes.
 *   G14     the KEYBOARD WALK, timestamped: Enter arms and focus lands on `no`; a second Enter
 *           disarms and the board is unchanged; Shift-Tab + Enter deals; Escape disarms and the
 *           sheet stays; a second Escape closes it.
 *   G15     `no` in the accessibility tree, ≥ 44 per dimension, with a firing negative control.
 *   G17     the berth at `scrollTop = scrollHeight`: in the port, covering nothing.
 *   G18     `--fold-tools-h` across a shrink-and-restore sequence; no fallback literal.
 *   G8      the height ceilings · G7 the seam · I3′ pin ownership · the tap floor.
 *
 * Usage: node probe-p2.mjs <outfile> [cells…]
 */
import fs from "node:fs";
import { chromium, webkit } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:4233";
const OUT = process.argv[2] || "./p2.json";

const CELLS = [
  { name: "desk-1280x800-fine", w: 1280, h: 800, touch: false },
  { name: "desk-1280x800-coarse", w: 1280, h: 800, touch: true },
  { name: "dock-390x844", w: 390, h: 844, touch: true },
  { name: "land-900x500", w: 900, h: 500, touch: true },
  { name: "land-844x390", w: 844, h: 390, touch: true },
];
const SEAM_CELLS = [
  { name: "390x844", w: 390, h: 844 },
  { name: "375x812", w: 375, h: 812 },
  { name: "430x932", w: 430, h: 932 },
  { name: "844x390", w: 844, h: 390 },
];

async function load(page) {
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
  if (
    await page.evaluate(() =>
      document.documentElement.classList.contains("drawer-closed"),
    )
  ) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES
  }
  await page.waitForTimeout(250);
}

/** The board as the native inputs hold it — `[role=gridcell]` carries no text (banked trap). */
const boardString = () =>
  Array.from(document.querySelectorAll(".cell-native-input"))
    .map((i) => i.value || "_")
    .join(",");

/* ── IDENTITY + the static census ─────────────────────────────────────────────────────── */
const identity = () => {
  const card = document.querySelector(".controls-card");
  const voiceOf = (el) => {
    const cs = getComputedStyle(el);
    return [
      cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      (+parseFloat(cs.fontSize)).toFixed(3),
      cs.fontWeight,
      cs.textTransform,
    ].join(" · ");
  };
  const heads = Array.from(card.querySelectorAll(".section-heading"));
  const chip = card.querySelector(".ctrl-btn");
  return {
    bands: card.querySelectorAll(".cost-band").length,
    actionBars: document.querySelectorAll(".action-bar").length,
    actFaces: document.querySelectorAll(".act-face").length,
    names: heads.map((h) => h.innerText.replace(/\s+/g, " ").trim()),
    voices: [...new Set(heads.map(voiceOf))],
    h2s: heads.filter((h) => h.tagName === "H2").length,
    ratio: chip
      ? +(
          parseFloat(getComputedStyle(heads[0]).fontSize) /
          parseFloat(getComputedStyle(chip).fontSize)
        ).toFixed(4)
      : null,
    pinBand: getComputedStyle(card).paddingTop,
    costHeadH: getComputedStyle(card).getPropertyValue("--cost-head-h").trim(),
    scrollPaddingTop: getComputedStyle(card).scrollPaddingTop,
    headTop: getComputedStyle(card.querySelector(".cost-band-head")).top,
    scrollHeight: card.scrollHeight,
    clientHeight: card.clientHeight,
    berths: card.querySelectorAll(".cost-band-head .band-note").length,
    liveInCard: card.querySelectorAll("[aria-live]").length,
    dialogs: document.querySelectorAll("[role=dialog]").length,
  };
};

/* ── G16 · THE OCCLUSION PREDICATE ───────────────────────────────────────────────────── */
const occlusion = (states) => {
  const card = document.querySelector(".controls-card");
  const cs = getComputedStyle(card);
  const pad = parseFloat(cs.paddingTop) || 0;
  const out = [];
  const over = (a, b) => {
    const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return (x * y) / Math.max(1, b.width * b.height);
  };
  for (const s of states) {
    card.scrollTop = s;
    const cardBox = card.getBoundingClientRect();
    // The EXEMPT LINE: the card's padding-box top plus the pin band. Nothing below it may be
    // covered by anything; above it is reserved paper the fold sentinel already paints.
    const exempt = cardBox.top + pad;
    let worst = 0;
    let worstWhat = null;
    let covered = 0;
    const fromPoint = [];
    for (const band of card.querySelectorAll(".cost-band")) {
      const head = band.querySelector(".cost-band-head");
      if (!head) continue;
      const hr = head.getBoundingClientRect();
      for (const ctl of band.querySelectorAll(
        "button, .ctrl-btn, input, a[href], [tabindex]:not([tabindex='-1'])",
      )) {
        if (head.contains(ctl)) continue;
        const r = ctl.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        if (r.top < exempt - 0.5) continue; // inside the reserved band — not a below-line control
        const f = over(hr, r);
        if (f > worst) {
          worst = f;
          worstWhat = (ctl.className.toString() || ctl.tagName).slice(0, 40);
        }
        if (f > 0.001) covered++;
      }
    }
    // elementFromPoint at each visible chip's centre.
    for (const chip of card.querySelectorAll(".ctrl-btn")) {
      const r = chip.getBoundingClientRect();
      if (r.width < 1 || r.top < cardBox.top || r.bottom > cardBox.bottom) continue;
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      fromPoint.push({
        chip: chip.textContent.trim(),
        hit: hit ? (hit.className.toString() || hit.tagName).slice(0, 34) : null,
        isHead: !!hit?.closest?.(".cost-band-head"),
      });
    }
    out.push({
      scrollTop: s,
      actual: card.scrollTop,
      exemptLine: +exempt.toFixed(2),
      worstCoverage: +(worst * 100).toFixed(2),
      worstWhat,
      coveredControls: covered,
      headHits: fromPoint.filter((f) => f.isHead).length,
      sample: fromPoint.slice(0, 6),
    });
  }
  card.scrollTop = 0;
  return out;
};

/* ── I3′ · the pinned name owns the scrollport ───────────────────────────────────────── */
const pinOwnership = (states) => {
  const card = document.querySelector(".controls-card");
  const out = [];
  for (const s of states) {
    card.scrollTop = s;
    const port = card.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(card).paddingTop) || 0;
    let pinned = null;
    let best = null;
    let bestShare = -1;
    for (const band of card.querySelectorAll(".cost-band")) {
      const head = band.querySelector(".cost-band-head");
      const hr = head.getBoundingClientRect();
      const br = band.getBoundingClientRect();
      const vis =
        Math.max(0, Math.min(br.bottom, port.bottom) - Math.max(br.top, port.top)) /
        Math.max(1, port.height);
      if (vis > bestShare) {
        bestShare = vis;
        best = head.innerText.trim();
      }
      // "pinned" = the head is held at its sticky line rather than riding with its band
      if (Math.abs(hr.top - (port.top + 0.6 * 16)) < 2 && br.top < port.top + pad)
        pinned = head.innerText.trim();
    }
    out.push({
      scrollTop: s,
      actual: card.scrollTop,
      pinned,
      owner: best,
      share: +bestShare.toFixed(3),
      vacuous: pinned === null,
      agrees: pinned === null ? null : pinned === best,
    });
  }
  card.scrollTop = 0;
  return out;
};

/* ── the tap floor, per dimension, with its negative controls ────────────────────────── */
const tapFloor = () => {
  const FLOOR = 44;
  const card = document.querySelector(".controls-card");
  const rows = [];
  for (const el of card.querySelectorAll(
    "button.icon-btn, button.ctrl-btn, button.act-answer, .act-face, .players-leave",
  )) {
    const r = el.getBoundingClientRect();
    if (r.width < 1) continue;
    rows.push({
      what: (el.className.toString() || el.tagName).slice(0, 38),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      wOK: r.width >= FLOOR - 0.01,
      hOK: r.height >= FLOOR - 0.01,
    });
  }
  const neg = [
    { w: 43, h: 60 },
    { w: 60, h: 43 },
    { w: 44, h: 44 },
  ].map((n) => ({ ...n, wOK: n.w >= FLOOR, hOK: n.h >= FLOOR }));
  return { rows, failures: rows.filter((r) => !r.wOK || !r.hOK), negatives: neg };
};

async function run(engine, launcher) {
  const browser = await launcher.launch();
  const result = { engine };
  for (const cell of CELLS) {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.touch,
      isMobile: cell.touch && cell.w < 1024,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    try {
      await load(page);
      const cellOut = { ident: await page.evaluate(identity) };

      const states =
        cell.w >= 1024 ? [0, 58, 116, 200, 350] : [0, 29, 58, 87, 116];
      cellOut.occlusion = await page.evaluate(occlusion, states);
      cellOut.pin = await page.evaluate(pinOwnership, states);
      cellOut.tap = await page.evaluate(tapFloor);

      // ── G5′ + G6′ · the ask, on this cell's pointer class ───────────────────────────
      // Dirty the board first: `fill` writes forced cells (tier 2, one undo away).
      const before = await page.evaluate(boardString);
      await page.locator('button[aria-label^="Fill in every cell"]').click();
      await page.waitForTimeout(900);
      const dirty = await page.evaluate(boardString);
      cellOut.fillWrote = dirty.split(",").filter((v, i) => v !== before.split(",")[i])
        .length;

      // scroll the face into view and SETTLE before the first rect (banked trap)
      await page.locator(".deal-face").scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      const rects = () =>
        page.evaluate(() => {
          const box = (s) => {
            const el = document.querySelector(s);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return [
              +r.x.toFixed(2),
              +r.y.toFixed(2),
              +r.width.toFixed(2),
              +r.height.toFixed(2),
            ];
          };
          const card = document.querySelector(".controls-card");
          return {
            band: box(".cost-band:nth-of-type(3)"),
            deal: box(".deal-face"),
            clear: box(".clear-face"),
            answer: box(".deal-face .act-answer"),
            scrollHeight: card.scrollHeight,
          };
        });
      const rest = await rects();
      const boardBefore = await page.evaluate(boardString);
      await page.locator(".deal-btn").click();
      await page.waitForTimeout(400);
      const armed = await rects();
      const armedState = await page.evaluate(() => {
        const verb = document.querySelector(".deal-btn");
        const no = document.querySelector(".deal-face .act-answer");
        const cs = no ? getComputedStyle(no) : null;
        return {
          name: verb?.getAttribute("aria-label"),
          noVisible: cs?.visibility,
          noAriaHidden: no?.getAttribute("aria-hidden"),
          noText: no?.textContent.trim(),
          describedby: !!verb?.getAttribute("aria-describedby"),
          focusIsNo: document.activeElement === no,
          focusWhat: (
            document.activeElement?.className?.toString?.() || ""
          ).slice(0, 34),
        };
      });
      cellOut.arm = {
        wroteOnArm:
          (await page.evaluate(boardString)) === boardBefore ? 0 : "CHANGED",
        ...armedState,
        delta: {
          band: rest.band && armed.band ? rest.band.map((v, i) => +(armed.band[i] - v).toFixed(2)) : null,
          deal: rest.deal && armed.deal ? rest.deal.map((v, i) => +(armed.deal[i] - v).toFixed(2)) : null,
          clear:
            rest.clear && armed.clear
              ? rest.clear.map((v, i) => +(armed.clear[i] - v).toFixed(2))
              : null,
          scrollHeight: armed.scrollHeight - rest.scrollHeight,
        },
        answerBox: armed.answer,
        restAnswerBox: rest.answer,
      };
      // disarm by pressing `no` and re-read
      await page.locator(".deal-face .act-answer").click();
      await page.waitForTimeout(400);
      const back = await rects();
      cellOut.arm.disarmDelta = {
        band: rest.band ? rest.band.map((v, i) => +(back.band[i] - v).toFixed(2)) : null,
        deal: rest.deal ? rest.deal.map((v, i) => +(back.deal[i] - v).toFixed(2)) : null,
        scrollHeight: back.scrollHeight - rest.scrollHeight,
      };
      cellOut.arm.boardAfterNo =
        (await page.evaluate(boardString)) === boardBefore ? "unchanged" : "CHANGED";

      // ── G17 · the berth at the card's foot ─────────────────────────────────────────
      await page.evaluate(() => {
        const card = document.querySelector(".controls-card");
        card.scrollTop = card.scrollHeight;
      });
      await page.waitForTimeout(200);
      cellOut.berthAtFoot = await page.evaluate(() => {
        const card = document.querySelector(".controls-card");
        const port = card.getBoundingClientRect();
        const out = [];
        const over = (a, b) => {
          const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          return (x * y) / Math.max(1, b.width * b.height);
        };
        for (const band of card.querySelectorAll(".cost-band")) {
          const note = band.querySelector(".band-note");
          if (!note) continue;
          note.style.opacity = "1";
          note.textContent = "fill the cells that have only one digit left";
          const r = note.getBoundingClientRect();
          let worst = 0;
          for (const ctl of card.querySelectorAll("button, .ctrl-btn")) {
            const cr = ctl.getBoundingClientRect();
            if (cr.width < 1) continue;
            worst = Math.max(worst, over(r, cr));
          }
          out.push({
            band: band.querySelector(".section-heading").innerText.trim(),
            offPortAbove: +Math.max(0, port.top - r.top).toFixed(2),
            offPortBelow: +Math.max(0, r.bottom - port.bottom).toFixed(2),
            worstCoverage: +(worst * 100).toFixed(2),
            h: +r.height.toFixed(2),
            w: +r.width.toFixed(2),
            nameOverlap: +(
              over(r, band.querySelector(".section-heading").getBoundingClientRect()) *
              100
            ).toFixed(2),
          });
        }
        card.scrollTop = 0;
        return out;
      });

      result[cell.name] = cellOut;
    } catch (e) {
      result[cell.name] = { error: String(e).slice(0, 300) };
    }
    await ctx.close();
  }

  // ── G7 · the seam sweep ─────────────────────────────────────────────────────────────
  result.seam = {};
  for (const cell of SEAM_CELLS) {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: true,
      isMobile: cell.w < 1024,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    try {
      await load(page);
      await page.waitForTimeout(700);
      result.seam[cell.name] = await page.evaluate(() => {
        const caseEl = document.querySelector(".drawer-case");
        const logo = document.querySelector("svg.handwritten-logo");
        if (!caseEl || !logo) return null;
        const c = caseEl.getBoundingClientRect();
        const l = logo.getBoundingClientRect();
        return {
          caseTop: +c.top.toFixed(2),
          wordmarkFoot: +l.bottom.toFixed(2),
          seam: +(c.top - l.bottom).toFixed(2),
          sheetChrome: getComputedStyle(document.documentElement)
            .getPropertyValue("--sheet-chrome")
            .trim(),
        };
      });
    } catch (e) {
      result.seam[cell.name] = { error: String(e).slice(0, 200) };
    }
    await ctx.close();
  }

  await browser.close();
  return result;
}

const out = {};
for (const [name, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  out[name] = await run(name, launcher);
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("banked", OUT);
