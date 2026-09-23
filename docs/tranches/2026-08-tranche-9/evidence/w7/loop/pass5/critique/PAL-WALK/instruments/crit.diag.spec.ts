// PAL-WALK pass-5 CRITIC instrument (scratch; banked under pass5/critique/PAL-WALK/instruments).
// (1) B-TAPE on ONE session, one variable: the name on the painted tape with the shipped paper (b)
//     and the pass-4 translucent paper (a, restored by an inline background), light + dark, 4 cells.
// (2) THE PRICE the cure does not state: how much of the GIVEN under the tape stays visible through
//     the paper, (a) vs (b) vs no tape — glyph pixels changed by hiding the given, inside the tape's rect.
// (3) HEAD 74a2b5d9 (control dev) on the same payload, same cells: its name + its occlusion.
import { test, expect, type Page } from "@playwright/test";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const PROTO = process.env.CRIT_PROTO || "http://127.0.0.1:4232";
const HEAD = process.env.CRIT_HEAD || "http://127.0.0.1:4233";
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function theme(page: Page, t: "light" | "dark") {
  await page.evaluate((x) => document.documentElement.classList.toggle("dark", x === "dark"), t);
  await page.waitForTimeout(900); // sleep-ok: scratch instrument, the theme's re-bake settles
}
async function rawOf(
  page: Page,
  png: { toString: (enc: string) => string },
): Promise<{ data: number[]; w: number; h: number }> {
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height);
    return { data: Array.from(d.data), w: c.width, h: c.height };
  }, png.toString("base64"));
}

async function paintedName(
  page: Page,
  label: ReturnType<Page["locator"]>,
): Promise<{
  spec: string;
  textPx: number;
  worst: number;
  under45: number;
  coreWorst: number;
  corePx: number;
  noise: number;
  sensitivity: string;
  ground: [number, number];
}> {
  // THE TEXT'S OWN BOX, not the label's: the label's box also holds the board beyond the paper's
  // torn ends, where the grid's boil cycles its variants between photographs and a repainted grid
  // pixel reads as "text over a dark ground". A Range over the name bounds exactly the glyphs.
  const box = await label.evaluate((l) => {
    const r = document.createRange();
    r.selectNodeContents(l);
    const b = r.getBoundingClientRect();
    return { x: b.x, y: b.y, width: b.width, height: b.height };
  });
  const clip = { x: box.x - 1, y: box.y - 1, width: box.width + 2, height: box.height + 2 };
  const ink = await rawOf(page, await page.screenshot({ clip }));
  const spec = await label.evaluate((l) => getComputedStyle(l).color);
  await label.evaluate((l) => ((l as HTMLElement).style.color = "transparent"));
  await expect.poll(() => label.evaluate((l) => getComputedStyle(l).color)).toBe("rgba(0, 0, 0, 0)");
  const bare = await rawOf(page, await page.screenshot({ clip }));
  await label.evaluate((l) => ((l as HTMLElement).style.color = ""));
  await expect.poll(() => label.evaluate((l) => getComputedStyle(l).color)).toBe(spec);
  // THE NOISE CONTROL: the name photographed a second time, so a pixel the grid's boil repainted
  // between the photographs (outside the paper's torn edge, inside the label's box) is named and
  // dropped rather than read as text over a dark ground.
  const again = await rawOf(page, await page.screenshot({ clip }));
  const specRgb = await page.evaluate((css) => {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.fillStyle = css;
    g.fillRect(0, 0, 1, 1);
    return Array.from(g.getImageData(0, 0, 1, 1).data.slice(0, 3));
  }, spec);
  const lin = (v: number): number => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const lum = (d: number[], k: number): number =>
    0.2126 * lin(d[k] / 255) + 0.7152 * lin(d[k + 1] / 255) + 0.0722 * lin(d[k + 2] / 255);
  const ratio = (x: number, y: number): number => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  const specL = lum(specRgb, 0);
  const moved: number[] = [];
  let top = 0;
  let noise = 0;
  for (let k = 0; k < ink.data.length; k += 4) {
    const n =
      Math.abs(ink.data[k] - again.data[k]) +
      Math.abs(ink.data[k + 1] - again.data[k + 1]) +
      Math.abs(ink.data[k + 2] - again.data[k + 2]);
    if (n > 8) {
      noise++;
      moved.push(0);
      continue;
    }
    const d =
      Math.abs(ink.data[k] - bare.data[k]) +
      Math.abs(ink.data[k + 1] - bare.data[k + 1]) +
      Math.abs(ink.data[k + 2] - bare.data[k + 2]);
    moved.push(d);
    if (d > top) top = d;
  }
  const text: number[] = [];
  const core: number[] = [];
  const painted: { d: number; r: number }[] = [];
  let lo = 1;
  let hi = 0;
  moved.forEach((d, n) => {
    if (d <= 0.2 * top) return;
    const gl = lum(bare.data, n * 4);
    lo = Math.min(lo, gl);
    hi = Math.max(hi, gl);
    text.push(ratio(specL, gl));
    const pr = ratio(lum(ink.data, n * 4), gl);
    painted.push({ d, r: pr });
    if (d >= 0.8 * top) core.push(pr);
  });
  return {
    spec,
    textPx: text.length,
    worst: Math.min(...text),
    under45: text.filter((r) => r < 4.5).length,
    coreWorst: Math.min(...core),
    corePx: core.length,
    noise,
    // THE SENSITIVITY ROW (LAWS §Gates): the painted glyph pixel against its own ground, at
    // 50/70/90/100 % of the most-changed pixel — the median and the share under 4.5 at each.
    // An antialiased glyph never reaches its spec colour at its edge, so the painted columns
    // are printed; the spec colour against the ground actually painted is what is asserted.
    sensitivity: [0.5, 0.7, 0.9, 1.0]
      .map((f) => {
        const r = painted
          .filter((q) => q.d >= f * top)
          .map((q) => q.r)
          .sort((u, v) => u - v);
        return `${f * 100}%: median ${r[r.length >> 1]?.toFixed(3)} · ${r.filter((v) => v < 4.5).length}/${r.length} under 4.5`;
      })
      .join(" | "),
    ground: [lo, hi],
  };
}



test("DIAG top-row flip pixel", async ({ context }, info) => {
  test.slow();
  const a = await context.newPage();
  await a.goto(`${PROTO}/?board=${BOARD}&wire=local`);
  await settled(a);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await context.newPage();
  await b.goto(a.url());
  await settled(b);
  const inputs = (p: Page) => p.locator(".sudoku-cell input");
  for (const x of [11, 8]) { await inputs(b).nth(x).click(); await inputs(b).nth(x).fill("7"); await expect.poll(() => inputs(a).nth(x).inputValue()).toBe("7"); }
  await inputs(b).nth(GIVENS.indexOf("3")).click({ force: true });
  await a.waitForTimeout(2500); // sleep-ok
  const label = a.locator(".attribution-tape .washi-label");
  for (const th of ["light", "dark"] as const) {
    await theme(a, th);
    for (let rep = 0; rep < 3; rep++) for (const x of [8, 11]) {
      await expect(async () => { await a.mouse.move(2, 2); await a.locator(".game-cell").nth(x).hover(); await expect(label).toBeVisible({ timeout: 3000 }); }).toPass({ timeout: 30000 });
      await a.waitForTimeout(300); // sleep-ok
      const box = await label.evaluate((l) => { const r = document.createRange(); r.selectNodeContents(l); const b = r.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height }; });
      const lb = (await label.boundingBox())!;
      const clip = { x: box.x - 1, y: box.y - 1, width: box.width + 2, height: box.height + 2 };
      const ink = await rawOf(a, await a.screenshot({ clip }));
      const spec = await label.evaluate((l) => getComputedStyle(l).color);
      await label.evaluate((l) => ((l as HTMLElement).style.color = "transparent"));
      await expect.poll(() => label.evaluate((l) => getComputedStyle(l).color)).toBe("rgba(0, 0, 0, 0)");
      const bare = await rawOf(a, await a.screenshot({ clip }));
      await label.evaluate((l) => ((l as HTMLElement).style.color = ""));
      const again = await rawOf(a, await a.screenshot({ clip }));
      const lum = (d: number[], k: number) => { const f = (v: number) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4); return 0.2126 * f(d[k]) + 0.7152 * f(d[k + 1]) + 0.0722 * f(d[k + 2]); };
      let top = 0; const mv: number[] = [];
      for (let k = 0; k < ink.data.length; k += 4) { const n = Math.abs(ink.data[k] - again.data[k]) + Math.abs(ink.data[k + 1] - again.data[k + 1]) + Math.abs(ink.data[k + 2] - again.data[k + 2]); const d = n > 8 ? 0 : Math.abs(ink.data[k] - bare.data[k]) + Math.abs(ink.data[k + 1] - bare.data[k + 1]) + Math.abs(ink.data[k + 2] - bare.data[k + 2]); mv.push(d); if (d > top) top = d; }
      const gl = mv.map((_, n) => lum(bare.data, n * 4));
      const med = [...gl].sort((u, v) => u - v)[gl.length >> 1];
      const odd: string[] = [];
      mv.forEach((d, n) => { if (d <= 0.2 * top) return; if (Math.abs(gl[n] - med) > 0.02) { const px = n % ink.w, py = Math.floor(n / ink.w); odd.push(`(${px},${py})/${ink.w}x${ink.h} ground rgb(${bare.data.slice(n * 4, n * 4 + 3).join(",")}) ink rgb(${ink.data.slice(n * 4, n * 4 + 3).join(",")}) d=${d}/${top}`); } });
      console.log(`[${info.project.name}] ${th} rep${rep} cell ${x} spec ${spec} textbox ${JSON.stringify(box)} label ${JSON.stringify(lb)} odd-ground text px ${odd.length}: ${odd.slice(0, 4).join(" ; ")}`);
      await a.mouse.move(2, 2); await expect(label).toHaveCount(0);
    }
  }
});
