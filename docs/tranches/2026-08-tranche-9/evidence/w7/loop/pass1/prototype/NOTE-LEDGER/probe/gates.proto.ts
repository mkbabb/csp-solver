/**
 * NOTE-LEDGER pass-1 PROTOTYPE — the family's own gates, re-run against the BUILD.
 * L1 accumulation · L2 the peer row · L6 one region · L8 the caption law · L9 records only.
 * Nothing is cloned here: every line read is one the product itself wrote.
 */
import { test, expect, type Page } from "@playwright/test";
import { boardReady, armHint, armRefusal, typeDigit, ledger, bank } from "./lib";

const phone = { width: 390, height: 844, dsf: 3 };

async function phonePage(browser: import("@playwright/test").Browser, browserName: string) {
  const ctx = await browser.newContext({
    viewport: { width: phone.width, height: phone.height },
    deviceScaleFactor: phone.dsf,
    isMobile: browserName === "chromium",
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  return { ctx, page };
}

/* ── L1 · ACCUMULATION ─────────────────────────────────────────────────────────────────── */

test("L1 — a record is displaced by the next sentence, never by a digit", async ({
  browser,
  browserName,
}) => {
  const { ctx, page } = await phonePage(browser, browserName);
  await boardReady(page);
  const rows: Record<string, unknown> = {};
  await armHint(page);
  const hint = (await ledger(page)).one;
  rows.afterHint = await ledger(page);
  expect(hint, "a hint must be standing").not.toBe("");

  await typeDigit(page);
  rows.afterDigit = await ledger(page);
  expect((rows.afterDigit as { one: string }).one, "a digit is not a sentence").toBe(hint);

  await armRefusal(page);
  rows.afterRefusal = await ledger(page);
  const two = rows.afterRefusal as { one: string; two: string; twoAriaHidden: string };
  expect(two.one).toBe("that's a given clue");
  expect(two.two, "the displaced record must still be readable").toBe(hint);
  expect(two.twoAriaHidden).toBe("true");

  // A THIRD record: the column stays two deep and the oldest leaves no trace.
  await armHint(page, 1);
  rows.afterThird = await ledger(page);
  rows.painted = await page.evaluate(() => ({
    liveLines: document.querySelectorAll(".board-margin .margin-note").length,
    agedLines: document.querySelectorAll(".board-margin .margin-note-previous").length,
    texts: Array.from(
      document.querySelectorAll(".board-margin .margin-note, .board-margin .margin-note-previous"),
    ).map((n) => (n.textContent || "").trim()),
  }));
  expect((rows.painted as { agedLines: number }).agedLines, "never a third painted line").toBe(1);
  expect(
    (rows.painted as { texts: string[] }).texts.join(" | "),
    "the oldest leaves no trace",
  ).not.toContain(hint);
  bank(`L1-${browserName}.json`, rows);
  console.log("L1", JSON.stringify(rows));
  await ctx.close();
});

/* ── L2 · THE PEER ROW ─────────────────────────────────────────────────────────────────── */

test("L2 — a peer's digit adds nothing and takes nothing", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await a.goto("./?size=3&difficulty=EASY&wire=local");
  await a.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await a.waitForTimeout(1200);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled({ timeout: 20000 });
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const room = a.url();
  const b = await ctx.newPage();
  await b.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await b.goto(room);
  await b.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await b.waitForTimeout(1200);

  const rows: Record<string, unknown> = {};
  // Your own two-line column, on YOUR page.
  await armHint(a);
  const hint = (await ledger(a)).one;
  await armRefusal(a);
  rows.mine = await ledger(a);
  expect((rows.mine as { two: string }).two).toBe(hint);

  // 1 — the peer writes a digit ELSEWHERE.
  await b.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    const empty = inputs.filter((i) => !i.value && !i.readOnly);
    empty[empty.length - 1]?.focus();
  });
  await b.keyboard.press("5");
  await b.waitForTimeout(1600);
  rows.afterPeerElsewhere = await ledger(a);

  // 2 — the peer writes on the cell your standing record NAMES.
  await b.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value && !i.readOnly)?.focus();
  });
  await b.keyboard.press("7");
  await b.waitForTimeout(1600);
  rows.afterPeerOnNamedCell = await ledger(a);

  // 3 — a JOIN (a third page arrives).
  const c = await ctx.newPage();
  await c.goto(room);
  await c.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await c.waitForTimeout(1600);
  rows.afterJoin = await ledger(a);

  for (const key of ["afterPeerElsewhere", "afterPeerOnNamedCell", "afterJoin"]) {
    const r = rows[key] as { one: string; two: string };
    expect(r.one, `${key}: your line one`).toBe("that's a given clue");
    expect(r.two, `${key}: your line two`).toBe(hint);
  }
  bank(`L2-${browserName}.json`, rows);
  console.log("L2", JSON.stringify(rows));
  await ctx.close();
});

/* ── L6 · ONE REGION ───────────────────────────────────────────────────────────────────── */

test("L6 — one live region in the strip, one mutation per push", async ({
  browser,
  browserName,
}) => {
  const { ctx, page } = await phonePage(browser, browserName);
  await boardReady(page);
  await armHint(page);

  const census = await page.evaluate(() => ({
    statusInStrip: document.querySelectorAll('.board-margin [role="status"]').length,
    liveInStrip: document.querySelectorAll(".board-margin [aria-live]").length,
    alertInStrip: document.querySelectorAll('.board-margin [role="alert"]').length,
    atomic: document
      .querySelector('.board-margin [role="status"]')
      ?.getAttribute("aria-atomic"),
    previousInsideRegion: !!document.querySelector(
      '.board-margin [role="status"] .margin-note-previous',
    ),
  }));

  // Count the region's OWN mutations across one push.
  await page.evaluate(() => {
    const region = document.querySelector('.board-margin [role="status"]') as HTMLElement;
    const w = window as unknown as { __nlMut: number; __nlBatch: number };
    w.__nlMut = 0;
    w.__nlBatch = 0;
    new MutationObserver((recs) => {
      w.__nlBatch += 1;
      w.__nlMut += recs.length;
    }).observe(region, { childList: true, subtree: true, characterData: true });
  });
  await armRefusal(page);
  const mutations = await page.evaluate(() => ({
    records: (window as unknown as { __nlMut: number }).__nlMut,
    batches: (window as unknown as { __nlBatch: number }).__nlBatch,
  }));
  const after = await ledger(page);
  const rows = { census, push: mutations, after };
  expect(census.statusInStrip, "exactly one live region in the strip").toBe(1);
  expect(census.previousInsideRegion, "line two is outside the region").toBe(false);
  expect(after.twoAriaHidden).toBe("true");
  bank(`L6-${browserName}.json`, rows);
  console.log("L6", JSON.stringify(rows));
  await ctx.close();
});

/* ── L8 / L9 · THE CAPTION LAW AND RECORDS ONLY ────────────────────────────────────────── */

async function firstTwoBlanks(page: Page) {
  return page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    const idx: number[] = [];
    inputs.forEach((i, k) => {
      if (!i.value && !i.readOnly && !i.disabled) idx.push(k);
    });
    // two blanks in the SAME row: a duplicate there is a hard conflict
    for (let a = 0; a < idx.length; a++) {
      for (let b = a + 1; b < idx.length; b++) {
        if (Math.floor(idx[a] / 9) === Math.floor(idx[b] / 9)) return [idx[a], idx[b]];
      }
    }
    return [idx[0], idx[1]];
  });
}

test("L8/L9 — a deal empties both lines; a grade never ages; a solve empties first", async ({
  browser,
  browserName,
}) => {
  // THE DESK, not the phone: below 1024 the verbs live in the dock sheet and the sheet covers
  // the strip whole. These are MODEL laws (what may enter which line), so they are read where
  // the controls are on the page.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  const rows: Record<string, unknown> = {};

  // Two records deep.
  await armHint(page);
  const hint = (await ledger(page)).one;
  await armRefusal(page);
  rows.twoDeep = await ledger(page);

  // A GRADE arrives: the record ages, the grade takes line one.
  const [b1, b2] = await firstTwoBlanks(page);
  await page.evaluate(
    ([i, j]) => {
      const set = (idx: number, v: string) => {
        const input = document.querySelectorAll(".board-cells input")[idx] as HTMLInputElement;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
        setter.call(input, v);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      };
      set(Number(i), "9");
      set(Number(j), "9");
    },
    [String(b1), String(b2)],
  );
  await page.waitForTimeout(400);
  await page.locator('button[aria-label="Solve puzzle"]').first().click();
  await expect(page.locator(".margin-note")).toHaveClass(/teacher-red/, { timeout: 20000 });
  rows.gradeLive = await ledger(page);

  // The next sentence displaces the GRADE — and a grade does not age.
  await armRefusal(page);
  rows.afterGradeDisplaced = await ledger(page);
  expect(
    (rows.afterGradeDisplaced as { two: string }).two,
    "a verdict may not survive in the quiet ink",
  ).not.toContain("check");

  // A grade that REVERTS leaves line one empty and line two exactly where it is.
  await armHint(page, 2);
  const standing = (await ledger(page)).one;
  await page.evaluate(
    ([i, j]) => {
      const set = (idx: number, v: string) => {
        const input = document.querySelectorAll(".board-cells input")[idx] as HTMLInputElement;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
        setter.call(input, v);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      };
      set(Number(i), "9");
      set(Number(j), "9");
    },
    [String(b1), String(b2)],
  );
  await page.waitForTimeout(300);
  await page.locator('button[aria-label="Solve puzzle"]').first().click();
  await expect(page.locator(".margin-note")).toHaveClass(/teacher-red/, { timeout: 20000 });
  const gradeOverRecord = await ledger(page);
  await page.evaluate(
    (j) => {
      const input = document.querySelectorAll(".board-cells input")[Number(j)] as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setter.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    String(b2),
  );
  await page.waitForTimeout(900);
  rows.gradeReverted = { standing, gradeOverRecord, now: await ledger(page) };
  expect((rows.gradeReverted as { now: { one: string } }).now.one).toBe("");
  expect(
    (rows.gradeReverted as { now: { two: string } }).now.two,
    "a line never climbs back up the page",
  ).toBe(standing);

  // A DEAL empties BOTH lines.
  await page.locator('button[aria-label="Deal a new puzzle"], button:has-text("Deal")')
    .first()
    .click();
  await page.waitForTimeout(2500);
  rows.afterDeal = await ledger(page);
  expect((rows.afterDeal as { one: string }).one).toBe("");
  expect((rows.afterDeal as { two: string }).two, "a deal says nothing on either line").toBe("");

  // A SOLVE empties both, before the crest.
  await armHint(page);
  await armRefusal(page);
  rows.beforeSolve = await ledger(page);
  await page.locator('button[aria-label="Solve puzzle"]').first().click();
  await expect(page.locator(".margin-note")).toContainText("solved it!", { timeout: 30000 });
  rows.afterSolve = await ledger(page);
  rows.celebrating = await page.evaluate(
    () => !!document.querySelector(".completion-vignette, .margin-note-block.is-quiet"),
  );
  expect((rows.afterSolve as { two: string }).two, "a solve empties the column").toBe("");
  bank(`L8-L9-${browserName}.json`, rows);
  console.log("L8/L9", JSON.stringify(rows));
  await ctx.close();
});
