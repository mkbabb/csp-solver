/**
 * NOTE-ERASE pass 6 (copied from pass 5, OUT re-pointed through lib) · the peer room's because-member row, PINNED through the codec (DEV only:
 * `?wire=local` never forms a room on a dist). Pass 4's chromium row was vacuous (member -1) on
 * an unpinned deal. The payload is the lib's; both pages read it back before the row runs.
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, say, boardString, EXPECTED, BOARD, PAYLOAD } from "./lib";

const DEV = "http://127.0.0.1:4247";
const readNote = (p: Page) =>
  p.evaluate(() => ({
    text: (document.querySelector(".margin-note")?.textContent || "").replace(/\s+/g, " ").trim(),
    inkPresent: !!document.querySelector(".margin-note-ink"),
    because: [...document.querySelectorAll<HTMLElement>(".game-cell")].map((c, i) => (c.classList.contains("is-because") ? i : -1)).filter((i) => i >= 0),
  }));

async function armAt(p: Page, pos: number) {
  await p.evaluate((pos) => (document.querySelectorAll(".game-cell input")[pos] as HTMLInputElement)?.focus(), pos);
  await p.keyboard.press("h");
  await p.waitForTimeout(700);
  return readNote(p);
}

test("peer: a digit at a DISTINCT because member retracts the hint (pinned)", async ({ browser, browserName }) => {
  test.setTimeout(300000);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  const b = await ctx.newPage();
  await a.goto(DEV + "/" + BOARD + "&wire=local");
  await a.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await expect.poll(() => boardString(a), { timeout: 20000 }).toBe(EXPECTED);
  await a.waitForTimeout(1000);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  await b.goto(a.url());
  await b.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await expect.poll(() => boardString(b), { timeout: 20000 }).toBe(EXPECTED);
  await b.waitForTimeout(1500);

  // Walk empties until the armed hint names a HIDDEN single (because set > 1).
  const empties = [...EXPECTED].map((c, i) => (c === "." ? i : -1)).filter((i) => i >= 0);
  let armed = null as null | { pos: number; note: Awaited<ReturnType<typeof readNote>> };
  const tried: { pos: number; because: number; text: string }[] = [];
  for (const pos of empties) {
    const n = await armAt(a, pos);
    tried.push({ pos, because: n.because.length, text: n.text });
    if (n.because.length > 1) { armed = { pos, note: n }; break; }
  }
  // The named cell: a second H FILLS it (the reveal); diff the board, undo, re-arm (pass 4's route).
  let named = -1;
  let restored = false;
  let reArmed = null as null | Awaited<ReturnType<typeof readNote>>;
  if (armed) {
    const before = await boardString(a);
    await a.keyboard.press("h");
    await a.waitForTimeout(900);
    const filled = await boardString(a);
    for (let i = 0; i < before.length; i++) if (before[i] !== filled[i]) named = i;
    await a.keyboard.press("Meta+z");
    await expect.poll(() => boardString(a), { timeout: 5000 }).toBe(before);
    restored = true;
    reArmed = await armAt(a, armed.pos);
  }
  const member = reArmed ? reArmed.because.find((i) => i !== named && EXPECTED[i] === ".") ?? -1 : -1;
  let delivery = null;
  if (member >= 0) {
    const cell = b.locator(".game-cell input").nth(member);
    await cell.click();
    await cell.fill("1");
    await expect.poll(async () => (await boardString(a))[member], { timeout: 10000 }).toBe("1");
    delivery = { member, landedOnPeer: (await boardString(b))[member] === "1", delivered: (await boardString(a))[member] === "1" };
    await a.waitForTimeout(800);
  }
  const after = await readNote(a);
  const row = { engine: browserName, payload: PAYLOAD, tried: tried.slice(-5), triedCount: tried.length, armed, named, restored, reArmed, member, distinctFromNamed: member >= 0 && member !== named, delivery, after };
  bank(`peer-${browserName}.json`, row);
  say("peer", row);
  await ctx.close();
  expect(member, "a distinct empty because member exists on the pinned board").toBeGreaterThanOrEqual(0);
  expect(delivery?.delivered).toBe(true);
  expect(after.text, "the note is retracted").toBe("");
});
