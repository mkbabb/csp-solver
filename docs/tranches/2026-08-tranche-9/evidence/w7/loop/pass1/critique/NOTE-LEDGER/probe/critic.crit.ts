/**
 * NOTE-LEDGER pass-1 CRITIQUE probes — the rigs and poses the prototype did NOT measure.
 * Read-only on product files; runs against the lane's own worktree build on :4244.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/NOTE-LEDGER/readings";
const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/NOTE-LEDGER/frames";
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));
const r2 = (v: number) => Math.round(v * 100) / 100;

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}

async function armHint(page: Page, nth = 0) {
  await page.evaluate((n) => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    const empty = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
    (empty[n] ?? empty[0])?.focus();
  }, nth);
  await page.keyboard.press("h");
  await page.waitForTimeout(700);
}

async function armRefusal(page: Page) {
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
  await page.waitForTimeout(700);
}

async function typeDigit(page: Page, value = "5", nth = 3) {
  await page.evaluate(
    ([v, n]) => {
      const inputs = Array.from(
        document.querySelectorAll(".board-cells input"),
      ) as HTMLInputElement[];
      const empty = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
      const input = empty[Number(n)] ?? empty[0];
      if (!input) return;
      input.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(input, String(v));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    [value, String(nth)],
  );
  await page.waitForTimeout(600);
}

const ledger = (page: Page) =>
  page.evaluate(() => {
    const live = document.querySelector(".board-margin .margin-note");
    const prev = document.querySelector(".board-margin .margin-note-previous");
    const cs = prev ? getComputedStyle(prev) : null;
    const round = (v: number) => Math.round(v * 100) / 100;
    const rect = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: round(r.x),
        y: round(r.y),
        w: round(r.width),
        h: round(r.height),
        right: round(r.right),
        bottom: round(r.bottom),
      };
    };
    const strip = document.querySelector(".board-margin");
    const block = document.querySelector(".margin-note-block");
    return {
      one: (live?.textContent || "").trim(),
      two: (prev?.textContent || "").trim(),
      twoMounted: !!prev,
      twoDisplay: cs?.display ?? null,
      twoColor: cs?.color ?? null,
      twoWhiteSpace: cs?.whiteSpace ?? null,
      twoAriaHidden: prev?.getAttribute("aria-hidden") ?? null,
      // scrollWidth > clientWidth means the nowrap line is wider than its box.
      twoOverflows: prev ? (prev as HTMLElement).scrollWidth - (prev as HTMLElement).clientWidth : null,
      rects: {
        strip: rect(strip),
        block: rect(block),
        one: rect(live),
        two: rect(prev),
      },
      blockFlexWrap: block ? getComputedStyle(block).flexWrap : null,
      scrollHeight: document.scrollingElement?.scrollHeight ?? null,
      scrollWidth: document.scrollingElement?.scrollWidth ?? null,
      clientWidth: document.documentElement.clientWidth,
    };
  });

async function ctxFor(
  browser: Browser,
  browserName: string,
  rig: { width: number; height: number; dsf: number; mobile: boolean },
  theme: "light" | "dark" = "light",
  prm: "reduce" | "no-preference" = "reduce",
) {
  const ctx = await browser.newContext({
    viewport: { width: rig.width, height: rig.height },
    deviceScaleFactor: rig.dsf,
    isMobile: rig.mobile && browserName === "chromium",
    hasTouch: rig.mobile,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: prm, colorScheme: theme });
  return { ctx, page };
}

// ── C1 — THE DESK RIGS THE PROTOTYPE NEVER OPENED ────────────────────────────────────
// The trailing berth was measured at 1280x800 ONLY. The berth lives at >=1024, where the
// strip is the BOARD's width, and the board is narrower at 1024 than at 1280.
test("C1 the narrow desk", async ({ browser }, info) => {
  const rigs = [
    { name: "1024x768", width: 1024, height: 768, dsf: 2, mobile: false },
    { name: "1024x640", width: 1024, height: 640, dsf: 2, mobile: false },
    { name: "1100x700", width: 1100, height: 700, dsf: 2, mobile: false },
    { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
  ];
  const rows: unknown[] = [];
  for (const rig of rigs) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    const depth0 = await ledger(page);
    await armHint(page);
    const depth1 = await ledger(page);
    await armRefusal(page);
    const depth2 = await ledger(page);
    rows.push({
      rig: rig.name,
      engine: info.project.name,
      depth0: { scrollHeight: depth0.scrollHeight, strip: depth0.rects.strip },
      depth1: { one: depth1.one, two: depth1.two, scrollHeight: depth1.scrollHeight },
      depth2: {
        one: depth2.one,
        two: depth2.two,
        twoDisplay: depth2.twoDisplay,
        twoOverflows: depth2.twoOverflows,
        blockFlexWrap: depth2.blockFlexWrap,
        strip: depth2.rects.strip,
        lineOne: depth2.rects.one,
        lineTwo: depth2.rects.two,
        // The overlay strip is inset 0.25rem from the board; anything past its right edge
        // is painted OUTSIDE the column the strip was given.
        overhangPx:
          depth2.rects.two && depth2.rects.strip
            ? r2(depth2.rects.two.right - depth2.rects.strip.right)
            : null,
        scrollHeight: depth2.scrollHeight,
        scrollWidth: depth2.scrollWidth,
        clientWidth: depth2.clientWidth,
      },
    });
    if (rig.name === "1024x768" && info.project.name === "chromium") {
      const el = await page.$(".board-margin");
      const box = await el!.boundingBox();
      if (box)
        await page.screenshot({
          path: join(FRAMES, "1024x768-light-trailing-berth-chromium.png"),
          clip: {
            x: Math.max(0, box.x - 8),
            y: Math.max(0, box.y - 8),
            width: Math.min(rig.width, box.width + 16),
            height: box.height + 16,
          },
        });
    }
    await ctx.close();
  }
  bank(`C1-narrow-desk-${info.project.name}.json`, rows);
});

// ── C2 — THE ORPHAN DEICTIC ──────────────────────────────────────────────────────────
// The hint's sentence is "only N fits here". HERE is the highlighted cell. The model still
// nulls the reasoning on a write, so the HIGHLIGHT leaves; under the ledger the SENTENCE
// stays. Does the strip end up pointing at nothing?
test("C2 the orphan deictic", async ({ browser }, info) => {
  const rig = { width: 390, height: 844, dsf: 3, mobile: true };
  const { ctx, page } = await ctxFor(browser, info.project.name, rig);
  await boardReady(page);
  const highlights = () =>
    page.evaluate(() => ({
      because: document.querySelectorAll(".cell-because, [data-because='true']").length,
      hintMarked: document.querySelectorAll("[data-hint-cell], .is-hint, .hint-cell").length,
      selected: document.querySelectorAll(".board-cells input:focus").length,
    }));
  await armHint(page);
  const afterHint = { ...(await ledger(page)), highlights: await highlights() };
  await typeDigit(page, "5", 4);
  const afterDigit = { ...(await ledger(page)), highlights: await highlights() };
  // And now the reader looks somewhere else entirely.
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    const empty = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
    empty[empty.length - 1]?.focus();
  });
  await page.waitForTimeout(400);
  const afterMove = { ...(await ledger(page)), highlights: await highlights() };
  bank(`C2-orphan-${info.project.name}.json`, {
    engine: info.project.name,
    afterHint: { one: afterHint.one, two: afterHint.two, highlights: afterHint.highlights },
    afterDigit: {
      one: afterDigit.one,
      two: afterDigit.two,
      highlights: afterDigit.highlights,
    },
    afterMove: { one: afterMove.one, two: afterMove.two, highlights: afterMove.highlights },
  });
  await ctx.close();
});

// ── C3 — THE GRADE LEAVES: LINE ONE EMPTY, LINE TWO STANDING ────────────────────────
// A declared STATE with no frame in the prototype's six. What does the strip look like
// when the top rung is blank and the quiet rung is not?
test("C3 the hole in the column", async ({ browser }, info) => {
  const rig = { width: 390, height: 844, dsf: 3, mobile: true };
  const { ctx, page } = await ctxFor(browser, info.project.name, rig);
  await boardReady(page);
  await armHint(page); // record
  // Force a conflict verdict: duplicate a digit in a row, then run solve → 'failed'.
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    const empty = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!;
    // two identical digits, as near each other as the empties allow
    for (const i of [0, 1]) {
      const input = empty[i];
      if (!input) continue;
      input.focus();
      setter.call(input, "9");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  await page.waitForTimeout(900);
  const afterDupes = await ledger(page);
  bank(`C3-hole-${info.project.name}.json`, {
    engine: info.project.name,
    afterDupes: {
      one: afterDupes.one,
      two: afterDupes.two,
      rects: afterDupes.rects,
      twoDisplay: afterDupes.twoDisplay,
    },
  });
  if (info.project.name === "chromium") {
    const el = await page.$(".board-margin");
    const box = await el!.boundingBox();
    if (box)
      await page.screenshot({
        path: join(FRAMES, "390x844-grade-pose-chromium.png"),
        clip: {
          x: Math.max(0, box.x - 6),
          y: Math.max(0, box.y - 30),
          width: Math.min(rig.width, box.width + 12),
          height: box.height + 60,
        },
      });
  }
  await ctx.close();
});

// ── C4 — PHONE LANDSCAPE: THE RECORD THE BALLOT DELETES ─────────────────────────────
test("C4 the landscape hole", async ({ browser }, info) => {
  const rigs = [
    { name: "844x390", width: 844, height: 390, dsf: 3, mobile: true },
    { name: "900x500", width: 900, height: 500, dsf: 2, mobile: false },
  ];
  const rows: unknown[] = [];
  for (const rig of rigs) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    await armHint(page);
    await armRefusal(page);
    const l = await ledger(page);
    rows.push({
      rig: rig.name,
      engine: info.project.name,
      one: l.one,
      two: l.two,
      twoMounted: l.twoMounted,
      twoDisplay: l.twoDisplay,
      scrollHeight: l.scrollHeight,
      innerHeight: rig.height,
    });
    await ctx.close();
  }
  bank(`C4-landscape-${info.project.name}.json`, rows);
});

// ── C5 — THE PAINTED RUNGS, COMPUTED, AND THE FILTER CENSUS ─────────────────────────
test("C5 contrast and pi", async ({ browser }, info) => {
  for (const theme of ["light", "dark"] as const) {
    const rig = { width: 390, height: 844, dsf: 3, mobile: true };
    const { ctx, page } = await ctxFor(browser, info.project.name, rig, theme);
    await boardReady(page);
    await armHint(page);
    await armRefusal(page);
    const read = await page.evaluate(() => {
      const parse = (c: string): [number, number, number, number] => {
        const m = c.match(/[\d.]+/g)!.map(Number);
        return [m[0], m[1], m[2], m.length > 3 ? m[3] : 1];
      };
      const lin = (v: number) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      const L = (rgb: number[]) =>
        0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
      const ratio = (a: number[], b: number[]) => {
        const la = L(a),
          lb = L(b);
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
      };
      // The paper under the strip.
      const bg = parse(getComputedStyle(document.body).backgroundColor);
      const over = (fg: [number, number, number, number]) => [
        fg[0] * fg[3] + bg[0] * (1 - fg[3]),
        fg[1] * fg[3] + bg[1] * (1 - fg[3]),
        fg[2] * fg[3] + bg[2] * (1 - fg[3]),
      ];
      const one = document.querySelector(".board-margin .margin-note") as HTMLElement;
      const two = document.querySelector(
        ".board-margin .margin-note-previous",
      ) as HTMLElement;
      const cOne = parse(getComputedStyle(one).color);
      const cTwo = two ? parse(getComputedStyle(two).color) : null;
      const filters = document.querySelectorAll("filter").length;
      const inFilter = document.querySelectorAll("[filter], [style*='filter']").length;
      return {
        background: bg,
        lineOneColor: cOne,
        lineOneRatio: Math.round(ratio(over(cOne), bg) * 100) / 100,
        lineTwoColor: cTwo,
        lineTwoRatio: cTwo ? Math.round(ratio(over(cTwo), bg) * 100) / 100 : null,
        filterDefs: filters,
        filterConsumers: inFilter,
      };
    });
    bank(`C5-ink-${theme}-${info.project.name}.json`, {
      engine: info.project.name,
      theme,
      ...read,
    });
    await ctx.close();
  }
});
