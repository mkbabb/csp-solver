import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const b=await chromium.launch(); const ctx=await b.newContext({deviceScaleFactor:1,viewport:{width:1100,height:1100}}); const p=await ctx.newPage();
for (const svg of ['fav-nofilter','fav-noglyph','ref-opsz52-nofilter','favicon']) {
  await p.goto(`http://127.0.0.1:4252/strip.html?svg=${svg}.svg&size=1024&bg=%23ffffff`);
  await p.waitForFunction(()=>document.getElementById('f').complete);
  await p.screenshot({path:`shots/hires_${svg}.png`,clip:{x:8,y:8,width:1024,height:1024}});
}
await b.close();
