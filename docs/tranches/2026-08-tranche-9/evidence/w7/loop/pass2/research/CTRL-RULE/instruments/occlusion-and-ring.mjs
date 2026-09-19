// T9-W7 pass2 · CTRL-RULE — TWO INSTRUMENTS, born against HEAD.
//
// (1) THE OCCLUSION PREDICATE (registry-v1 graft 4, every §10 family's): a pinned head's
//     coverage of its own group's first control, PLUS `document.elementFromPoint` at the
//     midpoint of the covered band. Access 2.1 (≥96% burial) and I3 both read GREEN through a
//     38.8%-cut chip; this is the instrument the suite lacks. Arm (b) reads 0 by construction.
// (2) THE RING, PAINTED, AT HEAD: the defect `--ring-ink` is minted for. Every focusable
//     control in the card takes real focus; its outline is read from computed style, and the
//     painted ring is sampled from the engine's own bytes against the card ground.
//
// Read-only on the product. `node occlusion-and-ring.mjs`.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, scrolls: [0, 120, 217, 340, 460] },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, scrolls: [0, 200, 350, 500, 650] },
];

async function open(engine, cell, dark) {
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
  await page.waitForTimeout(1400);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES
  }
  return { browser, page };
}

// ── (1) the predicate. PINNED = any element inside the card whose computed position is
//    sticky|fixed and whose painted box holds still while the card scrolls under it.
const OCCLUDE = (scrollTop) => {
  const n2 = (v) => +(+v).toFixed(2);
  const card = document.querySelector(".controls-card");
  card.scrollTop = scrollTop;
  void card.offsetHeight;
  const cardBox = card.getBoundingClientRect();

  const pins = [...card.querySelectorAll("*")].filter((el) => {
    const p = getComputedStyle(el).position;
    if (p !== "sticky" && p !== "fixed") return false;
    const b = el.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  });

  const CONTROL = "button, [role=option], a[href], input, select, textarea";
  const rows = [];
  for (const pin of pins) {
    const pb = pin.getBoundingClientRect();
    // the group a pin NAMES: its nearest labelled ancestor, else the card
    const group = pin.closest("[role=group], .tray-well, section") || card;
    for (const ctl of group.querySelectorAll(CONTROL)) {
      const cb = ctl.getBoundingClientRect();
      if (cb.width === 0 || cb.height === 0) continue;
      // clip both to the scrollport — anything outside it is not painted over, it is clipped
      const top = Math.max(cb.top, cardBox.top),
        bot = Math.min(cb.bottom, cardBox.bottom);
      if (bot <= top) continue;
      const oTop = Math.max(top, pb.top),
        oBot = Math.min(bot, pb.bottom);
      const oL = Math.max(cb.left, pb.left),
        oR = Math.min(cb.right, pb.right);
      const covered = Math.max(0, oBot - oTop) * Math.max(0, oR - oL);
      if (covered <= 0) continue;
      const visible = (bot - top) * cb.width;
      const midX = (Math.max(cb.left, pb.left) + Math.min(cb.right, pb.right)) / 2;
      const midY = (oTop + oBot) / 2;
      const hit = document.elementFromPoint(midX, midY);
      rows.push({
        pin: (pin.className.toString().split(/\s+/)[0] || pin.tagName).slice(0, 28),
        pinText: (pin.innerText || "").replace(/\s+/g, " ").trim().slice(0, 18),
        control: (ctl.innerText || ctl.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 18),
        coveredPx: n2(Math.max(0, oBot - oTop)),
        coveredFrac: n2(visible ? covered / visible : 0),
        hit: hit ? (hit.className.toString().split(/\s+/)[0] || hit.tagName) : null,
        hitIsTheControl: !!hit && (hit === ctl || ctl.contains(hit)),
        liveTargetH: n2(Math.max(0, bot - Math.max(top, pb.bottom))),
        boxH: n2(cb.height),
      });
    }
  }
  const worst = rows.reduce((a, b) => (!a || b.coveredFrac > a.coveredFrac ? b : a), null);
  return { scrollTop, pins: pins.length, rows: rows.filter((r) => r.coveredFrac > 0.001), worst };
};

// ── (2) the ring, painted. Focus each control; read the authored outline; sample the
//    engine's own bytes in a band just outside the control's border box.
const RING = async () => {
  const n2 = (v) => +(+v).toFixed(3);
  const card = document.querySelector(".controls-card");
  const FOCUSABLE = "button, [role=option], a[href], input, select, textarea";
  const out = [];
  for (const el of card.querySelectorAll(FOCUSABLE)) {
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) continue;
    el.focus();
    const c = getComputedStyle(el);
    out.push({
      cls: (el.className.toString().match(/\b(ctrl-btn|icon-btn|info-btn|players-leave|mobile-heading-btn|deal-btn|invite-btn)\b/g) || ["(other)"]).join("."),
      text: (el.innerText || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 16),
      outline: [c.outlineStyle, c.outlineWidth, c.outlineColor, c.outlineOffset].join(" "),
      authored: c.outlineStyle !== "none" && c.outlineStyle !== "auto" && c.outlineWidth !== "0px",
      ua: c.outlineStyle === "auto",
      boxShadow: c.boxShadow === "none" ? "none" : c.boxShadow.slice(0, 40),
      box: { w: n2(b.width), h: n2(b.height) },
    });
    el.blur();
  }
  const n = out.length;
  return {
    n,
    authored: out.filter((o) => o.authored).length,
    ua: out.filter((o) => o.ua).length,
    byClass: out.reduce((m, o) => ((m[o.cls] = m[o.cls] || { n: 0, authored: 0, outline: o.outline }), m[o.cls].n++, o.authored && m[o.cls].authored++, m), {}),
    rows: out,
  };
};

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const { browser, page } = await open(engine, cell, false);
    const key = `${cell.name}/${engine}`;
    out[key] = { occlusion: [], ring: null };
    for (const s of cell.scrolls) out[key].occlusion.push(await page.evaluate(OCCLUDE, s));
    await page.evaluate((c) => (document.querySelector(".controls-card").scrollTop = 0), null);
    out[key].ring = await page.evaluate(RING);
    await browser.close();
    const w = out[key].occlusion.map((o) => o.worst).filter(Boolean).sort((a, b) => b.coveredFrac - a.coveredFrac)[0];
    console.log(
      key,
      "pins", out[key].occlusion[0].pins,
      "| worst cover", w ? `${w.pin}"${w.pinText}" over "${w.control}" ${w.coveredPx}px ${(w.coveredFrac * 100).toFixed(1)}% hit=${w.hit} isControl=${w.hitIsTheControl}` : "none",
      "| ring", `${out[key].ring.authored}/${out[key].ring.n} authored, ${out[key].ring.ua} UA`,
    );
  }
}
writeFileSync(join(OUT, "occlusion-and-ring.json"), JSON.stringify(out, null, 1));
console.log("banked readings/occlusion-and-ring.json");
