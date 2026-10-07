/** NOTE-ERASE pass-8 CRITIC probe (independent of the lane's spec): post-paint leave lifetimes. */
import { test, expect, type Page } from "@playwright/test";
import { encodeSudoku } from "../e2e/wire";
import os from "node:os";
const PORT = process.env.CRIT_PORT!; const WANT = process.env.CRIT_WANT!; const MODE = process.env.CRIT_MODE!;
const REPS = +(process.env.CRIT_REPS ?? 3);
const BASE = `http://127.0.0.1:${PORT}`;
const HOLD = encodeSudoku(3, { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 }, 81);
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const S9 = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const CONFLICT = encodeSudoku(3, Object.fromEntries(S9.map((v, i) => [i, i < 9 ? 0 : v])), 81);
/** The pass-7 hook's write: whatever the new hook decides, the animation axis gets the rung (150ms). */
const PASS7_WRITE = `(() => { const set = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function (p, v, pr) {
    if (p === 'animation-duration' && v === '0s' && pr === 'important') v = '150ms';
    return set.call(this, p, v, pr); }; })();`;
const lineOne = (p: Page) => p.evaluate(() => (document.querySelector(".board-margin .margin-note")?.textContent ?? "").trim());
const lineTwo = (p: Page) => p.evaluate(() => (document.querySelector(".board-margin .margin-note-previous")?.textContent ?? "").trim());
async function open(page: Page, board: string) {
  await page.goto(`${BASE}/?board=${board}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "");
  expect(id).toContain(WANT);
  await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(600);
}
async function ask(page: Page) {
  const before = await lineOne(page);
  await page.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
  await page.keyboard.press("h");
  await expect.poll(() => lineOne(page), { timeout: 8000 }).not.toBe(before);
}
async function answer(page: Page) {
  const s = await lineOne(page);
  const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1];
  if (!d) throw new Error(`no digit in "${s}"`);
  const t = await page.evaluate(([d, sol]) => [...document.querySelectorAll(".game-cell")].map((c, i) => ({ c, i })).filter(({ c, i }) => c.querySelector(".cell-because") && !(c.querySelector("input") as HTMLInputElement).value && sol[i] === d).map(({ i }) => i), [d, SOL] as const);
  if (t.length !== 1) throw new Error(`"${s}": ${t.length} targets`);
  await page.locator(".game-cell input").nth(t[0]).focus();
  await page.keyboard.type(d);
}
/** POST-PAINT watcher: a MutationObserver stamps the leave node's birth/death; every rAF queues a
 *  MessageChannel task (after that frame's paint) that records whether the old node is still connected
 *  and visible, and whether line two paints the same sentence. */
async function watch(page: Page, sel: string) {
  await page.evaluate((sel) => {
    const r: any = { post: 0, postBoth: 0, postVis: 0 }; (window as any).__c = r;
    new MutationObserver(() => {
      const el = r.el ?? document.querySelector(sel);
      if (el && !r.el) { const cs = getComputedStyle(el); Object.assign(r, { el, t0: performance.now(), an: cs.animationName, ad: cs.animationDuration, cls: el.className, text: (el.textContent ?? "").trim() }); }
      if (r.el && r.t1 === undefined && !r.el.isConnected) r.t1 = performance.now();
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
    const ch = new MessageChannel();
    ch.port1.onmessage = () => {
      if (!r.el || r.done) return;
      if (r.el.isConnected) {
        r.post++;
        const cs = getComputedStyle(r.el); const vis = +cs.opacity > 0.05 && cs.visibility !== "hidden";
        if (vis) r.postVis++;
        const two = (document.querySelector(".board-margin .margin-note-previous")?.textContent ?? "").trim();
        if (vis && two && r.text && two.includes(r.text.slice(0, 12))) r.postBoth++;
      } else r.done = true;
    };
    const tick = () => { ch.port2.postMessage(0); if (!r.done) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, sel);
  return async () => {
    await expect.poll(() => page.evaluate(() => (window as any).__c.t1 !== undefined), { timeout: 8000 }).toBe(true);
    await page.waitForTimeout(120);
    return page.evaluate(() => { const r = (window as any).__c; return { ms: Math.round((r.t1 - r.t0) * 10) / 10, an: r.an, ad: r.ad, cls: r.cls, post: r.post, postVis: r.postVis, postBoth: r.postBoth }; });
  };
}
const load = () => os.loadavg().map((x: number) => x.toFixed(0)).join("/");
if (MODE === "swap")
  for (const [arm, scheme, init, css] of [
    ["clean", "light", "", ""], ["clean", "dark", "", ""],
    ["neg-pass7-write", "light", PASS7_WRITE, ""],
    ["ghost-name", "light", "", ".margin-note-ink.note-swap-leave-active{animation-name:critghost !important}"],
  ] as const)
    for (let rep = 1; rep <= (arm === "clean" ? REPS : 2); rep++)
      test(`swap ${arm} ${scheme} r${rep}`, async ({ page, browserName }) => {
        if (init) await page.addInitScript(init);
        await page.emulateMedia({ colorScheme: scheme });
        await open(page, HOLD);
        if (css) await page.addStyleTag({ content: css });
        await ask(page); await answer(page); await page.waitForTimeout(700);
        const held = await lineOne(page);
        const done = await watch(page, ".board-margin .margin-note .margin-note-ink[class*='leave-active']");
        await ask(page);
        const r = await done();
        await expect.poll(() => lineTwo(page)).toBe(held);
        console.log(`CRIT|swap|${browserName}|${arm}|${scheme}|r${rep}|load ${load()}|${JSON.stringify(r)}`);
      });
if (MODE === "still")
  for (const [arm, prm, init, css] of [
    ["prm", true, "", ""],
    ["name-none-important", false, "", ".margin-note-ink.note-leave-active{animation-name:none !important}"],
    ["rubout-clean", false, "", ""],
    ["neg-pass7-write-prm", true, PASS7_WRITE, ""],
  ] as const)
    for (let rep = 1; rep <= (arm.startsWith("neg") || arm === "rubout-clean" ? 2 : REPS); rep++)
      test(`still ${arm} r${rep}`, async ({ page, browserName }) => {
        if (init) await page.addInitScript(init);
        if (prm) await page.emulateMedia({ reducedMotion: "reduce" });
        await open(page, CONFLICT);
        await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 20000 }).toBe(72);
        if (css) await page.addStyleTag({ content: css });
        const setV = (i: number, v: string) => page.evaluate(([i, v]) => { const inp = document.querySelectorAll(".board-cells input")[+i] as HTMLInputElement; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(inp, v); inp.dispatchEvent(new Event("input", { bubbles: true })); }, [String(i), v]);
        await setV(0, "9"); await setV(1, "9");
        await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();
        await expect(page.locator(".margin-note")).toHaveClass(/teacher-red/, { timeout: 20000 });
        await page.waitForTimeout(500);
        const done = await watch(page, ".margin-note .margin-note-ink[class*='leave-active']");
        await setV(1, "");
        const r = await done();
        console.log(`CRIT|still|${browserName}|${arm}|r${rep}|load ${load()}|${JSON.stringify(r)}`);
      });
if (MODE === "inherits")
  test("inherits read", async ({ page, browserName }) => {
    await open(page, HOLD);
    const r = await page.evaluate(() => Object.fromEntries(["whisper", "leave", "note", "dusk", "step", "throw", "rise"].map((k) => {
      const n = `--motion-${k}`; const prev = document.documentElement.style.getPropertyValue(n);
      document.documentElement.style.setProperty(n, "777ms");
      const v = getComputedStyle(document.body).getPropertyValue(n).trim();
      document.documentElement.style.setProperty(n, prev);
      return [k, v];
    })));
    console.log(`CRIT|inherits|${browserName}|${JSON.stringify(r)}`);
  });
if (MODE === "pi")
  for (const [i, [arm, port]] of ([["tree", PORT], ["control", "4250"], ["tree", PORT], ["control", "4250"]] as const).entries())
    test(`pi ${arm} ${i}`, async ({ page, browserName }) => {
      await page.goto(`http://127.0.0.1:${port}/?board=${HOLD}`);
      await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 60000 });
      await page.waitForTimeout(1500);
      const r = await page.evaluate(() => { const m = document.querySelector(".board-margin") as HTMLElement | null; const b = m?.getBoundingClientRect();
        return { id: [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop(), marginH: b ? +b.height.toFixed(2) : null, marginTop: b ? +b.top.toFixed(2) : null, docH: document.documentElement.scrollHeight, note: (document.querySelector(".margin-note")?.textContent ?? "").trim().slice(0, 30) }; });
      console.log(`CRIT|pi|${browserName}|${arm}|${JSON.stringify(r)}`);
    });
const TWO = ".margin-note-previous.note-previous-leave-active";
const LAYER = `@layer critadv { ${TWO} { animation-duration: 900ms !important; animation-delay: 300ms !important; } }`;
const DROP_AXIS = `(() => { const set = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function (p, v, pr) { if (p === 'animation-duration' || p === 'animation-delay') return; return set.call(this, p, v, pr); }; })();`;
if (MODE === "line2")
  for (const [arm, init, css] of [["layer", "", LAYER], ["layer+pass6-hook", DROP_AXIS, LAYER], ["ghost-name", "", `${TWO}{animation-name:critghost !important}`]] as const)
    for (let rep = 1; rep <= 2; rep++)
      test(`line2 ${arm} r${rep}`, async ({ page, browserName }) => {
        if (init) await page.addInitScript(init);
        await open(page, HOLD);
        await page.addStyleTag({ content: css });
        await ask(page); await answer(page); await page.waitForTimeout(700);
        await ask(page); await answer(page); await page.waitForTimeout(700);
        const first = await lineTwo(page);
        const done = await watch(page, ".board-margin .margin-note-previous[class*='leave-active']");
        await ask(page);
        const r = await done();
        await expect.poll(() => lineTwo(page)).not.toBe(first);
        console.log(`CRIT|line2|${browserName}|${arm}|r${rep}|load ${load()}|${JSON.stringify(r)}`);
      });
