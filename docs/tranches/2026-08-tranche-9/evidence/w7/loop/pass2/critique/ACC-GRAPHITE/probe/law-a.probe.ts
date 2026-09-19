/** LAW A across REAL boards: does `m` (cells per tick) hold at 9x9, or does writable straddle slots? */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
const OUT="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/ACC-GRAPHITE/readings";
mkdirSync(OUT,{recursive:true});
test("law A over 8 fresh HARD boards", async ({ page }, info) => {
  const rows:any[]=[];
  for (let trial=0; trial<8; trial++) {
    await page.goto(`./?size=3&difficulty=HARD&t=${trial}`);
    await page.waitForSelector(".sudoku-cell",{timeout:30000});
    await expect.poll(()=>page.locator(".sudoku-cell .glyph-svg").count(),{timeout:30000}).toBeGreaterThan(0);
    await page.waitForTimeout(700);
    const empties = await page.evaluate(()=>{const o:number[]=[];document.querySelectorAll(".sudoku-cell").forEach((c,i)=>{const n=c.querySelector("input") as HTMLInputElement|null;if(n&&!n.value&&!n.disabled&&!n.readOnly)o.push(i);});return o;});
    const writable = empties.length;
    for (const i of empties.slice(0,20)) { await page.locator(".sudoku-cell").nth(i).locator("input").fill("5"); }
    await page.waitForTimeout(500);
    const t = await page.evaluate(()=>{const a=document.querySelector(".progress-pose.is-active .progress-trace") as SVGPathElement|null;
      if(!a) return null; const d=a.getAttribute("d")||""; return { subpaths:(d.match(/M/gi)||[]).length }; });
    const slots=Math.min(writable,Math.floor(3960/70)); const m=Math.ceil(writable/slots);
    rows.push({trial,writable,slots,m,predictedK:Math.ceil(20/m),subpaths:t?.subpaths??null});
  }
  writeFileSync(`${OUT}/law-a-${info.project.name}.json`,JSON.stringify(rows,null,2));
  console.log(info.project.name, JSON.stringify(rows));
});
