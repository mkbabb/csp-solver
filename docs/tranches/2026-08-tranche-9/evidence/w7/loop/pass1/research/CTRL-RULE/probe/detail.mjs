// T9-W7 pass1 · CTRL-RULE — THE DETAIL RUN: the rule's wobble and contrast, the chips'
// squeeze under arm (b), the bar out of the scrollport (I2), both confirm faces (I4 / Δ=0),
// the tap floor, the level tap count, the draw-on cost, the 390 masthead seam.
// `node detail.mjs` with a dev server on 127.0.0.1:4231. Read-only on the product.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://127.0.0.1:4231/";
const PROTO = readFileSync(join(HERE, "..", "proto", "ruled-page.js"), "utf8");
const out = {};

async function board(engine, cell, dark = false, open = true) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    isMobile: cell.mobile && engine === "chromium" ? true : undefined,
    hasTouch: cell.mobile,
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
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  if (open && (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed")))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  return { browser, page };
}
const apply = async (page, opts) => {
  await page.addScriptTag({ type: "module", content: PROTO });
  await page.waitForFunction(() => !!window.__rp, { timeout: 10000 });
  const r = await page.evaluate((o) => window.__rp(o), opts);
  await page.waitForTimeout(450);
  return r;
};

// ── σ · the RMS perpendicular residual off the chord, R3's method, in CSS px ──
const SIGMA = (sel) =>
  ((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const p = el.tagName === "path" ? el : el.querySelector("path");
    if (!p) return null;
    const L = p.getTotalLength();
    const N = 33;
    const pts = [];
    for (let i = 0; i < N; i++) pts.push(p.getPointAtLength((L * i) / (N - 1)));
    const a = pts[0], b = pts[N - 1];
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
    let ss = 0, mx = 0;
    for (const q of pts) {
      const d = Math.abs((q.x - a.x) * dy - (q.y - a.y) * dx) / (len || 1);
      ss += d * d;
      mx = Math.max(mx, d);
    }
    // CSS px: the svg's own scale (viewBox -> box)
    const svg = p.ownerSVGElement;
    const vb = svg.viewBox.baseVal;
    const bb = svg.getBoundingClientRect();
    const sy = vb.height ? bb.height / vb.height : 1;
    return {
      sigmaUser: +Math.sqrt(ss / N).toFixed(4),
      maxUser: +mx.toFixed(4),
      sigmaPx: +(Math.sqrt(ss / N) * sy).toFixed(4),
      maxPx: +(mx * sy).toFixed(4),
      chordPx: +(len * (vb.width ? bb.width / vb.width : 1)).toFixed(2),
      scaleY: +sy.toFixed(3),
    };
  })(sel);

// ── contrast, from the engine's PAINTED bytes (canvas read-back of a screenshot) ──
function lum(r, g, b) {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) {
  const [l1, l2] = [lum(...a), lum(...b)].sort((x, y) => y - x);
  return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
}

/* ═════════ 1 · THE RULE — σ, contrast, draw-on cost, the filter census ═════════ */
for (const engine of ["chromium", "webkit"]) {
  for (const theme of ["light", "dark"]) {
    const { browser, page } = await board(engine, { w: 1280, h: 800, mobile: false }, theme === "dark");
    const t0 = Date.now();
    await apply(page, { arm: "above", rule: { roughness: 0.4, segments: 8 }, drawOn: true });
    const mountMs = Date.now() - t0;
    const r = await page.evaluate(
      ([sigmaSrc]) => {
        const SIG = eval("(" + sigmaSrc + ")");
        const rules = [...document.querySelectorAll(".rp-rule")];
        const board = document.querySelector("path.cell-line") || document.querySelector("path.frame-line");
        const cs = getComputedStyle(document.querySelector(".rp-rule path"));
        return {
          ruleCount: rules.length,
          rule0: SIG(".rp-rule"),
          barRule: SIG(".rp-bar-rule"),
          boardCell: SIG("path.cell-line"),
          boardFrame: SIG("path.frame-line"),
          stroke: cs.stroke,
          strokeWidth: cs.strokeWidth,
          filterOnRule: cs.filter,
          hasBoardPath: !!board,
        };
      },
      [SIGMA.toString()],
    );
    // painted-byte contrast: the rule's own pixels against the two grounds
    const shot = await page.locator(".controls-card").screenshot({ type: "png" });
    const px = await page.evaluate(
      async ([b64]) => {
        const img = new Image();
        img.src = "data:image/png;base64," + b64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width; c.height = img.height;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(img, 0, 0);
        const card = document.querySelector(".controls-card").getBoundingClientRect();
        const rule = document.querySelector(".rp-rule").getBoundingClientRect();
        const sx = img.width / card.width;
        const y0 = Math.round((rule.top - card.top) * sx);
        const rows = [];
        for (let y = Math.max(0, y0 - 2); y < Math.min(img.height, y0 + 8); y++) {
          const d = g.getImageData(Math.round(rule.width * 0.5 * sx), y, 1, 1).data;
          rows.push([d[0], d[1], d[2]]);
        }
        // the ground: 6 px above the rule's band, same column
        const gr = g.getImageData(Math.round(rule.width * 0.5 * sx), Math.max(0, y0 - 10), 1, 1).data;
        return { rows, ground: [gr[0], gr[1], gr[2]], scale: sx };
      },
      [shot.toString("base64")],
    );
    const darkest = px.rows.reduce((a, b) => (lum(...b) < lum(...a) ? b : a), px.rows[0]);
    r.painted = { darkestRulePx: darkest, ground: px.ground, ratio: ratio(darkest, px.ground) };
    r.mountMs = mountMs;
    out[`rule-${engine}-${theme}`] = r;
    console.log(
      `rule ${engine} ${theme}: n=${r.ruleCount} σ ${r.rule0?.sigmaPx}px (max ${r.rule0?.maxPx}, chord ${r.rule0?.chordPx}) · board cell σ ${r.boardCell?.sigmaPx} frame σ ${r.boardFrame?.sigmaPx} · filter ${r.filterOnRule} · painted ratio ${r.painted.ratio}:1 (rule ${darkest} on ground ${px.ground}) · mount ${mountMs}ms`,
    );
    await browser.close();
  }
}

/* ═════════ 2 · ARM (b) AT 390 — does the field squeeze the chips? ═════════ */
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true });
  await apply(page, { arm: "beside" });
  const r = await page.evaluate(() => {
    const rows = [];
    for (const g of document.querySelectorAll(".rp-group")) {
      const row = g.querySelector(".ctrl-options");
      if (!row) continue;
      for (const c of row.querySelectorAll(".ctrl-btn")) {
        const b = c.getBoundingClientRect();
        const cs = getComputedStyle(c);
        // the word's own ink width, measured with a Range
        const rg = document.createRange();
        rg.selectNodeContents(c);
        const tb = rg.getBoundingClientRect();
        rows.push({
          group: g.dataset.group,
          t: c.textContent.trim(),
          box: [+b.width.toFixed(2), +b.height.toFixed(2)],
          padX: parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight),
          textW: +tb.width.toFixed(2),
          contentW: +(b.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)).toFixed(2),
          squeeze: +(tb.width - (b.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight))).toFixed(2),
          scrollOver: +(c.scrollWidth - c.clientWidth).toFixed(2),
        });
      }
    }
    const field = document.querySelector('.rp-group[data-group="marks"] .rp-field');
    const name = document.querySelector('.rp-group[data-group="marks"] .rp-name');
    return { rows, fieldW: field ? +field.getBoundingClientRect().width.toFixed(2) : null,
             nameW: name ? +name.getBoundingClientRect().width.toFixed(2) : null };
  });
  out[`armb-390-${engine}`] = r;
  const bad = r.rows.filter((x) => x.squeeze > 0.5);
  console.log(
    `arm(b) 390 ${engine}: name ${r.nameW} field ${r.fieldW} · chips squeezed past their padding: ${bad.length} ` +
      bad.map((b) => `${b.t} ${b.squeeze}px`).join(" · "),
  );
  await browser.close();
}

/* ═════════ 3 · THE BAR OUT OF THE SCROLLPORT — I2's coverage ═════════ */
for (const engine of ["chromium", "webkit"]) {
  for (const cell of [
    { name: "dock-390x844", w: 390, h: 844, mobile: true },
    { name: "land-900x500", w: 900, h: 500, mobile: true },
    { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
  ]) {
    const { browser, page } = await board(engine, cell);
    await apply(page, { arm: "beside", barOut: true });
    const r = await page.evaluate(async () => {
      const card = document.querySelector(".controls-card");
      const bar = document.querySelector(".action-bar");
      const cs = getComputedStyle(bar);
      const own =
        parseFloat(cs.borderTopWidth) > 0 ||
        cs.outlineStyle !== "none" ||
        cs.boxShadow !== "none" ||
        !!bar.querySelector(":scope > .outline-container, :scope > svg.outline-svg");
      const states = [];
      const max = card.scrollHeight - card.clientHeight;
      for (const st of [0, Math.round(max / 2), max]) {
        card.scrollTop = st;
        await new Promise((r2) => setTimeout(r2, 200));
        const bb = bar.getBoundingClientRect();
        let worst = 0, who = null;
        for (const g of document.querySelectorAll(".rp-group")) {
          const gb = g.getBoundingClientRect();
          const ov =
            Math.max(0, Math.min(gb.bottom, bb.bottom) - Math.max(gb.top, bb.top)) *
            Math.max(0, Math.min(gb.right, bb.right) - Math.max(gb.left, bb.left));
          const f = ov / Math.max(1, gb.width * gb.height);
          if (f > worst) { worst = f; who = g.dataset.group; }
        }
        states.push({ at: card.scrollTop, worst: +worst.toFixed(4), who });
      }
      card.scrollTop = 0;
      return {
        own, border: cs.borderTopWidth, shadow: cs.boxShadow, position: cs.position,
        states,
        cardH: +card.getBoundingClientRect().height.toFixed(2),
        barBox: (() => { const b = bar.getBoundingClientRect(); return [+b.x.toFixed(1), +b.y.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)]; })(),
      };
    });
    out[`barout-${cell.name}-${engine}`] = r;
    console.log(
      `barOut ${cell.name} ${engine}: own=${r.own} · worst coverage ${r.states.map((s) => `${s.at}:${(s.worst * 100).toFixed(1)}%`).join(" ")} · bar ${JSON.stringify(r.barBox)}`,
    );
    await browser.close();
  }
}

/* ═════════ 4 · THE CONFIRM — both faces, Δ on four sides ═════════ */
for (const engine of ["chromium", "webkit"]) {
  for (const face of ["inplace", "ribbon"]) {
    const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true });
    await apply(page, { arm: "beside", barOut: true });
    const r = await page.evaluate((f) => window.__rpConfirm(f, 0), face);
    const reach = await page.evaluate(() => {
      const rib = document.querySelector(".rp-ribbon");
      const bar = document.querySelector(".action-bar");
      if (!rib) {
        const no = document.querySelector(".rp-no");
        const b = no?.getBoundingClientRect();
        return { kind: "inplace", noBox: b ? [+b.width.toFixed(1), +b.height.toFixed(1)] : null,
                 barH: +bar.getBoundingClientRect().height.toFixed(2) };
      }
      const rb = rib.getBoundingClientRect();
      const bb = bar.getBoundingClientRect();
      const btns = [...rib.querySelectorAll("button")].map((b) => {
        const x = b.getBoundingClientRect();
        return { t: b.textContent, w: +x.width.toFixed(1), h: +x.height.toFixed(1),
                 inViewport: x.top >= 0 && x.bottom <= innerHeight };
      });
      return { kind: "ribbon", ribbonBox: [+rb.x.toFixed(1), +rb.y.toFixed(1), +rb.width.toFixed(1), +rb.height.toFixed(1)],
               belowBar: +(rb.top - bb.bottom).toFixed(2), btns, barH: +bb.height.toFixed(2) };
    });
    out[`confirm-${face}-${engine}`] = { deltas: r, reach };
    console.log(`confirm ${face} ${engine}: Δverb ${JSON.stringify(r.verb)} Δbar ${JSON.stringify(r.bar)} Δwrap ${JSON.stringify(r.wrap)} · ${JSON.stringify(reach)}`);
    await browser.close();
  }
}

/* ═════════ 5 · TAP FLOOR + THE LEVEL TAP COUNT + THE 390 MASTHEAD SEAM ═════════ */
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true });
  const seamBefore = await page.evaluate(() => {
    const c = document.querySelector(".drawer-case svg.outline-svg");
    const w = document.querySelector("svg.handwritten-logo");
    if (!c || !w) return null;
    const cb = c.getBoundingClientRect(), wb = w.getBoundingClientRect();
    return { caseTop: +cb.top.toFixed(2), wordmarkBottom: +wb.bottom.toFixed(2), gap: +(cb.top - wb.bottom).toFixed(2) };
  });
  await apply(page, { arm: "beside", barOut: true });
  const r = await page.evaluate(() => {
    const floor = [];
    for (const b of document.querySelectorAll(
      ".rp-group button, .action-bar button, .drawer-tab, .play-controls button",
    )) {
      const x = b.getBoundingClientRect();
      if (x.width === 0) continue;
      floor.push({ t: (b.textContent || b.getAttribute("aria-label") || "?").trim().slice(0, 18),
                   w: +x.width.toFixed(2), h: +x.height.toFixed(2) });
    }
    // level: taps from the open sheet = 1 (the options are never hidden)
    const lvl = document.querySelector('.rp-group[data-group="level"] .ctrl-btn');
    const lb = lvl?.getBoundingClientRect();
    return {
      floor,
      under44: floor.filter((f) => f.w < 44 || f.h < 44),
      levelReachable: !!lb && lb.width > 0,
      tongue: (() => { const t = document.querySelector(".drawer-tab"); const b = t?.getBoundingClientRect();
                       return b ? [+b.width.toFixed(1), +b.height.toFixed(1)] : null; })(),
    };
  });
  out[`floor-390-${engine}`] = { seamBefore, ...r };
  console.log(
    `floor 390 ${engine}: ${r.floor.length} targets, ${r.under44.length} under 44 in a dimension ${JSON.stringify(r.under44.slice(0, 8))} · level open=${r.levelReachable} · tongue ${JSON.stringify(r.tongue)} · seam ${JSON.stringify(seamBefore)}`,
  );
  await browser.close();
}

writeFileSync(join(HERE, "..", "detail.json"), JSON.stringify(out, null, 1));
console.log("banked detail.json");
