import { useDark, useToggle, createGlobalState } from "@vueuse/core";

export const useTheme = createGlobalState(() => {
  const isDark = useDark({
    // T4-W10 idiom (§theme-key) — namespace the vueuse storage key. Unset, vueuse writes the
    // default `vueuse-color-scheme`, which any other vueuse app on the origin collides on. The
    // rename is a one-time reset (the fresh key has no stored value → first load defaults to
    // system, which IS the default — correct, not a regression); behavior-preserving thereafter.
    storageKey: "sudoku-color-scheme",
    selector: "html",
    attribute: "class",
    valueDark: "dark",
    valueLight: "",
    // P1-W3 (r2 cause 2). A theme flip tweened 46 elements carrying `transition` with a
    // non-zero duration — a whole-page property tween on top of a whole-page repaint, worth
    // +23.5 fps by itself on the estate's worst-measured scenario: `themeToggle` sat at 46.2
    // fps, 47% of the 98.4 ceiling, with ~45% of its window in frames over 50 ms and two
    // ~200 ms frames every single run (one at the click, one at the toggle-back).
    //
    // vueuse's `disableTransition` stamps a `* { transition: none !important }` style for one
    // frame around the class write, then removes it — so nothing else in the app loses a
    // transition, only this instant loses its tween. This is also vueuse's own DEFAULT; the
    // estate had explicitly opted out of it.
    //
    // MEASURED CONSEQUENCE — CORRECTED 2026-08-02 (the owner's eye caught what the original
    // measurement missed): the original note sampled `toggle-squash`/`plush-land` (@keyframes,
    // untouched by `transition: none`) and declared "the Bloom SURVIVES" — but those are the
    // ACCENTS. The Bloom itself — the warp wring/spring, the icon crossfade, the star pops —
    // is CSS transitions that can only START on the flip frame this kill blankets, and it died
    // silently on every platform. Cured in DarkModeToggle.vue: the gesture transitions carry
    // `!important`, out-ranking the zero-specificity kill within the toggle's own subtree while
    // the page-wide suppression (this boolean's +23.5 fps) stands. The T3-W10 dusk ease remains
    // inert as originally recorded (page colour snaps); if the owner wants the dusk back the
    // cure is to NARROW the 46 tweening selectors, not to re-blanket them.
    disableTransition: true,
  });

  const toggleDark = useToggle(isDark);

  return { isDark, toggleDark };
});
