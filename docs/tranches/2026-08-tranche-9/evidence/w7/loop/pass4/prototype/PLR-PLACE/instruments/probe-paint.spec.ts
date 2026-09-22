/**
 * PLR-PLACE pass 4 · painted AA from BYTES (the chart's four inks and the mark's focus ring, both
 * themes) and the four frames. DPR 1, sharp-decoded; ink = the clip pixel furthest in luminance
 * from the clip's modal ground; a ring = the pixels that differ between focused and blurred.
 * The sensitivity row: the ratio at the ring's median and 90th-percentile pixel, and the share
 * of ring pixels under 3:1.
 */
import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/PLR-PLACE/logs";
const SHOTS =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend/.plr-place/shots";
const PROTO = `http://127.0.0.1:${process.env.PLC_PORT ?? "4243"}`;
const Q = "difficulty=EASY&wire=local";
const ARM = process.env.PLC_FRAME_ARM ?? "chart"; // "chart" | "list" (the NO arm, a source flip)

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  const docked = !(await verb.isVisible());
  if (docked) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700);
  }
  await verb.click();
  await expect.poll(() => page.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) {
    await page.locator(".drawer-tab").first().click();
    await expect(page.locator("#controls-drawer .drawer-case")).toBeHidden();
    await page.waitForTimeout(700);
  }
  return page.url();
}
/** ONE ENCODED BOARD for every frame (chair addendum: a bare name pins nothing). The payload is
 *  the product's own share link's `?board=`, minted by the π probe and banked beside it. */
const BOARD = process.env.PLC_BOARD;
async function table(ctx: BrowserContext, n: number) {
  const a = await ctx.newPage();
  await a.goto(BOARD ? `${PROTO}/?board=${BOARD}&${Q}` : `${PROTO}/?size=3&${Q}`);
  await settled(a);
  const link = await invite(a);
  const pages = [a];
  for (let i = 1; i < n; i++) {
    const p = await ctx.newPage();
    await p.goto(link);
    await settled(p);
    pages.push(p);
  }
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(n);
  return pages;
}

const lum = (r: number, g: number, b: number) => {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

async function pixels(png: Buffer) {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px: [number, number, number][] = [];
  for (let i = 0; i < data.length; i += 3) px.push([data[i], data[i + 1], data[i + 2]]);
  return { px, w: info.width };
}
function modal(px: [number, number, number][]) {
  const m = new Map<string, number>();
  for (const p of px) m.set(p.join(","), (m.get(p.join(",")) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number) as [number, number, number];
}
async function inkRatio(page: Page, clip: { x: number; y: number; width: number; height: number }) {
  const { px } = await pixels(await page.screenshot({ clip }));
  const ground = modal(px);
  const lg = lum(...ground);
  let best = 1;
  for (const p of px) best = Math.max(best, ratio(lum(...p), lg));
  return { ground: ground.join(","), ratio: +best.toFixed(3) };
}

async function theme(page: Page, dark: boolean) {
  const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  if (isDark !== dark) {
    await page.locator('button[aria-label^="Switch to"]').first().click();
    await page.waitForTimeout(1200);
  }
  expect(await page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(dark);
}

test("painted AA, both themes", async ({ browser }, info) => {
  test.skip(ARM !== "chart", "the paint rows read the built arm only");
  test.setTimeout(300000);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const [a, b] = await table(ctx, 2);
  await b.bringToFront();
  await b.locator(".sudoku-cell input").nth(20).click();
  await a.bringToFront();
  await a.locator(".sudoku-cell input").nth(40).click();
  await a.waitForTimeout(900);
  const out: Record<string, unknown> = {};
  for (const dark of [false, true]) {
    await theme(a, dark);
    await a.locator(".sudoku-cell input").nth(40).click();
    await a.locator("[data-player-mark]:visible").click();
    await a.waitForTimeout(500);
    const g = await a.evaluate(() => {
      const s = document.querySelector("[data-lobby].is-open .place-chart")!.getBoundingClientRect();
      const bb = (q: string) => {
        const r = document.querySelector(`[data-lobby].is-open ${q}`)!.getBoundingClientRect();
        return { x: r.x - 1, y: r.y - 1, width: r.width + 2, height: r.height + 2 };
      };
      return {
        ring: bb(".chart-self"),
        dot: bb(".chart-dot"),
        // the frame's top edge, clear of any dot: a 4px strip along the middle third
        frame: { x: s.x + s.width / 3, y: s.y - 2, width: s.width / 3, height: 5 },
        // a box rule: the vertical third-line, a 5px strip over the middle third of the chart
        rule: { x: s.x + s.width / 3 - 2.5, y: s.y + s.height / 3 + 2, width: 5, height: s.height / 3 - 4 },
      };
    });
    const row: Record<string, unknown> = {};
    for (const [k, clip] of Object.entries(g)) row[k] = await inkRatio(a, clip);
    // THE SENSITIVITY ROW for the hairline: the rule's best pixel PER ROW of the strip (a vertical
    // 1.25px stroke), then the worst row, the median row, and the share of rows under 3:1.
    {
      const { px, w } = await pixels(await a.screenshot({ clip: g.rule }));
      const ground = lum(...modal(px));
      const per: number[] = [];
      for (let y = 0; y < px.length / w; y++) {
        let best = 1;
        for (let x = 0; x < w; x++) best = Math.max(best, ratio(lum(...px[y * w + x]), ground));
        per.push(best);
      }
      per.sort((x, y) => x - y);
      row.ruleRows = {
        rows: per.length,
        worst: +per[0].toFixed(3),
        p50: +per[Math.floor(per.length / 2)].toFixed(3),
        best: +per[per.length - 1].toFixed(3),
        under3: +(per.filter((r) => r < 3).length / per.length).toFixed(3),
      };
    }
    await a.keyboard.press("Escape");
    await a.waitForTimeout(300);
    // THE MARK'S FOCUS RING, painted: focused by keyboard vs blurred, same clip.
    const m = a.locator("[data-player-mark]:visible");
    const box = (await m.boundingBox())!;
    const clip = { x: box.x - 7, y: box.y - 7, width: box.width + 14, height: box.height + 14 };
    await a.locator(".sudoku-cell input").nth(40).click();
    const blurred = await pixels(await a.screenshot({ clip }));
    let reached = false;
    for (let i = 0; i < 40 && !reached; i++) {
      await a.keyboard.press(info.project.name === "webkit" ? "Alt+Tab" : "Shift+Tab");
      reached = await m.evaluate((el) => document.activeElement === el && el.matches(":focus-visible"));
    }
    if (reached) {
      const focused = await pixels(await a.screenshot({ clip }));
      const rs: number[] = [];
      focused.px.forEach((p, i) => {
        const q = blurred.px[i];
        if (Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) > 30)
          rs.push(ratio(lum(...p), lum(...q)));
      });
      rs.sort((x, y) => x - y);
      row.focusRing = {
        route: info.project.name === "webkit" ? "Alt+Tab" : "Shift+Tab",
        pixels: rs.length,
        p50: +rs[Math.floor(rs.length * 0.5)].toFixed(3),
        p90: +rs[Math.floor(rs.length * 0.9)].toFixed(3),
        max: +rs[rs.length - 1].toFixed(3),
        under3: +(rs.filter((r) => r < 3).length / rs.length).toFixed(3),
      };
    } else row.focusRing = "keyboard never reached the mark with :focus-visible";
    out[dark ? "dark" : "light"] = row;
  }
  console.log(`PLC|${info.project.name}|aa|${JSON.stringify(out)}`);
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/aa-${info.project.name}.json`, JSON.stringify(out, null, 1));
  await ctx.close();
});

test("frames", async ({ browser }, info) => {
  test.setTimeout(300000);
  mkdirSync(SHOTS, { recursive: true });
  const e = info.project.name;
  // F1 (and F4 on the list arm): the kill condition, 390×664 coarse, two at the table.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
    const [a, b] = await table(ctx, 2);
    await b.bringToFront();
    await b.locator(".sudoku-cell input").nth(20).tap();
    await a.bringToFront();
    await a.waitForTimeout(900);
    await a.locator("[data-player-mark]:visible").tap();
    await a.waitForTimeout(600);
    const lap = await a.evaluate(() => {
      const s = document.querySelector("[data-lobby].is-open")!.getBoundingClientRect();
      const top = Math.min(...[...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect().top));
      return { bottom: s.bottom, lap: s.bottom - top, h: s.height };
    });
    const cells = await a.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
    console.log(`PLC|${e}|frame664|${ARM}|${JSON.stringify(lap)}|board ${cells.slice(0, 27)}`);
    await a.screenshot({ path: `${SHOTS}/${ARM}-664-${e}.png`, clip: { x: 0, y: 0, width: 390, height: Math.ceil(lap.bottom + 60) } });
    await ctx.close();
  }
  if (ARM !== "chart") return;
  // F2: the query at four, a peer row hovered, desk light.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
    const [a, ...peers] = await table(ctx, 4);
    for (const [i, p] of peers.entries()) {
      await p.bringToFront();
      await p.locator(".sudoku-cell input").nth(12 + 20 * i).click();
    }
    await a.bringToFront();
    await a.locator(".sudoku-cell input").nth(40).click();
    await a.waitForTimeout(900);
    await a.locator("[data-player-mark]:visible").click();
    await a.waitForTimeout(500);
    await a.locator("[data-lobby]:visible .pl-row").nth(2).hover();
    const r = (await a.locator("[data-lobby]:visible").boundingBox())!;
    await a.screenshot({ path: `${SHOTS}/query-${e}.png`, clip: { x: r.x - 4, y: r.y - 4, width: r.width + 8, height: r.height + 8 } });
    await ctx.close();
  }
  // F3: the first frame after a cold press — the state a reader meets first.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
    const [a, ...peers] = await table(ctx, 3);
    for (const [i, p] of peers.entries()) {
      await p.bringToFront();
      await p.locator(".sudoku-cell input").nth(30 + 22 * i).click();
    }
    await a.bringToFront();
    await a.waitForTimeout(2000);
    await a.locator("[data-player-mark]:visible").click();
    await a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const dots = await a.locator("[data-lobby].is-open .chart-dot").count();
    console.log(`PLC|${e}|coldframe|dots=${dots}`);
    await a.screenshot({ path: `${SHOTS}/cold-${e}.png`, clip: { x: 0, y: 40, width: 300, height: 260 } });
    await ctx.close();
  }
});
