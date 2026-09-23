/**
 * NOTE-LEDGER pass 5 · L2 ON THE WIRE (charter row 8). A DEV-mode room (`?wire=local` is DEV-only,
 * `useSession.ts`), two pages in one context: A asks, B writes, A's margin is read. The pinned
 * payload is the section's (NOTE-ERASE's). Three peer acts, each on a fresh room:
 *   elsewhere — a TRUE digit in a cell outside the record's referent  → A's record STANDS
 *   here      — the digit the record names, where it said            → FULFILLED (HOLD: stays up)
 *   against   — another digit on the record's own square              → FALSIFIED (struck)
 * The same three acts by A herself are the control: the ledger must not care whose hand it was.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { encodeSudoku } from "../e2e/wire";

const DEV = process.env.DEV_URL ?? "http://127.0.0.1:4247";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/NOTE-LEDGER/logs";
const G: Record<number, number> = {
  0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3,
  36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9,
  71: 5, 76: 8, 79: 7, 80: 9,
};
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const BOARD = encodeSudoku(3, G, 81);

const margin = (p: Page) =>
  p.evaluate(() => [
    document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
    document.querySelector(".board-margin .margin-note-previous")?.textContent?.trim() ?? "",
  ]);
async function boot(p: Page, url: string) {
  await p.goto(url);
  await p.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await p.waitForTimeout(1500);
}
async function write(p: Page, i: number, d: string) {
  await p.locator(".game-cell input").nth(i).focus();
  await p.keyboard.type(d);
}
/** A asks; returns the record's sentence and its cell (the one empty because-cell whose solution
 *  is the named digit — the hint does not move focus). */
async function ask(a: Page) {
  await a.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
  await a.keyboard.press("h");
  await a.waitForTimeout(900);
  const [s] = await margin(a);
  const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1] ?? "";
  const cells = await a.evaluate(() => [...document.querySelectorAll(".game-cell")].map((c, i) => (c.querySelector(".cell-because") ? i : -1)).filter((i) => i >= 0));
  const cell = cells.find((i) => SOL[i] === d) ?? -1;
  return { s, d, cell, because: cells };
}

const rows: unknown[] = [];
for (const author of ["peer", "self"] as const)
  for (const act of ["elsewhere", "here", "against"] as const)
    test(`L2 ${author} ${act}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const a = await ctx.newPage();
      await boot(a, `${DEV}/?board=${BOARD}&wire=local`);
      const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
      await expect(verb).toBeEnabled();
      await verb.click();
      await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
      const b = await ctx.newPage();
      await boot(b, a.url());
      await expect.poll(() => b.locator(".players-roster .player-row").count()).toBe(2);
      const q = await ask(a);
      const before = await margin(a);
      const hand = author === "peer" ? b : a;
      let at = -1;
      let digit = "";
      if (act === "elsewhere") {
        const empt = await a.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((c, i) => ((c as HTMLInputElement).value ? -1 : i)).filter((i) => i >= 0));
        at = empt.find((i) => !q.because.includes(i))!;
        digit = SOL[at];
      } else {
        at = q.cell;
        digit = act === "here" ? q.d : String((Number(q.d) % 9) + 1);
      }
      await write(hand, at, digit);
      await expect.poll(() => a.evaluate((i) => (document.querySelectorAll(".game-cell input")[i] as HTMLInputElement).value, at)).toBe(digit);
      await a.waitForTimeout(700);
      const after = await margin(a);
      const want = act === "against" ? "" : q.s;
      rows.push({ author, act, sentence: q.s, cell: q.cell, wrote: { at, digit }, before, after, verdict: after[0] === want ? "as the law says" : "BROKEN" });
      console.log(`L2|${author}|${act}|${JSON.stringify({ sentence: q.s, at, digit, before, after })}`);
      expect(after[0]).toBe(want);
      await ctx.close();
    });
test.afterAll(async ({}, info) => writeFileSync(`${OUT}/l2-wire-${info.project.name}.json`, JSON.stringify(rows, null, 1)));
