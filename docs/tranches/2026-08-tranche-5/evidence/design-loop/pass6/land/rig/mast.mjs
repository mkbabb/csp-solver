/**
 * mast.mjs — the landscape masthead's own census at 844×390, and the fold overflow measured
 * at the CORRECTED referent (`.board-wrapper`, the drawn frame — pass 5's F3-G2 re-derivation:
 * 88.58 chromium / 87.98 webkit, against the pass-4 registry's unreproducible 90.58/89.98).
 * Every box is named, because the record carried three numbers for one quantity for a pass.
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
const [, , baseURL, engineName, outfile] = process.argv;
const engine = engineName === "webkit" ? webkit : chromium;
const b = await engine.launch();
const ctx = await b.newContext({ viewport:{width:844,height:390}, hasTouch:true,
  isMobile: engineName !== "webkit", deviceScaleFactor:2 });
const p = await ctx.newPage();
await p.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil:"load" });
await p.waitForSelector("svg.handwritten-logo", { timeout:20000 });
await p.addStyleTag({ content:".tuner-toggle{display:none !important}" });
await p.waitForFunction(()=>document.querySelectorAll(".sudoku-cell .glyph-svg").length>0,{timeout:20000}).catch(()=>{});
await p.waitForTimeout(700);
const out = await p.evaluate(()=>{
  const r=(s)=>{const e=document.querySelector(s);return e?(({x,y,width,height,top,bottom,left,right})=>({x:+x.toFixed(2),y:+y.toFixed(2),w:+width.toFixed(2),h:+height.toFixed(2),top:+top.toFixed(2),bottom:+bottom.toFixed(2),left:+left.toFixed(2),right:+right.toFixed(2)}))(e.getBoundingClientRect()):null;};
  const vh=window.innerHeight, sy=window.scrollY;
  const frame=r(".board-wrapper"), cells=r(".board-cells"), shell=r(".board-shell");
  const host=r(".board-peek-host"), mast=r(".masthead"), logo=r("svg.handwritten-logo");
  return {
    vh, vw:window.innerWidth, docScrollH:document.documentElement.scrollHeight,
    pageVh:Math.round((document.documentElement.scrollHeight/vh)*1000)/1000,
    masthead: mast, logo,
    chromeAboveBoard: host? +(host.top+sy).toFixed(2):null,
    overflow: {
      "board-wrapper": frame? +Math.max(0, frame.bottom+sy-vh).toFixed(2):null,
      "board-cells":  cells? +Math.max(0, cells.bottom+sy-vh).toFixed(2):null,
      "board-shell":  shell? +Math.max(0, shell.bottom+sy-vh).toFixed(2):null,
    },
    wholeAboveFold: frame ? frame.bottom+sy <= vh : null,
    cellW: (()=>{const c=document.querySelector(".board-cells .sudoku-cell");return c?+c.getBoundingClientRect().width.toFixed(2):null;})(),
  };
});
writeFileSync(outfile, JSON.stringify(out,null,1));
console.log(JSON.stringify(out,null,1));
await b.close();
