// T9-W7 pass 2 · CTRL-RULE — CENSUS 2: the rows census 1 could not read.
//  (a) the rule's stroke sweep — worst PAINTED column, light, both engines, 1.6 / 1.8 / 2.0
//  (b) the ring under KEYBOARD modality (a programmatic focus is not `:focus-visible` on a
//      touch context — census 1 read 0/20 at the dock for that reason and not for the card's)
//  (c) `level` in two taps from the playing view
//  (d) the confirm ribbon: the verbs' boxes in both dimensions, with the estate's own FIRING
//      negative control (the gallery's `keep` at HEAD reads 39 × 44)
//  (e) the gallery's five readings, in the GALLERY view, at 390 and 1280 — pi
//  (f) the landscape arm's price: the port at the derived chrome against the port at 4rem
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const sharp = (
  await import(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs"
  )
).default;

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

const rl = (r, g, b) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [rl(...a), rl(...b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

async function open(engine, w, h, { touch = true, dark = false, gallery = false } = {}) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    hasTouch: touch,
    isMobile: touch && engine === "chromium" ? true : undefined,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {}
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + (gallery ? "?view=gallery" : "?size=3&difficulty=EASY"), {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1200);
  return { browser, page };
}
async function openSheet(page) {
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(950);
    return true;
  }
  return false;
}

// (a) the stroke sweep
async function strokeSweep(page) {
  const out = {};
  for (const sw of [1.6, 1.8, 2.0]) {
    await page.addStyleTag({ content: `.rp-rule path{stroke-width:${sw}px!important}` });
    await page.waitForTimeout(120);
    const box = await page.evaluate(() => {
      const svg = document.querySelector(".controls-card .rp-rule");
      if (!svg) return null;
      const r = svg.getBoundingClientRect();
      return {
        x: Math.round(r.x),
        y: Math.round(r.y - 4),
        width: Math.round(r.width),
        height: Math.round(r.height + 8),
      };
    });
    if (!box) return null;
    const buf = await page.screenshot({ clip: box });
    const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;
    const px = (x, y) => {
      const o = (y * width + x) * channels;
      return [data[o], data[o + 1], data[o + 2]];
    };
    const ground = px(width - 1, 0);
    const cols = [];
    // the round CAPS overhang the box by half a stroke at each end — the two outermost
    // columns are the cap's, not the rule's, and they are reported separately rather than
    // counted as the worst painted column.
    for (let x = 0; x < width; x++) {
      let best = 1;
      for (let y = 0; y < height; y++) best = Math.max(best, ratio(px(x, y), ground));
      cols.push(+best.toFixed(3));
    }
    const inner = cols.slice(2, -2).sort((a, b) => a - b);
    out[sw] = {
      ground,
      width,
      edgeCols: [cols[0], cols[1], cols[cols.length - 2], cols[cols.length - 1]],
      worstColumn: inner[0],
      p05: inner[Math.floor(inner.length * 0.05)],
      median: inner[Math.floor(inner.length / 2)],
      best: inner[inner.length - 1],
    };
  }
  return out;
}

// (b) the ring, with keyboard modality raised first
const RING = () => {
  const n3 = (v) => +(+v).toFixed(3);
  const scopes = [document.querySelector(".controls-card"), document.querySelector(".card-foot")];
  const F = "button, [role=option], a[href], input, select, textarea, [tabindex='0']";
  const rows = [];
  for (const scope of scopes) {
    if (!scope) continue;
    for (const el of scope.querySelectorAll(F)) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      el.focus();
      const c = getComputedStyle(el);
      const kid = el.querySelector(".confirm-face, .guard-face");
      const kc = kid ? getComputedStyle(kid) : null;
      const auth = (s) =>
        s && s.outlineStyle !== "none" && s.outlineStyle !== "auto" && parseFloat(s.outlineWidth) > 0;
      const src = auth(c) ? c : auth(kc) ? kc : c;
      rows.push({
        scope: scope.className.toString().split(/\s+/)[0],
        cls: (el.className.toString().match(
          /\b(ctrl-btn|icon-btn|info-btn|players-leave|deal-btn|invite-btn|confirm-btn)\b/g,
        ) || ["(other)"]).join("."),
        text: (el.innerText || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 16),
        outline: [src.outlineStyle, src.outlineWidth, src.outlineColor, src.outlineOffset].join(" "),
        authored: auth(src),
        matchesFV: el.matches(":focus-visible"),
        box: { w: n3(b.width), h: n3(b.height) },
      });
      el.blur();
    }
  }
  // the AUTHORED DECLARATION, read off the cascade rather than off a focused node: the rule
  // exists for this surface whether or not this rig can raise `:focus-visible` on it.
  let declared = null;
  for (const sheet of document.styleSheets) {
    try {
      for (const r of sheet.cssRules) {
        if (r.selectorText && r.selectorText.includes(".controls-card") && r.selectorText.includes("focus-visible")) {
          declared = { selector: r.selectorText, outline: r.style.outline, offset: r.style.outlineOffset };
        }
      }
    } catch {}
  }
  return {
    n: rows.length,
    authored: rows.filter((r) => r.authored).length,
    fv: rows.filter((r) => r.matchesFV).length,
    unringed: rows.filter((r) => !r.authored).map((r) => `${r.cls}:${r.text}`),
    declared,
    rows,
  };
};

const out = {};
for (const engine of ["chromium", "webkit"]) {
  // ── (a) + (b) + (c) + (d), 390×844 and 1280×800
  for (const [w, h, touch] of [
    [390, 844, true],
    [1280, 800, false],
  ]) {
    const key = `${w}x${h}/${engine}`;
    const { browser, page } = await open(engine, w, h, { touch });
    const rec = (out[key] = {});
    await openSheet(page);
    // keyboard modality: a real Tab press, then the programmatic focus reads :focus-visible
    await page.keyboard.press("Tab");
    await page.waitForTimeout(120);
    rec.ring = await page.evaluate(RING);
    // THE STROKE SWEEP MOVED TO `rule-ink.mjs` — this one clipped off a rect taken before the
    // rule was scrolled into the port and threw at 1280 ("Clipped area is either empty or
    // outside"). Guarded here so the rows below it (the ring, the taps, the ribbon, the
    // gallery's five readings) are not lost to its throw; the per-rule sweep is the row of
    // record.
    rec.stroke = await strokeSweep(page).catch((e) => ({ error: String(e).slice(0, 70) }));
    await browser.close();
    console.log(
      key,
      "| ring authored", `${rec.ring.authored}/${rec.ring.n}`,
      "fv", rec.ring.fv,
      "| declared", rec.ring.declared ? rec.ring.declared.selector.slice(0, 48) : "NONE",
      "| stroke worstCol", Object.entries(rec.stroke || {}).map(([k, v]) => `${k}:${v && v.worstColumn}`).join(" "),
    );
  }

  // ── (c) two taps to `level`, on the phone
  {
    const { browser, page } = await open(engine, 390, 844, { touch: true });
    const key = `taps/${engine}`;
    const before = await page.evaluate(() =>
      document.documentElement.classList.contains("drawer-closed"),
    );
    let taps = 0;
    if (before) {
      await page.locator(".drawer-tab").first().click({ force: true });
      taps++;
      await page.waitForTimeout(950);
    }
    const tier = page.locator(".controls-card .ctrl-btn", { hasText: "hard" }).first();
    const visibleBefore = await tier.isVisible().catch(() => false);
    if (visibleBefore) {
      await tier.click();
      taps++;
    }
    await page.waitForTimeout(250);
    out[key] = {
      taps,
      tierVisibleAfterOneTap: visibleBefore,
      pressed: await tier.getAttribute("aria-pressed").catch(() => null),
      hiddenOptionRows: await page.evaluate(
        () =>
          [...document.querySelectorAll(".controls-card .ctrl-options")].filter(
            (o) => o.getBoundingClientRect().height === 0,
          ).length,
      ),
    };
    console.log(key, JSON.stringify(out[key]));
    await browser.close();
  }

  // ── (d) the ribbon, armed on a DIRTY board at a coarse pointer
  {
    const { browser, page } = await open(engine, 390, 844, { touch: true });
    const key = `ribbon/${engine}`;
    await page.waitForTimeout(600);
    // write one digit so the board is dirty
    const cell = page.locator(".game-cell input:not([readonly])").first();
    await cell.click({ force: true }).catch(() => {});
    await page.keyboard.type("1");
    await page.waitForTimeout(400);
    await openSheet(page);
    const clear = page.locator('button[aria-label="Clear the board"]').first();
    await clear.click({ force: true }).catch(() => {});
    await page.waitForTimeout(500);
    const rib = await page.evaluate(() => {
      const n2 = (v) => +(+v).toFixed(2);
      const r = document.querySelector(".confirm-ribbon");
      if (!r) return { present: false };
      const rows = [...r.querySelectorAll(".confirm-btn")].map((b) => {
        const f = b.querySelector(".confirm-face");
        const fb = (f || b).getBoundingClientRect();
        const c = getComputedStyle(f || b);
        return {
          text: (b.innerText || "").replace(/\s+/g, " ").trim(),
          w: n2(fb.width),
          h: n2(fb.height),
          color: c.color,
          bg: c.backgroundColor,
          drawn: !!b.querySelector("svg"),
        };
      });
      return {
        present: true,
        line: (r.querySelector(".confirm-line")?.innerText || "").trim(),
        role: r.getAttribute("role"),
        rows,
        floorOk: rows.every((x) => x.w >= 44 && x.h >= 44),
      };
    });
    // THE NEGATIVE CONTROL, and it must FIRE: the gallery's own guard verbs at HEAD read
    // 39 × 44 — a height-only floor. Read them here on the same page, same engine.
    const control = await page.evaluate(() => {
      const el = document.querySelector(".guard-face");
      if (!el) return { present: false, note: "gallery ribbon not on this view" };
      const b = el.getBoundingClientRect();
      return { present: true, w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
    });
    out[key] = { ...rib, negativeControl: control };
    console.log(key, JSON.stringify(out[key]).slice(0, 320));
    await browser.close();
  }

  // ── (e) the gallery's five readings — pi
  for (const [w, h] of [
    [390, 844],
    [1280, 800],
  ]) {
    const key = `gallery-${w}/${engine}`;
    const { browser, page } = await open(engine, w, h, { touch: w < 1024, gallery: true });
    await page.waitForTimeout(900);
    out[key] = await page.evaluate(() => {
      const n2 = (v) => +(+v).toFixed(2);
      const el = document.querySelector(".staging-axis-label");
      const chip = document.querySelector(".staging-band .ctrl-btn, .staging-band button");
      const head = document.querySelector(".section-heading");
      return {
        present: !!el,
        glyphX: el ? n2(el.getBoundingClientRect().left) : null,
        fontSize: el ? n2(parseFloat(getComputedStyle(el).fontSize)) : null,
        paddingLeft: el ? getComputedStyle(el).paddingLeft : null,
        chipPadInline: chip ? getComputedStyle(chip).paddingInline : null,
        headSize: head ? n2(parseFloat(getComputedStyle(head).fontSize)) : null,
        headAlign: head ? getComputedStyle(head).textAlign : null,
      };
    });
    console.log(key, JSON.stringify(out[key]));
    await browser.close();
  }

  // ── (f) the landscape arm's price
  {
    const key = `landscape/${engine}`;
    const { browser, page } = await open(engine, 844, 390, { touch: true });
    await openSheet(page);
    const derived = await page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      const sc = document.querySelector(".scene-controls");
      const m = document.querySelector("svg.handwritten-logo").getBoundingClientRect();
      const cs = document.querySelector(".drawer-case").getBoundingClientRect();
      return {
        chrome: getComputedStyle(sc).getPropertyValue("--sheet-chrome").trim().replace(/\s+/g, " "),
        port: +c.clientHeight.toFixed(2),
        scrollH: +c.scrollHeight.toFixed(2),
        seam: +(cs.top - m.bottom).toFixed(2),
      };
    });
    await page.addStyleTag({ content: ".scene-controls{--sheet-chrome:4rem!important}" });
    await page.waitForTimeout(400);
    const literal = await page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      const m = document.querySelector("svg.handwritten-logo").getBoundingClientRect();
      const cs = document.querySelector(".drawer-case").getBoundingClientRect();
      return {
        port: +c.clientHeight.toFixed(2),
        scrollH: +c.scrollHeight.toFixed(2),
        seam: +(cs.top - m.bottom).toFixed(2),
      };
    });
    out[key] = { derived, literalFourRem: literal };
    console.log(key, JSON.stringify(out[key]));
    await browser.close();
  }
}
writeFileSync(join(OUT, "census2.json"), JSON.stringify(out, null, 1));
console.log("banked readings/census2.json");
