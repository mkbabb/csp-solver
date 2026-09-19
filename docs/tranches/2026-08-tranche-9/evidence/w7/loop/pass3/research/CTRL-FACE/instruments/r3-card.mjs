/**
 * CTRL-FACE pass 3 RESEARCH — the HEAD card census at `74a2b5d9`.
 *
 * Descended from `pass2/prototype/CTRL-FACE/probe/p2-card.mjs` (copied beside this file as
 * `p2-card.COPY.mjs`, per the frozen-record law: an r0/pass-2 instrument is copied and
 * re-pointed, never re-cut in place). What this adds, and why:
 *
 *   A. THE CAPTION LANE, after the fold. `74a2b5d9` renamed the second caption
 *      `candidates` → `what fits` (GameControlPanel.vue:987, ballot T9-B1). A caption with a
 *      SPACE can wrap inside its own lane; `candidates` could not. Line count is read from
 *      `getClientRects().length`, the lane's own width from the flex item, and the word's
 *      unbreakable width from a nowrap clone — at the HAND rung it ships with AND at the
 *      PRINTED rung CTRL-FACE proposes (applied in-page, reverted in the same evaluate).
 *   B. THE OVERRUN'S SECOND BASIS. HEAD paints the scribble on the BUTTON with
 *      `background-size: var(--scribble-width, 4ch)`. Pass 2 re-based it on the word's content
 *      box and read 1.200 by construction (critique F4). This reads the mark against the GLYPH
 *      ADVANCE (`TextMetrics.width` in the node's own computed font) and against the glyph INK
 *      (`actualBoundingBoxLeft/Right`), so a band can be cut on a basis that moves.
 *   C. PAPER OVER INK. The tape's painted box against its own rendered word, both ends.
 *   D. LAW 14. Every hover affordance an open and a shut tab head takes, read by diffing
 *      computed style across a real hover.
 *   E. THE DECK'S TWO PINS, with the chip pinned through the URL (`?size=&difficulty=`,
 *      persistence.ts:290-299), so paired runs cannot disagree on which tier is bold.
 *
 * Read-only on files. In-page it opens the dock's own sheet and makes three ablations, each
 * reverted inside the same `evaluate`.
 *
 *   BASE=http://127.0.0.1:4234/ OUT=<file> THEME=light node r3-card.mjs
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const OUT = process.env.OUT || "/tmp/r3-card.jsonl";
const THEME = process.env.THEME || "light";
const CELLS = (
  process.env.CELLS ||
  "dock-390x844,dock-375x812,dock-320x568,land-900x500,desk-1280x800,pad-768x1024"
)
  .split(",")
  .map((n) => {
    const [w, h] = n.split("-")[1].split("x").map(Number);
    return { name: n, w, h, mobile: w < 1024 };
  });

const rows = [];

function readCard(worst) {
  const card = document.querySelector(".controls-card");
  if (!card) return { error: "no .controls-card" };
  const R = (r) => ({
    l: +r.left.toFixed(2),
    t: +r.top.toFixed(2),
    r: +r.right.toFixed(2),
    b: +r.bottom.toFixed(2),
    w: +r.width.toFixed(2),
    h: +r.height.toFixed(2),
  });
  const inkBox = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return R(range.getBoundingClientRect());
  };
  const voice = (el) => {
    const cs = getComputedStyle(el);
    return [
      cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      (+parseFloat(cs.fontSize)).toFixed(2),
      cs.fontWeight,
      cs.textTransform,
    ].join(" · ");
  };
  const metrics = (el, text) => {
    const cs = getComputedStyle(el);
    const cv = document.createElement("canvas").getContext("2d");
    cv.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = cv.measureText(text);
    return {
      advance: +m.width.toFixed(3),
      inkL: +(m.actualBoundingBoxLeft ?? 0).toFixed(3),
      inkR: +(m.actualBoundingBoxRight ?? 0).toFixed(3),
      asc: +(m.actualBoundingBoxAscent ?? 0).toFixed(3),
      desc: +(m.actualBoundingBoxDescent ?? 0).toFixed(3),
      font: cv.font,
    };
  };

  // ── ROW 1/2/3 — r0's own heading reading ────────────────────────────────────────────────
  const pick = (sel, kind) =>
    Array.from(card.querySelectorAll(sel)).map((el) => ({
      kind,
      text: el.innerText.replace(/\s+/g, " ").trim(),
      voice: voice(el),
      rank:
        el.closest("h1,h2,h3,h4,h5,h6")?.tagName ??
        (el.getAttribute("role") === "heading" ? "role=heading" : "—"),
    }));
  const names = [
    ...pick(".section-heading", "staged eyebrow"),
    ...pick(".tray-well > .washi-tag", "compartment tape"),
    ...pick(".zone-row-label", "row caption"),
  ];
  const chipEl = card.querySelector(".ctrl-btn");
  const optionPx = chipEl ? +parseFloat(getComputedStyle(chipEl).fontSize).toFixed(2) : null;
  const namePx = names.length ? Math.max(...names.map((n) => +n.voice.split(" · ")[1])) : null;

  const printed = Array.from(card.querySelectorAll("*"))
    .filter((el) => el.children.length === 0 && el.innerText && el.innerText.trim())
    .map((el) => ({ text: el.innerText.trim().slice(0, 18), v: voice(el) }))
    .filter((x) => /^Fraunces/.test(x.v));

  // ── A. THE CAPTION LANE ─────────────────────────────────────────────────────────────────
  const nowrapWidth = (el, text) => {
    const probe = document.createElement("span");
    const cs = getComputedStyle(el);
    probe.style.cssText =
      `position:absolute;visibility:hidden;white-space:pre;left:-9999px;` +
      `font-family:${cs.fontFamily};font-size:${cs.fontSize};font-weight:${cs.fontWeight};` +
      `letter-spacing:${cs.letterSpacing};text-transform:${cs.textTransform};`;
    probe.textContent = text;
    document.body.appendChild(probe);
    const w = +probe.getBoundingClientRect().width.toFixed(2);
    probe.remove();
    return w;
  };
  const readLane = () =>
    Array.from(card.querySelectorAll(".zone-row-label")).map((el) => {
      const row = el.closest(".zone-row");
      const opts = row?.querySelector(".options-row");
      const cs = getComputedStyle(el);
      const t = el.innerText.replace(/\s+/g, " ").trim();
      const longest = t.split(" ").reduce((a, w) => (w.length > a.length ? w : a), "");
      return {
        text: t,
        voice: voice(el),
        lines: el.getClientRects().length,
        rect: R(el.getBoundingClientRect()),
        flexBasis: cs.flexBasis,
        lineHeight: cs.lineHeight,
        whole: nowrapWidth(el, t),
        longestWord: longest,
        minContent: nowrapWidth(el, longest),
        rowW: row ? +row.getBoundingClientRect().width.toFixed(2) : null,
        rowWrap: row ? getComputedStyle(row).flexWrap : null,
        optsW: opts ? +opts.getBoundingClientRect().width.toFixed(2) : null,
        stacked: !!row?.classList.contains("zone-row-stacked"),
      };
    });
  const laneShipped = readLane();
  // the same lane at the PRINTED rung CTRL-FACE proposes
  const st1 = document.createElement("style");
  st1.textContent =
    ".zone-row-label{font-family:var(--font-display)!important;font-size:var(--type-heading)!important;" +
    "font-weight:800!important;text-transform:lowercase!important;line-height:1.2!important;}";
  document.head.appendChild(st1);
  void card.offsetHeight;
  const lanePrinted = readLane();
  const cardHPrinted = +card.scrollHeight.toFixed(2);
  st1.remove();
  void card.offsetHeight;

  // ── B. THE CHIPS + the overrun's three bases ────────────────────────────────────────────
  const chips = Array.from(card.querySelectorAll(".ctrl-btn")).map((b) => {
    const cs = getComputedStyle(b);
    const word = b.querySelector(".ctrl-word");
    const markHost = word || b;
    const mcs = getComputedStyle(markHost);
    const bs = mcs.backgroundSize;
    const text = b.innerText.replace(/\s+/g, " ").trim();
    const ink = inkBox(markHost);
    const box = R(markHost.getBoundingClientRect());
    const contentW =
      box.w - parseFloat(mcs.paddingLeft || 0) - parseFloat(mcs.paddingRight || 0);
    let markW = null;
    if (bs && bs !== "auto") {
      const first = bs.split(" ")[0];
      if (first.endsWith("%")) markW = (parseFloat(first) / 100) * contentW;
      else if (first.endsWith("px")) markW = parseFloat(first);
    }
    const m = metrics(b, text);
    return {
      text,
      pressed: b.getAttribute("aria-pressed"),
      voice: voice(b),
      box,
      hasCtrlWord: !!word,
      bg: bs,
      scribbleVar: cs.getPropertyValue("--scribble-width").trim(),
      ghostVar: cs.getPropertyValue("--ghost-width").trim(),
      markW: markW === null ? null : +markW.toFixed(3),
      contentW: +contentW.toFixed(3),
      inkW: +(ink.r - ink.l).toFixed(3),
      advance: m.advance,
      glyphInk: +(m.inkL + m.inkR).toFixed(3),
      overrun_box: markW ? +(markW / contentW).toFixed(4) : null,
      overrun_range: markW ? +(markW / (ink.r - ink.l)).toFixed(4) : null,
      overrun_advance: markW ? +(markW / m.advance).toFixed(4) : null,
      overrun_glyphink: markW ? +(markW / (m.inkL + m.inkR)).toFixed(4) : null,
    };
  });

  // ── tab head daylight + the ink gate ────────────────────────────────────────────────────
  const tapes = Array.from(card.querySelectorAll(".tray-well > .washi-tag"));
  const heads = Array.from(card.querySelectorAll(".mobile-heading-btn .section-heading"));
  const ov = (a, c) => {
    const x = Math.min(a.r, c.r) - Math.max(a.l, c.l);
    const y = Math.min(a.b, c.b) - Math.max(a.t, c.t);
    return x > 0 && y > 0 ? +(x * y).toFixed(1) : 0;
  };
  const tabRow = [];
  for (const t of tapes) {
    const tb = R(t.getBoundingClientRect());
    for (const h of heads) {
      const hi = inkBox(h);
      tabRow.push({
        tape: t.innerText.trim(),
        head: h.innerText.trim(),
        px2: ov(tb, hi),
        daylight: +(hi.t - tb.b).toFixed(2),
      });
    }
  }
  const caps = Array.from(card.querySelectorAll(".zone-row-label"));
  const ink = [];
  for (const t of tapes) {
    const tb = R(t.getBoundingClientRect());
    for (const c of caps) {
      const ci = inkBox(c);
      if (Math.abs(ci.l - tb.l) > 400) continue;
      const own = metrics(c, c.innerText.trim());
      const w = metrics(c, worst);
      const baseline = ci.b - own.desc;
      ink.push({
        tape: t.innerText.trim(),
        cap: c.innerText.replace(/\s+/g, " ").trim(),
        paperTop: tb.t,
        capInkBottom: ci.b,
        renderedGap: +(tb.t - ci.b).toFixed(2),
        worstDescender: w.desc,
        worstGap: +(tb.t - (baseline + w.desc)).toFixed(2),
      });
    }
  }

  // ── C. PAPER OVER INK, per tape, both ends ──────────────────────────────────────────────
  const paper = tapes.map((t) => {
    const tb = R(t.getBoundingClientRect());
    const ti = inkBox(t);
    const cs = getComputedStyle(t);
    const m = metrics(t, t.innerText.trim());
    return {
      tape: t.innerText.trim(),
      paperH: tb.h,
      inkH: +(ti.b - ti.t).toFixed(2),
      lineHeight: cs.lineHeight,
      fontSize: cs.fontSize,
      topMargin: +(ti.t - tb.t).toFixed(2),
      botMargin: +(tb.b - ti.b).toFixed(2),
      glyphAsc: m.asc,
      glyphDesc: m.desc,
      glyphInkH: +(m.asc + m.desc).toFixed(3),
      paperOverGlyph: +(tb.h - (m.asc + m.desc)).toFixed(3),
      marginTop: cs.marginTop,
    };
  });

  // ── the covenant on the consumer ────────────────────────────────────────────────────────
  const wells = Array.from(card.querySelectorAll(".tray-well"));
  const before = wells.map((w) => +w.getBoundingClientRect().height.toFixed(3));
  const cardH0 = +card.scrollHeight.toFixed(2);
  const st2 = document.createElement("style");
  st2.textContent = ".washi-tag { display: none !important; }";
  document.head.appendChild(st2);
  void card.offsetHeight;
  const after = wells.map((w) => +w.getBoundingClientRect().height.toFixed(3));
  st2.remove();
  void card.offsetHeight;
  const covenant = wells.map((w, i) => ({
    well: w.querySelector(".washi-tag")?.innerText.trim() ?? `#${i}`,
    delta: +(before[i] - after[i]).toFixed(3),
  }));

  // ── contrast ────────────────────────────────────────────────────────────────────────────
  const lum = (c) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  const cardBg = parse(getComputedStyle(card).backgroundColor);
  const ratio = (fg) => {
    const a = lum(fg) + 0.05;
    const b = lum(cardBg) + 0.05;
    return +(Math.max(a, b) / Math.min(a, b)).toFixed(3);
  };
  const contrast = [];
  for (const sel of [
    ".section-heading",
    ".heading-value",
    ".zone-row-label",
    ".washi-tag",
    ".ctrl-btn",
    ".icon-sublabel",
  ])
    for (const el of card.querySelectorAll(sel))
      contrast.push({
        sel,
        text: el.innerText.replace(/\s+/g, " ").trim().slice(0, 14),
        ratio: ratio(parse(getComputedStyle(el).color)),
        present: true,
      });
  const absent = [
    ".section-heading",
    ".heading-value",
    ".zone-row-label",
    ".washi-tag",
    ".ctrl-btn",
    ".icon-sublabel",
  ].filter((s) => card.querySelectorAll(s).length === 0);

  const caseTop = R(card.getBoundingClientRect()).t;
  const firstTape = tapes[0] ? R(tapes[0].getBoundingClientRect()).t : null;

  return {
    names,
    voices: [...new Set(names.map((n) => n.voice))],
    docHeadings: names.filter((n) => n.rank !== "—").length,
    namePx,
    optionPx,
    ratioRow3: namePx && optionPx ? +(namePx / optionPx).toFixed(4) : null,
    printedCount: printed.length,
    printedVoices: [...new Set(printed.map((p) => p.v))],
    printedTexts: printed.map((p) => p.text),
    laneShipped,
    lanePrinted,
    cardHPrinted,
    chips,
    tabRow,
    ink,
    paper,
    covenant,
    contrast,
    contrastAbsent: absent,
    cardScrollHeight: cardH0,
    firstTapeClearance: firstTape === null ? null : +(firstTape - caseTop).toFixed(2),
    headCount: heads.length,
  };
}

// ── D. LAW 14: what a tab head takes on hover, open and shut ──────────────────────────────
async function law14(p) {
  const heads = p.locator(".mobile-heading-btn");
  const n = await heads.count();
  if (!n) return { heads: 0 };
  const read = () =>
    p.evaluate(() =>
      Array.from(document.querySelectorAll(".mobile-heading-btn")).map((b) => {
        const h = b.querySelector(".section-heading");
        const cs = getComputedStyle(h);
        const bcs = getComputedStyle(b);
        return {
          text: h.innerText.trim(),
          expanded: b.getAttribute("aria-expanded"),
          disabled: b.getAttribute("aria-disabled") ?? b.disabled ?? null,
          color: cs.color,
          decoration: cs.textDecorationLine,
          thickness: cs.textDecorationThickness,
          bg: bcs.backgroundColor,
          transform: bcs.transform,
          opacity: bcs.opacity,
        };
      }),
    );
  const rest = await read();
  const hovered = [];
  for (let i = 0; i < n; i++) {
    await heads.nth(i).hover({ force: true });
    await p.waitForTimeout(260);
    hovered.push((await read())[i]);
  }
  await p.mouse.move(0, 0);
  return {
    heads: n,
    hoverable: await p.evaluate(() => matchMedia("(hover: hover)").matches),
    rest,
    hovered,
    delta: rest.map((r, i) => ({
      text: r.text,
      expanded: r.expanded,
      moved: Object.keys(r).filter((k) => k !== "text" && r[k] !== hovered[i][k]),
    })),
  };
}

// ── E. THE DECK'S TWO PINS ────────────────────────────────────────────────────────────────
function readDeck() {
  const band = document.querySelector(".staging-band, .staging-axis")?.closest("*");
  const labels = Array.from(document.querySelectorAll(".staging-axis-label")).map((el) => {
    const cs = getComputedStyle(el);
    return {
      text: el.innerText.trim(),
      classes: el.className,
      family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      size: +parseFloat(cs.fontSize).toFixed(2),
      weight: cs.fontWeight,
      transform: cs.textTransform,
    };
  });
  const chips = Array.from(document.querySelectorAll(".staging-axis .ctrl-btn")).map((b) => {
    const cs = getComputedStyle(b);
    return {
      text: b.innerText.trim(),
      pressed: b.getAttribute("aria-pressed"),
      family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      size: +parseFloat(cs.fontSize).toFixed(2),
      weight: cs.fontWeight,
      transform: cs.textTransform,
      rect: (({ x, y, width, height }) => ({
        x: +x.toFixed(2),
        y: +y.toFixed(2),
        w: +width.toFixed(2),
        h: +height.toFixed(2),
      }))(b.getBoundingClientRect()),
    };
  });
  return {
    labels,
    chips,
    bold: chips.filter((c) => +c.weight >= 700).map((c) => c.text),
    pressed: chips.filter((c) => c.pressed === "true").map((c) => c.text),
    bandH: band ? +band.getBoundingClientRect().height.toFixed(2) : null,
  };
}

for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();
  for (const cell of CELLS) {
    const ctx = await b.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && eng === "chromium",
      deviceScaleFactor: cell.mobile ? 3 : 1,
      colorScheme: THEME,
    });
    const p = await ctx.newPage();
    await p.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await p.waitForSelector(".controls-card", { state: "attached", timeout: 60000 });
    await p.waitForTimeout(1400);
    if (
      await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))
    ) {
      await p.locator(".drawer-tab").click({ force: true });
      await p.waitForTimeout(950); // the sheet SLIDES
    }
    const r = await p.evaluate(readCard, "pgjqy");
    const l14 = cell.mobile ? await law14(p) : { heads: 0, skipped: "no tab regime" };

    // the deck, with the chip PINNED through the URL
    await p.goto(BASE + "?view=gallery&size=3&difficulty=MEDIUM", {
      waitUntil: "domcontentloaded",
    });
    await p.waitForSelector(".staging-axis", { timeout: 60000 });
    await p.waitForTimeout(900);
    const deck = await p.evaluate(readDeck);

    rows.push({ base: BASE, theme: THEME, eng, cell: cell.name, ...r, law14: l14, deck });
    console.log(
      `${eng} ${cell.name}: voices=${r.voices?.length} n=${r.names?.length} row3=${r.ratioRow3} ` +
        `printed=${r.printedCount} cardH=${r.cardScrollHeight} capLines=${r.laneShipped
          ?.map((x) => x.lines)
          .join("/")} printedLines=${r.lanePrinted?.map((x) => x.lines).join("/")} ` +
        `deckBold=${deck.bold?.join(",")}`,
    );
    await ctx.close();
  }
  await b.close();
}
writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log("wrote", OUT, rows.length, "rows");
