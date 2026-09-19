/**
 * NOTE-ERASE pass 3 · P3D — G9 split per kind, against BOTH trees.
 * C3 read the record clearing under the park too. This asks whether that is the park's doing
 * or the gallery's, by running the identical sequence on the prototype and on 74a2b5d9.
 */
import { test, expect } from "@playwright/test";
import { armHint, bank, boardReady, refuseAGiven, say } from "./lib";

const tag = process.env.NE_TREE ?? "proto";


/** THE PARK, ENTERED HONESTLY. `App.vue:786-788` refuses the `g` shortcut while focus is in an
 *  input — and arming a hint leaves focus in a cell — so the first run of this probe pressed a
 *  key that did nothing and measured a park that never happened. Blur first, then press, then
 *  assert the view actually turned. */
async function park(page: import("@playwright/test").Page) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press("g");
  await page.waitForTimeout(190); // whisper + a frame
  return page.evaluate(() => !!document.querySelector(".gallery, .sketchbook, [data-gallery]"));
}

test("G9 the park per kind", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });

  const read = () =>
    page.evaluate(() => {
      const el = document.querySelector(".margin-note-block");
      const r = el?.getBoundingClientRect();
      return {
        text: (document.querySelector(".margin-note")?.textContent || "")
          .replace(/\s+/g, " ")
          .trim(),
        box: r
          ? { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 }
          : null,
        view: document.querySelector(".gallery-scene, [data-view]")
          ? "gallery-ish"
          : "playing-ish",
      };
    });

  // G9a — a RECORD (the hint note) meets the park.
  await boardReady(page);
  await armHint(page);
  const recBefore = await read();
  const recParked = await park(page);
  const recAtPark = await read();
  await page.waitForTimeout(900);
  const recSettledPark = await read();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1400);
  const recBack = await read();

  // G9b — a REPLY (the refusal) meets the same park.
  await boardReady(page);
  await refuseAGiven(page);
  await page.waitForTimeout(700);
  const repBefore = await read();
  const repParked = await park(page);
  const repAtPark = await read();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1400);
  const repBack = await read();

  const out = {
    tree: tag,
    engine: browserName,
    g9aRecord: {
      galleryEntered: recParked,
      before: recBefore,
      atParkPlusWhisper: recAtPark,
      afterSettle: recSettledPark,
      back: recBack,
      survivesPark: recAtPark.text === recBefore.text,
      sameBox: JSON.stringify(recAtPark.box) === JSON.stringify(recBefore.box),
    },
    g9bReply: {
      galleryEntered: repParked,
      before: repBefore,
      atParkPlusWhisper: repAtPark,
      back: repBack,
      leavesWithinOneRubOut: repAtPark.text === "",
    },
  };
  bank(`g9-${tag}-${browserName}.json`, out);
  say("G9", out);
  expect(out.tree).toBeTruthy();
});
