// T9-W7 pass1 PROTOTYPE · CTRL-RULE — the census battery, run against the worktree's own
// dev server (4230) and against HEAD (4232) for the born-RED / pi rows.
//
//   node census.mjs <port> <tag>
//
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";

const PORT = process.argv[2] || "4230";
const TAG = process.argv[3] || "proto";
const BASE = `http://127.0.0.1:${PORT}/`;

const CELLS = [
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, sheet: false },
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true },
  { name: "landscape-900x500", w: 900, h: 500, mobile: true, sheet: true },
  { name: "rail-1440x900", w: 1440, h: 900, mobile: false, sheet: false },
];

async function board(engine, cell, dark) {
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
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 30000,
    })
    .catch(() => {});
  await page.waitForTimeout(1400);
  return { browser, page };
}

async function openSheet(page) {
  const closed = await page.evaluate(() =>
    document.documentElement.classList.contains("drawer-closed"),
  );
  if (closed) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES — settle before any box is read
  }
}

// ── the readings, all inside one page evaluate so every box is from one layout ────────────
function readAll() {
  const card =
    [...document.querySelectorAll(".controls-card")].find((e) => e.offsetParent !== null) ||
    document.querySelector(".controls-card");
  if (!card) return { error: "no card" };
  const wrap = document.querySelector(".control-panel-wrap");
  const doc = card.closest(".drawer-case") || card;

  // R1 · the group-name census. The set is the instrument's, closed and first-party.
  const nameNodes = [
    ...card.querySelectorAll(".section-heading"),
    ...card.querySelectorAll(".tray-well > .washi-tag"),
    ...card.querySelectorAll(".zone-row-label"),
  ];
  const names = nameNodes.map((el) => {
    const cs = getComputedStyle(el);
    const host = el.closest("h1,h2,h3,h4,h5,h6");
    return {
      text: (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim(),
      voice: [
        cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
        (+parseFloat(cs.fontSize)).toFixed(2),
        cs.fontWeight,
        cs.textTransform,
      ].join(" · "),
      rank: host ? host.tagName : "—",
      px: +parseFloat(cs.fontSize).toFixed(2),
      color: cs.color,
    };
  });
  const chip = card.querySelector(".ctrl-btn");
  const optionPx = chip ? +parseFloat(getComputedStyle(chip).fontSize).toFixed(2) : null;
  const namePx = names.length ? Math.max(...names.map((n) => n.px)) : null;

  // the a11y-visible heading count in the card (the clone trap's guard)
  const headings = [...card.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter((h) => {
    const cs = getComputedStyle(h);
    return (
      cs.display !== "none" &&
      cs.visibility !== "hidden" &&
      h.getAttribute("aria-hidden") !== "true" &&
      !h.closest("[aria-hidden=true]")
    );
  });

  // height budget
  const content = wrap ? Math.round(wrap.scrollHeight) : null;
  const scrollport = Math.round(card.clientHeight);
  const scrollable = Math.round(card.scrollHeight);

  // the filter census — live url(#…) filters anywhere in the document
  let filters = 0;
  for (const el of document.querySelectorAll("*")) {
    const f = getComputedStyle(el).filter;
    if (f && f !== "none" && f.includes("url(")) filters++;
  }

  // the bar
  const bar = document.querySelector(".action-bar");
  const barCS = bar ? getComputedStyle(bar) : null;
  const barBox = bar ? bar.getBoundingClientRect() : null;
  const cardBox = card.getBoundingClientRect();
  const ownChrome = bar
    ? parseFloat(barCS.borderTopWidth) > 0 ||
      barCS.outlineStyle !== "none" ||
      barCS.boxShadow !== "none" ||
      !!bar.querySelector(":scope > .outline-container, :scope > svg.outline-svg")
    : false;

  // hidden option rows (the tabs)
  let hiddenOptionRows = 0;
  for (const r of document.querySelectorAll(".ctrl-options, .options-row")) {
    const b = r.getBoundingClientRect();
    if (b.width === 0 && b.height === 0) hiddenOptionRows++;
  }

  // the wrap width
  const wrapW = wrap ? +wrap.getBoundingClientRect().width.toFixed(2) : null;

  return {
    names,
    voices: [...new Set(names.map((n) => n.voice))],
    docHeadings: names.filter((n) => n.rank !== "—").length,
    nameCount: names.length,
    headingCount: headings.length,
    headingTexts: headings.map((h) => h.innerText.replace(/\s+/g, " ").trim()),
    namePx,
    optionPx,
    ratio: namePx && optionPx ? +(namePx / optionPx).toFixed(4) : null,
    content,
    scrollport,
    scrollable,
    belowFold: scrollable > scrollport ? +((1 - scrollport / scrollable) * 100).toFixed(1) : 0,
    wrapW,
    filters,
    hiddenOptionRows,
    roleDialogInCard: card.querySelectorAll("[role=dialog]").length,
    bar: bar
      ? {
          position: barCS.position,
          ownChrome,
          inCard: card.contains(bar),
          top: +barBox.top.toFixed(2),
          cardBottom: +cardBox.bottom.toFixed(2),
          gap: +(barBox.top - cardBox.bottom).toFixed(2),
          h: +barBox.height.toFixed(2),
        }
      : null,
    caseBox: (() => {
      const b = doc.getBoundingClientRect();
      return [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)];
    })(),
  };
}

// ── I2 clipped + I3, over five scroll states ──────────────────────────────────────────────
async function scrollRows(page) {
  return page.evaluate(async () => {
    const card =
      [...document.querySelectorAll(".controls-card")].find((e) => e.offsetParent !== null) ||
      document.querySelector(".controls-card");
    const bar = document.querySelector(".action-bar");
    const groupSel = document.querySelector(".ruled-group") ? ".ruled-group" : ".tray-well";
    const headSel = document.querySelector(".group-head")
      ? ".group-head"
      : ".tray-well .washi-tag";
    const states = [0, 160, 327, 500, 99999];
    const i2 = [];
    const i2unclipped = [];
    const i3 = [];
    for (const st of states) {
      card.scrollTop = st;
      await new Promise((r) => setTimeout(r, 280));
      const at = Math.round(card.scrollTop);
      const sc = card.getBoundingClientRect();
      // the scrollport's CLIENT box (a group scrolled out of sight is not covered)
      const cl = {
        top: sc.top + card.clientTop,
        left: sc.left + card.clientLeft,
        right: sc.left + card.clientLeft + card.clientWidth,
        bottom: sc.top + card.clientTop + card.clientHeight,
      };
      if (bar) {
        const bb = bar.getBoundingClientRect();
        let worst = 0,
          who = null,
          worstU = 0;
        for (const g of card.querySelectorAll(groupSel)) {
          const gb = g.getBoundingClientRect();
          // unclipped (r0's reading)
          const ovU =
            Math.max(0, Math.min(gb.bottom, bb.bottom) - Math.max(gb.top, bb.top)) *
            Math.max(0, Math.min(gb.right, bb.right) - Math.max(gb.left, bb.left));
          const fU = ovU / Math.max(1, gb.width * gb.height);
          if (fU > worstU) worstU = fU;
          // CLIPPED to the scrollport's client box
          const c = {
            top: Math.max(gb.top, cl.top),
            bottom: Math.min(gb.bottom, cl.bottom),
            left: Math.max(gb.left, cl.left),
            right: Math.min(gb.right, cl.right),
          };
          const cw = Math.max(0, c.right - c.left),
            ch = Math.max(0, c.bottom - c.top);
          if (cw * ch < 1) continue;
          const ov =
            Math.max(0, Math.min(c.bottom, bb.bottom) - Math.max(c.top, bb.top)) *
            Math.max(0, Math.min(c.right, bb.right) - Math.max(c.left, bb.left));
          const f = ov / (cw * ch);
          if (f > worst) {
            worst = f;
            who = (g.querySelector("h2,.washi-tag")?.textContent || "?").trim();
          }
        }
        i2.push({ at, worst: +(worst * 100).toFixed(1), who });
        i2unclipped.push({ at, worst: +(worstU * 100).toFixed(1) });
      }
      // I3 — a pinned name names a group at least half on screen
      for (const head of card.querySelectorAll(headSel)) {
        const hb = head.getBoundingClientRect();
        if (hb.top > cl.top + 30) continue; // not pinned
        if (hb.bottom < cl.top) continue; // scrolled past
        const grp = head.closest(".ruled-group") || head.closest(".tray-well");
        if (!grp) continue;
        const gb = grp.getBoundingClientRect();
        const frac =
          Math.max(0, Math.min(gb.bottom, cl.bottom) - Math.max(gb.top, cl.top)) /
          Math.max(1, gb.height);
        if (frac < 0.5)
          i3.push({
            at,
            name: (head.querySelector("h2") || head).textContent.replace(/\s+/g, " ").trim(),
            frac: +frac.toFixed(3),
          });
      }
    }
    card.scrollTop = 0;
    return { i2, i2unclipped, i3, states: states.length };
  });
}

const out = { tag: TAG, port: PORT, cells: {} };

for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const key = `${cell.name}/${engine}`;
    try {
      const { browser, page } = await board(engine, cell, cell.sheet);
      if (cell.sheet) await openSheet(page);
      const base = await page.evaluate(readAll);
      const sr = await scrollRows(page);
      out.cells[key] = { ...base, ...sr };
      await browser.close();
    } catch (e) {
      out.cells[key] = { error: String(e).slice(0, 300) };
    }
  }
}

writeFileSync(
  `/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ctrl-rule/census-${TAG}.json`,
  JSON.stringify(out, null, 1),
);
for (const [k, v] of Object.entries(out.cells)) {
  if (v.error) {
    console.log(k, "ERROR", v.error);
    continue;
  }
  console.log(
    k,
    `voices=${v.voices.length} names=${v.nameCount} docH=${v.docHeadings} headings=${v.headingCount}`,
    `ratio=${v.ratio} (${v.namePx}/${v.optionPx})`,
    `content=${v.content}/${v.scrollport} below=${v.belowFold}%`,
    `filters=${v.filters} hiddenRows=${v.hiddenOptionRows} dialog=${v.roleDialogInCard}`,
    `bar=${v.bar ? v.bar.position + " inCard=" + v.bar.inCard + " gap=" + v.bar.gap + " own=" + v.bar.ownChrome : "—"}`,
    `I2clip=${v.i2 ? v.i2.map((x) => x.worst).join("/") : "—"}`,
    `I2unclip=${v.i2unclipped ? v.i2unclipped.map((x) => x.worst).join("/") : "—"}`,
    `I3viol=${v.i3 ? v.i3.length : "—"}`,
  );
}
