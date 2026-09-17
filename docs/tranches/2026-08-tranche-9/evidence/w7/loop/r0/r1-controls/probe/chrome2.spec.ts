import { test, type Page } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * T9-W7 R1 · PROBE 2 — the three readings probe 1 could not take:
 *   · the SHUT dock (what a reader reaches before the sheet rises — M10/M13's own cell)
 *   · the DRAWN stroke, not the container box: `HandDrawnOutline`'s svg outsets past its
 *     host, and M03's frame is a stroke over the wordmark, not a box over it
 *   · the FOCUS idiom on one member of every treatment class (§6's floor is a11y's, its
 *     look is W7's)
 * Read-only; one gesture (Tab) per focus reading.
 */

const OUT = path.resolve(__dirname, "..");

async function loadBoard(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
  await page.waitForTimeout(1200);
}

function shutRead() {
  const box = (el: Element | null) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: +r.x.toFixed(2),
      y: +r.y.toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      bottom: +r.bottom.toFixed(2),
      right: +r.right.toFixed(2),
    };
  };
  const tab = document.querySelector<HTMLElement>(".drawer-tab");
  const board = document.querySelector(".board-wrapper");
  const paper = document.querySelector("#board-edge");
  const tongueText = document.querySelector(".drawer-tab-text");
  const fold = document.querySelector("#fold-tools");
  const cs = tab ? getComputedStyle(tab) : null;
  return {
    shut: document.documentElement.classList.contains("drawer-closed"),
    viewport: { w: innerWidth, h: innerHeight },
    tab: tab
      ? {
          box: box(tab),
          z: cs!.zIndex,
          display: cs!.display,
          writingMode: tongueText ? getComputedStyle(tongueText).writingMode : null,
          radius: (() => {
            const t = document.querySelector(".drawer-tab-tongue");
            return t ? getComputedStyle(t).borderRadius : null;
          })(),
          strokeWidth:
            tab.querySelector("svg path, svg rect")?.getAttribute("stroke-width") ?? null,
        }
      : null,
    board: box(board),
    boardEdge: box(paper),
    /** M10/Frame D: how far below the paper's bottom edge the opener sits. */
    tuckPx:
      tab && board
        ? +(tab.getBoundingClientRect().top - board.getBoundingClientRect().bottom).toFixed(
            2,
          )
        : null,
    foldTools: fold
      ? {
          box: box(fold),
          acts: Array.from(fold.querySelectorAll<HTMLElement>("button")).map((b) => ({
            name: (b.getAttribute("aria-label") ?? b.innerText).replace(/\s+/g, " ").trim(),
            box: box(b),
          })),
        }
      : null,
    /** Everything a reader can press with the sheet SHUT. */
    reachable: Array.from(
      document.querySelectorAll<HTMLElement>(
        'button, [role="button"], [tabindex]:not([tabindex="-1"])',
      ),
    )
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return false;
        if (r.bottom < 0 || r.top > innerHeight) return false;
        return !el.closest("[inert]");
      })
      .map((el) => ({
        name: (el.getAttribute("aria-label") ?? el.innerText ?? "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 40),
        cls: el.className.toString().slice(0, 50),
        box: box(el),
      })),
  };
}

function drawnStroke() {
  const box = (el: Element | null) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: +r.x.toFixed(2),
      y: +r.y.toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      top: +r.top.toFixed(2),
      bottom: +r.bottom.toFixed(2),
    };
  };
  const caseEl = document.querySelector(".drawer-case");
  const svg = caseEl?.querySelector("svg") ?? null;
  const p = svg?.querySelector("path, rect") ?? null;
  const wm = document.querySelector("svg.handwritten-logo");
  const wmBox = wm?.getBoundingClientRect();
  // the wordmark's INKED extent, not its svg viewport — the glyph paths' own union
  let inked: { top: number; bottom: number; left: number; right: number } | null = null;
  if (wm) {
    for (const g of Array.from(wm.querySelectorAll("path, g"))) {
      const r = (g as SVGGraphicsElement).getBoundingClientRect();
      if (!r.width || !r.height) continue;
      inked = inked
        ? {
            top: Math.min(inked.top, r.top),
            bottom: Math.max(inked.bottom, r.bottom),
            left: Math.min(inked.left, r.left),
            right: Math.max(inked.right, r.right),
          }
        : { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    }
  }
  const svgBox = svg?.getBoundingClientRect();
  return {
    viewport: { w: innerWidth, h: innerHeight },
    caseBox: box(caseEl),
    outlineSvgBox: box(svg),
    outlineStrokeWidth: p?.getAttribute("stroke-width") ?? null,
    outlineStrokeColor: p ? getComputedStyle(p).stroke : null,
    wordmarkBox: wmBox ? box(wm) : null,
    wordmarkInked: inked
      ? {
          top: +inked.top.toFixed(2),
          bottom: +inked.bottom.toFixed(2),
          left: +inked.left.toFixed(2),
          right: +inked.right.toFixed(2),
        }
      : null,
    /** the DRAWN case top vs the wordmark's inked bottom — M03's frame, in one number */
    strokeToInkGapPx:
      svgBox && inked ? +(svgBox.top - inked.bottom).toFixed(2) : null,
    strokeToBoxGapPx: svgBox && wmBox ? +(svgBox.top - wmBox.bottom).toFixed(2) : null,
  };
}

async function focusIdiom(page: Page, selector: string, nth = 0) {
  const has = await page.locator(selector).nth(nth).count();
  if (!has) return { selector, present: false };
  await page.locator(selector).nth(nth).focus();
  await page.waitForTimeout(80);
  return await page.evaluate(
    ({ sel, n }) => {
      const el = document.querySelectorAll<HTMLElement>(sel)[n];
      if (!el) return { selector: sel, present: false };
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        selector: sel,
        present: true,
        focused: document.activeElement === el,
        outlineWidth: cs.outlineWidth,
        outlineStyle: cs.outlineStyle,
        outlineColor: cs.outlineColor,
        outlineOffset: cs.outlineOffset,
        boxShadow: cs.boxShadow,
        borderRadius: cs.borderRadius,
        box: { w: +r.width.toFixed(2), h: +r.height.toFixed(2) },
      };
    },
    { sel: selector, n: nth },
  );
}

const FOCUS_TARGETS = [
  ".ctrl-btn",
  ".icon-btn.deal-btn",
  ".action-verbs .icon-btn",
  ".info-btn",
  ".mobile-heading-btn",
  ".drawer-tab",
  ".players-leave",
  ".peek-chip",
];

test("shut dock 390x844 + drawn stroke + focus idiom", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: info.project.name === "chromium",
    deviceScaleFactor: 3,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4231",
  });
  const p = await ctx.newPage();
  await loadBoard(p);
  const shut = await p.evaluate(shutRead);
  // open, settle, then read the drawn stroke against the wordmark (M03's own pose)
  await p.locator(".drawer-tab").click({ force: true });
  await p.waitForTimeout(900);
  const stroke = await p.evaluate(drawnStroke);
  const focus = [];
  for (const s of FOCUS_TARGETS) focus.push(await focusIdiom(p, s));
  fs.writeFileSync(
    path.join(OUT, `chrome2-390x844-${info.project.name}.json`),
    JSON.stringify({ shut, stroke, focus }, null, 2),
  );
  await ctx.close();
});

test("shut dock 900x500", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 900, height: 500 },
    hasTouch: true,
    isMobile: info.project.name === "chromium",
    deviceScaleFactor: 2,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4231",
  });
  const p = await ctx.newPage();
  await loadBoard(p);
  const shut = await p.evaluate(shutRead);
  await p.locator(".drawer-tab").click({ force: true });
  await p.waitForTimeout(900);
  const stroke = await p.evaluate(drawnStroke);
  fs.writeFileSync(
    path.join(OUT, `chrome2-900x500-${info.project.name}.json`),
    JSON.stringify({ shut, stroke }, null, 2),
  );
  await ctx.close();
});

test("desk 1280x800 drawn stroke + focus idiom", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await loadBoard(page);
  const stroke = await page.evaluate(drawnStroke);
  const focus = [];
  for (const s of FOCUS_TARGETS) focus.push(await focusIdiom(page, s));
  fs.writeFileSync(
    path.join(OUT, `chrome2-1280x800-${info.project.name}.json`),
    JSON.stringify({ stroke, focus }, null, 2),
  );
});
