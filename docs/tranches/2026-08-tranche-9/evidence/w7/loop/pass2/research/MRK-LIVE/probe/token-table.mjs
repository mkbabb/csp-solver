/**
 * MRK-LIVE pass 2 — THE FOUR-GROUND x TWO-THEME FOCUS-INK TABLE.
 *
 * Grounds are the painted bytes measured on the real surface (`logs/B-grounds-*.json`,
 * identical in both engines): light page (251,250,249), light card (253,253,252),
 * dark page (17,15,14), dark card (19,18,17). The board's fourth ground is the cell
 * interior UNDER focus, which carries the ring's own 0.08 fill (`logs/C-boardring-*.json`).
 *
 * Inks are the five families' pass-1 rulings plus the section-10 control token. Each is
 * scored in both forms the estate paints a ring in: the chrome ring at stroke-opacity 1,
 * and the board ring at stroke-opacity 0.9 over the 0.08 fill.
 *
 * Nothing here reads a product file; the numbers come from this lane's own logs.
 */
const L = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * L(r) + 0.7152 * L(g) + 0.0722 * L(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const over = (fg, bg, a) => fg.map((c, i) => Math.round(a * c + (1 - a) * bg[i]));

// Grounds, measured (logs/B-grounds-*.json + logs/C-boardring-*.json).
const G = {
  light: {
    page: [251, 250, 249],
    card: [253, 253, 252],
    cell: [253, 253, 252], // the board cell at rest = the card
    fg: [10, 10, 10],
  },
  dark: {
    page: [17, 15, 14],
    card: [19, 18, 17],
    cell: [19, 18, 17],
    fg: [237, 236, 233],
  },
};

const INKS = {
  "A MRK-LIVE  one value both themes": { light: "#3a7bc4", dark: "#3a7bc4" },
  "B MRK-ABS   dark alias crayon-blue": { light: "#3a7bc4", dark: "#6aabeb" },
  "C ACC-FIVE  dark arm crayon-blue": { light: "#3a7bc4", dark: "#6aabeb" },
  "D ACC-SIX   blue-ink replacement": { light: "#2f76bd", dark: "#6aabeb" },
  "E ACC-GRAPH graphite (ring deleted)": { light: "#404040", dark: "#a3a3a3" },
};

const rows = [];
for (const [name, arms] of Object.entries(INKS)) {
  for (const scheme of ["light", "dark"]) {
    const ink = hex(arms[scheme]);
    const g = G[scheme];
    // chrome form: stroke-opacity 1 on page and on card
    const chromePage = ratio(ink, g.page);
    const chromeCard = ratio(ink, g.card);
    // board form: stroke-opacity 0.9 over (0.08 ink fill over the cell ground)
    const fill = over(ink, g.cell, 0.08);
    const painted = over(ink, fill, 0.9);
    const boardVsCard = ratio(painted, g.cell);
    const boardVsFill = ratio(painted, fill);
    rows.push({
      ink: name,
      scheme,
      value: arms[scheme],
      chromePage,
      chromeCard,
      boardPainted: painted,
      boardVsCard,
      boardVsFill,
      min: Math.min(chromePage, chromeCard, boardVsCard, boardVsFill),
    });
  }
}

// F. --ring-ink = foreground at 50%, composited on each ground; stroke-opacity 1 (authored
// as a CSS `outline`, so there is no 0.9 arm and no fill under it).
for (const scheme of ["light", "dark"]) {
  const g = G[scheme];
  const onPage = over(g.fg, g.page, 0.5);
  const onCard = over(g.fg, g.card, 0.5);
  rows.push({
    ink: "F --ring-ink  foreground 50% (section 10)",
    scheme,
    value: `fg50 -> ${onCard.join(",")}`,
    chromePage: ratio(onPage, g.page),
    chromeCard: ratio(onCard, g.card),
    boardPainted: null,
    boardVsCard: null,
    boardVsFill: null,
    min: Math.min(ratio(onPage, g.page), ratio(onCard, g.card)),
  });
}

const pad = (s, n) => String(s).padEnd(n);
console.log(
  pad("ink", 42) +
    pad("theme", 7) +
    pad("value", 9) +
    pad("page", 7) +
    pad("card", 7) +
    pad("board/card", 12) +
    pad("board/fill", 12) +
    "min",
);
for (const r of rows)
  console.log(
    pad(r.ink, 42) +
      pad(r.scheme, 7) +
      pad(r.value, 9) +
      pad(r.chromePage, 7) +
      pad(r.chromeCard, 7) +
      pad(r.boardVsCard ?? "-", 12) +
      pad(r.boardVsFill ?? "-", 12) +
      r.min,
  );

// The flatness statistic the pass-1 ruling turns on: the spread of a candidate's four
// chrome/board readings across BOTH themes.
console.log("\nFLATNESS (max - min over all eight readings, both themes)");
for (const name of [...Object.keys(INKS), "F --ring-ink  foreground 50% (section 10)"]) {
  const mine = rows.filter((r) => r.ink === name);
  const all = mine.flatMap((r) =>
    [r.chromePage, r.chromeCard, r.boardVsCard, r.boardVsFill].filter(
      (v) => typeof v === "number",
    ),
  );
  console.log(
    pad(name, 42) +
      `min ${Math.min(...all).toFixed(2)}  max ${Math.max(...all).toFixed(2)}  spread ${(
        Math.max(...all) - Math.min(...all)
      ).toFixed(2)}`,
  );
}

// The measured board ring, read off the screenshots rather than computed, as the control.
console.log("\nMEASURED BOARD RING (logs/C-boardring-*.json, chromium/webkit agree to 1 byte)");
const measured = [
  { scheme: "light", ring: [75, 135, 201], ground: [253, 253, 252], fill: [238, 243, 247] },
  { scheme: "dark", ring: [54, 114, 180], ground: [19, 18, 17], fill: [23, 27, 31] },
];
for (const m of measured)
  console.log(
    pad(m.scheme, 8) +
      `ring ${m.ring.join(",")}  vs cell ground ${ratio(m.ring, m.ground)}  vs its own fill ${ratio(
        m.ring,
        m.fill,
      )}  fill vs ground ${ratio(m.fill, m.ground)}`,
  );

// ── THE TWO GRAFTS, priced ────────────────────────────────────────────────────────────────
// MRK-WASH's 0.95 resting stroke-opacity, and the digit-headroom budget read against the
// entry ink on the ring's own 0.08 fill.
console.log("\nGRAFT 1 — resting stroke-opacity 0.90 vs 0.95 (board ring)");
for (const scheme of ["light", "dark"]) {
  const g = G[scheme];
  const ink = hex(scheme === "light" ? "#3a7bc4" : "#3a7bc4");
  const fill = over(ink, g.cell, 0.08);
  for (const a of [0.9, 0.95, 1]) {
    const p = over(ink, fill, a);
    console.log(
      pad(scheme, 8) +
        `opacity ${a}  painted ${p.join(",")}  vs cell ${ratio(p, g.cell)}  vs fill ${ratio(p, fill)}`,
    );
  }
}

console.log("\nGRAFT 2 — digit headroom: the entry ink on the ring's own 0.08 fill");
const entry = { light: "#2563eb", dark: "#60a5fa" };
for (const scheme of ["light", "dark"]) {
  const g = G[scheme];
  const ring = hex("#3a7bc4");
  const fill = over(ring, g.cell, 0.08);
  const ink = hex(entry[scheme]);
  const bare = ratio(ink, g.cell);
  const onFill = ratio(ink, fill);
  console.log(
    pad(scheme, 8) +
      `entry ${entry[scheme]}  bare ${bare}  on the focused fill ${onFill}  spent ${(
        bare - onFill
      ).toFixed(2)}`,
  );
}

console.log("\nGRAFT 3 — the hint laminate's body under the chair's ruling (section 6.11)");
// 15% teacher-red over the cell, alone and composed with the selection's 0.08 blue fill.
const TEACHER = { light: "#dc2626", dark: "#f87171" };
for (const scheme of ["light", "dark"]) {
  const g = G[scheme];
  const red = hex(TEACHER[scheme]);
  const ring = hex("#3a7bc4");
  const selFill = over(ring, g.cell, 0.08);
  const hintAlone = over(red, g.cell, 0.15);
  const hintOverSel = over(red, selFill, 0.15);
  console.log(
    pad(scheme, 8) +
      `hint alone ${hintAlone.join(",")} (vs card ${ratio(hintAlone, g.cell)})  ` +
      `hint over selection ${hintOverSel.join(",")} (vs card ${ratio(hintOverSel, g.cell)})  ` +
      `selection alone ${selFill.join(",")} (vs card ${ratio(selFill, g.cell)})`,
  );
}
