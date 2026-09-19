const srgb=(h)=>{h=h.replace('#','');const n=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255);return n.map(c=>c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4));}
const L=(h)=>{const [r,g,b]=srgb(h);return 0.2126*r+0.7152*g+0.0722*b;}
const cr=(a,b)=>{const l1=L(a),l2=L(b);const [hi,lo]=l1>l2?[l1,l2]:[l2,l1];return (hi+0.05)/(lo+0.05);}
const rows=[
 ['WIN WAX #c99a2e vs light paper #fdfdfc (prefers-contrast:more, 12u, paper is only ground)','#c99a2e','#fdfdfc'],
 ['WIN WAX #c99a2e vs light line rgb(49,49,49)=#313131','#c99a2e','#313131'],
 ['GOLD-INK #8c691d vs light paper #fdfdfc (the arm as authored, pre-win)','#8c691d','#fdfdfc'],
 ['GOLD-INK #8c691d vs light line #313131','#8c691d','#313131'],
 ['PROGRESS-INK #a87e13 vs light paper #fdfdfc','#a87e13','#fdfdfc'],
 ['PROGRESS-INK #a87e13 vs light line #313131','#a87e13','#313131'],
 ['DARK win wax #e5c74d vs dark paper rgb(19,18,17)','#e5c74d','#131211'],
 ['DARK win wax #e5c74d vs dark line rgb(199,197,190)','#e5c74d','#c7c5be'],
 ['DARK progress #79650f vs dark line #c7c5be','#79650f','#c7c5be'],
 ['DARK progress #79650f vs dark paper #131211','#79650f','#131211'],
 ['user-ink light #026fc4 vs card (approx #fff)','#026fc4','#ffffff'],
];
for(const [n,a,b] of rows) console.log(cr(a,b).toFixed(3).padStart(8), n);
