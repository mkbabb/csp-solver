// run: node C04-wasm-when.mjs --base 4254 --cured 4255 --cpu 4 --net fast3g --windows 3 --out ../raw/when.jsonl
//
// WHY, not whether. The census half of `attribution/A3/A3-wasm-probe.mjs` (request/finish wall
// offsets + `request.timing()`) pointed at the two arms, interleaved, so the two flights can be
// placed against `tGivens` on the same window. Nothing else added: same navigation, same
// throttle, same true-first-visit context.
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-wasm/web/frontend/package.json",
);
const { chromium } = require("playwright");
const a = process.argv.slice(2),
    g = (k, d) => {
        const i = a.indexOf("--" + k);
        return i >= 0 ? a[i + 1] : d;
    };
const BASE = g("base", "4254"),
    CURED = g("cured", "4255"),
    CPU = +g("cpu", "4"),
    NET = g("net", "fast3g"),
    N = +g("windows", "3"),
    OUT = g("out", "when.jsonl");
const path = "/?game=sudoku&size=3&difficulty=EASY";

const INIT = () => {
    const A = (window.__T = { tGivens: null, tCells: null });
    const tick = () => {
        const c = document.querySelector(".game-cell");
        if (A.tCells === null && c) A.tCells = +performance.now().toFixed(1);
        if (A.tGivens === null)
            for (const x of document.querySelectorAll(".game-cell")) {
                const t =
                    (x.textContent || "").trim() || (x.querySelector("input") || {}).value || "";
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
    for (const arm of ["base", "cured"]) {
        const port = arm === "base" ? BASE : CURED;
        const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } });
        await ctx.addInitScript(INIT);
        const log = [];
        const t0 = Date.now();
        ctx.on("request", (r) => log.push({ ev: "req", t: Date.now() - t0, u: r.url() }));
        ctx.on("requestfinished", (r) => {
            let tm = null;
            try {
                tm = r.timing();
            } catch {}
            log.push({ ev: "fin", t: Date.now() - t0, u: r.url(), tm });
        });
        const page = await ctx.newPage();
        const cdp = await ctx.newCDPSession(page);
        await cdp.send("Network.enable");
        if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
        if (NET === "fast3g")
            await cdp.send("Network.emulateNetworkConditions", {
                offline: false,
                latency: 150,
                downloadThroughput: (1.6 * 1024 * 1024) / 8,
                uploadThroughput: (750 * 1024) / 8,
            });
        await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: "load", timeout: 90000 });
        await page
            .waitForFunction(() => window.__T && window.__T.tGivens !== null, { timeout: 60000 })
            .catch(() => {});
        await page.waitForTimeout(4000);
        const m = await page.evaluate(() => ({ ...window.__T }));
        const wasm = log.filter((x) => x.u.endsWith(".wasm"));
        const workerJs = log.filter((x) => /solver\.worker-/.test(x.u) && x.ev === "req");
        const rec = {
            arm,
            port,
            engine: "chromium",
            cpu: CPU,
            net: NET,
            dpr: 1,
            viewport: "1280x800",
            cache: "true-first-visit",
            win: w,
            tCells: m.tCells,
            tGivens: m.tGivens,
            wasmReqAt: wasm.filter((x) => x.ev === "req").map((x) => x.t),
            wasmFinAt: wasm.filter((x) => x.ev === "fin").map((x) => x.t),
            wasmBodyMs: wasm
                .filter((x) => x.ev === "fin" && x.tm)
                .map((x) => +(x.tm.responseEnd - x.tm.responseStart).toFixed(1)),
            workerJsReqAt: workerJs.map((x) => x.t),
        };
        out.write(JSON.stringify(rec) + "\n");
        console.log(
            `w${w} ${arm}: cells=${rec.tCells} givens=${rec.tGivens} wasmReq@${rec.wasmReqAt} fin@${rec.wasmFinAt} body=${rec.wasmBodyMs} workerJs@${rec.workerJsReqAt}`,
        );
        await ctx.close();
    }
}
await br.close();
out.end();
