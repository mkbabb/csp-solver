import sys
p=sys.argv[1]; s=open(p).read()
rule = "\n.pl-state,\n.pl-qual,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to right, #000 1.2em, rgba(0, 0, 0, 0.25) 1.2em);\n  mask-image: linear-gradient(to right, #000 1.2em, rgba(0, 0, 0, 0.25) 1.2em);\n}\n</style>"
s = s.replace("</style>", rule, 1)
open(p,"w").write(s)
