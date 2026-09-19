// run: node C04-interleave.mjs --base 4254 --cured 4255 --cpu 4 --net fast3g --windows 5 --out ../raw/head.jsonl
//
// THE BANKED INSTRUMENT, POINTED AT TWO PORTS. Derived from
// `attribution/A3/A3-truecold-probe.mjs` (the true-first-visit probe: a fresh context, HTTP
// cache ENABLED but empty, ONE navigation) with the wasm/worker request census lifted verbatim
// from `attribution/A3/A3-wasm-probe.mjs`. WHAT I CHANGED, exactly:
//   1. two ports instead of one, and the windows INTERLEAVED b,c,b,c,… inside one browser so
//      host drift cancels across the arms;
//   2. the `ctx.on("request")` census from A3-wasm-probe.mjs added to the truecold probe, so
//      one window yields both `tGivens` and the wasm request count (the two lanes read them in
//      two separate scripts);
//   3. `createRequire` points at the WORKTREE's package.json (the playwright install is the
//      symlinked node_modules; same version);
//   4. the per-window record carries `arm` and `port`.
// The INIT script — board-ready, tCells/tGivens, the toBlob bake counter — is byte-identical to
// A3-truecold-probe.mjs's. No mark's definition moved.
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-wasm/web/frontend/package.json",
);
const { chromium, webkit } = require("playwright");
const a = process.argv.slice(2),
    g = (k, d) => {
        const i = a.indexOf("--" + k);
        return i >= 0 ? a[i + 1] : d;
    };
const BASE = g("base", "4254"),
    CURED = g("cured", "4255"),
    CPU = +g("cpu", "4"),
    NET = g("net", "fast3g"),
    N = +g("windows", "5"),
    ENGINE = g("engine", "chromium"),
    OUT = g("out", "head.jsonl");
const path = "/?game=sudoku&size=3&difficulty=EASY";

const INIT = () => {
    const A = (window.__T = { boardReady: null, tGivens: null, tCells: null, bakes: 0 });
    const tb = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (cb, ...r) {
        return tb.call(
            this,
            (b) => {
                A.bakes++;
                cb(b);
            },
            ...r,
        );
    };
    const tick = () => {
        const bg = document.querySelector(".board-group"),
            c = document.querySelector(".game-cell");
        if (A.tCells === null && c) A.tCells = +performance.now().toFixed(1);
        if (
            A.boardReady === null &&
            bg &&
            (bg.offsetWidth || bg.offsetHeight || bg.getClientRects().length) &&
            c
        ) {
            const r = c.getBoundingClientRect();
            if (r.width > 0 && r.height > 0)
                requestAnimationFrame(() => {
                    A.boardReady = +performance.now().toFixed(1);
                });
        }
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
const br = await (ENGINE === "webkit" ? webkit : chromium).launch();
for (let w = 0; w < N; w++) {
    for (const arm of ["base", "cured"]) {
        const port = arm === "base" ? BASE : CURED;
        const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } });
        await ctx.addInitScript(INIT);
        const reqs = [];
        ctx.on("request", (r) => reqs.push(r.url()));
        const page = await ctx.newPage();
        if (ENGINE === "chromium") {
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
        }
        await page.goto(`http://127.0.0.1:${port}${path}`, {
            waitUntil: "load",
            timeout: 90000,
        });
        await page
            .waitForFunction(() => window.__T && window.__T.tGivens !== null, { timeout: 60000 })
            .catch(() => {});
        await page.waitForTimeout(3000);
        const m = await page.evaluate(() => ({ ...window.__T }));
        const rec = {
            arm,
            port,
            engine: ENGINE,
            cpu: ENGINE === "webkit" ? 1 : CPU,
            net: ENGINE === "webkit" ? "none" : NET,
            dpr: 1,
            viewport: "1280x800",
            cache: "true-first-visit",
            win: w,
            boardReady: m.boardReady,
            tCells: m.tCells,
            tGivens: m.tGivens,
            gap:
                m.tGivens !== null && m.tCells !== null
                    ? +(m.tGivens - m.tCells).toFixed(1)
                    : null,
            bakes: m.bakes,
            wasmReqs: reqs.filter((u) => u.endsWith(".wasm")).length,
            workerJsReqs: reqs.filter((u) => /solver\.worker-/.test(u)).length,
        };
        out.write(JSON.stringify(rec) + "\n");
        console.log(
            `w${w} ${arm}: ready=${rec.boardReady} cells=${rec.tCells} givens=${rec.tGivens} gap=${rec.gap} wasmReqs=${rec.wasmReqs} workerJs=${rec.workerJsReqs} bakes=${rec.bakes}`,
        );
        await ctx.close();
    }
}
await br.close();
out.end();
