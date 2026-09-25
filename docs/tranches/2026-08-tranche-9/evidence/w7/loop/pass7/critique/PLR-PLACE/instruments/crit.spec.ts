import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { mkdirSync, readFileSync, appendFileSync } from "node:fs";
import { loadavg } from "node:os";
import { createHash } from "node:crypto";
// @ts-expect-error chair's instrument by path (LAWS P6 §I)
import { openThenResize, atRest } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments/rest-probes.mjs";
// PLR-PLACE pass-7 CRITIC: kill-table re-read (9×9 on the banked payload; 16×16 NEW), and open-then-resize
// on the lane's cell plus cells the lane did not read. Arm = a const in the critic's scratch copy.
const ARM = process.env.CR_ARM ?? "?";
const OUT = process.env.CR_OUT!;
const WHAT = process.env.CR_WHAT ?? "kill";
const PAY = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/PLR-PLACE/readings/kill-payload.json";
const { payload, given } = JSON.parse(readFileSync(PAY, "utf8"));
const givens = (p: Page) => p.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")].map((i) => (/given clue/.test(i.getAttribute("aria-label") ?? "") && i.value ? i.value : "0")).join(""));
async function settled(p: Page) { await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 }); await expect.poll(() => givens(p).then((g) => g.replace(/0/g, "").length), { timeout: 30000 }).toBeGreaterThan(20); }
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol(); await expect.poll(async () => { const v = JSON.stringify(await read()); const same = v === last; last = v; return same; }, { intervals: [150], timeout: 10000 }).toBe(true); }
const line = (s: string) => { mkdirSync(OUT, { recursive: true }); appendFileSync(`${OUT}/${WHAT}.txt`, s + "\n"); console.log(s); };
const load = () => loadavg()[0].toFixed(1);

async function room(ctx: BrowserContext, n: number, size = 3) {
  await ctx.addInitScript(() => { let s = 0x0b0b0b; Math.random = () => ((s = (s * 16807) % 2147483647) / 2147483647); (window as any).__reseed = () => { s = 0x0a0a0a; }; });
  const a = await ctx.newPage();
  await a.emulateMedia({ colorScheme: "light" });
  await a.goto(size === 3 ? `/?size=3&difficulty=EASY&wire=local&board=${payload}` : `/?size=${size}&difficulty=EASY&wire=local`); await settled(a);
  const gA = await givens(a);
  if (size === 3) expect(gA, "A reads the payload").toBe(given);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  const docked = !(await verb.isVisible());
  if (docked) { await a.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await a.evaluate(() => (window as any).__reseed()); await verb.click();
  await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden(); }
  const link = a.url(); const rm = new URL(link).searchParams.get("s")!;
  const b = await ctx.newPage();
  await b.emulateMedia({ colorScheme: "light" });
  await b.addInitScript((r) => sessionStorage.setItem("session-identity-v1", JSON.stringify({ [r]: "p-0000000b0b0b" })), rm);
  await b.goto(link); await settled(b);
  expect(await givens(b), "B reads A's board").toBe(gA);
  const touch = await b.evaluate(() => matchMedia("(pointer: coarse)").matches);
  if (touch) await b.locator(".sudoku-cell input").nth(10).tap(); else await b.locator(".sudoku-cell input").nth(10).click();
  if (n > 2) await a.evaluate(({ rm, k }) => { const ch = new BroadcastChannel(`board:${rm}`); for (let i = 0; i < k; i++) ch.postMessage({ kind: "hi", data: {}, from: `pin-${i}` }); setTimeout(() => ch.close(), 0); }, { rm, k: n - 2 });
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(n);
  await stable(() => a.locator(".sudoku-cell").first().evaluate((e) => e.getBoundingClientRect().top));
  const sig = size === 3 ? `payload=${payload.slice(0, 14)}…` : `givensSha=${createHash("sha1").update(gA).digest("hex").slice(0, 10)} link-s=${rm.slice(0, 8)}`;
  return { a, b, sig };
}
const read = (a: Page) => a.evaluate(() => {
  const all = [...document.querySelectorAll("[data-lobby].is-open")];
  const shEl = all.find((e) => e.getBoundingClientRect().width > 0) ?? null;
  if (!shEl) return { open: false, isOpenCount: all.length } as Record<string, unknown>;
  const sh = shEl.getBoundingClientRect();
  const cells = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
  const top = Math.min(...cells.map((c) => c.top));
  const lapped = cells.filter((c) => c.left < sh.right && c.right > sh.left && c.top < sh.bottom && c.bottom > sh.top).length;
  const ch = shEl.querySelector(".place-chart")?.getBoundingClientRect();
  return { open: true, isOpenCount: all.length, H: +sh.height.toFixed(2), lap: lapped ? +Math.max(0, sh.bottom - top).toFixed(2) : 0, lapped, chart: ch ? +ch.height.toFixed(2) : 0, rows: shEl.querySelectorAll(".pl-row").length, more: shEl.querySelector(".pl-more")?.textContent?.trim() ?? "" };
});
const markOf = (a: Page) => a.locator("[data-player-mark]:visible");
async function toggle(a: Page, coarse: boolean) { if (coarse) await markOf(a).tap(); else await markOf(a).click(); }

type Cell = { w: number; h: number; n: number; size?: number; fine?: boolean };
if (WHAT === "kill") for (const c of JSON.parse(process.env.CR_CELLS ?? "[]") as Cell[]) test(`kill ${c.size ?? 3} ${c.w}x${c.h} n${c.n}${c.fine ? " fine" : ""}`, async ({ browser }, info) => {
  test.slow();
  const coarse = !c.fine;
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: coarse, isMobile: coarse, deviceScaleFactor: 1 });
  const { a, sig } = await room(ctx, c.n, c.size ?? 3);
  expect(await a.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(coarse);
  await toggle(a, coarse);
  await expect(markOf(a)).toHaveAttribute("aria-expanded", "true");
  await atRest(a); await stable(() => read(a));
  line(`KILL|${info.project.name}|${ARM}|size${c.size ?? 3} ${c.w}x${c.h} n${c.n} ${coarse ? "coarse(witnessed)" : "fine"}|${sig}|B=p-0000000b0b0b|load=${load()}|${JSON.stringify(await read(a))}`);
  await ctx.close();
});
type R = { n: number; size?: number; fine?: boolean; from: [number, number]; to: [number, number] };
if (WHAT === "resize") for (const c of JSON.parse(process.env.CR_RSZ ?? "[]") as R[]) test(`resize ${c.size ?? 3} n${c.n} ${c.from.join("x")}->${c.to.join("x")}${c.fine ? " fine" : ""}`, async ({ browser }, info) => {
  test.slow();
  const coarse = !c.fine;
  const ctx = await browser.newContext({ viewport: { width: c.from[0], height: c.from[1] }, hasTouch: coarse, isMobile: coarse, deviceScaleFactor: 1 });
  const { a, sig } = await room(ctx, c.n, c.size ?? 3);
  const r = await openThenResize(a, {
    open: async () => { await toggle(a, coarse); await expect(markOf(a)).toHaveAttribute("aria-expanded", "true"); await stable(() => read(a)); },
    close: async () => { await toggle(a, coarse); await expect(markOf(a)).toHaveAttribute("aria-expanded", "false"); },
    read: () => read(a).then((g) => ({ rows: g.rows, chart: g.chart, lap: g.lap, lapped: g.lapped, H: g.H })),
    to: { width: c.to[0], height: c.to[1] },
  });
  line(`RESIZE|${info.project.name}|${ARM}|size${c.size ?? 3} n${c.n} ${c.from.join("x")}->${c.to.join("x")} ${coarse ? "coarse" : "fine"}|${sig}|load=${load()}|${JSON.stringify(r)}`);
  await ctx.close();
});

// QUIET: a content change at rest (a peer's qualifier grows while the sheet is open, no resize, no join).
// Open at W×H, then read the sheet every 5 s for ~115 s while B sits still; then a fresh open.
if (WHAT === "quiet") for (const c of JSON.parse(process.env.CR_Q ?? "[]") as Cell[]) test(`quiet ${c.w}x${c.h} n${c.n}`, async ({ browser }, info) => {
  test.setTimeout(260000);
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const { a, sig } = await room(ctx, c.n);
  await toggle(a, true);
  await expect(markOf(a)).toHaveAttribute("aria-expanded", "true");
  await atRest(a); await stable(() => read(a));
  const rowsText = () => a.evaluate(() => [...document.querySelectorAll("[data-lobby].is-open .pl-row")].map((r) => `${r.textContent?.replace(/\s+/g, " ").trim()}@${Math.round(r.getBoundingClientRect().height * 100) / 100}`));
  const t0 = Date.now(); const seen: string[] = [];
  let worst = { lap: 0, lapped: 0, H: 0, t: 0, rows: [] as string[] };
  while (Date.now() - t0 < 115000) {
    const g = await read(a); const rt = await rowsText();
    const k = `${g.H}|${g.lap}|${g.lapped}|${g.chart}|${rt.join(";")}`;
    if (seen[seen.length - 1] !== k) { seen.push(k); line(`QUIET-T|${info.project.name}|${ARM}|${c.w}x${c.h} n${c.n}|t=${Math.round((Date.now() - t0) / 1000)}s|${k}`); }
    if ((g.lapped as number) > worst.lapped) worst = { lap: g.lap as number, lapped: g.lapped as number, H: g.H as number, t: Math.round((Date.now() - t0) / 1000), rows: rt };
    // sleep-ok: a poll cadence for a timeline read, the subject is time itself
    await a.waitForTimeout(4000);
  }
  const atRestNow = await read(a);
  await toggle(a, true); await expect(markOf(a)).toHaveAttribute("aria-expanded", "false"); await atRest(a);
  await toggle(a, true); await expect(markOf(a)).toHaveAttribute("aria-expanded", "true"); await atRest(a); await stable(() => read(a));
  const fresh = await read(a); const freshRows = await rowsText();
  line(`QUIET|${info.project.name}|${ARM}|${c.w}x${c.h} n${c.n} coarse|${sig}|load=${load()}|worst=${JSON.stringify(worst)}|stayedOpen=${JSON.stringify(atRestNow)}|fresh=${JSON.stringify(fresh)} ${JSON.stringify(freshRows)}`);
  await ctx.close();
});
