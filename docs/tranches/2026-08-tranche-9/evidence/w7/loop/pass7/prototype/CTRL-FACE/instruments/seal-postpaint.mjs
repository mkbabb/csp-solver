// seal-postpaint.mjs — CTRL-FACE pass 7, charter row 8: VR test 10's quantity (PANEL_H, `.controls-card
// .control-panel-wrap` height at 1280×800 hasTouch + isMobile) read POST-PAINT (a task queued from a rAF
// after two quiet frames; LAWS P6 §D), DPR 1 and 2, on any served arm. Reports, never stamps.
//   node seal-postpaint.mjs <engine> <baseUrl> <label> [query]
import { createRequire } from "node:module";
import os from "node:os";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [eng, base, label, q = ""] = process.argv.slice(2);
const b = await pw[eng].launch();
for (const dpr of [1, 2]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true, deviceScaleFactor: dpr });
  const p = await ctx.newPage();
  await p.goto(`${base}/${q ? "?" + q : ""}`);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await p.waitForSelector(".ctrl-btn", { timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => new Promise((res) => {
    let quiet = 0;
    const tick = () => requestAnimationFrame(() => {
      const ch = new MessageChannel();
      ch.port1.onmessage = () => {
        const busy = document.getAnimations().some((a) => a.playState === "running" && a.effect?.getComputedTiming?.().iterations !== Infinity);
        quiet = busy ? 0 : quiet + 1;
        if (quiet < 2) return tick();
        const panel = document.querySelector(".controls-card .control-panel-wrap");
        res({ panelH: panel ? +panel.getBoundingClientRect().height.toFixed(2) : null, coarse: matchMedia("(pointer: coarse)").matches, row: matchMedia("(min-width: 1024px)").matches, dpr: devicePixelRatio, js: [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s))?.split("/").pop() ?? "dev" });
      };
      ch.port2.postMessage(0);
    });
    tick();
  }));
  console.log(JSON.stringify({ engine: eng, label, q: q ? "payload" : "default", ...r, isMobile: true, load: os.loadavg().map((v) => +v.toFixed(1)) }));
  await ctx.close();
}
await b.close();
