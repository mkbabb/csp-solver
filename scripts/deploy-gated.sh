#!/usr/bin/env bash
# deploy-gated.sh — the deploy path's gate (T5-W6.2; CH-57 mechanized).
#
# The deploy stays OWNER-AUTHORIZED PER DEPLOY. This wrapper never deploys on
# its own initiative and never schedules one; it only refuses to let the
# existing wrangler line run unless it is handed a CI conclusion artifact from
# scripts/ci-conclusion.sh that is all four of:
#
#   1. present and readable
#   2. pinned to the CURRENT HEAD sha
#   3. conclusion == success
#   4. fresher than 24h
#   5. that success is the sha's ONLY conclusion — one run, one attempt
#
# A fifth refusal joined at T7-W0 0.2 and is not about the artifact: the living
# ledger must be current under scripts/ledger-diff.mjs. A deploy ships the record
# with the product, so a record the tree refutes refuses the deploy.
#
# A SIXTH joined at T7-W6 — RERUN LAUNDERING, ablation-proven. `conclusion success`
# says nothing about how many verdicts the sha collected on its way there:
# ci-conclusion.sh banked `runs_for_sha` from birth and this gate never read it, so an
# artifact carrying `conclusion success` / `runs_for_sha 7` rode the gate green (banked:
# docs/tranches/2026-08-tranche-7/evidence/w6/rerun-laundering-ablation.txt). Re-running
# a red until one attempt comes out green is the reflex the whole gated chain exists to
# defeat, and it costs nothing to perform. So the green must be the sha's ONLY
# conclusion: exactly one run, exactly one attempt. Both fields must be PRESENT — an
# artifact from a generator too old to bank them is refused, never waved through, because
# a missing field defaulting permissive is the same blindness in a new spelling.
#
# The one lift is explicit and signed: `reruns_permitted yes` plus a one-line
# `reruns_reason` in the artifact. ci-conclusion.sh never writes either; a human adds
# them, and this gate then prints the count it was asked to forgive.
#
# The wrangler invocation below moved here VERBATIM from web/frontend
# package.json scripts.deploy. The wrapper is the only change to how the deploy
# runs; the deploy line itself is byte-identical to what it replaced.
#
# Usage:
#   npm --prefix web/frontend run deploy -- --conclusion-file <path> [--dry]
#   scripts/deploy-gated.sh --conclusion-file <path> [--dry]
#
#   --conclusion-file  the artifact from scripts/ci-conclusion.sh (required)
#   --dry              run every check, then PRINT the deploy line instead of
#                      executing it. Built for the born-RED canary: it makes
#                      "the gate let this through" observable without a deploy.
#
# Exit: 0 gate passed (deploy executed, or printed under --dry)
#       1 DEPLOY REFUSED — no wrangler invocation was reached
#       2 usage error
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND="$ROOT/web/frontend"
MAX_AGE_SECONDS=86400 # 24h

CONCLUSION_FILE=""
DRY=0

# The header block above IS the usage text — print it, never a second copy of it.
usage() {
    awk 'NR>1 && /^#/ { sub(/^# ?/, ""); print; next } NR>1 { exit }' "${BASH_SOURCE[0]}"
}

# ── The loud refusal ──────────────────────────────────────
# Every call site sits above the deploy line; reaching wrangler after one is
# impossible. The banner carries the literal token DEPLOY REFUSED so a canary
# can grep for it, and it never names the deploy binary.
refuse() {
    {
        echo ""
        echo "################################################################"
        echo "#  DEPLOY REFUSED — gated-chain law (T5-W6.2 / CH-57)"
        echo "#"
        for line in "$@"; do printf '#  %s\n' "$line"; done
        echo "#"
        echo "#  Nothing was built. Nothing was deployed."
        echo "#  Cure:"
        echo "#    scripts/ci-conclusion.sh --sha \"\$(git rev-parse HEAD)\" --out <path>"
        echo "#    npm --prefix web/frontend run deploy -- --conclusion-file <path>"
        echo "################################################################"
        echo ""
    } >&2
    exit 1
}

# ── Read one "key value" field out of the artifact ────────
artifact_field() {
    local want="$1" file="$2" key value
    # `|| [[ -n $key ]]` so a file with no trailing newline still yields its last line
    while read -r key value _ || [[ -n "$key" ]]; do
        [[ "$key" == "$want" ]] || continue
        printf '%s' "$value"
        return 0
    done <"$file"
    return 1
}

# Same read, but the value is the WHOLE remainder of the line — `reruns_reason` is a
# sentence, and a one-word reason is not a reason.
artifact_rest() {
    local want="$1" file="$2" key value
    while read -r key value || [[ -n "$key" ]]; do
        [[ "$key" == "$want" ]] || continue
        printf '%s' "$value"
        return 0
    done <"$file"
    return 1
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --conclusion-file) CONCLUSION_FILE="${2:?--conclusion-file needs a value}"; shift 2 ;;
        --dry)             DRY=1; shift ;;
        -h|--help)         usage; exit 0 ;;
        *) echo "deploy-gated: unknown argument: $1" >&2; usage >&2; exit 2 ;;
    esac
done

# ── 1. The artifact must exist ────────────────────────────
[[ -n "$CONCLUSION_FILE" ]] || refuse \
    "no --conclusion-file was given." \
    "A deploy requires a banked CI conclusion for the current HEAD."

[[ -f "$CONCLUSION_FILE" ]] || refuse \
    "conclusion artifact not found: $CONCLUSION_FILE"

[[ -r "$CONCLUSION_FILE" ]] || refuse \
    "conclusion artifact is not readable: $CONCLUSION_FILE"

ART_SHA="$(artifact_field sha "$CONCLUSION_FILE" || true)"
ART_CONCLUSION="$(artifact_field conclusion "$CONCLUSION_FILE" || true)"
ART_EPOCH="$(artifact_field timestamp_epoch "$CONCLUSION_FILE" || true)"
ART_RUN_ID="$(artifact_field run_id "$CONCLUSION_FILE" || true)"
ART_RUNS="$(artifact_field runs_for_sha "$CONCLUSION_FILE" || true)"
ART_ATTEMPT="$(artifact_field run_attempt "$CONCLUSION_FILE" || true)"
ART_RERUNS_OK="$(artifact_field reruns_permitted "$CONCLUSION_FILE" || true)"
ART_RERUNS_WHY="$(artifact_rest reruns_reason "$CONCLUSION_FILE" || true)"

[[ -n "$ART_SHA" ]] || refuse "artifact has no 'sha' field: $CONCLUSION_FILE"
[[ -n "$ART_EPOCH" ]] || refuse "artifact has no 'timestamp_epoch' field: $CONCLUSION_FILE"
[[ "$ART_EPOCH" =~ ^[0-9]+$ ]] || refuse "artifact 'timestamp_epoch' is not an integer: '$ART_EPOCH'"

# ── 2. The pin must be the CURRENT HEAD ───────────────────
HEAD_SHA="$(git -C "$ROOT" rev-parse HEAD)"
[[ "$ART_SHA" == "$HEAD_SHA" ]] || refuse \
    "artifact pins   $ART_SHA" \
    "HEAD is         $HEAD_SHA" \
    "A conclusion earned by another commit does not license this one."

# ── 3. The conclusion must be success ─────────────────────
[[ "$ART_CONCLUSION" == "success" ]] || refuse \
    "artifact conclusion is '${ART_CONCLUSION:-<empty>}', not 'success'" \
    "run $ART_RUN_ID for $ART_SHA"

# ── 4. The artifact must be fresh ─────────────────────────
NOW_EPOCH="$(date -u +%s)"
AGE=$((NOW_EPOCH - ART_EPOCH))
((AGE >= 0)) || refuse \
    "artifact timestamp is $((-AGE))s in the future — clock skew or a hand-edit."
((AGE < MAX_AGE_SECONDS)) || refuse \
    "artifact is stale: ${AGE}s old (cap ${MAX_AGE_SECONDS}s / 24h)" \
    "Re-read the field: scripts/ci-conclusion.sh --sha \"$HEAD_SHA\" --out <path>"

# ── 5. The green must be the sha's ONLY conclusion ────────
# The wave's preferred arm is REFUSAL; the declaration is the escape hatch, not the path.
[[ -n "$ART_RUNS" ]] || refuse \
    "artifact has no 'runs_for_sha' field: $CONCLUSION_FILE" \
    "It predates the rerun-laundering gate. Re-read the field with today's generator:" \
    "  scripts/ci-conclusion.sh --sha \"\$(git rev-parse HEAD)\" --out <path>"
[[ -n "$ART_ATTEMPT" ]] || refuse \
    "artifact has no 'run_attempt' field: $CONCLUSION_FILE" \
    "It predates the rerun-laundering gate. Re-read the field with today's generator."
[[ "$ART_RUNS" =~ ^[0-9]+$ ]] || refuse "artifact 'runs_for_sha' is not an integer: '$ART_RUNS'"

LAUNDERED=()
[[ "$ART_RUNS" == "1" ]] || LAUNDERED+=("runs_for_sha is $ART_RUNS — this sha collected $ART_RUNS workflow runs")
[[ "$ART_ATTEMPT" == "1" ]] || LAUNDERED+=("run_attempt is $ART_ATTEMPT — run $ART_RUN_ID was re-run at least once")

if ((${#LAUNDERED[@]} > 0)); then
    if [[ "$ART_RERUNS_OK" == "yes" ]]; then
        [[ -n "$ART_RERUNS_WHY" ]] || refuse \
            "'reruns_permitted yes' carries no 'reruns_reason' line." \
            "A permission without a reason is the laundering it licenses."
        echo "[deploy-gated] RERUNS PERMITTED — declared in the artifact, not inferred:"
        for l in "${LAUNDERED[@]}"; do echo "[deploy-gated]   $l"; done
        echo "[deploy-gated]   reason: $ART_RERUNS_WHY"
    else
        refuse \
            "the green is NOT this sha's only conclusion:" \
            "${LAUNDERED[@]}" \
            "A red re-run until one attempt comes out green ships the red tree." \
            "Fix the cause and push, or declare it in the artifact, on purpose:" \
            "  reruns_permitted yes" \
            "  reruns_reason    <why these extra conclusions are not laundering>"
    fi
fi

# ── 6. The living ledger must be current ──────────────────
# A deploy ships the record with the product. T7-W0 0.2 (T7-R04): a §1 row landing at a
# wave of a sealed tranche, a row the tree refutes, or a cite that points nowhere means
# the ledger describes a repo that no longer exists. Same instrument CI runs, same flags.
if ! LEDGER_OUT="$(node "$ROOT/scripts/ledger-diff.mjs" --require-ledger --assert-state --verify-cites 2>&1)"; then
    printf '%s\n' "$LEDGER_OUT" >&2
    refuse \
        "the living ledger is not current — ledger-diff exited nonzero (report above)." \
        "Restamp or move the rows it names, then re-run:" \
        "  node scripts/ledger-diff.mjs --require-ledger --assert-state --verify-cites"
fi

# ── Gate passed ───────────────────────────────────────────
echo "[deploy-gated] gate PASSED"
echo "[deploy-gated]   sha         $ART_SHA (== HEAD)"
echo "[deploy-gated]   run         $ART_RUN_ID"
echo "[deploy-gated]   conclusion  $ART_CONCLUSION"
echo "[deploy-gated]   runs/attempt $ART_RUNS / $ART_ATTEMPT${ART_RERUNS_OK:+  (reruns_permitted $ART_RERUNS_OK)}"
echo "[deploy-gated]   artifact    ${AGE}s old (cap ${MAX_AGE_SECONDS}s)"

cd "$FRONTEND"
# npm put node_modules/.bin on PATH for the package script this wrapper
# replaced; keep that resolution identical when invoked from a bare shell.
PATH="$FRONTEND/node_modules/.bin:$PATH"

if ((DRY)); then
    echo "[deploy-gated] DRY — the deploy line was NOT executed. It would be:"
    echo "[deploy-gated]   \$ npm run build"
    echo "[deploy-gated]   \$ npm run deploy:raw   # wrangler pages deploy dist --project-name=sudoku --branch=master --commit-dirty=true"
    exit 0
fi

npm run build
# The verbatim wrangler line lives in package.json's deploy:raw — where knip can
# see the binary is consumed (run 30720212628's knip red) — and nowhere else.
exec npm run deploy:raw
