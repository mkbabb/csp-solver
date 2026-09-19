/**
 * T9-W7 pass 3 · MRK-LIVE CRITIC's own re-measurement.
 *
 * Motion declared: rows 1 and 2 SAMPLE the drawer's WAAPI glide live (PRM off by design);
 * rows 3-5 are static reads. Servers: prototype 127.0.0.1:4244 (worktree wf_f72f3b5a-83a-35),
 * HEAD control 127.0.0.1:4245 (main tree, 74a2b5d9). Read-only on both trees.
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
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 90000 });
  await page.waitForTimeout(1500);
}

test("1 · G-LIVE-4 re-run + the settle loop's real shape", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);

  // Count every getAnimations() call with its timestamp: one running() sweep = one call per
  // ancestor, so the call timeline exposes how many settle chains are alive per frame.
  await page.evaluate(() => {
    const w = window as any;
    w.__ga = [];
    const orig = Element.prototype.getAnimations;
    Element.prototype.getAnimations = function (...a: any[]) {
      w.__ga.push(performance.now());
      return orig.apply(this, a as any);
    };
  });

  await page.keyboard.press("Tab"); // keyboard modality
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.drawer-tab")?.focus(),
  );
  await page.waitForTimeout(900);

  const before = await page.evaluate(() => {
    const t = document.querySelector("button.drawer-tab")!;
    const r = document.querySelector(".focus-ring");
    let n = 0;
    for (let e: Element | null = t; e; e = e.parentElement) n++;
    return {
      rings: document.querySelectorAll(".focus-ring").length,
      chainLen: n,
      fv: t.matches(":focus-visible"),
      active: document.activeElement?.className ?? null,
      ring: r ? r.getBoundingClientRect().toJSON() : null,
      box: t.getBoundingClientRect().toJSON(),
      outset: parseFloat(
        getComputedStyle(t).getPropertyValue("--focus-ring-outset"),
      ),
    };
  });

  await page.evaluate(() => ((window as any).__ga.length = 0));
  const t0 = await page.evaluate(() => {
    (window as any).__t0 = performance.now();
    return (window as any).__t0;
  });
  await page.keyboard.press("Enter");

  // Wait for the tab's own ancestor path to be quiet, then +100ms — the gate's own bound.
  await page.waitForFunction(
    () => {
      const t = document.querySelector("button.drawer-tab");
      if (!t) return true;
      const out: Animation[] = [];
      for (let e: Element | null = t; e; e = e.parentElement)
        out.push(...e.getAnimations());
      return (
        out.filter((a) =>
          Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity),
        ).length === 0
      );
    },
    undefined,
    { timeout: 30000 },
  );
  await page.waitForTimeout(100);

  const after = await page.evaluate(() => {
    const t = document.querySelector("button.drawer-tab");
    const r = document.querySelector(".focus-ring");
    const a = document.activeElement as HTMLElement | null;
    const o = t
      ? parseFloat(getComputedStyle(t).getPropertyValue("--focus-ring-outset"))
      : NaN;
    const rb = r?.getBoundingClientRect();
    const bb = t?.getBoundingClientRect();
    return {
      rings: document.querySelectorAll(".focus-ring").length,
      active: a ? a.tagName + "." + a.className : null,
      activeIsTab: a?.classList.contains("drawer-tab") ?? false,
      dLeft: rb && bb ? +Math.abs(rb.left - (bb.left - o)).toFixed(2) : null,
      dTop: rb && bb ? +Math.abs(rb.top - (bb.top - o)).toFixed(2) : null,
      outset: o,
    };
  });

  // The loop's shape: how long after the last animation does the ring keep polling, and how
  // many concurrent chains are alive (calls per frame / chain length).
  const loop = await page.evaluate(() => {
    const w = window as any;
    const ga: number[] = w.__ga;
    const t0: number = w.__t0;
    // bucket into 16ms frames
    const buckets = new Map<number, number>();
    for (const t of ga) {
      const k = Math.round((t - t0) / 16);
      buckets.set(k, (buckets.get(k) ?? 0) + 1);
    }
    const rows = [...buckets.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([k, n]) => ({ frameMs: k * 16, calls: n }));
    return { total: ga.length, firstMs: ga.length ? +(ga[0] - t0).toFixed(1) : null, lastMs: ga.length ? +(ga[ga.length - 1] - t0).toFixed(1) : null, rows };
  });

  // Idle: how many style writes does the ring take in a quiet 900ms?
  await page.evaluate(() => {
    const w = window as any;
    w.__mut = 0;
    const r = document.querySelector(".focus-ring");
    if (!r) return;
    w.__mo = new MutationObserver((m) => (w.__mut += m.length));
    w.__mo.observe(r, { attributes: true, attributeFilter: ["style", "width", "height", "viewBox"] });
  });
  await page.evaluate(() => ((window as any).__ga.length = 0));
  await page.waitForTimeout(900);
  const idle = await page.evaluate(() => ({
    styleWrites: (window as any).__mut,
    getAnimationsCalls: (window as any).__ga.length,
  }));

  bank(`CRITIC-1-g4-${info.project.name}.json`, { before, after, loop, idle, t0 });
  expect(after.rings, "a ring exists after the press").toBe(1);
});

test("2 · the rank, both media arms, live computed", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const read = async (arm: "no-preference" | "more") => {
    await page.emulateMedia({ contrast: arm } as any);
    await page.waitForTimeout(300);
    return page.evaluate(() => {
      const mq = matchMedia("(prefers-contrast: more)").matches;
      const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
      const paths = (c: HTMLElement) =>
        c.querySelector<SVGElement>(".cell-ghost-path");
      const val = (c: HTMLElement | undefined) => {
        if (!c) return null;
        const p = paths(c);
        return p
          ? {
              strokeOpacity: getComputedStyle(p).strokeOpacity,
              strokeWidth: getComputedStyle(p).strokeWidth,
            }
          : null;
      };
      const focused = cells.find((c) => c.querySelector("input:focus-visible"));
      const hovered = cells.find((c) => c.matches(":hover"));
      const invalid = cells.find((c) => c.classList.contains("is-invalid"));
      const peer = cells.find((c) => c.classList.contains("is-peer-cursor"));
      return {
        prefersContrastMore: mq,
        tier2_focus: val(focused),
        tier1_hover: val(hovered),
        tier3_invalid: val(invalid),
        tier4_peer: val(peer),
        cells: cells.length,
      };
    });
  };

  const url = (process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4244");
  await boardReady(page);
  // paint tier 2 (focus a cell) and tier 1 (hover a different cell)
  const boxes = await page.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
    const empty = cells.filter((c) => {
      const i = c.querySelector<HTMLInputElement>("input");
      return i && !i.readOnly && !i.disabled;
    });
    const a = empty[0] ?? cells[0];
    const b = empty[10] ?? cells[10];
    (a.querySelector("input") as HTMLInputElement | null)?.focus();
    const rb = b.getBoundingClientRect();
    return { hoverX: rb.left + rb.width / 2, hoverY: rb.top + rb.height / 2 };
  });
  await page.mouse.move(boxes.hoverX, boxes.hoverY);
  await page.waitForTimeout(400);

  const normal = await read("no-preference");
  const more = await read("more");
  // CSSOM: what the sheets DECLARE for tier 2 and the contrast base
  const declared = await page.evaluate(() => {
    const out: { sheet: string; sel: string; op: string }[] = [];
    for (const s of [...document.styleSheets]) {
      let rules: CSSRuleList;
      try {
        rules = s.cssRules;
      } catch {
        continue;
      }
      const walk = (rs: CSSRuleList, media: string) => {
        for (const r of [...rs] as any[]) {
          if (r.cssRules) walk(r.cssRules, media + " " + (r.conditionText ?? ""));
          const st = r.style;
          if (st && st.getPropertyValue("stroke-opacity"))
            out.push({
              sheet: media.trim(),
              sel: r.selectorText,
              op: st.getPropertyValue("stroke-opacity"),
            });
        }
      };
      walk(rules, "");
    }
    return out.filter((r) => /ghost-path|cell/.test(r.sel ?? ""));
  });
  bank(`CRITIC-2-rank-${info.project.name}-${url.slice(-4)}.json`, {
    url,
    normal,
    more,
    declared,
  });
});

test("3 · pi rect census against the control", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const url = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4244";
  await boardReady(page);
  const census = await page.evaluate(() => {
    const sel = [
      "header",
      "button.logo-trigger",
      "button.drawer-tab",
      ".sun-moon-toggle",
      '[role="grid"]',
      ".game-cell",
      ".cell-ghost-path",
      ".pencil-marks",
      "main",
      "footer",
    ];
    const rows: Record<string, number[][]> = {};
    for (const s of sel)
      rows[s] = [...document.querySelectorAll(s)].slice(0, 12).map((e) => {
        const r = e.getBoundingClientRect();
        return [r.left, r.top, r.width, r.height].map((v) => +v.toFixed(2));
      });
    return rows;
  });
  bank(`CRITIC-3-rects-${info.project.name}-${url.slice(-4)}.json`, { url, census });
});
