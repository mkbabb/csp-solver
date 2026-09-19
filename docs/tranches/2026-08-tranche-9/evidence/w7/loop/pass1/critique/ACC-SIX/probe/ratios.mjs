const L = ([r,g,b]) => { const f=(c)=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)};
  return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
const R = (a,b) => { const l1=L(a), l2=L(b); const [hi,lo]=l1>l2?[l1,l2]:[l2,l1]; return (hi+0.05)/(lo+0.05); };
const hex = h => [1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const over = (fg,bg,a) => fg.map((c,i)=>a*c+(1-a)*bg[i]);
const f=(x)=>x.toFixed(2);
const cardL=[253,253,252], bgL=[251,250,249], gridL=[38,38,38], fgL=[10,10,10];
const cardD=[19,18,17],   bgD=[17,15,14],   gridD=[209,207,199], fgD=[237,236,233];

const blueL=hex("#2f76bd"), blueD=hex("#6aabeb"), sketch=hex("#3a7bc4");
const userHeadL=hex("#2563eb"), userHeadD=hex("#60a5fa");
const redL=hex("#d02a52"), redD=hex("#ff5c7c");
const violetMid=hex("#8b5cf6"), violetDeep=hex("#7c3aed"), violetPale=hex("#c4b5fd");

console.log("DIGIT proto light  #2f76bd on card", f(R(blueL,cardL)), " on bg", f(R(blueL,bgL)));
console.log("DIGIT proto dark   #6aabeb on card", f(R(blueD,cardD)), " on bg", f(R(blueD,bgD)));
console.log("DIGIT HEAD  light  #2563eb on card", f(R(userHeadL,cardL)), " dark #60a5fa on card", f(R(userHeadD,cardD)));
console.log("RING  proto light  #2f76bd@0.9 over card", f(R(over(blueL,cardL,0.9),cardL)));
console.log("RING  proto dark   #6aabeb@0.9 over card", f(R(over(blueD,cardD,0.9),cardD)));
console.log("RING  HEAD  light  #3a7bc4@0.9 over card", f(R(over(sketch,cardL,0.9),cardL)));
console.log("RING  HEAD  dark   #3a7bc4@0.9 over darkcard", f(R(over(sketch,cardD,0.9),cardD)));
console.log("VERB  light  #d02a52 on card", f(R(redL,cardL)), " on 5% fg ground", f(R(redL,over(fgL,cardL,0.05))), " on 8%", f(R(redL,over(fgL,cardL,0.08))));
console.log("VERB  dark   #ff5c7c on card", f(R(redD,cardD)), " on 5% ground", f(R(redD,over(fgD,cardD,0.05))));
console.log("TRACE light mid@0.95 over grid-line", f(R(over(violetMid,gridL,0.95),gridL)), " over card", f(R(over(violetMid,cardL,0.95),cardL)));
console.log("TRACE dark deep@0.95 over grid-line", f(R(over(violetDeep,gridD,0.95),gridD)), " over card", f(R(over(violetDeep,cardD,0.95),cardD)));
console.log("TRACE light mid opaque vs gridline", f(R(violetMid,gridL)), "vs card", f(R(violetMid,cardL)));
console.log("TRACE dark deep opaque vs gridline", f(R(violetDeep,gridD)), "vs card", f(R(violetDeep,cardD)));
console.log("WASH 7% crayon-blue light over card", f(R(over(hex('#4a90d9'),cardL,0.07),cardL)));
