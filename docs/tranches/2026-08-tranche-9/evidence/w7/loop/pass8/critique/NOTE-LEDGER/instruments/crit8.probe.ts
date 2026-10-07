/** NOTE-LEDGER pass-8 CRITIC probe (scratch copy only; never in any worktree).
 *  ARM_PORT = the tree's dist (t8, index-DJCNAPCsWtTd) · CTL_PORT = w7-control (index-CubiZsMVSwTc).
 *  ONE payload: the section's classic easy 9x9 (30 givens), read back through input values + aria corpus.
 *  Modes (MODES env):
 *   plants   the empty voice's box under the CRITIC's new plants (N1 min-block-size, N3 guaranteed-invalid
 *            var seat, N4 element-keyed font, N5 the seat in a dead @supports, N9 the seat dark-only) with the
 *            shipped spec's own `holds` predicate, 390x844 + 844x390 coarse DPR2, both themes, arm only
 *   spoken   the claim the reserve exists for: the strip (.board-margin) and docH at rest vs spoken (a hint),
 *            arm AND control, 390x844 / 844x390 coarse DPR2 + 1280x800 fine DPR1; plus plant N11 (the voice's
 *            line grows only once it speaks) on the arm: the empty box must still pass `holds`, and the strip
 *            grows on speech (the invariant the row does not read) */
import { test, type Browser, type Page } from "@playwright/test";
import os from "node:os";
import { encodeSudoku } from "../e2e/wire";

const ARM_PORT = +(process.env.ARM_PORT ?? 4249);
const CTL_PORT = +(process.env.CTL_PORT ?? 4250);
const MODES = (process.env.MODES ?? "plants").split(",");
const G: Record<number, number> = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
const PAYLOAD = encodeSudoku(3, G, 81);
const EXPECTED = Array.from({ length: 81 }, (_, i) => (G[i] ? String(G[i]) : ".")).join("");
const load = () => `load ${os.loadavg()[0].toFixed(1)}`;
const out = (r: Record<string, unknown>) => console.log("C8ROW " + JSON.stringify(r));
type Rig = { w: number; h: number; coarse: boolean; dpr: number };
const RIG: Record<string, Rig> = {
  p390: { w: 390, h: 844, coarse: true, dpr: 2 },
  l844: { w: 844, h: 390, coarse: true, dpr: 2 },
  d1280: { w: 1280, h: 800, coarse: false, dpr: 1 },
};
async function open(browser: Browser, port: number, rig: Rig, scheme: "light" | "dark", eng: string) {
  const ctx = await browser.newContext({ viewport: { width: rig.w, height: rig.h }, deviceScaleFactor: rig.dpr, hasTouch: rig.coarse, isMobile: rig.coarse && eng === "chromium", colorScheme: scheme, reducedMotion: "no-preference" });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/?board=${PAYLOAD}`);
  await page.waitForSelector(".game-cell input", { timeout: 60000 });
  let got = "";
  for (let i = 0; i < 100; i++) {
    got = await page.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".game-cell input")].map((i) => i.value || ".").join(""));
    if (got === EXPECTED) break;
    await page.waitForTimeout(100);
  }
  if (got !== EXPECTED) throw new Error(`payload not dealt ${got}`);
  const aria = await page.evaluate(() => [...document.querySelectorAll(".game-cell input")].filter((i) => /given clue/.test(i.getAttribute("aria-label") ?? "")).length);
  if (aria !== 30) throw new Error(`aria corpus ${aria}`);
  const regime = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, dark: matchMedia("(prefers-color-scheme: dark)").matches }));
  if (regime.coarse !== rig.coarse || regime.dark !== (scheme === "dark")) throw new Error(`regime ${JSON.stringify(regime)}`);
  const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "");
  await page.waitForTimeout(1200);
  return { ctx, page, id: id.replace(/.*\//, "") };
}
const settle = (p: Page) => p.evaluate(() => new Promise((d) => requestAnimationFrame(() => requestAnimationFrame(d))));
/** the shipped spec's own read + predicate, verbatim in meaning */
const read = (p: Page) =>
  p.evaluate(() => {
    const voice = document.querySelector<HTMLElement>(".board-margin .margin-note")!;
    const block = voice.closest<HTMLElement>(".margin-note-block")!;
    const cs = getComputedStyle(voice);
    return { text: (voice.textContent ?? "").trim(), height: +voice.getBoundingClientRect().height.toFixed(2), line: parseFloat(cs.lineHeight), reserve: parseFloat(getComputedStyle(block).minHeight) || 0, display: cs.display, strip: +(document.querySelector(".board-margin") as HTMLElement).getBoundingClientRect().height.toFixed(2), docH: document.documentElement.scrollHeight };
  });
type R = Awaited<ReturnType<typeof read>>;
const holds = (r: R) => r.text === "" && r.height >= r.line - 0.5 && r.height >= r.reserve - 0.5;
const scopeOf = (p: Page) => p.evaluate(() => [...document.querySelector(".board-margin .margin-note")!.attributes].find((a) => a.name.startsWith("data-v-"))!.name);
/** CSSOM: the seat rule (`.margin-note[v] { min-height: inherit }` under the plain <1024 block) is deleted and `into` is inserted */
async function moveSeat(p: Page, scope: string, into: string) {
  return p.evaluate(([scope, into]) => {
    for (const sheet of [...document.styleSheets]) {
      const rules = [...sheet.cssRules];
      const media = rules.find((r): r is CSSMediaRule => r instanceof CSSMediaRule && /max-width: 1023\.98px/.test(r.conditionText) && !/orientation/.test(r.conditionText) && [...r.cssRules].some((x) => x instanceof CSSStyleRule && x.selectorText === `.margin-note[${scope}]` && x.style.getPropertyValue("min-height") === "inherit"));
      if (!media) continue;
      const at = [...media.cssRules].findIndex((x) => x instanceof CSSStyleRule && x.selectorText === `.margin-note[${scope}]` && x.style.getPropertyValue("min-height") === "inherit");
      const text = media.cssRules[at].cssText;
      media.deleteRule(at);
      const idx = sheet.insertRule(into.replace("SEAT", text), sheet.cssRules.length);
      (window as unknown as { __undo: () => void }).__undo = () => { sheet.deleteRule(idx); media.insertRule(text, at); };
      return true;
    }
    return false;
  }, [scope, into] as const);
}
async function ask(p: Page, wait = 1800) {
  await p.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".game-cell input")].find((i) => !i.value)?.focus());
  await p.keyboard.press("h");
  await p.waitForTimeout(wait);
  await p.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await p.waitForTimeout(400);
}

const PLANTS: { name: string; css?: (v: string) => string; seat?: string }[] = [
  { name: "N1 voice min-block-size:0 <1024 (logical longhand)", css: (v) => `@media (max-width: 1023.98px) { .margin-note[${v}] { min-block-size: 0; } }` },
  { name: "N2 block min-block-size:1px <1024", css: (v) => `@media (max-width: 1023.98px) { .margin-note-block[${v}] { min-block-size: 1px; } }` },
  { name: "N3 seat through a guaranteed-invalid var (--seat: inherit)", css: (v) => `@media (max-width: 1023.98px) { .margin-note[${v}] { --seat: inherit; min-height: var(--seat); } }` },
  { name: "N4 voice font by element (> p:first-child 40px)", css: (v) => `.margin-note-block[${v}] > p:first-child { font-size: 40px; }` },
  { name: "N5 the seat inside a dead @supports", seat: "@supports (display: nonsense) { @media (max-width: 1023.98px) { SEAT } }" },
  { name: "N9 the seat dark-only", seat: "@media (max-width: 1023.98px) and (prefers-color-scheme: dark) { SEAT }" },
  { name: "N8 the seat under (hover: hover)", seat: "@media (max-width: 1023.98px) and (hover: hover) { SEAT }" },
];

if (MODES.includes("plants"))
  for (const rigName of ["p390", "l844"])
    test(`plants ${rigName}`, async ({ browser, browserName }) => {
      for (const scheme of ["light", "dark"] as const) {
        const { ctx, page, id } = await open(browser, ARM_PORT, RIG[rigName], scheme, browserName);
        const clean = await read(page);
        out({ m: "plants", eng: browserName, rig: rigName, scheme, id, plant: "clean", holds: holds(clean), r: clean, load: load() });
        const v = await scopeOf(page);
        for (const pl of PLANTS) {
          let undo: () => Promise<unknown>;
          if (pl.seat) {
            if (!(await moveSeat(page, v, pl.seat))) throw new Error("no seat");
            undo = () => page.evaluate(() => (window as unknown as { __undo: () => void }).__undo());
          } else {
            const tag = await page.addStyleTag({ content: pl.css!(v) });
            undo = () => tag.evaluate((el) => (el as Element).remove());
          }
          await settle(page);
          const r = await read(page);
          await undo();
          await settle(page);
          const back = await read(page);
          out({ m: "plants", eng: browserName, rig: rigName, scheme, plant: pl.name, holds: holds(r), r, backHolds: holds(back) });
        }
        await ctx.close();
      }
    });

if (MODES.includes("spoken"))
  for (const rigName of ["p390", "l844", "d1280"])
    test(`spoken ${rigName}`, async ({ browser, browserName }) => {
      for (const [arm, port] of [["tree", ARM_PORT], ["control", CTL_PORT]] as const) {
        const { ctx, page, id } = await open(browser, port, RIG[rigName], "light", browserName);
        const rest = await read(page);
        await ask(page);
        const spoke = await read(page);
        out({ m: "spoken", eng: browserName, rig: rigName, arm, id, restHolds: holds(rest), rest, spoke, dStrip: +(spoke.strip - rest.strip).toFixed(2), dDoc: spoke.docH - rest.docH, load: load() });
        await ctx.close();
      }
      // N11 on the tree: the voice's line grows only once it speaks
      const { ctx, page } = await open(browser, ARM_PORT, RIG[rigName], "light", browserName);
      const v = await scopeOf(page);
      await page.addStyleTag({ content: `.margin-note[${v}]:not(:empty) { line-height: 2.2; }` });
      await settle(page);
      const rest = await read(page);
      await ask(page);
      const spoke = await read(page);
      out({ m: "spoken", eng: browserName, rig: rigName, arm: "tree+N11", restHolds: holds(rest), rest, spoke, dStrip: +(spoke.strip - rest.strip).toFixed(2), dDoc: spoke.docH - rest.docH, load: load() });
      await ctx.close();
    });

// N19: the DOUBLE evasion — element-keyed (source R4 reads class sites only) AND spoken-only (the spec reads
// the empty voice only). Both themes, both engines, the three cells; the spec's own predicate at rest.
if (MODES.includes("double"))
  for (const rigName of ["p390", "l844", "d1280"])
    test(`double ${rigName}`, async ({ browser, browserName }) => {
      for (const scheme of ["light", "dark"] as const)
        for (const sel of ["p:first-child:has(.margin-note-ink)", "p:first-child:not(:empty)"]) {
          const { ctx, page, id } = await open(browser, ARM_PORT, RIG[rigName], scheme, browserName);
          const v = await scopeOf(page);
          await page.addStyleTag({ content: `.margin-note-block[${v}] > ${sel} { line-height: 2.2; }` });
          await settle(page);
          const rest = await read(page);
          await ask(page);
          const spoke = await read(page);
          out({ m: "double", eng: browserName, rig: rigName, scheme, sel, id, restHolds: holds(rest), rest, spoke, dStrip: +(spoke.strip - rest.strip).toFixed(2), dDoc: spoke.docH - rest.docH, load: load() });
          await ctx.close();
        }
    });

// N6/N7: the seat in a @container that never matches; the seat selector narrowed to `:not([role])`.
if (MODES.includes("plants2"))
  test(`plants2 p390`, async ({ browser, browserName }) => {
    for (const scheme of ["light", "dark"] as const) {
      const { ctx, page, id } = await open(browser, ARM_PORT, RIG.p390, scheme, browserName);
      const v = await scopeOf(page);
      for (const [name, into] of [
        ["N6 the seat inside @container (min-width: 5000px)", "@media (max-width: 1023.98px) { @container (min-width: 5000px) { SEAT } }"],
        ["N7 the seat narrowed to :not([role])", "@media (max-width: 1023.98px) { SEATNOT }"],
      ] as const) {
        const seatText = `.margin-note[${v}]:not([role]) { min-height: inherit; }`;
        if (!(await moveSeat(page, v, into.replace("SEATNOT", seatText)))) throw new Error("no seat");
        await settle(page);
        const r = await read(page);
        await page.evaluate(() => (window as unknown as { __undo: () => void }).__undo());
        await settle(page);
        out({ m: "plants2", eng: browserName, scheme, id, plant: name, holds: holds(r), r, backHolds: holds(await read(page)) });
      }
      await ctx.close();
    }
  });

// the 2lh seat on the UNION (ARM_PORT serves L8): docH and the strip at rest and spoken, 1lh as shipped vs one
// stylesheet `.margin-note-block { min-height: 2lh !important }` (the only variable); both engines, light.
if (MODES.includes("seat2"))
  for (const rigName of ["d1280", "l844", "p390"])
    test(`seat2 ${rigName}`, async ({ browser, browserName }) => {
      for (const arm of ["1lh", "2lh"] as const) {
        const { ctx, page, id } = await open(browser, ARM_PORT, RIG[rigName], "light", browserName);
        if (arm === "2lh") await page.addStyleTag({ content: ".margin-note-block { min-height: 2lh !important; }" });
        await settle(page);
        const board = () => page.evaluate(() => +(document.querySelector(".game-cell") as HTMLElement).getBoundingClientRect().top.toFixed(2));
        const rest = await read(page);
        const bRest = await board();
        await ask(page);
        const spoke = await read(page);
        out({ m: "seat2", eng: browserName, rig: rigName, arm, id, docH: [rest.docH, spoke.docH], strip: [rest.strip, spoke.strip], boardTop: [bRest, await board()], load: load() });
        await ctx.close();
      }
    });
