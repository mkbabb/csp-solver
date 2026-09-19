#!/usr/bin/env node
// T9-W7 pass 3 · CTRL-COST — THE RULER, THE HEADS AND THE BERTH (G20 · G16' · G22).
//
// One probe, three rows, because all three are read off the same settled desk page:
//
//   THE RULER (G20)  the card's width must equal the LEGEND FOLD's max-content plus the card's
//                    own inline padding, PER ENGINE — 324.22 chromium / 332.31 webkit at head,
//                    an 8.09px split, which is why no literal can hold it. Every child's
//                    max-content contribution is measured and none may exceed the ruler. The
//                    board's x is read against the 74a2b5d9 control on its own server.
//   FOUR HEADS (G16') every `.cost-band-head` is one height, 37.45 +/- 0.05, and the band is
//                    0.6rem + that (43.05 +/- 0.05). The derived `--cost-head-h` is read back.
//   THE BERTH (G22)  the berthed tape's INK box (a Range over its text nodes) must sit inside
//                    its own LABEL box — pass 2 measured the label against the head and never
//                    the ink against its paper, and the ink was 0.61px over the top.
//
// Usage: node r2-width-and-head.mjs <base-url> <engine> <out.json>
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const base = process.argv[2] ?? "http://127.0.0.1:4233";
const engine = process.argv[3] ?? "chromium";
const out = process.argv[4] ?? "/tmp/r2.json";

const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`);
await page.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
await page.waitForSelector(".controls-card", { timeout: 25000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900); // the dock sheet SLIDES; the desk rail settles too

const read = await page.evaluate(() => {
  const r2 = (n) => +n.toFixed(2);
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r2(r.x), y: r2(r.y), w: r2(r.width), h: r2(r.height) };
  };

  // A box's MAX-CONTENT contribution, read by cloning it off-flow into a max-content shell.
  const maxContent = (el) => {
    if (!el) return null;
    const shell = document.createElement("div");
    shell.style.cssText =
      "position:absolute;left:-10000px;top:0;visibility:hidden;inline-size:max-content";
    const clone = el.cloneNode(true);
    clone.style.inlineSize = "max-content";
    clone.style.maxInlineSize = "none";
    shell.appendChild(clone);
    document.body.appendChild(shell);
    const w = r2(clone.getBoundingClientRect().width);
    shell.remove();
    return w;
  };

  const card = document.querySelector(".controls-card");
  const cs = card ? getComputedStyle(card) : null;
  const padX = cs ? parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) : 0;

  const legendEl =
    document.querySelector(".keyboard-legend") ??
    [...(card?.querySelectorAll("*") ?? [])].find((e) =>
      [...e.classList].some((c) => /legend/.test(c)),
    ) ??
    null;

  const children = [...(card?.querySelectorAll(":scope > *, :scope > * > *") ?? [])]
    .filter((el) => el.getBoundingClientRect().width > 0)
    .map((el) => ({
      sel: `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : ""}`,
      mc: maxContent(el),
    }))
    .filter((c) => c.mc != null)
    .sort((a, b) => b.mc - a.mc)
    .slice(0, 14);

  const heads = [...document.querySelectorAll(".cost-band-head")].map((h) => ({
    name: h.querySelector(".section-heading")?.textContent?.trim() ?? "",
    h: r2(h.getBoundingClientRect().height),
    top: getComputedStyle(h).top,
  }));

  // THE BERTH'S INK — summon a note through the delegated listener, then Range the text.
  const subject = document.querySelector("[data-note='fill']");
  subject?.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
  let berth = null;
  const label = document.querySelector(".cost-band-head .washi-label");
  if (label) {
    const range = document.createRange();
    range.selectNodeContents(label);
    const ink = range.getBoundingClientRect();
    const lab = label.getBoundingClientRect();
    const lcs = getComputedStyle(label);
    berth = {
      label: box(label),
      inkTopOver: r2(lab.top - ink.top),
      inkBottomOver: r2(ink.bottom - lab.bottom),
      inkLeftOver: r2(lab.left - ink.left),
      inkRightOver: r2(ink.right - lab.right),
      paddingTop: lcs.paddingTop,
      paddingBottom: lcs.paddingBottom,
      lineHeight: lcs.lineHeight,
      text: label.textContent?.trim() ?? "",
    };
  }

  return {
    card: box(card),
    cardPadX: r2(padX),
    cardPaddingTop: cs?.paddingTop ?? null,
    costHeadH: cs?.getPropertyValue("--cost-head-h").trim() ?? null,
    pinBand: cs?.getPropertyValue("--pin-band").trim() ?? null,
    legend: legendEl
      ? { sel: String(legendEl.className), mc: maxContent(legendEl), box: box(legendEl) }
      : null,
    board: box(
      document.querySelector(".board-wrapper") ??
        document.querySelector(".board-peek-host"),
    ),
    masthead: box(document.querySelector(".masthead")),
    heads,
    widestChildren: children,
    berth,
  };
});

const px = (v) => (v ? parseFloat(v) : NaN);
read.derived = {
  headsOneHeight:
    read.heads.length > 0 &&
    read.heads.every((h) => Math.abs(h.h - read.heads[0].h) < 0.05),
  headH: read.heads[0]?.h ?? null,
  pinBandPx: px(read.pinBand),
  bandMinusHead: +(px(read.pinBand) - (read.heads[0]?.h ?? 0)).toFixed(2),
  ruler: read.legend ? +(read.legend.mc + read.cardPadX).toFixed(2) : null,
  rulerDelta: read.legend
    ? +(read.card.w - (read.legend.mc + read.cardPadX)).toFixed(2)
    : null,
  overRuler: read.legend
    ? read.widestChildren.filter((c) => c.mc > read.legend.mc + 0.05)
    : [],
};

writeFileSync(out, JSON.stringify({ engine, base, ...read }, null, 2));
console.log(
  `${engine}  card ${read.card?.w}  legend.mc ${read.legend?.mc}  ruler ${read.derived.ruler}  ` +
    `dRuler ${read.derived.rulerDelta}  board.x ${read.board?.x}  ` +
    `heads ${read.heads.map((h) => h.h).join("/")}  band ${read.pinBand}  head ${read.costHeadH}  ` +
    `inkTop ${read.berth?.inkTopOver} inkBot ${read.berth?.inkBottomOver}  ` +
    `over-ruler ${read.derived.overRuler.length}`,
);
await browser.close();
