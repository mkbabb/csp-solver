#!/usr/bin/env node
// RUN: cd <worktree>/web/frontend && node <C02>/fix-r3/warm-standdown.mjs --port 4253
//
// T9-W8 C02 repair round 3 — A DIAGNOSTIC OF MINE, not a banked instrument and not a mark.
// It answers one question the drawer trace can only answer indirectly: while the drawer is
// being worked, does a warm pose encode? It drives A4's own cadence (250 / 1,100 / 250 /
// 1,100 / 150 at 6× CPU, mobile 390×844) and counts `toBlob` calls inside the interaction
// against the ones after it. The quiet floor says the answer is zero inside and the whole
// round after; the round-2 build said otherwise, which is what the verifier measured.
import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/package.json")("playwright");

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf(`--${k}`);
  return i >= 0 ? argv[i + 1] : d;
};
const PORT = arg("port", "4253");
const CYCLES = Number(arg("cycles", "3"));

const INIT = `(() => {
  const S = (window.__SD = { bakes: [], marks: [] });
  const toBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, ...rest) {
    const t0 = performance.now(), w = this.width, h = this.height;
    return toBlob.call(this, function (b) {
      S.bakes.push({ t0: +t0.toFixed(1), t1: +performance.now().toFixed(1), w, h });
      return cb.apply(this, arguments);
    }, ...rest);
  };
  S.mark = (m) => S.marks.push({ m, t: +performance.now().toFixed(1) });
})();`;

const sleep = (p, ms) => p.waitForTimeout(ms);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
const page = await ctx.newPage();
await page.addInitScript(INIT);
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 6 });
await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
await page.goto(`http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`, {
  waitUntil: "load",
  timeout: 90000,
});
await page.waitForFunction(
  "!![...document.querySelectorAll('.board-group')].find((e) => e.getClientRects().length)",
  null,
  { timeout: 90000 },
);
await page.waitForSelector(".drawer-tab", { state: "visible", timeout: 30000 });

for (let c = 0; c < CYCLES; c++) {
  await sleep(page, 250);
  await page.evaluate(`window.__SD.mark('c${c}-open')`);
  await page.click(".drawer-tab");
  await sleep(page, 1100);
  await sleep(page, 250);
  await page.evaluate(`window.__SD.mark('c${c}-close')`);
  await page.click(".drawer-tab");
  await sleep(page, 1100);
  await page.evaluate(`window.__SD.mark('c${c}-post')`);
  await sleep(page, 150);
}
await page.evaluate(`window.__SD.mark('interaction-end')`);
await sleep(page, 6000); // let the quiet floor open and the whole round land

const out = await page.evaluate(() => ({
  bakes: window.__SD.bakes,
  marks: window.__SD.marks,
}));
await browser.close();

const first = out.marks.find((m) => m.m === "c0-open").t;
const end = out.marks.find((m) => m.m === "interaction-end").t;
const inside = out.bakes.filter((b) => b.t0 >= first && b.t0 <= end);
const after = out.bakes.filter((b) => b.t0 > end);
const before = out.bakes.filter((b) => b.t0 < first);
console.log(`port :${PORT} · chromium 6× · mobile 390×844 dpr1 · cold`);
console.log(`marks: ${out.marks.map((m) => `${m.m}@${m.t}`).join(" ")}`);
console.log(`bakes BEFORE the first open (the boot round): ${before.length}`);
console.log(
  `bakes INSIDE the interaction [${first.toFixed(0)}, ${end.toFixed(0)}]: ${inside.length}` +
    (inside.length ? ` -> ${inside.map((b) => `${b.t0}(${b.w}x${b.h})`).join(" ")}` : ""),
);
console.log(
  `bakes AFTER it: ${after.length}` +
    (after.length ? ` -> first at ${after[0].t0}, last at ${after[after.length - 1].t1}` : ""),
);
