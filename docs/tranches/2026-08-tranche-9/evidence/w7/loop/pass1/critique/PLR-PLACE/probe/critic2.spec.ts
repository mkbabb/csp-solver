/**
 * PLR-PLACE pass-1 CRITIQUE probe 2 — THE RING, and the painted bytes under it.
 *
 * R · in a room, after YOU have focused a cell: does the ring paint at all, and what does it
 *     read on painted bytes at stroke 1.5 (the prototype banks 3.63 chromium / 4.96 webkit)
 * D · the same, dark
 * H · `hidden`: what it costs YOUR OWN sheet
 * X · the incumbent @mbabb trigger under Enter (the idiom PlayerSign copied)
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const OUT = join(__dirname, "..", "logs");
const MARK = "[data-player-mark]";
const bank: Record<string, unknown> = {};
const rec = (k: string, v: unknown) => {
  bank[k] = v;
  console.log(`CRIT2|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);
};

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function visibleMark(page: Page) {
  const marks = page.locator(MARK);
  const n = await marks.count();
  for (let i = 0; i < n; i++) if (await marks.nth(i).isVisible()) return marks.nth(i);
  throw new Error("no visible mark");
}
const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const lum = (p: number[]) => 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]);
const ratio = (a: number[], b: number[]) => {
  const [hi, lo] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
  return +((hi + 0.05) / (lo + 0.05)).toFixed(2);
};

async function chartBytes(page: Page, label: string) {
  const buf = await page.locator("[data-lobby] .place-chart").screenshot();
  writeFileSync(join(OUT, `chart-${label}.png`), buf);
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const counts = new Map<string, number>();
  for (let i = 0; i < data.length; i += info.channels) {
    counts.set(`${data[i]},${data[i + 1]},${data[i + 2]}`, (counts.get(`${data[i]},${data[i + 1]},${data[i + 2]}`) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((u, v) => v[1] - u[1]);
  const ground = sorted[0][0].split(",").map(Number);
  // every ink with a real presence, its best painted byte against the sheet's ground
  const inks = sorted
    .slice(1)
    .filter(([, n]) => n >= 8)
    .map(([k, n]) => ({ px: k, n, ratio: ratio(k.split(",").map(Number), ground) }))
    .sort((u, v) => v.ratio - u.ratio);
  return { ground, distinct: counts.size, top: sorted.slice(0, 10).map(([k, n]) => `${k}x${n}`), inks: inks.slice(0, 12) };
}

test("CRITIC 2 — the ring, painted", async ({ browser }, info) => {
  const eng = info.project.name;
  mkdirSync(OUT, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);

  // ── X · the incumbent trigger under Enter (fine pointer: focusin already opens it) ────
  await a.locator(".attribution-trigger").first().focus();
  await a.waitForTimeout(250);
  rec("x0.attributionOpenOnFocus", await a.locator(".hover-card.is-open").count());
  await a.keyboard.press("Enter");
  await a.waitForTimeout(250);
  rec("x1.attributionAfterEnter", await a.locator(".hover-card.is-open").count());
  await a.mouse.click(640, 700);
  await a.waitForTimeout(300);

  // ── a room of two ────────────────────────────────────────────────────────────────────
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await verb.first().click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await b.locator(".sudoku-cell").nth(20).click();
  await a.bringToFront();
  await a.waitForTimeout(500);

  // YOU focus a cell WHILE IN THE ROOM — the only path that fills `selfCursor`
  await a.locator(".sudoku-cell").nth(60).click();
  await a.waitForTimeout(1800); // placeSettleMs 700 + wire

  await (await visibleMark(a)).click();
  await a.waitForTimeout(900);
  rec("r1.dots", await a.locator("[data-lobby] .chart-dot").count());
  rec("r1.ring", await a.locator("[data-lobby] .chart-self").count());
  rec("r1.rows", await a.locator("[data-lobby] .lobby-row").count());
  rec("r1.light", await chartBytes(a, `room-light-${eng}`));

  // the ring's own geometry, as painted
  rec(
    "r1.ringAttrs",
    await a.evaluate(() => {
      const c = document.querySelector("[data-lobby] .chart-self") as SVGCircleElement | null;
      if (!c) return null;
      const cs = getComputedStyle(c);
      const r = c.getBoundingClientRect();
      return {
        stroke: cs.stroke,
        strokeWidth: cs.strokeWidth,
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
      };
    }),
  );

  // ── H · `hidden` and your own ring ───────────────────────────────────────────────────
  const hidden = a.locator(".controls-card").getByText("hidden", { exact: true });
  await hidden.first().click();
  await a.waitForTimeout(600);
  if ((await a.locator("[data-lobby]").count()) === 0) {
    await (await visibleMark(a)).click();
    await a.waitForTimeout(800);
  }
  rec("h1.ringAfterHidden", await a.locator("[data-lobby] .chart-self").count());
  rec("h1.dotsAfterHidden", await a.locator("[data-lobby] .chart-dot").count());
  rec("h1.rowsAfterHidden", await a.locator("[data-lobby] .lobby-row").count());
  // and what the OTHER page sees of you
  rec("h1.peerSeesOfYou", await b.evaluate(() => {
    const cells = [...document.querySelectorAll(".sudoku-cell")];
    return cells.filter((c) => (c as HTMLElement).classList.contains("is-peer-cursor") || (c as HTMLElement).querySelector(".peer-cursor")).length;
  }));
  const shown = a.locator(".controls-card").getByText("shown", { exact: true });
  await shown.first().click();
  await a.waitForTimeout(400);
  rec("h2.ringAfterShownAgainNoFocus", await a.locator("[data-lobby] .chart-self").count());
  await a.locator(".sudoku-cell").nth(61).click();
  await a.waitForTimeout(1200);
  if ((await a.locator("[data-lobby]").count()) === 0) {
    await (await visibleMark(a)).click();
    await a.waitForTimeout(800);
  }
  rec("h3.ringAfterShownAndFocus", await a.locator("[data-lobby] .chart-self").count());

  // ── D · dark ─────────────────────────────────────────────────────────────────────────
  await a.evaluate(() => document.documentElement.classList.add("dark"));
  await a.waitForTimeout(600);
  rec(
    "d0.theme",
    await a.evaluate(() => ({
      cls: document.documentElement.className,
      bg: getComputedStyle(document.body).backgroundColor,
    })),
  );
  if ((await a.locator("[data-lobby]").count()) === 0) {
    await (await visibleMark(a)).click();
    await a.waitForTimeout(800);
  }
  rec("d1.dark", await chartBytes(a, `room-dark-${eng}`));

  writeFileSync(join(OUT, `critic2-${eng}.json`), JSON.stringify(bank, null, 2));
});
