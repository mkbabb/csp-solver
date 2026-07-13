// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

/**
 * Boundary rules (the "mechanical" enforcement the colocation edict asks for). Exactly the
 * two real boundaries — nothing finer-grained (the folder convention is the signal for
 * component-private helpers; per-folder privacy rules are the contrivance the edict warns
 * against). Both alias (`@games/*`, `@pencil/*`) and relative-traversal (`../../games/...`)
 * forms are caught.
 */

// Depth lint (R8 G10/G11): src/games/** + App.vue/main.ts must not reach 3+ levels into pencil
// internals — route through the subdir barrels (@pencil/chrome, @pencil/grid). 1- and 2-level
// imports (@pencil/config/pencilConfig, @pencil/chrome/BoilDivider.vue) stay open; pencil-INTERNAL
// 3-level imports (e.g. HandwrittenLogo -> OptionSelector/scribbleUnderline) are out of scope by
// construction — only games/App/main are lint-scoped for this pattern. Appended into each game
// rule's own `patterns` array (P2-T5 flat-config append discipline): a second same-scope config
// block would override the cross-game boundary by rule name rather than merge.
const pencilDepthPattern = {
  group: ['@pencil/*/*/*', '@pencil/*/*/*/**'],
  message:
    'do not reach 3+ levels into pencil internals (R8 G10/G11 depth rule) — ' +
    'route through the subdir barrel (@pencil/chrome, @pencil/grid).',
}

// src/pencil/** never imports src/games/** — the animation/aesthetic layer renders whatever
// generic, already-erased data it's handed; it never reaches into domain state/types.
// The reverse (games -> pencil) is expected and unrestricted.
const pencilMayNotImportGames = {
  files: ['src/pencil/**/*.{ts,vue}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@games', '@games/*', '@games/**', '**/games/*', '**/games/**'],
            message:
              'src/pencil/** must not import from src/games/** (the domain layer). ' +
              'Pencil components take generic, already-erased data via props.',
          },
        ],
      },
    ],
  },
}

// games/sudoku and games/futoshiki never import each other — two independently-evolving
// products sharing only pencil.
const sudokuMayNotImportFutoshiki = {
  files: ['src/games/sudoku/**/*.{ts,vue}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@games/futoshiki',
              '@games/futoshiki/*',
              '@games/futoshiki/**',
              '**/games/futoshiki/*',
              '**/games/futoshiki/**',
            ],
            message:
              'src/games/sudoku/** must not import src/games/futoshiki/** — games never import each other.',
          },
          pencilDepthPattern,
        ],
      },
    ],
  },
}
const futoshikiMayNotImportSudoku = {
  files: ['src/games/futoshiki/**/*.{ts,vue}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@games/sudoku',
              '@games/sudoku/*',
              '@games/sudoku/**',
              '**/games/sudoku/*',
              '**/games/sudoku/**',
            ],
            message:
              'src/games/futoshiki/** must not import src/games/sudoku/** — games never import each other.',
          },
          pencilDepthPattern,
        ],
      },
    ],
  },
}

// src/games/shared/** is the game-agnostic shared floor — logic consumed by BOTH games
// (undo/marks/peek machines, shared types/constants). It must never reach back into a
// concrete game (@games/sudoku, @games/futoshiki): that would couple the two games
// through the shared layer, defeating the sudoku↮futoshiki boundary. A tripwire —
// nothing violates it today (useAnswerKeyPeek takes a structural `target`) — kept as a
// distinct `files` scope so it appends cleanly without clobbering the game rules'
// same-named `no-restricted-imports` (flat config overrides by rule name within a
// matching config; P2-T5 append discipline).
const sharedMayNotImportGames = {
  files: ['src/games/shared/**/*.{ts,vue}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@games/sudoku',
              '@games/sudoku/*',
              '@games/sudoku/**',
              '@games/futoshiki',
              '@games/futoshiki/*',
              '@games/futoshiki/**',
              '**/games/sudoku/*',
              '**/games/sudoku/**',
              '**/games/futoshiki/*',
              '**/games/futoshiki/**',
            ],
            message:
              'src/games/shared/** must not import a concrete game (@games/{sudoku,futoshiki}) — the shared floor stays game-agnostic.',
          },
          pencilDepthPattern,
        ],
      },
    ],
  },
}

// The app shell (App.vue, main.ts) lives outside src/games/** but is held to the same pencil
// depth rule — it is a top-level consumer of the pencil chrome barrel. No cross-game/shared
// boundary applies here, so a standalone block (no clobber risk).
const appShellDepthRule = {
  files: ['src/App.vue', 'src/main.ts'],
  rules: {
    'no-restricted-imports': ['error', { patterns: [pencilDepthPattern] }],
  },
}

export default tseslint.config(
  // `dist*/**` covers the deploy build (`dist/`) AND preview/throttle builds
  // (`dist-throttle/`, the throttled-void probe's served bundle) — minified output is
  // never source and must never enter the lint set (else the rig reds on bundled JS).
  { ignores: ['dist*/**', 'node_modules/**', 'e2e/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // 'essential' (correctness only), not 'recommended'/'strongly-recommended' — this repo's
  // formatting is Prettier's job (`npm run lint`); eslint-plugin-vue's stylistic tier
  // (html-indent, attributes-order, etc.) would just fight Prettier's own opinions.
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // Leading-underscore convention for intentionally-unused bindings (e.g. rest-destructure
      // discards: `const { [key]: _, ...rest } = obj`), consistent with tsconfig's own
      // noUnusedLocals/noUnusedParameters (which already accepts this pattern).
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // env.d.ts is Vue-scaffold boilerplate (DefineComponent<{}, {}, any>) — the `{}` here is
    // the idiomatic Vue 3 ambient-module-declaration shape, not a real "any non-nullish value" bug.
    files: ['env.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  pencilMayNotImportGames,
  sudokuMayNotImportFutoshiki,
  futoshikiMayNotImportSudoku,
  sharedMayNotImportGames,
  appShellDepthRule,
)
