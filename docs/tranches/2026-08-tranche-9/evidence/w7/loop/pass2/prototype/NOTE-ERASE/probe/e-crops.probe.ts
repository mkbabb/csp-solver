/**
 * NOTE-ERASE pass 2 · E — THE TWO CROPS, both steady states, both at 1280 chromium.
 * They photograph the ONE behaviour change the owner disposes at the re-look (U-10): under the
 * park a `record` stands in the card and a `reply` is gone. The repeat's hole is NOT
 * photographed — it is 13 ms wide at mutation time, under any screenshot's latency, and an
 * empty strip is a picture of nothing; B1's trajectory is its evidence.
 */
import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { FRAMES, armHint, bank, boardReady, readNote, refuseAGiven, say } from "./lib";

test("E the park, photographed per kind", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "one engine is enough for a crop");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });

  const park = async () => {
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.waitForTimeout(120);
    await page.keyboard.press("g");
    await page.waitForTimeout(1400); // the fold settles
  };
  // The crop is the UNION of the parked board face and the strip below it: the point of the
  // frame is the line under the board, so a clip of the face alone photographs the wrong thing.
  const cardClip = () =>
    page.evaluate(() => {
      const face = document.querySelector(".live-face-fit");
      const strip = document.querySelector(".board-margin") ?? document.querySelector(".margin-note-block");
      if (!face || !strip) return null;
      const a = face.getBoundingClientRect();
      const b = strip.getBoundingClientRect();
      const x0 = Math.min(a.left, b.left);
      const y0 = Math.min(a.top, b.top);
      const x1 = Math.max(a.right, b.right);
      const y1 = Math.max(a.bottom, b.bottom);
      return {
        x: Math.max(0, Math.floor(x0) - 8),
        y: Math.max(0, Math.floor(y0) - 8),
        width: Math.ceil(x1 - x0) + 16,
        height: Math.ceil(y1 - y0) + 16,
      };
    });

  // 1 — a RECORD under the park: it stands, small, in the card.
  await boardReady(page);
  const armed = await armHint(page);
  await park();
  const recordNote = await readNote(page);
  const clip1 = await cardClip();
  let bytes1 = 0;
  if (clip1) {
    const buf = await page.screenshot({ clip: clip1 });
    writeFileSync(join(FRAMES, "park-record-1280-chromium.png"), buf);
    bytes1 = buf.length;
  }

  // 2 — a REPLY under the park: gone, one rub-out after the fold.
  await boardReady(page);
  await refuseAGiven(page, "5");
  await page.waitForTimeout(700);
  const replyBefore = await readNote(page);
  await park();
  const replyNote = await readNote(page);
  const clip2 = await cardClip();
  let bytes2 = 0;
  if (clip2) {
    const buf = await page.screenshot({ clip: clip2 });
    writeFileSync(join(FRAMES, "park-reply-1280-chromium.png"), buf);
    bytes2 = buf.length;
  }

  const row = {
    engine: browserName,
    record: { armed: armed?.text, parked: recordNote?.text, box: recordNote?.box, bytes: bytes1, clip: clip1 },
    reply: { before: replyBefore?.text, parked: replyNote?.text, bytes: bytes2, clip: clip2 },
  };
  bank("e-crops-chromium.json", row);
  say("E", row);
  expect(bytes1).toBeGreaterThan(0);
});
