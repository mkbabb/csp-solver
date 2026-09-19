// CTRL-TABS · probe 4 — THE FIT, under the FULL prototype (the family's own moves included).
//   node fit.probe.mjs
// Answers (1) NO SCROLL, (2) the tab boxes and the 358px row, (5) hidden trays, and the
// tab word's PAINTED contrast (canvas read-back, both themes, both engines).
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.LANE_BASE || "http://127.0.0.1:4232/";
const OVERLAY_SRC = readFileSync(join(HERE, "..", "proto", "overlay.mjs"), "utf8");
const CSS = /export const CSS = `([\s\S]*?)`;/.exec(OVERLAY_SRC)[1];
const BUILD_FN = OVERLAY_SRC.slice(OVERLAY_SRC.indexOf("export function build"))
  .replace("export function build", "function build")
  .trim();

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true },
  { name: "dock-375x812", w: 375, h: 812, mobile: true, sheet: true },
  { name: "dock-430x932", w: 430, h: 932, mobile: true, sheet: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true, sheet: true },
  { name: "land-844x390", w: 844, h: 390, mobile: true, sheet: true },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, sheet: false },
];
const out = {};

const measure = () => {
  const card = document.querySelector(".controls-card");
  const strip = document.querySelector(".proto-tablist");
  const tabs = Array.from(document.querySelectorAll(".proto-tab"));
  const per = [];
  for (let i = 0; i < tabs.length; i++) {
    window.__protoSelect(i);
    void card.offsetHeight;
    const tray = document.querySelector(".tray-well:not([data-proto-off])");
    per.push({
      tab: tabs[i].innerText.trim(),
      trayH: tray ? +tray.getBoundingClientRect().height.toFixed(2) : null,
      scrollHeight: card.scrollHeight,
      clientHeight: card.clientHeight,
      fits: card.scrollHeight <= card.clientHeight,
      over: card.scrollHeight - card.clientHeight,
    });
  }
  window.__protoSelect(0);
  const sr = strip.getBoundingClientRect();
  const boxes = tabs.map((b) => {
    const r = b.getBoundingClientRect();
    return {
      text: b.innerText.replace(/\s+/g, " ").trim(),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      wOK: r.width >= 44,
      hOK: r.height >= 44,
    };
  });
  const seams = [];
  for (let i = 1; i < tabs.length; i++)
    seams.push(
      +(tabs[i].getBoundingClientRect().left - tabs[i - 1].getBoundingClientRect().right).toFixed(2),
    );
  const hidden = Array.from(document.querySelectorAll(".tray-well[data-proto-off]")).flatMap((t) =>
    Array.from(t.querySelectorAll("button,a[href],input,select,textarea,[tabindex]")).map((el) => {
      const before = document.activeElement;
      let got = false;
      try {
        el.focus();
        got = document.activeElement === el;
      } catch {}
      if (before instanceof HTMLElement) before.focus();
      return { tag: el.tagName, got };
    }),
  );
  // the floor
  const bar = document.querySelector(".action-bar");
  const verbs = Array.from(document.querySelectorAll(".action-verbs > *")).map((b) => {
    const r = b.getBoundingClientRect();
    return {
      label: (b.getAttribute("aria-label") || b.innerText || "").replace(/\s+/g, " ").trim().slice(0, 22),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
    };
  });
  return {
    perTray: per,
    tabs: boxes,
    seams,
    stripBox: { w: +sr.width.toFixed(2), h: +sr.height.toFixed(2) },
    stripSpend: +(boxes.reduce((a, b) => a + b.w, 0) + seams.reduce((a, b) => a + b, 0)).toFixed(2),
    tapFloorFails: boxes.filter((b) => !b.wOK || !b.hOK),
    hiddenTabbables: hidden.length,
    hiddenFocusable: hidden.filter((x) => x.got).length,
    floor: {
      h: bar ? +bar.getBoundingClientRect().height.toFixed(2) : null,
      w: bar ? +bar.getBoundingClientRect().width.toFixed(2) : null,
      verbs,
      spend: +verbs.reduce((a, b) => a + b.w, 0).toFixed(2),
    },
    roles: {
      tablist: document.querySelectorAll('[role="tablist"]').length,
      tab: document.querySelectorAll('[role="tab"]').length,
      tabpanel: document.querySelectorAll('[role="tabpanel"]').length,
      rovingZeros: document.querySelectorAll('[role="tab"][tabindex="0"]').length,
      ariaLabelledbyWells: document.querySelectorAll(".tray-well[aria-labelledby]").length,
    },
  };
};

// PAINTED-BYTE contrast: read the tab word's own pixels off the compositor.
async function paintedContrast(page, selector) {
  const el = page.locator(selector).first();
  const box = await el.boundingBox();
  if (!box) return null;
  const buf = await page.screenshot({
    clip: { x: box.x, y: box.y, width: Math.max(2, box.width), height: Math.max(2, box.height) },
  });
  const sharp = (await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs")).default;
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const lum = (r, g, b) => {
    const f = (x) => {
      const v = x / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const hist = new Map();
  let darkest = { L: 2, px: null },
    lightest = { L: -1, px: null };
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const k = `${r},${g},${b}`;
    hist.set(k, (hist.get(k) || 0) + 1);
    const L = lum(r, g, b);
    if (L < darkest.L) darkest = { L, px: [r, g, b] };
    if (L > lightest.L) lightest = { L, px: [r, g, b] };
  }
  const modal = [...hist.entries()].sort((a, b) => b[1] - a[1])[0];
  const ground = modal[0].split(",").map(Number);
  const gL = lum(...ground);
  // the INK is whichever extreme is further from the ground
  const ink = Math.abs(darkest.L - gL) >= Math.abs(lightest.L - gL) ? darkest : lightest;
  const [l1, l2] = [gL, ink.L].sort((a, b) => b - a);
  return {
    ground: `rgb(${ground.join(",")})`,
    ink: `rgb(${ink.px.join(",")})`,
    ratio: +(((l1 + 0.05) / (l2 + 0.05))).toFixed(2),
    samplePx: info.width * info.height,
  };
}

for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    for (const scheme of ["light", "dark"]) {
      if (scheme === "dark" && cell.name !== "dock-390x844" && cell.name !== "desk-1280x800") continue;
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
      try {
        await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
        await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
        await page.waitForTimeout(1400);
        if (cell.sheet) {
          await page.locator(".drawer-tab").click({ force: true });
          await page.waitForTimeout(950);
        }
        await page.addStyleTag({ content: CSS });
        await page.evaluate(`(() => { ${BUILD_FN}; return build({arm:"tongue",trim:true}); })()`);
        await page.waitForTimeout(300);
        const tongue = await page.evaluate(measure);
        const quietC = await paintedContrast(page, ".proto-tab:not(.is-selected) .proto-tab-word");
        const selC = await paintedContrast(page, ".proto-tab.is-selected .proto-tab-word");
        await page.evaluate(() => {
          const s = document.querySelector(".proto-tablist");
          s.classList.remove("proto-arm-tongue");
          s.classList.add("proto-arm-tape");
        });
        await page.waitForTimeout(250);
        const tape = await page.evaluate(measure);
        const quietCtape = await paintedContrast(page, ".proto-tab:not(.is-selected) .proto-tab-word");
        out[key] = { tongue, tape, contrast: { quietOnTongue: quietC, selectedOnTongue: selC, quietOnTape: quietCtape } };
        console.log(
          `[${key}] ` +
            tongue.perTray.map((p) => `${p.tab}:${p.trayH}=>${p.fits ? "FIT" : "OVER " + p.over}`).join("  ") +
            `  | tabs ${tongue.tabs.map((t) => `${t.w}x${t.h}`).join(",")} spend ${tongue.stripSpend}/${tongue.stripBox.w}` +
            `  | quiet ${quietC?.ratio} sel ${selC?.ratio}`,
        );
      } catch (e) {
        out[key] = { error: String(e).slice(0, 300) };
        console.log(`[${key}] ERROR ${String(e).slice(0, 160)}`);
      }
      await browser.close();
    }
  }
}
writeFileSync(join(HERE, "fit.json"), JSON.stringify(out, null, 1));
console.log("\nbanked probe/fit.json");
