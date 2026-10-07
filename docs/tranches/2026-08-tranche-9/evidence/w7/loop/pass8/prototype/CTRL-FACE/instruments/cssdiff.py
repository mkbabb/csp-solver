import re,sys
def sels(p):
    s=open(p).read()
    s=re.sub(r'\[data-v-[0-9a-f]+\]','',s)
    out=set()
    for m in re.finditer(r'([^{}]+)\{([^{}]*)\}',s):
        out.add((m.group(1).strip(),m.group(2).strip()))
    props=set(re.findall(r'@property\s+(--[\w-]+)',s))
    return out,props
c,cp=sels(sys.argv[1]); t,tp=sels(sys.argv[2])
cs={a for a,b in c}; ts={a for a,b in t}
add=sorted(ts-cs); rem=sorted(cs-ts)
print('SELECTORS ADDED',len(add)); [print('  +',a[:110]) for a in add]
print('SELECTORS REMOVED',len(rem)); [print('  -',a[:110]) for a in rem]
print('@property ADDED',sorted(tp-cp)); print('@property REMOVED',sorted(cp-tp))
