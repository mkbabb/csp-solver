import { test, expect, type Page } from "@playwright/test";
// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before every goto (scratch instrument, PAL-TIN pass 6).
// B-TAPE's INK HALF on ONE payload and ONE hover: the sixth player's tape (stick 1, lap 1, so the
// tally is on it) over a grid line with a given under it. The one variable per pair is the
// label's --color-user-ink: dark = the ring arm (pass 5) | the name arm (pass 6); light = the
// stick | the name arm (= the ring arm). Both panels of a pair are shot in one page, one hover.
// Also the chair's number: the ring core median if the dark ring arms rose to the name arms' 0.84.
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const LOCAL = `./?board=${BOARD}&wire=local`;
const OUT = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/paltin6-frames";
async function boot(p: Page, url: string) {
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.goto(url);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  if (!new URL(url, "http://x").searchParams.get("s"))
    expect(await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""))).toBe(GIVENS);
}
async function setTheme(p: Page, m: "light" | "dark") {
  await p.evaluate((x) => { document.documentElement.classList.toggle("dark", x === "dark"); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, m);
}
test("frames: B-TAPE ink half, both themes, one hover, one payload", async ({ browser }, info) => {
  test.setTimeout(600_000);
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, LOCAL);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const pages = [a];
  for (let i = 1; i < 6; i++) { const p = await ctx.newPage(); await boot(p, link); pages.push(p); }
  for (const p of pages) await expect(p.locator(".controls-card .players-roster .player-row")).toHaveCount(6, { timeout: 60000 });
  const b = pages[5];
  const empty = [...GIVENS].flatMap((ch, i) => (ch === "." ? [i] : []));
  const x = empty.filter((i) => i >= 9 && GIVENS[i - 9] !== ".")[0];
  await b.locator(".sudoku-cell input").nth(x).click();
  await b.locator(".sudoku-cell input").nth(x).fill("7");
  await expect.poll(() => a.locator(".sudoku-cell input").nth(x).inputValue()).toBe("7");
  await b.locator(".sudoku-cell input").nth(GIVENS.indexOf("3")).click({ force: true });
  const label = a.locator(".attribution-tape .washi-label");
  const lines: string[] = [];
  for (const [arm, left, right] of [["dark", "var(--color-peer-1-ring)", "var(--color-peer-1-name)"], ["light", "var(--color-peer-1)", "var(--color-peer-1-name)"]] as const) {
    await setTheme(a, arm);
    await expect(async () => { await a.mouse.move(2, 2); await a.locator(".game-cell").nth(x).hover(); await expect(label).toBeVisible({ timeout: 3000 }); }).toPass({ timeout: 30000 });
    expect(await a.locator(".attribution-tape .roster-tick").count()).toBe(1);
    const box = (await a.locator(".attribution-tape .washi-label").boundingBox())!;
    const clip = { x: Math.floor(box.x - 14), y: Math.floor(box.y - 14), width: Math.ceil(box.width + 28), height: Math.ceil(box.height + 28) };
    for (const [side, v] of [["L", left], ["R", right]] as const) {
      await label.evaluate((l, val) => { (l as HTMLElement).style.setProperty("--color-user-ink", val); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, v);
      const col = await label.evaluate((l) => getComputedStyle(l).color);
      const tick = await a.locator(".attribution-tape .roster-tick path").first().evaluate((p) => getComputedStyle(p).stroke);
      await a.screenshot({ clip, path: `${OUT}/${info.project.name}-${arm}-${side}.png` });
      lines.push(`FRAME ${info.project.name} ${arm} ${side} ${v}: name ${col} · tick ${tick} · cell ${x} · clip ${JSON.stringify(clip)}`);
    }
    await label.evaluate((l) => (l as HTMLElement).style.removeProperty("--color-user-ink"));
    await a.mouse.move(2, 2);
  }
  for (const l of lines) console.log(l);
  await ctx.close();
});
