const { webkit } = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs");
const b = await webkit.launch();
const ctx = await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,colorScheme:"dark"});
await ctx.addInitScript(()=>{try{localStorage.clear();localStorage.setItem("sudoku-color-scheme","dark")}catch{}});
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:4247/?size=3&difficulty=EASY",{waitUntil:"domcontentloaded"});
await p.waitForSelector("svg.handwritten-logo",{timeout:20000});
await p.addStyleTag({content:".tuner-toggle{display:none!important}"});
await p.waitForTimeout(1800);
await p.locator(".drawer-tab").click(); await p.waitForTimeout(950);
console.log(JSON.stringify(await p.evaluate(()=>{
  const bar=document.querySelector(".action-bar").getBoundingClientRect();
  const wells=[...document.querySelectorAll(".tray-well")].map(w=>{
    const r=w.getBoundingClientRect();
    const tag=(w.querySelector(".washi-tag")?.textContent||"?").trim();
    const ov=Math.max(0,Math.min(r.bottom,bar.bottom)-Math.max(r.top,bar.top))*Math.max(0,Math.min(r.right,bar.right)-Math.max(r.left,bar.left));
    return {tag,box:[+r.x.toFixed(1),+r.y.toFixed(1),+r.width.toFixed(1),+r.height.toFixed(1)],overlapWithBarPx2:+ov.toFixed(1),fracOfWellUnderBar:+(ov/Math.max(1,r.width*r.height)).toFixed(3)};
  });
  const bcs=getComputedStyle(document.querySelector(".action-bar"));
  return {bar:[+bar.x.toFixed(1),+bar.y.toFixed(1),+bar.width.toFixed(1),+bar.height.toFixed(1)],barZ:bcs.zIndex,barPos:bcs.position,barBg:bcs.backgroundColor,wells};
}),null,1));
await b.close();
