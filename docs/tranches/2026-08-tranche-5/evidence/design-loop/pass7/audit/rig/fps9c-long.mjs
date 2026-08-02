import fs from 'node:fs';
const dir='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/logs/measure';
const SC=['idle3s','deal','solveCelebration','galleryGlide','themeToggle'];
const read=(arm)=>{const o={};for(const s of SC)o[s]=[];
  for(let r=1;r<=5;r++)for(const l of fs.readFileSync(`${dir}/m4-bat-${arm}-r${r}.jsonl`,'utf8').trim().split('\n')){const j=JSON.parse(l);if(j.kind!=='env'&&SC.includes(j.scenario))o[j.scenario].push(j);}
  return o;};
const B=read('base'),H=read('head');
console.log('LONG50 (>50ms) per round r1..r5:');
for(const s of SC) console.log(`  ${s.padEnd(18)} head ${H[s].map(x=>x.long50).join(',')}   base ${B[s].map(x=>x.long50).join(',')}`);
console.log('');
console.log('LONG33 (>33ms) per round r1..r5:');
for(const s of SC) console.log(`  ${s.padEnd(18)} head ${H[s].map(x=>x.long33).join(',')}   base ${B[s].map(x=>x.long33).join(',')}`);
console.log('');
console.log('focusEvents head:', SC.map(s=>`${s}=${H[s].map(x=>x.focusEvents).join('')}`).join(' '));
