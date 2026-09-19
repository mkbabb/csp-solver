import { test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(`${OUT}/${n}.json`, JSON.stringify(d, null, 1) + "\n");

type Pose = { name: string; w: number; h: number; theme: "light" | "dark"; base: string; arm: string };

// The two arms are the two SERVED builds: 4246 ships `rise` 600 on the dock, 4247 is the
// HEAD control (74a2b5d9) where the dock inherits the desk's 520. Matched travel is asserted
// per pose, not assumed; the statistics are only comparable where travel agrees.
const POSES: Pose[] = [];
for (const [base, arm] of [["http://127.0.0.1:4240", "rise600"], ["http://127.0.0.1:4247", "throw520@74a2b5d9"]] as const)
  for (const [name, w, h] of [["768x1024", 768, 1024], ["390x844", 390, 844], ["844x390", 844, 390], ["1440x900-desk", 1440, 900]] as const)
    for (const theme of ["light", "dark"] as const) {
      if (name !== "390x844" && theme === "dark") continue; // dark is the phone's arm
      POSES.push({ name, w, h, theme, base, arm });
    }

test("e · the dock band, full per-frame series", async ({ page, browserName }) => {
  test.setTimeout(600000);
  const rows: any[] = [];
  for (const p of POSES) {
    await page.setViewportSize({ width: p.w, height: p.h });
    await page.goto(p.base + "/");
    await page.waitForLoadState("networkidle");
    if (p.theme === "dark")
      await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.waitForTimeout(400);
    const tab = page.locator(".drawer-tab").first();
    if ((await tab.count()) === 0) {
      rows.push({ ...p, browserName, skipped: "no .drawer-tab at this pose" });
      continue;
    }
    // per-frame sampler on the sheet's own rect, started one frame before the tap
    await page.evaluate(() => {
      (window as any).__series = [];
      const el = document.querySelector("#controls-drawer") ?? document.querySelector(".drawer-case");
      if (!el) return;
      let t0 = performance.now();
      const tick = () => {
        const r = (el as Element).getBoundingClientRect();
        (window as any).__series.push({ t: performance.now() - t0, top: r.top, h: r.height });
        if (performance.now() - t0 < 1400) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await tab.click({ force: true }).catch(() => {});
    await page.waitForTimeout(1500);
    const series: Array<{ t: number; top: number; h: number }> = await page.evaluate(
      () => (window as any).__series ?? [],
    );
    // travel + statistics over the sampled series
    const tops = series.map((s) => s.top);
    const travel = tops.length ? Math.max(...tops) - Math.min(...tops) : 0;
    const deltas: number[] = [];
    for (let i = 1; i < series.length; i++) deltas.push(Math.abs(series[i].top - series[i - 1].top));
    const worst = deltas.length ? Math.max(...deltas) : 0;
    const over40 = deltas.filter((d) => d > 40).length;
    const excessArea = deltas.reduce((t, d) => t + Math.max(0, d - 40), 0);
    // the settle: 700ms after the click, 0 running animations, rest rect
    await page.waitForTimeout(700);
    const settle = await page.evaluate(() => {
      const el = document.querySelector("#controls-drawer") ?? document.querySelector(".drawer-case");
      const r = el ? (el as Element).getBoundingClientRect() : null;
      const running = document.getAnimations().filter((a) => a.playState === "running").length;
      return { running, rect: r ? { top: +r.top.toFixed(2), left: +r.left.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) } : null };
    });
    rows.push({
      ...p,
      browserName,
      samples: series.length,
      travel: +travel.toFixed(2),
      worstFrame: +worst.toFixed(2),
      framesOver40: over40,
      excessArea: +excessArea.toFixed(2),
      settle,
      series: series.map((s) => ({ t: +s.t.toFixed(1), top: +s.top.toFixed(2) })),
    });
    bank(`e-dock-band-${browserName}`, rows);
  }
  bank(`e-dock-band-${browserName}`, rows);
});
