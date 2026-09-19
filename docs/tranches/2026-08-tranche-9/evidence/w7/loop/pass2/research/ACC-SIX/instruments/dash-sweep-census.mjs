import sharp from "sharp";
import { readFileSync, readdirSync } from "node:fs";
const DIR = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/ACC-SIX/readings";
const isViolet = (r,g,b) => b > 120 && b - g > 40 && b >= r && r - g > 10;
for (const eng of ["chromium","webkit"]) {
  const pts = JSON.parse(readFileSync(`${DIR}/dash-pts-${eng}.json`,"utf8"));
  console.log(`\n=== ${eng} — ${pts.length} perimeter samples ===`);
  for (const f of readdirSync(DIR).filter(f=>f.startsWith(`dash-${eng}-`)&&f.endsWith(".png")).sort()) {
    const img = sharp(`${DIR}/${f}`);
    const meta = await img.metadata();
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    const sx = info.width/640, sy = info.height/640;
    const hit = pts.map(([x,y]) => {
      // sample a 3x3 neighbourhood, call it painted if any pixel is violet
      for (let dx=-2; dx<=2; dx++) for (let dy=-2; dy<=2; dy++) {
        const px = Math.round(x*sx)+dx, py = Math.round(y*sy)+dy;
        if (px<0||py<0||px>=info.width||py>=info.height) continue;
        const i = (py*info.width+px)*info.channels;
        if (isViolet(data[i],data[i+1],data[i+2])) return 1;
      }
      return 0;
    });
    let runs=0; for (let i=0;i<hit.length;i++) if (hit[i] && !hit[(i-1+hit.length)%hit.length]) runs++;
    const painted = hit.reduce((a,b)=>a+b,0)/hit.length;
    console.log(`  ${f.padEnd(40)} ${info.width}x${info.height}  runs=${runs}  painted=${(painted*100).toFixed(1)}%`);
  }
}
