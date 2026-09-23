#!/bin/zsh
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit
cd $SP/tree/web/frontend || exit 1
out=$SP/logs/units.txt; : > $out
U=src/games/shared/useSession.ts
T="src/games/shared/useSession.test.ts src/games/shared/BoardHost.authors.test.ts"
run() { npx vitest run ${=T} > $SP/logs/u-$1.log 2>&1; e=$?; echo "$1 exit $e · $(grep -E '^\s*Tests ' $SP/logs/u-$1.log | tr -s ' ')" >> $out; grep -E '✗|×|FAIL' $SP/logs/u-$1.log | head -6 >> $out; }
run asis
cp $U $SP/useSession.keep; h0=$(shasum $U | cut -c1-40)
python3 - <<'PY'
p='src/games/shared/useSession.ts'; s=open(p).read()
a='''      if (e[0] === ledger.epoch[0] && e[1] === ledger.epoch[1] && from === e[1])
        adoptInk((d.k as Record<string, number>) ?? {}, true);
'''
assert s.count(a)==1; open(p,'w').write(s.replace(a,''))
PY
run g1-branch-removed
cp $SP/useSession.keep $U; echo "restore $([ $h0 = $(shasum $U|cut -c1-40) ] && echo sha1-equal || echo MISMATCH)" >> $out
sed -i '' 's/export const SELF_TAKES_A_HAND: boolean = true;/export const SELF_TAKES_A_HAND: boolean = false;/' $U
grep -c 'SELF_TAKES_A_HAND: boolean = false' $U >> $out
run f1-no
npx vitest run src/games > $SP/logs/u-f1-no-games.log 2>&1; echo "f1-no src/games exit $? · $(grep -E '^\s*(Test Files|Tests) ' $SP/logs/u-f1-no-games.log | tr -s ' ' | tr '\n' ' ')" >> $out
npx vue-tsc -b > $SP/logs/u-f1-no-tsc.log 2>&1; echo "f1-no vue-tsc -b exit $?" >> $out
cp $SP/useSession.keep $U; echo "restore $([ $h0 = $(shasum $U|cut -c1-40) ] && echo sha1-equal || echo MISMATCH)" >> $out
npx vitest run src/games > $SP/logs/u-yes-games.log 2>&1; echo "yes src/games exit $? · $(grep -E '^\s*(Test Files|Tests) ' $SP/logs/u-yes-games.log | tr -s ' ' | tr '\n' ' ')" >> $out
echo UNITS_DONE >> $out
