// @ts-check
/**
 * THE CROSS-GAME BOUNDARY LAW — n×(n−1) ordered pairs, GENERATED (T5-W1 row 1.4).
 *
 * `eslint.config.js` hand-enumerates the matrix and so enforces 2 of 20 ordered pairs
 * (`sudokuMayNotImportFutoshiki`, `futoshikiMayNotImportSudoku`); thermo, killer and kenken
 * carry no cross-game restriction at all, and `sharedMayNotImportGames` names only the two
 * families that predate the edict. Hand enumeration is the defect: every family added since
 * T4-W13 joined the estate without joining the law. This file derives the whole matrix from
 * the game list on disk, so a sixth family is bound the moment its `game.ts` lands — no edit
 * here, ever.
 *
 * OVERLAY, NOT A FOLD. This is a standalone config consumed by `npm run lint:boundary`. It is
 * deliberately NOT merged into `eslint.config.js`: it is EXPECTED RED until W2.5 breaks the 23
 * live imports (gates.json `gates.W1.boundary.greensAt` = "W2.5"). Folding a red rule into the
 * lane that gates every push would wall the wave. W2.5 performs the fold when it greens.
 *
 * SCOPE. The ordered-pair matrix plus the shared floor — nothing else. The pencil↮games arm and
 * the `@pencil/**` depth rule stay in `eslint.config.js`, already green and already wired.
 * `src/games/registry.ts` is deliberately unbound: it sits outside `src/games/<game>/**` and IS
 * the registration point (registry.ts:127-133). W2 kills `gameRegistry` outright, so binding it
 * here would mint a red with no cure inside this wave.
 */
import fs from 'node:fs'
import path from 'node:path'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const GAMES_DIR = path.join(import.meta.dirname, 'src', 'games')

/**
 * THE GAME LIST, READ FROM DISK. A game IS a directory under `src/games/` carrying a `game.ts`
 * — the `defineGame` registration point (`registry.ts:121`). That file, not a name blocklist,
 * is the discriminator: `shared/` is the game-agnostic floor and has no `game.ts`, so it falls
 * out structurally rather than by exception. Sorted for deterministic rule order (stable
 * output across platforms — the RED bank must be diffable).
 */
const games = fs
  .readdirSync(GAMES_DIR, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() && fs.existsSync(path.join(GAMES_DIR, entry.name, 'game.ts')),
  )
  .map((entry) => entry.name)
  .sort()

// A generator that silently reads zero games would green vacuously — the exact failure the
// hand-enumerated config already suffers, one layer up. Fail loud instead.
if (games.length < 2) {
  throw new Error(
    `eslint.boundary.config.js: expected >=2 game families under ${GAMES_DIR} ` +
      `(a directory carrying game.ts); found ${games.length} [${games.join(', ')}]. ` +
      'The boundary matrix cannot be generated — refusing to lint vacuously green.',
  )
}

const pairs = games.length * (games.length - 1)

/** Both import forms the estate can spell a game with: the `@games` alias and relative traversal. */
const groupFor = (game) => [
  `@games/${game}`,
  `@games/${game}/*`,
  `@games/${game}/**`,
  `**/games/${game}/*`,
  `**/games/${game}/**`,
]

/**
 * One config block per game, each carrying ONE `no-restricted-imports` whose `patterns` array
 * holds every OTHER game. Not one block per pair: within a matching scope flat config overrides
 * by rule name, so n−1 same-scope blocks would leave only the last one live (the P2-T5 append
 * discipline `eslint.config.js:22-24` records the same trap).
 */
const crossGameRules = games.map((self) => ({
  files: [`src/games/${self}/**/*.{ts,vue}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: games
          .filter((other) => other !== self)
          .map((other) => ({
            group: groupFor(other),
            message:
              `src/games/${self}/** must not import src/games/${other}/** — games never ` +
              `import each other (boundary law, ${pairs}/${pairs} ordered pairs, generated ` +
              'from the game list). Lift the shared surface into src/games/shared/** or ' +
              "duplicate it into this game's own tree.",
          })),
      },
    ],
  },
}))

/**
 * The shared floor stays game-agnostic: `src/games/shared/**` may never reach back into a
 * concrete family, or the two games it serves become coupled THROUGH it and the pair matrix is
 * defeated from below. Generated over the same list — the incumbent names only sudoku and
 * futoshiki, so `shared → @games/kenken` passes lint today.
 */
const sharedMayNotImportGames = {
  files: ['src/games/shared/**/*.{ts,vue}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: games.flatMap(groupFor),
            message:
              `src/games/shared/** must not import a concrete game (@games/{${games.join(',')}}) ` +
              '— the shared floor stays game-agnostic.',
          },
        ],
      },
    ],
  },
}

export default [
  {
    ignores: [
      'dist*/**',
      'node_modules/**',
      'playwright-report*/**',
      'test-results/**',
      'coverage/**',
    ],
  },
  // Parsers only — no rule presets. The overlay reports boundary violations and nothing else,
  // so its output IS the census (a recommended-rules preset would bury the rows in noise).
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
  },
  ...crossGameRules,
  sharedMayNotImportGames,
]
