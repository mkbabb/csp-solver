/**
 * NOTE-ERASE pass 5 · the honest clock, bounded by the author origin, on the BUILT dist.
 * Plants at (0,1,0), (1,1,0) and (1,1,0) !important; a FRESH leave (a refusal re-said) and a
 * SETTLED leave (the hint, eight beats in, replaced by a second hint). The in-run negative
 * control strips what `stopTheClock` wrote before Vue reads the clock (the hook's ablation).
 * Then row E: the publisher's node deleted, every rung to its registered 0ms.
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, say, boardReady, refuseAGiven, armHint, watchLeave, leaveResult, PROTO, PAYLOAD } from "./lib";

const PLANTS: Record<string, string> = {
  none: "",
  "p010": ".margin-note-ink{transition: color 350ms linear}",
  "p110": "#app .margin-note-ink{transition: color 350ms linear}",
  "p110-important": "#app .margin-note-ink{transition: color 350ms linear !important}",
};

async function freshLeave(page: Page, plant: string, ablate: boolean) {
  await boardReady(page, PROTO);
  if (plant) await page.addStyleTag({ content: plant });
  await refuseAGiven(page, "5");
  await page.waitForTimeout(600);
  await watchLeave(page, ablate);
  await page.keyboard.press("5");
  return leaveResult(page);
}

async function settledLeave(page: Page, plant: string, ablate: boolean) {
  await boardReady(page, PROTO);
  if (plant) await page.addStyleTag({ content: plant });
  await armHint(page, 0);
  await expect
    .poll(() => page.evaluate(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age")), { timeout: 5000 })
    .toBe("settled");
  await watchLeave(page, ablate);
  await armHint(page, 3);
  return leaveResult(page);
}

test("clock: bounded by the author origin, fresh and settled, with the hook's ablation", async ({ page }, info) => {
  const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD, dist: "index-aW5mmGzDOl_l.js" };
  for (const [k, plant] of Object.entries(PLANTS)) rows[`fresh.${k}`] = await freshLeave(page, plant, false);
  for (const k of ["p110", "p110-important"]) rows[`settled.${k}`] = await settledLeave(page, PLANTS[k], false);
  // NEGATIVE CONTROLS in the same run: the hook's write stripped before Vue reads the clock.
  rows["fresh.p110.ABLATED"] = await freshLeave(page, PLANTS.p110, true);
  rows["fresh.p110-important.ABLATED"] = await freshLeave(page, PLANTS["p110-important"], true);
  rows["settled.none.ABLATED"] = await settledLeave(page, "", true);
  bank(`clock-${info.project.name}.json`, rows);
  say("clock", rows);
  for (const k of ["fresh.none", "fresh.p010", "fresh.p110", "fresh.p110-important", "settled.p110", "settled.p110-important"]) {
    const r = rows[k] as { transitionDuration: string; absentMs: number };
    expect(r.transitionDuration, k).toBe("0s");
    expect(r.absentMs, k).toBeLessThan(260);
  }
  for (const k of ["fresh.p110.ABLATED", "fresh.p110-important.ABLATED"]) {
    const r = rows[k] as { transitionDuration: string; absentMs: number };
    expect(r.transitionDuration, k).toBe("0.35s");
    expect(r.absentMs, k).toBeGreaterThan(330);
  }
  // With no plant the settle's own dusk step is what the hook beats (pass 3's defect).
  const s = rows["settled.none.ABLATED"] as { transitionDuration: string };
  expect(s.transitionDuration).toBe("0.35s");
});

test("row E: the publisher deleted, every rung to its registered 0ms, the shorthand valid", async ({ page }, info) => {
  await boardReady(page, PROTO);
  const read = () =>
    page.evaluate(() => {
      const r = getComputedStyle(document.documentElement);
      const names = ["whisper", "leave", "note", "dusk", "step", "throw", "rise"];
      return {
        nodes: document.querySelectorAll("style[data-motion-rungs]").length,
        rungs: Object.fromEntries(names.map((n) => [n, r.getPropertyValue(`--motion-${n}`).trim()])),
      };
    });
  const before = await read();
  await page.evaluate(() => document.querySelectorAll("style[data-motion-rungs]").forEach((n) => n.remove()));
  const after = await read();
  await refuseAGiven(page, "5");
  await page.waitForTimeout(600);
  await watchLeave(page, false);
  await page.keyboard.press("5");
  const leave = await leaveResult(page);
  const row = { engine: info.project.name, payload: PAYLOAD, before, after, leave };
  bank(`rowE-${info.project.name}.json`, row);
  say("rowE", row);
  expect(before.nodes).toBe(1);
  expect(after.nodes).toBe(0);
  for (const v of Object.values(after.rungs)) expect(v).toMatch(/^0m?s$/);
  expect(leave?.animationName).toContain("ink-rub-out");
});
