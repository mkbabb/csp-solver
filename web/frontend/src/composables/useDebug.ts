import { createGlobalState, useStorage } from "@vueuse/core";

/**
 * The hidden DEBUG flag — one ref, persisted, read by every telemetry surface (T6 mark 16).
 *
 * Solve-time metadata is machine ink, not product voice: the tally and the prewarm smoke are
 * off for a visitor and on for whoever finds the toggle in the @mbabb card. Twin of
 * `useTheme` by construction — same `createGlobalState` memo (so both AttributionCard mounts,
 * GameBoard and transport.ts read the SAME ref, in or out of a component setup), same
 * namespaced storage key (`sudoku-color-scheme` precedent; an unnamespaced `debug` collides
 * with any other vueuse app on the origin).
 */
export const useDebug = createGlobalState(() => useStorage("sudoku-debug", false));
