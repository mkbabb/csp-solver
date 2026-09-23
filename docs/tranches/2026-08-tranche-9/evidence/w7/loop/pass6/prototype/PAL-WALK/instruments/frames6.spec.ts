// PRM: reduce — PAL-WALK pass-6 frame instrument (scratch; banked under pass6/prototype/PAL-WALK/instruments).
// ONE encoded board (?board=, minted from the 74a2b5d9 control's deal); the SOLVED digits written into the
// same eight empty cells by REAL pages in one room (`?wire=local`, the product's invite verb), so a pair
// differs by the one variable its caption names. `reducedMotion: reduce` parks the boil (MRK-LIVE's
// critic), so a glyph's pose is not a second variable.
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const CELLS = [11, 12, 14, 16, 21, 22, 23, 24];
const SOLVED: Record<number, string> = { 11: "5", 12: "1", 14: "9", 16: "7", 21: "2", 22: "4", 23: "5", 24: "1" };
const OUT = process.env.FRAME_OUT!;
const MODE = process.env.FRAME_MODE!; // room | tape
async function ready(p: Page) {
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 90000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 90000 }).toBeGreaterThan(0);
  const g = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
  expect(g, "the encoded board decoded").toBe(GIVENS);
}
async function band(p: Page) {
  const a = (await p.locator(".game-cell").nth(0).boundingBox())!;
  const z = (await p.locator(".game-cell").nth(26).boundingBox())!;
  return { x: Math.floor(a.x - 8), y: Math.floor(a.y - 8), width: Math.ceil(z.x + z.width - a.x + 16), height: Math.ceil(z.y + z.height - a.y + 16) };
}
async function theme(p: Page, t: string) {
  await p.evaluate((x) => { document.documentElement.classList.toggle("dark", x === "dark"); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, t);
  await p.waitForTimeout(800); // sleep-ok: the theme's own transition settles before a byte is read
}
async function room(context: import("@playwright/test").BrowserContext, n: number): Promise<Page[]> {
  const a = await context.newPage();
  await a.goto(`./?board=${BOARD}&wire=local`);
  await ready(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled(); await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const pages = [a];
  for (let k = 1; k < n; k++) { const p = await context.newPage(); await p.goto(a.url()); await ready(p); pages.push(p); }
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(n, { timeout: 120000 });
  return pages;
}
test("frame", async ({ context }, info) => {
  test.setTimeout(900000);
  const tag = `${process.env.FRAME_TAG}-${info.project.name}`;
  if (MODE === "room") {
    // n real pages; the eight cells are written round-robin (page k writes CELLS[j] for j ≡ k mod n),
    // so the same eight digits stand in both arms of any pair and only the number of hands (or the
    // tree's palette) moves. Page 0 (the starter, "you") is photographed.
    const n = Number(process.env.FRAME_HANDS);
    const pages = await room(context, n);
    const a = pages[0];
    for (let j = 0; j < CELLS.length; j++) {
      const p = pages[j % n]; const pos = CELLS[j];
      await p.locator(".sudoku-cell input").nth(pos).click(); await p.locator(".sudoku-cell input").nth(pos).fill(SOLVED[pos]);
      await expect.poll(() => a.locator(".sudoku-cell input").nth(pos).inputValue(), { timeout: 30000 }).toBe(SOLVED[pos]);
    }
    for (const p of pages.slice(1)) await p.locator(".sudoku-cell input").nth(40).click({ force: true });
    await a.mouse.move(2, 2); await a.locator(".sudoku-cell input").nth(0).blur();
    await theme(a, process.env.FRAME_THEME || "light");
    await a.waitForTimeout(1500); // sleep-ok: the last write's draw-on finishes before the photograph
    const inks = await a.evaluate((cells) => cells.map((i) => { const c = document.querySelectorAll<HTMLElement>(".game-cell")[i]; return `${i}:${getComputedStyle(c).getPropertyValue("--color-user-ink").trim() || "house"}`; }), CELLS);
    writeFileSync(`${OUT}/${tag}.png`, await a.screenshot({ clip: await band(a) }));
    console.log(`FRAME ${tag} room of ${n} · ${inks.join(" ; ")}`);
    return;
  }
  // tape: B writes 12 (a given above it: the tape crosses the grid line), A hovers it at night. The two
  // arms are the ONE inline `background` on the label, photographed in one page under one hover.
  const [a, b] = await room(context, 2);
  await b.locator(".sudoku-cell input").nth(12).click(); await b.locator(".sudoku-cell input").nth(12).fill("1");
  await expect.poll(() => a.locator(".sudoku-cell input").nth(12).inputValue()).toBe("1");
  await b.locator(".sudoku-cell input").nth(40).click({ force: true });
  await theme(a, "dark");
  await a.waitForTimeout(1500); // sleep-ok: the draw-on finishes
  await a.locator(".game-cell").nth(12).hover();
  const label = a.locator(".attribution-tape .washi-label");
  await expect(label).toBeVisible();
  const cell = (await a.locator(".game-cell").nth(12).boundingBox())!;
  const clip = { x: Math.floor(cell.x - cell.width * 0.9), y: Math.floor(cell.y - cell.height * 0.9), width: Math.ceil(cell.width * 2.8), height: Math.ceil(cell.height * 1.5) };
  const shots: Record<string, Buffer> = {};
  for (const [arm, bg] of [["b-card", ""], ["a-translucent", "var(--sheet-washi-neutral)"], ["b-card-again", ""]] as const) {
    await label.evaluate((l, v) => { (l as HTMLElement).style.background = v; }, bg);
    await a.waitForTimeout(300); // sleep-ok: one paint
    shots[arm] = await a.screenshot({ clip });
    writeFileSync(`${OUT}/${tag}-${arm}.png`, shots[arm]);
  }
  // THE ONE-VARIABLE PROOF: pixels changed OUTSIDE the label's rect between the arms (the boil held).
  const lr = (await label.boundingBox())!;
  const outside = await a.evaluate(async ([s1, s2, s3, clip, lr]) => {
    const dec = async (b64: string) => { const im = new Image(); im.src = `data:image/png;base64,${b64}`; await im.decode(); const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext("2d")!; g.drawImage(im, 0, 0); return g.getImageData(0, 0, c.width, c.height); };
    const [x, y, z] = [await dec(s1 as string), await dec(s2 as string), await dec(s3 as string)];
    const k = x.width / (clip as any).width; let armsOut = 0, againOut = 0, inside = 0;
    for (let py = 0; py < x.height; py++) for (let px = 0; px < x.width; px++) {
      const cx = (clip as any).x + px / k, cy = (clip as any).y + py / k; const o = (py * x.width + px) * 4;
      const d1 = Math.abs(x.data[o] - y.data[o]) + Math.abs(x.data[o + 1] - y.data[o + 1]) + Math.abs(x.data[o + 2] - y.data[o + 2]);
      const d3 = Math.abs(x.data[o] - z.data[o]) + Math.abs(x.data[o + 1] - z.data[o + 1]) + Math.abs(x.data[o + 2] - z.data[o + 2]);
      const inL = cx >= (lr as any).x - 2 && cx <= (lr as any).x + (lr as any).width + 2 && cy >= (lr as any).y - 2 && cy <= (lr as any).y + (lr as any).height + 2;
      if (inL) { if (d1 > 8) inside++; } else { if (d1 > 8) armsOut++; if (d3 > 8) againOut++; }
    }
    return { armsOut, againOut, inside };
  }, [shots["b-card"].toString("base64"), shots["a-translucent"].toString("base64"), shots["b-card-again"].toString("base64"), clip, lr] as const);
  console.log(`FRAME ${tag} tape "${await label.textContent()}" · px changed between the arms: inside the label ${outside.inside}, OUTSIDE it ${outside.armsOut}; (b) vs (b) again outside ${outside.againOut}`);
});
