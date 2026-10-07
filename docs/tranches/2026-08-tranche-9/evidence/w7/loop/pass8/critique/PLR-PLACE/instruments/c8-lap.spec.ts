import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { readFileSync, appendFileSync } from "node:fs";
import { loadavg } from "node:os";
// PLR-PLACE pass-8 CRITIC: an independent lap reader (the critic's own code, not the lane's census).
const OUT = process.env.C8_OUT!;
const ARM = process.env.C8_ARM ?? "?";
const { payload, given } = JSON.parse(readFileSync(new URL("./payload.json", import.meta.url), "utf8"));
const B_ID = "p-0000000b0b0b";
const line = (s: string) => { appendFileSync(OUT, s + "\n"); console.log(s); };

async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol();
  await expect.poll(async () => { const v = JSON.stringify(await read()); const same = v === last; last = v; return same; }, { intervals: [200], timeout: 15000 }).toBe(true);
}
async function up(p: Page) {
  await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 90000 });
}
async function room(ctx: BrowserContext, size: number) {
  await ctx.addInitScript(() => { let s = 0x0b0b0b, t = 0x0a0a0a; Math.random = () => (/playerIdentity|useSession/.test(new Error().stack ?? "") ? (t = (t * 16807) % 2147483647) / 2147483647 : (s = (s * 16807) % 2147483647) / 2147483647); });
  const a = await ctx.newPage();
  await a.goto(size === 3 ? `/?size=3&difficulty=EASY&wire=local&board=${payload}` : `/?size=${size}&difficulty=EASY&wire=local`);
  await up(a);
  if (size === 3) await expect.poll(() => a.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")].map((i) => (/given clue/.test(i.getAttribute("aria-label") ?? "") && i.value ? i.value : "0")).join("")), { timeout: 30000 }).toBe(given);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled({ timeout: 30000 });
  const docked = !(await verb.isVisible());
  if (docked) { await a.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await verb.click();
  await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden(); }
  const link = a.url(); const rm = new URL(link).searchParams.get("s")!;
  const b = await ctx.newPage();
  await b.addInitScript(([r, id]) => sessionStorage.setItem("session-identity-v1", JSON.stringify({ [r]: id })), [rm, B_ID]);
  await b.goto(link); await up(b);
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 30000 }).toBe(2);
  return a;
}
const geo = (a: Page) => a.evaluate(() => {
  const sh = [...document.querySelectorAll("[data-lobby]")].find((e) => e.classList.contains("is-open") && e.getBoundingClientRect().width > 0);
  if (!sh) return null;
  const s = sh.getBoundingClientRect();
  const cs = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
  const top = Math.min(...cs.map((c) => c.top));
  const n = cs.filter((c) => c.left < s.right && c.right > s.left && c.top < s.bottom && c.bottom > s.top).length;
  return { H: +s.height.toFixed(2), bottom: +s.bottom.toFixed(2), gridTop: +top.toFixed(2), lap: n ? +(s.bottom - top).toFixed(2) : 0, lapped: n, cells: cs.length, chart: !!sh.querySelector(".place-chart"), rows: sh.querySelectorAll(".pl-row").length, sheetL: +s.left.toFixed(2), sheetR: +s.right.toFixed(2) };
});

const CELLS: [number, number, number][] = JSON.parse(process.env.C8_CELLS ?? "[]");
for (const [size, w, h] of CELLS) test(`lap ${size} ${w}x${h}`, async ({ browser }, info) => {
  test.setTimeout(300000);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const a = await room(ctx, size);
  expect(await a.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
  await a.locator("[data-player-mark]:visible").tap();
  await expect(a.locator("[data-player-mark]:visible")).toHaveAttribute("aria-expanded", "true");
  await a.waitForTimeout(700);
  await stable(() => geo(a));
  line(`LAP|${info.project.name}|${ARM}|${size === 4 ? "16x16" : size === 2 ? "4x4" : "9x9"} ${w}x${h} coarse|load=${loadavg()[0].toFixed(1)}|${JSON.stringify(await geo(a))}`);
  await ctx.close();
});
