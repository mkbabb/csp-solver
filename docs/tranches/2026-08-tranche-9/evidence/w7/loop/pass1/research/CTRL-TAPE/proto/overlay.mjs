// T9-W7 pass 1 · CTRL-TAPE — THE PROTOTYPE OVERLAY.
//
// Replayable: `addStyleTag({content: OVERLAY_CSS})` + `evaluate(DOM_PATCH)` against a dev
// server. NOTHING under `src/` is touched. Every rule here is a candidate, not a ruling.
//
// The family's centre: the washi tape is the ONE heading voice and RANK IS WHERE THE TAPE IS
// STUCK — a group's tape astride its compartment's drawn top edge, a row's tape flat inside it,
// same tuple, same rung. Eight names, one voice, eight document headings.
//
// TOKEN NOTE (measured, and it corrects the charter): `--type-tag` has SIX consumers on this
// tree and only TWO of them are names —
//   GameControlPanel.vue:1612 `.zone-row-label`      NAME
//   SheetWashiLabel.vue:175   `.washi-tag`           NAME
//   GameControlPanel.vue:1661 `.player-row`          a roster slug
//   GameControlPanel.vue:1781 `.player-self/.players-status`  a status line
//   GameControlPanel.vue:1797 `.players-leave`       a CONTROL
//   GameControlPanel.vue:2406 `.heading-value`       a VALUE word
// Re-pointing `--type-tag → --type-heading` wholesale would draw the roster, the leave control
// and the closed tab's value at 25.888px. So the overlay mints `--type-name` and re-points the
// NAME sites at it; `--type-tag` keeps the four non-name consumers. VARIANT_NAIVE below is the
// charter's literal re-point, kept so the collision can be priced rather than asserted.

/** The name rung: φ, a fixed rem — a heading is an identity, never a clamp (R6 law 26). */
export const NAME_RUNG = "var(--type-heading)"; // 1.618rem = 25.888px

/** The charter's literal re-point, for the collision price only. */
export const VARIANT_NAIVE = `:root { --type-tag: var(--type-heading) !important; }`;

export const OVERLAY_CSS = `
/* ═══ A · THE ONE VOICE ══════════════════════════════════════════════════════════════════
   One tuple for all eight names: Patrick Hand · 25.888 · 500 · lowercase. The rung is the
   heading's φ identity, so it does not move with the viewport — the phone and the desk read
   the same name at the same size, which is what collapses the 1.0175 phone ratio. */
:root { --type-name: ${NAME_RUNG} !important; }

.controls-card .section-heading,
.controls-card .tray-well .washi-tag,
.controls-card .zone-row-label {
  font-family: var(--font-hand) !important;
  font-size: var(--type-name) !important;
  font-weight: 500 !important;
  text-transform: lowercase !important;
  letter-spacing: var(--type-tracking-wide) !important;
  line-height: 1.5 !important;
}

/* Washi is NEUTRAL by law (R6 §17), so the selected tier's crayon leaves the NAME and lives on
   the chip alone. The heading's muted/crayon two-ink split retires with it. */
.controls-card .section-heading,
.controls-card .zone-row-label {
  color: var(--color-foreground) !important;
}

/* ═══ B · THE ROW TAPE — flat INSIDE the compartment, left-aligned ════════════════════════
   The group's tape straddles the drawn edge ('.washi-tag', untouched geometry). A row's tape
   is the same tape laid flat on the paper inside the same compartment: same ground, same tear,
   same tuple — only the PLACE says "row". */
.controls-card .section-heading,
.controls-card .zone-row-label {
  display: block !important;
  align-self: flex-start !important;
  width: max-content !important;
  max-width: 100% !important;
  flex: 0 0 auto !important;
  margin: 0.1rem 0 0.1rem 0.35rem !important;
  padding: 0.02rem 0.4rem !important;
  text-align: left !important;
  background: var(--sheet-washi-neutral) !important;
  clip-path: polygon(3% 0%, 97.6% 6.4%, 100% 50%, 96.4% 93.1%, 2.1% 100%, 0% 50%) !important;
  transform: rotate(-0.8deg) !important;
}

/* The two staged rows ('size', 'level') live in the new-game compartment, so their tapes lie
   flat inside it exactly as 'marks' and 'candidates' do inside 'pencils'. */
.controls-card .staged-section { align-items: flex-start !important; }

/* A row caption is no longer a 3.75rem column — at the name rung "candidates" is 158px wide and
   the column was priced at 60. The row stacks at every width, which is the rail's own pose. */
.controls-card .zone-row { flex-direction: column !important; align-items: stretch !important; gap: 0 !important; }

/* ═══ C · THE HALF-LIFE STICKY LAW ═══════════════════════════════════════════════════════
   The tape's sticky containing block is a box spanning the TOP HALF of its well, so a tape
   unpins when its group is half gone and can never pin over another group's options.
   The wrapper is minted by the DOM patch; these are its declarations. */
.controls-card .washi-tag[data-released] {
  /* RELEASED: the tape stops pinning and goes back to riding its own well, so it leaves the
     card's pin band with the group it names. One attribute, no wrapper, no second box — the
     tape stays the well's direct first child, which is what the estate's own selectors
     ('.tray-well > .washi-tag', the r0 instrument, 'zone-grammar') address it by. */
  position: static !important;
}

/* ═══ D · THREE BUTTON TREATMENTS ════════════════════════════════════════════════════════
   BOXED — the primary act alone ('deal'), a drawn outline at the tongue's 2.5. The overlay
   draws it as pre-baked geometry (no live filter, budget untouched); the spec's own edge is
   'HandDrawnOutline :pose="0"'.
   BARE — every verb and tool: glyph rank + word, no ground, no border.
   CHIP — options only, on the seeded scribble they already wear. */
.controls-card .icon-btn.deal-btn { position: relative !important; border-radius: 0 !important; }
.controls-card .icon-btn.deal-btn > svg.proto-boxed { position: absolute; inset: -3px; overflow: visible; pointer-events: none; }

/* BARE: the estate's one drawn control border retires with the ring it drew. */
.controls-card .info-glyph {
  border: none !important;
  border-radius: 0 !important;
  width: auto !important;
  height: auto !important;
  color: var(--ink-press-quiet) !important;
}
.controls-card .players-leave { text-decoration: none !important; }

/* RADII: 0 on anything drawn, 8px on an invisible hit box. */
.controls-card .ctrl-btn { border-radius: 8px !important; }
.controls-card .info-btn { border-radius: 8px !important; }
.controls-card .mobile-heading-btn { border-radius: 8px !important; }
.controls-card .icon-btn:not(.deal-btn) { border-radius: 8px !important; }

/* HOVER IS THE INK LIFT ALONE — the 2.9-point fill retires (R6 law 14: one affordance, and a
   ground under a bare word is a fourth form). */
@media (hover: hover) {
  .controls-card .icon-btn:hover { background: transparent !important; color: var(--color-foreground) !important; }
}

/* FOCUS: the tongue's own ring, on every control in the card. The board keeps its drawn ring. */
.controls-card :is(button, [tabindex="0"]):focus-visible,
.drawer-tab:focus-visible {
  outline: 2px dashed currentColor !important;
  outline-offset: 3px !important;
}

/* ═══ E · THE MOBILE TABS AS TWO ROW-TAPES (§8) ══════════════════════════════════════════
   Two row-tapes side by side under the group's tape: the selected one PRESSED (0° tilt, full
   ink), the other LIFTED (±1.5°, 68%) with its value word riding its right end. The CSS
   'text-decoration' underline — the card's second "this one is on" grammar — dies. */
.controls-card .mobile-heading-row { gap: 0.5rem !important; justify-content: flex-start !important; padding-left: 0.35rem !important; }
.controls-card .mobile-heading-btn {
  flex-direction: row !important;
  align-items: center !important;
  gap: 0.35rem !important;
  min-width: var(--tap-floor, 44px) !important;
  min-height: var(--tap-floor, 44px) !important;
  padding: 0 !important;
}
.controls-card .mobile-heading-btn .section-heading { margin: 0 !important; }
.controls-card .mobile-heading-btn .section-heading.is-active { text-decoration: none !important; transform: rotate(0deg) !important; }
.controls-card .mobile-heading-btn:not(:has(.is-active)) .section-heading { opacity: 0.68 !important; transform: rotate(1.5deg) !important; }
.controls-card .heading-value { align-self: center !important; }

/* ═══ F · THE BAR AS A FIFTH COMPARTMENT (M04) ═══════════════════════════════════════════
   Drawn at the wells' own 1.5, with its own flow height reserved at the card's foot so it
   buries nothing, and sticky in ALL THREE scrollports (the landscape arm the sticky key is
   missing). The drawn edge is minted by the DOM patch as pre-baked geometry. */
.controls-card .action-bar { border-radius: 0 !important; }
.controls-card .action-bar > svg.proto-boxed { position: absolute; inset: -4px; overflow: visible; pointer-events: none; z-index: 0; }
.controls-card .action-bar > .action-verbs,
.controls-card .action-bar > .info-btn { position: relative; z-index: 1; }

/* THE LANDSCAPE ARM. 'scene.css''s sticky key is '(min-width:1024px), (max-width:1023.98px)
   and (orientation:portrait)'; W2 §2.2 made the landscape dock a THIRD scrollport and the key
   never learned it. One arm, and the bar sticks in all three. */
@media (max-width: 1023.98px) and (orientation: landscape) {
  .controls-card { overflow-y: auto; overscroll-behavior: contain; }
  .controls-card .action-bar { position: sticky !important; bottom: 0 !important; z-index: 60 !important; }
  .controls-card .action-bar::after {
    content: ""; position: absolute; inset: 100% 0 auto 0;
    height: var(--card-pad-b, 0px); background: var(--color-card);
  }
}

/* THE RESERVED FLOW HEIGHT. The card's foot grows by the bar's own height, so the band the
   bar occupies is padding the content can never enter (the 'scene.css' handle precedent and
   W2 §2.5's note-berth argument, one rung down). The skirt already paints '--card-pad-b'. */
.controls-card .control-panel-wrap { padding-bottom: var(--proto-bar-reserve, 0px) !important; }

/* ═══ G · THE 390 SEAM (M03 a) ═══════════════════════════════════════════════════════════
   '--sheet-chrome' gains the wordmark's own band plus 8px of air, so the case's 3px stroke
   stops below the wordmark's foot instead of grazing it. Derived, never spelled: the band is
   published by the DOM patch off the masthead's measured box. */
@media (max-width: 1023.98px) {
  .scene-controls { --sheet-chrome: var(--proto-sheet-chrome, 12rem) !important; }
}
`;

/**
 * THE DOM PATCH. Eight '<h2>' hosts on the 'display: contents' shape the mobile tab heads
 * already use ('GameControlPanel.vue:786-793'), the half-life containers, the two drawn edges,
 * and the derived '--sheet-chrome'.
 * Returns what it did, so the probe can assert the patch landed rather than assume it.
 */
export const DOM_PATCH = () => {
  const out = { hosts: 0, halflife: 0, boxed: 0, sheetChrome: null, barReserve: null };
  const card = document.querySelector(".controls-card");
  if (!card) return out;

  /* ── 1 · EIGHT DOCUMENT HEADINGS, on the 'display: contents' shape ──────────────────────
     A name that is the compartment's accessible name is also the document's heading for it.
     'display: contents' means the host is box-less: not one pixel moves. */
  /* A compartment's tape IS its heading, so the tape's own element becomes the '<h2>' rather
     than acquiring a wrapper: 'SheetWashiLabel' renders 'h2' at anchor="tag" instead of 'span'.
     Nothing nests, nothing moves, and every selector that addresses the tape still matches. */
  for (const el of card.querySelectorAll(".tray-well > .washi-tag")) {
    if (el.tagName === "H2") continue;
    const h = document.createElement("h2");
    for (const a of el.attributes) h.setAttribute(a.name, a.value);
    h.textContent = el.textContent;
    el.replaceWith(h);
    out.hosts++;
  }
  /* A row's caption is a span inside a row; it takes a box-less 'display: contents' host — the
     shape the mobile tab heads already use ('GameControlPanel.vue:786-793'). */
  for (const el of card.querySelectorAll(".section-heading, .zone-row-label")) {
    if (el.closest("h1,h2,h3,h4,h5,h6")) continue;
    const h = document.createElement("h2");
    h.className = "tape-host";
    h.style.display = "contents";
    el.parentNode.insertBefore(h, el);
    h.appendChild(el);
    out.hosts++;
  }

  /* ── 2 · THE HALF-LIFE RELEASE ─────────────────────────────────────────────────────────
     The law: a tape pins only while its group is at least half on screen. Implemented as the
     ONE attribute a released tape wears, driven off the card's own scroll — not as a wrapper
     box, because a wrapper stops the tape being the well's direct first child and every
     selector in the estate that addresses it ('.tray-well > .washi-tag', the r0 instrument,
     'zone-grammar.spec.ts') is written on that relation. The threshold is the law's own 0.5.
     A real implementation is an IntersectionObserver at threshold 0.5 on each well; the rAF
     loop here is the prototype's stand-in and reads the same geometry. */
  const cards = [...document.querySelectorAll(".controls-card")];
  const release = () => {
    for (const c of cards) {
      const cb = c.getBoundingClientRect();
      const top = cb.top + c.clientTop;
      const bottom = top + c.clientHeight;
      for (const tag of c.querySelectorAll(".tray-well > .washi-tag")) {
        const wb = tag.parentElement.getBoundingClientRect();
        const frac = Math.max(0, Math.min(wb.bottom, bottom) - Math.max(wb.top, top)) / Math.max(1, wb.height);
        if (frac < 0.5) tag.setAttribute("data-released", "");
        else tag.removeAttribute("data-released");
      }
    }
  };
  release();
  if (!window.__ctrlTapeRelease) {
    window.__ctrlTapeRelease = true;
    const loop = () => { release(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  out.halflife = document.querySelectorAll(".tray-well > .washi-tag").length;

  /* ── 3 · THE TWO DRAWN EDGES — pre-baked geometry, zero filters ────────────────────────
     A wobbled rectangle path, seeded, drawn once. Not a live filter, not a second BoilDivider:
     the budget stays 9 by exact match. The spec's own edge is 'HandDrawnOutline :pose="0"' at
     the same weights — this is the prototype's stand-in for it. */
  const mulberry = (a) => () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const wobbleRect = (w, h, seed, rough) => {
    const r = mulberry(seed);
    const j = () => (r() - 0.5) * rough * 2;
    const pts = [];
    const edge = (x0, y0, x1, y1) => {
      for (let i = 0; i <= 4; i++) {
        const t = i / 4;
        pts.push([x0 + (x1 - x0) * t + j(), y0 + (y1 - y0) * t + j()]);
      }
    };
    edge(0, 0, w, 0); edge(w, 0, w, h); edge(w, h, 0, h); edge(0, h, 0, 0);
    return "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L ") + " Z";
  };
  const drawEdge = (el, stroke, outset, seed) => {
    const b = el.getBoundingClientRect();
    if (!b.width || !b.height) return false;
    const w = b.width + outset * 2, h = b.height + outset * 2;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "proto-boxed outline-svg");
    svg.setAttribute("viewBox", "0 0 " + w.toFixed(1) + " " + h.toFixed(1));
    svg.setAttribute("aria-hidden", "true");
    svg.style.width = w + "px"; svg.style.height = h + "px";
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", wobbleRect(w, h, seed, 1.1));
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", String(stroke));
    p.setAttribute("stroke-linecap", "round");
    svg.appendChild(p);
    el.insertBefore(svg, el.firstChild);
    return true;
  };
  const bar = card.querySelector(".action-bar");
  if (bar && drawEdge(bar, 1.5, 4, 811)) out.boxed++;           // the FIFTH compartment, at the wells' 1.5
  const deal = card.querySelector(".icon-btn.deal-btn");
  if (deal && drawEdge(deal, 2.5, 3, 907)) out.boxed++;          // BOXED: the one primary act, at the tongue's 2.5

  /* ── 4 · THE BAR'S RESERVED FLOW HEIGHT ───────────────────────────────────────────────── */
  if (bar) {
    const bh = bar.getBoundingClientRect().height;
    card.style.setProperty("--proto-bar-reserve", bh.toFixed(2) + "px");
    out.barReserve = +bh.toFixed(2);
  }

  /* ── 5 · THE 390 SEAM — '--sheet-chrome' + the wordmark's band + 8px ───────────────────
     Derived off the masthead's own measured box, never spelled: the sheet's cap is everything
     above it that it must not reach, and the wordmark's band is part of that. */
  const mast = document.querySelector("svg.handwritten-logo")?.getBoundingClientRect();
  const sc = document.querySelector(".scene-controls");
  const caseEl = document.querySelector(".drawer-case");
  const caseOutline = caseEl && caseEl.querySelector(":scope > svg.outline-svg");
  if (mast && sc && caseOutline) {
    // resolve the shipped token in PIXELS through the engine rather than parsing "12rem"
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;height:var(--sheet-chrome)";
    sc.appendChild(probe);
    const shipped = probe.getBoundingClientRect().height;
    probe.remove();
    // the deficit is measured on the seam itself: where the case's drawn stroke lands against
    // the wordmark's own foot. + 8px of air on top of clearing it.
    const clearance = caseOutline.getBoundingClientRect().top - mast.bottom;
    const want = shipped + Math.max(0, 8 - clearance);
    sc.style.setProperty("--proto-sheet-chrome", want.toFixed(2) + "px");
    out.sheetChrome = {
      shippedPx: +shipped.toFixed(2),
      wordmarkBottom: +mast.bottom.toFixed(2),
      clearanceBefore: +clearance.toFixed(2),
      appliedPx: +want.toFixed(2),
    };
  }
  return out;
};
