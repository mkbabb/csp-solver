import { test, expect, type Page } from "@playwright/test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
// PLR-PLACE pass 5 · THE KILL CONDITION, both arms on ONE minted payload. PLC_ARM labels the build
// (`chart` = PLACE_CHART true, `list` = the const flipped). The payload is minted from the HEAD
// control's own deal (`toBase64Url("\x01" + "3." + givens)`) and every page asserts it reads that
// given-set back. Regime witnessed on every page. OUT = PLC_OUT (scratch; crops are composited later).
const HEAD = `http://127.0.0.1:${process.env.PLC_HEAD ?? "4244"}`;
const ARM = process.env.PLC_ARM ?? "";
const OUT = process.env.PLC_OUT ?? "";
if (!ARM || !OUT) throw new Error("PLC_ARM and PLC_OUT are required");
const givens = (p: Page) => p.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")].map((i) => (/given clue/.test(i.getAttribute("aria-label") ?? "") && i.value ? i.value : "0")).join(""));
async function settled(p: Page) { await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 }); await expect.poll(() => givens(p).then((g) => g.replace(/0/g, "").length), { timeout: 20000 }).toBeGreaterThan(20); }
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol(); await expect.poll(async () => { const v = JSON.stringify(await read()); const same = v === last; last = v; return same; }, { intervals: [150], timeout: 8000 }).toBe(true); }
let payload = ""; let given = "";
test.describe.configure({ mode: "serial" });
test.beforeAll(async ({ browser }) => {
  // ONE payload for both engines AND both arms: minted once, banked beside the crops, reused.
  mkdirSync(OUT, { recursive: true });
  if (existsSync(`${OUT}/payload.json`)) ({ payload, given } = JSON.parse(readFileSync(`${OUT}/payload.json`, "utf8")));
  if (payload) return;
  const c = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await c.newPage(); await p.goto(`${HEAD}/?size=3&difficulty=EASY`); await settled(p);
  given = await givens(p);
  payload = await p.evaluate((g) => btoa(String.fromCharCode(1) + "3." + g).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), given);
  writeFileSync(`${OUT}/payload.json`, JSON.stringify({ payload, given }));
  await c.close();
});
const ARMS = [ { w: 390, h: 664, n: 2, crop: true }, { w: 390, h: 844, n: 2, crop: false }, { w: 390, h: 844, n: 5, crop: false } ];
for (const arm of ARMS) test(`kill ${arm.w}x${arm.h} n${arm.n}`, async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: arm.w, height: arm.h }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const a = await ctx.newPage();
  await a.goto(`/?size=3&difficulty=EASY&wire=local&board=${payload}`); await settled(a);
  expect(await givens(a), "A reads the payload").toBe(given);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await a.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); await verb.click();
  await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(1);
  await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden();
  const peers: Page[] = [];
  for (let i = 1; i < arm.n; i++) { const p = await ctx.newPage(); await p.goto(a.url()); await settled(p); expect(await givens(p), "peer reads the payload").toBe(given); peers.push(p); }
  for (const [i, p] of peers.entries()) { await p.bringToFront(); await p.locator(".sudoku-cell input").nth(10 + 11 * i).tap(); }
  await a.bringToFront(); await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(arm.n);
  const coarse = await a.evaluate(() => matchMedia("(pointer: coarse)").matches);
  await a.locator("[data-player-mark]:visible").tap();
  const sheet = a.locator("[data-lobby].is-open");
  await expect(sheet).toBeVisible();
  await stable(() => sheet.evaluate((e) => [e.getBoundingClientRect().height, getComputedStyle(e).opacity]));
  const g = await a.evaluate(() => { const sh = document.querySelector("[data-lobby].is-open")!.getBoundingClientRect(); const top = Math.min(...[...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect().top)); return { sheetTop: +sh.top.toFixed(2), H: +sh.height.toFixed(2), gridTop: +top.toFixed(2), lap: +Math.max(0, sh.bottom - top).toFixed(2), chart: !!document.querySelector("[data-lobby].is-open .place-chart"), dots: document.querySelectorAll("[data-lobby].is-open .chart-dot").length, rows: document.querySelectorAll("[data-lobby].is-open .pl-row").length, more: document.querySelector("[data-lobby].is-open .pl-more")?.textContent?.trim() ?? "", state: document.querySelector("[data-lobby].is-open .pl-state")?.textContent?.trim() ?? "" }; });
  const name = await a.locator("[data-player-mark]:visible").getAttribute("aria-label");
  mkdirSync(OUT, { recursive: true });
  if (arm.crop) await a.screenshot({ path: `${OUT}/kill-${ARM}-${info.project.name}.png`, clip: { x: 0, y: 0, width: arm.w, height: Math.min(arm.h, Math.ceil(g.gridTop + 190)) } });
  console.log(`KILL|${info.project.name}|${ARM}|${arm.w}x${arm.h} n${arm.n}|payload=${payload.slice(0, 14)}…|${JSON.stringify({ coarse, name, ...g })}`);
  await ctx.close();
});
