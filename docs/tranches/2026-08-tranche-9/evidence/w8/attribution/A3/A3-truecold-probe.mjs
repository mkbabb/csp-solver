// run: node A3-truecold-probe.mjs --port 4254 --cpu 4 --net fast3g --windows 3 --out truecold-raw.jsonl
// THE REAL FIRST VISIT: a fresh context, HTTP cache ENABLED but empty, ONE navigation.
// Distinct from the CDP `Network.setCacheDisabled` cold, which maps to LOAD_BYPASS_CACHE —
// reads are bypassed but responses ARE stored, so a request the page makes twice in one load
// (the fraunces preload + HandwrittenLogo's own fetch) pays the wire twice under CDP and once
// in life. Both numbers are banked; this file is the one a visitor actually pays.
import { createRequire } from "node:module"; import fs from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const { chromium } = require("playwright");
const a=process.argv.slice(2), g=(k,d)=>{const i=a.indexOf("--"+k);return i>=0?a[i+1]:d;};
const PORT=g("port","4254"),CPU=+g("cpu","4"),NET=g("net","fast3g"),N=+g("windows","3"),OUT=g("out","truecold-raw.jsonl");
const URL_=`http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;
const INIT=()=>{const A=(window.__T={boardReady:null,tGivens:null,bakes:0});
  const tb=HTMLCanvasElement.prototype.toBlob;HTMLCanvasElement.prototype.toBlob=function(cb,...r){return tb.call(this,b=>{A.bakes++;cb(b);},...r);};
  const tick=()=>{const bg=document.querySelector(".board-group"),c=document.querySelector(".game-cell");
    if(A.boardReady===null&&bg&&(bg.offsetWidth||bg.offsetHeight||bg.getClientRects().length)&&c){const r=c.getBoundingClientRect();
      if(r.width>0&&r.height>0)requestAnimationFrame(()=>{A.boardReady=+performance.now().toFixed(1);});}
    if(A.tGivens===null)for(const x of document.querySelectorAll(".game-cell")){const t=(x.textContent||"").trim()||(x.querySelector("input")||{}).value||"";if(t){A.tGivens=+performance.now().toFixed(1);break;}}
    requestAnimationFrame(tick);};requestAnimationFrame(tick);};
const out=fs.createWriteStream(OUT,{flags:"a"});const br=await chromium.launch();
for(let w=0;w<N;w++){
  const ctx=await br.newContext({viewport:{width:1280,height:800}});await ctx.addInitScript(INIT);
  const page=await ctx.newPage();const cdp=await ctx.newCDPSession(page);await cdp.send("Network.enable");
  if(CPU>1)await cdp.send("Emulation.setCPUThrottlingRate",{rate:CPU});
  if(NET==="fast3g")await cdp.send("Network.emulateNetworkConditions",{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
  await page.goto(URL_,{waitUntil:"load",timeout:60000});
  await page.waitForFunction(()=>window.__T&&window.__T.tGivens!==null,{timeout:45000}).catch(()=>{});
  await page.waitForTimeout(4000);
  const r=await page.evaluate(()=>{const A=window.__T;
    const res=performance.getEntriesByType("resource").filter(e=>e.initiatorType!=="blob"&&!e.name.startsWith("blob:"))
      .map(e=>({n:e.name.split("/").pop().split("?")[0],i:e.initiatorType,s:+e.startTime.toFixed(1),e:+e.responseEnd.toFixed(1),t:e.transferSize,enc:e.encodedBodySize}));
    return{boardReady:A.boardReady,tGivens:A.tGivens,bakes:A.bakes,reqCount:res.length,wireB:res.reduce((x,y)=>x+y.t,0),
      fraunces:res.filter(x=>x.n.includes("fraunces")),res};});
  out.write(JSON.stringify({cpu:CPU,net:NET,win:w,kind:"true-first-visit",...r})+"\n");
  console.log(`w${w}: boardReady=${r.boardReady} tGivens=${r.tGivens} bakes=${r.bakes} req=${r.reqCount} wireB=${r.wireB} fraunces=${JSON.stringify(r.fraunces.map(f=>[f.i,f.s,f.e,f.t]))}`);
  await ctx.close();}
await br.close();out.end();
