/**
 * NOTE-ERASE pass 4 · Y4 — THE TWO FRAMES THAT CAN SHOW THEIR OWN CLAIM.
 *
 * Pass 3 cited four crops and the critic found two of them byte-identical (an empty grey strip
 * twice) and the park pair unreadable at 300.18 × 11.21. Pass 4 replaces two of the four:
 *
 *   MID-VERB  — the strip caught with the rub-out about half done, beside the same strip empty.
 *               One image, two bands: the sentence clipped from the right, then nothing. This is
 *               the crop `settledExit-390-chromium.png` could not be, because an empty strip
 *               cannot distinguish "the verb ran" from "the note never arrived".
 *   PARK      — the record standing in the folded card, captured at DPR 3 so the hand is legible
 *               rather than a grey band (`park-record-1280-webkit.png`'s defect).
 *
 * Both are captured with `animations: "disabled"` OFF for the mid-verb frame: freezing the
 * animation is precisely what would destroy the pose being shown.
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, say, boardReady, armHint } from "./lib";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/NOTE-ERASE";

const stripBox = (p: Page) =>
  p.evaluate(() => {
    const el = document.querySelector<HTMLElement>(".margin-note-block");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor(r.left) - 4),
      y: Math.max(0, Math.floor(r.top) - 4),
      width: Math.ceil(r.width) + 8,
      height: Math.ceil(r.height) + 8,
    };
  });

test("Y4a the mid-verb strip, beside the empty one", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "one engine carries the frame");
  await page.setViewportSize({ width: 390, height: 844 });
  await boardReady(page);
  await armHint(page);
  await page.waitForTimeout(400);
  const box = await stripBox(page);
  expect(box).toBeTruthy();

  // Fire the leave and sample the clip until it is between a fifth and four fifths done.
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    const empties = inputs.filter((i) => !i.value);
    empties[Math.min(4, empties.length - 1)]?.focus();
  });
  const grab = (async () => {
    for (let i = 0; i < 60; i++) {
      const s = await page.evaluate(() => {
        const el = document.querySelector<HTMLElement>(".margin-note-ink");
        if (!el || !el.classList.contains("note-leave-active")) return null;
        const cs = getComputedStyle(el);
        const m = cs.clipPath.match(/inset\([^)]*?([\d.]+)%/);
        return {
          clip: cs.clipPath,
          pct: m ? Number(m[1]) : null,
          text: (el.textContent || "").replace(/\s+/g, " ").trim(),
        };
      });
      if (s && s.pct !== null && s.pct > 20 && s.pct < 80) return s;
      await page.waitForTimeout(6);
    }
    return null;
  })();
  await page.keyboard.press("h");
  const mid = await grab;
  const midShot = mid ? await page.screenshot({ clip: box! }) : null;
  await page.waitForTimeout(900);
  const emptyShot = await page.screenshot({ clip: box! });

  let bytes = 0;
  if (midShot) {
    // One image, two bands: mid-verb over empty, so the pair cannot be byte-identical and the
    // claim is legible without a second file.
    const stacked = await sharp({
      create: {
        width: box!.width,
        height: box!.height * 2 + 3,
        channels: 3,
        background: { r: 210, g: 208, b: 205 },
      },
    })
      .composite([
        { input: midShot, top: 0, left: 0 },
        { input: emptyShot, top: box!.height + 3, left: 0 },
      ])
      .png({ compressionLevel: 9 })
      .toBuffer();
    writeFileSync(join(FRAMES, "midVerb-over-empty-390-chromium.png"), stacked);
    bytes = stacked.length;
  }
  const row = {
    engine: info.project.name,
    viewport: "390x844",
    pointer: "fine (mouse), no hasTouch",
    theme: "light",
    midSample: mid,
    bytes,
    retires: "pass3 frames/settledExit-390-chromium.png",
  };
  bank(`y4-midverb-${info.project.name}.json`, row);
  say("y4-mid", row);
  expect(mid, "a mid-verb sample was caught").toBeTruthy();
  expect(bytes).toBeGreaterThan(0);
  expect(bytes).toBeLessThan(150 * 1024);
});

test("Y4b the parked record does not PAINT — the clip that hides it", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "webkit", "the park pair was webkit's");
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  await armHint(page);
  await page.waitForTimeout(500);
  // The park: `g` folds the board away. Focus must leave the cell first — App.vue refuses the
  // shortcut while focus is in an input (pass 3's probe defect, carried). The fold SLIDES, so
  // the pose is waited out rather than guessed at.
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press("g");
  await page.waitForTimeout(1600);

  // PASS 3 CITED A RECT. This reads the PAINT. The record's ink has a box under the park, and
  // the box is below `.live-face-slot`'s `overflow: hidden` edge, so nothing of it rasters:
  // `elementFromPoint` at the ink's own centre returns the card's paper.
  const d = await page.evaluate(() => {
    const el = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const slot = document.querySelector<HTMLElement>(".live-face-slot");
    const sr = slot?.getBoundingClientRect() ?? null;
    const cx = r.x + r.width / 2;
    const cy = r.y + r.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    return {
      text: (el.textContent || "").replace(/\s+/g, " ").trim(),
      inkBox: {
        x: Math.round(r.x * 100) / 100,
        y: Math.round(r.y * 100) / 100,
        w: Math.round(r.width * 100) / 100,
        h: Math.round(r.height * 100) / 100,
      },
      slotBottom: sr ? Math.round(sr.bottom * 100) / 100 : null,
      slotOverflow: slot ? getComputedStyle(slot).overflow : null,
      hitAtInkCentre: hit ? (hit.className || hit.tagName).toString().slice(0, 60) : null,
    };
  });
  expect(d, "the ink had a box").toBeTruthy();

  const clip = {
    x: Math.max(0, Math.round(d!.inkBox.x) - 40),
    y: Math.max(0, Math.round(d!.inkBox.y) - 40),
    width: 240,
    height: 100,
  };
  const shot = await page.screenshot({ clip });
  const up = await sharp(shot)
    .resize({ width: clip.width * 3, kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(join(FRAMES, "parkRecord-clipped-1280-webkit.png"), up);

  const row = {
    engine: info.project.name,
    viewport: "1280x800",
    pointer: "fine (mouse), no hasTouch",
    theme: "light",
    ...d,
    crop: clip,
    bytes: up.length,
    retires: "pass3 frames/park-record-1280-webkit.png",
    finding:
      "G9's record arm was a RECT, not paint: the ink's top is below the folded card's " +
      "overflow:hidden edge, so the record stands in layout and rasters nothing.",
  };
  bank(`y4-park-${info.project.name}.json`, row);
  say("y4-park", row);
  expect(up.length).toBeLessThan(150 * 1024);
  // The finding, asserted so it cannot quietly stop being true: the ink begins BELOW the clip.
  expect(d!.slotOverflow).toBe("hidden");
  expect(d!.inkBox.y).toBeGreaterThan(d!.slotBottom!);
  expect(d!.hitAtInkCentre).not.toContain("margin-note");
});
