const FE = process.env.FE ?? process.cwd();
const pw = await import(`${FE}/node_modules/playwright/index.mjs`);
const b = await pw.chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(process.argv[2] + "?size=3&difficulty=EASY"); await p.locator("#card-foot .action-bar").waitFor({ timeout: 30000 });
console.log(JSON.stringify(await p.evaluate(() => { const w = document.createTreeWalker(document.querySelector("#card-foot .action-bar"), NodeFilter.SHOW_TEXT); const o = []; let x; while ((x = w.nextNode())) { if (!x.textContent.trim()) continue; const e = x.parentElement; o.push([x.textContent.trim().slice(0, 10), e.tagName, e.className.slice(0, 60), getComputedStyle(e).fontSize]); } return o; })));
await b.close();
