/**
 * NOTE-LEDGER · pass-2 RESEARCH probe. Read-only on the product: it drives the pass-1
 * prototype build (worktree `wf_e58b4764-0fc-54`, the ledger's `previous` line live) and
 * measures the four things the pass-1 critique could not.
 *
 *   R1  the WHOLE record vocabulary (99 strings, enumerated from `techniqueVoice.ts` +
 *       `toDisplayChar`'s 16 glyphs + the three fixed records) against the strip, per rig
 *   R2  phone landscape 844x390 — the pose the ballot was never priced on
 *   R3  the desk pair: two graphite sentences on one baseline, the air between them, and
 *       the push's LATERAL travel at >=1024
 *   R4  the strip's a11y shape with the column two deep
 *
 * Banks to this lane's own dir. Nothing under r0/ or pass1/ is written or re-run in place.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

/** The 16 display glyphs a value can take (`glyphRegistry.ts:64-70`): 1-9 then A-G. */
const GLYPHS = [
  "1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G",
];
/** `HOUSE_WORD` + its fallback (`techniqueVoice.ts:33-37,52`). */
const HOUSES = ["row", "column", "box", "group"];

/** Every string the ledger's line two can hold, derived from the formatters, not typed. */
function vocabulary(): { s: string; src: string }[] {
  const v: { s: string; src: string }[] = [];
  for (const g of GLYPHS) v.push({ s: `only ${g} fits here`, src: "naked-single" });
  for (const g of GLYPHS)
    for (const h of HOUSES)
      v.push({ s: `${g} goes nowhere else in this ${h}`, src: "hidden-single" });
  for (const g of GLYPHS) v.push({ s: `the answer is ${g}`, src: "reveal" });
  v.push({ s: "that's a given clue", src: "refusal" });
  v.push({ s: "the board is clear", src: "wipe receipt" });
  v.push({ s: "this shared link couldn't be read", src: "freshBoardCopy (link error)" });
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
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!;
    setter.call(given, "7");
    given.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(700);
}
async function ctxFor(
  browser: Browser,
  browserName: string,
  rig: { width: number; height: number; dsf: number; mobile: boolean },
) {
  const ctx = await browser.newContext({
    viewport: { width: rig.width, height: rig.height },
    deviceScaleFactor: rig.dsf,
    isMobile: rig.mobile && browserName === "chromium",
    hasTouch: rig.mobile,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  return { ctx, page };
}

const RIGS = [
  { name: "360x740", width: 360, height: 740, dsf: 3, mobile: true },
  { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
  { name: "844x390", width: 844, height: 390, dsf: 3, mobile: true },
  { name: "900x500", width: 900, height: 500, dsf: 2, mobile: true },
  { name: "1024x768", width: 1024, height: 768, dsf: 2, mobile: false },
  { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
];

test("R1 the whole record vocabulary against the strip", async ({ browser }, info) => {
  const vocab = vocabulary();
  const out: unknown[] = [];
  for (const rig of RIGS) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    await armHint(page);
    await armRefusal(page);
    const row = await page.evaluate((v: { s: string; src: string }[]) => {
      const round = (x: number) => Math.round(x * 100) / 100;
      const strip = document.querySelector(".board-margin") as HTMLElement;
      const block = document.querySelector(".margin-note-block") as HTMLElement;
      const two = document.querySelector(
        ".board-margin .margin-note-previous",
      ) as HTMLElement | null;
      const one = document.querySelector(".board-margin .margin-note") as HTMLElement;
      const sw = round(strip.getBoundingClientRect().width);
      const bw = round(block.getBoundingClientRect().width);
      // The probe host: line two when it exists AND paints (a `display: none` element
      // measures 0 through a Range, which is how the landscape rigs read 0 in the first
      // run); else line one's own span, which carries the identical family, size and
      // tracking — line two's only typographic difference is the ink's alpha.
      const twoPaints = two && getComputedStyle(two).display !== "none";
      const host = (twoPaints ? two : null) ??
        (one.querySelector(".margin-note-ink") as HTMLElement) ?? one;
      const cs = getComputedStyle(host);
      const original = host.textContent;
      const inks = v.map((r) => {
        host.textContent = r.s;
        const node = host.firstChild!;
        const range = document.createRange();
        range.selectNodeContents(node);
        return { ...r, ink: round(range.getBoundingClientRect().width) };
      });
      host.textContent = original;
      inks.sort((a, b) => b.ink - a.ink);
      const longest = inks[0];
      return {
        stripWidth: sw,
        blockWidth: bw,
        lineTwoMounted: !!two,
        lineTwoDisplay: two ? getComputedStyle(two).display : null,
        hostFont: `${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily.split(",")[0]}`,
        whiteSpace: cs.whiteSpace,
        n: inks.length,
        longest,
        headroomPx: round(sw - longest.ink),
        headroomPct: round(((sw - longest.ink) / sw) * 100),
        pairPlusGap: round(longest.ink * 2 + 7.2),
        top10: inks.slice(0, 10),
        bottom3: inks.slice(-3),
      };
    }, vocab);
    out.push({ rig: rig.name, engine: info.project.name, ...row });
    await ctx.close();
  }
  bank(`R1-vocabulary-${info.project.name}.json`, out);
  expect(out.length).toBe(RIGS.length);
});

test("R2 phone landscape 844x390 and 900x500 — the ballot's real pose", async ({
  browser,
}, info) => {
  const out: unknown[] = [];
  for (const rig of RIGS.filter((r) => r.name === "844x390" || r.name === "900x500")) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    const before = await page.evaluate(() => ({
      scrollHeight: document.scrollingElement!.scrollHeight,
      innerHeight: window.innerHeight,
    }));
    await armHint(page);
    await armRefusal(page);
    const row = await page.evaluate(() => {
      const round = (x: number) => Math.round(x * 100) / 100;
      const r = (s: string) => {
        const e = document.querySelector(s) as HTMLElement | null;
        if (!e) return null;
        const b = e.getBoundingClientRect();
        return {
          x: round(b.x), y: round(b.y), w: round(b.width), h: round(b.height),
          display: getComputedStyle(e).display,
        };
      };
      const two = document.querySelector(".margin-note-previous") as HTMLElement | null;
      return {
        scrollHeight: document.scrollingElement!.scrollHeight,
        innerHeight: window.innerHeight,
        board: r(".board-wrapper") ?? r('[role="grid"]'),
        strip: r(".board-margin"),
        block: r(".margin-note-block"),
        lineOne: r(".board-margin .margin-note"),
        lineTwo: r(".margin-note-previous"),
        lineTwoText: two?.textContent ?? null,
        lineTwoInDom: !!two,
        foldTools: r("#fold-tools"),
        drawerHandle: r("#drawer-handle"),
        drawerTab: r(".drawer-tab"),
        playControls: r(".play-controls"),
        controlsCard: r(".controls-card"),
        // What actually sits under the strip in this pose, in document order.
        nextAfterStrip: (() => {
          const strip = document.querySelector(".board-margin");
          if (!strip) return null;
          const all = Array.from(document.querySelectorAll("body *")) as HTMLElement[];
          const sb = strip.getBoundingClientRect();
          const below = all
            .filter((e) => {
              const b = e.getBoundingClientRect();
              return b.width > 30 && b.height > 10 && b.top >= sb.bottom - 0.01;
            })
            .sort(
              (a, b) =>
                a.getBoundingClientRect().top - b.getBoundingClientRect().top,
            );
          const e = below[0];
          if (!e) return null;
          const b = e.getBoundingClientRect();
          return {
            tag: e.tagName.toLowerCase(),
            cls: e.className?.toString().slice(0, 60),
            y: round(b.y),
            clearance: round(b.top - sb.bottom),
          };
        })(),
      };
    });
    out.push({ rig: rig.name, engine: info.project.name, before, ...row });
    await ctx.close();
  }
  bank(`R2-landscape-${info.project.name}.json`, out);
});

test("R3 the desk pair and the push's lateral travel", async ({ browser }, info) => {
  const out: unknown[] = [];
  for (const rig of RIGS.filter(
    (r) => r.name === "1024x768" || r.name === "1280x800",
  )) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    await armHint(page);
    // Capture line one's rect BEFORE the displacing sentence lands: that is the FLIP's
    // `from`, and the travel the spec never declared.
    const fromRect = await page.evaluate(() => {
      const b = (
        document.querySelector(".board-margin .margin-note") as HTMLElement
      ).getBoundingClientRect();
      const ink = document.querySelector(
        ".board-margin .margin-note-ink",
      ) as HTMLElement | null;
      const ib = ink?.getBoundingClientRect();
      return {
        x: b.x, y: b.y, w: b.width,
        inkW: ib ? Math.round(ib.width * 100) / 100 : null,
        text: document.querySelector(".board-margin .margin-note")!.textContent?.trim(),
      };
    });
    await armRefusal(page);
    const row = await page.evaluate((from: { x: number; y: number }) => {
      const round = (x: number) => Math.round(x * 100) / 100;
      const one = document.querySelector(".board-margin .margin-note") as HTMLElement;
      const ink = document.querySelector(
        ".board-margin .margin-note-ink",
      ) as HTMLElement | null;
      const two = document.querySelector(".margin-note-previous") as HTMLElement | null;
      const block = document.querySelector(".margin-note-block") as HTMLElement;
      const meta = document.querySelector(".margin-note-meta") as HTMLElement | null;
      const ob = one.getBoundingClientRect();
      const ib = ink?.getBoundingClientRect();
      const tb = two?.getBoundingClientRect();
      const inkRange = (el: HTMLElement | null) => {
        if (!el || !el.firstChild) return null;
        const r = document.createRange();
        r.selectNodeContents(el);
        const b = r.getBoundingClientRect();
        return { x: round(b.x), right: round(b.right), w: round(b.width) };
      };
      const oneInk = inkRange(ink);
      const twoInk = inkRange(two);
      return {
        scrollHeight: document.scrollingElement!.scrollHeight,
        innerHeight: window.innerHeight,
        blockFlexWrap: getComputedStyle(block).flexWrap,
        blockColumnGap: getComputedStyle(block).columnGap,
        lineOne: { x: round(ob.x), y: round(ob.y), w: round(ob.width), text: one.textContent?.trim() },
        lineOneInk: oneInk,
        lineTwo: tb
          ? { x: round(tb.x), y: round(tb.y), w: round(tb.width), h: round(tb.height), text: two!.textContent }
          : null,
        lineTwoInk: twoInk,
        lineTwoColour: two ? getComputedStyle(two).color : null,
        lineOneColour: getComputedStyle(one).color,
        airBetweenInk: oneInk && twoInk ? round(twoInk.x - oneInk.right) : null,
        baselineShared: tb ? round(tb.y - ob.y) : null,
        // The FLIP's declared travel: from line one's own box to the mover's berth.
        travel: tb
          ? { dx: round(from.x - tb.x), dy: round(from.y - tb.y) }
          : null,
        metaPresent: !!meta,
      };
    }, fromRect);
    out.push({ rig: rig.name, engine: info.project.name, fromRect, ...row });
    await ctx.close();
  }
  bank(`R3-desk-pair-${info.project.name}.json`, out);
});

test("R4 the strip's a11y shape with the column two deep", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, RIGS[1]);
  await boardReady(page);
  await armHint(page);
  await armRefusal(page);
  const dom = await page.evaluate(() => {
    const strip = document.querySelector(".board-margin") as HTMLElement;
    const two = document.querySelector(".margin-note-previous") as HTMLElement | null;
    const cs = two ? getComputedStyle(two) : null;
    return {
      liveRegionsInStrip: strip.querySelectorAll("[aria-live],[role='status'],[role='alert']").length,
      ariaHiddenOnTwo: two?.getAttribute("aria-hidden") ?? null,
      twoUserSelect: cs?.userSelect ?? null,
      twoPointerEvents: cs?.pointerEvents ?? null,
      twoDisplay: cs?.display ?? null,
      srOnlyInDocument: document.querySelectorAll(".sr-only").length,
      srOnlyLive: Array.from(document.querySelectorAll("[aria-live]")).map((e) => ({
        cls: (e.className || "").toString().slice(0, 40),
        role: e.getAttribute("role"),
        live: e.getAttribute("aria-live"),
        text: (e.textContent || "").trim().slice(0, 60),
      })),
    };
  });
  const snap = await page.accessibility.snapshot({ interestingOnly: false });
  const find = (n: any, depth = 0, acc: any[] = []): any[] => {
    if (!n) return acc;
    const t = (n.name || "").toString();
    if (/fits here|given clue|goes nowhere|board is clear|answer is/.test(t))
      acc.push({ role: n.role, name: t.slice(0, 60), depth });
    (n.children || []).forEach((c: any) => find(c, depth + 1, acc));
    return acc;
  };
  bank(`R4-a11y-${info.project.name}.json`, { ...dom, matchesInTree: find(snap) });
});
