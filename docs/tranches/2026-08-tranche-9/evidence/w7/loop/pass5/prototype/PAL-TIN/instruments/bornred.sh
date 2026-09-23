#!/bin/zsh
# BREAK-TESTS on the LANDED rows: edit the tree, run the landed row bare, watch it red, restore by sha1; the restored tree re-run green in the same batch.
F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend
cd $F || exit 1
out=.paltin5/logs/bornred.txt; : > $out
pw() { PLAYWRIGHT_BASE_URL=http://127.0.0.1:4245 TIN_DPR=2 TIN_OUT=/tmp/tin5-br npx playwright test --config .paltin5/pw.mts --project $1 -g "$2" > .paltin5/logs/br-$3-$1.log 2>&1; echo $?; }
sha() { shasum $1 | cut -c1-40; }
# (a) the light ring arms moved to 0.32 (pass-4's WALK scalar, the same rule): §1 must red; gate 4b must red.
c=src/assets/index.css; cp $c .paltin5/css.keep; h0=$(sha $c)
sed -i '' 's/--color-peer-1-ring: #4b1d00;/--color-peer-1-ring: #552200;/; s/--color-peer-2-ring: #243200;/--color-peer-2-ring: #2a3900;/; s/--color-peer-3-ring: #003436;/--color-peer-3-ring: #003b3e;/; s/--color-peer-4-ring: #220084;/--color-peer-4-ring: #270094;/; s/--color-peer-5-ring: #4f0049;/--color-peer-5-ring: #590052;/' $c
echo "(a) light ring arms at L 0.32 · lint:tin bare exit $(node scripts/check-peer-tin.mjs > .paltin5/logs/br-a-tin.log 2>&1; echo $?)" >> $out
sleep 3
for e in chromium webkit; do echo "(a) light ring arms at L 0.32 · §1 · $e · exit $(pw $e '§1' ring032)" >> $out; done
cp .paltin5/css.keep $c; echo "(a) restored $([ $h0 = $(sha $c) ] && echo sha1-equal || echo MISMATCH)" >> $out
# (b) the tape's name back to the stick (pass-4's binding): §2b must red.
g=src/games/shared/GameBoard.vue; cp $g .paltin5/gb.keep; h1=$(sha $g)
sed -i '' 's/^  color: var(--color-peer-cursor-ink);$/  color: var(--color-user-ink);/' $g
echo "(b) grep the edit: $(grep -c '^  color: var(--color-user-ink);$' $g)" >> $out
sleep 3
for e in chromium webkit; do echo "(b) tape name in the stick · §2b · $e · exit $(pw $e '§2b' tapestick)" >> $out; done
cp .paltin5/gb.keep $g; echo "(b) restored $([ $h1 = $(sha $g) ] && echo sha1-equal || echo MISMATCH)" >> $out
# (c) F1's switch welded on: the NO-arm unit must red.
u=src/games/shared/useSession.ts; cp $u .paltin5/us.keep; h2=$(sha $u)
sed -i '' 's/  return new URLSearchParams(window.location.search).get("selfink") !== "0";/  return true;/' $u
echo "(c) switch welded · vitest F1 · exit $(npx vitest run src/games/shared/useSession.test.ts -t F1 > .paltin5/logs/br-c-f1.log 2>&1; echo $?)" >> $out
cp .paltin5/us.keep $u; echo "(c) restored $([ $h2 = $(sha $u) ] && echo sha1-equal || echo MISMATCH)" >> $out
# (d) GATE 4 on the tree's real files: A1 in gameCell.css, A6 in a new src file, B2 in index.css.
gc=src/games/shared/gameCell.css; cp $gc .paltin5/gc.keep; h3=$(sha $gc)
printf '\n:root { --color-peer-2-ring: #2a3900; }\n' >> $gc
echo "(d) A1 gameCell.css redeclares a ring arm · lint:tin bare exit $(node scripts/check-peer-tin.mjs > .paltin5/logs/br-d1.log 2>&1; echo $?)" >> $out
cp .paltin5/gc.keep $gc; echo "(d) A1 restored $([ $h3 = $(sha $gc) ] && echo sha1-equal || echo MISMATCH)" >> $out
printf 'export const RING_BANDS = { light: 0.5, dark: 0.6 };\n' > src/games/shared/planted-tin.ts
echo "(d) A6 a far RING_BANDS in src · lint:tin bare exit $(node scripts/check-peer-tin.mjs > .paltin5/logs/br-d2.log 2>&1; echo $?)" >> $out
rm src/games/shared/planted-tin.ts
perl -pi -e 's/^  --color-peer-1-ring: #4b1d00;/  --peer-ring-l: 0.295;\n  --color-peer-1-ring: #4b1d00;/' $c
echo "(d) B2 index.css grows --peer-ring-l again · lint:tin bare exit $(node scripts/check-peer-tin.mjs > .paltin5/logs/br-d3.log 2>&1; echo $?) · lint:theme-tokens exit $(node scripts/check-theme-tokens.mjs > .paltin5/logs/br-d3-tt.log 2>&1; echo $?)" >> $out
cp .paltin5/css.keep $c; echo "(d) B2 restored $([ $h0 = $(sha $c) ] && echo sha1-equal || echo MISMATCH)" >> $out
echo "(d) restored tree · lint:tin bare exit $(node scripts/check-peer-tin.mjs > /dev/null 2>&1; echo $?)" >> $out
sleep 3
# (e) the restored tree, same batch: §1 + §2b green both engines, and the unit.
for e in chromium webkit; do echo "(e) restored tree · §1|§2b · $e · exit $(pw $e '§1|§2b' restored)" >> $out; done
echo "(e) restored tree · vitest F1 · exit $(npx vitest run src/games/shared/useSession.test.ts -t F1 > /dev/null 2>&1; echo $?)" >> $out
echo BORNRED_DONE >> $out
