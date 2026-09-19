import { test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

/**
 * CTRL-FACE pass-1 PROTOTYPE — the rows the research's census did not carry, each one a gate
 * the spec declares: the tape's geometry against the tab-head row, the scribble's overrun
 * against the RENDERED word, the chips' face/weight/height, the tab row's two states, the
 * caption lane, and the 44px floor in both dimensions. Read-only but for one click (the tab).
 *
 *   ARM_ID=<control|armD> CTRL_FACE_OUT=<dir> npx playwright test --config=probe/pw.config.ts \
 *     probe/armd-extras.spec.ts
 */

const OUT = resolve(process.env.CTRL_FACE_OUT || "readings");
const ARM = process.env.ARM_ID || "control";

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true },
  { name: "dock-375x812", w: 375, h: 812, mobile: true },
  { name: "dock-430x932", w: 430, h: 932, mobile: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
];

async function loadBoard(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
  if (
    await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))
  ) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES — settle before a box is read
  }
}

function readExtras() {
  const card = (document.querySelector(".controls-card") ?? document) as HTMLElement;
  const num = (v: string) => +parseFloat(v).toFixed(2);
  const rect = (el: Element) => {
    const r = el.getBoundingClientRect();
    return {
      x: +r.x.toFixed(2),
      y: +r.y.toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
    };
  };
  const overlap = (a: DOMRect, b: DOMRect) => {
    const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return +(ox * oy).toFixed(1);
  };

  /* ── the tapes: net flow (the covenant), box, and every overlap with a control ── */
  const tapes = Array.from(card.querySelectorAll(".tray-well > .washi-tag")).map((t) => {
    const cs = getComputedStyle(t);
    const r = t.getBoundingClientRect();
    const controls = Array.from(
      card.querySelectorAll(".mobile-heading-btn, .ctrl-btn, .icon-btn, .zone-row-label"),
    ).map((c) => {
      const b = c.getBoundingClientRect();
      return {
        sel: c.className.split(" ")[0],
        text: (c as HTMLElement).innerText.replace(/\s+/g, " ").trim().slice(0, 12),
        px2: overlap(r, b),
        // the SIGNED vertical gap: negative is overlap, positive is daylight
        gapY: +(b.top - r.bottom).toFixed(2),
      };
    });
    return {
      text: (t as HTMLElement).innerText.trim(),
      box: rect(t),
      lineHeight: cs.lineHeight,
      fontSize: num(cs.fontSize),
      family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      weight: cs.fontWeight,
      marginTop: num(cs.marginTop),
      marginBottom: num(cs.marginBottom),
      /* FLOW IS THE LAYOUT BOX, never the painted one: the tape is rotated ±1.5°, and a
         rect widened by a printed name inflates its axis-aligned bbox by width·sin(tilt)
         (3.9px at 148px wide) — which is paint, not flow. `offsetHeight` is what the column
         lays out. The rect above stays, for the collision reading, which IS about paint. */
      layoutHeight: +(t as HTMLElement).offsetHeight.toFixed(2),
      netFlow: +(
        num(cs.marginTop) +
        (t as HTMLElement).offsetHeight +
        num(cs.marginBottom)
      ).toFixed(2),
      netFlowPainted: +(num(cs.marginTop) + r.height + num(cs.marginBottom)).toFixed(2),
      vsHeads: controls.filter((c) => c.sel === "mobile-heading-btn"),
      collisions: controls.filter((c) => c.px2 > 0),
    };
  });

  /* ── the chips: face, weight, box, and the scribble's overrun against the WORD ── */
  const chips = Array.from(card.querySelectorAll(".ctrl-btn")).map((b) => {
    const cs = getComputedStyle(b);
    const word = b.querySelector(".ctrl-word") as HTMLElement | null;
    // the rendered word's own advance — a Range over the text node, never a character count
    const range = document.createRange();
    const host = word ?? b;
    const textNode = Array.from(host.childNodes).find(
      (n) => n.nodeType === 3 && n.textContent!.trim(),
    );
    let wordW: number | null = null;
    if (textNode) {
      range.selectNodeContents(host);
      wordW = +range.getBoundingClientRect().width.toFixed(2);
    }
    const marked = word ?? b;
    const mcs = getComputedStyle(marked);
    const bgSizeRaw = mcs.backgroundSize;
    const pct = /^([\d.]+)%/.exec(bgSizeRaw);
    const m = /^([\d.]+)px/.exec(bgSizeRaw);
    // the USED width: a numeric computed value where the engine resolves one, else the
    // content box + the declared 6px overshoot (`calc(100% + 6px)`, background-origin:
    // content-box, so 100% is the content box's width).
    const contentW =
      marked.clientWidth -
      parseFloat(mcs.paddingLeft || "0") -
      parseFloat(mcs.paddingRight || "0");
    const bgW = m
      ? +m[1]
      : pct
        ? +((contentW * +pct[1]) / 100).toFixed(2)
        : +(contentW + 6).toFixed(2);
    return {
      text: (b as HTMLElement).innerText.replace(/\s+/g, " ").trim(),
      family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px: num(cs.fontSize),
      weight: cs.fontWeight,
      transform: cs.textTransform,
      radius: cs.borderTopLeftRadius,
      selected: b.getAttribute("aria-pressed") === "true",
      box: rect(b),
      wordW,
      bgSizeRaw,
      bgW,
      overrun: wordW && wordW > 0 ? +(bgW / wordW).toFixed(3) : null,
      hasWordSpan: !!word,
      markedPaddingBottom: mcs.paddingBottom,
      bgImage: mcs.backgroundImage === "none" ? "none" : "image",
    };
  });

  /* ── the tab row: ink by state, decoration, boxes ── */
  const heads = Array.from(card.querySelectorAll(".mobile-heading-btn")).map((b) => {
    const h = b.querySelector(".section-heading") as HTMLElement | null;
    const v = b.querySelector(".heading-value") as HTMLElement | null;
    const hcs = h ? getComputedStyle(h) : null;
    const vcs = v ? getComputedStyle(v) : null;
    return {
      expanded: b.getAttribute("aria-expanded"),
      name: h?.innerText.replace(/\s+/g, " ").trim() ?? null,
      nameColor: hcs?.color ?? null,
      nameFamily: hcs?.fontFamily.split(",")[0].replace(/["']/g, "").trim() ?? null,
      namePx: hcs ? num(hcs.fontSize) : null,
      nameWeight: hcs?.fontWeight ?? null,
      nameDecoration: hcs?.textDecorationLine ?? null,
      nameClasses: h?.className ?? null,
      value: v?.innerText.replace(/\s+/g, " ").trim() ?? null,
      valueColor: vcs?.color ?? null,
      valueFamily: vcs?.fontFamily.split(",")[0].replace(/["']/g, "").trim() ?? null,
      valuePx: vcs ? num(vcs.fontSize) : null,
      valueWeight: vcs?.fontWeight ?? null,
      valueTransform: vcs?.textTransform ?? null,
      box: rect(b),
    };
  });

  /* ── the captions: the lane, the remaining row width, and whether the word wraps ── */
  const captions = Array.from(card.querySelectorAll(".zone-row-label")).map((c) => {
    const cs = getComputedStyle(c);
    const row = c.closest(".zone-row") as HTMLElement | null;
    const opts = row?.querySelector(".ctrl-options") as HTMLElement | null;
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize);
    return {
      text: (c as HTMLElement).innerText.replace(/\s+/g, " ").trim(),
      family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px: num(cs.fontSize),
      weight: cs.fontWeight,
      transform: cs.textTransform,
      color: cs.color,
      flexBasis: cs.flexBasis,
      box: rect(c),
      scrollW: c.scrollWidth,
      lines: +(c.getBoundingClientRect().height / lh).toFixed(2),
      wraps: c.getBoundingClientRect().height > lh * 1.4,
      rowRemaining: opts ? +opts.getBoundingClientRect().width.toFixed(2) : null,
    };
  });

  /* ── the eyebrows (desk h2s + the printed names' census) ── */
  const eyebrows = Array.from(card.querySelectorAll(".section-heading")).map((e) => {
    const cs = getComputedStyle(e);
    return {
      text: (e as HTMLElement).innerText.replace(/\s+/g, " ").trim(),
      family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px: num(cs.fontSize),
      weight: cs.fontWeight,
      color: cs.color,
      transform: cs.textTransform,
      decoration: cs.textDecorationLine,
      classes: e.className,
    };
  });

  const printedSel = ".section-heading, .tray-well > .washi-tag, .zone-row-label";
  const inView = (el: Element) => {
    const r = el.getBoundingClientRect();
    return (
      r.width > 0 &&
      r.height > 0 &&
      r.bottom > 0 &&
      r.top < innerHeight &&
      +getComputedStyle(el).opacity > 0.05
    );
  };
  const printedNodes = Array.from(card.querySelectorAll(printedSel));

  return {
    viewport: [innerWidth, innerHeight],
    tokens: {
      groupTitle: getComputedStyle(document.documentElement)
        .getPropertyValue("--type-group-title")
        .trim(),
      option: getComputedStyle(document.documentElement)
        .getPropertyValue("--type-option")
        .trim(),
      facePrinted: getComputedStyle(document.documentElement)
        .getPropertyValue("--face-printed")
        .trim(),
      faceWritten: getComputedStyle(document.documentElement)
        .getPropertyValue("--face-written")
        .trim(),
      tapFloor: getComputedStyle(document.documentElement)
        .getPropertyValue("--tap-floor")
        .trim(),
    },
    tapes,
    chips,
    heads,
    captions,
    eyebrows,
    printedOnScreen: printedNodes.filter(inView).length,
    printedTotal: printedNodes.length,
    printedVoices: Array.from(
      new Set(
        printedNodes.map((e) => {
          const cs = getComputedStyle(e);
          return [
            cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
            num(cs.fontSize).toFixed(2),
            cs.fontWeight,
            cs.textTransform,
          ].join(" · ");
        }),
      ),
    ),
    card: {
      scrollHeight: card.scrollHeight,
      clientHeight: card.clientHeight,
    },
    tapFloors: Array.from(card.querySelectorAll(".ctrl-btn, .mobile-heading-btn")).map((e) => {
      const r = e.getBoundingClientRect();
      return {
        sel: e.className.split(" ")[0],
        text: (e as HTMLElement).innerText.replace(/\s+/g, " ").trim().slice(0, 12),
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
      };
    }),
  };
}

for (const cell of CELLS) {
  test(`extras — ${ARM} · ${cell.name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && info.project.name === "chromium",
      deviceScaleFactor: 1,
      colorScheme: "dark",
      baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4235",
    });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      try {
        localStorage.setItem("sudoku-color-scheme", "dark");
      } catch {
        /* private mode */
      }
    });
    await loadBoard(page);
    const first = await page.evaluate(readExtras);

    // the SECOND tab state — level open, size shut (mobile cells only)
    let second: unknown = null;
    const heads = page.locator(".controls-card .mobile-heading-btn");
    if ((await heads.count()) > 1) {
      await heads.nth(1).click({ force: true });
      await page.waitForTimeout(400);
      second = await page.evaluate(readExtras);
    }

    mkdirSync(OUT, { recursive: true });
    writeFileSync(
      join(OUT, `extras-${ARM}-${cell.name}-${info.project.name}.json`),
      JSON.stringify({ stateA: first, stateB: second }, null, 1),
    );
    const worstOverrun = first.chips
      .map((c) => c.overrun)
      .filter((x): x is number => x !== null);
    console.log(
      `[extras ${ARM} ${cell.name} ${info.project.name}] printed=${first.printedOnScreen}/${first.printedTotal} ` +
        `voices=${first.printedVoices.length} card=${first.card.scrollHeight} ` +
        `tapeNet=${first.tapes.map((t) => t.netFlow).join("|")} ` +
        `headOverlap=${first.tapes.map((t) => t.vsHeads.map((h) => h.px2).join("/")).join("|")} ` +
        `overrun=${worstOverrun.length ? `${Math.min(...worstOverrun)}..${Math.max(...worstOverrun)}` : "—"}`,
    );
    await ctx.close();
  });
}
