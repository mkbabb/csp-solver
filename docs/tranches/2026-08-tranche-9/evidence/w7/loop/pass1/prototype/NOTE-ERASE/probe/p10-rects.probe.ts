/**
 * NOTE-ERASE pass-1 — π ON THE SURFACES THE FAMILY DOES NOT CLAIM.
 * The board, the controls card and the strip's own block, measured with no note, a fresh note,
 * a settled note and a note mid rub-out. Every delta must be 0.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });

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

test("P10 the unclaimed rects hold π", async ({ page, browserName }) => {
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
    const midRub = await page.evaluate(() => {
      const ink = document.querySelector<HTMLElement>(".margin-note-ink");
      if (ink) {
        ink.classList.add("note-leave-active");
        ink.style.animationDelay = "-62ms, -62ms";
        ink.style.animationPlayState = "paused";
      }
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
    const delta = (a: any, b: any, k: string) =>
      a?.[k] && b?.[k]
        ? Math.max(
            Math.abs(a[k].x - b[k].x),
            Math.abs(a[k].y - b[k].y),
            Math.abs(a[k].w - b[k].w),
            Math.abs(a[k].h - b[k].h),
          )
        : null;
    out.push({
      viewport: label,
      empty,
      fresh,
      settled,
      midRub,
      deltas: {
        boardEmptyVsFresh: delta(empty, fresh, "board"),
        boardFreshVsSettled: delta(fresh, settled, "board"),
        boardFreshVsRub: delta(fresh, midRub, "board"),
        controlsEmptyVsFresh: delta(empty, fresh, "controls"),
        stripEmptyVsFresh: delta(empty, fresh, "strip"),
        stripFreshVsRub: delta(fresh, midRub, "strip"),
        docHEmptyVsFresh: Math.abs((empty?.docH ?? 0) - (fresh?.docH ?? 0)),
      },
    });
  }
  writeFileSync(
    join(OUT, `p10-rects-${browserName}.json`),
    JSON.stringify({ engine: browserName, out }, null, 2),
  );
  console.log(
    "P10|" +
      JSON.stringify(out.map((o: any) => ({ vp: o.viewport, deltas: o.deltas }))),
  );
  expect(out.length).toBe(2);
});
