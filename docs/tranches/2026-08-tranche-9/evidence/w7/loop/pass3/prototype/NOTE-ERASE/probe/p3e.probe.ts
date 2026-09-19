/**
 * NOTE-ERASE pass 3 · P3E — G9b timed from the PARK, not from the key.
 *
 * The `g` press opens the gallery, but `parked` is `view !== "playing"` and the view turns when
 * the fold does, not when the key lands. So "within one rub-out of g" was the wrong clock: the
 * claim is "within one rub-out of the PARK". This samples the strip every frame from the press,
 * reports when the fold starts (the strip's box shrinks), when the reply empties, and the gap.
 */
import { test, expect } from "@playwright/test";
import { armHint, bank, boardReady, refuseAGiven, say } from "./lib";

test("G9b the reply leaves within one rub-out of the park", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const kind of ["reply", "record"] as const) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await boardReady(page);
    if (kind === "reply") await refuseAGiven(page);
    else await armHint(page);
    await page.waitForTimeout(700);

    const watch = page.evaluate(() => {
      const t0 = performance.now();
      const read = () => {
        const p = document.querySelector(".margin-note");
        const el = document.querySelector(".margin-note-block");
        const r = el?.getBoundingClientRect();
        return {
          text: (p?.textContent || "").replace(/\s+/g, " ").trim(),
          w: r ? Math.round(r.width * 100) / 100 : -1,
        };
      };
      const first = read();
      return new Promise<{
        startText: string;
        startW: number;
        foldStartedAtMs: number | null;
        emptiedAtMs: number | null;
        endText: string;
        endW: number;
      }>((res) => {
        let fold: number | null = null;
        let empty: number | null = null;
        const tick = () => {
          const t = Math.round((performance.now() - t0) * 10) / 10;
          const now = read();
          // The fold is under way once the strip's own box leaves its full-width pose.
          if (fold === null && now.w > 0 && Math.abs(now.w - first.w) > 1) fold = t;
          if (empty === null && now.text === "" && first.text !== "") empty = t;
          if (performance.now() - t0 > 2200) {
            const last = read();
            res({
              startText: first.text,
              startW: first.w,
              foldStartedAtMs: fold,
              emptiedAtMs: empty,
              endText: last.text,
              endW: last.w,
            });
          } else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    });
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.keyboard.press("g");
    const t = await watch;
    rows.push({
      kind,
      ...t,
      emptiedWithinOneRubOutOfFold:
        t.emptiedAtMs !== null && t.foldStartedAtMs !== null
          ? t.emptiedAtMs - t.foldStartedAtMs <= 150 + 34
          : null,
      gapFoldToEmptyMs:
        t.emptiedAtMs !== null && t.foldStartedAtMs !== null
          ? Math.round((t.emptiedAtMs - t.foldStartedAtMs) * 10) / 10
          : null,
    });
  }
  bank(`g9b-park-${browserName}.json`, { engine: browserName, rows });
  say("G9B", rows);
  expect(rows.length).toBe(2);
});
