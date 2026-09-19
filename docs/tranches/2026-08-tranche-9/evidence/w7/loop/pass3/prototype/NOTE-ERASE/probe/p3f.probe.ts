/**
 * NOTE-ERASE pass 3 · P3F — the park crop, RE-SHOT after the fold settles.
 * The first pair was taken 190 ms after `g`, before the fold moved, so both frames showed the
 * un-parked strip. The fold starts at ~218 ms and the card settles on the throw rung; this
 * waits it out and shoots the strip where the reader actually sees it, in the deck card.
 */
import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { armHint, bank, boardReady, FRAMES, refuseAGiven, say } from "./lib";

type Page = import("@playwright/test").Page;

async function stripShot(page: Page, name: string) {
  const box = await page.evaluate(() => {
    const el = document.querySelector(".margin-note-block");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor(r.left) - 8),
      y: Math.max(0, Math.floor(r.top) - 8),
      width: Math.ceil(r.width) + 16,
      height: Math.ceil(r.height) + 16,
    };
  });
  if (!box || box.width < 8 || box.height < 8) return null;
  const buf = await page.screenshot({ clip: box, animations: "disabled" });
  writeFileSync(join(FRAMES, name + ".png"), buf);
  return { name, bytes: buf.length, box };
}

test("C3 the park, re-shot at the settled fold", async ({ page, browserName }) => {
  test.skip(browserName !== "webkit", "the chair's crop budget: this one is webkit's");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });

  const out: Record<string, unknown> = {};
  for (const kind of ["reply", "record"] as const) {
    await boardReady(page);
    if (kind === "reply") await refuseAGiven(page);
    else await armHint(page);
    await page.waitForTimeout(700);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.keyboard.press("g");
    await page.waitForTimeout(1400); // the fold's throw rung, settled
    const text = await page.evaluate(() =>
      (document.querySelector(".margin-note")?.textContent || "")
        .replace(/\s+/g, " ")
        .trim(),
    );
    const box = await page.evaluate(() => {
      const r = document.querySelector(".margin-note-block")?.getBoundingClientRect();
      return r ? { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 } : null;
    });
    out[kind] = {
      textInCard: text,
      boxInCard: box,
      crop: await stripShot(page, `park-${kind}-1280-webkit`),
    };
  }
  bank("c3-park-reshot.json", out);
  say("C3R", out);
  expect(Object.keys(out).length).toBe(2);
});
