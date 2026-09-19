import sharp from "sharp";
const F = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/ACC-GRAPHITE/frames/";
async function load(p){const {data,info}=await sharp(F+p).ensureAlpha().raw().toBuffer({resolveWithObject:true});return {data,w:info.width,h:info.height,ch:info.channels};}
function lum(d,i){return 0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2];}
// ring frame: row profile of dark pixels through the middle
for (const f of ["ring-light-chromium.png","ring-dark-chromium.png"]) {
  const {data,w,h,ch}=await load(f);
  const dark = f.includes("dark");
  const isInk = (i)=> dark ? lum(data,i) > 140 : lum(data,i) < 110;
  // horizontal scan at mid-height
  const y = Math.floor(h/2);
  const runs=[]; let cur=null;
  for(let x=0;x<w;x++){const i=(y*w+x)*ch; if(isInk(i)){ if(!cur) cur={a:x,b:x}; else cur.b=x;} else if(cur){runs.push(cur);cur=null;}}
  if(cur)runs.push(cur);
  // vertical scan at mid-width
  const x0=Math.floor(w/2); const vruns=[]; cur=null;
  for(let y2=0;y2<h;y2++){const i=(y2*w+x0)*ch; if(isInk(i)){ if(!cur) cur={a:y2,b:y2}; else cur.b=y2;} else if(cur){vruns.push(cur);cur=null;}}
  if(cur)vruns.push(cur);
  console.log(f, `${w}x${h}`);
  console.log("  H runs @y="+y, runs.map(r=>`${r.a}-${r.b}(${r.b-r.a+1})`).join(" "));
  console.log("  V runs @x="+x0, vruns.map(r=>`${r.a}-${r.b}(${r.b-r.a+1})`).join(" "));
}
// tally: count ink runs along the crop
for (const f of ["tally-k3-light.png","tally-full-light.png"]) {
  const {data,w,h,ch}=await load(f);
  console.log(f, `${w}x${h}`);
  // column-wise: a column is "ink" if any pixel in the top 60% is dark
  const cols=[];
  for(let x=0;x<w;x++){let ink=false;for(let y=0;y<Math.floor(h*0.6);y++){const i=(y*w+x)*ch; if(lum(data,i)<110){ink=true;break;}}cols.push(ink);}
  const runs=[];let cur=null;
  cols.forEach((v,x)=>{if(v){if(!cur)cur={a:x,b:x};else cur.b=x;}else if(cur){runs.push(cur);cur=null;}});
  if(cur)runs.push(cur);
  console.log("  top-band column runs:", runs.length, runs.map(r=>`${r.a}-${r.b}`).join(" "));
}
