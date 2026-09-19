/**
 * T9-W7 round zero · lane R3 — the same four marks on the PHONE, because the owner's marks
 * (m01/m09) are phone frames. 393×699 dpr3 coarse, the regime the filter census runs at.
 */
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });

test.use({
  viewport: { width: 393, height: 699 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});

test("R3-i THE PHONE — ring, wash, meter and note at 393×699", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);

  // A TAP is the phone's selection: tier 1 (graphite, instant), NOT the crayon-blue tier 2.
  await page.locator(".game-cell").nth(40).tap();
  await page.waitForTimeout(400);
  const afterTap = await page.evaluate(() => {
    const active = document.querySelector(".cell-ghost.is-active .cell-ghost-path") as SVGPathElement | null;
    const focusVis = document.querySelectorAll(".game-cell:has(input:focus-visible)").length;
    const cs = active ? getComputedStyle(active) : null;
    return {
      activeGhosts: document.querySelectorAll(".cell-ghost.is-active").length,
      focusVisibleCells: focusVis,
      peerWashes: document.querySelectorAll(".cell-peer").length,
      ghostStroke: cs ? `${cs.stroke} w=${cs.strokeWidth} o=${cs.strokeOpacity}` : null,
    };
  });

  // Fill meter after one digit.
  await page.keyboard.press("5").catch(() => {});
  await page.waitForTimeout(700);
  const meter = await page.evaluate(() => {
    const t = document.querySelector("path.progress-trace") as SVGPathElement | null;
    const svg = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement | null;
    const bar = document.querySelector('[role="progressbar"]');
    if (!svg) return null;
    const scale = svg.getBoundingClientRect().width / (svg.viewBox.baseVal.width || 1);
    const cs = t ? getComputedStyle(t) : null;
    const r2 = (v: number) => Math.round(v * 100) / 100;
    const sr = svg.getBoundingClientRect();
    const b = t?.getBBox();
    const w = cs ? parseFloat(cs.strokeWidth) : 0;
    return {
      mounted: !!t,
      scale: r2(scale),
      strokeWidthUser: w || null,
      strokeWidthPx: t ? r2(w * scale) : null,
      stroke: cs?.stroke ?? null,
      now: bar?.getAttribute("aria-valuenow") ?? null,
      valuetext: bar?.getAttribute("aria-valuetext") ?? null,
      svgBoxPx: [r2(sr.x), r2(sr.y), r2(sr.width), r2(sr.height)],
      topInkPx: b ? [r2(sr.y + (b.y - w / 2) * scale), r2(sr.y + (b.y + w / 2) * scale)] : null,
    };
  });

  // The hint note on the phone.
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  const note = await page.evaluate(() => {
    const n = document.querySelector(".margin-note");
    if (!n) return null;
    const r = n.getBoundingClientRect();
    const cs = getComputedStyle(n);
    return {
      text: (n.textContent || "").replace(/\s+/g, " ").trim(),
      fontSize: cs.fontSize,
      opacity: cs.opacity,
      boxPx: [Math.round(r.width), Math.round(r.height)],
      inViewport: r.top >= 0 && r.bottom <= window.innerHeight,
      topPx: Math.round(r.top),
    };
  });

  const report = { engine: browserName, afterTap, meter, note };
  writeFileSync(join(OUT, `phone-${browserName}.json`), JSON.stringify(report, null, 2));
  console.log("PHONE " + JSON.stringify(report));
  expect(meter).not.toBeNull();
});
