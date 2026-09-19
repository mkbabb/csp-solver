/**
 * MRK-LIVE pass-1 PROTOTYPE OVERLAY — ONE DRAWN RING OFF THE BOARD.
 *
 * Two mountings of the same mark, so the fork can be decided on a number rather than a taste:
 *
 *   mode "singleton"   — ONE <svg> at the document root, `position: fixed`, repositioned on
 *                        `focusin` from the focused element's rect. One node for the whole
 *                        estate; survives nothing that moves without telling it.
 *   mode "percontrol"  — the ring is appended INSIDE the focused control (position: absolute,
 *                        inset: -outset). It cannot lag, because it is carried by its host —
 *                        which is the six bespoke rules re-spelled as one component.
 *
 * Both draw the SAME geometry: `generateRectBoilFrames` px-native (the HandDrawnOutline
 * grammar — law 37), four poses on the page's own beat, zero filters.
 *
 * `follow: "focusin"` positions once. `follow: "raf"` re-measures every frame while any
 * transition or animation is running (the sheet's 520ms glide, the Teleport's reparent) — the
 * cheapest cure for the lag, and its cost is measured too.
 */
(() => {
  const S = {
    gp: null,
    svg: null,
    paths: [],
    target: null,
    mode: "singleton",
    follow: "focusin",
    outset: 4,
    strokeWidth: 2,
    frames: 4,
    beat: 0,
    mo: null,
    raf: 0,
    positions: 0,
    lastRect: null,
  };
  window.__houseRingState = S;

  const NS = "http://www.w3.org/2000/svg";

  function buildSvg() {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "house-focus-ring");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText =
      "position:fixed;left:0;top:0;pointer-events:none;z-index:9999;overflow:visible;";
    for (let f = 0; f < S.frames; f++) {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("fill", "none");
      p.setAttribute("stroke-linecap", "round");
      p.setAttribute("stroke-linejoin", "round");
      p.setAttribute("class", "house-focus-ring-pose");
      svg.appendChild(p);
      S.paths.push(p);
    }
    return svg;
  }

  function seedFor(el) {
    const k = (el.className || "") + "|" + (el.tagName || "");
    let h = 2166136261;
    for (let i = 0; i < k.length; i++) {
      h ^= k.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) % 100000;
  }

  window.__houseRing = {
    async init() {
      S.gp = await import(/* @vite-ignore */ "/src/pencil/grid/gridPaths.ts");
      return Object.keys(S.gp);
    },

    /** Kill every incumbent ring so the house ring is the only mark on the page. */
    suppressIncumbents() {
      const st = document.createElement("style");
      st.id = "house-ring-suppress";
      st.textContent = `
        .sun-moon-toggle:focus-visible, .logo-trigger:focus-visible,
        .drawer-tab:focus-visible, .game-card.is-center, .game-card:focus-visible,
        .staging-face, .guard-face,
        .ctrl-btn:focus-visible, .icon-btn:focus-visible, .info-btn:focus-visible,
        .attribution-trigger:focus-visible, a:focus-visible, button:focus-visible,
        [tabindex]:focus-visible { outline: none !important; }
        @media (forced-colors: active) {
          :focus-visible { outline: 2px solid Highlight !important; outline-offset: 2px !important; }
        }`;
      document.head.appendChild(st);
      return true;
    },

    position(el) {
      if (!el || !S.svg) return null;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return null;
      const o = S.outset;
      const w = r.width + o * 2;
      const h = r.height + o * 2;
      S.svg.style.left = `${r.left - o}px`;
      S.svg.style.top = `${r.top - o}px`;
      S.svg.setAttribute("width", String(w));
      S.svg.setAttribute("height", String(h));
      S.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      // Rebuild geometry only when the SIZE changes; a move is a style write, not a regen.
      const key = `${Math.round(w)}x${Math.round(h)}|${seedFor(el)}`;
      if (key !== S.lastKey) {
        S.lastKey = key;
        const sw = S.strokeWidth;
        const poses = S.gp.generateRectBoilFrames(
          sw / 2,
          sw / 2,
          w - sw,
          h - sw,
          { roughness: 0.5, segments: 6, seed: seedFor(el), jagged: true },
          0.45, // outlineBoilPx — the px-native boil constant, pencilConfig BOIL_CONFIG
          S.frames,
        );
        for (let f = 0; f < S.paths.length; f++) {
          S.paths[f].setAttribute("d", poses[f]);
          S.paths[f].setAttribute("stroke-width", String(sw));
        }
      }
      S.positions++;
      S.lastRect = [r.left, r.top, r.width, r.height];
      return S.lastRect;
    },

    show(el) {
      if (S.mode === "percontrol") {
        this.hide();
        const host = el;
        const cs = getComputedStyle(host);
        if (cs.position === "static") host.style.position = "relative";
        S.svg = buildSvg();
        S.svg.style.cssText =
          "position:absolute;left:0;top:0;pointer-events:none;overflow:visible;";
        S.svg.style.left = `${-S.outset}px`;
        S.svg.style.top = `${-S.outset}px`;
        host.appendChild(S.svg);
        S.target = el;
        const r = host.getBoundingClientRect();
        const w = r.width + S.outset * 2;
        const h = r.height + S.outset * 2;
        S.svg.setAttribute("width", String(w));
        S.svg.setAttribute("height", String(h));
        S.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        const sw = S.strokeWidth;
        const poses = S.gp.generateRectBoilFrames(
          sw / 2,
          sw / 2,
          w - sw,
          h - sw,
          { roughness: 0.5, segments: 6, seed: seedFor(el), jagged: true },
          0.45,
          S.frames,
        );
        for (let f = 0; f < S.paths.length; f++) {
          S.paths[f].setAttribute("d", poses[f]);
          S.paths[f].setAttribute("stroke-width", String(sw));
        }
        S.positions++;
        this.paint(S.beat);
        return true;
      }
      if (!S.svg) {
        S.svg = buildSvg();
        document.body.appendChild(S.svg);
      }
      S.target = el;
      S.svg.style.display = "";
      this.position(el);
      this.paint(S.beat);
      return true;
    },

    hide() {
      if (S.mode === "percontrol" && S.svg) {
        S.svg.remove();
        S.svg = null;
        S.paths = [];
      } else if (S.svg) {
        S.svg.style.display = "none";
      }
      S.target = null;
    },

    paint(f) {
      for (let i = 0; i < S.paths.length; i++)
        S.paths[i].style.opacity = i === f % S.paths.length ? "1" : "0";
    },

    setInk(stroke) {
      for (const p of S.paths) p.setAttribute("stroke", stroke);
    },

    install(opts = {}) {
      S.mode = opts.mode ?? "singleton";
      S.follow = opts.follow ?? "focusin";
      S.outset = opts.outset ?? 4;
      S.strokeWidth = opts.strokeWidth ?? 2;
      S.frames = opts.frames ?? 4;
      const ink = opts.ink ?? "var(--color-focus-sketch, #3a7bc4)";

      document.addEventListener(
        "focusin",
        (e) => {
          const el = e.target;
          if (!(el instanceof Element)) return;
          this.show(el);
          this.setInk(ink);
        },
        true,
      );
      document.addEventListener("focusout", () => this.hide(), true);

      // The beat: the grid's own active pose carrier, never a new timer.
      const carriers = Array.from(
        document.querySelectorAll(".boil-frame-bitmap, .boil-frame-layer"),
      );
      if (carriers.length) {
        S.mo = new MutationObserver(() => {
          const f = carriers.findIndex((e) =>
            e.classList.contains("is-active"),
          );
          if (f < 0 || f === S.beat) return;
          S.beat = f;
          this.paint(f);
        });
        for (const c of carriers)
          S.mo.observe(c, { attributes: true, attributeFilter: ["class"] });
      }

      // EVENT-DRIVEN follow — the estate-shaped cure. Nothing ticks while nothing moves:
      // a capture-phase `scroll`, a `resize`, and a ResizeObserver on the focused control.
      // Zero idle cost, against `follow: "raf"`'s permanent subscriber (boilBeat.ts's thesis:
      // one continuous writer is what the shared beat exists to avoid).
      if (S.follow === "events" && S.mode === "singleton") {
        const reposition = () => {
          if (S.target && S.svg && S.svg.style.display !== "none")
            this.position(S.target);
        };
        window.addEventListener("scroll", reposition, {
          capture: true,
          passive: true,
        });
        window.addEventListener("resize", reposition, { passive: true });
        S.ro = new ResizeObserver(reposition);
        document.addEventListener(
          "focusin",
          (e) => {
            S.ro.disconnect();
            if (e.target instanceof Element) S.ro.observe(e.target);
            S.ro.observe(document.documentElement);
          },
          true,
        );
      }

      if (S.follow === "raf" && S.mode === "singleton") {
        const tick = () => {
          if (S.target && S.svg && S.svg.style.display !== "none")
            this.position(S.target);
          S.raf = requestAnimationFrame(tick);
        };
        S.raf = requestAnimationFrame(tick);
      }
      return {
        mode: S.mode,
        follow: S.follow,
        outset: S.outset,
        strokeWidth: S.strokeWidth,
        reachPx: S.outset + S.strokeWidth,
        beatCarriers: carriers.length,
      };
    },

    stats() {
      return {
        positions: S.positions,
        mode: S.mode,
        follow: S.follow,
        beat: S.beat,
        lastRect: S.lastRect,
        ringRect: S.svg
          ? (() => {
              const r = S.svg.getBoundingClientRect();
              return [r.left, r.top, r.width, r.height];
            })()
          : null,
      };
    },
  };
})();
