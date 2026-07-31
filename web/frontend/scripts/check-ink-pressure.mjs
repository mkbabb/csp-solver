#!/usr/bin/env node
/**
 * check-ink-pressure — the graphite ladder, asserted over EVERY rung (T4-P1 Lane D ship 4).
 *
 * The estate open-coded `color-mix(in srgb, var(--color-pencil-graphite, …) N%, transparent)`
 * at six different N across five files. The T4-W10 gate-1 sweep raised two of them to the
 * AA-clean 68% and left the rest, so KeyboardLegend's text (55% = 3.53:1 light / 4.36 dark)
 * and its kbd borders (40% = 2.36:1) plus MarginNote's and CompletionVignette's notes
 * (62% = 4.34:1) all shipped under floor. That is the failure this file exists to prevent
 * recurring: a per-site fix clears one rung and silently inverts its neighbour (the G6 lesson).
 *
 * So the assertion is over ALL rungs, not the ones that happened to be broken:
 *   1. every declared stop clears the floor for its ROLE, in BOTH themes;
 *   2. the stops are strictly increasing in contrast, in BOTH themes;
 *   3. nothing outside the token block open-codes the ramp any more.
 * `--self-test` re-runs each gate against a known-bad input and fails if any of them PASSES —
 * a gate that cannot fail is not a gate.
 *
 * Lives in scripts/ (the estate's check-* idiom, beside check-golden-bytes / check-prod-shake)
 * rather than as a vitest file: it must read real stylesheet bytes, and `src/**` is typechecked
 * by the browser tsconfig, which has no node types and stubs `*.css?raw`.
 *
 * Colour math is sRGB WCAG 2.x relative luminance; `color-mix(… N%, transparent)` composited
 * over a surface is the straight lerp `N·ink + (1−N)·surface`.
 *
 *   node scripts/check-ink-pressure.mjs [--self-test]
 */
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
// Explicit import, matching check-golden-bytes / check-prod-shake: eslint runs this file
// with browser globals, so the implicit `process` is a no-undef error here.
import process from "node:process";

const SRC = join(fileURLToPath(new URL("../src", import.meta.url)));
const INDEX_CSS = readFileSync(join(SRC, "assets/index.css"), "utf8");

/* ── colour ─────────────────────────────────────────────────────────────── */

const hsl = (h, s, l) => {
  const S = s / 100;
  const L = l / 100;
  const c = (1 - Math.abs(2 * L - 1)) * S;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const [r, g, b] =
    hp < 1
      ? [c, x, 0]
      : hp < 2
        ? [x, c, 0]
        : hp < 3
          ? [0, c, x]
          : hp < 4
            ? [0, x, c]
            : hp < 5
              ? [x, 0, c]
              : [c, 0, x];
  const m = L - c / 2;
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
};

const luminance = ([r, g, b]) => {
  const f = (v) => {
    const n = v / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** color-mix(in srgb, ink p%, transparent) composited over `surface` */
const press = (ink, p, surface) =>
  ink.map((c, i) => (c * p) / 100 + (surface[i] * (100 - p)) / 100);

// --color-card / --grid-line-color (--color-pencil-graphite aliases the latter), both themes.
const THEMES = {
  light: { card: hsl(48, 12, 99), graphite: hsl(0, 0, 15) },
  dark: { card: hsl(24, 6, 7), graphite: hsl(48, 10, 80) },
};

/** role floors: WCAG 1.4.3 text AA = 4.5 · WCAG 1.4.11 non-text = 3.0 */
const LADDER = [
  { token: "--ink-press-rule", role: "non-text", floor: 3.0 },
  { token: "--ink-press-quiet", role: "text", floor: 4.5 },
  { token: "--ink-press-firm", role: "text", floor: 4.5 },
];

/**
 * Closure 3 — the armed Clear sublabel. Not on the graphite ramp (it is the teacher's rose),
 * so `LADDER` is structurally blind to it and it shipped ungated. It is the one sublabel that
 * MUST be read, so it carries a text floor of its own: the rule must name --color-red-ink
 * (the hue-locked darkened tier) and that hex must clear AA on the card in light. Dark aliases
 * straight back to the wax, so the night pose is the wax's own contrast.
 */
const ARMED = {
  file: "games/shared/GameControlPanel.vue",
  selector: ".icon-sublabel.is-armed",
  token: "--color-red-ink",
  banned: "--color-crayon-rose",
  floor: 4.5,
};

/**
 * REGISTER — the estate's other quiet voice, deliberately NOT gated (a ruling, not an AA
 * repair; see the §INK PRESSURE note in index.css). Printed on every run in both themes so the
 * cross-theme rank inversion against the ramp stays visible instead of relocating in silence.
 */
const REGISTER = "--color-muted-foreground";

/* ── parsing ────────────────────────────────────────────────────────────── */

// Whitespace is stripped before matching, so the authored multi-line form and a one-line
// reintroduction are the same string to these gates. NB the obvious `[^)]*` spelling matches
// NEITHER — the graphite var carries a `var(--grid-line-color)` fallback, so the first `)`
// is eaten by the fallback and the percentage is never reached. That regex passes vacuously;
// --self-test is what caught it.
// BOTH spellings, because `--color-pencil-graphite` is declared as `var(--grid-line-color)`
// (index.css) — matching only the first name made "sole ownership of the ramp" ownership of one
// spelling, and the alias walked straight past the gate.
const flat = (s) => s.replace(/\s+/g, "");
const GRAPHITE = "(?:--color-pencil-graphite|--grid-line-color)";
const OPEN_CODED = new RegExp(
  `color-mix\\(insrgb,var\\(${GRAPHITE}[^%]*?\\d+(?:\\.\\d+)?%`,
);

function stopOf(css, token) {
  const m = flat(css).match(
    new RegExp(
      `${token}:color-mix\\(insrgb,var\\(${GRAPHITE}[^%]*?(\\d+(?:\\.\\d+)?)%`,
    ),
  );
  if (!m)
    throw new Error(`ink-pressure token ${token} not declared in src/assets/index.css`);
  return Number(m[1]);
}

// `.ts` is in the sweep because a reintroduction can arrive as a template literal or a style
// binding, and the collector that only reads .vue/.css would not see it (a hole this gate
// shipped with in pass 2).
function sources(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) sources(p, out);
    else if (/\.(vue|css|ts)$/.test(e)) out.push(p);
  }
  return out;
}

/* ── token resolution (so the theme values can't drift from the assertion) ── */

/** the two custom-property scopes that land on the SAME element (`useTheme` toggles <html>) */
const scopeOf = (css, name) => {
  const open = css.indexOf(name);
  return open < 0 ? "" : css.slice(open, css.indexOf("\n}", open));
};
const SCOPES = {
  light: scopeOf(INDEX_CSS, "@theme {"),
  dark: scopeOf(INDEX_CSS, "\n.dark {"),
};

/** resolve a custom property to sRGB, following one-level `var()` aliases within its scope */
function colorOf(scope, token, seen = new Set()) {
  if (seen.has(token)) throw new Error(`ink-pressure: ${token} aliases itself`);
  seen.add(token);
  const m = scope.match(new RegExp(`${token}:\\s*([^;]+);`));
  if (!m) throw new Error(`ink-pressure: ${token} not declared in this theme scope`);
  const v = m[1].trim();
  const alias = v.match(/^var\(\s*(--[\w-]+)/);
  if (alias) return colorOf(scope, alias[1], seen);
  const hex = v.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16));
  const h = v.match(/^hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)$/);
  if (h) return hsl(+h[1], +h[2], +h[3]);
  throw new Error(`ink-pressure: cannot read ${token} = ${v}`);
}

/* ── gates ──────────────────────────────────────────────────────────────── */

/** @returns {string[]} failure messages — empty means green */
function gateFloors(css) {
  const fails = [];
  for (const { token, role, floor } of LADDER) {
    const p = stopOf(css, token);
    for (const [name, { card, graphite }] of Object.entries(THEMES)) {
      const cr = contrast(press(graphite, p, card), card);
      if (cr < floor) {
        fails.push(
          `${token} (${p}%) = ${cr.toFixed(3)}:1 on ${name} card — under the ${role} floor ${floor}`,
        );
      }
    }
  }
  return fails;
}

function gateMonotone(css) {
  const fails = [];
  const stops = LADDER.map(({ token }) => ({ token, p: stopOf(css, token) }));
  for (const [name, { card, graphite }] of Object.entries(THEMES)) {
    const r = stops.map(({ p }) => contrast(press(graphite, p, card), card));
    for (let i = 1; i < r.length; i++) {
      if (!(r[i] > r[i - 1])) {
        fails.push(
          `${name}: ${stops[i].token} (${r[i].toFixed(3)}) does not exceed ` +
            `${stops[i - 1].token} (${r[i - 1].toFixed(3)}) — the ladder ties or inverts`,
        );
      }
    }
  }
  return fails;
}

function gateOwnership(files) {
  return files
    .filter((p) => !p.endsWith(join("assets", "index.css")))
    .filter((p) => OPEN_CODED.test(flat(readFileSync(p, "utf8"))))
    .map(
      (p) => `${relative(SRC, p)} open-codes the graphite ramp — name the rung instead`,
    );
}

/** closure 3: the armed sublabel names the AA tier, and that tier clears the text floor */
function gateArmed(armed) {
  const fails = [];
  const rule = flat(readFileSync(join(SRC, armed.file), "utf8")).match(
    new RegExp(`\\${armed.selector}\\{([^}]*)\\}`),
  );
  if (!rule) {
    return [`${armed.selector} not found in ${armed.file} — closure 3 is unanchored`];
  }
  if (!rule[1].includes(`var(${armed.token})`)) {
    fails.push(
      `${armed.selector} does not write in ${armed.token} — the one sublabel that must be read`,
    );
  }
  if (rule[1].includes(`var(${armed.banned})`)) {
    fails.push(
      `${armed.selector} writes the raw wax ${armed.banned} (sub-AA in light)`,
    );
  }
  for (const [name, scope] of Object.entries(SCOPES)) {
    const cr = contrast(colorOf(scope, armed.token), colorOf(scope, "--color-card"));
    if (cr < armed.floor) {
      fails.push(
        `${armed.token} = ${cr.toFixed(3)}:1 on ${name} card — under the text floor ${armed.floor}`,
      );
    }
  }
  return fails;
}

/* ── self-test: every gate shown able to fail ───────────────────────────── */

/**
 * The ownership fixture is a REAL directory the REAL collector must walk. Pass 2 asserted a
 * regex against a hardcoded string instead, so `sources()`, the recursion and the index.css
 * exemption were never exercised: sabotaging `sources()` to return `[]` left the self-test
 * green even with a live reintroduction on disk. Written to a temp dir, three files:
 *   nested/bad.vue  — the alias spelling, one line (must be FOUND)
 *   nested/bad.ts   — a `.ts` reintroduction (must be FOUND — the collector's other pass-2 hole)
 *   assets/index.css — the ramp's own home (must be SKIPPED, or the gate reds on itself)
 */
function ownershipFixture() {
  const root = mkdtempSync(join(tmpdir(), "ink-pressure-"));
  mkdirSync(join(root, "nested"));
  mkdirSync(join(root, "assets"));
  writeFileSync(
    join(root, "nested/bad.vue"),
    "<style>.x { color: color-mix(in srgb, var(--grid-line-color) 62%, transparent); }</style>\n",
  );
  writeFileSync(
    join(root, "nested/bad.ts"),
    "export const s = `color-mix(in srgb, var(--color-pencil-graphite, var(--grid-line-color)) 40%, transparent)`;\n",
  );
  writeFileSync(join(root, "assets/index.css"), INDEX_CSS);
  return root;
}

function selfTest() {
  const bad = INDEX_CSS.replace(
    /(--ink-press-quiet:\s*color-mix\(\s*in srgb,\s*var\(--color-pencil-graphite[^%]*?)68%/s,
    "$155%",
  );
  const fixture = ownershipFixture();
  const armedBad = { ...ARMED, token: ARMED.banned, banned: ARMED.token };
  const cases = [
    ["floors", () => gateFloors(bad)],
    ["monotone", () => gateMonotone(bad)],
    ["ownership", () => gateOwnership(sources(fixture))],
    ["armed", () => gateArmed(armedBad)],
  ];
  const mute = [];
  for (const [name, run] of cases) {
    if (run().length === 0)
      mute.push(`gate "${name}" did not fail on a known-bad input — it is vacuous`);
  }
  // The fixture's two bad files must BOTH be named, or the collector is half-blind and the
  // "did not fail" check above would pass on one hit while missing the other spelling.
  const found = gateOwnership(sources(fixture));
  if (found.length !== 2)
    mute.push(
      `ownership found ${found.length} of the fixture's 2 reintroductions — the collector misses a spelling or an extension`,
    );
  return mute;
}

/* ── run ────────────────────────────────────────────────────────────────── */

const fails = [
  ...gateFloors(INDEX_CSS),
  ...gateMonotone(INDEX_CSS),
  ...gateOwnership(sources(SRC)),
  ...gateArmed(ARMED),
];
const vacuous = process.argv.includes("--self-test") ? selfTest() : [];

if (fails.length || vacuous.length) {
  for (const f of fails) console.error(`  ✗ ${f}`);
  for (const v of vacuous) console.error(`  ✗ ${v}`);
  console.error(
    `\nink-pressure: ${fails.length} violation(s), ${vacuous.length} vacuous gate(s)`,
  );
  process.exit(1);
}

const rows = LADDER.map(({ token, role, floor }) => {
  const p = stopOf(INDEX_CSS, token);
  const l = contrast(
    press(THEMES.light.graphite, p, THEMES.light.card),
    THEMES.light.card,
  );
  const d = contrast(
    press(THEMES.dark.graphite, p, THEMES.dark.card),
    THEMES.dark.card,
  );
  return `  ${token.padEnd(18)} ${String(p).padStart(3)}%  ${l.toFixed(2)} light / ${d.toFixed(2)} dark  ≥${floor} (${role})`;
});
console.log(
  "ink-pressure ladder — every rung clears its floor, strictly increasing, both themes:",
);
console.log(rows.join("\n"));

const armedRow = Object.fromEntries(
  Object.entries(SCOPES).map(([name, scope]) => [
    name,
    contrast(colorOf(scope, ARMED.token), colorOf(scope, "--color-card")),
  ]),
);
console.log(
  `  ${ARMED.token.padEnd(18)}       ${armedRow.light.toFixed(2)} light / ${armedRow.dark.toFixed(2)} dark  ≥${ARMED.floor} (${ARMED.selector})`,
);

/* The register the ladder does NOT govern, printed so the inversion can't go quiet. */
const reg = Object.fromEntries(
  Object.entries(SCOPES).map(([name, scope]) => [
    name,
    contrast(colorOf(scope, REGISTER), colorOf(scope, "--color-card")),
  ]),
);
const rank = (theme) =>
  [
    ...LADDER.map(({ token }) => ({
      token,
      cr: contrast(
        press(THEMES[theme].graphite, stopOf(INDEX_CSS, token), THEMES[theme].card),
        THEMES[theme].card,
      ),
    })),
    { token: REGISTER, cr: reg[theme] },
  ]
    .sort((a, b) => a.cr - b.cr)
    .map(({ token }) => token.replace("--ink-press-", "").replace("--color-", ""))
    .join(" < ");
console.log(
  `\nungoverned register — ${REGISTER} ${reg.light.toFixed(2)} light / ${reg.dark.toFixed(2)} dark:` +
    `\n  light  ${rank("light")}\n  dark   ${rank("dark")}` +
    `\n  the ramp and the register cross between themes. Booked in index.css §INK PRESSURE, not gated.`,
);
