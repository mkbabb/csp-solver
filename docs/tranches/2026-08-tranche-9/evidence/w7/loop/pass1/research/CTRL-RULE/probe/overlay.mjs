// T9-W7 pass1 · CTRL-RULE — THE OVERLAY RUN. Both arms, three cells, both engines.
// `node overlay.mjs` with a dev server on 127.0.0.1:4231. Read-only on the product.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://127.0.0.1:4231/";
const PROTO = readFileSync(join(HERE, "..", "proto", "ruled-page.js"), "utf8");

const CELLS = [
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
  { name: "dock-390x844", w: 390, h: 844, mobile: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true },
];
const ARMS = ["above", "beside"];

async function board(engine, cell, dark = false) {
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
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES
  }
  return { browser, page };
}

const apply = async (page, opts) => {
  await page.addScriptTag({ type: "module", content: PROTO });
  await page.waitForFunction(() => !!window.__rp, { timeout: 10000 });
  const r = await page.evaluate((o) => window.__rp(o), opts);
  await page.waitForTimeout(500);
  return r;
};

// ── THE READER. ROW 1/2/3 are the r0 instrument's own three laws, computed by the same
// shape of reader over the card's CURRENT group names (the overlay deletes the old ones).
const READ = () => {
  const px = (v) => +parseFloat(v).toFixed(2);
  const bx = (el) => {
    const b = el.getBoundingClientRect();
    return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
  };
  const card = document.querySelector(".controls-card");
  const wrap = document.querySelector(".control-panel-wrap");
  const voice = (el) => {
    const c = getComputedStyle(el);
    return [
      c.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px(c.fontSize),
      c.fontWeight,
      c.textTransform,
    ].join(" · ");
  };
  // every node that names a control group, old grammar OR new
  const nameNodes = [
    ...card.querySelectorAll(".rp-name, .section-heading, .tray-well > .washi-tag, .zone-row-label"),
  ];
  const names = nameNodes.map((el) => ({
    text: el.innerText.replace(/\s+/g, " ").trim(),
    voice: voice(el),
    box: bx(el),
    rank: el.closest("h1,h2,h3,h4,h5,h6")?.tagName ?? "—",
  }));
  const chip = card.querySelector(".ctrl-btn");
  const optionPx = chip ? px(getComputedStyle(chip).fontSize) : null;
  const namePx = names.length ? Math.max(...names.map((n) => +n.voice.split(" · ")[1])) : null;

  // does the field wrap under the margin column? (arm b's kill)
  const groups = [...card.querySelectorAll(".rp-group")].map((g) => {
    const name = g.querySelector(".rp-name");
    const field = g.querySelector(".rp-field");
    const row = g.querySelector(".ctrl-options");
    const chips = row ? [...row.querySelectorAll(".ctrl-btn")].map((c) => c.getBoundingClientRect()) : [];
    const lines = chips.length
      ? new Set(chips.map((c) => Math.round(c.top))).size
      : 0;
    return {
      key: g.dataset.group,
      box: bx(g),
      name: name ? bx(name) : null,
      field: field ? bx(field) : null,
      chipLines: lines,
      chipW: chips.map((c) => +c.width.toFixed(2)),
      minChip: chips.length ? +Math.min(...chips.map((c) => Math.min(c.width, c.height))).toFixed(2) : null,
      overflowX: row ? +(row.scrollWidth - row.clientWidth).toFixed(2) : null,
    };
  });

  const bar = card.querySelector(".action-bar");
  const bcs = getComputedStyle(bar);
  const bb = bar.getBoundingClientRect();
  const drawnEdge = !!bar.querySelector(":scope > svg.rp-bar-rule, :scope > svg.outline-svg");
  let worst = 0, who = null;
  for (const g of card.querySelectorAll(".rp-group, .tray-well")) {
    if (g.classList.contains("tray-well") && g.querySelector(".rp-group")) continue;
    const wb = g.getBoundingClientRect();
    if (wb.height < 10) continue;
    const ov =
      Math.max(0, Math.min(wb.bottom, bb.bottom) - Math.max(wb.top, bb.top)) *
      Math.max(0, Math.min(wb.right, bb.right) - Math.max(wb.left, bb.left));
    const f = ov / Math.max(1, wb.width * wb.height);
    if (f > worst) { worst = f; who = g.dataset.group || "well"; }
  }

  // live-filter census — the budget's own counting rule
  let filters = 0;
  const seen = [];
  document.querySelectorAll("*").forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.filter && cs.filter !== "none" && cs.display !== "none") {
      filters++;
      seen.push((el.tagName + "." + (el.getAttribute("class") || "")).slice(0, 60));
    }
  });

  return {
    card: {
      scrollH: +card.scrollHeight.toFixed(2),
      clientH: +card.clientHeight.toFixed(2),
      overflow: +(card.scrollHeight - card.clientHeight).toFixed(2),
      fracBelow: +(1 - card.clientHeight / card.scrollHeight).toFixed(4),
    },
    wrapW: +wrap.getBoundingClientRect().width.toFixed(2),
    names,
    voices: [...new Set(names.map((n) => n.voice))],
    docHeadings: names.filter((n) => n.rank !== "—").length,
    ratio: namePx && optionPx ? +(namePx / optionPx).toFixed(4) : null,
    namePx, optionPx,
    groups,
    bar: {
      box: bx(bar), position: bcs.position, drawnEdge,
      border: bcs.borderTopWidth, shadow: bcs.boxShadow,
      worstCoverage: +worst.toFixed(4), worstWho: who,
    },
    hiddenOptionRows: [...card.querySelectorAll(".ctrl-options")].filter(
      (r) => r.getBoundingClientRect().width === 0,
    ).length,
    filters, filterNodes: [...new Set(seen)],
  };
};

// ── I3 · the pinned-name row, re-run against the overlay (arm a's sticky push law).
const I3 = async (page) =>
  page.evaluate(async () => {
    const sc = [...document.querySelectorAll(".controls-card")].find(
      (e) => e.scrollHeight - e.clientHeight > 40,
    );
    if (!sc) return { skipped: "card does not overflow" };
    const states = [];
    const max = sc.scrollHeight - sc.clientHeight;
    for (const st of [0, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max]) {
      sc.scrollTop = st;
      await new Promise((r) => setTimeout(r, 260));
      const scb = sc.getBoundingClientRect();
      const rows = [];
      for (const n of document.querySelectorAll(".rp-name")) {
        const b = n.getBoundingClientRect();
        const g = n.closest(".rp-group");
        const gb = g.getBoundingClientRect();
        const vis =
          Math.max(0, Math.min(gb.bottom, scb.bottom) - Math.max(gb.top, scb.top)) /
          Math.max(1, gb.height);
        const nameVis =
          Math.max(0, Math.min(b.bottom, scb.bottom) - Math.max(b.top, scb.top)) /
          Math.max(1, b.height);
        rows.push({ t: n.textContent, groupVis: +vis.toFixed(3), nameVis: +nameVis.toFixed(3),
                    pinned: b.top <= scb.top + 30 && nameVis > 0.5 });
      }
      const pinned = rows.filter((r) => r.pinned);
      states.push({
        at: sc.scrollTop,
        pinned: pinned.map((p) => `${p.t} ${p.groupVis}`),
        violating: pinned.filter((p) => p.groupVis < 0.5).map((p) => `${p.t} ${p.groupVis}`),
        namesFullyVisible: rows.filter((r) => r.nameVis >= 0.999).length,
        namesTotal: rows.length,
      });
    }
    sc.scrollTop = 0;
    return { states, violations: states.reduce((a, s) => a + s.violating.length, 0) };
  });

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    for (const arm of ARMS) {
      const key = `${cell.name}-${engine}-${arm}`;
      const { browser, page } = await board(engine, cell);
      try {
        const applied = await apply(page, { arm, rule: { roughness: 0.4, segments: 8 }, drawOn: true });
        const r = await page.evaluate(READ);
        r.applied = applied;
        r.i3 = await I3(page);
        out[key] = r;
        console.log(
          `${key}: card ${r.card.scrollH}/${r.card.clientH} (${(r.card.fracBelow * 100).toFixed(1)}% below) · voices ${r.voices.length} ${JSON.stringify(r.voices)} · headings ${r.docHeadings}/${r.names.length} · ratio ${r.ratio} · bar ${r.bar.position} drawn ${r.bar.drawnEdge} cover ${(r.bar.worstCoverage * 100).toFixed(1)}% · filters ${r.filters} · hiddenRows ${r.hiddenOptionRows} · I3 viol ${r.i3.violations}`,
        );
        console.log(
          "   groups: " +
            r.groups.map((g) => `${g.key} h${g.box.h} lines${g.chipLines}${g.overflowX > 0.5 ? " OVERFLOW" + g.overflowX : ""}`).join(" | "),
        );
      } catch (e) {
        out[key] = { error: String(e) };
        console.log(key, "ERROR", String(e).slice(0, 200));
      }
      await browser.close();
    }
  }
}
writeFileSync(join(HERE, "..", "overlay.json"), JSON.stringify(out, null, 1));
console.log("banked overlay.json");
