/* T9-W8 §8.3 SPIKE — the owner-run device probe, in the shape it would take as a
 * lazily-imported `'self'` chunk behind `?__probe=1`. NOT WIRED INTO src/. Charter:
 * 8.3-device-instrument-charter.md.
 *
 * RUN (to see it, locally only): cd web/frontend && npx vite preview --outDir dist
 *   --port 4390 --strictPort --host 127.0.0.1, then paste this file into the page console.
 *   On the DEPLOYED edge the console is not available from a phone and a javascript:
 *   bookmarklet is blocked by `script-src 'self'` — which is why the landing is a query flag.
 *
 * Classic script, no build step, no dependency — the same constraint perf-rig/probe.js took.
 */
(function () {
  var M = {
    firstPaintMs: null, fcpMs: null, lcpMs: null, boardReadyMs: null,
    firstBakeMs: null, bakeLayers: 0, boardDrawnMs: null,
    firstToggleBlockingMs: null, secondToggleBlockingMs: null, drawerFlipMs: null,
    rafGapProxyTbtMs: null, worstRafGapMs: 0, transferBytes: 0, resourceCount: 0,
    ua: navigator.userAgent, dpr: devicePixelRatio, vp: innerWidth + "x" + innerHeight,
    cache: "undeclared", lowPowerOffDeclared: null, taint: [], engineNotes: [],
  };
  var gaps = [];

  // PAINT. Safari ships no `first-paint` entry — only FCP. Say NOT MEASURED, never 0.
  try {
    new PerformanceObserver(function (l) {
      l.getEntries().forEach(function (e) {
        if (e.name === "first-paint" && M.firstPaintMs === null) M.firstPaintMs = e.startTime;
        if (e.name === "first-contentful-paint" && M.fcpMs === null) M.fcpMs = e.startTime;
      });
    }).observe({ type: "paint", buffered: true });
  } catch (e) { M.engineNotes.push("no paint observer"); }
  try {
    new PerformanceObserver(function (l) {
      var es = l.getEntries(); M.lcpMs = es[es.length - 1].startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  } catch (e) { M.engineNotes.push("no LCP entry type on this engine"); }
  if ((PerformanceObserver.supportedEntryTypes || []).indexOf("longtask") < 0)
    M.engineNotes.push("NO longtask entry type — every blocking figure below is a rAF-GAP PROXY, not TBT");

  // TAINT. Occlusion suspends rAF outright in WebKit; the tell is a lone 1000-1300 ms delta.
  ["blur", "visibilitychange", "pagehide"].forEach(function (ev) {
    addEventListener(ev, function () { M.taint.push(ev + "@" + Math.round(performance.now())); }, true);
  });
  var last = performance.now();
  (function tick() {
    var n = performance.now(), g = n - last; last = n;
    if (g > 33.4) gaps.push({ at: n, ms: g });
    if (g >= 1000 && g <= 1300) M.taint.push("rafgap" + Math.round(g) + "@" + Math.round(n));
    requestAnimationFrame(tick);
  })();
  var proxyTbt = function (fromMs, toMs) {
    return Math.round(gaps.filter(function (g) { return g.at >= fromMs && g.at < toMs; })
      .reduce(function (s, g) { return s + Math.max(0, g.ms - 50); }, 0));
  };

  // BOARD-READY — the ONE W8 definition.
  function visible(el) {
    if (!el) return false;
    var c = getComputedStyle(el);
    if (c.display === "none" || c.visibility === "hidden") return false;
    var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0;
  }
  function boardReady() {
    var bg = null, all = document.querySelectorAll(".board-group");
    for (var i = 0; i < all.length; i++) if (visible(all[i])) { bg = all[i]; break; }
    if (!bg) return false;
    var cell = bg.querySelector('[class*="cell"]');
    if (!cell) return false;
    var r = cell.getBoundingClientRect(); return r.width > 0 && r.height > 0;
  }
  (function poll() {
    if (M.boardReadyMs === null && boardReady()) {
      requestAnimationFrame(function () { M.boardReadyMs = performance.now(); armBoil(); });
      return;
    }
    requestAnimationFrame(poll);
  })();

  // FIRST BAKE — the first .boil-frame-bitmap ever in the DOM (HandDrawnGrid.vue:386).
  new MutationObserver(function () {
    if (M.firstBakeMs === null && document.querySelector(".boil-frame-bitmap")) {
      M.firstBakeMs = performance.now();
      M.bakeLayers = document.querySelectorAll(".boil-frame-bitmap").length;
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  // BOARD-DRAWN (= first boil tick) — the first `is-active` MOVE between boil siblings.
  function armBoil() {
    var SEL = ".boil-frame-bitmap, .boil-frame", seed = new Map();
    document.querySelectorAll(SEL).forEach(function (el) { seed.set(el, el.classList.contains("is-active")); });
    new MutationObserver(function (recs) {
      if (M.boardDrawnMs !== null) return;
      for (var i = 0; i < recs.length; i++) {
        var el = recs[i].target;
        if (!el.matches || !el.matches(SEL)) continue;
        var now = el.classList.contains("is-active");
        if (seed.has(el) && seed.get(el) !== now) { M.boardDrawnMs = performance.now(); return; }
        seed.set(el, now);
      }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"], subtree: true });
  }

  // ── THE THREE TAPS, and the ONE EXPORT ──────────────────────────────────────────────
  // Rendered as a fixed card. Each button measures the gesture the owner actually makes:
  // the owner taps the app's OWN control, not a synthetic click, so the number is the number.
  var css = "position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));" +
    "z-index:2147483647;font:13px/1.35 -apple-system,system-ui,sans-serif;background:#111;color:#eee;" +
    "padding:10px;border-radius:10px;max-height:52vh;overflow:auto";
  var card = document.createElement("div");
  card.setAttribute("style", css);
  card.innerHTML =
    '<div><b>W8 device probe</b> — declare the load: ' +
    '<button data-c="cold">COLD</button> <button data-c="warm">WARM</button> ' +
    '<label><input type="checkbox" data-lp> Low Power Mode OFF</label></div>' +
    '<div style="margin:6px 0">1. <button data-t="toggle">TAP DARK TOGGLE ×2</button> ' +
    '2. <button data-t="drawer">TAP CONTROLS</button> ' +
    '3. <button data-t="copy">COPY JSON</button></div>' +
    '<pre data-out style="user-select:text;-webkit-user-select:text;white-space:pre-wrap;margin:0"></pre>';
  var out = function () {
    M.rafGapProxyTbtMs = proxyTbt(0, 3000);
    M.worstRafGapMs = gaps.length ? Math.round(Math.max.apply(null, gaps.map(function (g) { return g.ms; }))) : 0;
    var res = performance.getEntriesByType("resource");
    M.resourceCount = res.length;
    M.transferBytes = res.reduce(function (s, r) { return s + (r.transferSize || 0); }, 0);
    var o = {}; Object.keys(M).forEach(function (k) {
      o[k] = typeof M[k] === "number" ? Math.round(M[k] * 10) / 10 : M[k] === null ? "NOT MEASURED" : M[k];
    });
    card.querySelector("[data-out]").textContent = JSON.stringify(o);
    return JSON.stringify(o);
  };
  card.addEventListener("click", async function (ev) {
    var t = ev.target;
    if (t.dataset.c) { M.cache = t.dataset.c; out(); return; }
    if (t.dataset.t === "toggle") {
      var el = document.querySelector(".sun-moon-toggle"); if (!el) return;
      var a = performance.now(); el.click();
      await new Promise(function (r) { setTimeout(r, 1800); });
      M.firstToggleBlockingMs = proxyTbt(a, performance.now());
      var b = performance.now(); el.click();
      await new Promise(function (r) { setTimeout(r, 1800); });
      M.secondToggleBlockingMs = proxyTbt(b, performance.now());
      out(); return;
    }
    if (t.dataset.t === "drawer") {
      var tab = document.querySelector(".drawer-tab"); if (!tab) return;
      var c = performance.now();
      var obs = new MutationObserver(function () {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            M.drawerFlipMs = Math.round((performance.now() - c) * 10) / 10; obs.disconnect(); out();
          });
        });
      });
      obs.observe(tab, { attributes: true, attributeFilter: ["aria-expanded"] });
      tab.click(); return;
    }
    if (t.dataset.t === "copy") {
      // CLIPBOARD IS THE PATH. `navigator.share` is REFUSED by the deployed edge's own
      // Permissions-Policy (`web-share=()` — empty allowlist, self included). writeText is
      // already shipped on this origin (useGameState.ts:1011) and must fire IN the gesture.
      var json = out();
      try { await navigator.clipboard.writeText(json); t.textContent = "COPIED"; }
      catch (e) { t.textContent = "CLIPBOARD REFUSED — select the text below"; }
    }
  });
  card.addEventListener("change", function (ev) {
    if (ev.target.hasAttribute("data-lp")) { M.lowPowerOffDeclared = ev.target.checked; out(); }
  });
  addEventListener("load", function () { setTimeout(function () { document.body.appendChild(card); out(); }, 4000); });
})();
