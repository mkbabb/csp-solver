// T9-W7 · pass 2 · CTRL-TABS — the rows this pass mints. Chunked by STAGE so a kill loses one
// stage, not the run:  STAGE=geometry|regions|guard|shortend|desk node .scratch-w7/p2.probe.mjs
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4232/";
const STAGE = process.env.STAGE || "geometry";
const OUT = process.env.OUT || `/tmp/p2-${STAGE}.json`;
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
// Analytic composite: ink alpha over the effective ground, ancestor `opacity` chain folded in.
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
    await page.waitForTimeout(950); // the sheet SLIDES
  }
};

const out = {};
const cellsFor = {
  geometry: [
    { name: "390x844", w: 390, h: 844, mobile: true, sheet: true },
    { name: "1280x800", w: 1280, h: 800, mobile: false, sheet: false },
  ],
  regions: [{ name: "390x844", w: 390, h: 844, mobile: true, sheet: true }],
  guard: [
    { name: "390x844-light", w: 390, h: 844, mobile: true, sheet: true, theme: "light" },
    { name: "390x844-dark", w: 390, h: 844, mobile: true, sheet: true, theme: "dark" },
  ],
  shortend: [
    { name: "360x560", w: 360, h: 560, mobile: true, sheet: true },
    { name: "360x500", w: 360, h: 500, mobile: true, sheet: true },
    { name: "320x530", w: 320, h: 530, mobile: true, sheet: true },
    { name: "390x530", w: 390, h: 530, mobile: true, sheet: true },
  ],
  desk: [
    { name: "1280x800", w: 1280, h: 800, mobile: false, sheet: false },
    { name: "1440x900", w: 1440, h: 900, mobile: false, sheet: false },
  ],
  board: [
    { name: "390x844", w: 390, h: 844, mobile: true, sheet: false },
    { name: "375x812", w: 375, h: 812, mobile: true, sheet: false },
  ],
};

for (const engine of ENGINES) {
  for (const cell of cellsFor[STAGE]) {
    const key = `${cell.name}-${engine}`;
    let ctxo;
    try {
      ctxo = await open(engine, cell);
      const { page } = ctxo;

      if (STAGE === "regions") {
        // HALF ONE — the tray is DOWN (the default face is `new game`).
        const down = {
          log: await page.getByRole("log").count(),
          status: await page.getByRole("status").count(),
          inviteByRole: await page.getByRole("button", { name: /invite|share this board/i }).count(),
          rosterVoice: await page.locator(".roster-voice").count(),
          rosterStatus: await page.locator(".roster-status").count(),
          bornEmpty: await page.evaluate(() =>
            [...document.querySelectorAll(".roster-voice, .roster-status, .copy-status")].map(
              (e) => ({ cls: e.className, text: e.textContent.trim() }),
            ),
          ),
          trayLive: await page.evaluate(
            () => document.querySelectorAll('.tray [aria-live], .tray [role="log"]').length,
          ),
        };
        await raise(page);
        const up = { log: await page.getByRole("log").count() };
        await page.locator('[role="tab"]').filter({ hasText: "players" }).click();
        await page.waitForTimeout(400);
        const players = {
          log: await page.getByRole("log").count(),
          inviteByRole: await page
            .getByRole("button", { name: /invite|share this board/i })
            .count(),
          inviteDom: await page.locator(".invite-btn").count(),
        };
        out[key] = { down, up, players };
      }

      if (STAGE === "geometry") {
        if (cell.sheet) await raise(page);
        out[key] = await page.evaluate(() => {
          const raised = document.querySelector(".tab.is-raised");
          const cse = document.querySelector(".case-body");
          const cs = raised && getComputedStyle(raised, "::after");
          const pathOf = (el) =>
            el
              ? [...el.querySelectorAll(".boil-pose.is-active path")].map((p) =>
                  (p.getAttribute("d") || "").trim(),
                )
              : [];
          const d = pathOf(raised)[0] || "";
          const cd = pathOf(cse)[0] || "";
          const r = raised?.getBoundingClientRect();
          const c = cse?.getBoundingClientRect();
          return {
            afterContent: cs ? cs.content : "(no raised tab)",
            afterWidth: cs ? cs.width : null,
            // An OPEN path has no `Z`; the closed ring the estate always drew ends with one.
            tabPathClosed: /Z\s*$/.test(d),
            lidPathClosed: /Z\s*$/.test(cd),
            tabPathPoints: (d.match(/[ML]/g) || []).length,
            lidPathPoints: (cd.match(/[ML]/g) || []).length,
            tabBox: r && { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) },
            caseBox: c && { x: +c.x.toFixed(2), y: +c.y.toFixed(2), w: +c.width.toFixed(2), h: +c.height.toFixed(2) },
            // The seam the tab's open feet must land on: the tab's drawn bottom (border box +
            // outset 3) against the case's drawn lid (border box − outset 3).
            footVsLid: r && c ? +(r.bottom + 3 - (c.top - 3)).toFixed(2) : null,
            flankFootVsLid: r && c ? +(r.right + 3 - (c.left - 3)).toFixed(2) : null,
            // url(# inside a hidden tray: the census counts it, so it must be zero.
            urlInInertTray: [...document.querySelectorAll(".tray[inert] *")].filter((e) => {
              const s = getComputedStyle(e);
              return /url\(/.test(s.filter) || /url\(/.test(s.backdropFilter || "");
            }).length,
            inertTrays: document.querySelectorAll(".tray[inert]").length,
            inertTrayVisibility: [...document.querySelectorAll(".tray[inert]")].map(
              (t) => getComputedStyle(t).visibility,
            ),
            cardH: +(document.querySelector(".controls-card")?.getBoundingClientRect().height ?? 0).toFixed(2),
            cardScroll: (() => {
              const c2 = document.querySelector(".controls-card");
              return c2 ? { sh: c2.scrollHeight, ch: c2.clientHeight } : null;
            })(),
          };
        });
      }

      if (STAGE === "guard") {
        // The guard only arms on a coarse pointer with a DIRTY board (`asksFirst`), so the
        // board is dirtied through the app's own input before the verb is pressed — the ribbon
        // is put up by the product's predicate, never faked.
        // An EMPTY cell — the givens are inputs too, and typing into one writes nothing.
        const idx = await page.evaluate(() =>
          [...document.querySelectorAll(".game-cell input")].findIndex((i) => !i.value),
        );
        if (idx >= 0) {
          await page.locator(".game-cell input").nth(idx).click({ force: true });
          await page.keyboard.press("5");
          await page.waitForTimeout(400);
        }
        await raise(page);
        // Arm `clear`: the guard ribbon only arms on a coarse pointer with a dirty board, so the
        // ribbon is put up through the component's own state rather than faked in CSS.
        const armed = await page.evaluate(() => {
          const btn = document.querySelector('.action-verbs [data-verb="clear"]');
          if (!btn) return "no clear";
          btn.click();
          return "clicked";
        });
        await page.waitForTimeout(400);
        out[key] = await page.evaluate(
          ({ armed }) => {
            const L = (r, g, b) => {
              const f = (x) => {
                const v = x / 255;
                return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
              };
              return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
            };
            const R = (a, b) => {
              const [x, y] = [a, b].sort((m, n) => n - m);
              return +((x + 0.05) / (y + 0.05)).toFixed(2);
            };
            const px = (c) => (c.match(/[\d.]+/g) || []).slice(0, 4).map(Number);
            const comp = (fg, bg) => {
              const a = fg.length > 3 ? fg[3] : 1;
              return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
            };
            const card = px(getComputedStyle(document.querySelector(".controls-card")).backgroundColor);
            const go = document.querySelector(".guard-go");
            const keep = document.querySelector(".guard-keep");
            if (!go) return { armed, ribbon: false };
            const goFace = go.querySelector(".guard-face");
            const keepFace = keep?.querySelector(".guard-face");
            const gb = px(getComputedStyle(goFace).backgroundColor);
            const kb = px(getComputedStyle(keepFace).backgroundColor);
            const goGround = gb.length > 3 && gb[3] === 0 ? card : comp(gb, card);
            const keepGround = kb.length > 3 && kb[3] === 0 ? card : comp(kb, card);
            const goInk = px(getComputedStyle(go).color);
            const keepInk = px(getComputedStyle(keep).color);
            const stroke = (el) => {
              const p = el?.querySelector(".boil-pose.is-active path");
              return p ? getComputedStyle(p).stroke : null;
            };
            const grey = (c) => {
              const l = L(...c);
              return l;
            };
            const goBox = go.getBoundingClientRect();
            const keepBox = keep.getBoundingClientRect();
            return {
              armed,
              ribbon: true,
              question: document.querySelector(".guard-ask")?.textContent.trim(),
              goInk: getComputedStyle(go).color,
              goFaceGround: getComputedStyle(goFace).backgroundColor,
              goWordOnItsGround: R(L(...comp(goInk, goGround)), L(...goGround)),
              goWordOnCard: R(L(...comp(goInk, card)), L(...card)),
              goGroundVsCard: R(L(...goGround), L(...card)),
              keepWordOnCard: R(L(...comp(keepInk, card)), L(...card)),
              // the non-colour channel, measured: the greyscale gap between the two WORDS
              greyscaleGapBetweenWords: R(grey(comp(goInk, card)), grey(comp(keepInk, card))),
              goDrawn: stroke(goFace),
              keepDrawn: stroke(keepFace),
              keepHasBox: !!keepFace?.querySelector(".boil-pose.is-active path"),
              goHasBox: !!goFace?.querySelector(".boil-pose.is-active path"),
              goBox: { w: +goBox.width.toFixed(2), h: +goBox.height.toFixed(2) },
              keepBox: { w: +keepBox.width.toFixed(2), h: +keepBox.height.toFixed(2) },
              focusOnKeep: document.activeElement?.classList.contains("guard-keep"),
            };
          },
          { armed },
        );
        // Escape disarms, conditionally
        await page.keyboard.press("Escape");
        await page.waitForTimeout(250);
        out[key].escapeDisarms = await page.locator(".guard-row").count();
      }

      if (STAGE === "shortend" || STAGE === "board" || STAGE === "desk") {
        if (cell.sheet) await raise(page);
        out[key] = await page.evaluate(() => {
          const c = document.querySelector(".controls-card");
          const board =
            document.querySelector(".board-wrapper") || document.querySelector(".sudoku-board");
          const br = board?.getBoundingClientRect();
          const scrollers = [...document.querySelectorAll("*")].filter(
            (e) => e.scrollHeight - e.clientHeight > 1 && /auto|scroll/.test(getComputedStyle(e).overflowY),
          ).length;
          const verbs = [...document.querySelectorAll(".action-verbs > *")].map((e) => {
            const r = e.getBoundingClientRect();
            return {
              cls: e.className.toString().slice(0, 40),
              t: e.textContent.replace(/\s+/g, " ").trim().slice(0, 18),
              y: +r.y.toFixed(2),
              w: +r.width.toFixed(2),
              h: +r.height.toFixed(2),
            };
          });
          return {
            vh: window.innerHeight,
            card: c && { sh: c.scrollHeight, ch: c.clientHeight, over: c.scrollHeight - c.clientHeight, h: +c.getBoundingClientRect().height.toFixed(2) },
            docOver: document.documentElement.scrollHeight - window.innerHeight,
            scrollers,
            board: br && { x: +br.x.toFixed(2), y: +br.y.toFixed(2), w: +br.width.toFixed(2), h: +br.height.toFixed(2) },
            boardEdgeH: +(document.querySelector(".board-edge")?.getBoundingClientRect().height ?? 0).toFixed(2),
            verbs,
            floorRows: [...new Set(verbs.filter((v) => v.h > 0).map((v) => Math.round(v.y)))].length,
          };
        });
      }
      console.log(`[${STAGE} ${key}] ` + JSON.stringify(out[key]).slice(0, 460));
    } catch (e) {
      out[key] = { error: String(e).slice(0, 300) };
      console.log(`[${STAGE} ${key}] ERROR ${String(e).slice(0, 220)}`);
    }
    await ctxo?.browser.close();
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("banked " + OUT);
