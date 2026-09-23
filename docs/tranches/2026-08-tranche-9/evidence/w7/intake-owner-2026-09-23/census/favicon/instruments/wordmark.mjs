import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const en=process.argv[2]; const eng=en==='webkit'?webkit:chromium;
const b=await eng.launch(); const meta=[];
for (const dpr of [1,2]) for (const scheme of ['light','dark']) {
  const ctx=await b.newContext({deviceScaleFactor:dpr,colorScheme:scheme,viewport:{width:1280,height:800}});
  const p=await ctx.newPage();
  await p.goto('http://127.0.0.1:4252/',{waitUntil:'load'});
  await p.waitForSelector('svg.handwritten-logo.is-drawn',{timeout:30000});
  try { await p.waitForSelector('svg.handwritten-logo image.logo-pose-bmp',{state:'attached',timeout:15000}); } catch(e){}
  await p.waitForTimeout(2500);
  const info=await p.evaluate(()=>{
    const s=document.querySelector('svg.handwritten-logo'); const r=s.getBoundingClientRect();
    const vb=s.viewBox.baseVal; const baked=!!s.querySelector('image.logo-pose-bmp');
    const t=s.querySelector('text.logo-measure'); let sExt=null;
    try{ const e=t.getExtentOfChar(0); sExt={x:e.x,y:e.y,w:e.width,h:e.height}; }catch(e){}
    const cs=getComputedStyle(s); const g=document.querySelector('.glyph-svg');
    let digit=null; if(g){ const gr=g.getBoundingClientRect(); const pth=g.querySelector('path'); const bb=pth.getBBox(); digit={w:gr.width,h:gr.height,sw:+pth.getAttribute('stroke-width'),bbh:bb.height,bbw:bb.width,color:getComputedStyle(pth).stroke}; }
    return {rect:{x:r.x,y:r.y,w:r.width,h:r.height},vb:{w:vb.width,h:vb.height},baked,sExt,color:cs.color,label:t.textContent.trim(),bg:getComputedStyle(document.body).backgroundColor,digit};
  });
  const tag=`${en}_dpr${dpr}_${scheme}`;
  const clip={x:info.rect.x,y:info.rect.y,width:info.rect.w,height:info.rect.h};
  await p.screenshot({path:`${process.env.S}/shots/wm_${tag}_a.png`,clip});
  await p.waitForTimeout(300);
  await p.screenshot({path:`${process.env.S}/shots/wm_${tag}_b.png`,clip});
  await p.addStyleTag({content:'svg.handwritten-logo{visibility:hidden !important}'});
  await p.waitForTimeout(200);
  await p.screenshot({path:`${process.env.S}/shots/wm_${tag}_ground.png`,clip});
  meta.push({tag,dpr,scheme,...info}); await ctx.close();
}
await b.close();
fs.writeFileSync(`${process.env.S}/wm_${en}.json`,JSON.stringify(meta,null,1)); console.log('ok',en,meta.length);
