// CTRL-COST pass-1 · THE HEIGHT ABLATION.
//
// The first overlay run made the card TALLER (desk 1142→1222, dock 699→796). A total is not
// a finding: this splits the delta into the four things the family actually does, one arm per
// thing, each measured against the same control in the same page. Plus the ROW-3 arm — the
// one right-hand side (`--type-group-title`) that decides whether the phone's name outranks
// the words under it.
//
//   node height-arms.mjs        (lane dev server at 127.0.0.1:4233)
//
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROTO = resolve(HERE, "../proto");
const OUT = resolve(HERE, "../readings");
const BASE = "http://127.0.0.1:4233/";
const CSS = readFileSync(resolve(PROTO, "cost-card.css"), "utf8");
const JS_SRC = readFileSync(resolve(PROTO, "cost-card.js"), "utf8").replace(
  /^export const costCard = /m,
  "window.__costCard = ",
);

// The arms. Each is a stylesheet laid ON TOP of the overlay, so every arm is the same tree
// minus exactly one decision.
const ARMS = {
  full: "",
  "no-reserved-second-line": ".cost-secondline{display:none!important}",
  "no-band-names": ".cost-band-name{display:none!important}",
  "tabs-kept":
    ".mobile-heading-row{display:flex!important}" +
    "@media (max-width:1023.98px){.cost-row:nth-last-child(-n+2) .ctrl-options{display:none!important}}",
  "phi-title-on-the-phone": ":root{--type-group-title:var(--type-heading)!important}",
  "phi-title-plus-no-reserve":
    ":root{--type-group-title:var(--type-heading)!important}.cost-secondline{display:none!important}",
  // The alternative to a reserved LINE: reserve the WIDTH instead — the answer sits beside
  // the question on one row, so the box grows sideways in a band that has room and never
  // grows downward in a card that has none.
  "confirm-on-one-line":
    ".cost-face-destructive{flex-direction:row;gap:0.4rem}.cost-secondline{margin-top:0}",
  "phi-title-plus-one-line":
    ":root{--type-group-title:var(--type-heading)!important}" +
    ".cost-face-destructive{flex-direction:row;gap:0.4rem}.cost-secondline{margin-top:0}",
};

const CELLS = [
  { name: "desk-1280x800", w: 1280, h: 800, coarse: false },
  { name: "dock-390x844", w: 390, h: 844, coarse: true },
  { name: "land-900x500", w: 900, h: 500, coarse: true },
];

const MEASURE = () => {
  const card = document.querySelector(".controls-card");
  const chip = card.querySelector(".ctrl-btn");
  const nameNodes = [
    ...card.querySelectorAll(".section-heading"),
    ...card.querySelectorAll(".tray-well > .washi-tag"),
    ...card.querySelectorAll(".zone-row-label"),
  ].filter((e) => e.getClientRects().length);
  const voice = (e) => {
    const cs = getComputedStyle(e);
    return `${cs.fontFamily.split(",")[0].replace(/["']/g, "").trim()} · ${(+parseFloat(
      cs.fontSize,
    )).toFixed(2)} · ${cs.fontWeight} · ${cs.textTransform}`;
  };
  const namePx = nameNodes.length
    ? Math.max(...nameNodes.map((e) => parseFloat(getComputedStyle(e).fontSize)))
    : null;
  const optionPx = chip ? parseFloat(getComputedStyle(chip).fontSize) : null;
  card.scrollTop = 0;
  const scb = card.getBoundingClientRect();
  let onScreenSettings = 0;
  const total = [];
  for (const g of card.querySelectorAll(".ctrl-options")) {
    const on = g.querySelector(".ctrl-btn");
    if (!on) continue;
    total.push(1);
    if (getComputedStyle(g).display === "none") continue; // hidden IS not on screen
    const b = (
      g.querySelector(".ctrl-btn[aria-checked='true'],.ctrl-btn[aria-pressed='true']") || on
    ).getBoundingClientRect();
    const vis =
      (Math.max(0, Math.min(b.bottom, scb.bottom) - Math.max(b.top, scb.top)) *
        Math.max(0, Math.min(b.right, scb.right) - Math.max(b.left, scb.left))) /
      Math.max(1, b.width * b.height);
    if (vis >= 0.999) onScreenSettings++;
  }
  return {
    scrollHeight: card.scrollHeight,
    clientHeight: card.clientHeight,
    overflow: card.scrollHeight - card.clientHeight,
    names: nameNodes.length,
    voices: [...new Set(nameNodes.map(voice))].length,
    docHeadings: nameNodes.filter((e) => !!e.closest("h1,h2,h3,h4,h5,h6")).length,
    namePx: namePx ? +namePx.toFixed(2) : null,
    optionPx: optionPx ? +optionPx.toFixed(2) : null,
    ratio: namePx && optionPx ? +(namePx / optionPx).toFixed(4) : null,
    settingsWhollyOnScreen: `${onScreenSettings}/${total.length}`,
  };
};

async function open(engine, cell) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    hasTouch: cell.coarse,
    isMobile: cell.coarse && engine === "chromium",
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
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  return { browser, page };
}

const out = {};
for (const cell of CELLS) {
  for (const engine of ["chromium", "webkit"]) {
    const key = `${cell.name}-${engine}`;
    out[key] = {};
    const { browser, page } = await open(engine, cell);
    out[key].control = await page.evaluate(MEASURE);
    await page.addStyleTag({ content: CSS });
    await page.evaluate(`(() => { ${JS_SRC} ; return window.__costCard(); })()`);
    await page.waitForTimeout(350);
    const armHandles = [];
    for (const [arm, css] of Object.entries(ARMS)) {
      for (const h of armHandles) await page.evaluate((id) => document.getElementById(id)?.remove(), h);
      armHandles.length = 0;
      if (css) {
        const id = `arm-${arm}`;
        await page.evaluate(
          ([id, css]) => {
            const s = document.createElement("style");
            s.id = id;
            s.textContent = css;
            document.head.appendChild(s);
          },
          [id, css],
        );
        armHandles.push(id);
      }
      await page.waitForTimeout(220);
      out[key][arm] = await page.evaluate(MEASURE);
    }
    await browser.close();
    const c = out[key].control;
    const f = out[key].full;
    console.log(
      `${key.padEnd(24)} control ${c.scrollHeight} (${c.settingsWhollyOnScreen} settings, ratio ${c.ratio}) → ` +
        Object.entries(out[key])
          .filter(([k]) => k !== "control")
          .map(([k, v]) => `${k} ${v.scrollHeight}${v.ratio !== f.ratio ? `/r${v.ratio}` : ""}`)
          .join(" · "),
    );
  }
}
writeFileSync(resolve(OUT, "height-arms.json"), JSON.stringify(out, null, 1));
console.log("\nbanked readings/height-arms.json");
