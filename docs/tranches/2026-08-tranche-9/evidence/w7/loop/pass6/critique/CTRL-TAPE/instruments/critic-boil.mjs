import { chromium } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";
const PAYLOAD = "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
const b = await chromium.launch(); const ctx = await b.newContext({ baseURL: process.argv[2], viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 1 });
const page = await ctx.newPage(); const s = await ctx.newCDPSession(page); await s.send("Emulation.setSafeAreaInsetsOverride", { insets: { bottom: 34 } });
await page.goto("/?board=" + PAYLOAD); await page.waitForSelector(".controls-card", { state: "attached" }); await page.waitForTimeout(800);
await page.locator(".drawer-tab").first().click(); await page.waitForTimeout(1500);
const clip = { x: 0, y: 794, width: 390, height: 50 };
const g = async () => (await sharp(await page.screenshot({ clip })).ensureAlpha().raw().toBuffer({ resolveWithObject: true }));
const rows = [];
for (let k = 0; k < 8; k++) { const a = await g(); await page.waitForTimeout(150); const c = await g(); let low = -1, n = 0; for (let y = 0; y < a.info.height; y++) for (let x = 0; x < a.info.width; x++) { const o = (y * a.info.width + x) * 4; if (Math.max(...[0, 1, 2].map((q) => Math.abs(a.data[o + q] - c.data[o + q]))) > 24) { n++; low = Math.max(low, y); } } rows.push({ changedPx: n, lowestY: low < 0 ? null : 794 + low }); }
const who = await page.evaluate(() => [...document.querySelectorAll(".drawer-case > .outline-svg, .drawer-case svg.outline-svg")].length);
console.log(JSON.stringify({ base: process.argv[2], noChangePairs: rows, caseOutlines: who }));
await b.close();
