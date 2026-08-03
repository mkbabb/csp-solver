import { test, expect, type Browser, type Page } from "@playwright/test";

// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto
//   The cage/tube furniture is STATIC jittered ink (seeded per grid coordinate, never
//   animated), so freezing the ~8 Hz boil beat costs this assertion nothing and buys a
//   deterministic settle on the gallery deck (GameGallery.vue:208 lands every card revealed
//   under PRM instead of dealing them in). Set on the context AND re-stated on the page
//   before every `goto`, so no navigation can race the media state.

/**
 * T7-W1 GATE 1.2 — FOUR-QUADRANT INK **IDENTITY**, against the BUILT dist.
 *
 * The defect (W1 §The defect): when the OS `prefers-color-scheme` disagrees with the in-app
 * sun/moon toggle, killer + kenken cage furniture, thermo tubes, and the three matching
 * gallery poster cards render in the OPPOSITE theme's ink. `CageOverlay.vue:180` and
 * `ThermoTube.vue:127` are the only two files in `src` keying a dark palette off
 * `@media (prefers-color-scheme: dark)`, and their sibling `:root[data-theme=…]` blocks are
 * dead selectors — nothing in the estate ever writes `data-theme`. So the ink is a function
 * of the OS media query alone, while every other surface tracks `<html class="dark">`.
 *
 * THE ASSERTION IS IDENTITY, NEVER A CONTRAST FLOOR (W1 §Gate 1.2). Theme ink is a function
 * of the app's class alone, so:
 *
 *   ink(OS=light, app=dark)  ===  ink(OS=dark, app=dark)
 *   ink(OS=light, app=light) ===  ink(OS=dark, app=light)
 *
 * is exactly true and greenable. A WCAG 3:1 floor would red the MATCHED quadrants too — the
 * matched light cage boundary measures 2.62:1 and the matched dark thermo tube 1.98:1 by
 * design (cage boundaries are deliberately faint). That thinness is a separate OWNER row and
 * must not ride this gate; identity also sidesteps the two audits' disagreeing mismatch bands
 * (1.13–1.36 vs 1.32–1.84 — neither is banked) entirely.
 *
 * THREE ARMS:
 *   1. `identity` — the four quadrants, per surface, board scope (killer + kenken cage LABEL
 *      and BOUNDARY, thermo TUBE and BULB).
 *   2. `moves`    — a real toggle CLICK (never seeded storage) must MOVE the ink, not just
 *      the class. At HEAD the class flips and the ink does not.
 *   3. `gallery`  — 2.4 scope: `?view=gallery`, the three poster cards (KenKenPoster /
 *      KillerPoster / ThermoPoster mount the same shared CageOverlay / ThermoTube), same
 *      identity assertion over the card art.
 *
 * THE OS SIDE is `emulateMedia({ colorScheme })`; THE APP SIDE is the real toggle button —
 * each quadrant is a cold context whose stored theme is empty, so `useDark` boots to the
 * system scheme and one click is what produces the mismatch. Seeding `localStorage` would
 * assert over a state the user cannot reach by the gesture that reports the defect.
 *
 * THE RESOLVER handles Chromium's `color(srgb …)` return for `color-mix` (W1's instrument
 * note: an `rgba?\(` regex silently SKIPS exactly the rung it watches). Anything it cannot
 * parse becomes a loud `UNPARSED:` sentinel that can never satisfy identity — a colour this
 * gate cannot read is a red, never a skip.
 *
 * BORN RED at `cbf2ab49`, both engines: the ink is byte-identical across the class flip
 * (`rgba(52, 56, 64, 0.72)` on both sides of the toggle) and diverges across the OS flip, so
 * every identity row and every `moves` row fails. Green after the cure re-keys both style
 * blocks to `:root.dark` / the unprefixed rule.
 * Evidence: docs/tranches/2026-08-tranche-7/evidence/w1/gate1.2-born-red.txt
 */

type Prop = "fill" | "stroke";
type Row = { readonly surface: string; readonly sel: string; readonly prop: Prop };

const cageRows = (family: string, where = ""): Row[] => [
  {
    surface: `${family} cage boundary`,
    sel: `${where}.${family}-cage-boundary`,
    prop: "stroke",
  },
  {
    surface: `${family} cage label`,
    sel: `${where}.${family}-cage-label`,
    prop: "fill",
  },
];
const thermoRows = (where = ""): Row[] => [
  { surface: "thermo tube", sel: `${where}.thermo-tube-stroke`, prop: "stroke" },
  { surface: "thermo bulb", sel: `${where}.thermo-bulb`, prop: "fill" },
];

/** The BOARD scope — one live board per game, its clue furniture read off the real deal. */
const BOARDS = {
  killer: { url: "./?game=killer", rows: cageRows("killer") },
  kenken: { url: "./?game=kenken", rows: cageRows("kenken") },
  thermo: { url: "./?game=thermo", rows: thermoRows() },
} as const;

/**
 * The GALLERY scope (2.4). Booted on `game=sudoku` on purpose: GameCard renders the LIVE
 * board in place of the poster for the CURRENT game only, so a sudoku boot is the one deal
 * where all three watched cards are poster art. `.game-card` therefore scopes each selector
 * to the card face with no live board anywhere on the page to collide with.
 */
const GALLERY = {
  url: "./?view=gallery&game=sudoku",
  rows: [
    ...cageRows("killer", ".game-card "),
    ...cageRows("kenken", ".game-card "),
    ...thermoRows(".game-card "),
  ],
} as const;

// ── the resolver ───────────────────────────────────────────────────────────────────────────

type Rgba = { r: number; g: number; b: number; a: number };

const clamp255 = (v: number) => Math.min(255, Math.max(0, Math.round(v)));

/**
 * A computed `fill`/`stroke` → canonical channels.
 *
 * Handles, in the order the two engines actually emit them:
 *  · `rgb(r, g, b)` / `rgba(r, g, b, a)` and the space-separated `rgb(r g b / a)` form;
 *  · **`color(srgb r g b)` / `color(srgb r g b / a)`** — Chromium's return for `color-mix`,
 *    0–1 floats. This is the rung W1's instrument note names: an `rgba?\(` regex matches
 *    nothing here and a resolver that returns `null` on it turns the watched surface into a
 *    silent skip. Scaled to 0–255 so it compares against the `rgba()` form byte-for-byte.
 *  · hex `#rgb` / `#rgba` / `#rrggbb` / `#rrggbbaa`;
 *  · `transparent` / `none` — real values on an SVG paint, canonicalised rather than dropped.
 *
 * A non-sRGB `color()` space (`display-p3`, `oklch`, …) is deliberately NOT coerced: the
 * channels do not mean the same thing and a coercion would invent an equality. It returns
 * null, and the caller renders that as `UNPARSED:` — loud, never equal, never skipped.
 */
function parseColor(raw: string | null): Rgba | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  if (s === "none" || s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

  if (s.startsWith("#")) {
    const h = s.slice(1);
    if (![3, 4, 6, 8].includes(h.length)) return null;
    const w = h.length <= 4 ? 1 : 2;
    const at = (i: number) => {
      const part = h.slice(i * w, i * w + w);
      if (part.length < w) return null;
      const n = parseInt(w === 1 ? part + part : part, 16);
      return Number.isNaN(n) ? null : n;
    };
    const [r, g, b, a] = [
      at(0),
      at(1),
      at(2),
      h.length === 4 || h.length === 8 ? at(3) : 255,
    ];
    if (r == null || g == null || b == null || a == null) return null;
    return { r, g, b, a: a / 255 };
  }

  // color(srgb …) — the color-mix rung. Any other space is refused rather than coerced.
  const fn = s.match(/^color\(\s*([a-z0-9-]+)\s+(.+)\)$/);
  if (fn) {
    if (fn[1] !== "srgb") return null;
    const parts = fn[2].split("/");
    const ch = (parts[0].match(/-?[\d.]+%?/g) ?? []).map((v) =>
      v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v),
    );
    if (ch.length < 3 || ch.some(Number.isNaN)) return null;
    const alphaTok = parts[1]?.trim();
    const a =
      alphaTok == null
        ? 1
        : alphaTok.endsWith("%")
          ? parseFloat(alphaTok) / 100
          : parseFloat(alphaTok);
    if (Number.isNaN(a)) return null;
    return {
      r: clamp255(ch[0] * 255),
      g: clamp255(ch[1] * 255),
      b: clamp255(ch[2] * 255),
      a,
    };
  }

  const rgb = s.match(/^rgba?\(\s*(.+)\)$/);
  if (rgb) {
    const parts = rgb[1].split("/");
    const ch = (parts[0].match(/-?[\d.]+%?/g) ?? []).map((v) =>
      v.endsWith("%") ? (parseFloat(v) / 100) * 255 : parseFloat(v),
    );
    if (ch.length < 3 || ch.slice(0, 3).some(Number.isNaN)) return null;
    // `rgba(r, g, b, a)` puts alpha in the 4th comma slot; `rgb(r g b / a)` after the slash.
    const alphaTok = parts[1]?.trim();
    let a = 1;
    if (alphaTok != null)
      a = alphaTok.endsWith("%") ? parseFloat(alphaTok) / 100 : parseFloat(alphaTok);
    else if (ch.length >= 4) a = ch[3] > 1 ? ch[3] / 255 : ch[3];
    if (Number.isNaN(a)) return null;
    return { r: clamp255(ch[0]), g: clamp255(ch[1]), b: clamp255(ch[2]), a };
  }

  return null;
}

/** The comparison key. Unparseable stays unparseable — it can never equal anything. */
function inkKey(raw: string | null): string {
  const c = parseColor(raw);
  return c ? `${c.r},${c.g},${c.b},${c.a.toFixed(3)}` : `UNPARSED:${raw ?? "(absent)"}`;
}

// ── the rig ────────────────────────────────────────────────────────────────────────────────

type Reading = { surface: string; sel: string; count: number; raw: string | null };
type Snapshot = { theme: string; readings: Reading[] };

const VIEWPORT = { width: 1280, height: 800 };

async function snapshot(page: Page, rows: readonly Row[]): Promise<Snapshot> {
  const readings = await page.evaluate((rs: Row[]) => {
    return rs.map((r) => {
      const els = Array.from(document.querySelectorAll(r.sel));
      return {
        surface: r.surface,
        sel: r.sel,
        count: els.length,
        raw: els.length ? getComputedStyle(els[0]).getPropertyValue(r.prop) : null,
      };
    });
  }, rows as Row[]);
  const theme = await page.evaluate(
    () => document.documentElement.className.trim() || "(light)",
  );
  return { theme, readings };
}

/** Every watched selector must resolve to a real element carrying a parseable paint. A gate
 *  that greens because its selectors found nothing is the vacuity this wave exists to kill. */
function assertLegible(snap: Snapshot, where: string) {
  for (const r of snap.readings) {
    expect(
      r.count,
      `${where}: no element matched \`${r.sel}\` — the gate is reading nothing`,
    ).toBeGreaterThan(0);
    expect(
      inkKey(r.raw),
      `${where}: \`${r.sel}\` computed ${JSON.stringify(r.raw)} — the resolver could not read it (color-mix/color(srgb …)? see parseColor)`,
    ).not.toContain("UNPARSED:");
  }
}

const isDark = (page: Page) =>
  page.evaluate(() => document.documentElement.classList.contains("dark"));

/** Wait for the watched furniture to be dealt — polled on the selectors themselves, never a
 *  wall-clock guess (a kenken board deals with no given digits, so the clue IS the settle). */
async function settle(page: Page, rows: readonly Row[]) {
  for (const r of rows)
    await expect
      .poll(() => page.locator(r.sel).count(), {
        timeout: 30000,
        message: `\`${r.sel}\` never appeared`,
      })
      .toBeGreaterThan(0);
  await page.evaluate(() => document.fonts.ready);
}

/** The APP side of the quadrant: the REAL toggle, clicked, never seeded storage. */
async function setAppTheme(page: Page, want: "light" | "dark") {
  if ((await isDark(page)) === (want === "dark")) return false;
  await page.locator("button.sun-moon-toggle").click();
  await expect
    .poll(() => isDark(page), {
      timeout: 10000,
      message: `the toggle click never wrote app theme=${want}`,
    })
    .toBe(want === "dark");
  return true;
}

/** One quadrant, cold: a fresh context (empty `sudoku-color-scheme` storage, so `useDark`
 *  boots to the emulated system scheme), the OS side emulated, the app side clicked. */
async function quadrant(
  browser: Browser,
  baseURL: string | undefined,
  os: "light" | "dark",
  app: "light" | "dark",
  scope: { url: string; rows: readonly Row[] },
): Promise<Snapshot> {
  const context = await browser.newContext({
    baseURL,
    colorScheme: os,
    reducedMotion: "reduce",
    viewport: VIEWPORT,
  });
  try {
    const page = await context.newPage();
    await page.emulateMedia({ colorScheme: os, reducedMotion: "reduce" });
    await page.goto(scope.url);
    await settle(page, scope.rows);
    await setAppTheme(page, app);
    const snap = await snapshot(page, scope.rows);
    assertLegible(snap, `OS=${os} · app=${app}`);
    expect(
      snap.theme.includes("dark"),
      `OS=${os} · app=${app}: the app class is ${JSON.stringify(snap.theme)}, not ${app}`,
    ).toBe(app === "dark");
    return snap;
  } finally {
    await context.close();
  }
}

function bank(name: string, snaps: Record<string, Snapshot>) {
  return test.info().attach(`${name}.json`, {
    body: JSON.stringify(snaps, null, 2),
    contentType: "application/json",
  });
}

/** THE ASSERTION. Same app theme, opposite OS scheme → the same ink, per surface. */
async function assertIdentity(
  name: string,
  app: "light" | "dark",
  osLight: Snapshot,
  osDark: Snapshot,
) {
  await bank(`${name}-app-${app}`, { "os-light": osLight, "os-dark": osDark });
  // SOFT per row, hard in aggregate: every watched surface must report its own reading in the
  // same run. A hard expect on the first row would abort the test and leave the remaining
  // surfaces unmeasured — a born-RED bank that names one rung and stays silent on the rest.
  for (let i = 0; i < osLight.readings.length; i++) {
    const l = osLight.readings[i];
    const d = osDark.readings[i];
    expect
      .soft(
        inkKey(l.raw),
        `${name} · ${l.surface} · app=${app}: the ink is not a function of the app class alone — ` +
          `(OS=light) ${l.raw} vs (OS=dark) ${d.raw}. The mismatch quadrant renders the opposite theme's ink.`,
      )
      .toBe(inkKey(d.raw));
  }
}

// ── arm 1 · the four quadrants, board scope ────────────────────────────────────────────────

for (const [game, scope] of Object.entries(BOARDS)) {
  for (const app of ["dark", "light"] as const) {
    test(`G1.2 identity · ${game} · app=${app} reads the same ink under either OS scheme`, async ({
      browser,
      baseURL,
    }) => {
      const osLight = await quadrant(browser, baseURL, "light", app, scope);
      const osDark = await quadrant(browser, baseURL, "dark", app, scope);
      await assertIdentity(game, app, osLight, osDark);
    });
  }
}

// ── arm 2 · a real toggle CLICK moves the ink, not just the class ──────────────────────────

for (const [game, scope] of Object.entries(BOARDS)) {
  for (const os of ["light", "dark"] as const) {
    test(`G1.2 moves · ${game} · one toggle click under OS=${os} re-inks the furniture`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({
        baseURL,
        colorScheme: os,
        reducedMotion: "reduce",
        viewport: VIEWPORT,
      });
      try {
        const page = await context.newPage();
        await page.emulateMedia({ colorScheme: os, reducedMotion: "reduce" });
        await page.goto(scope.url);
        await settle(page, scope.rows);

        const before = await snapshot(page, scope.rows);
        assertLegible(before, `OS=${os} before the click`);

        const clicked = await setAppTheme(page, os === "light" ? "dark" : "light");
        expect(clicked, "the boot theme did not follow the emulated OS scheme").toBe(
          true,
        );

        const after = await snapshot(page, scope.rows);
        assertLegible(after, `OS=${os} after the click`);
        await bank(`${game}-moves-os-${os}`, { before, after });

        expect(after.theme, "the toggle did not change the app class").not.toBe(
          before.theme,
        );
        for (let i = 0; i < before.readings.length; i++) {
          const b = before.readings[i];
          const a = after.readings[i];
          expect
            .soft(
              inkKey(a.raw),
              `${game} · ${b.surface} · OS=${os}: the class flipped ${before.theme} → ${after.theme} ` +
                `and the ink did not move (${b.raw} both sides) — the furniture is keyed off the OS query, not the app.`,
            )
            .not.toBe(inkKey(b.raw));
        }
      } finally {
        await context.close();
      }
    });
  }
}

// ── arm 3 · 2.4 scope — the three poster cards ─────────────────────────────────────────────

for (const app of ["dark", "light"] as const) {
  test(`G1.2 identity · gallery posters · app=${app} reads the same ink under either OS scheme`, async ({
    browser,
    baseURL,
  }) => {
    const osLight = await quadrant(browser, baseURL, "light", app, GALLERY);
    const osDark = await quadrant(browser, baseURL, "dark", app, GALLERY);
    await assertIdentity("gallery", app, osLight, osDark);
  });
}
