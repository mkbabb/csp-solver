import { createRequire } from "node:module";
const req = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/web/frontend/package.json");
const { chromium } = req("playwright");
const b = await chromium.launch(); const p = await b.newPage();
await p.goto("http://127.0.0.1:4241/?size=3&difficulty=EASY&wire=local", { waitUntil: "load" });
await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
const r = await p.evaluate(async () => {
  const m = await import(/* @vite-ignore */ "/src/games/shared/playerIdentity.ts");
  const cs = [], hs = [];
  for (let i = 0; i < 144; i++) {
    const s = m.inkFor(i)["--color-user-ink"];
    const mm = /oklch\(var\(--peer-ink-l\)\s+([\d.]+)\s+([\d.]+)deg\)/.exec(s);
    cs.push(+mm[1]); hs.push(+mm[2]);
  }
  const sorted = [...cs].sort((a,b)=>a-b);
  const first8 = cs.slice(0,8);
  const hsort = [...hs].sort((a,b)=>a-b);
  let minGap = Infinity, at = -1;
  for (let i=1;i<hsort.length;i++) if (hsort[i]-hsort[i-1] < minGap) { minGap = hsort[i]-hsort[i-1]; at = i; }
  return { min: sorted[0], max: sorted[143], median: sorted[72], mean: cs.reduce((a,b)=>a+b)/144,
    atCap: cs.filter(c=>c>=0.215).length, first8, minHueGapOver144: minGap,
    dupHues: hs.length - new Set(hs).size, RESERVED: m.RESERVED_ARCS };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
