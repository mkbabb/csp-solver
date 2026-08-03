# W2 — THE ACCESS WAVE

A CRITICAL and a worse mobile analogue, both the same mechanism as W1: a control the
keyboard and the screen reader can reach, occluded or unannounced, with nothing marking it
so. Plus the multiplayer roster's silence.

## The defects

### A1 — focus lands under the sticky bar (CRITICAL)
Desktop 1440×900: Tab press #15 focuses the marks-mode "Normal" `.ctrl-btn`, which sits
100% covered (25/25 sample points) by the sticky `.action-verbs` bar. `:focus-visible` is
true; `.controls-card.scrollTop` stays 0 because geometrically the button *is* inside the
scrollport box the sticky bar overlays. A keyboard user gets a focus ring they cannot see.
Not `inert`, not `aria-hidden`.

### A2 — mobile analogue, worse (HIGH)
390×844 and 390×664, controls drawer open: four action buttons (Undo, Redo, Reveal hint,
peek) are 100% occluded by the drawer's own option row, and **none** is `inert` or
`aria-hidden` — all four stay in the tab order and the AX tree while fully hidden.

### A3 — the roster is silent (HIGH)
`<ul class="players-roster">` has no `aria-live`, no `role`, no live-region ancestor. A
joiner takes the roster 1→2 and a leaver 2→1 with no announcement. The one polite region
(`players-status`) is `v-if="!session.live.value"` — it is replaced by the roster the moment
the room comes up, so the live region exits the DOM exactly when people start arriving.

### A4 — the roster has no keyboard reach
`max-height:120px; overflow-y:auto; tabindex:null`. The owner's order is 16+ players; past
~5 rows the remainder is mouse/touch-scroll only (WCAG 2.1.1).

### A10 — thin contrast (advisory)
`.icon-sublabel` and `.ctrl-btn` measure 4.66:1 light against a 4.5 floor — 0.16 headroom.
Not a failure; a floor row so a future token nudge cannot cross 4.5 silently.

## The cures

- **A1:** `scroll-padding-bottom` on `.controls-card` equal to the sticky bar's height, so
  focus-scroll clears it.
- **A2:** apply `inert` to the covered action bar while the drawer is open — the estate
  already owns this mechanism (`GameGallery.vue:20` inerts the gallery flanks).
- **A3:** `role="log"` + `aria-live="polite"` + `aria-label` on the roster (a log's
  semantics are exactly "entries added over time"), so join/leave announce.
- **A4:** `tabindex="0"` on the roster scrollport, pairing with A3's `role="log"`.
- **A10:** a contrast floor row (see gate 2.3).
- **Q-4** (deferred from T6): `aria-describedby` on the play-together well, folded here.

## Gates

### Gate 2.1 — focus-occlusion census (born RED)
For every tabbable in the controls card, after `.focus()`, assert <50% painted occlusion.
Born RED on the desktop "Normal" button at `afc72ba1`; green after A1.

### Gate 2.2 — drawer-open inert census (born RED)
At 390×844 with the drawer open, assert zero tabbables at ≥99% occlusion (a covered control
must be `inert`, hence untabbable). Born RED on the four mobile buttons; green after A2.
Confirm on WebKit — the estate's own `a11y.spec.ts` books WebKit as the engine where `inert`
and `alertdialog` diverge, so A2's disposition needs a two-engine check.

### Gate 2.3 — roster-mutation announcement + contrast floor (born RED)
Two pages, `?wire=local`: on join and on leave, assert some live region's text changes.
Born RED (nothing announces today). Plus a contrast-floor row asserting `.icon-sublabel` /
`.ctrl-btn` clear 4.5:1 in both themes, with the `color-mix`/`color(srgb …)` resolver fix.

## Acceptance

A1/A2 cured and gated both engines; the roster announces and is keyboard-reachable; the
contrast floor lands; `aria-describedby` on the well. The a11y suite gains the three gates,
each born-RED-proven against the current build.
