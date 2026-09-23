import sys
p=sys.argv[1]; s=open(p).read()
old='watch(reducedMotion, (reduced) => reduced && settle(ids.value));'
assert old in s
s=s.replace(old,'void settle; // CRITIC PLANT: the PRM watch struck')
open(p,"w").write(s)
