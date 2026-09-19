// T9-W7 · pass 1 · CTRL-TABS — THE PAIRED READ. One probe, run twice against the same server:
// once with the patch in the tree (`ARM=proto`) and once with the eight files restored to HEAD
// (`ARM=head`). Everything it reads is selector-tolerant, so the HEAD arm is not a different
// instrument — it is the same one, finding what is there.
//
//   ARM=proto node .scratch-w7/ab.probe.mjs
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4238/";
const ARM = process.env.ARM || "proto";
const OUT = process.env.OUT || `/tmp/ctrl-tabs-ab-${ARM}.json`;

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true },
  { name: "dock-375x812", w: 375, h: 812, mobile: true, sheet: true },
  { name: "dock-430x932", w: 430, h: 932, mobile: true, sheet: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true, sheet: true },
  { name: "land-844x390", w: 844, h: 390, mobile: true, sheet: true },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, sheet: false },
  { name: "desk-1440x900", w: 1440, h: 900, mobile: false, sheet: false },
];

const lum = (r, g, b) => {
  const f = (x) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [a, b].sort((x, y) => y - x);
  return +(((l1 + 0.05) / (l2 + 0.05))).toFixed(2);
};

const read = () => {
  const box = (s) => {
    const e = document.querySelector(s);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  };
  const card = document.querySelector(".controls-card");
  // the compartment name's voice, whatever carries it in this arm
  const nameSel = ".tab-word, .washi-tag, .section-heading, .zone-row-label, .mobile-heading-btn";
  const names = [...(card?.querySelectorAll(nameSel) ?? [])].map((e) => {
    const cs = getComputedStyle(e);
    return {
      text: e.innerText.replace(/\s+/g, " ").trim(),
      voice: [cs.fontFamily.split(",")[0].replace(/["']/g, ""), (+parseFloat(cs.fontSize)).toFixed(2), cs.fontWeight, cs.textTransform].join(" · "),
      heading: !!e.closest("h1,h2,h3,h4,h5,h6"),
    };
  });
  const chip = card?.querySelector(".ctrl-btn");
  const caseEl = document.querySelector("#controls-drawer .drawer-case");
  const mark = document.querySelector("svg.handwritten-logo");
  // I2's own arm: the bar against whatever group boxes this arm has
  const bar = document.querySelector(".action-bar");
  const groups = [...document.querySelectorAll('.tray-well, [role="tabpanel"]:not([inert])')];
  let worst = 0;
  if (bar) {
    const bb = bar.getBoundingClientRect();
    for (const g of groups) {
      const gb = g.getBoundingClientRect();
      if (!gb.width || !gb.height) continue;
      const ov =
        Math.max(0, Math.min(gb.bottom, bb.bottom) - Math.max(gb.top, bb.top)) *
        Math.max(0, Math.min(gb.right, bb.right) - Math.max(gb.left, bb.left));
      worst = Math.max(worst, ov / (gb.width * gb.height));
    }
  }
  const tapTargets = [...document.querySelectorAll('.mobile-heading-btn, [role="tab"]')].map((b) => {
    const r = b.getBoundingClientRect();
    return { text: b.innerText.replace(/\s+/g, " ").trim().slice(0, 14), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  });
  return {
    card: card ? { sh: card.scrollHeight, ch: card.clientHeight, over: card.scrollHeight - card.clientHeight, fits: card.scrollHeight <= card.clientHeight } : null,
    cardBox: box(".controls-card"),
    board: box(".board-wrapper") || box(".sudoku-board"),
    tablists: document.querySelectorAll('[role="tablist"]').length,
    tabs: document.querySelectorAll('[role="tab"]').length,
    names,
    voices: [...new Set(names.map((n) => n.voice))].length,
    docHeadings: names.filter((n) => n.heading).length,
    nameCount: names.length,
    namePx: names.length ? Math.max(...names.map((n) => +n.voice.split(" · ")[1])) : null,
    chipPx: chip ? +parseFloat(getComputedStyle(chip).fontSize).toFixed(2) : null,
    seam: caseEl && mark ? +(caseEl.getBoundingClientRect().top - mark.getBoundingClientRect().bottom).toFixed(2) : null,
    i2Worst: +worst.toFixed(4),
    i2OwnChrome: bar ? parseFloat(getComputedStyle(bar).borderTopWidth) > 0 || getComputedStyle(bar).boxShadow !== "none" : null,
    tapTargets,
    tapFails: tapTargets.filter((t) => t.w < 44 || t.h < 44).length,
    foldTools: box("#fold-tools"),
    playControls: box(".play-controls"),
    edgeTools: box(".edge-tools"),
  };
};

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const key = `${cell.name}-${engine}`;
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    try {
      const ctx = await browser.newContext({
        viewport: { width: cell.w, height: cell.h },
        deviceScaleFactor: 1,
        isMobile: cell.mobile && engine === "chromium" ? true : undefined,
        hasTouch: cell.mobile,
        colorScheme: "light",
      });
      await ctx.addInitScript(() => {
        try {
          localStorage.clear();
          localStorage.setItem("sudoku-color-scheme", "light");
        } catch {}
      });
      const page = await ctx.newPage();
      await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
      await page.waitForTimeout(1500);
      const shut = await page.evaluate(() => {
        const b = (s) => {
          const e = document.querySelector(s);
          if (!e) return null;
          const r = e.getBoundingClientRect();
          return { w: +r.width.toFixed(2), h: +r.height.toFixed(2), y: +r.y.toFixed(2) };
        };
        const tools = [...document.querySelectorAll(".edge-tools button, .play-controls button")];
        return {
          board: (() => {
            const e = document.querySelector(".board-wrapper") || document.querySelector(".sudoku-board");
            const r = e.getBoundingClientRect();
            return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
          })(),
          foldTools: b("#fold-tools"),
          toolsOnScreen: tools.filter((t) => {
            const r = t.getBoundingClientRect();
            if (!r.width || !r.height) return false;
            const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
            return !!el && (el === t || t.contains(el));
          }).length,
          toolCount: tools.length,
        };
      });
      if (cell.sheet) {
        await page.locator(".drawer-tab").click({ force: true });
        await page.waitForTimeout(950);
      }
      const open = await page.evaluate(read);

      // the engine's DEFAULT focus ring on a card control, by A/B difference
      let ring = null;
      const target = page.locator('[role="tab"], .mobile-heading-btn, .controls-card button').first();
      if (await target.count()) {
        const b = await target.boundingBox();
        if (b) {
          const pad = 8;
          const clip = { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: b.width + 2 * pad, height: b.height + 2 * pad };
          const off = await page.screenshot({ clip });
          await target.focus();
          await page.evaluate(() => {
            const el = document.activeElement;
            el?.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
          });
          await page.keyboard.press("Shift+Tab");
          await page.keyboard.press("Tab");
          await page.waitForTimeout(160);
          const on = await page.screenshot({ clip });
          const A = await sharp(off).raw().toBuffer({ resolveWithObject: true });
          const B = await sharp(on).raw().toBuffer({ resolveWithObject: true });
          const ch = A.info.channels;
          const hist = new Map();
          const gh = new Map();
          for (let i = 0; i < A.data.length; i += ch) {
            const a = [A.data[i], A.data[i + 1], A.data[i + 2]];
            const c = [B.data[i], B.data[i + 1], B.data[i + 2]];
            if (Math.abs(a[0] - c[0]) + Math.abs(a[1] - c[1]) + Math.abs(a[2] - c[2]) > 24) {
              hist.set(c.join(","), (hist.get(c.join(",")) || 0) + 1);
              gh.set(a.join(","), (gh.get(a.join(",")) || 0) + 1);
            }
          }
          if (hist.size) {
            const rp = [...hist.entries()].sort((x, y) => y[1] - x[1])[0][0].split(",").map(Number);
            const gp = [...gh.entries()].sort((x, y) => y[1] - x[1])[0][0].split(",").map(Number);
            ring = { ring: `rgb(${rp.join(",")})`, ground: `rgb(${gp.join(",")})`, ratio: ratio(lum(...rp), lum(...gp)), changedPx: [...hist.values()].reduce((a, b2) => a + b2, 0) };
          } else ring = { error: "no pixel changed" };
        }
      }
      out[key] = { shut, open, ring };
      console.log(
        `[${ARM} ${key}] card ${open.card?.sh}/${open.card?.ch} ${open.card?.fits ? "FIT" : "OVER " + open.card?.over}` +
          ` · board x ${shut.board.x} · cardW ${open.cardBox?.w}` +
          ` · tablists ${open.tablists} · voices ${open.voices} headings ${open.docHeadings}/${open.nameCount}` +
          ` ratio ${open.namePx && open.chipPx ? (open.namePx / open.chipPx).toFixed(4) : "—"}` +
          ` · seam ${open.seam} · I2 ${open.i2Worst} own ${open.i2OwnChrome}` +
          ` · tapFails ${open.tapFails}/${open.tapTargets.length} · tools ${shut.toolsOnScreen}/${shut.toolCount}` +
          ` · ring ${ring?.ratio ?? ring?.error}`,
      );
    } catch (e) {
      out[key] = { error: String(e).slice(0, 300) };
      console.log(`[${ARM} ${key}] ERROR ${String(e).slice(0, 200)}`);
    }
    await browser.close();
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("\nbanked " + OUT);
