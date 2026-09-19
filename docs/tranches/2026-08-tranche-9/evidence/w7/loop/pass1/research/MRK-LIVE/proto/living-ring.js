/**
 * MRK-LIVE pass-1 PROTOTYPE OVERLAY — "the living mark", installed from OUTSIDE the tree.
 *
 * Injected with `page.evaluate(readFileSync(this file))`. Touches no product file. It defines
 * `window.__mrkLive` and reproduces, in the page, exactly what the source patch would do:
 *
 *   1. the ACTIVE cell's ghost becomes a four-pose stack built by the estate's OWN
 *      `generateRectBoilFrames` (gridPaths.ts:213) at `BOIL_CONFIG.cellBoil`, seeded with the
 *      cell's own `42 + 500 + pos*7`. Pose 0 is byte-identical to today's `ghostPath`, so the
 *      resting look does not move;
 *   2. the poses ride the page's OWN beat — a MutationObserver on the grid's `is-active` pose
 *      carrier, so the ring's swap lands in the same dirty frame as the board's and no second
 *      cadence is minted;
 *   3. the stack mounts on focus and unmounts on blur — one stack in the document, never N;
 *   4. `settleBeats` optionally pins the stack to a chosen pose after N beats (the
 *      "does it stop breathing" arm).
 *
 * Variants: `grammar: "anchored"` uses generateRectBoilFrames (the board frame's own grammar,
 * corners pinned); `grammar: "closed"` uses perturbPointsClosed over the same base ring
 * (corners live, no taper) — the fork the charter names.
 */
(() => {
  const S = {
    installed: false,
    opts: null,
    gp: null,
    pb: null,
    cfg: null,
    poses: [],
    nodes: [],
    host: null,
    pos: -1,
    beat: 0,
    beatsSinceMount: 0,
    settled: false,
    mounts: 0,
    unmounts: 0,
    buildMs: [],
    mo: null,
    carrier: null,
  };
  window.__mrkLiveState = S;

  const numsOf = (d) => (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);

  function ringPoints(gp, x, y, w, h, opts) {
    // The base closed ring, exactly as wobbleRect composes it: four wobbled sides at s..s+3
    // with the later sides' first point elided. Rebuilt from the frame-0 path string so the
    // "closed" variant perturbs the SAME geometry the anchored one does.
    const d0 = gp.generateRectBoilFrames(x, y, w, h, opts, 0, 2)[0];
    const n = numsOf(d0);
    const pts = [];
    for (let i = 0; i + 1 < n.length; i += 2) pts.push([n[i], n[i + 1]]);
    return pts;
  }

  function serialize(pts) {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
    return d + " Z";
  }

  function perturbClosed(points, amount, seed) {
    // pencil-boil's perturbPointsClosed, reproduced so the overlay needs no bundler entry.
    let s = seed >>> 0;
    const rng = () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const n = points.length;
    if (n < 3 || amount === 0) return points.map((p) => [p[0], p[1]]);
    return points.map((p, i) => {
      const prev = points[(i - 1 + n) % n];
      const next = points[(i + 1) % n];
      const dx = next[0] - prev[0];
      const dy = next[1] - prev[1];
      const len = Math.hypot(dx, dy) || 1;
      const off = (rng() - 0.5) * 2 * amount;
      return [p[0] + (-dy / len) * off, p[1] + (dx / len) * off];
    });
  }

  window.__mrkLive = {
    async init() {
      S.gp = await import(/* @vite-ignore */ "/src/pencil/grid/gridPaths.ts");
      S.cfg = await import(/* @vite-ignore */ "/src/pencil/config/pencilConfig.ts");
      return {
        exports: Object.keys(S.gp),
        boil: { ...S.cfg.BOIL_CONFIG },
        beatMs: S.cfg.MOTION.beatMs,
      };
    },

    /** Build the four poses for a cell, without mounting. Returns the timing. */
    build(pos, boardSize, opts = {}) {
      const amount = opts.amount ?? S.cfg.BOIL_CONFIG.cellBoil;
      const frames = opts.frames ?? S.cfg.BOIL_CONFIG.frameCount;
      const grammar = opts.grammar ?? "anchored";
      const cellSize = 1000 / boardSize;
      const col = pos % boardSize;
      const row = Math.floor(pos / boardSize);
      const wopts = {
        roughness: 0.4,
        segments: boardSize >= 16 ? 2 : 4,
        seed: 42 + 500 + pos * 7,
        jagged: true,
      };
      const t0 = performance.now();
      let out;
      if (grammar === "closed") {
        const base = ringPoints(
          S.gp,
          col * cellSize,
          row * cellSize,
          cellSize,
          cellSize,
          wopts,
        );
        out = [serialize(base)];
        for (let f = 1; f < frames; f++)
          out.push(
            serialize(perturbClosed(base, amount, wopts.seed + f * 1013)),
          );
      } else {
        out = S.gp.generateRectBoilFrames(
          col * cellSize,
          row * cellSize,
          cellSize,
          cellSize,
          wopts,
          amount,
          frames,
        );
      }
      const ms = performance.now() - t0;
      S.buildMs.push(Math.round(ms * 1000) / 1000);
      return { poses: out, buildMs: Math.round(ms * 1000) / 1000 };
    },

    /** Mount the stack on the currently focused cell. Idempotent per cell. */
    mountActive(opts = {}) {
      const cell = document.querySelector(
        ".game-cell:has(input:focus-visible)",
      );
      if (!cell) return { mounted: false, why: "no focus-visible cell" };
      const cells = Array.from(document.querySelectorAll(".game-cell"));
      const pos = cells.indexOf(cell);
      if (pos === S.pos && S.nodes.length) return { mounted: true, pos, reused: true };
      this.unmount();
      const boardSize = Math.round(Math.sqrt(cells.length));
      const { poses, buildMs } = this.build(pos, boardSize, opts);
      const base = cell.querySelector(".cell-ghost-path");
      if (!base) return { mounted: false, why: "no ghost path" };
      const svg = base.ownerSVGElement;
      S.poses = poses;
      S.host = base;
      S.pos = pos;
      S.nodes = [base];
      // pose 0 is the resident path; poses 1..n-1 are the NEW siblings (+3 nodes, never +N²)
      for (let f = 1; f < poses.length; f++) {
        // CLONE the resident path, never mint a fresh one: gameCell.css is a SCOPED
        // stylesheet, so every tier selector carries DigitCell's `[data-v-…]` attribute and a
        // freshly created <path> would render with the SVG defaults (black fill, no stroke)
        // instead of the tier the cascade paints. A clone carries the scope attribute, which
        // is also exactly what a `v-for` over the poses inside the component would produce.
        const p = base.cloneNode(false);
        p.setAttribute("d", poses[f]);
        p.classList.add("mrk-live-pose");
        svg.appendChild(p);
        S.nodes.push(p);
      }
      S.mounts++;
      S.beatsSinceMount = 0;
      S.settled = false;
      this.paint(0);
      return { mounted: true, pos, nodesAdded: poses.length - 1, buildMs };
    },

    unmount() {
      for (let i = 1; i < S.nodes.length; i++) S.nodes[i].remove();
      if (S.nodes.length) {
        S.nodes[0].style.opacity = "";
        S.unmounts++;
      }
      S.nodes = [];
      S.pos = -1;
    },

    paint(frame) {
      for (let i = 0; i < S.nodes.length; i++)
        S.nodes[i].style.opacity = i === frame ? "1" : "0";
    },

    /** Enrol on the page's OWN beat: the grid's active pose carrier. No new timer. */
    arm(opts = {}) {
      S.opts = opts;
      const carrierSel = document.querySelector(".boil-frame-bitmap")
        ? ".boil-frame-bitmap"
        : ".boil-frame-layer";
      S.carrier = carrierSel;
      const carriers = Array.from(document.querySelectorAll(carrierSel));
      const settleBeats = opts.settleBeats ?? 0; // 0 = never settle
      const settlePose = opts.settlePose ?? 0;
      S.mo = new MutationObserver(() => {
        const f = carriers.findIndex((e) => e.classList.contains("is-active"));
        if (f < 0 || f === S.beat) return;
        S.beat = f;
        if (!S.nodes.length) return;
        S.beatsSinceMount++;
        if (settleBeats > 0 && S.beatsSinceMount > settleBeats) {
          if (!S.settled) {
            S.settled = true;
            this.paint(settlePose);
          }
          return;
        }
        this.paint(f % S.nodes.length);
      });
      for (const c of carriers)
        S.mo.observe(c, { attributes: true, attributeFilter: ["class"] });

      // Mount/unmount with selection — the real patch's lifecycle.
      const onFocus = () => setTimeout(() => this.mountActive(opts), 0);
      document.addEventListener("focusin", onFocus, true);
      document.addEventListener("keyup", onFocus, true);
      S.installed = true;
      return { carrier: carrierSel, carriers: carriers.length, settleBeats };
    },

    stats() {
      return {
        mounts: S.mounts,
        unmounts: S.unmounts,
        pos: S.pos,
        nodes: S.nodes.length,
        beat: S.beat,
        beatsSinceMount: S.beatsSinceMount,
        settled: S.settled,
        carrier: S.carrier,
        buildMs: S.buildMs.slice(-20),
        buildMsMax: S.buildMs.length ? Math.max(...S.buildMs) : null,
        buildMsMedian: S.buildMs.length
          ? [...S.buildMs].sort((a, b) => a - b)[Math.floor(S.buildMs.length / 2)]
          : null,
      };
    },
  };
})();
