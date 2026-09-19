/**
 * PLR-PLACE pass-1 PROTOTYPE — the seating chart, mounted without touching the product.
 *
 * Injected with `page.addScriptTag({ path })`. It defines `window.__PLC` and nothing else;
 * it mutates no product node and registers no listener on one. Every geometry number it
 * uses comes from the app's own modules, imported through the dev server:
 *
 *   · the frame path   `gridPaths.generateGridBoilFrames(...).frame[0]`  — pose 0, no beat,
 *                      no filter (the `:pose` discipline of HandDrawnOutline)
 *   · the peer inks    `playerIdentity.inkFor(index)` — the walk, as the room assigns it
 *
 * `__PLC.mount(opts)` returns the mounted element. `__PLC.clear()` removes everything it made.
 *
 * opts:
 *   size        CSS px of the square mark (24 = the masthead mark, 96 = the lobby chart)
 *   boardSize   9 | 16
 *   strokeUnits frame stroke in viewBox units (the board's own is 12)
 *   subgrid     draw the subgrid lines too
 *   dotUnits    dot RADIUS in viewBox units
 *   peers       [{ index, pos }] — ink index and cell position, the two things the wire carries
 *   host        element to append to
 */
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const made = [];
  let gp = null;
  let pi = null;

  async function modules() {
    if (!gp) gp = await import(/* @vite-ignore */ "/src/pencil/grid/gridPaths.ts");
    if (!pi) pi = await import(/* @vite-ignore */ "/src/games/shared/playerIdentity.ts");
    return { gp, pi };
  }

  function el(name, attrs, parent) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, String(attrs[k]));
    if (parent) parent.appendChild(n);
    return n;
  }

  async function mount(opts) {
    const {
      size = 24,
      boardSize = 9,
      subgridSize = boardSize === 16 ? 4 : 3,
      strokeUnits = 12,
      subgrid = false,
      dotUnits = 34,
      peers = [],
      host = document.body,
      label = "",
      ink = "var(--color-foreground)",
      className = "plc-mark",
    } = opts;
    const { gp, pi } = await modules();
    const bf = gp.generateGridBoilFrames(boardSize, subgridSize, 1000, 42, 4, 1.2, 0.6, 0.3);

    const wrap = document.createElement("span");
    wrap.className = className;
    wrap.style.cssText = `display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;line-height:0;`;
    if (label) wrap.setAttribute("aria-label", label);

    const svg = el("svg", {
      width: size,
      height: size,
      viewBox: "0 0 1000 1000",
      "aria-hidden": "true",
      focusable: "false",
    });
    svg.style.cssText = "display:block;overflow:visible;";
    el(
      "path",
      {
        d: bf.frame[0],
        fill: "none",
        stroke: ink,
        "stroke-width": strokeUnits,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      },
      svg,
    );
    if (subgrid) {
      for (const lines of bf.subgridLines)
        el(
          "path",
          {
            d: lines[0],
            fill: "none",
            stroke: ink,
            "stroke-width": strokeUnits * (8 / 12),
            "stroke-linecap": "round",
            opacity: 0.55,
          },
          svg,
        );
    }
    const pitch = 1000 / boardSize;
    for (const p of peers) {
      if (p.pos === null || p.pos === undefined) continue; // "looked away" paints nothing
      const r = Math.floor(p.pos / boardSize);
      const c = p.pos % boardSize;
      const style = pi.inkFor(p.index);
      const dot = el(
        "circle",
        {
          cx: (c + 0.5) * pitch,
          cy: (r + 0.5) * pitch,
          r: dotUnits,
          "data-index": p.index,
          "data-pos": p.pos,
          class: "plc-dot",
        },
        svg,
      );
      // the walk's own binding: a var rebind, exactly as the roster row does it. `fill` goes
      // on the STYLE, never the attribute — a presentation attribute does not parse `var()`.
      for (const k in style) dot.style.setProperty(k, style[k]);
      dot.style.fill = "var(--color-user-ink)";
    }
    wrap.appendChild(svg);
    host.appendChild(wrap);
    made.push(wrap);
    return wrap;
  }

  function clear() {
    for (const n of made) n.remove();
    made.length = 0;
  }

  window.__PLC = { mount, clear };
})();
