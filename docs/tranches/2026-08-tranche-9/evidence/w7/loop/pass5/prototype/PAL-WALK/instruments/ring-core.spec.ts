// PRM: live — PAL-WALK pass-5 instrument (scratch; banked under pass5/prototype/PAL-WALK/instruments).
// THE SECTION'S STATISTIC ON EITHER PALETTE'S TREE: one ringed cell (40) on one encoded board, the
// ring's ink bound to each arm in turn, photographed OFF / ON / OFF; the core = pixels moved at
// >= 50 % of the most-moved one (boil noise = pixels that differ between the two OFF shots, dropped),
// each against the median of eight fill samples. max / p30 / median / fraction < 3.0 per arm.
// RING_SRC=walk binds inkFor(i)'s ring string (module import, dev); RING_SRC=tin binds var(--color-peer-k-ring).
import { test, expect, type Page } from "@playwright/test";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const SRC = process.env.RING_SRC || "walk";
const ARMS = (process.env.RING_ARMS || "0,1,2,3,4").split(",").map(Number);
async function raw(page: Page, png: Buffer) {
  return page.evaluate(async (b64) => {
    const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
    const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const g = c.getContext("2d", { willReadFrequently: true })!; g.drawImage(img, 0, 0);
    return { data: Array.from(g.getImageData(0, 0, c.width, c.height).data), w: c.width, h: c.height };
  }, png.toString("base64"));
}
async function seat(page: Page, ink: string | null) {
  await page.evaluate((v) => {
    const w = window as unknown as { __s?: MutationObserver };
    const cell = document.querySelectorAll<HTMLElement>(".game-cell")[40];
    w.__s?.disconnect();
    if (v === null) { cell.classList.remove("is-peer-cursor"); cell.style.removeProperty("--color-peer-cursor-ink"); return; }
    const set = () => { cell.style.setProperty("--color-peer-cursor-ink", v); cell.classList.add("is-peer-cursor"); };
    set();
    const o = new MutationObserver(() => { if (!cell.classList.contains("is-peer-cursor")) set(); });
    o.observe(cell, { attributes: true, attributeFilter: ["class", "style"] }); w.__s = o;
  }, ink);
  await expect.poll(() => page.evaluate(() => {
    const p = document.querySelectorAll<HTMLElement>(".game-cell")[40]?.querySelector(".cell-ghost-path");
    return !p || p.getAnimations().every((a) => a.playState !== "running");
  })).toBe(true);
}
test("ring core distribution per arm", async ({ page }, info) => {
  test.slow();
  await page.goto(`./?board=${BOARD}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  const givens = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
  console.log(`[${info.project.name}] board decoded ${givens === GIVENS}`);
  expect(givens).toBe(GIVENS);
  await page.waitForTimeout(2500); // sleep-ok: the boil parks
  const dpr = await page.evaluate(() => devicePixelRatio);
  for (const arm of ["light", "dark"] as const) {
    await page.evaluate((t) => { document.documentElement.classList.toggle("dark", t === "dark"); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, arm);
    await page.waitForTimeout(600); // sleep-ok: theme transition
    for (const k of ARMS) {
      const ink = SRC === "tin" ? `var(--color-peer-${k + 1}-ring)` : await page.evaluate(async (i) => {
        const m = (await import(/* @vite-ignore */ "/src/games/shared/playerIdentity.ts")) as { inkFor: (n: number) => Record<string, string> };
        return m.inkFor(i)["--color-peer-cursor-ink"];
      }, k);
      const box = (await page.locator(".game-cell").nth(40).boundingBox())!;
      const clip = { x: Math.floor(box.x - 6), y: Math.floor(box.y - 6), width: Math.ceil(box.width + 12), height: Math.ceil(box.height + 12) };
      await seat(page, null); const A = await raw(page, await page.screenshot({ clip }));
      await seat(page, ink); const B = await raw(page, await page.screenshot({ clip }));
      const resolved = await page.evaluate(() => getComputedStyle(document.querySelectorAll(".game-cell")[40].querySelector(".cell-ghost-path")!).stroke);
      await seat(page, null); const C = await raw(page, await page.screenshot({ clip }));
      const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const lum = (d: number[], i: number) => 0.2126 * lin(d[i] / 255) + 0.7152 * lin(d[i + 1] / 255) + 0.0722 * lin(d[i + 2] / 255);
      const s = B.w / clip.width;
      const fills: number[] = [];
      for (const [fx, fy] of [[0.3, 0.2], [0.7, 0.2], [0.2, 0.3], [0.8, 0.3], [0.2, 0.7], [0.8, 0.7], [0.3, 0.8], [0.7, 0.8]]) {
        const x = Math.round((box.x - clip.x + box.width * fx) * s), y = Math.round((box.y - clip.y + box.height * fy) * s);
        fills.push(lum(B.data, (y * B.w + x) * 4));
      }
      fills.sort((p, q) => p - q);
      const fillL = fills[fills.length >> 1];
      const mv: number[] = []; let top = 0, noise = 0;
      for (let i = 0; i < B.data.length; i += 4) {
        const n = Math.abs(A.data[i] - C.data[i]) + Math.abs(A.data[i + 1] - C.data[i + 1]) + Math.abs(A.data[i + 2] - C.data[i + 2]);
        if (n > 8) { noise++; continue; }
        const d = Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]);
        mv.push(d, i); if (d > top) top = d;
      }
      const row = (frac: number) => {
        const r: number[] = [];
        for (let n = 0; n < mv.length; n += 2) if (mv[n] >= frac * top) { const l = lum(B.data, mv[n + 1]); r.push((Math.max(l, fillL) + 0.05) / (Math.min(l, fillL) + 0.05)); }
        r.sort((p, q) => p - q);
        const q = (f: number) => r[Math.min(r.length - 1, Math.floor(r.length * f))];
        return { n: r.length, max: r[r.length - 1], p30: q(0.3), med: q(0.5), under: r.filter((v) => v < 3).length / r.length };
      };
      const core = row(0.5);
      const sens = [0.5, 0.7, 0.9, 1.0].map((f) => { const x = row(f); return `${f * 100}%: med ${x.med.toFixed(3)} frac<3 ${(x.under * 100).toFixed(1)}% (${x.n})`; }).join(" | ");
      console.log(`RING ${SRC} ${info.project.name} dpr ${dpr} ${arm} arm ${k} ${resolved} · core px ${core.n} max ${core.max.toFixed(3)} p30 ${core.p30.toFixed(3)} median ${core.med.toFixed(3)} frac<3 ${(core.under * 100).toFixed(1)}% · noise ${noise} · sens ${sens}`);
    }
  }
});
