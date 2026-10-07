import re,glob,sys
def rules(p):
    s=re.sub(r'data-v-[0-9a-f]{8}','data-v-X',open(p).read())
    s=re.sub(r'-(?:[0-9a-f]{8})\b','-H',s)
    return set(x.strip() for x in re.findall(r'([^{}]+)\{', s))
a=rules(glob.glob(sys.argv[1]+'/assets/index-*.css')[0]); b=rules(glob.glob(sys.argv[2]+'/index-*.css')[0])
print('tree-only', len(a-b)); [print('  +',x[:200]) for x in sorted(a-b)]
print('control-only', len(b-a)); [print('  -',x[:200]) for x in sorted(b-a)]
