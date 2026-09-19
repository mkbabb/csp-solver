/**
 * ACC-GRAPHITE pass-3 RESEARCH — THE DENOMINATORS.
 *
 * Every ratio this family sells is a painted band over "the frame line", and the family has
 * now declared three different numbers for the same band (10.76 px / 15.0 px / 16.0 px) because
 * nobody pinned the px-per-unit scale or said WHICH line is the denominator. This probe reads,
 * off the MAIN tree at HEAD `74a2b5d9`, the three things a ratio needs:
 *
 *   1. px per viewBox unit, at both rigs (the board svg's rendered box against viewBox 1000);
 *   2. every rule's DECLARED width in units and its rendered px, from the live DOM;
 *   3. the painted band of each rule, off a raw pixel scan, so the antialias skirt is a number
 *      rather than the difference between two instruments.
 *
 * Read-only: it navigates, it does not write the product. Banks `../readings/denominators-<engine>-<rig>.json`.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/research/ACC-GRAPHITE/readings";

const RIGS = [
  { name: "desk", width: 1280, height: 800, dpr: 1 },
  { name: "phone", width: 393, height: 699, dpr: 3 },
];

async function settle(page: Page) {
  await page.waitForSelector(".hand-drawn-grid", { timeout: 30_000 });
  await page.waitForTimeout(1500); // boil poses + any deal
}

test.describe("denominators", () => {
  for (const rig of RIGS) {
    test(`${rig.name} ${rig.width}x${rig.height} dpr${rig.dpr}`, async ({ browser }, info) => {
      const ctx = await browser.newContext({
        viewport: { width: rig.width, height: rig.height },
        deviceScaleFactor: rig.dpr,
        hasTouch: rig.name === "phone",
        isMobile: false,
        colorScheme: "light",
      });
      const page = await ctx.newPage();
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await settle(page);

      const reading = await page.evaluate(() => {
        const svg = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement | null;
        const box = svg?.getBoundingClientRect();
        const vb = svg?.getAttribute("viewBox") ?? null;
        const vbSize = vb ? Number(vb.split(/\s+/)[2]) : null;

        // Declared stroke widths, read off the live template (units in the 1000 viewBox).
        const declared: Record<string, number[]> = {};
        svg?.querySelectorAll("path").forEach((p) => {
          const cls = p.getAttribute("class") ?? "(none)";
          const w = Number(p.getAttribute("stroke-width") ?? "0");
          (declared[cls] ??= []).push(w);
        });

        // The per-cell ghost ring lives in its own <svg> inside each cell.
        const ghost = document.querySelector(".cell-ghost-path") as SVGPathElement | null;
        const ghostSvg = ghost?.ownerSVGElement;
        const ghostBox = ghostSvg?.getBoundingClientRect();
        const ghostVb = ghostSvg?.getAttribute("viewBox") ?? null;
        const gcs = ghost ? getComputedStyle(ghost) : null;

        const root = getComputedStyle(document.documentElement);
        const tok = (n: string) => root.getPropertyValue(n).trim();

        // the peer wash, painted
        const peer = document.querySelector(".cell-peer");
        const peerBg = peer ? getComputedStyle(peer).backgroundColor : null;

        const cell = document.querySelector(".game-cell");
        const cellBox = cell?.getBoundingClientRect();

        return {
          board: box ? { w: +box.width.toFixed(3), h: +box.height.toFixed(3), x: +box.x.toFixed(2), y: +box.y.toFixed(2) } : null,
          viewBox: vb,
          pxPerUnit: box && vbSize ? +(box.width / vbSize).toFixed(5) : null,
          declaredStrokeWidthsByClass: Object.fromEntries(
            Object.entries(declared).map(([k, v]) => [k, Array.from(new Set(v))]),
          ),
          cellBox: cellBox ? { w: +cellBox.width.toFixed(3), h: +cellBox.height.toFixed(3) } : null,
          ghost: ghost
            ? {
                viewBox: ghostVb,
                box: ghostBox ? { w: +ghostBox.width.toFixed(3), h: +ghostBox.height.toFixed(3) } : null,
                pxPerUnit:
                  ghostBox && ghostVb ? +(ghostBox.width / Number(ghostVb.split(/\s+/)[2])).toFixed(5) : null,
                strokeWidthAttr: ghost.getAttribute("stroke-width"),
                computed: gcs
                  ? {
                      strokeWidth: gcs.strokeWidth,
                      stroke: gcs.stroke,
                      strokeOpacity: gcs.strokeOpacity,
                      fill: gcs.fill,
                      fillOpacity: gcs.fillOpacity,
                      strokeDasharray: gcs.strokeDasharray,
                      strokeLinejoin: gcs.strokeLinejoin,
                    }
                  : null,
                pathLength: ghost.getAttribute("pathLength"),
                totalLength: +ghost.getTotalLength().toFixed(2),
                segments: (ghost.getAttribute("d")?.match(/[MLQCZmlqcz]/g) ?? []).length,
              }
            : null,
          tokens: {
            "--color-crayon-blue": tok("--color-crayon-blue"),
            "--color-focus-sketch": tok("--color-focus-sketch"),
            "--color-user-ink": tok("--color-user-ink"),
            "--color-progress-ink": tok("--color-progress-ink"),
            "--grid-line-color": tok("--grid-line-color"),
            "--color-pencil-graphite": tok("--color-pencil-graphite"),
            "--ink-press-rule": tok("--ink-press-rule"),
            "--ink-press-quiet": tok("--ink-press-quiet"),
            "--color-card": tok("--color-card"),
            "--color-foreground": tok("--color-foreground"),
          },
          peerWashPainted: peerBg,
          peerNodes: document.querySelectorAll(".cell-peer").length,
          dpr: window.devicePixelRatio,
        };
      });

      // Painted-band scan: one horizontal raw-pixel row through the board's mid-height, so the
      // antialias skirt of every rule it crosses is measured rather than argued.
      const shot = await page.locator("svg.hand-drawn-grid").screenshot();
      const scan = await page.evaluate(async (b64) => {
        const img = new Image();
        img.src = "data:image/png;base64," + b64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const g = c.getContext("2d", { willReadFrequently: true })!;
        g.drawImage(img, 0, 0);
        const y = Math.floor(c.height / 2);
        const row = g.getImageData(0, y, c.width, 1).data;
        // a run = consecutive pixels with alpha above a hair; report every run's width
        const runs: { start: number; width: number; peakAlpha: number }[] = [];
        let s = -1,
          peak = 0;
        for (let x = 0; x < c.width; x++) {
          const a = row[x * 4 + 3];
          if (a > 8) {
            if (s < 0) {
              s = x;
              peak = a;
            } else peak = Math.max(peak, a);
          } else if (s >= 0) {
            runs.push({ start: s, width: x - s, peakAlpha: peak });
            s = -1;
            peak = 0;
          }
        }
        if (s >= 0) runs.push({ start: s, width: c.width - s, peakAlpha: peak });
        return { rasterWidth: c.width, rasterHeight: c.height, scanRow: y, runs };
      }, shot.toString("base64"));

      mkdirSync(OUT, { recursive: true });
      const out = { base: "74a2b5d9", engine: info.project.name, rig, reading, scan };
      writeFileSync(`${OUT}/denominators-${info.project.name}-${rig.name}.json`, JSON.stringify(out, null, 2));
      expect(reading.pxPerUnit).toBeTruthy();
      await ctx.close();
    });
  }
});
