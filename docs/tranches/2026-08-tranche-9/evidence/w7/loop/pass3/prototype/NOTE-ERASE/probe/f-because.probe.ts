/**
 * NOTE-ERASE pass 2 · F — the two peer rows pass 1 could not force: a peer's digit at a
 * DISTINCT because member, and a peer's REVEAL at the named cell.
 *
 * Why the walk is what it is: the hint is a two-press transaction and the arm SURVIVES a focus
 * move (r0's R3-d row "arrow to another cell: the note stands"), so pressing `h` on a second
 * cell INKS the first cell's answer instead of arming a new one. Pass 2's first attempt walked
 * cell to cell and quietly inked half the board. Each miss is consumed and undone here, so the
 * board the next arm sees is the board this one saw.
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, say } from "./lib";

const BOARD = "?size=3&difficulty=EASY";

const readNote = (p: Page) =>
  p.evaluate(() => {
    const n = document.querySelector<HTMLElement>(".margin-note");
    return n
      ? {
          text: (n.textContent || "").replace(/\s+/g, " ").trim(),
          inkPresent: !!document.querySelector(".margin-note-ink"),
          becauseCells: document.querySelectorAll(".game-cell.is-because").length,
          becauseSet: [...document.querySelectorAll(".game-cell")]
            .map((c, i) => (c.classList.contains("is-because") ? i : -1))
            .filter((i) => i >= 0),
        }
      : null;
  });

const boardString = (p: Page) =>
  p.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => (i as HTMLInputElement).value || ".")
      .join(""),
  );

async function armAt(p: Page, pos: number) {
  await p.evaluate((pos) => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[pos]?.focus();
  }, pos);
  await p.keyboard.press("h");
  await p.waitForTimeout(700);
  return readNote(p);
}

/** Arm a HIDDEN single: walk, consuming and undoing every miss so the board never drifts. */
async function armHidden(p: Page, tries = 12) {
  const empties = await p.evaluate(() =>
    [...document.querySelectorAll(".game-cell input")]
      .map((i, k) => (!(i as HTMLInputElement).value ? k : -1))
      .filter((k) => k >= 0),
  );
  const walked: number[] = [];
  for (const pos of empties.slice(0, tries)) {
    const n = await armAt(p, pos);
    walked.push(n?.becauseCells ?? 0);
    if ((n?.becauseCells ?? 0) > 1) return { pos, note: n, walked };
    const before = await boardString(p);
    await p.keyboard.press("h"); // consume the arm (it inks)
    await p.waitForTimeout(600);
    await p.keyboard.press("Meta+z"); // and give the board back
    await p.waitForTimeout(600);
    if ((await boardString(p)) !== before) return { pos: -1, note: n, walked };
  }
  return { pos: -1, note: await readNote(p), walked };
}

test("F the because-member and reveal rows, on a forced hidden single", async ({
  browser,
  browserName,
}) => {
  test.setTimeout(420000);
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "no-preference",
    colorScheme: "light",
  });
  const a = await ctx.newPage();
  const b = await ctx.newPage();
  const rows: Record<string, unknown> = {};

  const room = async () => {
    await a.goto("./" + BOARD + "&wire=local");
    await a.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
    await a.waitForTimeout(1400);
    await a
      .locator('.controls-card button[aria-label="Play together on this board"]')
      .click();
    await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
    await b.goto(a.url());
    await b.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
    await b.waitForTimeout(2000);
  };

  const peerWrites = async (idx: number, digit: string) => {
    const aBefore = await boardString(a);
    const cell = b.locator(".sudoku-cell input").nth(idx);
    await cell.click();
    await cell.fill(digit);
    await b.waitForTimeout(1600);
    const aAfter = await boardString(a);
    return { idx, digit, delivered: aAfter[idx] === digit, aCellBefore: aBefore[idx] };
  };

  // ROW C — the peer writes at a because member that is NOT the named cell.
  await room();
  const armedC = await armHidden(a);
  const named = armedC.note?.becauseSet ?? [];
  const member = await a.evaluate((set: number[]) => {
    const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
    const focused = cells.findIndex((c) => c.querySelector("input:focus"));
    for (const i of set)
      if (i !== focused && !(cells[i].querySelector("input") as HTMLInputElement)?.value)
        return { member: i, focused };
    return { member: -1, focused };
  }, named);
  rows.becauseMember = {
    armed: armedC.note,
    walked: armedC.walked,
    namedCellIsFocused: member.focused,
    member: member.member,
    distinctFromNamed: member.member >= 0 && member.member !== member.focused,
    delivery: member.member >= 0 ? await peerWrites(member.member, "1") : null,
    after: await readNote(a),
  };

  // ROW D — the peer REVEALS the cell the note names (their own two presses on that square).
  await room();
  const armedD = await armHidden(a);
  const focusedD = await a.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".game-cell")].findIndex((c) =>
      c.querySelector("input:focus"),
    ),
  );
  let deliveryD: unknown = null;
  if (focusedD >= 0) {
    const before = await boardString(a);
    await b.locator(".sudoku-cell input").nth(focusedD).click();
    await b.keyboard.press("h");
    await b.waitForTimeout(800);
    await b.keyboard.press("h");
    await b.waitForTimeout(1800);
    const after = await boardString(a);
    deliveryD = {
      idx: focusedD,
      landedOnPeer: (await boardString(b))[focusedD] !== ".",
      delivered: before[focusedD] !== after[focusedD],
    };
  }
  rows.peerReveal = {
    armed: armedD.note,
    walked: armedD.walked,
    named: focusedD,
    delivery: deliveryD,
    after: await readNote(a),
  };

  bank(`f-because-${browserName}.json`, { engine: browserName, rows });
  say("F", rows);
  await ctx.close();
  expect(rows.becauseMember).not.toBeNull();
});
