import { test, expect, type Page } from "@playwright/test";
import { attachBakeEvidence } from "./bake-evidence";

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
      const r = await page.evaluate(async () => {
        const svg = document.querySelector("svg.handwritten-logo")!;
        const img = svg.querySelector("image.logo-pose-bmp")!;
        const href = img.getAttribute("href")!;
        const bmp = await new Promise<HTMLImageElement>((ok, no) => {
          const i = new Image();
          i.onload = () => ok(i);
          i.onerror = no;
          i.src = href;
        });
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
      });
      // Ink was found at all (a blank bake would otherwise pass every edge check vacuously).
      // An empty read ships the pose it read (CI run 30684983201 reported this with nothing
      // attached; see bake-evidence.ts) — attribution belongs to the red, not to the retry.
      if (r.top < 0)
        await attachBakeEvidence(
          page,
          testInfo,
          "svg.handwritten-logo image.logo-pose-bmp",
          game,
        );
      expect(r.top, "no ink in the baked pose at all").toBeGreaterThanOrEqual(0);
      const clipped = [
        r.top === 0 && "top",
        r.bot === r.H - 1 && "bottom",
        r.left === 0 && "left",
        r.right === r.W - 1 && "right",
      ].filter(Boolean);
      expect(clipped, `${game} ink touches its bitmap edge (${r.W}×${r.H})`).toEqual(
        [],
      );
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
