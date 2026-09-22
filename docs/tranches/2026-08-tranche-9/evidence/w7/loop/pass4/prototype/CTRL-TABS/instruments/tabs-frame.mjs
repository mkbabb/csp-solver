// CTRL-TABS pass 4 — one cited crop: node tabs-frame.mjs <port> <engine> <WxH> <theme> <open|shut> <x,y,w,h> <out.png>
import { chromium, webkit } from "@playwright/test";
const [port, eng, vp, theme, open, clip, out] = process.argv.slice(2);
const [w, h] = vp.split("x").map(Number); const [cx, cy, cw, ch] = clip.split(",").map(Number);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await (eng === "webkit" ? webkit : chromium).launch();
const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: eng === "chromium", colorScheme: theme });
const p = await ctx.newPage();
await p.goto(`http://127.0.0.1:${port}/?board=${BOARD}`);
await p.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 45000 });
await p.evaluate((t) => document.documentElement.classList.toggle("dark", t === "dark"), theme);
await p.waitForTimeout(1200);
const mq = await p.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, dark: document.documentElement.classList.contains("dark") }));
if (open === "open") { await p.locator(".drawer-tab").first().tap(); await p.waitForTimeout(900); }
await p.screenshot({ path: out, clip: { x: cx, y: cy, width: cw, height: ch } });
console.log(JSON.stringify({ out, eng, vp, theme, pointer: mq.coarse ? "coarse(hasTouch)" : "fine", dark: mq.dark }));
await b.close();
