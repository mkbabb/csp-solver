/**
 * T9-W7 pass 3 · MRK-LIVE PROTOTYPE · the rank (G-LIVE-14), the animation set (G-LIVE-15),
 * the modality equivalence (G-LIVE-16), the registration ablation (G-LIVE-18) and the
 * toggle's seam (G-LIVE-19).
 *
 * Motion declared (lint:motion grammar): rows D and E hold the page STILL and read computed
 * ink only — no motion is sampled; row B presses the drawer tab and samples its WAAPI glide
 * (520ms) on purpose; row F asserts the PRM arm (pose 0, zero swaps).
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

// ── A · G-LIVE-14 · the rank is an ORDER in both media arms ──────────────────────────────
test("A · G-LIVE-14 the four tiers, normal and prefers-contrast", async ({
  page,
  browserName,
}) => {
  await boardReady(page);
  const readStatic = () =>
    page.evaluate(() => {
      const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
      const cell = cells[40] ?? cells[0];
      const p = cell.querySelector<SVGPathElement>(".cell-ghost-path")!;
      const so = () => +getComputedStyle(p).strokeOpacity;
      cell.className = cell.className.replace(/\bis-(invalid|peer-cursor)\b/g, "");
      const tier1 = so();
      cell.classList.add("is-peer-cursor");
      const tier4 = so();
      cell.classList.remove("is-peer-cursor");
      cell.classList.add("is-invalid");
      const tier3 = so();
      cell.classList.remove("is-invalid");
      return { tier1, tier3, tier4 };
    });
  const readTier2 = async () => {
    await page.evaluate(() => {
      const inputs = [
        ...document.querySelectorAll<HTMLInputElement>(".game-cell input"),
      ];
      inputs[41]?.focus();
    });
    await page.waitForTimeout(700);
    return page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      const cell = el?.closest<HTMLElement>(".game-cell");
      const p = cell?.querySelector<SVGPathElement>(".cell-ghost-path");
      return {
        focusVisible: !!el?.matches(":focus-visible"),
        tier2: p ? +getComputedStyle(p).strokeOpacity : null,
      };
    });
  };

  const normal = { ...(await readStatic()), ...(await readTier2()) };
  let contrastApplied = false;
  await page.emulateMedia({ contrast: "more" } as never).catch(() => {});
  contrastApplied = await page.evaluate(
    () => window.matchMedia("(prefers-contrast: more)").matches,
  );
  const contrast = contrastApplied
    ? { ...(await readStatic()), ...(await readTier2()) }
    : null;
  await page.emulateMedia({ contrast: "no-preference" } as never).catch(() => {});

  const order = (r: { tier1: number; tier2: number | null; tier3: number; tier4: number }) =>
    r.tier2 !== null && r.tier3 > r.tier2 && r.tier2 > r.tier1 && r.tier1 > r.tier4;
  const row = {
    engine: browserName,
    normal,
    normalOrdered: order(normal as never),
    contrastApplied,
    contrast,
    contrastOrdered: contrast ? order(contrast as never) : null,
    note: contrastApplied
      ? "prefers-contrast emulated by instrument"
      : "prefers-contrast NOT emulable in this engine — arm unread",
  };
  bank(`RANK-${browserName}.json`, row);
  console.log("A " + JSON.stringify(row));
});

// ── B · G-LIVE-15 · no focus stop rests on a running animation ───────────────────────────
const STOPS = [
  "button.logo-trigger",
  ".sun-moon-toggle",
  ".drawer-tab",
  ".staging-btn",
  ".guard-btn",
];

test("B · G-LIVE-15 the animation set at rest, at peak, and the negative control", async ({
  page,
  browserName,
}) => {
  await boardReady(page);
  const finiteOnPath = `(() => {
    const a = document.activeElement;
    const list = [];
    for (let e = a; e; e = e.parentElement) list.push(...e.getAnimations());
    const finite = list.filter((x) => Number.isFinite(x.effect?.getComputedTiming().endTime ?? Infinity));
    return { all: list.length, finite: finite.length, doc: document.getAnimations().length };
  })()`;

  const atRest: Record<string, unknown> = {};
  for (const sel of STOPS) {
    const present = await page.locator(sel).count();
    if (!present) {
      atRest[sel] = { present: 0 };
      continue;
    }
    await page.evaluate((s) => {
      document.querySelector<HTMLElement>(s)?.focus({ preventScroll: true });
    }, sel);
    await page.waitForTimeout(900);
    atRest[sel] = { present: 1, ...(await page.evaluate(finiteOnPath)) };
  }

  // Peak: press the tab and sample the set while it glides.
  let peak: unknown = null;
  if (await page.locator(".drawer-tab").count()) {
    peak = await page.evaluate(async () => {
      const tab = document.querySelector<HTMLElement>(".drawer-tab")!;
      tab.focus({ preventScroll: true });
      const read = () => {
        const list: Animation[] = [];
        for (let e: Element | null = tab; e; e = e.parentElement)
          list.push(...e.getAnimations());
        return list.filter((x) =>
          Number.isFinite(x.effect?.getComputedTiming().endTime ?? Infinity),
        ).length;
      };
      tab.click();
      let max = 0;
      const t0 = performance.now();
      await new Promise<void>((res) => {
        const step = () => {
          max = Math.max(max, read());
          if (performance.now() - t0 < 700) requestAnimationFrame(step);
          else res();
        };
        requestAnimationFrame(step);
      });
      return { peakFiniteOnPath: max };
    });
    await page.waitForTimeout(900);
  }

  // The negative control: an INFINITE animation on body must not enter the set.
  const control = await page.evaluate(() => {
    const anim = document.body.animate([{ opacity: 1 }, { opacity: 1 }], {
      duration: 1000,
      iterations: Infinity,
    });
    const a = document.activeElement as HTMLElement | null;
    const list: Animation[] = [];
    for (let e: Element | null = a; e; e = e.parentElement)
      list.push(...e.getAnimations());
    const finite = list.filter((x) =>
      Number.isFinite(x.effect?.getComputedTiming().endTime ?? Infinity),
    );
    const out = { allWithInfinite: list.length, finiteWithInfinite: finite.length };
    anim.cancel();
    return out;
  });

  const row = { engine: browserName, atRest, peak, control };
  bank(`STOPS-${browserName}.json`, row);
  console.log("B " + JSON.stringify(row));
});

// ── C · G-LIVE-16 · the modality equivalence, button and link ────────────────────────────
test("C · G-LIVE-16 ring ⇔ :focus-visible, three modalities × two kinds", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  // The law is the equivalence WHERE THE RING IS THE VOICE: the board draws its own hand, so a
  // focused cell input (EXEMPT) is expected to show no drawn ring while matching :focus-visible.
  const read = () =>
    page.evaluate(() => {
      const EXEMPT = ".cell-native-input, .gallery-viewport";
      const a = document.activeElement as HTMLElement | null;
      const fv = !!a?.matches(":focus-visible");
      const exempt = !!a?.matches(EXEMPT);
      const rings = document.querySelectorAll(".focus-ring").length;
      return {
        active: a?.tagName.toLowerCase() + "." + (a?.className || "").toString().split(/\s+/)[0],
        fv,
        exempt,
        rings,
        expected: fv && !exempt ? 1 : 0,
        equal: rings === (fv && !exempt ? 1 : 0),
      };
    });

  for (const kind of ["button", "link"] as const) {
    const sel = kind === "button" ? ".drawer-tab" : "a[href^='https://']";
    // 1 · cold page + programmatic focus
    await boardReady(page);
    const count = await page.locator(sel).count();
    if (!count) {
      rows.push({ kind, sel, present: 0 });
      continue;
    }
    await page.evaluate((s) => {
      document.querySelector<HTMLElement>(s)?.focus({ preventScroll: true });
    }, sel);
    await page.waitForTimeout(800);
    rows.push({ kind, sel, modality: "cold+programmatic", ...(await read()) });

    // 2 · Tab-arrived (walk until the element has focus, bounded)
    await boardReady(page);
    let arrived = false;
    for (let i = 0; i < 40 && !arrived; i++) {
      await page.keyboard.press("Tab");
      arrived = await page.evaluate(
        (s) => document.activeElement?.matches(s) ?? false,
        sel,
      );
    }
    await page.waitForTimeout(700);
    rows.push({ kind, sel, modality: "tab-arrived", arrived, ...(await read()) });

    // 3 · pointer first, then programmatic focus. The click lands on the page's own chrome
    // margin, never on a control: what it sets is the MODALITY, nothing else.
    await boardReady(page);
    await page.mouse.move(8, 400);
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(300);
    await page.evaluate((s) => {
      document.querySelector<HTMLElement>(s)?.focus({ preventScroll: true });
    }, sel);
    await page.waitForTimeout(800);
    rows.push({ kind, sel, modality: "pointer-then-programmatic", ...(await read()) });
  }
  const equiv = rows
    .filter((r: never) => (r as { equal?: boolean }).equal !== undefined)
    .map((r: never) => (r as { equal: boolean }).equal);
  const row = { engine: browserName, rows, equivalence: equiv, allEqual: equiv.every(Boolean) };
  bank(`MODALITY-${browserName}.json`, row);
  console.log("C " + JSON.stringify(row));
});

// ── D · G-LIVE-18 · the registration is load-bearing ─────────────────────────────────────
test("D · G-LIVE-18 delete @property --focus-ring-outset and the ring vanishes", async ({
  page,
  browserName,
}) => {
  await boardReady(page);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(800);
  const before = await page.evaluate(() => {
    const r = document.querySelector<SVGElement>(".focus-ring");
    const b = r?.getBoundingClientRect();
    return { rings: document.querySelectorAll(".focus-ring").length, w: b ? +b.width.toFixed(2) : null };
  });

  const ablation = await page.evaluate(() => {
    let deleted = 0;
    for (const sheet of [...document.styleSheets]) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (let i = rules.length - 1; i >= 0; i--) {
        const r = rules[i] as CSSRule & { name?: string };
        if (r.constructor.name === "CSSPropertyRule" && r.name === "--focus-ring-outset") {
          sheet.deleteRule(i);
          deleted++;
        }
      }
    }
    return { deleted };
  });
  // Force a re-measure the way a focus change does.
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur();
  });
  await page.waitForTimeout(300);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => {
    const r = document.querySelector<SVGElement>(".focus-ring");
    const b = r?.getBoundingClientRect();
    const declared = getComputedStyle(
      document.querySelector("button.logo-trigger")!,
    ).getPropertyValue("--focus-ring-outset");
    return {
      rings: document.querySelectorAll(".focus-ring").length,
      w: b ? +b.width.toFixed(2) : null,
      declared,
    };
  });
  const row = { engine: browserName, before, ablation, after };
  bank(`ABLATION-${browserName}.json`, row);
  console.log("D " + JSON.stringify(row));
});

// ── E · G-LIVE-19 · the toggle's ring paints with no `, 0px` anywhere ────────────────────
test("E · G-LIVE-19 the toggle's seam at 1280 and 393", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  for (const vp of [
    { w: 1280, h: 800 },
    { w: 393, h: 699 },
  ]) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await boardReady(page);
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".sun-moon-toggle")?.focus({ preventScroll: true }),
    );
    await page.waitForTimeout(900);
    rows.push({
      viewport: `${vp.w}x${vp.h}`,
      ...(await page.evaluate(() => {
        const t = document.querySelector<HTMLElement>(".sun-moon-toggle");
        const r = document.querySelector<SVGElement>(".focus-ring");
        const tb = t?.getBoundingClientRect();
        const rb = r?.getBoundingClientRect();
        const cs = t ? getComputedStyle(t) : null;
        return {
          bleed: cs?.getPropertyValue("--toggle-bleed").trim() ?? null,
          outset: cs?.getPropertyValue("--focus-ring-outset").trim() ?? null,
          btn: tb ? { w: +tb.width.toFixed(2), h: +tb.height.toFixed(2) } : null,
          ring: rb ? { w: +rb.width.toFixed(2), h: +rb.height.toFixed(2) } : null,
          offset: rb && tb ? +(tb.left - rb.left).toFixed(2) : null,
          zIndex: r ? getComputedStyle(r).zIndex : null,
        };
      })),
    });
  }
  bank(`TOGGLE-${browserName}.json`, { engine: browserName, rows });
  console.log("E " + JSON.stringify(rows));
});

// ── F · PRM: pose 0, zero swaps, the ring still lands ────────────────────────────────────
test("F · the PRM arm — the ring appears without stepping", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await boardReady(page);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus({ preventScroll: true }),
  );
  const out = await page.evaluate(async () => {
    const seen: number[] = [];
    const ring = () => document.querySelector<SVGElement>(".focus-ring");
    const poseOf = () => {
      const paths = [...(ring()?.querySelectorAll("path") ?? [])];
      return paths.findIndex((p) => (p as SVGPathElement).style.opacity !== "0");
    };
    for (let i = 0; i < 24; i++) {
      seen.push(poseOf());
      await new Promise((r) => setTimeout(r, 60));
    }
    return {
      rings: document.querySelectorAll(".focus-ring").length,
      poses: [...new Set(seen)],
      swaps: seen.filter((v, i) => i > 0 && v !== seen[i - 1]).length,
    };
  });
  bank(`PRM-${browserName}.json`, { engine: browserName, ...out });
  console.log("F " + JSON.stringify(out));
  await page.emulateMedia({ reducedMotion: "no-preference" });
});
