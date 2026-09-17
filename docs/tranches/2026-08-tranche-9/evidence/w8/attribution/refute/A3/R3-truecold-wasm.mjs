// run: node R3-truecold-wasm.mjs --port 4258 --cpu 4 --net fast3g --windows 3 --out r3-truecold-wasm.jsonl
// REFUTER A3 / lens 1+3. The lane's A3-wasm-probe.mjs takes its cold reading under CDP
// Network.setCacheDisabled = LOAD_BYPASS_CACHE: reads bypassed, responses still STORED.
// A URL the page requests TWICE inside one load therefore pays the wire twice under CDP and
// once in life. The lane applied exactly this correction to the fraunces font and did NOT
// apply it to the wasm. This probe is the missing control: fresh context, HTTP cache ENABLED
// but EMPTY, ONE navigation. Counts wasm requests and, per request, responseStart→responseEnd
// (wire body) — a cache hit reads ~0 ms.
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
);
const { chromium } = require("playwright");
const a = process.argv.slice(2),
    g = (k, d) => {
        const i = a.indexOf("--" + k);
        return i >= 0 ? a[i + 1] : d;
    };
const PORT = g("port", "4258"),
    CPU = +g("cpu", "4"),
    NET = g("net", "fast3g"),
    N = +g("windows", "3"),
    OUT = g("out", "r3-truecold-wasm.jsonl");
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;

const INIT = () => {
    const A = (window.__R3 = { boardReady: null, tCells: null, tGivens: null });
    const vis = (el) =>
        !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    const tick = () => {
        const bg = document.querySelector(".board-group");
        const c = document.querySelector(".game-cell");
        if (A.tCells === null && c) A.tCells = +performance.now().toFixed(1);
        if (A.boardReady === null && vis(bg) && c) {
            const r = c.getBoundingClientRect();
            if (r.width > 0 && r.height > 0)
                requestAnimationFrame(() => {
                    A.boardReady = +performance.now().toFixed(1);
                });
        }
        if (A.tGivens === null)
            for (const x of document.querySelectorAll(".game-cell")) {
                const t =
                    (x.textContent || "").trim() ||
                    (x.querySelector("input") || {}).value ||
                    "";
                if (t) {
                    A.tGivens = +performance.now().toFixed(1);
                    break;
                }
            }
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
};

const out = fs.createWriteStream(OUT, { flags: "a" });
const br = await chromium.launch();
for (let w = 0; w < N; w++) {
    const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript(INIT);
    const log = [];
    ctx.on("request", (r) => log.push({ ev: "req", t: Date.now(), u: r.url() }));
    ctx.on("requestfinished", (r) => {
        let tm = null;
        try {
            tm = r.timing();
        } catch {}
        log.push({ ev: "fin", t: Date.now(), u: r.url(), tm });
    });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    // NOTE: cache is NOT disabled. Fresh context ⇒ the cache is empty ⇒ a true first visit.
    if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
    if (NET === "fast3g")
        await cdp.send("Network.emulateNetworkConditions", {
            offline: false,
            latency: 150,
            downloadThroughput: (1.6 * 1024 * 1024) / 8,
            uploadThroughput: (750 * 1024) / 8,
        });
    const t0 = Date.now();
    await page.goto(URL_, { waitUntil: "load", timeout: 60000 });
    await page
        .waitForFunction(() => window.__R3 && window.__R3.tGivens !== null, {
            timeout: 45000,
        })
        .catch(() => {});
    await page.waitForTimeout(3000);
    const m = await page.evaluate(() => ({ ...window.__R3 }));
    const wasm = log.filter((x) => x.u.endsWith(".wasm"));
    const rec = {
        probe: "truecold-wasm",
        cpu: CPU,
        net: NET,
        win: w,
        ...m,
        wasmReqCount: wasm.filter((x) => x.ev === "req").length,
        wasmReqAtWall: wasm.filter((x) => x.ev === "req").map((x) => x.t - t0),
        wasmFin: wasm
            .filter((x) => x.ev === "fin")
            .map((x) => ({
                wall: x.t - t0,
                reqStart: x.tm && +x.tm.requestStart.toFixed(1),
                respStart: x.tm && +x.tm.responseStart.toFixed(1),
                respEnd: x.tm && +x.tm.responseEnd.toFixed(1),
                bodyMs: x.tm && +(x.tm.responseEnd - x.tm.responseStart).toFixed(1),
            })),
        workerJsReqs: log.filter(
            (x) => x.ev === "req" && /solver\.worker-/.test(x.u),
        ).length,
    };
    out.write(JSON.stringify(rec) + "\n");
    console.log(
        `w${w} TRUECOLD: boardReady=${m.boardReady} tCells=${m.tCells} tGivens=${m.tGivens} wasmReqs=${rec.wasmReqCount}@${rec.wasmReqAtWall} bodyMs=${JSON.stringify(rec.wasmFin.map((f) => f.bodyMs))} workerJs=${rec.workerJsReqs}`,
    );
    await ctx.close();
}
await br.close();
out.end();
