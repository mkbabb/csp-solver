/** T9-W7 pass 6 · MRK-ABS — σ READ IN THE DOM once (charter row 6). For each board, every resident
 *  ring `d` and its screen CTM: W4 (each edge, the middle 80 % of its own arc, 33 samples, residual
 *  to that edge's NOMINAL line, pooled) in path units and in drawn px; the ring's max excursion; the
 *  cell pitch. Lane (inset 0.86) and 74a2b5d9 (inset 1) at 1280×800. */
import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { mint, r3 } from "./p6-lib";
const ARMS: Record<string, { url: string; inset: number }> = { A: { url: "http://127.0.0.1:4239", inset: 0.86 }, HEAD: { url: "http://127.0.0.1:4240", inset: 1 } };
test("sigma in the DOM", async ({ page }, info) => {
  test.setTimeout(600000);
  const out: unknown[] = [];
  for (const [arm, a] of Object.entries(ARMS))
    for (const sub of [2, 3, 4]) {
      const N = sub * sub;
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`${a.url}/?size=${sub}&board=${mint(sub)}`);
      await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(N * N);
      const cells = await page.evaluate(() => [...document.querySelectorAll(".board-shell .game-cell")].map((c) => { const p = c.querySelector(".cell-ghost-path") as SVGPathElement; const m = p.getScreenCTM()!; return { d: p.getAttribute("d")!, s: m.a, w: c.getBoundingClientRect().width }; }));
      const cs = 1000 / N, pad = ((1 - a.inset) / 2) * cs, size = a.inset * cs;
      let ss = 0, n = 0, exc = 0;
      cells.forEach((c, pos) => {
        const pts = [...c.d.matchAll(/[ML]\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)].map((g) => [+g[1], +g[2]]);
        const nv = pts.length % 4 === 1 ? pts.length - 1 : pts.length; const q = nv / 4;
        const x = (pos % N) * cs + pad, y = Math.floor(pos / N) * cs + pad;
        const nominal = [["h", y], ["v", x + size], ["h", y + size], ["v", x]] as const;
        for (let s = 0; s < 4; s++) {
          const e = pts.slice(s * q, (s + 1) * q).concat([pts[((s + 1) * q) % nv]]);
          const cum = [0]; for (let i = 1; i < e.length; i++) cum.push(cum[i - 1] + Math.hypot(e[i][0] - e[i - 1][0], e[i][1] - e[i - 1][1]));
          const T = cum[cum.length - 1];
          for (let k = 0; k <= 32; k++) { const l = T * (0.1 + 0.8 * (k / 32)); let i = 1; while (i < cum.length - 1 && cum[i] < l) i++; const f = (l - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
            const px = e[i - 1][0] + f * (e[i][0] - e[i - 1][0]), py = e[i - 1][1] + f * (e[i][1] - e[i - 1][1]);
            const dd = (nominal[s][0] === "h" ? py : px) - nominal[s][1]; ss += dd * dd; n++; }
          for (const p of e) exc = Math.max(exc, Math.abs((nominal[s][0] === "h" ? p[1] : p[0]) - nominal[s][1]));
        }
      });
      const sigmaU = Math.sqrt(ss / n), scale = cells[0].s, pitch = cells[0].w / cs;
      const row = { engine: info.project.name, arm, board: `${N}×${N}`, cells: cells.length, sigmaUnits: r3(sigmaU), drawnPxPerUnit: r3(scale), sigmaDrawnPx: r3(sigmaU * scale), cellPitchPxPerUnit: r3(pitch), sigmaAtPitchPx: r3(sigmaU * pitch), maxExcursionUnits: r3(exc), drawnEdgePx: r3(size * scale), sigmaOverEdgePct: r3((100 * sigmaU) / size) };
      out.push(row); console.log(JSON.stringify(row));
    }
  writeFileSync(`${process.env.OUT}/sigma-${info.project.name}.json`, JSON.stringify(out));
});
