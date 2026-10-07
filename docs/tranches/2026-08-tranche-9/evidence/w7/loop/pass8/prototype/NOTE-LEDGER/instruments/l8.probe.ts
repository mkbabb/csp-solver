/** NOTE-LEDGER pass-8 scratch probe (out-of-tree copy only; never in the worktree).
 *  ARM_PORT = the arm's dist · CTL_PORT = the control (w7-control, index-CubiZsMVSwTc) · ARM = label · MODES.
 *  ONE payload: the section's classic easy 9x9 (30 givens), read back through the input corpus AND the
 *  aria-label corpus before any read. Instruments by relative PRODUCT path (../e2e/lib/glyph-pop.mjs).
 *  Modes:
 *   pi      whole-DOM rects + line-height/min-height of every `#app *`, arm vs control, the control read twice
 *           (the in-run floor); at rest and after a hint; 390x844 coarse, 844x390 coarse, 1280x800 fine
 *   seat    the 2lh seat's cost: docH / the block / the board's top at rest, spoken, and pushed (line two
 *           present), with the block's seat as shipped (1lh) and at 2lh (one stylesheet, the only variable)
 *   glyph   the glyph-population probe on line one at P1 +500 ms and at rest (+2.6 s), 1280 fine DPR 1, both
 *           themes, arm AND control
 *   sixteen a 16x16 payload dealt, read back through the aria-label corpus (104 givens), arm AND control
 *   frames  the T9-B-LEDGER panels: 390x844 coarse DPR 2 light P4 +100 ms / rest, dark rest; 1280 fine DPR 1 rest */
import { test, type Browser, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import os from "node:os";
import { encodeSudoku } from "../e2e/wire";
import { glyphPopulation } from "../e2e/lib/glyph-pop.mjs";

const ARM = process.env.ARM ?? "arm";
const ARM_PORT = +(process.env.ARM_PORT ?? 4249);
const CTL_PORT = +(process.env.CTL_PORT ?? 4250);
const MODES = (process.env.MODES ?? "pi").split(",");
const PANELS = process.env.PANELS ?? "/nonexistent";
const G: Record<number, number> = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
const PAYLOAD = encodeSudoku(3, G, 81);
const EXPECTED = Array.from({ length: 81 }, (_, i) => (G[i] ? String(G[i]) : ".")).join("");
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const load = () => `load ${os.loadavg()[0].toFixed(1)}`;
const row = (eng: string, r: Record<string, unknown>) => console.log("L8ROW " + JSON.stringify({ eng, arm: ARM, ...r }));
type Rig = { w: number; h: number; coarse: boolean; dpr: number };
const RIG: Record<string, Rig> = {
  desk1: { w: 1280, h: 800, coarse: false, dpr: 1 },
  phone2: { w: 390, h: 844, coarse: true, dpr: 2 },
  l844: { w: 844, h: 390, coarse: true, dpr: 2 },
  l812: { w: 812, h: 375, coarse: true, dpr: 2 },
};
const bs = (p: Page) => p.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".game-cell input")].map((i) => i.value || ".").join(""));
const ariaGivens = (p: Page, side: number) =>
  p.evaluate((side) => {
    const out: Record<number, string> = {};
    for (const i of document.querySelectorAll(".game-cell input")) {
      const m = /^Row (\d+), column (\d+), given clue (\S+)/.exec(i.getAttribute("aria-label") ?? "");
      if (m) out[(+m[1] - 1) * side + (+m[2] - 1)] = m[3];
    }
    return out;
  }, side);
async function open(browser: Browser, port: number, rig: Rig, scheme: "light" | "dark", payload?: string, eng = "") {
  const ctx = await browser.newContext({ viewport: { width: rig.w, height: rig.h }, deviceScaleFactor: rig.dpr, hasTouch: rig.coarse, isMobile: rig.coarse && eng === "chromium", colorScheme: scheme, reducedMotion: "no-preference" });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/?board=${payload ?? PAYLOAD}`);
  await page.waitForSelector(".game-cell input", { timeout: 60000 });
  if (!payload) {
    let got = "";
    for (let i = 0; i < 100; i++) { got = await bs(page); if (got === EXPECTED) break; await page.waitForTimeout(100); }
    if (got !== EXPECTED) throw new Error(`payload not dealt ${got}`);
    const aria = await ariaGivens(page, 9);
    const want = Object.fromEntries(Object.entries(G).map(([k, v]) => [k, String(v)]));
    if (JSON.stringify(aria) !== JSON.stringify(want)) throw new Error(`aria corpus disagrees`);
  }
  const regime = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, dark: matchMedia("(prefers-color-scheme: dark)").matches }));
  if (regime.coarse !== rig.coarse || regime.dark !== (scheme === "dark")) throw new Error(`regime not witnessed ${JSON.stringify(regime)}`);
  const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "");
  await page.waitForTimeout(1200);
  return { ctx, page, id: id.replace(/.*\//, "") };
}
const lines = (p: Page) => p.evaluate(() => {
  const a = document.querySelector(".board-margin .margin-note");
  const b = document.querySelector(".board-margin .margin-note-previous");
  return { one: a?.textContent?.trim() ?? "", two: b?.textContent?.trim() ?? "" };
});
async function ask(p: Page, wait = 900) {
  await p.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".game-cell input")].find((i) => !i.value)?.focus());
  await p.keyboard.press("h");
  await p.waitForTimeout(wait);
}
async function answer(p: Page, wait = 900) {
  const s = (await lines(p)).one;
  const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1];
  if (!d) throw new Error(`no digit in "${s}"`);
  const t = await p.evaluate(([d, sol]) => [...document.querySelectorAll(".game-cell")].map((c, i) => ({ c, i })).filter(({ c, i }) => c.querySelector(".cell-because") && !(c.querySelector("input") as HTMLInputElement).value && sol[i] === d).map(({ i }) => i), [d, SOL] as const);
  if (t.length !== 1) throw new Error(`"${s}": ${t.length} targets`);
  await p.locator(".game-cell input").nth(t[0]).focus();
  await p.keyboard.type(d);
  if (wait) await p.waitForTimeout(wait);
}
const rafs = (p: Page) => p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

if (MODES.includes("pi"))
  for (const rigName of ["phone2", "l844", "desk1"])
    test(`pi ${rigName}`, async ({ browser, browserName }) => {
      const snap = (p: Page) => p.evaluate(() => {
        const out: string[] = [];
        document.querySelectorAll("#app *").forEach((el, i) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); const inNote = !!el.closest(".margin-note-block"); out.push(`${i}|${el.tagName}.${(el.getAttribute("class") || "").split(/\s+/)[0]}|${inNote ? "NOTE" : ""}|${r.x.toFixed(2)},${r.y.toFixed(2)},${r.width.toFixed(2)},${r.height.toFixed(2)}|${cs.lineHeight}|${cs.minHeight}`); });
        return { rows: out, docH: document.documentElement.scrollHeight };
      });
      type Snap = Awaited<ReturnType<typeof snap>>;
      const got: Record<string, { rest: Snap; spoke: Snap; id: string }> = {};
      for (const [arm, port] of [["arm", ARM_PORT], ["ctl", CTL_PORT], ["ctl2", CTL_PORT]] as const) {
        const { ctx, page, id } = await open(browser, port, RIG[rigName], "light", undefined, browserName);
        await page.waitForTimeout(300);
        const rest = await snap(page);
        await ask(page, 1800);
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
        await page.waitForTimeout(400);
        got[arm] = { rest, spoke: await snap(page), id };
        await ctx.close();
      }
      const cmp = (a: Snap, b: Snap) => {
        let note = 0, other = 0; const sample: string[] = [];
        const n = Math.max(a.rows.length, b.rows.length);
        for (let i = 0; i < n; i++) if (a.rows[i] !== b.rows[i]) { if ((a.rows[i] ?? "").includes("|NOTE|") || (b.rows[i] ?? "").includes("|NOTE|")) note++; else { other++; if (sample.length < 3) sample.push(`${a.rows[i]} != ${b.rows[i]}`); } }
        return { nA: a.rows.length, nB: b.rows.length, noteDiffs: note, unclaimedDiffs: other, docH: [a.docH, b.docH], sample };
      };
      row(browserName, { m: "pi", rig: rigName, ids: [got.arm.id, got.ctl.id], rest: cmp(got.arm.rest, got.ctl.rest), spoke: cmp(got.arm.spoke, got.ctl.spoke), floorRest: cmp(got.ctl.rest, got.ctl2.rest), floorSpoke: cmp(got.ctl.spoke, got.ctl2.spoke), load: load() });
    });

if (MODES.includes("seat"))
  for (const rigName of ["desk1", "l844", "l812", "phone2"])
    test(`seat ${rigName}`, async ({ browser, browserName }) => {
      const read = (p: Page) => p.evaluate(() => {
        const b = document.querySelector(".board-margin .margin-note-block") as HTMLElement | null;
        const board = document.querySelector(".game-board, .board, [data-board]") ?? document.querySelector(".game-cell")?.closest("div");
        const two = document.querySelector(".board-margin .margin-note-previous");
        return { docH: document.documentElement.scrollHeight, block: b ? +b.getBoundingClientRect().height.toFixed(2) : null, blockTop: b ? +b.getBoundingClientRect().top.toFixed(2) : null, boardTop: board ? +board.getBoundingClientRect().top.toFixed(2) : null, twoPos: two ? getComputedStyle(two).position : null, lh: b ? getComputedStyle(b).lineHeight : null };
      });
      const TWO = ".margin-note-block { min-height: 2lh !important; }";
      for (const scheme of ["light"] as const) {
        const { ctx, page, id } = await open(browser, ARM_PORT, RIG[rigName], scheme, undefined, browserName);
        const out: Record<string, unknown> = { id };
        for (const pose of ["rest", "spoken", "pushed"] as const) {
          if (pose === "spoken") await ask(page, 1600);
          if (pose === "pushed") { await answer(page, 1600); await ask(page, 1600); }
          await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
          await page.waitForTimeout(300);
          const one = await read(page);
          const tag = await page.addStyleTag({ content: TWO });
          await rafs(page);
          const two = await read(page);
          await tag.evaluate((e) => e.remove());
          await rafs(page);
          const back = await read(page);
          out[pose] = { one, two, back, lines: await lines(page), dDocH: +(two.docH - one.docH).toFixed(2), dBlock: two.block != null && one.block != null ? +(two.block - one.block).toFixed(2) : null };
        }
        row(browserName, { m: "seat", rig: rigName, scheme, ...out, load: load() });
        await ctx.close();
      }
    });

if (MODES.includes("glyph"))
  for (const scheme of ["light", "dark"] as const)
    test(`glyph ${scheme}`, async ({ browser, browserName }) => {
      for (const [arm, port] of [[ARM, ARM_PORT], ["control", CTL_PORT]] as const)
        for (const when of [500, 2600]) {
          const { ctx, page, id } = await open(browser, port, RIG.desk1, scheme, undefined, browserName);
          await ask(page); await answer(page, when);
          const g = await glyphPopulation(page, { subject: ".board-margin .margin-note" });
          row(browserName, { m: "glyph", side: arm, id, scheme, when, rig: "1280x800 fine DPR1", pop: g.population, median: g.coreMedian, fracUnder: g.fracUnder, red: g.red, why: g.why, lines: await lines(page), load: load() });
          await ctx.close();
        }
    });

if (MODES.includes("glyphask"))
  for (const scheme of ["light", "dark"] as const)
    test(`glyph at the ask ${scheme}`, async ({ browser, browserName }) => {
      // the like-for-like pose on BOTH sides: the hint's sentence alone (the control clears its note on the proof)
      for (const [arm, port] of [[ARM, ARM_PORT], ["control", CTL_PORT]] as const)
        for (const when of [500, 2600]) {
          const { ctx, page, id } = await open(browser, port, RIG.desk1, scheme, undefined, browserName);
          await ask(page, when);
          const g = await glyphPopulation(page, { subject: ".board-margin .margin-note" });
          row(browserName, { m: "glyphask", side: arm, id, scheme, when, rig: "1280x800 fine DPR1", pop: g.population, median: g.coreMedian, fracUnder: g.fracUnder, red: g.red, why: g.why, lines: await lines(page), load: load() });
          await ctx.close();
        }
    });

if (MODES.includes("sixteen"))
  test("sixteen", async ({ browser, browserName }) => {
    const sol: number[] = []; for (let r = 0; r < 16; r++) for (let c = 0; c < 16; c++) sol.push(((r % 4) * 4 + Math.floor(r / 4) + c) % 16 + 1);
    let seed = 7; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
    const give = sol.map((v) => (rnd() < 0.4 ? v : 0));
    const cells16: Record<number, number> = {}; give.forEach((v, i) => { if (v) cells16[i] = v; });
    const payload = encodeSudoku(4, cells16, 256);
    const glyph = (v: number) => (v <= 9 ? String(v) : String.fromCharCode(55 + v));
    const want: Record<string, string> = {}; give.forEach((v, i) => { if (v) want[i] = glyph(v); });
    for (const [arm, port] of [[ARM, ARM_PORT], ["control", CTL_PORT]] as const) {
      const { ctx, page, id } = await open(browser, port, RIG.desk1, "light", payload, browserName);
      let aria: Record<number, string> = {};
      for (let i = 0; i < 100; i++) { aria = await ariaGivens(page, 16); if (Object.keys(aria).length >= Object.keys(want).length) break; await page.waitForTimeout(100); }
      const inputs = await page.evaluate(() => document.querySelectorAll(".game-cell input").length);
      const miss = Object.keys(want).filter((k) => aria[+k] !== want[k]);
      const extra = Object.keys(aria).filter((k) => !(k in want));
      row(browserName, { m: "sixteen", side: arm, id, payload: payload.slice(0, 24) + "…", payloadLen: payload.length, inputs, givensDealt: Object.keys(want).length, ariaGivens: Object.keys(aria).length, mismatched: miss.length, extra: extra.length, sample: Object.entries(aria).filter(([, v]) => /[A-G]/.test(v)).slice(0, 2), load: load() });
      await ctx.close();
    }
  });

if (MODES.includes("frames"))
  test("frames", async ({ browser, browserName }) => {
    mkdirSync(PANELS, { recursive: true });
    for (const [rig, scheme, when] of [["phone2", "light", "p100"], ["phone2", "light", "rest"], ["phone2", "dark", "rest"], ["desk1", "light", "rest"]] as const) {
      const { ctx, page, id } = await open(browser, ARM_PORT, RIG[rig], scheme, undefined, browserName);
      await ask(page); await answer(page); await ask(page);
      await answer(page, when === "p100" ? 100 : 2600);
      const clip = await page.evaluate(() => {
        const m = document.querySelector(".board-margin")!.getBoundingClientRect();
        const x = Math.max(0, Math.floor(m.left) - 6), y = Math.max(0, Math.floor(m.top) - 6);
        return { x, y, width: Math.min(innerWidth - x, Math.ceil(m.width) + 12), height: Math.ceil(Math.max(m.height, 30)) + 36 };
      });
      await page.screenshot({ path: `${PANELS}/${browserName}-${rig}-${scheme}-${when}-${ARM}.png`, clip });
      row(browserName, { m: "frame", id, rig, scheme, when, clip, lines: await lines(page), load: load() });
      await ctx.close();
    }
  });
