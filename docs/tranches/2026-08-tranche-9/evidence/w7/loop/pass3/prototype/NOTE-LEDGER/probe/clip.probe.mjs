/**
 * NOTE-LEDGER · pass-3 PROTOTYPE probe 6 — L15, the two halves, by PIXEL.
 *
 * (a) the `g` paints whole: an inked pixel row exists ≥1px below the line box, both berths.
 * (b) the ellipsis paints under `overflow-x: clip`: a planted 400px string is rendered and the
 *     tail of the box is scanned for the three dots. If webkit refuses, the declared fallback
 *     (`overflow: hidden` + padding-bottom .2em / margin-bottom -.2em) lands and this row says so.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const PROTO = "http://127.0.0.1:4249/";

async function ready(page) {
  await page.goto(PROTO + "?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1300);
}
async function toDepthTwo(page) {
  await page.evaluate(() => {
    const i = [...document.querySelectorAll(".board-cells input")].filter(
      (x) => !x.value && !x.readOnly && !x.disabled,
    );
    i[0]?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(700);
  await page.evaluate(() => {
    const g = [...document.querySelectorAll(".board-cells input")].find((i) => i.value);
    g?.focus();
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    set.call(g, "7");
    g.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(800);
}

/** Scan a crop for inked pixels per row / per column, against the paper. */
async function scan(buf, paper) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const png = { width: info.width, height: info.height, data };
  const rows = [];
  const cols = new Array(png.width).fill(0);
  for (let y = 0; y < png.height; y++) {
    let n = 0;
    for (let x = 0; x < png.width; x++) {
      const i = (png.width * y + x) << 2;
      const d =
        Math.abs(png.data[i] - paper[0]) +
        Math.abs(png.data[i + 1] - paper[1]) +
        Math.abs(png.data[i + 2] - paper[2]);
      if (d > 24) {
        n++;
        cols[x]++;
      }
    }
    rows.push(n);
  }
  return { w: png.width, h: png.height, rows, cols };
}

async function run(engineName) {
  const browser = await pw[engineName].launch();
  const out = { engine: engineName, berths: {} };
  for (const rig of [
    { name: "phone 390x844", w: 390, h: 844, dsf: 3, mobile: true },
    { name: "desk 1280x800", w: 1280, h: 800, dsf: 2, mobile: false },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: rig.w, height: rig.h },
      deviceScaleFactor: rig.dsf,
      isMobile: rig.mobile && engineName === "chromium",
      hasTouch: rig.mobile,
    });
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await ready(page);
    await toDepthTwo(page);

    // (a) THE g. Plant the word, crop the box PLUS 6px of paper below it.
    const geo = await page.evaluate(() => {
      const two = document.querySelector(".margin-note-previous");
      if (!two) return null;
      two.textContent = "goes goes goes";
      const b = two.getBoundingClientRect();
      const cs = getComputedStyle(two);
      return {
        x: b.x,
        y: b.y,
        w: b.width,
        h: b.height,
        lineBoxBottom: b.bottom,
        paper: getComputedStyle(document.body).backgroundColor,
        overflowX: cs.overflowX,
        overflowY: cs.overflowY,
        textOverflow: cs.textOverflow,
      };
    });
    if (!geo) {
      out.berths[rig.name] = { skipped: "no line two at this berth" };
      await ctx.close();
      continue;
    }
    const paper = (geo.paper.match(/\d+/g) ?? [255, 255, 255]).slice(0, 3).map(Number);
    const shot = await page.screenshot({
      clip: { x: geo.x, y: geo.y, width: Math.min(geo.w, 200), height: geo.h + 8 },
    });
    const s = await scan(shot, paper);
    const boxRows = Math.round(geo.h * rig.dsf);
    const belowRows = s.rows.slice(boxRows).map((n, i) => ({ px: i + 1, inked: n }));
    const lastInked = s.rows.reduce((a, n, i) => (n > 0 ? i : a), -1);

    // (b) THE ELLIPSIS. 400px of x, then scan the last 40 device px of the box for ink.
    const longGeo = await page.evaluate(() => {
      const two = document.querySelector(".margin-note-previous");
      two.textContent = "x".repeat(400);
      const b = two.getBoundingClientRect();
      return {
        x: b.x,
        y: b.y,
        w: b.width,
        h: b.height,
        clientWidth: two.clientWidth,
        scrollWidth: two.scrollWidth,
      };
    });
    const longShot = await page.screenshot({
      clip: { x: longGeo.x, y: longGeo.y, width: longGeo.w, height: longGeo.h },
    });
    const ls = await scan(longShot, paper);
    // An ellipsis is ink-then-GAP-then-three-dots at the tail; a hard clip has ink to the edge
    // with no gap. Read the last 12% of the box: a gap column (0 ink) followed by ink columns.
    const tail = ls.cols.slice(Math.floor(ls.w * 0.88));
    let gaps = 0,
      inkAfterGap = 0,
      inGap = false;
    for (const c of tail) {
      if (c === 0) {
        if (!inGap) gaps++;
        inGap = true;
      } else {
        if (inGap) inkAfterGap++;
        inGap = false;
      }
    }
    out.berths[rig.name] = {
      geo,
      dsf: rig.dsf,
      boxRowsDevicePx: boxRows,
      lastInkedRowDevicePx: lastInked,
      inkedRowsBelowBox: belowRows.filter((r) => r.inked > 0).length,
      inkBelowBoxCssPx:
        lastInked >= boxRows ? Math.round(((lastInked - boxRows + 1) / rig.dsf) * 100) / 100 : 0,
      gVerdict: lastInked >= boxRows ? "GREEN — the tail paints below the line box" : "RED — clipped at the box",
      ellipsis: {
        clientWidth: longGeo.clientWidth,
        scrollWidth: longGeo.scrollWidth,
        tailGaps: gaps,
        inkRunsAfterAGap: inkAfterGap,
        verdict:
          inkAfterGap > 0
            ? "GREEN — a gap then ink at the tail: the ellipsis paints under overflow-x:clip"
            : "RED — ink runs to the edge with no gap; the DECLARED FALLBACK lands",
      },
    };
    await ctx.close();
  }
  await browser.close();
  writeFileSync(join(OUT, `P6-clip-${engineName}.json`), JSON.stringify(out, null, 2));
  for (const [k, v] of Object.entries(out.berths))
    console.log(
      engineName,
      k,
      "|",
      v.skipped ?? `${v.gVerdict} (${v.inkBelowBoxCssPx}px below box) | ${v.ellipsis.verdict}`,
    );
}
await run(process.argv[2]);
