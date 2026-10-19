#!/bin/bash
# compact one spec log: exit/load, EDGE verdicts, plant tallies per plant, worst G3 margin, name vs HEAD medians, failing rows
f=$1; c=$2; S=$3
echo "# peer-walk.spec.ts $c: $(cat $S/logs/spec-$c.exit); load $(tr '\n' ' ' < $S/logs/spec-$c.load)"
grep -E "^\s+[0-9]+ (passed|failed)" $f | tr -s ' '
grep "EDGE" $f | grep -o "\[[a-z]*/[a-z]*\] dpr [0-9] EDGE i=[0-9]* \(clean\|plant\) [A-Z_0-9]* *[A-Z]*\( (a hole)\)*"
echo "## plants: name total RED holes worst-G3-margin"
grep -E " (PLANT|READING) " $f | sed -E 's/.* (PLANT|READING) ([A-Za-z0-9_]+) .*G3 margin ([-0-9.—]+) → (.*)/\1 \2 \3 \4/' | awk '{k=$1" "$2; n[k]++; if($4 ~ /^RED/) r[k]++; if($4 ~ /hole/) h[k]++; if(!(k in m) || $3+0<m[k]+0) m[k]=$3} END{for(k in n) printf "%s %d %d %d %s\n", k, n[k], r[k]+0, h[k]+0, m[k]}' | sort
echo "## name vs HEAD same-index (median / frac<4.5) per subject-cell"
grep -E "\] (B|A) .*\" (name (oklch|rgb)|HEAD same-index)" $f | sed -E 's/^.*\[[a-z]+\/(light|dark)\/dpr[0-9]\] (B|A) p-0*([0-9a-f]+)[^c]*cell ([0-9]+).*"[^"]*" (name|HEAD same-index).* median ([0-9.]+) <4.5 ([0-9.]+).*/\1 \2\3 c\4 \6\/\7/' | paste -d' ' - - | awk '{printf "%s %s %s name %s HEAD %s\n",$1,$2,$3,$4,$8}' | sort -u
echo "## failing assertions"
grep -E "Error: " $f | sed 's/^ *//' | sort | uniq -c
