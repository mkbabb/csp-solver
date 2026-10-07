// PAL-WALK pass-8 scratch (moved out before return): the B-TAPE hand-0 pair. ONE payload (A pinned
// p-0000000a0a0a, B pinned p-0000000b0b0b, the encoded board), ONE variable (the day name's chroma:
// shipped NAME_BANDS bisection vs the ring's = pass 6's name), light theme, tape on B's page over A's cell.
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const TAPE = ".attribution-tape .washi-label";
const OUT = process.env.WALK_FRAMES!;
async function settled(p: Page) {
  await p.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 }).toBeGreaterThan(0);
}
test("B-TAPE hand-0 pair", async ({ browser }, info) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.emulateMedia({ reducedMotion: "reduce" });
  await a.addInitScript((id) => {
    // THE HOST'S PER-TAB IDENTITY MAP ANSWERS FOR THE ROOM THE ADDRESS BAR NAMES: the invite
    // writes \`?s=\` synchronously before the page claims its id, so the claim reads this pin
    // for the room it just opened and stays the room's author (its epoch, its hand 0).
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
  await a.bringToFront();
  const empty = [...GIVENS].flatMap((c, i) => (c === "." ? [i] : []));
  const x = empty.filter((i) => i >= 9 && GIVENS[i - 9] !== ".")[3];
  await a.locator(".sudoku-cell input").nth(x).click();
  await a.locator(".sudoku-cell input").nth(x).fill("7");
  await expect.poll(() => b.locator(".sudoku-cell input").nth(x).inputValue()).toBe("7");
  await a.locator(".sudoku-cell input").nth(GIVENS.indexOf("9")).click({ force: true });
  await b.locator(".sudoku-cell input").nth(GIVENS.indexOf("3")).click({ force: true });
  await b.waitForTimeout(2500); // sleep-ok: the boil parks
  await b.bringToFront();
  const label = b.locator(TAPE);
  await expect(async () => {
    await b.mouse.move(2, 2);
    await b.locator(".game-cell").nth(x).hover();
    await expect(label).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 30000 });
  const box = (await label.boundingBox())!;
  const clip = { x: Math.floor(box.x - 6), y: Math.floor(box.y - 6), width: Math.ceil(box.width + 12), height: Math.ceil(box.height + 12) };
  const ink = async () => label.evaluate((l) => getComputedStyle(l).color);
  const text = (await label.textContent())?.trim();
  const shipped = await b.screenshot({ clip });
  const inkA = await ink();
  const tag = await b.addStyleTag({ content: `${TAPE} { color: var(--color-peer-cursor-ink) !important; }` });
  await b.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const ring = await b.screenshot({ clip });
  const inkB = await ink();
  await tag.evaluate((e) => (e as Element).remove());
  await b.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const again = await b.screenshot({ clip });
  const lab = await label.boundingBox();
  const e = info.project.name;
  writeFileSync(`${OUT}/${e}-shipped.png`, shipped);
  writeFileSync(`${OUT}/${e}-ring.png`, ring);
  writeFileSync(`${OUT}/${e}-again.png`, again);
  writeFileSync(`${OUT}/${e}-meta.json`, JSON.stringify({ text, inkA, inkB, clip, label: lab, cell: x, dpr: await b.evaluate(() => devicePixelRatio) }));
  await ctx.close();
});
