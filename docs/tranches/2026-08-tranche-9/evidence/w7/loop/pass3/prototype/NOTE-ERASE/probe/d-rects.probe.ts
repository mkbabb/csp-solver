/**
 * NOTE-ERASE pass 2 · D — π ON THE SURFACES THE FAMILY DOES NOT CLAIM.
 * Board, controls card, the strip's own block and `scrollHeight`, across empty → fresh →
 * settled → mid rub-out → parked-and-back. Every delta must be 0.
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, say } from "./lib";

const BOARD = "?size=3&difficulty=EASY";

const rects = (p: Page) =>
  p.evaluate(() => {
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
      note: read(".margin-note"),
      docH: r1(document.documentElement.scrollHeight),
    };
  });

type R = Awaited<ReturnType<typeof rects>>;
const delta = (a: R, b: R, k: "board" | "controls" | "strip" | "note") => {
  const x = a?.[k];
  const y = b?.[k];
  return x && y
    ? Math.max(
        Math.abs(x.x - y.x),
        Math.abs(x.y - y.y),
        Math.abs(x.w - y.w),
        Math.abs(x.h - y.h),
      )
    : null;
};

test("D the unclaimed rects hold π", async ({ page, browserName }) => {
  const out: unknown[] = [];
  for (const [label, w, h] of [
    ["390x844", 390, 844],
    ["1280x800", 1280, 800],
  ] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await page.goto("./" + BOARD);
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
    await page.waitForTimeout(1800);
    const empty = await rects(page);
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      inputs.find((i) => !i.value)?.focus();
    });
    await page.keyboard.press("h");
    await page.waitForTimeout(450);
    const fresh = await rects(page);
    await page.waitForTimeout(1300);
    const settled = await rects(page);
    // mid rub-out: the leave class with the verb paused a third of the way through
    await page.evaluate(() => {
      const ink = document.querySelector<HTMLElement>(".margin-note-ink");
      if (ink) {
        ink.classList.add("note-leave-active");
        ink.style.animationDelay = "-50ms, -50ms";
        ink.style.animationPlayState = "paused";
      }
    });
    const midRub = await rects(page);
    await page.evaluate(() => {
      const ink = document.querySelector<HTMLElement>(".margin-note-ink");
      if (ink) {
        ink.classList.remove("note-leave-active");
        ink.style.animationDelay = "";
        ink.style.animationPlayState = "";
      }
    });
    // parked and back — the seam's own round trip
    await page.keyboard.press("g");
    await page.waitForTimeout(900);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1400);
    const afterPark = await rects(page);
    out.push({
      viewport: label,
      empty,
      fresh,
      settled,
      midRub,
      afterPark,
      deltas: {
        boardEmptyVsFresh: delta(empty, fresh, "board"),
        boardFreshVsSettled: delta(fresh, settled, "board"),
        boardFreshVsRub: delta(fresh, midRub, "board"),
        boardFreshVsAfterPark: delta(fresh, afterPark, "board"),
        controlsEmptyVsFresh: delta(empty, fresh, "controls"),
        controlsFreshVsAfterPark: delta(fresh, afterPark, "controls"),
        stripEmptyVsFresh: delta(empty, fresh, "strip"),
        stripFreshVsRub: delta(fresh, midRub, "strip"),
        docHEmptyVsFresh: Math.abs((empty?.docH ?? 0) - (fresh?.docH ?? 0)),
        docHFreshVsRub: Math.abs((fresh?.docH ?? 0) - (midRub?.docH ?? 0)),
        docHFreshVsAfterPark: Math.abs((fresh?.docH ?? 0) - (afterPark?.docH ?? 0)),
      },
    });
  }
  bank(`d-rects-${browserName}.json`, { engine: browserName, out });
  say(
    "D",
    out.map((o) => ({
      vp: (o as { viewport: string }).viewport,
      deltas: (o as { deltas: unknown }).deltas,
    })),
  );
  expect(out.length).toBe(2);
});
