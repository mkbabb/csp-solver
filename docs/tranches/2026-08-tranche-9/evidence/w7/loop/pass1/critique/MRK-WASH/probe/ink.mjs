import { chromium } from "playwright";
const b = await chromium.launch();
for (const theme of ["light","dark"]) {
  const ctx = await b.newContext({ viewport:{width:1280,height:800}, colorScheme:theme, reducedMotion:"reduce" });
  const p = await ctx.newPage();
  await p.goto("http://127.0.0.1:4241/?size=3&difficulty=EASY");
  await p.waitForSelector("path.cell-line",{state:"attached",timeout:30000});
  await p.waitForTimeout(1500);
  const i = await p.evaluate(()=>{const ins=[...document.querySelectorAll(".game-cell input")];const k=ins.findIndex((n,j)=>!n.value&&j>20&&j<60);ins[k].focus();return k;});
  await p.keyboard.press("5"); await p.waitForTimeout(500);
  const focused = await p.evaluate((k)=>{const n=document.querySelectorAll(".game-cell input")[k];return {color:getComputedStyle(n).color, cls:n.parentElement.className};},i);
  await p.evaluate(()=>document.querySelector(".drawer-tab,.icon-btn,button")?.focus());
  await p.waitForTimeout(400);
  const blurred = await p.evaluate((k)=>getComputedStyle(document.querySelectorAll(".game-cell input")[k]).color,i);
  // a given's ink for comparison
  const given = await p.evaluate(()=>{const c=[...document.querySelectorAll(".game-cell")].find(c=>c.querySelector("input")?.value&&c.className.includes("given"));return c?getComputedStyle(c.querySelector("input")).color:"n/a";});
  console.log(theme, "entry focused:", focused.color, "| entry blurred:", blurred, "| given:", given);
  await ctx.close();
}
await b.close();
