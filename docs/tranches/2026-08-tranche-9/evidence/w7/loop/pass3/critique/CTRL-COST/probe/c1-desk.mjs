#!/usr/bin/env node
// CTRL-COST pass-3 CRITIC — the critic's own desk row, written from scratch.
// Reads: card width + padding-top, --pin-band / --cost-head-h computed, the four band heads'
// heights, board x, the asked word's PAINTED contrast in four states (rest, hover, armed,
// armed+hovered), the answer's box, reflow Δ, and the occlusion sweep under the pinned head.
// Usage: node c1-desk.mjs <base> <engine> <WxH> <out.json> [theme]
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const base = process.argv[2];
const engine = process.argv[3] ?? "chromium";
const [w, h] = (process.argv[4] ?? "1280x800").split("x").map(Number);
const out = process.argv[5] ?? "/tmp/c1.json";
const theme = process.argv[6] ?? "light";

const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: w, height: h },
  hasTouch: w < 1024,
  deviceScaleFactor: 2,
  colorScheme: theme === "dark" ? "dark" : "light",
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
await page.goto(`${base}/`);
await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900); // the dock sheet SLIDES

const R = {};

// ── the ruler ────────────────────────────────────────────────────────────────
R.card = await page.evaluate(() => {
  const c = document.querySelector(".controls-card");
  if (!c) return null;
  const cs = getComputedStyle(c);
  const r = c.getBoundingClientRect();
  return {
    width: +r.width.toFixed(2),
    x: +r.x.toFixed(2),
    paddingTop: cs.paddingTop,
    paddingBottom: cs.paddingBottom,
    pinBand: cs.getPropertyValue("--pin-band").trim(),
    headH: cs.getPropertyValue("--cost-head-h").trim(),
    scrollPadTop: cs.scrollPaddingTop,
    clientHeight: c.clientHeight,
    scrollHeight: c.scrollHeight,
  };
});

R.board = await page.evaluate(() => {
  const b =
    document.querySelector(".board-wrapper") ?? document.querySelector(".game-board");
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2) };
});

// every child of the card, its max-content width (the ruler law's own test)
R.overRuler = await page.evaluate(() => {
  const card = document.querySelector(".controls-card");
  if (!card) return null;
  const cs = getComputedStyle(card);
  const inner =
    card.getBoundingClientRect().width -
    parseFloat(cs.paddingLeft) -
    parseFloat(cs.paddingRight);
  const rows = [];
  for (const el of card.querySelectorAll("*")) {
    const prev = el.style.width;
    el.style.width = "max-content";
    const mc = el.getBoundingClientRect().width;
    el.style.width = prev;
    if (mc > inner + 0.05)
      rows.push({
        sel:
          el.className && typeof el.className === "string"
            ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
            : el.tagName,
        maxContent: +mc.toFixed(2),
      });
  }
  return { innerWidth: +inner.toFixed(2), over: rows.slice(0, 12), overCount: rows.length };
});

// ── the four heads ───────────────────────────────────────────────────────────
R.heads = await page.evaluate(() =>
  [...document.querySelectorAll(".cost-band-head")].map((el) => ({
    name: el.querySelector(".section-heading")?.textContent?.trim() ?? "?",
    h: +el.getBoundingClientRect().height.toFixed(2),
    top: +el.getBoundingClientRect().top.toFixed(2),
    position: getComputedStyle(el).position,
    cssTop: getComputedStyle(el).top,
  })),
);

// ── painted contrast of the asked word, four states ──────────────────────────
const lum = (rgb) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};
const parse = (s) => (s.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);

// walk up for the first opaque painted background
const groundOf = async (sel) =>
  page.evaluate((s) => {
    let el = document.querySelector(s);
    while (el) {
      const bg = getComputedStyle(el).backgroundColor;
      const m = (bg.match(/[\d.]+/g) ?? []).map(Number);
      if (m.length >= 3 && (m.length < 4 || m[3] > 0.99)) return bg;
      el = el.parentElement;
    }
    return "rgb(255,255,255)";
  }, sel);

async function wordState(faceSel, wordSel) {
  const fg = await page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).color : null;
  }, wordSel);
  const bg = await groundOf(faceSel);
  return { fg, bg, ratio: fg ? ratio(parse(fg), parse(bg)) : null };
}

const dirty = async () => {
  const wasUp = await page.evaluate(
    () => !document.documentElement.classList.contains("drawer-closed"),
  );
  if (w < 1024 && wasUp) {
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(900);
  }
  const ok = await page.evaluate(() => {
    const free = [...document.querySelectorAll("input.cell-native-input")].find(
      (i) => !i.readOnly && !i.disabled && !i.value,
    );
    if (!free) return false;
    free.focus();
    return true;
  });
  if (ok) {
    await page.keyboard.press("5");
    await page.waitForTimeout(350);
  }
  if (w < 1024) {
    const tab = await page.$(".drawer-tab, [aria-controls='controls-drawer']");
    if (tab) await tab.click({ force: true }).catch(() => {});
    await page.waitForTimeout(900);
  }
  return ok;
};
R.dirtied = await dirty();

const facesBefore = await page.evaluate(() => {
  const f = document.querySelector(".deal-face");
  const b = document.querySelector(".band-acts");
  const r = f?.getBoundingClientRect();
  const rb = b?.getBoundingClientRect();
  return {
    face: r ? [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)] : null,
    band: rb ? [+rb.x.toFixed(2), +rb.y.toFixed(2), +rb.width.toFixed(2), +rb.height.toFixed(2)] : null,
    cardScrollH: document.querySelector(".controls-card")?.scrollHeight,
  };
});

R.contrast = {};
R.contrast.rest = await wordState(".deal-face", ".deal-face .act-word:not(.is-armed)");
await page.hover(".deal-face .act-verb").catch(() => {});
await page.waitForTimeout(250);
R.contrast.restHover = await wordState(".deal-face", ".deal-face .act-word:not(.is-armed)");

// arm it: one real click on the verb
await page.click(".deal-face .act-verb", { force: true }).catch(() => {});
await page.waitForTimeout(300);
R.armedAfterOneClick = await page.evaluate(
  () => document.querySelector(".deal-face")?.hasAttribute("data-armed") ?? false,
);
R.contrast.armedHovered = await wordState(".deal-face", ".deal-face .act-word.is-armed");
// move the pointer off, re-read armed-not-hovered
await page.mouse.move(2, 2);
await page.waitForTimeout(250);
R.contrast.armed = await wordState(".deal-face", ".deal-face .act-word.is-armed");

R.answer = await page.evaluate(() => {
  const a = document.querySelector(".deal-face .act-answer");
  if (!a) return null;
  const r = a.getBoundingClientRect();
  const cs = getComputedStyle(a);
  return {
    w: +r.width.toFixed(2),
    h: +r.height.toFixed(2),
    visibility: cs.visibility,
    minHeight: cs.minHeight,
    minWidth: cs.minWidth,
    tabindex: a.getAttribute("tabindex"),
    name: a.textContent?.trim(),
    describedby: a.getAttribute("aria-describedby"),
  };
});

const facesAfter = await page.evaluate(() => {
  const f = document.querySelector(".deal-face");
  const b = document.querySelector(".band-acts");
  const r = f?.getBoundingClientRect();
  const rb = b?.getBoundingClientRect();
  return {
    face: r ? [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)] : null,
    band: rb ? [+rb.x.toFixed(2), +rb.y.toFixed(2), +rb.width.toFixed(2), +rb.height.toFixed(2)] : null,
    cardScrollH: document.querySelector(".controls-card")?.scrollHeight,
  };
});
R.reflow = {
  before: facesBefore,
  after: facesAfter,
  faceDelta: facesBefore.face?.map((v, i) => +(facesAfter.face[i] - v).toFixed(2)),
  bandDelta: facesBefore.band?.map((v, i) => +(facesAfter.band[i] - v).toFixed(2)),
  scrollHDelta: facesAfter.cardScrollH - facesBefore.cardScrollH,
};

// the a11y tree: is `no` there, with its own name?
R.axAnswer = await page
  .locator(".deal-face")
  .ariaSnapshot()
  .catch((e) => "ERR " + e.message);

// ── the occlusion sweep under the pinned head ────────────────────────────────
R.occlusion = await page.evaluate(() => {
  const card = document.querySelector(".controls-card");
  if (!card) return null;
  const rows = [];
  for (const top of [0, 58, 116, 200, 350]) {
    card.scrollTop = top;
    const at = card.scrollTop;
    const covered = [];
    const controls = [
      ...card.querySelectorAll("button, input, select, [role='button'], .ctrl-btn"),
    ];
    for (const c of controls) {
      const r = c.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const cardR = card.getBoundingClientRect();
      const cx = r.x + r.width / 2;
      const cy = r.y + r.height / 2;
      if (cy < cardR.top || cy > cardR.bottom) continue;
      const hit = document.elementFromPoint(cx, cy);
      if (hit && !c.contains(hit) && !hit.contains(c)) {
        const head = hit.closest?.(".cost-band-head");
        covered.push({
          control: (c.className || "").toString().slice(0, 40),
          hit: (hit.className || hit.tagName || "").toString().slice(0, 40),
          byHead: !!head,
        });
      }
    }
    rows.push({ scrollTop: at, controls: controls.length, covered });
  }
  card.scrollTop = 0;
  return rows;
});

// ── the berth's ink vs its label box ─────────────────────────────────────────
await page.hover(".deal-face .act-verb").catch(() => {});
await page.waitForTimeout(300);
R.berth = await page.evaluate(() => {
  const label = document.querySelector(".cost-band-head .band-note .washi-label, .cost-band-head .band-note");
  if (!label) return null;
  const lr = label.getBoundingClientRect();
  const tn = [...label.querySelectorAll("*")]
    .flatMap((e) => [...e.childNodes])
    .find((n) => n.nodeType === 3 && n.textContent.trim());
  if (!tn) return { label: [lr.top, lr.bottom], text: null };
  const rg = document.createRange();
  rg.selectNodeContents(tn);
  const ir = rg.getBoundingClientRect();
  return {
    labelTop: +lr.top.toFixed(2),
    labelBottom: +lr.bottom.toFixed(2),
    inkTop: +ir.top.toFixed(2),
    inkBottom: +ir.bottom.toFixed(2),
    overTop: +(lr.top - ir.top).toFixed(2),
    overBottom: +(ir.bottom - lr.bottom).toFixed(2),
    text: tn.textContent.trim().slice(0, 60),
  };
});

// filter census in the live DOM (budget 9)
R.filters = await page.evaluate(() => {
  const ids = new Set();
  for (const f of document.querySelectorAll("filter")) ids.add(f.id);
  return { count: ids.size, ids: [...ids].slice(0, 20) };
});

writeFileSync(out, JSON.stringify({ engine, vp: `${w}x${h}`, theme, ...R }, null, 2));
console.log("DONE", out);
await browser.close();
