// recorder self-test (M21-i): a CSS-only spinner under the same CDP screencast, painted frames/s
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const browser = await pw.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.setContent(`<style>body{margin:0;background:#fff}.s{position:absolute;left:600px;top:360px;width:80px;height:80px;border:8px solid #333;border-top-color:transparent;border-radius:50%;animation:r .6s linear infinite}@keyframes r{to{transform:rotate(360deg)}}</style><div class="s"></div>`);
await page.waitForTimeout(500);
const cdp = await ctx.newCDPSession(page); const ts = [];
cdp.on("Page.screencastFrame", async (f) => { ts.push(f.metadata.timestamp * 1000); try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {} });
await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1, maxWidth: 1280, maxHeight: 800 });
await page.waitForTimeout(2200);
await cdp.send("Page.stopScreencast");
const w = ts.filter((t) => t >= ts[0] + 200 && t <= ts[0] + 1200);
const g = w.slice(1).map((t, i) => t - w[i]).sort((a, b) => a - b);
console.log(JSON.stringify({ paintedPerSec: w.length, gapMs: { min: +g[0].toFixed(1), median: +g[g.length >> 1].toFixed(1), max: +g[g.length - 1].toFixed(1) } }));
await browser.close();
