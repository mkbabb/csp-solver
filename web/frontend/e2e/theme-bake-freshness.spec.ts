import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { attachBakeEvidence } from "./bake-evidence";
import { quarantineLinuxWebkitBake } from "./linux-webkit-bake-quarantine";

// PRM: live, because nothing in the bundled-preview lane applies it—this spec flips the theme and
//   re-reads the baked pose bitmap off its own blob URL while the beat walks the stack. What it
//   asserts (the re-mint carries the live theme's ink) is theme-driven, never beat-driven.

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
 *
 * ALL FIVE LABELS, not the default board (T5-W1 1.6, from B1's second hole). This spec carries
 * a second load beyond its own: `expect(s.logoInk).not.toBe("no-ink")` at `retries: 0` in BOTH
 * engines is the estate's unconditional "the logo bake decoded to something" guard, and
 * wordmark-integrity's linux yield was granted against it. But `loadBaked` navigated
 * `./?size=3&difficulty=EASY` — no `game=`, i.e. the default board — so all four rows read the
 * SUDOKU wordmark and the guard covered 1 of the 5 labels, while the runs that motivated the
 * yield (30684983201 / 30690204551) blanked `killer`, `futoshiki`, `thermo` and `kenken`: four
 * fifths of the labels had no linux vacuity guard anywhere in the estate. The describe is now
 * parameterised over the same five labels wordmark-integrity asserts, so the guard is 5/5 and
 * the toggle itself is measured per game rather than inferred from one board.
 *
 * AND THE WIDENING PAID IMMEDIATELY (T5-W1 1.6, the quarantine). The first runner pass after
 * it landed — run 30719165442 on `e6b19a4c`, reproduced row-for-row on 30719158513, ubuntu ·
 * webkit, `retries: 0` — red `futoshiki` and `killer` on `expect(s.logoInk).not.toBe("no-ink")`
 * at the FRESH LOAD, i.e. before any toggle. Two of the four labels this spec could not see a
 * fortnight ago. `sudoku`, `thermo` and `kenken` passed beside them, chromium passed all five,
 * darwin passed all twenty: the class is a linux-WebKit blank bake on SOME games, deterministic,
 * and it is the defect wordmark-integrity's dead linux `test.skip` had been swallowing.
 *
 * T5-W2 2.4 — THE QUARANTINE WENT, AND CAME BACK. The park carried its own removal: it read
 * this frontend's `package.json` at spec load and THREW once the declared
 * `@mkbabb/pencil-boil` range reached `>=0.11.0`. W2 declared `^0.11.0` and adopted
 * `rasterizePoseToBlob()`, deleting the `ImageBitmap` copy + re-encode stage the blank lived
 * in, and let the runner judge. It judged twice and disagreed: run 30727947148 green on every
 * de-quarantined row, run 30728779986 red on four. The library cure is REFUTED as sufficient,
 * so T5-W4 re-pinned the class with its eviction re-aimed at `>=0.12.0`. Record:
 * `docs/tranches/2026-08-tranche-5/evidence/w1/linux-webkit-bake-quarantine.md` (the park) ·
 * `evidence/w2/verify/bake-race-recurrence-30728779986.txt` (the refutation).
 *
 * PASS 7 · LANE BC — THE THROW FIRED AND THE PARK IS GONE AGAIN. This frontend declares
 * `^0.12.0` (the pose-stack cache), which meets the guard's re-entry condition, so the helper,
 * both call sites and `assertAgrees`'s now-unused `game` parameter are deleted per the guard's
 * own written instructions. 0.12.0 is a cache and is NOT hypothesized to cure a bake race —
 * what the removal buys is a live census on ubuntu·webkit at `retries: 0`, the only instrument
 * that separates a rate from a cure. The judgment is MULTI-RUN and the lead's; LEDGER row
 * CH-62 still carries the class. Record: `evidence/design-loop/pass7/bc/`.
 *
 * PASS 8 — THE CENSUS SPOKE: THIRD PINNING. Obs 1 (30746739106, `eabc72e6`) zero bake reds;
 * obs 2 (30748405755, `6f4fcd09`) SEVEN — five rows of THIS spec (thermo/killer/kenken
 * light→dark, futoshiki/kenken dark→light) plus wordmark futoshiki/thermo. The widest
 * single-run showing, across two library generations. Verdict per the protocol: re-pin the
 * class, eviction re-aimed `>=0.13.0`; the runner-rig root-cause (CH-62's owner) is the only
 * other exit.
 */

const GAMES = ["sudoku", "futoshiki", "thermo", "killer", "kenken"] as const;

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

async function loadBaked(page: Page, game: string) {
  await page.goto(`./?game=${game}&size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo image.logo-pose-bmp", {
    timeout: 30000,
  });
  await page.waitForSelector("svg.hand-drawn-grid image", { timeout: 30000 });
  // The logo re-bakes once `document.fonts.ready` re-fits the box — sample the settled stack.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
}

const unread = (v: string | null) => !v || v === "no-ink" || v === "load-failed";

/**
 * The two numbers `assertAgrees` rules on — the READS themselves, not the blobs behind them.
 * `null` while either surface is undecoded, which is never a settled state.
 */
function verdictReads(s: Sample): [number, number] | null {
  if (unread(s.logoInk) || unread(s.gridInk)) return null;
  return [contrast(s.logoInk!, s.paper), deltaE(s.gridInk!, s.liveGrid)];
}

/**
 * `sample`, POLLED until THE CONTRAST READ STOPS MOVING.
 *
 * The same settle wordmark-integrity takes, for the same reason: the bake is asynchronous and
 * two-stage (`useRasterStack` captures on `document.fonts.ready`, then again when the box
 * re-fits under a new `cacheKey`), and the consumer holds the previous URLs across the second
 * capture. Sampling on a wall-clock guess reads whatever that sequence has reached.
 *
 * T7-W3 — RE-CUT ONTO THE ASSERTED INVARIANT. The predicate was `unread(logoInk) ||
 * unread(gridInk)`: it waited for the blobs to decode to something and returned the first
 * sample that did, while the assertions below are a CONTRAST and a ΔE — each read against a
 * live cascade value (`paper`, `liveGrid`) the poll never looked at. Two ways that bites, both
 * measured on the built dist (evidence/w3/requarantine-polls.txt): across the toggle the paper
 * flips 93–229ms before the pose blobs re-mint, so there is a real window where both surfaces
 * decode fine and the contrast reads the DEFECT (1.02 dark-on-dark) with nothing stale about
 * the page; and the grid bake lands 114–221ms after the logo on a fresh load. A poll on
 * "decoded" clears both windows.
 *
 * So the settle is now the verdict's own numbers: two consecutive samples yielding the same
 * contrast and the same ΔE. It is NOT a poll on the thresholds — `MIN_CONTRAST` and
 * `MAX_GRID_DE` appear nowhere in the predicate, so a stale bake (which is terminal: it caches
 * under the incoming theme's key and nothing invalidates it again) is stable at once and reds
 * on the first quiet window. And an undecoded surface is never settled, so the estate's
 * unconditional `not.toBe("no-ink")` guard keeps its full window and its red.
 *
 * Measured differential, 5 games × both engines, started the instant the paper flips: the old
 * predicate returned in 5–126ms reading contrast 1.02 (webkit) / 1.04 (chromium) and ΔE
 * 289–293 — the defect's own numbers, off a page where nothing is broken and both blobs decode
 * fine. The new predicate waited it out in ~1.0–1.1s and read 16.18 / ΔE 0, 10 of 10. Same
 * stated limit as its twin next door: one quiet 500ms window is what "stopped moving" means.
 */
async function settledSample(page: Page, timeout = 15000): Promise<Sample> {
  const deadline = Date.now() + timeout;
  let prev = await sample(page);
  while (Date.now() < deadline) {
    // The literal stays literal so `check-sleep-lint.mjs` can see this site and rule on it:
    // the elapsed time is the measurement here — the read after it is compared with the read
    // before it — not a settle proxy standing in front of a one-shot read.
    // sleep-ok: the 500ms is the INTERVAL BETWEEN TWO SAMPLES of a stability poll.
    await page.waitForTimeout(500);
    const next = await sample(page);
    const [a, b] = [verdictReads(prev), verdictReads(next)];
    if (a && b && a[0] === b[0] && a[1] === b[1]) return next;
    prev = next;
  }
  return prev;
}

async function assertAgrees(
  s: Sample,
  when: string,
  page: Page,
  testInfo: TestInfo,
  game: string,
) {
  // This spec reads the SAME baked pose bitmap wordmark-integrity does, so it is exposed to
  // the same unreadable-bake red (CI run 30684983201) and gets the same rule: ship the pose
  // that was read, so the next occurrence is attributable rather than a message.
  if (unread(s.logoInk))
    await attachBakeEvidence(
      page,
      testInfo,
      "svg.handwritten-logo image.logo-pose-bmp",
      when.replace(/\W+/g, "-"),
    );
  // THE EXPLICIT QUARANTINE, third pinning — the class (all five games), linux + webkit,
  // until the runner-rig verdict or pencil-boil >=0.13.0 (see the module header; the CH-62
  // census closed at obs 2: run 30748405755 redded five rows of THIS spec plus two next
  // door). Behind the evidence attach and in front of the assertions, so the parked arm
  // still reads its bake and still ships the bitmap it read.
  quarantineLinuxWebkitBake("theme-bake-freshness", game, testInfo);
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

    for (const game of GAMES) {
      test(`${game} ${start} → ${start === "light" ? "dark" : "light"}: both baked surfaces re-ink`, async ({
        page,
      }, testInfo) => {
        await loadBaked(page, game);
        const before = await settledSample(page);
        // The fresh load is the control: if this reds, the sampler is broken, not the bake.
        await assertAgrees(before, `${game} fresh load`, page, testInfo, game);

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

        // A fixed 400ms "let the atomic url swap settle" used to stand here. It is gone with
        // the poll re-cut (T7-W3): both surfaces are already proven re-minted by the polls
        // above, and what was left to wait out is the READ — which `settledSample` now settles
        // on directly, contrast and ΔE, rather than guessing a duration in front of it.
        const after = await settledSample(page);
        expect(after.theme, "the toggle did not change the theme").not.toBe(
          before.theme,
        );
        await assertAgrees(after, `${game} after ONE toggle`, page, testInfo, game);
      });
    }
  });
}
