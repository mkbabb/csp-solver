/**
 * T9-W7 pass 1 · MRK-LIVE — IS 0.04px OF σ ACTUALLY LIFE?
 *
 * A σ over time is a geometry number. What the reader sees is PAINTED BYTES, so this row reads
 * them: a dpr-3 crop of the focused cell at pose 0 against the same crop at pose 2, changed
 * pixels and max channel delta — measured for the RING under the prototype, and for the GRID's
 * own boil as the house reference. The grid's number is what the estate already calls "boil"
 * and ships; the ring has to reach the same order or the cure is a geometry change nobody sees.
 *
 * Also here: the N-BEATS arm (does it stop breathing, and is a settled ring the ring we ship)
 * and the COST arm (a mount per arrow key at 16×16 on the phone).
 */
import { test, expect, type Page } from "@playwright/test";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
const FRAMES = join(HERE, "..", "frames");
const PROTO = readFileSync(join(HERE, "..", "proto", "living-ring.js"), "utf8");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function diff(a: Buffer, b: Buffer) {
  const [ra, rb] = await Promise.all([
    sharp(a).raw().toBuffer({ resolveWithObject: true }),
    sharp(b).raw().toBuffer({ resolveWithObject: true }),
  ]);
  const n = Math.min(ra.data.length, rb.data.length);
  const ch = ra.info.channels;
  let changed = 0;
  let maxD = 0;
  let sumD = 0;
  const px = n / ch;
  for (let i = 0; i < n; i += ch) {
    let d = 0;
    for (let c = 0; c < Math.min(3, ch); c++)
      d = Math.max(d, Math.abs(ra.data[i + c] - rb.data[i + c]));
    if (d > 2) changed++;
    if (d > maxD) maxD = d;
    sumD += d;
  }
  return {
    pixels: px,
    changedPx: changed,
    changedPct: Math.round((changed / px) * 10000) / 100,
    maxChannelDelta: maxD,
    meanChannelDelta: Math.round((sumD / px) * 1000) / 1000,
    size: `${ra.info.width}x${ra.info.height}`,
  };
}

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
}

test.describe("dpr3", () => {
  test.use({ deviceScaleFactor: 3 });

  test("MRK-LIVE-p THE PERCEPTUAL DELTA — the ring's boil against the grid's own", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "painted-byte diffs run on one engine");
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await boardReady(page);
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      inputs[40]?.focus();
    });
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    const cellBox = await page.evaluate(() => {
      const c = document.querySelector(".game-cell:has(input:focus-visible)")!;
      const r = c.getBoundingClientRect();
      const pad = r.width * 0.25;
      return {
        x: Math.round(r.x - pad),
        y: Math.round(r.y - pad),
        width: Math.round(r.width + pad * 2),
        height: Math.round(r.height + pad * 2),
      };
    });

    // ── THE GRID'S OWN BOIL, on the same crop, as the house reference. The beat is 8Hz and a
    //    screenshot is not instantaneous, so catching a pose by watching is a race. PIN it
    //    instead: the four baked poses are <image href=blob:…> siblings, and setting ALL FOUR
    //    hrefs to one pose's bitmap makes whichever the beat has active paint that pose. Vue
    //    never rewrites href (it is bound to a stable `bitmapUrls[f]`), only `is-active`.
    const pinGrid = async (pose: number) =>
      page.evaluate((p) => {
        const imgs = Array.from(
          document.querySelectorAll(".boil-frame-bitmap"),
        ) as SVGImageElement[];
        const w = window as any;
        w.__urls =
          w.__urls ?? imgs.map((i) => i.getAttribute("href") || i.getAttribute("xlink:href"));
        for (const i of imgs) i.setAttribute("href", w.__urls[p]);
        return w.__urls.length;
      }, pose);

    const gridShots: Buffer[] = [];
    for (const pose of [0, 2, 0]) {
      await pinGrid(pose);
      await page.waitForTimeout(140);
      gridShots.push(await page.screenshot({ clip: cellBox }));
    }
    const gridDelta = await diff(gridShots[0], gridShots[1]);
    // Same-pose control: pose 0 against pose 0, one beat cycle apart.
    const gridControl = await diff(gridShots[0], gridShots[2]);
    await page.evaluate(() => {
      const imgs = Array.from(
        document.querySelectorAll(".boil-frame-bitmap"),
      ) as SVGImageElement[];
      const w = window as any;
      imgs.forEach((im, i) => im.setAttribute("href", w.__urls[i]));
    });
    await page.waitForTimeout(200);

    // ── THE RING UNDER THE PROTOTYPE, pinned pose by pose (no observer: exact). The GRID is
    //    pinned to pose 0 throughout so the only thing moving in the crop is the ring.
    await pinGrid(0);
    await page.waitForTimeout(150);
    await page.evaluate(PROTO);
    await page.evaluate(() => (window as any).__mrkLive.init());
    const mounted = await page.evaluate(() =>
      (window as any).__mrkLive.mountActive({}),
    );
    const shots: Buffer[] = [];
    for (let f = 0; f < 4; f++) {
      await page.evaluate((i) => (window as any).__mrkLive.paint(i), f);
      await page.waitForTimeout(120);
      shots.push(await page.screenshot({ clip: cellBox }));
    }
    const ringDelta02 = await diff(shots[0], shots[2]);
    const ringDelta01 = await diff(shots[0], shots[1]);
    const ringDelta13 = await diff(shots[1], shots[3]);

    // The closed-ring variant, same crop.
    await page.evaluate(() => (window as any).__mrkLive.unmount());
    await page.evaluate(() =>
      (window as any).__mrkLive.mountActive({ grammar: "closed" }),
    );
    const cshots: Buffer[] = [];
    for (let f = 0; f < 4; f++) {
      await page.evaluate((i) => (window as any).__mrkLive.paint(i), f);
      await page.waitForTimeout(120);
      cshots.push(await page.screenshot({ clip: cellBox }));
    }
    const closedDelta02 = await diff(cshots[0], cshots[2]);

    // Negative control: the RESTING ring against itself, grid still pinned — this is the
    // measurement floor (screenshot noise, caret, anything else alive in the crop).
    await page.evaluate(() => (window as any).__mrkLive.unmount());
    await page.waitForTimeout(250);
    const restA = await page.screenshot({ clip: cellBox });
    await page.waitForTimeout(300);
    const restB = await page.screenshot({ clip: cellBox });
    const restDelta = await diff(restA, restB);

    // The AMBIENT floor the product already ships: grid unpinned, ring resting, two shots a
    // beat apart. Whatever the living ring adds has to be read against THIS, not against zero.
    await page.evaluate(() => {
      const imgs = Array.from(
        document.querySelectorAll(".boil-frame-bitmap"),
      ) as SVGImageElement[];
      const w = window as any;
      imgs.forEach((im, i) => im.setAttribute("href", w.__urls[i]));
    });
    await page.waitForTimeout(300);
    const liveA = await page.screenshot({ clip: cellBox });
    await page.waitForTimeout(255);
    const liveB = await page.screenshot({ clip: cellBox });
    const ambientDelta = await diff(liveA, liveB);

    writeFileSync(join(FRAMES, "ring-pose0.png"), shots[0]);
    writeFileSync(join(FRAMES, "ring-pose2.png"), shots[2]);

    const out = {
      engine: browserName,
      cellBox,
      mounted,
      gridPosesCaught: gridShots.map((s) => s.pose),
      gridDelta,
      gridControl,
      ringDelta02,
      ringDelta01,
      ringDelta13,
      closedDelta02,
      restDelta,
      ambientDelta,
    };
    bank("feel-perceptual.json", out);
    console.log("PERCEPTUAL " + JSON.stringify(out, null, 2));
    expect(out).toBeTruthy();
  });

  test("MRK-LIVE-n THE N-BEATS ARM — does it stop breathing, and what settles", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "one engine for the settle timeline");
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await boardReady(page);
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      inputs[40]?.focus();
    });
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(400);
    await page.evaluate(PROTO);
    await page.evaluate(() => (window as any).__mrkLive.init());

    const arms: unknown[] = [];
    for (const settleBeats of [0, 4, 8, 16]) {
      await page.reload();
      await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
      await page.waitForTimeout(1300);
      await page.evaluate(() => {
        const inputs = Array.from(
          document.querySelectorAll(".game-cell input"),
        ) as HTMLInputElement[];
        inputs[40]?.focus();
      });
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(300);
      await page.evaluate(PROTO);
      await page.evaluate(() => (window as any).__mrkLive.init());
      await page.evaluate(
        (n) => (window as any).__mrkLive.arm({ settleBeats: n, settlePose: 0 }),
        settleBeats,
      );
      await page.evaluate(() => (window as any).__mrkLive.mountActive({}));

      const timeline = await page.evaluate(async () => {
        const t0 = performance.now();
        const seq: { t: number; visible: number }[] = [];
        while (performance.now() - t0 < 3000) {
          const nodes = Array.from(
            document.querySelectorAll(
              ".game-cell:has(input:focus-visible) .cell-ghost-path",
            ),
          );
          const vis = nodes.findIndex(
            (n) => (n as HTMLElement).style.opacity === "1",
          );
          seq.push({ t: Math.round(performance.now() - t0), visible: vis });
          await new Promise((r) => setTimeout(r, 25));
        }
        const changes: { t: number; visible: number }[] = [];
        let last = -99;
        for (const s of seq)
          if (s.visible !== last) {
            changes.push(s);
            last = s.visible;
          }
        return { samples: seq.length, changes, lastVisible: seq[seq.length - 1].visible };
      });
      const stats = await page.evaluate(() => (window as any).__mrkLive.stats());
      arms.push({
        settleBeats,
        settleMsExpected: settleBeats ? settleBeats * 125 : null,
        swapsIn3s: timeline.changes.length,
        firstSwapMs: timeline.changes[1]?.t ?? null,
        lastSwapMs: timeline.changes[timeline.changes.length - 1]?.t ?? null,
        settledOnPose: timeline.lastVisible,
        settled: stats.settled,
        changes: timeline.changes.slice(0, 24),
      });
    }
    bank("feel-settle.json", { engine: browserName, arms });
    console.log("SETTLE " + JSON.stringify(arms, null, 2));
    expect(arms.length).toBe(4);
  });
});

test.describe("phone 393x699 dpr3", () => {
  test.use({
    viewport: { width: 393, height: 699 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  test("MRK-LIVE-c THE COST — arrow-key traversal at 16×16, before and after", async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await boardReady(page, "?size=4&difficulty=EASY");
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      inputs[0]?.focus();
    });
    await page.waitForTimeout(400);

    const trace = async () => {
      await page.evaluate(() => {
        (window as any).__deltas = [];
        let last = performance.now();
        const tick = () => {
          const t = performance.now();
          (window as any).__deltas.push(Math.round((t - last) * 100) / 100);
          last = t;
          (window as any).__raf = requestAnimationFrame(tick);
        };
        (window as any).__raf = requestAnimationFrame(tick);
      });
      for (let i = 0; i < 24; i++) {
        await page.keyboard.press(i % 2 ? "ArrowRight" : "ArrowDown");
        await page.waitForTimeout(90);
      }
      return page.evaluate(() => {
        cancelAnimationFrame((window as any).__raf);
        const d: number[] = (window as any).__deltas.slice(1);
        const sorted = [...d].sort((a, b) => a - b);
        return {
          frames: d.length,
          medianMs: sorted[Math.floor(sorted.length / 2)],
          p95Ms: sorted[Math.floor(sorted.length * 0.95)],
          maxMs: Math.max(...d),
          over33: d.filter((x) => x > 33).length,
          over50: d.filter((x) => x > 50).length,
          longest: sorted.slice(-5),
        };
      });
    };

    const before = await trace();
    await page.evaluate(PROTO);
    await page.evaluate(() => (window as any).__mrkLive.init());
    await page.evaluate(() => (window as any).__mrkLive.arm({}));
    await page.evaluate(() => (window as any).__mrkLive.mountActive({}));
    await page.waitForTimeout(400);
    const after = await trace();
    const stats = await page.evaluate(() => (window as any).__mrkLive.stats());
    const dom = await page.evaluate(() => ({
      ghostPaths: document.querySelectorAll(".cell-ghost-path").length,
      posePaths: document.querySelectorAll(".mrk-live-pose").length,
      cells: document.querySelectorAll(".game-cell").length,
    }));

    const out = { engine: browserName, before, after, stats, dom };
    bank(`feel-cost-${browserName}.json`, out);
    console.log("COST " + JSON.stringify(out, null, 2));
    expect(out).toBeTruthy();
  });
});
