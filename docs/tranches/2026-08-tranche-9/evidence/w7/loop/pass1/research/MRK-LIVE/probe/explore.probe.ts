/**
 * MRK-LIVE pass-1 · EXPLORATION — verify the substrate claims in the page before building
 * the prototype. No assertions that matter; this is reconnaissance, banked as a log.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
}

test("EXPLORE — the module, the beat carrier, pose-0 identity", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "reconnaissance runs once");
  await page.emulateMedia({ colorScheme: "light" });
  await boardReady(page);

  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[40]?.focus();
  });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);

  const report = await page.evaluate(async () => {
    const out: Record<string, unknown> = {};

    // (1) Can the page import the estate's own path module?
    let gp: any = null;
    try {
      gp = await import(
        /* @vite-ignore */ "/src/pencil/grid/gridPaths.ts"
      );
      out.moduleExports = Object.keys(gp);
    } catch (e) {
      out.moduleError = String(e);
    }

    let cfg: any = null;
    try {
      cfg = await import(/* @vite-ignore */ "/src/pencil/config/pencilConfig.ts");
      out.boilConfig = { ...cfg.BOIL_CONFIG };
      out.beatMs = cfg.MOTION.beatMs;
      out.beatsFor150 = cfg.beatsFor(cfg.BOIL_CONFIG.intervalMs);
    } catch (e) {
      out.cfgError = String(e);
    }

    // (2) Pose-0 identity: does generateRectBoilFrames frame 0 equal today's ghost path?
    const focused = document.querySelector(
      ".game-cell:has(input:focus-visible)",
    ) as HTMLElement | null;
    const ghost = focused?.querySelector(".cell-ghost-path") as SVGPathElement | null;
    const liveD = ghost?.getAttribute("d") ?? null;
    out.liveD = liveD?.slice(0, 120) ?? null;

    if (gp && focused) {
      const N = document.querySelectorAll('[role="grid"] [role="row"]').length || 9;
      const cells = Array.from(document.querySelectorAll(".game-cell"));
      const pos = cells.indexOf(focused.closest(".game-cell") ?? focused);
      const cellSize = 1000 / N;
      const col = pos % N;
      const row = Math.floor(pos / N);
      const opts = {
        roughness: 0.4,
        segments: N >= 16 ? 2 : 4,
        seed: 42 + 500 + pos * 7,
        jagged: true,
      };
      const frames = gp.generateRectBoilFrames(
        col * cellSize,
        row * cellSize,
        cellSize,
        cellSize,
        opts,
        0.3,
        4,
      );
      out.boardSize = N;
      out.pos = pos;
      out.frame0 = frames[0].slice(0, 120);
      out.pose0EqualsLive = frames[0] === liveD;
      out.frameCount = frames.length;
      out.frame1 = frames[1].slice(0, 120);
      // How far does a pose travel from pose 0, in viewBox units?
      const nums = (d: string) =>
        (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      const a = nums(frames[0]);
      const b = nums(frames[1]);
      let maxD = 0;
      let sum = 0;
      for (let i = 0; i + 1 < Math.min(a.length, b.length); i += 2) {
        const d = Math.hypot(a[i] - b[i], a[i + 1] - b[i + 1]);
        if (d > maxD) maxD = d;
        sum += d;
      }
      out.pose0to1MaxTravelUnits = Math.round(maxD * 1000) / 1000;
      out.pose0to1MeanTravelUnits =
        Math.round((sum / (a.length / 2)) * 1000) / 1000;
      out.vertexCount = a.length / 2;
    }

    // (3) Who carries the beat in the DOM?
    const carriers: Record<string, unknown> = {};
    for (const sel of [
      ".boil-frame-bitmap",
      ".boil-frame-layer",
      ".trace-pose",
      ".boil-pose",
      "[class*='trace']",
    ]) {
      const els = Array.from(document.querySelectorAll(sel));
      carriers[sel] = {
        count: els.length,
        activeIdx: els.findIndex((e) => e.classList.contains("is-active")),
        classes: els[0]?.getAttribute("class") ?? null,
      };
    }
    out.beatCarriers = carriers;

    // (4) The ghost svg's own scale
    if (ghost) {
      const svg = ghost.ownerSVGElement!;
      const vb = svg.viewBox.baseVal;
      out.ghostSvg = {
        viewBox: svg.getAttribute("viewBox"),
        pxWidth: svg.getBoundingClientRect().width,
        scale: svg.getBoundingClientRect().width / vb.width,
        ownFilter: getComputedStyle(ghost).filter,
      };
    }
    return out;
  });

  // (5) Watch the beat carrier over 1.2s from the test side.
  const beatSamples = await page.evaluate(async () => {
    const read = () => {
      const els = Array.from(document.querySelectorAll(".boil-frame-bitmap"));
      const layers = Array.from(document.querySelectorAll(".boil-frame-layer"));
      return {
        bmp: els.findIndex((e) => e.classList.contains("is-active")),
        layer: layers.findIndex((e) => e.classList.contains("is-active")),
        t: Math.round(performance.now()),
      };
    };
    const seq: unknown[] = [];
    const t0 = performance.now();
    while (performance.now() - t0 < 1300) {
      seq.push(read());
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    // Compress to change points only.
    const changes: unknown[] = [];
    let last = "";
    for (const s of seq as any[]) {
      const k = `${s.bmp}/${s.layer}`;
      if (k !== last) {
        changes.push(s);
        last = k;
      }
    }
    return { samples: seq.length, changes };
  });

  const full = { engine: browserName, ...report, beat: beatSamples };
  writeFileSync(join(OUT, "explore.json"), JSON.stringify(full, null, 2));
  console.log("EXPLORE " + JSON.stringify(full, null, 2));
  expect(full).toBeTruthy();
});
