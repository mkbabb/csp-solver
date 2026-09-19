const bez=(x1,y1,x2,y2)=>{const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx;const cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
const X=t=>((ax*t+bx)*t+cx)*t, Y=t=>((ay*t+by)*t+cy)*t, dX=t=>(3*ax*t+2*bx)*t+cx;
return x=>{let t=x;for(let i=0;i<24;i++){const e=X(t)-x;if(Math.abs(e)<1e-7)break;const d=dX(t);if(Math.abs(d)<1e-7)break;t-=e/d;}return Y(t)};};
const C={accelIn:[0.55,0.055,0.675,0.19],lift:[0.32,0,0.67,0],glass:[0.32,0.72,0,1],standard:[0.4,0,0.2,1],
 anticipatePop:[0.68,-0.55,0.265,1.55],drawOn:[0.33,1,0.68,1],writeIn:[0.22,1,0.36,1],ghostDraw:[0.215,0.61,0.355,1],
 easeOut:[0,0,0.58,1],easeIn:[0.42,0,1,1],ease:[0.25,0.1,0.25,1],noteWrite:[0.22,1,0.36,1]};
const f=Object.fromEntries(Object.entries(C).map(([k,v])=>[k,bez(...v)]));
const pairs=[["accelIn","lift","AnswerKeyLaminate lift-away + toggle wring-down"],["standard","glass","AttributionCard/GameCard/pip/toggle icons"],
["anticipatePop","lift","twinkle star pop-in"],["easeOut","glass","DrawerTab tongue + marks-fade-in"],["drawOn","writeIn","controls fade-in"],
["ghostDraw","writeIn","focus ghost draw-on"],["ease","glass","share-pop, eraser-scrub, .face, solve-success sweeps"],["noteWrite","writeIn","logo caret, margin note (rename only)"],["easeIn","lift","twinkle star exit"]];
for(const [a,b,where] of pairs){let max=0,at=0,auc=0;
 for(let i=0;i<=1000;i++){const x=i/1000;const d=f[b](x)-f[a](x);auc+=d/1001;if(Math.abs(d)>Math.abs(max)){max=d;at=x;}}
 console.log(`${a.padEnd(15)}->${b.padEnd(9)} maxΔprogress ${max.toFixed(4).padStart(8)} at t=${at.toFixed(2)}  ΔAUC ${auc.toFixed(4).padStart(8)}   ${where}`);}
