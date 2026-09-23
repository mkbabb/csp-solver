import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const ORIGIN='http://127.0.0.1:4252';
const OUT='shots'; fs.mkdirSync(OUT,{recursive:true});
const strips={ 'light-active':'#ffffff','light-strip':'#dee1e6','dark-active':'#35363a','dark-strip':'#202124' };
const svgs=['favicon','fav-nofilter','fav-noglyph','ref-opsz52','ref-opsz52-nofilter'];
const sizes=[16,32,48,180];
const eng=process.argv[2]==='webkit'?webkit:chromium; const en=process.argv[2]||'chromium';
const b=await eng.launch();
const log=[];
for (const dpr of [1,2]) for (const scheme of ['light','dark']) {
  const ctx=await b.newContext({deviceScaleFactor:dpr,colorScheme:scheme,viewport:{width:220,height:220}});
  const p=await ctx.newPage();
  for (const [sk,bg] of Object.entries(strips)) {
    if (!sk.startsWith(scheme)) continue;
    for (const svg of svgs) for (const size of sizes) for (const n of [1,2]) {
      if (n===2 && svg!=='favicon' && svg!=='fav-noglyph') continue;
      await p.goto(`${ORIGIN}/strip.html?svg=${svg}.svg&size=${size}&bg=${encodeURIComponent(bg)}&n=${n}`);
      await p.waitForFunction(()=>document.getElementById('f').complete && document.getElementById('f').naturalWidth>0);
      await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      const f=`${OUT}/${en}_dpr${dpr}_${sk}_${svg}_${size}_n${n}.png`;
      await p.screenshot({path:f,clip:{x:4,y:4,width:size+8,height:size+8}});
      log.push(f);
    }
  }
  await ctx.close();
}
await b.close();
console.log(en,'shots',log.length);
