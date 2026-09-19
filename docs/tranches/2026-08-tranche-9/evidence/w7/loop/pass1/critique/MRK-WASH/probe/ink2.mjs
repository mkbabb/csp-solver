import { chromium } from "playwright";
const b = await chromium.launch();
for (const theme of ["light","dark"]) {
  const ctx = await b.newContext({ viewport:{width:1280,height:800}, colorScheme:theme, reducedMotion:"reduce" });
  const p = await ctx.newPage();
  await p.goto("http://127.0.0.1:4241/?size=3&difficulty=EASY");
  await p.waitForSelector("path.cell-line",{state:"attached",timeout:30000});
  await p.waitForTimeout(1500);
  const i = await p.evaluate(()=>{const ins=[...document.querySelectorAll(".game-cell input")];const k=ins.findIndex((n,j)=>!n.value&&j>20&&j<60);ins[k].focus();return k;});
  await p.keyboard.press("5"); await p.waitForTimeout(600);
  const r = await p.evaluate((k)=>{
    const cell=document.querySelectorAll(".game-cell")[k];
    const inp=cell.querySelector("input");
    const out={cellClass:cell.className, inputColor:getComputedStyle(inp).color, inputWebkitTextFill:getComputedStyle(inp).webkitTextFillColor, kids:[]};
    for (const el of cell.querySelectorAll("svg,path,span,div")) {
      const s=getComputedStyle(el);
      out.kids.push(`${el.tagName.toLowerCase()}.${(el.getAttribute("class")||"").split(" ").slice(0,2).join(".")} fill=${s.fill} stroke=${s.stroke} color=${s.color}`);
    }
    // a GIVEN cell for comparison
    const g=[...document.querySelectorAll(".game-cell")].find(c=>c.className.includes("given"));
    out.givenClass=g?g.className:"none";
    if(g){const ge=g.querySelector("svg,path");out.givenInk=ge?getComputedStyle(ge).fill+" / stroke "+getComputedStyle(ge).stroke:"n/a"; out.givenInputFill=getComputedStyle(g.querySelector("input")).webkitTextFillColor;}
    return out;
  },i);
  console.log("==",theme,"==");
  console.log(JSON.stringify(r,null,1).slice(0,1600));
  await ctx.close();
}
await b.close();
