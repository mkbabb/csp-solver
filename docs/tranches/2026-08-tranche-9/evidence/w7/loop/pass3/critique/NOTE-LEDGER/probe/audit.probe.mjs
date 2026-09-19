/**
 * NOTE-LEDGER · pass-3 CRITIC's independent probe. Written from the gates, not from the
 * prototype's instruments. Proto :4231, HEAD control (74a2b5d9) :4232.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/critique/NOTE-LEDGER/probe";
mkdirSync(OUT, { recursive: true });
const PROTO = "http://127.0.0.1:4231/";
const CTRL = "http://127.0.0.1:4232/";
const r2 = (x) => Math.round(x * 1000) / 1000;

async function ready(page, url, q = "?size=3&difficulty=EASY") {
  await page.goto(url + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}
const lines = (p) =>
  p.evaluate(() => ({
    one: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
    two:
      document.querySelector(".board-margin .margin-note-previous")?.textContent?.trim() ??
      "",
  }));
const focusEmpty = (p, n = 0) =>
  p.evaluate((k) => {
    const all = [...document.querySelectorAll(".board-cells input")];
    const el = all.filter((i) => !i.value && !i.readOnly && !i.disabled)[k];
    el?.focus();
    return el ? all.indexOf(el) : -1;
  }, n);
async function hint(p) {
  await p.keyboard.press("h");
  await p.waitForTimeout(700);
  return (await lines(p)).one;
}
const digitOf = (s) =>
  (/^only (\S+) fits here$/.exec(s) ?? [])[1] ??
  (/^(\S+) goes nowhere else/.exec(s) ?? [])[1] ??
  (/^the answer is (\S+)$/.exec(s) ?? [])[1] ??
  null;

// ── contrast, computed from the RESOLVED paint (alpha composited onto the real backdrop) ──
const CONTRAST = () => {
  const el = document.querySelector(".board-margin .margin-note-previous");
  if (!el) return null;
  const parse = (s) => {
    const m = /(-?[\d.]+)[,\s]+(-?[\d.]+)[,\s]+(-?[\d.]+)(?:[,/\s]+([\d.]+))?/.exec(s);
    if (!m) return null;
    if (s.startsWith("color(srgb"))
      return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : +m[4]];
    return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  };
  // walk up for the first opaque painted background
  let bg = null;
  for (let n = el; n; n = n.parentElement) {
    const c = parse(getComputedStyle(n).backgroundColor);
    if (c && c[3] > 0.999) {
      bg = c;
      break;
    }
  }
  const fg = parse(getComputedStyle(el).color);
  const lin = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const over = (f, b) => [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3]));
  const one = document.querySelector(".board-margin .margin-note-ink");
  const fg1 = one ? parse(getComputedStyle(one).color) : null;
  const ratio = (f) => {
    const c = over(f, bg);
    const a = L(c),
      b2 = L(bg);
    return (Math.max(a, b2) + 0.05) / (Math.min(a, b2) + 0.05);
  };
  return {
    raw: getComputedStyle(el).color,
    bgRaw: bg,
    lineTwo: fg ? ratio(fg) : null,
    lineOne: fg1 ? ratio(fg1) : null,
    fontSize: getComputedStyle(el).fontSize,
    lineHeight: getComputedStyle(el).lineHeight,
    overflowX: getComputedStyle(el).overflowX,
    overflowY: getComputedStyle(el).overflowY,
    attrs: [...el.attributes].map((a) => a.name),
    role: el.getAttribute("role"),
    userSelect: getComputedStyle(el).userSelect || getComputedStyle(el).webkitUserSelect,
  };
};

// ── the clearance: painted ink bottom of line two vs first interactive box below it ──
const CLEAR = () => {
  const el = document.querySelector(".board-margin .margin-note-previous");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const fs = parseFloat(cs.fontSize);
  const lh = parseFloat(cs.lineHeight) || fs * 1.1;
  // reference line: box top + half-leading + ascent + descent, ascent/descent from metrics
  const cv = document.createElement("canvas").getContext("2d");
  cv.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
  const m = cv.measureText(el.textContent || "Mg");
  const ascent = m.fontBoundingBoxAscent ?? fs * 0.8;
  const desc = m.actualBoundingBoxDescent ?? fs * 0.2;
  const half = (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2;
  const inkBottom = r.top + half + ascent + desc;
  const INTERACTIVE =
    "a,button,input,select,textarea,[role=button],[tabindex]:not([tabindex='-1'])";
  let best = null;
  for (const n of document.querySelectorAll(INTERACTIVE)) {
    const b = n.getBoundingClientRect();
    const st = getComputedStyle(n);
    if (!b.width || !b.height || st.visibility === "hidden" || st.display === "none") continue;
    if (b.top < r.bottom - 0.01) continue; // must be BELOW line two
    if (b.right < r.left || b.left > r.right) continue; // must overlap horizontally
    if (!best || b.top < best.top)
      best = { top: b.top, sel: n.tagName.toLowerCase() + "." + (n.className || "").toString().split(" ")[0] };
  }
  const foldTools = document.querySelector("#fold-tools")?.getBoundingClientRect() ?? null;
  return {
    boxTop: r.top,
    boxBottom: r.bottom,
    lineHeight: lh,
    halfLeading: half,
    ascent,
    descent: desc,
    inkBottom,
    firstInteractive: best,
    clearanceToInteractive: best ? best.top - inkBottom : null,
    clearanceToFoldTools: foldTools ? foldTools.top - inkBottom : null,
  };
};

const FILTERS = () =>
  ({
    computed: [...document.querySelectorAll("*")].filter(
      (e) => getComputedStyle(e).filter !== "none",
    ).length,
    urlFilters: [...document.querySelectorAll("*")].filter((e) =>
      getComputedStyle(e).filter.includes("url("),
    ).length,
  });

const CHROME_KEYS = [
  ".board-margin",
  ".margin-note",
  "#fold-tools",
  ".game-board",
  ".app-layout",
  "#controls-drawer",
  ".masthead",
];
const GEOM = () =>
  Object.fromEntries(
    [
      ".board-margin",
      ".margin-note",
      "#fold-tools",
      ".game-board",
      ".app-layout",
      "#controls-drawer",
      ".masthead",
      '[role="grid"]',
    ].map((s) => {
      const e = document.querySelector(s);
      const b = e?.getBoundingClientRect();
      return [
        s,
        b ? { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) } : null,
      ];
    }),
  );

async function run(engine) {
  const browser = await pw[engine].launch();
  const out = { engine, control: "74a2b5d9 @ :4232", proto: ":4231" };

  const mk = async (url, opts = {}) => {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      hasTouch: true,
      ...opts,
    });
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    return { ctx, page };
  };

  // ── L1 · the canonical loop, lived, three rounds. WITH the line-one reading at rest.
  {
    const { ctx, page } = await mk(PROTO);
    await ready(page, PROTO);
    const rounds = [];
    for (let i = 0; i < 3; i++) {
      await focusEmpty(page, 0);
      const s = await hint(page);
      const before = await lines(page);
      const d = digitOf(s);
      if (d) {
        await page.keyboard.type(d);
        await page.waitForTimeout(800);
      }
      rounds.push({ round: i + 1, sentence: s, wrote: d, beforeWrite: before, afterWrite: await lines(page) });
    }
    out.L1 = { rounds, twoLineAtRest: rounds.map((r) => !!r.afterWrite.one && !!r.afterWrite.two) };
    await ctx.close();
  }

  // ── L11b · the true sentence stands (another digit in the house)
  {
    const { ctx, page } = await mk(PROTO);
    await ready(page, PROTO);
    let found = null;
    for (let k = 0; k < 14 && !found; k++) {
      await focusEmpty(page, k);
      const s = await hint(page);
      if (/goes nowhere else/.test(s)) found = { s, k };
    }
    let row = { found };
    if (found) {
      const d = digitOf(found.s);
      const other = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].find((x) => x !== d);
      // write ANOTHER digit somewhere else on the board
      await focusEmpty(page, found.k + 1);
      await page.keyboard.type(other);
      await page.waitForTimeout(800);
      row.wroteOther = other;
      row.after = await lines(page);
      row.stands = row.after.one === found.s;
    }
    out.L11b = row;
    await ctx.close();
  }

  // ── phones: contrast / clearance / a11y / attrs, light + dark, with a real record
  out.phone = {};
  for (const [w, h] of [
    [360, 740],
    [390, 844],
    [390, 664],
  ]) {
    for (const scheme of ["light", "dark"]) {
      const { ctx, page } = await mk(PROTO, { viewport: { width: w, height: h } });
      await page.emulateMedia({ colorScheme: scheme });
      await ready(page, PROTO);
      // two records: ask, fulfil, ask again -> line one live + line two aged
      await focusEmpty(page, 0);
      const s1 = await hint(page);
      const d1 = digitOf(s1);
      if (d1) {
        await page.keyboard.type(d1);
        await page.waitForTimeout(700);
      }
      await focusEmpty(page, 0);
      await hint(page);
      await page.waitForTimeout(500);
      out.phone[`${w}x${h}-${scheme}`] = {
        lines: await lines(page),
        contrast: await page.evaluate(CONTRAST),
        clearance: await page.evaluate(CLEAR),
        a11y: await page.evaluate(() => ({
          statusCount: document.querySelectorAll('[role="status"]').length,
          prevTag: document.querySelector(".margin-note-previous")?.tagName ?? null,
        })),
      };
      await ctx.close();
    }
  }

  // ── desk 1280 · the pair, the used width, the block height
  {
    const { ctx, page } = await mk(PROTO, { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, hasTouch: false });
    await ready(page, PROTO);
    await focusEmpty(page, 0);
    const s1 = await hint(page);
    const d1 = digitOf(s1);
    if (d1) {
      await page.keyboard.type(d1);
      await page.waitForTimeout(700);
    }
    await focusEmpty(page, 0);
    await hint(page);
    await page.waitForTimeout(600);
    out.desk = {
      lines: await lines(page),
      contrast: await page.evaluate(CONTRAST),
      geom: await page.evaluate(() => {
        const p = document.querySelector(".margin-note-previous");
        const blk = document.querySelector(".margin-note-block");
        const one = document.querySelector(".margin-note");
        if (!p) return null;
        const cs = getComputedStyle(p);
        const cv = document.createElement("canvas").getContext("2d");
        cv.font = `${cs.fontSize} ${cs.fontFamily}`;
        const ch = cv.measureText("0").width;
        const pr = p.getBoundingClientRect();
        // does line two overlap an interactive element?
        const hits = [...document.querySelectorAll("button,a,input")].filter((n) => {
          const b = n.getBoundingClientRect();
          return b.width && b.height && !(b.right <= pr.left || b.left >= pr.right || b.bottom <= pr.top || b.top >= pr.bottom);
        }).map((n) => n.tagName + "." + (n.className || "").toString().split(" ")[0]);
        return {
          usedWidth: pr.width,
          scrollWidth: p.scrollWidth,
          clipped: p.scrollWidth - p.clientWidth,
          ch,
          floor12ch: ch * 12,
          blockH: blk.getBoundingClientRect().height,
          lineOneRect: one.getBoundingClientRect().toJSON(),
          lineTwoRect: pr.toJSON(),
          sameRow: Math.abs(one.getBoundingClientRect().top - pr.top) < 12,
          overlapsInteractive: hits,
          minWidthCss: cs.minWidth,
          flexBasis: cs.flexBasis,
        };
      }),
      scrollHeight: await page.evaluate(() => document.documentElement.scrollHeight),
    };
    await ctx.close();
  }

  // ── landscape 844x390 · does line two exist at all?
  {
    const { ctx, page } = await mk(PROTO, { viewport: { width: 844, height: 390 } });
    await ready(page, PROTO);
    await focusEmpty(page, 0);
    const s1 = await hint(page);
    const d1 = digitOf(s1);
    if (d1) {
      await page.keyboard.type(d1);
      await page.waitForTimeout(700);
    }
    await focusEmpty(page, 0);
    await hint(page);
    await page.waitForTimeout(600);
    out.landscape844 = {
      lines: await lines(page),
      display: await page.evaluate(() => {
        const p = document.querySelector(".margin-note-previous");
        return p ? { display: getComputedStyle(p).display, rect: p.getBoundingClientRect().toJSON() } : null;
      }),
    };
    await ctx.close();
  }

  // ── π + filter census · proto vs control, same rigs, chrome keys only
  out.pi = {};
  for (const [w, h] of [
    [390, 844],
    [1280, 800],
  ]) {
    const read = async (url) => {
      const { ctx, page } = await mk(url, { viewport: { width: w, height: h }, deviceScaleFactor: w > 1000 ? 2 : 3, hasTouch: w < 1000 });
      await ready(page, url);
      const g = await page.evaluate(GEOM);
      const f = await page.evaluate(FILTERS);
      const sh = await page.evaluate(() => document.documentElement.scrollHeight);
      await ctx.close();
      return { geom: g, filters: f, scrollHeight: sh };
    };
    const a = await read(PROTO);
    const b = await read(CTRL);
    const deltas = {};
    for (const k of Object.keys(a.geom))
      deltas[k] = a.geom[k] && b.geom[k]
        ? Object.fromEntries(["x", "y", "w", "h"].map((d) => [d, r2(a.geom[k][d] - b.geom[k][d])]))
        : { proto: a.geom[k], ctrl: b.geom[k] };
    out.pi[`${w}x${h}`] = {
      deltas,
      filtersProto: a.filters,
      filtersCtrl: b.filters,
      scrollHeightProto: a.scrollHeight,
      scrollHeightCtrl: b.scrollHeight,
    };
  }

  await browser.close();
  return out;
}

const engine = process.argv[2];
const res = await run(engine);
writeFileSync(`${OUT}/audit-${engine}.json`, JSON.stringify(res, null, 2));
console.log("DONE", engine);
