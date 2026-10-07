// PAL-TIN pass 8 · SCRATCH (moved out before return) · row 4's mechanism, planted: the pass-7 critic's
// clean-tree G4 red was a ≥ 8 px far-right cluster with transient 0 on the ON pair. Two plants on B's
// tape (pinned), both themes: FAR8 — a NON-TEXT, colour-bound, low-contrast 8 px box after the tick
// (it moves between ON and OFF, it is stable inside each pair: the pass-7 reader counted it as ink);
// BLINK — a grey box that alternates every 40 ms (it is unstable inside the pairs). Each read twice:
// the home reader (text-run clip + both pair compares) and the same reader with the clip OFF.
import { test, type Page } from "@playwright/test";
// @ts-expect-error scratch
import { glyphPopulation, fmt } from "../e2e/lib/glyph-pop.mjs";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const TAPE = ".attribution-tape .washi-label";
const IDS = ["p-0000000a0a0a", "p-00000000c1c1", "p-00000000c2c2", "p-00000000c3c3", "p-00000000c4c4", "p-0000000b0b0b"];
async function boot(p: Page, url: string) {
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.goto(url);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await p.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, null, { timeout: 60000 });
}
test("row 4 mechanism plants", async ({ browser }, info) => {
  test.setTimeout(600000);
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.addInitScript((id) => {
    const get = Storage.prototype.getItem;
    Storage.prototype.getItem = function (k: string) {
      const r = new URL(location.href).searchParams.get("s");
      if (this === sessionStorage && k === "session-identity-v1" && r) return JSON.stringify({ ...JSON.parse(get.call(this, k) || "{}"), [r]: id });
      return get.call(this, k);
    };
  }, IDS[0]);
  await boot(a, `./?board=${BOARD}&wire=local`);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await a.waitForFunction(() => new URL(location.href).searchParams.get("s"));
  const link = a.url();
  const room = new URL(link).searchParams.get("s")!;
  let b = a;
  for (let i = 1; i < 6; i++) {
    const p = await ctx.newPage();
    await p.addInitScript(([r, id]) => sessionStorage.setItem("session-identity-v1", JSON.stringify({ [r]: id })), [room, IDS[i]] as const);
    await boot(p, link);
    b = p;
  }
  await a.waitForFunction(() => document.querySelectorAll(".controls-card .players-roster .player-row").length === 6, null, { timeout: 60000 });
  const x = 11;
  await b.locator(".sudoku-cell input").nth(x).click();
  await b.locator(".sudoku-cell input").nth(x).fill("7");
  await a.waitForFunction((n) => (document.querySelectorAll(".sudoku-cell input")[n] as HTMLInputElement).value === "7", x);
  await a.bringToFront();
  const frames = () => a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const PLANTS: Record<string, string> = {
    none: "",
    FAR8: `${TAPE}::after { content: ""; display: inline-block; width: 8px; height: 0.8em; background: color-mix(in srgb, currentColor 12%, transparent); }`,
    BLINK: `@keyframes tin8b { 0% { opacity: 1 } 50% { opacity: 0 } } ${TAPE}::after { content: ""; display: inline-block; width: 8px; height: 0.8em; background: #7a7a7a; animation: tin8b 80ms steps(1) infinite; }`,
  };
  for (const theme of ["light", "dark"]) {
    await a.evaluate((m) => document.documentElement.classList.toggle("dark", m === "dark"), theme);
    await frames();
    for (const [name, css] of Object.entries(PLANTS)) {
      await a.mouse.move(2, 2);
      await a.locator(".game-cell").nth(x).hover();
      await a.locator(TAPE).waitFor({ state: "visible" });
      const tag = css ? await a.addStyleTag({ content: css }) : null;
      await frames();
      for (const clip of [true, false]) {
        const r = await glyphPopulation(a, { subject: TAPE, textRun: clip });
        console.log(`MECH ${info.project.name} ${theme} ${name} textRun=${clip} · ${fmt(r)}`);
      }
      if (tag) await tag.evaluate((e) => e.remove());
      await frames();
    }
  }
  await ctx.close();
});
