import { test, expect, type Browser, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-PLACE/frames";

async function boot(page: Page, url: string) {
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
}

async function openDrawer(p: Page) {
  const tab = p.locator(".drawer-tab").first();
  if (await tab.isVisible().catch(() => false)) {
    await tab.click();
    await p.waitForTimeout(700);
  }
}

async function room(browser: Browser, o: {
  w: number; h: number; coarse: boolean; peers: number; size?: number; dark?: boolean;
}) {
  const ctx = await browser.newContext({
    viewport: { width: o.w, height: o.h },
    hasTouch: o.coarse,
    isMobile: o.coarse,
    deviceScaleFactor: 2,
  });
  const a = await ctx.newPage();
  if (o.dark) await a.addInitScript(() => localStorage.setItem("theme", "dark"));
  const room = `plc-${Date.now()}`;
  const url = `./?size=${o.size ?? 3}&difficulty=EASY&wire=local&s=${room}`;
  await boot(a, url);
  if (o.dark) await a.evaluate(() => document.documentElement.classList.add("dark"));
  const peers: Page[] = [];
  for (let i = 0; i < o.peers; i++) {
    const p = await ctx.newPage();
    if (o.dark) await p.addInitScript(() => localStorage.setItem("theme", "dark"));
    await boot(p, url);
    await p.locator(".sudoku-cell input").nth(4 + i * 7).click();
    peers.push(p);
  }
  await a.bringToFront();
  await a.locator(".sudoku-cell input").nth(40).click();
  return { ctx, a, peers };
}

test("frame 1 — the chart, 9x9, phone coarse, light, self ring painted", async ({ browser }) => {
  test.setTimeout(180000);
  mkdirSync(OUT, { recursive: true });
  const { ctx, a } = await room(browser, { w: 390, h: 844, coarse: true, peers: 2 });
  await a.locator("[data-player-mark]:visible").click();
  await a.waitForTimeout(1400);
  const box = await a.locator("[data-lobby].is-open").boundingBox();
  await a.screenshot({ path: `${OUT}/1-chart-9x9-phone-coarse-light.png`, clip: box! });
  // eslint-disable-next-line no-console
  console.log("frame1", JSON.stringify(await a.evaluate(() => ({
    dots: document.querySelectorAll(".chart-dot").length,
    self: document.querySelectorAll(".chart-self").length,
    state: document.querySelector("[data-lobby].is-open .lobby-state")?.textContent,
  }))));
  await ctx.close();
});

test("frame 2 — 16x16, N=6, desk dark", async ({ browser }) => {
  test.setTimeout(240000);
  mkdirSync(OUT, { recursive: true });
  const { ctx, a } = await room(browser, { w: 1280, h: 800, coarse: false, peers: 5, size: 4, dark: true });
  await a.locator("[data-player-mark]:visible").click();
  await a.waitForTimeout(1600);
  const read = await a.evaluate(() => {
    const svg = document.querySelector("[data-lobby].is-open .place-chart") as SVGSVGElement;
    const b = svg.getBoundingClientRect();
    const d = svg.querySelector(".chart-dot, .chart-self") as SVGCircleElement | null;
    const vb = svg.viewBox.baseVal.width;
    return {
      side: +b.width.toFixed(2),
      dotPx: d ? +((Number(d.getAttribute("r")) * b.width * 2) / vb).toFixed(3) : null,
      dots: svg.querySelectorAll(".chart-dot").length,
      self: svg.querySelectorAll(".chart-self").length,
      sheetH: +document.querySelector("[data-lobby].is-open")!.getBoundingClientRect().height.toFixed(2),
    };
  });
  // eslint-disable-next-line no-console
  console.log("frame2", JSON.stringify(read));
  const box = await a.locator("[data-lobby].is-open").boundingBox();
  await a.screenshot({ path: `${OUT}/2-chart-16x16-desk-dark.png`, clip: box! });
  await ctx.close();
});

test("frame 3 — a hovered row, the other dots quiet", async ({ browser }) => {
  test.setTimeout(180000);
  mkdirSync(OUT, { recursive: true });
  const { ctx, a } = await room(browser, { w: 1280, h: 800, coarse: false, peers: 3 });
  await a.locator("[data-player-mark]:visible").click();
  await a.waitForTimeout(1400);
  await a.locator("[data-lobby].is-open .pl-row[data-peer]").nth(1).hover();
  await a.waitForTimeout(120);
  // eslint-disable-next-line no-console
  console.log("frame3", JSON.stringify(await a.evaluate(() =>
    [...document.querySelectorAll("[data-lobby].is-open .chart-dot")].map((d) => ({
      peer: (d as SVGElement).getAttribute("data-peer")?.slice(0, 4),
      opacity: getComputedStyle(d).opacity,
    })),
  )));
  const box = await a.locator("[data-lobby].is-open").boundingBox();
  await a.screenshot({ path: `${OUT}/3-query-hovered-row.png`, clip: box! });
  await ctx.close();
});

test("frame 4 — the well, live beside solo", async ({ browser }) => {
  test.setTimeout(180000);
  mkdirSync(OUT, { recursive: true });
  const { ctx, a } = await room(browser, { w: 1280, h: 800, coarse: false, peers: 1 });
  const wellA = a.locator(".tray-well:has(.players-status)").first();
  await wellA.scrollIntoViewIfNeeded();
  await a.waitForTimeout(300);
  const live = await wellA.boundingBox();
  const wellLive = await a.evaluate(() => {
    const el = document.querySelector(".tray-well:has(.players-status)") as HTMLElement | null;
    return el ? +el.getBoundingClientRect().height.toFixed(2) : null;
  });
  await a.screenshot({ path: `${OUT}/4a-well-live-room.png`, clip: live! });
  const solo = await ctx.newPage();
  await boot(solo, "./?size=3&difficulty=EASY");
  const wellS = solo.locator(".tray-well:has(.players-status)").first();
  await wellS.scrollIntoViewIfNeeded();
  await solo.waitForTimeout(300);
  const soloBox = await wellS.boundingBox();
  const wellSolo = await solo.evaluate(() => {
    const el = document.querySelector(".tray-well:has(.players-status)") as HTMLElement | null;
    return el ? +el.getBoundingClientRect().height.toFixed(2) : null;
  });
  await solo.screenshot({ path: `${OUT}/4b-well-solo.png`, clip: soloBox! });
  // eslint-disable-next-line no-console
  console.log("frame4", JSON.stringify({ wellLive, wellSolo, live, soloBox }));
  await ctx.close();
});
