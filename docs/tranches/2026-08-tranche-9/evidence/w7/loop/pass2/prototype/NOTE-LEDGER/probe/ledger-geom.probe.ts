/**
 * NOTE-LEDGER · pass-2 PROTOTYPE probe 1 — geometry, width, contrast, a11y.
 *
 * Drives THIS lane's worktree (wf_8630d340-e56-47) on :4249, the build where line two sits at
 * the tally's tier. Gates measured here: L1, L2, L3, L4, L5, L6, L10-W, L14, and the painted
 * contrast rows. Banks to this lane's own dir; nothing under r0/ or pass1/ is touched.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

const GLYPHS = "123456789ABCDEFG".split("");
const HOUSES = ["row", "column", "box", "group"];

function vocabulary(): string[] {
  const v: string[] = [];
  for (const g of GLYPHS) v.push(`only ${g} fits here`);
  for (const g of GLYPHS) for (const h of HOUSES) v.push(`${g} goes nowhere else in this ${h}`);
  for (const g of GLYPHS) v.push(`the answer is ${g}`);
  v.push("that's a given clue", "the board is clear", "this shared link couldn't be read");
  return v;
}

async function boardReady(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}
async function armHint(page: Page) {
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    inputs.filter((i) => !i.value && !i.readOnly && !i.disabled)[0]?.focus();
  });
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
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    setter.call(given, "7");
    given.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(700);
}
async function ctxFor(
  browser: Browser,
  browserName: string,
  rig: { width: number; height: number; dsf: number; mobile: boolean },
  scheme: "light" | "dark" = "light",
) {
  const ctx = await browser.newContext({
    viewport: { width: rig.width, height: rig.height },
    deviceScaleFactor: rig.dsf,
    isMobile: rig.mobile && browserName === "chromium",
    hasTouch: rig.mobile,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
  return { ctx, page };
}

const RIGS = [
  { name: "360x740", width: 360, height: 740, dsf: 3, mobile: true },
  { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
  { name: "393x699", width: 393, height: 699, dsf: 3, mobile: true },
  { name: "390x664", width: 390, height: 664, dsf: 3, mobile: true },
  { name: "844x390", width: 844, height: 390, dsf: 3, mobile: true },
  { name: "900x500", width: 900, height: 500, dsf: 2, mobile: true },
  { name: "1024x768", width: 1024, height: 768, dsf: 2, mobile: false },
  { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
];

/** One read of the whole column: the two lines, the board, the fold, the clearance. */
const READ = () => {
  const r = (x: number) => Math.round(x * 100) / 100;
  const q = <T extends Element>(s: string) => document.querySelector(s) as T | null;
  const strip = q<HTMLElement>(".board-margin");
  const block = q<HTMLElement>(".margin-note-block");
  const one = q<HTMLElement>(".board-margin .margin-note");
  const two = q<HTMLElement>(".board-margin .margin-note-previous");
  const meta = q<HTMLElement>(".board-margin .margin-note-meta");
  const board = q<HTMLElement>('[role="grid"]');
  const ribbon = q<HTMLElement>("#fold-tools");
  const panel = q<HTMLElement>(".control-panel-filtered");
  const box = (e: Element | null) => {
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return { x: r(b.x), y: r(b.y), w: r(b.width), h: r(b.height), bottom: r(b.bottom) };
  };
  const cs = two ? getComputedStyle(two) : null;
  return {
    scrollHeight: document.documentElement.scrollHeight,
    strip: box(strip),
    block: box(block),
    one: box(one),
    two: box(two),
    meta: box(meta),
    board: box(board),
    ribbon: box(ribbon),
    panel: box(panel),
    twoText: two?.textContent?.trim() ?? null,
    oneText: one?.textContent?.trim() ?? null,
    twoStyle: cs && {
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
      display: cs.display,
      position: cs.position,
      flexBasis: cs.flexBasis,
      overflow: cs.overflow,
      textOverflow: cs.textOverflow,
      userSelect: cs.userSelect,
      pointerEvents: cs.pointerEvents,
      animationDuration: cs.animationDuration,
      transform: cs.transform,
      filter: cs.filter,
    },
    blockWrap: block ? getComputedStyle(block).flexWrap : null,
    paper: getComputedStyle(document.body).backgroundColor,
    // Ink CLIPPED? scrollWidth over clientWidth is the honest "outside its box" reading.
    twoOverflow: two ? r(two.scrollWidth - two.clientWidth) : null,
    regions: document.querySelectorAll(".board-margin [role='status'], .board-margin [role='alert']").length,
  };
};

test("P1 the column at two depths, on every rig, both themes", async ({ browser }, info) => {
  const rows: unknown[] = [];
  for (const rig of RIGS) {
    for (const scheme of ["light", "dark"] as const) {
      const { ctx, page } = await ctxFor(browser, info.project.name, rig, scheme);
      await boardReady(page);
      const depth0 = await page.evaluate(READ);
      await armHint(page);
      const depth1 = await page.evaluate(READ);
      await armRefusal(page);
      const depth2 = await page.evaluate(READ);
      rows.push({ rig: rig.name, scheme, engine: info.project.name, depth0, depth1, depth2 });
      await ctx.close();
    }
  }
  bank(`P1-depths-${info.project.name}.json`, rows);
  expect(rows.length).toBe(RIGS.length * 2);
});

test("P2 the width sweep: 99 strings against the strip at the caption tier", async ({
  browser,
}, info) => {
  const vocab = vocabulary();
  const out: unknown[] = [];
  for (const rig of [RIGS[0], RIGS[1], RIGS[6], RIGS[7]]) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    await armHint(page);
    await armRefusal(page);
    const row = await page.evaluate((v: string[]) => {
      const r = (x: number) => Math.round(x * 100) / 100;
      const strip = document.querySelector(".board-margin") as HTMLElement;
      const two = document.querySelector(
        ".board-margin .margin-note-previous",
      ) as HTMLElement | null;
      const one = document.querySelector(".board-margin .margin-note") as HTMLElement;
      if (!two) return null;
      // A measuring span wearing line two's own type, so the number is INK, not the box.
      const cs = getComputedStyle(two);
      const probe = document.createElement("span");
      probe.style.cssText =
        `position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;` +
        `font:${cs.font};letter-spacing:${cs.letterSpacing};`;
      document.body.appendChild(probe);
      const measure = (s: string) => {
        probe.textContent = s;
        return r(probe.getBoundingClientRect().width);
      };
      const widths = v.map((s) => ({ s, w: measure(s) })).sort((a, b) => b.w - a.w);
      // …and line one's own tier, for the pair-at-the-desk arithmetic.
      const cs1 = getComputedStyle(one);
      probe.style.font = cs1.font;
      probe.style.letterSpacing = cs1.letterSpacing;
      const bodyWidths = v.map((s) => ({ s, w: measure(s) })).sort((a, b) => b.w - a.w);
      probe.remove();
      const stripW = r(strip.getBoundingClientRect().width);
      // Does the live element ELIDE? scrollWidth > clientWidth is the ellipsis firing.
      two.textContent = widths[0].s;
      const elided = r(two.scrollWidth - two.clientWidth);
      return {
        stripW,
        captionPx: cs.fontSize,
        bodyPx: cs1.fontSize,
        longest: widths[0],
        longestAtBody: bodyWidths[0],
        headroomPct: r(((stripW - widths[0].w) / stripW) * 100),
        elidedPx: elided,
        top5: widths.slice(0, 5),
      };
    }, vocab);
    out.push({ rig: rig.name, engine: info.project.name, ...(row ?? { missing: true }) });
    await ctx.close();
  }
  bank(`P2-width-${info.project.name}.json`, out);
});

test("P3 the desk berth with a real tally beside the pair", async ({ browser }, info) => {
  const out: unknown[] = [];
  for (const rig of [RIGS[6], RIGS[7]]) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    await armHint(page);
    await armRefusal(page);
    // The pose L14 names: a verdict, a 162px tally, and the longest aged line in the strip.
    const row = await page.evaluate(() => {
      const r = (x: number) => Math.round(x * 100) / 100;
      const block = document.querySelector(".margin-note-block") as HTMLElement;
      const two = document.querySelector(".margin-note-previous") as HTMLElement | null;
      const one = document.querySelector(".board-margin .margin-note") as HTMLElement;
      if (!two || !block) return null;
      // Force the worst case by hand: the estate has no route that prints a tally beside a
      // two-deep column without a solve, and a solve empties the column by law.
      two.textContent = "D goes nowhere else in this column";
      const meta = document.createElement("p");
      meta.className = "margin-note-meta";
      meta.textContent = "1284 backtracks · 19.9s";
      block.insertBefore(meta, two);
      return new Promise((res) =>
        requestAnimationFrame(() => {
          const b = (e: Element) => {
            const x = e.getBoundingClientRect();
            return { x: r(x.x), w: r(x.width), bottom: r(x.bottom), h: r(x.height) };
          };
          res({
            wrap: getComputedStyle(block).flexWrap,
            blockH: r(block.getBoundingClientRect().height),
            one: b(one),
            meta: b(meta),
            two: b(two),
            twoOverflowPx: r(two.scrollWidth - two.clientWidth),
            scrollHeight: document.documentElement.scrollHeight,
          });
        }),
      );
    });
    out.push({ rig: rig.name, engine: info.project.name, ...((row as object) ?? {}) });
    await ctx.close();
  }
  bank(`P3-desk-tally-${info.project.name}.json`, out);
});

test("P4 the a11y shape: one region, line two a paragraph", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, RIGS[1]);
  await boardReady(page);
  await armHint(page);
  await armRefusal(page);
  const strip = page.locator(".board-margin");
  const snap = await strip.ariaSnapshot();
  const counts = await page.evaluate(() => ({
    status: document.querySelectorAll(".board-margin [role='status']").length,
    hidden: document.querySelectorAll(".board-margin [aria-hidden='true']").length,
    twoHidden: document
      .querySelector(".margin-note-previous")
      ?.getAttribute("aria-hidden"),
    twoRole: document.querySelector(".margin-note-previous")?.getAttribute("role"),
  }));
  bank(`P4-aria-${info.project.name}.json`, { snap, counts });
  expect(counts.status).toBe(1);
});
