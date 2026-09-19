const h2r=(h,s,l)=>{s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l);
const f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return [f(0),f(8),f(4)];};
const lin=c=>c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);
const L=([r,g,b])=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const cr=(a,b)=>{const l1=L(a),l2=L(b);return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);};
// composite src over dst at alpha
const over=(s,d,a)=>s.map((v,i)=>v*a+d[i]*(1-a));
const T={
 lightBg:h2r(48,15,98), lightCard:h2r(48,12,99), lightFg:h2r(0,0,3.9), lightGraphite:h2r(0,0,15),
 darkBg:h2r(24,8,6), darkCard:h2r(24,6,7), darkFg:h2r(48,10,92), darkGraphite:h2r(48,10,80),
};
const hexrgb=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255];
const blue=hexrgb('#2563eb'), blueD=hexrgb('#60a5fa'), crayon=hexrgb('#4a90d9'), crayonD=hexrgb('#6aabeb');
const p=(n,v)=>console.log(n.padEnd(62), v.toFixed(3));
console.log('--- LIGHT (over --color-card) ---');
p('clue  (foreground) on card', cr(T.lightFg,T.lightCard));
p('your digit GRAPHITE on card', cr(T.lightGraphite,T.lightCard));
p('your digit HEAD blue #2563eb on card', cr(blue,T.lightCard));
const washL6=over(T.lightGraphite,T.lightCard,0.06), washL12=over(T.lightGraphite,T.lightCard,0.12);
p('washed cell ground (graphite 6% over card) vs card', cr(washL6,T.lightCard));
p('your digit GRAPHITE on washed cell (6%)', cr(T.lightGraphite,washL6));
p('your digit GRAPHITE on washed cell (12%, contrast:more)', cr(T.lightGraphite,washL12));
p('clue on washed cell (6%)', cr(T.lightFg,washL6));
// HEAD comparison: crayon-blue 7% wash under a blue digit
const headWashL=over(crayon,T.lightCard,0.07);
p('[HEAD] blue digit on crayon-blue 7% wash', cr(blue,headWashL));
// selection body: ghost fill-opacity 0.08 graphite over the 6% wash
const bodyL=over(T.lightGraphite,washL6,0.08);
p('selection body = graphite 8% over 6% wash, vs card', cr(bodyL,T.lightCard));
p('your digit on selection body OVER wash (both grounds)', cr(T.lightGraphite,bodyL));
p('ring/tally graphite over card (non-text >=3)', cr(T.lightGraphite,T.lightCard));
console.log('--- DARK ---');
p('clue (foreground) on card', cr(T.darkFg,T.darkCard));
p('your digit GRAPHITE on card', cr(T.darkGraphite,T.darkCard));
p('your digit HEAD blue #60a5fa on card', cr(blueD,T.darkCard));
const washD6=over(T.darkGraphite,T.darkCard,0.06), washD12=over(T.darkGraphite,T.darkCard,0.12);
p('your digit GRAPHITE on washed cell (6%)', cr(T.darkGraphite,washD6));
p('your digit GRAPHITE on washed cell (12%)', cr(T.darkGraphite,washD12));
const bodyD=over(T.darkGraphite,washD6,0.08);
p('your digit on selection body OVER wash', cr(T.darkGraphite,bodyD));
p('ring/tally graphite over card', cr(T.darkGraphite,T.darkCard));
console.log('--- the authorship seam (clue vs your digit) ---');
p('LIGHT value ratio clue:yours', cr(T.lightFg,T.lightGraphite));
p('DARK  value ratio clue:yours', cr(T.darkFg,T.darkGraphite));
