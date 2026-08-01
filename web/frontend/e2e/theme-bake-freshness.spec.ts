import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { attachBakeEvidence } from "./bake-evidence";

/**
 * P1-W4 G4.5 — THE BAKED SURFACES CARRY THE LIVE THEME'S INK, against the BUILT dist.
 *
 * The hole the G4.5 production pass fell through. Every visual gate before this one loads
 * fresh and asserts ONE theme per page — `visual-golden`, `filter-census` and
 * `wordmark-integrity` all `goto` then assert, and the rig's `themeToggle` scenario measures
 * frame COST, not ink. Nothing toggled the theme and then re-read a baked surface, so nothing
 * caught this: after one click of the celestial toggle both baked surfaces kept the ink of the
 * theme they had just left, and only a reload repaired them. Measured on the deployed artifact
 * — a near-white wordmark on `rgb(251,250,249)` paper (1.13:1) going dark→light, near-black on
 * `rgb(17,15,14)` (1.02:1) going light→dark, and a `rgb(209,207,199)` grid bake against a live
 * `#262626`. The wordmark was legible in neither direction.
 *
 * Cause, and why the assertion is shaped this way: the re-bake DOES fire — the pose blob URLs
 * are re-minted across the toggle in both engines — but it captured before the `<html>` class
 * write that flips the cascade had landed, so `resolveCssValue` resolved the outgoing theme's
 * colour and the wrong bitmap then cached under the incoming theme's key, where nothing
 * invalidated it again. So asserting "the blob changed" would pass on the defect. The
 * assertion has to be over the PIXELS the blob decodes to, read against the live cascade:
 *
 *   · the logo bake's mean ink must clear WCAG 4:1 against the live paper it sits on;
 *   · the grid bake's mean ink must sit within ΔE 24 (sRGB) of the live `--grid-line-color`.
 *
 * Both are asserted BEFORE the toggle too, on the fresh load, so a sampler that has quietly
 * stopped measuring anything reds instead of passing vacuously. Both directions run, each as
 * its own ONE-toggle test off an emulated system scheme — that is the reported gesture, and a
 * defect that reproduced in only one direction would still be a defect.
 *
 * Chromium AND WebKit: the production pass measured it engine-independent (WebKit held
 * `rgb(12,12,12)` and Chromium `rgb(10,10,10)` against the same live `rgb(237,236,233)`), and
 * an engine-independent defect is worth guarding in both.
 *
 * Born RED against @mkbabb/pencil-boil 0.10.0 (contrast 1.02 / 1.04, grid ΔE ~296 in both
 * engines, on the current dist AND on the banked pre-W3 baseline — the defect predates the
 * `disableTransition` change). Cured by 0.10.1: `useRasterStack` yields one paint boundary
 * before it captures, so `poseSvg` reads the cascade the flip produced.
 */

const MIN_CONTRAST = 4; // WCAG AA large-text; the defect measured 1.02–1.13
const MAX_GRID_DE = 24; // sRGB euclidean; a correct bake measures ~3.5, the stale one ~296

type Sample = {
  theme: string;
  paper: string;
  liveGrid: string;
  logoHref: string | null;
  gridHref: string | null;
  logoInk: string | null;
  gridInk: string | null;
};

/**
 * Mean ink of each baked surface, read out of the pose's own blob URL through a canvas
 * (same-origin, so it never taints), plus the live cascade values it must agree with.
 */
async function sample(page: Page): Promise<Sample> {
  return page.evaluate(async () => {
    const meanInk = (href: string | null) =>
      new Promise<string | null>((ok) => {
        if (!href) return ok(null);
        const i = new Image();
        i.onload = () => {
          const c = document.createElement("canvas");
          c.width = i.naturalWidth;
          c.height = i.naturalHeight;
          const g = c.getContext("2d")!;
          g.drawImage(i, 0, 0);
          const d = g.getImageData(0, 0, c.width, c.height).data;
          // Opaque pixels only: the bake is transparent-backed, and AA fringe would drag the
          // mean toward the paper and mask a stale ink as a merely-washed-out one.
          let R = 0;
          let G = 0;
          let B = 0;
          let n = 0;
          for (let k = 0; k < d.length; k += 4)
            if (d[k + 3] > 200) {
              R += d[k];
              G += d[k + 1];
              B += d[k + 2];
              n++;
            }
          ok(
            n
              ? `rgb(${Math.round(R / n)},${Math.round(G / n)},${Math.round(B / n)})`
              : "no-ink",
          );
        };
        i.onerror = () => ok("load-failed");
        i.src = href;
      });

    const logoSvg = document.querySelector("svg.handwritten-logo");
    const gridSvg = document.querySelector("svg.hand-drawn-grid");
    const logoHref =
      logoSvg?.querySelector("image.logo-pose-bmp")?.getAttribute("href") ?? null;
    const gridHref = gridSvg?.querySelector("image")?.getAttribute("href") ?? null;
    const [logoInk, gridInk] = await Promise.all([
      meanInk(logoHref),
      meanInk(gridHref),
    ]);
    return {
      theme: document.documentElement.className || "(light)",
      paper: getComputedStyle(document.body).backgroundColor,
      liveGrid: gridSvg
        ? getComputedStyle(gridSvg).getPropertyValue("--grid-line-color").trim()
        : "",
      logoHref,
      gridHref,
      logoInk,
      gridInk,
    };
  });
}

/** `rgb(a, b, c)` or `#rgb` / `#rrggbb` → channel triple. */
function channels(colour: string): [number, number, number] {
  const s = colour.trim();
  if (s.startsWith("#")) {
    const h = s.slice(1);
    const w = h.length <= 4 ? 1 : 2;
    const at = (i: number) => {
      const part = h.slice(i * w, i * w + w);
      return parseInt(w === 1 ? part + part : part, 16);
    };
    return [at(0), at(1), at(2)];
  }
  const n = (s.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  return [n[0] ?? 0, n[1] ?? 0, n[2] ?? 0];
}

function contrast(a: string, b: string): number {
  const lum = (c: string) => {
    const [r, g, bl] = channels(c).map((v) => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

function deltaE(a: string, b: string): number {
  const [p, q] = [channels(a), channels(b)];
  return Math.round(Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) * 10) / 10;
}

async function loadBaked(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo image.logo-pose-bmp", {
    timeout: 30000,
  });
  await page.waitForSelector("svg.hand-drawn-grid image", { timeout: 30000 });
  // The logo re-bakes once `document.fonts.ready` re-fits the box — sample the settled stack.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
}

/**
 * `sample`, POLLED until both baked surfaces decode to real ink or the window closes.
 *
 * The same settle wordmark-integrity takes, for the same reason: the bake is asynchronous and
 * two-stage (`useRasterStack` captures on `document.fonts.ready`, then again when the box
 * re-fits under a new `cacheKey`), and the consumer holds the previous URLs across the second
 * capture. Sampling on a wall-clock guess reads whatever that sequence has reached; this waits
 * the settle out. First read wins whenever the stack is already settled.
 */
async function settledSample(page: Page, timeout = 15000): Promise<Sample> {
  const unread = (v: string | null) => !v || v === "no-ink" || v === "load-failed";
  const deadline = Date.now() + timeout;
  let s = await sample(page);
  while ((unread(s.logoInk) || unread(s.gridInk)) && Date.now() < deadline) {
    await page.waitForTimeout(500);
    s = await sample(page);
  }
  return s;
}

async function assertAgrees(s: Sample, when: string, page: Page, testInfo: TestInfo) {
  // This spec reads the SAME baked pose bitmap wordmark-integrity does, so it is exposed to
  // the same unreadable-bake red (CI run 30684983201) and gets the same rule: ship the pose
  // that was read, so the next occurrence is attributable rather than a message.
  if (!s.logoInk || s.logoInk === "no-ink" || s.logoInk === "load-failed")
    await attachBakeEvidence(
      page,
      testInfo,
      "svg.handwritten-logo image.logo-pose-bmp",
      when.replace(/\W+/g, "-"),
    );
  expect(s.logoInk, `${when}: no logo bake to read`).toBeTruthy();
  expect(s.logoInk, `${when}: the logo bake decoded to nothing`).not.toBe("no-ink");
  expect(
    contrast(s.logoInk!, s.paper),
    `${when} (${s.theme}): logo bake ${s.logoInk} on live paper ${s.paper} — the wordmark is carrying the other theme's ink`,
  ).toBeGreaterThanOrEqual(MIN_CONTRAST);
  expect(
    deltaE(s.gridInk!, s.liveGrid),
    `${when} (${s.theme}): grid bake ${s.gridInk} vs live --grid-line-color ${s.liveGrid} — the bake is carrying the other theme's line colour`,
  ).toBeLessThanOrEqual(MAX_GRID_DE);
}

for (const start of ["light", "dark"] as const) {
  test.describe(`G4.5 · baked ink survives one theme toggle (from ${start})`, () => {
    test.use({ colorScheme: start });

    test(`${start} → ${start === "light" ? "dark" : "light"}: both baked surfaces re-ink`, async ({
      page,
    }, testInfo) => {
      await loadBaked(page);
      const before = await settledSample(page);
      // The fresh load is the control: if this reds, the sampler is broken, not the bake.
      await assertAgrees(before, "fresh load", page, testInfo);

      await page.locator("button.sun-moon-toggle").click();

      // Wait on the re-bake ITSELF (the blob is re-minted), not on a wall-clock guess — and
      // fail loudly if it never fires, which is the other way this surface could go stale.
      await expect
        .poll(
          async () =>
            await page.evaluate(
              () =>
                document
                  .querySelector("svg.handwritten-logo image.logo-pose-bmp")
                  ?.getAttribute("href") ?? null,
            ),
          { timeout: 20000, message: "the logo pose blob was never re-minted" },
        )
        .not.toBe(before.logoHref);
      await expect
        .poll(
          async () =>
            await page.evaluate(
              () =>
                document
                  .querySelector("svg.hand-drawn-grid image")
                  ?.getAttribute("href") ?? null,
            ),
          { timeout: 20000, message: "the grid pose blob was never re-minted" },
        )
        .not.toBe(before.gridHref);
      await page.waitForTimeout(400); // let the atomic url swap settle across all poses

      const after = await settledSample(page);
      expect(after.theme, "the toggle did not change the theme").not.toBe(before.theme);
      await assertAgrees(after, "after ONE toggle", page, testInfo);
    });
  });
}
