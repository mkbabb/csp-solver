/**
 * NOTE-LEDGER pass-1 PROTOTYPE OVERLAY — replayable, product untouched.
 *
 * Paste into `page.evaluate` (or a devtools console) on a live board. It mounts the ledger in
 * its ONE surviving construction: the strip keeps its single reserved line in flow, and the
 * OLDER notes hang out of flow underneath it, gapless, each one rung down the ink ramp.
 *
 * Measured consequences of exactly this shape (chromium + webkit, 390×844 / 393×699 /
 * 390×664 / 360×740):
 *   · the board does not move (board.y identical at every depth)
 *   · two notes clear the fold's ribbon by 4.80px
 *   · three notes cover the ribbon by 16.00px  ← the kill
 *
 * `window.__ledger(n)` mounts n notes; `window.__ledger(1)` takes it down.
 */
(() => {
  const TEXTS = [
    "only 8 fits here",
    "that's a given clue",
    "check row 4",
    "the board is clear",
    "solved it!",
  ];
  // The ramp: full ink, then quiet (68% — 5.18:1 light / 6.11:1 dark, AA for text), then rule
  // (55% — 3.51:1 light / 4.37:1 dark, SUB-AA for text in BOTH themes, drawn here only so the
  // third rung can be seen failing).
  const RAMP = ["", "var(--ink-press-quiet)", "var(--ink-press-rule)"];

  window.__ledger = (depth = 2) => {
    const strip = document.querySelector(".board-margin");
    const live = strip && strip.querySelector(".margin-note-block");
    if (!strip || !live) return "no margin on this page";
    document.querySelectorAll("[data-ledger-old]").forEach((e) => e.remove());
    const liveInk = live.querySelector(".margin-note-ink");
    if (liveInk) liveInk.textContent = TEXTS[0];
    if (depth < 2) return "one note (the product's own berth)";

    strip.style.position = "relative";
    const host = document.createElement("div");
    host.setAttribute("data-ledger-old", "host");
    host.style.cssText =
      "position:absolute;top:100%;left:0;right:0;pointer-events:none;display:flex;flex-direction:column;gap:0";
    for (let i = 0; i < depth - 1; i++) {
      const clone = live.cloneNode(true);
      clone.setAttribute("data-ledger-old", String(i));
      const p = clone.querySelector(".margin-note");
      const ink = clone.querySelector(".margin-note-ink");
      ink.textContent = TEXTS[i + 1];
      ink.style.animation = "none"; // an older line does not re-write itself in
      p.removeAttribute("role"); // ONE live region on the strip, always
      p.removeAttribute("aria-live");
      p.style.color = RAMP[Math.min(i + 1, RAMP.length - 1)];
      host.appendChild(clone);
    }
    strip.appendChild(host);
    return `${depth} notes mounted`;
  };

  /**
   * THE PUSH — FLIP, and law 6 forces that order: every verb fills `backwards`, never
   * `forwards`, so the layout lands first and the motion plays FROM the vacated row.
   * Measured: settles 208.9ms chromium / 225.0ms webkit on the 250ms curve, travel 27.19px,
   * zero glyph filters, zero glyph transforms, PRM collapses to a same-frame step.
   */
  window.__ledgerPush = (text = "check row 4") => {
    const strip = document.querySelector(".board-margin");
    const host = strip && strip.querySelector('[data-ledger-old="host"]');
    const live = strip && strip.querySelector(".margin-note-block");
    if (!strip || !host || !live) return "mount the ledger first";
    const step = 20.8; // one line box, gapless
    const ease =
      getComputedStyle(document.documentElement).getPropertyValue("--ease-noteWrite").trim() ||
      "ease";
    const prm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = prm ? 0 : 250;

    const demoted = live.cloneNode(true);
    demoted.setAttribute("data-ledger-old", "pushed");
    demoted.querySelector(".margin-note").style.color = "var(--ink-press-quiet)";
    demoted.querySelector(".margin-note-ink").style.animation = "none";
    demoted.querySelector(".margin-note").removeAttribute("role");
    demoted.querySelector(".margin-note").removeAttribute("aria-live");
    host.insertBefore(demoted, host.firstChild);
    while (host.children.length > 1) host.removeChild(host.lastChild); // depth 2, hard

    live.querySelector(".margin-note-ink").textContent = text;
    Array.from(host.children).forEach((l) =>
      l.animate([{ transform: `translateY(-${step}px)` }, { transform: "translateY(0)" }], {
        duration: dur,
        easing: ease,
        fill: "backwards",
      }),
    );
    live.animate(
      [
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0 0 0)" },
      ],
      { duration: dur, easing: ease, fill: "backwards" },
    );
    return "pushed";
  };
})();
