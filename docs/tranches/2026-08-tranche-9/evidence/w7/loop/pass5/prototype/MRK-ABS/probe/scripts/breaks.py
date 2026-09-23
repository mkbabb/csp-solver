import os, re, sys
W=os.environ['W']; which=sys.argv[1]
if which=='nine':
    p=W+'/src/assets/index.css'; s=open(p).read(); a=s.index('--color-focus-sketch:'); b=s.index('*/',a)
    s=s[:a]+re.sub(r'(\b(?:light|dark) )(\d+\.\d+) / (\d+\.\d+)', r'\g<1>9.99 / 9.99', s[a:b])+s[b:]; open(p,'w').write(s)
elif which=='op':
    p=W+'/src/games/shared/gameCell.css'; s=open(p).read(); i=s.index('.game-cell:has(input:focus-visible) .cell-ghost-path {'); j=s.index('}',i)
    s=s[:i]+s[i:j].replace('stroke-opacity: 0.95;','stroke-opacity: 0.9;')+s[j:]; open(p,'w').write(s)
elif which in ('inset1','inset09'):
    p=W+'/src/pencil/config/pencilConfig.ts'; s=open(p).read(); assert '  inset: 0.86,\n' in s
    s=s.replace('  inset: 0.86,\n','  inset: %s,\n' % ('1' if which=='inset1' else '0.9')); open(p,'w').write(s)
