// run: node A3-wasm-probe.mjs --port 4254 --cpu 4 --net fast3g --windows 3 --out wasm-raw.jsonl
// The wasm layer, cold vs warm. The module is fetched and compiled INSIDE the solver worker, which no
// page-side init script can reach, so compile time is NOT MEASURED directly. What IS measured:
//   wasmReq→wasmFin (context-level request events)  ·  responseStart→responseEnd (body off the wire vs cache)
//   tGivens = performance.now() when the first .game-cell carries text — the first milestone that
//             cannot happen until the wasm module is compiled and has answered.
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-wasm/web/frontend/package.json",
);
const { chromium } = require("playwright");
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf("--" + k); return i >= 0 ? argv[i + 1] : d; };
const PORT = arg("port", "4254"), CPU = Number(arg("cpu", "4")), NET = arg("net", "fast3g");
const WINDOWS = Number(arg("windows", "3")), OUT = arg("out", "wasm-raw.jsonl");
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;

const INIT = () => {
    const A = (window.__W = { tGivens: null, tCells: null });
    const tick = () => {
        if (A.tCells === null && document.querySelector(".game-cell")) A.tCells = +performance.now().toFixed(1);
        if (A.tGivens === null) {
            for (const c of document.querySelectorAll(".game-cell")) {
                const t = (c.textContent || "").trim() || (c.querySelector("input") || {}).value || "";
                if (t) { A.tGivens = +performance.now().toFixed(1); break; }
            }
        }
        if (A.tGivens === null) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
};

const out = fs.createWriteStream(OUT, { flags: "a" });
const browser = await chromium.launch();
for (let w = 0; w < WINDOWS; w++) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript(INIT);
    const log = [];
    ctx.on("request", (r) => log.push({ ev: "req", t: Date.now(), u: r.url() }));
    ctx.on("requestfinished", (r) => { let tm = null; try { tm = r.timing(); } catch {} log.push({ ev: "fin", t: Date.now(), u: r.url(), tm }); });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
    if (NET === "fast3g") await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    for (const kind of ["cold", "primer", "warm"]) {
        await cdp.send("Network.setCacheDisabled", { cacheDisabled: kind === "cold" });
        const n0 = log.length, t0 = Date.now();
        await page.goto(kind === "cold" ? URL_ : URL_ + "&_n=" + kind, { waitUntil: "load", timeout: 60000 });
        await page.waitForFunction(() => window.__W && window.__W.tGivens !== null, { timeout: 45000 }).catch(() => {});
        await page.waitForTimeout(2000);
        const m = await page.evaluate(() => ({ ...window.__W }));
        const wasm = log.slice(n0).filter((x) => x.u.endsWith(".wasm"));
        const rec = {
            cpu: CPU, net: NET, win: w, kind, ...m,
            wasmReqCount: wasm.filter((x) => x.ev === "req").length,
            wasmReqAtWall: wasm.filter((x) => x.ev === "req").map((x) => x.t - t0),
            wasmFin: wasm.filter((x) => x.ev === "fin").map((x) => ({ wall: x.t - t0, reqStart: x.tm && +x.tm.requestStart.toFixed(1), respStart: x.tm && +x.tm.responseStart.toFixed(1), respEnd: x.tm && +x.tm.responseEnd.toFixed(1) })),
            workerJsReqs: log.slice(n0).filter((x) => x.ev === "req" && /solver\.worker-/.test(x.u)).length,
        };
        out.write(JSON.stringify(rec) + "\n");
        console.log(`w${w} ${kind}: tCells=${m.tCells} tGivens=${m.tGivens} wasmReqs=${rec.wasmReqCount}@${rec.wasmReqAtWall} fin=${JSON.stringify(rec.wasmFin)} workerJs=${rec.workerJsReqs}`);
    }
    await ctx.close();
}
await browser.close();
out.end();
