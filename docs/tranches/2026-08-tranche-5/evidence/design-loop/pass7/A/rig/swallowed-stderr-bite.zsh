#!/bin/zsh
# PASS-7 LANE A · the banked bite behind the PRECEPTS §2 ruling.
#
# Reproduces, on the estate's own shell, the exact line that produced a wrong count at pass 6:
# an unbraced `git show "$sha:path"` under zsh, with `2>/dev/null` on the same line.
#
# THREE ARMS per ref:
#   BITE   unbraced ref, stderr DISCARDED, piped to `grep -c`      -> the silent, confident number
#   SEEN   the same command with stderr KEPT                       -> what the discard threw away
#   CURE   braced ref (`"${c}":"path"`), stderr KEPT               -> the true number
#
# FALSIFIER: the CURE arm is re-run against a path that does not exist at the ref. A cure that
# prints 1 there is not reading the tree, and the rig reds.
#
# Exits non-zero unless, on every ref: BITE == 0, CURE == 1, and the falsifier's CURE == 0.

set -u
REPO=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
cd "$REPO" || exit 2

REFS=(236d22fe 94ce993e c6eda619 3969f512 abe533c4)
REL='web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue'
PAT='padding: 0.75rem 0.85rem 0.9rem'
GHOST='web/frontend/src/pencil/chrome/GameGallery/NoSuchFile.vue'

print "AUDIT $(date -u +%Y-%m-%dT%H:%M:%SZ) · host $(uname -s | tr 'A-Z' 'a-z') · sha $(git rev-parse --short=8 HEAD) · shell zsh $ZSH_VERSION · harness NONE (git object read, no server)"
print "cmd: zsh rig/swallowed-stderr-bite.zsh"
print "subject: .guard-note's horizontal padding rule, the constant the pass-6 reconciliation rests on"
print "pattern: $PAT"
print "path:    $REL"
print ""

fail=0

for c in $REFS; do
  bite=$(git show "$c:web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue" 2>/dev/null | grep -c "$PAT")
  cure=$(git show "${c}":"${REL}" | grep -c "$PAT")
  print "ref $c   BITE(2>/dev/null) = $bite   CURE(braced) = $cure"
  [[ "$bite" == 0 ]] || fail=1
  [[ "$cure" == 1 ]] || fail=1
done

print ""
print "── WHAT THE DISCARD THREW AWAY (same command, stderr kept) ──"
for c in $REFS; do
  print -n "ref $c   "
  git show "$c:web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue" 2>&1 >/dev/null | head -1
done

print ""
print "── FALSIFIER: the CURE arm on a path that does not exist at the ref ──"
for c in $REFS; do
  ghost=$(git show "${c}":"${GHOST}" 2>/dev/null | grep -c "$PAT")
  print "ref $c   CURE(ghost path) = $ghost"
  [[ "$ghost" == 0 ]] || fail=1
done

print ""
print "GATE  the bite is LIVE on this shell (BITE 0 on every ref where the true count is 1): $([[ $fail == 0 ]] && print PASS || print FAIL)"
print "GATE  the cure discriminates (ghost path reads 0, real path reads 1):                 $([[ $fail == 0 ]] && print PASS || print FAIL)"
print "EXIT=$fail"
exit $fail
