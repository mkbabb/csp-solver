import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig, type Plugin } from 'vite'

/**
 * `sudoku-templates` — the build rule that DERIVES
 * `src/games/sudoku/data/templates.ts` from the canonical puzzle-template
 * bank. Runs on both `vite` (serve) and `vite build` via `buildStart`.
 *
 * `templates.ts` is a generated artifact, never hand-edited and never a
 * fork of the JSON. The single source of truth is the bank the solver
 * itself owns (W4 embedded it into the crate via `include_dir`):
 *
 *   csp-solver/data/sudoku_puzzles/{n}/{difficulty}/template-*.json
 *
 * (the `puzzle` field — a position-keyed map of the given clues, `0`
 * elsewhere). Flip the single `SRC_REL` constant if the bank ever moves
 * again; never copy JSON by hand (wave §Residual). This plugin lives in
 * `vite.config.ts` — the Node build context that isn't compiled by the
 * browser `tsconfig` — so its `node:fs`/`node:path` use never reaches the
 * app typecheck.
 */
function sudokuTemplates(): Plugin {
  const SRC_REL = '../../csp-solver/data/sudoku_puzzles'
  const OUT_REL = 'src/games/sudoku/data/templates.ts'
  // THE TIER TABLE (T5-W2 2.4a) — the DECLARED source of every (size, difficulty) sudoku
  // deals at, and the reason a lost directory can no longer pass for a deliberate one.
  //
  // W4 (tranche-2) reshaped the bank: N=2 (all tiers), N=3-easy, N=3-medium and the whole
  // N=5 subtree were excised — the fast path ships only the tiers whose native generate
  // breaches the in-browser budget (N=3-hard, N=4-*). Until this table existed the excision
  // was recorded ONLY as an absence: `existsSync` wrote an empty tier either way and
  // `useSudoku.ts` read it through `TEMPLATE_BANK[n]?.[…] ?? []`, so a `git rm` of the
  // surviving bank emitted byte-identical output and shipped a silent live-gen regression on
  // the one tier that has a bank because it needs one. Now the declaration is the truth and
  // the disk is checked against it, both ways:
  //   • a tier declared BANK whose directory is missing or empty FAILS THE BUILD, by name;
  //   • a tier declared LIVEGEN that grows a directory FAILS THE BUILD too — the bank moved
  //     and this table is stale, which is the same defect facing the other way;
  //   • a size or difficulty on disk that this table does not name FAILS THE BUILD.
  // `SIZES` is every size the picker offers (`shared/selectors.ts` `subgridSizes`), not just
  // the banked ones, so N=2's live-gen is a declaration rather than a hole in the record.
  const TIERS = {
    2: { easy: 'livegen', medium: 'livegen', hard: 'livegen' },
    3: { easy: 'livegen', medium: 'livegen', hard: 'bank' },
    4: { easy: 'bank', medium: 'bank', hard: 'bank' },
  } as const
  const SIZES = Object.keys(TIERS).map(Number)
  const DIFFICULTIES = ['easy', 'medium', 'hard'] as const

  /** Every `{n}/{difficulty}` pair that actually exists under the bank root. */
  function onDisk(srcDir: string): string[] {
    if (!existsSync(srcDir))
      throw new Error(
        `sudoku-templates: the puzzle bank root ${SRC_REL} does not exist (looked in ` +
          `${srcDir}). The tier table declares ${SIZES.length} sizes against it; nothing can ` +
          `be checked while the root is gone.`,
      )
    const pairs: string[] = []
    for (const n of readdirSync(srcDir))
      if (existsSync(join(srcDir, n)) && statSync(join(srcDir, n)).isDirectory())
        for (const d of readdirSync(join(srcDir, n)))
          if (statSync(join(srcDir, n, d)).isDirectory()) pairs.push(`${n}/${d}`)
    return pairs.sort()
  }

  function render(srcDir: string): string {
    const bank: Record<number, Record<string, number[][]>> = {}
    const declared = new Set<string>()
    let totalBoards = 0
    let rawCells = 0
    for (const n of SIZES) {
      bank[n] = { easy: [], medium: [], hard: [] }
      const total = (n * n) ** 2
      for (const d of DIFFICULTIES) {
        const dir = join(srcDir, String(n), d)
        const source = TIERS[n as keyof typeof TIERS][d]
        if (source === 'bank') declared.add(`${n}/${d}`)
        const files = existsSync(dir)
          ? readdirSync(dir)
              .filter((f: string) => f.startsWith('template-') && f.endsWith('.json'))
              .sort()
          : []
        // THE FAIL. A declared bank tier with no boards is a LOST bank, and it is named.
        if (source === 'bank' && files.length === 0)
          throw new Error(
            `sudoku-templates: tier ${n}/${d} is declared \`bank\` but ${dir} holds no ` +
              `template-*.json. The puzzle bank is the single source of truth for that tier ` +
              `— restore the directory, or move the tier to \`livegen\` in vite.config.ts's ` +
              `TIERS table and say so on purpose.`,
          )
        if (source === 'livegen' && files.length > 0)
          throw new Error(
            `sudoku-templates: tier ${n}/${d} is declared \`livegen\` but ${dir} holds ` +
              `${files.length} template-*.json. The bank grew and the TIERS table is stale — ` +
              `the app would live-generate a tier it now has boards for.`,
          )
        const boards: number[][] = []
        for (const f of files) {
          const data = JSON.parse(readFileSync(join(dir, f), 'utf8')) as {
            puzzle: Record<string, number>
          }
          const flat = new Array<number>(total).fill(0)
          for (const [k, v] of Object.entries(data.puzzle)) flat[Number(k)] = v
          boards.push(flat)
        }
        bank[n][d] = boards
        totalBoards += boards.length
        rawCells += boards.length * total
      }
    }
    // The third arm: a directory the table does not name at all. Without it a bank could be
    // added under a size the picker offers and never reach the app, silently.
    const undeclared = onDisk(srcDir).filter((p) => !declared.has(p))
    if (undeclared.length)
      throw new Error(
        `sudoku-templates: ${undeclared.join(', ')} exist on disk but no TIERS row declares ` +
          `them \`bank\`. Add the row (or remove the directory) — an unnamed bank ships nothing.`,
      )

    const banner =
      `// AUTO-GENERATED by vite.config.ts::sudokuTemplates from\n` +
      `// ${SRC_REL}/{n}/{difficulty}/template-*.json (\`puzzle\` field).\n` +
      `// ${totalBoards} boards, ${rawCells} u32 cells total. Do not hand-edit.\n`
    const TIER_ACCESSOR = [
      `export type TierSource = 'bank' | 'livegen'`,
      `export type TierKey = 'easy' | 'medium' | 'hard'`,
      ``,
      `/** Where each (size, difficulty) gets its board. Checked against the bank at build time. */`,
      `const TIER_SOURCE: Record<number, Record<TierKey, TierSource>> = ${JSON.stringify(TIERS)}`,
      ``,
      `/** The declared source for a tier. An undeclared size is a caller bug, never a fallback. */`,
      `export function tierSource(n: number, difficulty: TierKey): TierSource {`,
      `  const row = TIER_SOURCE[n]`,
      `  if (!row)`,
      `    throw new Error(`,
      `      'sudoku: no tier is declared for size ' + n + ' — the TIERS table in vite.config.ts ' +`,
      `        'names ' + Object.keys(TIER_SOURCE).join(', ') + '. A size the picker offers must be declared.',`,
      `    )`,
      `  return row[difficulty]`,
      `}`,
      ``,
    ].join('\n')

    return (
      `${banner}\n` +
      `export type TemplateBank = Record<number, Record<'easy' | 'medium' | 'hard', number[][]>>\n\n` +
      `export const TEMPLATE_BANK: TemplateBank = ${JSON.stringify(bank)}\n\n` +
      TIER_ACCESSOR
    )
  }

  let root = process.cwd()
  return {
    name: 'sudoku-templates',
    configResolved(config) {
      root = config.root
    },
    buildStart() {
      const outPath = resolve(root, OUT_REL)
      const next = render(resolve(root, SRC_REL))
      const existing = ((): string | null => {
        try {
          return readFileSync(outPath, 'utf8')
        } catch {
          return null
        }
      })()
      // Write only on drift — a no-op steady state keeps the dev watcher
      // from looping on its own emit.
      if (existing !== next) writeFileSync(outPath, next)
    },
  }
}

/**
 * `head-hints` — build-time cold-start preloading (T3-W8 §cold-start, A17 P1/P5).
 *
 * Reads the emitted content-hashed asset names off the rollup bundle and injects,
 * into the `<head>` of the built `index.html`:
 *   - `<link rel="modulepreload">` for the ACTIVE (default) game's `solver.worker`
 *     chunk only — the wasm Worker boots lazily on its first message
 *     (`useSolver.ts` `ensureWorker`), so preloading the chunk shaves the first
 *     solve/generate's serial chain. The other game's worker is speculative
 *     cold-path work (T4-W1 §preload) and is left to lazy fetch on port entry.
 *   - `<link rel="preload" as="font" crossorigin>` for the three subset woff2 —
 *     the hand-drawn wordmark is the aesthetic centerpiece and today the faces
 *     are late-discovered via `@font-face` only (index.css), a FOUT the preload
 *     erases.
 *
 * NO wasm preload: the binary is fetched/instantiated inside the Worker, which
 * cannot consume a document-level preload — a wasm `<link rel=preload>` only
 * double-fetches it with a console warning (see the inline note below, T4-W1
 * §preload).
 *
 * Build-only (`apply: 'build'`): the dev graph is unbundled and has no hashed
 * names to read. `crossorigin` on the font preloads matches the credentials
 * mode of the actual (anonymous) fetches so the browser reuses the preloaded
 * response rather than discarding it and re-requesting. The payoff is a `dist/`
 * measurement, never a dev one (the wave's explicit trap).
 */
function headHints(): Plugin {
  const base = process.env.VITE_BASE_URL || '/'
  const href = (key: string) => (base.endsWith('/') ? base : base + '/') + key
  return {
    name: 'head-hints',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle
        if (!bundle) return html
        const files = Object.keys(bundle)
        const tags: import('vite').HtmlTagDescriptor[] = []
        // Preload ONLY the active (default) game's `solver.worker` chunk. Both games
        // emit a distinct hashed `solver.worker-*.js` asset (same basename — they're twin
        // ports), but the app boots on the default game (sudoku; `?game=futoshiki`
        // switches at runtime, App.vue) and only that worker instantiates cold.
        // Modulepreloading the other is speculative cold-path work the browser pays for on
        // every load (T4-W1 §preload) — the futoshiki worker is fetched lazily when (if)
        // the port is entered.
        //
        // Vite 8's bundler emits these workers as ASSETS with no `originalFileName` /
        // `facadeModuleId`, so the active worker is identified by a wasm binding only its
        // game's source references. The count assertion fails the build if that
        // discriminator ever drifts (both/neither match) rather than silently preloading
        // the wrong chunk or regressing to both.
        const ACTIVE_WORKER_MARK = 'solveSudoku' // the default game's core wasm binding
        const workerFiles = files.filter((f) => /solver\.worker[.-][^/]*\.js$/.test(f))
        const activeWorkers = workerFiles.filter((f) => {
          const src = (bundle[f] as { source?: unknown }).source
          return typeof src === 'string' && src.includes(ACTIVE_WORKER_MARK)
        })
        if (activeWorkers.length !== 1) {
          throw new Error(
            `head-hints: expected exactly one active-game (\`${ACTIVE_WORKER_MARK}\`) ` +
              `solver.worker asset to preload, found ${activeWorkers.length} of ` +
              `${workerFiles.length} — the worker discriminator drifted; update ACTIVE_WORKER_MARK.`,
          )
        }
        tags.push({ tag: 'link', attrs: { rel: 'modulepreload', href: href(activeWorkers[0]) }, injectTo: 'head' })
        // NO `<link rel="preload" as="fetch">` for the wasm binary. The wasm is fetched
        // and instantiated INSIDE the solver Worker (`solver.worker.ts` → wasm-bindgen
        // `init({module_or_path})` → `fetch` → `instantiateStreaming`), and a dedicated
        // Worker does NOT consume the owning document's preload cache. A document-level
        // wasm preload therefore fetches it a first time that nothing on the page ever
        // uses, the Worker fetches it again, and the browser logs "preloaded … but not
        // used within a few seconds" — a measured double-fetch + console warning cold
        // (T4-W1 §preload; verified: with the preload = 2 GETs + warning, without = 1 GET,
        // no warning, streaming instantiate intact because the .wasm is served
        // `application/wasm`). The Worker's own fetch IS the streaming happy-path; adding a
        // link only doubles the download. (Preloading the wasm effectively would mean
        // fetching it on the main thread and postMessage-ing the compiled Module into the
        // Worker — a solver-architecture change, out of this hygiene lane.)
        // The three subset woff2 faces (fraunces / patrickhand / firacode).
        for (const f of files) {
          if (/-subset[^/]*\.woff2$/.test(f)) {
            tags.push({
              tag: 'link',
              attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: true, href: href(f) },
              injectTo: 'head',
            })
          }
        }
        return { html, tags }
      },
    },
  }
}

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  resolve: {
    alias: {
      '@pencil': path.resolve(__dirname, './src/pencil'),
      '@games': path.resolve(__dirname, './src/games'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    sudokuTemplates(),
    headHints(),
  ],
  // W6 Option C: `solver.worker.ts` is an ES-module Worker (`{ type: 'module' }`)
  // that top-level-imports the wasm glue — the production Worker bundle must be
  // ESM, not the default IIFE.
  worker: {
    format: 'es',
  },
  // The wasm-bindgen `--target web` module (`@mkbabb/csp-solver-wasm`, a `file:`
  // link to the local pkg) resolves its `.wasm` via `new URL(..., import.meta.url)`;
  // esbuild's dep pre-bundling mangles that, so keep it out of optimizeDeps and let
  // Vite's asset pipeline emit the wasm binary in the Worker graph.
  optimizeDeps: {
    exclude: ['@mkbabb/csp-solver-wasm'],
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    // The wasm binary the solver Worker `?url`-imports lives in the local
    // `@mkbabb/csp-solver-wasm` pkg — a `file:` dep symlinked to
    // `csp-solver/wasm/pkg`, which Vite resolves to a real path *outside* the
    // frontend root. Without this the dev server 403s the `.wasm` fetch
    // ("outside of Vite serving allow list") and the Worker can't instantiate.
    // Retire this entry when W12 swaps the `file:` link for the published
    // registry package (then the pkg lives under node_modules inside root).
    fs: {
      allow: [path.resolve(__dirname), path.resolve(__dirname, '../../csp-solver/wasm/pkg')],
    },
    // HMR rides `server.port` — NO literal pin. The pin this replaces (R-11b/K46)
    // desynced from every `--port` override by construction: the app moved, the
    // websocket stayed on :3000 answering `426 Upgrade Required`, and anything
    // probing :3000 for the SPA latched onto the socket. With no hmr block, Vite
    // derives the socket from the port actually bound, override included — the
    // whole K46 desync class retires. (Owner order, 2026-08-02.)
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    // P5 (Tranche II): never base64-inline the self-hosted font subsets. The default
    // 4KB assetsInlineLimit would otherwise fold firacode-subset.woff2 (3,624 B) and
    // patrickhand-subset.woff2 (3,840 B) into the CSS as base64 — ~33% bigger on the
    // wire AND no longer independently cacheable (they'd get re-fetched on every
    // CSS-touching deploy instead of sitting behind their own immutable, content-
    // hashed /assets/*.woff2 URL — the W5 cache-header beat this self-host feeds).
    assetsInlineLimit: (filePath) => (filePath.endsWith('.woff2') ? false : undefined),
    rollupOptions: {
      output: {
        // 10-char content hashes (vite defaults to 8). One-time URL rotation after the
        // 2026-07-15 edge-cache poisoning: a mid-propagation fetch of a new hashed asset
        // through the sudoku.babb.dev zone got the SPA fallback (text/html) and the zone
        // cached it under the /assets/* one-year immutable rule — nosniff then refused
        // the stylesheet on every subsequent load (5 fps app, all engines). Rotating the
        // URLs outruns every poisoned entry at once (no zone purge scope in the deploy
        // token); the _redirects /assets/* 404 guard prevents the class from recurring. (12-char:
        // the first 10-char rotation was itself re-poisoned by a verification fetch
        // racing the alias flip — the guard was not yet the OLD deployment then; after
        // this deploy it is, and the class closes. Post-deploy verification must idle
        // ~2 min before touching any asset URL through the zone.)
        assetFileNames: 'assets/[name]-[hash:12][extname]',
        chunkFileNames: 'assets/[name]-[hash:12].js',
        entryFileNames: 'assets/[name]-[hash:12].js',
        // Rolldown (Vite 8's default bundler) treats function-form `manualChunks`
        // as a HINT, not a strict assignment: it fused Vue's runtime into
        // `animation-vendor` (the `beforeCreate` option-merge string landed there)
        // and left `vue-vendor` an 8.5 KB husk that itself re-imported ~20 symbols
        // back from `animation-vendor` — a 3-hop `index → vue-vendor → animation-vendor`
        // graph that defeated the cache-isolation intent (every pencil-boil bump
        // re-downloaded Vue). `advancedChunks.groups` is Rolldown's strict grouping
        // API — a module whose id matches a group's `test` is ASSIGNED to that group
        // regardless of who imports it, so Vue's runtime is forced into its own
        // cache-stable chunk. First matching group wins; `vue` precedes the animation
        // group. Match both `vue/` and `@vue/` because modern Vue (3.4+) ships `vue`
        // as a thin re-export shell over separately resolvable `@vue/*` modules.
        // keyframes.js was dropped from the app runtime (grid + glyph draw-in migrated
        // onto the unified scheduler's `sequence` subscriber), so pencil-boil is the
        // sole surviving animation vendor.
        advancedChunks: {
          groups: [
            {
              name: 'vue-vendor',
              test: /[\\/]node_modules[\\/](@vue[\\/]|vue[\\/])/,
            },
            {
              name: 'animation-vendor',
              test: /[\\/]node_modules[\\/]@mkbabb[\\/]pencil-boil[\\/]/,
            },
          ],
        },
      },
    },
  },
})
