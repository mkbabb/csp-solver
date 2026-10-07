// PAL-WALK pass-8 scratch (moved out before return): T9-B-PW7-1's price on paint, through the ONE
// probe. B pinned p-0000000b0b0b writes cell 8 (top row) and cell 11 (given above); A pinned
// p-0000000a0a0a reads B's name on the tape, light theme; arms = the name at L 0.295 (shipped),
// 0.25, 0.22, 0.18 at the shipped chroma and hue, and HEAD's same-index ink. One payload.
import { test, expect, type Page } from "@playwright/test";
// @ts-expect-error — .mjs product home
import { glyphPopulation, fmt } from "../e2e/lib/glyph-pop.mjs";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const TAPE = ".attribution-tape .washi-label";
async function settled(p: Page) {
  await p.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 }).toBeGreaterThan(0);
}
test("T9-B-PW7-1 sweep", async ({ browser }, info) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.emulateMedia({ reducedMotion: "reduce" });
  await a.addInitScript((id) => {
    const get = Storage.prototype.getItem;
    Storage.prototype.getItem = function (k: string) {
      const room = new URL(location.href).searchParams.get("s");
      if (this === sessionStorage && k === "session-identity-v1" && room)
        return JSON.stringify({ ...JSON.parse(get.call(this, k) || "{}"), [room]: id });
      return get.call(this, k);
    };
  }, "p-0000000a0a0a");
  await a.goto(`./?board=${BOARD}&wire=local`);
  await settled(a);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const room = new URL(a.url()).searchParams.get("s")!;
  const b = await ctx.newPage();
  await b.emulateMedia({ reducedMotion: "reduce" });
  await b.addInitScript(([r, id]) => sessionStorage.setItem("session-identity-v1", JSON.stringify({ [r]: id })), [room, "p-0000000b0b0b"] as const);
  await b.goto(a.url());
  await settled(b);
  await b.bringToFront();
  for (const x of [8, 11]) {
    await b.locator(".sudoku-cell input").nth(x).click();
    await b.locator(".sudoku-cell input").nth(x).fill("7");
    await expect.poll(() => a.locator(".sudoku-cell input").nth(x).inputValue()).toBe("7");
  }
  await b.locator(".sudoku-cell input").nth(GIVENS.indexOf("3")).click({ force: true });
  await a.bringToFront();
  await a.locator(".sudoku-cell input").nth(GIVENS.indexOf("9")).click({ force: true });
  await a.waitForTimeout(2500); // sleep-ok: the boil parks
  const label = a.locator(TAPE);
  for (const x of [8, 11]) {
    await expect(async () => {
      await a.mouse.move(2, 2);
      await a.locator(".game-cell").nth(x).hover();
      await expect(label).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 30000 });
    const shipped = await label.evaluate((l) => getComputedStyle(l).color);
    const m = /oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/.exec(shipped)!;
    const arms: [string, string | null][] = [
      ["shipped", null],
      ["L0.25", `oklch(0.25 ${m[2]} ${m[3]})`],
      ["L0.22", `oklch(0.22 ${m[2]} ${m[3]})`],
      ["L0.18", `oklch(0.18 ${m[2]} ${m[3]})`],
      ["HEAD", "oklch(0.5 0.11 137.5deg)"],
    ];
    for (const [n, c] of arms) {
      const tag = c ? await a.addStyleTag({ content: `${TAPE} { color: ${c} !important; }` }) : null;
      await a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const r = await glyphPopulation(a, { subject: TAPE });
      console.log(`[${info.project.name}/light/dpr${await a.evaluate(() => devicePixelRatio)}] cell ${x} ${n} ${c ?? shipped} · ${fmt(r)}`);
      if (tag) await tag.evaluate((e) => (e as Element).remove());
    }
    await a.mouse.move(2, 2);
  }
  await ctx.close();
});
