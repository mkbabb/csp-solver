import { test, expect, type Page } from "@playwright/test";
// PAL-TIN pass-6 CRITIC. The PRODUCT's own tape binding (no override on the label), room of N,
// B = the last joiner; the same payload and cells as the lane; my own glyph-coverage statistic
// (luminance-keyed, not the lane's RGB projection); a second bare photograph; the tick ON/OFF/OFF/ON
// with a FAINT opacity-0.15 plant as the in-run negative. Runs unchanged on the tree and the control.
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const LOCAL = `./?board=${BOARD}&wire=local`;
const N = Number(process.env.CR_N || 10);
async function boot(page: Page, url: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  if (!new URL(url, "http://x").searchParams.get("s")) {
    const g = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
    expect(g, "payload decoded").toBe(GIVENS);
  }
}
const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const Y = (d: number[], k: number) => 0.2126 * lin(d[k] / 255) + 0.7152 * lin(d[k + 1] / 255) + 0.0722 * lin(d[k + 2] / 255);
const ratio = (x: number, y: number) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
const q = (r: number[], f: number) => r[Math.min(r.length - 1, Math.floor(r.length * f))];
async function raw(page: Page, clip: { x: number; y: number; width: number; height: number }) {
  const png = await page.screenshot({ clip });
  return page.evaluate(async (b64) => {
    const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
    const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const g = c.getContext("2d", { willReadFrequently: true })!; g.drawImage(img, 0, 0);
    return Array.from(g.getImageData(0, 0, c.width, c.height).data);
  }, png.toString("base64"));
}
const frames = (p: Page) => p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
async function name(page: Page, label: ReturnType<Page["locator"]>) {
  const b = await label.evaluate((l) => { const r = document.createRange(); r.selectNodeContents(l.firstChild!); const x = r.getBoundingClientRect(); return { x: x.x, y: x.y, width: x.width, height: x.height }; });
  const clip = { x: b.x - 1, y: b.y - 1, width: b.width + 2, height: b.height + 2 };
  const spec = await label.evaluate((l) => getComputedStyle(l).color);
  const i1 = await raw(page, clip);
  await label.evaluate((l) => ((l as HTMLElement).style.color = "transparent")); await frames(page);
  const b1 = await raw(page, clip); const b2 = await raw(page, clip);
  await label.evaluate((l) => ((l as HTMLElement).style.color = "")); await frames(page);
  const i2 = await raw(page, clip);
  const rgb = await page.evaluate((css) => { const c = document.createElement("canvas"); c.width = c.height = 1; const g = c.getContext("2d")!; g.fillStyle = css; g.fillRect(0, 0, 1, 1); return Array.from(g.getImageData(0, 0, 1, 1).data.slice(0, 3)); }, spec);
  const sY = Y(rgb, 0);
  const dist = (X: number[], Z: number[], k: number) => Math.abs(X[k] - Z[k]) + Math.abs(X[k + 1] - Z[k + 1]) + Math.abs(X[k + 2] - Z[k + 2]);
  let top = 0, noise = 0; const mv: [number, number][] = [];
  for (let k = 0; k < i1.length; k += 4) { if (dist(i1, i2, k) > 8 || dist(b1, b2, k) > 8) { noise++; continue; } const d = dist(i1, b1, k); mv.push([d, k]); top = Math.max(top, d); }
  const text = mv.filter(([d]) => d > 0.2 * top);
  const flat = text.map(([, k]) => ratio(sY, Y(b1, k)));
  const cov = (f: number) => { const r: number[] = []; for (const [, k] of text) { const g = Y(b1, k), p = Y(i1, k); if (Math.abs(sY - g) < 1e-4) continue; if ((p - g) / (sY - g) >= f) r.push(ratio(p, g)); } r.sort((a, c) => a - c); return r; };
  const c50 = cov(0.5), c70 = cov(0.7), c90 = cov(0.9);
  // BYTE coverage (the blend is in sRGB bytes): the mean over channels whose spec-ground gap > 24
  const bcov = (f: number) => { const r: number[] = []; for (const [, k] of text) { let n = 0, t = 0; for (let ch = 0; ch < 3; ch++) { const gap = rgb[ch] - b1[k + ch]; if (Math.abs(gap) > 24) { t += (i1[k + ch] - b1[k + ch]) / gap; n++; } } if (n && t / n >= f) r.push(ratio(Y(i1, k), Y(b1, k))); } r.sort((a, c) => a - c); return r; };
  const b50 = bcov(0.5), b90 = bcov(0.9);
  return `BYTEcov≥.5 med ${q(b50, 0.5)?.toFixed(3)} n${b50.length} ${(100 * b50.filter((v) => v < 4.5).length / b50.length).toFixed(1)}%<4.5 · BYTEcov≥.9 med ${q(b90, 0.5)?.toFixed(3)} n${b90.length} · spec ${spec} · flat worst ${Math.min(...flat).toFixed(3)} (${flat.filter((v) => v < 4.5).length}/${flat.length} <4.5) · glyph(cov≥.5) med ${q(c50, 0.5)?.toFixed(3)} n${c50.length} ${(100 * c50.filter((v) => v < 4.5).length / c50.length).toFixed(1)}%<4.5 · cov≥.7 med ${q(c70, 0.5)?.toFixed(3)} · cov≥.9 med ${q(c90, 0.5)?.toFixed(3)} n${c90.length} · noise ${noise}`;
}
async function tick(page: Page, plant: string | null) {
  const t = page.locator(".attribution-tape .roster-tick");
  if (!(await t.count())) return "no tick";
  if (plant) await t.evaluate((e, p) => ((e as SVGElement).style.opacity = p), plant);
  await frames(page);
  const b = (await t.boundingBox())!;
  const clip = { x: Math.floor(b.x - 2), y: Math.floor(b.y - 2), width: Math.ceil(b.width + 4), height: Math.ceil(b.height + 4) };
  const vis = async (v: string) => { await t.evaluate((e, x) => ((e as SVGElement).style.visibility = x), v); await frames(page); };
  const on = await raw(page, clip); await vis("hidden"); const off = await raw(page, clip); const off2 = await raw(page, clip); await vis(""); const on2 = await raw(page, clip);
  if (plant) await t.evaluate((e) => ((e as SVGElement).style.opacity = ""));
  const dist = (X: number[], Z: number[], k: number) => Math.abs(X[k] - Z[k]) + Math.abs(X[k + 1] - Z[k + 1]) + Math.abs(X[k + 2] - Z[k + 2]);
  let top = 0; const mv: [number, number][] = [];
  for (let k = 0; k < on.length; k += 4) { if (dist(on, on2, k) > 8 || dist(off, off2, k) > 8) continue; const d = dist(on, off, k); mv.push([d, k]); top = Math.max(top, d); }
  const r = mv.filter(([d]) => top > 0 && d >= 0.5 * top).map(([, k]) => ratio(Y(on, k), Y(off, k))).sort((a, c) => a - c);
  const stroke = await t.evaluate((e) => getComputedStyle(e.querySelector("path") ?? e).stroke);
  return `stroke ${stroke} · top ${top} · core n${r.length} med ${q(r, 0.5)?.toFixed(3)} p10 ${q(r, 0.1)?.toFixed(3)} ${(100 * r.filter((v) => v < 3).length / Math.max(1, r.length)).toFixed(1)}%<3`;
}
test("CRIT6 the product's own tape binding, room of N, both themes, three cells", async ({ browser }, info) => {
  test.setTimeout(1_500_000);
  const ctx = await browser.newContext();
  const a = await ctx.newPage(); await boot(a, LOCAL);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled(); await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url(); const pages = [a];
  for (let i = 1; i < N; i++) { const p = await ctx.newPage(); await boot(p, link); pages.push(p); }
  const counts: number[] = [];
  for (const p of pages) { await expect.poll(() => p.locator(".controls-card .players-roster .player-row").count(), { timeout: 90000 }).toBeGreaterThanOrEqual(N - 1); }
  await a.waitForTimeout(3000);
  for (const p of pages) counts.push(await p.locator(".controls-card .players-roster .player-row").count());
  console.log(`ROSTER ${info.project.name} N${N} rows per page ${counts.join(",")}`);
  // B = index 4 (stick 5, pink, the worst arm, lap 0) writes the lane's three cells; C = index 5
  // (stick 1, amber, lap 1) writes a fourth cell with a given above, so the tape carries a tick.
  const b = pages[4], c = pages[5];
  const inputs = (p: Page) => p.locator(".sudoku-cell input");
  const empty = [...GIVENS].flatMap((ch, i) => (ch === "." ? [i] : []));
  const under = empty.filter((i) => i >= 9 && GIVENS[i - 9] !== ".");
  const cells = [...under.slice(0, 2), empty[0]];
  const tcell = under[2];
  for (const [who, x] of [...cells.map((x) => [b, x] as const), [c, tcell] as const]) { await inputs(who).nth(x).click(); await inputs(who).nth(x).fill("7"); await expect.poll(() => inputs(a).nth(x).inputValue()).toBe("7"); }
  await inputs(b).nth(GIVENS.indexOf("3")).click({ force: true });
  await inputs(c).nth(GIVENS.indexOf("3")).click({ force: true });
  const label = a.locator(".attribution-tape .washi-label");
  const dpr = await a.evaluate(() => devicePixelRatio);
  const rows: string[] = [];
  for (const arm of ["dark", "light"] as const) {
    await a.evaluate((m) => document.documentElement.classList.toggle("dark", m === "dark"), arm); await frames(a);
    for (const x of [...cells, tcell]) {
      await expect(async () => { await a.mouse.move(2, 2); await a.locator(".game-cell").nth(x).hover(); await expect(label).toBeVisible({ timeout: 3000 }); }).toPass({ timeout: 30000 });
      const slug = (await label.textContent())?.trim();
      rows.push(`NAME ${info.project.name} dpr${dpr} N${N} ${arm} cell ${x}${x < 9 ? "(top)" : ""}${x === tcell ? "(C lap1)" : "(B)"} ${slug} · ${await name(a, label)}`);
      if (x === tcell) {
        rows.push(`TICK ${info.project.name} dpr${dpr} N${N} ${arm} product · ${await tick(a, null)}`);
        rows.push(`TICK ${info.project.name} dpr${dpr} N${N} ${arm} FAINT0.15 · ${await tick(a, "0.15")}`);
      }
      await a.mouse.move(2, 2); await expect(label).toHaveCount(0);
    }
  }
  for (const r of rows) console.log(r);
  await ctx.close();
});
