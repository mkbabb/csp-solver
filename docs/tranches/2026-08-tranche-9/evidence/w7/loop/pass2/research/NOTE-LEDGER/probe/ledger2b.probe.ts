/**
 * NOTE-LEDGER · pass-2 RESEARCH probe, part two.
 *
 *   R5  the GRAPHITE-over-GRAPHITE desk pair — the common pose neither the prototype nor the
 *       critic could induce (two hints in a row printed one sentence, because the second H
 *       press INKS the armed digit instead of arming a new one). The path: arm, press H again
 *       to spend it, move the caret, arm again.
 *   R6  the a11y shape of the two-deep column (ARIA snapshot, not the retired accessibility
 *       API), and W3's sr-only roll-call.
 *   R7  solveState 'error' over a two-line column — the pose pass 1 could not reach. No
 *       product change: the page's own `Worker` constructor is wrapped before boot so a
 *       registry of live workers exists and a fault can be armed after the records are
 *       written. `ensureWorker` retires a worker that fires `error` and re-mints on the next
 *       call, so the next solve press mints the armed one and rejects WORKER_FAILURE.
 *   R8  the desk TRIPLE (verdict + tally + aged line) priced against the narrowest desk, wrap
 *       and nowrap, on a clone of the live block.
 */
import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}
/** Focus the nth writable empty cell. */
async function focusEmpty(page: Page, n: number) {
  await page.evaluate((k: number) => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    inputs.filter((i) => !i.value && !i.readOnly && !i.disabled)[k]?.focus();
  }, n);
}
const marginNow = (page: Page) =>
  page.evaluate(() => ({
    one: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
    oneColour: getComputedStyle(
      document.querySelector(".board-margin .margin-note") as HTMLElement,
    ).color,
    two: document.querySelector(".margin-note-previous")?.textContent ?? null,
    twoColour: (() => {
      const e = document.querySelector(".margin-note-previous") as HTMLElement | null;
      return e ? getComputedStyle(e).color : null;
    })(),
  }));

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

const DESKS = [
  { name: "1024x768", width: 1024, height: 768, dsf: 2, mobile: false },
  { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
];

test("R5 the graphite-over-graphite desk pair", async ({ browser }, info) => {
  const out: unknown[] = [];
  for (const rig of DESKS) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    const steps: unknown[] = [];
    await focusEmpty(page, 0);
    await page.keyboard.press("h"); // arm hint 1
    await page.waitForTimeout(600);
    steps.push({ act: "arm hint 1", ...(await marginNow(page)) });
    await page.keyboard.press("h"); // spend it: the digit inks, the sentence stands
    await page.waitForTimeout(600);
    steps.push({ act: "spend hint 1 (ink the digit)", ...(await marginNow(page)) });
    await focusEmpty(page, 3);
    await page.keyboard.press("h"); // arm hint 2 -> the push
    await page.waitForTimeout(900);
    steps.push({ act: "arm hint 2 (the push)", ...(await marginNow(page)) });
    const geom = await page.evaluate(() => {
      const round = (x: number) => Math.round(x * 100) / 100;
      const inkRange = (el: Element | null) => {
        if (!el || !el.firstChild) return null;
        const r = document.createRange();
        r.selectNodeContents(el);
        const b = r.getBoundingClientRect();
        return { x: round(b.x), right: round(b.right), w: round(b.width), y: round(b.y) };
      };
      const one = document.querySelector(".board-margin .margin-note-ink");
      const two = document.querySelector(".margin-note-previous");
      const a = inkRange(one);
      const b = inkRange(two);
      return {
        oneInk: a,
        twoInk: b,
        airBetweenInk: a && b ? round(b.x - a.right) : null,
        bothGraphite:
          !!one &&
          !!two &&
          getComputedStyle(one.parentElement as HTMLElement).color ===
            getComputedStyle(document.querySelector(".graphite") as HTMLElement).color,
        oneComputed: one
          ? getComputedStyle(one.parentElement as HTMLElement).color
          : null,
        twoComputed: two ? getComputedStyle(two as HTMLElement).color : null,
        strip: round(
          (document.querySelector(".board-margin") as HTMLElement).getBoundingClientRect()
            .width,
        ),
        scrollHeight: document.scrollingElement!.scrollHeight,
        innerHeight: window.innerHeight,
      };
    });
    out.push({ rig: rig.name, engine: info.project.name, steps, geom });
    if (rig.name === "1280x800" && info.project.name === "chromium") {
      const strip = page.locator(".board-margin");
      await strip.screenshot({
        path: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/NOTE-LEDGER/frames/1280-graphite-pair.png",
      });
    }
    if (rig.name === "1024x768" && info.project.name === "chromium") {
      const strip = page.locator(".board-margin");
      await strip.screenshot({
        path: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/NOTE-LEDGER/frames/1024-graphite-pair.png",
      });
    }
    await ctx.close();
  }
  bank(`R5-graphite-pair-${info.project.name}.json`, out);
});

test("R6 the a11y shape of the two-deep column", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name, {
    name: "390x844",
    width: 390,
    height: 844,
    dsf: 3,
    mobile: true,
  });
  await boardReady(page);
  await focusEmpty(page, 0);
  await page.keyboard.press("h");
  await page.waitForTimeout(600);
  await page.keyboard.press("h");
  await page.waitForTimeout(600);
  await focusEmpty(page, 3);
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  const dom = await page.evaluate(() => {
    const strip = document.querySelector(".board-margin") as HTMLElement;
    const two = document.querySelector(".margin-note-previous") as HTMLElement | null;
    const cs = two ? getComputedStyle(two) : null;
    return {
      lineOne: document.querySelector(".board-margin .margin-note")?.textContent?.trim(),
      lineTwo: two?.textContent ?? null,
      liveRegionsInStrip: strip.querySelectorAll(
        "[aria-live],[role='status'],[role='alert']",
      ).length,
      ariaHiddenOnTwo: two?.getAttribute("aria-hidden") ?? null,
      twoUserSelect: cs?.userSelect ?? null,
      twoPointerEvents: cs?.pointerEvents ?? null,
      twoDisplay: cs?.display ?? null,
      liveRegionsInDocument: Array.from(
        document.querySelectorAll("[aria-live],[role='status'],[role='alert']"),
      ).map((e) => ({
        cls: (e.className || "").toString().slice(0, 44),
        role: e.getAttribute("role"),
        live: e.getAttribute("aria-live"),
        atomic: e.getAttribute("aria-atomic"),
        hidden: e.getAttribute("aria-hidden"),
        text: (e.textContent || "").trim().slice(0, 50),
      })),
      srOnlyCount: document.querySelectorAll(".sr-only").length,
    };
  });
  const aria = await page.locator(".board-margin").ariaSnapshot().catch((e) => String(e));
  bank(`R6-a11y-${info.project.name}.json`, { ...dom, ariaSnapshotOfStrip: aria });
});

test("R7 the error card over a two-line column", async ({ browser }, info) => {
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
            try {
              w.dispatchEvent(new ErrorEvent("error", { message: "induced worker fault" }));
            } catch (e) { /* engines without ErrorEvent ctor fall through */ }
          }, 0);
        return w;
      }
      Wrapped.prototype = Real.prototype;
      window.Worker = Wrapped;
    })();
  `;
  const { ctx, page } = await ctxFor(
    browser,
    info.project.name,
    { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
    INIT,
  );
  await boardReady(page);
  // Two records first, while the solver is healthy.
  await focusEmpty(page, 0);
  await page.keyboard.press("h");
  await page.waitForTimeout(600);
  await page.keyboard.press("h");
  await page.waitForTimeout(600);
  await focusEmpty(page, 3);
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  const beforeBreak = await marginNow(page);
  // Arm the fault, then retire every live worker so the next call re-mints an armed one.
  const workers = await page.evaluate(() => {
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
  // Press Solve. The card mounts on `solveState === 'error'`.
  const solve = page.locator('[aria-label="Solve puzzle"]');
  await solve.first().click({ force: true, timeout: 15000 }).catch(() => undefined);
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
        text: (e.textContent || "").trim().slice(0, 60),
      };
    };
    return {
      errorCard: r(".solver-error-note") ?? r("[role='alert']"),
      lineOne: r(".board-margin .margin-note"),
      lineTwo: r(".margin-note-previous"),
      strip: r(".board-margin"),
      scrollHeight: document.scrollingElement!.scrollHeight,
      innerHeight: window.innerHeight,
    };
  });
  bank(`R7-error-card-${info.project.name}.json`, {
    beforeBreak,
    workersRetired: workers,
    after,
  });
  if (info.project.name === "chromium" && after.errorCard) {
    await page
      .locator(".board-margin")
      .screenshot({
        path: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/NOTE-LEDGER/frames/390-error-over-column.png",
      })
      .catch(() => undefined);
  }
  await ctx.close();
});

test("R8 the desk triple, wrap and nowrap", async ({ browser }, info) => {
  const LONGEST = "D goes nowhere else in this column";
  const TALLIES = ["0 backtracks · 42ms", "1284 backtracks · 19.9s", "99999 backtracks · 473.0s"];
  const out: unknown[] = [];
  for (const rig of DESKS) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    const row = await page.evaluate(
      ({ longest, tallies }: { longest: string; tallies: string[] }) => {
        const round = (x: number) => Math.round(x * 100) / 100;
        const strip = document.querySelector(".board-margin") as HTMLElement;
        const block = document.querySelector(".margin-note-block") as HTMLElement;
        const stripW = round(strip.getBoundingClientRect().width);
        // A clone of the live block, measured off-screen at the strip's own width: the
        // product is not mutated, and the clone inherits every cascade the block sits under.
        const host = document.createElement("div");
        host.style.cssText = `position:absolute;left:-10000px;top:0;width:${stripW}px`;
        strip.appendChild(host);
        const results = tallies.map((tally) => {
          const measure = (wrap: string) => {
            host.innerHTML = "";
            const c = block.cloneNode(true) as HTMLElement;
            c.style.flexWrap = wrap;
            const one = c.querySelector(".margin-note") as HTMLElement;
            const ink = c.querySelector(".margin-note-ink") as HTMLElement | null;
            if (ink) ink.textContent = "check the greater than signs";
            else one.textContent = "check the greater than signs";
            let meta = c.querySelector(".margin-note-meta") as HTMLElement | null;
            if (!meta) {
              meta = document.createElement("p");
              meta.className = "margin-note-meta";
              c.insertBefore(meta, c.querySelector(".margin-note-previous"));
            }
            meta.textContent = tally;
            let two = c.querySelector(".margin-note-previous") as HTMLElement | null;
            if (!two) {
              two = document.createElement("p");
              two.className = "margin-note-previous";
              c.appendChild(two);
            }
            two.textContent = longest;
            host.appendChild(c);
            const cb = c.getBoundingClientRect();
            const boxes = [one, meta, two].map((e) => {
              const b = e.getBoundingClientRect();
              return { y: round(b.y), right: round(b.right), w: round(b.width) };
            });
            return {
              wrap,
              blockH: round(cb.height),
              blockRight: round(cb.right),
              hostRight: round(host.getBoundingClientRect().right),
              overflowPx: round(
                Math.max(...boxes.map((b) => b.right)) - host.getBoundingClientRect().right,
              ),
              rows: new Set(boxes.map((b) => b.y)).size,
              boxes,
            };
          };
          return { tally, wrap: measure("wrap"), nowrap: measure("nowrap") };
        });
        host.remove();
        return { stripW, results };
      },
      { longest: LONGEST, tallies: TALLIES },
    );
    out.push({ rig: rig.name, engine: info.project.name, ...row });
    await ctx.close();
  }
  bank(`R8-desk-triple-${info.project.name}.json`, out);
});
