#!/usr/bin/env node
/* T9-W7 pass 2 · CTRL-TABS research — THE BLOCKING CONDITION, solved analytically.
 *
 * The critique's 4.20:1 is `--color-red-ink` on `color-mix(in srgb, --color-foreground 8%,
 * transparent)` over `--color-card`. This solves the whole cure space off the tree's own
 * tokens: the break-even mix, the bare-card reading, the inversion (mark `keep` instead),
 * and the ratios every candidate ground gives in both themes. sRGB compositing + WCAG 2.x
 * relative luminance — the same maths `check-ink-pressure.mjs` runs.
 *
 * Tokens read from web/frontend/src/assets/index.css (cited in the output).
 * OUT: ../readings/guard-solve.json
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../readings/guard-solve.json');

const hsl = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
};
const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const lum = ([r, g, b]) => {
  const c = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [la, lb] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (la + 0.05) / (lb + 0.05);
};
/* color-mix(in srgb, INK N%, transparent) painted over GROUND — premultiplied srgb, the
   browser's own path for an alpha face over an opaque parent. */
const over = (ink, ground, alpha) => ink.map((v, i) => v * alpha + ground[i] * (1 - alpha));
const r2 = (x) => Math.round(x * 100) / 100;

/* ── the tree's tokens (index.css :root and .dark) ───────────────────────── */
const T = {
  light: {
    card: hsl(48, 12, 99), //  index.css:136
    background: hsl(48, 15, 98), //  :134
    foreground: hsl(0, 0, 3.9), //  :135
    muted: hsl(0, 0, 45.1), //  :138
    accent: hsl(48, 8, 96.1), //  :139
    redInk: hex('#d02a52'), //  :184
    crayonRose: hex('#e8315b'), //  :173
    goldInk: hex('#8c691d'), //  :183
    orangeInk: hex('#a26009'), //  :196
  },
  dark: {
    card: hsl(24, 6, 7), //  :365
    background: hsl(24, 8, 6), //  :363
    foreground: hsl(48, 10, 92), //  :364
    muted: hsl(48, 5, 64), //  :367
    accent: hsl(24, 5, 15), //  :368
    redInk: hex('#ff5c7c'), //  :387 → --color-crayon-rose (dark)
    crayonRose: hex('#ff5c7c'),
    goldInk: hex('#e5c74d'),
    orangeInk: hex('#f5b35c'),
  },
};

const out = { generated: new Date().toISOString(), rows: {} };

for (const theme of ['light', 'dark']) {
  const t = T[theme];
  const face = (pct) => over(t.foreground, t.card, pct / 100);
  const R = {};

  /* 1 · HEAD-of-pass-1 readings, reproduced analytically */
  R.shipped = {
    'guard-go on 8% face': r2(ratio(t.redInk, face(8))),
    'guard-go on bare card': r2(ratio(t.redInk, t.card)),
    'guard-keep (foreground) on card': r2(ratio(t.foreground, t.card)),
    'guard-keep on 8% face': r2(ratio(t.foreground, face(8))),
    'the 8% face against the card (the marked cue)': r2(ratio(face(8), t.card)),
    'guard-ask (foreground) on card': r2(ratio(t.foreground, t.card)),
  };

  /* 2 · the mix sweep — where does the red word cross 4.5, and where does the face
        cross the 3:1 non-text floor its own cue would need? */
  const sweep = [];
  for (let p = 0; p <= 40; p += 1) {
    sweep.push({
      pct: p,
      redOnFace: r2(ratio(t.redInk, face(p))),
      faceOnCard: r2(ratio(face(p), t.card)),
      keepOnFace: r2(ratio(t.foreground, face(p))),
    });
  }
  const crossAA = sweep.filter((s) => s.redOnFace >= 4.5).map((s) => s.pct);
  const crossCue = sweep.filter((s) => s.faceOnCard >= 3).map((s) => s.pct);
  R.sweep = {
    'max mix % that still clears 4.5:1 for the red word': crossAA.length
      ? Math.max(...crossAA)
      : null,
    'min mix % whose face clears 3:1 against the card': crossCue.length
      ? Math.min(...crossCue)
      : null,
    'the two bands overlap': crossAA.some((p) => crossCue.includes(p)),
    rows: sweep.filter((s) => s.pct % 2 === 0),
  };

  /* 3 · INVERSION — mark `keep` (graphite) instead of the destructive verb */
  R.inversion = {
    'keep on 8% face': r2(ratio(t.foreground, face(8))),
    'keep on 16% face': r2(ratio(t.foreground, face(16))),
    'keep on 24% face': r2(ratio(t.foreground, face(24))),
    'red verb on bare card (unmarked)': r2(ratio(t.redInk, t.card)),
    '16% face against card': r2(ratio(face(16), t.card)),
    '24% face against card': r2(ratio(face(24), t.card)),
    '34% face against card': r2(ratio(face(34), t.card)),
  };

  /* 4 · the accent ground the estate already uses on hover (`--color-accent`) */
  R.accentGround = {
    'red verb on --color-accent': r2(ratio(t.redInk, t.accent)),
    '--color-accent against card': r2(ratio(t.accent, t.card)),
  };

  /* 5 · a DRAWN cue instead of a ground: the box's own stroke contrast.
        HandDrawnOutline strokes rgb(10,10,10) light (currentColor at the case) — the
        estate's drawn frames. 1.4.11 asks 3:1 of a non-text cue against what adjoins it. */
  R.drawnCue = {
    'graphite box stroke on card': r2(ratio(t.foreground, t.card)),
    'red-ink box stroke on card': r2(ratio(t.redInk, t.card)),
    'muted box stroke on card': r2(ratio(t.muted, t.card)),
  };

  /* 6 · what the WHOLE ribbon owes if it sits on the 8% face as a BAND rather than
        per-verb (the gallery's `bg-popover` analogue) */
  R.bandGround = {
    'red on 4% band': r2(ratio(t.redInk, face(4))),
    'red on 6% band': r2(ratio(t.redInk, face(6))),
    'foreground on 4% band': r2(ratio(t.foreground, face(4))),
  };

  out.rows[theme] = R;
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2));
for (const theme of ['light', 'dark']) {
  console.log(`\n=== ${theme.toUpperCase()} ===`);
  for (const [group, rows] of Object.entries(out.rows[theme])) {
    if (group === 'sweep') {
      console.log(` sweep: max% clearing 4.5 red = ${rows['max mix % that still clears 4.5:1 for the red word']}` +
        ` · min% face clearing 3:1 = ${rows['min mix % whose face clears 3:1 against the card']}` +
        ` · overlap = ${rows['the two bands overlap']}`);
      continue;
    }
    console.log(` ${group}:`);
    for (const [k, v] of Object.entries(rows)) console.log(`   ${k.padEnd(48)} ${v}`);
  }
}
console.log(`\nOUT ${OUT}`);
