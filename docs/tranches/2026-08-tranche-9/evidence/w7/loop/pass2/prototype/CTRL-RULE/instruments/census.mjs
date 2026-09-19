// T9-W7 pass 2 · CTRL-RULE, ARM (b) — THE PROTOTYPE'S CENSUS, both engines, on the real surface.
//
// One instrument, every row the brief names, so a number is read in the same session the page
// was built in. Copies of r0's own methods where r0 has one (the occlusion predicate from
// `pass2/research/CTRL-RULE/instruments/occlusion-and-ring.mjs`; R3's σ; R1's voice census),
// re-pointed to THIS dir — r0 is frozen and nothing here writes to it.
//
// node census.mjs   [BASE=http://127.0.0.1:4231/]
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const sharp = (
  await import(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs"
  )
).default;
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

const CELLS = [
  { name: "390x844", w: 390, h: 844, mobile: true, sheet: true },
  { name: "1280x800", w: 1280, h: 800, mobile: false, sheet: false },
  { name: "900x500", w: 900, h: 500, mobile: true, sheet: true },
  { name: "320x568", w: 320, h: 568, mobile: true, sheet: true },
  { name: "844x390", w: 844, h: 390, mobile: true, sheet: true },
  { name: "375x812", w: 375, h: 812, mobile: true, sheet: true },
  { name: "430x932", w: 430, h: 932, mobile: true, sheet: true },
];

async function open(engine, cell, dark = false) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    hasTouch: cell.mobile,
    isMobile: cell.mobile && engine === "chromium" ? true : undefined,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {}
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1200);
  return { browser, page };
}

async function openSheet(page) {
  const closed = await page.evaluate(() =>
    document.documentElement.classList.contains("drawer-closed"),
  );
  if (closed) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES — settle before measuring
  }
  return closed;
}

// ── R1 · THE HEADING VOICE (r0/r1-controls' census, re-aimed at `.rp-name`) ────────────────
const VOICE = () => {
  const n2 = (v) => +(+v).toFixed(4);
  const card = document.querySelector(".controls-card");
  if (!card) return { error: "no card" };
  const names = [...card.querySelectorAll("h2, .rp-name, .section-heading, .zone-row-label")];
  const rows = names.map((el) => {
    const c = getComputedStyle(el);
    return {
      text: (el.innerText || "").replace(/\s+/g, " ").trim(),
      cls: el.className.toString().split(/\s+/)[0] || el.tagName,
      family: c.fontFamily.split(",")[0].replace(/["']/g, ""),
      size: n2(parseFloat(c.fontSize)),
      weight: c.fontWeight,
      transform: c.textTransform,
      color: c.color,
      tag: el.tagName,
    };
  });
  const chips = [...card.querySelectorAll(".ctrl-btn")].map((el) =>
    n2(parseFloat(getComputedStyle(el).fontSize)),
  );
  const voices = [...new Set(rows.map((r) => [r.family, r.size, r.weight, r.transform].join("|")))];
  const chip = chips.length ? Math.max(...chips) : null;
  return {
    headings: rows.filter((r) => r.tag === "H2").length,
    names: rows.length,
    voices: voices.length,
    voiceKeys: voices,
    chipSizes: [...new Set(chips)],
    ratio: chip ? n2(rows[0] ? rows[0].size / chip : 0) : null,
    inks: [...new Set(rows.map((r) => r.color))],
    rows,
  };
};

// ── R3's σ, on the SEVEN RULES as the engine paints them ───────────────────────────────────
const SIGMA = () => {
  const n4 = (v) => +(+v).toFixed(4);
  const out = [];
  for (const svg of document.querySelectorAll(".controls-card .rp-rule, .card-foot .bar-rule, .action-bar .bar-rule")) {
    const path = svg.querySelector("path");
    if (!path) continue;
    const m = path.getScreenCTM();
    const L = path.getTotalLength();
    const pts = [];
    for (let i = 0; i < 33; i++) {
      const p = path.getPointAtLength((i / 32) * L);
      pts.push([p.x * m.a + p.y * m.c + m.e, p.x * m.b + p.y * m.d + m.f]);
    }
    const [ax, ay] = pts[0];
    const [bx, by] = pts[pts.length - 1];
    const len = Math.hypot(bx - ax, by - ay);
    const res = pts.map(
      ([x, y]) => Math.abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / len,
    );
    const r = svg.getBoundingClientRect();
    out.push({
      group: (svg.closest("[data-ruled-group]")?.querySelector(".rp-name")?.innerText || "bar")
        .replace(/\s+/g, " ")
        .trim(),
      chordPx: n4(len),
      widthPx: n4(r.width),
      sigma: n4(Math.sqrt(res.reduce((a, v) => a + v * v, 0) / res.length)),
      max: n4(Math.max(...res)),
      stroke: getComputedStyle(path).strokeWidth,
      strokeColor: getComputedStyle(path).stroke,
    });
  }
  return out;
};

// ── THE OCCLUSION PREDICATE (research instrument, verbatim in method) ──────────────────────
const OCCLUDE = (scrollTop) => {
  const n2 = (v) => +(+v).toFixed(2);
  const card = document.querySelector(".controls-card");
  if (!card) return { scrollTop, error: "no card" };
  card.scrollTop = scrollTop;
  void card.offsetHeight;
  const cardBox = card.getBoundingClientRect();
  const pins = [...card.querySelectorAll("*")].filter((el) => {
    const p = getComputedStyle(el).position;
    if (p !== "sticky" && p !== "fixed") return false;
    const b = el.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  });
  const CONTROL = "button, [role=option], a[href], input, select, textarea";
  const rows = [];
  for (const pin of pins) {
    const pb = pin.getBoundingClientRect();
    const group = pin.closest("[role=group], [data-ruled-group], section") || card;
    for (const ctl of group.querySelectorAll(CONTROL)) {
      if (pin.contains(ctl)) continue; // a pin never occludes what it CONTAINS
      const cb = ctl.getBoundingClientRect();
      if (cb.width === 0 || cb.height === 0) continue;
      const top = Math.max(cb.top, cardBox.top),
        bot = Math.min(cb.bottom, cardBox.bottom);
      if (bot <= top) continue;
      const oTop = Math.max(top, pb.top),
        oBot = Math.min(bot, pb.bottom);
      const oL = Math.max(cb.left, pb.left),
        oR = Math.min(cb.right, pb.right);
      const covered = Math.max(0, oBot - oTop) * Math.max(0, oR - oL);
      if (covered <= 0) continue;
      const visible = (bot - top) * cb.width;
      rows.push({
        pin: (pin.className.toString().split(/\s+/)[0] || pin.tagName).slice(0, 28),
        control: (ctl.innerText || ctl.getAttribute("aria-label") || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 18),
        coveredFrac: n2(visible ? covered / visible : 0),
      });
    }
  }
  // THE BAR'S OWN COVERAGE — the foot is outside the port, so this is the same arithmetic
  // aimed at the node the defect was measured on.
  const bar = document.querySelector(".action-bar");
  let barWorst = 0;
  if (bar) {
    const bb = bar.getBoundingClientRect();
    for (const ctl of card.querySelectorAll(CONTROL)) {
      const cb = ctl.getBoundingClientRect();
      const top = Math.max(cb.top, cardBox.top),
        bot = Math.min(cb.bottom, cardBox.bottom);
      if (bot <= top) continue;
      const oTop = Math.max(top, bb.top),
        oBot = Math.min(bot, bb.bottom);
      const oL = Math.max(cb.left, bb.left),
        oR = Math.min(cb.right, bb.right);
      const covered = Math.max(0, oBot - oTop) * Math.max(0, oR - oL);
      const visible = (bot - top) * cb.width;
      if (visible > 0) barWorst = Math.max(barWorst, covered / visible);
    }
  }
  return {
    scrollTop: n2(card.scrollTop),
    pins: pins.length,
    pinClasses: [...new Set(pins.map((p) => p.className.toString().split(/\s+/)[0]))],
    violations: rows.filter((r) => r.coveredFrac > 0.001),
    barWorstFrac: n2(barWorst),
  };
};

// ── THE RING, AUTHORED + PAINTED-BOX ───────────────────────────────────────────────────────
const RING = () => {
  const n3 = (v) => +(+v).toFixed(3);
  const scopes = [document.querySelector(".controls-card"), document.querySelector(".card-foot")];
  const F = "button, [role=option], a[href], input, select, textarea, [tabindex='0']";
  const out = [];
  for (const scope of scopes) {
    if (!scope) continue;
    for (const el of scope.querySelectorAll(F)) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      el.focus();
      const c = getComputedStyle(el);
      // the ring may ride a CHILD face (the ribbon's idiom) — take whichever is authored
      const kid = el.querySelector(".confirm-face, .guard-face, .act-face");
      const kc = kid ? getComputedStyle(kid) : null;
      const authoredOn = (s) =>
        s && s.outlineStyle !== "none" && s.outlineStyle !== "auto" && parseFloat(s.outlineWidth) > 0;
      const src = authoredOn(c) ? c : authoredOn(kc) ? kc : c;
      out.push({
        scope: scope.className.toString().split(/\s+/)[0],
        cls:
          (el.className.toString().match(
            /\b(ctrl-btn|icon-btn|info-btn|players-leave|deal-btn|invite-btn|confirm-btn|drawer-tab)\b/g,
          ) || ["(other)"]).join("."),
        text: (el.innerText || el.getAttribute("aria-label") || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 16),
        outline: [src.outlineStyle, src.outlineWidth, src.outlineColor, src.outlineOffset].join(" "),
        authored: authoredOn(src),
        ua: src.outlineStyle === "auto",
        box: { w: n3(b.width), h: n3(b.height) },
      });
      el.blur();
    }
  }
  return {
    n: out.length,
    authored: out.filter((o) => o.authored).length,
    ua: out.filter((o) => o.ua).length,
    unringed: out.filter((o) => !o.authored).map((o) => `${o.cls}:${o.text}`),
    rows: out,
  };
};

// ── GEOMETRY: the card's ledger, the margin, the wrap, the tap floors, M01, the filters ────
const GEOM = () => {
  const n2 = (v) => +(+v).toFixed(2);
  const card = document.querySelector(".controls-card");
  const wrap = document.querySelector(".control-panel-wrap");
  const groups = [...document.querySelectorAll("[data-ruled-group]")].map((g) => {
    const name = g.querySelector(".rp-name");
    const field = g.querySelector(".rp-field");
    const chips = [...g.querySelectorAll(".ctrl-btn")];
    const rowsY = [...new Set(chips.map((c) => Math.round(c.getBoundingClientRect().top)))];
    const nb = name?.getBoundingClientRect();
    const fb = field?.getBoundingClientRect();
    return {
      name: (name?.innerText || "").replace(/\s+/g, " ").trim(),
      nameBox: nb ? { w: n2(nb.width), h: n2(nb.height), x: n2(nb.left) } : null,
      fieldBox: fb ? { w: n2(fb.width), x: n2(fb.left) } : null,
      chipRows: rowsY.length,
      chipsTotalW: n2(chips.reduce((a, c) => a + c.getBoundingClientRect().width, 0)),
      groupH: n2(g.getBoundingClientRect().height),
      chipMin: chips.length
        ? {
            w: n2(Math.min(...chips.map((c) => c.getBoundingClientRect().width))),
            h: n2(Math.min(...chips.map((c) => c.getBoundingClientRect().height))),
          }
        : null,
      chipPadInline: chips.length ? getComputedStyle(chips[0]).paddingInline : null,
    };
  });
  const cs = wrap ? getComputedStyle(wrap) : null;
  // the filter census: every element painting a `filter: url(#…)` plus every url() reference
  const filtered = [...document.querySelectorAll("*")].filter((el) => {
    const f = getComputedStyle(el).filter;
    return f && f !== "none" && f.includes("url(");
  }).length;
  const urls = document.documentElement.outerHTML.match(/url\(#/g)?.length ?? 0;
  return {
    cardScrollH: card ? n2(card.scrollHeight) : null,
    cardClientH: card ? n2(card.clientHeight) : null,
    cardW: card ? n2(card.getBoundingClientRect().width) : null,
    rpMargin: cs ? cs.getPropertyValue("--rp-margin").trim() : null,
    typeOption: getComputedStyle(document.documentElement).getPropertyValue("--type-option").trim(),
    typeOptionPx: card?.querySelector(".ctrl-btn")
      ? n2(parseFloat(getComputedStyle(card.querySelector(".ctrl-btn")).fontSize))
      : null,
    footH: card ? getComputedStyle(card).getPropertyValue("--card-foot-h").trim() : null,
    sheetChrome: (() => {
      const sc = document.querySelector(".scene-controls");
      return sc ? getComputedStyle(sc).getPropertyValue("--sheet-chrome").trim() : null;
    })(),
    mastheadFoot: getComputedStyle(document.documentElement).getPropertyValue("--masthead-foot").trim(),
    caseOffset: getComputedStyle(document.documentElement).getPropertyValue("--case-offset").trim(),
    dialogsInCard: card ? card.querySelectorAll("[role=dialog]").length : null,
    filtered,
    urlRefs: urls,
    groups,
  };
};

// ── THE SEAM: the case's painted top edge against the wordmark's box ───────────────────────
const SEAM = () => {
  const n2 = (v) => +(+v).toFixed(2);
  const caseEl = document.querySelector(".drawer-case");
  const mark = document.querySelector("svg.handwritten-logo");
  if (!caseEl || !mark) return { error: "missing" };
  const c = caseEl.getBoundingClientRect();
  const m = mark.getBoundingClientRect();
  return { caseTop: n2(c.top), wordmarkBottom: n2(m.bottom), seam: n2(c.top - m.bottom) };
};

// ── THE GALLERY'S FIVE READINGS (pi on a surface this wave does not claim) ─────────────────
const GALLERY = () => {
  const n2 = (v) => +(+v).toFixed(2);
  const el = document.querySelector(".staging-axis-label");
  if (!el) return { present: false };
  const c = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const heads = [...document.querySelectorAll(".section-heading")].map((h) => ({
    text: (h.innerText || "").trim().slice(0, 18),
    size: n2(parseFloat(getComputedStyle(h).fontSize)),
    align: getComputedStyle(h).textAlign,
    padLeft: getComputedStyle(h).paddingLeft,
  }));
  return {
    present: true,
    glyphX: n2(r.left),
    fontSize: n2(parseFloat(c.fontSize)),
    paddingLeft: c.paddingLeft,
    chipPadInline: (() => {
      const b = document.querySelector(".staging-band .ctrl-btn");
      return b ? getComputedStyle(b).paddingInline : null;
    })(),
    sectionHeadings: heads,
  };
};

// ── the confirm ribbon's verbs ─────────────────────────────────────────────────────────────
const RIBBON = () => {
  const n2 = (v) => +(+v).toFixed(2);
  const rib = document.querySelector(".confirm-ribbon");
  if (!rib) return { present: false };
  const rows = [...rib.querySelectorAll(".confirm-btn")].map((b) => {
    const face = b.querySelector(".confirm-face");
    const fb = (face || b).getBoundingClientRect();
    const fc = getComputedStyle(face || b);
    return {
      text: (b.innerText || "").replace(/\s+/g, " ").trim(),
      w: n2(fb.width),
      h: n2(fb.height),
      color: fc.color,
      background: fc.backgroundColor,
      drawn: !!b.querySelector("svg"),
    };
  });
  const line = rib.querySelector(".confirm-line");
  return {
    present: true,
    line: (line?.innerText || "").trim(),
    rows,
    floorOk: rows.every((r) => r.w >= 44 && r.h >= 44),
  };
};

// ── the painted contrast of a band, from the engine's own bytes ────────────────────────────
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

async function ruleContrast(page, index = 0) {
  const box = await page.evaluate((i) => {
    const svg = document.querySelectorAll(".controls-card .rp-rule")[i];
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y - 3), width: Math.round(r.width), height: Math.round(r.height + 6) };
  }, index);
  if (!box || box.width < 8) return null;
  const buf = await page.screenshot({ clip: box });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = (x, y) => {
    const o = (y * width + x) * channels;
    return [data[o], data[o + 1], data[o + 2]];
  };
  const ground = px(width - 1, 0); // the card's paper at the band's corner
  const cols = [];
  for (let x = 0; x < width; x++) {
    let best = 1;
    for (let y = 0; y < height; y++) best = Math.max(best, ratio(px(x, y), ground));
    cols.push(best);
  }
  const sorted = [...cols].sort((a, b) => a - b);
  return {
    ground,
    width,
    worstColumn: +sorted[0].toFixed(3),
    p05: +sorted[Math.floor(cols.length * 0.05)].toFixed(3),
    median: +sorted[Math.floor(cols.length / 2)].toFixed(3),
    best: +sorted[sorted.length - 1].toFixed(3),
  };
}

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const key = `${cell.name}/${engine}`;
    const { browser, page } = await open(engine, cell);
    const rec = (out[key] = {});
    rec.seamBeforeOpen = await page.evaluate(SEAM);
    rec.gallery = await page.evaluate(GALLERY);
    const wasClosed = await openSheet(page);
    rec.sheetWasClosed = wasClosed;
    rec.voice = await page.evaluate(VOICE);
    rec.sigma = await page.evaluate(SIGMA);
    rec.geom = await page.evaluate(GEOM);
    rec.seam = await page.evaluate(SEAM);
    rec.occlusion = [];
    for (const s of [0, 120, 240, 400, 9999]) rec.occlusion.push(await page.evaluate(OCCLUDE, s));
    await page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      if (c) c.scrollTop = 0;
    });
    rec.ring = await page.evaluate(RING);
    // THE RULE'S PAINTED INK MOVED TO ITS OWN INSTRUMENT (`rule-ink.mjs`). This read clipped
    // off a rect taken while the rule was still below the scrollport's fold, so it screenshotted
    // paper at 390 (worstColumn 1.000) and threw outright at 1280. Kept here, guarded, as the
    // cross-check; the per-rule sweep is the row of record.
    if (cell.name === "390x844" || cell.name === "1280x800")
      rec.ruleContrast = await ruleContrast(page, 0).catch((e) => ({ error: String(e).slice(0, 80) }));
    await browser.close();
    const v = rec.voice || {};
    const worst = rec.occlusion.flatMap((o) => o.violations || []).length;
    console.log(
      key,
      `| voices ${v.voices} headings ${v.headings} ratio ${v.ratio}`,
      `| pins ${rec.occlusion[0].pins} viol ${worst} barWorst ${Math.max(...rec.occlusion.map((o) => o.barWorstFrac ?? 0))}`,
      `| ring ${rec.ring.authored}/${rec.ring.n}`,
      `| scrollH ${rec.geom.cardScrollH}/${rec.geom.cardClientH}`,
      `| seam ${rec.seam.seam}`,
      `| σ ${(rec.sigma || []).map((s) => s.sigma).join(",")}`,
      rec.ruleContrast ? `| worstCol ${rec.ruleContrast.worstColumn}` : "",
    );
  }
}
writeFileSync(join(OUT, "census.json"), JSON.stringify(out, null, 1));
console.log("banked readings/census.json");
