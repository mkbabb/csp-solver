/**
 * NOTE-LEDGER pass-2 CRITIQUE probe — the critic's own readings on the prototype's worktree
 * (wf_8630d340-e56-47) served on :4237. Banks to this lane's own logs dir.
 *
 * C1 — THE CANONICAL LOOP: ask a hint, then DO what it says. Does the ledger ever hold two?
 * C2 — THE HOUSE OVER-STRIKE: a hidden single's record vs a digit elsewhere in its house.
 * C3 — L5 clearance, re-measured (the prototype's one red).
 * C4 — painted AA on line two, both themes, computed here.
 * C5 — pi: live filter census + board y at depth 0/1/2.
 */
import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

const PHONE = { width: 390, height: 844, dsf: 3, mobile: true };

async function ctxFor(
  browser: Browser,
  browserName: string,
  rig = PHONE,
  scheme: "light" | "dark" = "light",
) {
  const ctx = await browser.newContext({
    viewport: { width: rig.width, height: rig.height },
    deviceScaleFactor: rig.dsf,
    isMobile: rig.mobile && browserName === "chromium",
    hasTouch: rig.mobile,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: scheme });
  return { ctx, page };
}

async function boardReady(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}

const LINES_FN = () => ({
  one: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
  two:
    document.querySelector(".board-margin .margin-note-previous")?.textContent?.trim() ??
    null,
  twoCount: document.querySelectorAll(".board-margin .margin-note-previous").length,
});

/** Focus open cell #n (by index among open cells) and press h. */
async function armHintAt(page: Page, nth: number) {
  await page.evaluate((k) => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    const open = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
    open[k % open.length]?.focus();
  }, nth);
  await page.keyboard.press("h");
  await page.waitForTimeout(700);
}

const WRITE_FN = (arg: { i: number; v: string }) => {
  const inputs = Array.from(
    document.querySelectorAll(".board-cells input"),
  ) as HTMLInputElement[];
  const el = inputs[arg.i];
  if (!el || el.readOnly || el.disabled) return false;
  el.focus();
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  setter.call(el, arg.v);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
};

/** index of the focused cell input, plus the because set. */
const STATE_FN = () => {
  const inputs = Array.from(
    document.querySelectorAll(".board-cells input"),
  ) as HTMLInputElement[];
  const focused = inputs.indexOf(document.activeElement as HTMLInputElement);
  const because: number[] = [];
  inputs.forEach((el, i) => {
    const cell = el.closest(".game-cell") ?? el.parentElement;
    if (cell?.querySelector(".cell-because")) because.push(i);
  });
  const openBecause = because.filter((i) => !inputs[i].value);
  return { focused, because, openBecause, values: inputs.map((i) => i.value) };
};

// ── C1 · THE CANONICAL LOOP ───────────────────────────────────────────────────────────────
test("C1 the canonical loop: ask a hint, then do what it says, twice", async ({
  browser,
}, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name);
  await boardReady(page);
  const steps: unknown[] = [];

  for (let round = 0; round < 3; round++) {
    await armHintAt(page, 0);
    const armed = await page.evaluate(() => ({
      lines: {
        one: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
        two:
          document
            .querySelector(".board-margin .margin-note-previous")
            ?.textContent?.trim() ?? null,
      },
      st: (() => {
        const inputs = Array.from(
          document.querySelectorAll(".board-cells input"),
        ) as HTMLInputElement[];
        const focused = inputs.indexOf(document.activeElement as HTMLInputElement);
        return { focused };
      })(),
    }));
    // The digit the sentence names.
    const digit = (armed.lines.one.match(/\d+/) ?? ["1"])[0];
    const wrote = await page.evaluate(WRITE_FN, { i: armed.st.focused, v: digit });
    await page.waitForTimeout(600);
    const after = await page.evaluate(LINES_FN);
    steps.push({ round, armed: armed.lines, cell: armed.st.focused, digit, wrote, after });
  }
  bank(`C1-canonical-loop-${info.project.name}.json`, {
    engine: info.project.name,
    steps,
    verdict:
      steps.every((s: any) => !s.after.two) && steps.every((s: any) => s.after.one === "")
        ? "THE LEDGER NEVER ACCUMULATES ON THE CANONICAL LOOP"
        : "accumulates",
  });
  await ctx.close();
});

// ── C2 · THE HOUSE OVER-STRIKE ────────────────────────────────────────────────────────────
test("C2 a hidden single's record vs a digit elsewhere in its house", async ({
  browser,
}, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name);
  await boardReady(page);
  const tries: unknown[] = [];
  let found: any = null;
  for (let k = 0; k < 14 && !found; k++) {
    await armHintAt(page, k);
    const s = await page.evaluate(() => ({
      line: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
      ...(() => {
        const inputs = Array.from(
          document.querySelectorAll(".board-cells input"),
        ) as HTMLInputElement[];
        const focused = inputs.indexOf(document.activeElement as HTMLInputElement);
        const because: number[] = [];
        inputs.forEach((el, i) => {
          const cell = el.closest(".game-cell") ?? el.parentElement;
          if (cell?.querySelector(".cell-because")) because.push(i);
        });
        return {
          focused,
          because,
          openBecause: because.filter((i) => !inputs[i].value),
        };
      })(),
    }));
    tries.push({ k, line: s.line, because: s.because.length, openBecause: s.openBecause });
    if (/goes nowhere else/.test(s.line) && s.openBecause.filter((i) => i !== s.focused).length)
      found = s;
  }
  let result: unknown = { found: false };
  if (found) {
    const target = found.openBecause.filter((i: number) => i !== found.focused)[0];
    // Write a digit that is NOT the sentence's digit, into an OPEN cell of the same house
    // that is not the sentence's own square. The sentence stays true; does it stay?
    const digit = (found.line.match(/\d+/) ?? ["1"])[0];
    const other = String(((Number(digit) % 9) + 1) as number);
    const wrote = await page.evaluate(WRITE_FN, { i: target, v: other });
    await page.waitForTimeout(600);
    const after = await page.evaluate(LINES_FN);
    result = {
      found: true,
      sentence: found.line,
      sentenceCell: found.focused,
      houseOpenCells: found.openBecause.length,
      wroteInto: target,
      wroteDigit: other,
      wrote,
      after,
      verdict:
        after.one === ""
          ? "STRUCK — a still-true sentence died because an unrelated digit landed in its house"
          : "stands",
    };
  }
  bank(`C2-house-overstrike-${info.project.name}.json`, {
    engine: info.project.name,
    tries,
    result,
  });
  await ctx.close();
});

// ── C3 · L5 CLEARANCE, re-measured ────────────────────────────────────────────────────────
test("C3 the clearance, two lines deep, four phone rigs", async ({ browser }, info) => {
  const rigs = [
    { width: 360, height: 740, dsf: 3, mobile: true },
    { width: 390, height: 844, dsf: 3, mobile: true },
    { width: 393, height: 699, dsf: 3, mobile: true },
    { width: 390, height: 664, dsf: 3, mobile: true },
  ];
  const rows: unknown[] = [];
  for (const rig of rigs) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    await armHintAt(page, 0);
    // A refusal on a given: a second SENTENCE, which pushes the hint down.
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".board-cells input"),
      ) as HTMLInputElement[];
      const given = inputs.find((i) => i.value);
      if (!given) return;
      given.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(given, "7");
      given.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(900);
    const m = await page.evaluate(() => {
      const two = document.querySelector(
        ".board-margin .margin-note-previous",
      ) as HTMLElement | null;
      const strip = document.querySelector(".board-margin") as HTMLElement | null;
      const ribbon = document.querySelector("#fold-tools") as HTMLElement | null;
      const r = (e: Element | null) => (e ? e.getBoundingClientRect() : null);
      const twoR = r(two);
      const ribR = r(ribbon);
      // The first painted box below the strip's foot, honestly found.
      const stripR = r(strip);
      let firstBelow: { sel: string; top: number } | null = null;
      if (stripR) {
        for (const el of Array.from(document.querySelectorAll("body *"))) {
          const b = el.getBoundingClientRect();
          if (b.width < 8 || b.height < 8) continue;
          if (b.top >= (twoR?.bottom ?? stripR.bottom) - 0.01 && b.top < 10000) {
            const cs = getComputedStyle(el);
            if (cs.visibility === "hidden" || cs.display === "none") continue;
            if (!firstBelow || b.top < firstBelow.top)
              firstBelow = {
                sel: el.className?.toString().slice(0, 60) || el.tagName,
                top: b.top,
              };
          }
        }
      }
      return {
        lines: {
          one:
            document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
          two: two?.textContent?.trim() ?? null,
        },
        twoRect: twoR && { top: twoR.top, bottom: twoR.bottom, height: twoR.height },
        stripRect: stripR && { top: stripR.top, bottom: stripR.bottom },
        ribbonRect: ribR && { top: ribR.top, height: ribR.height, width: ribR.width },
        clearanceToRibbon: twoR && ribR ? ribR.top - twoR.bottom : null,
        firstBelow,
        clearanceToFirstBelow: twoR && firstBelow ? firstBelow.top - twoR.bottom : null,
        fontSize: two ? getComputedStyle(two).fontSize : null,
      };
    });
    rows.push({ rig: `${rig.width}x${rig.height}`, ...m });
    await ctx.close();
  }
  bank(`C3-clearance-${info.project.name}.json`, { engine: info.project.name, rows });
  await ctx.close;
});

// ── C4 · AA, computed here ────────────────────────────────────────────────────────────────
test("C4 painted contrast on line two, both themes", async ({ browser }, info) => {
  const out: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    const { ctx, page } = await ctxFor(browser, info.project.name, PHONE, scheme);
    await boardReady(page);
    await armHintAt(page, 0);
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".board-cells input"),
      ) as HTMLInputElement[];
      const given = inputs.find((i) => i.value);
      if (!given) return;
      given.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(given, "7");
      given.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(900);
    const m = await page.evaluate(() => {
      const parse = (c: string) => {
        const m = c.match(/[\d.]+/g)!.map(Number);
        return [m[0], m[1], m[2]] as [number, number, number];
      };
      const lin = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      const L = (rgb: [number, number, number]) =>
        0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
      const ratio = (a: string, b: string) => {
        const la = L(parse(a)),
          lb = L(parse(b));
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
      };
      const two = document.querySelector(
        ".board-margin .margin-note-previous",
      ) as HTMLElement | null;
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      const rootBg = getComputedStyle(document.documentElement).backgroundColor;
      // The surface actually behind the note: walk up for the first non-transparent bg.
      let el: HTMLElement | null = two;
      let behind = "rgb(255, 255, 255)";
      while (el) {
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) {
          behind = bg;
          break;
        }
        el = el.parentElement;
      }
      const color = two ? getComputedStyle(two).color : null;
      const oneColor = document.querySelector(".board-margin .margin-note")
        ? getComputedStyle(document.querySelector(".board-margin .margin-note")!).color
        : null;
      return {
        twoText: two?.textContent?.trim() ?? null,
        color,
        behind,
        bodyBg,
        rootBg,
        ratioBehind: color ? ratio(color, behind) : null,
        ratioBody: color ? ratio(color, bodyBg) : null,
        oneColor,
        ratioOne: oneColor ? ratio(oneColor, bodyBg) : null,
        fontSize: two ? getComputedStyle(two).fontSize : null,
        letterSpacing: two ? getComputedStyle(two).letterSpacing : null,
        lineHeight: two ? getComputedStyle(two).lineHeight : null,
        fontFamily: two ? getComputedStyle(two).fontFamily : null,
        whiteSpace: two ? getComputedStyle(two).whiteSpace : null,
        overflow: two ? getComputedStyle(two).overflow : null,
        userSelect: two ? getComputedStyle(two).userSelect : null,
      };
    });
    out.push({ scheme, ...m });
    await ctx.close();
  }
  bank(`C4-contrast-${info.project.name}.json`, { engine: info.project.name, out });
});

// ── C5 · PI: the filter census and the board's y at three depths ──────────────────────────
test("C5 pi — filter census and board y at depth 0/1/2", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name);
  await boardReady(page);
  const census = async () =>
    page.evaluate(() => {
      let n = 0;
      for (const el of Array.from(document.querySelectorAll("*"))) {
        const f = getComputedStyle(el).filter;
        if (f && f !== "none") n++;
      }
      const b = document.querySelector('[role="grid"]')?.getBoundingClientRect();
      return {
        liveFilterTotal: n,
        boardY: b ? Math.round(b.top * 100) / 100 : null,
        lines: {
          one:
            document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
          two:
            document
              .querySelector(".board-margin .margin-note-previous")
              ?.textContent?.trim() ?? null,
        },
        scrollHeight: document.documentElement.scrollHeight,
      };
    });
  const d0 = await census();
  await armHintAt(page, 0);
  const d1 = await census();
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    const given = inputs.find((i) => i.value);
    if (!given) return;
    given.focus();
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    setter.call(given, "7");
    given.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(900);
  const d2 = await census();
  bank(`C5-pi-${info.project.name}.json`, { engine: info.project.name, d0, d1, d2 });
  await ctx.close();
});
