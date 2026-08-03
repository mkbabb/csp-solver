# W0 0.4 group B — the ungated derivations

`web/frontend/README.md` only. The gated rows (D1–D4, D17, CH-16 site, worker topology) print
their own derivation in `doc-truth-after-0.4B.txt`—zero sites over this file, 21/22 rows green,
the one red is `bench-target-roster` over `csp-solver/README.md`, group A's.

Five rows carry no gate. Each figure below is read from the tree at run time, not from
`DISPOSITIONS.md`.

## D11 — the deploy recipe

`package.json` `scripts.deploy` = `bash ../../scripts/deploy-gated.sh`. The raw wrangler line
survives as `scripts.deploy:raw`; the gate refuses unless `scripts/ci-conclusion.sh`'s artifact
is present, pinned to HEAD, `success`, under 24h, and—since 0.2—unless `scripts/ledger-diff.mjs`
finds the ledger current. The README's old "build + wrangler pages deploy dist" named the
bypass, not the path.

## D12 — the lint recipe

`package.json` `scripts.lint` = `prettier --check --config .prettierrc.json src/ scripts/
../../scripts/`. Three path arguments and an explicit config; the README named one path and no
config.

## D18 — where the layering rules live

`eslint.config.js` imports `{ crossGameRules, sharedMayNotImportGames }` from
`eslint.boundary.config.js` and maps `withDepthRule` over them. Rules 2 and 3 are therefore
generated, not written, in the file the README credited.

## D10 — the cross-game matrix

`eslint.boundary.config.js` derives its game list by `readdirSync` over `src/games`, keeping
each directory that carries `spec.ts`: five—futoshiki, kenken, killer, sudoku, thermo. `pairs` =
`games.length * (games.length - 1)` = 20. `crossGameRules` emits one block per game, each
restricting the other four by both `@games/<other>` and `**/games/<other>/**`. The generator
throws on `games.length < 2` rather than lint vacuously green.

Enforced twice: folded into `npm run lint:eslint` (via the import above) and standalone under
`npm run lint:boundary`, which is `ci.yml`'s `boundary` lane. Live cross-game imports in the
tree: zero—by `@games/` alias and by relative traversal both. The README's "convention, not
lint" was false on both halves, and so was the furniture claim it rested on: the cell, the tier
constants, and the technique engine sit in `src/games/shared/**`.

## D16 — "zero server dependency"

`public/_headers` grants `connect-src 'self' wss://sudoku-relay.mkbabb.workers.dev`. That origin
is `RELAY_URLS` in `useSession.ts` (`VITE_RELAY_URL` or the literal), and `web/relay` is the
co-deployed Durable Object it speaks to. The solve path is untouched—no network solve, no
cross-origin fetch in the bundle—but the deploy is not server-free. `useSession.ts` reaches the
relay through `await import("./relayWire")`, so a solo page opens no socket and pays no bytes.

## Register carry

The file's incumbent voice spaces its em dashes; the cures match the file rather than the
tranche's unspaced house rule, per the "match the existing voice exactly" instruction.
