// run: node summarize-readings.mjs <readings.jsonl ...>  — median board-ready/FCP/TBT per regime
import { readFileSync } from 'node:fs'
const rows = process.argv.slice(2).flatMap(f => readFileSync(f,'utf8').trim().split('\n').filter(Boolean).map(l=>JSON.parse(l)))
const med = a => { const s=[...a].sort((x,y)=>x-y); return s.length%2 ? s[(s.length-1)/2] : (s[s.length/2-1]+s[s.length/2])/2 }
const key = r => `${r.engine} ${r.cpu}x ${r.net} ${r.cache} ${r.vp}`
const g = new Map()
for (const r of rows) { if (!g.has(key(r))) g.set(key(r), []); g.get(key(r)).push(r) }
console.log('regime'.padEnd(34), 'ready'.padStart(8), 'FCP'.padStart(7), 'TBT'.padStart(7), 'long@ready'.padStart(10), 'n', ' (tainted)')
for (const [k, v] of g) {
  const clean = v.filter(r => !r.tainted && r.readyOk)
  const use = clean.length ? clean : v
  const ready = use.map(r => r.ready)
  const fcp = use.map(r => (r.paints.find(p=>p.n==='first-contentful-paint')||{t:0}).t)
  const tbt = use.map(r => r.longtasks.filter(t=>t.s < r.ready).reduce((a,t)=>a+Math.max(0,t.d-50),0))
  const nlong = use.map(r => r.longtasks.filter(t=>t.s < r.ready).length)
  console.log(k.padEnd(34), med(ready).toFixed(1).padStart(8), med(fcp).toFixed(1).padStart(7), med(tbt).toFixed(1).padStart(7), med(nlong).toFixed(0).padStart(10), String(use.length).padStart(2), v.length-clean.length)
}
