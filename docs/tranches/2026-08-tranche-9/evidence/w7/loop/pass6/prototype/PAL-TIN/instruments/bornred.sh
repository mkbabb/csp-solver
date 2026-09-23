#!/bin/zsh
# PAL-TIN pass 6 · born-RED on THIS tree: plant, restart the lane server (watch:null), run §2b bare
# in both engines at dpr 1, restore by cp from the scratch copy (sha1 checked), restart. No rm.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend || exit 1
O=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/paltin6-bornred; out=$O/bornred.txt; : > $out
restart() {
  kill $(cat .paltin6/pid4245) 2>/dev/null
  curl -s -o /dev/null --max-time 1 http://127.0.0.1:4245/ ; lsof -nP -iTCP:4245 -sTCP:LISTEN -t >/dev/null && kill -9 $(lsof -nP -iTCP:4245 -sTCP:LISTEN -t) 2>/dev/null
  (npx vite --config .paltin6/vite.dev.mts --host 127.0.0.1 --port 4245 --strictPort > $O/dev-$1.log 2>&1 &)
  curl -s -o /dev/null --retry 30 --retry-connrefused --retry-delay 1 http://127.0.0.1:4245/src/assets/index.css
  lsof -nP -iTCP:4245 -sTCP:LISTEN -t > .paltin6/pid4245
  echo "server $1 pid $(cat .paltin6/pid4245) serves: $(curl -s http://127.0.0.1:4245/src/assets/index.css | grep -o 'peer-5-name: #[0-9a-f]*')" >> $out
}
run2b() {
  for eng in chromium webkit; do
    PLAYWRIGHT_BASE_URL=http://127.0.0.1:4245 TIN_DPR=1 TIN_OUT=$O/out-$1-$eng npx playwright test --config .paltin6/pw.mts --project $eng -g '§2b' > $O/$1-$eng.log 2>&1
    echo "$1 $eng §2b exit $?" >> $out
    grep -E '^ +(light|dark) cell|in-run negative|Error:' $O/$1-$eng.log | head -6 >> $out
  done
}
for f in src/assets/index.css src/games/shared/GameBoard.vue; do cp $f $O/${f:t}.orig; done
S0=$(shasum src/assets/index.css src/games/shared/GameBoard.vue | shasum)
# (a) the dark name arms back at the ring arms' values (the pass-5 binding, one variable)
python3 - src/assets/index.css <<'PY'
import sys,re
p=sys.argv[1]; s=open(p).read(); at=s.index('\n.dark'); d=s[at:]
rings=dict(re.findall(r'--color-peer-(\d)-ring:\s*(#[0-9a-f]{6})', d))
d=re.sub(r'(--color-peer-(\d)-name:\s*)#[0-9a-f]{6}', lambda m: m.group(1)+rings[m.group(2)], d)
open(p,'w').write(s[:at]+d)
PY
node scripts/check-peer-tin.mjs > $O/a-lint.log 2>&1; echo "(a) check-peer-tin bare exit $? · $(grep -c '^  4b' $O/a-lint.log) 4b findings" >> $out
restart a; run2b a
cp $O/index.css.orig src/assets/index.css
# (b) the tape's binding back to the stick (hoveredAuthor spreads the author's record as-is)
python3 - src/games/shared/GameBoard.vue <<'PY'
import sys
p=sys.argv[1]; s=open(p).read()
o='ink: ink && { "--color-user-ink": ink["--color-peer-name-ink"] },'
assert s.count(o)==1
open(p,'w').write(s.replace(o,'ink,'))
PY
restart b; run2b b
cp $O/GameBoard.vue.orig src/games/shared/GameBoard.vue
S1=$(shasum src/assets/index.css src/games/shared/GameBoard.vue | shasum)
[ "$S0" = "$S1" ] && echo "restored sha1-equal" >> $out || echo "RESTORE MISMATCH" >> $out
node scripts/check-peer-tin.mjs > /dev/null 2>&1; echo "restored check-peer-tin bare exit $?" >> $out
restart clean
echo BORNRED_DONE >> $out
