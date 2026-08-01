# T5-W1 rows 1.8 + 1.15 — security notes

Lane: Opus, T5-W1, rows 1.8 (Dependabot #68/#69) + 1.15 (npm audit lane, COOP/CORP, the
brace-expansion divergence). Charter: `evidence/audit/r3/security-posture.md` (CH-37).
Base HEAD `f38c5130`. All numbers below re-derived 2026-08-01 at the moment of writing—none are
carried forward from r3.

Banked alongside: `npm-audit-RED.txt` (5 highs, exit 1) · `npm-audit-GREEN.txt` (0, exit 0) ·
`dependabot-RED.txt` · `wrangler-dry-surface.txt` · `fragments/npm-audit.yml`.

---

## 1. The divergence, adjudicated — r3's UNKNOWN is now KNOWN

r3 recorded it as an open question:

> Dependabot alert **#28 for brace-expansion is `fixed`** and no new alert has been raised. The npm
> advisory range now extends past what alert #28 covered. Cause of the divergence is **UNKNOWN**
> (GitHub advisory range lag vs. the npm mirror is the likely candidate, unverified).

**The range-lag hypothesis is refuted, and the real cause is confirmed.** Both halves below are
API-verified, not inferred.

### 1a. The ranges don't diverge at all—they're identical

`gh api /advisories/GHSA-mh99-v99m-4gvg` (published 2026-07-24T21:53:14Z, updated
2026-07-31T19:37:57Z, CVSS 7.5) against `npm audit --json`:

| GitHub advisory range | npm audit range | Same set? |
|---|---|---|
| `>= 4.0.0, < 5.0.8` | `4.0.0 - 5.0.7` | yes—npm's inclusive upper 5.0.7 == GitHub's exclusive 5.0.8 |
| `>= 2.0.0, < 2.1.3` | `2.0.0 - 2.1.2` | yes—same identity, different notation |
| `>= 3.0.0, < 3.0.3` | (no 3.x installed) | n/a |
| `< 1.1.17` | (no 1.x installed) | n/a |

Two notations for one set. There is **zero range drift** between GitHub's advisory DB and the npm
mirror on this advisory. r3's stated candidate cause is wrong, and it was flagged `unverified`—the
audit was honest about its own uncertainty, and this row closes it.

### 1b. The real cause: dev-scope auto-triage suppression

Dependabot **did** raise the brace-expansion alerts. They just never entered the `open` set:

```
$ gh api repos/mkbabb/csp-solver/dependabot/alerts --paginate \
    --jq '.[] | select(.dependency.package.name=="brace-expansion")'
#72  state=auto_dismissed  range=">= 2.0.0, < 2.1.3"  GHSA-mh99-v99m-4gvg  created 2026-07-31T20:29:00Z
#71  state=auto_dismissed  range=">= 4.0.0, < 5.0.8"  GHSA-mh99-v99m-4gvg  created 2026-07-31T20:29:00Z
#61  state=fixed           range=">= 2.0.0, < 2.0.3"  GHSA-f886-m6hf-6m8v  (a DIFFERENT advisory)
#28  state=fixed           range=">= 2.0.0, < 2.0.3"  GHSA-f886-m6hf-6m8v  (a DIFFERENT advisory)
```

The decisive field pair, on both #71 and #72:

```
"scope": "development",
"created_at":        "2026-07-31T20:29:00Z",
"auto_dismissed_at": "2026-07-31T20:29:00Z",   <- identical to the second
"dismissed_reason":  null,
"state":             "auto_dismissed"
```

Dismissal timestamp equal to creation timestamp means no human and no elapsed triage window—the
alert was suppressed by rule at the instant it was raised, on a `development`-scoped dependency.
These are the **only two `auto_dismissed` records in the repo's entire 62-alert history**; every
other suppression is a human `dismissed` (9) with a reason attached. The pattern is unambiguous.

**Narrowed but not fully closed**: the suppression mechanism is proven from the alert records; the
specific rule that fired is GitHub's default Dependabot auto-triage preset for development-scoped
dependencies. GitHub exposes **no API for reading auto-triage rules**, so the rule's *name* stays
unverifiable from here. Recorded as narrowed-UNKNOWN rather than asserted—the mechanism is fact, the
rule label is inference.

### 1c. Two corrections to r3

Both stated plainly; r3 remains the better document on everything else in this row.

1. **"No new alert has been raised" was already false when written.** #71/#72 were created
   2026-07-31T20:29:00Z; r3's header dates the audit 2026-08-01. They existed ~13 hours earlier.
   Worse for the claim: both records sit on **page 1** of the unpaginated
   `gh api .../dependabot/alerts` response (30 records: 17 fixed, 9 dismissed, 2 auto_dismissed,
   2 open), so they were inside the data r3 already held. The `select(.state == "open")` filter is
   what elided them—the audit looked at the open set and concluded about the whole set.
2. **"20 prior alerts are `fixed`"** doesn't reproduce. Today, paginated: **49 fixed, 9 dismissed,
   2 auto_dismissed, 2 open = 62 total**. Unpaginated page 1 gives 17 fixed. Neither is 20. The
   likely cause is the same missing `--paginate`, but the number isn't reconstructible, so this is
   logged as a discrepancy rather than explained away.

### 1d. What this costs the gates—and why row 1.15 is the load-bearing one

Row 1.8's gate is `gh api ... select(.state == "open") | length == 0`. Section 1b proves that
predicate is **structurally blind to every dev-scoped high**: auto-triage moves them out of `open`
at creation, so the dashboard reads zero while the advisory is live in the lockfile. Had row 1.15's
lane not existed, brace-expansion would have stayed invisible to CI *and* to the dashboard
indefinitely—which is exactly what happened between 2026-07-24 and this wave.

`npm audit` has no dev-scope suppression. **The two gates are complementary, not redundant, and the
npm audit lane is the only one of the pair that sees this class.** That's now written into the
fragment's own header so the next reader can't mistake the dashboard for coverage.

---

## 2. Remediation — what landed

All three advisory roots cleared with **patched versions available inside the already-satisfied
ranges**. No `overrides` block was needed; the row's "override if transitive" branch didn't have to
be taken, so it wasn't.

| Root | HEAD | Now | Requiring range | How |
|---|---|---|---|---|
| postcss | 8.5.16 | **8.5.25** | `^8.5.15` (@vue/compiler-sfc), `^8.5.16` (vite) | `npm update postcss`, in-caret |
| sharp | 0.34.5 | **0.35.2** | via miniflare | rode the wrangler bump |
| miniflare | 4.20260708.1 | **4.20260730.0** | via wrangler | rode the wrangler bump |
| wrangler | 4.110.0 | **4.116.0** | manifest devDep | range tightened, see §3 |
| brace-expansion | 5.0.7 | **5.0.9** | `^5.0.5` (minimatch) | `npm update brace-expansion`, in-caret |
| ├ editorconfig/…/brace-expansion | 2.1.2 | **2.1.4** | `^2.0.2` (minimatch) | same |
| └ glob/…/brace-expansion | 2.1.2 | **2.1.4** | `^2.0.2` (minimatch) | same |

`npm audit --audit-level=high`: **5 highs / exit 1 → 0 / exit 0.** `npm run build` exit 0,
`npx vitest run` 31 files / 332 tests exit 0. Tails in `npm-audit-GREEN.txt`.

`npm audit fix` was **not** used. Its fix for the `wrangler` node is in-caret under `^4.110.0`,
which reaches 4.118.0—the forbidden alpha. Targeted updates under a tightened range instead.

### Exploitability, unchanged by the bumps and worth keeping on the record

- **brace-expansion**: DoS by unbounded expansion → OOM. All three copies `dev: true`, reached
  through `minimatch` in build tooling. No production path; no attacker-controlled glob.
- **postcss**: 0 hits for `postcss` in `dist/assets/` (re-verified). Build-time only; every CSS
  input is repo-authored.
- **sharp**: dormant binary. `miniflare` is wrangler's local Workers simulator; there's no
  `wrangler.toml`/`wrangler.jsonc` in the tree and the only wrangler invocation is
  `pages deploy dist`. libvips never decodes anything here.

None of the three was an exploitable production hole. They're cleared because a clean advisory
surface is the only surface a gate can enforce—not because the sky was falling.

---

## 3. The wrangler hard stop, made enforcing

r3's SEC-2 reads `npm update wrangler --prefix web/frontend` → 4.116.0. **Taken literally that
command lands 4.118.0 today** and breaches the hard stop: `npm update` resolves to the newest
version satisfying the range, the range was `^4.110.0`, and the registry's latest is 4.118.0.

Registry mapping re-derived 2026-08-01 (`npm view wrangler@<v> dependencies.miniflare`, then
`npm view miniflare@<mf> dependencies.sharp`)—it reproduces r3's table exactly:

| wrangler | miniflare | sharp | |
|---|---|---|---|
| 4.110.0 | 4.20260708.1 | 0.34.5 | vulnerable (was installed) |
| 4.113.0 | 4.20260721.0 | 0.34.5 | vulnerable |
| 4.114.0 | 4.20260722.0 | 0.35.2 | first clean |
| **4.116.0** | **4.20260730.0** | **0.35.2** | **TAKEN**—newest on the stable miniflare 4.x line |
| 4.117.0 | 5.20260730.0-**alpha** | 0.35.2 | FORBIDDEN—the miniflare-5-alpha wall |
| 4.118.0 | 5.20260730.0-**alpha** | 0.35.2 | FORBIDDEN (registry latest) |

So the manifest range moved—`"wrangler": "^4.110.0"` → `"~4.116.0"` (>=4.116.0 <4.117.0). This is
the **only** manifest edit in the row; everything else is lockfile-only.

Tightening rather than pinning exact keeps 4.116.x patches available while making 4.117+
unreachable by any future `npm update`, `npm install`, or Dependabot PR. Per the T2–T4 lesson
*"a ruling lands with its enforcing config in the same commit"*: a hard stop that lives only in an
evidence file is a hard stop the next agent breaks by running the obvious command.

**Deploy dry surface verified** (`wrangler-dry-surface.txt`): `npx wrangler --version` → `4.116.0`
exit 0; `npx wrangler pages --help` → exit 0 with `pages deploy [directory]` present. No deploy run
—deploys are owner-authorized per-deploy. The row's blocked-condition wasn't hit.

---

## 4. Row 1.8's gate: green locally, greens on the dashboard only at the push

`gh api ... select(.state == "open") | length` still returns **2** (#69 postcss, #68 sharp). That is
correct and expected: Dependabot re-scans `package-lock.json` when the commit lands on the default
branch. The lockfile that clears both alerts exists on disk and is proven clear locally
(`npm-audit-GREEN.txt` §3—every installed version is out of every vulnerable range), but no agent
in this lane commits or pushes.

**Gate re-run at W-GATE**, after the team lead's push, verbatim:

```
gh api repos/mkbabb/csp-solver/dependabot/alerts --jq '[.[] | select(.state == "open")] | length'
# expect: 0
```

Read §1d before trusting that zero: it counts only what auto-triage lets into `open`.
`npm audit --audit-level=high` exit 0 is the stronger of the two assertions.

---

## 5. COOP/CORP (row 1.15, r3 G2+G3)

`web/frontend/public/_headers`, additive lines in the existing `/*` stanza:

```
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-site
```

**The CSP line did not move**—verified byte-identical against `HEAD:web/frontend/public/_headers`.
Diff is 26 insertions / 1 deletion; the single deletion is a comment true-up (an existing
parenthetical read "no COOP/COEP", which this change falsified—left uncorrected it would have been a
fresh doc-truth breach in the same commit that caused it).

Pre-flight checks before setting COOP, so this isn't a header pasted on faith:

- `window.open` and `.opener` appear nowhere in `src/`—zero hits.
- The only two cross-origin links (AttributionCard → github.com) already carry
  `rel="noopener noreferrer"`. COOP restates at the transport layer what the markup asserts.
- Every `postMessage` hit in `src/` is solver-Worker traffic. COOP governs browsing-context groups,
  not workers—the wasm path is untouched, and `npx vitest run` (332 tests) plus `npm run build` both
  stayed green.
- `SharedArrayBuffer`: 0 hits. **COEP deliberately not set**—it's the expensive half (CORP or CORS
  on every subresource) and buys only SAB, which this app never uses.

`same-site` over `same-origin` for CORP is deliberate: the registrable domain is `babb.dev`, so
`*.babb.dev` keeps access while off-site embedding is refused. These assets are public static bytes,
so CORP is anti-hotlink hygiene, not a confidentiality control. Rationale is inline in `_headers`
for the reader who meets the header before this file.

`dist/_headers` carries both after `npm run build`. **Live-edge confirmation is a post-deploy check,
not claimable here**—`curl -I https://sudoku.babb.dev/` still serves the pre-deploy header set.

### `style-src 'unsafe-inline'` — untouched, and that's the ruling

Deferred to **W5-BALLOT-6** as accepted-documented, per the row. Not silently accepted:
it's load-bearing (Vue `:style` bindings + pencil-boil write inline style attributes at runtime),
`'unsafe-hashes'` can't help because the values are dynamic, and the real cure is a per-request
nonce—which **a CF Pages static `_headers` file cannot mint**. Closing it means a Pages Function or
a `strict-dynamic`-style refactor, which is a ballot question, not a lane decision.

---

## 6. Not this lane's rows

Named so they aren't mistaken for covered ground:

- **SEC-5** `.github/dependabot.yml` (no automated PRs today—alerts are raised and sit).
- **SEC-6/7** secret scanning, push protection, Dependabot security updates: all three
  **`disabled`** on a **public** repo—re-verified via `gh api repos/mkbabb/csp-solver`. Owner-side
  one-click toggles.
- **SEC-8** top-level `permissions: contents: read` in `ci.yml`—that file belongs to the integrator
  lane; this lane emits fragments only.
- `@mkbabb/pencil-boil` npm provenance—cross-repo.
- HSTS preload submission status at hstspreload.org—owner-side, unverifiable from the repo.

§1d supplies a new owner row: **enabling Dependabot security updates alone won't surface dev-scoped
highs**, because auto-triage suppresses them before they reach `open`. The npm audit CI lane is the
control that covers that class; if the owner wants them on the dashboard too, the auto-triage
preset has to be turned off in repo settings.
