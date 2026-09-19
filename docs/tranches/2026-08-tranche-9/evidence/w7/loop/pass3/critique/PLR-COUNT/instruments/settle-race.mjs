/** Does a DEPARTURE during someone else's draw-in un-draw the newcomer?
 *  `settle()` writes reveal=1 but does NOT stop that key's tween, and the watch's
 *  `else settle(now)` branch runs on a bare departure. Read the offsets, don't argue. */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend/package.json");
const { chromium, webkit } = require("playwright");
const BASE = "http://127.0.0.1:4238";
const out = {};
for (const [name, bt] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await bt.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "light" });
  const p = await ctx.newPage();
  const room = `race-${name}-${Date.now()}`;
  await p.goto(`${BASE}/?size=3&difficulty=EASY&wire=local&s=${room}`);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await p.waitForTimeout(1500);
  const say = (msgs) => p.evaluate(({ room, msgs }) => {
    const w = window; w.__ch ??= new BroadcastChannel(`board:${room}`);
    for (const m of msgs) w.__ch.postMessage({ kind: m.kind, data: {}, from: m.from });
  }, { room, msgs });
  const offs = () => p.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find((e) => e.getBoundingClientRect().width > 0);
    const pose = m?.querySelector(".pt-pose");
    return pose ? [...pose.querySelectorAll("path")].map((x) => x.getAttribute("stroke-dashoffset")) : [];
  });
  // three people settled
  await say([{ kind: "hi", from: "r0" }, { kind: "hi", from: "r1" }]);
  await p.waitForTimeout(900);
  out[name] = { settledStart: await offs() };
  // a newcomer starts drawing; 80ms later someone ELSE leaves (no fresh id in that tick)
  await say([{ kind: "hi", from: "r2" }]);
  await p.waitForTimeout(80);
  const midA = await offs();
  await say([{ kind: "bye", from: "r0" }]);
  const trace = [];
  for (let i = 0; i < 8; i++) { await p.waitForTimeout(40); trace.push(await offs()); }
  await p.waitForTimeout(900);
  out[name].midDrawBeforeBye = midA;
  out[name].traceAfterBye = trace;
  out[name].final = await offs();
  // ALSO: 6 -> 5 where the LEAVER IS INSIDE the tallied five (the gate tests the 6th leaving)
  const room2 = `race2-${name}-${Date.now()}`;
  await p.goto(`${BASE}/?size=3&difficulty=EASY&wire=local&s=${room2}`);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await p.waitForTimeout(1500);
  const say2 = (msgs) => p.evaluate(({ room, msgs }) => {
    const w = window; w.__ch ??= new BroadcastChannel(`board:${room}`);
    for (const m of msgs) w.__ch.postMessage({ kind: m.kind, data: {}, from: m.from });
  }, { room: room2, msgs });
  await say2(["q0","q1","q2","q3","q4"].map((f) => ({ kind: "hi", from: f })));
  await p.waitForTimeout(1000);
  const six = await p.evaluate(() => document.querySelector(".pt-count")?.textContent);
  await say2([{ kind: "bye", from: "q1" }]); // q1 is INSIDE the first five
  const t2 = [];
  for (let i = 0; i < 6; i++) { await p.waitForTimeout(70); t2.push(await offs()); }
  out[name].sixToFive_innerLeaver = { wrote: six, trace: t2 };
  await b.close();
}
writeFileSync(process.env.OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
