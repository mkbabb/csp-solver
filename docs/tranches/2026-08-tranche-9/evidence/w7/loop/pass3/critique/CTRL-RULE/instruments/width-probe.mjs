const NM="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium } = await import(NM+"playwright/index.mjs");
const b = await chromium.launch();
for (const [tag,url] of [["proto","http://127.0.0.1:4233/"],["head","http://127.0.0.1:4234/"]]) {
  const ctx = await b.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1,colorScheme:"light"});
  await ctx.addInitScript(()=>{try{localStorage.clear();localStorage.setItem("sudoku-color-scheme","light")}catch{}});
  const p = await ctx.newPage();
  await p.goto(url+"?size=3&difficulty=EASY",{waitUntil:"domcontentloaded"});
  await p.waitForSelector("svg.handwritten-logo",{timeout:45000});
  await p.waitForTimeout(1600);
  console.log(tag, JSON.stringify(await p.evaluate(()=>{
    const c=document.querySelector(".controls-card");
    const par=c&&c.parentElement;
    const scene=document.querySelector(".scene-grid")||document.querySelector("main");
    const r=c?c.getBoundingClientRect():null;
    return {
      cardW: r?+r.width.toFixed(2):null,
      cardH: r?+r.height.toFixed(2):null,
      parentW: par?+par.getBoundingClientRect().width.toFixed(2):null,
      sceneTemplate: scene?getComputedStyle(scene).gridTemplateColumns:null,
      sceneClass: scene?String(scene.className).slice(0,60):null,
      rpMargin: c?getComputedStyle(c).getPropertyValue("--rp-margin"):null,
      widestGroup: [...document.querySelectorAll("[data-ruled-group]")].map(g=>({n:g.querySelector(".rp-name")?.textContent.trim(), w:+g.getBoundingClientRect().width.toFixed(2), scrollW:g.scrollWidth})).sort((a,b)=>b.scrollW-a.scrollW).slice(0,3),
    };
  })));
  await ctx.close();
}
await b.close();
console.log("EXIT OK");
