import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * MRK-LIVE pass-3 RESEARCH probe — read-only, against the HEAD control server (74a2b5d9) on
 * 127.0.0.1:4238. No product file is touched and no prototype is loaded: every number here is
 * the ESTATE's own behaviour at the new base, taken to answer three research questions the
 * pass-2 critique left open as assertions.
 *
 *  A. WHAT KIND OF MOTION strands a resident focus ring? The critique proposed a
 *     `transitionend`/`animationend` re-arm. This counts the events the drawer press actually
 *     fires on the tab and its ancestors, against what `getAnimations()` sees.
 *  B. HOW LONG does the travel take, measured from the press, against `MOTION.boardFoldMs`
 *     (520) — the bound the prototype's `settle()` rAF loop uses.
 *  C. THE FOUR TIERS' computed ink at HEAD, for §2.5's rank table, plus the prefers-contrast arm.
 *
 * Motion declared (lint:motion grammar): this probe SAMPLES the drawer glide (WAAPI FLIP,
 * `MOTION.curves.drawerGlide`, 520ms) live; PRM would collapse it to a state cut, so PRM is off
 * for A/B by design and asserted separately.
 */

const OUT = path.join(import.meta.dirname, "../readings");
const bank = (name: string, data: unknown) => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2));
};

async function loadSudoku(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  // The board's SETTLE, not its ink. `drawer.spec.ts`'s recipe also polls for dealt glyphs;
  // this lane measures the ring's geometry and the ghost's computed ink, both of which exist
  // on an undealt board, and the dealt poll costs a solver round-trip this probe never uses.
  await expect
    .poll(() => page.locator(".sudoku-cell").count(), { timeout: 20000 })
    .toBeGreaterThan(0);
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 20000,
  });
}

test.use({ viewport: { width: 1280, height: 800 } });

test("A+B · what moves the drawer tab, and for how long", async ({ page }, info) => {
  await loadSudoku(page);

  const trace = await page.evaluate(async () => {
    const tab = document.querySelector<HTMLElement>(".drawer-tab");
    if (!tab) return { error: "no .drawer-tab" };
    const isAncestorOrSelf = (n: EventTarget | null) =>
      n instanceof Node && (n === tab || n.contains(tab) || tab.contains(n));
    const tag = (n: EventTarget | null) => {
      if (!(n instanceof Element)) return String(n);
      return `${n.tagName.toLowerCase()}.${(n.className || "").toString().split(/\s+/).filter(Boolean).slice(0, 2).join(".")}`;
    };

    const events: {
      type: string;
      target: string;
      name: string;
      t: number;
      onPath: boolean;
    }[] = [];
    const t0mark = { v: 0 };
    const rec = (e: Event) => {
      const any = e as TransitionEvent & AnimationEvent;
      events.push({
        type: e.type,
        target: tag(e.target),
        name: any.propertyName ?? any.animationName ?? "",
        t: Math.round(performance.now() - t0mark.v),
        onPath: isAncestorOrSelf(e.target),
      });
    };
    for (const t of [
      "transitionstart",
      "transitionend",
      "transitioncancel",
      "animationstart",
      "animationend",
      "animationcancel",
    ])
      document.addEventListener(t, rec, true);

    // Land focus on the tab the way a keyboard user does, then hold it there.
    tab.focus({ preventScroll: true });
    const focusVisible = tab.matches(":focus-visible");
    const r0 = tab.getBoundingClientRect();

    // What `getAnimations()` sees at rest, for the negative control.
    const restAnims = document.getAnimations().length;

    t0mark.v = performance.now();
    tab.click();

    const frames: {
      t: number;
      left: number;
      top: number;
      w: number;
      h: number;
      docAnims: number;
      pathAnims: number;
    }[] = [];
    const animSeen = new Map<string, { dur: number; easing: string; kind: string }>();
    const t0 = t0mark.v;
    await new Promise<void>((resolve) => {
      const step = () => {
        const now = performance.now();
        const r = tab.getBoundingClientRect();
        const docA = document.getAnimations();
        // Every animation whose target is the tab or one of its ancestors — what a
        // `getAnimations()`-driven re-arm would actually be able to wait on.
        const pathA = docA.filter((a) => {
          const t = (a.effect as KeyframeEffect | null)?.target ?? null;
          return isAncestorOrSelf(t);
        });
        for (const a of pathA) {
          const eff = a.effect as KeyframeEffect | null;
          const t = eff?.target ?? null;
          const css = a as Animation & {
            animationName?: string;
            transitionProperty?: string;
          };
          const kind = css.animationName
            ? `css-animation:${css.animationName}`
            : css.transitionProperty
              ? `css-transition:${css.transitionProperty}`
              : "waapi";
          const key = `${tag(t)}|${kind}`;
          if (!animSeen.has(key))
            animSeen.set(key, {
              dur: Number(eff?.getTiming().duration ?? 0),
              easing: String(eff?.getTiming().easing ?? ""),
              kind,
            });
        }
        frames.push({
          t: Math.round(now - t0),
          left: +r.left.toFixed(2),
          top: +r.top.toFixed(2),
          w: +r.width.toFixed(2),
          h: +r.height.toFixed(2),
          docAnims: docA.length,
          pathAnims: pathA.length,
        });
        if (now - t0 < 1600) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });

    for (const t of [
      "transitionstart",
      "transitionend",
      "transitioncancel",
      "animationstart",
      "animationend",
      "animationcancel",
    ])
      document.removeEventListener(t, rec, true);

    const rF = tab.getBoundingClientRect();
    const moved = (a: (typeof frames)[number], b: (typeof frames)[number]) =>
      a.left !== b.left || a.top !== b.top || a.w !== b.w || a.h !== b.h;
    let lastMove = 0;
    for (let i = 1; i < frames.length; i++)
      if (moved(frames[i - 1], frames[i])) lastMove = frames[i].t;

    return {
      focusVisible,
      stillFocused: document.activeElement === tab,
      restAnims,
      first: { left: +r0.left.toFixed(2), top: +r0.top.toFixed(2), w: +r0.width.toFixed(2), h: +r0.height.toFixed(2) },
      last: { left: +rF.left.toFixed(2), top: +rF.top.toFixed(2), w: +rF.width.toFixed(2), h: +rF.height.toFixed(2) },
      travelPx: +Math.hypot(rF.left - r0.left, rF.top - r0.top).toFixed(2),
      lastMoveMs: lastMove,
      framesSampled: frames.length,
      peakDocAnims: Math.max(...frames.map((f) => f.docAnims)),
      peakPathAnims: Math.max(...frames.map((f) => f.pathAnims)),
      firstPathAnimAtMs: frames.find((f) => f.pathAnims > 0)?.t ?? null,
      lastPathAnimAtMs: [...frames].reverse().find((f) => f.pathAnims > 0)?.t ?? null,
      animationsOnPath: [...animSeen.entries()].map(([k, v]) => ({ key: k, ...v })),
      events,
      eventsOnPath: events.filter((e) => e.onPath),
      frames: frames.filter((_, i) => i % 3 === 0),
    };
  });

  bank(`A-travel-${info.project.name}.json`, trace);
  console.log(
    `[${info.project.name}] travel=${(trace as any).travelPx}px lastMove=${(trace as any).lastMoveMs}ms ` +
      `pathEvents=${((trace as any).eventsOnPath ?? []).length} pathAnims(peak)=${(trace as any).peakPathAnims} ` +
      `kinds=${JSON.stringify((trace as any).animationsOnPath)}`,
  );
});

test("C · the four ghost tiers' computed ink at HEAD", async ({ page }, info) => {
  await loadSudoku(page);
  const read = async () =>
    page.evaluate(() => {
      const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")];
      const cell = cells[40] ?? cells[0];
      const path = cell.querySelector<SVGPathElement>(".cell-ghost-path")!;
      const get = () => {
        const cs = getComputedStyle(path);
        return {
          strokeWidth: cs.strokeWidth,
          strokeOpacity: cs.strokeOpacity,
          fillOpacity: cs.fillOpacity,
          stroke: cs.stroke,
          fill: cs.fill,
        };
      };
      const out: Record<string, ReturnType<typeof get>> = {};
      cell.className = cell.className.replace(/\bis-(invalid|peer-cursor)\b/g, "");
      out.tier1_base = get();
      cell.classList.add("is-peer-cursor");
      out.tier4_peerCursor = get();
      cell.classList.remove("is-peer-cursor");
      cell.classList.add("is-invalid");
      out.tier3_invalid = get();
      cell.classList.remove("is-invalid");
      // Tier 2 needs real :focus-visible — drive it from the keyboard side below.
      return out;
    });

  const normal = await read();
  await page.emulateMedia({ contrast: "more" as never }).catch(() => {});
  const contrast = await read().catch(() => null);
  await page.emulateMedia({ contrast: "no-preference" as never }).catch(() => {});

  // Tier 2 for real: keyboard focus on a cell input.
  const tier2 = await page.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")];
    const cell = cells[40] ?? cells[0];
    const input = cell.querySelector<HTMLInputElement>("input.cell-native-input");
    input?.focus();
    return null;
  });
  await page.keyboard.press("ArrowRight");
  const tier2read = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    const cell = el?.closest<HTMLElement>(".game-cell");
    if (!cell) return null;
    const p = cell.querySelector<SVGPathElement>(".cell-ghost-path");
    if (!p) return null;
    const cs = getComputedStyle(p);
    return {
      focusVisible: !!el?.matches(":focus-visible"),
      strokeWidth: cs.strokeWidth,
      strokeOpacity: cs.strokeOpacity,
      fillOpacity: cs.fillOpacity,
      stroke: cs.stroke,
      fill: cs.fill,
    };
  });

  const out = { normal, contrast, tier2: tier2read, tier2Note: tier2 };
  bank(`C-tiers-${info.project.name}.json`, out);
  console.log(`[${info.project.name}] tiers=${JSON.stringify(out, null, 1)}`);
});
