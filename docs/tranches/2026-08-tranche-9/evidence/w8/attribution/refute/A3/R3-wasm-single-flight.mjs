// run: node R3-wasm-single-flight.mjs --port 4258 --cpu 4 --windows 3
// REFUTER A3 / lens 3, magnitude. The lane bills the duplicate wasm fetch at 716.1 ms — the
// SECOND response's responseStart→responseEnd. But the two fetches are issued ~35 ms apart and
// share one emulated 1.6 Mbps link, so each inflates the other; 716.1 is a self-contention
// figure, not the removable time. This measures the counterfactual directly: the same wasm URL
// fetched ONCE over the same emulated link from an empty cache, and the same URL fetched TWICE
// concurrently, each on a fresh context. The removable cost is (two-fetch window) − (one-fetch window).
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
    N = +g("windows", "3"),
    OUT = g("out", "r3-single-flight.jsonl");
const ORIGIN = `http://127.0.0.1:${PORT}`;
const WASM = "/assets/csp_solver_wasm_bg-BJYevEYE.wasm";

const out = fs.createWriteStream(OUT, { flags: "a" });
const br = await chromium.launch();
for (const mode of ["one", "two"]) {
    for (let w = 0; w < N; w++) {
        const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } });
        const page = await ctx.newPage();
        const cdp = await ctx.newCDPSession(page);
        await cdp.send("Network.enable");
        if (CPU > 1)
            await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
        await cdp.send("Network.emulateNetworkConditions", {
            offline: false,
            latency: 150,
            downloadThroughput: (1.6 * 1024 * 1024) / 8,
            uploadThroughput: (750 * 1024) / 8,
        });
        // a blank same-origin document so the fetch is same-origin and the cache is this context's
        await page.goto(`${ORIGIN}/favicon.svg`, { waitUntil: "load" });
        const r = await page.evaluate(
            async ([url, n]) => {
                const t0 = performance.now();
                const ps = [];
                for (let i = 0; i < n; i++) {
                    ps.push(fetch(url, { cache: "no-store" }).then((r) => r.arrayBuffer()));
                    if (i + 1 < n) await new Promise((res) => setTimeout(res, 35));
                }
                const bufs = await Promise.all(ps);
                return {
                    windowMs: +(performance.now() - t0).toFixed(1),
                    bytes: bufs.map((b) => b.byteLength),
                    entries: performance
                        .getEntriesByType("resource")
                        .filter((e) => e.name.endsWith(".wasm"))
                        .map((e) => ({
                            s: +e.startTime.toFixed(1),
                            rs: +e.responseStart.toFixed(1),
                            e: +e.responseEnd.toFixed(1),
                            t: e.transferSize,
                            enc: e.encodedBodySize,
                            dec: e.decodedBodySize,
                        })),
                };
            },
            [WASM, mode === "one" ? 1 : 2],
        );
        out.write(JSON.stringify({ probe: "single-flight", mode, cpu: CPU, win: w, ...r }) + "\n");
        console.log(
            `${mode} w${w}: windowMs=${r.windowMs} enc=${r.entries.map((e) => e.enc)} bodyMs=${r.entries.map((e) => +(e.e - e.rs).toFixed(1))}`,
        );
        await ctx.close();
    }
}
await br.close();
out.end();
