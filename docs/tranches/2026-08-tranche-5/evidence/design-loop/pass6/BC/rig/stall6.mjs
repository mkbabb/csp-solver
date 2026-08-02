/**
 * stall6.mjs — the pass-6 drawer-toggle rig. Succeeds `pass5/BC/rig/stall5.mjs`, whose
 * statistics, gesture shape, viewport, DPR and regime guards it keeps verbatim so its numbers
 * and these sit in the same column. What it adds is the only thing pass 5 could not see.
 *
 * WHY A NEW RIG. stall5 measured ONE gesture: land closed, settle, open. That gesture is a
 * cold miss under any cache — the surface has never baked at the opened box — so stall5 run
 * unchanged against the cure would have measured the cure's worst case and called it the cure.
 * A cache is a claim about the SECOND time, so the rig walks the toggle: open, close, open.
 * Under 0.11 all three are full bakes. Under the size-keyed stack cache the first is a full
 * bake and the next two are hits, and the difference between gesture 1 and gesture 3 in the
 * SAME session is the measurement — no cross-session comparison, no remembered baseline.
 *
 *   g1  OPEN   — the board leaves the mounted box for a box never baked. A miss either way.
 *   g2  CLOSE  — the board returns to the box it mounted at. First possible hit.
 *   g3  OPEN   — the board returns to g1's box. The hit that matters: same gesture as g1,
 *                same geometry, same session, so g1 → g3 is a within-subject delta.
 *
 * π — BYTE IDENTITY ON A HIT. After each gesture the rig reads every baked pose URL off the
 * live DOM (`<image href="blob:…">` / `<img src="blob:…">`), fetches each blob back, and
 * hashes its bytes (FNV-1a). A cache hit must return the SAME BYTES as the bake it replaced —
 * asserted on the fetched payloads, not on the handle strings, so an implementation that
 * re-encoded to an identical-looking URL could not pass. g3's hashes are compared to g1's.
 *
 * The gesture guards from stall5 are kept and one is added: every gesture asserts the drawer
 * actually changed state, and the pose census asserts a non-empty stack, so a run that baked
 * nothing cannot report "zero encodes" as a success.
 *
 * HARNESS LIMIT, unchanged from pass 5 and still load-bearing: this is Playwright's WebKit at
 * 1280×810 DPR2, not real Safari 26.4. Absolute milliseconds do not transfer. Within-session,
 * within-arm deltas do, and every claim here is one of those.
 *
 * usage: node stall6.mjs <arm> <runId> [--port=N] [--repeats=N] [--engine=webkit]
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNS = resolve(HERE, "..", "runs");
const FE = resolve(HERE, "../../../../../../../../web/frontend/package.json");
const PW = await import(pathToFileURL(createRequire(FE).resolve("@playwright/test")).href);

const arm = process.argv[2] ?? "before";
const runId = process.argv[3] ?? `s6-${arm}`;
const port = +(process.argv.find((a) => a.startsWith("--port="))?.slice(7) ?? 4245);
const repeats = +(process.argv.find((a) => a.startsWith("--repeats="))?.slice(10) ?? 3);
const engineName = process.argv.find((a) => a.startsWith("--engine="))?.slice(9) ?? "webkit";
const engine = PW[engineName] ?? PW.default?.[engineName];
if (!engine) throw new Error(`no such playwright engine: ${engineName}`);

/** Injected before any page script — stall5's instrument, kept verbatim. */
const INSTRUMENT = () => {
  const R = { events: [], frames: [], clickAt: null };
  window.__rig = R;
  const rec = (n, ms, extra) =>
    R.events.push({ n, ms: +ms.toFixed(2), at: +performance.now().toFixed(1), ...extra });

  const sz = (o) => {
    try {
      if (!o) return null;
      const w = o.width ?? o.naturalWidth;
      const h = o.height ?? o.naturalHeight;
      return w && h ? `${Math.round(w)}x${Math.round(h)}` : null;
    } catch {
      return null;
    }
  };

  if (typeof window.createImageBitmap === "function") {
    const o = window.createImageBitmap.bind(window);
    window.createImageBitmap = async function (...a) {
      const t = performance.now();
      const r = await o(...a);
      rec("createImageBitmap", performance.now() - t, { size: sz(a[0]) });
      return r;
    };
  }
  if (typeof OffscreenCanvas !== "undefined" && OffscreenCanvas.prototype.convertToBlob) {
    const o = OffscreenCanvas.prototype.convertToBlob;
    OffscreenCanvas.prototype.convertToBlob = async function (...a) {
      const t = performance.now();
      const b = await o.apply(this, a);
      rec("convertToBlob", performance.now() - t, { size: sz(this), bytes: b?.size ?? null });
      return b;
    };
  }
  {
    const o = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (cb, ...rest) {
      const t = performance.now();
      const self = this;
      return o.call(
        this,
        (b) => {
          rec("toBlob", performance.now() - t, { size: sz(self), bytes: b?.size ?? null });
          cb(b);
        },
        ...rest,
      );
    };
  }
  {
    const o = URL.createObjectURL.bind(URL);
    URL.createObjectURL = function (b) {
      if (b && b.type.startsWith("image/svg+xml")) rec("svgBlob", 0, { bytes: b.size });
      if (b && b.type === "image/png") rec("pngBlob", 0, { bytes: b.size });
      return o(b);
    };
    const rv = URL.revokeObjectURL.bind(URL);
    URL.revokeObjectURL = function (u) {
      rec("revoke", 0, {});
      return rv(u);
    };
  }

  let last = performance.now();
  const tick = (now) => {
    R.frames.push(+(now - last).toFixed(2));
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const analyse = (raw) => {
  const { events, frames, clickAt, sampleT0 } = raw;
  let t = sampleT0;
  const gaps = [];
  for (const d of frames) {
    t += d;
    gaps.push({ end: t, ms: d });
  }
  const inWin = (g, w) => g.end - clickAt >= 0 && g.end - clickAt <= w;
  const win900 = gaps.filter((g) => inWin(g, 900));
  const win600 = gaps.filter((g) => inWin(g, 600));
  const sum = (a) => +a.reduce((s, g) => s + g.ms, 0).toFixed(1);
  const evAfter = events.filter((e) => e.at >= clickAt - 5 && e.at <= clickAt + 900);
  const tot = (n) => +evAfter.filter((e) => e.n === n).reduce((s, e) => s + e.ms, 0).toFixed(1);
  const cnt = (n) => evAfter.filter((e) => e.n === n).length;
  return {
    worstGapMs: win900.length ? +Math.max(...win900.map((g) => g.ms)).toFixed(1) : null,
    blocked600: sum(win600.filter((g) => g.ms >= 50)),
    blocked900: sum(win900.filter((g) => g.ms >= 50)),
    longGaps100: win900.filter((g) => g.ms >= 100).length,
    framesInWindow: win900.length,
    bakes: cnt("svgBlob"),
    pngBlobs: cnt("pngBlob"),
    revokes: cnt("revoke"),
    createImageBitmapN: cnt("createImageBitmap"),
    convertToBlobN: cnt("convertToBlob"),
    toBlobMs: tot("toBlob"),
    toBlobN: cnt("toBlob"),
    shell: `${raw.shellBefore}->${raw.shellAfter}`,
    captureSizes: [...new Set(evAfter.filter((e) => e.n === "toBlob").map((e) => e.size))],
    bigGaps: win900
      .filter((g) => g.ms >= 50)
      .map((g) => ({ ms: +g.ms.toFixed(1), afterClickMs: +(g.end - clickAt).toFixed(0) })),
  };
};

/** One toggle: reset the window, tap, sample 950ms, then census the baked poses. */
const gesture = async (page, label, expectClosedBefore) => {
  const raw = await page.evaluate(
    async ({ expectClosedBefore }) => {
      const R = window.__rig;
      const box = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return "none";
        const r = el.getBoundingClientRect();
        return `${Math.round(r.width)}x${Math.round(r.height)}`;
      };
      R.events.length = 0;
      R.frames.length = 0;
      const sampleT0 = performance.now();
      const shellBefore = box(".board-shell");
      const closedBefore = document.documentElement.classList.contains("drawer-closed");
      document.querySelector(".drawer-tab").click();
      const clickAt = performance.now();
      await new Promise((r) => setTimeout(r, 950));
      return {
        events: R.events.slice(),
        frames: R.frames.slice(),
        clickAt,
        sampleT0,
        closedBefore,
        closedAfter: document.documentElement.classList.contains("drawer-closed"),
        shellBefore,
        shellAfter: box(".board-shell"),
        expectClosedBefore,
      };
    },
    { expectClosedBefore },
  );
  if (raw.closedBefore !== expectClosedBefore)
    throw new Error(`${label}: expected drawer-closed=${expectClosedBefore} before the tap`);
  if (raw.closedAfter === raw.closedBefore)
    throw new Error(`${label}: the tap did not change the drawer state`);

  // π — the pose census, taken only once the LAYOUT HAS STOPPED MOVING.
  //
  // The first cut of this census sampled at a fixed t+950 ms and produced a false alarm worth
  // recording: the wordmark's box is still gliding then, so two runs of the same gesture could
  // census two different (both correct) wordmark widths and the g1-vs-g3 comparison would read
  // DIFFERENT on a cache that had done nothing wrong. A pixel-identity check that fires on a
  // moving box measures the sampler, not the pixels. So: poll the two capture boxes until they
  // hold still for three consecutive reads, THEN census, and record the settled boxes beside
  // the hashes so a future reader can see what was compared. Each pose is also tagged with the
  // surface that owns it, which makes the comparison order-independent.
  const poses = await page.evaluate(async () => {
    const boxes = () =>
      ['.board-shell', 'svg.handwritten-logo', '.celestial-toggle']
        .map((s) => {
          const el = document.querySelector(s);
          if (!el) return `${s}:none`;
          const r = el.getBoundingClientRect();
          return `${s}:${r.width.toFixed(1)}x${r.height.toFixed(1)}`;
        })
        .join('|');
    let stable = 0;
    let last = boxes();
    const deadline = performance.now() + 4000;
    while (stable < 3 && performance.now() < deadline) {
      await new Promise((r) => setTimeout(r, 120));
      const now = boxes();
      stable = now === last ? stable + 1 : 0;
      last = now;
    }
    const settledBoxes = last;

    const nodes = [...document.querySelectorAll('image[href^="blob:"], img[src^="blob:"]')];
    const out = [];
    for (const n of nodes) {
      const u = n.getAttribute('href') ?? n.getAttribute('src');
      // Name the owning surface so poses compare by identity, not by document order.
      const owner =
        n.closest('.board-shell') ? 'grid'
        : n.closest('.masthead, svg.handwritten-logo') ? 'logo'
        : n.closest('.celestial-toggle') ? 'toggle'
        : 'other';
      try {
        const buf = new Uint8Array(await (await fetch(u)).arrayBuffer());
        let h = 0x811c9dc5;
        for (let i = 0; i < buf.length; i++) {
          h ^= buf[i];
          h = Math.imul(h, 0x01000193) >>> 0;
        }
        out.push({ owner, bytes: buf.length, hash: h.toString(16).padStart(8, '0'), settledBoxes });
      } catch (e) {
        out.push({ owner, bytes: null, hash: `ERR:${e.message}`, settledBoxes });
      }
    }
    return out;
  });
  if (poses.length === 0)
    throw new Error(`${label}: census found ZERO baked poses — nothing to report about`);

  return { label, ...analyse(raw), poses, raw };
};

const main = async () => {
  mkdirSync(RUNS, { recursive: true });
  const browser = await engine.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 810 },
    deviceScaleFactor: 2,
  });
  await ctx.addInitScript(INSTRUMENT);

  // ONE PAGE PER REP. The cache is per surface and lives as long as the page, so reps sharing
  // a page are not repeats — rep 2's "first" open would already be a hit on rep 1's stacks, and
  // the arm would flatter itself by construction. A fresh page makes every rep's g1 a genuine
  // cold miss and every rep an independent trial of the same claim.
  let env = null;
  const reps = [];
  for (let i = 1; i <= repeats; i++) {
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${port}/?game=sudoku&size=3&difficulty=EASY`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
    await page.waitForSelector(".drawer-tab", { timeout: 20000 });
    await page.waitForTimeout(3000); // let the cold-load bake finish

    env = await page.evaluate(() => ({
      ua: navigator.userAgent,
      dpr: devicePixelRatio,
      iw: innerWidth,
      ih: innerHeight,
      row: matchMedia("(min-width: 1024px)").matches,
      drawerMounted: !!document.querySelector(".drawer-tab"),
    }));
    if (!env.row || !env.drawerMounted)
      throw new Error(`regime guard: row=${env.row} drawer=${env.drawerMounted}`);

    // Land CLOSED and settle — stall5's opening, so g1 is stall5's exact gesture.
    await page.evaluate(() => {
      const tab = document.querySelector(".drawer-tab");
      if (!document.documentElement.classList.contains("drawer-closed")) tab.click();
    });
    await page.waitForTimeout(2200);

    const g1 = await gesture(page, "g1-open", true);
    await page.waitForTimeout(1200);
    const g2 = await gesture(page, "g2-close", false);
    await page.waitForTimeout(1200);
    const g3 = await gesture(page, "g3-open", true);
    await page.waitForTimeout(1200);

    const ms = (ps) =>
      ps
        .map((p) => `${p.owner}:${p.bytes}:${p.hash}`)
        .sort()
        .join(" ");
    const idA = ms(g1.poses);
    const idC = ms(g3.poses);
    reps.push({
      rep: i,
      g1,
      g2,
      g3,
      byteIdentity: {
        // Compared as a multiset keyed by owning surface, so document order cannot decide it.
        g1Hashes: idA,
        g3Hashes: idC,
        identical: idA === idC && g1.poses.length === g3.poses.length,
        poseCount: g1.poses.length,
        totalBytes: g1.poses.reduce((s, p) => s + (p.bytes ?? 0), 0),
        g1Boxes: g1.poses[0]?.settledBoxes ?? null,
        g3Boxes: g3.poses[0]?.settledBoxes ?? null,
        boxesMatch: (g1.poses[0]?.settledBoxes ?? null) === (g3.poses[0]?.settledBoxes ?? null),
      },
    });
    await page.close();
  }

  const out = { kind: "run", runId, arm, engine: engineName, env, reps, ts: new Date().toISOString() };
  const lines = [JSON.stringify({ kind: "env", runId, arm, engine: engineName, ...env })];
  for (const r of reps)
    lines.push(
      JSON.stringify({
        kind: "rep",
        runId,
        arm,
        rep: r.rep,
        byteIdentity: r.byteIdentity,
        g: [r.g1, r.g2, r.g3].map(({ raw, ...rest }) => rest),
      }),
    );
  writeFileSync(resolve(RUNS, `${runId}.jsonl`), lines.join("\n") + "\n");

  for (const r of reps) {
    for (const g of [r.g1, r.g2, r.g3])
      console.log(
        `${runId}#${r.rep} ${g.label.padEnd(8)} worst ${String(g.worstGapMs).padStart(6)}` +
          `  blocked600 ${String(g.blocked600).padStart(6)}  long100 ${g.longGaps100}` +
          `  bakes ${String(g.bakes).padStart(2)}  toBlob ${String(g.toBlobN).padStart(2)}` +
          `  revokes ${String(g.revokes).padStart(2)}  shell ${g.shell}  poses ${g.poses.length}`,
      );
    console.log(
      `${runId}#${r.rep} PI  byte-identity g1 vs g3: ${
        r.byteIdentity.identical ? "IDENTICAL" : "DIFFERENT"
      }  poses ${r.byteIdentity.poseCount}  bytes ${r.byteIdentity.totalBytes}`,
    );
  }
  await browser.close();
  return out;
};

main().catch((e) => {
  console.error("RIG FAILED:", e.message);
  process.exit(1);
});
