/**
 * `@pencil/grid` subdir barrel — the grid subsystem's public surface (7 exports).
 *
 * Subdir barrel, NOT a root `pencil/index.ts` (K41): a root barrel would route the
 * lazy `AnswerKeyLaminate` dynamic import through a shared module and defeat its
 * on-first-peek chunk. Games reach grid internals through this barrel so the depth
 * lint keeps 3+-level reach out of the domain layer.
 */
export { default as HandDrawnGrid } from './HandDrawnGrid/HandDrawnGrid.vue'
export { usePathAnimation } from './HandDrawnGrid/usePathAnimation'
export { default as HandDrawnOutline } from './HandDrawnOutline.vue'
export {
  generateGridPaths,
  generateRectBoilFrames,
  generateLineBoilFrames,
  generateGridBoilFrames,
} from './gridPaths'
export type { GridPaths, BoilFrames } from './gridPaths'
