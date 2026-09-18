/** usage: node rect-diff.mjs <dirA> <dirB> */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [, , A, B] = process.argv;
let worst = 0;
for (const f of readdirSync(A).filter((f) => f.endsWith('.json')).sort()) {
  const a = JSON.parse(readFileSync(join(A, f), 'utf8'));
  const b = JSON.parse(readFileSync(join(B, f), 'utf8'));
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let max = 0;
  let where = '';
  const onlyA = [];
  const onlyB = [];
  for (const k of keys) {
    if (!(k in a)) { onlyB.push(k); continue; }
    if (!(k in b)) { onlyA.push(k); continue; }
    for (let i = 0; i < 4; i++) {
      const d = Math.abs(a[k][i] - b[k][i]);
      if (d > max) { max = d; where = `${k}[${'xywh'[i]}] ${a[k][i]} -> ${b[k][i]}`; }
    }
  }
  worst = Math.max(worst, max);
  console.log(
    `${f}: rects ${Object.keys(a).length}/${Object.keys(b).length}  max|d| ${max.toFixed(2)}px` +
      (max ? `  @ ${where}` : '') +
      (onlyA.length || onlyB.length ? `  ONLY-A ${onlyA.length} ONLY-B ${onlyB.length}` : ''),
  );
  for (const k of onlyA.slice(0, 5)) console.log(`   only in A: ${k}`);
  for (const k of onlyB.slice(0, 5)) console.log(`   only in B: ${k}`);
}
console.log(`WORST max|d| across all surfaces: ${worst.toFixed(2)}px`);
