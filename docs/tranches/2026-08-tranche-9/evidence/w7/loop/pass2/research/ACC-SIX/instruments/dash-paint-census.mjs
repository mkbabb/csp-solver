import sharp from "sharp";
import { readFileSync } from "node:fs";
const DIR="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/ACC-SIX/readings";
const isViolet=(r,g,b)=> b>110 && b-g>35 && b>=r-10 && r-g>5;
for (const eng of ["chromium","webkit"]) {
  const j=JSON.parse(readFileSync(`${DIR}/live-dash-${eng}.json`,"utf8"));
  const img=sharp(`${DIR}/live-dash-${eng}.png`); const {data,info}=await img.raw().toBuffer({resolveWithObject:true});
  const dsf=info.width/(j.board.w+28);
  // the frame rect in viewBox units: x 12..988, y 0..1000; scale = board.w/1000
  const s=j.board.w/1000, pad=14;
  const P=[]; const N=240;
  const at=(u,v)=>[(pad+u*s)*dsf,(pad+v*s)*dsf];
  for(let i=0;i<N;i++) P.push(at(12+(976*i)/N, 0));            // top, L->R
  for(let i=0;i<N;i++) P.push(at(988, (1000*i)/N));            // right, T->B
  for(let i=0;i<N;i++) P.push(at(988-(976*i)/N, 1000));        // bottom, R->L
  for(let i=0;i<N;i++) P.push(at(12, 1000-(1000*i)/N));        // left, B->T
  const hit=P.map(([x,y])=>{ for(let dx=-4;dx<=4;dx++) for(let dy=-4;dy<=4;dy++){
      const px=Math.round(x)+dx,py=Math.round(y)+dy; if(px<0||py<0||px>=info.width||py>=info.height) continue;
      const o=(py*info.width+px)*info.channels; if(isViolet(data[o],data[o+1],data[o+2])) return 1;} return 0;});
  let runs=0; for(let i=0;i<hit.length;i++) if(hit[i]&&!hit[(i-1+hit.length)%hit.length]) runs++;
  const pct=hit.reduce((a,b)=>a+b,0)/hit.length*100;
  const edges=["top","right","bottom","left"].map((e,k)=>`${e} ${(hit.slice(k*N,(k+1)*N).reduce((a,b)=>a+b,0)/N*100).toFixed(0)}%`).join("  ");
  console.log(`${eng.padEnd(9)} ${info.width}x${info.height} dsf~${dsf.toFixed(1)}  painted ${pct.toFixed(1)}%  runs ${runs}   [${edges}]`);
}
