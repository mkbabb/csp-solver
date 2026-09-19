// CTRL-COST pass-1 · THE LADDER'S ACTS.
//
// Five questions the taxonomy stands or falls on, measured on a dirty board:
//   A · I4 UNDER THE LADDER — one tap on a tier-3 verb writes 0; one tap on a tier-2 verb
//       writes, and ONE press puts it back (the claim "reversible by undo" is a claim about
//       W1's spine, so it gets proved rather than asserted).
//   B · WHERE THE REVERSAL IS — with the sheet up on the phone the ribbon is `inert`, so the
//       undo a tier-2 act promises may be two taps away, not one.
//   C · I2′ / I3′ — the two owner's-eye rows restated so a DELETED bar can answer them.
//   D · the tap floor in BOTH dimensions, with a per-dimension negative control.
//   E · the armed word's contrast, light and dark, by the estate's own 2.3 method AND from
//       the engine's painted bytes.
//
//   node ladder-acts.mjs
//
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const sharp = (await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs")).default;
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
// The arm the B question forces: tier 2 keeps its reversal inside its own band on EVERY
// viewport, so `fill` and its undo are one tap apart wherever the band is.
const UNDO_IN_BAND = `
  const band = document.querySelector(".cost-band:nth-of-type(2) .cost-acts");
  for (const b of document.querySelectorAll(".play-controls button")) {
    const n = (b.getAttribute("aria-label") || "");
    if (/Undo|Redo/i.test(n)) { const c = b.cloneNode(true); c.className = "icon-btn cost-face cost-clone";
      c.addEventListener("click", () => b.click()); band && band.appendChild(c); }
  }`;

async function fresh(engine, cell, { dark = false } = {}) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    hasTouch: cell.coarse,
    isMobile: cell.coarse && engine === "chromium",
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
  await page.waitForTimeout(1500);
  return { browser, ctx, page };
}
const dirty = async (page) => {
  await page.evaluate(() => {
    const i = [...document.querySelectorAll(".sudoku-cell input")].filter(
      (x) => !x.readOnly && !x.disabled && !x.value,
    )[0];
    i?.focus();
  });
  await page.keyboard.type("5");
  await page.waitForTimeout(600);
};
const openSheet = async (page) => {
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
};
const apply = async (page, { undoInBand = false } = {}) => {
  await page.addStyleTag({ content: CSS });
  await page.evaluate(`(() => { ${JS_SRC} ; return window.__costCard(); })()`);
  if (undoInBand) await page.evaluate(`(() => { ${UNDO_IN_BAND} })()`);
  await page.waitForTimeout(350);
};
const cells = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join(""),
  );

const results = {};
const PART = process.env.PART || "all";

// ── A + B · the ladder's I4, and where the reversal is ──────────────────────────────────
if (PART === "all" || PART === "1")
for (const cell of [
  { name: "dock-390x844", w: 390, h: 844, coarse: true },
  { name: "desk-1280x800", w: 1280, h: 800, coarse: false },
]) {
  for (const engine of ["chromium", "webkit"]) {
    const key = `I4-${cell.name}-${engine}`;
    const rows = [];
    for (const verb of ["deal", "clear", "fill", "solve"]) {
      const { browser, page } = await fresh(engine, cell);
      await dirty(page);
      await openSheet(page);
      await apply(page, { undoInBand: true });
      const before = await cells(page);
      const hit = await page.evaluate((v) => {
        const find = (re) =>
          [...document.querySelectorAll(".cost-band button")].find((b) =>
            re.test((b.getAttribute("aria-label") || b.textContent || "")),
          );
        const b =
          v === "deal" ? find(/deal a new board/i)
          : v === "clear" ? find(/clear the board/i)
          : v === "fill" ? find(/Fill in every cell/i)
          : find(/Solve puzzle/i);
        if (!b) return { found: false };
        b.click();
        return {
          found: true,
          armed: !!b.closest(".is-armed") || b.classList.contains("is-armed"),
          tier: b.closest(".cost-band")?.querySelector(".cost-band-name")?.textContent ?? null,
        };
      }, verb);
      await page.waitForTimeout(2500);
      const after = await cells(page);
      const wrote = [...before].filter((c, i) => c !== after[i]).length;

      // the reversal, one press, from inside the band
      let undone = null;
      let undoReach = null;
      if (wrote > 0) {
        undoReach = await page.evaluate(() => {
          const ribbon = [...document.querySelectorAll(".play-controls button")].find((b) =>
            /Undo/i.test(b.getAttribute("aria-label") || ""),
          );
          const inBand = [...document.querySelectorAll(".cost-band button")].find((b) =>
            /Undo/i.test(b.getAttribute("aria-label") || ""),
          );
          const inertRibbon = !!ribbon && !!ribbon.closest("[inert]");
          return {
            ribbonPresent: !!ribbon,
            ribbonInert: inertRibbon,
            bandPresent: !!inBand,
          };
        });
        await page.evaluate(() => {
          const b = [...document.querySelectorAll(".cost-band button")].find((x) =>
            /Undo/i.test(x.getAttribute("aria-label") || ""),
          );
          b?.click();
        });
        await page.waitForTimeout(1200);
        const back = await cells(page);
        undone = back === before;
      }
      rows.push({ verb, ...hit, wrote, undone, undoReach });
      await browser.close();
    }
    results[key] = rows;
    console.log(
      `${key.padEnd(30)} ` +
        rows
          .map(
            (r) =>
              `${r.verb}[${r.tier ?? "?"}] wrote=${r.wrote}${r.undone === null ? "" : ` undone=${r.undone}`}`,
          )
          .join(" · "),
    );
  }
}

// ── C · I2′ and I3′ restated, D · the tap floor, E · contrast ───────────────────────────
if (PART === "all" || PART === "2")
for (const cell of [
  { name: "dock-390x844", w: 390, h: 844, coarse: true },
  { name: "desk-1280x800", w: 1280, h: 800, coarse: false },
]) {
  for (const engine of ["chromium", "webkit"]) {
    for (const dark of [false, true]) {
      const key = `${cell.name}-${engine}-${dark ? "dark" : "light"}`;
      const { browser, page } = await fresh(engine, cell, { dark });
      await openSheet(page);

      const I2prime = async () =>
        page.evaluate(() => {
          // I2′ — NO STRIP LIES OVER AN OPTION GROUP, AND ANY STRIP THAT EXISTS IS DRAWN.
          // I2 as written presumes the bar survives (`ownChrome && coverage < 5%`), so a
          // family that answers M04 by DELETING the bar can never green it. The law M04 states
          // is about what the reader sees, and a strip that is not there shows no borderless
          // slab and buries no compartment.
          const strips = [...document.querySelectorAll(".action-bar")].filter(
            (b) => getComputedStyle(b).display !== "none" && b.getBoundingClientRect().height > 0,
          );
          let worst = 0;
          let who = null;
          for (const s of strips) {
            const bb = s.getBoundingClientRect();
            for (const w of document.querySelectorAll(".tray-well, .cost-band")) {
              if (getComputedStyle(w).display === "none") continue;
              const wb = w.getBoundingClientRect();
              const ov =
                Math.max(0, Math.min(wb.bottom, bb.bottom) - Math.max(wb.top, bb.top)) *
                Math.max(0, Math.min(wb.right, bb.right) - Math.max(wb.left, bb.left));
              const f = ov / Math.max(1, wb.width * wb.height);
              if (f > worst) {
                worst = f;
                who = (w.querySelector(".washi-tag, .cost-band-name")?.textContent || "?").trim();
              }
            }
          }
          const drawn = strips.every((s) => {
            const cs = getComputedStyle(s);
            return (
              parseFloat(cs.borderTopWidth) > 0 ||
              cs.outlineStyle !== "none" ||
              !!s.querySelector(":scope > svg.outline-svg")
            );
          });
          return { strips: strips.length, drawn, worstCoverage: +worst.toFixed(3), worstGroup: who };
        });
      const I3prime = async () =>
        page.evaluate(async () => {
          // I3′ — AT EVERY SCROLL STATE, THE NAME AT THE TOP OF THE CARD NAMES THE GROUP
          // UNDER THE READER'S EYE. Same law as I3, but over any pinned group NAME rather
          // than over `.washi-tag` alone, so a taxonomy that stops using tapes still answers.
          const sc = [...document.querySelectorAll(".controls-card")].find(
            (e) => e.scrollHeight - e.clientHeight > 40,
          );
          if (!sc) return { skipped: "no overflowing scrollport at this cell" };
          const bad = [];
          const states = [0, 0.25, 0.5, 0.75, 1].map((f) =>
            Math.round(f * (sc.scrollHeight - sc.clientHeight)),
          );
          for (const st of states) {
            sc.scrollTop = st;
            await new Promise((r) => setTimeout(r, 240));
            const scb = sc.getBoundingClientRect();
            for (const tag of document.querySelectorAll(
              ".tray-well > .washi-tag, .cost-band-name",
            )) {
              const b = tag.getBoundingClientRect();
              if (b.top > scb.top + 30 || b.bottom < scb.top - 2) continue; // only what is PINNED at the head
              const group = tag.closest(".tray-well, .cost-band");
              if (!group) continue;
              const gb = group.getBoundingClientRect();
              const frac =
                Math.max(0, Math.min(gb.bottom, scb.bottom) - Math.max(gb.top, scb.top)) /
                Math.max(1, gb.height);
              if (frac < 0.5)
                bad.push({ at: st, name: tag.textContent.trim(), frac: +frac.toFixed(3) });
            }
          }
          sc.scrollTop = 0;
          return { violations: bad };
        });

      const control = { I2: await I2prime(), I3: await I3prime() };
      await apply(page, { undoInBand: true });
      const overlay = { I2: await I2prime(), I3: await I3prime() };

      // D · the tap floor, per dimension, with a NEGATIVE CONTROL that must fail
      const floor = await page.evaluate(() => {
        const probe = (w, h) => {
          const n = document.createElement("div");
          n.style.cssText = `position:fixed;left:0;top:0;width:${w}px;height:${h}px`;
          document.body.appendChild(n);
          const b = n.getBoundingClientRect();
          n.remove();
          return { w: b.width, h: b.height, wOK: b.width >= 44, hOK: b.height >= 44 };
        };
        const rows = [];
        for (const e of document.querySelectorAll(
          ".cost-face, .cost-row .ctrl-btn, .drawer-tab, .play-controls button",
        )) {
          const b = e.getBoundingClientRect();
          if (!b.width || !b.height) continue;
          rows.push({
            what:
              (e.getAttribute("aria-label") || e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 18) ||
              e.className,
            w: +b.width.toFixed(2),
            h: +b.height.toFixed(2),
          });
        }
        return {
          coarse: matchMedia("(pointer: coarse)").matches,
          n: rows.length,
          worstW: Math.min(...rows.map((r) => r.w)),
          worstH: Math.min(...rows.map((r) => r.h)),
          failW: rows.filter((r) => r.w < 44).map((r) => `${r.what} ${r.w}`),
          failH: rows.filter((r) => r.h < 44).map((r) => `${r.what} ${r.h}`),
          negativeControl: { narrow: probe(43, 60), short: probe(60, 43), ok: probe(44, 44) },
        };
      });

      // E · the armed word — composited ratio (the estate's 2.3 method) …
      const armedRead = await page.evaluate(() => {
        const f = document.querySelector(".cost-face-destructive");
        f?.scrollIntoView({ block: "center" });
        f?.click();
        return new Promise((r) =>
          setTimeout(() => {
            const w = f?.querySelector(".cost-word-armed");
            const s = f?.querySelector(".cost-secondline");
            const box = w?.getBoundingClientRect();
            r({
              armedText: w?.textContent,
              color: w ? getComputedStyle(w).color : null,
              weight: w ? getComputedStyle(w).fontWeight : null,
              px: w ? +parseFloat(getComputedStyle(w).fontSize).toFixed(2) : null,
              visible: w ? getComputedStyle(w).visibility : null,
              second: s ? getComputedStyle(s).visibility : null,
              box: box ? { x: box.x, y: box.y, w: box.width, h: box.height } : null,
            });
          }, 320),
        );
      });

      // … and from the ENGINE'S PAINTED BYTES: screenshot the armed word's own box, take the
      // darkest-vs-lightest pixel pair actually painted there, and compute WCAG on those.
      let painted = null;
      if (armedRead?.box && armedRead.box.w > 2 && armedRead.box.h > 2) {
        const clip = {
          x: Math.max(0, Math.floor(armedRead.box.x) - 2),
          y: Math.max(0, Math.floor(armedRead.box.y) - 2),
          width: Math.ceil(armedRead.box.w) + 4,
          height: Math.ceil(armedRead.box.h) + 4,
        };
        const buf = await page.screenshot({ clip });
        const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
        const lum = (r, g, b) => {
          const f = (x) => {
            const v = x / 255;
            return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          };
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        };
        const ls = [];
        for (let i = 0; i < data.length; i += info.channels)
          ls.push({ l: lum(data[i], data[i + 1], data[i + 2]), rgb: [data[i], data[i + 1], data[i + 2]] });
        ls.sort((a, b) => a.l - b.l);
        const ink = ls[Math.floor(ls.length * 0.02)];
        const paper = ls[Math.floor(ls.length * 0.98)];
        const [hi, lo] = [ink.l, paper.l].sort((a, b) => b - a);
        painted = {
          pixels: ls.length,
          ink: ink.rgb,
          paper: paper.rgb,
          ratio: +(((hi + 0.05) / (lo + 0.05)).toFixed(2)),
        };
      }

      results[key] = { control, overlay, floor, armedRead, painted };
      console.log(
        `${key.padEnd(34)} I2′ strips ${control.I2.strips}→${overlay.I2.strips} cover ${control.I2.worstCoverage}→${overlay.I2.worstCoverage} · ` +
          `I3′ ${JSON.stringify(control.I3.violations?.length ?? control.I3.skipped)}→${JSON.stringify(overlay.I3.violations?.length ?? overlay.I3.skipped)} · ` +
          `floor ${floor.worstW}×${floor.worstH} failW ${floor.failW.length} failH ${floor.failH.length} · ` +
          `armed "${armedRead.armedText}" ${armedRead.color} painted ${painted?.ratio}`,
      );
      await browser.close();
    }
  }
}

writeFileSync(resolve(OUT, `ladder-acts${PART === "all" ? "" : "-p" + PART}.json`), JSON.stringify(results, null, 1));
console.log("\nbanked readings/ladder-acts.json");
