#!/bin/bash
# digest.sh : the transcripts' row lines (no stack traces) and every exit TSV, copied into the evidence logs dir
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/MOT-VERB/logs
mkdir -p $E
for f in $S/logs/pw-*.log; do echo "=== $(basename $f) $(cat ${f%.log}.exit 2>/dev/null)"; grep -E '^(LOAD|GA1|BOOT|FRAME|PI|ROW16)|passed|failed' $f | cut -c1-600; done > $E/rows.txt
cp $S/logs/boot-battery.tsv $S/logs/rows.tsv $S/logs/unit-plants.tsv $S/logs/build-plants.tsv $S/logs/pp-selftest.tsv $S/pids.txt $E/ 2>/dev/null
cp $S/logs/unit/unit.tsv $E/unit.tsv; cp $S/logs/prereturn/*.tsv $E/ 2>/dev/null
for f in $S/logs/pp-self-*.log $S/logs/pp-sab-*.log; do echo "=== $(basename $f)"; grep -E 'U[1-5]|CLEAN|PLANT|BORN-RED|SABOTAGE|exit|RECORDER' $f | cut -c1-300; done > $E/postpaint-selftests.txt
grep -E 'failure|^  •|RETUNE|EXIT' $S/logs/lint-bands-*.log > $E/lint-bands-runs.txt
cp $S/logs/unit-boothand-bornred-pass8.log $E/ 2>/dev/null
du -sh $E
