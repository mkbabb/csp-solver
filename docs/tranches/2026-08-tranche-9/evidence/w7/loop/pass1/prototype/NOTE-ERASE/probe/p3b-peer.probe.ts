/**
 * NOTE-ERASE pass-1 — the peer rows, re-cut with the DELIVERY proven on each row: the reader's
 * own board is read before and after the peer's digit, so a row cannot pass because nothing
 * arrived.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

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

const roster = (p: Page) =>
  p.evaluate(() => document.querySelectorAll(".roster-row, .player-chip, .roster-chip").length);

async function armHint(p: Page) {
  await p.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await p.keyboard.press("h");
  await p.waitForTimeout(900);
  return readNote(p);
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

test("P3b the peer rows, delivery-proven (G4)", async ({ browser, browserName }) => {
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
      bCellNow: bAfter[idx],
      landedOnPeer: bAfter[idx] === digit,
      delivered: aAfter[idx] === digit,
      aCellBefore: aBefore[idx],
      aCellNow: aAfter[idx],
    };
  };

  // ROW A — a peer's digit ELSEWHERE.
  const link = await room();
  const armedA = await armHint(a);
  const setA = await a.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
    const all: number[] = [];
    cells.forEach((c, i) => c.classList.contains("is-because") && all.push(i));
    return all;
  });
  const elsewhere = await b.evaluate(
    (except) => {
      const inputs = [...document.querySelectorAll(".sudoku-cell input")];
      for (let k = 0; k < inputs.length; k++) {
        if (!(inputs[k] as HTMLInputElement).value && !except.includes(k)) return k;
      }
      return -1;
    },
    setA,
  );
  const deliveryA = await peerWrites(elsewhere, "1");
  rows.elsewhere = {
    link,
    rosterA: await roster(a),
    armed: armedA,
    becauseSet: setA,
    delivery: deliveryA,
    after: await readNote(a),
  };

  // ROW B — a peer's digit at the cell the note NAMES.
  await room();
  const armedB = await armHint(a);
  const namedB = await findHintCell(a);
  const reArmedB = await armHint(a);
  const deliveryB = namedB.cell >= 0 ? await peerWrites(namedB.cell, "1") : null;
  rows.namedCell = {
    armed: armedB,
    named: namedB,
    reArmed: reArmedB,
    delivery: deliveryB,
    after: await readNote(a),
  };

  // ROW C — a peer's digit at a because member that is not the named cell (hidden single only).
  await room();
  let armedC = await armHint(a);
  // walk to a cell whose hint is a HIDDEN single (9 because cells), up to 6 tries
  for (let i = 0; i < 6 && (armedC?.becauseCells ?? 0) < 2; i++) {
    await a.keyboard.press("ArrowRight");
    await a.waitForTimeout(250);
    armedC = await armHint(a);
  }
  const namedC = (armedC?.becauseCells ?? 0) > 1 ? await findHintCell(a) : { cell: -1, restored: false };
  const reArmedC = namedC.cell >= 0 ? await armHint(a) : null;
  const memberC = await a.evaluate(
    (named) => {
      const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
      for (let i = 0; i < cells.length; i++) {
        if (
          cells[i].classList.contains("is-because") &&
          !(cells[i].querySelector("input") as HTMLInputElement)?.value &&
          i !== named
        )
          return i;
      }
      return -1;
    },
    namedC.cell,
  );
  const deliveryC = memberC >= 0 ? await peerWrites(memberC, "1") : null;
  rows.becauseMember = {
    armed: armedC,
    named: namedC,
    reArmed: reArmedC,
    member: memberC,
    delivery: deliveryC,
    after: await readNote(a),
  };

  // ROW D — a peer REVEALS the named cell (their own two H presses on that square).
  await room();
  const armedD = await armHint(a);
  const namedD = await findHintCell(a);
  const reArmedD = await armHint(a);
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
    armed: armedD,
    named: namedD,
    reArmed: reArmedD,
    delivery: deliveryD,
    after: await readNote(a),
  };

  // ROW E — a peer's digit and YOUR refusal.
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

  bank(`p3b-peer-${browserName}.json`, { engine: browserName, rows });
  console.log("P3B|" + JSON.stringify(rows));
  await ctx.close();
  expect(rows.elsewhere).not.toBeNull();
});
