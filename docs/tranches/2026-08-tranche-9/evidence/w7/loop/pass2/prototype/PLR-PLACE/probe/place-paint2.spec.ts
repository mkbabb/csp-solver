/**
 * PLR-PLACE · PASS-2 G13 + G2-paint — THE PAINTED BYTES ON THE OPAQUE GROUND.
 *
 * Pass 1 measured its inks on the four page grounds and passed. The reading that mattered was
 * the one it did not take: the sheet's own ground, WITH THE WORDMARK UNDER IT. At 80% popover
 * `--ink-press-quiet` read 4.20:1 in BOTH themes there. So this probe measures the sheet AS IT
 * SITS — opened in the head corner, over whatever the head corner holds — and the ground it
 * compares against is the sheet's own painted background, sampled from the sheet's own padding.
 *
 * No rig, no clone, no hex arithmetic: the sheet is opened by a REAL press and screenshotted
 * where it lives.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const HOME =
  process.env.PLC_HOME ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/PLR-PLACE";
const OUT = join(HOME, "logs");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);

const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const L = (r: number, g: number, b: number) =>
  0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a: [number, number, number], b: [number, number, number]) => {
  const la = L(...a);
  const lb = L(...b);
  return +((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(2);
};

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
const MARK = "[data-player-mark]";
function mark(page: Page) {
  return page.locator(MARK).locator("visible=true").first();
}
function sheet(page: Page) {
  return page.locator("[data-lobby]:visible");
}

async function raster(buf: Buffer) {
  const { data, info } = await sharp(buf)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = (x: number, y: number): [number, number, number] => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  return { w: info.width, h: info.height, px };
}
function best(
  r: { w: number; h: number; px: (x: number, y: number) => [number, number, number] },
  ground: [number, number, number],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) {
  let top = 0;
  for (let y = Math.max(0, Math.round(y0)); y < Math.min(r.h, Math.round(y1)); y++)
    for (let x = Math.max(0, Math.round(x0)); x < Math.min(r.w, Math.round(x1)); x++) {
      const v = ratio(r.px(x, y), ground);
      if (v > top) top = v;
    }
  return +top.toFixed(2);
}

test("THE SHEET'S OWN GROUND — quiet, rule, dots, ring, over the wordmark", async ({
  browser,
}, info) => {
  const eng = info.project.name;
  mkdirSync(OUT, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);

  // A room with four peers on known cells, so there are four dots and a live sign.
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  const link = page.url();
  const room = new URL(link).searchParams.get("s")!;
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(page.locator(".controls-card .players-roster .player-row")).toHaveCount(2);
  await page.evaluate((r) => {
    const w = window as unknown as { __st: unknown; __ch: BroadcastChannel };
    w.__st = null;
    const ch = new BroadcastChannel(`board:${r}`);
    w.__ch = ch;
    ch.onmessage = (ev: MessageEvent) => {
      if (ev.data?.kind === "st") w.__st = ev.data.data;
    };
  }, room);
  await b.evaluate(() => {
    const ch = new BroadcastChannel(
      `board:${new URL(location.href).searchParams.get("s")}`,
    );
    ch.postMessage({ kind: "hi", data: {}, from: "p-probe000000" });
    ch.close();
  });
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const w = window as unknown as {
      __st: { e: number; ea: string } | null;
      __ch: BroadcastChannel;
    };
    if (!w.__st) return;
    const { e, ea } = w.__st;
    [10, 40, 70, 24].forEach((p, i) => {
      const id = `p-fake${String(i).padStart(8, "0")}`;
      w.__ch.postMessage({ kind: "hi", data: { ack: true }, from: id });
      w.__ch.postMessage({ kind: "cur", data: { p, e, ea }, from: id });
    });
  });
  // your own cell — a REAL press, so `lastCell` is real
  await page.locator(".sudoku-cell").nth(60).click();
  await page.waitForTimeout(1400);

  const rows: Record<string, unknown>[] = [];

  for (const theme of ["light", "dark"] as const) {
    await page.evaluate((t) => {
      document.documentElement.classList.toggle("dark", t === "dark");
    }, theme);
    await page.waitForTimeout(400);

    if ((await sheet(page).count()) === 0) {
      await mark(page).click();
      await page.waitForTimeout(800);
    }
    await expect(sheet(page)).toBeVisible();

    // Does the sheet actually lap the wordmark? Declared, then measured.
    const laps = await page.evaluate(() => {
      const s = document.querySelector("[data-lobby]") as HTMLElement;
      const wm = document.querySelector("svg.handwritten-logo") as SVGElement | null;
      if (!wm) return null;
      const a = s.getBoundingClientRect();
      const c = wm.getBoundingClientRect();
      const ox = Math.max(0, Math.min(a.right, c.right) - Math.max(a.left, c.left));
      const oy = Math.max(0, Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top));
      return {
        overlapPx: +(ox * oy).toFixed(0),
        wordmark: { x: +c.x.toFixed(1), y: +c.y.toFixed(1), w: +c.width.toFixed(1), h: +c.height.toFixed(1) },
        sheet: { x: +a.x.toFixed(1), y: +a.y.toFixed(1), w: +a.width.toFixed(1), h: +a.height.toFixed(1) },
      };
    });

    const geo = await page.evaluate(() => {
      const s = document.querySelector("[data-lobby]") as HTMLElement;
      const r = s.getBoundingClientRect();
      const g = (sel: string) => {
        const el = s.querySelector(sel) as HTMLElement | SVGElement | null;
        if (!el) return null;
        const q = el.getBoundingClientRect();
        return { x: q.x - r.x, y: q.y - r.y, w: q.width, h: q.height };
      };
      const dots = [...s.querySelectorAll(".chart-dot")].map((d) => {
        const q = (d as SVGElement).getBoundingClientRect();
        return { x: q.x - r.x, y: q.y - r.y, w: q.width, h: q.height };
      });
      return {
        sheet: { w: r.width, h: r.height },
        state: g(".lobby-state"),
        rule: g(".chart-rule"),
        frame: g(".chart-frame"),
        chart: g(".place-chart"),
        ring: g(".chart-self"),
        name: g(".pl-name"),
        qualifier: g(".pl-qualifier"),
        dots,
      };
    });

    const shot = await sheet(page).screenshot();
    const r = await raster(shot);
    // THE GROUND is the sheet's own painted background, sampled from its padding corner —
    // 4px in from the border, where nothing is drawn.
    const ground = r.px(8, Math.round(geo.sheet.h) - 6);

    const dotVals = geo.dots.map((d) =>
      best(r, ground, d.x + 1, d.y + 1, d.x + d.w - 1, d.y + d.h - 1),
    );
    const row = {
      engine: eng,
      theme,
      groundRgb: ground,
      laps,
      quiet: geo.state
        ? best(r, ground, geo.state.x, geo.state.y, geo.state.x + geo.state.w, geo.state.y + geo.state.h)
        : null,
      qualifier: geo.qualifier
        ? best(
            r,
            ground,
            geo.qualifier.x,
            geo.qualifier.y,
            geo.qualifier.x + geo.qualifier.w,
            geo.qualifier.y + geo.qualifier.h,
          )
        : null,
      name: geo.name
        ? best(r, ground, geo.name.x, geo.name.y, geo.name.x + geo.name.w, geo.name.y + geo.name.h)
        : null,
      frame: geo.frame
        ? best(r, ground, geo.frame.x, geo.frame.y, geo.frame.x + geo.frame.w, geo.frame.y + geo.frame.h)
        : null,
      // the subgrid rule: read inside the chart box but AWAY from the frame edge
      rule: geo.chart
        ? best(
            r,
            ground,
            geo.chart.x + geo.chart.w / 3 - 2,
            geo.chart.y + 6,
            geo.chart.x + geo.chart.w / 3 + 2,
            geo.chart.y + geo.chart.h - 6,
          )
        : null,
      ring: geo.ring
        ? best(r, ground, geo.ring.x, geo.ring.y, geo.ring.x + geo.ring.w, geo.ring.y + geo.ring.h)
        : null,
      ringBoxPx: geo.ring ? +geo.ring.w.toFixed(2) : null,
      chartPx: geo.chart ? +geo.chart.w.toFixed(2) : null,
      dotPx: geo.dots.length ? +geo.dots[0].w.toFixed(2) : null,
      dots: dotVals,
      dotsMin: dotVals.length ? Math.min(...dotVals) : null,
    };
    rows.push(row);
    say(`g13.${theme}`, row);
  }

  writeFileSync(join(OUT, `paint2-${eng}.json`), JSON.stringify({ engine: eng, rows }, null, 1));
  for (const row of rows) {
    expect(row.quiet ?? 0, `G13 quiet ${row.theme}`).toBeGreaterThanOrEqual(4.5);
    expect(row.rule ?? 0, `G13 rule ${row.theme}`).toBeGreaterThanOrEqual(3);
    expect(row.ring ?? 0, `G13 ring ${row.theme}`).toBeGreaterThanOrEqual(3);
    expect(row.dotsMin ?? 0, `G13 dots ${row.theme}`).toBeGreaterThanOrEqual(3);
  }
  await ctx.close();
});
