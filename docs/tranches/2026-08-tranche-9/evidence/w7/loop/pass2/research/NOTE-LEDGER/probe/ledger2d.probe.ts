/**
 * NOTE-LEDGER · pass-2 RESEARCH probe, part four.
 *
 *   R11  WHICH FACE PAINTS THE RECORD'S GLYPH. `toDisplayChar` returns A-G at 16x16
 *        (`glyphRegistry.ts:64-70`) and the hand's subset declares only C, R and S among the
 *        uppercase (`index.css:93-96`), so six of the sixteen value glyphs a hint can name
 *        may be painting in the fallback face — in the margin, at HEAD. Measured two ways:
 *        `document.fonts.check` (which honours `unicode-range`) and the painted advance.
 *   R12  the deixis-free copy candidates, priced at 360 against the strip, with their
 *        codepoints checked against the hand's cut.
 *   R13  the error pose with line two FORCED visible — what `hidePrevious` is worth in px.
 */
import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

const INIT = `
  (() => {
    const Real = window.Worker;
    window.__workers = [];
    window.__breakSolver = false;
    function Wrapped(url, opts) {
      const w = new Real(url, opts);
      window.__workers.push(w);
      if (window.__breakSolver)
        setTimeout(() => { try { w.dispatchEvent(new ErrorEvent("error", { message: "induced" })); } catch (e) {} }, 0);
      return w;
    }
    Wrapped.prototype = Real.prototype;
    window.Worker = Wrapped;
  })();
`;

async function boardReady(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}
async function focusEmpty(page: Page, n: number) {
  await page.evaluate((k: number) => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    inputs.filter((i) => !i.value && !i.readOnly && !i.disabled)[k]?.focus();
  }, n);
}
async function twoDeep(page: Page) {
  await focusEmpty(page, 0);
  await page.keyboard.press("h");
  await page.waitForTimeout(600);
  await page.keyboard.press("h");
  await page.waitForTimeout(600);
  await focusEmpty(page, 3);
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
}
async function ctxFor(
  browser: Browser,
  browserName: string,
  rig: { width: number; height: number; dsf: number; mobile: boolean },
  init?: string,
) {
  const ctx = await browser.newContext({
    viewport: { width: rig.width, height: rig.height },
    deviceScaleFactor: rig.dsf,
    isMobile: rig.mobile && browserName === "chromium",
    hasTouch: rig.mobile,
  });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  return { ctx, page };
}

const PHONE = { name: "360x740", width: 360, height: 740, dsf: 3, mobile: true };

test("R11 which face paints the record's glyph", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, PHONE);
  await boardReady(page);
  await twoDeep(page);
  const row = await page.evaluate(() => {
    const round = (x: number) => Math.round(x * 100) / 100;
    const host = document.querySelector(".margin-note-previous") as HTMLElement;
    const cs = getComputedStyle(host);
    const fam = cs.fontFamily;
    const size = cs.fontSize;
    const w = (s: string) => {
      const keep = host.textContent;
      host.textContent = s;
      const r = document.createRange();
      r.selectNodeContents(host.firstChild!);
      const b = r.getBoundingClientRect().width;
      host.textContent = keep;
      return round(b);
    };
    const glyphs = "123456789ABCDEFG".split("");
    const rows = glyphs.map((g) => ({
      glyph: g,
      cp: "U+" + g.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0"),
      inHandCut: document.fonts.check(`${size} "Patrick Hand"`, g),
      advance: round(w(`x${g}x`) - w("xx")),
      sentence: w(`${g} goes nowhere else in this column`),
    }));
    // The characters the record vocabulary spends, each checked against the hand's cut.
    const chars = Array.from(
      new Set(
        (
          "only fits here goes nowhere else in this row column box group " +
          "the answer is that's a given clue the board is clear " +
          "this shared link couldn't be read 0123456789ABCDEFG,"
        ).split(""),
      ),
    );
    const uncovered = chars.filter((c) => !document.fonts.check(`${size} "Patrick Hand"`, c));
    return {
      fontFamily: fam,
      fontSize: size,
      glyphs: rows,
      uncoveredInVocabulary: uncovered.map((c) => ({
        c,
        cp: "U+" + c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0"),
      })),
    };
  });
  bank(`R11-face-${info.project.name}.json`, row);
  await ctx.close();
});

test("R12 deixis-free copy candidates, priced", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, PHONE);
  await boardReady(page);
  await twoDeep(page);
  const CANDIDATES = [
    "only 4 fits here",
    "only 4 fits in row 4 column 7",
    "only 4 fits in row 4, column 7",
    "4 goes nowhere else in this column",
    "4 goes nowhere else in column 7",
    "4 went nowhere else in that column",
    "asked for a hint",
    "you asked; only 4 fit",
    "the answer is 4",
    "the answer was 4",
    "D goes nowhere else in this column",
    "D goes nowhere else in that column",
  ];
  const row = await page.evaluate((cands: string[]) => {
    const round = (x: number) => Math.round(x * 100) / 100;
    const host = document.querySelector(".margin-note-previous") as HTMLElement;
    const size = getComputedStyle(host).fontSize;
    const strip = round(
      (document.querySelector(".board-margin") as HTMLElement).getBoundingClientRect()
        .width,
    );
    const keep = host.textContent;
    const out = cands.map((s) => {
      host.textContent = s;
      const r = document.createRange();
      r.selectNodeContents(host.firstChild!);
      const ink = round(r.getBoundingClientRect().width);
      const missing = Array.from(new Set(s.split(""))).filter(
        (c) => !document.fonts.check(`${size} "Patrick Hand"`, c),
      );
      return {
        s,
        ink,
        headroomPx: round(strip - ink),
        headroomPct: round(((strip - ink) / strip) * 100),
        missingCodepoints: missing,
      };
    });
    host.textContent = keep;
    return { strip, out };
  }, CANDIDATES);
  bank(`R12-copy-candidates-${info.project.name}.json`, row);
  await ctx.close();
});

test("R13 what hidePrevious is worth in px", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(
    browser,
    info.project.name,
    { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
    INIT,
  );
  await boardReady(page);
  await twoDeep(page);
  const depth2 = await page.evaluate(() => {
    const round = (x: number) => Math.round(x * 100) / 100;
    const b = (s: string) => {
      const e = document.querySelector(s) as HTMLElement | null;
      return e ? round(e.getBoundingClientRect().y) : null;
    };
    return {
      board: b(".board-wrapper"),
      strip: b(".board-margin"),
      stripH: round(
        (document.querySelector(".board-margin") as HTMLElement).getBoundingClientRect()
          .height,
      ),
      scrollHeight: document.scrollingElement!.scrollHeight,
    };
  });
  await page.evaluate(() => {
    (window as any).__breakSolver = true;
    ((window as any).__workers as Worker[]).forEach((w) => {
      try {
        w.dispatchEvent(new ErrorEvent("error", { message: "induced" }));
      } catch {
        /* ignore */
      }
    });
  });
  await page.locator(".drawer-tab").first().click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(1100);
  await page
    .locator('[aria-label="Solve puzzle"]')
    .first()
    .click({ force: true, timeout: 10000 })
    .catch(() => undefined);
  await page.waitForTimeout(2500);
  const read = () =>
    page.evaluate(() => {
      const round = (x: number) => Math.round(x * 100) / 100;
      const g = (s: string) => {
        const e = document.querySelector(s) as HTMLElement | null;
        if (!e) return null;
        const b = e.getBoundingClientRect();
        return { y: round(b.y), h: round(b.height), display: getComputedStyle(e).display };
      };
      return {
        board: g(".board-wrapper"),
        strip: g(".board-margin"),
        card: g("[role='alert']"),
        two: g(".margin-note-previous"),
        scrollHeight: document.scrollingElement!.scrollHeight,
        innerHeight: window.innerHeight,
        ribbon: g("#fold-tools"),
      };
    });
  const hidden = await read();
  // Force line two back into the pose the design is choosing against.
  await page.evaluate(() => {
    const e = document.querySelector(".margin-note-previous") as HTMLElement;
    if (e) e.style.setProperty("display", "block", "important");
  });
  await page.waitForTimeout(300);
  const shown = await read();
  bank(`R13-hidePrevious-${info.project.name}.json`, { depth2, hidden, shown });
  await ctx.close();
});

/**
 * R15 — the ONE frame the `hidePrevious` ruling rests on: the error card and the aged line in
 * the same 14.41px, with the sheet shut. Chromium only; the geometry is banked for both.
 */
test("R15 the overlap the card and the aged line share", async ({ browser }, info) => {
  test.skip(info.project.name !== "chromium", "one frame, one engine");
  const { ctx, page } = await ctxFor(
    browser,
    info.project.name,
    { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
    INIT,
  );
  await boardReady(page);
  await twoDeep(page);
  await page.evaluate(() => {
    (window as any).__breakSolver = true;
    ((window as any).__workers as Worker[]).forEach((w) => {
      try {
        w.dispatchEvent(new ErrorEvent("error", { message: "induced" }));
      } catch {
        /* ignore */
      }
    });
  });
  await page.locator(".drawer-tab").first().click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(1100);
  await page
    .locator('[aria-label="Solve puzzle"]')
    .first()
    .click({ force: true, timeout: 10000 })
    .catch(() => undefined);
  await page.waitForTimeout(2200);
  // Shut the sheet — the dock SLIDES, so settle before shooting.
  await page.keyboard.press("Escape").catch(() => undefined);
  await page.locator(".drawer-tab").first().click({ force: true }).catch(() => undefined);
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const e = document.querySelector(".margin-note-previous") as HTMLElement;
    if (e) e.style.setProperty("display", "block", "important");
  });
  await page.waitForTimeout(250);
  const geom = await page.evaluate(() => {
    const round = (x: number) => Math.round(x * 100) / 100;
    const g = (s: string) => {
      const e = document.querySelector(s) as HTMLElement | null;
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return { y: round(b.y), bottom: round(b.bottom), h: round(b.height) };
    };
    const two = g(".margin-note-previous");
    const card = g("[role='alert']");
    const sheet = g(".controls-card");
    return {
      two,
      card,
      sheet,
      overlapPx: two && card ? round(Math.min(two.bottom, card.bottom) - Math.max(two.y, card.y)) : null,
    };
  });
  const strip = page.locator(".board-margin");
  const box = await strip.boundingBox();
  if (box)
    await page.screenshot({
      path: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/NOTE-LEDGER/frames/390-card-over-aged-line.png",
      clip: { x: box.x, y: box.y - 4, width: box.width, height: Math.min(box.height + 8, 100) },
    });
  bank(`R15-overlap-${info.project.name}.json`, geom);
  await ctx.close();
});
