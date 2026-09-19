import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const OUT=process.argv[2], ENGINE=process.argv[3]||"chromium", BASE=`http://127.0.0.1:${process.argv[4]||"4234"}`;
const FOOT = () => {
  const card=document.querySelector(".controls-card");
  const foot=document.getElementById("card-foot");
  const bar=document.querySelector(".action-bar");
  if(!card||!foot) return {err:"missing", hasFoot:!!foot};
  const cs=getComputedStyle(card), fs=getComputedStyle(foot);
  const cb=card.getBoundingClientRect(), fb=foot.getBoundingClientRect();
  const contentLeft=cb.left+parseFloat(cs.paddingLeft)+parseFloat(cs.borderLeftWidth||"0");
  const firstCtrl=card.querySelector(".tray-well");
  const wl=firstCtrl?firstCtrl.getBoundingClientRect().left:null;
  const barB=bar?bar.getBoundingClientRect():null;
  return {
    cardPadLeft: cs.paddingLeft,
    cardPadXvarOnCard: cs.getPropertyValue("--card-pad-x").trim(),
    cardPadXvarOnFoot: fs.getPropertyValue("--card-pad-x").trim(),
    footPadLeft: fs.paddingLeft, footPadRight: fs.paddingRight,
    footFootH: cs.getPropertyValue("--card-foot-h").trim(),
    cardContentLeft:+contentLeft.toFixed(2),
    wellLeft: wl!==null?+wl.toFixed(2):null,
    barLeft: barB?+barB.left.toFixed(2):null,
    barRight: barB?+barB.right.toFixed(2):null,
    cardRight:+cb.right.toFixed(2),
    footBottom:+fb.bottom.toFixed(2),
    innerH: window.innerHeight,
  };
};
const run=async()=>{
  const b=await (ENGINE==="webkit"?webkit:chromium).launch();
  const out={engine:ENGINE,cells:{}};
  for(const [n,vp] of [["rail1440",{width:1440,height:900}],["dock390",{width:390,height:844}]]){
    const ctx=await b.newContext({viewport:vp,baseURL:BASE});
    const p=await ctx.newPage();
    await p.goto("/?size=3&difficulty=EASY");
    await p.waitForSelector("svg.handwritten-logo",{timeout:40000});
    await p.waitForSelector(".sudoku-cell .glyph-svg",{timeout:40000});
    if(vp.width<1024){const t=p.locator(".drawer-tab, [data-drawer-tab]").first(); if(await t.count()) await t.click({timeout:5000}).catch(()=>{}); await p.waitForTimeout(900);}
    await p.waitForTimeout(700);
    out.cells[n]=await p.evaluate(FOOT);
    await ctx.close();
  }
  await b.close(); writeFileSync(OUT,JSON.stringify(out,null,1)); console.log("WROTE",OUT);
};
run().then(()=>console.log("EXIT 0"),e=>{console.error("FAIL",e);process.exit(1)});
