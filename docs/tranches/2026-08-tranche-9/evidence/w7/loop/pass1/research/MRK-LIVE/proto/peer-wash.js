/**
 * MRK-LIVE pass-1 PROTOTYPE OVERLAY — THE PEER WASH AS A FILLED PATH.
 *
 * `.cell-peer` (DigitCell.vue:261-265, gameCell.css:132) is a bare `<div>` with a
 * `color-mix(--color-crayon-blue 7%)` background: a CSS box, so its edge σ is 0 BY
 * CONSTRUCTION — it has no geometry to measure, which is the half of R3-a that no amplitude
 * change can ever reach.
 *
 * The cure is not a parameter: it is giving the wash a HAND. Each washed cell gets a filled
 * closed path on its OWN cell seed (`42 + 500 + pos*7` — the same seed its ghost ring already
 * uses, so the wash and the ring are the same hand on the same square), `stroke: none`, filled
 * at the incumbent's own alpha. Zero filters, one path per washed cell — the same node count
 * the incumbent `<div>` already pays, not one more.
 */
(() => {
  const S = { gp: null, nodes: [], opacity: 0.07 };
  window.__peerWashState = S;

  window.__peerWash = {
    async init() {
      S.gp = await import(/* @vite-ignore */ "/src/pencil/grid/gridPaths.ts");
      return Object.keys(S.gp);
    },

    install(opts = {}) {
      S.opacity = opts.opacity ?? 0.07;
      const cells = Array.from(document.querySelectorAll(".game-cell"));
      const boardSize = Math.round(Math.sqrt(cells.length));
      const cellSize = 1000 / boardSize;
      let made = 0;
      for (const cell of cells) {
        const peer = cell.querySelector(".cell-peer");
        if (!peer) continue;
        const pos = cells.indexOf(cell);
        const ghost = cell.querySelector(".cell-ghost-path");
        if (!ghost) continue;
        const col = pos % boardSize;
        const row = Math.floor(pos / boardSize);
        const d = S.gp.generateRectBoilFrames(
          col * cellSize,
          row * cellSize,
          cellSize,
          cellSize,
          {
            roughness: 0.4,
            segments: boardSize >= 16 ? 2 : 4,
            seed: 42 + 500 + pos * 7,
            jagged: true,
          },
          0,
          2,
        )[0];
        // The wash needs its OWN svg: the ghost's svg lives inside `.cell-ghost`, which is
        // `opacity: 0` unless the cell is hovered or focused (gameCell.css:175-182) — a wash
        // parked there is invisible on exactly the peer cells it is for. Clone the ghost's svg
        // for its viewBox and its scope attribute, empty it, and hang it in `.cell-peer`'s own
        // box. One path per washed cell, the same node count the incumbent div already pays.
        const svg = ghost.ownerSVGElement.cloneNode(false);
        svg.setAttribute("class", "peer-wash-svg absolute inset-0 h-full w-full");
        svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;overflow:visible;";
        const p = ghost.cloneNode(false);
        p.setAttribute("d", d);
        p.classList.add("peer-wash-path");
        p.style.fill = "var(--color-crayon-blue)";
        p.style.fillOpacity = String(S.opacity);
        p.style.stroke = "none";
        svg.appendChild(p);
        peer.appendChild(svg);
        S.nodes.push(p);
        // Retire the CSS box so the two never compound.
        peer.style.background = "transparent";
        made++;
      }
      return {
        washedCells: made,
        pathNodesAdded: made,
        cssBoxesRetired: made,
        opacity: S.opacity,
      };
    },

    setOpacity(o) {
      S.opacity = o;
      for (const p of S.nodes) p.style.fillOpacity = String(o);
      return o;
    },

    remove() {
      for (const p of S.nodes) p.remove();
      S.nodes = [];
    },
  };
})();
