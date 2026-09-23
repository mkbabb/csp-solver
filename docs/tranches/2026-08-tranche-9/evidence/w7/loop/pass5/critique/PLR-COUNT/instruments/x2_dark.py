import sys
p=sys.argv[1]; s=open(p).read()
rule = "\n:global(.dark) .pl-state,\n:global(.dark) .pl-qual,\n:global(.dark) .pl-more {\n  color: rgb(70, 68, 66);\n}\n</style>"
s = s.replace("</style>", rule, 1)
open(p,"w").write(s)
