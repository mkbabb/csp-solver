#!/bin/zsh
# PLR-PLACE pass 5 — G1 at n >= 3 per arm, both engines, after the hostage cure; G4 + the slow control once per engine.
FE=$1; S=$2
cd $FE
SESS=src/games/shared/useSession.ts
B=$(shasum $SESS | cut -c1-40)
PLC_PORT=4243 PLC_HOME=$S/rate PLC_ARM=700 PLC_SLOW=1 npx playwright test -c .plr-place/pw.config.ts .plr-place/probe-rate.spec.ts --timeout=480000 > $S/logs/rate-700-slow.log 2>&1; echo "EXIT=$?" >> $S/logs/rate-700-slow.log
PLC_PORT=4243 PLC_HOME=$S/rate PLC_ARM=700 npx playwright test -c .plr-place/pw.config.ts .plr-place/probe-rate.spec.ts --timeout=300000 --repeat-each=2 > $S/logs/rate-700-fast.log 2>&1; echo "EXIT=$?" >> $S/logs/rate-700-fast.log
sed -i '' 's/^export const PLACE_SETTLE_MS = 700;$/export const PLACE_SETTLE_MS = 800;/' $SESS
grep -c "PLACE_SETTLE_MS = 800" $SESS > $S/logs/rate-flip.txt
sleep 10
PLC_PORT=4243 PLC_HOME=$S/rate PLC_ARM=800 npx playwright test -c .plr-place/pw.config.ts .plr-place/probe-rate.spec.ts --timeout=300000 --repeat-each=3 > $S/logs/rate-800.log 2>&1; echo "EXIT=$?" >> $S/logs/rate-800.log
sed -i '' 's/^export const PLACE_SETTLE_MS = 800;$/export const PLACE_SETTLE_MS = 700;/' $SESS
A=$(shasum $SESS | cut -c1-40)
[[ $A == $B ]] && echo "restored sha1 OK $A" >> $S/logs/rate-flip.txt || echo "SHA MISMATCH $A vs $B" >> $S/logs/rate-flip.txt
echo DONE >> $S/logs/rate-flip.txt
