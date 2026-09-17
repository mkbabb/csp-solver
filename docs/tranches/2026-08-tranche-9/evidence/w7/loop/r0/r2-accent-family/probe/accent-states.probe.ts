/**
 * accent-states.probe.ts — the states the resting census cannot reach.
 *
 * Six accents only appear when something happens, and every one of them is an ACCENT
 * DECISION: the conflict ring (danger), the refusal note (danger, spoken), the solved
 * frame (celebration), the guard ribbon (confirm), the control's focus ring (focus),
 * and a peer's digit (authorship). Each is sampled where it paints, with the alpha it
 * paints at and the ground it paints over.
 *
 * READ-ONLY on the product.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/r2-accent-family/census";
mkdirSync(OUT, { recursive: true });

const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page, url = SOLO) {
  await page.goto(url);
  await page.waitForSelector(".sudoku-cell", { timeout: 25000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 25000 })
    .toBeGreaterThan(0);
}

/** Read one site: the declared paint, the alpha it rides at, the opaque ground under it. */
async function read(page: Page, selector: string, props: string[]) {
  return page.evaluate(
    ({ selector, props }: { selector: string; props: string[] }) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const cs = getComputedStyle(el);
      const out: Record<string, string> = {};
      for (const p of props) out[p] = cs.getPropertyValue(p);
      out["__strokeOpacity"] = cs.strokeOpacity || "";
      out["__fillOpacity"] = cs.fillOpacity || "";
      let n: Element | null = el;
      out["__ground"] = "";
      while (n) {
        const bg = getComputedStyle(n).backgroundColor;
        const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i.exec(bg);
        if (m && (m[4] == null || parseFloat(m[4]) >= 0.999)) {
          out["__ground"] = bg;
          break;
        }
        n = n.parentElement;
      }
      return out;
    },
    { selector, props },
  );
}

/** Type into a cell through the estate's own value-setter recipe (gallery-guard.spec.ts). */
async function typeInto(page: Page, cellIndex: number, digit: string) {
  await page.locator(".sudoku-cell").nth(cellIndex).click();
  await page.evaluate(
    ({ idx, d }: { idx: number; d: string }) => {
      const input = document.querySelectorAll(".sudoku-cell input")[idx] as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setter.call(input, d);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    { idx: cellIndex, d: digit },
  );
}

test("accent states — conflict · refusal · solved · guard · control ring", async ({
  page,
  browserName,
}) => {
  const bag: Record<string, unknown> = { engine: browserName };
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);

  // ── 0. Checking → Live. The conflict ring is a MODE, off by default, so a census that
  //      types a duplicate without arming it measures a board that was never asked to grade.
  const armed = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll<HTMLElement>(".controls-card .ctrl-btn"));
    const live = btns.find((b) => (b.textContent ?? "").trim() === "Live");
    if (!live) return false;
    live.click();
    return true;
  });
  bag.checkingArmed = armed;
  await page.waitForTimeout(400);

  // ── 1. CONFLICT (danger). Duplicate a given inside its own row.
  const dup = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll(".sudoku-cell"));
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(".sudoku-cell input"));
    const n = Math.round(Math.sqrt(cells.length));
    for (let r = 0; r < n; r++) {
      let given = "";
      let blank = -1;
      for (let c = 0; c < n; c++) {
        const i = r * n + c;
        if (inputs[i].value) given = given || inputs[i].value;
        else if (blank < 0) blank = i;
      }
      if (given && blank >= 0) return { blank, digit: given };
    }
    return null;
  });
  if (dup) {
    await typeInto(page, dup.blank, dup.digit);
    await page.waitForTimeout(600);
    bag.conflictRing = await read(page, ".game-cell.is-invalid .cell-ghost-path", [
      "stroke",
      "fill",
    ]);
    bag.conflictNote = await read(page, ".margin-note .teacher-red, .margin-note-ink", [
      "color",
      "font-family",
      "font-size",
    ]);
    bag.conflictNoteText = await page
      .locator(".margin-note")
      .first()
      .textContent()
      .catch(() => null);
    bag.conflictCellBg = await read(page, ".game-cell.is-invalid", ["background-color"]);
  }

  // ── 2. REFUSAL (T9-W1 §1.1): a write onto a GIVEN is refused and spoken.
  const givenIdx = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(".sudoku-cell input"));
    for (let i = 0; i < inputs.length; i++) if (inputs[i].readOnly || inputs[i].value) return i;
    return -1;
  });
  if (givenIdx >= 0) {
    await page.locator(".sudoku-cell").nth(givenIdx).click();
    await page.keyboard.type("9");
    await page.waitForTimeout(500);
    bag.refusalNote = await read(page, ".margin-note .teacher-red, .margin-note-ink", ["color"]);
    bag.refusalNoteText = await page
      .locator(".margin-note")
      .first()
      .textContent()
      .catch(() => null);
    bag.refusedCell = await read(page, ".game-cell.is-refused", ["background-color", "outline-color"]);
  }

  // ── 3. CONTROL FOCUS RING. Real keyboard focus, not a programmatic one: `:focus-visible`
  //      is the whole subject and `el.focus()` does not reliably arm it.
  const ringInfo = await page.evaluate(() => {
    const b = document.querySelector<HTMLElement>(".controls-card .ctrl-btn");
    if (!b) return null;
    b.focus();
    return { cls: b.className, label: b.getAttribute("aria-label") };
  });
  await page.keyboard.press("Tab");
  await page.waitForTimeout(250);
  bag.focusedControl = await page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    if (!a) return null;
    const cs = getComputedStyle(a);
    return {
      tag: a.tagName,
      cls: a.className,
      label: a.getAttribute("aria-label"),
      outlineColor: cs.outlineColor,
      outlineWidth: cs.outlineWidth,
      outlineStyle: cs.outlineStyle,
      outlineOffset: cs.outlineOffset,
      boxShadow: cs.boxShadow,
      borderRadius: cs.borderRadius,
      matchesFocusVisible: a.matches(":focus-visible"),
    };
  });
  bag.ringInfo = ringInfo;

  // Walk ten tab stops and bank every distinct focus paint the estate produces.
  const rings: unknown[] = [];
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    const r = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a || a === document.body) return null;
      const cs = getComputedStyle(a);
      return {
        cls: a.className?.toString().slice(0, 60),
        label: a.getAttribute("aria-label"),
        outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
        boxShadow: cs.boxShadow === "none" ? "" : cs.boxShadow.slice(0, 80),
        fv: a.matches(":focus-visible"),
      };
    });
    if (r) rings.push(r);
  }
  bag.tabRings = rings;

  // ── 4. SOLVED (celebration). A CLEAN board, re-DEALT (not re-loaded: the board persists
  //      across a navigation, so a goto would solve the very board the conflict above broke).
  await page.locator('.controls-card button[aria-label="Deal a new board"]').click();
  await page.waitForTimeout(2500);
  const solveBtn = page.locator('.controls-card button[aria-label="Solve puzzle"]');
  if (await solveBtn.count()) {
    await solveBtn.click();
    await page
      .waitForSelector(".board-wrapper.solve-success, .board-wrapper.solve-failure", {
        timeout: 25000,
      })
      .catch(() => {});
    await page.waitForTimeout(900);
    bag.solveClass = await page.locator(".board-wrapper").getAttribute("class");
    bag.solvedGridLine = await read(page, ".solve-success .grid-line", ["stroke"]);
    bag.failedGridLine = await read(page, ".solve-failure .grid-line", ["stroke"]);
    bag.verdictNote = await read(page, ".margin-note .gold-star, .margin-note .teacher-red", [
      "color",
    ]);
    bag.verdictText = await page
      .locator(".margin-note")
      .first()
      .textContent()
      .catch(() => null);
    bag.solverDigit = await read(page, ".sudoku-cell .glyph-svg path", ["stroke"]);
    bag.boardShadow = await read(page, ".board-wrapper", ["box-shadow"]);
  }

  // ── 5. GUARD RIBBON (confirm). Fresh page, dirty board, deal intent inside the deck.
  const p2 = page;
  await boot(p2);
  const blank = await p2.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector(".glyph-svg")) return i;
    return -1;
  });
  if (blank >= 0) {
    await typeInto(p2, blank, "1");
    await p2.waitForTimeout(400);
    await p2.locator("button.logo-trigger").click();
    await p2.waitForSelector(".gallery-viewport", { timeout: 15000 }).catch(() => {});
    await p2.waitForTimeout(700);
    await p2.locator(".gallery-viewport").press("ArrowRight").catch(() => {});
    await p2.locator(".gallery-viewport").press("d").catch(() => {});
    await p2.waitForTimeout(900);
    bag.guardVisible = await p2.locator(".gallery-guard").count();
    bag.guardFrame = await read(p2, ".guard-note-frame", [
      "background-color",
      "border-top-color",
      "color",
    ]);
    bag.guardNote = await read(p2, ".guard-note-text", ["color", "font-family", "font-size"]);
    bag.guardSub = await read(p2, ".guard-note-sub", ["color", "font-size"]);
    bag.guardKeepFace = await read(p2, ".guard-keep .guard-face", ["stroke", "fill"]);
    bag.guardLeaveFace = await read(p2, ".guard-leave .guard-face", ["stroke", "fill"]);
    bag.guardBtn = await read(p2, ".guard-btn", ["color", "background-color", "border-top-color"]);
    bag.guardText = await p2
      .locator(".gallery-guard")
      .first()
      .textContent()
      .catch(() => null);
    // The ribbon's own focus ring — a THIRD focus idiom if it differs from the board's and
    // the controls'.
    await p2.keyboard.press("Tab").catch(() => {});
    await p2.waitForTimeout(250);
    bag.guardFocusRing = await p2.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      const face = a?.querySelector?.(".guard-face") as HTMLElement | null;
      const t = face ?? a;
      if (!t) return null;
      const cs = getComputedStyle(t);
      return {
        cls: t.className,
        outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
        offset: cs.outlineOffset,
        fv: a?.matches(":focus-visible") ?? false,
      };
    });
  }

  writeFileSync(join(OUT, `states-${browserName}.json`), JSON.stringify(bag, null, 2));
});

test("accent states — a peer's digit in a peer's ink", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({ colorScheme: "light", reducedMotion: "reduce" });
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();

  const b = await ctx.newPage();
  await b.emulateMedia({ reducedMotion: "reduce" });
  await b.goto(link);
  await b.waitForSelector(".sudoku-cell", { timeout: 25000 });
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2, {
    timeout: 25000,
  });

  // B writes into a blank cell, through the estate's own setter recipe.
  const blank = await b.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector(".glyph-svg")) return i;
    return -1;
  });
  await b.locator(".sudoku-cell").nth(blank).click();
  await b.evaluate((idx: number) => {
    const input = document.querySelectorAll(".sudoku-cell input")[idx] as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    setter.call(input, "4");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, blank);

  await expect
    .poll(
      () =>
        a.evaluate(
          (i: number) =>
            (document.querySelectorAll(".sudoku-cell input")[i] as HTMLInputElement).value,
          blank,
        ),
      { timeout: 20000 },
    )
    .toBe("4");
  await a.waitForTimeout(900);

  const peer = await a.evaluate((i: number) => {
    const cell = document.querySelectorAll(".sudoku-cell")[i] as HTMLElement;
    const host = cell.closest(".game-cell") as HTMLElement | null;
    const carrier = (host ?? cell).querySelector("[style*='--color-user-ink']") as HTMLElement | null;
    const inkEl = carrier ?? host ?? cell;
    const path = (host ?? cell).querySelector(".glyph-svg path");
    return {
      inlineInk: inkEl.style.getPropertyValue("--color-user-ink"),
      hostInk: host?.style.getPropertyValue("--color-user-ink") ?? "",
      resolvedStroke: path ? getComputedStyle(path).stroke : "",
      resolvedInk: getComputedStyle(inkEl).getPropertyValue("--color-user-ink"),
      outerHTMLHead: (host ?? cell).outerHTML.slice(0, 260),
    };
  }, blank);

  // The hover tape (W3's handoff subject) — the one surface that names a hand.
  await a.locator(".sudoku-cell").nth(blank).hover().catch(() => {});
  await a.waitForTimeout(500);
  const tape = await a.evaluate(() => {
    const t = document.querySelector("[class*='author'],[class*='tape']") as HTMLElement | null;
    if (!t) return null;
    const cs = getComputedStyle(t);
    return { cls: t.className, color: cs.color, bg: cs.backgroundColor, text: t.textContent?.trim() };
  });

  // The join wash, armed at the moment a peer arrives (useJoinWash).
  const joinRing = await a.evaluate(() => {
    const el = document.querySelector("[class*='join'],[class*='wash']") as HTMLElement | null;
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { cls: el.className, stroke: cs.stroke, bg: cs.backgroundColor };
  });

  writeFileSync(
    join(OUT, `peer-${browserName}.json`),
    JSON.stringify({ engine: browserName, blank, peer, tape, joinRing }, null, 2),
  );
  await ctx.close();
});
