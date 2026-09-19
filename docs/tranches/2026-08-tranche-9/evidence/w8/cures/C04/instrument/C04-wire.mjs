// run: node C04-wire.mjs --base 4254 --cured 4255 --cpu 4 --net fast3g --windows 2 --out ../raw/wire.jsonl
// The worker's own GETs are invisible to `performance.getEntriesByType('resource')` on the page
// (they belong to the worker), so the wire is read from Playwright's `request.sizes()` on the
// CONTEXT's requestfinished — the same stream `A3-wasm-probe.mjs` counts requests from.
import { createRequire } from "node:module"; import fs from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-wasm/web/frontend/package.json");
const { chromium } = require("playwright");
const a=process.argv.slice(2), g=(k,d)=>{const i=a.indexOf("--"+k);return i>=0?a[i+1]:d;};
const BASE=g("base","4254"),CURED=g("cured","4255"),CPU=+g("cpu","4"),NET=g("net","fast3g"),N=+g("windows","2"),OUT=g("out","wire.jsonl");
const path="/?game=sudoku&size=3&difficulty=EASY";
const out=fs.createWriteStream(OUT,{flags:"a"});const br=await chromium.launch();
for(let w=0;w<N;w++){for(const arm of ["base","cured"]){
  const port=arm==="base"?BASE:CURED;
  const ctx=await br.newContext({viewport:{width:1280,height:800}});
  const sized=[];
  ctx.on("requestfinished",async(r)=>{if(!r.url().endsWith(".wasm"))return;try{const s=await r.sizes();sized.push(s);}catch{}});
  const page=await ctx.newPage();const cdp=await ctx.newCDPSession(page);await cdp.send("Network.enable");
  if(CPU>1)await cdp.send("Emulation.setCPUThrottlingRate",{rate:CPU});
  if(NET==="fast3g")await cdp.send("Network.emulateNetworkConditions",{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
  await page.goto(`http://127.0.0.1:${port}${path}`,{waitUntil:"load",timeout:90000});
  await page.waitForTimeout(9000);
  const rec={arm,port,engine:"chromium",cpu:CPU,net:NET,dpr:1,viewport:"1280x800",cache:"true-first-visit",win:w,wasmEntries:sized.length,wasmBodies:sized.map(s=>s.responseBodySize),wasmWire:sized.reduce((x,y)=>x+y.responseBodySize+y.responseHeadersSize,0)};
  out.write(JSON.stringify(rec)+"\n");
  console.log(`w${w} ${arm}: entries=${rec.wasmEntries} bodies=${rec.wasmBodies} wire=${rec.wasmWire}`);
  await ctx.close();}}
await br.close();out.end();
