// The ring at HEAD's OWN palette vs the walk's, at the alpha the chair rules we ship (0.55).
// π for the ring row: does §11c's band make the peer ring's 1.4.11 reading better or worse?
import { readFileSync } from "node:fs";
const ROOT="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const css=readFileSync(ROOT+"/src/assets/index.css","utf8");
const s2l=v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4, l2s=v=>v<=0.0031308?12.92*v:1.055*v**(1/2.4)-0.055;
const cl=v=>Math.min(1,Math.max(0,v));
function o2r(L,C,h){const a=C*Math.cos(h*Math.PI/180),b=C*Math.sin(h*Math.PI/180);
 const l=(L+0.3963377774*a+0.2158037573*b)**3,m=(L-0.1055613458*a-0.0638541728*b)**3,s=(L-0.0894841775*a-1.2914855480*b)**3;
 return [4.0767416621*l-3.3077115913*m+0.2309699292*s,-1.2684380046*l+2.6097574011*m-0.3413193965*s,-0.0041960863*l-0.7034186147*m+1.7076147010*s];}
const ing=(L,C,h)=>o2r(L,C,h).every(v=>v>=-1e-4&&v<=1.0001);
const px=(L,C,h)=>o2r(L,C,h).map(v=>Math.round(cl(l2s(v))*255)/255);
const lum=([r,g,b])=>0.2126*s2l(r)+0.7152*s2l(g)+0.0722*s2l(b);
const con=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);};
const ov=(f,b,a)=>f.map((v,i)=>v*a+b[i]*(1-a));
function hsl(str){const n=str.match(/-?[\d.]+/g).map(Number);let[h,S,L]=[((n[0]%360)+360)%360,n[1]/100,n[2]/100];
 const c=(1-Math.abs(2*L-1))*S,x=c*(1-Math.abs(((h/60)%2)-1)),m=L-c/2;
 return [[c,x,0],[x,c,0],[0,c,x],[0,x,c],[x,0,c],[c,0,x]][Math.floor(h/60)%6].map(v=>v+m);}
const darkAt=css.indexOf("\n.dark");
function blk(from){const o=css.indexOf("{",from);let d=0;for(let i=o;i<css.length;i++){if(css[i]==="{")d++;else if(css[i]==="}"&&--d===0)return css.slice(o+1,i);}return"";}
const CARD={light:hsl(css.slice(0,darkAt).match(/--color-card:\s*(hsl\([^)]*\))/)[1]),
            dark:hsl(blk(darkAt).match(/--color-card:\s*(hsl\([^)]*\))/)[1])};
const RES=[[0,27.1616],[51.1659,108.7459],[133.985,178.6121],[236.3332,275.8809],[279.7172,306.5712],[333.0184,360]];
const OPEN=[];{let c=0;for(const[a,b]of RES){if(a>c)OPEN.push([c,a]);c=Math.max(c,b);}if(c<360)OPEN.push([c,360]);}
const SPAN=OPEN.reduce((s,[a,b])=>s+(b-a),0),STEP=SPAN*((3-Math.sqrt(5))/2);
const ia=(h,a,b)=>Math.min(Math.max(Math.round(h*100)/100,Math.ceil(a*100)/100),Math.floor(b*100)/100);
const hueAt=i=>{let p=(((i*STEP)%SPAN)+SPAN)%SPAN;for(const[a,b]of OPEN){if(p<b-a)return ia(a+p,a,b);p-=b-a;}const[a,b]=OPEN.at(-1);return ia(b,a,b);};
const CAP=0.215;
const cAt=h=>{const ok=c=>ing(0.44,c,h)&&ing(0.65,c,h);if(ok(CAP))return CAP;let lo=0,hi=CAP;for(let k=0;k<20;k++){const m=(lo+hi)/2;ok(m)?lo=m:hi=m;}return lo;};
const PALETTES={
  HEAD:  { L:{light:0.5,dark:0.8}, hand:i=>({h:+(((i*137.5)%360).toFixed(1)), c:0.11}) },
  WALK:  { L:{light:0.44,dark:0.65}, hand:i=>{const h=hueAt(i);return {h,c:cAt(h)};} },
};
const out={};
for (const [name,P] of Object.entries(PALETTES)) {
  out[name]={};
  for (const arm of ["light","dark"]) for (const alpha of [0.55,0.64,0.7,0.8]) {
    const card=CARD[arm]; let wF=Infinity,wG=Infinity,u3=0,wi=-1;
    for (let i=0;i<144;i++){
      const {h,c}=P.hand(i); const ink=px(P.L[arm],c,h);
      const fill=ov(ink,card,0.04);
      const rF=con(ov(ink,fill,alpha),fill), rG=con(ov(ink,card,alpha),card);
      if(rF<wF){wF=rF;wi=i;} wG=Math.min(wG,rG); if(Math.min(rF,rG)<3)u3++;
    }
    (out[name][arm]??={})[alpha]={worstVsOwnFill:+wF.toFixed(3),atIndex:wi,worstVsCard:+wG.toFixed(3),under3:u3};
  }
}
console.log(JSON.stringify(out,null,1));
