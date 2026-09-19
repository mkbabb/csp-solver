/**
 * T9-W7 pass 3 · MRK-LIVE PROTOTYPE · ROUND 3 — the three rows round 2 could not read, and π.
 *
 * Motion declared (lint:motion grammar): no row here samples a tween. H reads a COLOUR and a
 * RECT at rest; I reads a token's computed value before and after its registration is deleted;
 * J reads rects on both servers at rest. PRM is irrelevant to all three and is not emulated.
 */
import { test, type Page } from "@playwright/test";
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

// ── H · §2.3 · the alias ablated where it can actually be ablated ────────────────────────
//
// Round 2's CSSOM walk removed 0 declarations: `--ring-ink` lives inside a nested/at-rule group
// the top-level walk never descends into. A custom property set to the CSS-wide `initial`
// keyword is GUARANTEED-INVALID at substitution, which is the same failure an absent publisher
// produces, so this is the ablation the row needs: the ring must fall to `currentColor`.
test("H · §2.3 the ring falls to currentColor when the alias goes", async ({
  page,
  browserName,
}) => {
  await boardReady(page);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(900);
  const row = await page.evaluate(async () => {
    const read = () => {
      const p = document.querySelector<SVGPathElement>(".focus-ring path");
      const r = document.querySelector<SVGElement>(".focus-ring");
      return {
        stroke: p ? getComputedStyle(p).stroke : null,
        currentColor: p ? getComputedStyle(p).color : null,
        alias: r ? getComputedStyle(r).getPropertyValue("--ring-ink").trim() : null,
        value: r
          ? getComputedStyle(r).getPropertyValue("--color-focus-sketch").trim()
          : null,
      };
    };
    const before = read();
    const s = document.createElement("style");
    s.textContent = ":root, .focus-ring { --ring-ink: initial; }";
    document.head.append(s);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const after = read();
    s.remove();
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    return { before, after, restored: read(), moved: before.stroke !== after.stroke };
  });
  bank(`R3-H-ring-ink-ablation-${browserName}.json`, { engine: browserName, ...row });
  console.log("H " + JSON.stringify(row));
});

// ── I · §2.5 · the note rung's publisher, read on the token itself ───────────────────────
//
// `.pencil-marks` is PEEK-GATED (`DigitCell.vue:283 v-if="showMarks"`) and `.cell-because`
// needs a solver round trip, so neither consumer exists on any route this lane drives; the row
// reads the PUBLISHER instead and says so. With the registration present the token computes
// 250ms everywhere; delete it and the token computes to nothing, which is what makes
// `animation: marks-fade-in var(--motion-note)` invalid at computed-value time rather than
// silently 0ms (the shape the first cut shipped).
test("I · §2.5 --motion-note has one home", async ({ page, browserName }) => {
  await boardReady(page);
  const row = await page.evaluate(() => {
    const hosts = ["html", "body", '[role="grid"]', ".game-cell"];
    const read = () =>
      hosts.map((h) => {
        const el = document.querySelector(h);
        return {
          host: h,
          token: el ? getComputedStyle(el).getPropertyValue("--motion-note").trim() : null,
        };
      });
    const before = read();
    let deletedRegistrations = 0;
    let declarationsFound = 0;
    const walk = (rules: CSSRuleList, sheet: CSSStyleSheet, depth = 0) => {
      for (let i = rules.length - 1; i >= 0; i--) {
        const r = rules[i] as CSSRule & { name?: string; cssRules?: CSSRuleList };
        if (r.constructor.name === "CSSPropertyRule" && r.name === "--motion-note") {
          if (depth === 0) {
            sheet.deleteRule(i);
            deletedRegistrations++;
          }
          continue;
        }
        const sr = r as CSSStyleRule;
        if (sr.style && sr.style.getPropertyValue("--motion-note")) declarationsFound++;
        if (r.cssRules) walk(r.cssRules, sheet, depth + 1);
      }
    };
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        walk(sheet.cssRules, sheet);
      } catch {
        /* cross-origin sheet */
      }
    }
    return { before, deletedRegistrations, declarationsFound, after: read() };
  });
  bank(`R3-I-motion-note-${browserName}.json`, { engine: browserName, ...row });
  console.log("I " + JSON.stringify(row));
});

// ── J · π · the ten struck fallbacks and the minted alias move no pixel and no colour ────
//
// Same route, same viewport, both servers: the prototype (4238) and the HEAD control
// (74a2b5d9, 4239, read-only). A rect census plus the computed ink of every `--color-teacher-red`
// consumer this diff touched.
test("J · π vs the HEAD control", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  const read = await page.evaluate(() => {
    const sel = [
      "button.logo-trigger",
      ".sun-moon-toggle",
      '[role="grid"]',
      "main",
      ".drawer-tab",
    ];
    const rects = sel.map((s) => {
      const e = document.querySelector(s);
      const r = e?.getBoundingClientRect();
      return {
        sel: s,
        r: r ? [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)] : null,
      };
    });
    const cells = Array.from(
      document.querySelectorAll<HTMLElement>('[role="grid"] [role="gridcell"]'),
    ).slice(0, 12);
    const cellRects = cells.map((c) => {
      const r = c.getBoundingClientRect();
      return [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)];
    });
    const ghosts = Array.from(
      document.querySelectorAll<SVGPathElement>(".cell-ghost-path"),
    ).slice(0, 12);
    const ghostRects = ghosts.map((g) => {
      const r = g.getBoundingClientRect();
      return [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)];
    });
    // The ten struck fallbacks all name `--color-teacher-red`; its computed value and the ink
    // of the surfaces that consume it are what π has to hold.
    const root = getComputedStyle(document.documentElement);
    return {
      rects,
      cellRects,
      ghostRects,
      teacherRed: root.getPropertyValue("--color-teacher-red").trim(),
      crayonRose: root.getPropertyValue("--color-crayon-rose").trim(),
      focusSketch: root.getPropertyValue("--color-focus-sketch").trim(),
      ghostStroke: ghosts[0] ? getComputedStyle(ghosts[0]).stroke : null,
      filters: Array.from(document.querySelectorAll<SVGElement>("*"))
        .filter((e) => getComputedStyle(e).filter !== "none")
        .length,
    };
  });
  bank(`R3-J-pi-${browserName}-${process.env.PI_TAG || "proto"}.json`, {
    engine: browserName,
    base: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238",
    ...read,
  });
  console.log("J " + JSON.stringify({ tag: process.env.PI_TAG, filters: read.filters }));
});
