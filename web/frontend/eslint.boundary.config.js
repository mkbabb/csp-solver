// @ts-check
/**
 * THE CROSS-GAME BOUNDARY LAW — n×(n−1) ordered pairs, GENERATED (T5-W1 row 1.4).
 *
 * Hand enumeration was the defect. `eslint.config.js` used to spell the matrix out and so
 * enforced 2 of 20 ordered pairs (`sudokuMayNotImportFutoshiki`, `futoshikiMayNotImportSudoku`);
 * thermo, killer and kenken carried no cross-game restriction at all, and the shared floor named
 * only the two families that predate the edict — every family added since T4-W13 joined the
 * estate without joining the law. This file derives the whole matrix from the game list on disk,
 * so a sixth family is bound the moment its registration point lands — no edit here, ever.
 *
 * FOLDED, AND GREEN SINCE T5-W2 2.5. `eslint.config.js` IMPORTS `crossGameRules` and
 * `sharedMayNotImportGames` from this module, so the law gates every push through the frontend
 * lane's `eslint .`. It was born RED at 23 live cross-game imports and held out of that lane on
 * purpose (gates.json `gates.W1.boundary.greensAt` = "W2.5") because folding a red rule into the
 * push gate would have walled the wave; 2.5 broke the last of them and the ruling landed with its
 * enforcing config. One generator, one law. The consumer appends its `pencilDepthPattern` into
 * each generated block's own `patterns` array rather than adding a second same-scope block — see
 * `withDepthRule`, and the append-discipline note on `pencilDepthPattern` itself.
 *
 * WHY `npm run lint:boundary` AND ITS CI JOB SURVIVE THE FOLD: the vacuity canary. A generated
 * matrix that silently discovered zero games would lint green — the incumbent's exact defect one
 * layer up — so the generator throws below two families, and the `boundary` job proves that on a
 * throwaway one-family tree before the real run is trusted (its "canary — the generator refuses
 * to lint vacuously green" step). `eslint .` has nowhere to carry a negative control. This lane
 * is a census entry point over the one generator, never a second copy of the law.
 *
 * SCOPE. The ordered-pair matrix plus the shared floor — nothing else. The pencil↮games arm and
 * the `@pencil/**` depth rule stay in `eslint.config.js`. Nothing outside `src/games/<game>/**`
 * and `src/games/shared/**` is bound: the registration point is each game's own `spec.ts`, read
 * from disk below (the standalone `src/games/registry.ts` this clause used to carve out died with
 * `gameRegistry` at T5-W2).
 */
import fs from 'node:fs'
import path from 'node:path'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const GAMES_DIR = path.join(import.meta.dirname, 'src', 'games')

/**
 * THE GAME LIST, READ FROM DISK. A game IS a directory under `src/games/` carrying its
 * REGISTRATION POINT — `spec.ts`, the T5-W2 `GameSpec`. That file, not a name blocklist, is the
 * discriminator: `shared/` is the game-agnostic floor and carries none, so it falls out
 * structurally rather than by exception. (W1 carried a second arm, `game.ts`, for the families
 * still unmigrated; it died with the last of them at 2.1.) Sorted for deterministic rule order —
 * stable output across platforms, so the census is diffable.
 */
const REGISTRATION_POINTS = ['spec.ts']
const games = fs
  .readdirSync(GAMES_DIR, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      REGISTRATION_POINTS.some((f) => fs.existsSync(path.join(GAMES_DIR, entry.name, f))),
  )
  .map((entry) => entry.name)
  .sort()

// A generator that silently reads zero games would green vacuously — the exact failure the
// hand-enumerated config already suffers, one layer up. Fail loud instead.
if (games.length < 2) {
  throw new Error(
    `eslint.boundary.config.js: expected >=2 game families under ${GAMES_DIR} ` +
      `(a directory carrying spec.ts); found ${games.length} [${games.join(', ')}]. ` +
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
 * discipline `eslint.config.js`'s `pencilDepthPattern` records the same trap).
 */
export const crossGameRules = games.map((self) => ({
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
export const sharedMayNotImportGames = {
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
