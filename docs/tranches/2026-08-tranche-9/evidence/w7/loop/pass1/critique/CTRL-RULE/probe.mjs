// CTRL-RULE pass-1 CRITIC's own probe. Independent of the prototype's scripts.
//   node probe.mjs <port> <tag>
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules";
const { chromium, webkit } = await import(`${NM}/playwright/index.mjs`);
const sharp = (await import(`${NM}/sharp/dist/index.mjs`)).default;
import { writeFileSync } from "node:fs";

const PORT = process.argv[2] || "4240";
const TAG = process.argv[3] || "proto";
const BASE = `http://127.0.0.1:${PORT}/`;
const OUT = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critic";

const srgb = (c) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => { const [hi, lo] = a > b ? [a, b] : [b, a]; return (hi + 0.05) / (lo + 0.05); };

async function open(engine, { w, h, mobile, dark }) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: mobile && engine === "chromium" ? true : undefined,
    hasTouch: !!mobile,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light"); } catch {} }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1500);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  await page.waitForTimeout(400);
  return { browser, page };
}

// ── 1 · voices, heading count, name/chip ratio, filters, ring consumers
async function census(page) {
  return page.evaluate(() => {
    const card = document.querySelector(".controls-card");
    if (!card) return { error: "no card" };
    const heads = [...card.querySelectorAll("h1,h2,h3,h4,h5,h6")];
    const voices = new Set(heads.map((h) => { const c = getComputedStyle(h); return `${c.fontFamily.split(",")[0]}|${c.fontSize}|${c.fontWeight}|${c.textTransform}`; }));
    const chip = card.querySelector(".option-btn, .options-row button, [class*=option] button");
    const chipFs = chip ? parseFloat(getComputedStyle(chip).fontSize) : null;
    const nameFs = heads[0] ? parseFloat(getComputedStyle(heads[0]).fontSize) : null;
    const filters = [...document.querySelectorAll("*")].filter((e) => {
      const f = getComputedStyle(e).filter; return f && f.includes("url(");
    }).length;
    // ring consumers: any element whose outline/outline-color mentions the ring value
    const ringVal = getComputedStyle(document.documentElement).getPropertyValue("--ring-ink").trim();
    const rules = card.querySelectorAll("svg.ruled-line").length;
    return {
      headingCount: heads.length,
      headingNames: heads.map((h) => h.textContent.trim()),
      voices: [...voices],
      nameFs, chipFs, ratio: nameFs && chipFs ? +(nameFs / chipFs).toFixed(4) : null,
      docFilters: filters,
      ringVal,
      rules,
      roleDialog: card.querySelectorAll("[role=dialog]").length,
      groupNames: [...card.querySelectorAll("[data-ruled-group] h2")].map((h) => h.textContent.trim()),
    };
  });
}

// ── 2 · the rule's painted contrast, per rule, per column
async function rulePaint(page, engine, theme) {
  const boxes = await page.evaluate(() => {
    const card = document.querySelector(".controls-card");
    return [...card.querySelectorAll("svg.ruled-line")].map((s) => {
      const b = s.getBoundingClientRect();
      const grp = s.closest("[data-ruled-group]");
      const name = grp ? grp.querySelector("h2")?.textContent.trim() : "bar";
      return { name, x: b.x, y: b.y, w: b.width, h: b.height };
    }).filter((b) => b.w > 20 && b.y > 0 && b.y < 2000);
  });
  const out = [];
  const vp = page.viewportSize();
  for (const b of boxes) {
    const clip = { x: Math.max(0, Math.round(b.x)), y: Math.round(b.y - 4), width: Math.round(b.w), height: Math.round(b.h + 8) };
    if (clip.y < 0 || clip.y + clip.height > vp.height || clip.x + clip.width > vp.width) { out.push({ name: b.name, skipped: "offscreen", y: +b.y.toFixed(1) }); continue; }
    if (clip.width < 10 || clip.height < 5) continue;
    let buf;
    try { buf = await page.screenshot({ clip }); } catch (e) { out.push({ name: b.name, skipped: "clip", y: +b.y.toFixed(1) }); continue; }
    const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;
    const px = (x, y) => { const i = (y * width + x) * channels; return [data[i], data[i + 1], data[i + 2]]; };
    // background = top row (above the rule)
    const bg = px(Math.floor(width / 2), 0);
    const bgL = lum(...bg);
    const cols = [];
    for (let x = 2; x < width - 2; x++) {
      let best = 1;
      for (let y = 0; y < height; y++) {
        const r = ratio(lum(...px(x, y)), bgL);
        if (r > best) best = r;
      }
      cols.push(best);
    }
    cols.sort((a, b) => a - b);
    const q = (p) => +cols[Math.floor(p * (cols.length - 1))].toFixed(3);
    out.push({
      name: b.name, engine, theme, columns: cols.length,
      worst: q(0), p05: q(0.05), p25: q(0.25), median: q(0.5),
      under3: +((cols.filter((c) => c < 3).length / cols.length) * 100).toFixed(1),
      bg: bg.join(","),
    });
  }
  return out;
}

// ── 3 · the pinned head over a live control
async function occlusion(page) {
  return page.evaluate(async () => {
    const card = [...document.querySelectorAll(".controls-card")].find((e) => e.scrollHeight - e.clientHeight > 40);
    if (!card) return { error: "no scrollport" };
    const rows = [];
    for (const st of [0, 160, 327, 500, 99999]) {
      card.scrollTop = st;
      await new Promise((r) => setTimeout(r, 300));
      const cs = getComputedStyle(card);
      const top = card.getBoundingClientRect().top + card.clientTop + (parseFloat(cs.paddingTop) || 0);
      let worst = 0, who = null, head = null;
      for (const h of card.querySelectorAll(".group-head")) {
        const hb = h.getBoundingClientRect();
        if (Math.abs(hb.top - top) > 3 || hb.bottom <= top + 1) continue;
        const grp = h.closest("[data-ruled-group]");
        for (const c of grp.querySelectorAll("button,[tabindex='0'],input,select")) {
          const b = c.getBoundingClientRect();
          if (b.height < 2) continue;
          const ov = Math.max(0, Math.min(b.bottom, hb.bottom) - Math.max(b.top, hb.top)) / Math.max(1, b.height);
          if (ov > worst) { worst = ov; who = (c.textContent || "").trim().slice(0, 16); head = grp.querySelector("h2")?.textContent.trim(); }
        }
      }
      rows.push({ at: Math.round(card.scrollTop), coveredPct: +(worst * 100).toFixed(1), control: who, head });
    }
    card.scrollTop = 0;
    return rows;
  });
}

// ── 4 · the bar's coverage clipped to the scrollport
async function barCoverage(page) {
  return page.evaluate(async () => {
    const card = [...document.querySelectorAll(".controls-card")].find((e) => e.scrollHeight - e.clientHeight > 4) || document.querySelector(".controls-card");
    const bar = document.querySelector(".action-bar");
    if (!card || !bar) return { error: "missing", hasBar: !!bar };
    const cb = card.getBoundingClientRect();
    const bb = bar.getBoundingClientRect();
    const rows = [];
    for (const st of [0, 160, 327, 500, 99999]) {
      card.scrollTop = st;
      await new Promise((r) => setTimeout(r, 250));
      let worst = 0;
      const clip = { top: cb.top + card.clientTop, bottom: cb.top + card.clientTop + card.clientHeight };
      for (const c of card.querySelectorAll("button,[tabindex='0']")) {
        const b = c.getBoundingClientRect();
        if (b.height < 2) continue;
        const vis = Math.max(0, Math.min(b.bottom, clip.bottom) - Math.max(b.top, clip.top));
        if (vis <= 0) continue;
        const ov = Math.max(0, Math.min(b.bottom, bb.bottom) - Math.max(b.top, bb.top)) / Math.max(1, b.height);
        if (ov > worst) worst = ov;
      }
      rows.push({ at: Math.round(card.scrollTop), coverPct: +(worst * 100).toFixed(1) });
    }
    card.scrollTop = 0;
    return { barTopMinusCardBottom: +(bb.top - (cb.bottom)).toFixed(2), inCard: card.contains(bar), rows };
  });
}

const results = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of [
    { key: "390-dark", w: 390, h: 844, mobile: true, dark: true },
    { key: "390-light", w: 390, h: 844, mobile: true, dark: false },
    { key: "1280-light", w: 1280, h: 800, mobile: false, dark: false },
    { key: "1280-dark", w: 1280, h: 800, mobile: false, dark: true },
  ]) {
    const { browser, page } = await open(engine, cell);
    const k = `${engine}|${cell.key}`;
    try {
      results[k] = {};
      for (const [nm, fn] of [["census", () => census(page)], ["rule", () => rulePaint(page, engine, cell.dark ? "dark" : "light")], ["occlusion", () => occlusion(page)], ["bar", () => barCoverage(page)]]) {
        try { results[k][nm] = await fn(); } catch (e) { results[k][nm] = { error: String(e).slice(0, 200) }; }
      }
    } catch (e) {
      results[k] = { error: String(e).slice(0, 300) };
    }
    await browser.close();
    console.log("done", k);
  }
}
writeFileSync(`${OUT}/probe-${TAG}.json`, JSON.stringify(results, null, 1));
console.log("WROTE", `${OUT}/probe-${TAG}.json`);
