/**
 * PLR-PLACE · PROTOTYPE GATES G2 + G3 — THE PAINTED BYTES.
 *
 * The prototype's OWN components are mounted into a clean rig on each of the four grounds
 * (`--color-background` and `--color-card`, light and dark), screenshotted, and read back byte
 * by byte with `sharp`. No hex arithmetic: the subject is what the engine painted.
 *
 * G3 — the sign's 28px frame (`HandDrawnOutline :stroke-width="2" :pose="0"`, the real
 *      component, lifted out of the head into the rig by `cloneNode`) must clear 3:1.
 * G2 — every dot on the 96px chart must clear 3:1 at r 4, on all four grounds.
 *
 * The negative control the research banked rides with them: the same inks at 24px read
 * 1.52–2.69:1, which is why neither of these two objects is a 24px miniature.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const HOME =
  process.env.PLC_HOME ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PLR-PLACE";
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

/** The BEST pixel in a box against the ground — the research's own reading (a 2px stroke's
 *  darkest painted byte, not its anti-aliased skirt). */
function best(
  r: { w: number; h: number; px: (x: number, y: number) => [number, number, number] },
  ground: [number, number, number],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) {
  let top = 0;
  let at: [number, number] = [x0, y0];
  for (let y = Math.max(0, y0); y < Math.min(r.h, y1); y++) {
    for (let x = Math.max(0, x0); x < Math.min(r.w, x1); x++) {
      const v = ratio(r.px(x, y), ground);
      if (v > top) {
        top = v;
        at = [x, y];
      }
    }
  }
  return { ratio: top, at };
}

test("THE PAINTED BYTES — the sign's frame at 28px, the chart's dots at 96px", async ({
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

  // Put three peers in the room so the chart has dots and the sign is live, using the wire's
  // own words on the local channel.
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
    // four peers on known, well-separated cells: (1,1) (4,4) (7,7) (2,6)
    [10, 40, 70, 24].forEach((p, i) => {
      const id = `p-fake${String(i).padStart(8, "0")}`;
      w.__ch.postMessage({ kind: "hi", data: { ack: true }, from: id });
      w.__ch.postMessage({ kind: "cur", data: { p, e, ea }, from: id });
    });
  });
  // your own ring needs your own cell
  await page.locator(".sudoku-cell").nth(60).click();
  await page.waitForTimeout(1200);

  const rows: Record<string, unknown>[] = [];

  for (const theme of ["light", "dark"] as const) {
    await page.evaluate((t) => {
      document.documentElement.classList.toggle("dark", t === "dark");
    }, theme);
    await page.waitForTimeout(400);

    for (const ground of ["--color-background", "--color-card"] as const) {
      // Open the sheet so the chart exists, then CLONE the live sign and the live chart into a
      // clean rig on this ground. The nodes are the product's own — same stroke, same ink, same
      // paths — and the rig only controls what is behind them.
      await page.evaluate(() => {
        const m = [...document.querySelectorAll("[data-player-mark]")].find(
          (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
        ) as HTMLElement;
        if (!document.querySelector("[data-lobby]")) m.click();
      });
      await page.waitForTimeout(900);

      const groundRgb = await page.evaluate((g) => {
        const probe = document.createElement("div");
        probe.style.cssText = `background:var(${g})`;
        document.body.appendChild(probe);
        const c = getComputedStyle(probe).backgroundColor;
        probe.remove();
        const m = c.match(/\d+/g)!.map(Number);
        return [m[0], m[1], m[2]] as [number, number, number];
      }, ground);

      await page.evaluate(
        ([g]) => {
          document.querySelector("#plc-rig")?.remove();
          const rig = document.createElement("div");
          rig.id = "plc-rig";
          rig.style.cssText = `position:fixed;right:0;bottom:0;z-index:9999;background:var(${g});padding:24px;display:flex;gap:24px;align-items:flex-start;`;
          // the WRAPPER, not the button: `is-live` (the room's ink) is the parent's class, and
          // a cloned button alone falls back to the solo quiet rung. Both arms are measured —
          // the rig below is run once per theme per ground with the room live.
          const signEl = (
            [...document.querySelectorAll("[data-player-mark]")].find(
              (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
            ) as HTMLElement
          ).parentElement as HTMLElement;
          const sign = signEl.cloneNode(true) as HTMLElement;
          const quiet = signEl.cloneNode(true) as HTMLElement;
          quiet.classList.remove("is-live");
          quiet.id = "plc-quiet-inner";
          const chart = (
            document.querySelector("[data-lobby] .place-chart") as HTMLElement
          ).cloneNode(true) as HTMLElement;
          const signWrap = document.createElement("div");
          signWrap.id = "plc-sign";
          signWrap.appendChild(sign);
          const quietWrap = document.createElement("div");
          quietWrap.id = "plc-quiet";
          quietWrap.appendChild(quiet);
          const chartWrap = document.createElement("div");
          chartWrap.id = "plc-chart";
          chartWrap.appendChild(chart);
          rig.append(signWrap, quietWrap, chartWrap);
          document.body.appendChild(rig);
        },
        [ground],
      );
      await page.waitForTimeout(300);

      const geo = await page.evaluate(() => {
        const g = (s: string) => {
          const el = document.querySelector(s) as HTMLElement;
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        };
        const dots = [...document.querySelectorAll("#plc-chart .chart-dot")].map((c) => {
          const r = (c as SVGElement).getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        });
        const self = document.querySelector("#plc-chart .chart-self");
        const ring = self ? (self as SVGElement).getBoundingClientRect() : null;
        return {
          rig: g("#plc-rig"),
          sign: g("#plc-sign"),
          frame: g("#plc-sign .outline-svg"),
          quietFrame: g("#plc-quiet .outline-svg"),
          chart: g("#plc-chart .place-chart"),
          dots,
          ring: ring ? { x: ring.x, y: ring.y, w: ring.width, h: ring.height } : null,
        };
      });

      const shot = await page.locator("#plc-rig").screenshot();
      const r = await raster(shot);
      const ox = geo.rig.x;
      const oy = geo.rig.y;
      const rel = (bx: { x: number; y: number; w: number; h: number }) => [
        Math.round(bx.x - ox),
        Math.round(bx.y - oy),
        Math.round(bx.x - ox + bx.w),
        Math.round(bx.y - oy + bx.h),
      ];

      // G3 — the sign's frame: the best painted byte anywhere in the 28px box.
      const [fx0, fy0, fx1, fy1] = rel(geo.frame);
      const frame = best(r, groundRgb, fx0, fy0, fx1, fy1);
      const [qx0, qy0, qx1, qy1] = rel(geo.quietFrame);
      const quietFrame = best(r, groundRgb, qx0, qy0, qx1, qy1);

      // G2 — each dot: the best byte inside its own 8px box.
      const dots = geo.dots.map((d, i) => {
        const [x0, y0, x1, y1] = rel(d);
        const bp = best(r, groundRgb, x0, y0, x1, y1);
        return { i, box: [x0, y0, x1, y1], ratio: bp.ratio };
      });
      const ring = geo.ring
        ? best(r, groundRgb, ...(rel(geo.ring) as [number, number, number, number]))
        : null;

      const row = {
        engine: eng,
        theme,
        ground,
        groundRgb,
        signFrameLive: frame.ratio,
        signFrameSolo: quietFrame.ratio,
        chartSide: +geo.chart.w.toFixed(1),
        dotSide: geo.dots.length ? +geo.dots[0].w.toFixed(2) : 0,
        dots: dots.map((d) => d.ratio),
        dotsMin: dots.length ? Math.min(...dots.map((d) => d.ratio)) : null,
        ring: ring ? ring.ratio : null,
      };
      rows.push(row);
      say(`paint.${theme}.${ground}`, row);
    }
  }

  writeFileSync(join(OUT, `paint-${eng}.json`), JSON.stringify({ engine: eng, rows }, null, 1));
  for (const row of rows) {
    expect(row.signFrameLive, `G3 live ${row.theme} ${row.ground}`).toBeGreaterThanOrEqual(3);
    expect(row.signFrameSolo, `G3 solo ${row.theme} ${row.ground}`).toBeGreaterThanOrEqual(3);
    expect(row.dotsMin ?? 0, `G2 ${row.theme} ${row.ground}`).toBeGreaterThanOrEqual(3);
  }
  await ctx.close();
});
