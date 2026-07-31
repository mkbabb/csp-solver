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
    // MEASURED CONSEQUENCE, recorded rather than discovered later (real Safari 26.4, after):
    // the Bloom SURVIVES — `toggle-squash` / `plush-land` are @keyframes animations, which
    // `transition: none` does not touch (button scale sampled 0.941 @45 ms → 1 @135 ms). What
    // does not survive is the T3-W10 dusk ease: `html.theme-turning`'s ~350 ms body + paper
    // colour tween now lands inside the suppression window, so page colour SNAPS (sampled
    // rgb(251,250,249) → rgb(17,15,14) with no intermediate value). The class and its index.css
    // rule are consequently inert. That is the trade the P-W3 charter names — "the swap is
    // covered by the toggle's Bloom" — and the toggle's gesture is the motion the eye is on when
    // it clicks. Left in place, not deleted: reversal is this one boolean, and if the owner wants
    // the dusk back the cure is to NARROW the 46 tweening selectors, not to re-blanket them.
    disableTransition: true,
  });

  const toggleDark = useToggle(isDark);

  return { isDark, toggleDark };
});
