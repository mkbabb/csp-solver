/**
 * NOTE-LEDGER pass 6 · charter row 7 — ARM C-STEP ON THE WIRE, the dev-mode control beside it.
 * A DEV room (`?wire=local` is DEV-only), two pages in one context: A asks, a hand writes, A's
 * margin is read. ONE payload (the section's classic easy 9×9, 30 givens). Acts, each on a fresh
 * room, each by the PEER and by A HERSELF (the ledger must not care whose hand it was):
 *   elsewhere — a TRUE digit outside the record's referent            (L2: an open record STANDS)
 *   here      — the named digit where it said                          (fulfilled)
 *   against   — another digit on the record's own square               (falsified: struck)
 *   proved    — A proves it (her own hand), then the hand writes a TRUE digit elsewhere: the
 *               STEP discriminator (its clock is "the next write anywhere", authorship-blind)
 * Recorded, never asserted: the reading IS the row. OUT = pass6/prototype/NOTE-LEDGER/logs.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { encodeSudoku } from "../e2e/wire";

const DEV = process.env.DEV_URL!;
const TAG = process.env.TAG!;
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/prototype/NOTE-LEDGER/logs";
const G: Record<number, number> = {
  0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3,
  36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9,
  71: 5, 76: 8, 79: 7, 80: 9,
};
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const BOARD = encodeSudoku(3, G, 81);
const EXPECTED = Array.from({ length: 81 }, (_, i) => (G[i] ? String(G[i]) : ".")).join("");

const margin = (p: Page) =>
  p.evaluate(() => {
    const one = document.querySelector(".board-margin .margin-note");
    return {
      one: one?.textContent?.trim() ?? "",
      two: document.querySelector(".board-margin .margin-note-previous")?.textContent?.trim() ?? "",
      spent: !!one?.classList.contains("is-spent"),
    };
  });
const givens = (p: Page) =>
  p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
async function boot(p: Page, url: string) {
  await p.goto(url);
  await p.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await expect.poll(() => givens(p)).toBe(EXPECTED);
  await p.waitForTimeout(1200);
}
async function write(p: Page, a: Page, i: number, d: string) {
  await p.locator(".game-cell input").nth(i).focus();
  await p.keyboard.type(d);
  await expect.poll(() => a.evaluate((k) => (document.querySelectorAll(".game-cell input")[k] as HTMLInputElement).value, i)).toBe(d);
  await a.waitForTimeout(700);
}
async function ask(a: Page) {
  await a.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
  await a.keyboard.press("h");
  await a.waitForTimeout(900);
  const { one: s } = await margin(a);
  const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1] ?? "";
  const cells = await a.evaluate(() => [...document.querySelectorAll(".game-cell")].map((c, i) => (c.querySelector(".cell-because") ? i : -1)).filter((i) => i >= 0));
  return { s, d, cell: cells.find((i) => SOL[i] === d) ?? -1, because: cells };
}

const rows: unknown[] = [];
for (const author of ["peer", "self"] as const)
  for (const act of ["elsewhere", "here", "against", "proved"] as const)
    test(`${TAG} ${author} ${act}`, async ({ browser }) => {
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
      const hand = author === "peer" ? b : a;
      const empties = () => a.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((c, i) => ((c as HTMLInputElement).value ? -1 : i)).filter((i) => i >= 0));
      const steps: Record<string, unknown> = { asked: await margin(a) };
      if (act === "proved") {
        await write(a, a, q.cell, q.d);
        steps.proved = await margin(a);
        const at = (await empties()).find((i) => !q.because.includes(i))!;
        await write(hand, a, at, SOL[at]);
        steps.nextWrite = { at, digit: SOL[at], margin: await margin(a) };
      } else {
        const at = act === "elsewhere" ? (await empties()).find((i) => !q.because.includes(i))! : q.cell;
        const digit = act === "elsewhere" ? SOL[at] : act === "here" ? q.d : String((Number(q.d) % 9) + 1);
        await write(hand, a, at, digit);
        steps.after = { at, digit, margin: await margin(a) };
      }
      rows.push({ tag: TAG, author, act, sentence: q.s, cell: q.cell, steps });
      console.log(`WIRE|${TAG}|${author}|${act}|${JSON.stringify(steps)}`);
      await ctx.close();
    });
test.afterAll(async ({}, info) => writeFileSync(`${OUT}/p6-wire-${TAG}-${info.project.name}.json`, JSON.stringify(rows, null, 1)));
