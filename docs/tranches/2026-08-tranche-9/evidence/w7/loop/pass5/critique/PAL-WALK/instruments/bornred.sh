#!/bin/zsh
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/tree/web/frontend
out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/logs/bornred.txt; : > $out
f=src/games/shared/GameBoard.vue; cp $f /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/gb.keep; h0=$(shasum $f|cut -c1-40)
srv() { p=$(lsof -nP -iTCP:4232 -sTCP:LISTEN -t); [ -n "$p" ] && kill $p; sleep 2; rm -rf /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/cache-proto-dev; (nohup npx vite --config /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/cfg/vite.proto.mts --host 127.0.0.1 --port 4232 --strictPort > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/logs/srv-proto.log 2>&1 &); until curl -s http://127.0.0.1:4232/ >/dev/null; do sleep 1; done; echo "server pid $(lsof -nP -iTCP:4232 -sTCP:LISTEN -t) paper-lines $(curl -s 'http://127.0.0.1:4232/src/games/shared/GameBoard.vue?vue&type=style&index=0&scoped=true&lang.css' | grep -c 'var(--color-card)')" >> $out; }
pw() { WALK_DPR=3 npx playwright test --config /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/cfg/pw.spec.mts --project $1 -g "§C" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/logs/br-$2-$1.log 2>&1; echo $?; }
python3 - <<'PY'
p='src/games/shared/GameBoard.vue'; s=open(p).read()
a='''  background:
    linear-gradient(var(--sheet-washi-neutral), var(--sheet-washi-neutral)),
    var(--color-card);
'''
assert s.count(a)==1; open(p,'w').write(s.replace(a,''))
PY
srv
for e in chromium webkit; do echo "BREAK paper translucent · §C · $e · exit $(pw $e break)" >> $out; done
cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/gb.keep $f; echo "restore $([ $h0 = $(shasum $f|cut -c1-40) ] && echo sha1-equal || echo MISMATCH)" >> $out
srv
for e in chromium webkit; do echo "NEGATIVE restored · §C · $e · exit $(pw $e neg)" >> $out; done
echo BR_DONE >> $out
