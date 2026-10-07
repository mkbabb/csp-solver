import { chromium } from "@playwright/test";
const b = await chromium.launch(); const p = await (await b.newContext({viewport:{width:1280,height:800}, baseURL: process.argv[2]})).newPage();
const SOL16 = Array.from({ length: 256 }, (_, i) => ((4 * (Math.floor(i / 16) % 4) + Math.floor(Math.floor(i / 16) / 4) + (i % 16)) % 16) + 1);
function mulberry(a){return()=>{a|=0;a=(a+0x6d2b79f5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
const rnd=mulberry(20260923);const idx=[...Array(256).keys()];for(let i=255;i>0;i--){const j=Math.floor(rnd()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
const K=new Set(idx.slice(0,86));const PUZ=SOL16.map((v,i)=>K.has(i)?v.toString(36):"0").join("");
const B="?board="+btoa(String.fromCharCode(1)+"4."+PUZ).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
await p.goto("/"+B); await p.waitForSelector(".sudoku-cell",{timeout:60000});
const rd = () => p.evaluate(() => [...document.querySelectorAll('[role="progressbar"]')].map(e=>e.getAttribute("aria-valuetext")).join("|") + " meta=" + document.querySelector(".margin-note-meta")?.textContent?.trim() + " voice=" + document.querySelector(".margin-note")?.textContent?.trim());
console.log(p.url().slice(0,40), await rd());
for (let k=0;k<4;k++){ console.log('hint', await p.evaluate(()=>{const b=document.querySelector('[aria-label*="Hint" i]:not([disabled])'); b?.click(); return b?.getAttribute('aria-label');})); await p.waitForTimeout(1500); console.log(await rd()); }
await b.close();
