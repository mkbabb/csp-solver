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
    disableTransition: false,
  });

  const toggleDark = useToggle(isDark);

  return { isDark, toggleDark };
});
