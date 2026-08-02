import { test, expect, type Page } from "@playwright/test";
import { attachBakeEvidence } from "./bake-evidence";
import { quarantineLinuxWebkitBake } from "./linux-webkit-bake-quarantine";

/**
 * P1 G3.4 — WORDMARK INTEGRITY, in WebKit, against the BUILT dist.
 *
 * Mark 4's two font defects, each as an assertion over rendered pixels rather than over source.
 * WebKit specifically, because both defects are WebKit's: it resolves `font-optical-sizing: auto`
 * on this face to the `opsz` axis MINIMUM (9) rather than to the font-size, and it pins a
 * filtered SVG-as-image bake at its declared intrinsic.
 *
 *  1. INK INSIDE THE BOX. Every one of the five wordmark labels must have transparent margin on
 *     all four edges of its baked pose bitmap. Measured by decoding the pose's own blob URL into
 *     a canvas (same-origin, so it never taints) and scanning for the first and last inked row
 *     and column. Born RED on the base build: ink reached the FINAL COLUMN of all five bitmaps
 *     — the measuring `<text>` sized `vbWidth` at opsz 9 while the detached bake blob painted
 *     wider, so the bake overran its own box and was cut at the right edge. `getBBox()` cannot
 *     see this: on an SVG `<text>` it returns the font's em box, not the ink, so it read an
 *     identical 64.13-unit height at every opsz value while the advance widths moved 33 units.
 *
 *     T5-W1 1.6 (B1) — THE VERDICT IS HOISTED, AND THE LINUX YIELD IS GONE. At 71456713 the
 *     vacuity term ("there is ink at all") was asserted first and a linux `test.skip` sat
 *     between it and the four edges, so an empty bake on linux aborted the row before the
 *     invariant it was born for was ever evaluated. Re-run on the forced-blank ablation, the
 *     shipped spec reproduced its own commit message to the word — `5 skipped, 1 passed, exit
 *     0` — with the edge verdict never computed on the only platform CI runs. The two terms
 *     are now ONE verdict (`inkBoxViolations`) asserted once, ahead of every branch, on both
 *     platforms in both bake states.
 *
 *     Why the yield could go rather than merely move: `test.skip()` aborts, so a yield that
 *     still shielded a blank would re-trap the very assertion the hoist exists to free —
 *     the two are mutually exclusive, and `gates.json W1.wordmarkHoist.clipAssertionPlatforms`
 *     names both platforms. It also bought no green. The yield's stated cover was
 *     theme-bake-freshness holding "the logo bake has ink at all" on linux in both engines at
 *     `retries: 0` — true, but that spec read the DEFAULT board only, so it covered 1 of the 5
 *     labels while runs 30684983201/30690204551 blanked `killer`, `futoshiki`, `thermo` and
 *     `kenken`. This row widened it to all five (theme-bake-freshness.spec.ts), which closes
 *     the 4-label hole AND settles the arithmetic: a blank on linux now reds theme-bake at
 *     `retries: 0` in both engines whatever this spec does, so skipping here never saved a
 *     lane — it only discarded the clip verdict. The blank still ships its bitmap
 *     (`attachBakeEvidence`, below): the yield's evidence half is kept, its silence half is not.
 *
 *     T5-W1 1.6 QUARANTINED — the hoist held, and it published a real defect. The first
 *     runner pass after the revocation (run 30719165442 on `e6b19a4c`, reproduced row-for-row
 *     on 30719158513, ubuntu · webkit, `retries: 0`) red `futoshiki`, `kenken` and `killer`
 *     here, while `sudoku` and `thermo` passed beside them and darwin passed all five. So the
 *     blank is neither unreproducible nor uniform: on ubuntu + WebKit the bake decodes to
 *     nothing for SOME games, deterministically. The skip had been masking a live defect
 *     rather than a ghost, and the argument for revoking it is unchanged — a silence would
 *     have hidden this for a second tranche.
 *
 *     T5-W2 2.4 — THE QUARANTINE IS GONE, AND THE ROWS SPEAK AGAIN. 1.6's park was written
 *     with its own removal wired in: it read `web/frontend/package.json` at spec load and
 *     THREW once the declared `@mkbabb/pencil-boil` range reached `>=0.11.0`, the version
 *     carrying `rasterizePoseToBlob()`. This wave declares `^0.11.0` and adopts it — the raster
 *     path hands back the capture canvas's own blob instead of round-tripping an `ImageBitmap`
 *     copy through a second surface and a re-encode, which deletes the stage the blank lived
 *     in. So the guard, its helper file and its call site were deleted whole rather than
 *     re-pinned, and every row went live on both platforms in both engines again. The runner
 *     was the judge — and it spoke twice, disagreeing with itself: run 30727947148
 *     (`74b2835d`) passed every de-quarantined row, run 30728779986 (`ff5a7cea`) redded four.
 *     **The library cure is REFUTED as sufficient**, and one green run of a nondeterministic
 *     race is a sample, not a proof. Record: `evidence/w2/verify/`.
 *
 *     T5-W4 SECOND PINNING — re-pinned as a class park (all five games, both specs,
 *     ubuntu·webkit only) carrying a re-aimed eviction: the guard read this frontend's
 *     `package.json` at spec load and THREW the moment the declared `@mkbabb/pencil-boil`
 *     reached `>=0.12.0`. Record: `evidence/w1/linux-webkit-bake-quarantine.md` (first
 *     pinning) · `evidence/w2/verify/bake-race-recurrence-30728779986.txt` (the refutation).
 *
 *     PASS 7 · LANE BC — THE THROW FIRED, AND THE QUARANTINE IS GONE FOR THE SECOND TIME.
 *     This frontend declares `^0.12.0` (the pose-stack cache), so the guard's own re-entry
 *     condition is met and its instructions are followed literally: the helper file, both
 *     call sites and the now-unused `game` parameter are deleted, and linux CI judges the
 *     class fresh. The judgment is explicitly MULTI-RUN and it is the lead's — 0.12.0 is a
 *     cache, not a bake-race cure, and it is NOT hypothesized to fix this class. What the
 *     removal buys is a live census: the rows red on ubuntu·webkit at `retries: 0` and say
 *     which games, which is the only instrument that can tell a rate from a cure. LEDGER row
 *     CH-62 still carries the class. Record: `evidence/design-loop/pass7/bc/`.
 *
 *     PASS 8 — THE CENSUS SPOKE, AND THE CLASS IS ALIVE. Observation 1 (run 30746739106,
 *     `eabc72e6`): zero bake reds. Observation 2 (run 30748405755, `6f4fcd09`): SEVEN —
 *     futoshiki + thermo here, five theme-bake rows next door, the widest single-run
 *     showing across two library generations. Verdict per the census protocol: THIRD
 *     PINNING, re-entry re-aimed `>=0.13.0`; the runner rig root-cause (CH-62's owner) is
 *     the only other exit. The rate now stands measured at 2-of-4 de-quarantined runs
 *     red, 4-to-7 rows when it fires, game set never twice the same.
 *
 *  2. NO FALLBACK GLYPHS. Every character of every rendered label must actually come from
 *     Fraunces. Measured by the sentinel-fallback method (lane D's, kept because the obvious
 *     probe is vacuous): render the glyph as `Fraunces, <sentinel>` and as `<sentinel>` alone —
 *     if the face covers the codepoint the widths DIFFER, and if it does not the glyph falls
 *     through to the sentinel and the widths are IDENTICAL. Two metric-distinct sentinels must
 *     agree. An inline CONTROL asserts the probe can answer NO, because measuring against
 *     Georgia instead reports 100% coverage for every font including a broken one. Born RED on
 *     the base build: `thermo` painted its `m` in Georgia and `kenken` painted both `n`s, mid-word
 *     at 96 px, beside three correct wordmarks.
 */

const GAMES = ["sudoku", "futoshiki", "thermo", "killer", "kenken"] as const;

type PoseInk = {
  W: number;
  H: number;
  top: number;
  bot: number;
  left: number;
  right: number;
};

/**
 * The four-edge verdict over a pose's ink box — `[]` is the invariant held.
 *
 * ONE invariant, two terms, fused on purpose. "The label's ink sits inside its bitmap" says
 * nothing unless there IS ink: a blank bitmap clears all four edges vacuously. So absence is
 * a violation TERM, `no-ink`, and not a separate assertion that a branch could get in front
 * of. Fusing them is what makes the hoist real — there is one thing to evaluate, it is
 * evaluated before anything can abort the row, and it is the same thing on every platform.
 */
function inkBoxViolations(r: PoseInk): string[] {
  if (r.top < 0) return ["no-ink"];
  return [
    r.top === 0 && "top",
    r.bot === r.H - 1 && "bottom",
    r.left === 0 && "left",
    r.right === r.W - 1 && "right",
  ].filter((e): e is string => typeof e === "string");
}

/** The ink box of the pose stack's CURRENT bitmap, decoded off its own blob URL. */
const READ_POSE_INK = async () => {
  const svg = document.querySelector("svg.handwritten-logo")!;
  const img = svg.querySelector("image.logo-pose-bmp");
  if (!img) return { W: 0, H: 0, top: -1, bot: -1, left: -1, right: -1 };
  const href = img.getAttribute("href")!;
  const bmp = await new Promise<HTMLImageElement | null>((ok) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = () => ok(null);
    i.src = href;
  });
  if (!bmp) return { W: 0, H: 0, top: -1, bot: -1, left: -1, right: -1 };
  const W = bmp.naturalWidth;
  const H = bmp.naturalHeight;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.drawImage(bmp, 0, 0);
  const d = g.getImageData(0, 0, W, H).data;
  // The bake is transparent-backed, so alpha IS ink. 24/255 clears AA fringe.
  const ink = (x: number, y: number) => d[(y * W + x) * 4 + 3] > 24;
  let top = -1;
  let bot = -1;
  let left = -1;
  let right = -1;
  for (let y = 0; y < H && top < 0; y++)
    for (let x = 0; x < W; x++) if (ink(x, y)) top = y;
  for (let y = H - 1; y >= 0 && bot < 0; y--)
    for (let x = 0; x < W; x++) if (ink(x, y)) bot = y;
  for (let x = 0; x < W && left < 0; x++)
    for (let y = 0; y < H; y++) if (ink(x, y)) left = x;
  for (let x = W - 1; x >= 0 && right < 0; x--)
    for (let y = 0; y < H; y++) if (ink(x, y)) right = x;
  return { W, H, top, bot, left, right };
};

/**
 * Read the pose stack, POLLING the live `<image>` until it carries ink or the window closes.
 *
 * The bake is asynchronous and two-stage: `useRasterStack` bakes once on `document.fonts.ready`
 * and again when `measure()` re-fits `vbWidth` (a new `cacheKey`), and the consumer holds the
 * previous URLs across the second bake so the wordmark swaps atomically. A fixed wait samples
 * whatever that sequence happens to have reached; this re-reads the CURRENT href, so a re-bake
 * landing late — or a decode that had not finished — is waited out rather than asserted on.
 * First read wins when the stack is already settled, which is every green run.
 */
async function settledPoseInk(page: Page, timeout = 15000) {
  const deadline = Date.now() + timeout;
  let r = await page.evaluate(READ_POSE_INK);
  while (r.top < 0 && Date.now() < deadline) {
    await page.waitForTimeout(500);
    r = await page.evaluate(READ_POSE_INK);
  }
  return r;
}

async function loadWordmark(page: Page, game: string) {
  await page.goto(`./?game=${game}&size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  // The pose stack must be BAKED — the assertion is about the bitmaps that ship.
  await expect
    .poll(() => page.locator("svg.handwritten-logo image.logo-pose-bmp").count(), {
      timeout: 30000,
    })
    .toBeGreaterThan(0);
  // …and re-baked after `document.fonts.ready`, which is when `measure()` re-fits the box.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
}

test.describe("G3.4 · wordmark integrity (WebKit, built dist)", () => {
  for (const game of GAMES) {
    test(`${game}: baked ink sits inside its own box on all four edges`, async ({
      page,
    }, testInfo) => {
      await loadWordmark(page, game);
      const r = await settledPoseInk(page);

      // EVIDENCE FIRST, and unconditionally on an unreadable bake — the pose that was read
      // ships with the red, so the next occurrence is attributable rather than a message
      // (run 30684983201 reported this with nothing attached; see bake-evidence.ts).
      //
      // What the runner's blank is, kept because it is the attribution a future red inherits:
      // runs 30684983201 (`killer`) and 30690204551 (`sudoku`, `futoshiki`, `thermo`,
      // `kenken`) read a pose blob that is a VALID, correctly-sized, entirely transparent
      // PNG — 272–313 bytes at the label's own measured intrinsic (381×112 sudoku/kenken,
      // 472×112 futoshiki, 384×112 thermo, matching that host's geometry to the pixel), with
      // `fonts.status: loaded`, `check('900 52px "Fraunces"')` true and all four pose hrefs
      // minted. Not a mid-flight sample: it was the SECOND, post-`fonts.ready` capture at the
      // settled box, and the only surface in the page that came back empty is the one whose
      // detached blob carries an inlined `@font-face` — the grid bake, same filter recipe and
      // no font, painted (run 30690204551's own failure screenshot). `useRasterStack` re-bakes
      // on cacheKey / cssSize / dpr / mount and nothing else, so once that box settles the
      // blob is TERMINAL: 1d03f940's retry could not clear it (3 of 4 rows failed the second
      // attempt too, on fresh pages and new blobs) and the poll above cannot either. It has
      // never reproduced off the runner — 206/206 ×3 on darwin, and in the runner's own image
      // (v1.61.1 jammy AND noble, webkit) 137 wordmark rows over cold pages plus 160 synthetic
      // captures of the recipe, ZERO blank — and real WebKit ships the wordmark whole in
      // production. The settle→poll above is the cure that holds; what does NOT follow from an
      // unreproducible artefact is a silent lane, which is why the row now reds here and the
      // yield is recorded dead in this file's header (T5-W1 1.6).
      if (r.top < 0)
        await attachBakeEvidence(
          page,
          testInfo,
          "svg.handwritten-logo image.logo-pose-bmp",
          game,
        );

      // THE EXPLICIT QUARANTINE, third pinning — the class (all five games), linux + webkit,
      // until the runner-rig verdict or pencil-boil >=0.13.0 (see the module header; the
      // CH-62 census closed at obs 2: run 30748405755 redded SEVEN bake rows). AFTER the
      // read and the evidence attach on purpose: the parked arm still bakes, still reads,
      // and still ships the pose bitmap it read.
      quarantineLinuxWebkitBake("wordmark-integrity", game, testInfo);

      // THE HOISTED VERDICT. One assertion, both terms, ahead of every branch — nothing
      // between the read and the assert can abort the row, on any platform.
      expect(
        inkBoxViolations(r),
        `${game}: baked ink must sit inside its own ${r.W}×${r.H} bitmap on all four edges`,
      ).toEqual([]);
    });
  }

  test("all five labels render every glyph in Fraunces — zero fallback glyphs", async ({
    page,
  }) => {
    await loadWordmark(page, "thermo");
    const r = await page.evaluate((labels: readonly string[]) => {
      const SENTINELS = ["monospace", "cursive"];
      const span = document.createElement("span");
      span.style.cssText =
        "position:absolute;visibility:hidden;white-space:pre;font-size:200px;font-weight:900";
      document.body.appendChild(span);
      const width = (ch: string, fam: string) => {
        span.style.fontFamily = fam;
        span.textContent = ch;
        return span.getBoundingClientRect().width;
      };
      const inFraunces = (ch: string) =>
        SENTINELS.every(
          (s) => Math.abs(width(ch, `"Fraunces", ${s}`) - width(ch, s)) > 0.01,
        );
      // CONTROL: the probe must be able to answer NO. 'a' is in every variant of the subset,
      // 'Ω' is in none. If these ever agree the probe is broken, not the font.
      const control = { a: inFraunces("a"), omega: inFraunces("Ω") };
      const missing: Record<string, string> = {};
      for (const label of labels) {
        const miss = [...label].filter((c) => c !== " " && !inFraunces(c)).join("");
        if (miss) missing[label] = miss;
      }
      span.remove();
      return { control, missing };
    }, GAMES);
    expect(
      r.control,
      "the coverage probe cannot answer NO — it is measuring nothing",
    ).toEqual({
      a: true,
      omega: false,
    });
    expect(r.missing, "labels painting glyphs in the Georgia fallback").toEqual({});
  });
});
