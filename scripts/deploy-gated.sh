#!/usr/bin/env bash
# deploy-gated.sh — the deploy path's gate (T5-W6.2; CH-57 mechanized).
#
# The deploy stays OWNER-AUTHORIZED PER DEPLOY. This wrapper never deploys on
# its own initiative and never schedules one; it only refuses to let the
# wrangler lines below run unless it is handed a CI conclusion artifact from
# scripts/ci-conclusion.sh that is all five of:
#
#   1. present and readable
#   2. pinned to the CURRENT HEAD sha
#   3. conclusion == success
#   4. fresher than 24h
#   5. that success is the sha's ONLY conclusion — one run, one attempt
#
# A sixth refusal joined at T7-W0 0.2 and is not about the artifact: the living
# ledger must be current under scripts/ledger-diff.mjs. A deploy ships the record
# with the product, so a record the tree refutes refuses the deploy.
#
# The rerun-laundering refusal (T7-W6, ablation-proven). `conclusion success`
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
# ── T9-W5 §5.1, the two rows that close the estate ────────
#
# CLEANLINESS (V5-C5). Every refusal above authenticates a NAME — the sha CI graded.
# The build reads the WORKING TREE, and `--commit-dirty=true` on the old wrangler line
# told wrangler to stop noticing the difference, so an uncommitted edit shipped under a
# green sha's licence and nothing anywhere said so. Two arms now stand between:
#   A. any tracked modification, anywhere in the repo — the artifact grades HEAD, so
#      HEAD is what may ship;
#   B. any UNTRACKED file under a shipped path — untracked-and-under-`web/` is the
#      file `git status` shrugs at and `vite build` bundles.
# Untracked files outside the shipped paths (scratch notes, evidence drafts) cannot
# reach `dist/`, so they do not block. `--commit-dirty` is gone from the wrangler line:
# a flag whose only function was to silence this check has no home in the gated path.
#
# THE PAIR (README:118's sentence made a mechanism). The SPA and the relay Worker are
# two deploys that must carry one sha: the frontend's `connect-src` names exactly one
# relay origin and the Worker is the only thing on it. "Deploy together or the socket
# is refused" was prose; here it is control flow. Both targets are PREFLIGHTED before
# either is touched — a missing wrangler.toml, a missing binary, an unbuildable
# frontend refuses BOTH — and the Worker goes first, so a failure there leaves the
# shell that would have called it unshipped. The Worker carries the sha it was
# deployed at (`--var RELAY_REVISION:<sha>`) and answers with it at `GET /revision`,
# which is what makes the deployed pair readable from outside: scripts/edge-probe.mjs
# `relay-revision` reads that endpoint, and an ungated `wrangler deploy` — which sets
# no var — answers `unknown` and reds the probe.
#
# Usage:
#   npm --prefix web/frontend run deploy -- --conclusion-file <path> [--dry]
#   scripts/deploy-gated.sh --conclusion-file <path> [--dry]
#   scripts/deploy-gated.sh --check-tree [--repo <dir>]
#   scripts/deploy-gated.sh --self-test
#
#   --conclusion-file  the artifact from scripts/ci-conclusion.sh (required)
#   --dry              run every check, then PRINT the deploy lines instead of
#                      executing them. Built for the born-RED canary: it makes
#                      "the gate let this through" observable without a deploy.
#   --check-tree       run the cleanliness arms ALONE and exit. Deploys nothing,
#                      reads no artifact, touches no network — the arm's canary.
#   --repo <dir>       authenticate and ship THAT tree instead of this script's own.
#                      The rollback path (scripts/rollback-to-seal.sh) builds a prior
#                      seal in a scratch worktree and points this here, so the gate
#                      reads the HEAD it is actually about to build. Nothing else
#                      should use it: the tree it names is the tree that ships.
#   --self-test        prove every refusal this script owns can fire, on fixture repos.
#                      11 arms: 4 grade the cleanliness reader directly, 7 walk the whole
#                      chain under --dry so the PREFLIGHT arms are shown deciding on their
#                      own. Offline, browserless, deploys nothing — any lane may run it
#                      (`npm --prefix web/frontend run test:deploy-gate`).
#
# Exit: 0 gate passed (deploy executed, or printed under --dry)
#       1 DEPLOY REFUSED — no wrangler invocation was reached
#       2 usage error
set -euo pipefail

SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ROOT="$SELF_DIR"
MAX_AGE_SECONDS=86400 # 24h

# What ends up inside the two artifacts: the SPA bundle (web/frontend, with the wasm
# its prebuild compiles out of csp-solver) and the Worker (web/relay). An untracked
# file under any of these is a file the build can read.
SHIPPED_PATHS=(web/frontend web/relay csp-solver)

CONCLUSION_FILE=""
DRY=0
CHECK_TREE_ONLY=0
SELF_TEST=0

# The header block above IS the usage text — print it, never a second copy of it.
usage() {
    awk 'NR>1 && /^#/ { sub(/^# ?/, ""); print; next } NR>1 { exit }' "${BASH_SOURCE[0]}"
}

# ── The loud refusal ──────────────────────────────────────
# Every call site sits above the deploy lines; reaching wrangler after one is
# impossible. The banner carries the literal token DEPLOY REFUSED so a canary
# can grep for it, and it never names the deploy binary.
refuse() {
    {
        echo ""
        echo "################################################################"
        echo "#  DEPLOY REFUSED — gated-chain law (T5-W6.2 / CH-57 / T9-W5)"
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

# ── The cleanliness arms ──────────────────────────────────
# A pure reader: prints every row of dirt it finds in `$1` and returns 1 if there was
# any, 0 if the tree is clean. It never exits, which is what lets --self-test grade it
# and the gate refuse on it. No pipes: the status output is read line by line so the
# git exit code is the one bash sees.
tree_dirt() {
    local repo="$1" line found=0
    while IFS= read -r line; do
        [[ -n "$line" ]] || continue
        found=1
        printf 'tracked  %s\n' "$line"
    done < <(git -C "$repo" status --porcelain --untracked-files=no)
    while IFS= read -r line; do
        [[ "$line" == '??'* ]] || continue
        found=1
        printf 'untracked %s\n' "$line"
    done < <(git -C "$repo" status --porcelain --untracked-files=all -- "${SHIPPED_PATHS[@]}" 2>/dev/null)
    ((found == 0))
}

check_tree() {
    local repo="$1" dirt line
    if dirt="$(tree_dirt "$repo")"; then
        echo "[deploy-gated] tree clean — no tracked modifications, no untracked files under ${SHIPPED_PATHS[*]}"
        return 0
    fi
    local -a rows=() shown=()
    while IFS= read -r line; do [[ -n "$line" ]] && rows+=("  $line"); done <<<"$dirt"
    shown=("${rows[@]:0:12}")
    if ((${#rows[@]} > 12)); then shown+=("  … and $((${#rows[@]} - 12)) more"); fi
    refuse \
        "the tree is not the commit. ${#rows[@]} row(s) of dirt:" \
        "${shown[@]}" \
        "The conclusion artifact grades a COMMIT; the build reads this tree." \
        "Commit or stash the rows above, re-read the field, then deploy."
}

# ── The self-test: the arms shown able to red ─────────────
# Fixture repos, built and thrown away — the discipline every check-*.mjs in this repo
# keeps. Three fixtures: clean (GREEN), one tracked edit (RED), one untracked file under
# a shipped path (RED). A fourth proves the scope: an untracked file OUTSIDE the shipped
# paths is not dirt, because it cannot reach the bundle.
self_test() {
    local tmp fail=0
    tmp="$(mktemp -d)"
    # expanded NOW, not at exit: $tmp is a local and the trap fires after it is gone
    # shellcheck disable=SC2064  # the early expansion is the point, not an oversight
    trap "rm -rf '$tmp'" EXIT

    mk() {
        local d="$tmp/$1"
        mkdir -p "$d/web/frontend/src" "$d/docs"
        printf 'shipped\n' >"$d/web/frontend/src/main.ts"
        printf 'record\n' >"$d/docs/note.md"
        git -C "$d" init -q -b main
        git -C "$d" add -A
        git -C "$d" -c user.email=gate@local -c user.name=gate commit -qm fixture
    }
    grade() {
        local name="$1" want="$2" got
        if tree_dirt "$tmp/$name" >/dev/null; then got=GREEN; else got=RED; fi
        if [[ "$got" == "$want" ]]; then
            echo "[self-test] ok    $name — $got"
        else
            echo "[self-test] FAIL  $name — wanted $want, got $got" >&2
            fail=1
        fi
    }

    mk clean
    grade clean GREEN

    mk tracked-edit
    printf 'shipped, edited\n' >"$tmp/tracked-edit/web/frontend/src/main.ts"
    grade tracked-edit RED

    mk untracked-shipped
    printf 'never committed\n' >"$tmp/untracked-shipped/web/frontend/src/sneak.ts"
    grade untracked-shipped RED

    mk untracked-elsewhere
    printf 'scratch\n' >"$tmp/untracked-elsewhere/docs/draft.md"
    grade untracked-elsewhere GREEN

    ((fail == 0)) || { echo "[self-test] the cleanliness arms are broken" >&2; exit 1; }
    echo "[self-test] cleanliness arms: 4/4 (2 RED on a plant, 2 GREEN on a clean tree)"

    # ── the PAIR, graded through the whole gate ───────────
    # The cleanliness fixtures above call `tree_dirt` directly. The preflight arms cannot be
    # graded that way: they only speak when §7 has already passed, so the fixture has to walk
    # the real chain. These run this same script under `--repo <fixture> --dry`, which reaches
    # the deploy lines and PRINTS them — no build, no upload, no network.
    #
    # The plants are COMMITTED, and that is the whole subtlety. `rm web/relay/wrangler.toml`
    # in a fixture is DIRT, so §7 answers first and the preflight arm never gets a turn — a
    # canary written that way looks green while proving nothing about the arm it names.
    # Committing the removal leaves a clean tree genuinely missing half the pair, which is the
    # only state in which §8 speaks.
    mkpair() {
        local d="$tmp/$1"
        mkdir -p "$d/scripts" "$d/web/frontend/node_modules/.bin" "$d/web/relay"
        printf 'process.exit(0)\n' >"$d/scripts/ledger-diff.mjs"
        printf '#!/bin/sh\necho "wrangler stub — --dry never invokes it"\n' \
            >"$d/web/frontend/node_modules/.bin/wrangler"
        chmod +x "$d/web/frontend/node_modules/.bin/wrangler"
        printf 'name = "sudoku-relay"\n' >"$d/web/relay/wrangler.toml"
        printf 'export default {}\n' >"$d/web/relay/relay.ts"
        git -C "$d" init -q -b main
        git -C "$d" add -A
        git -C "$d" -c user.email=gate@local -c user.name=gate commit -qm fixture
        shift
        if (($#)); then
            rm -rf "$@"
            git -C "$d" add -A
            git -C "$d" -c user.email=gate@local -c user.name=gate commit -qm plant
        fi
        # The artifact lives OUTSIDE the fixture repo: inside it, the plant commit would track
        # it and it would read as dirt, and this canary would grade §7 while claiming §8.
        cat >"$d.artifact" <<EOF
sha             $(git -C "$d" rev-parse HEAD)
conclusion      success
runs_for_sha    1
run_attempt     1
timestamp_epoch $(date -u +%s)
EOF
    }
    gradepair() {
        local name="$1" want="$2" out rc=0 got
        # `set -e` would kill the run on the very refusals this is here to observe, so the
        # exit code is caught in the list rather than read after the fact.
        out="$(bash "${BASH_SOURCE[0]}" --repo "$tmp/$name" --conclusion-file "$tmp/$name.artifact" --dry 2>&1)" || rc=$?
        if ((rc == 0)); then got=GREEN; else got=RED; fi
        if [[ "$got" == "$want" ]]; then
            echo "[self-test] ok    $name — $got"
        else
            echo "[self-test] FAIL  $name — wanted $want, got $got (exit $rc)" >&2
            printf '%s\n' "$out" >&2
            fail=1
        fi
    }

    mkpair sound-pair
    gradepair sound-pair GREEN

    mkpair no-relay-config "$tmp/no-relay-config/web/relay/wrangler.toml"
    gradepair no-relay-config RED

    mkpair no-relay-entry "$tmp/no-relay-entry/web/relay/relay.ts"
    gradepair no-relay-entry RED

    mkpair no-wrangler "$tmp/no-wrangler/web/frontend/node_modules/.bin/wrangler"
    gradepair no-wrangler RED

    mkpair no-frontend "$tmp/no-frontend/web/frontend"
    gradepair no-frontend RED

    mkpair no-ledger "$tmp/no-ledger/scripts/ledger-diff.mjs"
    gradepair no-ledger RED

    # …and the same chain refusing a dirty tree, so §7 is shown deciding INSIDE the chain and
    # not merely inside tree_dirt.
    mkpair dirty-in-chain
    printf 'never committed\n' >"$tmp/dirty-in-chain/web/frontend/sneak.ts"
    gradepair dirty-in-chain RED

    ((fail == 0)) || { echo "[self-test] the pair arms are broken" >&2; exit 1; }
    echo "[self-test] pair arms: 7/7 (1 GREEN sound pair, 6 RED on a plant, none deployed)"
    echo "[self-test] 11/11 — every refusal this script owns proved able to fire"
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --conclusion-file) CONCLUSION_FILE="${2:?--conclusion-file needs a value}"; shift 2 ;;
        --repo)            ROOT="$(cd "${2:?--repo needs a value}" && pwd)"; shift 2 ;;
        --dry)             DRY=1; shift ;;
        --check-tree)      CHECK_TREE_ONLY=1; shift ;;
        --self-test)       SELF_TEST=1; shift ;;
        -h|--help)         usage; exit 0 ;;
        *) echo "deploy-gated: unknown argument: $1" >&2; usage >&2; exit 2 ;;
    esac
done

FRONTEND="$ROOT/web/frontend"
RELAY="$ROOT/web/relay"

if ((SELF_TEST)); then
    self_test
    exit 0
fi

if ((CHECK_TREE_ONLY)); then
    check_tree "$ROOT"
    exit 0
fi

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
    "HEAD is         $HEAD_SHA${ROOT:+  (in $ROOT)}" \
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
# The tree being SHIPPED owns the reading, which is why the script path is $ROOT's: a
# rollback ships the seal's record with the seal's product.
[[ -f "$ROOT/scripts/ledger-diff.mjs" ]] || refuse \
    "no scripts/ledger-diff.mjs in $ROOT — the record-currency arm cannot run," \
    "and an arm that cannot run must never pass."
if ! LEDGER_OUT="$(node "$ROOT/scripts/ledger-diff.mjs" --require-ledger --assert-state --verify-cites 2>&1)"; then
    printf '%s\n' "$LEDGER_OUT" >&2
    refuse \
        "the living ledger is not current — ledger-diff exited nonzero (report above)." \
        "Restamp or move the rows it names, then re-run:" \
        "  node scripts/ledger-diff.mjs --require-ledger --assert-state --verify-cites"
fi

# ── 7. The tree must BE the commit ────────────────────────
check_tree "$ROOT"

# ── 8. Both halves of the pair must be shippable ──────────
# Preflight, before anything is built or uploaded: if either target is unshippable,
# NEITHER goes. This is README:118's "deploy together or the socket is refused" as
# control flow rather than intention.
WRANGLER="$FRONTEND/node_modules/.bin/wrangler"
[[ -d "$FRONTEND" ]] || refuse "no web/frontend in $ROOT — nothing to build."
[[ -x "$WRANGLER" ]] || refuse \
    "wrangler is not installed at $WRANGLER" \
    "Run npm ci in web/frontend. NEVER \`npx wrangler\` — it re-resolves the packument" \
    "and OOMs node's heap (closed at 65425697)."
[[ -f "$RELAY/wrangler.toml" ]] || refuse \
    "no web/relay/wrangler.toml in $ROOT — the pair's second half is missing." \
    "The SPA names exactly one relay origin in its CSP; shipping the shell alone" \
    "leaves the shared board pointed at whatever was deployed last."
[[ -f "$RELAY/relay.ts" ]] || refuse "no web/relay/relay.ts in $ROOT — the Worker has no entry."

# ── Gate passed ───────────────────────────────────────────
echo "[deploy-gated] gate PASSED"
echo "[deploy-gated]   repo        $ROOT"
echo "[deploy-gated]   sha         $ART_SHA (== HEAD)"
echo "[deploy-gated]   run         $ART_RUN_ID"
echo "[deploy-gated]   conclusion  $ART_CONCLUSION"
echo "[deploy-gated]   runs/attempt $ART_RUNS / $ART_ATTEMPT${ART_RERUNS_OK:+  (reruns_permitted $ART_RERUNS_OK)}"
echo "[deploy-gated]   artifact    ${AGE}s old (cap ${MAX_AGE_SECONDS}s)"

PAGES_LINE="wrangler pages deploy dist --project-name=sudoku --branch=master"
RELAY_LINE="wrangler deploy --var RELAY_REVISION:$HEAD_SHA"

if ((DRY)); then
    echo "[deploy-gated] DRY — nothing was built and nothing was deployed. The act would be:"
    echo "[deploy-gated]   \$ cd $RELAY && $RELAY_LINE"
    echo "[deploy-gated]   \$ cd $FRONTEND && npm run build"
    echo "[deploy-gated]   \$ cd $FRONTEND && $PAGES_LINE"
    exit 0
fi

# npm put node_modules/.bin on PATH for the package script this wrapper replaced; keep
# that resolution identical when invoked from a bare shell. The relay has no
# node_modules of its own and borrows the frontend's two tools (web/relay/wrangler.toml).
PATH="$FRONTEND/node_modules/.bin:$PATH"

# The Worker first. It is the smaller act and the likelier auth failure, and a Worker
# deployed without its shell is invisible; a shell deployed without its Worker is a
# refused socket on a live board.
echo "[deploy-gated] 1/2 relay Worker — $RELAY_LINE"
(cd "$RELAY" && $RELAY_LINE)

echo "[deploy-gated] 2/2 Pages — npm run build && $PAGES_LINE"
cd "$FRONTEND"
npm run build
# The verbatim wrangler line lives HERE and nowhere else. It sat in package.json's
# `deploy:raw` from T5-W6.2 to T9-W5 so knip could see the binary consumed, and that
# appeasement was an ungated side door: `npm run deploy:raw` shipped dist past every
# refusal above (V3-C6). knip.json's `ignoreBinaries` now carries wrangler with this
# file named as its consumer.
if ! $PAGES_LINE; then
    {
        echo ""
        echo "################################################################"
        echo "#  SPLIT DEPLOY — the relay Worker landed at $HEAD_SHA and Pages did NOT."
        echo "#  The live shell is the PREVIOUS build talking to a NEW Worker."
        echo "#  Re-run this gate to finish the pair, or roll the Worker back:"
        echo "#    scripts/rollback-to-seal.sh --sha <prev-good> --dry-run"
        echo "################################################################"
        echo ""
    } >&2
    exit 1
fi
