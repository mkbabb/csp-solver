#!/usr/bin/env node
/** PAL-TIN — THE TIN AT ITS HONEST SIZE. Five sticks (and six, priced beside it), the full
 *  ledger: hexes, L/C/h, AA on four grounds, the drawn pressures, Δh to all reserved inks. */
import fs from "node:fs";
const ROOT="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const MIN_SEP=13.5, TARGET_C=0.166, BAND={light:0.545,dark:0.780};
const lin=(c)=>(c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4), unlin=(c)=>(c<=0.0031308?12.92*c:1.055*c**(1/2.4)-0.055);
const srgbToOklab=([r,g,b])=>{const R=lin(r),G=lin(g),B=lin(b);const l=Math.cbrt(0.4122214708*R+0.5363325363*G+0.0514459929*B),m=Math.cbrt(0.2119034982*R+0.6806995451*G+0.1073969566*B),s=Math.cbrt(0.0883024619*R+0.2817188376*G+0.6299787005*B);return[0.2104542553*l+0.793617785*m-0.0040720468*s,1.9779984951*l-2.428592205*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.808675766*s];};
const oklabToSrgb=([L,A,B])=>{const l=(L+0.3963377774*A+0.2158037573*B)**3,m=(L-0.1055613458*A-0.0638541728*B)**3,s=(L-0.0894841775*A-1.291485548*B)**3;return[unlin(4.0767416621*l-3.3077115913*m+0.2309699292*s),unlin(-1.2684380046*l+2.6097574011*m-0.3413193965*s),unlin(-0.0041960863*l-0.7034186147*m+1.707614701*s)];};
const oklch=(L,C,h)=>oklabToSrgb([L,C*Math.cos(h*Math.PI/180),C*Math.sin(h*Math.PI/180)]);
const inG=(p)=>p.every(v=>v>=-5e-4&&v<=1.0005), to8=(p)=>p.map(v=>Math.round(Math.min(1,Math.max(0,v))*255));
const hex8=(p)=>"#"+p.map(v=>v.toString(16).padStart(2,"0")).join("");
const relLum=([r,g,b])=>0.2126*lin(r/255)+0.7152*lin(g/255)+0.0722*lin(b/255);
const contrast=(a,b)=>{const[x,y]=[relLum(a),relLum(b)].sort((p,q)=>q-p);return(x+0.05)/(y+0.05);};
const hexToRgb=(h)=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
const lchOf=(hx)=>{const[L,A,B]=srgbToOklab(hexToRgb(hx).map(v=>v/255));let h=Math.atan2(B,A)*180/Math.PI;if(h<0)h+=360;return{L,C:Math.hypot(A,B),h};};
const hslToRgb=(h,s,l)=>{s/=100;l/=100;const c=(1-Math.abs(2*l-1))*s,hp=h/60,x=c*(1-Math.abs(hp%2-1));const t=hp<1?[c,x,0]:hp<2?[x,c,0]:hp<3?[0,c,x]:hp<4?[0,x,c]:hp<5?[x,0,c]:[c,0,x];const m=l-c/2;return t.map(v=>Math.round((v+m)*255));};
const gap=(a,b)=>{const d=Math.abs(a-b)%360;return d>180?360-d:d;};
const dE=(a,b)=>{const A=srgbToOklab(a.map(v=>v/255)),B=srgbToOklab(b.map(v=>v/255));return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2]);};
const maxC=(L,h)=>{let lo=0,hi=0.4;for(let i=0;i<36;i++){const m=(lo+hi)/2;if(inG(oklch(L,m,h)))lo=m;else hi=m;}return lo;};
const over=(f,b,a)=>f.map((v,k)=>Math.round(v*a+b[k]*(1-a)));
const css=fs.readFileSync(`${ROOT}/src/assets/index.css`,"utf8");
const WANT=/--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved=[];for(const h of css.matchAll(WANT))reserved.push({name:h[1],hex:h[2],...lchOf(h[2])});
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
const NAME={ // plain words the lobby can say; every one writable in Patrick Hand (no j, no x)
  42:"orange",110:"olive",178:"teal",229:"blue",281:"violet",334:"pink",
  26:"rust",52:"amber",135:"green",192:"aqua",208:"sky",306:"purple",
};
const near=(h)=>Object.keys(NAME).map(Number).sort((a,b)=>gap(h,a)-gap(h,b))[0];
const out={};
for(const n of [5,6]){
  const hs=placeN(n);
  const sticks=hs.map((h,i)=>{
    const row={i:i+1,h,name:NAME[near(h)]};
    for(const theme of["light","dark"]){
      const L=BAND[theme],C=Math.min(TARGET_C,maxC(L,h)),rgb=to8(oklch(L,C,h));
      row[theme]={L,C:+C.toFixed(3),hex:hex8(rgb),rgb,
        bg:+contrast(rgb,PAPER[theme].bg).toFixed(2),card:+contrast(rgb,PAPER[theme].card).toFixed(2),
        ring:+Math.min(...["bg","card"].map(t=>contrast(over(rgb,PAPER[theme][t],0.55),PAPER[theme][t]))).toFixed(2),
        t95:+Math.min(...["bg","card"].map(t=>contrast(over(rgb,PAPER[theme][t],0.95),PAPER[theme][t]))).toFixed(2),
        t65:+Math.min(...["bg","card"].map(t=>contrast(over(rgb,PAPER[theme][t],0.65),PAPER[theme][t]))).toFixed(2),
        t45:+Math.min(...["bg","card"].map(t=>contrast(over(rgb,PAPER[theme][t],0.45),PAPER[theme][t]))).toFixed(2)};
    }
    row.nearest=reserved.map(r=>({name:r.name,hex:r.hex,d:+gap(h,r.h).toFixed(1)})).sort((a,b)=>a.d-b.d)[0];
    return row;
  });
  out[n]=sticks;
  console.log(`\n═══ THE TIN OF ${n} — hues ${hs.map(h=>h.toFixed(1)).join(", ")} (min gap ${Math.min(...hs.flatMap((a,i)=>hs.slice(i+1).map(b=>gap(a,b)))).toFixed(1)}deg)`);
  console.log("  # | name    | hue   | LIGHT hex  L     C     bg    card  @0.55 @0.95 | DARK hex   L     C     bg    card  @0.55 @0.95 | Δh nearest reserved");
  for(const s of sticks)
    console.log(`  ${s.i} | ${s.name.padEnd(7)} | ${String(s.h.toFixed(1)).padStart(5)} | ${s.light.hex} ${s.light.L.toFixed(3)} ${s.light.C.toFixed(3)} ${String(s.light.bg).padStart(5)} ${String(s.light.card).padStart(5)} ${String(s.light.ring).padStart(5)} ${String(s.light.t95).padStart(5)} | ${s.dark.hex} ${s.dark.L.toFixed(3)} ${s.dark.C.toFixed(3)} ${String(s.dark.bg).padStart(5)} ${String(s.dark.card).padStart(5)} ${String(s.dark.ring).padStart(5)} ${String(s.dark.t95).padStart(5)} | ${s.nearest.name} ${s.nearest.hex} ${s.nearest.d}deg`);
  for(const theme of["light","dark"]){
    const set=sticks.map(s=>s[theme]);
    const E=set.flatMap((x,i)=>set.slice(i+1).map(y=>dE(x.rgb,y.rgb)));
    console.log(`  ${theme}: worst AA ${Math.min(...set.map(s=>Math.min(s.bg,s.card))).toFixed(2)}:1 · min ΔE ${Math.min(...E).toFixed(3)} · worst ring@0.55 ${Math.min(...set.map(s=>s.ring)).toFixed(2)}:1 · worst trace@0.95 ${Math.min(...set.map(s=>s.t95)).toFixed(2)}:1 · mean C ${(set.reduce((a,s)=>a+s.C,0)/set.length).toFixed(3)}`);
  }
  console.log(`  family law: worst Δh ${Math.min(...sticks.map(s=>s.nearest.d)).toFixed(1)}deg (floor ${MIN_SEP}) → ${Math.min(...sticks.map(s=>s.nearest.d))>=MIN_SEP?"GREEN":"RED"}`);
}
fs.writeFileSync(new URL("../out/tin-five.json",import.meta.url),JSON.stringify(out,null,2));
const five=out[5];
fs.writeFileSync(new URL("../proto/tin-tokens.css",import.meta.url),
`/* PAL-TIN pass 1 — THE TIN, at the size the numbers cut it. Five sticks; the sixth axis is
   the drawn tick, not a colour. Derived by probe/tin-five.mjs off index.css's own reserved set. */
:root {
${five.map(s=>`  --color-peer-${s.i}: ${s.light.hex}; /* ${s.name} · hue ${s.h.toFixed(1)} · ${s.light.bg}:1 bg, ${s.light.card}:1 card */`).join("\n")}
}
.dark {
${five.map(s=>`  --color-peer-${s.i}: ${s.dark.hex}; /* ${s.name} · ${s.dark.bg}:1 bg, ${s.dark.card}:1 card */`).join("\n")}
}
`);
console.log("\nbanked → out/tin-five.json, proto/tin-tokens.css");
