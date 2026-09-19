// T9-W7 · pass 2 · CTRL-TABS RESEARCH — the real-surface probe.
//
// Five questions, one instrument, on the pass-1 worktree's running build:
//   A  THE BLOCKING CONDITION — the guard ribbon's ink under FIVE candidate grounds, composited
//      from the engine's own computed values, 390×844, light and dark, chromium and webkit.
//   B  THE LIVE REGIONS — are the three roster regions ON the accessibility tree while the
//      `players` tray is hidden? Measured by role query (which respects visibility) against the
//      DOM count (which does not).
//   C  THE SHORT END — where exactly does the card stop fitting? A height bisect at 320/360/390.
//   D  THE FLOOR — wrap rows and ink ratios at 390 and 1280.
//   E  THE 40.78 — the sheet-chrome derivation read off the live custom properties.
//
//   LANE_BASE=http://127.0.0.1:4233/ node probe/pass2.probe.mjs
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The probe lives in the evidence dir (lane law), so `playwright` is resolved out of the
// worktree's own install rather than by walking up from here.
const FRONTEND =
  process.env.LANE_FRONTEND ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-39/web/frontend";
const { chromium, webkit } = createRequire(`${FRONTEND}/package.json`)("playwright");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.env.OUT || resolve(HERE, "../readings/pass2-surface.json");
const BASE = process.env.LANE_BASE || "http://127.0.0.1:4233/";

/* The composite + WCAG maths, run INSIDE the page on the engine's own resolved colours. */
const PAGE_MATHS = `
  // BOTH serialisations. \`color-mix()\` computes to \`color(srgb r g b / a)\` with 0–1 floats in
  // both engines, and reading those as 8-bit is how a graphite face turns into black: the light
  // arm lands within 0.02 of the truth by luck (foreground IS near-black) and the dark arm reads
  // the wrong way round entirely. Scale the \`color(\` form.
  window.__px = (s) => {
    const str = String(s);
    const m = str.match(/-?[\\d.]+/g) || [];
    let n = m.slice(0, 3).map(Number);
    const a = m.length > 3 ? Number(m[3]) : 1;
    if (/^color\\(/i.test(str.trim())) n = n.map((v) => v * 255);
    return { rgb: n, a };
  };
  window.__over = (fg, bg) => fg.rgb.map((v, i) => v * fg.a + bg[i] * (1 - fg.a));
  window.__lum = (c) => {
    const f = c.map((v) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
  };
  window.__ratio = (a, b) => { const [x, y] = [window.__lum(a), window.__lum(b)].sort((p, q) => q - p); return +(((x + 0.05) / (y + 0.05)).toFixed(2)); };
  // The effective painted ground under a node: walk up compositing every non-transparent
  // background over its parent, multiplying the ancestor opacity chain.
  window.__ground = (el) => {
    const chain = [];
    for (let n = el; n; n = n.parentElement) chain.push(n);
    let ground = [255, 255, 255];
    for (const n of chain.reverse()) {
      const cs = getComputedStyle(n);
      const bg = window.__px(cs.backgroundColor);
      const op = parseFloat(cs.opacity);
      if (bg.a > 0) ground = window.__over({ rgb: bg.rgb, a: bg.a * (isNaN(op) ? 1 : op) }, ground);
    }
    return ground.map((v) => +v.toFixed(2));
  };
  window.__ink = (el) => { const cs = getComputedStyle(el); const c = window.__px(cs.color); return window.__over(c, window.__ground(el.parentElement || el)); };
`;

/* The five candidate grounds for the destructive verb, each one CSS the synthesizer could ship. */
const CURES = {
  C0_shipped: "",
  C1_estate_restore: `.guard-go{color:var(--color-foreground)!important}`,
  C2_bare_plus_boxless_keep: `.guard-go .guard-face{background:transparent!important}
     .guard-keep .guard-face > svg{display:none!important}`,
  C3_invert_the_ground: `.guard-go .guard-face{background:transparent!important}
     .guard-keep .guard-face{background:color-mix(in srgb,var(--color-foreground) 8%,transparent)!important}`,
  C4_face_at_4pct: `.guard-go .guard-face{background:color-mix(in srgb,var(--color-foreground) 4%,transparent)!important}`,
  C5_bare_card_only: `.guard-go .guard-face{background:transparent!important}`,
};

const settle = (p, ms) => p.waitForTimeout(ms);

async function newPage(browser, { w, h, scheme, mobile, engine }) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: mobile && engine === "chromium" ? true : undefined,
    hasTouch: !!mobile,
    colorScheme: scheme,
  });
  await ctx.addInitScript((s) => {
    try { localStorage.clear(); sessionStorage.clear(); localStorage.setItem("sudoku-color-scheme", s); } catch {}
  }, scheme);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.addInitScript(PAGE_MATHS).catch(() => {});
  await page.evaluate(PAGE_MATHS);
  await settle(page, 1200);
  return { ctx, page };
}

const SECTIONS = (process.env.SECTIONS || "ABCDE").toUpperCase();
const out = { base: BASE, generated: new Date().toISOString(), A: {}, B: {}, C: {}, D: {}, E: {} };

for (const engine of SECTIONS.match(/[AB]/) ? ["chromium", "webkit"] : []) {
  const launcher = engine === "webkit" ? webkit : chromium;

  /* ── A · THE BLOCKING CONDITION ───────────────────────────────────────── */
  for (const scheme of SECTIONS.includes("A") ? ["light", "dark"] : []) {
    const browser = await launcher.launch();
    const key = `390x844-${engine}-${scheme}`;
    try {
      const { ctx, page } = await newPage(browser, { w: 390, h: 844, scheme, mobile: true, engine });
      // dirty the board so the destructive verb arms
      await page.evaluate(() => {
        const i = [...document.querySelectorAll(".sudoku-cell input")].filter((x) => !x.readOnly && !x.disabled && !x.value)[0];
        i?.focus();
      });
      await page.keyboard.type("5");
      await settle(page, 400);
      await page.locator(".drawer-tab").click({ force: true });
      await settle(page, 950);

      const cardBefore = await page.evaluate(() => +document.querySelector(".controls-card").getBoundingClientRect().height.toFixed(2));
      const floorRow = await page.evaluate(() => { const r = document.querySelector(".action-verbs"); return r ? +r.getBoundingClientRect().height.toFixed(2) : null; });

      await page.locator('.action-verbs [data-verb="clear"]').click();
      await settle(page, 450);

      const rows = {};
      for (const [name, css] of Object.entries(CURES)) {
        let handle = null;
        if (css) handle = await page.addStyleTag({ content: css });
        await settle(page, 120);
        rows[name] = await page.evaluate(() => {
          const go = document.querySelector(".guard-go");
          const goFace = document.querySelector(".guard-go .guard-face");
          const keep = document.querySelector(".guard-keep");
          const keepFace = document.querySelector(".guard-keep .guard-face");
          const ask = document.querySelector(".guard-ask");
          const card = document.querySelector(".controls-card");
          const guard = document.querySelector(".guard-row");
          if (!go) return { armed: false };
          const cardBg = window.__ground(card);
          const goGround = window.__ground(goFace);
          const keepGround = window.__ground(keepFace);
          const box = (el) => { const r = el.getBoundingClientRect(); return { w: +r.width.toFixed(2), h: +r.height.toFixed(2), ok: r.width >= 44 && r.height >= 44 }; };
          const svgOf = (el) => { const s = el.querySelector("svg"); if (!s) return null; const st = s.querySelector("path,rect,polyline,polygon"); return st ? { stroke: getComputedStyle(st).stroke, width: getComputedStyle(st).strokeWidth, painted: getComputedStyle(s).display !== "none" } : { painted: getComputedStyle(s).display !== "none" }; };
          return {
            armed: true,
            goInkComputed: getComputedStyle(go).color,
            goFontPx: +parseFloat(getComputedStyle(go).fontSize).toFixed(2),
            goWeight: getComputedStyle(go).fontWeight,
            "go word vs its own ground": window.__ratio(window.__over(window.__px(getComputedStyle(go).color), goGround), goGround),
            "go ground vs card": window.__ratio(goGround, cardBg),
            "keep word vs its own ground": window.__ratio(window.__over(window.__px(getComputedStyle(keep).color), keepGround), keepGround),
            "keep ground vs card": window.__ratio(keepGround, cardBg),
            "ask vs card": window.__ratio(window.__over(window.__px(getComputedStyle(ask).color), cardBg), cardBg),
            goBox: box(go), keepBox: box(keep),
            goDrawn: svgOf(goFace), keepDrawn: svgOf(keepFace),
            guardRowH: +guard.getBoundingClientRect().height.toFixed(2),
            cardH: +card.getBoundingClientRect().height.toFixed(2),
          };
        });
        if (handle) await page.evaluate((el) => el.remove(), handle);
      }
      out.A[key] = { cardUnarmed: cardBefore, floorRowH: floorRow, cures: rows };
      await ctx.close();
    } catch (e) {
      out.A[key] = { error: String(e).slice(0, 300) };
    }
    await browser.close();
  }

  /* ── B · THE LIVE REGIONS IN THE HIDDEN TRAY ──────────────────────────── */
  if (SECTIONS.includes("B")) {
    const browser = await launcher.launch();
    const key = `390x844-${engine}`;
    try {
      const { ctx, page } = await newPage(browser, { w: 390, h: 844, scheme: "light", mobile: true, engine });
      await page.locator(".drawer-tab").click({ force: true });
      await settle(page, 950);
      const read = async (label) => {
        const dom = await page.evaluate(() => {
          const sel = '[aria-live],[role="status"],[role="alert"],[role="log"]';
          const all = [...document.querySelectorAll(sel)];
          return all.map((el) => {
            const cs = getComputedStyle(el);
            let hidden = false;
            for (let n = el; n; n = n.parentElement) {
              const s = getComputedStyle(n);
              if (s.visibility === "hidden" || s.display === "none") { hidden = true; break; }
            }
            return {
              cls: el.className.toString().slice(0, 40),
              role: el.getAttribute("role") || "(aria-live)",
              inertAncestor: !!el.closest("[inert]"),
              visibility: cs.visibility,
              hiddenByStyle: hidden,
              text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40),
            };
          });
        });
        const byRole = {
          log: await page.getByRole("log").count(),
          status: await page.getByRole("status").count(),
        };
        const invite = {
          domCount: await page.locator('.controls-card button[aria-label="Play together on this board"]').count(),
          roleCount: await page.getByRole("button", { name: "Play together on this board" }).count(),
        };
        return { label, dom, byRole, invite, faceUp: await page.evaluate(() => document.querySelector('[role="tab"][aria-selected="true"]')?.textContent.trim()) };
      };
      const shut = await read("players tray hidden (default face)");
      // raise the players tab
      const playersTab = page.locator('[role="tab"]', { hasText: "players" });
      if (await playersTab.count()) { await playersTab.first().click(); await settle(page, 400); }
      const open = await read("players tray face up");
      out.B[key] = { shut, open };
      await ctx.close();
    } catch (e) {
      out.B[key] = { error: String(e).slice(0, 300) };
    }
    await browser.close();
  }
}

/* ── C · THE SHORT END — where the card stops fitting (chromium only) ───── */
if (SECTIONS.includes("C")) {
  const browser = await chromium.launch();
  try {
    for (const w of [320, 360, 375, 390]) {
      const heights = [];
      for (const h of [400, 440, 480, 520, 560, 600, 640, 680, 720]) {
        const { ctx, page } = await newPage(browser, { w, h, scheme: "light", mobile: true, engine: "chromium" });
        await page.locator(".drawer-tab").click({ force: true }).catch(() => {});
        await settle(page, 950);
        const r = await page.evaluate(() => {
          const c = document.querySelector(".controls-card");
          if (!c) return null;
          const tabs = [...document.querySelectorAll('[role="tab"]')].map((t) => t.textContent.trim());
          let worst = { over: -1e9 };
          return { present: true, tabs, scrollH: c.scrollHeight, clientH: c.clientHeight, over: c.scrollHeight - c.clientHeight, fits: c.scrollHeight <= c.clientHeight, cardH: +c.getBoundingClientRect().height.toFixed(2), vh: innerHeight };
        });
        heights.push({ h, ...(r || { present: false }) });
        await ctx.close();
      }
      out.C[`w${w}`] = heights;
    }
  } catch (e) { out.C.error = String(e).slice(0, 300); }
  await browser.close();
}

/* ── D · THE FLOOR — wrap and ink (chromium) ───────────────────────────── */
if (SECTIONS.includes("D")) {
  const browser = await chromium.launch();
  try {
    for (const cell of [{ w: 390, h: 844, mobile: true, sheet: true }, { w: 1280, h: 800, mobile: false, sheet: false }]) {
      const { ctx, page } = await newPage(browser, { ...cell, scheme: "light", engine: "chromium" });
      if (cell.sheet) { await page.locator(".drawer-tab").click({ force: true }); await settle(page, 950); }
      out.D[`${cell.w}x${cell.h}`] = await page.evaluate(() => {
        const bar = document.querySelector(".action-bar");
        const verbs = [...document.querySelectorAll(".action-verbs > *")];
        const card = document.querySelector(".controls-card");
        const cardBg = window.__ground(card);
        const rowsY = [...new Set(verbs.map((v) => Math.round(v.getBoundingClientRect().y)))];
        const inkOf = (el) => {
          const word = el.querySelector(".icon-sublabel,.peek-chip-word,span") || el;
          const g = window.__ground(word);
          return { word: (word.textContent || "").trim().slice(0, 12), ratio: window.__ratio(window.__over(window.__px(getComputedStyle(word).color), g), g), color: getComputedStyle(word).color, px: +parseFloat(getComputedStyle(word).fontSize).toFixed(2), ground: g, groundVsCard: window.__ratio(g, cardBg) };
        };
        return {
          barBox: bar ? { w: +bar.getBoundingClientRect().width.toFixed(2), h: +bar.getBoundingClientRect().height.toFixed(2) } : null,
          rowCount: rowsY.length,
          rowsY,
          acts: verbs.map((v) => ({ cls: v.className.toString().slice(0, 40), box: { w: +v.getBoundingClientRect().width.toFixed(2), h: +v.getBoundingClientRect().height.toFixed(2) }, ...inkOf(v) })),
        };
      });
      await ctx.close();
    }
  } catch (e) { out.D.error = String(e).slice(0, 300); }
  await browser.close();
}

/* ── E · THE SHEET-CHROME DERIVATION (chromium, 390×844, sheet SHUT) ────── */
if (SECTIONS.includes("E")) {
  const browser = await chromium.launch();
  try {
    for (const cell of [{ w: 390, h: 844 }, { w: 375, h: 812 }]) {
      const { ctx, page } = await newPage(browser, { ...cell, scheme: "light", mobile: true, engine: "chromium" });
      out.E[`${cell.w}x${cell.h}`] = await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        const names = ["--sheet-chrome", "--masthead-foot", "--action-bar-h", "--tap-floor", "--board-max", "--shell-pad"];
        const vars = Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n).trim() || null]));
        const box = (sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { y: +r.y.toFixed(2), h: +r.height.toFixed(2), w: +r.width.toFixed(2) }; };
        return { vars, board: box(".board-cells") || box(".hand-drawn-grid"), masthead: box(".masthead"), shell: box(".game-shell"), logo: box("svg.handwritten-logo") };
      });
      await ctx.close();
    }
  } catch (e) { out.E.error = String(e).slice(0, 300); }
  await browser.close();
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("OUT", OUT);
