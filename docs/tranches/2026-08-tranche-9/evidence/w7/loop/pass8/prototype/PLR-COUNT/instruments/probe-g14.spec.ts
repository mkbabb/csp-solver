// SCRATCH (PLR-COUNT pass 8): the ONE glyph-pop at its home, on the tally sheet's quiet lines.
import { test, expect, type Page } from "@playwright/test";
import { glyphGate, fmt } from "../e2e/lib/glyph-pop.mjs";

const ID = "p-0000000b0b0b";
const mark = (page: Page) => page.locator("[data-player-mark]:visible").first();
const countOf = (label: string | null) => Number((label ?? "").match(/\d+/)?.[0] ?? 0);
async function peers(page: Page, room: string, k: number) {
  const was = countOf(await mark(page).getAttribute("aria-label")) || 1;
  await page.evaluate(
    ({ room, k, from }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++) w.__ch.postMessage({ kind: "hi", data: {}, from: `tally-${from + i}` });
    },
    { room, k, from: was - 1 },
  );
  await expect.poll(async () => countOf(await mark(page).getAttribute("aria-label"))).toBe(was + k);
}
const CELLS = (process.env.CELLS ?? "light-1,light-2,dark-1,dark-2").split(",");
for (const cell of CELLS) {
  const [theme, d] = cell.split("-");
  test.describe(cell, () => {
    test.use({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: Number(d), colorScheme: theme as "light" | "dark", contextOptions: { reducedMotion: "reduce" } });
    test(`probe ${cell}`, async ({ page }) => {
      test.setTimeout(300_000);
      const room = `plrc8-probe-${cell}`;
      await page.addInitScript(([r, i]) => { try { sessionStorage.setItem("session-identity-v1", JSON.stringify({ [r]: i })); } catch {} }, [room, ID]);
      await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
      await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
      await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
      await peers(page, room, 15);
      await mark(page).click();
      await page.waitForTimeout(800);
      const bound = await page.evaluate((r) => JSON.parse(sessionStorage.getItem("session-identity-v1") ?? "{}")[r], room);
      console.log(`ID ${test.info().project.name} ${cell} ${bound}`);
      for (const q of (process.env.LINES ?? ".pl-state,.pl-qual,.pl-more").split(",")) {
        const subject = `.corner-left [data-lobby] ${q}`;
        const g = await glyphGate(page, { subject, payload: `tally16-${cell}` });
        console.log(`G ${test.info().project.name} ${cell} ${q} CLEAN ${fmt(g.clean)} bound ${g.bound?.toFixed(3)}`);
        for (const [k, r] of Object.entries(g.plants)) console.log(`G ${test.info().project.name} ${cell} ${q} ${k} ${fmt(r)}`);
      }
    });
  });
}
