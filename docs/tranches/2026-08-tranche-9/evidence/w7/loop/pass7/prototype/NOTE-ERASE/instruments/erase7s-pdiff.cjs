const sharp = require("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp");
const P = process.argv[2];
const pairs = [];
for (const e of ["chromium","webkit"]) {
  for (const s of ["light","dark"]) { pairs.push([`${e}-${s}-P1rest-hold`,`${e}-${s}-P1rest-tint`],[`${e}-${s}-P1rest-hold`,`${e}-${s}-P1rest-step`],[`${e}-${s}-P1rest-hold`,`${e}-${s}-P1rest-age`]); }
  pairs.push([`${e}-light-P2rest-hold`,`${e}-light-P2rest-tint`],[`${e}-light-P2rest-step`,`${e}-light-P2rest-age`],[`${e}-light-P1fresh-hold`,`${e}-light-P1fresh-tint`],[`${e}-light-P1fresh-hold`,`${e}-light-P1fresh-step`]);
}
(async () => { for (const [a,b] of pairs) { try {
  const A = await sharp(`${P}/${a}.png`).raw().toBuffer({resolveWithObject:true}); const B = await sharp(`${P}/${b}.png`).raw().toBuffer({resolveWithObject:true});
  if (A.info.width!==B.info.width||A.info.height!==B.info.height) { console.log(`${a} vs ${b}: size ${A.info.width}x${A.info.height} vs ${B.info.width}x${B.info.height}`); continue; }
  let n=0,mx=0; const ch=A.info.channels; const y0=+(process.argv[3]||0); for (let i=y0*A.info.width*ch;i<A.data.length;i+=ch){const d=Math.max(Math.abs(A.data[i]-B.data[i]),Math.abs(A.data[i+1]-B.data[i+1]),Math.abs(A.data[i+2]-B.data[i+2])); const px=(i/ch)%A.info.width, py=Math.floor(i/ch/A.info.width); if(d>=6 && px>=30 && px<700 && py<110)n++; if(d>mx)mx=d;}
  console.log(`${a} vs ${b}: ${n} px differ (>=6/255) of ${A.data.length/ch}, max Δ ${mx}`);
 } catch(e) { console.log(`${a} vs ${b}: ${e.message}`); } } })();
