// critic: G-LIVE-22's clearance arithmetic applied to the RESIDENT ring d of the served tree, plus the
// HEAD recipe identity and the wander actually present, per board size, both engines.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { wobbleRect } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/index.js";
const mint = (sub) => { const n = sub*sub; let cells = ""; for (let r=0;r<n;r++) for (let c=0;c<n;c++){ const i=r*n+c; const v=((r*sub+Math.floor(r/sub)+c)%n)+1; cells += ((i>1&&(r*7+c*3)%5<2)?v:0).toString(36);} return Buffer.from(String.fromCharCode(1)+`${sub}.${cells}`,"latin1").toString("base64url"); };
const r3 = (x) => Math.round(x*1000)/1000;
const clearance = (d, m, box, stroke) => { let w = Infinity; for (const g of d.matchAll(/[ML]\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)) { const x = m[2]+m[0]*+g[1], y = m[3]+m[1]*+g[2], hs = (stroke/2)*m[0]; w = Math.min(w, x-hs-box[0], box[0]+box[2]-(x+hs), y-hs-box[1], box[1]+box[3]-(y+hs)); } return w; };
// max perpendicular excursion of a vertex from the nearest side of its own nominal square [x0,x0+s]
const wander = (d, x0, y0, s) => { let w = 0; for (const g of d.matchAll(/[ML]\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)) { const x=+g[1], y=+g[2]; const dx = Math.min(Math.abs(x-x0), Math.abs(x-x0-s)), dy = Math.min(Math.abs(y-y0), Math.abs(y-y0-s)); w = Math.max(w, Math.min(dx, dy)); } return w; };
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  for (const url of process.argv.slice(2)) for (const sub of [4, 3, 2]) {
    const N = sub*sub; const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
    await p.goto(`${url}/?size=${sub}&board=${mint(sub)}`);
    for (let t = 0; t < 120; t++) { if ((await p.evaluate(() => document.querySelectorAll(".board-shell .game-cell").length)) === N) break; await p.waitForTimeout(500); }
    await p.waitForTimeout(600);
    const cells = await p.evaluate(() => [...document.querySelectorAll(".board-shell .game-cell")].map((cell) => { const q = cell.querySelector(".cell-ghost-path"); const m = q.getScreenCTM(); const r = cell.getBoundingClientRect(); return { d: q.getAttribute("d"), m: [m.a, m.d, m.e, m.f], box: [r.x, r.y, r.width, r.height] }; }));
    const cs = 1000/N;
    const head = (pos) => wobbleRect((pos%N)*cs, Math.floor(pos/N)*cs, cs, cs, { roughness: 0.4, segments: N >= 16 ? 2 : 4, seed: 42+500+pos*7, jagged: true });
    const graft = (pos, f) => { const s=f*cs, pad=((1-f)/2)*cs; return wobbleRect((pos%N)*cs+pad, Math.floor(pos/N)*cs+pad, s, s, { roughness: 5.4/(0.015*s), segments: 4, seed: 42+500+pos*7, jagged: true }); };
    const headId = cells.filter((c, pos) => c.d === head(pos)).length, graftId = cells.filter((c, pos) => c.d === graft(pos, 0.86)).length;
    const cl = (stroke, fn) => r3(Math.min(...cells.map((c, pos) => clearance(fn(pos, c), c.m, c.box, stroke))));
    const res = (pos, c) => c.d, hd = (pos) => head(pos), g1 = (pos) => graft(pos, 1);
    const inset = headId === N*N ? 1 : 0.86;
    const wd = Math.max(...cells.map((c, pos) => { const s = inset*cs, pad = ((1-inset)/2)*cs; return wander(c.d, (pos%N)*cs+pad, Math.floor(pos/N)*cs+pad, s); }));
    console.log(`${name} ${url} ${N}x${N}: headId ${headId}/${N*N} graftId ${graftId}/${N*N} · resident clearance s7 ${cl(7,res)} s10 ${cl(10,res)} px · HEAD recipe s10 ${cl(10,hd)} · graft-wander@f1 s10 ${cl(10,g1)} · resident max wander ${r3(wd)} u = ${r3(wd*cells[0].m[0])} px (ghost ${r3(cells[0].m[0])} px/u, cell ${r3(cells[0].box[2])} px)`);
    await p.close();
  }
  await b.close();
}
