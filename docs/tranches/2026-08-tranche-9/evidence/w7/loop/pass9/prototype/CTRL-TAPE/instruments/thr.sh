#!/bin/bash
# threshold battery: each bound moved by ε both ways in a copy of the gate (in the WAVE scratch); the self-test must RED every time
WF=$1; OUT=$2; G=$WF/scripts/check-tape-foot.mjs; T=$WF/scripts/check-tape-foot.thr.mjs
: > $OUT
run() { name=$1; from=$2; to=$3
  python3 - "$G" "$T" "$from" "$to" <<'PY'
import sys
s=open(sys.argv[1]).read(); a,b=sys.argv[3],sys.argv[4]
assert s.count(a)==1,(a,s.count(a)); open(sys.argv[2],'w').write(s.replace(a,b))
PY
  (cd $WF && node scripts/check-tape-foot.thr.mjs --self-test > $OUT.$name 2>&1; echo "$name exit=$? $(tail -1 $OUT.$name)" >> $OUT)
}
run cap+1 "hi <= regime(id).height)" "hi <= regime(id).height + 1)"
run cap-0.5 "hi <= regime(id).height)" "hi <= regime(id).height - 0.5)"
run pad+1 "hi <= 32)" "hi <= 33)"
run pad-1 "hi <= 32)" "hi <= 31)"
run font+e "lo >= 10)" "lo >= 10.01)"
run font-e "lo >= 10)" "lo >= 9.8)"
run top-1px '!/^(0|0px|0rem)$/.test(v.trim())' '!/^(0|0px|0rem|1px)$/.test(v.trim())'
