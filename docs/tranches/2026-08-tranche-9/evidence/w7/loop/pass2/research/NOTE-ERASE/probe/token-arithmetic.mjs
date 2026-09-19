const lin = c => { c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4); };
const L = ([r,g,b]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const cr = (a,b) => { const l1=L(a), l2=L(b); const [hi,lo]=l1>l2?[l1,l2]:[l2,l1]; return (hi+0.05)/(lo+0.05); };
const hsl2rgb=(h,s,l)=>{s/=100;l/=100;const c=(1-Math.abs(2*l-1))*s,hp=h/60,x=c*(1-Math.abs(hp%2-1));let r,g,b;
 if(hp<1)[r,g,b]=[c,x,0];else if(hp<2)[r,g,b]=[x,c,0];else if(hp<3)[r,g,b]=[0,c,x];else if(hp<4)[r,g,b]=[0,x,c];else if(hp<5)[r,g,b]=[x,0,c];else[r,g,b]=[c,0,x];
 const m=l-c/2;return [r,g,b].map(v=>Math.round((v+m)*255));};
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix=(ink,paper,p)=>ink.map((c,i)=>Math.round(c*p/100+paper[i]*(100-p)/100));

const bgL = hsl2rgb(48,15,98), bgD = hsl2rgb(24,8,6);
const cardL = hex('#ffffff');
const graphL = hsl2rgb(0,0,15), graphD = hsl2rgb(48,10,80);
const goldL = hex('#8c691d'), goldD = hex('#e5c74d');
const redL = hex('#d02a52'), redD = hex('#ff5c7c');
console.log('bg light', bgL, 'bg dark', bgD);
console.log('graphite full  light', cr(graphL,bgL).toFixed(3), ' dark', cr(graphD,bgD).toFixed(3));
console.log('quiet68 on bg  light', cr(mix(graphL,bgL,68),bgL).toFixed(3), ' dark', cr(mix(graphD,bgD,68),bgD).toFixed(3), mix(graphL,bgL,68), mix(graphD,bgD,68));
console.log('gold full on bg light', cr(goldL,bgL).toFixed(3), ' dark', cr(goldD,bgD).toFixed(3));
console.log('red  full on bg light', cr(redL,bgL).toFixed(3), ' dark', cr(redD,bgD).toFixed(3));
console.log('gold68 on bg   light', cr(mix(goldL,bgL,68),bgL).toFixed(3), ' dark', cr(mix(goldD,bgD,68),bgD).toFixed(3));
console.log('red68  on bg   light', cr(mix(redL,bgL,68),bgL).toFixed(3), ' dark', cr(mix(redD,bgD,68),bgD).toFixed(3));
// what ground gives 11.48 for goldD?
for (const g of [[25,25,25],[26,26,26],[24,24,24],[38,38,38],[0,0,0],[17,15,14]]) console.log('goldD vs', g, cr(goldD,g).toFixed(3));
