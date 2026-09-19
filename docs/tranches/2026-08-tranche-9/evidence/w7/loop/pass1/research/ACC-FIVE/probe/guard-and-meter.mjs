/**
 * guard-and-meter.mjs — two arithmetic questions the browser rows left open.
 *
 *  A. THE CONFIRM'S FACE. Row 9 measured `--color-red-ink` over its own 8% wash at
 *     4.35:1 (chromium) / 4.36 (webkit) — UNDER the AA text floor. The ink is fine on
 *     the note's bare paper (4.93). So the ground and the danger ink cannot both be
 *     there at today's red. Price the three ways out.
 *
 *  B. THE METER'S ARITHMETIC. What a reader sees at 5%, and how much of it: the first
 *     keystroke's arc, in CSS px, from the frame rect the trace is built on
 *     (gridPaths.ts:338-370, FRAME_X_PAD 12 / FRAME_Y_PAD 0) and the measured 1280×800
 *     board scale. "Gold comes to the page only when the work is done" is a LAW; this
 *     says exactly how much gold arrives before it is.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { rgbToOklch, oklchToRgb, hueDist, ratio, over, hex } from "./oklch.mjs";

const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE";
const G = JSON.parse(readFileSync(`${HERE}/readings/grounds.json`, "utf8")).chromium;
const rgb = (t, k) => {
  const [r, g, b] = G[t][k].rgb;
  return { r, g, b };
};
function maxChroma(L, h) {
  let lo = 0,
    hi = 0.4;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (oklchToRgb(L, m, h).inGamut) lo = m;
    else hi = m;
  }
  return Math.floor(lo * 1000) / 1000;
}

const out = { guard: {}, meter: {} };

/* ── A ─────────────────────────────────────────────────────────────────────── */
{
  // the ribbon's paper, as row 9 measured it on the live page
  const paper = { r: 252, g: 251, b: 251 };
  const red = rgb("light", "--color-red-ink");
  const fg = rgb("light", "--color-foreground");
  const rose = rgb("light", "--color-crayon-rose");
  const groundRed8 = over({ ...red, a: 0.08 }, paper);
  const groundFg8 = over({ ...fg, a: 0.08 }, paper);

  const opts = {
    "today — foreground ink, foreground ground (HEAD)": {
      ink: fg,
      ground: groundFg8,
      note: "achromatic; the surface has no accent at all",
    },
    "red ink, foreground ground": { ink: red, ground: groundFg8 },
    "red ink, its own 8% ground": { ink: red, ground: groundRed8 },
    "red ink, NO ground (bare paper)": { ink: red, ground: paper },
    "red ink, 5% ground": { ink: red, ground: over({ ...red, a: 0.05 }, paper) },
  };
  out.guard.options = Object.fromEntries(
    Object.entries(opts).map(([k, v]) => [
      k,
      {
        ink: hex(v.ink),
        ground: hex(v.ground),
        ratio: +ratio(v.ink, v.ground).toFixed(2),
        aa: ratio(v.ink, v.ground) >= 4.5,
        ...(v.note ? { note: v.note } : {}),
      },
    ]),
  );

  // the fourth way out: a darker rose ink that clears AA OVER its own 8% wash while
  // staying inside the 5 deg hue lock. Does one exist, and what does it cost the estate?
  const h = rgbToOklch(rose.r, rose.g, rose.b).h;
  const rows = [];
  for (let L = 0.35; L <= 0.62; L += 0.001) {
    const C = maxChroma(L, h);
    const c = oklchToRgb(L, C, h);
    const g8 = over({ ...c, a: 0.08 }, paper);
    const onCard = ratio(c, rgb("light", "--color-card"));
    const onBg = ratio(c, rgb("light", "--color-background"));
    const onOwn = ratio(c, g8);
    rows.push({
      L: +L.toFixed(3),
      C: +C.toFixed(3),
      hex: hex(c),
      onOwnGround: +onOwn.toFixed(2),
      onCard: +onCard.toFixed(2),
      onBackground: +onBg.toFixed(2),
      dHue: +hueDist(rgbToOklch(c.r, c.g, c.b).h, h).toFixed(2),
      ok: onOwn >= 4.5 && onCard >= 4.5 && onBg >= 4.5,
    });
  }
  const ok = rows.filter((r) => r.ok);
  out.guard.darkerRoseInk = {
    lockedHue: +h.toFixed(1),
    incumbentRedInk: {
      hex: hex(red),
      L: G.light["--color-red-ink"].L,
      h: G.light["--color-red-ink"].h,
      dHue: +hueDist(G.light["--color-red-ink"].h, h).toFixed(2),
    },
    window: ok.length ? { Lmin: ok[0].L, Lmax: ok[ok.length - 1].L, n: ok.length } : null,
    lightestThatClears: ok.length ? ok[ok.length - 1] : null,
    consumersItWouldMove: 3,
  };
}

/* ── B ─────────────────────────────────────────────────────────────────────── */
{
  // the trace rect, from gridPaths.ts:338-370 — the SAME rect the graphite frame uses
  const VIEWBOX = 1000; // HandDrawnGrid.vue:52 VIEWBOX_SIZE — the pads below are in ITS units
  const FRAME_X_PAD = 12;
  const FRAME_Y_PAD = 0;
  // R3 measured the rendered board at 1280x800: 8 viewBox units = 5.09 CSS px, i.e. the
  // board's scale is 5.09/8 CSS px per unit. The perimeter follows from the rect.
  const unitPx1280 = 5.09 / 8;
  const unitPxPhone = 2.96 / 8;
  const w = VIEWBOX - FRAME_X_PAD * 2;
  const h = VIEWBOX - FRAME_Y_PAD * 2;
  const perimeterUnits = 2 * (w + h);
  const scaleTo = (vb) => vb / VIEWBOX;
  // R3's own board: 636 CSS px wide at 1280, so the viewBox maps to 636 px across.
  const boardPx1280 = 636; // R3: the rendered board at 1280x800, scale 0.636
  const perimeterPx1280 = perimeterUnits * (boardPx1280 / VIEWBOX);
  const steps = [0.05, 0.5, 1];
  out.meter = {
    frameRect: { FRAME_X_PAD, FRAME_Y_PAD, note: "gridPaths.ts:338-370, shared with the graphite frame" },
    strokeUnits: 8,
    strokeCssPx: { at1280: +(8 * unitPx1280).toFixed(2), onPhone: +(8 * unitPxPhone).toFixed(2) },
    perimeter: {
      units: +perimeterUnits.toFixed(1),
      cssPxAt1280: +perimeterPx1280.toFixed(0),
      note: "the trace draws this whole ring at 100%; the top side overhangs the board box (FRAME_Y_PAD 0)",
    },
    arcAtFill: Object.fromEntries(
      steps.map((p) => [
        `${p * 100}%`,
        {
          cssPx: +(perimeterPx1280 * p).toFixed(0),
          areaPx2: +(perimeterPx1280 * p * 8 * unitPx1280).toFixed(0),
        },
      ]),
    ),
    firstKeystroke: {
      blanksOnR3Deal: 20,
      percentPerKeystroke: 5,
      cssPxPerKeystroke: +(perimeterPx1280 * 0.05).toFixed(0),
      note: "one digit paints this much trace AT ONCE; the meter does not exist at 0% (traceNodes 0)",
    },
    goldLaw: {
      cite: "index.css:174 — gold comes to the page only when the work is done",
      tierAt5pct: "ink tier (L 0.603 light / 0.524 dark), NOT the wax",
      waxArrivesAt: ".solve-success — --color-gold-star floods .grid-line and the trace fades to 0 over 500ms",
    },
  };
  out.meter.tierSeparation = {
    lightWaxL: G.light["--color-crayon-gold"].L,
    lightTraceL: 0.603,
    lightDeltaL: +(G.light["--color-crayon-gold"].L - 0.603).toFixed(3),
    darkWaxL: G.dark["--color-crayon-gold"].L,
    darkTraceL: 0.524,
    darkDeltaL: +(G.dark["--color-crayon-gold"].L - 0.524).toFixed(3),
  };
}

writeFileSync(`${HERE}/readings/guard-and-meter.json`, JSON.stringify(out, null, 2));
console.log("== A. the confirm's face ==");
for (const [k, v] of Object.entries(out.guard.options))
  console.log("  ", k.padEnd(46), v.ink, "on", v.ground, String(v.ratio).padStart(5), v.aa ? "AA" : "-- under AA");
console.log("   darker rose ink:", JSON.stringify(out.guard.darkerRoseInk.window), JSON.stringify(out.guard.darkerRoseInk.lightestThatClears));
console.log("== B. the meter ==");
console.log(JSON.stringify(out.meter, null, 1));
