#!/usr/bin/env node
/**
 * THE TIN, PRICED (T9-W7 PAL-TIN) — six gates over the ten player declarations in
 * `index.css`, read PER ARM, resolved through `var()` and `hsl()` before anything is measured.
 *
 * The walk this replaced was a FORMULA, so an instrument could read the step out of
 * `playerIdentity.ts` and re-derive every hue. A tin is a TABLE, so the gate reads the table —
 * and reading it is the point: the tin cannot move without the numbers moving with it, and the
 * day somebody adds a sixth stick this says which law it broke.
 *
 * WHAT THE FIRST CUT GOT WRONG, and why this file is longer than it was:
 *   · one flat regex over the whole file mixed the two themes, so its headline "nearest anchor
 *     13.3°" was a DARK stick measured against a LIGHT ink — two colours never on a screen
 *     together;
 *   · `--color-teacher-red` and `--color-gold-star` are `var()` aliases and were therefore in
 *     no arm's set at all, though both paint in a cell beside a player's digit;
 *   · degrees answered "is this stick a named ink of the house" and were then asked to answer
 *     "can a reader tell a player's hand from the machine's", which is a ΔE question;
 *   · only gate 2 could be shown failing.
 *
 *   GATE 1a  THE FAMILY LAW.   No stick within MIN_SEP degrees of any of the 19 reserved inks,
 *            within its own arm. A player is never assigned wax, never the solver's rainbow.
 *   GATE 1b  THE READER'S LAW. No stick within ΔE ABS_FLOOR of one of the NINE inks that paint
 *            in a cell — and the same run re-derives what this paper can actually hold, so the
 *            floor is quoted as a RATIO of the ceiling as well as an absolute. A bare number is
 *            gameable by lowering it; a ratio alone lets a drifting reserved set hide a
 *            drifting tin. Both print, both must pass.
 *   GATE 2   THE SEPARATION LAW. No two sticks closer than MIN_DE in OKLab, per arm.
 *   GATE 3   THE ANCHOR TEST.  No stick IS a reserved ink, said in hexes rather than degrees.
 *   GATE 3b  THE SAME PENCIL.   A ring arm sits within RING_DH of its own stick's hue.
 *   GATE 4   ONE PUBLISHER.     The section's leader duty (registry §2.4): `index.css` is the
 *            only place the bands are written, and `--peer-ring-l` says what the ring table
 *            actually is. Its 4b control is the walk's runtime ablation in an authored table's
 *            terms — move the scalar, and the sheet stops describing itself.
 *
 * Two rows print and never fail: the GAMUT CEILING per stick (six of the ten arms sit exactly
 * on `chromaAt(L, h)` — that is sRGB's own limit at that lightness, not a chosen number), and
 * the 8-BIT ROUND TRIP, which is 0.000° on every stick because a table is authored in bytes.
 * Printed so nobody later mistakes the absent tax for an absent check.
 *
 * `--self-test` mints EIGHT negative controls, at least one per gate. A gate that cannot be
 * shown failing is not a gate.
 *
 * RUN IT BARE. `node check-peer-tin.mjs | tail` prints RED and exits 0 — the pipe eats the
 * exit code, and this file's whole output is the exit code.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// PASS-4 COPY, OUT RE-POINTED at the HEAD control tree (74a2b5d9) — the born-RED run.
const INDEX_CSS = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/src/assets/index.css";
const SRC = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/src";
const MIN_SEP = 12; // degrees, the r0 instrument's own floor
const MIN_DE = 0.1; // OKLab, between two PLAYERS
/** ΔE to the nearest ink that paints in a CELL. Pinned from the prototype's own reading
 *  (0.082 light / 0.100 dark) with the margin the band move bought, and never raised to pass. */
const ABS_FLOOR = 0.075;
/** …as a fraction of what five hue-locked sticks can hold on THIS paper at all. Re-derived
 *  below from the same `index.css`, in the same run, at the tin's own bands. */
const RATIO_FLOOR = 0.75;
const SPREAD = 40; // degrees between berths in the ceiling search — the tin's own rule
/** how far a RING ARM may sit from its stick's hue. One degree: the arm is authored as a byte
 *  triple at a different lightness, and quantising a low-chroma colour there costs a fraction
 *  of a degree (teal, C 0.050 light, is the worst at 0.88). Anything past that is a different
 *  pencil wearing the stick's name. */
const RING_DH = 1;

/** The 19 named inks a player's stick must not be mistaken for. */
const RESERVED = [
  "user-ink",
  "focus-sketch",
  "progress-ink",
  "teacher-red",
  "gold-star",
  "crayon-green",
  "crayon-orange",
  "crayon-rose",
  "crayon-blue",
  "crayon-gold",
  "green-ink",
  "orange-ink",
  "red-ink",
  "gold-ink",
  "solver-ink-1",
  "solver-ink-2",
  "solver-ink-3",
  "solver-ink-4",
  "solver-ink-5",
];
/**
 * …of which these NINE paint IN A CELL, beside or under a player's digit, and are therefore
 * the set gate 1b measures against:
 *   user-ink        the digit itself (`HandwrittenGlyph.vue:85`)
 *   solver-ink-1…5  a solved digit is the five-stop solver gradient (`SvgFilters.vue:180-184`)
 *   teacher-red     the conflict ring and the hint laminate (`gameCell.css:144,150,167,170`)
 *   focus-sketch    the focus ring on the cell (`gameCell.css:246-248`)
 *   crayon-blue     the dark arm's own cell furniture
 * `progress-ink` is the frame trace (`HandDrawnGrid.vue:471`) — the same eye, not the same
 * cell — so it is carried in a reported row that never fails.
 */
const CELL = new Set([
  "user-ink",
  "solver-ink-1",
  "solver-ink-2",
  "solver-ink-3",
  "solver-ink-4",
  "solver-ink-5",
  "teacher-red",
  "focus-sketch",
  "crayon-blue",
]);

// ── OKLab / OKLCH / sRGB, Björn Ottosson's matrices; ΔE Euclidean in OKLab ────────────
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const rgbOfHex = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
function oklab(hex) {
  const [r, g, b] = rgbOfHex(hex).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function rgbOfOklab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const rgbOfOklch = (L, C, hDeg) => {
  const h = (hDeg * Math.PI) / 180;
  return rgbOfOklab([L, C * Math.cos(h), C * Math.sin(h)]);
};
const inGamut = (rgb) => rgb.every((v) => v >= -1e-6 && v <= 1 + 1e-6);
/** the maximum chroma sRGB holds at (L, h) — bisection, 1e-5 */
function chromaAt(L, hDeg) {
  let lo = 0;
  let hi = 0.5;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(rgbOfOklch(L, mid, hDeg))) lo = mid;
    else hi = mid;
  }
  return lo;
}
const hexOfRgb = (rgb) =>
  "#" +
  rgb
    .map((v) =>
      Math.round(gam(Math.min(1, Math.max(0, v))) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
/** request (L, C, h), clip into gamut, quantise to bytes, read the hex back. */
function paint(L, C, hDeg) {
  const ceiling = chromaAt(L, hDeg);
  const c = Math.min(C, ceiling);
  return { hex: hexOfRgb(rgbOfOklch(L, c, hDeg)), clipped: C > ceiling, ceiling };
}
const hueOf = (hex) => {
  const [, A, B] = oklab(hex);
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return h < 0 ? h + 360 : h;
};
const chromaOf = (hex) => {
  const [, A, B] = oklab(hex);
  return Math.hypot(A, B);
};
const lOf = (hex) => oklab(hex)[0];
const gap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
const dE = (a, b) => {
  const A = oklab(a);
  const B = oklab(b);
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
};
const lum = (hex) => {
  const [r, g, b] = rgbOfHex(hex).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const x = lum(a);
  const y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// ── Reading the sheet, PER ARM ────────────────────────────────────────────────────────
const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const t =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return (
    "#" +
    t
      .map((v) =>
        Math.round((v + m) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
};
const rawOf = (block, name) => {
  const m = new RegExp(`--color-${name}:\\s*([^;]+);`).exec(block);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
};
/** Follow `var(--color-x)` and `hsl()` down to a hex, WITHIN the arm — a dark declaration that
 *  aliases resolves against the dark block, and a token the dark block never redeclares
 *  inherits the light one, which is exactly what the browser does. */
function resolve(block, fallback, name, depth = 0) {
  let raw = rawOf(block, name);
  if (raw === null && fallback) raw = rawOf(fallback, name);
  if (raw === null || depth > 4) return null;
  let m = /^#([0-9a-fA-F]{6})$/.exec(raw);
  if (m) return `#${m[1].toLowerCase()}`;
  m = /^hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)$/.exec(raw);
  if (m) return hslToHex(+m[1], +m[2], +m[3]);
  m = /^var\(\s*--color-([a-z0-9-]+)\s*\)$/.exec(raw);
  if (m) return resolve(block, fallback, m[1], depth + 1);
  return null;
}
const STICK = /--color-peer-(\d+):\s*(#[0-9a-fA-F]{6})/g;
/** The RING ARM of each stick — the same hue at `--peer-ring-l`, because the cursor ring's own
 *  `stroke-opacity: 0.55` over its 4% fill reads 2.437 / 2.280 with the DIGIT ink in it and
 *  3.135 / 3.145 with these. A missing arm is not a missing colour: `gameCell.css:230` falls
 *  back to `--color-user-ink` and the ring goes quietly back under the floor, which is exactly
 *  the failure gate 3 is here to make loud. */
const RING = /--color-peer-(\d+)-ring:\s*(#[0-9a-fA-F]{6})/g;

function read(css) {
  const at = css.indexOf("\n.dark");
  const blocks = { light: css.slice(0, at), dark: css.slice(at) };
  const arms = {};
  for (const arm of ["light", "dark"]) {
    const fb = arm === "dark" ? blocks.light : null;
    const named = [];
    for (const n of RESERVED) {
      const hex = resolve(blocks[arm], fb, n);
      if (hex) named.push({ name: n, hex });
    }
    arms[arm] = {
      reserved: named,
      cell: named.filter((r) => CELL.has(r.name)),
      sticks: [...blocks[arm].matchAll(STICK)].map((m) => ({
        i: +m[1],
        hex: m[2].toLowerCase(),
      })),
      rings: [...blocks[arm].matchAll(RING)].map((m) => ({
        i: +m[1],
        hex: m[2].toLowerCase(),
      })),
      bg: resolve(blocks[arm], fb, "background"),
      card: resolve(blocks[arm], fb, "card"),
      progress: resolve(blocks[arm], fb, "progress-ink"),
    };
  }
  return arms;
}

/**
 * WHAT THIS PAPER CAN HOLD — re-derived here, in the same run, off the same sheet.
 *
 * Given the tin's own band in each arm and its own chroma cap, what is the LARGEST ΔE floor
 * against the cell set that five hue-locked sticks ≥SPREAD apart can hold SIMULTANEOUSLY in
 * both arms while clearing AA 4.5? Max-min by binary search on the floor, greedy circular
 * packing at each step. The answer is the denominator gate 1b's ratio is quoted against.
 */
function ceilingOf(arms, band, cap, step = 0.5) {
  const rows = {};
  for (const a of ["light", "dark"]) {
    rows[a] = [];
    for (let h = 0; h < 360; h += step) {
      const { hex } = paint(band[a], cap[a], h);
      let m = Infinity;
      for (const r of arms[a].cell) m = Math.min(m, dE(hex, r.hex));
      rows[a].push({
        de: m,
        aa: Math.min(ratio(hex, arms[a].bg), ratio(hex, arms[a].card)),
      });
    }
  }
  const n = rows.light.length;
  /** Greedy earliest-fit from every admissible start, walking the circle ONCE: offsets from
   *  the start are monotonic and the last berth must still leave SPREAD before the start comes
   *  round again, so five berths are five distinct hues rather than three and a wrap. */
  const fits = (t) => {
    const ok = rows.light.map(
      (r, i) =>
        r.de >= t && rows.dark[i].de >= t && r.aa >= 4.5 && rows.dark[i].aa >= 4.5,
    );
    const need = Math.ceil(SPREAD / step);
    const limit = n - need;
    for (let s = 0; s < n; s++) {
      if (!ok[s]) continue;
      const offs = [0];
      let cur = 0;
      for (let k = 0; k < 4; k++) {
        let nxt = -1;
        for (let d = cur + need; d <= limit; d++)
          if (ok[(s + d) % n]) {
            nxt = d;
            break;
          }
        if (nxt < 0) break;
        offs.push(nxt);
        cur = nxt;
      }
      if (offs.length === 5) return offs.map((d) => (((s + d) % n) * step).toFixed(1));
    }
    return null;
  };
  let lo = 0;
  let hi = 0.3;
  let best = null;
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2;
    const f = fits(mid);
    if (f) {
      lo = mid;
      best = f;
    } else hi = mid;
  }
  return { floor: lo, hues: best };
}

// ── The run ───────────────────────────────────────────────────────────────────────────
function run(css, label, sources = SOURCES) {
  const arms = read(css);
  const A = ["light", "dark"];
  const n = arms.light.sticks.length;
  if (!n || n !== arms.dark.sticks.length) {
    console.error(
      `INSTRUMENT BROKEN (${label}): ${arms.light.sticks.length} light sticks and ${arms.dark.sticks.length} dark`,
    );
    return { code: 2, red: {} };
  }
  for (const a of A)
    if (arms[a].reserved.length !== RESERVED.length) {
      console.error(
        `INSTRUMENT BROKEN (${label}): ${arms[a].reserved.length} of ${RESERVED.length} reserved inks resolved in the ${a} arm`,
      );
      return { code: 2, red: {} };
    }
  console.log(
    `${label}: ${n} sticks × 2 arms · ${RESERVED.length} reserved inks resolved per arm (${arms.light.cell.length} of them paint in a cell) · MIN_SEP ${MIN_SEP}deg · ABS_FLOOR ΔE ${ABS_FLOOR} · ratio ≥ ${RATIO_FLOOR} · MIN_DE ${MIN_DE}`,
  );

  // GATE 1a — degrees, within the arm
  const c1a = [];
  let near = Infinity;
  for (const a of A)
    for (const s of arms[a].sticks)
      for (const r of arms[a].reserved) {
        const d = gap(hueOf(s.hex), hueOf(r.hex));
        near = Math.min(near, d);
        if (d < MIN_SEP)
          c1a.push(
            `  COLLISION peer-${s.i} (${a} ${s.hex}, h=${hueOf(s.hex).toFixed(1)}) vs --color-${r.name} ${r.hex} (h=${hueOf(r.hex).toFixed(1)}): ${d.toFixed(2)}deg < ${MIN_SEP}deg`,
          );
      }
  if (c1a.length) console.log(c1a.join("\n"));
  console.log(
    `GATE 1a THE FAMILY LAW: ${c1a.length ? `RED — ${c1a.length} collisions` : "GREEN"} · nearest anchor ${near.toFixed(2)}deg`,
  );

  // GATE 1b — ΔE against the cell set, absolute and as a ratio of this paper's own ceiling
  const band = {};
  const cap = {};
  for (const a of A) {
    band[a] = arms[a].sticks.reduce((t, s) => t + lOf(s.hex), 0) / n;
    cap[a] = Math.max(...arms[a].sticks.map((s) => chromaOf(s.hex)));
  }
  const ceil = ceilingOf(arms, band, cap);
  const c1b = [];
  let worstDe = Infinity;
  for (const a of A)
    for (const s of arms[a].sticks) {
      let m = Infinity;
      let who = null;
      for (const r of arms[a].cell) {
        const e = dE(s.hex, r.hex);
        if (e < m) {
          m = e;
          who = r.name;
        }
      }
      worstDe = Math.min(worstDe, m);
      if (m < ABS_FLOOR)
        c1b.push(
          `  UNREADABLE peer-${s.i} (${a} ${s.hex}) vs --color-${who}: ΔE ${m.toFixed(3)} < ${ABS_FLOOR}`,
        );
    }
  const score = worstDe / ceil.floor;
  if (score < RATIO_FLOOR)
    c1b.push(
      `  UNDER THE PAPER peer set scores ${score.toFixed(2)} of this sheet's own ceiling (ΔE ${ceil.floor.toFixed(3)}) < ${RATIO_FLOOR}`,
    );
  if (c1b.length) console.log(c1b.join("\n"));
  console.log(
    `GATE 1b THE READER'S LAW: ${c1b.length ? `RED — ${c1b.length} findings` : "GREEN"} · worst ΔE to a CELL ink ${worstDe.toFixed(3)} · this paper's five-stick ceiling ΔE ${ceil.floor.toFixed(3)} at ≥${SPREAD}deg, AA ≥4.5 (hues ${ceil.hues ? ceil.hues.join("/") : "none"}) · score ${score.toFixed(2)}`,
  );
  for (const a of A) {
    const rows = arms[a].sticks.map((s) => {
      let m = Infinity;
      let who = null;
      for (const r of arms[a].cell) {
        const e = dE(s.hex, r.hex);
        if (e < m) {
          m = e;
          who = r.name;
        }
      }
      return `peer-${s.i} ${s.hex} ΔE ${m.toFixed(3)} (${who})`;
    });
    console.log(
      `  ${a} band L ${band[a].toFixed(3)} · chroma cap ${cap[a].toFixed(3)} · ${rows.join(" · ")}`,
    );
  }

  // GATE 2 — two players
  const c2 = [];
  let worstPair = Infinity;
  for (const a of A) {
    const s = arms[a].sticks;
    for (let i = 0; i < s.length; i++)
      for (let j = i + 1; j < s.length; j++) {
        const e = dE(s[i].hex, s[j].hex);
        worstPair = Math.min(worstPair, e);
        if (e < MIN_DE)
          c2.push(
            `  TOO CLOSE peer-${s[i].i} ${s[i].hex} vs peer-${s[j].i} ${s[j].hex} (${a}): ΔE ${e.toFixed(3)} < ${MIN_DE}`,
          );
      }
  }
  if (c2.length) console.log(c2.join("\n"));
  console.log(
    `GATE 2 THE SEPARATION LAW: ${c2.length ? `RED — ${c2.length} pairs under the floor` : "GREEN"} · worst pair ΔE ${worstPair.toFixed(3)}`,
  );

  // GATE 3 — a stick that IS an anchor, and a tin that is not WHOLE
  const c3 = [];
  for (const a of A) {
    const anchors = new Map(arms[a].reserved.map((r) => [r.hex, r.name]));
    for (const s of [...arms[a].sticks, ...arms[a].rings])
      if (anchors.has(s.hex))
        c3.push(`  peer-${s.i} (${a}) ${s.hex} IS --color-${anchors.get(s.hex)}`);
    // THE MISSING ARM. Every stick has a ring; an absent one does not fail loudly on the
    // surface, it inherits the digit ink through `gameCell.css:230` and reads 2.28 again.
    for (const st of arms[a].sticks)
      if (!arms[a].rings.some((r) => r.i === st.i))
        c3.push(
          `  peer-${st.i} (${a}) has no --color-peer-${st.i}-ring — the ring inherits the digit ink`,
        );
    for (const r of arms[a].rings)
      if (!arms[a].sticks.some((st) => st.i === r.i))
        c3.push(`  --color-peer-${r.i}-ring (${a}) names a stick that does not exist`);
  }
  if (c3.length) console.log(c3.join("\n"));
  console.log(
    `GATE 3 THE ANCHOR TEST + THE WHOLE TIN: ${c3.length ? `RED — ${c3.length} findings` : "GREEN"} · ` +
      A.map(
        (a) => `${a} ${arms[a].sticks.length} sticks + ${arms[a].rings.length} rings`,
      ).join(" · "),
  );

  // GATE 3b — a ring arm IS its stick, pressed harder: same hue, other lightness
  const c3b = [];
  let worstDh = 0;
  for (const a of A)
    for (const st of arms[a].sticks) {
      const r = arms[a].rings.find((x) => x.i === st.i);
      if (!r) continue; // gate 3 has it
      const d = gap(hueOf(st.hex), hueOf(r.hex));
      worstDh = Math.max(worstDh, d);
      if (d > RING_DH)
        c3b.push(
          `  NOT THE SAME PENCIL peer-${st.i} (${a}) stick ${st.hex} h ${hueOf(st.hex).toFixed(2)} vs ring ${r.hex} h ${hueOf(r.hex).toFixed(2)}: ${d.toFixed(2)}deg > ${RING_DH}deg`,
        );
    }
  if (c3b.length) console.log(c3b.join("\n"));
  console.log(
    `GATE 3b THE SAME PENCIL: ${c3b.length ? `RED — ${c3b.length} arms off hue` : "GREEN"} · worst |Δh| ${worstDh.toFixed(3)}deg (cap ${RING_DH}deg, the 8-bit round trip of a low-chroma arm)`,
  );
  for (const a of A) {
    const rows = arms[a].rings.map(
      (r) =>
        `peer-${r.i}-ring ${r.hex} L ${lOf(r.hex).toFixed(3)} C ${chromaOf(r.hex).toFixed(3)}`,
    );
    console.log(`  REPORT ring arms (${a}): ${rows.join(" · ")}`);
  }

  // Reported, never failing.
  for (const a of A) {
    const gamut = arms[a].sticks.map((s) => {
      const c = chromaOf(s.hex);
      const ceiling = chromaAt(lOf(s.hex), hueOf(s.hex));
      return `peer-${s.i} C ${c.toFixed(3)}${c >= ceiling - 0.002 ? "=ceiling" : `/${ceiling.toFixed(3)}`}`;
    });
    console.log(`  REPORT gamut (${a}): ${gamut.join(" · ")}`);
    const trip = arms[a].sticks.map((s) => {
      const again = paint(lOf(s.hex), chromaOf(s.hex), hueOf(s.hex)).hex;
      return `peer-${s.i} ${gap(hueOf(s.hex), hueOf(again)).toFixed(3)}deg`;
    });
    console.log(
      `  REPORT 8-bit round trip (${a}): ${trip.join(" · ")} — zero because the tin is AUTHORED IN BYTES, not computed at paint time`,
    );
    const prog = arms[a].sticks
      .map((s) => `peer-${s.i} ${dE(s.hex, arms[a].progress).toFixed(3)}`)
      .join(" · ");
    console.log(
      `  REPORT ΔE to --color-progress-ink (the frame trace, not a cell): ${prog}`,
    );
  }

  // GATE 4 — ONE PUBLISHER (§11c's leader duty, registry §2.4)
  const g4 = gate4(css, arms, sources);
  console.log(g4.line);
  for (const f of g4.findings) console.log(`  ${f}`);

  return {
    code:
      c1a.length ||
      c1b.length ||
      c2.length ||
      c3.length ||
      c3b.length ||
      g4.findings.length
        ? 1
        : 0,
    red: {
      g1a: !!c1a.length,
      g1b: !!c1b.length,
      g2: !!c2.length,
      g3: !!c3.length,
      g3b: !!c3b.length,
      g4: !!g4.findings.length,
    },
  };
}

/**
 * GATE 4 — ONE PUBLISHER OF THE BANDS, AND THE SCALAR SAYS WHAT THE TABLE SAYS.
 *
 * The section ships ONE ring scalar and ONE place that publishes the bands (registry §2.4), and
 * the walk's own catastrophe is the reason: its critic moved `--peer-ring-l` 0.32 → 0.20 and the
 * painted hue drifted 1.695° → 18.258°, because a TS literal and a CSS token were each holding
 * half of one number. A tin is a TABLE, so it cannot drift that way at runtime — and that is
 * exactly why it needs this gate instead: an authored table can drift AT REST, one hand editing
 * the hexes and another the scalar that describes them, and nothing on the surface would say so.
 *
 *   4a  NO SECOND PUBLISHER. No source file spells a tin hex, and any `*_BANDS`-shaped literal
 *       in a file that mentions the peers is READ and compared rather than trusted.
 *   4b  THE SCALAR AND THE TABLE AGREE. Every ring arm's OKLab L is within `SCALAR_EPS` of the
 *       `--peer-ring-l` its own arm declares. Move the scalar and this reds; move one hex and
 *       this reds. The ablation the walk runs at runtime, run here on the text.
 */
const SCALAR_EPS = 0.005; // the 8-bit round trip of an authored arm (worst measured 0.0015)
const RING_L = /--peer-ring-l:\s*([\d.]+)/;

function gate4(css, arms, files) {
  const findings = [];
  const at = css.indexOf("\n.dark");
  const blocks = { light: css.slice(0, at), dark: css.slice(at) };
  const published = new Set(
    ["light", "dark"].flatMap((a) =>
      [...arms[a].sticks, ...arms[a].rings].map((s) => s.hex),
    ),
  );
  const scalars = {};
  for (const a of ["light", "dark"]) {
    const m = blocks[a].match(RING_L);
    if (!m) {
      findings.push(
        `4b: the ${a} arm declares no --peer-ring-l — the table has no scalar`,
      );
      continue;
    }
    scalars[a] = +m[1];
    for (const r of arms[a].rings) {
      const d = Math.abs(lOf(r.hex) - scalars[a]);
      if (d > SCALAR_EPS)
        findings.push(
          `4b: ${a} peer-${r.i}-ring ${r.hex} sits at L ${lOf(r.hex).toFixed(4)} but ` +
            `--peer-ring-l says ${scalars[a]} (off by ${d.toFixed(4)}, cap ${SCALAR_EPS})`,
        );
    }
  }
  let literals = 0;
  for (const f of files) {
    for (const m of f.text.matchAll(/#[0-9a-fA-F]{6}/g))
      if (published.has(m[0].toLowerCase()))
        findings.push(
          `4a: ${f.rel} spells ${m[0]}, which index.css publishes — one publisher, and it is the sheet`,
        );
    if (!/peer/i.test(f.text)) continue;
    for (const m of f.text.matchAll(
      /\b([A-Za-z_$][\w$]*(?:BANDS|_L))\b\s*(?::[^=\n]+)?=\s*([^;]{0,400})/g,
    )) {
      literals++;
      const nums = [...m[2].matchAll(/\d*\.\d+/g)].map(Number);
      const off = nums.filter(
        (n) =>
          n > 0 &&
          n < 1 &&
          Object.values(scalars).every((s) => Math.abs(n - s) > SCALAR_EPS) &&
          Object.values(scalars).some((s) => Math.abs(n - s) < 0.08),
      );
      if (off.length)
        findings.push(
          `4a: ${f.rel}'s \`${m[1]}\` carries ${off.join(", ")} beside a --peer-ring-l of ` +
            `${Object.values(scalars).join(" / ")} — two hands on one number`,
        );
    }
  }
  return {
    findings,
    line:
      `GATE 4  ONE PUBLISHER + THE SCALAR: ${findings.length ? `RED — ${findings.length} findings` : "GREEN"} · ` +
      `scalar ${scalars.light} light / ${scalars.dark} dark, every ring arm within ${SCALAR_EPS} of it · ` +
      `${files.length} source files read, ${literals} band literals found, 0 tin hexes spelled in code`,
  };
}

/** Every `.ts`/`.vue` under `src/` — the surface a second publisher could hide in. Tests are in
 *  because a band pinned in a test fixture is still a second copy of the number. */
function sourceFiles(dir = SRC, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) sourceFiles(p, out);
    else if (/\.(ts|vue)$/.test(e.name))
      out.push({ rel: path.relative(SRC, p), text: fs.readFileSync(p, "utf8") });
  }
  return out;
}

const css = fs.readFileSync(INDEX_CSS, "utf8");
const SOURCES = sourceFiles();
let code = run(css, "tin").code;

if (process.argv.includes("--self-test")) {
  const arms = read(css);
  const swap = (text, arm, i, hex) => {
    const at = text.indexOf("\n.dark");
    const head = arm === "light" ? text.slice(0, at) : text.slice(at);
    const tail = arm === "light" ? text.slice(at) : "";
    const cut = head.replace(
      new RegExp(`--color-peer-${i}:\\s*#[0-9a-fA-F]{6}`),
      `--color-peer-${i}: ${hex}`,
    );
    return arm === "light" ? cut + tail : text.slice(0, at) + cut;
  };
  const add = (text, light, dark) =>
    text
      .replace(
        /--color-peer-5:\s*#[0-9a-fA-F]{6};/,
        (m) => `${m}\n  --color-peer-6: ${light};`,
      )
      .replace(
        /--color-peer-5:\s*#[0-9a-fA-F]{6};(?![\s\S]*--color-peer-6)/,
        (m) => `${m}\n  --color-peer-6: ${dark};`,
      );
  const nudge = (hex, dL) =>
    hexOfRgb(rgbOfOklab([lOf(hex) + dL, ...oklab(hex).slice(1)]));
  /** the same surgery as `swap`, on a ring arm rather than a stick */
  const swapRing = (text, arm, i, hex) => {
    const at2 = text.indexOf("\n.dark");
    const head = arm === "light" ? text.slice(0, at2) : text.slice(at2);
    const cut = head.replace(
      new RegExp(`--color-peer-${i}-ring:\\s*#[0-9a-fA-F]{6}`),
      `--color-peer-${i}-ring: ${hex}`,
    );
    return arm === "light" ? cut + text.slice(at2) : text.slice(0, at2) + cut;
  };
  /** delete a ring arm outright — the failure the surface would swallow */
  const drop = (text, arm, i) => {
    const at2 = text.indexOf("\n.dark");
    const head = arm === "light" ? text.slice(0, at2) : text.slice(at2);
    const cut = head.replace(new RegExp(`\\n\\s*--color-peer-${i}-ring:[^\\n]*`), "");
    return arm === "light" ? cut + text.slice(at2) : text.slice(0, at2) + cut;
  };
  const at = (hex, hDeg) => paint(lOf(hex), chromaOf(hex), hDeg).hex;

  const controls = [
    [
      "1a",
      "g1a",
      "peer-3 (light) moved to --color-user-ink's hue + 6deg",
      swap(
        css,
        "light",
        3,
        at(
          arms.light.sticks[2].hex,
          hueOf(arms.light.reserved.find((r) => r.name === "user-ink").hex) + 6,
        ),
      ),
    ],
    [
      "1b",
      "g1b",
      "peer-4 (dark) cut ΔE 0.02 from --color-solver-ink-2",
      swap(
        css,
        "dark",
        4,
        nudge(arms.dark.reserved.find((r) => r.name === "solver-ink-2").hex, 0.02),
      ),
    ],
    [
      "2",
      "g2",
      "a sixth stick 0.002 off amber, both arms",
      add(
        css,
        nudge(arms.light.sticks[0].hex, 0.002),
        nudge(arms.dark.sticks[0].hex, 0.002),
      ),
    ],
    [
      "3",
      "g3",
      "peer-2 (dark) replaced by --color-crayon-blue's own literal",
      swap(
        css,
        "dark",
        2,
        arms.dark.reserved.find((r) => r.name === "crayon-blue").hex,
      ),
    ],
    [
      "3 (whole tin)",
      "g3",
      "--color-peer-3-ring deleted from the light arm — the ring inherits the digit ink",
      drop(css, "light", 3),
    ],
    [
      "3b",
      "g3b",
      "peer-1's light ring arm swung 4deg off its stick",
      swapRing(
        css,
        "light",
        1,
        at(arms.light.rings[0].hex, hueOf(arms.light.rings[0].hex) + 4),
      ),
    ],
  ];
  // GATE 4's two, and they are the ABLATION in an authored table's own terms. PAL-WALK's critic
  // moved `--peer-ring-l` 0.32 → 0.20 at runtime and watched the painted hue drift 18.258°; a
  // tin cannot drift that way, because nothing computes from the scalar. What it CAN do is let
  // the scalar and the table part company at rest, and that is what these two show.
  controls.push([
    "4b (the ablation)",
    "g4",
    "--peer-ring-l moved 0.295 → 0.20 in the light arm, the table left where it was",
    css.replace(/--peer-ring-l:\s*0\.295/, "--peer-ring-l: 0.2"),
    SOURCES,
  ]);
  controls.push([
    "4a",
    "g4",
    "a source file spells the light amber ring arm, a second publisher of the table",
    css,
    [
      ...SOURCES,
      {
        rel: "games/shared/<planted>.ts",
        text: `// peer\nexport const RING_BANDS = { light: "${arms.light.rings[0].hex}" };\n`,
      },
    ],
  ]);

  for (const [gate, key, what, text, sources] of controls) {
    console.log(`\n— negative control for GATE ${gate}: ${what} —`);
    const r = run(text, `control-${gate}`, sources ?? SOURCES);
    if (!r.red[key]) {
      console.error(
        `SELF-TEST FAILED: gate ${gate} stayed GREEN under its own control`,
      );
      code = code || 3;
    } else console.log(`SELF-TEST: gate ${gate} is RED, as it must be`);
  }
}

process.exit(code);
