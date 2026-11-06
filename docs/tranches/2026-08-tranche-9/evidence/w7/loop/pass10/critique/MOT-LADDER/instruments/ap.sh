#!/bin/zsh
# ap.sh <src-dir> <dst-dir> <diff> : copy, apply, report
cp -R "$1" "$2" || exit 2
cd "$2"
git apply --check "$3"; c=$?
git apply "$3"; a=$?
git add -A -f
n=$(grep -c '^diff --git' "$3")
echo "APPLY $(basename $3) on $(basename $1) -> $(basename $2): check=$c apply=$a paths=$n gitdir=$(git rev-parse --absolute-git-dir) web=$(git write-tree --prefix=web/)"
