/**
 * `@pencil/chrome` subdir barrel — the chrome subsystem's public surface (18 exports).
 *
 * Subdir barrel, NOT a root `pencil/index.ts` (K41): a root barrel is bundle-risky —
 * it would fold the lazy `AnswerKeyLaminate`/`FutoshikiGame` boundaries into a shared
 * module. Games reach chrome internals through this barrel so the depth lint keeps
 * 3+-level reach out of the domain layer; `sideEffects:false` + named re-exports
 * preserve tree-shaking (chunk-shape parity, P2-L6).
 */
export { default as AttributionCard } from './AttributionCard/AttributionCard.vue'
export { default as CrayonHeart } from './AttributionCard/CrayonHeart.vue'
export { useHoverCard } from './AttributionCard/useHoverCard'
export { default as BoilDivider } from './BoilDivider.vue'
export { default as CelebrationStar } from './CelebrationStar.vue'
export { default as CompletionVignette } from './CompletionVignette.vue'
export { default as DiceIcon } from './icons/DiceIcon.vue'
export { default as EraserIcon } from './icons/EraserIcon.vue'
export { default as ShareIcon } from './icons/ShareIcon.vue'
export { default as SolveIcon } from './icons/SolveIcon.vue'
export { default as HandwrittenLogo } from './HandwrittenLogo/HandwrittenLogo.vue'
export { default as KeyboardLegend } from './KeyboardLegend.vue'
export { useGameMenu, type GameMenuOption } from './HandwrittenLogo/useGameMenu'
export { default as MarginNote } from './MarginNote.vue'
export { default as OptionSelector } from './OptionSelector/OptionSelector.vue'
export { ghostUnderline, scribbleUnderline } from './OptionSelector/scribbleUnderline'
export { default as ScribbleLoader } from './ScribbleLoader.vue'
export { default as SvgFilters } from './SvgFilters.vue'
