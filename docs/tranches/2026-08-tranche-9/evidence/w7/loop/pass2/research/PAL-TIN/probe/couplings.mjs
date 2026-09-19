#!/usr/bin/env node
/** PAL-TIN pass 2 — the two live accent families, priced against the tin's five berths. */
import { dE, gap, hueOf, chromaOf, lOf } from "./color.mjs";
const TIN = { light: {amber:"#b24f00",green:"#5f7d00",teal:"#008086",violet:"#5a61ce",pink:"#a5439a"},
              dark: {amber:"#ff9a62",green:"#a0c942",teal:"#00d0d9",violet:"#a4b1ff",pink:"#f48ce6"} };
const CASES = {
  "HEAD          user-ink":      { light: "#2563eb", dark: "#60a5fa" },
  "ACC-FIVE blue-ink":           { light: "#026fc4", dark: "#47a7ff" },
  "ACC-SIX  blue-ink":           { light: "#2f76bd", dark: null },
  "ACC-SIX  answer pale":        { light: null, dark: "#c4b5fd" },
  "ACC-SIX  answer mid":         { light: "#8b5cf6", dark: null },
  "ACC-SIX  answer deep":        { light: "#7c3aed", dark: null },
  "HEAD          progress-ink":  { light: "#8b5cf6", dark: "#7c3aed" },
  "HEAD          solver-ink-2":  { light: "#7c3aed", dark: "#c4b5fd" },
};
console.log("| anchor | arm | hex | h | C | L | nearest tin stick | deg | ΔE |");
console.log("|---|---|---|---|---|---|---|---|---|");
for (const [n, arms] of Object.entries(CASES))
  for (const arm of ["light","dark"]) {
    const hex = arms[arm]; if (!hex) continue;
    let bn=null, bd=1e9, be=1e9;
    for (const [k,v] of Object.entries(TIN[arm])) { const d=gap(hueOf(hex),hueOf(v)), e=dE(hex,v); if (e<be){be=e;bn=k;bd=d;} }
    console.log(`| ${n} | ${arm} | ${hex} | ${hueOf(hex).toFixed(1)} | ${chromaOf(hex).toFixed(3)} | ${lOf(hex).toFixed(3)} | ${bn} | ${bd.toFixed(1)} | **${be.toFixed(3)}** |`);
  }
