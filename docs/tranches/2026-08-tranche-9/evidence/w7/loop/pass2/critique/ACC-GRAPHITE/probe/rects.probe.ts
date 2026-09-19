/** pi — a box census on an UNCLAIMED surface, run identically against HEAD (dist :4244) and the prototype (:4243). */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
const OUT="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/ACC-GRAPHITE/readings";
mkdirSync(OUT,{recursive:true});
const BASE = process.env.TARGET_URL!;
const LABEL = process.env.LABEL!;
test("rect census", async ({ page }, info) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(BASE + "/?size=3&difficulty=HARD");
  await page.waitForSelector(".sudoku-cell",{timeout:40000});
  await expect.poll(()=>page.locator(".sudoku-cell .glyph-svg").count(),{timeout:40000}).toBeGreaterThan(0);
  await page.waitForTimeout(1500);
  const rects = await page.evaluate(()=>{
    const out:Record<string,number[]>={};
    document.querySelectorAll("*").forEach((e)=>{
      const el=e as HTMLElement;
      const cls=(el.className?.toString?.()||"").trim().split(/\s+/)[0]||"";
      const key=`${el.tagName}.${cls}`;
      if(out[key]) return;                         // first of each kind
      const r=el.getBoundingClientRect();
      if(r.width===0&&r.height===0) return;
      out[key]=[+r.x.toFixed(1),+r.y.toFixed(1),+r.width.toFixed(1),+r.height.toFixed(1)];
    });
    out.__doc=[document.documentElement.scrollWidth,document.documentElement.scrollHeight];
    return out;
  });
  writeFileSync(`${OUT}/rects-${LABEL}-${info.project.name}.json`,JSON.stringify(rects,null,2));
  console.log(LABEL,info.project.name,"keys",Object.keys(rects).length);
});
