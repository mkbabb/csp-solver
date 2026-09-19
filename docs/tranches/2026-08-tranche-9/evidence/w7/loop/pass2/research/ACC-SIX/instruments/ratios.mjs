// ACC-SIX pass-2 · THE ONE RATIO LEDGER. Every number in the family's record derives here.
// WCAG 2.x relative luminance + 1.4.3/1.4.11 ratios; OKLCH for chroma/hue. Pure arithmetic —
// the painted-byte readings live in the live probe beside it and must agree to ±0.05.
const hex = (h) => { const s = h.replace('#',''); const n = s.length===3 ? s.split('').map(c=>c+c).join('') : s;
  return [0,2,4].map(i=>parseInt(n.slice(i,i+2),16)); };
const hsl = (H,S,L) => { S/=100; L/=100; const k=n=>(n+H/30)%12, a=S*Math.min(L,1-L),
  f=n=>L-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
  return [f(0),f(8),f(4)].map(v=>Math.round(v*255)); };
const lin = (c)=>{c/=255; return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);};
const Y = ([r,g,b]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const ratio = (a,b)=>{const [x,y]=[Y(a),Y(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05);};
const over = (fg,bg,alpha)=>fg.map((c,i)=>c*alpha+bg[i]*(1-alpha));
// sRGB -> OKLab -> OKLCH
const oklch = (rgb) => { const [r,g,b]=rgb.map(lin);
  const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b);
  const m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b);
  const s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
  const L=0.2104542553*l+0.7936177850*m-0.0040720468*s;
  const A=1.9779984951*l-2.4285922050*m+0.4505937099*s;
  const B=0.0259040371*l+0.7827717662*m-0.8086757660*s;
  return {L, C:Math.hypot(A,B), h:(Math.atan2(B,A)*180/Math.PI+360)%360}; };

const T = {
  lightCard: hsl(48,12,99), lightBg: hsl(48,15,98), lightFg: hsl(0,0,3.9),
  lightAccent: hsl(48,8,96.1), lightGrid: hsl(0,0,15),
  darkCard: hsl(24,6,7), darkBg: hsl(24,8,6), darkFg: hsl(48,10,92),
  darkAccent: hsl(24,5,15), darkGrid: hsl(48,10,80),
  progLight: hex('#8b5cf6'), progDark: hex('#7c3aed'),
  answerPale: hex('#c4b5fd'), answerMid: hex('#8b5cf6'), answerDeep: hex('#7c3aed'),
  redLight: hex('#d02a52'), redDark: hex('#ff5c7c'),
  blueInk: hex('#2f76bd'), crayonBlue: hex('#4a90d9'), crayonBlueDark: hex('#6aabeb'),
  focusHead: hex('#3a7bc4'), userLight: hex('#2563eb'), userDark: hex('#60a5fa'),
};
const f2 = (n) => n.toFixed(2);
const row = (name, val) => console.log(`| ${name.padEnd(56)} | ${val} |`);

console.log('\n### A. THE FILL TRACE — WCAG 1.4.11 non-text, floor 3:1, stroke-opacity 0.95');
row('light MID #8b5cf6 @0.95 over grid-line hsl(0 0% 15%)', f2(ratio(over(T.progLight,T.lightGrid,0.95), T.lightGrid)));
row('light MID #8b5cf6 @0.95 over card', f2(ratio(over(T.progLight,T.lightCard,0.95), T.lightCard)));
row('dark DEEP #7c3aed @0.95 over grid-line hsl(48 10% 80%)', f2(ratio(over(T.progDark,T.darkGrid,0.95), T.darkGrid)));
row('dark DEEP #7c3aed @0.95 over card', f2(ratio(over(T.progDark,T.darkCard,0.95), T.darkCard)));

console.log('\n### B. THE ANSWER RUNGS — OKLCH and text ratios');
for (const [n,v] of [['pale #c4b5fd',T.answerPale],['mid #8b5cf6',T.answerMid],['deep #7c3aed',T.answerDeep]]) {
  const o = oklch(v);
  row(`${n}`, `L ${o.L.toFixed(3)}  C ${o.C.toFixed(3)}  h ${o.h.toFixed(1)}`);
}
row('solver-ink-2 light = deep on light card (text)', f2(ratio(T.answerDeep,T.lightCard)));
row('solver-ink-2 dark = pale on dark card (text)', f2(ratio(T.answerPale,T.darkCard)));

console.log('\n### C. BLUE — text (1.4.3 floor 4.5) and ring (1.4.11 floor 3, @0.9)');
row('blue-ink #2f76bd on light card', f2(ratio(T.blueInk,T.lightCard)));
row('blue-ink #2f76bd on light background', f2(ratio(T.blueInk,T.lightBg)));
row('crayon-blue-dark #6aabeb on dark card', f2(ratio(T.crayonBlueDark,T.darkCard)));
row('crayon-blue-dark #6aabeb on dark background', f2(ratio(T.crayonBlueDark,T.darkBg)));
row('RING #2f76bd @0.9 over light card', f2(ratio(over(T.blueInk,T.lightCard,0.9), T.lightCard)));
row('RING #6aabeb @0.9 over dark card', f2(ratio(over(T.crayonBlueDark,T.darkCard,0.9), T.darkCard)));
row('RING HEAD #3a7bc4 @0.9 over light card', f2(ratio(over(T.focusHead,T.lightCard,0.9), T.lightCard)));
row('RING HEAD #3a7bc4 @0.9 over dark card', f2(ratio(over(T.focusHead,T.darkCard,0.9), T.darkCard)));
row('HEAD user-ink #2563eb on light card (text)', f2(ratio(T.userLight,T.lightCard)));
row('HEAD user-ink #60a5fa on dark card (text)', f2(ratio(T.userDark,T.darkCard)));

console.log('\n### D. THE DANGER VERB — text 4.5, on every ground it actually wears');
const grounds = (fg, card, accent, label) => {
  row(`${label} on bare card`, f2(ratio(fg,card)));
  row(`${label} on HOVER ground --color-accent`, f2(ratio(fg,accent)));
  for (const p of [0.05,0.08]) {
    const fgTint = over(label.includes('light')?T.lightFg:T.darkFg, card, p);
    row(`${label} on ${Math.round(p*100)}% neutral (foreground over card)`, f2(ratio(fg,fgTint)));
  }
};
grounds(T.redLight, T.lightCard, T.lightAccent, 'red-ink #d02a52 (light)');
grounds(T.redDark, T.darkCard, T.darkAccent, 'red-ink #ff5c7c (dark)');
const rl = oklch(T.redLight), rd = oklch(T.redDark);
row('red-ink light chroma / hue', `C ${rl.C.toFixed(4)}  h ${rl.h.toFixed(1)}`);
row('red-ink dark chroma / hue', `C ${rd.C.toFixed(4)}  h ${rd.h.toFixed(1)}`);
row('HEAD verb colour = --color-foreground on card, light', f2(ratio(T.lightFg,T.lightCard)));
row('HEAD verb on the HOVER ground (accent), light', f2(ratio(T.lightFg,T.lightAccent)));

console.log('\n### E. ANCHOR HUES (OKLCH h) for the kinship instrument');
for (const [n,v] of [['crayon-rose #e8315b','#e8315b'],['crayon-orange #f4a236','#f4a236'],
  ['crayon-gold #c99a2e','#c99a2e'],['crayon-green #2dc653','#2dc653'],
  ['crayon-blue #4a90d9','#4a90d9'],['blue-ink #2f76bd','#2f76bd'],
  ['the sixth #7c3aed','#7c3aed'],['mid #8b5cf6','#8b5cf6'],['pale #c4b5fd','#c4b5fd'],
  ['user-ink HEAD #2563eb','#2563eb'],['focus-sketch #3a7bc4','#3a7bc4']]) {
  const o = oklch(hex(v)); row(n, `h ${o.h.toFixed(1)}  L ${o.L.toFixed(3)}  C ${o.C.toFixed(3)}`);
}
