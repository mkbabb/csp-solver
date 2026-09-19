/** NOTE-LEDGER prototype probes — the shared driving verbs, on the REAL build. */
import { type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export const OUT =
  process.env.NL_OUT ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/NOTE-LEDGER/logs";
export const FRAMES =
  process.env.NL_FRAMES ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/NOTE-LEDGER/frames";
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

export const bank = (name: string, data: unknown) =>
  writeFileSync(join(OUT, name), JSON.stringify(data, null, 2));
export const r2 = (v: number) => Math.round(v * 100) / 100;

export const RIGS = [
  { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
  { name: "393x699", width: 393, height: 699, dsf: 3, mobile: true },
  { name: "390x664", width: 390, height: 664, dsf: 3, mobile: true },
  { name: "360x740", width: 360, height: 740, dsf: 3, mobile: true },
  { name: "900x500", width: 900, height: 500, dsf: 2, mobile: false },
  { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
];

export async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}

/** RECORD 1 — the hint you asked for. Focus an empty cell, press h. */
export async function armHint(page: Page, nth = 0) {
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

/** RECORD 2 — the refusal you earned. Type into a GIVEN cell (W1 §1.1). */
export async function armRefusal(page: Page) {
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
  await page.waitForTimeout(700);
}

/** A DIGIT — not a sentence. Writes into the nth empty cell. */
export async function typeDigit(page: Page, value = "5", nth = 3) {
  await page.evaluate(
    ([v, n]) => {
      const inputs = Array.from(
        document.querySelectorAll(".board-cells input"),
      ) as HTMLInputElement[];
      const empty = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
      const input = empty[Number(n)] ?? empty[0];
      if (!input) return;
      input.focus();
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setter.call(input, String(v));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    [value, String(nth)],
  );
  await page.waitForTimeout(600);
}

export async function setCellValue(page: Page, idx: number, val: string) {
  await page.evaluate(
    ([i, v]) => {
      const input = document.querySelectorAll(".board-cells input")[
        Number(i)
      ] as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setter.call(input, v);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    },
    [String(idx), val],
  );
}

/** Both lines of the ledger, as the page actually paints them. */
export const ledger = (page: Page) =>
  page.evaluate(() => {
    const live = document.querySelector(".board-margin .margin-note");
    const prev = document.querySelector(".board-margin .margin-note-previous");
    const cs = prev ? getComputedStyle(prev) : null;
    return {
      one: (live?.textContent || "").trim(),
      two: (prev?.textContent || "").trim(),
      twoMounted: !!prev,
      twoDisplay: cs?.display ?? null,
      twoColor: cs?.color ?? null,
      twoAriaHidden: prev?.getAttribute("aria-hidden") ?? null,
      tone: live?.className ?? "",
    };
  });

/** Every geometry the family lives on, in one read. */
export const geometry = (page: Page) =>
  page.evaluate(() => {
    const rect = (sel: string) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const round = (v: number) => Math.round(v * 100) / 100;
      return { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height), bottom: round(r.bottom) };
    };
    const ribbonEl =
      (document.querySelector("#fold-tools .play-controls") as HTMLElement | null) ||
      (document.querySelector(".play-controls") as HTMLElement | null);
    const r = ribbonEl?.getBoundingClientRect();
    const round = (v: number) => Math.round(v * 100) / 100;
    return {
      board: rect(".board-wrapper"),
      strip: rect(".board-margin"),
      block: rect(".margin-note-block"),
      lineOne: rect(".board-margin .margin-note"),
      lineTwo: rect(".board-margin .margin-note-previous"),
      errorCard: rect(".error-note"),
      ribbon: r ? { y: round(r.y), h: round(r.height), bottom: round(r.bottom) } : null,
      scrollHeight: document.scrollingElement?.scrollHeight ?? null,
      innerHeight: window.innerHeight,
    };
  });

export async function ctxFor(
  browser: import("@playwright/test").Browser,
  browserName: string,
  rig: (typeof RIGS)[number],
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
