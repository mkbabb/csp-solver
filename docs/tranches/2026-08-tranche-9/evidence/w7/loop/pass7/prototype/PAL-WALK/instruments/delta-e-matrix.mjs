import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
registerHooks({ resolve(s, c, n) { try { return n(s, c); } catch (e) { if (/^\.\.?\//.test(s)) return n(s + ".ts", c); throw e; } } });
const M = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend/src/games/shared/playerIdentity.ts");
const lin=(v)=>(v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4), gam=(c)=>(c<=0.0031308?12.92*c:1.055*c**(1/2.4)-0.055);
const bytes=(L,C,h)=>{const r=h*Math.PI/180,a=C*Math.cos(r),b=C*Math.sin(r);const x=(L+0.3963377774*a+0.2158037573*b)**3,y=(L-0.1055613458*a-0.0638541728*b)**3,z=(L-0.0894841775*a-1.291485548*b)**3;return [4.0767416621*x-3.3077115913*y+0.2309699292*z,-1.2684380046*x+2.6097574011*y-0.3413193965*z,-0.0041960863*x-0.7034186147*y+1.707614701*z].map(v=>Math.round(gam(Math.min(1,Math.max(0,v)))*255));};
const lab=([R,G,B])=>{const [r,g,b]=[R,G,B].map(v=>lin(v/255));const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b),m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b),s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);return [0.2104542553*l+0.793617785*m-0.0040720468*s,1.9779984951*l-2.428592205*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.808675766*s];};
const dE=(a,b)=>{const x=lab(a),y=lab(b);return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2]);};
const near=(list)=>{let m=Infinity;for(let i=0;i<list.length;i++)for(let k=i+1;k<list.length;k++)m=Math.min(m,dE(list[i],list[k]));return m;};
const parts=(s)=>{const m=/oklch\(var\([^)]+\)\s+([\d.]+)\s+([\d.]+)deg\)/.exec(s);return [+m[1],+m[2]];};
const N = 8;
for (const [key, bands, nm] of [["--color-user-ink", M.DIGIT_BANDS, "digit"], ["--color-peer-cursor-ink", M.RING_BANDS, "ring"], ["--color-peer-name-ink", M.NAME_BANDS, "name"]])
  for (const [t, L] of [["light", bands[0]], ["dark", bands[1]]]) {
    const inks = [...Array(N).keys()].map((i) => { const [C, h] = parts(M.inkFor(i)[key]); return { C, h, b: bytes(L, C, h) }; });
    console.log(`\n${nm} · ${t} (L ${L}) — pairwise ΔE_ok on painted bytes, hands 0–${N - 1}  [C, h per hand below]`);
    console.log("      " + inks.map((_, j) => String(j).padStart(7)).join(""));
    inks.forEach((a, i) => console.log(String(i).padStart(4) + "  " + inks.map((b, j) => (j <= i ? "      ·" : dE(a.b, b.b).toFixed(4).padStart(7))).join("")));
    console.log("   C,h " + inks.map((x) => `${x.C.toFixed(3)}@${x.h.toFixed(1)}`).join(" "));
  }
