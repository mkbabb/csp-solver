import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch(); const p = await b.newPage();
  const room = `segs-${Date.now()}`;
  await p.goto(`http://127.0.0.1:4242/?size=3&difficulty=EASY&wire=local&s=${room}`);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await p.evaluate((room) => { const ch = new BroadcastChannel(`board:${room}`); ch.postMessage({ kind: "hi", data: {}, from: "seg-a" }); setTimeout(() => ch.close(), 0); }, room);
  await p.waitForFunction(() => document.querySelector("[data-player-mark]")?.getAttribute("aria-label") === "2 players");
  const r = await p.evaluate(() => {
    const seg = (d) => ({ cmds: (d.match(/[a-zA-Z]/g) || []).length - (d.match(/[Mm]/g) || []).length, subpaths: (d.match(/[Mm]/g) || []).length });
    const mark = document.querySelector("[data-player-mark] .pt-pose path");
    const row = document.querySelector("[data-lobby] .pl-stub path");
    const dt = [...document.querySelectorAll(".dt-pose .dt-stroke")].slice(0, 5).map((e) => seg(e.getAttribute("d")));
    return { tallyStroke: seg(mark.getAttribute("d")), rowStroke: seg(row.getAttribute("d")), difficultyTally: dt };
  });
  console.log(name, JSON.stringify(r));
  await b.close();
}
