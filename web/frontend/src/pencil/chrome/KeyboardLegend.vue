<script setup lang="ts">
/**
 * The keyboard legend (UI-7b) — a small hand-written crib of the board's shortcuts.
 *
 * Undo/redo/hint/peek were entirely undiscoverable: no title hint, no on-surface text
 * (A23 UI-7). This is that legend — the pencil-hand caption grammar, deliberately quiet
 * (reduced-pressure graphite, caption scale), a real `<dl>` so assistive tech reads the
 * same pairs. Shown only on a fine pointer with hover (a physical keyboard is implied);
 * a coarse-pointer/touch user has no keys, so it stays hidden there rather than adding
 * noise. Generic pencil chrome: it names shortcuts both games share (the boards' keydown
 * maps are D16 twins), owns no domain state.
 */
</script>

<template>
  <dl class="keyboard-legend" aria-label="Keyboard shortcuts">
    <div class="legend-row">
      <dt><kbd>K</kbd></dt>
      <dd>peek</dd>
    </div>
    <div class="legend-row">
      <dt><kbd>H</kbd></dt>
      <dd>hint</dd>
    </div>
    <div class="legend-row">
      <dt><kbd>P</kbd></dt>
      <dd>pencil</dd>
    </div>
    <div class="legend-row">
      <dt><kbd>⌘</kbd><span class="legend-sep">/</span><kbd>Ctrl</kbd><kbd>Z</kbd></dt>
      <dd>undo</dd>
    </div>
    <div class="legend-row">
      <dt><kbd>⇧</kbd><kbd>Z</kbd></dt>
      <dd>redo</dd>
    </div>
  </dl>
</template>

<style scoped>
/* Fine-pointer + hover only: a keyboard is implied. Touch/coarse users get no legend
   (they have no keys) — that keeps it quiet where it would only be clutter. */
.keyboard-legend {
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  .keyboard-legend {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.15rem 0.75rem;
    margin: 0.75rem 0 0;
    justify-content: center;
    font-family: var(--font-hand);
    /* was 55% = 3.53:1 light / 4.36:1 dark — sub-AA in BOTH themes at caption size. */
    color: var(--ink-press-quiet);
    user-select: none;
  }
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin: 0;
}

.legend-row dt {
  display: inline-flex;
  align-items: center;
  gap: 0.12rem;
  margin: 0;
}

.legend-row dd {
  margin: 0;
  font-size: var(--type-caption);
  letter-spacing: var(--type-tracking-wide);
}

.legend-row kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.15em;
  padding: 0 0.25em;
  font-family: var(--font-hand);
  font-size: var(--type-caption);
  line-height: 1.4;
  color: inherit;
  /* was 40% = 2.36:1 light / 2.87:1 dark — under the WCAG 1.4.11 3:1 non-text floor. */
  border: 1.5px solid var(--ink-press-rule);
  border-radius: 0.3rem;
}

/* The ⌘/Ctrl slash. It carried `opacity: 0.7` on the inherited quiet rung — 68 × 0.7 = 47.6%
   graphite, 2.877:1 light / 3.564 dark, sub-AA text INSIDE the component this pass says it
   closed. `opacity` is outside the ladder's model (check-ink-pressure reads declared stops,
   not composited alphas), so the honest cure is to stop carrying one rather than tune it: the
   separator now reads at the quiet rung like the words around it. */
.legend-sep {
  font-size: var(--type-caption);
}
</style>
