import sys,re,collections
for p in open(sys.argv[1]).read().split():
    try: s=open(p).read()
    except Exception as e: print(p,"MISSING"); continue
    mk=len(re.findall(r'^(<<<<<<<|=======$|>>>>>>>)',s,re.M))
    names=re.findall(r'^(?:export\s+)?(?:async\s+)?(?:function\*?|const|let|class|type|interface)\s+([A-Za-z_$][\w$]*)',s,re.M)
    d=[n for n,c in collections.Counter(names).items() if c>1]
    tail=s[-1:]=="\n"
    print(f"{p.replace('web/frontend/','')} markers={mk} dupTop={d} eofNL={tail} bal{{}}={s.count('{')-s.count('}')}")
