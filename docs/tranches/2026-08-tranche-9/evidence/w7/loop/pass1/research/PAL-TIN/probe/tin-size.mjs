#!/usr/bin/env node
/** PAL-TIN — THE HONEST TIN SIZE. One band, pinned; sweep n; report the perceptual floor.
 *  The question the owner's "16+ within reason" actually asks: how many pencils can a person
 *  TELL APART on this paper, under this estate's family law? */
import fs from "node:fs";
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const MIN_SEP = 12, BANDL = 0.545, BANDD = 0.780, TARGET_C = 0.166;
const lin=(c)=>(c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4), unlin=(c)=>(c<=0.0031308?12.92*c:1.055*c**(1/2.4)-0.055);
const srgbToOklab=([r,g,b])=>{const R=lin(r),G=lin(g),B=lin(b);const l=Math.cbrt(0.4122214708*R+0.5363325363*G+0.0514459929*B),m=Math.cbrt(0.2119034982*R+0.6806995451*G+0.1073969566*B),s=Math.cbrt(0.0883024619*R+0.2817188376*G+0.6299787005*B);return[0.2104542553*l+0.793617785*m-0.0040720468*s,1.9779984951*l-2.428592205*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.808675766*s];};
const oklabToSrgb=([L,A,B])=>{const l=(L+0.3963377774*A+0.2158037573*B)**3,m=(L-0.1055613458*A-0.0638541728*B)**3,s=(L-0.0894841775*A-1.291485548*B)**3;return[unlin(4.0767416621*l-3.3077115913*m+0.2309699292*s),unlin(-1.2684380046*l+2.6097574011*m-0.3413193965*s),unlin(-0.0041960863*l-0.7034186147*m+1.707614701*s)];};
const oklch=(L,C,h)=>oklabToSrgb([L,C*Math.cos(h*Math.PI/180),C*Math.sin(h*Math.PI/180)]);
const inG=([r,g,b])=>[r,g,b].every(v=>v>=-5e-4&&v<=1.0005), to8=([r,g,b])=>[r,g,b].map(v=>Math.round(Math.min(1,Math.max(0,v))*255));
const hex8=(p)=>"#"+p.map(v=>v.toString(16).padStart(2,"0")).join("");
const relLum=([r,g,b])=>0.2126*lin(r/255)+0.7152*lin(g/255)+0.0722*lin(b/255);
const contrast=(a,b)=>{const[x,y]=[relLum(a),relLum(b)].sort((p,q)=>q-p);return(x+0.05)/(y+0.05);};
const hexToRgb=(h)=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
const lchOf=(hx)=>{const[L,A,B]=srgbToOklab(hexToRgb(hx).map(v=>v/255));let h=Math.atan2(B,A)*180/Math.PI;if(h<0)h+=360;return{L,C:Math.hypot(A,B),h};};
const hslToRgb=(h,s,l)=>{s/=100;l/=100;const c=(1-Math.abs(2*l-1))*s,hp=h/60,x=c*(1-Math.abs(hp%2-1));const t=hp<1?[c,x,0]:hp<2?[x,c,0]:hp<3?[0,c,x]:hp<4?[0,x,c]:hp<5?[x,0,c]:[c,0,x];const m=l-c/2;return t.map(v=>Math.round((v+m)*255));};
const gap=(a,b)=>{const d=Math.abs(a-b)%360;return d>180?360-d:d;};
const dE=(a,b)=>{const A=srgbToOklab(a.map(v=>v/255)),B=srgbToOklab(b.map(v=>v/255));return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2]);};
const maxC=(L,h)=>{let lo=0,hi=0.4;for(let i=0;i<36;i++){const m=(lo+hi)/2;if(inG(oklch(L,m,h)))lo=m;else hi=m;}return lo;};
const css=fs.readFileSync(`${ROOT}/src/assets/index.css`,"utf8");
const WANT=/--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved=[];for(const h of css.matchAll(WANT))reserved.push({name:h[1],...lchOf(h[2])});
const PAPER={light:{bg:hslToRgb(48,15,98),card:hslToRgb(48,12,99)},dark:{bg:hslToRgb(24,8,6),card:hslToRgb(24,6,7)}};
const blocked=new Array(3600).fill(false);
for(const r of reserved)for(let k=0;k<3600;k++)if(gap(k/10,r.h)<MIN_SEP)blocked[k]=true;
const free=[];for(let k=0;k<3600;k++){if(blocked[k])continue;if(free.length&&free.at(-1).end===(k-1)/10)free.at(-1).end=k/10;else free.push({start:k/10,end:k/10});}
if(free.length>1&&free[0].start===0&&free.at(-1).end===359.9){free[0].start=free.at(-1).start-360;free.pop();}
const cand=[];for(const f of free)for(let h=f.start;h<=f.end+1e-9;h+=0.25)cand.push(+(((h%360)+360)%360).toFixed(2));
function placeN(n){const w=free.reduce((a,b)=>b.end-b.start>a.end-a.start?b:a);const p=[+((((w.start+w.end)/2%360)+360)%360).toFixed(2)];
while(p.length<n){let best=null,bd=-1;for(const c of cand){const d=Math.min(...p.map(q=>gap(c,q)));if(d>bd){bd=d;best=c;}}p.push(best);}
for(let z=0;z<80;z++)for(let i=0;i<p.length;i++){const o=p.filter((_,j)=>j!==i);let b=p[i],bd=Math.min(...o.map(q=>gap(p[i],q)));for(const c of cand){if(gap(c,p[i])>12)continue;const d=Math.min(...o.map(q=>gap(c,q)));if(d>bd){bd=d;b=c;}}p[i]=b;}
return[...new Set(p)].sort((a,b)=>a-b);}
console.log("ONE PINNED BAND per theme (light L 0.545, dark L 0.780), chroma capped at the crayon mean 0.166.");
console.log("  n | min hue gap | LIGHT min ΔE  worst AA | DARK min ΔE  worst AA | verdict at a ΔE 0.10 floor");
for(let n=4;n<=16;n++){
  const hs=placeN(n);
  const out={};
  for(const[theme,L]of[["light",BANDL],["dark",BANDD]]){
    const set=hs.map(h=>{const C=Math.min(TARGET_C,maxC(L,h));return{rgb:to8(oklch(L,C,h)),h};});
    const E=set.flatMap((x,i)=>set.slice(i+1).map(y=>dE(x.rgb,y.rgb)));
    out[theme]={min:Math.min(...E),aa:Math.min(...set.map(s=>Math.min(contrast(s.rgb,PAPER[theme].bg),contrast(s.rgb,PAPER[theme].card))))};
  }
  const g=Math.min(...hs.flatMap((a,i)=>hs.slice(i+1).map(b=>gap(a,b))));
  const worst=Math.min(out.light.min,out.dark.min);
  console.log(`  ${String(n).padStart(2)}| ${g.toFixed(1).padStart(11)} | ${out.light.min.toFixed(3)}        ${out.light.aa.toFixed(2)} | ${out.dark.min.toFixed(3)}       ${out.dark.aa.toFixed(2)} | ${worst>=0.10?"TELLS APART":"TOO CLOSE — two players read as one"}`);
}
