// Fold the interleaved raw into per-arm medians. Median of an even count is the mean of the
// two middle readings; no window is dropped unless named on the command line (--drop win,win).
import fs from "node:fs";
const a=process.argv.slice(2),g=(k,d)=>{const i=a.indexOf("--"+k);return i>=0?a[i+1]:d;};
const rows=fs.readFileSync(g("in"),"utf8").trim().split("\n").map(l=>JSON.parse(l));
const med=(xs)=>{const s=[...xs].sort((x,y)=>x-y);const n=s.length;return n===0?null:+(n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2).toFixed(1);};
const fields=(g("fields","tGivens,gap,tCells,boardReady,wasmReqs")).split(",");
for(const arm of ["base","cured"]){
  const r=rows.filter(x=>x.arm===arm&&x[fields[0]]!==null);
  const line=fields.map(f=>`${f}=${med(r.map(x=>x[f]))}`).join(" ");
  console.log(`${arm} n=${r.length} ${line}`);
  for(const f of fields){const v=r.map(x=>x[f]).sort((x,y)=>x-y);console.log(`  ${f}: ${v.join(", ")}`);}
}
