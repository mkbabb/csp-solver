import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, readFileSync, appendFileSync } from "node:fs";
// PLR-PLACE pass 6 · THE KILL CONDITION on the merged tree (the leader's measured key), both arms on
// the pass-5 banked payload (`kill-payload.json`, read back per page through the aria-label corpus).
// PLC_ARM labels the build (chart | list). `long` cells seat a peer whose id slugs to the
// dictionaries' longest pair (`long-66737` → straightforward-tyrannosaurus, read back) by a local
// `hi` on the room's channel; `real` cells seat real pages. Coarse witnessed on every page.
const ARM = process.env.PLC_ARM ?? "";
const OUT = process.env.PLC_OUT ?? "";
const PAY = process.env.PLC_PAYLOAD ?? "";
if (!ARM || !OUT || !PAY) throw new Error("PLC_ARM, PLC_OUT, PLC_PAYLOAD are required");
const { payload, given } = JSON.parse(readFileSync(PAY, "utf8"));
const givens = (p: Page) => p.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")].map((i) => (/given clue/.test(i.getAttribute("aria-label") ?? "") && i.value ? i.value : "0")).join(""));
async function settled(p: Page) { await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 }); await expect.poll(() => givens(p).then((g) => g.replace(/0/g, "").length), { timeout: 20000 }).toBeGreaterThan(20); }
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol(); await expect.poll(async () => { const v = JSON.stringify(await read()); const same = v === last; last = v; return same; }, { intervals: [150], timeout: 8000 }).toBe(true); }
type Cell = { w: number; h: number; n: number; long: boolean; crop?: boolean };
const CELLS: Cell[] = [
  { w: 390, h: 664, n: 2, long: false, crop: true }, { w: 390, h: 844, n: 2, long: false }, { w: 390, h: 844, n: 5, long: false },
  { w: 390, h: 800, n: 2, long: false },
  { w: 390, h: 664, n: 2, long: true }, { w: 390, h: 844, n: 2, long: true }, { w: 390, h: 844, n: 5, long: true },
].filter(() => !process.env.PLC_CELLS).concat(process.env.PLC_CELLS ? JSON.parse(process.env.PLC_CELLS) : []);
for (const c of CELLS) test(`kill ${c.w}x${c.h} n${c.n}${c.long ? " long" : ""}`, async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const a = await ctx.newPage();
  await a.goto(`/?size=3&difficulty=EASY&wire=local&board=${payload}`); await settled(a);
  expect(await givens(a), "A reads the payload").toBe(given);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await a.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); await verb.click();
  await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(1);
  await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden();
  const peers: Page[] = [];
  const real = c.long ? 0 : c.n - 1;
  for (let i = 0; i < real; i++) { const p = await ctx.newPage(); await p.goto(a.url()); await settled(p); expect(await givens(p), "peer reads the payload").toBe(given); peers.push(p); }
  for (const [i, p] of peers.entries()) { await p.bringToFront(); await p.locator(".sudoku-cell input").nth(10 + 11 * i).tap(); }
  let slug = "";
  if (c.long) {
    const ids = ["long-66737", ...Array.from({ length: c.n - 2 }, (_, i) => `k6-${i}`)];
    slug = await a.evaluate(async () => (await import("/src/games/shared/playerIdentity.ts")).slugFor("long-66737", new Set()));
    await a.evaluate((ids) => { const room = new URL(location.href).searchParams.get("s")!; const ch = new BroadcastChannel(`board:${room}`); for (const id of ids) ch.postMessage({ kind: "hi", data: {}, from: id }); setTimeout(() => ch.close(), 0); }, ids);
  }
  await a.bringToFront(); await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(c.n);
  const coarse = await a.evaluate(() => matchMedia("(pointer: coarse)").matches);
  await a.locator("[data-player-mark]:visible").tap();
  const sheet = a.locator("[data-lobby].is-open");
  await expect(sheet).toBeVisible();
  await stable(() => sheet.evaluate((e) => [e.getBoundingClientRect().height, getComputedStyle(e).opacity]));
  const g = await a.evaluate(() => { const shEl = document.querySelector("[data-lobby].is-open")!; const sh = shEl.getBoundingClientRect(); const cells = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0); const top = Math.min(...cells.map((c) => c.top)); const lapped = cells.filter((c) => c.left < sh.right && c.right > sh.left && c.top < sh.bottom && c.bottom > sh.top).length; return { H: +sh.height.toFixed(2), W: +sh.width.toFixed(2), gridTop: +top.toFixed(2), lap: +Math.max(0, sh.bottom - top).toFixed(2), lapped, chart: !!shEl.querySelector(".place-chart"), chartH: +(shEl.querySelector(".place-chart")?.getBoundingClientRect().height ?? 0).toFixed(2), dots: shEl.querySelectorAll(".chart-dot").length, ring: shEl.querySelectorAll(".chart-self").length, rows: [...shEl.querySelectorAll(".pl-row")].map((r) => +r.getBoundingClientRect().height.toFixed(2)), more: shEl.querySelector(".pl-more")?.textContent?.trim() ?? "", names: [...shEl.querySelectorAll(".pl-name")].map((x) => (x.textContent ?? "").length) }; });
  const name = await a.locator("[data-player-mark]:visible").getAttribute("aria-label");
  mkdirSync(OUT, { recursive: true });
  if (c.crop) await a.screenshot({ path: `${OUT}/kill-${ARM}-${info.project.name}.png`, clip: { x: 0, y: 0, width: c.w, height: Math.min(c.h, Math.ceil(g.gridTop + 190)) } });
  const line = `KILL|${info.project.name}|${ARM}|${c.w}x${c.h} n${c.n}${c.long ? " long" : ""}|payload=${payload.slice(0, 14)}…|${JSON.stringify({ coarse, name, slug: slug || undefined, ...g })}`;
  appendFileSync(`${OUT}/kill.txt`, line + "\n"); console.log(line);
  await ctx.close();
});
