# usage: mf.sh OURS_TREE BASE_TREE THEIRS_TREE RESULT_TREE file...
o=$1; b=$2; t=$3; r=$4; shift 4
for f in "$@"; do
  p=web/frontend/$f; k=$(echo $f | tr '/' '_')
  git show $o:$p > ../mf/$k.ours 2>/dev/null || : > ../mf/$k.ours
  git show $b:$p > ../mf/$k.base 2>/dev/null || : > ../mf/$k.base
  git show $t:$p > ../mf/$k.theirs 2>/dev/null || : > ../mf/$k.theirs
  cp ../mf/$k.ours ../mf/$k.merged
  git merge-file ../mf/$k.merged ../mf/$k.base ../mf/$k.theirs; c=$?
  git show $r:$p > ../mf/$k.result
  if cmp -s ../mf/$k.merged ../mf/$k.result; then eq=EQ; else eq="DIFF($(diff ../mf/$k.merged ../mf/$k.result | grep -c '^[<>]'))"; fi
  echo "$f conflicts=$c $eq"
done
