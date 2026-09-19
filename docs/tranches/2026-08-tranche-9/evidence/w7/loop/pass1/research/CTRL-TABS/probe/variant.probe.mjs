// CTRL-TABS · probe 5 — the four remaining questions.
//   node variant.probe.mjs
// (A) the quiet-rung tab word's PAINTED contrast when the tab is NOT double-dimmed
// (B) the 44 floor with a PER-DIMENSION negative control (a deliberately 40px-tall tab)
// (C) the intrinsic tab-word widths — do FIVE tabs (`keys`) fit the phone's row?
// (D) the ONE TOOL HOME — undo·redo·hint·controls on the board's free edge, every mobile pose
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.LANE_BASE || "http://127.0.0.1:4232/";
const SRC = readFileSync(join(HERE, "..", "proto", "overlay.mjs"), "utf8");
const CSS = /export const CSS = `([\s\S]*?)`;/.exec(SRC)[1];
const BUILD = SRC.slice(SRC.indexOf("export function build"))
  .replace("export function build", "function build")
  .trim();

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true },
  { name: "dock-375x812", w: 375, h: 812, mobile: true, sheet: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true, sheet: true },
  { name: "land-844x390", w: 844, h: 390, mobile: true, sheet: true },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, sheet: false },
];
const out = {};

const lum = (r, g, b) => {
  const f = (x) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

async function painted(page, selector) {
  const box = await page.locator(selector).first().boundingBox();
  if (!box) return null;
  const buf = await page.screenshot({
    clip: { x: box.x, y: box.y, width: Math.max(2, box.width), height: Math.max(2, box.height) },
  });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const hist = new Map();
  let dk = { L: 2, px: null },
    lt = { L: -1, px: null };
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    hist.set(`${r},${g},${b}`, (hist.get(`${r},${g},${b}`) || 0) + 1);
    const L = lum(r, g, b);
    if (L < dk.L) dk = { L, px: [r, g, b] };
    if (L > lt.L) lt = { L, px: [r, g, b] };
  }
  const ground = [...hist.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const gL = lum(...ground);
  const ink = Math.abs(dk.L - gL) >= Math.abs(lt.L - gL) ? dk : lt;
  const [l1, l2] = [gL, ink.L].sort((a, b) => b - a);
  return {
    ground: `rgb(${ground.join(",")})`,
    ink: `rgb(${ink.px.join(",")})`,
    ratio: +((l1 + 0.05) / (l2 + 0.05)).toFixed(2),
  };
}

for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    for (const scheme of ["light", "dark"]) {
      const key = `${cell.name}-${engine}-${scheme}`;
      const browser = await (engine === "webkit" ? webkit : chromium).launch();
      const ctx = await browser.newContext({
        viewport: { width: cell.w, height: cell.h },
        deviceScaleFactor: 1,
        isMobile: cell.mobile && engine === "chromium" ? true : undefined,
        hasTouch: cell.mobile,
        colorScheme: scheme,
      });
      await ctx.addInitScript((s) => {
        try {
          localStorage.clear();
          localStorage.setItem("sudoku-color-scheme", s);
        } catch {}
      }, scheme);
      const page = await ctx.newPage();
      const rec = {};
      try {
        await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
        await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
        await page.waitForTimeout(1400);

        // (D) THE BOARD'S FREE EDGE — read SHUT, before the sheet is raised.
        rec.toolHome = await page.evaluate(() => {
          const b = (el) => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
          };
          const paper = document.querySelector(".board-paper") || document.querySelector(".board-wrapper");
          const tab = document.querySelector(".drawer-tab");
          const portrait = window.innerHeight >= window.innerWidth;
          const p = b(paper),
            t = b(tab);
          if (!p || !t) return null;
          const axis = portrait && window.innerWidth < 1024 ? "x" : "y";
          const edgeLen = axis === "x" ? p.w : p.h;
          const spent = axis === "x" ? t.w : t.h;
          return {
            axis,
            paper: p,
            tongue: t,
            edgeLen,
            tongueSpend: spent,
            free: +(edgeLen - spent).toFixed(2),
            threeTargets44: 132,
            seamsAt3: +(edgeLen - spent - 132).toFixed(2),
            fits: edgeLen - spent >= 132,
            toggle: b(document.querySelector(".celestial-toggle")) || b(document.querySelector("[class*='toggle']")),
            foldTools: b(document.querySelector("#fold-tools")),
          };
        });

        if (cell.sheet) {
          await page.locator(".drawer-tab").click({ force: true });
          await page.waitForTimeout(950);
        }
        await page.addStyleTag({ content: CSS });
        await page.evaluate(`(() => { ${BUILD}; return build({arm:"tongue",trim:true}); })()`);
        await page.waitForTimeout(300);

        // (A) the quiet rung, NOT double-dimmed: the tab's ground keeps full opacity and the
        //     WORD alone carries the rung.
        await page.addStyleTag({
          content: `.proto-arm-tongue .proto-tab{opacity:1 !important}
                    .proto-arm-tongue .proto-tab:not(.is-selected){background:transparent !important}`,
        });
        await page.waitForTimeout(200);
        rec.quietUndimmed = await painted(page, ".proto-tab:not(.is-selected) .proto-tab-word");
        rec.selected = await painted(page, ".proto-tab.is-selected .proto-tab-word");

        // (C) intrinsic word widths + the fifth tab
        rec.words = await page.evaluate(() => {
          const strip = document.querySelector(".proto-tablist");
          const stripW = strip.getBoundingClientRect().width;
          const probe = document.createElement("span");
          probe.style.cssText =
            "position:absolute;visibility:hidden;white-space:nowrap;font-family:var(--font-hand);font-weight:500;letter-spacing:0.06em;text-transform:lowercase;";
          probe.style.fontSize = getComputedStyle(document.querySelector(".proto-tab-word")).fontSize;
          document.body.appendChild(probe);
          const measure = (t) => {
            probe.textContent = t;
            return +probe.getBoundingClientRect().width.toFixed(2);
          };
          const four = ["new game", "pencils", "checking", "players"];
          const five = [...four, "keys"];
          const padPerTab = 8; // 0.25rem each side, the strip's own
          const seam = 4;
          const need = (arr) =>
            +(arr.reduce((a, t) => a + Math.max(44, measure(t) + padPerTab), 0) + seam * (arr.length - 1)).toFixed(2);
          const r = {
            stripW: +stripW.toFixed(2),
            each: Object.fromEntries(five.map((t) => [t, measure(t)])),
            need4: need(four),
            need5: need(five),
            fits4: need(four) <= stripW,
            fits5: need(five) <= stripW,
          };
          probe.remove();
          return r;
        });

        // (B) the 44 floor with a PER-DIMENSION negative control
        rec.floor = await page.evaluate(() => {
          const read = () =>
            Array.from(document.querySelectorAll(".proto-tab")).map((b) => {
              const r = b.getBoundingClientRect();
              return { t: b.innerText.trim(), w: +r.width.toFixed(2), h: +r.height.toFixed(2), wOK: r.width >= 44, hOK: r.height >= 44 };
            });
          const before = read();
          // NEGATIVE CONTROL, height arm: force one tab under the floor on H alone.
          const s = document.createElement("style");
          s.id = "neg-h";
          s.textContent = ".proto-tab:nth-child(2){min-height:0!important;height:40px!important}";
          document.head.appendChild(s);
          void document.body.offsetHeight;
          const negH = read();
          s.remove();
          // NEGATIVE CONTROL, width arm.
          const s2 = document.createElement("style");
          s2.textContent =
            ".proto-tab:nth-child(3){flex:0 0 auto!important;min-width:0!important;width:40px!important}";
          document.head.appendChild(s2);
          void document.body.offsetHeight;
          const negW = read();
          s2.remove();
          return {
            before,
            negativeControlH: { caught: negH.filter((r) => !r.hOK).map((r) => `${r.t} ${r.w}x${r.h}`) },
            negativeControlW: { caught: negW.filter((r) => !r.wOK).map((r) => `${r.t} ${r.w}x${r.h}`) },
          };
        });
      } catch (e) {
        rec.error = String(e).slice(0, 300);
      }
      out[key] = rec;
      console.log(
        `[${key}] quiet=${rec.quietUndimmed?.ratio} sel=${rec.selected?.ratio} | ` +
          `words need4=${rec.words?.need4}/${rec.words?.stripW} fits4=${rec.words?.fits4} need5=${rec.words?.need5} fits5=${rec.words?.fits5} | ` +
          `edge ${rec.toolHome?.axis} free=${rec.toolHome?.free} fits3=${rec.toolHome?.fits} | ` +
          `negH=${rec.floor?.negativeControlH.caught.length} negW=${rec.floor?.negativeControlW.caught.length}`,
      );
      await browser.close();
    }
  }
}
writeFileSync(join(HERE, "variant.json"), JSON.stringify(out, null, 1));
console.log("\nbanked probe/variant.json");
