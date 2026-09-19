/**
 * NOTE-ERASE pass 3 · P3C — the three cited crops, the unclaimed rects, and the budget.
 * Crops are ≤150 KB and only where a number cannot say it (the chair's cap: four per family).
 */
import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { armHint, bank, boardReady, FRAMES, refuseAGiven, say } from "./lib";

type Page = import("@playwright/test").Page;

/** The strip's own box, plus a little air — the frame a reader looks at. */
async function stripShot(page: Page, name: string) {
  const box = await page.evaluate(() => {
    const el = document.querySelector(".margin-note-block");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor(r.left) - 6),
      y: Math.max(0, Math.floor(r.top) - 8),
      width: Math.ceil(r.width) + 12,
      height: Math.ceil(r.height) + 16,
    };
  });
  if (!box || box.width < 8 || box.height < 8) return null;
  const buf = await page.screenshot({ clip: box, animations: "disabled" });
  writeFileSync(join(FRAMES, name + ".png"), buf);
  return { name, bytes: buf.length, box };
}

test("C1 the settled exit, strip empty at whisper + 2 frames (390)", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "one engine per crop; the numbers carry both");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  await armHint(page);
  await page.waitForTimeout(1100); // SETTLED — the state pass 2 could not leave
  const before = await stripShot(page, "settled-before-390-chromium");
  await page.keyboard.press("5");
  await page.waitForTimeout(150 + 34); // whisper + 2 frames
  const after = await stripShot(page, "settledExit-390-chromium");
  const text = await page.evaluate(() =>
    (document.querySelector(".margin-note")?.textContent || "").trim(),
  );
  const inkPresent = await page.evaluate(() => !!document.querySelector(".margin-note-ink"));
  bank("c1-crop.json", { before, after, textAtCrop: text, inkPresent });
  say("C1", { before, after, text, inkPresent });
  expect(after).not.toBeNull();
});

test("C2 the repeat, the hole one beat wide (390)", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "one engine per crop; the numbers carry both");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  await refuseAGiven(page);
  await page.waitForTimeout(800);
  await page.keyboard.press("5"); // the SAME refusal, a second time
  await page.waitForTimeout(150 + 60); // the rub-out, then 60ms into the hole
  const hole = await stripShot(page, "repeatHole-390-chromium");
  const textInHole = await page.evaluate(() =>
    (document.querySelector(".margin-note")?.textContent || "").trim(),
  );
  await page.waitForTimeout(400);
  const back = await page.evaluate(() =>
    (document.querySelector(".margin-note")?.textContent || "").trim(),
  );
  bank("c2-crop.json", { hole, textInHole, backAfter: back });
  say("C2", { hole, textInHole, back });
  expect(hole).not.toBeNull();
});

test("C3 the park, a reply leaves and a record stands (1280)", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "webkit", "the chair's crop budget: this one is webkit's");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });

  const toGallery = async () => {
    // `g` is the gallery's own key (App.vue's global keydown).
    await page.keyboard.press("g");
    await page.waitForTimeout(150 + 34); // whisper + a frame past the park
  };

  // G9b — a REPLY under the park.
  await boardReady(page);
  await refuseAGiven(page);
  await page.waitForTimeout(700);
  const replyBefore = await page.evaluate(() =>
    (document.querySelector(".margin-note")?.textContent || "").trim(),
  );
  await toGallery();
  const replyAfter = await page.evaluate(() =>
    (document.querySelector(".margin-note")?.textContent || "").trim(),
  );
  const replyShot = await stripShot(page, "parkReply-1280-webkit");

  // G9a — a RECORD under the same park, at the same box.
  await boardReady(page);
  const armed = await armHint(page);
  const recordBefore = await page.evaluate(() => {
    const el = document.querySelector(".margin-note-block");
    const r = el?.getBoundingClientRect();
    return {
      text: (document.querySelector(".margin-note")?.textContent || "").trim(),
      box: r ? { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 } : null,
    };
  });
  await toGallery();
  const recordAfter = await page.evaluate(() => {
    const el = document.querySelector(".margin-note-block");
    const r = el?.getBoundingClientRect();
    return {
      text: (document.querySelector(".margin-note")?.textContent || "").trim(),
      box: r ? { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 } : null,
    };
  });
  const recordShot = await stripShot(page, "parkRecord-1280-webkit");

  const out = {
    engine: browserName,
    armedText: (armed as { text?: string } | null)?.text,
    g9bReply: { before: replyBefore, after: replyAfter, crop: replyShot },
    g9aRecord: { before: recordBefore, after: recordAfter, crop: recordShot },
    g9aSameBox:
      JSON.stringify(recordBefore.box) === JSON.stringify(recordAfter.box) &&
      recordBefore.text === recordAfter.text,
  };
  bank("c3-park.json", out);
  say("C3", out);
  expect(out.engine).toBe("webkit");
});

test("D the unclaimed rects hold pi, and the budget holds", async ({
  page,
  browserName,
}) => {
  const rects = () =>
    page.evaluate(() => {
      const r1 = (x: number) => Math.round(x * 100) / 100;
      const read = (sel: string) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r1(r.x), y: r1(r.y), w: r1(r.width), h: r1(r.height) };
      };
      return {
        board: read('[role="grid"]'),
        controls: read(".controls-card"),
        strip: read(".margin-note-block"),
        docH: r1(document.documentElement.scrollHeight),
      };
    });

  const out: unknown[] = [];
  for (const [label, w, h] of [
    ["390x844", 390, 844],
    ["1280x800", 1280, 800],
  ] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await boardReady(page);
    const empty = await rects();
    await armHint(page);
    const fresh = await rects();
    await page.waitForTimeout(1100);
    const settled = await rects();
    await page.keyboard.press("5");
    await page.waitForTimeout(60); // mid rub-out
    const mid = await rects();
    await page.waitForTimeout(400);
    await page.keyboard.press("g");
    await page.waitForTimeout(900);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1200);
    const back = await rects();

    type R = Awaited<ReturnType<typeof rects>>;
    const d = (a: R, b: R, k: "board" | "controls" | "strip") => {
      const x = a?.[k];
      const y = b?.[k];
      return x && y
        ? Math.round(
            Math.max(
              Math.abs(x.x - y.x),
              Math.abs(x.y - y.y),
              Math.abs(x.w - y.w),
              Math.abs(x.h - y.h),
            ) * 100,
          ) / 100
        : null;
    };
    out.push({
      viewport: label,
      empty,
      deltas: {
        "empty→fresh": {
          board: d(empty, fresh, "board"),
          controls: d(empty, fresh, "controls"),
          strip: d(empty, fresh, "strip"),
          docH: Math.round((empty!.docH - fresh!.docH) * 100) / 100,
        },
        "fresh→settled": {
          board: d(fresh, settled, "board"),
          controls: d(fresh, settled, "controls"),
          strip: d(fresh, settled, "strip"),
          docH: Math.round((fresh!.docH - settled!.docH) * 100) / 100,
        },
        "settled→midRubOut": {
          board: d(settled, mid, "board"),
          controls: d(settled, mid, "controls"),
          strip: d(settled, mid, "strip"),
          docH: Math.round((settled!.docH - mid!.docH) * 100) / 100,
        },
        "empty→parkedAndBack": {
          board: d(empty, back, "board"),
          controls: d(empty, back, "controls"),
          strip: d(empty, back, "strip"),
          docH: Math.round((empty!.docH - back!.docH) * 100) / 100,
        },
      },
    });
  }

  // THE FILTER BUDGET — every filtered element on the page, at three board sizes.
  const budget: unknown[] = [];
  for (const q of [
    "?size=2&difficulty=EASY",
    "?size=3&difficulty=EASY",
    "?size=4&difficulty=EASY",
  ]) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await boardReady(page, q);
    await armHint(page);
    const n = await page.evaluate(() => {
      let c = 0;
      const seen: string[] = [];
      document.querySelectorAll("*").forEach((el) => {
        const f = getComputedStyle(el as Element).filter;
        if (f && f !== "none") {
          c += 1;
          if (seen.length < 12)
            seen.push(`${(el as HTMLElement).className || el.tagName}: ${f}`);
        }
      });
      return { count: c, sample: seen };
    });
    budget.push({ query: q, ...n });
  }

  bank(`d-rects-${browserName}.json`, { engine: browserName, rows: out, budget });
  say("D", { rows: out, budget });
  expect(out.length).toBe(2);
});
