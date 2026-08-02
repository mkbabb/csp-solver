import fs from 'node:fs';
const dir='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/logs/measure';
const SC=['idle3s','deal','solveCelebration','galleryGlide','themeToggle'];
const med=a=>{const s=[...a].sort((x,y)=>x-y);const n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;};
const read=(arm)=>{const o={};for(const s of SC)o[s]=[];
  for(let r=1;r<=5;r++){const p=`${dir}/m4-bat-${arm}-r${r}.jsonl`;
    for(const l of fs.readFileSync(p,'utf8').trim().split('\n')){const j=JSON.parse(l);
      if(j.kind==='env')continue; if(SC.includes(j.scenario))o[j.scenario].push({fps:j.fps,r,long33:j.long33,long50:j.long50});}}
  return o;};
const B=read('base'),H=read('head');
console.log('n per scenario per arm:', SC.map(s=>`${s}=${H[s].length}/${B[s].length}`).join(' '));
console.log('');
console.log('scenario           head r1..r5 (fps)                       med     base r1..r5                            med     Δ(head-base)  sign');
let signs=[];
for(const s of SC){
  const h=H[s].map(x=>x.fps), b=B[s].map(x=>x.fps);
  const mh=med(h), mb=med(b), d=+(mh-mb).toFixed(2);
  signs.push(d);
  console.log(`${s.padEnd(18)} ${h.map(v=>v.toFixed(2)).join('/').padEnd(38)} ${mh.toFixed(2).padStart(6)}  ${b.map(v=>v.toFixed(2)).join('/').padEnd(38)} ${mb.toFixed(2).padStart(6)}  ${String(d).padStart(6)}      ${d<0?'NEG':d>0?'POS':'ZERO'}`);
}
console.log('');
console.log('UNIFORM SIGN?', signs.every(d=>d<0)?'YES — all five NEGATIVE':'NO');
console.log('magnitude range: '+Math.min(...signs).toFixed(2)+' .. '+Math.max(...signs).toFixed(2)+' fps');
console.log('worst |Δ| = '+Math.max(...signs.map(Math.abs)).toFixed(2)+' fps   vs ±2.5 law → '+(Math.max(...signs.map(Math.abs))<=2.5?'INSIDE':'OUTSIDE'));
// per-round paired sign test on idle + all
console.log('');
console.log('PAIRED per-round Δ (head r_i − base r_i):');
for(const s of SC){
  const d=H[s].map((x,i)=>+(x.fps-B[s][i].fps).toFixed(2));
  const neg=d.filter(v=>v<0).length;
  console.log(`  ${s.padEnd(18)} ${d.map(v=>String(v).padStart(6)).join(' ')}   neg ${neg}/5`);
}
// idle head spread + long frames
const ih=H['idle3s'].map(x=>x.fps);
console.log('');
console.log('idle3s head spread = '+(Math.max(...ih)-Math.min(...ih)).toFixed(2)+' fps   (min '+Math.min(...ih).toFixed(2)+' max '+Math.max(...ih).toFixed(2)+')');
console.log('idle3s long33 head='+H['idle3s'].map(x=>x.long33).join(',')+'  base='+B['idle3s'].map(x=>x.long33).join(','));
console.log('idle3s long50 head='+H['idle3s'].map(x=>x.long50).join(',')+'  base='+B['idle3s'].map(x=>x.long50).join(','));
console.log('gate: idle3s ≥59 → head median '+med(ih).toFixed(2)+' → '+(med(ih)>=59?'PASS by '+(med(ih)-59).toFixed(2):'FAIL'));
