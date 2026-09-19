/** The entered digit's ratio with NO wash under it — how much headroom the selection spends. */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
const srgb=(c)=>{const v=c/255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
const lum=([r,g,b])=>0.2126*srgb(r)+0.7152*srgb(g)+0.0722*srgb(b);
const ratio=(a,b)=>{const[h,l]=[lum(a),lum(b)].sort((x,y)=>y-x);return Math.round(((h+0.05)/(l+0.05))*100)/100;};
const lstar=(p)=>{const y=lum(p);const f=y>216/24389?Math.cbrt(y):((24389/27)*y)/116+16/116;return 116*f-16;};
const med=(a)=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
const medPx=(px)=>[med(px.map(p=>p[0])),med(px.map(p=>p[1])),med(px.map(p=>p[2]))];
async function dec(buf){const{data,info}=await sharp(buf).removeAlpha().raw().toBuffer({resolveWithObject:true});return{data,w:info.width,h:info.height,ch:info.channels};}
const at=(im,x,y)=>{const i=(y*im.w+x)*im.ch;return[im.data[i],im.data[i+1],im.data[i+2]];};
function core(im,r,inset=0.16){const x0=Math.round(r.x+r.width*inset),x1=Math.round(r.x+r.width*(1-inset)),y0=Math.round(r.y+r.height*inset),y1=Math.round(r.y+r.height*(1-inset));const W=x1-x0,H=y1-y0;const L=new Float64Array(W*H),px=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p=at(im,x+x0,y+y0);px.push(p);L[y*W+x]=lstar(p);} const s=[...L].sort((a,b)=>a-b);const lo=s[Math.floor(s.length*0.02)],hi=s[Math.floor(s.length*0.98)];if(hi-lo<8)return null;const mid=(lo+hi)/2;const ink=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L[y*W+x]<mid;const c=[],g=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(L[y*W+x]<mid){if(ink(x-1,y)&&ink(x+1,y)&&ink(x,y-1)&&ink(x,y+1))c.push(px[y*W+x]);}else g.push(px[y*W+x]);}
if(c.length<12||!g.length)return null;return {ratio:ratio(medPx(c),medPx(g)),n:c.length};}
for(const[en,eng]of[["chromium",chromium],["webkit",webkit]]){const b=await eng.launch();
for(const theme of["light","dark"]){const ctx=await b.newContext({viewport:{width:1280,height:800},colorScheme:theme,reducedMotion:"reduce",deviceScaleFactor:1});const p=await ctx.newPage();
await p.goto("http://127.0.0.1:4241/?size=3&difficulty=EASY");await p.waitForSelector("path.cell-line",{state:"attached",timeout:30000});await p.waitForTimeout(1500);
const i=await p.evaluate(()=>{const ins=[...document.querySelectorAll(".game-cell input")];const k=ins.findIndex((n,j)=>!n.value&&j>20&&j<60);ins[k].focus();return k;});
await p.keyboard.press("5");await p.waitForTimeout(600);
const rect=await p.evaluate((k)=>{const r=document.querySelectorAll(".game-cell")[k].getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};},i);
const withWash=core(await dec(await p.screenshot({type:"png"})),rect);
// blur off the cell: no selection, no wash at all
await p.evaluate(()=>document.querySelector(".drawer-tab,.icon-btn,button")?.focus());await p.waitForTimeout(500);
const bare=core(await dec(await p.screenshot({type:"png"})),rect);
console.log(`${en}-${theme}  entry digit: washed(a0.08)=${withWash?.ratio}  bare(no selection)=${bare?.ratio}  headroom spent=${withWash&&bare?Math.round((bare.ratio-withWash.ratio)*100)/100:"?"}`);
await ctx.close();}await b.close();}
