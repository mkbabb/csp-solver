import { test, type Page } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * T9-W7 ROUND ZERO · LANE R1 — THE CONTROLS ESTATE CENSUS.
 *
 * Read-only. Measures, never asserts (the born-RED instrument is `heading-voice.spec.ts`
 * beside this file). Three cells, both engines:
 *   · 1280×800 fine  — the desk rail, drawer open by default
 *   · 390×844  coarse — the portrait dock, sheet risen (settled 700ms)
 *   · 900×500  coarse — the landscape dock, sheet risen (settled 700ms)
 *
 * Every reading is a box, a computed style, a count or a string. Nothing is a pixel.
 */

const OUT = path.resolve(import.meta.dirname, "..", "logs");

const INTERACTIVE =
  'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])';

async function loadBoard(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  // ATTACHED, never visible: on a shut dock the case is `visibility: hidden` (scene.css), so a
  // visibility wait would time out on exactly the two cells this lane must read.
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
  await page.waitForTimeout(1200);
}

/** The one gesture round zero allows: open the sheet on a dock. */
async function openSheet(page: Page) {
  const closed = await page.evaluate(() =>
    document.documentElement.classList.contains("drawer-closed"),
  );
  if (!closed) return;
  await page.locator(".drawer-tab").click({ force: true });
  await page.waitForTimeout(900); // the Band-D glide's own ~520ms clock, then settle
}

function census() {
  const INTERACTIVE =
    'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])';
  const q = <T extends Element>(s: string, root: ParentNode = document) =>
    Array.from(root.querySelectorAll<T>(s));
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
  /** honestly-visible fraction — box ∩ every clipping ancestor ∩ window */
  const visFrac = (el: Element) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return 0;
    let clip = { l: 0, t: 0, r: window.innerWidth, b: window.innerHeight };
    let p: Element | null = el.parentElement;
    while (p) {
      const cs = getComputedStyle(p);
      if (cs.overflowX !== "visible" || cs.overflowY !== "visible") {
        const qq = p.getBoundingClientRect();
        clip = {
          l: Math.max(clip.l, qq.left),
          t: Math.max(clip.t, qq.top),
          r: Math.min(clip.r, qq.right),
          b: Math.min(clip.b, qq.bottom),
        };
      }
      p = p.parentElement;
    }
    const w = Math.max(0, Math.min(clip.r, r.right) - Math.max(clip.l, r.left));
    const h = Math.max(0, Math.min(clip.b, r.bottom) - Math.max(clip.t, r.top));
    return +((w * h) / (r.width * r.height)).toFixed(3);
  };
  const type = (el: Element) => {
    const cs = getComputedStyle(el);
    return {
      family: cs.fontFamily,
      size: cs.fontSize,
      sizePx: +parseFloat(cs.fontSize).toFixed(2),
      weight: cs.fontWeight,
      color: cs.color,
      lineHeight: cs.lineHeight,
      tracking: cs.letterSpacing,
      transform: cs.textTransform,
      opacity: cs.opacity,
      align: cs.textAlign,
      decoration: cs.textDecorationLine,
    };
  };
  const chrome = (el: Element) => {
    const cs = getComputedStyle(el);
    return {
      border: cs.border,
      borderTop: cs.borderTopWidth + " " + cs.borderTopStyle + " " + cs.borderTopColor,
      radius: cs.borderRadius,
      background: cs.backgroundColor,
      backgroundImage: cs.backgroundImage === "none" ? "none" : "«image»",
      padding: cs.padding,
      clipPath: cs.clipPath === "none" ? "none" : "«clip»",
      boxShadow: cs.boxShadow,
      outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor,
      minW: cs.minWidth,
      minH: cs.minHeight,
      gap: cs.gap,
      position: cs.position,
      zIndex: cs.zIndex,
      display: cs.display,
    };
  };
  const label = (el: Element) =>
    (el.getAttribute("aria-label") ?? (el as HTMLElement).innerText ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);

  const card = document.querySelector(".controls-card");
  const fold = document.querySelector("#fold-tools");
  const cardRoot: ParentNode = card ?? document;

  // ── (a) THE HEADING CENSUS ────────────────────────────────────────────────
  const headingNodes = [
    ...q(".section-heading", cardRoot).map((el) => ({ el, kind: "section-heading" })),
    ...q(".washi-tag", cardRoot).map((el) => ({ el, kind: "washi-tag" })),
    ...q(".zone-row-label", cardRoot).map((el) => ({ el, kind: "zone-row-label" })),
  ];
  const headings = headingNodes.map(({ el, kind }) => {
    const host =
      el.closest("h1,h2,h3,h4,h5,h6") ?? (/^H[1-6]$/.test(el.tagName) ? el : null);
    return {
      kind,
      text: label(el),
      tag: el.tagName,
      headingHost: host ? host.tagName : null,
      isDocHeading: !!host,
      role: el.getAttribute("role"),
      labelsAZone: !!el.id && !!document.querySelector(`[aria-labelledby~="${el.id}"]`),
      ...type(el),
      box: box(el),
      visFrac: visFrac(el),
    };
  });

  // ── (b) THE BUTTON CENSUS ─────────────────────────────────────────────────
  const inCard = q<HTMLElement>(INTERACTIVE, cardRoot);
  const inFold = fold ? q<HTMLElement>(INTERACTIVE, fold) : [];
  const btn = (el: HTMLElement, where: string) => {
    const sub = el.querySelector(".icon-sublabel, .peek-chip-word, .heading-value");
    const svg = el.querySelector("svg");
    return {
      where,
      cls: el.className.toString().slice(0, 90),
      text: label(el),
      tag: el.tagName,
      ariaPressed: el.getAttribute("aria-pressed"),
      ariaExpanded: el.getAttribute("aria-expanded"),
      disabled: (el as HTMLButtonElement).disabled ?? null,
      sublabel: sub ? (sub as HTMLElement).innerText.trim().slice(0, 30) : null,
      sublabelType: sub ? type(sub) : null,
      glyph: svg ? box(svg) : null,
      ...type(el),
      ...chrome(el),
      box: box(el),
      visFrac: visFrac(el),
    };
  };
  const buttons = [
    ...inCard.map((el) => btn(el, "card")),
    ...inFold.map((el) => btn(el, "fold-tools")),
  ];
  const tabEl = document.querySelector<HTMLElement>(".drawer-tab");
  if (tabEl) buttons.push(btn(tabEl, "drawer-tab"));

  // ── (c) THE CHROME ────────────────────────────────────────────────────────
  const caseEl = document.querySelector(".drawer-case");
  const caseSvg = caseEl?.querySelector("svg");
  const casePath = caseSvg?.querySelector("path, rect");
  const wordmark = document.querySelector("svg.handwritten-logo");
  const bar = document.querySelector(".action-bar");
  const wells = q(".tray-well", cardRoot);
  const dealWell = document.querySelector(".new-game-zone");
  const dealTag = dealWell?.querySelector(".washi-tag") ?? null;
  const tabText = document.querySelector(".drawer-tab-text");
  const sheet = document.querySelector(".scene-controls");

  const chromeRead = {
    case: caseEl
      ? {
          box: box(caseEl),
          strokeWidth: casePath ? casePath.getAttribute("stroke-width") : null,
          stroke: casePath ? getComputedStyle(casePath).stroke : null,
          ...chrome(caseEl),
        }
      : null,
    card: card ? { box: box(card), ...chrome(card) } : null,
    sheet: sheet ? { box: box(sheet), ...chrome(sheet) } : null,
    wordmark: wordmark ? { box: box(wordmark), visFrac: visFrac(wordmark) } : null,
    /** M03's frame: does the case's top edge cross the wordmark's box? */
    caseCutsWordmark:
      caseEl && wordmark
        ? (() => {
            const c = caseEl.getBoundingClientRect();
            const w = wordmark.getBoundingClientRect();
            const overlapW = Math.max(
              0,
              Math.min(c.right, w.right) - Math.max(c.left, w.left),
            );
            const overlapH = Math.max(
              0,
              Math.min(c.bottom, w.bottom) - Math.max(c.top, w.top),
            );
            return {
              overlapPx2: +(overlapW * overlapH).toFixed(1),
              wordmarkAreaPx2: +(w.width * w.height).toFixed(1),
              fractionOfWordmark: w.width * w.height
                ? +((overlapW * overlapH) / (w.width * w.height)).toFixed(3)
                : 0,
              caseTop: +c.top.toFixed(2),
              wordmarkBottom: +w.bottom.toFixed(2),
              gap: +(c.top - w.bottom).toFixed(2),
            };
          })()
        : null,
    bar: bar
      ? {
          box: box(bar),
          ...chrome(bar),
          before: (() => {
            const cs = getComputedStyle(bar, "::before");
            return {
              height: cs.height,
              backgroundImage: cs.backgroundImage === "none" ? "none" : "«gradient»",
              opacity: cs.opacity,
            };
          })(),
          after: (() => {
            const cs = getComputedStyle(bar, "::after");
            return { height: cs.height, background: cs.backgroundColor };
          })(),
        }
      : null,
    wells: wells.map((w) => {
      const tag = w.querySelector(".washi-tag");
      const outline = w.querySelector("svg");
      const p = outline?.querySelector("path, rect");
      return {
        tag: tag ? label(tag) : null,
        box: box(w),
        visFrac: visFrac(w),
        strokeWidth: p ? p.getAttribute("stroke-width") : null,
        tagBox: tag ? box(tag) : null,
        tagVisFrac: tag ? visFrac(tag) : null,
        tagType: tag ? type(tag) : null,
        tagOverflowAboveCase:
          tag && card
            ? +(
                card.getBoundingClientRect().top - tag.getBoundingClientRect().top
              ).toFixed(2)
            : null,
      };
    }),
    /** F12 residue: the deal well's tag clipped off the case edge (the owner's frame B). */
    dealTagClip:
      dealTag && card
        ? (() => {
            const t = dealTag.getBoundingClientRect();
            const c = card.getBoundingClientRect();
            return {
              tagTop: +t.top.toFixed(2),
              cardTop: +c.top.toFixed(2),
              aboveCardTopPx: +(c.top - t.top).toFixed(2),
              visFrac: visFrac(dealTag),
              position: getComputedStyle(dealTag).position,
              stickyTop: getComputedStyle(dealTag).top,
            };
          })()
        : null,
    tab: tabEl
      ? {
          box: box(tabEl),
          visFrac: visFrac(tabEl),
          ...chrome(tabEl),
          tongue: (() => {
            const t = document.querySelector(".drawer-tab-tongue");
            return t ? { box: box(t), ...chrome(t) } : null;
          })(),
          text: tabText
            ? {
                text: label(tabText),
                ...type(tabText),
                writingMode: getComputedStyle(tabText).writingMode,
                background: getComputedStyle(tabText).backgroundColor,
                clip: getComputedStyle(tabText).clipPath === "none" ? "none" : "«clip»",
                box: box(tabText),
              }
            : null,
          outlineStroke: (() => {
            const p = tabEl.querySelector("svg path, svg rect");
            return p ? p.getAttribute("stroke-width") : null;
          })(),
        }
      : null,
  };

  // ── (d) THE MOBILE TABS ───────────────────────────────────────────────────
  const tabsRow = document.querySelector(".mobile-heading-row");
  const mobileTabs = tabsRow
    ? {
        rowBox: box(tabsRow),
        rowChrome: chrome(tabsRow),
        tabs: q<HTMLElement>(".mobile-heading-btn", tabsRow).map((b) => {
          const head = b.querySelector(".section-heading");
          const val = b.querySelector(".heading-value");
          return {
            text: label(b),
            expanded: b.getAttribute("aria-expanded"),
            role: b.getAttribute("role"),
            box: box(b),
            ...chrome(b),
            headType: head ? type(head) : null,
            headBox: box(head),
            valueShown: !!val,
            valueType: val ? type(val) : null,
            underline: head ? getComputedStyle(head).textDecorationLine : null,
            underlineThickness: head
              ? getComputedStyle(head).textDecorationThickness
              : null,
          };
        }),
        /** the option rows the tabs reveal — one shown, the rest v-show'd to 0×0 */
        optionRows: q(".new-game-zone .ctrl-options").map((r) => ({
          box: box(r),
          visFrac: visFrac(r),
          display: getComputedStyle(r).display,
          options: q(".ctrl-btn", r).map((o) => ({
            text: label(o),
            pressed: o.getAttribute("aria-pressed"),
            box: box(o),
          })),
        })),
      }
    : null;

  // ── the option-row treatment (every OptionSelector in the card) ───────────
  const optionGroups = q(".ctrl-options", cardRoot).map((g) => ({
    cls: g.className.toString().slice(0, 60),
    box: box(g),
    gap: getComputedStyle(g).gap,
    chips: q<HTMLElement>(".ctrl-btn", g).map((c) => ({
      text: label(c),
      pressed: c.getAttribute("aria-pressed"),
      ...type(c),
      ...chrome(c),
      box: box(c),
    })),
  }));

  // ── (e) QUICK ACTIONS ─────────────────────────────────────────────────────
  const acts = {
    foldTools: inFold.map((el) => ({
      text: label(el),
      box: box(el),
      visFrac: visFrac(el),
    })),
    inCard: inCard.map((el) => ({
      text: label(el),
      cls: el.className.toString().slice(0, 60),
      box: box(el),
      visFrac: visFrac(el),
      hiddenByTab: visFrac(el) === 0,
    })),
    sheetOpen: !document.documentElement.classList.contains("drawer-closed"),
  };

  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    dpr: window.devicePixelRatio,
    coarse: window.matchMedia("(pointer: coarse)").matches,
    hover: window.matchMedia("(hover: hover)").matches,
    tokens: (() => {
      const cs = getComputedStyle(document.documentElement);
      const names = [
        "--type-group-title",
        "--type-act",
        "--type-verb",
        "--type-tool",
        "--type-tag",
        "--type-option",
        "--type-small",
        "--type-caption",
        "--icon-act",
        "--icon-verb",
        "--icon-tool",
        "--tap-floor",
        "--font-display",
        "--font-hand",
        "--font-mono",
        "--ink-press-quiet",
        "--ink-press-rule",
        "--color-accent",
        "--color-muted-foreground",
        "--color-foreground",
        "--color-card",
        "--sheet-washi-neutral",
      ];
      const out: Record<string, string> = {};
      for (const n of names) out[n] = cs.getPropertyValue(n).trim();
      return out;
    })(),
    headings,
    buttons,
    chrome: chromeRead,
    mobileTabs,
    optionGroups,
    acts,
  };
}

async function bank(page: Page, cell: string, engine: string) {
  const data = await page.evaluate(census);
  const file = path.join(OUT, `census-${cell}-${engine}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`[R1] banked ${file}`);
}

test("desk rail 1280x800", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await loadBoard(page);
  await bank(page, "1280x800", info.project.name);
});

test("portrait dock 390x844, sheet open", async ({ page, browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: info.project.name === "chromium",
    deviceScaleFactor: 3,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4239",
  });
  const p = await ctx.newPage();
  await loadBoard(p);
  await openSheet(p);
  await bank(p, "390x844", info.project.name);
  await ctx.close();
});

test("landscape dock 900x500, sheet open", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 900, height: 500 },
    hasTouch: true,
    isMobile: info.project.name === "chromium",
    deviceScaleFactor: 2,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4239",
  });
  const p = await ctx.newPage();
  await loadBoard(p);
  await openSheet(p);
  await bank(p, "900x500", info.project.name);
  await ctx.close();
});
