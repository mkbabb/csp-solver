import { test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

/**
 * CTRL-FACE pass-1 — THE FACE CENSUS.
 *
 * Read-only. Runs against a base URL that is either the lane's plain dev server (the control
 * arm) or `inject-proxy.mjs` serving one of `proto/*.css` (a treatment arm). The spec never
 * injects: the arm is the server's, so the same bytes measure every arm and
 * `heading-voice.spec.ts` can run UNCHANGED against exactly the same page.
 *
 *   ARM_ID=<label> PLAYWRIGHT_BASE_URL=http://127.0.0.1:4235 npx playwright test \
 *     --config=probe/pw.config.ts probe/face-census.spec.ts
 */

/* `import.meta` is unavailable under the estate's CJS transform, so the output dir is
   resolved from the config's own rootDir via an env var the runner sets. */
const OUT = resolve(process.env.CTRL_FACE_OUT || "readings");
const ARM = process.env.ARM_ID || "control";

const CELLS = [
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, open: true },
  { name: "dock-390x844", w: 390, h: 844, mobile: true, open: true },
  { name: "dock-shut-390x844", w: 390, h: 844, mobile: true, open: false },
  { name: "land-900x500", w: 900, h: 500, mobile: true, open: true },
  { name: "rail-1440x900", w: 1440, h: 900, mobile: false, open: true },
];

async function loadBoard(page: Page, open: boolean) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page
    .waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 30000 })
    .catch(() => {});
  await page.waitForTimeout(1400);
  const shut = await page.evaluate(() =>
    document.documentElement.classList.contains("drawer-closed"),
  );
  if (open && shut) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES — settle before a box is read
  }
}

/* ── the reader, run inside the page ───────────────────────────────────────────────────── */
function readAll() {
  const card = document.querySelector(".controls-card") ?? document;
  const num = (v: string) => +parseFloat(v).toFixed(2);
  const box = (el: Element) => {
    const r = el.getBoundingClientRect();
    return [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)];
  };
  const voice = (el: Element) => {
    const cs = getComputedStyle(el);
    return {
      family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px: num(cs.fontSize),
      weight: cs.fontWeight,
      transform: cs.textTransform,
      tracking: cs.letterSpacing,
      color: cs.color,
      decoration: cs.textDecorationLine,
      text: (el as HTMLElement).innerText.replace(/\s+/g, " ").trim(),
      box: box(el),
      scrollW: +(el as HTMLElement).scrollWidth.toFixed(2),
      clientW: +(el as HTMLElement).clientWidth.toFixed(2),
    };
  };

  /* WHICH FACE ACTUALLY PAINTED. `document.fonts.check` honours unicode-range, so a codepoint
     outside the cut answers false even though the family is "loaded". Corroborated by a width
     comparison against the fallback alone: identical advance ⇒ the fallback drew it. */
  const canvas = document.createElement("canvas");
  const ctx2d = canvas.getContext("2d")!;
  const measure = (s: string, font: string) => {
    ctx2d.font = font;
    return +ctx2d.measureText(s).width.toFixed(3);
  };
  const glyphCheck = (str: string, family: string, fallback: string) => {
    const missing: string[] = [];
    for (const ch of new Set([...str])) {
      if (ch === " ") continue;
      if (!document.fonts.check(`800 20px "${family}"`, ch)) missing.push(ch);
    }
    const withFace = measure(str, `800 20px "${family}", ${fallback}`);
    const fallbackOnly = measure(str, `800 20px ${fallback}`);
    return {
      str,
      missing,
      withFace,
      fallbackOnly,
      identicalToFallback: Math.abs(withFace - fallbackOnly) < 0.01,
    };
  };

  /* 2.3's own resolver, copied from `e2e/access.spec.ts:441` — composited backdrop, then the
     WCAG ratio. `color-mix(…, transparent)` computes to `color(srgb …)` in both engines and a
     naive rgb() parser reads it as black. */
  type RGBA = [number, number, number, number];
  const parse = (c: string): RGBA => {
    const s = (c || "").trim();
    if (!s || s === "transparent") return [0, 0, 0, 0];
    let m = /^color\(\s*srgb\s+([^)]+)\)$/i.exec(s);
    if (m) {
      const parts = m[1].split("/");
      const rgb = parts[0].trim().split(/\s+/).map(Number);
      const a =
        parts[1] === undefined
          ? 1
          : Number(parts[1].trim().replace("%", "")) / (parts[1].includes("%") ? 100 : 1);
      return [rgb[0] * 255, rgb[1] * 255, rgb[2] * 255, a];
    }
    m = /^rgba?\(([^)]+)\)$/i.exec(s);
    if (m) {
      const p = m[1].split(/[,/]/).map((x) => x.trim());
      const n = p.map((x) => (x.endsWith("%") ? Number(x.slice(0, -1)) / 100 : Number(x)));
      return [n[0], n[1], n[2], p[3] === undefined ? 1 : n[3]];
    }
    m = /^#([0-9a-f]{3,8})$/i.exec(s);
    if (m) {
      const h = m[1].length <= 4 ? [...m[1]].map((x) => x + x).join("") : m[1];
      const v = (i: number) => parseInt(h.slice(i * 2, i * 2 + 2), 16);
      return [v(0), v(1), v(2), h.length === 8 ? v(3) / 255 : 1];
    }
    return [0, 0, 0, 0];
  };
  const over = (fg: RGBA, bg: RGBA): RGBA => {
    const a = fg[3] + bg[3] * (1 - fg[3]);
    if (a === 0) return [0, 0, 0, 0];
    const ch = (i: number) => (fg[i] * fg[3] + bg[i] * bg[3] * (1 - fg[3])) / a;
    return [ch(0), ch(1), ch(2), a];
  };
  const lum = (c: RGBA) => {
    const f = (x: number) => {
      const v = x / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const contrast = (el: Element) => {
    const layers: RGBA[] = [];
    for (let n: Element | null = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 1) break;
    }
    let bg: RGBA = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
    const fg = over(parse(getComputedStyle(el).color), bg);
    const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
    return {
      text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 18),
      ratio: Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100,
      fg: getComputedStyle(el).color,
      bg: `rgb(${bg.slice(0, 3).map(Math.round).join(", ")})`,
    };
  };

  const names = [
    ...Array.from(card.querySelectorAll(".section-heading")).map((e) => ({
      kind: "eyebrow",
      ...voice(e),
    })),
    ...Array.from(card.querySelectorAll(".tray-well > .washi-tag")).map((e) => ({
      kind: "tape",
      ...voice(e),
    })),
    ...Array.from(card.querySelectorAll(".zone-row-label")).map((e) => ({
      kind: "caption",
      ...voice(e),
    })),
  ];
  const chips = Array.from(card.querySelectorAll(".ctrl-btn")).map((e) => {
    const cs = getComputedStyle(e);
    return {
      ...voice(e),
      scribbleWidth: cs.getPropertyValue("--scribble-width").trim(),
      bgSize: cs.backgroundSize,
      selected: e.getAttribute("aria-pressed") === "true",
    };
  });
  const subs = Array.from(document.querySelectorAll(".icon-sublabel, .peek-chip-word")).map(
    (e) => ({ kind: "act", ...voice(e) }),
  );

  const tape = card.querySelector(".tray-well > .washi-tag") as HTMLElement | null;
  const tapeFlow = tape
    ? (() => {
        const cs = getComputedStyle(tape);
        const mt = num(cs.marginTop);
        const mb = num(cs.marginBottom);
        const h = +tape.getBoundingClientRect().height.toFixed(2);
        return { marginTop: mt, marginBottom: mb, height: h, netFlow: +(mt + h + mb).toFixed(2) };
      })()
    : null;

  const logo = document.querySelector("svg.handwritten-logo");
  const cardEl = document.querySelector(".controls-card") as HTMLElement | null;

  // every distinct rendered string in each register, deduped
  const printedStrings = Array.from(new Set(names.map((n) => n.text).filter(Boolean)));
  const actStrings = Array.from(new Set(subs.map((n) => n.text).filter(Boolean)));
  const writtenStrings = Array.from(new Set(chips.map((n) => n.text).filter(Boolean)));

  // A live filter is `filter: url(#…)` on a painted node — R6 law 9's population.
  let liveFilters = 0;
  for (const el of document.querySelectorAll("*")) {
    const f = getComputedStyle(el).filter;
    if (f && f.includes("url(")) liveFilters++;
  }

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

  return {
    viewport: [innerWidth, innerHeight],
    tokens: {
      groupTitle: getComputedStyle(document.documentElement)
        .getPropertyValue("--type-group-title")
        .trim(),
      option: getComputedStyle(document.documentElement).getPropertyValue("--type-option").trim(),
      tag: getComputedStyle(document.documentElement).getPropertyValue("--type-tag").trim(),
    },
    names,
    chips,
    acts: subs,
    voices: Array.from(new Set(names.map((n) => `${n.family}·${n.px}·${n.weight}·${n.transform}`))),
    namePx: names.length ? Math.max(...names.map((n) => n.px)) : null,
    optionPx: chips.length ? chips[0].px : null,
    ratio: names.length && chips.length ? +(Math.max(...names.map((n) => n.px)) / chips[0].px).toFixed(4) : null,
    tabDecoration: (() => {
      const a = card.querySelector(".mobile-heading-btn .section-heading.is-active");
      return a ? getComputedStyle(a).textDecorationLine : null;
    })(),
    tapeFlow,
    captionColumn: (() => {
      const c = card.querySelector(".zone-row-label") as HTMLElement | null;
      if (!c) return null;
      const cs = getComputedStyle(c);
      return {
        flexBasis: cs.flexBasis,
        width: +c.getBoundingClientRect().width.toFixed(2),
        scrollWidth: c.scrollWidth,
        overflows: c.scrollWidth > Math.ceil(c.getBoundingClientRect().width) + 1,
        lines: +(
          c.getBoundingClientRect().height / parseFloat(cs.lineHeight || "1")
        ).toFixed(2),
      };
    })(),
    coverage: {
      printedInFraunces: printedStrings.map((s) => glyphCheck(s, "Fraunces", "Georgia, serif")),
      actsInFraunces: actStrings.map((s) => glyphCheck(s, "Fraunces", "Georgia, serif")),
      writtenInPatrickHand: writtenStrings.map((s) => glyphCheck(s, "Patrick Hand", "cursive")),
      writtenLowercasedInPatrickHand: writtenStrings.map((s) =>
        glyphCheck(s.toLowerCase(), "Patrick Hand", "cursive"),
      ),
    },
    masthead: logo
      ? {
          box: box(logo),
          wordmarkPx: (() => {
            const t = logo.querySelector("text");
            return t ? num(getComputedStyle(t).fontSize) : null;
          })(),
          capHeightPx: +logo.getBoundingClientRect().height.toFixed(2),
        }
      : null,
    printedNodesOnScreen: names.filter((n) => {
      const el = Array.from(card.querySelectorAll(".section-heading, .tray-well > .washi-tag, .zone-row-label")).find(
        (e) => (e as HTMLElement).innerText.replace(/\s+/g, " ").trim() === n.text,
      );
      return el ? inView(el) : false;
    }).length,
    printedNodesTotal: names.length,
    cardOverflow: cardEl
      ? {
          scrollHeight: cardEl.scrollHeight,
          clientHeight: cardEl.clientHeight,
          belowFold: cardEl.scrollHeight - cardEl.clientHeight,
        }
      : null,
    tapFloors: Array.from(card.querySelectorAll(".ctrl-btn, .mobile-heading-btn")).map((e) => {
      const r = e.getBoundingClientRect();
      return {
        sel: e.className.split(" ")[0],
        text: (e as HTMLElement).innerText.replace(/\s+/g, " ").trim().slice(0, 12),
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
      };
    }),
    liveFilters,
    contrast: [
      ...Array.from(card.querySelectorAll(".section-heading, .tray-well > .washi-tag, .zone-row-label")).map(
        (e) => ({ sel: e.className.split(" ")[0], ...contrast(e) }),
      ),
      ...Array.from(card.querySelectorAll(".ctrl-btn")).map((e) => ({
        sel: "ctrl-btn",
        ...contrast(e),
      })),
      ...Array.from(card.querySelectorAll(".icon-sublabel")).map((e) => ({
        sel: "icon-sublabel",
        ...contrast(e),
      })),
    ],
    bar: (() => {
      const b = document.querySelector(".action-bar");
      if (!b) return null;
      const cs = getComputedStyle(b);
      return {
        borderTopWidth: cs.borderTopWidth,
        boxShadow: cs.boxShadow,
        outlineStyle: cs.outlineStyle,
        drawnChild: !!b.querySelector(":scope > .outline-container, :scope > svg.outline-svg"),
        position: cs.position,
      };
    })(),
    overlayPresent: !!document.getElementById("ctrl-face-overlay"),
  };
}

for (const scheme of ["light", "dark"] as const) {
  for (const cell of CELLS) {
    test(`face census — ${ARM} · ${cell.name} · ${scheme}`, async ({ browser }, info) => {
      const ctx = await browser.newContext({
        viewport: { width: cell.w, height: cell.h },
        hasTouch: cell.mobile,
        isMobile: cell.mobile && info.project.name === "chromium",
        deviceScaleFactor: 1,
        colorScheme: scheme,
        baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4234",
      });
      const page = await ctx.newPage();
      await page.addInitScript((d) => {
        try {
          localStorage.setItem("sudoku-color-scheme", d);
        } catch {
          /* private mode */
        }
      }, scheme);
      await loadBoard(page, cell.open);
      const r = await page.evaluate(readAll);
      mkdirSync(OUT, { recursive: true });
      writeFileSync(
        join(OUT, `${ARM}-${cell.name}-${scheme}-${info.project.name}.json`),
        JSON.stringify(r, null, 1),
      );
      console.log(
        `[${ARM} ${cell.name} ${scheme} ${info.project.name}] voices=${r.voices.length} ` +
          `name=${r.namePx} option=${r.optionPx} ratio=${r.ratio} filters=${r.liveFilters} ` +
          `overlay=${r.overlayPresent} printedOnScreen=${r.printedNodesOnScreen}/${r.printedNodesTotal}`,
      );
      await ctx.close();
    });
  }
}
