# W5 — Deploy Option A (formalize the static + API topology)

**Formalizes what's already live and kills the P0 DNS exposure.** Ratified 2026-07-04: A and C land **concomitant**; FastAPI stays as the hardened reference.

**Dependencies**: ← W4 (the hardened service is what the API box runs); owner actions OD-4/OD-5. **Effort**: S (≤1 day repo-side; owner account actions separate).

---

## Scope (file-level)

- **CF Pages config**: `_redirects` routing `/api/*` to the API origin; **`_headers`** with the M5b set (CSP, HSTS, X-Frame-Options)—confirmed absent at both nginx layers (Pass-1 M5b).
- **Small always-on API origin** for the FastAPI reference: OD-5 (owner picks/pays the box, Fly-class ~$2–5/mo). Serves N=5-Easy and anything past the UI ceiling once W6 retires the common sizes.
- **Owner DNS actions** (OD-4, ratified—needs execution): delete the dangling `api.csp-solver.babb.dev` CNAME (P0 takeover shape, live and verified twice—Pass-1 G5, Pass-2 D8 re-check); resolve the NXDOMAIN legacy host `mbabb.friday.institute:1022` (referenced by the old deploy scripts; W0 already removed the silent default).
- **`docker-compose.prod.yml`**: committed, versioned prod defaults per this topology (Pass-1 G4 FAIL-EXPLICIT—no more out-of-band-only live config).
- **FastAPI = hardened reference** (ratified): the W4 taxonomy/DI/limiter service is the artifact; no archival.

## Acceptance gates

| Gate | Value | Evidence |
|---|---|---|
| DNS | `api.csp-solver.babb.dev` resolves to nothing (record deleted) or to the claimed origin—never dangling | Pass-1 deploy-docker P0; verify with `dig` post-action |
| `/health` | steady-state ~10 ms, with the concurrent-completion stall bounded by W4's `max_solutions` cap | `pass3/gil-liberation-completeness.md` |
| Headers | CSP/HSTS/X-Frame present on the served site | M5b |
| Compose | prod compose up from committed defaults, no env archaeology | Pass-1 G4 |

## Seed artifacts

- `pass2/deploy-topology-evidence.md` — the priced fork (A ≈ $0–5/mo, half-live already; B rejected—no technical differentiator; C $0 marginal).
- All config re-derived; no prototype diff exists for deploy files.

## Residual risks

- Owner-action latency: the CNAME deletion and box choice are outside repo scope; the wave's repo-side work shouldn't wait on them (land `_redirects`/`_headers`/compose defaults immediately).
- The API origin inherits W4's documented `/health` tail-stall under concurrent completion—bounded, not eliminated; monitor after cutover.
