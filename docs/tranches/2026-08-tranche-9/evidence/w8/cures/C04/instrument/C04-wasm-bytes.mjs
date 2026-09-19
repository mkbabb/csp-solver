// run: node C04-wasm-bytes.mjs --base 4254 --cured 4255 --cpu 4 --net fast3g --windows 3 --out ../raw/bytes.jsonl
//
// THE COUNTERFACTUAL'S ASSUMPTION, READ OFF THE PAGE. `refute/A3/R3-wasm-single-flight.mjs`
// prices the duplicate flight by fetching the same URL twice with `cache: "no-store"`, which
// forbids the HTTP cache from joining the second request to the first. This reads what the
// PAGE actually does: `performance.getEntriesByType('resource')` for the `.wasm`, per arm —
// `transferSize` per entry and the wall window of the flight. Two entries that share one
// transfer bill the bytes once and end at the same instant.
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
    OUT = g("out", "bytes.jsonl");
const path = "/?game=sudoku&size=3&difficulty=EASY";

const out = fs.createWriteStream(OUT, { flags: "a" });
const br = await chromium.launch();
for (let w = 0; w < N; w++) {
    for (const arm of ["base", "cured"]) {
        const port = arm === "base" ? BASE : CURED;
        const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } });
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
        await page.waitForTimeout(8000);
        const r = await page.evaluate(() => {
            const all = performance.getEntriesByType("resource");
            const wasm = all
                .filter((e) => e.name.endsWith(".wasm"))
                .map((e) => ({
                    s: +e.startTime.toFixed(1),
                    rs: +e.responseStart.toFixed(1),
                    e: +e.responseEnd.toFixed(1),
                    transfer: e.transferSize,
                    enc: e.encodedBodySize,
                }));
            return {
                wasm,
                wasmTransfer: wasm.reduce((x, y) => x + y.transfer, 0),
                pageTransfer: all.reduce((x, y) => x + y.transferSize, 0),
                reqCount: all.length,
            };
        });
        out.write(
            JSON.stringify({
                arm,
                port,
                engine: "chromium",
                cpu: CPU,
                net: NET,
                dpr: 1,
                viewport: "1280x800",
                cache: "true-first-visit",
                win: w,
                ...r,
            }) + "\n",
        );
        console.log(
            `w${w} ${arm}: wasm entries=${r.wasm.length} transfer=${r.wasmTransfer} enc=${r.wasm.map((x) => x.enc)} window=${r.wasm.map((x) => [x.s, x.e])} pageTransfer=${r.pageTransfer} reqs=${r.reqCount}`,
        );
        await ctx.close();
    }
}
await br.close();
out.end();
