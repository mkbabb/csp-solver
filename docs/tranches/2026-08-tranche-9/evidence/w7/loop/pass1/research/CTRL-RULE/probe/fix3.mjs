// T9-W7 pass1 · CTRL-RULE — the re-runs: the bar truly out of the scrollport, arm (a')'s
// release (I3), the rule's painted contrast on FOUR grounds, the 390-class masthead seam.
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
    try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light"); } catch {}
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  return { browser, page };
}
const apply = async (page, opts) => {
  await page.addScriptTag({ type: "module", content: PROTO });
  await page.waitForFunction(() => !!window.__rp, { timeout: 10000 });
  const r = await page.evaluate((o) => window.__rp(o), opts);
  await page.waitForTimeout(400);
  return r;
};
const lum = (r, g, b) => {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(...a), lum(...b)].sort((x, y) => y - x);
  return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
};

/* 1 · THE BAR OUTSIDE THE SCROLLPORT — I2's two halves at three scroll states */
for (const engine of ["chromium", "webkit"]) {
  for (const cell of [
    { name: "dock-390x844", w: 390, h: 844, mobile: true },
    { name: "land-900x500", w: 900, h: 500, mobile: true },
    { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
  ]) {
    const { browser, page } = await board(engine, cell);
    await apply(page, { arm: "above", barOut: true });
    const r = await page.evaluate(async () => {
      const card = document.querySelector(".controls-card");
      const bar = document.querySelector(".action-bar");
      const cs = getComputedStyle(bar);
      const own =
        parseFloat(cs.borderTopWidth) > 0 || cs.outlineStyle !== "none" || cs.boxShadow !== "none" ||
        !!bar.querySelector(":scope > .outline-container, :scope > svg.outline-svg");
      const states = [];
      const max = Math.max(0, card.scrollHeight - card.clientHeight);
      for (const st of [0, Math.round(max / 2), max]) {
        card.scrollTop = st;
        await new Promise((r2) => setTimeout(r2, 220));
        const bb = bar.getBoundingClientRect();
        let worst = 0, who = null;
        for (const g of document.querySelectorAll(".rp-group")) {
          const gb = g.getBoundingClientRect();
          const ov = Math.max(0, Math.min(gb.bottom, bb.bottom) - Math.max(gb.top, bb.top)) *
                     Math.max(0, Math.min(gb.right, bb.right) - Math.max(gb.left, bb.left));
          const f = ov / Math.max(1, gb.width * gb.height);
          if (f > worst) { worst = f; who = g.dataset.group; }
        }
        states.push({ at: card.scrollTop, worst: +worst.toFixed(4), who });
      }
      card.scrollTop = 0;
      const bb = bar.getBoundingClientRect(), cb = card.getBoundingClientRect();
      return { own, position: cs.position, states,
               barBox: [+bb.x.toFixed(1), +bb.y.toFixed(1), +bb.width.toFixed(1), +bb.height.toFixed(1)],
               cardBox: [+cb.y.toFixed(1), +cb.height.toFixed(1)],
               scrollH: card.scrollHeight, clientH: card.clientHeight };
    });
    out[`barout2-${cell.name}-${engine}`] = r;
    console.log(`barOut ${cell.name} ${engine}: own=${r.own} pos=${r.position} bar ${JSON.stringify(r.barBox)} card ${JSON.stringify(r.cardBox)} ${r.scrollH}/${r.clientH} · coverage ${r.states.map((s) => `${s.at}:${(s.worst * 100).toFixed(1)}%`).join(" ")}`);
    await browser.close();
  }
}

/* 2 · ARM (a') — the release, and I3 at five states */
for (const engine of ["chromium", "webkit"]) {
  for (const rel of [false, true]) {
    for (const cell of [
      { name: "dock-390x844", w: 390, h: 844, mobile: true },
      { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
    ]) {
      const { browser, page } = await board(engine, cell);
      await apply(page, { arm: "above", release: rel, barOut: true });
      const r = await page.evaluate(async () => {
        const sc = [...document.querySelectorAll(".controls-card")].find((e) => e.scrollHeight - e.clientHeight > 40);
        if (!sc) return { skipped: true };
        const max = sc.scrollHeight - sc.clientHeight;
        const states = [];
        for (const st of [0, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max]) {
          sc.scrollTop = st;
          await new Promise((r2) => setTimeout(r2, 260));
          const scb = sc.getBoundingClientRect();
          const rows = [];
          for (const n of document.querySelectorAll(".rp-head-pin .rp-name, .rp-head:not(.rp-head-pin) .rp-name")) {
            const host = n.closest(".rp-head-pin, .rp-head");
            if (getComputedStyle(host).visibility === "hidden") continue;
            const b = n.getBoundingClientRect();
            const g = n.closest(".rp-group");
            const gb = g.getBoundingClientRect();
            const nameVis = Math.max(0, Math.min(b.bottom, scb.bottom) - Math.max(b.top, scb.top)) / Math.max(1, b.height);
            const vis = Math.max(0, Math.min(gb.bottom, scb.bottom) - Math.max(gb.top, scb.top)) / Math.max(1, gb.height);
            if (b.top <= scb.top + 30 && nameVis > 0.5)
              rows.push({ t: n.textContent, groupVis: +vis.toFixed(3) });
          }
          states.push({ at: sc.scrollTop, pinned: rows.map((x) => `${x.t} ${x.groupVis}`),
                        violating: rows.filter((x) => x.groupVis < 0.5).length });
        }
        sc.scrollTop = 0;
        return { states, violations: states.reduce((a, s) => a + s.violating, 0) };
      });
      out[`i3-${rel ? "release" : "push"}-${cell.name}-${engine}`] = r;
      console.log(`I3 ${rel ? "release" : "push  "} ${cell.name} ${engine}: violations ${r.violations} · ${JSON.stringify(r.states?.map((s) => `${s.at}[${s.pinned.join("|")}]`))}`);
      await browser.close();
    }
  }
}

/* 3 · THE RULE'S PAINTED CONTRAST on four grounds (card/background × light/dark) */
for (const engine of ["chromium", "webkit"]) {
  for (const theme of ["light", "dark"]) {
    const { browser, page } = await board(engine, { w: 1280, h: 800, mobile: false }, theme === "dark");
    await apply(page, { arm: "above", drawOn: false, barOut: true });
    const shot = await page.screenshot({ type: "png" });
    const r = await page.evaluate(
      async ([b64]) => {
        const img = new Image();
        img.src = "data:image/png;base64," + b64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width; c.height = img.height;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(img, 0, 0);
        const px = (x, y) => { const d = g.getImageData(Math.round(x), Math.round(y), 1, 1).data; return [d[0], d[1], d[2]]; };
        const samples = [];
        for (const rule of document.querySelectorAll(".rp-rule")) {
          const rb = rule.getBoundingClientRect();
          if (rb.width < 20) continue;
          const band = [];
          const xs = [0.3, 0.5, 0.7].map((f) => rb.left + rb.width * f);
          for (const x of xs) for (let y = Math.floor(rb.top) - 2; y <= Math.ceil(rb.bottom) + 2; y++) band.push(px(x, y));
          samples.push({ band, ground: px(rb.left + rb.width * 0.5, rb.top - 12) });
        }
        return {
          samples,
          cardBg: getComputedStyle(document.querySelector(".controls-card")).backgroundColor,
          bodyBg: getComputedStyle(document.body).backgroundColor,
          inkRule: getComputedStyle(document.documentElement).getPropertyValue("--ink-press-rule").trim().replace(/\s+/g, " "),
        };
      },
      [shot.toString("base64")],
    );
    const per = (r.samples || []).filter((s) => s.band.length).map((s) => {
      const gl = lum(...s.ground);
      const best = s.band.reduce((a, b) => (Math.abs(lum(...b) - gl) > Math.abs(lum(...a) - gl) ? b : a), s.band[0]);
      return { px: best, ground: s.ground, ratio: ratio(best, s.ground) };
    });
    out[`contrast2-${engine}-${theme}`] = { per, cardBg: r.cardBg, bodyBg: r.bodyBg };
    console.log(`contrast ${engine} ${theme}: card ${r.cardBg} · ratios ${per.map((p) => p.ratio).join(" ")} · worst ${Math.min(...per.map((p) => p.ratio))} (px ${JSON.stringify(per[0]?.px)} on ${JSON.stringify(per[0]?.ground)})`);
    await browser.close();
  }
}

/* 4 · THE MASTHEAD SEAM — the case's painted top stroke against the wordmark's box */
for (const engine of ["chromium", "webkit"]) {
  for (const cell of [
    { name: "375x812", w: 375, h: 812, mobile: true },
    { name: "390x844", w: 390, h: 844, mobile: true },
    { name: "430x932", w: 430, h: 932, mobile: true },
  ]) {
    const { browser, page } = await board(engine, cell);
    const r = await page.evaluate(() => {
      const caseEl = document.querySelector(".drawer-case");
      const svg = caseEl?.querySelector(":scope > svg.outline-svg");
      const wm = document.querySelector("svg.handwritten-logo");
      const ce = caseEl?.getBoundingClientRect();
      const sb = svg?.getBoundingClientRect();
      const wb = wm?.getBoundingClientRect();
      const path = svg?.querySelector("path");
      const sw = path ? parseFloat(path.getAttribute("stroke-width")) : null;
      const outset = caseEl ? parseFloat(getComputedStyle(caseEl).getPropertyValue("--outline-outset")) : null;
      // the painted band: the stroke is centred on the path, which runs at the svg box's
      // own top + half the stroke
      const bandTop = sb && sw ? sb.top : null;
      const bandBottom = sb && sw ? sb.top + sw : null;
      return {
        caseTop: ce ? +ce.top.toFixed(2) : null,
        svgTop: sb ? +sb.top.toFixed(2) : null,
        strokeW: sw, outset,
        bandTop: bandTop ? +bandTop.toFixed(2) : null,
        bandBottom: bandBottom ? +bandBottom.toFixed(2) : null,
        wordmarkBox: wb ? [+wb.top.toFixed(2), +wb.bottom.toFixed(2)] : null,
        bandTopMinusWordmarkBottom: bandTop && wb ? +(bandTop - wb.bottom).toFixed(2) : null,
      };
    });
    out[`seam2-${cell.name}-${engine}`] = r;
    console.log(`seam ${cell.name} ${engine}: band [${r.bandTop}, ${r.bandBottom}] stroke ${r.strokeW} · wordmark bottom ${r.wordmarkBox?.[1]} · clearance ${r.bandTopMinusWordmarkBottom}`);
    await browser.close();
  }
}

writeFileSync(join(HERE, "..", "fix3.json"), JSON.stringify(out, null, 1));
console.log("banked fix3.json");
