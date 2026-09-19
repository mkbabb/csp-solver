import { chromium, webkit } from "playwright";
import fs from "node:fs";
const PROTO="http://127.0.0.1:4241/", HEAD="http://127.0.0.1:4242/", SETTLE=1100;
const OUT=process.argv[2];
const CONTRAST = () => {
  const lum=(c)=>{const [r,g,b]=c.map(v=>{v/=255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4;});return 0.2126*r+0.7152*g+0.0722*b;};
  const parse=(s)=>{if(!s)return null;const srgb=/^color\(srgb/.test(s);const m=s.match(/[\d.]+/g);if(!m)return null;
    let v=[+m[0],+m[1],+m[2]];if(srgb)v=v.map(x=>x*255);const a=m.length>3?+m[3]:1;return {rgb:v,a};};
  const over=(fg,bg)=>fg.rgb.map((v,i)=>v*fg.a+bg[i]*(1-fg.a));
  const bgOf=(el)=>{let n=el;while(n&&n!==document.documentElement){const c=parse(getComputedStyle(n).backgroundColor);if(c&&c.a>0.95)return c.rgb;n=n.parentElement;}const c=parse(getComputedStyle(document.body).backgroundColor);return c?c.rgb:[255,255,255];};
  const ratio=(a,b)=>{const l1=lum(a),l2=lum(b);return +(((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05))).toFixed(2);};
  const out=[];
  const sel=[[".tab.is-raised .tab-word","raised tab word"],[".tab:not(.is-raised) .tab-word","quiet tab word"],
    [".zone-row-label","row caption"],[".act-face","act face"],[".icon-sublabel","icon sublabel"],
    [".option-chip","chip"],[".guard-ask","guard ask"],[".tray-note","tray note"]];
  for(const [s,name] of sel){ for(const el of [...document.querySelectorAll(s)].slice(0,1)){
    const cs=getComputedStyle(el);const fg=parse(cs.color);if(!fg)continue;const bg=bgOf(el);
    out.push({name,color:cs.color,size:cs.fontSize,weight:cs.fontWeight,bg:bg.map(x=>Math.round(x)).join(","),ratio:ratio(over(fg,bg),bg)});}}
  return out;
};
const RECTS = () => [...document.querySelectorAll("*")].map(e=>{const b=e.getBoundingClientRect();
  return b.width||b.height?[e.tagName+"#"+(e.id||"")+"."+String(e.className).slice(0,20),+b.x.toFixed(2),+b.y.toFixed(2),+b.width.toFixed(2),+b.height.toFixed(2)]:null;}).filter(Boolean);
async function run(engine,name,out){
  const b=await engine.launch();
  for(const [w,h] of [[390,844],[1280,800]]){
    const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:true});const p=await ctx.newPage();
    await p.goto(PROTO,{waitUntil:"domcontentloaded",timeout:45000});await p.waitForTimeout(SETTLE);
    for(const theme of ["light","dark"]){
      await p.evaluate(t=>document.documentElement.classList.toggle("dark",t==="dark"),theme);
      await p.waitForTimeout(300);
      out.contrast.push({engine:name,cell:`${w}x${h}`,theme,rows:await p.evaluate(CONTRAST)});
    }
    await ctx.close();console.log(name,"contrast",w,h);
  }
  // pi: the GALLERY route, rect census proto vs head
  for(const [w,h] of [[1280,800]]){
    const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();
    for(const [tag,url] of [["proto",PROTO],["head",HEAD]]){
      await p.goto(url,{waitUntil:"domcontentloaded",timeout:45000});await p.waitForTimeout(SETTLE);
      // click the app title / logo to reach the gallery if a link exists
      const back=await p.$("a[href='/'], .masthead a, .wordmark, #app-home");
      if(back){try{await back.click({timeout:2000});await p.waitForTimeout(SETTLE);}catch{}}
      out.rects.push({engine:name,cell:`${w}x${h}`,tree:tag,url:p.url(),rects:await p.evaluate(RECTS)});
    }
    await ctx.close();console.log(name,"rects",w,h);
  }
  await b.close();
}
const out={contrast:[],rects:[]};
await run(chromium,"chromium",out); await run(webkit,"webkit",out);
fs.writeFileSync(OUT,JSON.stringify(out,null,1));console.log("EXIT OK");
