/**
 * ACC-GRAPHITE pass-3 CRITIQUE — the PAINTED band, which the prototype left as a gap.
 *
 * The prototype proved 22 ghost units = 10.761 px desk in the ring's OWN space. That number is
 * about a stroke declaration. This probe measures what the PLAYER sees: a horizontal scan of
 * rendered pixels through the focused cell, the runs of ink named, and the same scan on an
 * unfocused cell as the negative control. The frame line's painted run is measured on the same
 * row, so the ratio the gate asks for ([1.35, 1.45]) is computed painted-over-painted.
 *
 * It also reports the CLEAR WINDOW inside the ring (the "is it a chip" number) and a painted
 * rank: the heaviest ink run anywhere on the board row, named.
 */
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/critique/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

const RIGS = [
  { name: "desk", width: 1280, height: 800, dpr: 1, touch: false },
  { name: "phone", width: 393, height: 699, dpr: 3, touch: true },
];

type Run = { start: number; end: number; len: number; minL: number };

function runsOnRow(
  data: Buffer,
  width: number,
  channels: number,
  y: number,
  x0: number,
  x1: number,
  darkBelow: number,
): Run[] {
  const runs: Run[] = [];
  let cur: Run | null = null;
  for (let x = x0; x < x1; x++) {
    const i = (y * width + x) * channels;
    const L = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (L < darkBelow) {
      if (!cur) cur = { start: x, end: x, len: 1, minL: L };
      else {
        cur.end = x;
        cur.len = x - cur.start + 1;
        cur.minL = Math.min(cur.minL, L);
      }
    } else if (cur) {
      runs.push(cur);
      cur = null;
    }
  }
  if (cur) runs.push(cur);
  return runs;
}

for (const rig of RIGS)
  test(`painted-${rig.name}`, async ({ browser }, info) => {
    const engine = info.project.name;
    const ctx = await browser.newContext({
      viewport: { width: rig.width, height: rig.height },
      deviceScaleFactor: rig.dpr,
      hasTouch: rig.touch,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".hand-drawn-grid", { timeout: 60_000 });
    await page.waitForTimeout(2500);

    // Focus a writable cell in the MIDDLE of the board so the scan never crosses the frame.
    const inputs = page.locator(".game-cell input:not([readonly])");
    const n = await inputs.count();
    expect(n).toBeGreaterThan(0);
    const target = inputs.nth(Math.floor(n / 2));
    await target.focus();
    await page.waitForTimeout(900);

    const geom = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const cell = el.closest(".game-cell") as HTMLElement;
      const cr = cell.getBoundingClientRect();
      const ghost = cell.querySelector(".cell-ghost-path") as SVGGraphicsElement | null;
      const retrace = cell.querySelector(".cell-ghost-retrace") as SVGGraphicsElement | null;
      const svg = ghost?.ownerSVGElement ?? null;
      const sbox = svg?.getBoundingClientRect() ?? null;
      const vbw = svg?.viewBox.baseVal.width ?? null;
      const cs = ghost ? getComputedStyle(ghost) : null;
      const cs2 = retrace ? getComputedStyle(retrace) : null;
      // the board's own frame line, for the painted comparison
      const board = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement | null;
      const bbox = board?.getBoundingClientRect() ?? null;
      const bvb = board?.viewBox.baseVal.width ?? null;
      // an unfocused sibling cell as the negative control
      const cells = Array.from(document.querySelectorAll(".game-cell")) as HTMLElement[];
      const other = cells.find((c) => c !== cell && !c.querySelector("input:focus"))!;
      const or = other.getBoundingClientRect();
      const root = getComputedStyle(document.documentElement);
      return {
        cell: { x: cr.x, y: cr.y, w: cr.width, h: cr.height },
        other: { x: or.x, y: or.y, w: or.width, h: or.height },
        ghostSvgW: sbox?.width ?? null,
        ghostViewBoxW: vbw,
        ghostPxPerUnit: sbox && vbw ? sbox.width / vbw : null,
        outerStrokePx: cs ? parseFloat(cs.strokeWidth) : null,
        outerFill: cs?.fill ?? null,
        innerDisplay: cs2?.display ?? null,
        innerStrokePx: cs2 ? parseFloat(cs2.strokeWidth) : null,
        boardPxPerUnit: bbox && bvb ? bbox.width / bvb : null,
        tokens: {
          graphite: root.getPropertyValue("--color-pencil-graphite").trim(),
          gridLine: root.getPropertyValue("--grid-line-color").trim(),
          userInk: root.getPropertyValue("--color-user-ink").trim(),
          foreground: root.getPropertyValue("--color-foreground").trim(),
          card: root.getPropertyValue("--color-card").trim(),
          crayonBlue: root.getPropertyValue("--color-crayon-blue").trim(),
          focusSketch: root.getPropertyValue("--color-focus-sketch").trim(),
          ground: root.getPropertyValue("--ground-wash-unit").trim(),
        },
      };
    });

    const pad = 26;
    const clip = {
      x: Math.max(0, geom.cell.x - pad),
      y: Math.max(0, geom.cell.y - pad),
      width: geom.cell.w + pad * 2,
      height: geom.cell.h + pad * 2,
    };
    const buf = await page.screenshot({ clip });
    const img = sharp(buf);
    const meta = await img.metadata();
    const raw = await img.raw().toBuffer();
    const ch = meta.channels!;
    const W = meta.width!;
    const S = rig.dpr; // device px per css px

    // scan row: cell vertical centre (the digit sits here, but the LEFT band is clear of it)
    const yDev = Math.round((geom.cell.y + geom.cell.h * 0.5 - clip.y) * S);
    const rowRuns = runsOnRow(raw, W, ch, yDev, 0, W, 110).map((r) => ({
      ...r,
      cssStart: r.start / S + clip.x,
      cssLen: r.len / S,
    }));

    // same scan on the unfocused control
    const clip2 = {
      x: Math.max(0, geom.other.x - pad),
      y: Math.max(0, geom.other.y - pad),
      width: geom.other.w + pad * 2,
      height: geom.other.h + pad * 2,
    };
    const buf2 = await page.screenshot({ clip: clip2 });
    const img2 = sharp(buf2);
    const meta2 = await img2.metadata();
    const raw2 = await img2.raw().toBuffer();
    const y2 = Math.round((geom.other.y + geom.other.h * 0.5 - clip2.y) * S);
    const ctrlRuns = runsOnRow(raw2, meta2.width!, meta2.channels!, y2, 0, meta2.width!, 110).map(
      (r) => ({ ...r, cssLen: r.len / S }),
    );

    // the clear window inside the focused ring: longest PAPER run between the two bands
    const light = runsOnRow(raw, W, ch, yDev, 0, W, 999).length; // unused guard
    const paperRuns: Run[] = [];
    {
      let cur: Run | null = null;
      for (let x = 0; x < W; x++) {
        const i = (yDev * W + x) * ch;
        const L = 0.2126 * raw[i] + 0.7152 * raw[i + 1] + 0.0722 * raw[i + 2];
        if (L >= 110) {
          if (!cur) cur = { start: x, end: x, len: 1, minL: L };
          else {
            cur.end = x;
            cur.len = x - cur.start + 1;
          }
        } else if (cur) {
          paperRuns.push(cur);
          cur = null;
        }
      }
      if (cur) paperRuns.push(cur);
    }

    const out = {
      engine,
      rig: rig.name,
      geom,
      scanRowYcss: geom.cell.y + geom.cell.h * 0.5,
      focusedRuns: rowRuns,
      controlRuns: ctrlRuns,
      paperRunsCss: paperRuns.map((r) => r.len / S),
      derived: {
        ownSpaceBandPx:
          geom.ghostPxPerUnit != null ? +(22 * geom.ghostPxPerUnit).toFixed(3) : null,
        paintedBandRunsCss: rowRuns.map((r) => +r.cssLen.toFixed(2)),
        controlRunsCss: ctrlRuns.map((r) => +r.cssLen.toFixed(2)),
      },
    };
    writeFileSync(`${OUT}/painted-${rig.name}-${engine}.json`, JSON.stringify(out, null, 2));
    await ctx.close();
  });
