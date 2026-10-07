#!/bin/bash
# PAL-TIN pass-8 CRITIC · threshold + walker plants on a COPY of the gate (the replica), self-test must red. No rm.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critic-tin8
A=$S/rep/web/frontend; G=$A/scripts/check-peer-tin.mjs; O=$S/logs/thresh.txt; : > $O
cp $G $S/logs/gate.orig
echo "gate $(shasum $G | cut -c1-8) · load $(uptime | sed 's/.*averages*: //')" >> $O
mut() { local tag=$1 from=$2 to=$3
  python3 - "$G" "$from" "$to" <<'PY'
import sys; p,f,t=sys.argv[1:4]; s=open(p).read(); assert s.count(f)==1, (f, s.count(f)); open(p,'w').write(s.replace(f,t))
PY
  local pe=$?
  (cd $A && node scripts/check-peer-tin.mjs --self-test > $S/logs/thresh-$tag.log 2>&1); local e=$?
  (cd $A && node scripts/check-peer-tin.mjs > $S/logs/thresh-$tag.base.log 2>&1); local b=$?
  echo "$tag · patch $pe · self-test exit $e · bare gate exit $b · $(grep -m1 'SELF-TEST FAILED' $S/logs/thresh-$tag.log | cut -c1-140)" >> $O
  cp $S/logs/gate.orig $G
}
mut T1-COPY_DE-0.02 'const COPY_DE = 0.03;' 'const COPY_DE = 0.02;'
mut T2-COPY_DE-0.012 'const COPY_DE = 0.03;' 'const COPY_DE = 0.012;'
mut T3-MIN_DE-0.09 'const MIN_DE = 0.1; //' 'const MIN_DE = 0.09; //'
mut T4-RING_FLOOR-0.05 'const RING_FLOOR = 0.075;' 'const RING_FLOOR = 0.05;'
mut T5-EXEMPT_FLOOR-0.05 'const EXEMPT_FLOOR = 0.075;' 'const EXEMPT_FLOOR = 0.05;'
mut T6-SCALAR_EPS-0.015 'const SCALAR_EPS = 0.005;' 'const SCALAR_EPS = 0.015;'
mut W1-walker-no-e2e 'for (const d of ["src", "e2e", "public"])' 'for (const d of ["src", "public"])'
mut W2-walker-no-svg 'json|html|svg|webmanifest)$/.test(
          e.name,' 'json|html|webmanifest)$/.test(
          e.name,'
cmp -s $G $S/logs/gate.orig && echo "gate restored byte-equal" >> $O
echo DONE >> $O
