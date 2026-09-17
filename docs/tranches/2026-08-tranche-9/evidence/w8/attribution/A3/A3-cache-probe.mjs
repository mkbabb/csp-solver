// run: node A3-cache-probe.mjs --port 4254 --engine chromium --cpu 4 --net fast3g --viewport desk --windows 3 --out raw.jsonl
// T9-W8 §8.1 lane A3 — THE CACHE STORY. One context, three navigations: cold (CDP cache disabled)
// → primer (cache enabled, populates) → warm (cache enabled, reads). Reports cold and warm; banks all three.
// Board-ready = .board-group visible AND first .game-cell (the `.cell`-class board cell) rect non-zero AND one rAF after.
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
);
const { chromium, webkit } = require("playwright");

const argv = process.argv.slice(2);
const arg = (k, d) => {
    const i = argv.indexOf("--" + k);
    return i >= 0 ? argv[i + 1] : d;
};
const PORT = arg("port", "4254");
const ENGINE = arg("engine", "chromium");
const CPU = Number(arg("cpu", "1"));
const NET = arg("net", "none"); // none | fast3g
const VP = arg("viewport", "desk"); // desk | mobile
const WINDOWS = Number(arg("windows", "3"));
const OUT = arg("out", "raw.jsonl");
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;

const VIEWPORTS = {
    desk: { viewport: { width: 1280, height: 800 } },
    mobile: {
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: ENGINE === "chromium",
        deviceScaleFactor: 3,
    },
};

// ---- in-page instrument: bakes, fonts, paints, board-ready, pose swaps, taint ----
const INIT = () => {
    const A = (window.__A3 = {
        bakeCount: 0,
        bakeMs: 0,
        bakes: [],
        dataUrlCount: 0,
        dataUrlMs: 0,
        objectUrls: 0,
        firstBakeAt: null,
        lastBakeAt: null,
        boardReady: null,
        fontsReady: null,
        firstPoseSwap: null,
        lcp: null,
        tainted: false,
        longTasks: 0,
        longTaskMs: 0,
    });
    addEventListener("blur", () => (A.tainted = true));
    addEventListener("visibilitychange", () => {
        if (document.hidden) A.tainted = true;
    });

    const tb = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (cb, ...rest) {
        const t0 = performance.now();
        return tb.call(
            this,
            (b) => {
                const t1 = performance.now();
                A.bakeCount++;
                A.bakeMs += t1 - t0;
                A.bakes.push({ at: +t0.toFixed(1), ms: +(t1 - t0).toFixed(2) });
                if (A.firstBakeAt === null) A.firstBakeAt = +t0.toFixed(1);
                A.lastBakeAt = +t1.toFixed(1);
                cb(b);
            },
            ...rest,
        );
    };
    const td = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (...a) {
        const t0 = performance.now();
        const r = td.apply(this, a);
        const t1 = performance.now();
        A.dataUrlCount++;
        A.dataUrlMs += t1 - t0;
        if (A.firstBakeAt === null) A.firstBakeAt = +t0.toFixed(1);
        A.lastBakeAt = +t1.toFixed(1);
        return r;
    };
    const cou = URL.createObjectURL;
    URL.createObjectURL = function (...a) {
        A.objectUrls++;
        return cou.apply(URL, a);
    };

    try {
        new PerformanceObserver((l) => {
            for (const e of l.getEntries()) A.lcp = +e.startTime.toFixed(1);
        }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}
    try {
        if (PerformanceObserver.supportedEntryTypes.includes("longtask")) {
            new PerformanceObserver((l) => {
                for (const e of l.getEntries()) {
                    A.longTasks++;
                    A.longTaskMs += e.duration;
                }
            }).observe({ type: "longtask", buffered: true });
        } else A.longTasks = null;
    } catch {
        A.longTasks = null;
    }

    document.fonts.ready.then(() => (A.fontsReady = +performance.now().toFixed(1)));

    const vis = (el) =>
        !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    const tick = () => {
        if (A.boardReady === null) {
            const bg = document.querySelector(".board-group");
            const cell = document.querySelector(".game-cell");
            if (vis(bg) && cell) {
                const r = cell.getBoundingClientRect();
                if (r.width > 0 && r.height > 0) {
                    requestAnimationFrame(() => {
                        A.boardReady = +performance.now().toFixed(1);
                        A.bakeCountAtReady = A.bakeCount;
                        A.bakeMsAtReady = +A.bakeMs.toFixed(1);
                        A.givensAtReady = document.querySelectorAll(
                            ".game-cell",
                        ).length;
                    });
                    return;
                }
            }
        }
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // first pose-layer swap after board-ready: an <img> whose src is a blob: URL changing attrs
    new MutationObserver((ms) => {
        if (A.firstPoseSwap !== null || A.boardReady === null) return;
        for (const m of ms) {
            const t = m.target;
            if (t && t.tagName === "IMG" && String(t.src || "").startsWith("blob:")) {
                A.firstPoseSwap = +performance.now().toFixed(1);
                return;
            }
        }
    }).observe(document.documentElement, {
        subtree: true,
        attributes: true,
        attributeFilter: ["src", "style", "class"],
    });
};

const NAV_KINDS = ["cold", "primer", "warm"];

async function readPage(page) {
    await page
        .waitForFunction(() => window.__A3 && window.__A3.boardReady !== null, {
            timeout: 45000,
        })
        .catch(() => {});
    await page.waitForTimeout(5000); // let boot bakes and fonts settle
    return page.evaluate(() => {
        const A = window.__A3;
        const nav = performance.getEntriesByType("navigation")[0] || {};
        const paints = Object.fromEntries(
            performance
                .getEntriesByType("paint")
                .map((e) => [e.name, +e.startTime.toFixed(1)]),
        );
        const res = performance.getEntriesByType("resource").map((e) => ({
            n: e.name.split("/").pop().split("?")[0],
            s: +e.startTime.toFixed(1),
            e: +e.responseEnd.toFixed(1),
            t: e.transferSize,
            enc: e.encodedBodySize,
            dec: e.decodedBodySize,
            i: e.initiatorType,
        }));
        const wire = res.filter((r) => !r.n.startsWith("blob:") && r.i !== "blob");
        // Chromium reports transferSize ~300 (header allowance) for an HTTP-cache hit
        const fromCache = wire.filter((r) => r.t <= 300);
        return {
            boardReady: A.boardReady,
            fontsReady: A.fontsReady,
            firstPoseSwap: A.firstPoseSwap,
            lcp: A.lcp,
            paints,
            tainted: A.tainted,
            longTasks: A.longTasks,
            longTaskMs: A.longTaskMs === undefined ? null : +A.longTaskMs.toFixed(1),
            bakeCount: A.bakeCount,
            bakeCountAtReady: A.bakeCountAtReady === undefined ? null : A.bakeCountAtReady,
            bakeMsAtReady: A.bakeMsAtReady === undefined ? null : A.bakeMsAtReady,
            cellsAtReady: A.givensAtReady === undefined ? null : A.givensAtReady,
            cellsFinal: document.querySelectorAll(".game-cell").length,
            bakeMs: +A.bakeMs.toFixed(1),
            dataUrlCount: A.dataUrlCount,
            dataUrlMs: +A.dataUrlMs.toFixed(1),
            objectUrls: A.objectUrls,
            firstBakeAt: A.firstBakeAt,
            lastBakeAt: A.lastBakeAt,
            dcl: +(nav.domContentLoadedEventEnd || 0).toFixed(1),
            load: +(nav.loadEventEnd || 0).toFixed(1),
            reqCount: wire.length,
            reqBytes: wire.reduce((a, r) => a + r.t, 0),
            encBytes: wire.reduce((a, r) => a + r.enc, 0),
            cacheHits: fromCache.length,
            cacheHitNames: fromCache.map((r) => r.n),
            swRegs: null,
            resources: res,
        };
    });
}

const out = fs.createWriteStream(OUT, { flags: "a" });
const engine = ENGINE === "webkit" ? webkit : chromium;
const browser = await engine.launch();

for (let w = 0; w < WINDOWS; w++) {
    const ctx = await browser.newContext(VIEWPORTS[VP]);
    await ctx.addInitScript(INIT);
    // context-level request log catches WORKER-initiated fetches (the wasm) that the
    // page's own resource timeline cannot see.
    const wlog = [];
    ctx.on("request", (r) => wlog.push({ ev: "req", t: Date.now(), u: r.url() }));
    ctx.on("requestfinished", async (r) => {
        let tm = null;
        try {
            tm = r.timing();
        } catch {}
        wlog.push({ ev: "fin", t: Date.now(), u: r.url(), tm });
    });
    const page = await ctx.newPage();
    let cdp = null;
    if (ENGINE === "chromium") {
        cdp = await ctx.newCDPSession(page);
        await cdp.send("Network.enable");
        if (CPU > 1)
            await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
        if (NET === "fast3g")
            await cdp.send("Network.emulateNetworkConditions", {
                offline: false,
                latency: 150,
                downloadThroughput: (1.6 * 1024 * 1024) / 8,
                uploadThroughput: (750 * 1024) / 8,
            });
    }

    for (const kind of NAV_KINDS) {
        if (cdp)
            await cdp.send("Network.setCacheDisabled", {
                cacheDisabled: kind === "cold",
            });
        const nlen = wlog.length;
        const t0 = Date.now();
        await page.goto(kind === "cold" ? URL_ : URL_ + "&_n=" + kind, {
            waitUntil: "load",
            timeout: 60000,
        });
        const r = await readPage(page);
        r.wallMs = Date.now() - t0;
        const sw = await page
            .evaluate(() =>
                navigator.serviceWorker
                    ? navigator.serviceWorker
                          .getRegistrations()
                          .then((x) => x.length)
                          .catch(() => -1)
                    : null,
            )
            .catch(() => null);
        r.swRegs = sw;
        const wasm = wlog
            .slice(nlen)
            .filter((x) => x.u.endsWith(".wasm"))
            .map((x) => ({ ev: x.ev, dt: x.t - t0, tm: x.tm || null }));
        const workerJs = wlog
            .slice(nlen)
            .filter((x) => x.ev === "req" && /solver\.worker-/.test(x.u)).length;
        out.write(
            JSON.stringify({
                engine: ENGINE,
                cpu: CPU,
                net: NET,
                vp: VP,
                win: w,
                kind,
                wasm,
                workerJsRequests: workerJs,
                ...r,
            }) + "\n",
        );
        console.log(
            `${ENGINE} cpu${CPU}x ${NET} ${VP} w${w} ${kind}: boardReady=${r.boardReady} fcp=${r.paints["first-contentful-paint"]} lcp=${r.lcp} bakes=${r.bakeCount}(@ready ${r.bakeCountAtReady})/${r.bakeMs}ms req=${r.reqCount} bytes=${r.reqBytes} cacheHits=${r.cacheHits} fonts=${r.fontsReady} sw=${r.swRegs} tainted=${r.tainted}`,
        );
    }
    await ctx.close();
}
await browser.close();
out.end();
