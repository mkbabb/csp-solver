import { chromium } from "playwright";
const b = await chromium.launch({headless:true});
const ctx = await b.newContext({viewport:{width:1440,height:900}, deviceScaleFactor:2});
const p = await ctx.newPage();
await p.addInitScript(`
window.__log=[];
const o=Element.prototype.animate;
Element.prototype.animate=function(k,op){
  const a=o.call(this,k,op); let c=''; try{c=String(this.className).slice(0,26)}catch{}
  const rec={cls:c, kf:JSON.stringify(k).slice(0,150), dur:op&&op.duration,
    tl0:document.timeline.currentTime, st0:a.startTime, ct0:a.currentTime, ps0:a.playState};
  window.__log.push(rec);
  queueMicrotask(()=>{ rec.micro={tl:document.timeline.currentTime, st:a.startTime, ct:a.currentTime, ps:a.playState}; });
  requestAnimationFrame(()=>{ rec.raf={tl:document.timeline.currentTime, st:a.startTime, ct:a.currentTime, ps:a.playState}; });
  a.addEventListener('finish',()=>{ rec.finishedAt=document.timeline.currentTime; });
  return a; };
`);
await p.goto("http://127.0.0.1:4246/?size=3&difficulty=EASY");
await p.waitForSelector("svg.handwritten-logo",{timeout:30000});
await p.waitForTimeout(1500);
await p.evaluate(()=>document.activeElement?.blur?.());
await p.keyboard.press("g"); await p.waitForTimeout(1600);
await p.evaluate(()=>{window.__log=[];});
await p.keyboard.press("Escape");
await p.waitForTimeout(900);
const log = await p.evaluate(()=>window.__log.filter(r=>/board-peek-host|logo-menu/.test(r.cls)));
console.log(JSON.stringify(log,null,1));
await b.close();
