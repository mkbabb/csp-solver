#!/bin/zsh
# BREAK-TESTS on the LANDED rows (LAWS §Gates): edit the tree, run the landed spec row bare, watch it red, restore with sha1.
F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend
cd $F || exit 1
out=.palwalk5/logs/bornred.txt; : > $out
pw() { PLAYWRIGHT_BASE_URL=http://127.0.0.1:4244 WALK_DPR=3 WALK_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk5/tr-br npx playwright test --config .palwalk5/pw.mts --project $1 -g "$2" > .palwalk5/logs/br-$3-$1.log 2>&1; echo $?; }
# (a) the tape's paper back to the translucent washi (the pass-4 state): §C must red in the dark.
f=src/games/shared/GameBoard.vue; cp $f .palwalk5/GameBoard.keep; h0=$(shasum $f|cut -c1-40)
python3 - <<'PY'
p='src/games/shared/GameBoard.vue'; s=open(p).read()
a='''  background:
    linear-gradient(var(--sheet-washi-neutral), var(--sheet-washi-neutral)),
    var(--color-card);
'''
assert s.count(a)==1; open(p,'w').write(s.replace(a,''))
PY
sleep 2
for e in chromium webkit; do echo "(a) paper translucent · §C · $e · exit $(pw $e '§C' tape)" >> $out; done
cp .palwalk5/GameBoard.keep $f; h1=$(shasum $f|cut -c1-40); echo "(a) restored $([ $h0 = $h1 ] && echo sha1-equal || echo MISMATCH)" >> $out
# (b) the ring's light arm back to 0.32 on BOTH publishers (the comparer stays green): §B must red.
c=src/assets/index.css; t=src/games/shared/playerIdentity.ts; cp $c .palwalk5/css.keep; cp $t .palwalk5/pi.keep; hc=$(shasum $c|cut -c1-40); ht=$(shasum $t|cut -c1-40)
sed -i '' 's/--peer-ring-l: 0.295;/--peer-ring-l: 0.32;/' $c; sed -i '' 's/RING_BANDS = \[0.295, 0.79\]/RING_BANDS = [0.32, 0.79]/' $t
echo "(b) lint:arcs on the 0.32 plant · exit $(node scripts/check-peer-arcs.mjs >/dev/null 2>&1; echo $?)" >> $out
sleep 2
for e in chromium webkit; do echo "(b) ring 0.32 · §B · $e · exit $(pw $e '§B' ring032)" >> $out; done
cp .palwalk5/css.keep $c; cp .palwalk5/pi.keep $t; echo "(b) restored $([ $hc = $(shasum $c|cut -c1-40) ] && [ $ht = $(shasum $t|cut -c1-40) ] && echo sha1-equal || echo MISMATCH)" >> $out
# (c) negative controls in the same batch: the restored tree, both rows green.
for e in chromium webkit; do echo "(c) restored tree · §B+§C · $e · exit $(pw $e '§B|§C' restored)" >> $out; done
echo BORNRED_DONE >> $out
