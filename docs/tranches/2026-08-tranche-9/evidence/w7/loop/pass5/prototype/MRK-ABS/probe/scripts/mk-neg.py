import re, os
S=os.environ['S']
p=S+'/neg-nine/src/assets/index.css'; s=open(p).read()
a=s.index('--color-focus-sketch:'); b=s.index('*/',a)
s=s[:a]+re.sub(r'(?<![\d.])\d+\.\d{2,}(?!\d)', '9.99', s[a:b])+s[b:]; open(p,'w').write(s)
p=S+'/neg-stray/src/assets/index.css'; s=open(p).read(); s=s.replace('Until the owner rules,','The guard reads 4.15. Until the owner rules,',1); open(p,'w').write(s)
