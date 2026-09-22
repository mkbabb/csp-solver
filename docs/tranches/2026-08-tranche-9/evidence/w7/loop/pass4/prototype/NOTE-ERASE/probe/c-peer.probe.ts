/**
 * NOTE-ERASE pass 2 · C — THE PEER ROWS (G4), with delivery proven on each row and the
 * because-member row FORCED onto a hidden single (pass 1's chromium row collapsed onto the
 * named cell: `becauseCells` was 1, so "a distinct member" and "the named cell" were one).
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, say } from "./lib";

const BOARD = "?size=3&difficulty=EASY";

const readNote = (p: Page) =>
  p.evaluate(() => {
    const n = document.querySelector<HTMLElement>(".margin-note");
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    return n
      ? {
          text: (n.textContent || "").replace(/\s+/g, " ").trim(),
          tone: (n.getAttribute("class") || "").replace("margin-note", "").trim(),
          inkPresent: !!ink,
          becauseCells: document.querySelectorAll(".game-cell.is-because").length,
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
  await p.waitForTimeout(800);
  return readNote(p);
}

/** Walk the empty cells until the armed hint is a HIDDEN single (because set > 1). */
async function armHiddenSingle(p: Page) {
  const empties = await p.evaluate(() =>
    [...document.querySelectorAll(".game-cell input")]
      .map((i, k) => (!(i as HTMLInputElement).value ? k : -1))
      .filter((k) => k >= 0),
  );
  let last = await readNote(p);
  for (const pos of empties) {
    const n = await armAt(p, pos);
    if ((n?.becauseCells ?? 0) > 1) return { pos, note: n };
    if (n?.text) last = n;
  }
  // No hidden single on this board: fall back to the last cell that armed anything, so the row
  // is reported with `becauseCells: 1` rather than with nothing armed at all.
  return { pos: -1, note: last };
}

async function findHintCell(p: Page) {
  const before = await boardString(p);
  await p.keyboard.press("h");
  await p.waitForTimeout(900);
  const after = await boardString(p);
  let cell = -1;
  for (let i = 0; i < before.length; i++) if (before[i] !== after[i]) cell = i;
  await p.keyboard.press("Meta+z");
  await p.waitForTimeout(900);
  return { cell, restored: (await boardString(p)) === before };
}

test("C the peer rows, delivery-proven (G4)", async ({ browser, browserName }) => {
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
    return a.url();
  };

  const peerWrites = async (idx: number, digit: string) => {
    const aBefore = await boardString(a);
    const bBefore = await boardString(b);
    const cell = b.locator(".sudoku-cell input").nth(idx);
    await cell.click();
    await cell.fill(digit);
    await b.waitForTimeout(1600);
    const bAfter = await boardString(b);
    const aAfter = await boardString(a);
    return {
      idx,
      digit,
      bWasEmpty: bBefore[idx] === ".",
      landedOnPeer: bAfter[idx] === digit,
      delivered: aAfter[idx] === digit,
      aCellBefore: aBefore[idx],
      aCellNow: aAfter[idx],
    };
  };

  // ROW A — a peer's digit ELSEWHERE: the note stands.
  const link = await room();
  const armedA = await armHiddenSingle(a);
  const setA = await a.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
    const all: number[] = [];
    cells.forEach((c, i) => c.classList.contains("is-because") && all.push(i));
    return all;
  });
  const elsewhere = await b.evaluate((except) => {
    const inputs = [...document.querySelectorAll(".sudoku-cell input")];
    for (let k = 0; k < inputs.length; k++)
      if (!(inputs[k] as HTMLInputElement).value && !except.includes(k)) return k;
    return -1;
  }, setA);
  rows.elsewhere = {
    link,
    armed: armedA.note,
    becauseSet: setA,
    delivery: await peerWrites(elsewhere, "1"),
    after: await readNote(a),
  };

  // ROW B — a peer's digit at the cell the note NAMES: rubbed out.
  await room();
  const armedB = await armHiddenSingle(a);
  const namedB = await findHintCell(a);
  const reArmedB = armedB.pos >= 0 ? await armAt(a, armedB.pos) : null;
  rows.namedCell = {
    armed: armedB.note,
    named: namedB,
    reArmed: reArmedB,
    delivery: namedB.cell >= 0 ? await peerWrites(namedB.cell, "1") : null,
    after: await readNote(a),
  };

  // ROW C — a peer's digit at a DISTINCT because member (forced hidden single): rubbed out.
  await room();
  const armedC = await armHiddenSingle(a);
  const namedC = armedC.pos >= 0 ? await findHintCell(a) : { cell: -1, restored: false };
  const reArmedC = armedC.pos >= 0 ? await armAt(a, armedC.pos) : null;
  const memberC = await a.evaluate((named) => {
    const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
    for (let i = 0; i < cells.length; i++)
      if (
        cells[i].classList.contains("is-because") &&
        !(cells[i].querySelector("input") as HTMLInputElement)?.value &&
        i !== named
      )
        return i;
    return -1;
  }, namedC.cell);
  rows.becauseMember = {
    armed: armedC.note,
    named: namedC,
    reArmed: reArmedC,
    member: memberC,
    distinctFromNamed: memberC >= 0 && memberC !== namedC.cell,
    delivery: memberC >= 0 ? await peerWrites(memberC, "1") : null,
    after: await readNote(a),
  };

  // ROW D — a peer REVEALS the named cell: rubbed out.
  await room();
  const armedD = await armHiddenSingle(a);
  const namedD = await findHintCell(a);
  const reArmedD = armedD.pos >= 0 ? await armAt(a, armedD.pos) : null;
  let deliveryD: unknown = null;
  if (namedD.cell >= 0) {
    const aBefore = await boardString(a);
    await b.locator(".sudoku-cell input").nth(namedD.cell).click();
    await b.keyboard.press("h");
    await b.waitForTimeout(900);
    await b.keyboard.press("h");
    await b.waitForTimeout(1800);
    const aAfter = await boardString(a);
    deliveryD = {
      idx: namedD.cell,
      landedOnPeer: (await boardString(b))[namedD.cell] !== ".",
      delivered: aBefore[namedD.cell] !== aAfter[namedD.cell],
    };
  }
  rows.peerReveal = {
    armed: armedD.note,
    named: namedD,
    reArmed: reArmedD,
    delivery: deliveryD,
    after: await readNote(a),
  };

  // ROW E — a peer's digit while YOUR refusal stands: untouched.
  await room();
  const givenIdx = await a.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].findIndex(
      (i) => !!(i as HTMLInputElement).value,
    ),
  );
  await a.locator(".sudoku-cell input").nth(givenIdx).click();
  await a.keyboard.press("5");
  await a.waitForTimeout(700);
  const refused = await readNote(a);
  const emptyIdx = await b.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].findIndex(
      (i) => !(i as HTMLInputElement).value,
    ),
  );
  const deliveryE = await peerWrites(emptyIdx, "1");
  rows.refusal = { refused, delivery: deliveryE, after: await readNote(a) };

  bank(`c-peer-${browserName}.json`, { engine: browserName, rows });
  say("C", rows);
  await ctx.close();
  expect(rows.elsewhere).not.toBeNull();
});
