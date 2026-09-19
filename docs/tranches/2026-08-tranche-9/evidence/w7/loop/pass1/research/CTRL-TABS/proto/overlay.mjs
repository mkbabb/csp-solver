// CTRL-TABS · THE PROTOTYPE OVERLAY, banked so the next pass can replay it.
// Pure `addStyleTag` + `page.evaluate`: no product file is touched, no worktree was needed.
// Exported as two strings + one builder so probes can import them.

export const CSS = `
/* THE HEADING IS THE TAB — the in-tray tape stops carrying the name. */
[data-proto-hidden-tag] { display: none !important; }
[data-proto-gone] { display: none !important; }
[data-proto-show] { display: flex !important; }
.tray-well[data-proto-off] { display: none !important; }

/* TRIM ARM — what the family's own moves take OUT of the card:
   · undo/redo/hint leave for the board-edge strip (one tool home)
   · the hold-to-peek BoilDivider retires with the zone it separated
   · the deal verb lands on the floor beside clear/fill/solve/share  */
.proto-trim .play-controls { display: none !important; }
.proto-trim .peek-hold-surface { display: none !important; }
.proto-trim .deal-row { display: none !important; }

.proto-tablist {
  display: flex;
  align-items: flex-end;
  gap: 0.25rem;
  width: 100%;
  margin: 0 0 -1.5px 0;
  padding: 0;
}
.proto-tab {
  flex: 1 1 auto;
  min-width: var(--tap-floor, 2.75rem);
  min-height: var(--tap-floor, 2.75rem);
  display: flex; align-items: center; justify-content: center;
  padding: 0.35rem 0.25rem;
  background: none; border: none; cursor: pointer;
}
.proto-tab-word {
  font-family: var(--font-hand);
  font-size: var(--type-tag);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  line-height: 1.1; white-space: nowrap;
  color: var(--ink-press-quiet);
}
.proto-tab.is-selected .proto-tab-word { color: var(--color-foreground); }

/* ARM (a) — THE DRAWER TONGUE'S IDIOM: a --color-card tongue, one-sided radius, the raised
   one continuous with the tray. (The 1.5/2.5 CSS borders here STAND IN for HandDrawnOutline
   :pose="0"; the spec mints the real drawn geometry — law 37.) */
.proto-arm-tongue .proto-tab {
  background: var(--color-card);
  border: 1.5px solid var(--ink-press-rule);
  border-bottom: none;
  border-radius: 0.75rem 0.75rem 0 0;
  opacity: 0.68;
}
.proto-arm-tongue .proto-tab.is-selected {
  opacity: 1; border-width: 2.5px; border-bottom: none;
  margin-bottom: -2.5px; padding-bottom: calc(0.35rem + 2.5px);
}

/* ARM (b) — THE WASHI TAPE PROMOTED: flat quiet tapes, the selected one pulled out at its
   own ±1.5° tilt at full ink. */
.proto-arm-tape .proto-tab {
  background: var(--sheet-washi-neutral);
  clip-path: polygon(4% 2%, 96% 0%, 100% 50%, 97% 94%, 5% 100%, 0% 52%);
  opacity: 0.68; border: none;
}
.proto-arm-tape .proto-tab.is-selected { opacity: 1; transform: rotate(-1.5deg) translateY(-3px); }

/* THE FLOOR — the bar drawn as the tray's own foot rather than a colour plane. */
.action-bar { border-top: 2.5px solid var(--ink-press-rule) !important; }
`;

/** arm: "tongue" | "tape"; trim: also take the family's own moves out of the card. */
export function build(opts) {
  const { arm = "tongue", trim = true } = opts || {};
  const wrap = document.querySelector(".control-panel-wrap");
  const card = document.querySelector(".controls-card");
  if (!wrap || !card) return { error: "no card" };
  if (trim) card.classList.add("proto-trim");
  if (document.querySelector(".proto-tablist")) return { ok: "already" };

  const trays = Array.from(document.querySelectorAll(".tray-well"));
  const names = trays.map((t) => (t.querySelector(".washi-tag")?.textContent || "?").trim());

  for (const t of trays) t.querySelector(".washi-tag")?.setAttribute("data-proto-hidden-tag", "1");
  document.querySelector(".mobile-heading-row")?.setAttribute("data-proto-gone", "1");

  // size + level become two ROWS inside `new game`, in the ESTATE'S OWN row shape — the
  // `pencils` tray's `.zone-row` (caption beside the chips on a phone, `.zone-row-stacked`
  // on the narrow rail). No new mechanic: the markup is `pencils`, copied.
  const filtered = document.querySelector(".control-panel-filtered");
  const stacked = !document.querySelector(".mobile-heading-row") && !opts?.forceInline; // desk rail
  if (filtered) {
    const sels = Array.from(filtered.querySelectorAll(".ctrl-options"));
    const labels = ["size", "level"];
    sels.forEach((s, i) => {
      s.setAttribute("data-proto-show", "1");
      const host = s.closest(".staged-section") || s;
      // THE SCOPE ATTRIBUTE IS LOAD-BEARING: `.zone-row` lives in a `<style scoped>` block, so
      // a div minted without the component's `data-v-…` hash gets NONE of it (measured: the row
      // computed `display: block`, the caption fell to its own line and cost 24px a row).
      const donor = document.querySelector(".zone-row");
      const scopeAttrs = donor
        ? Array.from(donor.attributes).filter((a) => a.name.startsWith("data-v-"))
        : [];
      const row = document.createElement("div");
      for (const a of scopeAttrs) row.setAttribute(a.name, a.value);
      row.className = "zone-row proto-row" + (stacked ? " zone-row-stacked" : "");
      row.setAttribute("role", "group");
      const cap = document.createElement("span");
      for (const a of scopeAttrs) cap.setAttribute(a.name, a.value);
      cap.className = "zone-row-label proto-row-label";
      cap.textContent = labels[i] ?? "row";
      host.parentElement.insertBefore(row, host);
      row.appendChild(cap);
      row.appendChild(host);
      host.querySelector?.(".section-heading")?.closest("h2")?.setAttribute("data-proto-gone", "1");
    });
  }

  // DEAL onto the floor, beside clear · fill · solve · share.
  if (trim) {
    const verbs = document.querySelector(".action-verbs");
    const deal = document.querySelector(".deal-btn");
    if (verbs && deal) {
      const clone = deal.cloneNode(true);
      clone.className = "icon-btn proto-floor-deal";
      verbs.insertBefore(clone, verbs.firstChild);
    }
    // peek to the floor beside share
    const peek = document.querySelector(".peek-chip");
    if (verbs && peek) verbs.appendChild(peek);
  }

  const strip = document.createElement("div");
  strip.className = `proto-tablist proto-arm-${arm}`;
  strip.setAttribute("role", "tablist");
  strip.setAttribute("aria-label", "controls");
  const tabs = names.map((n, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "proto-tab";
    b.setAttribute("role", "tab");
    b.id = `proto-tab-${i}`;
    b.setAttribute("aria-controls", `proto-panel-${i}`);
    const w = document.createElement("span");
    w.className = "proto-tab-word";
    w.textContent = n;
    b.appendChild(w);
    strip.appendChild(b);
    return b;
  });
  trays.forEach((t, i) => {
    t.id = `proto-panel-${i}`;
    t.setAttribute("role", "tabpanel");
    t.setAttribute("aria-labelledby", `proto-tab-${i}`);
  });
  wrap.insertBefore(strip, wrap.firstChild);

  const select = (i) => {
    tabs.forEach((b, j) => {
      const on = i === j;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      b.classList.toggle("is-selected", on);
    });
    trays.forEach((t, j) => {
      const on = i === j;
      t.toggleAttribute("data-proto-off", !on);
      if (on) t.removeAttribute("inert");
      else t.setAttribute("inert", "");
    });
    window.__protoSelected = i;
  };
  strip.addEventListener("keydown", (e) => {
    const cur = window.__protoSelected ?? 0;
    const n = tabs.length;
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (cur + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (cur - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next !== null) {
      e.preventDefault();
      select(next);
      tabs[next].focus();
    }
  });
  tabs.forEach((b, i) => b.addEventListener("click", () => select(i)));
  window.__protoSelect = select;
  select(0);
  return { ok: true, names };
}
