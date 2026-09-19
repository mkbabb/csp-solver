// T9-W7 pass 2 · CRITIQUE · CTRL-RULE — THE PIN CENSUS THE PROTOTYPE'S PREDICATE CANNOT SEE.
//
// The prototype's occlusion predicate enumerates sticky/fixed surfaces with
// `querySelectorAll` + `getComputedStyle(el).position`. A PSEUDO-ELEMENT is not in that set:
// `.controls-card::before` is `position: sticky` with a `--color-card` gradient ground and
// `z-index: 30`, and no DOM query can return it. So `pins 0` is a property of the instrument,
// not of the page. This census asks `getComputedStyle(el, '::before' | '::after')` as well,
// computes the pseudo's painted band from the card's own box, and overlaps it with every
// control at a scroll state where the band is opaque (`[data-fold-above]`).
//
// It also re-derives the token ratios the prototype DERIVED rather than read, and re-reads the
// gallery label the prototype could not reconcile.
//
// node pin-census.mjs   [BASE=http://127.0.0.1:4234/]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const LABEL = process.env.LABEL || "protoype";

const CELLS = [
  { name: "390x844", w: 390, h: 844, touch: true },
  { name: "1280x800", w: 1280, h: 800, touch: false },
];

async function open(engine, cell, scheme, query) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    hasTouch: cell.touch,
    isMobile: cell.touch && engine === "chromium" ? true : undefined,
    colorScheme: scheme,
  });
  await ctx.addInitScript((s) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", s);
    } catch {}
  }, scheme);
  const page = await ctx.newPage();
  await page.goto(BASE + query, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1200);
  return { browser, page };
}

// ── the census that reads pseudo-elements too ────────────────────────────────────────────
const PINS = () => {
  const card = document.querySelector(".controls-card");
  if (!card) return { error: "no .controls-card" };
  const opaque = (c) =>
    !!c && c !== "transparent" && !/rgba\(0,\s*0,\s*0,\s*0\)/.test(c) && c !== "none";
  const rows = [];
  const all = [card, ...card.querySelectorAll("*")];
  for (const el of all) {
    for (const pe of [null, "::before", "::after"]) {
      const cs = getComputedStyle(el, pe);
      if (cs.position !== "sticky" && cs.position !== "fixed") continue;
      rows.push({
        sel:
          (el.tagName.toLowerCase() +
            (el.id ? "#" + el.id : "") +
            (el.className && typeof el.className === "string"
              ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
              : "")) + (pe || ""),
        pseudo: !!pe,
        position: cs.position,
        z: cs.zIndex,
        bg: cs.background.slice(0, 90),
        bgColor: cs.backgroundColor,
        bgImage: cs.backgroundImage.slice(0, 70),
        hasGround: opaque(cs.backgroundColor) || cs.backgroundImage !== "none",
        opacity: cs.opacity,
        pointerEvents: cs.pointerEvents,
        // a pseudo has no rect; compute the ::before's band from the card's own geometry
        band: pe
          ? (() => {
              const r = el.getBoundingClientRect();
              const padT =
                parseFloat(getComputedStyle(el).getPropertyValue("--card-pad-t")) || 0;
              const top = r.top; // sticky top = -padT offsets it to the padding-box edge
              return { top, height: parseFloat(cs.height) || 0 };
            })()
          : (() => {
              const r = el.getBoundingClientRect();
              return { top: r.top, height: r.height, left: r.left, width: r.width };
            })(),
      });
    }
  }
  return { rows, foldAbove: card.hasAttribute("data-fold-above"), scrollTop: card.scrollTop };
};

// overlap of the fold band with any control in the card
const FOLD_OVERLAP = () => {
  const card = document.querySelector(".controls-card");
  const cs = getComputedStyle(card, "::before");
  const r = card.getBoundingClientRect();
  const bandTop = r.top;
  const bandH = parseFloat(cs.height) || 0;
  const bandBottom = bandTop + bandH;
  const ctls = [
    ...card.querySelectorAll('button, [tabindex="0"], input, select, a[href]'),
  ].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  });
  let worst = null;
  for (const e of ctls) {
    const b = e.getBoundingClientRect();
    const ov = Math.max(0, Math.min(b.bottom, bandBottom) - Math.max(b.top, bandTop));
    const frac = b.height ? ov / b.height : 0;
    if (!worst || frac > worst.frac)
      worst = {
        frac: +frac.toFixed(4),
        label: (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 24),
        top: +b.top.toFixed(2),
      };
  }
  return {
    foldAbove: card.hasAttribute("data-fold-above"),
    beforeOpacity: cs.opacity,
    bandTop: +bandTop.toFixed(2),
    bandH: +bandH.toFixed(2),
    worst,
    nControls: ctls.length,
  };
};

const TOKENS = () => {
  const cs = getComputedStyle(document.documentElement);
  const names = [
    "--ring-ink",
    "--color-card",
    "--color-foreground",
    "--color-muted-foreground",
    "--color-red-ink",
    "--ink-press-rule",
  ];
  const out = {};
  const probe = document.createElement("div");
  document.body.appendChild(probe);
  for (const n of names) {
    const raw = cs.getPropertyValue(n).trim();
    probe.style.color = `var(${n})`;
    out[n] = { raw, resolved: getComputedStyle(probe).color };
  }
  probe.remove();
  const card = document.querySelector(".controls-card");
  out.cardBg = card ? getComputedStyle(card).backgroundColor : null;
  const name = document.querySelector(".rp-name");
  const chip = document.querySelector(".rp-field .ctrl-btn, .rp-field button");
  out.nameFont = name ? getComputedStyle(name).fontSize : null;
  out.chipFont = chip ? getComputedStyle(chip).fontSize : null;
  out.nameColor = name ? getComputedStyle(name).color : null;
  return out;
};

const GALLERY = () => {
  const l = document.querySelector(".staging-axis-label");
  if (!l) return { present: false };
  const cs = getComputedStyle(l);
  const r = l.getBoundingClientRect();
  const h = document.querySelector(".section-heading");
  return {
    present: true,
    boxLeft: +r.left.toFixed(2),
    fontSize: cs.fontSize,
    paddingLeft: cs.paddingLeft,
    sectionHeadingSize: h ? getComputedStyle(h).fontSize : null,
    sectionHeadingAlign: h ? getComputedStyle(h).textAlign : null,
  };
};

const result = { base: BASE, label: LABEL, cells: {} };

for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const key = `${engine}/${cell.name}`;
    result.cells[key] = {};
    // 1 · the card, light
    {
      const { browser, page } = await open(
        engine,
        cell,
        "light",
        "?size=3&difficulty=EASY",
      );
      if (
        await page.evaluate(() =>
          document.documentElement.classList.contains("drawer-closed"),
        )
      ) {
        await page.locator(".drawer-tab").first().click({ force: true });
        await page.waitForTimeout(950); // THE SHEET SLIDES
      }
      await page.waitForTimeout(400);
      result.cells[key].pins_top = await page.evaluate(PINS);
      result.cells[key].tokens_light = await page.evaluate(TOKENS);
      // scroll the card so the fold band arms
      await page.evaluate(() => {
        const c = document.querySelector(".controls-card");
        if (c) c.scrollTop = 200;
      });
      await page.waitForTimeout(500);
      result.cells[key].fold_200 = await page.evaluate(FOLD_OVERLAP);
      await page.evaluate(() => {
        const c = document.querySelector(".controls-card");
        if (c) c.scrollTop = c.scrollHeight;
      });
      await page.waitForTimeout(500);
      result.cells[key].fold_max = await page.evaluate(FOLD_OVERLAP);
      result.cells[key].pins_max = await page.evaluate(PINS);
      await browser.close();
    }
    // 2 · dark tokens
    {
      const { browser, page } = await open(engine, cell, "dark", "?size=3&difficulty=EASY");
      result.cells[key].tokens_dark = await page.evaluate(TOKENS);
      await browser.close();
    }
    // 3 · the gallery label (pi)
    {
      const { browser, page } = await open(engine, cell, "light", "?view=gallery");
      await page.waitForTimeout(600);
      result.cells[key].gallery = await page.evaluate(GALLERY);
      await browser.close();
    }
    console.log("done", key);
  }
}

writeFileSync(join(OUT, `pin-census-${LABEL}.json`), JSON.stringify(result, null, 2));
console.log("EXIT OK ->", join(OUT, `pin-census-${LABEL}.json`));
