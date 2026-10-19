#!/bin/bash
# born-RED of the three union admissions: each file swapped for its pre-admission form, its gate re-read, restored (sha1-checked)
S=$LANE
F=$S/r5w/w2/web/frontend; W1=$S/r5w/w1/web/frontend; L=$S/logs/r5/admit; mkdir -p $L
cd $F || exit 9
run() { # $1 label $2 file $3 gate $4 pre-admission source
  s0=$(shasum $2 | cut -c1-12); cp $2 $L/$1.orig; cp $4 $2; s1=$(shasum $2 | cut -c1-12)
  $GUARDED --light --timeout 15 -- npm run -s $3 > $L/$1.log 2>&1; echo "exit=$?" > $L/$1.exit
  cp $L/$1.orig $2; s2=$(shasum $2 | cut -c1-12)
  echo "$1 $2 $s0->$s1 gate=$3 $(cat $L/$1.exit) restored=$([ $s0 = $s2 ] && echo OK || echo MISMATCH)"
}
run bands-noadmit scripts/check-motion-bands.mjs lint:bands $W1/scripts/check-motion-bands.mjs
run verbs-noadmit scripts/check-pencil-verbs.mjs lint:verbs $W1/scripts/check-pencil-verbs.mjs
python3 - <<'PY'
import re
p="$LANE/r5w/w2/web/frontend/scripts/check-font-coverage.mjs"
t=open(p).read(); i=t.index("  // ── T9-W7 §11 PLR-COUNT (PROVISIONAL): the roster."); j=t.index("  },\n",i)+5
open("$LANE/logs/r5/admit/fc.pre","w").write(t[:i]+t[j:])
PY
run font-noadmit scripts/check-font-coverage.mjs test:font-coverage $L/fc.pre
