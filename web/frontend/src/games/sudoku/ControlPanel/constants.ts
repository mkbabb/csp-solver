import type { Difficulty } from '@games/sudoku/types'

/** Board-size options rendered by the (pencil-side) OptionSelector. */
export const sizeOptions = [
  { value: 2, label: '4×4' },
  { value: 3, label: '9×9' },
  { value: 4, label: '16×16' },
]

/** Difficulty options, including the crayon-palette colorClass each maps to. */
export const difficultyOptions: { value: Difficulty; label: string; colorClass: string }[] = [
  { value: 'EASY', label: 'Easy', colorClass: 'crayon-green' },
  { value: 'MEDIUM', label: 'Medium', colorClass: 'crayon-orange' },
  { value: 'HARD', label: 'Hard', colorClass: 'crayon-rose' },
]
