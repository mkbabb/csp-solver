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
        ],
      },
    ],
  },
}

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'e2e/**'] },
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
)
