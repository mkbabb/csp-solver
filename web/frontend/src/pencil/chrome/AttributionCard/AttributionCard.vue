<script setup lang="ts">
import CrayonHeart from "./CrayonHeart.vue";
import { useHoverCard } from "./useHoverCard";
// T4-W8 ROW 5 (FAM-14) — the author avatar, BUNDLED. Imported so Vite emits it content-hashed
// under /assets/ (immutable-cached per public/_headers) and serves it same-origin; the resolved
// URL is inlined here. This retires the app's SOLE third-party network hit (see the <img> note).
import avatarUrl from "./avatar.png";
// T6 mark 16 — the hidden DEBUG disclosure. This card IS the hiding place: it's already a
// hover/focus-within card, so the toggle costs no new chrome and no settings surface.
import { useDebug } from "@/composables/useDebug";

defineProps<{
  mobile?: boolean;
}>();

const { isOpen, toggle, close, onHoverEnter, onHoverLeave } = useHoverCard();

const debug = useDebug();

defineExpose({ close });
</script>

<template>
  <div
    :class="mobile ? 'mobile-attribution md:hidden' : 'corner-left hidden md:block'"
    @mouseenter="onHoverEnter"
    @mouseleave="onHoverLeave"
    @focusin="onHoverEnter"
    @focusout="onHoverLeave"
  >
    <button
      type="button"
      class="attribution-trigger text-muted-foreground hover:text-foreground font-mono text-sm transition-colors duration-200"
      :aria-expanded="isOpen"
      aria-label="Show attribution card"
      @click.stop="toggle"
      @keydown.enter.stop="toggle"
    >
      @mbabb
    </button>
    <!-- `@click.stop` sits on the DISCLOSURE, not on each control inside it. App.vue's root
         carries `@click="closeAll"` as the outside-click dismissal, and a click on anything in
         here that did not stop reached it and shut the card under the finger — measured on both
         GitHub links, both engines. The trigger and the debug toggle had each been given their
         own `.stop`; two links had not, and a per-control stance that has to be remembered per
         control is the shape of the defect rather than its cure. Closed, this box is
         `pointer-events: none` (below), so it can never swallow an outside click. -->
    <div class="hover-card" :class="{ 'is-open': isOpen }" @click.stop>
      <div class="flex items-center gap-3">
        <!-- T4-W8 ROW 5 (FAM-14): the author avatar is BUNDLED — a 64px PNG (6 KB) imported
             through Vite (above), emitted content-hashed under /assets/ and served same-origin.
             This retires the app's SOLE third-party network hit: the
             `avatars.githubusercontent.com` img-src allowance is GONE from the CSP, so the whole
             app is now `img-src 'self' data:` — zero per-game outbound dependency (ties W3's
             no-telemetry-by-design). The prior remote-fetch hardening (`?s=64`, `no-referrer`) is
             moot self-hosted; `loading="lazy"` + `decoding="async"` still keep it off first paint. -->
        <img
          :src="avatarUrl"
          alt="mkbabb"
          class="h-10 w-10 rounded-full"
          width="40"
          height="40"
          loading="lazy"
          decoding="async"
        />
        <div class="flex-1">
          <a
            href="https://github.com/mkbabb"
            target="_blank"
            rel="noopener noreferrer"
            class="text-foreground font-mono text-sm font-semibold hover:underline"
            >@mbabb</a
          >
          <!-- T4-W8 ROW 5 parity: game-agnostic copy. The card mounts app-level (App.vue, both
               games), so it must name neither — a "Sudoku solver" line lied on Futoshiki. Twin of
               index.html's game-agnostic social head. -->
          <p class="text-muted-foreground mt-0.5 text-xs italic">
            logic puzzles, solved in your browser
          </p>
        </div>
        <CrayonHeart :size="32" />
      </div>
      <hr class="border-border/50 my-2" />
      <a
        href="https://github.com/mkbabb/csp-solver"
        target="_blank"
        rel="noopener noreferrer"
        class="text-foreground block text-sm hover:underline"
        >View the project on GitHub</a
      >
      <!-- T6 mark 16 — the DEBUG disclosure. `@click.stop` matches the trigger's stance, so
           the card stays open across the toggle on a fine pointer; the card's own
           focus-within disclosure puts it on the Tab walk right after the GitHub link. The
           coarse self-close this row diagnosed is cured in TWO places, because the tap fired
           two closers and each was sufficient on its own: the bubbling click above, and
           `useHoverCard`'s pending-close timer, which `onHoverEnter` now cancels BEFORE the
           coarse gate rather than after it. -->
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground mt-1 block font-mono text-xs"
        :aria-pressed="debug"
        @click.stop="debug = !debug"
      >
        debug · {{ debug ? "on" : "off" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* THE HEAD LINE (T6.2 mark C) — @mbabb and the sun sit on ONE horizontal line, at every width.
   Both poses are the same pose now, so they are written once: pinned to the page's left edge
   (the inset from it comes from `.attribution-trigger`'s own padding, not a gap on this
   wrapper, so the hit target fills the corner instead of floating in it) and centred on the
   toggle's own middle — `--toggle-size` is declared on the page root, so this reads the head's
   one metric rather than restating its three rungs. `translate` rather than a margin: it takes
   the trigger's OWN height out of the maths, so the line holds whatever the type does.

   The mobile pose LEAVES THE FLOW to get here. It used to ride `.board-group`'s top, a whole
   assembly below the sun, which is what put the two marks 93px apart on a phone; out of flow it
   is at the head where it belongs and mark 9's centring gets the ~46px back for the board. */
.corner-left,
.mobile-attribution {
  position: fixed;
  top: calc(var(--toggle-size, 5rem) / 2);
  left: 0;
  translate: 0 -50%;
  z-index: 40;
  cursor: pointer;
}

/* Real <button> semantics (the a11y fix): reset it back to the inline text trigger.
   font-family used to be `inherit`, which Vue's scoped [data-v-xxx] attribute selector
   (specificity 0,2,0) defeated the template's `font-mono` utility (0,1,0) with — the
   button silently inherited body{}'s Fraunces serif instead of rendering mono. Naming
   the token directly here (with the Fira Code chain as its fallback, since no consumer
   in src/ defines --font-mono yet) both breaks that specificity trap and keeps the
   correct face live today, ready to pick up the real token the moment it's defined.
   Padding: 0 → √φ-ladder rungs (0.618rem block / 0.786rem inline, r = 1.272) — enough
   room for a real ~44px-ish tap target; paired with .corner-left's flush 0/0 above,
   the visible "@mbabb" lands almost exactly where it did before, just no longer glued
   to the literal pixel corner. */
.attribution-trigger {
  background: transparent;
  border: none;
  padding: 0.618rem 0.786rem;
  cursor: pointer;
  font-family: var(--font-mono, "Fira Code", monospace);
}

/* The app's accidental proto-vellum: 80% popover, blur-0 (OD-1 / design-union UD2 —
   the prior blur(12px) on open was drift from the pure-pencil intent; removed so the
   no-glass build ships zero blurred-backdrop surfaces). */
.hover-card {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0;
  padding: 1rem;
  background: color-mix(in srgb, var(--color-popover) 80%, transparent);
  border: 2px solid color-mix(in srgb, var(--color-border) 30%, transparent);
  border-radius: 1rem;
  opacity: 0;
  /* UI-6 (WCAG 2.4.7): visibility:hidden while closed pulls the two inner links out of
     the tab order — Tab no longer stops on the invisible "@mbabb"/"View project" for two
     stops with focus vanished. Paired with the wrapper's @focusin/@focusout (focus-within
     disclosure via useHoverCard's own enter/leave), a keyboard user tabbing onto the
     trigger opens the card, then Tab walks its now-focusable links. visibility is delayed
     to the fade's end on close (0s at 150ms) and immediate on open, so the transition still
     reads as a fade, not a snap. */
  visibility: hidden;
  pointer-events: none;
  transform: scale(0.9) translateY(8px);
  transition:
    opacity 150ms var(--ease-standard),
    transform 150ms var(--ease-standard),
    visibility 0s linear 150ms;
  z-index: 50;
  min-width: 16rem;
}

.hover-card::before {
  content: "";
  position: absolute;
  top: -1rem;
  left: 0;
  right: 0;
  height: 1rem;
}

.hover-card.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: scale(1) translateY(0);
  transition:
    opacity 150ms var(--ease-standard),
    transform 150ms var(--ease-standard),
    visibility 0s linear 0s;
}
</style>
