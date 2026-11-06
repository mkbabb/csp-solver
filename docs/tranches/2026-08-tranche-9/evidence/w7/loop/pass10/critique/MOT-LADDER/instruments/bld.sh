#!/bin/zsh
# bld.sh <srcdir> <name> [plant] : copy (own .git kept), optional plant, vite build w/ private cacheDir; identity + CSS bytes
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-MOT-LADDER
D=$S/builds/$2; LG=$S/logs/build-$2.log
[ -e $D ] && mv $D $S/trash/build-$2.$(date +%s)
cp -R $1 $D || exit 2
[ -d $D/.git ] || { echo "NO .git in $D" > $LG; exit 3; }
ln -sfn $S/csp-arch/csp-solver $D/csp-solver; FE=$D/web/frontend; ln -sfn /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $FE/node_modules
[ -n "$3" ] && { python3 $S/inst/critx.py $FE $3 > $LG 2>&1 || { echo "PLANT FAIL" >> $LG; exit 4; }; }
cd $FE
printf "import base from './vite.config.ts'\nexport default { ...base, cacheDir: '%s' }\n" "$S/vite-cache-$2" > .vite-crit.config.ts
npx vite build --config .vite-crit.config.ts --emptyOutDir >> $LG 2>&1; echo "build exit $? gitdir $(git rev-parse --absolute-git-dir)" >> $LG
for f in dist/assets/index-*.js dist/assets/index-*.css; do echo "asset ${f:t} $(wc -c < $f)" >> $LG; done
echo BUILD-DONE >> $LG
