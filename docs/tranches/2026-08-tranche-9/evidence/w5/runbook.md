# T9-W5 §5.1 — the deploy estate, as run

The commands, in order, for the WGATE production pass. Every act below is the chair's and
owner-authorized per deploy; W5 built the mechanisms and proved them (`canaries.md`) without
performing one.

## The gated deploy — one act, both halves

```bash
scripts/ci-conclusion.sh --sha "$(git rev-parse HEAD)" --out /tmp/conclusion.txt
npm --prefix web/frontend run deploy -- --conclusion-file /tmp/conclusion.txt
```

Eight refusals stand between that second line and wrangler: the artifact must exist, pin
HEAD, say `success`, be under 24h old, be the sha's ONLY conclusion (one run, one attempt),
the living ledger must be current, THE TREE MUST BE THE COMMIT, and both halves of the pair
must be shippable. Add `--dry` to walk all eight and print the deploy lines instead of
running them.

The act itself, once the gate passes:

1. `cd web/relay && wrangler deploy --var RELAY_REVISION:<sha>`
2. `cd web/frontend && npm run build`
3. `cd web/frontend && wrangler pages deploy dist --project-name=sudoku --branch=master`

If (1) lands and (3) fails, the gate prints a SPLIT DEPLOY banner naming the state: the live
shell is the previous build talking to a new Worker. Re-run the gate or roll back.

`--commit-dirty=true` is gone from the Pages line. It never had a purpose except silencing
the check that now stands above it.

## After the deploy — the edge, read from outside

```bash
node scripts/edge-probe.mjs --expect-sha "$(git rev-parse HEAD)"
```

Four rows: `spa-fallback-contract`, `asset-guard`, `console-clean`, `relay-revision`. All
four must be GREEN for the production pass. `--expect-sha` is what makes `relay-revision`
check the PAIR rather than just the Worker: it reds when the Worker's revision is not the sha
Pages was built from.

Two of the four are RED at HEAD, and both are cured by acts this wave deliberately did not
perform: `relay-revision` by the first gated deploy (the endpoint is not on the live Worker
yet), `console-clean` by B2's firing below.

Offline, and safe to run from any lane at any time — no network, no deploy, nothing built:

```bash
npm --prefix web/frontend run test:deploy-gate   # 11 arms: the gate's own refusals
npm --prefix web/frontend run test:edge-probe    # 14 arms: the probe's derivations
node scripts/edge-probe.mjs --local              # the artifacts through a Pages emulator
scripts/deploy-gated.sh --check-tree             # the cleanliness arms alone
```

The first two are browserless and offline, so they are CI-eligible under O-12. Wiring them
into `ci.yml` is the floors/dist lane's fence, not this one — the npm scripts exist and are
named here so that lane has something to point at.

## Rollback

The precept's `git checkout <sha> -- web/frontend` is retired here, but NOT yet in the
precept: `docs/precepts` is a submodule (`8781ebb0`), so nothing this repo commits can reach
it. Until the chair updates it, `docs/precepts/infra/deploy.md` still prints the broken
recipe — and the broken `--commit-dirty=true` deploy line, and the dead SPA fallback.

The recipe it should carry. It never moves HEAD, so the gate would authenticate a tree it
does not ship; the cure is a worktree whose HEAD really is the target:

```bash
scripts/ci-conclusion.sh --sha <prev-good-sha> --out /tmp/rollback.txt
scripts/rollback-to-seal.sh --sha <prev-good-sha> --conclusion-file /tmp/rollback.txt --dry-run
scripts/rollback-to-seal.sh --sha <prev-good-sha> --conclusion-file /tmp/rollback.txt
```

It adds a detached worktree at the target, `npm ci`s it, and runs the same gate with
`--repo <worktree>`, so the tree that is authenticated and the tree that is built are one
tree. This repo may be as dirty as it likes; the rollback is unaffected. The worktree is
removed on exit unless `--keep`.

## B2 — the beacon drop (PREPARED here, fired at WGATE)

The ballot's default: **drop the injection**; the product ships console-clean and
self-contained. The firing is one Cloudflare setting and no repo change:

> Cloudflare dashboard → Web Analytics → the `sudoku.babb.dev` site → **remove the site**
> (or, on the Pages project, Settings → Web Analytics → **disable**). The beacon is injected
> at the edge by that setting alone; nothing in `dist/` references it, so no build, no
> deploy, and no code change is involved either way.

The other branch, if the owner keeps the analytics instead: add
`https://static.cloudflareinsights.com` to `script-src` in `web/frontend/public/_headers` and
redeploy. That branch costs a deploy and widens the CSP; the default costs neither.

Whichever fires, the verdict is read the same way:

```bash
node scripts/edge-probe.mjs --rows console-clean
```

GREEN means no cross-origin script in the served HTML is refused by the served CSP — which is
the console-clean claim, decided from the two things the browser decides it from.
