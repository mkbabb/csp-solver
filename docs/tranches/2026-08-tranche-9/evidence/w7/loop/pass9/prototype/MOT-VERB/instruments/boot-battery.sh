#!/bin/bash
# boot-battery.sh <builds...> : per build, swap :4246 to it and run boot-hand.spec.ts in both engines;
# a row opens only under a 1-min load of 120 (polled every 30 s); exits read from each run's own file.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
O=$S/logs/boot-battery.tsv; [ -f $O ] || printf "build\tengine\texit\tload-start\tload-end\n" > $O
for b in "$@"; do
  $S/bin/swap.sh $b > $S/logs/swap-$b.log 2>&1
  for e in chromium webkit; do
    while :; do l=$(sysctl -n vm.loadavg | awk '{print $2}'); awk "BEGIN{exit !($l < 120)}" && break; echo "wait load $l $(date +%T)" >> $S/logs/boot-battery.wait; sleep 30; done
    $S/bin/pw.sh boot-$b-$e 4246 $e 'boot-hand\.spec\.ts'
    printf "%s\t%s\t%s\t%s\t%s\n" $b $e "$(cat $S/logs/pw-boot-$b-$e.exit)" "$(grep LOAD-START $S/logs/pw-boot-$b-$e.log | cut -d' ' -f2-4)" "$(grep LOAD-END $S/logs/pw-boot-$b-$e.log | cut -d' ' -f2-4)" >> $O
  done
done
echo DONE >> $O
