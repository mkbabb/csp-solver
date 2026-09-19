import sharp from "sharp";
const F="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/ACC-GRAPHITE/frames/";
for(const f of ["tally-k3-light.png","tally-full-light.png"]){
 const {data,info}=await sharp(F+f).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const {width:w,height:h,channels:ch}=info;
 const lum=(i)=>0.2126*data[i]+0.7152*data[i+1]+0.0722*data[i+2];
 console.log("==",f,w+"x"+h);
 for(let y=0;y<h;y++){
   let n=0,runs=0,prev=false;
   for(let x=0;x<w;x++){const ink=lum((y*w+x)*ch)<128; if(ink)n++; if(ink&&!prev)runs++; prev=ink;}
   if(n>0) console.log(`  y=${y} inkpx=${n} runs=${runs}`);
 }
}
