import sys
p='src/assets/index.css'; s=open(p).read()
o='  --color-focus-sketch: #3a7bc4; /* THE ONE FOCUS INK'
assert s.count(o)==1
s=s.replace(o,'  --color-focus-sketch: #4589d2; /* BALLOT ARM (U-10), TWO VALUES: #4589d2 here, #2f68aa in\n     `.dark`. Two new hexes against law 23; R1 (one declaration) reads RED. The comment below\n     describes the one-value arm this replaces.\n     THE ONE FOCUS INK')
o2='  /* NO DARK ARM for `--color-focus-sketch`'
assert s.count(o2)==1
s=s.replace(o2,'  --color-focus-sketch: #2f68aa; /* BALLOT ARM: the dark value */\n\n'+o2)
open(p,'w').write(s)
