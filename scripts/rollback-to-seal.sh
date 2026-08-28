#!/usr/bin/env bash
# rollback-to-seal.sh — put a PRIOR commit's build back on the edge, gated (T9-W5 §5.1).
#
# It replaces the recipe in docs/precepts/infra/deploy.md §Rollback, which was:
#
#     git checkout <prev-good-sha> -- web/frontend
#     cd web/frontend && npm ci && npm run deploy
#
# That recipe never moves HEAD. `git checkout <sha> -- <path>` writes the old files into the
# CURRENT commit's working tree, so the deploy gate reads HEAD — a sha whose CI conclusion
# grades source that is no longer on disk — authenticates it, and ships something else. It is
# the dirty-tree hole in its most convincing costume: everything looks green, and the artifact
# is a certificate for a tree that does not exist. (T9 formation, V3's finding; the same
# disease as V5-C5.)
#
# The true recipe is a WORKTREE. `git worktree add --detach <dir> <sha>` gives that commit its
# own checkout, whose HEAD really is the sha, and whose working tree nothing local can
# contaminate — this repo can be as dirty as it likes and the rollback is unaffected. The gate
# then runs against THAT directory (`--repo`), so the tree it authenticates and the tree it
# builds are one tree, which is the whole invariant.
#
# The conclusion artifact must be the ROLLBACK TARGET's, not HEAD's. Re-read the field for the
# old sha — CI's verdict on it is still on record and `gh` will still hand it over:
#
#   scripts/ci-conclusion.sh --sha <prev-good-sha> --out /tmp/rollback.txt
#   scripts/rollback-to-seal.sh --sha <prev-good-sha> --conclusion-file /tmp/rollback.txt
#
# Usage:
#   scripts/rollback-to-seal.sh --sha <rev> --conclusion-file <path> [--dry-run] [--keep]
#
#   --sha              the commit to put back. Must be an ancestor of HEAD: a rollback goes
#                      backwards along this history, never sideways onto another one.
#   --conclusion-file  that sha's artifact from scripts/ci-conclusion.sh (required)
#   --dry-run          check every precondition, print the plan, and stop. Creates no
#                      worktree, installs nothing, deploys nothing.
#   --keep             leave the worktree behind for inspection instead of removing it.
#
# Exit: 0 the plan is sound (--dry-run) or the gated deploy ran
#       1 ROLLBACK REFUSED
#       2 usage error
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GATE="$ROOT/scripts/deploy-gated.sh"

SHA=""
CONCLUSION_FILE=""
DRY=0
KEEP=0

usage() {
    awk 'NR>1 && /^#/ { sub(/^# ?/, ""); print; next } NR>1 { exit }' "${BASH_SOURCE[0]}"
}

refuse() {
    {
        echo ""
        echo "################################################################"
        echo "#  ROLLBACK REFUSED — T9-W5 §5.1"
        echo "#"
        for line in "$@"; do printf '#  %s\n' "$line"; done
        echo "#"
        echo "#  No worktree was created. Nothing was built. Nothing was deployed."
        echo "################################################################"
        echo ""
    } >&2
    exit 1
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --sha)             SHA="${2:?--sha needs a value}"; shift 2 ;;
        --conclusion-file) CONCLUSION_FILE="${2:?--conclusion-file needs a value}"; shift 2 ;;
        --dry-run)         DRY=1; shift ;;
        --keep)            KEEP=1; shift ;;
        -h|--help)         usage; exit 0 ;;
        *) echo "rollback-to-seal: unknown argument: $1" >&2; usage >&2; exit 2 ;;
    esac
done

[[ -n "$SHA" ]] || refuse "no --sha was given. Name the commit to put back on the edge."

# ── 1. The target must be a real commit on THIS history ───
TARGET="$(git -C "$ROOT" rev-parse --verify --quiet "${SHA}^{commit}" || true)"
[[ -n "$TARGET" ]] || refuse "'$SHA' does not resolve to a commit in $ROOT."

HEAD_SHA="$(git -C "$ROOT" rev-parse HEAD)"
[[ "$TARGET" != "$HEAD_SHA" ]] || refuse \
    "$TARGET is HEAD. Rolling back to what is already checked out is a deploy," \
    "and a deploy has its own gate:" \
    "  npm --prefix web/frontend run deploy -- --conclusion-file <path>"

git -C "$ROOT" merge-base --is-ancestor "$TARGET" HEAD || refuse \
    "$TARGET is not an ancestor of HEAD ($HEAD_SHA)." \
    "A rollback goes backwards along this history. A commit off to one side is a" \
    "different product, and deploying it is a decision this script will not disguise."

# ── 2. The artifact must be the TARGET's ──────────────────
# The gate re-reads every field; this is the one check worth making twice, because
# handing it HEAD's artifact is the exact mistake the old recipe institutionalised.
[[ -n "$CONCLUSION_FILE" ]] || refuse \
    "no --conclusion-file was given. The rollback needs the TARGET's CI conclusion:" \
    "  scripts/ci-conclusion.sh --sha $TARGET --out <path>"
[[ -f "$CONCLUSION_FILE" ]] || refuse "conclusion artifact not found: $CONCLUSION_FILE"

ART_SHA="$(awk '$1 == "sha" { print $2; exit }' "$CONCLUSION_FILE")"
[[ "$ART_SHA" == "$TARGET" ]] || refuse \
    "the artifact pins ${ART_SHA:-<no sha field>}" \
    "the rollback target is $TARGET" \
    "Re-read the field for the target: scripts/ci-conclusion.sh --sha $TARGET --out <path>"

# ── 3. The plan ───────────────────────────────────────────
TMP="${TMPDIR:-/tmp}"
WORKTREE="${TMP%/}/rollback-${TARGET:0:12}"
SUBJECT="$(git -C "$ROOT" log -1 --format=%s "$TARGET")"
WHEN="$(git -C "$ROOT" log -1 --format=%ci "$TARGET")"

echo "[rollback] target      $TARGET"
echo "[rollback]             $WHEN — $SUBJECT"
echo "[rollback] from HEAD   $HEAD_SHA"
echo "[rollback] artifact    $CONCLUSION_FILE (pins the target)"
echo "[rollback] worktree    $WORKTREE"
echo "[rollback] the act:"
echo "[rollback]   git worktree add --detach $WORKTREE $TARGET"
echo "[rollback]   npm ci --prefix $WORKTREE/web/frontend"
echo "[rollback]   $GATE --repo $WORKTREE --conclusion-file $CONCLUSION_FILE"
echo "[rollback]   git worktree remove --force $WORKTREE"

if ((DRY)); then
    echo "[rollback] DRY RUN — preconditions hold. No worktree, no install, no deploy."
    exit 0
fi

[[ ! -e "$WORKTREE" ]] || refuse \
    "$WORKTREE already exists. Remove it (git worktree remove --force $WORKTREE) and re-run."

cleanup() {
    if ((KEEP)); then
        echo "[rollback] --keep: the worktree stays at $WORKTREE"
        return
    fi
    git -C "$ROOT" worktree remove --force "$WORKTREE" 2>/dev/null || true
}
trap cleanup EXIT

git -C "$ROOT" worktree add --detach "$WORKTREE" "$TARGET"
# The seal's own lockfile, installed clean. `npm ci` is not `npm install`: it refuses a
# lockfile that disagrees with the manifest, which is what makes the rebuild the seal's.
npm ci --prefix "$WORKTREE/web/frontend"
# The gate reads $WORKTREE's HEAD (== the target), its cleanliness (pristine by
# construction), and its ledger, then builds and ships from it. One tree, start to finish.
bash "$GATE" --repo "$WORKTREE" --conclusion-file "$CONCLUSION_FILE"
