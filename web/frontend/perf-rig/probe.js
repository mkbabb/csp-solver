/* eslint-disable @typescript-eslint/no-unused-vars, no-empty -- the probe swallows by
   design: a failed lookup or a private-mode storage refusal must never take a run down,
   so every catch here is a deliberate no-op. Vanilla classic script, no build step. */
/**
 * probe.js — runs IN PAGE, vanilla classic script, ZERO deps.
 *
 * Query contract (all optional but __run):
 *   ?__run=<runId>            arms the probe; without it the page is a plain app
 *   &__scenarios=a,b,c        scenario order (default: the full set, state-safe order)
 *   &__ablate=<encodedCSS>    CSS injected as a <style> FIRST, before the app boots
 *   &__settle=<ms>            post-board-ready settle before idle3s (default 1200)
 *   &__theme=light|dark|auto  P-W4 G4.2: pins the app's resting theme BEFORE it boots, by
 *                             seeding useTheme's vueuse store key (`sudoku-color-scheme`,
 *                             modes auto|light|dark) and pre-stamping html.dark to match, so
 *                             first paint is already in the pinned theme and no flip lands
 *                             inside a measured window. Inert when absent — every cell that
 *                             does not pass it behaves exactly as it did in r1/r2/P-W3.
 *                             Reported back on the env line as `themePinned`.
 *
 * Each scenario reports {scenario, fps, frames, long50, long33, worstMs, wallMs, p50, p95,
 * jankMs, worst3} and POSTs incrementally to /__metrics. A scenario that throws POSTs
 * {scenario, error} and the run CONTINUES. The last line is always {done:true}.
 */
(function () {
  "use strict";

  var q = new URLSearchParams(window.location.search);
  var RUN = q.get("__run");
  if (!RUN) return; // not a probe load — leave the app alone

  // ── boot long-task capture, armed BEFORE anything else this file does ─────
  // TBT is the sum of main-thread blocking while the page comes up, so the observer has to
  // exist before the ablation style, before the theme pin, and long before the app's deferred
  // module. It is armed on every probe load and read by the `bootTbt` scenario; a load that
  // never asks for that scenario pays one idle observer.
  //
  // WEBKIT SHIPS NO `longtask` ENTRY TYPE. Support is CHECKED, never assumed, and the check is
  // reported out with the reading: `bootTbt` on an engine without it returns
  // `longtaskSupported:false` and a null TBT, and ci-subset.mjs turns that into a setup error
  // rather than a pass. An unmeasurable gate that returns green is the vacuity this row exists
  // to remove — an empty task list is indistinguishable from a clean boot unless the support
  // bit travels with it.
  var LT_SUPPORTED = (function () {
    try {
      return (
        typeof PerformanceObserver === "function" &&
        (PerformanceObserver.supportedEntryTypes || []).indexOf("longtask") >= 0
      );
    } catch (e) {
      return false;
    }
  })();
  var LONGTASKS = [];
  if (LT_SUPPORTED) {
    try {
      // `buffered:true` back-fills the tasks the engine recorded before this line ran — the
      // parse of the app's own entry chunk among them.
      new PerformanceObserver(function (list) {
        var es = list.getEntries();
        for (var i = 0; i < es.length; i++)
          LONGTASKS.push({
            startMs: Math.round(es[i].startTime),
            durMs: Math.round(es[i].duration),
          });
      }).observe({ type: "longtask", buffered: true });
    } catch (e) {
      LT_SUPPORTED = false; // registered as supported, refused at observe() — report the truth
    }
  }

  // ── ablation CSS goes in FIRST (before the app's deferred module runs) ──
  var ABLATE = q.get("__ablate") || "";
  if (ABLATE) {
    var st = document.createElement("style");
    st.id = "__probe_ablate";
    st.textContent = ABLATE;
    (document.head || document.documentElement).appendChild(st);
  }

  // ── theme pin (P-W4 G4.2's light-theme cell) ──────────────────────────────
  // Runs before the app's module, so vueuse reads the seeded value on first construction and
  // the page never flips theme after boot. `valueLight` is "" in useTheme, so light == no class.
  var THEME = (q.get("__theme") || "").toLowerCase();
  if (THEME === "light" || THEME === "dark" || THEME === "auto") {
    try {
      window.localStorage.setItem("sudoku-color-scheme", THEME);
    } catch (e) {
      /* private mode — the pre-stamp below still holds for this load */
    }
    var root = document.documentElement;
    if (THEME === "dark") root.classList.add("dark");
    else if (THEME === "light") root.classList.remove("dark");
  }

  var SETTLE = Number(q.get("__settle") || 1200);
  var ORDER = (
    q.get("__scenarios") ||
    "idle3s,deal,undoBurst,solveCelebration,galleryGlide,themeToggle"
  )
    .split(",")
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean);

  // ── plumbing ─────────────────────────────────────────────────────────────
  function post(obj) {
    obj.runId = RUN;
    obj.pageMs = Math.round(performance.now());
    try {
      return fetch("/__metrics?run=" + encodeURIComponent(RUN), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
        keepalive: true,
      }).catch(function () {});
    } catch (e) {
      return Promise.resolve();
    }
  }

  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  function waitFor(fn, timeoutMs, label) {
    var t0 = performance.now();
    return new Promise(function (ok, fail) {
      (function tick() {
        var v;
        try {
          v = fn();
        } catch (e) {
          v = null;
        }
        if (v) return ok(v);
        if (performance.now() - t0 > (timeoutMs || 15000))
          return fail(new Error("timeout waiting for " + (label || "condition")));
        setTimeout(tick, 60);
      })();
    });
  }

  /** An element counts as visible when it has a box and isn't visibility:hidden.
   *  Both the mobile and desktop control panels are MOUNTED; only one is painted. */
  function isVisible(el) {
    if (!el) return false;
    var r = el.getClientRects();
    if (!r.length) return false;
    var cs = getComputedStyle(el);
    return cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.01;
  }

  function visibleAll(sel) {
    return Array.prototype.filter.call(document.querySelectorAll(sel), isVisible);
  }

  function visibleOne(sel) {
    return visibleAll(sel)[0] || null;
  }

  function byAria(match) {
    return visibleAll("button").filter(function (b) {
      var a = b.getAttribute("aria-label") || "";
      return match.test(a);
    })[0] || null;
  }

  function cellInputs() {
    return Array.prototype.slice.call(
      document.querySelectorAll(".board-cells .game-cell input"),
    );
  }

  function boardSignature() {
    return cellInputs()
      .map(function (i) {
        return i.value || ".";
      })
      .join("");
  }

  /** Board-ready = a game cell that is actually PAINTED. Presence alone is not enough:
   *  `.board-group` is v-show'd (display:none) whenever the gallery holds the stage, and the
   *  cells stay in the DOM — a presence-only check happily "samples" an invisible board. */
  var boardReady = function () {
    return isVisible(document.querySelector(".board-cells .game-cell"));
  };

  // ── the frame sampler ────────────────────────────────────────────────────
  function round(n) {
    return Math.round(n * 100) / 100;
  }

  function summarize(deltas, stamps, wallMs) {
    var tail = deltas.slice(1); // frame 0's delta carries the arm offset
    var n = tail.length;
    var sorted = tail.slice().sort(function (a, b) {
      return a - b;
    });
    var pick = function (p) {
      return n ? round(sorted[Math.min(n - 1, Math.floor(n * p))]) : 0;
    };
    var worst3 = [];
    var idx = tail
      .map(function (d, i) {
        return [d, i];
      })
      .sort(function (a, b) {
        return b[0] - a[0];
      })
      .slice(0, 3);
    for (var k = 0; k < idx.length; k++)
      worst3.push({ ms: round(idx[k][0]), atMs: round(stamps[idx[k][1] + 1]) });
    var jank = 0;
    for (var j = 0; j < tail.length; j++) if (tail[j] > 50) jank += tail[j];
    // every long frame's offset — the spacing between them is the diagnosis (a hitch train on
    // a fixed period is a cadence artifact; scattered ones are load)
    var longAt = [];
    for (var m = 0; m < tail.length && longAt.length < 60; m++)
      if (tail[m] > 33.4) longAt.push({ ms: round(tail[m]), atMs: round(stamps[m + 1]) });
    return {
      frames: deltas.length,
      wallMs: round(wallMs),
      // too few frames = an aborted window; an fps there is arithmetic, not a measurement
      fps: deltas.length < 5 || wallMs < 200 ? null : round(deltas.length / (wallMs / 1000)),
      p50: pick(0.5),
      p95: pick(0.95),
      worstMs: n ? round(sorted[n - 1]) : 0,
      long50: tail.filter(function (d) {
        return d > 50;
      }).length,
      long33: tail.filter(function (d) {
        return d > 33.4;
      }).length,
      jankMs: round(jank),
      worst3: worst3,
      long33At: longAt,
    };
  }

  // ── focus/visibility watch ───────────────────────────────────────────────
  // A backgrounded or occluded WebKit page has rAF and timers SUSPENDED. Any focus or
  // visibility event inside a sample window taints that window, so every scenario carries
  // the event count and its own hasFocus/visibilityState at close.
  var focusEvents = 0;
  ["blur", "focus", "pagehide", "pageshow"].forEach(function (t) {
    window.addEventListener(t, function () {
      focusEvents++;
    });
  });
  document.addEventListener("visibilitychange", function () {
    focusEvents++;
  });

  /** Starts sampling immediately; .stop() resolves on the next frame. */
  function startSampler() {
    var deltas = [],
      stamps = [],
      t0 = performance.now(),
      last = t0,
      stopping = false,
      focus0 = focusEvents,
      resolve;
    var done = new Promise(function (r) {
      resolve = r;
    });
    function step(now) {
      deltas.push(now - last);
      stamps.push(now - t0);
      last = now;
      if (stopping) {
        var s = summarize(deltas, stamps, now - t0);
        s.focusEvents = focusEvents - focus0;
        s.hadFocus = document.hasFocus();
        s.visibility = document.visibilityState;
        resolve(s);
      } else requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    return {
      stop: function () {
        stopping = true;
        return done;
      },
    };
  }

  /** Sample for a fixed window while `during` (optional) drives the interaction. */
  async function sampleFor(ms, during) {
    var s = startSampler();
    var work = during ? Promise.resolve(during()).catch(function (e) {
      return { actionError: String((e && e.message) || e) };
    }) : Promise.resolve(null);
    await sleep(ms);
    var out = await s.stop();
    var extra = await work;
    if (extra && extra.actionError) out.actionError = extra.actionError;
    return out;
  }

  // ── interaction primitives ───────────────────────────────────────────────
  function press(el) {
    el.click();
  }

  function key(el, k, opts) {
    var init = {
      key: k,
      bubbles: true,
      cancelable: true,
      metaKey: !!(opts && opts.meta),
      ctrlKey: !!(opts && opts.ctrl),
      shiftKey: !!(opts && opts.shift),
    };
    el.dispatchEvent(new KeyboardEvent("keydown", init));
    el.dispatchEvent(new KeyboardEvent("keyup", init));
  }

  /** A synthetic pointer. `useCarouselGlide` bails on `pointerType === "touch"` and on any
   *  `button !== 0`, and it listens for move/up on the WINDOW (deliberately, no capture), so
   *  the down goes to the element and the rest go to `window`. */
  function pointer(target, type, x, y) {
    target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
        button: type === "pointermove" ? -1 : 0,
        buttons: type === "pointerup" ? 0 : 1,
        clientX: x,
        clientY: y,
      }),
    );
  }

  function typeDigit(input, d) {
    input.value = String(d);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /** Deal is a two-tap arm/confirm on coarse+dirty; a single tap elsewhere. Re-read the
   *  aria-label after the first click and confirm only when it says so. */
  async function dealTaps() {
    var btn = byAria(/Deal a new board|Tap again to deal/i);
    if (!btn) throw new Error("no visible Deal control");
    press(btn);
    await sleep(350);
    var again = byAria(/Tap again to deal/i);
    if (again) press(again);
  }

  async function awaitNewBoard(sigBefore, maxMs) {
    var t0 = performance.now();
    var changedAt = 0;
    var lastSig = sigBefore;
    while (performance.now() - t0 < (maxMs || 8000)) {
      var sig = boardSignature();
      if (!changedAt && sig !== sigBefore) changedAt = performance.now();
      if (changedAt && sig === lastSig && performance.now() - changedAt > 400) return true;
      lastSig = sig;
      await sleep(80);
    }
    return false;
  }

  /** Why is a control not visible? Dumps every button's aria-label with the exact reason
   *  `isVisible` rejected it (no box / display / visibility / opacity), plus the key
   *  structural selectors. Diagnostic only — never a measurement. */
  function domDump() {
    var buttons = Array.prototype.map.call(document.querySelectorAll("button"), function (b) {
      var cs = getComputedStyle(b);
      var r = b.getBoundingClientRect();
      return {
        aria: (b.getAttribute("aria-label") || "").slice(0, 60),
        cls: (b.className || "").toString().slice(0, 60),
        rects: b.getClientRects().length,
        display: cs.display,
        visibility: cs.visibility,
        opacity: cs.opacity,
        box: [Math.round(r.width), Math.round(r.height)],
        visible: isVisible(b),
      };
    });
    var sel = {};
    [
      ".board-group",
      ".game-gallery",
      ".board-cells",
      ".board-cells .game-cell",
      ".controls-card",
      "#controls-drawer",
      ".scene-controls",
      "button.logo-trigger",
      ".masthead",
      ".gallery-viewport",
      ".deal-row",
      ".play-controls",
      ".drawer-tab",
    ].forEach(function (s) {
      var els = document.querySelectorAll(s);
      var first = els[0];
      var info = { count: els.length };
      if (first) {
        var cs = getComputedStyle(first);
        var r = first.getBoundingClientRect();
        info.display = cs.display;
        info.visibility = cs.visibility;
        info.opacity = cs.opacity;
        info.box = [Math.round(r.width), Math.round(r.height)];
        info.inert = first.hasAttribute("inert");
        info.visible = isVisible(first);
      }
      sel[s] = info;
    });
    return {
      kind: "domDump",
      htmlClass: document.documentElement.className,
      bodyClass: document.body.className,
      selectors: sel,
      buttons: buttons,
    };
  }

  /** The controls live in a drawer. On a coarse/narrow regime (the iOS sim, a phone) it can be
   *  parked, and a parked drawer is `visibility:hidden` — every panel control reads invisible.
   *  Pull the tab before any scenario that presses one. */
  async function ensurePanelOpen() {
    if (byAria(/Deal a new board|Tap again to deal/i)) return;
    var tab = visibleOne(".drawer-tab");
    if (!tab) return; // no drawer on this regime — the caller's own lookup will report
    press(tab);
    try {
      await waitFor(
        function () {
          return byAria(/Deal a new board|Tap again to deal/i);
        },
        6000,
        "controls drawer open",
      );
      await sleep(500);
    } catch (e) {
      /* leave the diagnosis to the scenario's own lookup + domDumpOnError */
    }
  }

  /** A board with at least one empty cell — the precondition for solving and for writing.
   *  Runs OUTSIDE the sample window, so a retry always starts from the same board state. */
  async function ensureUnsolvedBoard() {
    await waitFor(boardReady, 20000, "board ready");
    await ensurePanelOpen();
    var empty = function () {
      return cellInputs().filter(function (i) {
        return !i.value;
      });
    };
    if (empty().length) return empty();
    var sig = boardSignature();
    await dealTaps();
    await awaitNewBoard(sig, 8000);
    await sleep(600);
    var e = empty();
    if (!e.length) throw new Error("board still full after a deal — nothing to solve/undo");
    return e;
  }

  /** L2 diagnostic: every live-filtered element grouped by tag+class+filter, every element
   *  carrying a CSS animation, and each pose family's per-node tag + COMPUTED opacity (which
   *  is how an ablation pin is verified to have landed rather than assumed). Never a
   *  measurement — it forces a full style recalc by construction. */
  function styleDump() {
    var all = document.querySelectorAll("*");
    var filters = {};
    var anims = {};
    for (var i = 0; i < all.length; i++) {
      var el = all[i],
        cs;
      try {
        cs = getComputedStyle(el);
      } catch (e) {
        continue;
      }
      if (cs.filter && cs.filter !== "none") {
        var tag = el.tagName.toLowerCase();
        var cls = (el.getAttribute("class") || "").trim().split(/\s+/).slice(0, 3).join(".");
        var k =
          (el instanceof SVGElement ? "svg:" : "html:") +
          tag +
          (cls ? "." + cls : "") +
          " ← " +
          cs.filter;
        filters[k] = (filters[k] || 0) + 1;
      }
      var an = cs.animationName;
      if (an && an !== "none") {
        var ak =
          an +
          " on " +
          el.tagName.toLowerCase() +
          "." +
          (el.getAttribute("class") || "").trim().split(/\s+/).slice(0, 2).join(".");
        anims[ak] = (anims[ak] || 0) + 1;
      }
    }
    var poses = {};
    [
      ".boil-frame-bitmap",
      ".boil-frame-layer",
      ".boil-pose",
      ".rest-pose",
      ".dt-pose",
      ".progress-pose",
      ".cell-reveal-animated",
      ".boil-divider-wrap .boil-pose",
      ".sun-moon-toggle svg",
      ".control-panel-filtered",
      ".icon-btn",
      ".game-cell",
    ].forEach(function (s) {
      var els = document.querySelectorAll(s);
      var rows = [];
      for (var j = 0; j < els.length && j < 24; j++) {
        var c = getComputedStyle(els[j]);
        rows.push(
          els[j].tagName.toLowerCase() +
            "|op=" +
            c.opacity +
            "|disp=" +
            c.display +
            "|f=" +
            (c.filter === "none" ? "none" : c.filter.slice(0, 28)) +
            "|wc=" +
            c.willChange,
        );
      }
      poses[s] = { count: els.length, nodes: rows };
    });
    var live = document.getAnimations
      ? document.getAnimations().map(function (a) {
          var n = "";
          try {
            n = (a.animationName || (a.effect && a.effect.getKeyframes && "kf") || "") + "";
          } catch (e) {}
          return a.playState + ":" + (n || a.constructor.name);
        })
      : [];
    return { kind: "styleDump", filters: filters, cssAnimations: anims, poses: poses, wapi: live };
  }

  // ── scenarios ────────────────────────────────────────────────────────────
  // Each entry is {prepare?, run}. `prepare` puts the app in the scenario's starting state
  // OUTSIDE the measured window, which is what makes a tainted window safe to re-take.
  var SCENARIOS = {
    domDump: {
      run: async function () {
        await waitFor(boardReady, 20000, "board ready");
        await sleep(1200);
        await post(domDump());
        return { frames: 0, wallMs: 0, fps: null, note: "diagnostic only" };
      },
    },

    styleDump: {
      run: async function () {
        await waitFor(boardReady, 20000, "board ready");
        await sleep(1600);
        await post(styleDump());
        return { frames: 0, wallMs: 0, fps: null, note: "diagnostic only" };
      },
    },

    idle3s: {
      prepare: async function () {
        await waitFor(boardReady, 20000, "board ready");
        await sleep(SETTLE);
      },
      run: async function () {
      var out = await sampleFor(3000);
      // cheap idle census (measured AFTER the window, so the recalc never taints it)
      var anim = animStates();
      out.runningAnimations = anim.running;
      out.animStates = anim;
      out.cellRevealNodes = document.querySelectorAll(".cell-reveal-animated").length;
      out.displayHzEst = out.p50 ? Math.round(1000 / out.p50) : null;
      return out;
      },
    },

    deal: {
      prepare: async function () {
        await waitFor(boardReady, 20000, "board ready");
        await ensurePanelOpen();
      },
      run: async function () {
      var sig = boardSignature();
      var s = startSampler();
      var err = null;
      try {
        await dealTaps();
        await awaitNewBoard(sig, 8000);
        await sleep(1000);
      } catch (e) {
        err = String((e && e.message) || e);
      }
      var out = await s.stop();
      if (err) out.actionError = err;
      return out;
      },
    },

    solveCelebration: {
      // a solved board has no celebration left to give — every attempt gets a fresh deal
      prepare: ensureUnsolvedBoard,
      run: async function () {
      var btn = byAria(/^Solve puzzle$/i);
      if (!btn) throw new Error("no visible Solve control");
      return sampleFor(4000, async function () {
        press(btn);
      });
      },
    },

    galleryGlide: {
      prepare: async function () {
        await waitFor(boardReady, 20000, "board ready");
      },
      run: async function () {
      var trigger = visibleOne("button.logo-trigger");
      if (!trigger) throw new Error("no visible .logo-trigger");
      var s = startSampler();
      var err = null;
      try {
        press(trigger);
        var vp = await waitFor(
          function () {
            return visibleOne(".gallery-viewport");
          },
          6000,
          ".gallery-viewport",
        );
        vp.focus();
        await sleep(400);
        key(vp, "ArrowRight");
        await sleep(700);
        key(vp, "ArrowRight");
        await sleep(1100);
      } catch (e) {
        err = String((e && e.message) || e);
      }
      var out = await s.stop();
      if (err) out.actionError = err;
      // leave the gallery so later scenarios see a board again
      try {
        var vp2 = visibleOne(".gallery-viewport");
        if (vp2) {
          key(vp2, "Escape");
          await waitFor(
            function () {
              return !visibleOne(".gallery-viewport");
            },
            5000,
            "gallery close",
          );
        }
      } catch (e) {
        out.teardownError = String((e && e.message) || e);
      }
      await sleep(600);
      return out;
      },
    },

    themeToggle: {
      run: async function () {
      var t = byAria(/^Switch to (dark|light) mode$/i);
      if (!t) throw new Error("no visible dark-mode toggle");
      return sampleFor(2500, async function () {
        press(t);
        await sleep(800);
        var back = byAria(/^Switch to (dark|light) mode$/i);
        if (back) press(back);
      });
      },
    },

    undoBurst: {
      prepare: ensureUnsolvedBoard,
      run: async function () {
      var empties = cellInputs().filter(function (i) {
        return !i.value;
      });
      var cell = empties[Math.floor(empties.length / 2)];
      if (!cell) throw new Error("no empty (non-given) cell to write into");
      var undoBtn = byAria(/^Undo last move$/i);
      return sampleFor(2500, async function () {
        cell.focus();
        await sleep(120);
        var digits = [1, 5, 9];
        for (var i = 0; i < digits.length; i++) {
          typeDigit(cell, digits[i]);
          await sleep(140);
          key(cell, "Backspace");
          await sleep(140);
        }
        typeDigit(cell, 7);
        await sleep(160);
        for (var u = 0; u < 6; u++) {
          if (undoBtn && isVisible(undoBtn)) press(undoBtn);
          else key(document.activeElement || cell, "z", { meta: true });
          await sleep(60);
        }
      });
      },
    },

    // ── T7-W6 ─────────────────────────────────────────────────────────────────────────────
    // BOOT TBT — the blocking the idle law cannot see. Every other scenario here samples
    // steady state; the boot burst (bundle parse, mount, the pose bake) happens once, before
    // the first window opens, and nothing has ever had a number on it. Total Blocking Time
    // over the boot window: for each long task STARTING inside the window, the milliseconds
    // it ran past 50 — the standard definition, so the number is readable against any other
    // TBT and does not need this rig to interpret it.
    //
    // It reads the observer armed at the top of this file; it does NOT sample frames, so it
    // owns its page load rather than sharing one. A load that has already been driven has
    // already had its boot window perturbed.
    bootTbt: {
      run: async function () {
        var WINDOW_MS = Number(q.get("__bootMs") || 3000);
        var ready = true;
        try {
          await waitFor(boardReady, 20000, "board ready");
        } catch (e) {
          ready = false; // report the window anyway — a boot that never painted is the finding
        }
        while (performance.now() < WINDOW_MS) await sleep(50);
        var inWin = LONGTASKS.filter(function (t) {
          return t.startMs < WINDOW_MS;
        });
        var tbt = 0;
        var longest = 0;
        for (var i = 0; i < inWin.length; i++) {
          tbt += Math.max(0, inWin[i].durMs - 50);
          if (inWin[i].durMs > longest) longest = inWin[i].durMs;
        }
        return {
          fps: null,
          frames: 0,
          wallMs: Math.round(performance.now()),
          longtaskSupported: LT_SUPPORTED,
          boardPainted: ready,
          bootWindowMs: WINDOW_MS,
          tbtMs: LT_SUPPORTED ? Math.round(tbt) : null,
          tasks: LT_SUPPORTED ? inWin.length : null,
          longestTaskMs: LT_SUPPORTED ? longest : null,
          train: inWin.slice(0, 24),
          note: LT_SUPPORTED
            ? null
            : "no longtask entry type on this engine — the window is UNMEASURED, not clean",
        };
      },
    },

    // GALLERY DRAG — the owner's T6 mark, given an instrument. `galleryGlide` steps the deck
    // with the arrow keys; the drag is a different machine (a `scrollLeft` write per pointer
    // move, snap suspended, then one `glideTo` settle on release) and it had no reading at all.
    // MEASURED, UNPRICED: no floor in gates.json — see README, "the unpriced rows".
    galleryDrag: {
      prepare: async function () {
        await waitFor(boardReady, 20000, "board ready");
      },
      run: async function () {
        var trigger = visibleOne("button.logo-trigger");
        if (!trigger) throw new Error("no visible .logo-trigger");
        press(trigger);
        var vp = await waitFor(
          function () {
            return visibleOne(".gallery-viewport");
          },
          6000,
          ".gallery-viewport",
        );
        await sleep(900); // the deal's entry animation is not part of a drag
        var box = vp.getBoundingClientRect();
        var y = Math.round(box.top + box.height / 2);
        var x0 = Math.round(box.left + box.width * 0.8);
        var STEP = 12;
        var MOVES = 26;
        // A synthetic gesture that the app quietly ignored would still return a plausible
        // frame curve — of the deck sitting still. The reading carries its own proof of work:
        // where the deck was, where it ended, and whether it moved at all.
        var slFrom = vp.scrollLeft;
        var slPeak = slFrom;
        var out = await sampleFor(2400, async function () {
          pointer(vp, "pointerdown", x0, y);
          await sleep(16);
          // 12px per ~16ms ≈ 0.75 px/ms — past DRAG_SLOP on the first move and above
          // FLICK_VPX (0.45) at release, so the gesture exercises the flick branch too.
          for (var i = 1; i <= MOVES; i++) {
            pointer(window, "pointermove", x0 - i * STEP, y);
            if (Math.abs(vp.scrollLeft - slFrom) > Math.abs(slPeak - slFrom))
              slPeak = vp.scrollLeft;
            await sleep(16);
          }
          pointer(window, "pointerup", x0 - MOVES * STEP, y);
          await sleep(1100); // the glide settle
        });
        out.scrollLeftFrom = Math.round(slFrom);
        out.scrollLeftPeak = Math.round(slPeak);
        out.scrollLeftTo = Math.round(vp.scrollLeft);
        out.dragMoved = Math.abs(slPeak - slFrom) > 5;
        // leave the gallery so later scenarios see a board again
        try {
          var vp2 = visibleOne(".gallery-viewport");
          if (vp2) {
            key(vp2, "Escape");
            await waitFor(
              function () {
                return !visibleOne(".gallery-viewport");
              },
              5000,
              "gallery close",
            );
          }
        } catch (e) {
          out.teardownError = String((e && e.message) || e);
        }
        await sleep(600);
        return out;
      },
    },

    // DRAWER TOGGLE — the under-board glass drawer the owner marked five times, on its own
    // 520ms cubic-bezier(0.32,0.72,0,1) sweep. Two sweeps per window (shut, then open), so the
    // app ends the window in the state it entered it. Desk regime only: below 1024 the stacked
    // panel is the controls' home and `.drawer-tab` is `display:none` by rule, which the lookup
    // reports rather than silently measuring nothing.
    // MEASURED, UNPRICED: no floor in gates.json — see README, "the unpriced rows".
    drawerToggle: {
      prepare: async function () {
        await waitFor(boardReady, 20000, "board ready");
      },
      run: async function () {
        var tab = visibleOne(".drawer-tab");
        if (!tab)
          throw new Error(
            "no visible .drawer-tab — this regime has no drawer (under 1024, or landscape)",
          );
        // Same proof-of-work discipline as galleryDrag: a toggle the app ignored would still
        // hand back a frame curve, so the reading carries the state it actually moved through.
        var seen = [tab.getAttribute("aria-expanded")];
        var out = await sampleFor(2600, async function () {
          press(tab);
          await sleep(1150);
          var back = visibleOne(".drawer-tab");
          seen.push(back ? back.getAttribute("aria-expanded") : null);
          if (back) press(back);
          await sleep(1150);
        });
        var end = visibleOne(".drawer-tab");
        seen.push(end ? end.getAttribute("aria-expanded") : null);
        out.expandedTrail = seen;
        out.drawerMoved = seen[0] !== seen[1];
        return out;
      },
    },

    // ── P-W3 G3.3 ─────────────────────────────────────────────────────────────────────────
    // HOVER SWEEP — r3 §3.2's desktop-interaction jank, quantified. `.icon-btn` ships
    // `transition: all 150ms` alongside `filter: url(#grain-static)`, and `all` includes
    // `filter`: hover swaps it to `url(#wobble-celestial)`, `background`/`color` tween, and
    // every one of their ~9 frames repaints a REFERENCE-FILTERED HTML box on WebKit's CPU
    // path. `.section-heading:hover` is worse — it lives inside `.control-panel-filtered`, so
    // its swap re-runs a 3-pass 4-octave turbulence chain over the whole ~320×700 panel.
    //
    // A page cannot move a real pointer, so :hover cannot be provoked from in-page JS. The
    // probe therefore REPLAYS the app's own hover declarations: it reads each `*:hover` rule
    // out of the live CSSOM (media rules included — these are fenced behind
    // `@media (hover: hover)`) and re-declares its cssText under a `.rig-hover-probe` class,
    // then toggles that class across the control row. The probe copies, never asserts: after
    // P-W3 the copied text carries no `filter` and the base transition is narrowed, so the
    // SAME sweep measures the real delta rather than a rewritten one.
    hoverSweep: {
      // PINNED to 9×9 / Easy. The app restores its last board from localStorage, and
      // `solveWindow` leaves a 16×16 behind — a 256-glyph board turns this window from 68.9 fps
      // into 19.5 (measured, pw3-base-2 vs -3). A sweep gate has to sweep the same row twice.
      prepare: async function () {
        await waitFor(boardReady, 20000, "board ready");
        await ensurePanelOpen();
        var pick = function (label) {
          var b = visibleAll(".ctrl-btn").filter(function (x) {
            return (x.textContent || "").trim() === label;
          })[0];
          if (b) press(b);
          return !!b;
        };
        if (cellInputs().length !== 81) {
          var sig = boardSignature();
          pick("9×9");
          pick("Easy");
          await sleep(400);
          await dealTaps();
          await awaitNewBoard(sig, 20000);
        }
        await sleep(SETTLE);
      },
      run: async function () {
        // 1. Harvest the shipped hover rules for the surfaces the cure touches. Vue's scoped
        //    CSS rewrites `.icon-btn:hover` to `.icon-btn[data-v-hash]:hover`, so the match is
        //    "names one of these classes AND is a :hover rule", never a shape.
        var CLS = /\.(icon-btn|ctrl-btn|section-heading)\b/;
        var harvested = [];
        function scan(rules) {
          for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            if (r.cssRules && r.cssRules.length) scan(r.cssRules);
            if (r.selectorText && CLS.test(r.selectorText) && /:hover\b/.test(r.selectorText)) {
              harvested.push({ sel: r.selectorText, body: r.style.cssText });
            }
          }
        }
        for (var s = 0; s < document.styleSheets.length; s++) {
          try {
            scan(document.styleSheets[s].cssRules);
          } catch (e) {
            /* cross-origin sheet — the app's are all same-origin */
          }
        }
        // SPECIFICITY, the trap: Vue's scoped CSS rewrites the base rule to
        // `.icon-btn[data-v-hash]` = (0,2,0), so a plain `.rig-hover-probe` (0,1,0) loses and
        // the sweep silently measures nothing (first base pass read jankMs 0 for that reason).
        // Three chained classes = (0,3,0), appended last, so the replay actually lands.
        var PROBE_SEL = ".rig-hover-probe.rig-hover-probe.rig-hover-probe";
        var style = document.createElement("style");
        style.setAttribute("data-rig", "hover-probe");
        style.textContent = harvested
          .map(function (h) {
            return PROBE_SEL + "{" + h.body + "}";
          })
          .join("\n");
        document.head.appendChild(style);

        // 2. The sweep targets, in the order a pointer crossing the row would meet them.
        var targets = visibleAll(".icon-btn")
          .concat(visibleAll(".section-heading"))
          .concat(visibleAll(".ctrl-btn"));
        if (!targets.length) throw new Error("no visible hover targets in the control panel");

        // Census the surfaces BEFORE the window (a recalc here can't taint the sample).
        var filteredTargets = 0;
        for (var t = 0; t < targets.length; t++) {
          if (getComputedStyle(targets[t]).filter !== "none") filteredTargets++;
        }
        var hoverFilterDecls = harvested.filter(function (h) {
          return /filter\s*:/.test(h.body);
        }).length;
        var transitionAll = 0;
        for (var q = 0; q < targets.length; q++) {
          var cs = getComputedStyle(targets[q]);
          if (
            /(^|,|\s)all(\s|,|$)/.test(cs.transitionProperty) &&
            parseFloat(cs.transitionDuration) > 0
          )
            transitionAll++;
        }

        var out = await sampleFor(3000, async function () {
          // Two passes across the row, ~55ms dwell — a real sweep's cadence.
          for (var pass = 0; pass < 2; pass++) {
            for (var i = 0; i < targets.length; i++) {
              targets[i].classList.add("rig-hover-probe");
              await sleep(55);
              targets[i].classList.remove("rig-hover-probe");
            }
          }
        });
        style.remove();
        for (var c = 0; c < targets.length; c++) targets[c].classList.remove("rig-hover-probe");

        out.hoverTargets = targets.length;
        out.hoverRulesHarvested = harvested.length;
        out.hoverRulesCarryingFilter = hoverFilterDecls;
        out.baseFilteredTargets = filteredTargets;
        out.transitionAllTargets = transitionAll;
        return out;
      },
    },

    // SOLVE WINDOW — r3 §4.3. `ScribbleLoader` writes `stroke-dashoffset` every frame
    // (`animation: scribble-cycle 1000ms linear infinite`) on a `<path filter="url(#grain-static)">`,
    // so the reference filter re-executes ONCE PER FRAME for as long as the solve runs — on the
    // one surface the user is watching while waiting. The rate is what's measured:
    // `filterExecPerSec` = (elements carrying BOTH a running CSS animation and a live filter,
    // sampled once mid-window so the recalc can't taint the curve) × the window's own fps.
    //
    // What is measured is the RATE, not the duration. On this host the loader's window is
    // genuinely short — an M5 Max solves a 16×16 in ~12 ms, well under the flash guard — so a
    // slow poll misses it and a per-poll whole-document census FAKES a long window by hogging
    // the main thread so Vue can never unmount the loader (that artifact produced a bogus
    // "38 polls" reading; it is why the census below touches exactly one element). The probe
    // therefore polls at ~12 ms and, on the FIRST frame the loader exists, reads that one
    // element's computed `filter` and `animation-name`. A live reference filter under a
    // per-frame `stroke-dashoffset` write is one filter re-execution per painted frame, so the
    // rate is `1000 / p50` while the loader is up, and zero when the filter is gone.
    // Solve is pressed at the window's open and Deal at ~1.5 s — two independent `loading`
    // windows, since either arms the same component.
    solveWindow: {
      prepare: async function () {
        await waitFor(boardReady, 20000, "board ready");
        await ensurePanelOpen();
        var pick = function (label) {
          var b = visibleAll(".ctrl-btn").filter(function (x) {
            return (x.textContent || "").trim() === label;
          })[0];
          if (b) press(b);
          return !!b;
        };
        var sig = boardSignature();
        var stepped = pick("16×16");
        pick("Hard");
        await sleep(400);
        await dealTaps();
        await awaitNewBoard(sig, 20000);
        await sleep(900);
        if (!stepped) throw new Error("no visible 16×16 size option — cannot arm the loader");
      },
      run: async function () {
        var btn = byAria(/^Solve puzzle$/i);
        if (!btn) throw new Error("no visible Solve control");
        var POLL = 12;
        var census = null;
        var upPolls = 0;
        var firstAtMs = null;
        var source = null;
        var out = await sampleFor(3400, async function () {
          var t0 = performance.now();
          press(btn);
          source = "solve";
          var armedDeal = false;
          while (performance.now() - t0 < 3200) {
            var el = document.querySelector(".scribble-path");
            if (el) {
              upPolls++;
              if (!census) {
                // ONE element's computed style — not the document's.
                var cs = getComputedStyle(el);
                census = { filter: cs.filter, animationName: cs.animationName };
                firstAtMs = Math.round(performance.now() - t0);
              }
            }
            if (!armedDeal && performance.now() - t0 > 1500) {
              armedDeal = true;
              if (!upPolls) source = "deal";
              try {
                await dealTaps();
              } catch (e) {
                /* reported by loaderSeen */
              }
            }
            await sleep(POLL);
          }
        });
        out.loaderSeen = upPolls > 0;
        out.loaderUpMsApprox = upPolls * POLL;
        out.loaderFirstAtMs = firstAtMs;
        out.loaderSource = source;
        out.loaderFilter = census ? census.filter : null;
        out.loaderAnimation = census ? census.animationName : null;
        var live = !!census && census.filter !== "none" && census.animationName !== "none";
        out.loaderFiltered = census ? census.filter !== "none" : null;
        // The gate's number: one reference-filter re-execution per painted frame while the
        // loader's per-frame dash write runs — `1000 / p50` — and zero once the filter is gone.
        out.filterExecPerSec = census ? (live && out.p50 ? Math.round(1000 / out.p50) : 0) : null;
        return out;
      },
    },
  };

  /** Web-Animations census, split by playState — a `finished` fill-forwards animation is
   *  free, a `running` one at idle is a standing cost. The prior art's "35 cell-reveal
   *  CSSAnimations running at idle" lands in exactly this counter. */
  function animStates() {
    if (!document.getAnimations) return { supported: false };
    var out = { supported: true, total: 0, running: 0, paused: 0, finished: 0, idle: 0 };
    var list = document.getAnimations();
    out.total = list.length;
    for (var i = 0; i < list.length; i++) {
      var s = list[i].playState;
      if (out[s] === undefined) out[s] = 0;
      out[s]++;
    }
    return out;
  }

  // ── engine identity + the run ────────────────────────────────────────────
  function env() {
    var mq = function (s) {
      try {
        return window.matchMedia(s).matches;
      } catch (e) {
        return null;
      }
    };
    return {
      kind: "env",
      ua: navigator.userAgent,
      vendor: navigator.vendor,
      platform: navigator.platform,
      dpr: window.devicePixelRatio,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      screenW: screen.width,
      screenH: screen.height,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory === undefined ? null : navigator.deviceMemory,
      maxTouchPoints: navigator.maxTouchPoints,
      prefersReducedMotion: mq("(prefers-reduced-motion: reduce)"),
      prefersDark: mq("(prefers-color-scheme: dark)"),
      themePinned: THEME || null,
      // what the app actually RESTS at when env is posted — the pin's proof, not its promise
      htmlDark: document.documentElement.classList.contains("dark"),
      coarsePointer: mq("(pointer: coarse)"),
      ablated: !!ABLATE,
      ablateBytes: ABLATE.length,
      scenarios: ORDER,
      href: location.href,
    };
  }

  /** Post-run census — computed once, after every window, so the style recalc it forces
   *  can't perturb a measurement. */
  function census() {
    var filtered = 0,
      htmlFiltered = 0,
      willChange = 0,
      transitionAll = 0;
    var all = document.querySelectorAll("*");
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var cs;
      try {
        cs = getComputedStyle(el);
      } catch (e) {
        continue;
      }
      var f = cs.filter;
      if (f && f !== "none") {
        filtered++;
        if (!(el instanceof SVGElement)) htmlFiltered++;
      }
      if (cs.willChange && cs.willChange !== "auto") willChange++;
      // `transition-property` COMPUTES to "all" by default in WebKit — only a non-zero
      // duration makes an `all` transition real. Gate on both or the count is noise.
      if (
        (cs.transitionProperty || "").indexOf("all") === 0 &&
        (cs.transitionDuration || "0s") !== "0s"
      )
        transitionAll++;
    }
    return {
      kind: "census",
      nodes: all.length,
      filteredElements: filtered,
      filteredHtmlElements: htmlFiltered,
      willChangeElements: willChange,
      transitionAllElements: transitionAll,
      animStates: animStates(),
      posePairs: {
        boilPose: document.querySelectorAll(".boil-pose").length,
        restPose: document.querySelectorAll(".rest-pose").length,
        dtPose: document.querySelectorAll(".dt-pose").length,
      },
    };
  }

  var ATTEMPTS = Number(q.get("__attempts") || 3);

  /** One scenario, up to ATTEMPTS times, keeping the first window that ran with the page
   *  focused throughout. On this desktop other apps grab the front on their own schedule,
   *  and an occluded WebKit page has rAF SUSPENDED — the tell is a lone 1000ms+ delta at a
   *  window edge. Such a window is an artifact, not a measurement: re-take it. If every
   *  attempt is tainted, the least-tainted one is reported with tainted:true. */
  async function measure(name, spec) {
    var best = null;
    for (var attempt = 1; attempt <= ATTEMPTS; attempt++) {
      if (spec.prepare) await spec.prepare();
      // start only once the page actually holds focus
      try {
        await waitFor(
          function () {
            return document.hasFocus() && document.visibilityState === "visible";
          },
          30000,
          "page focus",
        );
      } catch (e) {
        /* measure anyway and let focusEvents tell the story */
      }
      await sleep(250);
      var t0 = performance.now();
      var out = await spec.run();
      out.scenario = name;
      out.startedAtMs = Math.round(t0);
      out.attempt = attempt;
      var clean = !out.focusEvents && out.hadFocus !== false;
      if (clean) {
        out.tainted = false;
        return out;
      }
      if (!best || (out.focusEvents || 0) < (best.focusEvents || 0)) best = out;
      if (attempt < ATTEMPTS) await sleep(1200);
    }
    best.tainted = true;
    return best;
  }

  async function run() {
    await post(env());
    for (var i = 0; i < ORDER.length; i++) {
      var name = ORDER[i];
      var spec = SCENARIOS[name];
      if (!spec) {
        await post({ scenario: name, error: "unknown scenario" });
        continue;
      }
      try {
        await post(await measure(name, spec));
      } catch (e) {
        await post({ scenario: name, error: String((e && e.stack) || e).slice(0, 1200) });
        // a failed control lookup is a DOM-state question — answer it on the spot
        try {
          var d = domDump();
          d.kind = "domDumpOnError";
          d.scenario = name;
          d.buttons = d.buttons.filter(function (b) {
            return b.aria;
          });
          await post(d);
        } catch (e2) {}
      }
      await sleep(500); // a beat of quiet between scenarios
    }
    try {
      await post(census());
    } catch (e) {
      await post({ kind: "census", error: String((e && e.message) || e) });
    }
    await post({ done: true });
    document.title = "PROBE DONE " + RUN;
  }

  window.addEventListener("error", function (e) {
    post({ kind: "pageError", error: String((e && e.message) || e) });
  });
  window.addEventListener("unhandledrejection", function (e) {
    post({ kind: "pageRejection", error: String((e && e.reason && e.reason.message) || e.reason) });
  });

  if (document.readyState === "complete") setTimeout(run, 0);
  else window.addEventListener("load", function () {
    setTimeout(run, 0);
  });
})();
