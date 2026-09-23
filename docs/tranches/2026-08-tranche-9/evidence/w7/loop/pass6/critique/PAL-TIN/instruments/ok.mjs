const hex=h=>{h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255)};
const lin=v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;
const oklab=([r,g,b])=>{[r,g,b]=[r,g,b].map(lin);const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b),m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b),s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);return [0.2104542553*l+0.793617785*m-0.0040720468*s,1.9779984951*l-2.428592205*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.808675766*s]};
const Y=([r,g,b])=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const sets={stickDark:["#?"],ringDark:["#ff9f6b","#9ecf00","#00d4dd","#a8b5ff","#ff87f0"],nameDark:["#ffc1a1","#b2e705","#00edf7","#c4ceff","#ffb4f3"]};
const de=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
for (const k of ["ringDark","nameDark"]) {const L=sets[k].map(h=>oklab(hex(h)));
 console.log(k, sets[k].map((h,i)=>`${h} L${L[i][0].toFixed(3)} C${Math.hypot(L[i][1],L[i][2]).toFixed(3)} h${((Math.atan2(L[i][2],L[i][1])*180/Math.PI+360)%360).toFixed(1)} Y${Y(hex(h)).toFixed(3)} vsGrid${((Y(hex(h))+0.05)/(0.077+0.05)).toFixed(3)}`).join(' | '));
 let mn=9,pr='';for(let i=0;i<5;i++)for(let j=i+1;j<5;j++){const d=de(L[i],L[j]);if(d<mn){mn=d;pr=`${i+1}-${j+1}`}} console.log(k,'min pairwise dE',mn.toFixed(4),pr);
 const all=[];for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)all.push(`${i+1}-${j+1}:${de(L[i],L[j]).toFixed(3)}`);console.log(all.join(' '));}
// grid line rgb(81,78,76)
console.log('gridY', Y([81/255,78/255,76/255]).toFixed(4));
