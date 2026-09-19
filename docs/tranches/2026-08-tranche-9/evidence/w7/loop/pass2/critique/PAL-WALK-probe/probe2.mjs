import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const req = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/web/frontend/package.json");
const { chromium, webkit } = req("playwright");
const sharp = req("sharp");
const URL0 = "http://127.0.0.1:4241/?size=3&difficulty=EASY&wire=local";
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const oklab = ([R,G,B]) => { const [r,g,b]=[R,G,B].map(v=>lin(v/255));
  const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b), m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b), s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
  return [0.2104542553*l+0.793617785*m-0.0040720468*s, 1.9779984951*l-2.428592205*m+0.4505937099*s, 0.0259040371*l+0.7827717662*m-0.808675766*s]; };
const dE=(a,b)=>{const[x,y]=[oklab(a),oklab(b)];return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2]);};
const lum=([r,g,b])=>0.2126*lin(r/255)+0.7152*lin(g/255)+0.0722*lin(b/255);
const ratio=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);};
const out = {};
for (const [name, launcher] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await launcher.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 3 });
  await page.goto(URL0, { waitUntil: "load" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, null, { timeout: 60000 });
  for (const theme of ["light","dark"]) {
    await page.evaluate((t)=>document.documentElement.classList.toggle("dark", t==="dark"), theme);
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const base = await page.evaluate(async () => {
      const m = await import(/* @vite-ignore */ "/src/games/shared/playerIdentity.ts");
      const cs = getComputedStyle(document.documentElement);
      const band = cs.getPropertyValue("--peer-ink-l").trim();
      const c = document.createElement("canvas"); c.width=c.height=1;
      const g = c.getContext("2d",{willReadFrequently:true});
      const paint=(ground,css,a)=>{g.globalAlpha=1;g.globalCompositeOperation="copy";g.fillStyle=ground;g.fillRect(0,0,1,1);
        g.globalCompositeOperation="source-over";g.globalAlpha=a;g.fillStyle=css;g.fillRect(0,0,1,1);
        const d=g.getImageData(0,0,1,1).data;return[d[0],d[1],d[2]];};
      const inks = Array.from({length:144},(_,i)=>m.inkFor(i)["--color-user-ink"]);
      return { band, inks, canvas: inks.map(s=>paint("#808080", s.replace("var(--peer-ink-l)",band),1)),
        card: paint(cs.getPropertyValue("--color-card").trim(),"rgba(0,0,0,0)",0) };
    });
    const rows=[];
    for (const idx of [35,115,0,112,1]) {
      const cellIdx = await page.evaluate(()=>[...document.querySelectorAll(".sudoku-cell input")].findIndex(i=>!i.value));
      await page.evaluate((ink)=>document.documentElement.style.setProperty("--color-user-ink", ink), base.inks[idx]);
      const input = page.locator(".sudoku-cell input").nth(cellIdx);
      await input.click(); await input.fill("8"); await page.waitForTimeout(500);
      const buf = await page.locator(".sudoku-cell").nth(cellIdx).screenshot();
      const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      let core=null, bestC=-1, n=0;
      for (let p=0;p<info.width*info.height;p++){ const q=[data[p*4],data[p*4+1],data[p*4+2]];
        const [,A,B]=oklab(q); const C=Math.hypot(A,B); if (C>0.03) n++; if (C>bestC){bestC=C;core=q;} }
      rows.push({ i: idx, canvas: base.canvas[idx], core, chromaticPixels: n, coreChroma: +bestC.toFixed(4),
        dE_core_vs_canvas: +dE(core, base.canvas[idx]).toFixed(4),
        aa_canvas: +ratio(base.canvas[idx], base.card).toFixed(2), aa_core: +ratio(core, base.card).toFixed(2) });
      await input.fill(""); await page.evaluate(()=>document.documentElement.style.removeProperty("--color-user-ink")); await page.waitForTimeout(150);
    }
    out[`${name}/${theme}`]=rows;
    console.log(name, theme, JSON.stringify(rows));
  }
  await browser.close();
}
writeFileSync("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PAL-WALK-probe/real-glyph-vs-canvas.json", JSON.stringify(out,null,1));
console.log("DONE");
