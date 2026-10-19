#!/bin/bash
# rows.sh <tag> <port> <match> [engines...] : one spec per engine against a port; load-gated (< 120); TSV of exits
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
tag=$1; port=$2; match=$3; shift 3; O=$S/logs/rows.tsv; [ -f $O ] || printf "row\tengine\texit\tload-start\tload-end\n" > $O
for e in "${@:-chromium webkit}"; do
  while :; do l=$(sysctl -n vm.loadavg | awk '{print $2}'); awk "BEGIN{exit !($l < 120)}" && break; sleep 30; done
  $S/bin/pw.sh $tag-$e $port $e "$match"
  printf "%s\t%s\t%s\t%s\t%s\n" $tag $e "$(cat $S/logs/pw-$tag-$e.exit)" "$(grep LOAD-START $S/logs/pw-$tag-$e.log | cut -d' ' -f2-4)" "$(grep LOAD-END $S/logs/pw-$tag-$e.log | cut -d' ' -f2-4)" >> $O
done
