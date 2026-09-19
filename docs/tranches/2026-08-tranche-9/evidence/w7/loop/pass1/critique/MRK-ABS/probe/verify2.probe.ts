/** CRITIQUE · MRK-ABS — (1) how long the token takes to arrive, (2) the gallery's two faces. */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

test("ring arrival time on .ctrl-btn", async ({ page }, info) => {
  const eng = info.project.name;
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 90000 });
  await page.waitForTimeout(1600);
  const btn = page.locator(".ctrl-btn").first();
  const samples = await page.evaluate(async () => {
    const el = document.querySelector(".ctrl-btn") as HTMLElement;
    const before = getComputedStyle(el);
    const rest = { color: before.outlineColor, style: before.outlineStyle, offset: before.outlineOffset,
                   transitionProperty: before.transitionProperty, transitionDuration: before.transitionDuration };
    el.focus({ focusVisible: true } as any);
    const out: any[] = [];
    const t0 = performance.now();
    for (const ms of [0, 30, 80, 150, 250, 400, 700]) {
      await new Promise((r) => setTimeout(r, Math.max(0, ms - (performance.now() - t0))));
      const cs = getComputedStyle(el);
      out.push({ atMs: Math.round(performance.now() - t0), color: cs.outlineColor, style: cs.outlineStyle, width: cs.outlineWidth, offset: cs.outlineOffset });
    }
    return { rest, out, focusVisible: el.matches(":focus-visible") };
  });
  bank(`crit-arrival-${eng}.json`, { engine: eng, ...samples });
});

test("gallery route: staging + guard faces", async ({ page }, info) => {
  const eng = info.project.name;
  await page.goto("./");
  await page.waitForTimeout(3500);
  const d = await page.evaluate(() => {
    const read = (sel: string) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return { sel, present: false };
      const cs = getComputedStyle(el);
      return { sel, present: true, style: cs.outlineStyle, color: cs.outlineColor, width: cs.outlineWidth, offset: cs.outlineOffset };
    };
    const owner = document.querySelector(".staging-btn") as HTMLElement | null;
    const guard = document.querySelector(".guard-btn") as HTMLElement | null;
    owner?.focus();
    const staging = read(".staging-btn .staging-face");
    guard?.focus();
    const g = read(".guard-btn .guard-face");
    return {
      hasViewport: !!document.querySelector(".gallery-viewport"),
      stagingBtns: document.querySelectorAll(".staging-btn").length,
      guardBtns: document.querySelectorAll(".guard-btn").length,
      cards: document.querySelectorAll(".game-card").length,
      stagingFaceOnFocus: staging, guardFaceOnFocus: g,
      centerCard: read(".game-card.is-center"),
      viewport: read(".gallery-viewport"),
    };
  });
  await page.waitForTimeout(600);
  bank(`crit-gallery-${eng}.json`, { engine: eng, ...d });
});
