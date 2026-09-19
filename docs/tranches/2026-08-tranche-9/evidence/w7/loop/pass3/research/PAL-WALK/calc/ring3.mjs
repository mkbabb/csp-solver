#!/usr/bin/env node
// PAL-WALK pass-3 research — the §6.6 RING ROW, solved on every axis the tier ladder has.
//
// The chair (§6.6) rules that both palettes ship the peer ring at HEAD's 0.55 and STATE WHICH
// of §6's candidate values their palette survives on. This prices all of them, and then asks
// the question the ladder leaves open: 1.4.11 wants 3:1; T8-W3 M1 wants the peer ring LIGHTER
// than tier 1 on every axis a tier has (stroke 4 < 5, stroke-opacity < 0.65, fill 0.04 < 0.06).
// If no opacity satisfies both, the 3:1 has to be bought on an axis M1 does not rank — and the
// one the estate already owns is LIGHTNESS (PAL-TIN's finding, grafted).
//
// Read-only; no product file touched.
import { readFileSync } from "node:fs";
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const css = readFileSync(`${ROOT}/src/assets/index.css`, "utf8");

const srgbToLin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const linToSrgb = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
function oklchToRgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774*a + 0.2158037573*b) ** 3;
  const m = (L - 0.1055613458*a - 0.0638541728*b) ** 3;
  const s = (L - 0.0894841775*a - 1.2914855480*b) ** 3;
  return [ 4.0767416621*l - 3.3077115913*m + 0.2309699292*s,
          -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,
          -0.0041960863*l - 0.7034186147*m + 1.7076147010*s ];
}
const inGamut = (L, C, h) => oklchToRgb(L, C, h).every((v) => v >= -1e-4 && v <= 1.0001);
const paint = (L, C, h) => oklchToRgb(L, C, h).map((v) => Math.round(clamp01(linToSrgb(v)) * 255) / 255);
const relLum = ([r,g,b]) => 0.2126*srgbToLin(r) + 0.7152*srgbToLin(g) + 0.0722*srgbToLin(b);
const contrast = (a, b) => { const [x,y] = [relLum(a), relLum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };
const over = (fg, bg, al) => fg.map((v,i) => v*al + bg[i]*(1-al));
function hsl(str) {
  const n = str.match(/-?[\d.]+/g).map(Number);
  let [h, s, l] = [((n[0]%360)+360)%360, n[1]/100, n[2]/100];
  const c = (1-Math.abs(2*l-1))*s, x = c*(1-Math.abs(((h/60)%2)-1)), m = l-c/2;
  return [[c,x,0],[x,c,0],[0,c,x],[0,x,c],[x,0,c],[c,0,x]][Math.floor(h/60)%6].map(v=>v+m);
}
const grab = (src, tok) => { const m = src.match(new RegExp(tok + "\\s*:\\s*(hsl\\([^)]*\\)|#[0-9a-fA-F]{3,8})")); return m ? (m[1][0]==="#" ? [0,2,4].map(i=>parseInt(m[1].slice(1).padEnd(6,"0").slice(i,i+2),16)/255) : hsl(m[1])) : null; };
const darkAt = css.indexOf("\n.dark");
function block(from) { const o = css.indexOf("{", from); let d=0; for (let i=o;i<css.length;i++){ if(css[i]==="{")d++; else if(css[i]==="}"&&--d===0) return css.slice(o+1,i);} return ""; }
const L_SRC = css.slice(0, darkAt), D_SRC = block(darkAt);
const CARD = { light: grab(L_SRC, "--color-card"), dark: grab(D_SRC, "--color-card") };
const GRAPHITE = { light: grab(L_SRC, "--grid-line-color"), dark: grab(D_SRC, "--grid-line-color") };

// the walk, as the module writes it
const RESERVED = [[0,27.1616],[51.1659,108.7459],[133.985,178.6121],[236.3332,275.8809],[279.7172,306.5712],[333.0184,360]];
const OPEN = []; { let cut = 0; for (const [a,b] of RESERVED) { if (a>cut) OPEN.push([cut,a]); cut = Math.max(cut,b);} if (cut<360) OPEN.push([cut,360]); }
const SPAN = OPEN.reduce((s,[a,b])=>s+(b-a),0), STEP = SPAN*((3-Math.sqrt(5))/2);
const intoArc = (h,a,b) => Math.min(Math.max(Math.round(h*100)/100, Math.ceil(a*100)/100), Math.floor(b*100)/100);
function hueAt(i){ let p=(((i*STEP)%SPAN)+SPAN)%SPAN; for (const [a,b] of OPEN){ if(p<b-a) return intoArc(a+p,a,b); p-=b-a;} const [a,b]=OPEN.at(-1); return intoArc(b,a,b); }
const CAP = 0.215, BAND = { light: 0.44, dark: 0.65 };
function chromaAt(h){ const holds=c=>inGamut(BAND.light,c,h)&&inGamut(BAND.dark,c,h); if(holds(CAP))return CAP; let lo=0,hi=CAP; for(let k=0;k<20;k++){const m=(lo+hi)/2; holds(m)?lo=m:hi=m;} return lo; }
const N = 144;
const HANDS = Array.from({length:N},(_,i)=>{ const h=hueAt(i); return { i, h, c: chromaAt(h) }; });

const FILL = 0.04;
/** worst 3:1 over all 144, at a given ring lightness L and stroke alpha, in one arm. */
function worst(arm, ringL, alpha) {
  const card = CARD[arm];
  let wFill = { r: Infinity }, wGround = { r: Infinity }, u3 = 0;
  for (const hd of HANDS) {
    const bandInk = paint(BAND[arm], hd.c, hd.h);           // the hand's own ink (the fill's)
    const ringInk = paint(ringL, hd.c, hd.h);               // the RING's ink, its own lightness
    const fill = over(bandInk, card, FILL);
    const rF = contrast(over(ringInk, fill, alpha), fill);
    const rG = contrast(over(ringInk, card, alpha), card);
    if (rF < wFill.r) wFill = { r: rF, i: hd.i };
    if (rG < wGround.r) wGround = { r: rG, i: hd.i };
    if (Math.min(rF, rG) < 3) u3++;
  }
  return { vsFill: wFill, vsGround: wGround, under3: u3, ok: u3 === 0 };
}

// ── A · the opacity axis, HEAD's band, fine enough to name the break ────────────────────────
const alphaSweep = [];
for (let a = 0.50; a <= 0.96; a += 0.01) {
  const A = Math.round(a * 100) / 100;
  const l = worst("light", BAND.light, A), d = worst("dark", BAND.dark, A);
  alphaSweep.push({ alpha: A, light: +l.vsFill.r.toFixed(3), lightUnder3: l.under3,
                    dark: +d.vsFill.r.toFixed(3), darkUnder3: d.under3, bothClear: l.ok && d.ok });
}
const lowestBoth = alphaSweep.find((r) => r.bothClear)?.alpha ?? null;
const lowestLight = alphaSweep.find((r) => r.lightUnder3 === 0)?.alpha ?? null;
const lowestDark = alphaSweep.find((r) => r.darkUnder3 === 0)?.alpha ?? null;

// ── B · the LIGHTNESS axis, at an alpha the M1 ladder allows (< tier 1's 0.65) ──────────────
// Solve: at alpha ∈ {0.55, 0.60, 0.64}, what ring lightness clears 3:1 for all 144, both arms?
const lightnessSolve = {};
for (const alpha of [0.55, 0.6, 0.64]) {
  const row = {};
  for (const arm of ["light", "dark"]) {
    // light paper wants a DARKER ring; dark paper wants a LIGHTER one. Walk away from the band.
    const dir = arm === "light" ? -1 : +1;
    let found = null;
    for (let k = 0; k <= 60; k++) {
      const L = +(BAND[arm] + dir * k * 0.01).toFixed(2);
      if (L <= 0.02 || L >= 0.99) break;
      // the ring's chroma must still be in gamut at ITS lightness for every hand
      const holds = HANDS.every((hd) => inGamut(L, hd.c, hd.h));
      if (!holds) continue;
      const w = worst(arm, L, alpha);
      if (w.ok) { found = { ringL: L, stepsFromBand: k, worstVsFill: +w.vsFill.r.toFixed(3), worstVsGround: +w.vsGround.r.toFixed(3) }; break; }
    }
    row[arm] = found;
  }
  lightnessSolve[alpha] = row;
}

// ── C · tier 1's own ring, both arms — the rank the ladder is written about ─────────────────
const tier1 = {};
for (const arm of ["light", "dark"]) {
  const g = GRAPHITE[arm], card = CARD[arm];
  const fill = over(g, card, 0.06);
  tier1[arm] = {
    graphite: arm === "light" ? "hsl(0 0% 15%)" : "hsl(48 10% 80%)",
    strokeVsOwnFill_at_0_65: +contrast(over(g, fill, 0.65), fill).toFixed(3),
    strokeVsCard_at_0_65: +contrast(over(g, card, 0.65), card).toFixed(3),
  };
}

// ── D · tier 2 (your own keyboard focus), for the whole ladder in one table ─────────────────
const FOCUS = { light: grab(L_SRC, "--color-focus-sketch"), dark: grab(L_SRC, "--color-focus-sketch") };
const tier2 = {};
for (const arm of ["light", "dark"]) {
  const f = FOCUS[arm], card = CARD[arm], fill = over(f, card, 0.08);
  tier2[arm] = { strokeVsOwnFill_at_0_9: +contrast(over(f, fill, 0.9), fill).toFixed(3),
                 strokeVsCard_at_0_9: +contrast(over(f, card, 0.9), card).toFixed(3) };
}

console.log(JSON.stringify({
  grounds: { card: CARD, graphite: GRAPHITE, focusSketch: FOCUS },
  A_opacityAxis: { lowestAlphaClearingBoth: lowestBoth, lowestAlphaClearingLight: lowestLight,
                   lowestAlphaClearingDark: lowestDark,
                   atCandidates: Object.fromEntries([0.55,0.6,0.65,0.7,0.75,0.8,0.9,0.95].map((a)=>[a, alphaSweep.find(r=>Math.abs(r.alpha-a)<1e-9)])),
                   sweep: alphaSweep },
  B_lightnessAxis: lightnessSolve,
  C_tier1: tier1,
  D_tier2: tier2,
}, null, 2));
