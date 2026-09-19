/**
 * NOTE-LEDGER · pass-2 PROTOTYPE probe 2 — the acts: the strike (L11), the push and its exit
 * (L13), accumulation (L1), the peer row (L2), the model row (L5), PRM.
 *
 * Drives THIS lane's worktree on :4249. Banks to this lane's own dir.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function ctxFor(
  browser: Browser,
  browserName: string,
  rig: { width: number; height: number; dsf: number; mobile: boolean },
  reduced: "reduce" | "no-preference" = "no-preference",
) {
  const ctx = await browser.newContext({
    viewport: { width: rig.width, height: rig.height },
    deviceScaleFactor: rig.dsf,
    isMobile: rig.mobile && browserName === "chromium",
    hasTouch: rig.mobile,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: reduced, colorScheme: "light" });
  return { ctx, page };
}
const PHONE = { width: 390, height: 844, dsf: 3, mobile: true };
const DESK = { width: 1280, height: 800, dsf: 2, mobile: false };

async function boardReady(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}
/** Focus the first open cell and press h — the hint arms on THAT cell. */
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
/** The cells the live argument turns on, by index into `.board-cells input`. */
const REFERENT = () =>
  Array.from(document.querySelectorAll(".board-cells input")).reduce<number[]>(
    (acc, el, i) => {
      const cell = el.closest(".game-cell") ?? el.parentElement;
      if (cell?.querySelector(".cell-because")) acc.push(i);
      return acc;
    },
    [],
  );
/** Write a digit into cell `i` the way a keystroke does (and the way the wire does). */
const WRITE = (i: number, v: string) => {
  const inputs = Array.from(
    document.querySelectorAll(".board-cells input"),
  ) as HTMLInputElement[];
  const el = inputs[i];
  if (!el || el.readOnly || el.disabled) return false;
  el.focus();
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  setter.call(el, v);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
};
const LINES = () => ({
  one: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
  two:
    document.querySelector(".board-margin .margin-note-previous")?.textContent?.trim() ??
    null,
  twoCount: document.querySelectorAll(".board-margin .margin-note-previous").length,
});

test("A1 the strike at depth one: a digit in the referent, and one elsewhere", async ({
  browser,
}, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, PHONE);
  await boardReady(page);
  await armHint(page);
  const armed = await page.evaluate(() => ({
    lines: {
      one: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
      two:
        document.querySelector(".board-margin .margin-note-previous")?.textContent?.trim() ??
        null,
    },
    referent: Array.from(document.querySelectorAll(".board-cells input")).reduce<number[]>(
      (acc, el, i) => {
        const cell = el.closest(".game-cell") ?? el.parentElement;
        if (cell?.querySelector(".cell-because")) acc.push(i);
        return acc;
      },
      [],
    ),
    open: Array.from(document.querySelectorAll(".board-cells input")).reduce<number[]>(
      (acc, el, i) => {
        const inp = el as HTMLInputElement;
        if (!inp.value && !inp.readOnly && !inp.disabled) acc.push(i);
        return acc;
      },
      [],
    ),
  }));
  // ELSEWHERE first (the L2 law): a cell in neither the hint's square nor its house.
  const elsewhere = armed.open.filter((i) => !armed.referent.includes(i)).slice(-1)[0];
  await page.evaluate(
    ([i, v]: [number, string]) => {
      const inputs = Array.from(
        document.querySelectorAll(".board-cells input"),
      ) as HTMLInputElement[];
      const el = inputs[i];
      if (!el || el.readOnly || el.disabled) return false;
      el.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(el, v);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    },
    [elsewhere, "5"] as [number, string],
  );
  await page.waitForTimeout(500);
  const afterElsewhere = await page.evaluate(LINES);
  // …then ON the referent.
  const target = armed.referent.filter((i) => armed.open.includes(i))[0] ?? armed.open[0];
  await page.evaluate(
    ([i, v]: [number, string]) => {
      const inputs = Array.from(
        document.querySelectorAll(".board-cells input"),
      ) as HTMLInputElement[];
      const el = inputs[i];
      if (!el || el.readOnly || el.disabled) return false;
      el.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(el, v);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    },
    [target, "6"] as [number, string],
  );
  await page.waitForTimeout(500);
  const afterReferent = await page.evaluate(LINES);
  bank(`A1-strike-depth1-${info.project.name}.json`, {
    armed,
    elsewhere,
    afterElsewhere,
    target,
    afterReferent,
  });
  await ctx.close();
  expect(afterElsewhere.one).toBe(armed.lines.one);
  expect(afterReferent.one).toBe("");
});

test("A2 the strike at depth two, and accumulation under it", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, PHONE);
  await boardReady(page);
  await armHint(page);
  const armed = await page.evaluate(() => ({
    referent: Array.from(document.querySelectorAll(".board-cells input")).reduce<number[]>(
      (acc, el, i) => {
        const cell = el.closest(".game-cell") ?? el.parentElement;
        if (cell?.querySelector(".cell-because")) acc.push(i);
        return acc;
      },
      [],
    ),
    open: Array.from(document.querySelectorAll(".board-cells input")).reduce<number[]>(
      (acc, el, i) => {
        const inp = el as HTMLInputElement;
        if (!inp.value && !inp.readOnly && !inp.disabled) acc.push(i);
        return acc;
      },
      [],
    ),
    lines: {
      one: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
    },
  }));
  // A second record (the refusal) pushes the hint down a rung — L1, accumulation.
  await armRefusal(page);
  const twoDeep = await page.evaluate(LINES);
  // Now write on the AGED record's referent: line two goes, line one stands.
  const target = armed.referent.filter((i) => armed.open.includes(i))[0];
  await page.evaluate(
    ([i, v]: [number, string]) => {
      const inputs = Array.from(
        document.querySelectorAll(".board-cells input"),
      ) as HTMLInputElement[];
      const el = inputs[i];
      if (!el || el.readOnly || el.disabled) return false;
      el.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(el, v);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    },
    [target, "6"] as [number, string],
  );
  await page.waitForTimeout(600);
  const afterStrike = await page.evaluate(LINES);
  bank(`A2-strike-depth2-${info.project.name}.json`, {
    armed,
    twoDeep,
    target,
    afterStrike,
  });
  await ctx.close();
  expect(twoDeep.two).toBe(armed.lines.one);
  expect(afterStrike.two).toBeNull();
  expect(afterStrike.one).toBe(twoDeep.one);
});

test("A3 the model row: three records in, exactly two paragraphs out", async ({
  browser,
}, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, PHONE);
  await boardReady(page);
  await armHint(page);
  const first = await page.evaluate(LINES);
  await armRefusal(page);
  const second = await page.evaluate(LINES);
  // A third record: the wipe receipt. Clear the board through the estate's own control.
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      /clear/i.test(b.textContent ?? ""),
    ) as HTMLButtonElement | undefined;
    btn?.click();
  });
  await page.waitForTimeout(900);
  const third = await page.evaluate(() => ({
    one: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
    two:
      document.querySelector(".board-margin .margin-note-previous")?.textContent?.trim() ??
      null,
    twoCount: document.querySelectorAll(".board-margin .margin-note-previous").length,
    oldestInDom: document.body.innerText.includes(
      document.querySelector(".board-margin .margin-note-previous")?.textContent?.trim() ??
        " ",
    ),
    html: (document.querySelector(".margin-note-block") as HTMLElement)?.innerHTML ?? "",
  }));
  bank(`A3-model-${info.project.name}.json`, { first, second, third });
  await ctx.close();
  expect(third.twoCount).toBeLessThanOrEqual(1);
});

test("A4 the push and the exit, measured", async ({ browser }, info) => {
  const out: Record<string, unknown> = {};
  for (const [name, rig] of [
    ["390x844", PHONE],
    ["1280x800", DESK],
  ] as const) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    await armHint(page);
    // Instrument the push: catch the animation the component starts on the mover.
    await page.evaluate(() => {
      (window as unknown as { __pushes: unknown[] }).__pushes = [];
      const orig = Element.prototype.animate;
      Element.prototype.animate = function (kf, opts) {
        const a = orig.call(this, kf, opts);
        if ((this as Element).classList.contains("margin-note-previous"))
          (window as unknown as { __pushes: unknown[] }).__pushes.push({
            cls: (this as Element).className,
            kf: JSON.parse(JSON.stringify(kf)),
            opts: JSON.parse(JSON.stringify(opts)),
          });
        return a;
      };
    });
    await armRefusal(page);
    const push = await page.evaluate(() => {
      const two = document.querySelector(".margin-note-previous") as HTMLElement | null;
      const one = document.querySelector(".board-margin .margin-note") as HTMLElement;
      const r = (x: number) => Math.round(x * 100) / 100;
      const anims = two?.getAnimations().map((a) => ({
        playState: a.playState,
        duration: (a.effect?.getTiming().duration ?? null) as number | null,
        fill: a.effect?.getTiming().fill ?? null,
      }));
      return {
        pushes: (window as unknown as { __pushes: unknown[] }).__pushes,
        anims,
        restTransformTwo: two ? getComputedStyle(two).transform : null,
        restTransformOne: getComputedStyle(one).transform,
        filterOne: getComputedStyle(one).filter,
        filterTwo: two ? getComputedStyle(two).filter : null,
        oneRect: r(one.getBoundingClientRect().left),
        twoRect: two ? r(two.getBoundingClientRect().left) : null,
        oneBottom: r(one.getBoundingClientRect().bottom),
        twoBottom: two ? r(two.getBoundingClientRect().bottom) : null,
      };
    });
    // THE EXIT: a third record pushes line two off. Watch the leaving node's computed
    // animation, then confirm it is gone.
    const exit = await page.evaluate(async () => {
      const r = (x: number) => Math.round(x * 100) / 100;
      const block = document.querySelector(".margin-note-block") as HTMLElement;
      const board = document.querySelector('[role="grid"]') as HTMLElement;
      const boardBefore = r(board.getBoundingClientRect().y);
      const seen: unknown[] = [];
      const obs = new MutationObserver(() => {
        const leaving = document.querySelector(
          ".note-previous-leave-active",
        ) as HTMLElement | null;
        if (leaving) {
          const cs = getComputedStyle(leaving);
          seen.push({
            animationName: cs.animationName,
            animationDuration: cs.animationDuration,
            animationTimingFunction: cs.animationTimingFunction,
            position: cs.position,
            transition: cs.transitionDuration,
          });
        }
      });
      obs.observe(block, { childList: true, subtree: true, attributes: true });
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        /clear/i.test(b.textContent ?? ""),
      ) as HTMLButtonElement | undefined;
      btn?.click();
      await new Promise((res) => setTimeout(res, 60));
      const midCount = document.querySelectorAll(".margin-note-previous").length;
      await new Promise((res) => setTimeout(res, 600));
      obs.disconnect();
      return {
        seen: seen.slice(0, 3),
        midCount,
        endCount: document.querySelectorAll(".margin-note-previous").length,
        boardBefore,
        boardAfter: r(board.getBoundingClientRect().y),
      };
    });
    out[name] = { push, exit };
    await ctx.close();
  }
  bank(`A4-push-exit-${info.project.name}.json`, out);
});

test("A5 PRM: the push is one frame, the exit a same-frame cut", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, PHONE, "reduce");
  await boardReady(page);
  await armHint(page);
  await page.evaluate(() => {
    (window as unknown as { __pushes: unknown[] }).__pushes = [];
    const orig = Element.prototype.animate;
    Element.prototype.animate = function (kf, opts) {
      const a = orig.call(this, kf, opts);
      if ((this as Element).classList.contains("margin-note-previous"))
        (window as unknown as { __pushes: unknown[] }).__pushes.push({
          opts: JSON.parse(JSON.stringify(opts)),
        });
      return a;
    };
  });
  await armRefusal(page);
  const row = await page.evaluate(async () => {
    const two = document.querySelector(".margin-note-previous") as HTMLElement | null;
    const prm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const before = {
      prm,
      pushes: (window as unknown as { __pushes: unknown[] }).__pushes,
      twoAnimationDuration: two ? getComputedStyle(two).animationDuration : null,
    };
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      /clear/i.test(b.textContent ?? ""),
    ) as HTMLButtonElement | undefined;
    btn?.click();
    await new Promise((res) => requestAnimationFrame(() => res(null)));
    const leaving = document.querySelector(
      ".note-previous-leave-active",
    ) as HTMLElement | null;
    return {
      ...before,
      leavingDuration: leaving ? getComputedStyle(leaving).animationDuration : null,
      countAfterOneFrame: document.querySelectorAll(".margin-note-previous").length,
    };
  });
  bank(`A5-prm-${info.project.name}.json`, row);
  await ctx.close();
  expect(row.prm).toBe(true);
});
