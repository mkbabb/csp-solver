/** T9-W7 pass 6 · MRK-ABS — the board ring's three arms + HEAD, cell 0 (frame) and cell 1 (paper)
 *  of one 16×16 codec payload, both themes, DPR 1 and 2, both engines. Two methods, both printed:
 *  (L) the LEDGER method (blur vs focus, 3×3 max change) on all four sides, 60 stations each, an
 *  unpainted station (d < 8) counted UNDER; (H) ghost-hidden differencing (FACE's), 60 stations
 *  along the path, a normal scan at each, the sensitivity row at 50/70/90/100 % of the median
 *  per-station peak with a DROPPED station counted UNDER and n/60 printed. */
import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { mint, setTheme, grab, ratio, dist, r3, q, settled, inject, frames2, type RGB } from "./p6-lib";
const ARMS: Record<string, string> = { A: "http://127.0.0.1:4239", B: "http://127.0.0.1:4241", C: "http://127.0.0.1:4242", HEAD: "http://127.0.0.1:4240", I90: "http://127.0.0.1:4246" };
const PICK = (process.env.ARMS ?? "A,B,C,HEAD").split(",");
const REPS = +(process.env.REPS ?? 1);
const DPRS = (process.env.DPRS ?? "1,2").split(",").map(Number);
const OUT = process.env.OUT!;
test("ring arms", async ({ browser }, info) => {
  test.setTimeout(1800000);
  const engine = info.project.name;
  const payload = mint(4);
  const res: unknown[] = [];
  for (const dpr of DPRS)
    for (const arm of PICK)
      for (let rep = 0; rep < REPS; rep++) {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr });
        const page = await ctx.newPage();
        await page.goto(`${ARMS[arm]}/?size=4&board=${payload}`);
        await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
        const js = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
        for (const theme of ["light", "dark"] as const) {
          await setTheme(page, theme);
          for (const [on, idx] of [["frame", 0], ["paper", 1]] as const) {
            const geom = () => page.evaluate((i) => {
              const cell = document.querySelectorAll(".board-shell .game-cell")[i] as HTMLElement;
              const p = cell.querySelector(".cell-ghost-path") as SVGPathElement; const m = p.getScreenCTM()!;
              const T = (x: number, y: number) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];
              const pts = [...p.getAttribute("d")!.matchAll(/[ML]\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)].map((g) => T(+g[1], +g[2]));
              const L = p.getTotalLength(); const bb = p.getBBox(); const [cx, cy] = T(bb.x + bb.width / 2, bb.y + bb.height / 2);
              const st: number[][] = [];
              for (let k = 0; k < 60; k++) { const t = ((k + 0.5) / 60) * L; const a = p.getPointAtLength(Math.max(0, t - 0.5)), b = p.getPointAtLength(Math.min(L, t + 0.5)), c = p.getPointAtLength(t);
                const [x, y] = T(c.x, c.y), [ax, ay] = T(a.x, a.y), [bx, by] = T(b.x, b.y); let nx = -(by - ay), ny = bx - ax; const n = Math.hypot(nx, ny) || 1; nx /= n; ny /= n;
                if ((cx - x) * nx + (cy - y) * ny < 0) { nx = -nx; ny = -ny; } st.push([x, y, nx, ny]); }
              const r = cell.getBoundingClientRect(); const cs = getComputedStyle(p);
              return { pts, st, strokePx: parseFloat(cs.strokeWidth) * Math.hypot(m.a, m.b), so: cs.strokeOpacity, stroke: cs.stroke, box: { x: r.x, y: r.y, w: r.width, h: r.height } };
            }, idx);
            const g0 = await geom();
            const clip = { x: Math.max(0, Math.floor(g0.box.x - 20)), y: Math.max(0, Math.floor(g0.box.y - 20)), width: Math.ceil(g0.box.w + 40), height: Math.ceil(g0.box.h + 40) };
            await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.()); await settled(page);
            const blurred = await grab(page, clip, dpr);
            await page.locator(".board-shell .game-cell .cell-native-input").nth(idx).focus(); await page.keyboard.press("Shift");
            await expect.poll(() => page.evaluate(() => document.querySelectorAll(".game-cell:has(input:focus-visible)").length)).toBe(1);
            await settled(page);
            const g = await geom(); const onP = await grab(page, clip, dpr);
            await inject(page, ".cell-ghost-path{visibility:hidden!important}", "p6-hide"); await frames2(page);
            const hidden = await grab(page, clip, dpr); await inject(page, "", "p6-hide");
            const on2 = await grab(page, clip, dpr); // the SECOND bare photograph (LAWS P5)
            await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
            // (L) the ledger method, four sides
            const nv = g.pts.length % 4 === 1 ? g.pts.length - 1 : g.pts.length; const qv = nv / 4;
            const sides: Record<string, { n: number; worst: number | null; median: number | null; under: number }> = {};
            const names = ["top", "right", "bottom", "left"]; let wholeUnder = 0, wholeUnp = 0; const allL: number[] = [];
            for (let s = 0; s < 4; s++) {
              const side = g.pts.slice(s * qv, (s + 1) * qv).concat([g.pts[((s + 1) * qv) % nv]]); const took: number[] = []; let un = 0;
              for (let i = 0; i < 60; i++) {
                const t = ((i + 0.5) / 60) * (side.length - 1); const k = Math.min(side.length - 2, Math.floor(t)), f = t - k;
                const x = side[k][0] + f * (side[k + 1][0] - side[k][0]), y = side[k][1] + f * (side[k + 1][1] - side[k][1]);
                let best: { d: number; r: number } | null = null;
                for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) { const a = onP(x + dx, y + dy), b = blurred(x + dx, y + dy); if (!a || !b) continue; const d = dist(a, b); if (!best || d > best.d) best = { d, r: ratio(a, b) }; }
                if (best && best.d >= 8) took.push(best.r); else un++;
              }
              sides[names[s]] = { n: took.length, worst: took.length ? r3(Math.min(...took)) : null, median: took.length ? r3(q(took, 0.5)) : null, under: took.filter((v) => v < 3).length + un };
              wholeUnder += took.filter((v) => v < 3).length + un; wholeUnp += un; allL.push(...took, ...Array(un).fill(1));
            }
            // (H) ghost-hidden, normal scan, sensitivity with dropped counted, both photographs
            const H = (onG: typeof onP) => {
              const R = Math.max(5, g.strokePx * 1.5); const scans: { d: number; r: number }[][] = [];
              for (const [sx, sy, nx, ny] of g.st) { const scan: { d: number; r: number }[] = []; for (let t = -R; t <= R; t += 0.5) { const x = sx + nx * t, y = sy + ny * t; const a = onG(x, y), b = hidden(x, y); if (!a || !b) continue; scan.push({ d: dist(a, b), r: ratio(a, b) }); } scans.push(scan); }
              const peak = scans.map((s) => Math.max(0, ...s.map((p) => p.d))); const M = q(peak, 0.5);
              const core = scans.map((s) => { const b = s.reduce((a, p) => (!a || p.d > a.d ? p : a), null as null | { d: number; r: number }); return b && b.d >= 8 ? b.r : null; });
              const painted = core.filter((v): v is number => v !== null);
              return {
                core: { n: painted.length, median: painted.length ? r3(q(painted, 0.5)) : null, worst: painted.length ? r3(Math.min(...painted)) : null, underInclDropped: core.filter((v) => v === null || v < 3).length },
                sensitivity: [0.5, 0.7, 0.9, 1.0].map((f) => { const per = scans.map((s) => { const c = s.filter((p) => p.d >= f * M * 0.999); return c.length ? Math.min(...c.map((p) => p.r)) : null; });
                  const got = per.filter((v): v is number => v !== null);
                  return { at: f, n: got.length, worst: got.length ? r3(Math.min(...got)) : null, underInclDropped: per.filter((v) => v === null || v < 3).length }; }),
              };
            };
            const row = { engine, dpr, arm, rep, js, theme, on, stroke: g.stroke, so: g.so, L: { sides, whole: { under: wholeUnder, unpainted: wholeUnp, of: 240, median: r3(q(allL, 0.5)) } }, H1: H(onP), H2: H(on2) };
            res.push(row);
            console.log(`[${engine} dpr${dpr} ${arm}#${rep} ${js} ${theme} ${on}] stroke ${g.stroke}@${g.so} · L left worst ${sides.left.worst} · L whole under ${wholeUnder}/240 (unpainted ${wholeUnp}) median ${row.L.whole.median} · sides ${names.map((n) => `${n} ${sides[n].worst}/${sides[n].under}u/${sides[n].n}n`).join(" ")} · H core med ${row.H1.core.median} worst ${row.H1.core.worst} under ${row.H1.core.underInclDropped}/60 (2nd photo worst ${row.H2.core.worst}) · sens ${row.H1.sensitivity.map((s) => `${s.at * 100}% ${s.worst} ${s.underInclDropped}/60 n${s.n}`).join(" | ")}`);
          }
        }
        await ctx.close();
      }
  writeFileSync(`${OUT}/ring-${process.env.TAG ?? "x"}-${engine}.json`, JSON.stringify(res));
});
