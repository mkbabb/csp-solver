import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { mkdirSync, readFileSync, appendFileSync } from "node:fs";
import { loadavg } from "node:os";
import { createHash } from "node:crypto";
import { atRest, openThenResize } from "../e2e/lib/rest-probes.mjs";
import { glyphGate } from "../e2e/lib/glyph-pop.mjs";
// PLR-PLACE pass 8 · the three-arm census at 4×4 / 9×9 / 16×16 (the widest board, LAWS P7 §E),
// open-then-resize, the names' painted AA (every id on the page pinned), G10. The ARM is a const
// in the SERVED copy; this spec only reads. Instruments by relative product path (registry-v7 §2.4).
const ARM = process.env.P8_ARM ?? "?";
const OUT = process.env.P8_OUT!;
const WHAT = process.env.P8_WHAT ?? "kill";
const { payload, given } = JSON.parse(readFileSync(new URL("./payload.json", import.meta.url), "utf8"));
const B_ID = "p-0000000b0b0b";
const givens = (p: Page) => p.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")].map((i) => (/given clue/.test(i.getAttribute("aria-label") ?? "") && i.value ? i.value : "0")).join(""));
async function settled(p: Page) { await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 }); await expect.poll(() => givens(p).then((g) => g.replace(/0/g, "").length), { timeout: 30000 }).toBeGreaterThan(5); }
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol(); await expect.poll(async () => { const v = JSON.stringify(await read()); const same = v === last; last = v; return same; }, { intervals: [150], timeout: 10000 }).toBe(true); }
const line = (s: string) => { mkdirSync(OUT, { recursive: true }); appendFileSync(`${OUT}/${WHAT}.txt`, s + "\n"); console.log(s); };
const load = () => loadavg()[0].toFixed(1);

/** A room of `n` in ONE context: A deals (9×9 on the banked payload, read back), invites, B joins
 *  under a PINNED id, n>2 are announced on the local wire. A's id is seeded (Math.random reseeded
 *  before the invite), so both ids — and every stroke `seedFor(id)` seeds — are fixed per run. */
async function room(ctx: BrowserContext, n: number, size = 3, scheme: "light" | "dark" = "light") {
  // Two seeded streams: the page's own, and the room's (the room id and every minted peer id come
  // from `playerIdentity`/`useSession`, read off the caller's stack), so A's id is PINNED per run
  // whatever else on the page draws a number first. B is pinned by its per-tab binding.
  await ctx.addInitScript(() => { let s = 0x0b0b0b, t = 0x0a0a0a; Math.random = () => (/playerIdentity|useSession/.test(new Error().stack ?? "") ? (t = (t * 16807) % 2147483647) / 2147483647 : (s = (s * 16807) % 2147483647) / 2147483647); (window as any).__reseed = () => { s = 0x0a0a0a; }; });
  const a = await ctx.newPage();
  await a.emulateMedia({ colorScheme: scheme });
  await a.goto(size === 3 ? `/?size=3&difficulty=EASY&wire=local&board=${payload}` : `/?size=${size}&difficulty=EASY&wire=local`);
  await settled(a);
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
  await b.emulateMedia({ colorScheme: scheme });
  await b.addInitScript(([r, id]) => sessionStorage.setItem("session-identity-v1", JSON.stringify({ [r]: id })), [rm, B_ID]);
  await b.goto(link); await settled(b);
  expect(await givens(b), "B reads A's board").toBe(gA);
  const touch = await b.evaluate(() => matchMedia("(pointer: coarse)").matches);
  if (touch) await b.locator(".sudoku-cell input").nth(10).tap(); else await b.locator(".sudoku-cell input").nth(10).click();
  if (n > 2) await a.evaluate(({ rm, k }) => { const ch = new BroadcastChannel(`board:${rm}`); for (let i = 0; i < k; i++) ch.postMessage({ kind: "hi", data: {}, from: `pin-${i}` }); setTimeout(() => ch.close(), 0); }, { rm, k: n - 2 });
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(n);
  await stable(() => a.locator(".sudoku-cell").first().evaluate((e) => e.getBoundingClientRect().top));
  const ids = await a.evaluate(() => sessionStorage.getItem("session-identity-v1") ?? localStorage.getItem("session-identity-v1"));
  const sig = `${size === 3 ? `payload=${payload.slice(0, 14)}…` : `givensSha=${createHash("sha1").update(gA).digest("hex").slice(0, 10)}`} ids=A:${ids ?? "?"},B:${B_ID}`;
  return { a, b, sig };
}
const read = (a: Page) => a.evaluate(() => {
  const all = [...document.querySelectorAll("[data-lobby].is-open")];
  const shEl = all.find((e) => e.getBoundingClientRect().width > 0) ?? null;
  if (!shEl) return { open: false } as Record<string, unknown>;
  const sh = shEl.getBoundingClientRect();
  const cells = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
  const top = Math.min(...cells.map((c) => c.top));
  const lapped = cells.filter((c) => c.left < sh.right && c.right > sh.left && c.top < sh.bottom && c.bottom > sh.top).length;
  const ch = shEl.querySelector(".place-chart")?.getBoundingClientRect();
  return { open: true, H: +sh.height.toFixed(2), lap: lapped ? +Math.max(0, sh.bottom - top).toFixed(2) : 0, lapped, cells: cells.length, chart: ch ? +ch.height.toFixed(2) : 0, rows: shEl.querySelectorAll(".pl-row").length, more: shEl.querySelector(".pl-more")?.textContent?.trim() ?? "" };
});
const markOf = (a: Page) => a.locator("[data-player-mark]:visible");
async function toggle(a: Page, coarse: boolean) { if (coarse) await markOf(a).tap(); else await markOf(a).click(); }

type Cell = { w: number; h: number; n: number; size?: number; fine?: boolean };
if (WHAT === "kill") for (const c of JSON.parse(process.env.P8_CELLS ?? "[]") as Cell[]) test(`kill ${c.size ?? 3} ${c.w}x${c.h} n${c.n}${c.fine ? " fine" : ""}`, async ({ browser }, info) => {
  test.slow();
  const coarse = !c.fine;
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: coarse, isMobile: coarse, deviceScaleFactor: 1 });
  const { a, sig } = await room(ctx, c.n, c.size ?? 3);
  expect(await a.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(coarse);
  await toggle(a, coarse);
  await expect(markOf(a)).toHaveAttribute("aria-expanded", "true");
  await atRest(a); await stable(() => read(a));
  const bs = c.size === 4 ? "16x16" : c.size === 2 ? "4x4" : "9x9";
  line(`KILL|${info.project.name}|${ARM}|${bs} ${c.w}x${c.h} n${c.n} ${coarse ? "coarse(witnessed)" : "fine"}|${sig}|load=${load()}|${JSON.stringify(await read(a))}`);
  await ctx.close();
});

type R = { n: number; size?: number; fine?: boolean; from: [number, number]; to: [number, number] };
if (WHAT === "resize") for (const c of JSON.parse(process.env.P8_RSZ ?? "[]") as R[]) test(`resize ${c.size ?? 3} n${c.n} ${c.from.join("x")}->${c.to.join("x")}${c.fine ? " fine" : ""}`, async ({ browser }, info) => {
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
  line(`RESIZE|${info.project.name}|${ARM}|${c.size === 4 ? "16x16" : "9x9"} n${c.n} ${c.from.join("x")}->${c.to.join("x")} ${coarse ? "coarse" : "fine"}|${sig}|load=${load()}|${JSON.stringify(r)}`);
  await ctx.close();
});

// AA OF THE NAMES: glyph-pop at its home, B's name on A's open sheet, every id on the page pinned
// (A seeded, B pinned: the slug AND the stroke `seedFor(id)` seeds are fixed). Both themes, PRM,
// DPR 1, 1280×800 fine. The plants (FAINT/FADE/TAIL/HEAD12/MID20/EMPTY) run in the same read.
if (WHAT === "aa") for (const scheme of ["light", "dark"] as const) test(`aa names ${scheme}`, async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const { a, sig } = await room(ctx, 2, 3, scheme);
  await toggle(a, false);
  await expect(markOf(a)).toHaveAttribute("aria-expanded", "true");
  await atRest(a); await stable(() => read(a));
  const subject = "[data-lobby].is-open .pl-row:nth-child(2) .pl-name";
  const name = await a.locator(subject).first().textContent();
  const g = await glyphGate(a, { subject, payload: sig });
  const brief = (r: any) => r ? { pop: r.population, med: r.coreMedian, under: r.fracUnder, red: r.red, why: (r.why ?? []).map((w: string) => w.slice(0, 60)) } : null;
  line(`AA|${info.project.name}|${ARM}|${scheme}|name=${name}|${sig}|load=${load()}|clean=${JSON.stringify(brief(g.clean))}|plants=${JSON.stringify(Object.fromEntries(Object.entries(g.plants).map(([k, v]) => [k, brief(v)])))}`);
  await ctx.close();
});

// G10 BOARD-UNBOUND: no board cell binds the room's ink, solo and in a room (pass 1's row).
if (WHAT === "g10") test("g10 board-unbound", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const solo = await ctx.newPage();
  await solo.goto(`/?size=3&difficulty=EASY&wire=local&board=${payload}`); await settled(solo);
  const bound = (p: Page) => p.evaluate(() => { const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")]; return { cells: cells.length, bound: cells.filter((c) => c.style.getPropertyValue("--color-user-ink")).length }; });
  const s = await bound(solo);
  await solo.close();
  const { a, b, sig } = await room(ctx, 2);
  const r = await bound(a);
  line(`G10|${info.project.name}|${ARM}|${sig}|solo=${JSON.stringify(s)}|room=${JSON.stringify(r)}|B=${JSON.stringify(await bound(b))}`);
  await ctx.close();
});

// INTAKE-22 ROW 48 on `s10` (and on `s10` + this tree): at 430×932 coarse, the board, the drawer
// tab, the dock sheet's top with the dock open (settled), and (where the lobby exists) the lobby's
// lap under the arm that tree ships. Solo reads on the banked payload; the lap in a room of two.
if (WHAT === "s10") test(`s10 read ${process.env.P8_TREE ?? "?"}`, async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(`/?size=3&difficulty=EASY&wire=local&board=${payload}`); await settled(p);
  expect(await givens(p)).toBe(given);
  await atRest(p);
  const geo = () => p.evaluate(() => {
    const cells = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
    const tab = document.querySelector(".drawer-tab")?.getBoundingClientRect();
    const cs = document.querySelector("#controls-drawer .drawer-case");
    const cr = cs?.getBoundingClientRect();
    return { gridTop: +Math.min(...cells.map((c) => c.top)).toFixed(2), gridBottom: +Math.max(...cells.map((c) => c.bottom)).toFixed(2), tabTop: tab ? +tab.top.toFixed(2) : null, caseTop: cr && cr.height > 0 ? +cr.top.toFixed(2) : null, caseH: cr ? +cr.height.toFixed(2) : null };
  });
  const shut = await geo();
  await p.locator(".drawer-tab").first().click();
  await stable(() => p.evaluate(() => document.querySelector("#controls-drawer .drawer-case")?.getBoundingClientRect().top));
  await atRest(p);
  const open = await geo();
  line(`S10|${info.project.name}|${process.env.P8_TREE ?? "?"}|430x932 coarse|payload=${payload.slice(0, 14)}…|load=${load()}|shut=${JSON.stringify(shut)}|open=${JSON.stringify(open)}`);
  await p.close();
  if (process.env.P8_LOBBY === "1") for (const size of [3, 4]) {
    const c2 = await browser.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
    const { a, sig } = await room(c2, 2, size);
    await toggle(a, true);
    await expect(markOf(a)).toHaveAttribute("aria-expanded", "true");
    await atRest(a); await stable(() => read(a));
    line(`S10LAP|${info.project.name}|${process.env.P8_TREE ?? "?"}|${size === 4 ? "16x16" : "9x9"} 430x932 n2 coarse|${sig}|load=${load()}|${JSON.stringify(await read(a))}`);
    await c2.close();
  }
  await ctx.close();
});

// THE SAME INK ON THE CONTROL'S OWN SURFACE (the controls card's roster, 74a2b5d9 dev), both ids pinned.
if (WHAT === "aa-roster") for (const scheme of ["light", "dark"] as const) test(`aa roster ${scheme}`, async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const { a, sig } = await room(ctx, 2, 3, scheme);
  const subject = ".players-roster .player-row:nth-child(2) .player-name";
  await expect(a.locator(subject)).toBeVisible();
  await atRest(a);
  const name = await a.locator(subject).textContent();
  const g = await glyphGate(a, { subject, payload: sig });
  const brief = (r: any) => r ? { pop: r.population, med: r.coreMedian, under: r.fracUnder, red: r.red } : null;
  line(`AAROSTER|${info.project.name}|${ARM}|${scheme}|name=${name}|${sig}|load=${load()}|clean=${JSON.stringify(brief(g.clean))}|plants=${JSON.stringify(Object.fromEntries(Object.entries(g.plants).map(([k, v]) => [k, brief(v)])))}`);
  await ctx.close();
});
