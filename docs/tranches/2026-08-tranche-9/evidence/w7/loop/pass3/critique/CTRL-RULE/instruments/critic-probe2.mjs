// T9-W7 pass 3 · CTRL-RULE — THE CRITIC'S SECOND READ.
//
//  A · THE PIN ACTUALLY HOLDS? Only states where the group's own top has scrolled ABOVE the
//      scrollport's padding edge are asked. The name's offset is then reported RAW. The lane's
//      own `held` predicate is |offset − inset| ≤ 0.75 and its "worst Δ 0.000" is taken over
//      that population, so it cannot fail; this one can.
//  B · WHAT `align-self: start` COSTS. `RuledGroup`'s prose argues `align-items: first
//      baseline` is one of four things separating the page from a settings form. The item's own
//      `align-self: start` outranks it. Measured as a displacement: the name's top with
//      `start`, then with `baseline`.
//  C · THE INK, as arithmetic — every token this family ships, composited against the surface
//      it is drawn on, both themes. (`color-mix` resolves in the computed value, so this is the
//      token's own number at FULL pixel coverage — the quantity the lane says the incumbent's
//      3.53 really was.)
//  D · THE RULE, as paint — a screenshot of one rule's band, decoded, worst painted column.
//
// node critic-probe2.mjs <chromium|webkit> <light|dark> <BASE>
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });

const ENGINE = process.argv[2] || "chromium";
const SCHEME = process.argv[3] || "light";
const BASE = process.argv[4] || "http://127.0.0.1:4233/";

const lin = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const [x, y] = [L(a), L(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  colorScheme: SCHEME,
});
await ctx.addInitScript((s) => {
  try {
    localStorage.clear();
    localStorage.setItem("sudoku-color-scheme", s);
  } catch {}
}, SCHEME);
const page = await ctx.newPage();
await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
await page.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
await page.waitForTimeout(1400);
if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
  await page.locator(".drawer-tab").first().click({ force: true });
  await page.waitForTimeout(950);
}
await page.waitForTimeout(400);

// ── A · THE PIN, ASKED ONLY WHERE IT MUST HOLD ─────────────────────────────────────────────
const HOLD = ({ top }) => {
  const card = document.querySelector(".controls-card");
  if (!card) return { missing: true };
  card.scrollTop = top;
  void card.offsetHeight;
  const port = card.getBoundingClientRect();
  const padT = parseFloat(getComputedStyle(card).paddingTop) || 0;
  const line = port.top + padT; // the scrollport's PADDING edge — where `top: 0` holds
  const rows = [];
  for (const g of card.querySelectorAll("[data-ruled-group]")) {
    const n = g.querySelector(".rp-name");
    if (!n) continue;
    const gb = g.getBoundingClientRect();
    const nb = n.getBoundingClientRect();
    // this group is ASTRIDE the pin line: its top is above it and its bottom below it, so a
    // working sticky MUST be holding the name exactly at the line.
    if (gb.top < line - 1 && gb.bottom > line + nb.height + 1)
      rows.push({
        name: n.textContent.trim(),
        scrollTop: card.scrollTop,
        nameTopMinusLine: +(nb.top - line).toFixed(3),
        groupTopMinusLine: +(gb.top - line).toFixed(2),
      });
  }
  return { padT: +padT.toFixed(2), rows };
};
const max = await page.evaluate(() => {
  const c = document.querySelector(".controls-card");
  return c ? c.scrollHeight - c.clientHeight : 0;
});
const holds = [];
for (let t = 0; t <= max; t += Math.max(10, Math.round(max / 24)))
  holds.push(await page.evaluate(HOLD, { top: t }));
const holdRows = holds.flatMap((h) => h.rows || []);

// ── B · WHAT `align-self: start` COSTS ─────────────────────────────────────────────────────
await page.evaluate(() => {
  const c = document.querySelector(".controls-card");
  if (c) c.scrollTop = 0;
});
await page.waitForTimeout(120);
const NAMETOPS = () =>
  [...document.querySelectorAll("[data-ruled-group]")].map((g) => {
    const n = g.querySelector(".rp-name");
    const f = g.querySelector(".rp-field");
    const fc = f && f.querySelector("button,[role='button'],label");
    return {
      name: n ? n.textContent.trim() : null,
      top: n ? +n.getBoundingClientRect().top.toFixed(2) : null,
      height: n ? +n.getBoundingClientRect().height.toFixed(2) : null,
      firstFaceTop: fc ? +fc.getBoundingClientRect().top.toFixed(2) : null,
    };
  });
const asStart = await page.evaluate(NAMETOPS);
await page.addStyleTag({ content: ".rp-name{align-self:baseline!important}" });
await page.waitForTimeout(200);
const asBaseline = await page.evaluate(NAMETOPS);
const baselineCost = asStart.map((s, i) => ({
  name: s.name,
  topStart: s.top,
  topBaseline: asBaseline[i] ? asBaseline[i].top : null,
  shift: asBaseline[i] ? +(asBaseline[i].top - s.top).toFixed(2) : null,
  heightStart: s.height,
  heightBaseline: asBaseline[i] ? asBaseline[i].height : null,
}));
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
await page.waitForTimeout(1400);
if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
  await page.locator(".drawer-tab").first().click({ force: true });
  await page.waitForTimeout(950);
}
await page.waitForTimeout(400);

// ── C · THE INK AS ARITHMETIC ──────────────────────────────────────────────────────────────
const TOKENS = () => {
  const card = document.querySelector(".controls-card") || document.body;
  const probe = document.createElement("span");
  card.appendChild(probe);
  const read = (v) => {
    probe.style.color = v;
    const c = getComputedStyle(probe).color;
    return c;
  };
  const names = [
    "--color-card",
    "--color-foreground",
    "--color-muted-foreground",
    "--color-red-ink",
    "--ink-press-rule",
    "--ring-ink",
  ];
  const out = {};
  for (const n of names) out[n] = read(`var(${n})`);
  const line = document.querySelector(".ruled-line path");
  if (line) {
    const cs = getComputedStyle(line);
    out.ruleStroke = cs.stroke;
    out.ruleStrokeWidth = cs.strokeWidth;
    out.ruleBox = (() => {
      const r = line.getBoundingClientRect();
      return { top: +r.top.toFixed(2), left: +r.left.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
    })();
  }
  const nm = document.querySelector(".rp-name");
  if (nm) {
    const cs = getComputedStyle(nm);
    out.nameColor = cs.color;
    out.nameFontSize = cs.fontSize;
    out.nameFontFamily = cs.fontFamily.slice(0, 40);
  }
  probe.remove();
  return out;
};
const tokens = await page.evaluate(TOKENS);

const parse = (s) => {
  if (!s) return null;
  let m = /rgba?\(([^)]+)\)/.exec(s);
  if (m) {
    const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
  }
  m = /color\(srgb ([0-9.]+) ([0-9.]+) ([0-9.]+)(?:\s*\/\s*([0-9.]+))?\)/.exec(s);
  if (m) return { rgb: [+m[1] * 255, +m[2] * 255, +m[3] * 255], a: m[4] === undefined ? 1 : +m[4] };
  return null;
};
const over = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg.rgb[i] * (1 - fg.a));
const card = parse(tokens["--color-card"]);
const ink = {};
for (const k of ["--color-muted-foreground", "--color-red-ink", "--ink-press-rule", "--ring-ink", "--color-foreground"]) {
  const p = parse(tokens[k]);
  if (!p || !card) continue;
  ink[k] = { raw: tokens[k], alpha: p.a, composited: ratio(over(p, card), card.rgb) };
}

// ── D · THE RULE AS PAINT ──────────────────────────────────────────────────────────────────
const box = tokens.ruleBox;
let painted = null;
if (box && box.w > 4) {
  const pad = 6;
  const clip = {
    x: Math.round(box.left + 10),
    y: Math.max(0, Math.round(box.top - pad)),
    width: Math.min(200, Math.round(box.w - 20)),
    height: Math.round(box.h + pad * 2),
  };
  const buf = await page.screenshot({ clip });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const cols = [];
  for (let x = 0; x < info.width; x++) {
    let best = null;
    for (let y = 0; y < info.height; y++) {
      const i = (y * info.width + x) * ch;
      const px = [data[i], data[i + 1], data[i + 2]];
      const r = ratio(px, card.rgb);
      if (!best || r > best.r) best = { r, y, px };
    }
    cols.push(best);
  }
  const rs = cols.map((c) => c.r);
  painted = {
    clip,
    columns: cols.length,
    worstColumn: +Math.min(...rs).toFixed(3),
    bestColumn: +Math.max(...rs).toFixed(3),
    medianColumn: +rs.slice().sort((a, b) => a - b)[Math.floor(rs.length / 2)].toFixed(3),
    clears3: Math.min(...rs) >= 3,
  };
}

const out = {
  engine: ENGINE,
  scheme: SCHEME,
  base: BASE,
  pin: {
    astrideReads: holdRows.length,
    worstNameTopMinusLine: holdRows.length
      ? +Math.max(...holdRows.map((r) => Math.abs(r.nameTopMinusLine))).toFixed(3)
      : null,
    sample: holdRows.slice(0, 8),
  },
  baselineCost,
  tokens,
  ink,
  painted,
};
writeFileSync(join(OUT, `critic-probe2-${ENGINE}-${SCHEME}.json`), JSON.stringify(out, null, 2));
console.log(
  ENGINE,
  SCHEME,
  "| astride reads",
  out.pin.astrideReads,
  "worst |name.top − pin line|",
  out.pin.worstNameTopMinusLine,
  "| align-self cost",
  JSON.stringify(baselineCost.map((b) => b.shift)),
  "| rule painted worst",
  painted && painted.worstColumn,
  "median",
  painted && painted.medianColumn,
  "| ink",
  JSON.stringify(Object.fromEntries(Object.entries(ink).map(([k, v]) => [k, v.composited]))),
);
await ctx.close();
await browser.close();
console.log("EXIT OK");
