/**
 * PLR-COUNT pass-1 PROTOTYPE PROBE — the tally as the player mark.
 *
 * Read-only on the product: the mark is mounted as an overlay over the LIVE head by
 * `page.evaluate`, drawn with the product's OWN geometry (`generateLineBoilFrames` +
 * `FILTER_PRESETS['grain-static'].grain`) and the product's OWN ink formula (`inkFor`).
 * Nothing in `src/` is touched.
 *
 * Rows
 *   P1 GEOMETRY + THE FLOOR   — the drawn stroke's px width at both widths; 44px per dimension
 *                               with a per-dimension negative control.
 *   P2 CONTRAST               — canvas read-back, every mark's own 1.4.11 ratio at its DRAWN
 *                               opacity (0.95) on four grounds.
 *   P3 THE STRIP              — N = 1..12 per object, dpr3, for the blind read; plus the
 *                               separation census off the painted bytes (written by pixels.mjs).
 *   P4 I3                     — the r0 instrument, re-run against the overlay.
 *   P5 THE REGISTER           — the lobby at N = 3 and N = 16.
 *   P6 F1 / TWO COLOURS       — your digits blue, your mark in the room's ink, in one frame.
 */
import { test, expect, type Page } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";
import { OVERLAY_SRC } from "./proto-overlay";

const OUT = process.env.PLR_OUT!;
const SOLO = "./?size=3&difficulty=EASY&wire=local";
test.setTimeout(240000);

function bank(name: string, data: unknown) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2));
}
function appendLog(line: string) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.appendFileSync(path.join(OUT, "proto.log"), line + "\n");
}

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

async function headAnchor(page: Page) {
  return page.evaluate(() => {
    // Both @mbabb instances are always in the DOM (`v-show`); take the VISIBLE one.
    const t = [...document.querySelectorAll<HTMLElement>(".attribution-trigger")].find(
      (e) => e.getBoundingClientRect().width > 0,
    )!;
    const r = t.getBoundingClientRect();
    const sun = [...document.querySelectorAll<HTMLElement>(
      ".corner-right, .celestial-toggle, [class*='celestial']",
    )].find((e) => e.getBoundingClientRect().width > 0);
    const sr = sun?.getBoundingClientRect();
    return {
      trigger: { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) },
      sun: sr ? { x: +sr.x.toFixed(2), w: +sr.width.toFixed(2) } : null,
      band: sr ? +(sr.x - (r.x + r.width)).toFixed(2) : null,
      vw: window.innerWidth,
    };
  });
}

type Mount = {
  object: string; n: number; viewBoxW: number; viewBoxH: number; label: string;
  pxPerUnit: number; strokeUnits: number; strokePx: number;
  svg: { w: number; h: number; x: number; y: number };
  btn: { w: number; h: number; x: number; y: number };
  written: string | null;
  marks: { i: number; kind: string; cx: number; ink: string }[];
};

async function mount(page: Page, o: Record<string, unknown>): Promise<Mount> {
  // Playwright evaluates a STRING as an expression and does not call it, so the call is
  // written into the expression (the overlay source is already a parenthesised arrow fn).
  return (await page.evaluate(`${OVERLAY_SRC}(${JSON.stringify(o)})`)) as Mount;
}

// ── the contrast read-back (the engine's painted bytes, four grounds) ───────────────────────
async function contrast(page: Page, inks: string[], alpha: number) {
  return page.evaluate(
    async ({ inks, alpha }) => {
      const probe = document.createElement("div");
      probe.style.cssText = "position:fixed;left:-9999px;";
      document.body.appendChild(probe);
      const resolve = (v: string) => {
        probe.style.backgroundColor = "";
        probe.style.backgroundColor = v;
        return getComputedStyle(probe).backgroundColor;
      };
      const out: Record<string, unknown> = {};
      const lum = (r: number, g: number, b: number) => {
        const f = (c: number) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const ratio = (a: number[], b: number[]) => {
        const l1 = lum(a[0], a[1], a[2]), l2 = lum(b[0], b[1], b[2]);
        const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
        return (hi + 0.05) / (lo + 0.05);
      };
      const cv = document.createElement("canvas");
      cv.width = cv.height = 8;
      const cx = cv.getContext("2d", { willReadFrequently: true })!;
      const paint = (ground: string, ink: string, a: number) => {
        cx.globalAlpha = 1; cx.fillStyle = ground; cx.fillRect(0, 0, 8, 8);
        cx.globalAlpha = a; cx.fillStyle = ink; cx.fillRect(0, 0, 8, 8);
        cx.globalAlpha = 1;
        return [...cx.getImageData(4, 4, 1, 1).data].slice(0, 3);
      };
      const groundBytes = (v: string) => {
        cx.globalAlpha = 1; cx.fillStyle = resolve(v); cx.fillRect(0, 0, 8, 8);
        return [...cx.getImageData(4, 4, 1, 1).data].slice(0, 3);
      };

      for (const theme of ["light", "dark"] as const) {
        document.documentElement.classList.toggle("dark", theme === "dark");
        // let the cascade settle before reading the vars
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const l = getComputedStyle(document.documentElement).getPropertyValue("--peer-ink-l").trim();
        const grounds = {
          background: groundBytes("var(--color-background)"),
          card: groundBytes("var(--color-card)"),
        };
        const rows: unknown[] = [];
        for (let i = 0; i < inks.length; i++) {
          const css = inks[i].replace("var(--peer-ink-l)", l);
          const litCss = css.includes("var(") ? resolve(css) : css;
          const r: Record<string, unknown> = { i, css: litCss };
          for (const [gname, g] of Object.entries(grounds)) {
            const composed = paint(`rgb(${g[0]},${g[1]},${g[2]})`, litCss, alpha);
            r[gname] = { composed, ratio: +ratio(composed, g).toFixed(3) };
          }
          rows.push(r);
        }
        out[theme] = { peerInkL: l, grounds, rows };
      }
      document.documentElement.classList.remove("dark");
      probe.remove();
      return out;
    },
    { inks, alpha },
  );
}

const INKS12 = Array.from(
  { length: 16 },
  (_, i) => `oklch(var(--peer-ink-l) 0.11 ${((i * 137.5) % 360).toFixed(1)}deg)`,
);

// ═══════════════════════════════════════════════════════════════════════════════════════════
test("P1+P2+P3 — geometry, the floor, contrast, the strips", async ({ page }, info) => {
  const engine = info.project.name;
  for (const vp of [{ w: 390, h: 844, tag: "390x844" }, { w: 1280, h: 800, tag: "1280x800" }]) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto(SOLO);
    await settled(page);
    const anchor = await headAnchor(page);
    appendLog(`P1|${engine}|${vp.tag}|head=${JSON.stringify(anchor)}`);

    // The live DifficultyTally, for the family's own scale reference.
    const dt = await page.evaluate(() => {
      const el = document.querySelector<SVGSVGElement>(".difficulty-tally .dt-marks");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = document.querySelector<SVGPathElement>(".difficulty-tally .dt-stroke.inked");
      return {
        box: { w: +r.width.toFixed(2), h: +r.height.toFixed(2) },
        pxPerUnit: +(r.height / 44).toFixed(4),
        strokePx: +((r.height / 44) * 3.2).toFixed(3),
        inkedStrokeWidth: s ? getComputedStyle(s).strokeWidth : null,
        inkedOpacity: s ? getComputedStyle(s).strokeOpacity : null,
        colour: s ? getComputedStyle(s).stroke : null,
      };
    });
    appendLog(`P1|${engine}|${vp.tag}|DifficultyTally=${JSON.stringify(dt)}`);

    const left = +(anchor.trigger.x + anchor.trigger.w + 8).toFixed(2);
    const top = +anchor.trigger.y.toFixed(2);

    const rows: unknown[] = [];
    for (const object of ["stroke", "plain", "stub"]) {
      for (const heightPx of [30, 36, 44]) {
        const m = await mount(page, {
          object, n: 3, heightPx, threshold: 10, left, top, floorPx: 44, soloGraphite: true,
        });
        rows.push({
          object, heightPx,
          pxPerUnit: +m.pxPerUnit.toFixed(4),
          strokePx: +m.strokePx.toFixed(3),
          svg: m.svg, btn: m.btn,
        });
      }
      // width sweep: what N costs in the band
      const widths: Record<string, unknown> = {};
      for (const n of [1, 2, 3, 4, 5, 6, 8, 10, 12, 16]) {
        const m = await mount(page, {
          object, n, heightPx: 36, threshold: 10, left, top, floorPx: 44, soloGraphite: true,
        });
        widths[String(n)] = {
          svgW: m.svg.w, btnW: m.btn.w, btnH: m.btn.h, written: m.written,
          fitsBand: anchor.band === null ? null : m.btn.w <= anchor.band,
        };
      }
      rows.push({ object, widthSweep: widths, band: anchor.band });
    }
    bank(`p1-geometry-${engine}-${vp.tag}.json`, { anchor, difficultyTally: dt, rows });
    appendLog(`P1|${engine}|${vp.tag}|rows=${JSON.stringify(rows)}`);

    // ── the 44 floor, per dimension, with a negative control ───────────────────────────────
    const good = await mount(page, {
      object: "stroke", n: 1, heightPx: 36, threshold: 10, left, top, floorPx: 44, soloGraphite: true,
    });
    const bad = await mount(page, {
      object: "stroke", n: 1, heightPx: 36, threshold: 10, left, top, floorPx: 40, soloGraphite: true,
    });
    const floor = {
      armed: { w: good.btn.w, h: good.btn.h, wPass: good.btn.w >= 44, hPass: good.btn.h >= 44 },
      negativeControl: { w: bad.btn.w, h: bad.btn.h, wPass: bad.btn.w >= 44, hPass: bad.btn.h >= 44 },
    };
    appendLog(`P1-FLOOR|${engine}|${vp.tag}|${JSON.stringify(floor)}`);
    bank(`p1-floor-${engine}-${vp.tag}.json`, floor);
    expect(floor.armed.wPass && floor.armed.hPass, "the armed mark clears 44 in both dimensions").toBe(true);
    expect(floor.negativeControl.hPass, "the negative control must FAIL the height floor").toBe(false);
  }

  // ── P2 contrast: every mark's ink at its DRAWN opacity on four grounds ───────────────────
  await page.setViewportSize({ width: 1280, height: 800 });
  const inks = [...INKS12, "var(--color-pencil-graphite, var(--grid-line-color))"];
  const c095 = await contrast(page, inks, 0.95);
  const c100 = await contrast(page, inks, 1.0);
  bank(`p2-contrast-${engine}.json`, { alpha095: c095, alpha100: c100 });
  const worst = (o: any) => {
    let w = Infinity, at = "";
    for (const theme of ["light", "dark"]) {
      for (const r of o[theme].rows) {
        for (const g of ["background", "card"]) {
          if (r[g].ratio < w) { w = r[g].ratio; at = `${theme}/${g}/i=${r.i}`; }
        }
      }
    }
    return { worst: +w.toFixed(3), at };
  };
  appendLog(`P2|${engine}|alpha0.95|${JSON.stringify(worst(c095))}|alpha1.0|${JSON.stringify(worst(c100))}`);
});

// ═══════════════════════════════════════════════════════════════════════════════════════════
test("P3 — the strips, dpr3, both themes", async ({ browser }, info) => {
  const engine = info.project.name;
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    await page.goto(SOLO);
    await settled(page);
    if (theme === "dark") {
      await page.evaluate(() => document.documentElement.classList.add("dark"));
      await page.waitForTimeout(400);
    }
    const anchor = await headAnchor(page);
    const left = +(anchor.trigger.x + anchor.trigger.w + 8).toFixed(2);
    const top = +anchor.trigger.y.toFixed(2);

    for (const object of ["stroke", "plain", "stub"]) {
      // one strip per object: N = 1..12 stacked, drawn at the head's own scale
      const strip = await page.evaluate(
        async ({ src, object, left, top }) => {
          document.getElementById("plr-strip")?.remove();
          const host = document.createElement("div");
          host.id = "plr-strip";
          host.style.cssText =
            "position:fixed;left:8px;top:120px;z-index:60;display:flex;flex-direction:column;" +
            "gap:4px;background:var(--color-background);padding:6px 8px;";
          document.body.appendChild(host);
          const fn = eval(src);
          const boxes: unknown[] = [];
          for (let n = 1; n <= 12; n++) {
            const r = await fn({
              object, n, heightPx: 36, threshold: 99, left, top, floorPx: 44,
              soloGraphite: false,
            });
            const proto = document.getElementById("plr-proto")!;
            const btn = proto.querySelector("button")!;
            const row = document.createElement("div");
            row.style.cssText = "display:flex;align-items:center;height:40px;";
            row.appendChild(btn);
            proto.remove();
            host.appendChild(row);
            boxes.push({ n, svgW: r.svg.w, strokePx: +r.strokePx.toFixed(3) });
          }
          const hr = host.getBoundingClientRect();
          return { box: { x: hr.x, y: hr.y, w: hr.width, h: hr.height }, boxes };
        },
        { src: OVERLAY_SRC, object, left, top },
      );
      const file = path.join(OUT, `strip-${object}-${theme}-${engine}.png`);
      fs.mkdirSync(OUT, { recursive: true });
      await page.screenshot({
        path: file,
        clip: { x: strip.box.x, y: strip.box.y, width: strip.box.w, height: strip.box.h },
      });
      appendLog(`P3|${engine}|${theme}|${object}|${JSON.stringify(strip.boxes)}|bytes=${fs.statSync(file).size}`);
      await page.evaluate(() => document.getElementById("plr-strip")?.remove());
    }
    await ctx.close();
  }
});

// ═══════════════════════════════════════════════════════════════════════════════════════════
test("P4 — I3 re-run against the overlay, and P5 the register", async ({ browser }, info) => {
  const engine = info.project.name;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();

  const anchor = await headAnchor(a);
  const left = +(anchor.trigger.x + anchor.trigger.w + 8).toFixed(2);
  const top = +anchor.trigger.y.toFixed(2);

  // I3 as written at r0, unchanged: role=button matched by name, x<200, y<120, press opens a lobby.
  const m1 = await mount(a, {
    object: "stroke", n: 1, heightPx: 36, threshold: 10, left, top, floorPx: 44, soloGraphite: true,
  });
  const mark = a.getByRole("button", { name: /player|lobby|who.s (here|on this board)/i });
  const count = await mark.count();
  appendLog(`P4-I3|${engine}|label=${m1.label}|candidates=${count}`);
  expect(count, "I3: a player mark lives in the head").toBe(1);
  const box = await mark.first().boundingBox();
  appendLog(`P4-I3|${engine}|box=${JSON.stringify(box)}`);
  expect(box!.x).toBeLessThan(200);
  expect(box!.y).toBeLessThan(120);
  await mark.first().click();
  await expect(
    a.getByRole("dialog").or(a.locator("[data-lobby]")),
    "pressing it opens the lobby",
  ).toBeVisible();

  // The charter's own wording, measured against the SAME locator.
  const charterName = await a.evaluate(() => {
    const b = document.getElementById("plr-mark")!;
    b.setAttribute("aria-label", "3 on this board");
    return b.getAttribute("aria-label");
  });
  const charterCount = await a
    .getByRole("button", { name: /player|lobby|who.s (here|on this board)/i })
    .count();
  appendLog(`P4-I3-CHARTER|${engine}|label=${charterName}|candidates=${charterCount}`);

  // ── P5 the register at 3 and at 16 ─────────────────────────────────────────────────────
  for (const n of [3, 16]) {
    await mount(a, { object: "stroke", n, heightPx: 36, threshold: 10, left, top, floorPx: 44, soloGraphite: true });
    await a.click("#plr-mark");
    const reg = await a.evaluate(() => {
      const l = document.querySelector<HTMLElement>("[data-lobby]")!;
      const r = l.getBoundingClientRect();
      const rows = [...l.querySelectorAll<HTMLElement>(".plr-lobby-row")].map((e) => {
        const b = e.getBoundingClientRect();
        const nm = e.querySelector<HTMLElement>(".plr-lobby-name")!.getBoundingClientRect();
        const you = e.querySelector<HTMLElement>(".plr-lobby-you");
        return {
          h: +b.height.toFixed(2),
          nameX: +nm.x.toFixed(2),
          youGap: you ? +(you.getBoundingClientRect().x - (nm.x + nm.width)).toFixed(2) : null,
        };
      });
      return { card: { w: +r.width.toFixed(2), h: +r.height.toFixed(2), y: +r.y.toFixed(2) }, rows: rows.length, rowH: rows[0]?.h, youGap: rows[0]?.youGap, bottom: +(r.y + r.height).toFixed(2), vh: window.innerHeight };
    });
    appendLog(`P5|${engine}|n=${n}|${JSON.stringify(reg)}`);
    bank(`p5-register-${engine}-n${n}.json`, reg);
  }
  await ctx.close();
});

// ═══════════════════════════════════════════════════════════════════════════════════════════
test("P6 — F1: the board solo vs in a room, and the two-colour question", async ({ browser }, info) => {
  const engine = info.project.name;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);

  const cellStyle = () =>
    a.evaluate(() => {
      const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")];
      const bound = cells.filter((c) => c.getAttribute("style")?.includes("--color-user-ink"));
      const glyphs = [...document.querySelectorAll<SVGElement>(".sudoku-cell .glyph-svg path")];
      return {
        cells: cells.length,
        cellsWithInkBinding: bound.length,
        firstGlyphStroke: glyphs[0] ? getComputedStyle(glyphs[0]).stroke : null,
        userInk: getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim(),
      };
    });

  const solo = await cellStyle();
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);
  const inRoom = await cellStyle();
  appendLog(`P6|${engine}|solo=${JSON.stringify(solo)}|room=${JSON.stringify(inRoom)}`);
  bank(`p6-f1-${engine}.json`, { solo, inRoom });

  // The two colours in one frame: my digits (blue) + my mark in the room's ink for me.
  const kSelf = await a.evaluate(async () => {
    const rows = [...document.querySelectorAll<HTMLElement>(".controls-card .players-roster .player-row")];
    const me = rows.find((r) => r.querySelector(".player-self"));
    const other = rows.find((r) => !r.querySelector(".player-self"));
    return {
      mySwatch: me ? getComputedStyle(me.querySelector(".player-swatch")!).backgroundColor : null,
      theirSwatch: other ? getComputedStyle(other.querySelector(".player-swatch")!).backgroundColor : null,
      myInk: getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim(),
    };
  });
  appendLog(`P6-TWOCOLOUR|${engine}|${JSON.stringify(kSelf)}`);
  await ctx.close();
});

// ═══════════════════════════════════════════════════════════════════════════════════════════
// P7 — the room's own `k`: what index the room hands ME, and therefore what colour the mark
// would carry under this family's F1 ruling while my digits stay blue.
test("P7 — k[self], and what the register says when identity is lost", async ({ browser }, info) => {
  const engine = info.project.name;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const room = new URL(link).searchParams.get("s")!;
  await a.evaluate((r) => {
    const w = window as any;
    w.__k = null;
    const ch = new BroadcastChannel(`board:${r}`);
    w.__ch = ch;
    ch.onmessage = (ev: MessageEvent) => { if (ev.data?.kind === "st") w.__k = ev.data.data?.k ?? null; };
  }, room);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);
  await a.waitForTimeout(800);

  const k = await a.evaluate(() => {
    const w = window as any;
    const rows = [...document.querySelectorAll<HTMLElement>(".controls-card .players-roster .player-row")];
    const me = rows.find((r) => r.querySelector(".player-self"));
    return {
      kFromWire: w.__k,
      mySlug: me?.querySelector(".player-name")?.textContent?.trim(),
      mySwatchPainted: me ? getComputedStyle(me.querySelector(".player-swatch")!).backgroundColor : null,
      boardInk: getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim(),
    };
  });
  const kB = await b.evaluate(() => {
    const rows = [...document.querySelectorAll<HTMLElement>(".controls-card .players-roster .player-row")];
    const me = rows.find((r) => r.querySelector(".player-self"));
    const them = rows.find((r) => !r.querySelector(".player-self"));
    return {
      mySlug: me?.querySelector(".player-name")?.textContent?.trim(),
      theirSlug: them?.querySelector(".player-name")?.textContent?.trim(),
      theirSwatch: them ? getComputedStyle(them.querySelector(".player-swatch")!).backgroundColor : null,
    };
  });
  appendLog(`P7-K|${engine}|A=${JSON.stringify(k)}|B=${JSON.stringify(kB)}`);
  bank(`p7-kself-${engine}.json`, { A: k, B: kB });

  // I4 / I5 re-run unchanged, so the register's sentence has a measured fact to speak to.
  const i5 = await a.evaluate(async () => {
    const m = await import("/src/games/shared/playerIdentity.ts");
    const KEY = "session-identity-v1";
    localStorage.removeItem(KEY); sessionStorage.removeItem(KEY);
    const live: string[] = [];
    for (let i = 0; i < 9; i++) { sessionStorage.removeItem(KEY); live.push(m.claimIdentity(`live-${i}`)); }
    sessionStorage.removeItem(KEY);
    const tenth = m.claimIdentity("live-0");
    // the ROOMS half of the cap: a ninth room evicts the least-recent binding
    localStorage.removeItem(KEY); sessionStorage.removeItem(KEY);
    const first = m.claimIdentity("room-0");
    for (let i = 1; i <= 8; i++) { m.claimIdentity(`room-${i}`); }
    const back = m.claimIdentity("room-0");
    return { liveCollided: tenth === live[0], roomEvicted: back !== first, first, back };
  });
  appendLog(`P7-IDENTITY|${engine}|${JSON.stringify(i5)}`);
  bank(`p7-identity-${engine}.json`, i5);
  await ctx.close();
});
