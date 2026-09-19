/**
 * NOTE-LEDGER · pass-2 PROTOTYPE — the four cited crops, and nothing else. Each is a crop of
 * the strip, not a page shot, because the claim is about two lines of ink.
 */
import { test, type Page, type Browser } from "@playwright/test";
import { mkdirSync } from "node:fs";

const FR =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/NOTE-LEDGER/frames";
mkdirSync(FR, { recursive: true });

async function ctxFor(
  browser: Browser,
  browserName: string,
  rig: { width: number; height: number; dsf: number; mobile: boolean },
  scheme: "light" | "dark",
  reduced: "reduce" | "no-preference" = "reduce",
) {
  const ctx = await browser.newContext({
    viewport: { width: rig.width, height: rig.height },
    deviceScaleFactor: rig.dsf,
    isMobile: rig.mobile && browserName === "chromium",
    hasTouch: rig.mobile,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: reduced, colorScheme: scheme });
  return { ctx, page };
}
async function boardReady(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}
/** Paint an exact pose by hand: the estate's own routes cannot stage a chosen PAIR. */
async function pose(page: Page, one: string, two: string | null) {
  await page.evaluate(
    ([o, t]: [string, string | null]) => {
      const span = document.querySelector(".margin-note-ink") as HTMLElement | null;
      if (span) span.textContent = o;
      const p = document.querySelector(".margin-note-previous") as HTMLElement | null;
      if (p) {
        if (t === null) p.remove();
        else p.textContent = t;
      }
    },
    [one, two] as [string, string | null],
  );
  await page.waitForTimeout(120);
}
const shot = async (page: Page, name: string) => {
  const block = page.locator(".board-margin");
  const b = (await block.boundingBox())!;
  await page.screenshot({
    path: `${FR}/${name}.png`,
    clip: {
      x: Math.max(0, b.x - 6),
      y: Math.max(0, b.y - 8),
      width: Math.min(b.width + 12, 900),
      height: b.height + 34,
    },
  });
};

const PHONE = { width: 390, height: 844, dsf: 3, mobile: true };
const COARSE = { width: 360, height: 740, dsf: 3, mobile: true };
const DESK = { width: 1280, height: 800, dsf: 2, mobile: false };

async function twoDeep(page: Page) {
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    inputs.filter((i) => !i.value && !i.readOnly && !i.disabled)[0]?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(600);
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

test("C1 the desk pair at 1280 light", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, DESK, "light");
  await boardReady(page);
  await twoDeep(page);
  await pose(page, "only 5 fits here", "4 goes nowhere else in this column");
  await shot(page, `C1-1280-desk-pair-light-${info.project.name}`);
  await ctx.close();
});

test("C2 the phone column at 360 coarse dark, longest 16x16 record", async ({
  browser,
}, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, COARSE, "dark");
  await boardReady(page);
  await twoDeep(page);
  await pose(page, "that's a given clue", "D goes nowhere else in this column");
  await shot(page, `C2-360-coarse-dark-longest-${info.project.name}`);
  await ctx.close();
});

test("C3 the push at t=125ms, 390", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, PHONE, "light", "no-preference");
  await boardReady(page);
  // Arm the first record, then start the second and freeze half-way through the rung.
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    inputs.filter((i) => !i.value && !i.readOnly && !i.disabled)[0]?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(700);
  // Catch the push AT BIRTH. Polling after the fact loses it: 250ms is gone by the time an
  // evaluate round-trip lands, which is what the first cut of this crop recorded (the settled
  // column, labelled t=125). Hook `animate` instead, so the mover is paused on the frame the
  // component starts it and parked at half the note rung.
  await page.evaluate(() => {
    const orig = Element.prototype.animate;
    Element.prototype.animate = function (kf, opts) {
      const a = orig.call(this, kf, opts);
      if ((this as Element).classList.contains("margin-note-previous")) {
        a.pause();
        a.currentTime = 125;
      }
      return a;
    };
  });
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
  await page.waitForTimeout(400);
  const midFlight = await page.evaluate(() => {
    const two = document.querySelector(".margin-note-previous") as HTMLElement | null;
    const one = document.querySelector(".board-margin .margin-note") as HTMLElement;
    const r = (x: number) => Math.round(x * 100) / 100;
    return {
      twoTransform: two ? getComputedStyle(two).transform : null,
      twoColor: two ? getComputedStyle(two).color : null,
      twoTop: two ? r(two.getBoundingClientRect().y) : null,
      oneTop: r(one.getBoundingClientRect().y),
      playState: two?.getAnimations().map((a) => a.playState),
      currentTime: two?.getAnimations().map((a) => a.currentTime),
    };
  });
  console.log("[C3 mid-flight]", JSON.stringify(midFlight));
  await shot(page, `C3-390-push-t125-${info.project.name}`);
  await ctx.close();
});

test("C4 the grade-leaves pose at 390", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, PHONE, "light");
  await boardReady(page);
  await twoDeep(page);
  // setMargin("", "graphite", "grade"): the live line empties, line two holds its rung.
  await pose(page, "", "only 4 fits here");
  await shot(page, `C4-390-grade-leaves-${info.project.name}`);
  await ctx.close();
});
