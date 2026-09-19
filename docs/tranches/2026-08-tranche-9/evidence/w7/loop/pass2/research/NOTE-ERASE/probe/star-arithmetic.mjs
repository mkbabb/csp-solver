const lin = c => { c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4); };
const L = ([r,g,b]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const cr = (a,b) => { const l1=L(a), l2=L(b); const [hi,lo]=l1>l2?[l1,l2]:[l2,l1]; return (hi+0.05)/(lo+0.05); };
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const over=(fg,bg,a)=>fg.map((c,i)=>Math.round(c*a+bg[i]*(1-a)));
const bgD=[17,15,14], bgL=[251,250,249];
const starFill=hex('#FDE68A'), starStroke=hex('#F0B030');
for (const [n,c,a] of [['star fill 0.9',starFill,0.9],['star fill 1.0',starFill,1],['star stroke',starStroke,1]]) {
  console.log(n, 'dark', over(c,bgD,a), cr(over(c,bgD,a),bgD).toFixed(3), '| light', cr(over(c,bgL,a),bgL).toFixed(3));
}
