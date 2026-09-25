// PRM: reduce — PAL-WALK pass-7 frame instrument (scratch; banked under pass7/prototype/PAL-WALK/instruments).
// ONE encoded board (?board=, the 74a2b5d9 control's deal); real pages in one `?wire=local` room joined
// through the product's invite verb; every page's peer id PINNED through `session-identity-v1` (B =
// p-0000000b0b0b), so no slug and no arrival order is a variable. `reducedMotion: reduce` parks the boil.
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const CELLS = [11, 12, 14, 16, 21, 22, 23, 24];
const SOLVED: Record<number, string> = { 11: "5", 12: "1", 14: "9", 16: "7", 21: "2", 22: "4", 23: "5", 24: "1" };
const OUT = process.env.FRAME_OUT!;
const MODE = process.env.FRAME_MODE!; // room | tape
const FOCUS = 40; // THE SAME FOCUSED CELL IN EVERY ARM: its row, column and box bands are common to the pair
const idOf = (k: number) => (k === 1 ? "p-0000000b0b0b" : `p-00000000000${k.toString(16)}`);
async function ready(p: Page) {
  await p.waitForSelector("svg.handwritten-logo", { timeout: 90000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 90000 }).toBeGreaterThan(0);
  const g = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
  expect(g, "the encoded board decoded").toBe(GIVENS);
}
async function theme(p: Page, t: string) {
  await p.evaluate((x) => { document.documentElement.classList.toggle("dark", x === "dark"); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, t);
  await p.waitForTimeout(800); // sleep-ok: the theme's own transition settles before a byte is read
}
async function room(context: import("@playwright/test").BrowserContext, n: number): Promise<Page[]> {
  const a = await context.newPage();
  await a.emulateMedia({ reducedMotion: "reduce" });
  await a.goto(`./?board=${BOARD}&wire=local`);
  await ready(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled(); await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const s = new URL(a.url()).searchParams.get("s")!;
  const pages = [a];
  for (let k = 1; k < n; k++) {
    const p = await context.newPage();
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.addInitScript(([room, id]) => sessionStorage.setItem("session-identity-v1", JSON.stringify({ [room]: id })), [s, idOf(k)] as const);
    await p.goto(a.url()); await ready(p); pages.push(p);
  }
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(n, { timeout: 120000 });
  return pages;
}
test("frame", async ({ context }, info) => {
  test.setTimeout(900000);
  const tag = `${process.env.FRAME_TAG}-${info.project.name}`;
  if (MODE === "room") {
    const n = Number(process.env.FRAME_HANDS);
    const pages = await room(context, n);
    const a = pages[0];
    for (let j = 0; j < CELLS.length; j++) {
      const p = pages[j % n]; const pos = CELLS[j];
      await p.locator(".sudoku-cell input").nth(pos).click(); await p.locator(".sudoku-cell input").nth(pos).fill(SOLVED[pos]);
      await expect.poll(() => a.locator(".sudoku-cell input").nth(pos).inputValue(), { timeout: 30000 }).toBe(SOLVED[pos]);
    }
    for (const p of pages.slice(1)) await p.locator(".sudoku-cell input").nth(FOCUS).click({ force: true });
    await a.locator(".sudoku-cell input").nth(FOCUS).click({ force: true });
    // NO FOCUS BAND (charter row 6): the photographing page lets go of its caret, so no row/column/box
    // band paints in either arm; the peers keep theirs at 40 (below the clip).
    if (process.env.FRAME_BLUR) await a.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await a.mouse.move(2, 2);
    await theme(a, process.env.FRAME_THEME || "light");
    await a.waitForTimeout(1500); // sleep-ok: the last write's draw-on finishes before the photograph
    const c0 = (await a.locator(".game-cell").nth(0).boundingBox())!;
    const z = (await a.locator(".game-cell").nth(26).boundingBox())!;
    const clip = { x: Math.floor(c0.x - 8), y: Math.floor(c0.y - 8), width: Math.ceil(z.x + z.width - c0.x + 16), height: Math.ceil(z.y + z.height - c0.y + 16) };
    const inks = await a.evaluate((cells) => cells.map((i) => { const c = document.querySelectorAll<HTMLElement>(".game-cell")[i]; return `${i}:${getComputedStyle(c).getPropertyValue("--color-user-ink").trim() || "house"}`; }), CELLS);
    const focus = await a.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].indexOf(document.activeElement as HTMLInputElement));
    // the tint bands, sampled: one pixel in each third of the clip's top row of cells, read off the cells' own computed background
    const tint = await a.evaluate(() => [0, 4, 8, 13, 22].map((i) => getComputedStyle(document.querySelectorAll<HTMLElement>(".game-cell")[i]).backgroundColor).join(" "));
    writeFileSync(`${OUT}/${tag}.png`, await a.screenshot({ clip }));
    console.log(`FRAME ${tag} room of ${n} · focus ${focus} · tint ${tint} · ${inks.join(" ; ")}`);
    return;
  }
  // tape: B (pinned) writes 12 (a given above it: the tape crosses the grid line); A hovers it at night.
  // The arms are ONE inline `color` on the label, photographed in one page under one hover, card paper:
  // HEAD's own ink for B · the ring's string (pass 6) · the name's string (pass 7, L 0.86).
  const [a, b] = await room(context, 2);
  await b.locator(".sudoku-cell input").nth(12).click(); await b.locator(".sudoku-cell input").nth(12).fill("1");
  await expect.poll(() => a.locator(".sudoku-cell input").nth(12).inputValue()).toBe("1");
  await b.locator(".sudoku-cell input").nth(FOCUS).click({ force: true });
  await theme(a, process.env.FRAME_THEME || "dark");
  await a.waitForTimeout(1500); // sleep-ok: the draw-on finishes
  await a.locator(".game-cell").nth(12).hover();
  const label = a.locator(".attribution-tape .washi-label");
  await expect(label).toBeVisible();
  const cell = (await a.locator(".game-cell").nth(12).boundingBox())!;
  const clip = { x: Math.floor(cell.x - cell.width * 0.9), y: Math.floor(cell.y - cell.height * 0.75), width: Math.ceil(cell.width * 2.8), height: Math.ceil(cell.height * 0.95) };
  const dark = (process.env.FRAME_THEME || "dark") === "dark";
  const arms = [["1-head-ink", dark ? "oklch(0.8 0.11 137.5deg)" : "oklch(0.5 0.11 137.5deg)", ""], ["2-ring-079", "var(--color-peer-cursor-ink)", ""], ["3-name-086", "", ""], ["4-name-again", "", ""], ["5-name-translucent", "", "var(--sheet-washi-neutral)"]] as const;
  const shots: Record<string, Buffer> = {};
  for (const [arm, ink, bg] of arms) {
    await label.evaluate((l, v) => { (l as HTMLElement).style.color = v[0]; (l as HTMLElement).style.background = v[1]; }, [ink, bg]);
    await a.waitForTimeout(300); // sleep-ok: one paint
    shots[arm] = await a.screenshot({ clip });
    writeFileSync(`${OUT}/${tag}-${arm}.png`, shots[arm]);
  }
  await label.evaluate((l) => { (l as HTMLElement).style.color = ""; (l as HTMLElement).style.background = ""; });
  const spec = await label.evaluate((l) => getComputedStyle(l).color);
  const lr = (await label.boundingBox())!;
  const out = await a.evaluate(async ([s1, s2, s3, s4, clip, lr]) => {
    const dec = async (b64: string) => { const im = new Image(); im.src = `data:image/png;base64,${b64}`; await im.decode(); const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext("2d")!; g.drawImage(im, 0, 0); return g.getImageData(0, 0, c.width, c.height); };
    const X = [await dec(s1 as string), await dec(s2 as string), await dec(s3 as string), await dec(s4 as string)];
    const k = X[0].width / (clip as any).width; const res = { h_r_out: 0, r_n_out: 0, n_n_all: 0, h_r_in: 0, r_n_in: 0 };
    for (let py = 0; py < X[0].height; py++) for (let px = 0; px < X[0].width; px++) {
      const cx = (clip as any).x + px / k, cy = (clip as any).y + py / k; const o = (py * X[0].width + px) * 4;
      const d = (u: ImageData, v: ImageData) => Math.abs(u.data[o] - v.data[o]) + Math.abs(u.data[o + 1] - v.data[o + 1]) + Math.abs(u.data[o + 2] - v.data[o + 2]) > 8;
      const inL = cx >= (lr as any).x - 2 && cx <= (lr as any).x + (lr as any).width + 2 && cy >= (lr as any).y - 2 && cy <= (lr as any).y + (lr as any).height + 2;
      if (d(X[2], X[3])) res.n_n_all++;
      if (inL) { if (d(X[0], X[1])) res.h_r_in++; if (d(X[1], X[2])) res.r_n_in++; } else { if (d(X[0], X[1])) res.h_r_out++; if (d(X[1], X[2])) res.r_n_out++; }
    }
    return res;
  }, [...arms.slice(0, 4).map(([arm]) => shots[arm].toString("base64")), clip, lr] as const);
  console.log(`FRAME ${tag} tape "${await label.textContent()}" name ${spec} · px changed HEAD→ring inside ${out.h_r_in} OUTSIDE ${out.h_r_out}; ring→name inside ${out.r_n_in} OUTSIDE ${out.r_n_out}; name vs name-again ${out.n_n_all}`);
});
