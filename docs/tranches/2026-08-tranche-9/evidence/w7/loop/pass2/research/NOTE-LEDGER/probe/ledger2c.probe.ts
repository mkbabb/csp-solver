/**
 * NOTE-LEDGER · pass-2 RESEARCH probe, part three.
 *
 *   R7b  solveState 'error' over a two-line column, at the pose that matters (<1024, where
 *        the strip is in FLOW precisely so `SolverErrorNote`'s real height pushes the
 *        controls down). The Solve control lives in the sheet at 390, so the sheet is opened
 *        and settled first; the wrapped `Worker` is the same instrument as R7.
 *   R9   the word-space advance in the note's own type — the number that says whether the
 *        desk berth's 7.2px gap reads as a sentence break or as a space.
 *   R10  line two WITHOUT `aria-hidden` — does the record become recoverable in browse mode
 *        without adding a live region? (A page mutation, never a product file.)
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
        setTimeout(() => {
          try { w.dispatchEvent(new ErrorEvent("error", { message: "induced worker fault" })); } catch (e) {}
        }, 0);
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

test("R7b the error card over a two-line column, below 1024", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(
    browser,
    info.project.name,
    { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
    INIT,
  );
  await boardReady(page);
  await twoDeep(page);
  const before = await page.evaluate(() => ({
    one: document.querySelector(".board-margin .margin-note")?.textContent?.trim(),
    two: document.querySelector(".margin-note-previous")?.textContent ?? null,
    stripY: document.querySelector(".board-margin")!.getBoundingClientRect().y,
    scrollHeight: document.scrollingElement!.scrollHeight,
  }));
  // Arm the fault and retire the live workers, so the next call re-mints an armed one.
  const retired = await page.evaluate(() => {
    (window as any).__breakSolver = true;
    const ws = (window as any).__workers as Worker[];
    ws.forEach((w) => {
      try {
        w.dispatchEvent(new ErrorEvent("error", { message: "induced retire" }));
      } catch {
        /* ignore */
      }
    });
    return ws.length;
  });
  // The Solve control lives in the sheet at this width: open it, settle the slide, press.
  const opened: string[] = [];
  for (const sel of [
    ".drawer-tab",
    "#fold-tools button[aria-label*='ontrol']",
    "button[aria-label*='ontrols']",
    ".board-tab",
  ]) {
    const l = page.locator(sel).first();
    if ((await l.count()) && (await l.isVisible().catch(() => false))) {
      await l.click({ force: true }).catch(() => undefined);
      opened.push(sel);
      break;
    }
  }
  await page.waitForTimeout(1100); // the dock SLIDES — settle before touching it
  const solve = page.locator('[aria-label="Solve puzzle"]').first();
  const solveVisible = (await solve.count()) > 0;
  await solve.click({ force: true, timeout: 10000 }).catch(() => undefined);
  await page.waitForTimeout(2500);
  const after = await page.evaluate(() => {
    const round = (x: number) => Math.round(x * 100) / 100;
    const r = (s: string) => {
      const e = document.querySelector(s) as HTMLElement | null;
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return {
        y: round(b.y),
        h: round(b.height),
        display: getComputedStyle(e).display,
        text: (e.textContent || "").trim().slice(0, 70),
      };
    };
    return {
      alert: r("[role='alert']"),
      errorNote: r(".solver-error-note") ?? r(".error-note") ?? r(".paper-note"),
      lineOne: r(".board-margin .margin-note"),
      lineTwo: r(".margin-note-previous"),
      strip: r(".board-margin"),
      board: r(".board-wrapper"),
      scrollHeight: document.scrollingElement!.scrollHeight,
      innerHeight: window.innerHeight,
    };
  });
  bank(`R7b-error-card-${info.project.name}.json`, {
    before,
    retired,
    opened,
    solveVisible,
    after,
  });
  if (info.project.name === "chromium" && after.alert) {
    await page
      .locator(".board-margin")
      .screenshot({
        path: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/NOTE-LEDGER/frames/390-error-over-column.png",
      })
      .catch(() => undefined);
  }
  await ctx.close();
});

test("R9 the word space against the sentence gap", async ({ browser }, info) => {
  const out: unknown[] = [];
  for (const rig of [
    { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
    { name: "360x740", width: 360, height: 740, dsf: 3, mobile: true },
  ]) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    await twoDeep(page);
    const row = await page.evaluate(() => {
      const round = (x: number) => Math.round(x * 100) / 100;
      const host =
        (document.querySelector(".margin-note-previous") as HTMLElement) ??
        (document.querySelector(".margin-note-ink") as HTMLElement);
      const w = (s: string) => {
        const keep = host.textContent;
        host.textContent = s;
        const r = document.createRange();
        r.selectNodeContents(host.firstChild!);
        const b = r.getBoundingClientRect().width;
        host.textContent = keep;
        return b;
      };
      const wordSpace = w("here here") - w("herehere");
      const gapCSS = getComputedStyle(
        document.querySelector(".margin-note-block") as HTMLElement,
      ).columnGap;
      return {
        wordSpacePx: round(wordSpace),
        columnGap: gapCSS,
        ratio: round(parseFloat(gapCSS) / wordSpace),
        fontSize: getComputedStyle(host).fontSize,
      };
    });
    out.push({ rig: rig.name, engine: info.project.name, ...row });
    await ctx.close();
  }
  bank(`R9-word-space-${info.project.name}.json`, out);
});

test("R10 the aged record without aria-hidden", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, {
    name: "390x844",
    width: 390,
    height: 844,
    dsf: 3,
    mobile: true,
  });
  await boardReady(page);
  await twoDeep(page);
  const withHidden = await page.locator(".board-margin").ariaSnapshot();
  await page.evaluate(() => {
    document.querySelector(".margin-note-previous")?.removeAttribute("aria-hidden");
  });
  await page.waitForTimeout(200);
  const withoutHidden = await page.locator(".board-margin").ariaSnapshot();
  // A third sentence lands: does the live region announce ONE line or the whole column?
  const mutations = await page.evaluate(async () => {
    const region = document.querySelector(
      ".board-margin [role='status']",
    ) as HTMLElement;
    const seen: string[] = [];
    const mo = new MutationObserver((recs) => {
      for (const r of recs)
        seen.push(
          `${r.type}:${(r.target as HTMLElement).className || (r.target.parentElement as HTMLElement)?.className || "text"}`,
        );
    });
    mo.observe(document.querySelector(".margin-note-block") as HTMLElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    });
    await new Promise((r) => setTimeout(r, 50));
    mo.disconnect();
    return { region: region.textContent, seen };
  });
  bank(`R10-aria-hidden-${info.project.name}.json`, {
    withHidden,
    withoutHidden,
    mutations,
  });
  await ctx.close();
});
