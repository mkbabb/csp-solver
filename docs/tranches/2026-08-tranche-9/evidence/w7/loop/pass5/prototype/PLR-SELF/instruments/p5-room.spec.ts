/** PLR-SELF pass 5 — π IN A ROOM, dev-vs-dev (4241 vs the dev-mode control 4232 at 74a2b5d9),
 *  five at the table, ONE payload, + a control-vs-control noise arm; and the estate figures
 *  §10's leader prices (the well, the card's scrollport, the +22 dy). */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
const PAYLOAD = process.env.PLR_PAYLOAD!, OUT = process.env.PLR_CROPS!;
const CTRL = "http://127.0.0.1:4232", PROTO = "http://127.0.0.1:4241";
const KEYS = [".corner-left", ".attribution-trigger", ".hover-card", ".corner-right", ".masthead", ".controls-card", ".board-wrapper", ".drawer-tab", ".page-root", ".players-roster", ".sudoku-cell", ".control-panel-wrap", ".peek-hold-surface", ".copy-status", ".tray-well"];
const PROPS = ["display", "color", "background-color", "font-family", "font-size", "font-weight", "filter", "opacity", "border-top-width"];
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol(); await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [200], timeout: 10000 }).toBe(true); }
async function room(page: Page, n: number) {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  const docked = !(await verb.isVisible());
  if (docked) { await page.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await verb.click();
  await expect.poll(() => page.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await page.locator(".drawer-tab").first().click(); await expect(page.locator("#controls-drawer .drawer-case")).toBeHidden(); }
  await page.evaluate((n) => { const r = new URL(location.href).searchParams.get("s")!; const ch = new BroadcastChannel(`board:${r}`); for (let i = 0; i < n; i++) ch.postMessage({ kind: "hi", data: {}, from: `room-${i}` }); setTimeout(() => ch.close(), 0); }, n);
  await expect.poll(() => page.locator(".players-roster .player-row").count(), { timeout: 15000 }).toBe(n + 1);
}
const census = (p: Page) => p.evaluate(({ KEYS, PROPS }) => {
  const out: Record<string, unknown[]> = {};
  for (const k of KEYS) out[k] = [...document.querySelectorAll<HTMLElement>(k)].slice(0, k === ".sudoku-cell" ? 1 : 6).map((el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return { tag: el.tagName, rect: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(2)), sh: el.scrollHeight, ...Object.fromEntries(PROPS.map((q) => [q, cs.getPropertyValue(q)])) }; });
  const well = document.querySelector(".players-roster")?.closest(".tray-well") as HTMLElement | null;
  const wr = well?.getBoundingClientRect();
  const card = document.querySelector(".controls-card") as HTMLElement;
  const est = { well: wr ? [+wr.width.toFixed(1), +wr.height.toFixed(1)] : null, cardScrollH: card?.scrollHeight, cardClientH: card?.clientHeight, wrapY: +(document.querySelector(".control-panel-wrap")?.getBoundingClientRect().y ?? NaN).toFixed(2), wrapH: +(document.querySelector(".control-panel-wrap")?.getBoundingClientRect().height ?? NaN).toFixed(2) };
  return { out, est };
}, { KEYS, PROPS });
function diff(a: any, b: any) { const d: string[] = []; for (const k of Object.keys(a)) { const A = a[k], B = b[k]; if (A.length !== B.length) d.push(`${k} count ${A.length}→${B.length}`); for (let i = 0; i < Math.min(A.length, B.length); i++) for (const q of Object.keys(A[i])) if (JSON.stringify(A[i][q]) !== JSON.stringify(B[i][q])) d.push(`${k}[${i}].${q}: ${JSON.stringify(A[i][q])} → ${JSON.stringify(B[i][q])}`); } return d; }
test("room pi", async ({ browser }, info) => {
  const arms: Record<string, any> = {};
  for (const [name, base] of [["A", CTRL], ["B", PROTO], ["A2", CTRL]] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(`${base}/?size=3&difficulty=EASY&wire=local&board=${PAYLOAD}`);
    await settled(p);
    await room(p, 4);
    await stable(() => p.evaluate(() => [document.querySelector(".controls-card")?.scrollHeight, document.querySelector(".control-panel-wrap")?.getBoundingClientRect().y]));
    arms[name] = await census(p);
    await ctx.close();
  }
  const res = { engine: info.project.name, room: "5 at the table (self + 4 local-wire peers), desk 1280x800 fine, light, dev-vs-dev", payload: PAYLOAD.slice(0, 24), noise: diff(arms.A.out, arms.A2.out), delta: diff(arms.A.out, arms.B.out), est: { control: arms.A.est, proto: arms.B.est, control2: arms.A2.est } };
  writeFileSync(`${OUT}/room-${info.project.name}.json`, JSON.stringify(res, null, 1));
  console.log(`ROOM ${info.project.name} noise=${res.noise.length} delta=${res.delta.length} est=${JSON.stringify(res.est)}`);
});
