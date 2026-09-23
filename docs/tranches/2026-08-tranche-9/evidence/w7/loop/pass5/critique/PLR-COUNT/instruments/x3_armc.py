import sys
p=sys.argv[1]; s=open(p).read()
old='const SIX_ARM = "title" as "title" | "heading" | "remainder";'
assert old in s
s=s.replace(old,'const SIX_ARM = "remainder" as "title" | "heading" | "remainder";')
open(p,"w").write(s)
