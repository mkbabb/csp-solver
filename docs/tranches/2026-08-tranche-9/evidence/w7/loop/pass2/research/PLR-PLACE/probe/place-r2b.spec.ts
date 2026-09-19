/** PLR-PLACE pass-2 research, probe 2 (HEAD, read-only).
 *  F  `.controls-card` at 390x844 with pointer COARSE vs FINE — the +32.83 delta's real owner.
 *  G  the tokens that live on `.page-root`, and the dark arm of every ground.
 *  H  the ground the phone gives a head disclosure, sampled where the sheet laps a DIGIT.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/PLR-PLACE/logs";
mkdirSync(OUT, { recursive: true });
const out: Record<string, unknown> = {};

async function boot(page: Page) {
  await page.goto("/?game=sudoku");
  await page.waitForSelector('[role="grid"]');
  await page.waitForTimeout(1200);
}
const rect = () =>
  ((): unknown => null)();

test.describe.configure({ mode: "serial" });

test("F · controls-card, coarse vs fine, 390x844", async ({ browser }) => {
  const read = async (page: Page) =>
    page.evaluate(() => {
      const r = (s: string) => {
        const el = document.querySelector(s);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { y: +b.y.toFixed(2), h: +b.height.toFixed(2) };
      };
      return {
        coarse: window.matchMedia("(pointer: coarse)").matches,
        hoverNone: window.matchMedia("(hover: none)").matches,
        controlsCard: r(".controls-card"),
        actionBar: r(".action-bar"),
        tapFloor: getComputedStyle(
          document.querySelector(".page-root") ?? document.documentElement,
        )
          .getPropertyValue("--tap-floor")
          .trim(),
        chip: (() => {
          const c = document.querySelector(".ctrl-btn");
          if (!c) return null;
          const b = c.getBoundingClientRect();
          return { w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
        })(),
      };
    });

  const coarseCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const p1 = await coarseCtx.newPage();
  await boot(p1);
  const coarse = await read(p1);
  await coarseCtx.close();

  // FINE: the same viewport with no mobile emulation — a desktop window at phone width, which
  // is what a census that sets only `viewport` measures.
  const fineCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p2 = await fineCtx.newPage();
  await boot(p2);
  const fine = await read(p2);
  await fineCtx.close();

  out.F = { coarse, fine };
  expect(true).toBe(true);
});

test("G · tokens on .page-root, light and dark", async ({ browser }) => {
  const grab = async (dark: boolean) => {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 664 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      colorScheme: dark ? "dark" : "light",
    });
    const page = await ctx.newPage();
    await boot(page);
    const t = await page.evaluate(() => {
      const root = document.querySelector(".page-root") ?? document.documentElement;
      const cs = getComputedStyle(root);
      const names = [
        "--color-popover", "--color-card", "--color-background", "--color-user-ink",
        "--color-pencil-graphite", "--color-peer-cursor-ink", "--tap-floor",
        "--color-border", "--peer-ink-l", "--color-crayon-blue", "--color-foreground",
      ];
      const o: Record<string, string> = {};
      for (const n of names) o[n] = cs.getPropertyValue(n).trim();
      // resolved, not declared: paint a probe span and read back the used value
      const probe = document.createElement("span");
      probe.style.cssText =
        "position:fixed;left:-9999px;color:var(--color-pencil-graphite);background:var(--color-popover)";
      document.body.appendChild(probe);
      const pcs = getComputedStyle(probe);
      o["__graphite.used"] = pcs.color;
      o["__popover.used"] = pcs.backgroundColor;
      probe.style.color = "var(--ink-press-quiet)";
      o["__quiet.used"] = getComputedStyle(probe).color;
      probe.style.color = "var(--ink-press-rule)";
      o["__rule.used"] = getComputedStyle(probe).color;
      probe.style.background = "var(--color-background)";
      o["__bg.used"] = getComputedStyle(probe).backgroundColor;
      probe.style.background = "var(--color-card)";
      o["__card.used"] = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return o;
    });
    // the digit ink actually painted on the board
    const digit = await page.evaluate(() => {
      const el = document.querySelector('[role="grid"] .cell-digit, [role="grid"] .digit-path, [role="grid"] svg path');
      return el ? { tag: el.tagName, fill: getComputedStyle(el).fill, color: getComputedStyle(el).color } : null;
    });
    await ctx.close();
    return { ...t, digit };
  };
  out.G = { light: await grab(false), dark: await grab(true) };
});

test("H · the lapped ground, sampled over a digit", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 664 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await boot(page);
  // the strip of the board the card laps: x 0..256, y 132..195
  const clip = { x: 0, y: 132, width: 256, height: 63 };
  writeFileSync(`${OUT}/lap-closed-${test.info().project.name}.png`, await page.screenshot({ clip }));
  await page.locator(".mobile-attribution .attribution-trigger").click();
  await page.waitForTimeout(700);
  writeFileSync(`${OUT}/lap-open-${test.info().project.name}.png`, await page.screenshot({ clip }));
  out.H = { clip };
  await ctx.close();
});

test.afterAll(async ({}, ti) => {
  writeFileSync(`${OUT}/r2b-${ti.project.name}.json`, JSON.stringify(out, null, 2));
});
