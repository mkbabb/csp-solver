/**
 * CTRL-FACE pass 2 — THE GALLERY π CELL. The deck shares `OptionSelector` and
 * `SheetWashiLabel` with the controls card and this family claims it does not move. Paired
 * read: the same script against the prototype and against a `git archive HEAD` control.
 *
 *   BASE=http://127.0.0.1:4234/ OUT=<file> node p2-gallery.mjs
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const OUT = process.env.OUT || "/tmp/p2-gallery.jsonl";
const THEME = process.env.THEME || "light";
const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
];

function readDeck() {
  const R = (el) => {
    const r = el.getBoundingClientRect();
    return { x: +r.left.toFixed(2), y: +r.top.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  };
  const ink = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const r = range.getBoundingClientRect();
    return { x: +r.left.toFixed(2), y: +r.top.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
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
  const band = document.querySelector(".staging-band");
  const slip = document.querySelector(".staging-slip");
  const tape = band?.querySelector(".washi-tag");
  const axes = Array.from(document.querySelectorAll(".staging-axis")).map((a) => {
    const label = a.querySelector(".staging-axis-label");
    const row = a.querySelector(".options-row");
    return {
      label: label?.innerText.trim(),
      labelVoice: label ? voice(label) : null,
      labelRect: label ? R(label) : null,
      rowRect: row ? R(row) : null,
      chips: Array.from(a.querySelectorAll(".ctrl-btn")).map((b) => {
        const w = b.querySelector(".ctrl-word");
        return {
          text: b.innerText.trim(),
          pressed: b.getAttribute("aria-pressed"),
          voice: voice(b),
          rect: R(b),
          wordInk: w ? ink(w) : ink(b),
          bg: w ? getComputedStyle(w).backgroundSize : getComputedStyle(b).backgroundSize,
          bgImage: (w ? getComputedStyle(w).backgroundImage : getComputedStyle(b).backgroundImage).slice(0, 24),
        };
      }),
    };
  });
  const slot = document.querySelector(".gallery-card-slot");
  return {
    band: band ? R(band) : null,
    slip: slip ? R(slip) : null,
    tapeRect: tape ? R(tape) : null,
    tapeInk: tape ? ink(tape) : null,
    tapeVoice: tape ? voice(tape) : null,
    axes,
    firstCardY: slot ? R(slot).y : null,
    firstCardRect: slot ? R(slot) : null,
  };
}

const rows = [];
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
    await p.goto(BASE + "?view=gallery", { waitUntil: "domcontentloaded" });
    await p.waitForSelector(".staging-band", { timeout: 60000 });
    await p.waitForTimeout(1600);
    const r = await p.evaluate(readDeck);
    rows.push({ base: BASE, eng, cell: cell.name, ...r });
    console.log(
      `${eng} ${cell.name}: band ${r.band?.w}x${r.band?.h} tape ${r.tapeRect?.w}x${r.tapeRect?.h} ` +
        `firstCardY ${r.firstCardY} axes ${r.axes.length}`,
    );
    await ctx.close();
  }
  await b.close();
}
writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log("wrote", OUT, rows.length, "rows");
