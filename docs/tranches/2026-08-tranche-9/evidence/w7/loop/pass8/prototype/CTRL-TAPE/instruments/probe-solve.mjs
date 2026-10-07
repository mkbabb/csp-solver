import { chromium } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const base = process.argv[2];
const b = await chromium.launch(); const p = await (await b.newContext({ baseURL: base, viewport: { width: 1280, height: 800 } })).newPage();
await p.goto("/"); await p.waitForSelector(".board-cells", { timeout: 30000 }); await p.waitForTimeout(1500);
const st = async (tag) => console.log(tag, JSON.stringify(await p.evaluate(() => ({ ribbon: document.querySelector(".confirm-ribbon")?.textContent?.trim()?.slice(0, 60) ?? null, foot: document.querySelector("#card-foot")?.textContent?.replace(/\s+/g," ").trim().slice(0,120), undo: document.querySelector("[aria-label=Undo], [aria-label^=Undo]")?.disabled, board: document.querySelector(".board-wrapper")?.className.match(/solve-\w+/)?.[0] ?? "idle", solves: document.querySelectorAll('.drawer-case button[aria-label="Solve puzzle"]').length }))));
await st("load");
await p.locator('.controls-card button[aria-label="Deal a new board"]').click(); await p.waitForTimeout(2500); await st("after deal");
await p.locator('.drawer-case button[aria-label="Solve puzzle"]').click(); await p.waitForTimeout(250); await st("250ms after solve"); await p.waitForTimeout(2500); await st("after solve");
await b.close();
