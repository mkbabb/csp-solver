// PAL-WALK pass-8 CRITIC scratch: the night name's least passing L on the ONE probe (the tree's
// e2e/lib/glyph-pop.mjs by absolute path — a critic instrument, never a product import).
// One payload: A pinned p-0000000a0a0a hosts, B pinned p-0000000b0b0b writes cells 8 and 11; A reads B's
// name on the tape. Arms: shipped, the name at L 0.84/0.82/0.80/0.79 at the shipped chroma+hue, the ring
// string, HEAD's same-index ink (index 1: oklch(0.8 0.11 137.5deg)); plus PAPER-revert and DIGIT-ink swap.
import { test, expect, type Page } from "@playwright/test";
// @ts-expect-error .mjs
import { glyphGate, fmt, TEXT_PLANTS } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend/e2e/lib/glyph-pop.mjs";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const TAPE = ".attribution-tape .washi-label";
async function settled(p: Page) {
  await p.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 }).toBeGreaterThan(0);
}

for (const bId of ["p-00000000002e", "p-0000000b0b0b"])
test(`critic FADE65 at every cell, ${bId}`, async ({ browser }, info) => {
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
  await b.addInitScript(([r, id]) => sessionStorage.setItem("session-identity-v1", JSON.stringify({ [r]: id })), [room, bId] as const);
  await b.goto(a.url());
  await settled(b);
  await b.bringToFront();
  const cells = [11, 12, 14, 8];
  for (const x of cells) {
    await b.locator(".sudoku-cell input").nth(x).click();
    await b.locator(".sudoku-cell input").nth(x).fill("7");
    await expect.poll(() => a.locator(".sudoku-cell input").nth(x).inputValue()).toBe("7");
  }
  await b.locator(".sudoku-cell input").nth(GIVENS.indexOf("3")).click({ force: true });
  await a.bringToFront();
  await a.locator(".sudoku-cell input").nth(GIVENS.indexOf("9")).click({ force: true });
  await a.waitForTimeout(2500); // sleep-ok: the boil parks
  const dpr = await a.evaluate(() => devicePixelRatio);
  const label = a.locator(TAPE);
  const P = TEXT_PLANTS(TAPE);
  const FILL = (p: number) => `${TAPE} { -webkit-text-fill-color: color-mix(in srgb, var(--color-peer-name-ink) ${p}%, transparent) !important; }`;
  for (const arm of ["light", "dark"] as const) {
    await a.evaluate((d) => document.documentElement.classList.toggle("dark", d === "dark"), arm);
    await a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    for (const x of cells) {
      await expect(async () => {
        await a.mouse.move(2, 2);
        await a.locator(".game-cell").nth(x).hover();
        await expect(label).toBeVisible({ timeout: 3000 });
      }).toPass({ timeout: 30000 });
      const g = await glyphGate(a, { subject: TAPE, payload: `${bId}/${arm}/cell${x}`, plants: { FADE65_fill: P.FADE65_fill, FADE65v_fill: FILL(65), FADE70v_fill: FILL(70), FAINT30_fill: P.FAINT30_fill } });
      const t = `[${info.project.name}/${arm}/dpr${dpr}] ${bId} cell ${x}`;
      console.log(`${t} CLEAN bound ${g.bound?.toFixed(3)} · ${fmt(g.clean).split(" cols")[0]} · why [${g.clean.why.map((w: string) => w.split(" ")[0])}]`);
      for (const [n, r] of Object.entries(g.plants) as [string, any][])
        console.log(`${t} PLANT ${n} · ${fmt(r).split(" cols")[0]} · ${r.why.length ? "RED " + r.why.map((w: string) => w.split(" ")[0]).join("+") : "GREEN (a hole)"}`);
      await a.mouse.move(2, 2);
    }
  }
  await ctx.close();
});
