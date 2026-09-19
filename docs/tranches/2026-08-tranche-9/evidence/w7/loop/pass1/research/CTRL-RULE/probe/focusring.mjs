// T9-W7 pass1 · CTRL-RULE — the focus ring, painted, on a control with clear air above it.
const { chromium, webkit } = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs");
import { writeFileSync } from "node:fs";
const BASE = "http://127.0.0.1:4231/";
const lum=(r,g,b)=>{const f=c=>((c/=255)<=0.03928?c/12.92:((c+0.055)/1.055)**2.4);return .2126*f(r)+.7152*f(g)+.0722*f(b);};
const ratio=(a,b)=>{const[l1,l2]=[lum(...a),lum(...b)].sort((x,y)=>y-x);return +((l1+.05)/(l2+.05)).toFixed(3);};
const out={};
for (const engine of ["chromium","webkit"]) for (const theme of ["light","dark"]) {
  const br = await (engine==="webkit"?webkit:chromium).launch();
  const ctx = await br.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1,colorScheme:theme});
  await ctx.addInitScript(d=>{try{localStorage.clear();localStorage.setItem("sudoku-color-scheme",d?"dark":"light")}catch{}}, theme==="dark");
  const page = await ctx.newPage();
  await page.goto(BASE+"?size=3&difficulty=EASY",{waitUntil:"domcontentloaded"});
  await page.waitForSelector("svg.handwritten-logo",{timeout:30000});
  await page.addStyleTag({content:".tuner-toggle{display:none!important}"});
  await page.waitForTimeout(1400);
  // the ring under test, on the LAST bar verb (clear air below the bar's rule, no sticky head)
  await page.addStyleTag({content:".rp-ring{outline:2px solid color-mix(in srgb, var(--color-foreground) 45%, transparent);outline-offset:4px}"});
  const target = await page.evaluate(()=>{
    const b=[...document.querySelectorAll(".action-bar .action-verbs > button")].pop();
    b.classList.add("rp-ring");
    const r=b.getBoundingClientRect();
    return [r.x,r.y,r.width,r.height];
  });
  await page.waitForTimeout(250);
  const shot = await page.screenshot({type:"png"});
  const r = await page.evaluate(async ([b64,t])=>{
    const img=new Image(); img.src="data:image/png;base64,"+b64; await img.decode();
    const c=document.createElement("canvas"); c.width=img.width; c.height=img.height;
    const g=c.getContext("2d",{willReadFrequently:true}); g.drawImage(img,0,0);
    const px=(x,y)=>{const d=g.getImageData(Math.round(x),Math.round(y),1,1).data;return[d[0],d[1],d[2]];};
    const band=[]; for(let dy=2;dy<=9;dy++) band.push(px(t[0]+t[2]/2, t[1]-dy));
    return {band, ground: px(t[0]+t[2]/2, t[1]-14),
      cardBg:getComputedStyle(document.querySelector(".controls-card")).backgroundColor,
      bodyBg:getComputedStyle(document.body).backgroundColor};
  },[shot.toString("base64"),target]);
  const gl=lum(...r.ground);
  const best=r.band.reduce((a,b)=>Math.abs(lum(...b)-gl)>Math.abs(lum(...a)-gl)?b:a,r.band[0]);
  out[`${engine}-${theme}`]={ring:best,ground:r.ground,ratio:ratio(best,r.ground),cardBg:r.cardBg,bodyBg:r.bodyBg,band:r.band};
  console.log(`focus ${engine} ${theme}: ${ratio(best,r.ground)}:1 ring ${JSON.stringify(best)} on ${JSON.stringify(r.ground)} (card ${r.cardBg})`);
  await br.close();
}
writeFileSync(new URL("../focusring.json",import.meta.url), JSON.stringify(out,null,1));
