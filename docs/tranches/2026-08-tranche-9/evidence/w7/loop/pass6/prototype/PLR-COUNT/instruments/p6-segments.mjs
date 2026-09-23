// PLR-COUNT pass 6 — p5-segments.mjs re-cut: the DifficultyTally read WAITS for its strokes (pass 5 read WebKit
// before it rendered) and reports n/N; every tally stroke of the mark and the row read, not the first.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const room = `segs6-${Date.now()}`;
  await p.goto(`http://127.0.0.1:4242/?size=3&difficulty=EASY&wire=local&s=${room}`);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await p.evaluate((room) => { const ch = new BroadcastChannel(`board:${room}`); for (const f of ["seg-a", "seg-b"]) ch.postMessage({ kind: "hi", data: {}, from: f }); setTimeout(() => ch.close(), 0); }, room);
  await p.waitForFunction(() => [...document.querySelectorAll("[data-player-mark]")].some((m) => m.getAttribute("aria-label") === "3 players"), null, { timeout: 30000 });
  let dtN = 0; const t0 = Date.now();
  while (Date.now() - t0 < 30000) { dtN = await p.evaluate(() => document.querySelectorAll(".dt-pose .dt-stroke").length); if (dtN >= 5) break; await p.waitForTimeout(250); }
  const r = await p.evaluate(() => {
    const seg = (d) => ({ cmds: (d.match(/[a-zA-Z]/g) || []).length - (d.match(/[Mm]/g) || []).length, subpaths: (d.match(/[Mm]/g) || []).length });
    const uniq = (xs) => [...new Set(xs.map((x) => JSON.stringify(x)))];
    const mark = [...document.querySelectorAll("[data-player-mark] .pt-pose path")].map((e) => seg(e.getAttribute("d")));
    const row = [...document.querySelectorAll("[data-lobby] .pl-stub path")].map((e) => seg(e.getAttribute("d")));
    const dtAll = [...document.querySelectorAll(".dt-pose .dt-stroke")];
    const dt = dtAll.slice(0, 5).map((e) => seg(e.getAttribute("d")));
    return { markPaths: mark.length, mark: uniq(mark), rowPaths: row.length, row: uniq(row), dtPaths: dtAll.length, dtFirstPose: dt };
  });
  console.log(name, JSON.stringify(r));
  await b.close();
}
