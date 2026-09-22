import fs from "node:fs"; import path from "node:path";
const ROOT = process.argv[2];
const files = []; (function walk(d){ for (const e of fs.readdirSync(d,{withFileTypes:true})) { const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(p.endsWith(".vue")) files.push(p);} })(path.join(ROOT,"src"));
const SFC = new Map(files.map(f=>[path.basename(f,".vue"), fs.readFileSync(f,"utf8")]));
const paints=(tag,prop)=>{const s=SFC.get(tag); if(!s) return false; const t=/<template>([\s\S]*)<\/template>/.exec(s)?.[1]??""; return new RegExp(`\\{\\{[^}]*\\b${prop}\\b`).test(t)||new RegExp(`v-text="[^"]*\\b${prop}\\b`).test(t);};
const camel=s=>s.replace(/-(\w)/g,(_,c)=>c.toUpperCase());
let naive=new Set(), aware=new Set();
for (const f of files){ const text=fs.readFileSync(f,"utf8"); const rel=path.relative(ROOT,f);
  for (const m of text.matchAll(/<([A-Z]\w*)\b[^<>]*?\/?>/g)) for (const b of m[0].matchAll(/(?::|v-bind:)([\w-]+)="([^"]*)"/g)) if(paints(m[1],b[1])) naive.add(`${rel} <${m[1]} :${b[1]}>`);
  // quote-aware tag scan
  const re=/<([A-Z]\w*)\b/g; let m; while((m=re.exec(text))){ let i=m.index+m[0].length, q=null; for(;i<text.length;i++){const c=text[i]; if(q){ if(c===q) q=null;} else if(c==='"'||c==="'") q=c; else if(c==='>') break;} const tagText=text.slice(m.index,i+1);
    for (const b of tagText.matchAll(/(?::|v-bind:)([\w-]+)="([^"]*)"/g)) { const p=b[1]; if(paints(m[1],p)||paints(m[1],camel(p))) aware.add(`${rel} <${m[1]} :${p}>`);} }
}
console.log("naive", naive.size, "aware", aware.size); for (const k of aware) if(!naive.has(k)) console.log("MISSED BY GATE:",k);
