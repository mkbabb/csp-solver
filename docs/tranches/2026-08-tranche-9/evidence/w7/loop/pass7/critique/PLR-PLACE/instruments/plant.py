import sys, hashlib
C='/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit7plc-tree/web/frontend/'
PM='src/pencil/chrome/PlayerMark/PlayerMark.vue'
P={'YIELD':(PM,'const CHART_YIELDS = false;','const CHART_YIELDS = true;'),
   'REFIT':(PM,'  window.addEventListener("resize", refit);\n  document.addEventListener("transitionend", onSettle);\n','  // PLANT REFIT: both re-fit listeners struck\n'),
   'NO_ARM':('src/App.vue','const PLACE_CHART = true;','const PLACE_CHART = false;')}
n,act=sys.argv[1],sys.argv[2]; f,a,b=P[n]; p=C+f; s=open(p).read()
if act=='restore': a,b=b,a
assert s.count(a)==1,(n,act,s.count(a)); open(p,'w').write(s.replace(a,b)); print(n,act,hashlib.sha1(open(p,'rb').read()).hexdigest()[:12])
