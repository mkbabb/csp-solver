/**
 * CTRL-FACE pass 2 — THE CARD CENSUS, one process, both engines, every cell, JSONL out.
 * Consolidated from the pass-1 probes (heading-voice, ink-overlap, overlap-depth, ipad-price,
 * contrast) so one run answers every row the brief prices. Read-only on the page but for the
 * dock's own sheet open and a `display:none` ablation that is reverted in the same evaluate.
 *
 *   BASE=http://127.0.0.1:4234/ OUT=<file> node p2-card.mjs
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const OUT = process.env.OUT || "/tmp/p2-card.jsonl";
const THEME = process.env.THEME || "light";
const CELLS = (process.env.CELLS || "dock-390x844,desk-1280x800,land-900x500,dock-375x812,dock-430x932,rail-1440x900")
  .split(",")
  .map((n) => {
    const [name, dims] = [n, n.split("-")[1]];
    const [w, h] = dims.split("x").map(Number);
    return { name, w, h, mobile: w < 1024 };
  });

const rows = [];

function readCard(worst) {
  const card = document.querySelector(".controls-card");
  if (!card) return { error: "no .controls-card" };
  const R = (r) => ({ l: +r.left.toFixed(2), t: +r.top.toFixed(2), r: +r.right.toFixed(2), b: +r.bottom.toFixed(2) });
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

  // ── ROW 1/2/3: the heading voice, r0's own reading ───────────────────────────────────────
  const pick = (sel, kind) =>
    Array.from(card.querySelectorAll(sel)).map((el) => ({
      kind,
      text: el.innerText.replace(/\s+/g, " ").trim(),
      voice: voice(el),
      rank: el.closest("h1,h2,h3,h4,h5,h6")?.tagName ?? (el.getAttribute("role") === "heading" ? "role=heading" : "—"),
    }));
  const names = [
    ...pick(".section-heading", "staged eyebrow"),
    ...pick(".tray-well > .washi-tag", "compartment tape"),
    ...pick(".zone-row-label", "row caption"),
  ];
  const chipEl = card.querySelector(".ctrl-btn");
  const optionPx = chipEl ? +parseFloat(getComputedStyle(chipEl).fontSize).toFixed(2) : null;
  const namePx = names.length ? Math.max(...names.map((n) => +n.voice.split(" · ")[1])) : null;

  // ── PRINTED COUNT: every node on the card computing the display face ─────────────────────
  const printed = Array.from(card.querySelectorAll("*"))
    .filter((el) => el.children.length === 0 && el.innerText && el.innerText.trim())
    .map((el) => ({ text: el.innerText.trim().slice(0, 18), v: voice(el) }))
    .filter((x) => /^Fraunces/.test(x.v));

  // ── CHIPS ────────────────────────────────────────────────────────────────────────────────
  const chips = Array.from(card.querySelectorAll(".ctrl-btn")).map((b) => {
    const w = b.querySelector(".ctrl-word");
    const cs = getComputedStyle(b);
    const wordInk = w ? inkBox(w) : null;
    const wr = w ? w.getBoundingClientRect() : null;
    const bs = w ? getComputedStyle(w).backgroundSize : null;
    // The mark's painted width: background-size's first term resolved against the word's box.
    let markW = null;
    if (bs && bs !== "auto") {
      const first = bs.split(" ")[0];
      if (first.endsWith("%")) markW = (parseFloat(first) / 100) * (wr.width - parseFloat(getComputedStyle(w).paddingLeft || 0));
      else if (first.endsWith("px")) markW = parseFloat(first);
    }
    return {
      text: b.innerText.trim(),
      pressed: b.getAttribute("aria-pressed"),
      voice: voice(b),
      h: +b.getBoundingClientRect().height.toFixed(2),
      w: +b.getBoundingClientRect().width.toFixed(2),
      bg: bs,
      inkW: wordInk ? +(wordInk.r - wordInk.l).toFixed(2) : null,
      markW: markW === null ? null : +markW.toFixed(2),
      overrun: markW && wordInk ? +(markW / (wordInk.r - wordInk.l)).toFixed(3) : null,
    };
  });

  // ── TAB HEAD DAYLIGHT: the first tape's painted box vs the tab head's ink ────────────────
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

  // ── THE INK GATE: a tape's PAPER top against the caption's own ink bottom ────────────────
  const caps = Array.from(card.querySelectorAll(".zone-row-label"));
  const ink = [];
  for (const t of tapes) {
    const tb = R(t.getBoundingClientRect());
    for (const c of caps) {
      const ci = inkBox(c);
      if (Math.abs(ci.l - tb.l) > 400) continue;
      const cs = getComputedStyle(c);
      // worst-case descender: measure `pgjqy` in the caption's own computed font
      const cv = document.createElement("canvas").getContext("2d");
      cv.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const m = cv.measureText(worst);
      const own = cv.measureText(c.innerText.trim());
      const desc = m.actualBoundingBoxDescent ?? 0;
      const ownDesc = own.actualBoundingBoxDescent ?? 0;
      // the caption's baseline = its ink box bottom minus its own rendered descent
      const baseline = ci.b - ownDesc;
      ink.push({
        tape: t.innerText.trim(),
        cap: c.innerText.trim(),
        paperTop: tb.t,
        capInkBottom: ci.b,
        renderedGap: +(tb.t - ci.b).toFixed(2),
        worstDescender: +desc.toFixed(2),
        worstGap: +(tb.t - (baseline + desc)).toFixed(2),
      });
    }
  }

  // ── CONTRAST: the printed and written sites against the card ground ─────────────────────
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
  for (const sel of [".section-heading", ".heading-value", ".zone-row-label", ".washi-tag", ".ctrl-btn"])
    for (const el of card.querySelectorAll(sel))
      contrast.push({ sel, text: el.innerText.trim().slice(0, 14), ratio: ratio(parse(getComputedStyle(el).color)) });

  // ── THE TAPE COVENANT, AT THE CONSUMER: per well, box with tape − box without ───────────
  const wells = Array.from(card.querySelectorAll(".tray-well"));
  const before = wells.map((w) => +w.getBoundingClientRect().height.toFixed(3));
  const cardH0 = +card.scrollHeight.toFixed(2);
  const st = document.createElement("style");
  st.textContent = ".washi-tag { display: none !important; }";
  document.head.appendChild(st);
  void card.offsetHeight;
  const after = wells.map((w) => +w.getBoundingClientRect().height.toFixed(3));
  st.remove();
  void card.offsetHeight;
  const covenant = wells.map((w, i) => ({
    well: w.querySelector(".washi-tag")?.innerText.trim() ?? `#${i}`,
    delta: +(before[i] - after[i]).toFixed(3),
  }));

  // ── the first tape's rest pose against the card's case edge ─────────────────────────────
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
    chips,
    tabRow,
    ink,
    contrast,
    covenant,
    cardScrollHeight: cardH0,
    firstTapeTop: firstTape,
    cardCaseTop: caseTop,
    firstTapeClearance: firstTape === null ? null : +(firstTape - caseTop).toFixed(2),
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
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await p.locator(".drawer-tab").click({ force: true });
      await p.waitForTimeout(950); // the sheet SLIDES
    }
    const r = await p.evaluate(readCard, "pgjqy");
    rows.push({ base: BASE, theme: THEME, eng, cell: cell.name, ...r });
    console.log(
      `${eng} ${cell.name}: voices=${r.voices?.length} n=${r.names?.length} row3=${r.ratioRow3} ` +
        `printed=${r.printedCount} cardH=${r.cardScrollHeight}`,
    );
    await ctx.close();
  }
  await b.close();
}
writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log("wrote", OUT, rows.length, "rows");
