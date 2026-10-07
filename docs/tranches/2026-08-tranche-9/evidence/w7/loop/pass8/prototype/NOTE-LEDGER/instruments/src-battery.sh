#!/bin/bash
# src-battery.sh : the reserve law + MUST_CLOSE rows on the tree copy (t8), their born-REDs on br8 (the tree's gates
# over the control's MarginNote.vue), the literal clause deletions and the pass-7 pin on scratch copies. Bare exits.
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
M=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
O=$P/q/src-battery.txt
echo "start $(date +%T) load $(uptime | sed 's/.*averages: //')" > $O
T=$P/t8/web/frontend
echo "t8 sha ink $(shasum $T/scripts/check-ink-pressure.mjs|cut -c1-12) fc $(shasum $T/scripts/check-font-coverage.mjs|cut -c1-12) lib $(shasum $T/scripts/shape-census.mjs|cut -c1-12) MN $(shasum $T/src/pencil/chrome/MarginNote.vue|cut -c1-12)" >> $O
cd $T
node scripts/check-ink-pressure.mjs --self-test --plants --sabotage-battery > $P/q/t8-ink.log 2>&1; echo "t8 lint:ink --self-test --plants --sabotage-battery exit=$?" >> $O
node scripts/check-font-coverage.mjs --self-test > $P/q/t8-fc.log 2>&1; echo "t8 test:font-coverage --self-test exit=$?" >> $O
node scripts/shape-census.mjs --tree . > $P/q/t8-tree.log 2>&1; echo "t8 shape-census --tree exit=$?" >> $O
node scripts/shape-census.mjs --self-test > $P/q/t8-lib-self.log 2>&1; echo "t8 shape-census --self-test exit=$?" >> $O
# born-RED: the tree's gates over the control's MarginNote.vue
B=$P/br8/web/frontend
if [ ! -d $B ]; then bash $P/bin/mkcopy.sh $P/br8 $P/cut-now.diff >> $O 2>&1; (cd $M && git show 74a2b5d9:web/frontend/src/pencil/chrome/MarginNote.vue) > $B/src/pencil/chrome/MarginNote.vue; fi
echo "br8 MN $(shasum $B/src/pencil/chrome/MarginNote.vue|cut -c1-12) (74a2b5d9's $(cd $M && git show 74a2b5d9:web/frontend/src/pencil/chrome/MarginNote.vue | shasum | cut -c1-12))" >> $O
cd $B
node scripts/check-ink-pressure.mjs > $P/q/br8-ink.log 2>&1; echo "br8 (control MarginNote) lint:ink bare exit=$?" >> $O
grep -m3 "note reserve" $P/q/br8-ink.log >> $O
node scripts/shape-census.mjs --tree . > $P/q/br8-tree.log 2>&1; echo "br8 shape-census --tree exit=$?" >> $O
# the literal clause deletions, each on a scratch copy of the gate inside t8 (moved out after)
cd $T
for c in R1 R2 R3-important R3-seat; do
  node -e '
const fs=require("fs");const c=process.argv[1];let t=fs.readFileSync("scripts/check-ink-pressure.mjs","utf8");
const re=new RegExp("on\\(\""+c.replace("-","\\-")+"\"\\) &&");const n=(t.match(new RegExp(re.source,"g"))||[]).length;
if(n!==1){console.error("anchor count "+n);process.exit(9)}
t=t.replace(re,"false &&");fs.writeFileSync("scripts/.sab-ink.mjs",t);' $c
  r=$?; if [ $r != 0 ]; then echo "delete $c: anchor problem $r" >> $O; continue; fi
  node --check scripts/.sab-ink.mjs 2>> $O; node scripts/.sab-ink.mjs --self-test > $P/q/sab-$c.log 2>&1; echo "clause $c DELETED (its test replaced by false) -> lint:ink --self-test exit=$? $(grep -m1 -o "note-reserve · [^:]*: [A-Za-z ]*" $P/q/sab-$c.log)" >> $O
done
mkdir -p $P/../../trash-ledger8-3; mv scripts/.sab-ink.mjs $P/../../trash-ledger8-3/sab-ink-$(date +%s).mjs 2>/dev/null
# the pass-7 pin (one extractor by name) against the new SPLIT plants: must read BAD (born-RED of the re-cut)
node -e '
const fs=require("fs");let t=fs.readFileSync("scripts/check-font-coverage.mjs","utf8");
const a=t.indexOf("const MUST_CLOSE = ");const b=t.indexOf("problems.push(...unclosed(FACES));");
if(a<0||b<0){process.exit(9)}
const p7=`const MUST_CLOSE = Object.keys(EXTRACT).filter((k) => /^margin/.test(k));
const unclosed = (faces) =>
  faces.flatMap((f) =>
    f.corpus
      .filter((g) => g.derive?.some((d) => ["marginRecordCopy"].includes(d)) && !g.closed)
      .map((g) => "unclosed " + g.where),
  );
`;
fs.writeFileSync("scripts/.p7pin-fc.mjs",t.slice(0,a)+p7+t.slice(b));'
node --check scripts/.p7pin-fc.mjs 2>> $O; node scripts/.p7pin-fc.mjs --self-test > $P/q/p7pin-fc.log 2>&1; echo "pass-7 pin (marginRecordCopy by name) under the new plants -> exit=$?" >> $O; grep -E "BAD|ok " $P/q/p7pin-fc.log >> $O
mv scripts/.p7pin-fc.mjs $P/../../trash-ledger8-3/p7pin-fc-$(date +%s).mjs 2>/dev/null
echo "DONE $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
