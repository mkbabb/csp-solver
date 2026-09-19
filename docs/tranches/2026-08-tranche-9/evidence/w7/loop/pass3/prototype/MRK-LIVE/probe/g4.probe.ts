/**
 * T9-W7 pass 3 · MRK-LIVE PROTOTYPE · G-LIVE-4 (re-cut) and the loop's life.
 *
 * Worktree `wf_f72f3b5a-83a-35` (uncommitted), served on 127.0.0.1:4238; the HEAD control
 * (74a2b5d9) is the same probe with PLAYWRIGHT_BASE_URL=http://127.0.0.1:4239.
 *
 * Motion declared (lint:motion grammar): every row here SAMPLES the drawer's WAAPI glide
 * (`MOTION.curves.drawerGlide`, 520ms) and the deck's track glide live, so PRM is OFF by
 * design for the travel rows; the PRM arm is asserted in `ring.probe.ts` (pose 0, 0 swaps).
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, q = "?game=sudoku") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}

async function galleryReady(page: Page) {
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1500);
}

/** The framing error the gate asserts: |ring.left − (box.left − outset)|, same for top. */
const FRAMING = `(() => {
  const a = document.activeElement;
  const ring = document.querySelector('.focus-ring');
  const owned = a && a.getAttribute && a.getAttribute('aria-activedescendant');
  const box = owned ? document.getElementById(owned) : a;
  if (!ring || !box) return { ring: !!ring, box: !!box, err: null };
  const rb = ring.getBoundingClientRect();
  const bb = box.getBoundingClientRect();
  const o = parseFloat(getComputedStyle(box).getPropertyValue('--focus-ring-outset'));
  return {
    ring: true, box: true, outset: o,
    dLeft: +Math.abs(rb.left - (bb.left - o)).toFixed(2),
    dTop: +Math.abs(rb.top - (bb.top - o)).toFixed(2),
    err: +Math.max(Math.abs(rb.left - (bb.left - o)), Math.abs(rb.top - (bb.top - o))).toFixed(2),
    rings: document.querySelectorAll('.focus-ring').length,
  };
})()`;

/** Wait until nothing finite runs on the RING'S TARGET's own ancestor path, then +100ms. The
 *  target is the activedescendant when one is declared: the deck's scrollport keeps DOM focus
 *  while the CARD is what travels, and the track that moves it is the card's ancestor, not the
 *  scrollport's. Reading the scrollport's chain returns still while the card is mid-flight. */
async function waitStill(page: Page, ms = 100) {
  await page.waitForFunction(
    () => {
      const a = document.activeElement as HTMLElement | null;
      if (!a) return true;
      const owned = a.getAttribute?.("aria-activedescendant");
      const box = (owned && document.getElementById(owned)) || a;
      const out: Animation[] = [];
      for (let e: Element | null = box; e; e = e.parentElement)
        out.push(...e.getAnimations());
      return (
        out.filter((x) =>
          Number.isFinite(x.effect?.getComputedTiming().endTime ?? Infinity),
        ).length === 0
      );
    },
    undefined,
    { timeout: 20000 },
  );
  await page.waitForTimeout(ms);
}

// ── A · the tab: press it with focus resident, then read the pixel ───────────────────────
for (const vp of [
  { w: 1280, h: 800, name: "1280x800" },
  { w: 393, h: 699, name: "393x699" },
]) {
  test(`A · G-LIVE-4 the ring travels with the tab @${vp.name}`, async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await boardReady(page);
    const hasTab = await page.locator(".drawer-tab").count();
    if (!hasTab) {
      bank(`A-tab-${vp.name}-${browserName}.json`, { engine: browserName, viewport: vp.name, tab: 0, note: "no .drawer-tab at this viewport" });
      test.skip(true, "no .drawer-tab at this viewport");
      return;
    }
    // A key press first, so the modality is keyboard and :focus-visible is true either way.
    await page.keyboard.press("Tab");
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".drawer-tab")?.focus({ preventScroll: true }),
    );
    await page.waitForTimeout(400);
    const before = await page.evaluate(FRAMING);

    // THE DEFECT'S OWN GESTURE: press the control the ring is already on.
    await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
    await waitStill(page);
    // The dock sheet SLIDES (standing trap) and on a phone the estate moves focus INTO it, so
    // the row also polls the settled pose and names whoever holds focus at the end.
    await page.waitForTimeout(700);
    await waitStill(page);
    const afterPress = await page.evaluate(FRAMING);
    const afterOwner = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      return {
        active: a ? a.tagName.toLowerCase() + "." + (a.className || "").toString().split(/\s+/)[0] : null,
        fv: !!a?.matches(":focus-visible"),
      };
    });

    // The reversal: press again mid-glide, so the first glide is CANCELLED (`finished` rejects).
    await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
    await page.waitForTimeout(160);
    await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
    await waitStill(page);
    const afterReversal = await page.evaluate(FRAMING);

    // Idle: the loop must not exist. Count ring writes over 900ms.
    const idle = await page.evaluate(async () => {
      const ring = document.querySelector<SVGElement>(".focus-ring");
      if (!ring) return { writes: null, rafSteps: null };
      let writes = 0;
      const mo = new MutationObserver((recs) => {
        writes += recs.length;
      });
      mo.observe(ring, { attributes: true, attributeFilter: ["style"] });
      await new Promise((r) => setTimeout(r, 900));
      mo.disconnect();
      return { writes };
    });

    const row = { engine: browserName, viewport: vp.name, before, afterPress, afterReversal, idle };
    bank(`A-tab-${vp.name}-${browserName}.json`, row);
    console.log(`A ${browserName} ${vp.name} ` + JSON.stringify(row));
    expect(afterPress.err).not.toBeNull();
  });
}

// ── B · the deck's landing, at the box's own rate and at a HALVED animation rate ─────────
//
// Playwright emulates no display refresh rate in either engine (no CDP/WebKit surface for it),
// so the 60/120 Hz pair the brief asks for is read as its MECHANISM instead: a frame-count or
// duration bound fails when the number of frames per unit of animation changes, and halving an
// animation's `playbackRate` changes exactly that ratio (a 520 ms glide becomes 1040 ms of
// frames). `rate: 1` is the box's own cadence; `rate: 0.5` is the stress. Named, not claimed.
test("B · G-LIVE-4 deck landing, rate 1 and rate 0.5", async ({ page, browserName }) => {
  await galleryReady(page);
  const rows: unknown[] = [];
  for (const rate of [1, 0.5]) {
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".gallery-viewport")?.focus(),
    );
    await page.waitForTimeout(600);
    await page.keyboard.press("ArrowRight");
    if (rate !== 1)
      await page.evaluate((r) => {
        for (const a of document.getAnimations()) a.playbackRate = r;
      }, rate);
    await waitStill(page, 120);
    const r = await page.evaluate(FRAMING);
    rows.push({ rate, ...r });
    await page.keyboard.press("ArrowLeft");
    await waitStill(page, 120);
  }
  bank(`B-deck-${browserName}.json`, { engine: browserName, rows });
  console.log(`B ${browserName} ` + JSON.stringify(rows));
});

// ── C · the loop exits: rAF steps after the last animation, and idle repositions ─────────
test("C · the settle loop exits and idle costs 4 writes/900ms", async ({
  page,
  browserName,
}) => {
  await boardReady(page);
  await page.keyboard.press("Tab");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".drawer-tab, .staging-btn, button.logo-trigger")?.focus(),
  );
  await waitStill(page, 200);
  const out = await page.evaluate(async () => {
    const ring = document.querySelector<SVGElement>(".focus-ring");
    const a = document.activeElement as HTMLElement | null;
    const finiteOnPath = () => {
      const list: Animation[] = [];
      for (let e: Element | null = a; e; e = e.parentElement)
        list.push(...e.getAnimations());
      return list.filter((x) =>
        Number.isFinite(x.effect?.getComputedTiming().endTime ?? Infinity),
      ).length;
    };
    let writes = 0;
    if (ring) {
      const mo = new MutationObserver((r) => {
        writes += r.length;
      });
      mo.observe(ring, { attributes: true, attributeFilter: ["style"] });
      await new Promise((r) => setTimeout(r, 900));
      mo.disconnect();
    }
    return {
      active: a?.className?.toString().slice(0, 50) ?? null,
      hasRing: !!ring,
      idleWrites: writes,
      finiteAnimsOnPathAtRest: finiteOnPath(),
      docAnimsAtRest: document.getAnimations().length,
    };
  });
  bank(`C-idle-${browserName}.json`, { engine: browserName, ...out });
  console.log(`C ${browserName} ` + JSON.stringify(out));
});
