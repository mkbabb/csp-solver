import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { mkdirSync, readFileSync, appendFileSync } from "node:fs";
// @ts-expect-error — the chair's instrument, imported by absolute path (LAWS P6 §I: the ONE copy)
import { openThenResize, atRest } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments/rest-probes.mjs";
// @ts-expect-error — the chair's instrument
import { glyphPopulation, TEXT_PLANTS, applyTail, undoTail } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments/glyph-pop.mjs";
// PLR-PLACE pass 7 · the census (the kill table + the yield's cells), the resize-at-rest probe and the
// painted AA of the names, on ONE payload (pass 5's kill-payload.json, read back per page), A's id seeded
// (Math.random re-seeded the instant before the invite), B's id PINNED p-0000000b0b0b through
// `session-identity-v1` (LAWS P6 §C), extra seats by `hi` with fixed ids. PLC_ARM labels the build.
const ARM = process.env.PLC_ARM ?? "";
const OUT = process.env.PLC_OUT ?? "";
const PAY = process.env.PLC_PAYLOAD ?? "";
const WHAT = process.env.PLC_WHAT ?? "census";
if (!ARM || !OUT || !PAY) throw new Error("PLC_ARM, PLC_OUT, PLC_PAYLOAD are required");
const { payload, given } = JSON.parse(readFileSync(PAY, "utf8"));
const givens = (p: Page) => p.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")].map((i) => (/given clue/.test(i.getAttribute("aria-label") ?? "") && i.value ? i.value : "0")).join(""));
async function settled(p: Page) { await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 }); await expect.poll(() => givens(p).then((g) => g.replace(/0/g, "").length), { timeout: 20000 }).toBeGreaterThan(20); }
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol(); await expect.poll(async () => { const v = JSON.stringify(await read()); const same = v === last; last = v; return same; }, { intervals: [150], timeout: 8000 }).toBe(true); }
const line = (s: string) => { mkdirSync(OUT, { recursive: true }); appendFileSync(`${OUT}/${WHAT}.txt`, s + "\n"); console.log(s); };

async function room(ctx: BrowserContext, n: number, scheme: "light" | "dark" = "light") {
  await ctx.addInitScript(() => { let s = 0x0b0b0b; Math.random = () => ((s = (s * 16807) % 2147483647) / 2147483647); (window as any).__reseed = () => { s = 0x0a0a0a; }; });
  const a = await ctx.newPage();
  await a.emulateMedia({ colorScheme: scheme });
  await a.goto(`/?size=3&difficulty=EASY&wire=local&board=${payload}`); await settled(a);
  expect(await givens(a), "A reads the payload").toBe(given);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  const docked = !(await verb.isVisible());
  if (docked) { await a.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await a.evaluate(() => (window as any).__reseed()); await verb.click();
  await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden(); }
  const link = a.url(); const rm = new URL(link).searchParams.get("s")!;
  const b = await ctx.newPage();
  await b.emulateMedia({ colorScheme: scheme });
  await b.addInitScript((r) => sessionStorage.setItem("session-identity-v1", JSON.stringify({ [r]: "p-0000000b0b0b" })), rm);
  await b.goto(link); await settled(b);
  expect(await givens(b), "B reads the payload").toBe(given);
  const bId = await b.evaluate(() => sessionStorage.getItem("session-identity-v1"));
  const touch = await b.evaluate(() => matchMedia("(pointer: coarse)").matches);
  if (touch) await b.locator(".sudoku-cell input").nth(10).tap(); else await b.locator(".sudoku-cell input").nth(10).click();
  if (n > 2) await a.evaluate(({ rm, k }) => { const ch = new BroadcastChannel(`board:${rm}`); for (let i = 0; i < k; i++) ch.postMessage({ kind: "hi", data: {}, from: `pin-${i}` }); setTimeout(() => ch.close(), 0); }, { rm, k: n - 2 });
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(n);
  const slugs = await a.evaluate(() => [...document.querySelectorAll(".players-roster .player-row .player-name")].map((e) => e.textContent?.trim()));
  return { a, b, bId, slugs };
}
const read = (a: Page) => a.evaluate(() => {
  const shEl = document.querySelector("[data-lobby].is-open");
  if (!shEl) return { open: false } as Record<string, unknown>;
  const sh = shEl.getBoundingClientRect();
  const cells = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
  const top = Math.min(...cells.map((c) => c.top)), left = Math.min(...cells.map((c) => c.left));
  const lapped = cells.filter((c) => c.left < sh.right && c.right > sh.left && c.top < sh.bottom && c.bottom > sh.top).length;
  return { open: true, H: +sh.height.toFixed(2), W: +sh.width.toFixed(2), gridTop: +top.toFixed(2), gridLeft: +left.toFixed(2), lap: lapped ? +Math.max(0, sh.bottom - top).toFixed(2) : 0, lapped, chart: !!shEl.querySelector(".place-chart"), dots: shEl.querySelectorAll(".chart-dot").length, rows: shEl.querySelectorAll(".pl-row").length, more: shEl.querySelector(".pl-more")?.textContent?.trim() ?? "" };
});
const markOf = (a: Page) => a.locator("[data-player-mark]:visible");
async function toggle(a: Page, coarse: boolean) { if (coarse) await markOf(a).tap(); else await markOf(a).click(); }

type Cell = { w: number; h: number; n: number; fine?: boolean };
const CELLS: Cell[] = JSON.parse(process.env.PLC_CELLS ?? "[]");

if (WHAT === "census") for (const c of CELLS) test(`census ${c.w}x${c.h} n${c.n}${c.fine ? " fine" : ""}`, async ({ browser }, info) => {
  test.slow();
  const coarse = !c.fine;
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: coarse, isMobile: coarse, deviceScaleFactor: 1 });
  const { a, bId, slugs } = await room(ctx, c.n);
  const witnessed = await a.evaluate(() => matchMedia("(pointer: coarse)").matches);
  expect(witnessed).toBe(coarse);
  await toggle(a, coarse);
  await expect(a.locator("[data-lobby].is-open")).toBeVisible();
  await atRest(a); await stable(() => read(a));
  const g = await read(a);
  line(`CENSUS|${info.project.name}|${ARM}|${c.w}x${c.h} n${c.n} ${coarse ? "coarse" : "fine"}|payload=${payload.slice(0, 14)}…|B=${bId}|slugs=${slugs.join(",")}|${JSON.stringify(g)}`);
  await ctx.close();
});

// RESIZE AT REST (the chair's `openThenResize`): open at A, resize to B, rest, read; close; reopen; read.
if (WHAT === "resize") for (const c of JSON.parse(process.env.PLC_RSZ ?? "[]") as { n: number; from: [number, number]; to: [number, number] }[]) test(`resize n${c.n} ${c.from.join("x")} -> ${c.to.join("x")}`, async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: c.from[0], height: c.from[1] }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const { a, bId } = await room(ctx, c.n);
  const r = await openThenResize(a, {
    open: async () => { await toggle(a, true); await expect(markOf(a)).toHaveAttribute("aria-expanded", "true"); },
    close: async () => { await toggle(a, true); await expect(markOf(a)).toHaveAttribute("aria-expanded", "false"); },
    read: () => read(a).then((g) => ({ rows: g.rows, chart: g.chart, lap: g.lap, lapped: g.lapped, H: g.H })),
    to: { width: c.to[0], height: c.to[1] },
  });
  line(`RESIZE|${info.project.name}|${ARM}|n${c.n} ${c.from.join("x")}->${c.to.join("x")}|B=${bId}|${JSON.stringify(r)}`);
  await ctx.close();
});

// PAINTED AA on the names (the chair's glyph-population probe, both text plants in-run): B's row (pinned).
if (WHAT === "aa") for (const scheme of ["light", "dark"] as const) for (const vp of [{ w: 1280, h: 800, fine: true }, { w: 390, h: 860, fine: false }]) test(`aa ${scheme} ${vp.w}x${vp.h}`, async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: !vp.fine, isMobile: !vp.fine, deviceScaleFactor: 1, colorScheme: scheme, reducedMotion: "reduce" });
  const { a, bId, slugs } = await room(ctx, 2, scheme);
  await toggle(a, !vp.fine);
  await expect(a.locator("[data-lobby].is-open")).toBeVisible();
  await atRest(a); await stable(() => read(a));
  const g = await read(a);
  const subj = "[data-lobby].is-open .pl-row:nth-child(2) .pl-name";
  const text = await a.locator(subj).textContent();
  const clean = await glyphPopulation(a, { subject: subj });
  const bound = clean.fracUnder + 0.05;
  const plants: Record<string, string> = {};
  for (const [k, v] of Object.entries(TEXT_PLANTS(subj))) {
    let r;
    if (typeof v === "string") { const t = await a.addStyleTag({ content: v }); await a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); r = await glyphPopulation(a, { subject: subj, fracBound: bound }); await t.evaluate((e) => e.remove()); }
    else { await applyTail(a, subj, (v as { tail: number }).tail); r = await glyphPopulation(a, { subject: subj, fracBound: bound }); await undoTail(a, subj); }
    plants[k] = `${r.red ? "RED" : "GREEN"}(${r.population}/${r.coreMedian}/${r.fracUnder})`;
  }
  line(`AA|${info.project.name}|${ARM}|${scheme}|${vp.w}x${vp.h} ${vp.fine ? "fine" : "coarse"}|B=${bId}|name=${text}|slugs=${slugs.join(",")}|chart=${g.chart}|clean=${clean.red ? "RED" : "GREEN"} pop ${clean.population} median ${clean.coreMedian} under4.5 ${clean.fracUnder} slices ${JSON.stringify(clean.slices)} why ${JSON.stringify(clean.why)}|plants ${JSON.stringify(plants)}`);
  await ctx.close();
});

// THE FRAMES: the yield where it differs from EACH other arm (LAWS P6 §C), one payload, PRM reduce (the
// boil and the sun parked), light, coarse witnessed, DPR 1. One raw pane per arm per cell; compose.mjs cuts it.
if (WHAT === "crop") for (const c of [{ w: 390, h: 664 }, { w: 390, h: 860 }]) test(`crop ${c.w}x${c.h}`, async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: true, isMobile: true, deviceScaleFactor: 1, colorScheme: "light", reducedMotion: "reduce" });
  const { a, bId, slugs } = await room(ctx, 2);
  expect(await a.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
  await toggle(a, true);
  await expect(a.locator("[data-lobby].is-open")).toBeVisible();
  await atRest(a); await stable(() => read(a));
  const g = await read(a);
  const H = Math.min(c.h, Math.ceil((g.gridTop as number) + 150));
  await a.screenshot({ path: `${OUT}/crop-${ARM}-${c.w}x${c.h}-${info.project.name}.png`, clip: { x: 0, y: 0, width: c.w, height: H } });
  line(`CROP|${info.project.name}|${ARM}|${c.w}x${c.h} coarse light PRM dpr1|payload=${payload.slice(0, 14)}…|B=${bId}|slugs=${slugs.join(",")}|givens read back on A and B|${JSON.stringify(g)}`);
  await ctx.close();
});

// THE SAME INK ON THE ESTATE'S OWN SURFACE (the controls card's roster), tree AND control (dev, read-only):
// the "wherever the control clears it" clause of LAWS P6 §E needs the control's reading of B's name.
if (WHAT === "aa-roster") for (const scheme of ["light", "dark"] as const) test(`aa-roster ${scheme}`, async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, colorScheme: scheme, reducedMotion: "reduce" });
  const { a, bId, slugs } = await room(ctx, 2, scheme);
  const subj = ".players-roster .player-row:nth-child(2) .player-name";
  await expect(a.locator(subj)).toBeVisible();
  await atRest(a);
  const text = await a.locator(subj).textContent();
  const clean = await glyphPopulation(a, { subject: subj });
  const t = await a.addStyleTag({ content: TEXT_PLANTS(subj).FAINT30_fill }); await a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const faint = await glyphPopulation(a, { subject: subj }); await t.evaluate((e) => e.remove());
  line(`AAROSTER|${info.project.name}|${ARM}|${scheme}|1280x800 fine|B=${bId}|name=${text}|slugs=${slugs.join(",")}|clean=${clean.red ? "RED" : "GREEN"} pop ${clean.population} median ${clean.coreMedian} under4.5 ${clean.fracUnder} why ${JSON.stringify(clean.why)}|FAINT30 ${faint.red ? "RED" : "GREEN"} ${faint.coreMedian}`);
  await ctx.close();
});

// A MOUSE PRESS ON THE OPEN SHEET (the fine pointer): does it shut the sheet, and where is focus after?
if (WHAT === "mouse") test("mouse press on the open sheet", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const { a } = await room(ctx, 2);
  await a.locator(".sudoku-cell input").nth(40).click();
  await markOf(a).click();
  await expect(markOf(a)).toHaveAttribute("aria-expanded", "true");
  await atRest(a);
  const box = (await a.locator("[data-lobby].is-open").boundingBox())!;
  await a.mouse.click(box.x + box.width / 2, box.y + 12);
  // sleep-ok: the probe reads the pose after the press has run
  await a.waitForTimeout(400);
  const r = { expanded: await markOf(a).getAttribute("aria-expanded"), focus: await a.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.tagName) };
  line(`MOUSE|${info.project.name}|${ARM}|${JSON.stringify(r)}`);
  await ctx.close();
});
