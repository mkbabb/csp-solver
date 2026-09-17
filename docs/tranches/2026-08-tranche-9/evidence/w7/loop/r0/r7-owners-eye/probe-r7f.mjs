// T8-M20 sweep: ~900px wide dark, board filling the page — does "sudoku" lie on the grid?
// plus the F12 landscape pose 844x390.
const { webkit, chromium } = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs");
const OUT="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/r7-owners-eye/frames";
const res={};
for (const eng of ["webkit","chromium"]) {
  const b = await (eng==="webkit"?webkit:chromium).launch();
  const ctx = await b.newContext({viewport:{width:900,height:900},deviceScaleFactor:1,colorScheme:"dark"});
  await ctx.addInitScript(()=>{try{localStorage.clear();localStorage.setItem("sudoku-color-scheme","dark")}catch{}});
  const p = await ctx.newPage();
  await p.goto("http://127.0.0.1:4247/?size=3&difficulty=EASY",{waitUntil:"domcontentloaded"});
  await p.waitForSelector("svg.handwritten-logo",{timeout:20000});
  await p.addStyleTag({content:".tuner-toggle{display:none!important}"});
  await p.waitForTimeout(1600);
  const rows=[];
  for (const h of [1000,900,820,760,700,640,600,560,520,480]) {
    await p.setViewportSize({width:900,height:h});
    await p.waitForTimeout(700);
    rows.push(await p.evaluate((hh)=>{
      const w=document.querySelector("svg.handwritten-logo").getBoundingClientRect();
      const g=document.querySelector(".board-wrapper, .sudoku-board").getBoundingClientRect();
      const ov=Math.max(0,Math.min(w.bottom,g.bottom)-Math.max(w.top,g.top))*Math.max(0,Math.min(w.right,g.right)-Math.max(w.left,g.left));
      return {h:hh,wordmark:[+w.x.toFixed(1),+w.y.toFixed(1),+w.width.toFixed(1),+w.height.toFixed(1)],board:[+g.x.toFixed(1),+g.y.toFixed(1),+g.width.toFixed(1),+g.height.toFixed(1)],gap:+(g.top-w.bottom).toFixed(1),overlapPx2:+ov.toFixed(1),docScrollH:document.documentElement.scrollHeight,innerH:innerHeight};
    },h));
  }
  res["m20sweep_"+eng]=rows;
  // F12's landscape pose
  await p.setViewportSize({width:844,height:390});
  await p.waitForTimeout(900);
  res["landscape844_"+eng]=await p.evaluate(()=>{
    const t=document.querySelector(".drawer-tab"); const tb=t?t.getBoundingClientRect():null;
    const g=document.querySelector(".board-wrapper, .sudoku-board").getBoundingClientRect();
    return {tab:tb?[+tb.x.toFixed(1),+tb.y.toFixed(1),+tb.width.toFixed(1),+tb.height.toFixed(1)]:null,
      tabDisplay:t?getComputedStyle(t).display:null, board:[+g.x.toFixed(1),+g.y.toFixed(1),+g.width.toFixed(1),+g.height.toFixed(1)],
      tuck:tb?+(tb.left-g.right).toFixed(1):null, docScrollH:document.documentElement.scrollHeight, innerH:innerHeight,
      foldTools:(()=>{const f=document.querySelector("#fold-tools, .play-controls"); if(!f) return null; const r=f.getBoundingClientRect(); return [+r.x.toFixed(1),+r.y.toFixed(1),+r.width.toFixed(1),+r.height.toFixed(1)];})()};
  });
  if (eng==="webkit") await p.screenshot({path:OUT+"/p8-webkit-landscape844x390.png", clip:{x:0,y:0,width:844,height:390}});
  await b.close();
}
console.log(JSON.stringify(res,null,1));

