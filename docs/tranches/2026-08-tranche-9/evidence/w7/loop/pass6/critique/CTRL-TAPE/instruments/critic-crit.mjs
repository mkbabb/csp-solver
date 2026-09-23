// CTRL-TAPE pass-6 critic probe. node crit.mjs <mode> <base> [engines]
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";
const [mode, BASE, ens = "chromium,webkit"] = process.argv.slice(2);
const PAYLOAD = "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
const ENG = { chromium, webkit };
const raf2 = (p) => p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
async function boot(browser, vp, extra = {}) {
  const ctx = await browser.newContext({ baseURL: BASE, viewport: vp, deviceScaleFactor: extra.dpr ?? 2, hasTouch: !!extra.touch, isMobile: !!extra.mobile, colorScheme: extra.theme ?? "light", reducedMotion: "reduce" });
  const page = await ctx.newPage();
  if (extra.inset) { const s = await ctx.newCDPSession(page); await s.send("Emulation.setSafeAreaInsetsOverride", { insets: { bottom: extra.inset } }); }
  await page.goto("/?board=" + PAYLOAD);
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 60000 });
  await page.waitForSelector(".sudoku-cell input", { timeout: 60000 });
  await page.waitForTimeout(900);
  const meta = await page.evaluate(() => ({
    index: [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop(),
    givens: [...document.querySelectorAll(".sudoku-cell input")].map((e, i) => [i, e.getAttribute("aria-label") || "", e.value]).filter(([, l]) => /given/i.test(l)).map(([i, , v]) => `${i}:${v}`).join(","),
  }));
  return { ctx, page, meta };
}
async function openDock(page) {
  await page.locator(".drawer-tab").first().click();
  let last = null;
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(80); const t = await page.evaluate(() => document.querySelector("#controls-drawer")?.getBoundingClientRect().top ?? null); if (t !== null && last !== null && Math.abs(t - last) < 0.05) return t; last = t; }
  return last;
}
async function raw(page, clip) { const buf = await page.screenshot({ clip, animations: "allow", caret: "hide" }); return sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); }
function changed(a, b) { let n = 0; for (let i = 0; i < a.data.length; i += 4) if (Math.max(Math.abs(a.data[i] - b.data[i]), Math.abs(a.data[i + 1] - b.data[i + 1]), Math.abs(a.data[i + 2] - b.data[i + 2])) > 24) n++; return n; }

for (const en of ens.split(",")) {
  const browser = await ENG[en].launch();
  try {
    if (mode === "notes") {
      const { page, meta } = await boot(browser, { width: 1280, height: 800 }, { touch: true, mobile: en !== "webkit" ? true : false, dpr: 1 });
      const regime = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, row: matchMedia("(min-width: 1024px)").matches, berth: matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches }));
      await page.keyboard.press("Tab");
      const labels = await page.evaluate(() => [...document.querySelectorAll("#card-foot .action-bar button[aria-label], .action-bar button[aria-label]")].map((b) => b.getAttribute("aria-label")));
      const rows = [];
      for (const n of [...new Set(labels)]) {
        const fv = await page.evaluate((n) => { const e = document.querySelector(`.action-bar button[aria-label="${n}"]`); e.focus(); return e.matches(":focus-visible"); }, n);
        await page.waitForTimeout(400);
        rows.push(await page.evaluate(({ n, fv }) => {
          const cs = document.querySelector(".drawer-case").getBoundingClientRect();
          const notes = [...document.querySelectorAll("#card-foot .washi-label, .action-bar .washi-label, .berth-note")].filter((x) => +getComputedStyle(x).opacity > 0.05);
          return { n: n.slice(0, 16), fv, visibleNotes: notes.length, maxSpillPastCase: notes.length ? +Math.max(...notes.map((x) => x.getBoundingClientRect().bottom - cs.bottom)).toFixed(2) : null };
        }, { n, fv }));
      }
      const mounted = await page.evaluate(() => document.querySelectorAll("#card-foot .washi-label, .action-bar .washi-label").length);
      console.log(JSON.stringify({ mode, en, base: BASE, ...meta, regime, mountedNotesInBar: mounted, rows }));
    }
    if (mode === "inset") {
      for (const inset of [0, 34]) {
        const { page, meta, ctx } = await boot(browser, { width: 390, height: 844 }, { touch: true, inset, dpr: 2 });
        await openDock(page);
        const box = await page.evaluate(() => { const f = document.getElementById("card-foot"); const bar = document.querySelector(".action-bar").getBoundingClientRect(); return { pad: f ? getComputedStyle(f).paddingBottom : null, barBottom: +bar.bottom.toFixed(2), vh: innerHeight }; });
        const clip = { x: 0, y: Math.floor(box.barBottom - 4), width: 390, height: 844 - Math.floor(box.barBottom - 4) };
        const on = await raw(page, clip);
        const t = await page.addStyleTag({ content: ".bar-frame svg, .action-bar .outline-svg { visibility: hidden !important }" }); await raf2(page); await page.waitForTimeout(100);
        const off = await raw(page, clip); await t.evaluate((n) => n.remove());
        const w = on.info.width, h = on.info.height; let low = -1;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = (y * w + x) * 4; if (Math.max(...[0, 1, 2].map((k) => Math.abs(on.data[o + k] - off.data[o + k]))) > 24) { low = y; break; } }
        const lowest = low < 0 ? null : +(clip.y + (low + 1) / 2).toFixed(2);
        console.log(JSON.stringify({ mode, en, base: BASE, ...meta, inset, ...box, lowestInkBottom: lowest, insetLine: 844 - inset, aboveInsetLine: lowest === null ? null : +((844 - inset) - lowest).toFixed(2) }));
        await ctx.close();
      }
    }
    if (mode === "lapse") {
      const { page, meta } = await boot(browser, { width: 390, height: 844 }, { touch: true, mobile: en !== "webkit", dpr: 1 });
      const blank = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].findIndex((e) => !/given/i.test(e.getAttribute("aria-label") || "")));
      const input = page.locator(".sudoku-cell input").nth(blank);
      await input.tap(); await page.keyboard.type("5");
      const typed = await input.inputValue();
      await openDock(page);
      const deal = page.locator(".mobile-control-panel").getByRole("button", { name: "Deal a new board" });
      await deal.focus(); await page.keyboard.press("Enter");
      await page.waitForTimeout(250);
      const ae = () => page.evaluate(() => { const a = document.activeElement; return a ? `${a.tagName}|${a.getAttribute("aria-label") ?? ""}|${(a.textContent || "").trim().slice(0, 20)}` : null; });
      const afterArm = await ae();
      const ribbon1 = await page.locator(".confirm-ribbon").count();
      // move on by keyboard: Tab until focus leaves the ribbon but stays in the panel/wrap
      const trail = [];
      for (let i = 0; i < 4; i++) { await page.keyboard.press("Tab"); await page.waitForTimeout(60); const a = await ae(); trail.push(a); const inRibbon = await page.evaluate(() => !!document.activeElement?.closest(".confirm-ribbon")); if (!inRibbon) break; }
      const movedTo = await ae();
      const standing = await page.locator(".confirm-ribbon").count();
      const inWrap = await page.evaluate(() => !!document.activeElement?.closest(".control-panel-wrap, .mobile-control-panel, #card-foot"));
      await page.waitForTimeout(3200); // > confirmWindowMs 2500
      const afterLapse = await ae();
      const ribbon2 = await page.locator(".confirm-ribbon").count();
      console.log(JSON.stringify({ mode, en, base: BASE, ...meta, typed, afterArm, ribbonAfterArm: ribbon1, trail, movedTo, questionStandingAfterMove: standing, focusStillInPanel: inWrap, afterLapse, ribbonAfterLapse: ribbon2, stolen: afterLapse !== movedTo }));
    }
    if (mode === "k1paint") {
      for (const [name, css] of [["none", ""], ["K1 .action-bar{overflow:hidden}", ".action-bar{overflow:hidden !important}"], ["K2 .action-bar{contain:paint}", ".action-bar{contain:paint !important}"], ["K9 .card-foot{overflow:clip}", ".card-foot{overflow:clip !important}"], ["K4 .action-bar .outline-svg{display:none}", ".action-bar .outline-svg{display:none !important}"]]) {
        const { page, meta, ctx } = await boot(browser, { width: 390, height: 844 }, { touch: true, dpr: 2 });
        await openDock(page);
        if (css) { await page.addStyleTag({ content: css }); await raf2(page); await page.waitForTimeout(100); }
        const r = await page.evaluate(() => { const b = document.querySelector(".action-bar").getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
        const clip = { x: Math.max(0, Math.floor(r.x - 10)), y: Math.floor(r.y - 10), width: Math.min(390, Math.ceil(r.w + 20)), height: Math.ceil(r.h + 20) };
        const on = await raw(page, clip);
        const t = await page.addStyleTag({ content: ".bar-frame { visibility: hidden !important } .bar-frame * { visibility: hidden !important }" }); await raf2(page); await page.waitForTimeout(100);
        const off = await raw(page, clip); await t.evaluate((n) => n.remove());
        const bands = { top: 0, bottom: 0, left: 0, right: 0 };
        const w = on.info.width, h = on.info.height;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = (y * w + x) * 4; if (Math.max(...[0, 1, 2].map((k) => Math.abs(on.data[o + k] - off.data[o + k]))) <= 24) continue; if (y < 36) bands.top++; else if (y >= h - 36) bands.bottom++; else if (x < 36) bands.left++; else if (x >= w - 36) bands.right++; }
        console.log(JSON.stringify({ mode, en, ...meta, plant: name, frameInkPx: changed(on, off), bands }));
        await ctx.close();
      }
    }
    if (mode === "filters") {
      for (const theme of ["light", "dark"]) {
        const { page, meta, ctx } = await boot(browser, { width: 1440, height: 900 }, { theme, dpr: 1 });
        const f = await page.evaluate(() => ({ cssFilter: [...document.querySelectorAll("*")].filter((e) => getComputedStyle(e).filter !== "none").length, svgFilter: document.querySelectorAll("filter").length }));
        console.log(JSON.stringify({ mode, en, theme, ...meta, ...f }));
        await ctx.close();
      }
    }
  } catch (e) { console.log(JSON.stringify({ mode, en, error: String(e).slice(0, 300) })); }
  await browser.close();
}
