/**
 * PLR-COUNT pass-1, second half.
 *   P8  THE HEAD'S OWN CHROMA — what colours already live in the band the mark would join.
 *   P9  THE ROOMS HALF of IDENTITY_CAP, with the per-tab half cleared (F5, re-derived).
 *   P10 THE CROPS — the mark beside @mbabb at N = 3, and the two-colour frame.
 */
import { test, expect, type Page } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";
import { OVERLAY_SRC } from "./proto-overlay";

const OUT = process.env.PLR_OUT!;
const SOLO = "./?size=3&difficulty=EASY&wire=local";
test.setTimeout(240000);

function appendLog(line: string) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.appendFileSync(path.join(OUT, "proto2.log"), line + "\n");
}
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function mount(page: Page, o: Record<string, unknown>) {
  return page.evaluate(`${OVERLAY_SRC}(${JSON.stringify(o)})`) as Promise<any>;
}

test("P8 — the head's own chroma, and P9 the rooms half", async ({ page }, info) => {
  const engine = info.project.name;
  for (const vp of [{ w: 390, h: 844, t: "390x844" }, { w: 1280, h: 800, t: "1280x800" }]) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto(SOLO);
    await settled(page);
    const head = await page.evaluate(() => {
      // every painted element whose box intersects the head band (y < 120)
      const out: Record<string, number> = {};
      const chroma = (css: string) => {
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(css);
        if (!m) return null;
        const [r, g, b] = [+m[1], +m[2], +m[3]];
        return Math.max(r, g, b) - Math.min(r, g, b);
      };
      for (const el of document.querySelectorAll<HTMLElement>("*")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0 || r.top > 120) continue;
        const cs = getComputedStyle(el);
        for (const prop of ["color", "stroke", "fill", "backgroundColor", "borderTopColor"]) {
          const v = (cs as any)[prop] as string;
          const c = chroma(v);
          if (c !== null && c >= 12 && !v.startsWith("rgba(0, 0, 0, 0")) {
            out[`${prop}:${v}`] = (out[`${prop}:${v}`] ?? 0) + 1;
          }
        }
      }
      return out;
    });
    appendLog(`P8|${engine}|${vp.t}|chromatic-in-head=${JSON.stringify(head)}`);
  }

  const rooms = await page.evaluate(async () => {
    const m = await import("/src/games/shared/playerIdentity.ts");
    const KEY = "session-identity-v1";
    localStorage.removeItem(KEY); sessionStorage.removeItem(KEY);
    const first = m.claimIdentity("room-0");
    for (let i = 1; i <= 8; i++) { sessionStorage.removeItem(KEY); m.claimIdentity(`room-${i}`); }
    sessionStorage.removeItem(KEY); // a fresh tab: only the durable half survives
    const back = m.claimIdentity("room-0");
    return { first, back, evicted: back !== first };
  });
  appendLog(`P9|${engine}|rooms=${JSON.stringify(rooms)}`);
});

test("P10 — the crops", async ({ browser }, info) => {
  const engine = info.project.name;
  if (engine !== "chromium") return;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const anchor = await a.evaluate(() => {
    const t = [...document.querySelectorAll<HTMLElement>(".attribution-trigger")].find(
      (e) => e.getBoundingClientRect().width > 0,
    )!;
    const r = t.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  // the mark beside @mbabb, three objects at N = 3 and N = 6, in one crop
  await a.evaluate(
    async ({ src, left, top }) => {
      document.getElementById("plr-head")?.remove();
      const host = document.createElement("div");
      host.id = "plr-head";
      host.style.cssText = "position:fixed;left:0;top:0;z-index:70;width:390px;";
      document.body.appendChild(host);
      const fn = eval(src);
      for (const [object, n] of [["plain", 3], ["stroke", 5], ["stub", 3], ["plain", 1]] as const) {
        await fn({ object, n, heightPx: 36, threshold: 99, left, top, floorPx: 44,
                   soloGraphite: n === 1 });
        const proto = document.getElementById("plr-proto")!;
        const btn = proto.querySelector("button")!;
        const row = document.createElement("div");
        row.style.cssText =
          "display:flex;align-items:center;height:44px;background:var(--color-background);";
        const tag = document.createElement("span");
        tag.textContent = object + " " + n;
        tag.style.cssText =
          "font-family:var(--font-mono),monospace;font-size:10px;width:76px;color:#888;";
        row.appendChild(tag);
        row.appendChild(btn);
        proto.remove();
        host.appendChild(row);
      }
    },
    { src: OVERLAY_SRC, left: anchor.x + anchor.w + 8, top: anchor.y },
  );
  const box = await a.evaluate(() => {
    const r = document.getElementById("plr-head")!.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  fs.mkdirSync(OUT, { recursive: true });
  await a.screenshot({ path: path.join(OUT, "objects-390-light.png"), clip: box });
  await a.evaluate(() => document.getElementById("plr-head")?.remove());

  // the two-colour frame: my digits (blue) and my mark in the room's ink for me
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  if (await verb.count()) {
    await verb.first().click().catch(() => {});
  }
  await a.waitForTimeout(400);
  const cell = a.locator(".sudoku-cell").nth(1);
  await cell.click();
  await a.keyboard.press("5");
  await a.waitForTimeout(500);
  await mount(a, {
    object: "plain", n: 2, heightPx: 36, threshold: 99,
    left: anchor.x + anchor.w + 8, top: anchor.y, floorPx: 44, soloGraphite: false,
  });
  const boardBox = await a.evaluate(() => {
    const g = document.querySelector(".sudoku-board, .board-host, [class*='board']")!;
    const r = g.getBoundingClientRect();
    return { x: 0, y: 0, width: 390, height: Math.min(520, r.bottom + 8) };
  });
  await a.screenshot({ path: path.join(OUT, "two-colour-390-light.png"), clip: boardBox });
  appendLog(`P10|${engine}|objects=${fs.statSync(path.join(OUT, "objects-390-light.png")).size}|twocolour=${fs.statSync(path.join(OUT, "two-colour-390-light.png")).size}`);
  await ctx.close();
});
