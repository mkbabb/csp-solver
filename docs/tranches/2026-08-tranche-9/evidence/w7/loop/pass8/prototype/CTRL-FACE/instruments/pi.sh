cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8/pi
echo "load $(sysctl -n vm.loadavg)"
for e in chromium webkit; do
  node pi-paint.mjs $e http://127.0.0.1:4234 tree > tree-$e.jsonl 2>tree-$e.err
  node pi-paint.mjs $e http://127.0.0.1:4251 control > ctrl-$e.jsonl 2>ctrl-$e.err
  node pi-paint.mjs $e http://127.0.0.1:4251 control2 > ctrl2-$e.jsonl 2>ctrl2-$e.err
  PLANT=".hand-drawn-grid { opacity: .98 }" node pi-paint.mjs $e http://127.0.0.1:4234 plant > plant-$e.jsonl 2>plant-$e.err
  echo "== $e tree vs control"; node pi-diff.cjs tree-$e.jsonl ctrl-$e.jsonl $e
  echo "== $e control vs control (floor)"; node pi-diff.cjs ctrl-$e.jsonl ctrl2-$e.jsonl $e
  echo "== $e tree vs plant"; node pi-diff.cjs tree-$e.jsonl plant-$e.jsonl $e
done
echo "load $(sysctl -n vm.loadavg)"
echo DONE
