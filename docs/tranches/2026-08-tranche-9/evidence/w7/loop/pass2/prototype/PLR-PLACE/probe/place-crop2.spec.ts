/**
 * PLR-PLACE · PASS-2 — THE FOUR CROPS THE BRIEF NAMES, and no more.
 *
 * 1. the 9×9 chart at N=3, PHONE, light, with `.chart-self` PAINTED under a REAL press
 *    (the frame pass 1 could not take)
 * 2. the 16×16 chart at N=6, DESK, dark — 170.7px, dots 8, gap 2.667
 * 3. a hovered row, with the other dots at 0.55
 * 4. the `your cell` option row
 */
import { test, expect, type Page, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const HOME =
  process.env.PLC_HOME ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/PLR-PLACE";
const FRAMES = join(HOME, "frames");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);

const MARK = "[data-player-mark]";
const mark = (p: Page) => p.locator(MARK).locator("visible=true").first();
const sheet = (p: Page) => p.locator("[data-lobby]:visible");

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function room(a: Page): Promise<{ link: string; id: string }> {
  // At phone width the well lives behind the drawer tab, so the invite verb is unreachable
  // until it is opened — and it is shut again before anything is photographed.
  const tab = a.locator(".drawer-tab");
  const coarse = (await tab.count()) > 0;
  if (coarse && (await tab.getAttribute("aria-expanded")) !== "true") {
    await tab.click();
    await a.waitForTimeout(700);
  }
  const verb = a.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  if (coarse && (await tab.getAttribute("aria-expanded")) === "true") {
    await tab.click();
    await a.waitForTimeout(700);
  }
  return { link: a.url(), id: new URL(a.url()).searchParams.get("s")! };
}
async function drive(a: Page, b: Page, id: string, cells: number[]) {
  await a.evaluate((r) => {
    const w = window as unknown as { __st: unknown; __ch: BroadcastChannel };
    w.__st = null;
    const ch = new BroadcastChannel(`board:${r}`);
    w.__ch = ch;
    ch.onmessage = (ev: MessageEvent) => {
      if (ev.data?.kind === "st") w.__st = ev.data.data;
    };
  }, id);
  await b.evaluate(() => {
    const ch = new BroadcastChannel(
      `board:${new URL(location.href).searchParams.get("s")}`,
    );
    ch.postMessage({ kind: "hi", data: {}, from: "p-probe000000" });
    ch.close();
  });
  await a.waitForTimeout(600);
  await a.evaluate((ps) => {
    const w = window as unknown as {
      __st: { e: number; ea: string } | null;
      __ch: BroadcastChannel;
    };
    if (!w.__st) return;
    const { e, ea } = w.__st;
    ps.forEach((p, i) => {
      const id = `p-fake${String(i).padStart(8, "0")}`;
      w.__ch.postMessage({ kind: "hi", data: { ack: true }, from: id });
      w.__ch.postMessage({ kind: "cur", data: { p, e, ea }, from: id });
    });
  }, cells);
  await a.waitForTimeout(1300);
}

test("THE CROPS", async ({ browser }, info) => {
  test.setTimeout(280000);
  const eng = info.project.name;
  if (eng !== "chromium") test.skip(true, "one engine per crop; the numbers carry both");
  mkdirSync(FRAMES, { recursive: true });

  // ── 1 · the 9×9 chart, N=3, PHONE, light, .chart-self PAINTED ───────────────────────
  {
    const ctx = await browser.newContext({
      ...devices["iPhone 13"],
      viewport: { width: 390, height: 844 },
    });
    const a = await ctx.newPage();
    await a.goto("./?size=3&difficulty=EASY&wire=local");
    await settled(a);
    const r = await room(a);
    const b = await ctx.newPage();
    await b.goto(r.link);
    await settled(b);
    await a.bringToFront();
    await drive(a, b, r.id, [10, 70]);
    await a.locator(".sudoku-cell").nth(40).click(); // a REAL press: `lastCell` is real
    await a.waitForTimeout(300);
    await mark(a).click();
    await a.waitForTimeout(800);
    await expect(sheet(a)).toBeVisible();
    say("crop1.dots", await sheet(a).locator(".chart-dot").count());
    say("crop1.selfRing", await sheet(a).locator(".chart-self").count());
    await sheet(a).screenshot({ path: join(FRAMES, "chart-9x9-n3-390-light.png") });
    await ctx.close();
  }

  // ── 2 · the 16×16 chart, N=6, DESK, dark ────────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const a = await ctx.newPage();
    await a.goto("./?size=4&difficulty=EASY&wire=local");
    await settled(a);
    await a.evaluate(() => document.documentElement.classList.add("dark"));
    const r = await room(a);
    const b = await ctx.newPage();
    await b.goto(r.link);
    await settled(b);
    await a.bringToFront();
    await drive(a, b, r.id, [17, 51, 102, 170, 221]);
    await a.locator(".sudoku-cell").nth(136).click();
    await a.waitForTimeout(300);
    await mark(a).click();
    await a.waitForTimeout(800);
    say("crop2.dots", await sheet(a).locator(".chart-dot").count());
    say(
      "crop2.chartPx",
      await a.evaluate(
        () =>
          +(
            document.querySelector("[data-lobby] .place-chart") as SVGElement
          ).getBoundingClientRect().width.toFixed(2),
      ),
    );
    await sheet(a).screenshot({ path: join(FRAMES, "chart-16x16-n6-1280-dark.png") });
    await ctx.close();
  }

  // ── 3 · a hovered row, the others at 0.55 ──────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const a = await ctx.newPage();
    await a.goto("./?size=3&difficulty=EASY&wire=local");
    await settled(a);
    const r = await room(a);
    const b = await ctx.newPage();
    await b.goto(r.link);
    await settled(b);
    await a.bringToFront();
    await drive(a, b, r.id, [10, 40, 70]);
    await a.locator(".sudoku-cell").nth(24).click();
    await a.waitForTimeout(300);
    await mark(a).click();
    await a.waitForTimeout(800);
    // Hover a row that HAS a dot. A row without one (a peer who joined and never looked at a
    // cell) is a real state and dims everything, but it is not the picture the query is about.
    const withDot = await a.evaluate(() => {
      const ids = [...document.querySelectorAll("[data-lobby] .chart-dot")].map((d) =>
        d.getAttribute("data-peer"),
      );
      return ids[1] ?? ids[0];
    });
    await sheet(a).locator(`.pl-row[data-peer="${withDot}"]`).hover();
    await a.waitForTimeout(300);
    say(
      "crop3.opacities",
      await a.evaluate(() =>
        [...document.querySelectorAll("[data-lobby] .chart-dot")].map((d) => ({
          peer: d.getAttribute("data-peer"),
          o: getComputedStyle(d).opacity,
        })),
      ),
    );
    await sheet(a).screenshot({ path: join(FRAMES, "chart-hover-query-1280-light.png") });
    await ctx.close();
  }

  // ── 4 · the `your cell` row ────────────────────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const a = await ctx.newPage();
    await a.goto("./?size=3&difficulty=EASY&wire=local");
    await settled(a);
    await room(a);
    await a.waitForTimeout(500);
    // The INNERMOST group carrying the caption — `.controls-card [role="group"]` also matches
    // the well itself, and a crop of the well is not a crop of the row.
    const row = a
      .locator('.controls-card [role="group"]')
      .filter({ hasText: "your cell" })
      .last();
    await row.scrollIntoViewIfNeeded();
    await a.waitForTimeout(300);
    say("crop4.text", (await row.textContent())?.replace(/\s+/g, " ").trim());
    await row.screenshot({ path: join(FRAMES, "your-cell-row-1280-light.png") });
    await ctx.close();
  }
});
