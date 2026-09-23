p='src/pencil/config/pencilConfig.ts'; s=open(p).read()
o='  inset: 0.86,\n'
assert s.count(o)==1
s=s.replace(o,'  inset: 0.9,\n')
open(p,'w').write(s)
