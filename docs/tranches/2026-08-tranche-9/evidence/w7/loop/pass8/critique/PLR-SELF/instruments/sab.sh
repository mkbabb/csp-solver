#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critic-plrself8
PM=$S/ct/web/frontend/src/pencil/chrome/PlayerMark/PlayerMark.vue
G="click with no press|labelled as a mouse|a tap opens the mark|a mouse press opens|Space and Enter"
for P in S1 S2 S3; do
python3 - "$PM" "$P" <<'PY'
import sys
p,n=sys.argv[1],sys.argv[2]; s=open(p).read()
R={'S1':("  const owed = e.timeStamp - owedAt < TAP_CLICK_MS;\n  owedAt = -Infinity;\n","  const owed = e.timeStamp - owedAt < TAP_CLICK_MS;\n"),
   'S2':("function onPress(e: PointerEvent): void {\n  owedAt = -Infinity;\n","function onPress(e: PointerEvent): void {\n"),
   'S3':("function onKey(): void {\n  owedAt = -Infinity;\n","function onKey(): void {\n")}
o,nw=R[n]; assert s.count(o)==1,(n,s.count(o)); open(p,'w').write(s.replace(o,nw))
PY
echo "$P applied $(shasum $PM | cut -c1-12)"; sleep 3
$S/run.sh sab-$P "$G"
cp $S/hold/PlayerMark.p8.vue $PM; echo "$P restored $(shasum $PM | cut -c1-12)"; sleep 3
done
echo SAB-END
