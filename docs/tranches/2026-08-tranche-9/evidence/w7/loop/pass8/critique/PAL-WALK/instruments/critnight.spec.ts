// PAL-WALK pass-8 CRITIC scratch: the night name's least passing L on the ONE probe (the tree's
// e2e/lib/glyph-pop.mjs by absolute path — a critic instrument, never a product import).
// One payload: A pinned p-0000000a0a0a hosts, B pinned p-0000000b0b0b writes cells 8 and 11; A reads B's
// name on the tape. Arms: shipped, the name at L 0.84/0.82/0.80/0.79 at the shipped chroma+hue, the ring
// string, HEAD's same-index ink (index 1: oklch(0.8 0.11 137.5deg)); plus PAPER-revert and DIGIT-ink swap.
import { test, expect, type Page } from "@playwright/test";
// @ts-expect-error .mjs
import { glyphGate, glyphPopulation, fmt } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend/e2e/lib/glyph-pop.mjs";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const TAPE = ".attribution-tape .washi-label";
async function settled(p: Page) {
  await p.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 }).toBeGreaterThan(0);
}
test("critic night sweep", async ({ browser }, info) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
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
  await b.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
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
  const dpr = await a.evaluate(() => devicePixelRatio);
  const label = a.locator(TAPE);
  for (const arm of ["dark", "light"] as const) {
    await a.evaluate((d) => document.documentElement.classList.toggle("dark", d === "dark"), arm);
    await a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const isDark = await a.evaluate(() => document.documentElement.classList.contains("dark"));
    for (const x of [8, 11]) {
      await expect(async () => {
        await a.mouse.move(2, 2);
        await a.locator(".game-cell").nth(x).hover();
        await expect(label).toBeVisible({ timeout: 3000 });
      }).toPass({ timeout: 30000 });
      const shipped = await label.evaluate((l) => getComputedStyle(l).color);
      const m = /oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/.exec(shipped)!;
      const g = await glyphGate(a, { subject: TAPE, payload: `B0b0b/${arm}/cell${x}`, plants: {} });
      const tag0 = `[${info.project.name}/${arm}(dark=${isDark})/dpr${dpr}] cell ${x}`;
      console.log(`${tag0} shipped ${shipped} · bound ${g.bound?.toFixed(3)} · ${fmt(g.clean)} · why [${g.clean.why.map((w: string) => w.split(" ")[0]).join(",")}]`);
      const Ls = arm === "dark" ? ["0.84", "0.82", "0.80", "0.79", "0.75", "0.70"] : ["0.40", "0.50"];
      const arms: [string, string][] = [
        ...Ls.map((L) => [`L${L}`, `${TAPE} { color: oklch(${L} ${m[2]} ${m[3]}) !important; }`] as [string, string]),
        ["RING", `${TAPE} { color: var(--color-peer-cursor-ink) !important; }`],
        ["DIGIT", `${TAPE} { color: var(--color-user-ink) !important; }`],
        ["HEAD", `${TAPE} { color: oklch(${arm === "dark" ? 0.8 : 0.5} 0.11 137.5deg) !important; }`],
        ["PAPER", `${TAPE} { background: var(--sheet-washi-neutral) !important; }`],
      ];
      for (const [n, css] of arms) {
        const tag = await a.addStyleTag({ content: css });
        await a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        const r = await glyphPopulation(a, { subject: TAPE, fracBound: g.bound });
        const c = await label.evaluate((l) => getComputedStyle(l).color);
        console.log(`${tag0} ${n} ${c} · ${fmt(r)} · why [${r.why.map((w: string) => w.split(" ")[0]).join(",")}] · vs HEAD-rule(median≥HEAD) n/a`);
        await tag.evaluate((e) => (e as Element).remove());
        await a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      }
      await a.mouse.move(2, 2);
    }
  }
  await ctx.close();
});
