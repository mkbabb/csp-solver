#!/bin/bash
# on-disk break battery on the scratch replica (never the work tree); every plant restored by copy + sha1
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
FE=$S/ledger7-rep/web/frontend; cd $FE
MN=src/pencil/chrome/MarginNote.vue; INK=scripts/check-ink-pressure.mjs; FC=scripts/check-font-coverage.mjs; GB=src/games/shared/GameBoard.vue
for f in $MN $INK $FC $GB; do cp $f $S/ledger7-work/orig.$(basename $f); done
restore() { for f in $MN $INK $FC $GB; do cp $S/ledger7-work/orig.$(basename $f) $f; done; }
echo "sha1 MarginNote $(shasum $MN|cut -c1-12) ink $(shasum $INK|cut -c1-12) fc $(shasum $FC|cut -c1-12) reserve-law $(shasum scripts/shape/reserve-law.mjs|cut -c1-12) census $(shasum scripts/shape/shape-census.mjs|cut -c1-12)"
run() { node $1 $2 >/dev/null 2>$S/ledger7-work/brk.err; e=$?; echo "$3 :: $1 $2 -> exit $e :: $(grep -m1 '✗\|·' $S/ledger7-work/brk.err | cut -c1-150)"; restore; }
run $INK --self-test "CLEAN"
run $FC --self-test "CLEAN"
python3 - $MN <<'P'
import re,sys;p=sys.argv[1];s=open(p).read();s=re.sub(r'(@media \(max-width: 1023\.98px\) \{[\s\S]*?\.margin-note \{\s*)min-height: inherit;', r'\1min-height: inherit;\n    min-height: 0;', s, count=1);open(p,'w').write(s)
P
run $INK "" "E1 shadowed"
printf '\n<style scoped>\n.margin-note-block > .margin-note { min-height: 0; }\n</style>\n' >> $MN; run $INK "" "E2 second style"
python3 - $MN <<'P'
import sys;p=sys.argv[1];s=open(p).read();s=s.replace("</style>", ".margin-note-block > .margin-note {\n  min-height: 0;\n}\n</style>",1);open(p,'w').write(s)
P
run $INK "" "E2b compound"
python3 - $MN <<'P'
import re,sys;p=sys.argv[1];s=open(p).read();s=re.sub(r'(\.margin-note-block \{[^}]*?min-height: )[^;]+;', r'\g<1>1px;', s, count=1);open(p,'w').write(s)
P
run $INK "" "E3 1px"
python3 - $MN <<'P'
import re,sys;p=sys.argv[1];s=open(p).read();s=re.sub(r'(@media \(max-width: 1023\.98px\) and \(orientation: landscape\) \{\n)', r'\1  .margin-note-block .margin-note {\n    min-height: 0 !important;\n  }\n', s, count=1);open(p,'w').write(s)
P
run $INK "" "E4 landscape !important"
python3 - $MN <<'P'
import re,sys;p=sys.argv[1];s=open(p).read();s=re.sub(r'(@media \(max-width: 1023\.98px\) \{[\s\S]*?\.margin-note \{\s*)min-height: inherit;', r'\1', s, count=1);open(p,'w').write(s)
P
run $INK "" "seat deleted"
python3 - $INK <<'P'
import sys;p=sys.argv[1];s=open(p).read();a="reserveLaw(NOTE_FE, read ? { read } : {}).fails.map((f) => `note reserve: ${f}`);";assert a in s;s=s.replace(a,"[];");open(p,'w').write(s)
P
run $INK --self-test "GATE SABOTAGED (gateReserve returns [])"
python3 - $FC $GB <<'P'
import sys;p=sys.argv[1];s=open(p).read();a="        closed: true,\n";assert s.count(a)==1;s=s.replace(a,"");open(p,'w').write(s)
g=sys.argv[2];t=open(g).read();import re;n=len(re.findall(r'"solved it!"',t));t=t.replace('"solved it!"','"solved it"');open(g,'w').write(t);print("callsites",n)
P
run $FC "" "closed:true deleted + call site re-worded"
python3 - $FC <<'P'
import sys;p=sys.argv[1];s=open(p).read();a="        closed: true,\n";assert s.count(a)==1;s=s.replace(a,"");open(p,'w').write(s)
P
run $FC "" "closed:true deleted alone"
python3 - $FC <<'P'
import sys;p=sys.argv[1];s=open(p).read();a='const MUST_CLOSE = ["marginRecordCopy"];';assert a in s;s=s.replace(a,"const MUST_CLOSE = [];");open(p,'w').write(s)
P
run $FC --self-test "MUST_CLOSE emptied (self-test must red)"
echo "sha1-after MarginNote $(shasum $MN|cut -c1-12) ink $(shasum $INK|cut -c1-12) fc $(shasum $FC|cut -c1-12)"
