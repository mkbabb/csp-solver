// CTRL-TABS · probe 7 — THE GREENED ARM. Can the family satisfy R1 ROW 1/2/3 *and* still fit?
//   node greened.probe.mjs
// ROW 1 forces every group name into one voice; ROW 3 forces that voice ≥1.23× the option chip
// (24.60px on the phone, 27.06px at 900×500). That lifts the FOUR tab words AND the row captions
// together. This measures what that costs, and tries the fork's two desk arms:
//   TOP  — the strip across the card's top edge
//   RAIL — the strip down the card's LEFT flank in vertical writing-mode, INSIDE the card's own
//          324.22px so the rail's outer width never moves (the goldens' condition)
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.LANE_BASE || "http://127.0.0.1:4232/";
const SRC = readFileSync(join(HERE, "..", "proto", "overlay.mjs"), "utf8");
const CSS = /export const CSS = `([\s\S]*?)`;/.exec(SRC)[1];
const BUILD = SRC.slice(SRC.indexOf("export function build"))
  .replace("export function build", "function build")
  .trim();

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true, arms: ["top"] },
  { name: "dock-375x812", w: 375, h: 812, mobile: true, sheet: true, arms: ["top"] },
  { name: "land-900x500", w: 900, h: 500, mobile: true, sheet: true, arms: ["top"] },
  { name: "land-844x390", w: 844, h: 390, mobile: true, sheet: true, arms: ["top"] },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, sheet: false, arms: ["top", "rail"] },
];
const out = {};

// THE ONE-VOICE RE-POINT. Every group name — the four tab words and the row captions — takes
// one family, one size, one weight, one transform. The size is ROW 3's floor, computed from the
// option chip actually painted at this cell.
const GREEN_CSS = (px) => `
.proto-tab-word, .zone-row-label, .proto-row-label {
  font-family: var(--font-hand) !important;
  font-size: ${px}px !important;
  font-weight: 500 !important;
  text-transform: lowercase !important;
  letter-spacing: normal !important;
  line-height: 1.05 !important;
}
.proto-tab-word { white-space: normal !important; text-align: center; }
`;

const RAIL_CSS = `
.control-panel-wrap { display: flex !important; flex-direction: row !important; align-items: stretch; gap: 0.25rem; }
.control-panel-wrap > :not(.proto-tablist) { flex: 1 1 auto; min-width: 0; }
.proto-tablist {
  flex: 0 0 3rem !important;         /* 48px — the tongue's own depth, taken from INSIDE the card */
  flex-direction: column !important;
  width: 3rem !important;
  align-items: stretch !important;
  margin: 0 !important;
}
.proto-tab { writing-mode: vertical-rl; flex: 0 0 auto; }
.proto-arm-tongue .proto-tab { border-radius: 0.75rem 0 0 0.75rem; border-right: none; border-bottom: 1.5px solid var(--ink-press-rule); }
/* the trays and the floor share the remaining column */
.proto-rail-col { display: flex; flex-direction: column; flex: 1 1 auto; min-width: 0; }
`;

const measure = () => {
  const card = document.querySelector(".controls-card");
  const tabs = Array.from(document.querySelectorAll(".proto-tab"));
  const per = [];
  for (let i = 0; i < tabs.length; i++) {
    window.__protoSelect(i);
    void card.offsetHeight;
    const tray = document.querySelector(".tray-well:not([data-proto-off])");
    per.push({
      tab: tabs[i].innerText.replace(/\s+/g, " ").trim(),
      trayH: tray ? +tray.getBoundingClientRect().height.toFixed(2) : null,
      sh: card.scrollHeight,
      ch: card.clientHeight,
      fits: card.scrollHeight <= card.clientHeight,
      over: card.scrollHeight - card.clientHeight,
    });
  }
  window.__protoSelect(0);
  const strip = document.querySelector(".proto-tablist").getBoundingClientRect();
  const boxes = tabs.map((b) => {
    const r = b.getBoundingClientRect();
    return { t: b.innerText.replace(/\s+/g, " ").trim(), w: +r.width.toFixed(2), h: +r.height.toFixed(2), ok: r.width >= 44 && r.height >= 44 };
  });
  // the R1 rows, read the way the r0 instrument reads them
  const pick = (sel, kind) =>
    Array.from(card.querySelectorAll(sel))
      .filter((el) => el.getClientRects().length > 0)
      .map((el) => {
        const cs = getComputedStyle(el);
        const host = el.closest("h1,h2,h3,h4,h5,h6");
        return {
          kind,
          text: el.innerText.replace(/\s+/g, " ").trim(),
          voice: [
            cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
            (+parseFloat(cs.fontSize)).toFixed(2),
            cs.fontWeight,
            cs.textTransform,
          ].join(" · "),
          rank: host ? host.tagName : "—",
        };
      })
      .filter((n) => n.text);
  const names = [
    ...pick(".section-heading", "eyebrow"),
    ...pick(".tray-well > .washi-tag", "tape"),
    ...pick(".zone-row-label", "caption"),
    ...pick(".proto-tab-word", "tab"),
  ];
  const chip = card.querySelector(".ctrl-btn");
  const optionPx = chip ? +parseFloat(getComputedStyle(chip).fontSize).toFixed(2) : null;
  const namePx = names.length ? Math.max(...names.map((n) => +n.voice.split(" · ")[1])) : null;
  return {
    perTray: per,
    strip: { w: +strip.width.toFixed(2), h: +strip.height.toFixed(2) },
    tabs: boxes,
    tapFloorFails: boxes.filter((b) => !b.ok).map((b) => `${b.t} ${b.w}x${b.h}`),
    row1_voices: Array.from(new Set(names.map((n) => n.voice))),
    row2_docHeadings: `${names.filter((n) => n.rank !== "—").length}/${names.length}`,
    row3_ratio: namePx && optionPx ? +(namePx / optionPx).toFixed(4) : null,
    row3_floor: 1.23,
    names: names.map((n) => `${n.kind}:${n.text}`),
  };
};

for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    for (const arm of cell.arms) {
      const key = `${cell.name}-${engine}-${arm}`;
      const browser = await (engine === "webkit" ? webkit : chromium).launch();
      const ctx = await browser.newContext({
        viewport: { width: cell.w, height: cell.h },
        deviceScaleFactor: 1,
        isMobile: cell.mobile && engine === "chromium" ? true : undefined,
        hasTouch: cell.mobile,
      });
      await ctx.addInitScript(() => {
        try {
          localStorage.clear();
        } catch {}
      });
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
        await page.evaluate(`(() => { ${BUILD}; return build({arm:"tongue",trim:true}); })()`);
        // ROW 2 — the heading host, generalised from `.mobile-heading-head` to four tabs:
        // an `<h2 style="display: contents">` WRAPS each tab button, so heading navigation
        // lands on the heading and not inside the control (the estate's own a11y r1 M9 shape).
        await page.evaluate(() => {
          for (const b of document.querySelectorAll(".proto-tab")) {
            if (b.parentElement?.classList.contains("proto-tab-head")) continue;
            const h = document.createElement("h2");
            h.className = "proto-tab-head";
            h.style.display = "contents";
            b.parentElement.insertBefore(h, b);
            h.appendChild(b);
          }
        });
        const floorPx = await page.evaluate(() => {
          const chip = document.querySelector(".ctrl-btn");
          return +(parseFloat(getComputedStyle(chip).fontSize) * 1.23).toFixed(2);
        });
        await page.addStyleTag({ content: GREEN_CSS(floorPx) });
        if (arm === "rail") await page.addStyleTag({ content: RAIL_CSS });
        await page.waitForTimeout(350);
        const m = await page.evaluate(measure);
        m.floorPx = floorPx;
        out[key] = m;
        console.log(
          `[${key}] floor ${floorPx}px | ROW1 voices ${m.row1_voices.length} | ROW2 ${m.row2_docHeadings} | ROW3 ${m.row3_ratio} | ` +
            `strip ${m.strip.w}x${m.strip.h} tabs ${m.tabs.map((t) => `${t.w}x${t.h}`).join(",")} floorFails ${m.tapFloorFails.length} | ` +
            m.perTray.map((p) => `${p.tab}:${p.trayH}=>${p.fits ? "FIT" : "OVER " + p.over}`).join("  "),
        );
      } catch (e) {
        out[key] = { error: String(e).slice(0, 300) };
        console.log(`[${key}] ERROR ${String(e).slice(0, 180)}`);
      }
      await browser.close();
    }
  }
}
writeFileSync(join(HERE, "greened.json"), JSON.stringify(out, null, 1));
console.log("\nbanked probe/greened.json");
