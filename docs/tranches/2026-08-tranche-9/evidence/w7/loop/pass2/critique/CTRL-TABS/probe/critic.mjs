// T9-W7 pass 2 · CTRL-TABS CRITIC — independent re-measurement of the prototype's own rows.
// STAGE=guard|desk|shut|shortend node critic.mjs   (both engines, own port, own cacheDir)
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4237/";
const STAGE = process.env.STAGE || "guard";
const OUT = process.env.OUT || `/tmp/critic-${STAGE}.json`;
const ENGINES = (process.env.ENGINES || "chromium,webkit").split(",");

const lum = (r, g, b) => {
  const f = (x) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [a, b].sort((x, y) => y - x);
  return +((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
};
const parse = (c) => (c.match(/[\d.]+/g) || []).slice(0, 4).map(Number);
const over = (fg, bg) => {
  const a = fg.length > 3 ? fg[3] : 1;
  return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
};

async function open(engine, cell) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    isMobile: cell.mobile && engine === "chromium" ? true : undefined,
    hasTouch: !!cell.mobile,
    colorScheme: cell.theme || "light",
  });
  await ctx.addInitScript((t) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", t);
    } catch {}
  }, cell.theme || "light");
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1200);
  return { browser, page };
}
const raise = async (page) => {
  const tab = page.locator(".drawer-tab");
  if (await tab.count()) {
    await tab.click({ force: true });
    await page.waitForTimeout(950);
  }
};

// The modal (most common) pixel inside a rect, from a real screenshot: the ground as RENDERED.
async function modalPixel(page, rect) {
  const buf = await page.screenshot({
    clip: { x: rect.x, y: rect.y, width: rect.w, height: rect.h },
  });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const tally = new Map();
  for (let i = 0; i < data.length; i += info.channels) {
    const k = `${data[i]},${data[i + 1]},${data[i + 2]}`;
    tally.set(k, (tally.get(k) || 0) + 1);
  }
  let best = null,
    n = 0;
  for (const [k, v] of tally) if (v > n) ((best = k), (n = v));
  return { rgb: best.split(",").map(Number), share: +(n / (info.width * info.height)).toFixed(3) };
}

const census = () =>
  document.querySelectorAll ? null : null;

const out = {};

for (const engine of ENGINES) {
  const cells = {
    guard: [
      { name: "390x844-light", w: 390, h: 844, mobile: true, sheet: false, theme: "light" },
      { name: "390x844-dark", w: 390, h: 844, mobile: true, sheet: false, theme: "dark" },
    ],
    desk: [{ name: "1280x800", w: 1280, h: 800, theme: "light" }],
    shut: [{ name: "390x844", w: 390, h: 844, mobile: true, theme: "light" }],
    shortend: [
      { name: "360x560", w: 360, h: 560, mobile: true, sheet: true, theme: "light" },
      { name: "360x500", w: 360, h: 500, mobile: true, sheet: true, theme: "light" },
    ],
  }[STAGE];

  for (const cell of cells) {
    const key = `${cell.name}-${engine}`;
    let o;
    try {
      o = await open(engine, cell);
      const { page } = o;
      if (cell.sheet) await raise(page);

      if (STAGE === "guard") {
        // Arm the destructive verb through the product's own predicate: dirty an EMPTY cell
        // (givens are inputs too), then press `clear`.
        const idx = await page.evaluate(() =>
          [...document.querySelectorAll(".game-cell input")].findIndex((i) => !i.value),
        );
        if (idx >= 0) {
          await page.locator(".game-cell input").nth(idx).click({ force: true });
          await page.keyboard.press("5");
          await page.waitForTimeout(400);
        }
        await raise(page);
        const armed = await page.evaluate(() => {
          const b = document.querySelector('.action-verbs [data-verb="clear"]');
          if (!b) return "NO CLEAR BUTTON";
          b.click();
          return "clicked";
        });
        console.log("ARM:", armed);
        await page.waitForTimeout(700);

        const geo = await page.evaluate(() => {
          const norm = (s) => (s || "").replace(/\s+/g, " ").trim();
          const pick = (w) =>
            document.querySelector(w === "keep" ? ".guard-keep" : ".guard-go") || null;
          const info = (b) => {
            if (!b) return null;
            const r = b.getBoundingClientRect();
            const cs = getComputedStyle(b);
            const svg = b.querySelector("svg");
            // fold the ancestor opacity chain
            let op = 1,
              n = b;
            while (n && n !== document.documentElement) {
              op *= parseFloat(getComputedStyle(n).opacity || "1");
              n = n.parentElement;
            }
            return {
              text: norm(b.textContent),
              color: cs.color,
              opacityChain: +op.toFixed(4),
              rect: { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) },
              drawnBox: !!svg,
              bg: cs.backgroundColor,
            };
          };
          const raised = document.querySelector(".tab.is-raised");
          const after = raised ? getComputedStyle(raised, "::after").content : "n/a";
          const rawFaces = raised
            ? [...raised.querySelectorAll("path")].map((p) => (p.getAttribute("d") || "").trim().slice(-1))
            : [];
          const card = document.querySelector(".controls-card");
          const headings = [...(card ? card.querySelectorAll("h1,h2,h3,h4,h5,h6") : [])].map(
            (h) => ({ tag: h.tagName, text: norm(h.textContent), aria: h.getAttribute("aria-label") || null }),
          );
          return {
            keep: info(pick("keep")),
            clear: info(pick("clear")),
            raisedAfter: after,
            raisedPathEnds: rawFaces,
            cardBg: card ? getComputedStyle(card).backgroundColor : null,
            headings,
            emptyHeadings: headings.filter((h) => !h.text).length,
            logs: document.querySelectorAll('[role="log"]').length,
          };
        });

        const res = { ...geo, measured: {} };
        for (const w of ["keep", "clear"]) {
          const b = geo[w];
          if (!b) continue;
          const ground = await modalPixel(page, {
            x: b.rect.x,
            y: b.rect.y,
            w: Math.max(1, b.rect.w),
            h: Math.max(1, b.rect.h),
          });
          const fg = parse(b.color);
          const inkOnGround = over(
            [fg[0], fg[1], fg[2], (fg[3] ?? 1) * b.opacityChain],
            ground.rgb,
          );
          res.measured[w] = {
            renderedGround: ground.rgb,
            groundShare: ground.share,
            ink: b.color,
            ratio: ratio(lum(...inkOnGround), lum(...ground.rgb)),
          };
        }
        const cardRgb = parse(geo.cardBg);
        res.measured.cardRgb = cardRgb;
        for (const w of ["keep", "clear"]) {
          if (!res.measured[w]) continue;
          res.measured[w].groundVsCard = ratio(
            lum(...res.measured[w].renderedGround),
            lum(cardRgb[0], cardRgb[1], cardRgb[2]),
          );
        }
        out[key] = res;
      }

      if (STAGE === "desk") {
        out[key] = await page.evaluate(() => {
          const norm = (s) => (s || "").replace(/\s+/g, " ").trim();
          const r = (el) => {
            if (!el) return null;
            const b = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return {
              x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2),
              display: cs.display, visibility: cs.visibility, text: norm(el.textContent),
            };
          };
          const peek = document.querySelector(".peek-chip");
          const floor = [...document.querySelectorAll(".controls-card .icon-btn, .controls-card .difficulty-tally")].map(
            (e) => ({ t: norm(e.textContent).slice(0, 12), y: +e.getBoundingClientRect().y.toFixed(2) }),
          );
          const raised = document.querySelector(".tab.is-raised");
          const card = document.querySelector(".controls-card");
          const headings = [...(card ? card.querySelectorAll("h1,h2,h3,h4,h5,h6") : [])].map((h) => norm(h.textContent));
          return {
            peek: r(peek),
            peekTextVisible: peek ? !!norm(peek.textContent) && peek.getBoundingClientRect().width > 0 : false,
            floorTops: [...new Set(floor.map((f) => f.y))],
            floor,
            raisedAfter: raised ? getComputedStyle(raised, "::after").content : "n/a",
            headings,
            emptyHeadings: headings.filter((h) => !h).length,
            board: r(document.querySelector(".game-board, .board-frame, .sudoku-board")),
            tablists: document.querySelectorAll('[role="tablist"]').length,
            tabs: document.querySelectorAll('[role="tab"]').length,
          };
        });
      }

      if (STAGE === "shut") {
        out[key] = await page.evaluate(() => {
          const r = (el) => {
            if (!el) return null;
            const b = el.getBoundingClientRect();
            return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
          };
          const board =
            document.querySelector(".board-frame") ||
            document.querySelector(".game-board") ||
            document.querySelector("[class*=board]");
          const strip =
            document.querySelector("#board-edge-tools") ||
            document.querySelector(".board-edge-strip") ||
            document.querySelector("[class*=edge-tools]");
          const tools = [...document.querySelectorAll("button")].filter((b) =>
            /^(undo|redo|hint|controls)$/i.test((b.textContent || "").replace(/\s+/g, " ").trim()),
          );
          return {
            board: r(board),
            boardClass: board ? board.className : null,
            strip: r(strip),
            stripClass: strip ? strip.className : null,
            tools: tools.map((t) => ({
              t: (t.textContent || "").replace(/\s+/g, " ").trim(),
              ...r(t),
            })),
            stripCssVar: getComputedStyle(document.documentElement).getPropertyValue("--edge-strip-h"),
          };
        });
      }

      if (STAGE === "shortend") {
        out[key] = await page.evaluate(() => {
          const card = document.querySelector(".controls-card");
          const de = document.documentElement;
          return {
            vh: window.innerHeight,
            card: card
              ? {
                  sh: card.scrollHeight,
                  ch: card.clientHeight,
                  over: card.scrollHeight - card.clientHeight,
                }
              : null,
            docOver: de.scrollHeight - de.clientHeight,
            law: card ? window.innerHeight - card.clientHeight : null,
          };
        });
      }
    } catch (e) {
      out[key] = { error: String(e).slice(0, 300) };
    } finally {
      if (o) await o.browser.close();
    }
  }
}

writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("WROTE", OUT);
console.log("EXIT-OK");
