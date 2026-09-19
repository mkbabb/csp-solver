// T9-W7 pass1 PROTOTYPE · CTRL-RULE — probe 2: the rule's wobble, the painted inks, the
// confirm's boxes, the seam, the tap count, the draw-on cost.
//   node probe2.mjs <port> <tag>
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const sharp = (
  await import(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs"
  )
).default;
import { writeFileSync } from "node:fs";

const PORT = process.argv[2] || "4230";
const TAG = process.argv[3] || "proto";
const BASE = `http://127.0.0.1:${PORT}/`;
const OUT = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ctrl-rule";

async function board(engine, { w = 390, h = 844, mobile = true, dark = true } = {}) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: mobile && engine === "chromium" ? true : undefined,
    hasTouch: mobile,
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
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 30000,
    })
    .catch(() => {});
  await page.waitForTimeout(1400);
  return { browser, page };
}
const openSheet = async (page) => {
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
};

// ── σ, from the rendered geometry in SCREEN px, for any <path> ────────────────────────────
const SIGMA = () => {
  window.__sigma = (el, n = 400) => {
    const g = el;
    const L = g.getTotalLength();
    if (!L) return null;
    const m = g.getScreenCTM();
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const p = g.getPointAtLength((L * i) / n);
      pts.push({ x: p.x * m.a + p.y * m.c + m.e, y: p.x * m.b + p.y * m.d + m.f });
    }
    const a = pts[0],
      b = pts[pts.length - 1];
    const dx = b.x - a.x,
      dy = b.y - a.y;
    const chord = Math.hypot(dx, dy);
    if (chord < 4) return null;
    const res = pts.map((p) => ((p.x - a.x) * dy - (p.y - a.y) * dx) / chord);
    const mean = res.reduce((s, v) => s + v, 0) / res.length;
    const sd = Math.sqrt(res.reduce((s, v) => s + (v - mean) ** 2, 0) / res.length);
    return {
      sigma: +sd.toFixed(4),
      max: +Math.max(...res.map((v) => Math.abs(v - mean))).toFixed(3),
      chord: +chord.toFixed(2),
    };
  };
};

function srgb(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}
const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
};

const out = { tag: TAG, port: PORT };

// ══ 1 · THE RULE'S WOBBLE, against the board's own, on the SAME page ══════════════════════
out.wobble = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true, dark: false });
  await openSheet(page);
  await page.evaluate(SIGMA);
  out.wobble[engine] = await page.evaluate(() => {
    const rules = [...document.querySelectorAll(".ruled-line path")].map((p) =>
      window.__sigma(p),
    );
    // the board's own rule on this very page — the grid's drawn lines
    const grid = [
      ...document.querySelectorAll(
        ".grid-line-layer path, .boil-frame-layer path, svg.grid-svg path, .sudoku-grid path",
      ),
    ]
      .map((p) => window.__sigma(p))
      .filter((r) => r && r.chord > 80);
    const hairline = [...document.querySelectorAll(".staged-section + .staged-section")].map(
      (e) => parseFloat(getComputedStyle(e).borderTopWidth),
    );
    return {
      rules: rules.filter(Boolean),
      ruleCount: rules.filter(Boolean).length,
      grid: grid.slice(0, 8),
      hairlineBorders: hairline,
      ruleStroke: document.querySelector(".ruled-line path")
        ? getComputedStyle(document.querySelector(".ruled-line path")).strokeWidth
        : null,
    };
  });
  await browser.close();
}

// ══ 2 · THE PAINTED INKS — the rule on --color-card, both themes, both engines ════════════
out.painted = {};
for (const engine of ["chromium", "webkit"]) {
  for (const dark of [false, true]) {
    const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true, dark });
    await openSheet(page);
    await page.waitForTimeout(600); // the draw-on has run
    const box = await page.evaluate(() => {
      const svg = document.querySelector(".ruled-group .ruled-line");
      if (!svg) return null;
      const b = svg.getBoundingClientRect();
      const card = svg.closest(".controls-card");
      const cb = getComputedStyle(card).backgroundColor;
      return {
        x: Math.round(b.x + 12),
        y: Math.round(b.y - 3),
        w: Math.max(40, Math.round(b.width - 24)),
        h: Math.round(b.height + 6),
        cardBg: cb,
        strokeColor: getComputedStyle(svg.querySelector("path")).stroke,
      };
    });
    if (!box) {
      out.painted[`${engine}/${dark ? "dark" : "light"}`] = { error: "no rule" };
      await browser.close();
      continue;
    }
    const buf = await page.screenshot({
      clip: { x: box.x, y: box.y, width: box.w, height: box.h },
    });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    const px = (x, y) => {
      const i = (y * info.width + x) * ch;
      return [data[i], data[i + 1], data[i + 2]];
    };
    // the paper is the top row (above the rule); the ink is the per-column extreme
    const bgL = lum(...px(0, 0));
    const perCol = [];
    for (let x = 0; x < info.width; x++) {
      let best = null,
        bestD = -1;
      for (let y = 0; y < info.height; y++) {
        const L = lum(...px(x, y));
        const d = Math.abs(L - bgL);
        if (d > bestD) {
          bestD = d;
          best = L;
        }
      }
      if (bestD > 0.0005) perCol.push(ratio(best, bgL));
    }
    perCol.sort((a, b) => a - b);
    out.painted[`${engine}/${dark ? "dark" : "light"}`] = {
      cardBg: box.cardBg,
      stroke: box.strokeColor,
      samples: perCol.length,
      worst: +perCol[0]?.toFixed(3),
      median: +perCol[Math.floor(perCol.length / 2)]?.toFixed(3),
      p90: +perCol[Math.floor(perCol.length * 0.9)]?.toFixed(3),
      best: +perCol[perCol.length - 1]?.toFixed(3),
    };
    await browser.close();
  }
}

// ══ 3 · THE RING, painted, on --color-card ═══════════════════════════════════════════════
out.ring = {};
for (const engine of ["chromium", "webkit"]) {
  for (const dark of [false, true]) {
    const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true, dark });
    await openSheet(page);
    // focus a chip in the card and read the painted ring
    const box = await page.evaluate(() => {
      const btn = document.querySelector(".controls-card .ctrl-btn");
      if (!btn) return null;
      btn.focus();
      const b = btn.getBoundingClientRect();
      const cs = getComputedStyle(btn);
      return {
        b: [b.x, b.y, b.width, b.height],
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor} @${cs.outlineOffset}`,
        ringInk: getComputedStyle(document.documentElement).getPropertyValue("--ring-ink"),
      };
    });
    if (!box) {
      out.ring[`${engine}/${dark ? "dark" : "light"}`] = { error: "no chip" };
      await browser.close();
      continue;
    }
    await page.waitForTimeout(150);
    const [bx, by, bw, bh] = box.b;
    const pad = 12;
    const buf = await page.screenshot({
      clip: {
        x: Math.max(0, Math.round(bx - pad)),
        y: Math.max(0, Math.round(by - pad)),
        width: Math.round(bw + pad * 2),
        height: Math.round(bh + pad * 2),
      },
    });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    const px = (x, y) => {
      const i = (y * info.width + x) * ch;
      return [data[i], data[i + 1], data[i + 2]];
    };
    const bgL = lum(...px(0, 0));
    // the ring band above the box: rows 0..pad, the extreme per column
    const cols = [];
    for (let x = 4; x < info.width - 4; x++) {
      let best = null,
        bestD = -1;
      for (let y = 0; y < pad; y++) {
        const L = lum(...px(x, y));
        const d = Math.abs(L - bgL);
        if (d > bestD) {
          bestD = d;
          best = L;
        }
      }
      if (bestD > 0.002) cols.push(ratio(best, bgL));
    }
    cols.sort((a, b) => a - b);
    out.ring[`${engine}/${dark ? "dark" : "light"}`] = {
      outline: box.outline,
      ringInk: box.ringInk.trim(),
      samples: cols.length,
      worst: cols.length ? +cols[0].toFixed(3) : null,
      median: cols.length ? +cols[Math.floor(cols.length / 2)].toFixed(3) : null,
      best: cols.length ? +cols[cols.length - 1].toFixed(3) : null,
    };
    await browser.close();
  }
}

// ══ 4 · THE CONFIRM — Δ on four sides, both verbs' boxes, per dimension ══════════════════
out.confirm = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true, dark: true });
  // dirty the board first: the arm is `isCoarse && isDirty`
  await page.evaluate(() => {
    const i = [...document.querySelectorAll(".sudoku-cell input")].filter(
      (x) => !x.readOnly && !x.disabled && !x.value,
    )[0];
    i?.focus();
  });
  await page.keyboard.type("5");
  await page.waitForTimeout(600);
  await openSheet(page);
  out.confirm[engine] = await page.evaluate(async () => {
    const bar = document.querySelector(".action-bar");
    const wrap = document.querySelector(".control-panel-wrap");
    const clear = document.querySelectorAll(".action-bar .action-verbs > button")[0];
    if (!bar || !clear) return { error: "no verb" };
    const d = (a, b) => ({
      top: +(b.top - a.top).toFixed(2),
      right: +(b.right - a.right).toFixed(2),
      bottom: +(b.bottom - a.bottom).toFixed(2),
      left: +(b.left - a.left).toFixed(2),
    });
    const v0 = clear.getBoundingClientRect();
    const b0 = bar.getBoundingClientRect();
    const w0 = wrap.getBoundingClientRect();
    const before = [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => i.value)
      .join("");
    clear.click();
    await new Promise((r) => setTimeout(r, 400));
    const rib = document.querySelector(".confirm-ribbon, [role=alertdialog]");
    const after = [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join("");
    const verbs = rib ? [...rib.querySelectorAll("button")] : [];
    const faces = rib ? [...rib.querySelectorAll(".confirm-face")] : [];
    const vb = clear.getBoundingClientRect();
    const bb = bar.getBoundingClientRect();
    const wb = wrap.getBoundingClientRect();
    const rb = rib ? rib.getBoundingClientRect() : null;
    const vw = window.innerWidth,
      vh = window.innerHeight;
    return {
      armed: !!rib,
      role: rib?.getAttribute("role"),
      ariaModal: rib?.getAttribute("aria-modal"),
      wroteOnFirstTap: [...before].filter((c, i) => c !== after[i]).length,
      line: rib?.querySelector(".confirm-line")?.textContent?.trim(),
      verbs: verbs.map((b, i) => {
        const r2 = (faces[i] || b).getBoundingClientRect();
        return {
          word: b.textContent.trim(),
          w: +r2.width.toFixed(2),
          h: +r2.height.toFixed(2),
          floorOK: r2.width >= 44 && r2.height >= 44,
          inViewport: r2.left >= 0 && r2.right <= vw && r2.top >= 0 && r2.bottom <= vh,
        };
      }),
      focusOnKeep: document.activeElement === verbs[0],
      ribbonBox: rb ? [+rb.x.toFixed(2), +rb.y.toFixed(2), +rb.width.toFixed(2), +rb.height.toFixed(2)] : null,
      deltaVerb: d(v0, vb),
      deltaBar: d(b0, bb),
      deltaWrap: d(w0, wb),
      transitionMs: rib ? getComputedStyle(rib).transitionDuration : null,
      roleDialogInCard: document.querySelector(".controls-card")?.querySelectorAll("[role=dialog]")
        .length,
    };
  });
  await browser.close();
}

// ══ 5 · THE 390 SEAM — the case's painted top band against the wordmark's box ════════════
out.seam = {};
for (const engine of ["chromium", "webkit"]) {
  for (const w of [375, 390, 430]) {
    const { browser, page } = await board(engine, { w, h: w === 375 ? 812 : w === 390 ? 844 : 932 });
    await openSheet(page);
    out.seam[`${w}/${engine}`] = await page.evaluate(() => {
      const logo = document.querySelector("svg.handwritten-logo");
      const cs2 = document.querySelector(".scene-controls .outline-svg, .drawer-case .outline-svg");
      if (!logo || !cs2) return { error: "missing" };
      const lb = logo.getBoundingClientRect();
      const cb = cs2.getBoundingClientRect();
      return { clearance: +(cb.top - lb.bottom).toFixed(2), logoBottom: +lb.bottom.toFixed(2), caseTop: +cb.top.toFixed(2) };
    });
    await browser.close();
  }
}

// ══ 6 · `level` IN TAPS FROM THE PLAYING VIEW ════════════════════════════════════════════
out.taps = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true, dark: true });
  let taps = 0;
  const closed = await page.evaluate(() =>
    document.documentElement.classList.contains("drawer-closed"),
  );
  if (closed) {
    await page.locator(".drawer-tab").click({ force: true });
    taps++;
    await page.waitForTimeout(950);
  }
  const r = await page.evaluate(() => {
    // every group's chips laid down? find the `level` group and a Hard chip
    const heads = [...document.querySelectorAll(".controls-card h2")].map((h) =>
      h.textContent.trim(),
    );
    const lvl = [...document.querySelectorAll(".controls-card .ruled-group")].find((g) =>
      /level|difficulty/i.test(g.querySelector("h2")?.textContent || ""),
    );
    const chips = lvl ? [...lvl.querySelectorAll(".ctrl-btn")] : [];
    const vis = chips.filter((c) => c.getBoundingClientRect().width > 0);
    return {
      heads,
      chips: chips.map((c) => c.textContent.trim()),
      visible: vis.length,
      tabRowPresent: !!document.querySelector(".mobile-heading-row"),
    };
  });
  out.taps[engine] = { openTaps: taps, ...r, total: taps + (r.visible ? 1 : 99) };
  await browser.close();
}

// ══ 7 · THE DRAW-ON COST ═════════════════════════════════════════════════════════════════
out.drawOn = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true, dark: true });
  const cost = await page.evaluate(async () => {
    const t0 = performance.now();
    document.documentElement.classList.remove("drawer-closed");
    const tab = document.querySelector(".drawer-tab");
    tab?.click();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const t1 = performance.now();
    const rules = document.querySelectorAll(".ruled-line path").length;
    const cs = rules ? getComputedStyle(document.querySelector(".ruled-line path")) : null;
    return {
      ms: +(t1 - t0).toFixed(1),
      rules,
      drawDur: cs
        ? getComputedStyle(document.querySelector(".ruled-line path")).getPropertyValue(
            "--draw-dur",
          )
        : null,
      animDur: cs ? cs.animationDuration : null,
    };
  });
  out.drawOn[engine] = cost;
  await browser.close();
}

writeFileSync(`${OUT}/probe2-${TAG}.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
