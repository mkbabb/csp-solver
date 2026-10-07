import sys,json,re
for l in open(sys.argv[1]):
    if l.startswith("G14 "):
        d=json.loads(l[4:]); print(f"G14 {d['engine']} {d['cell']} floorGated={d['floorGated']} shipped={d['shipped']} planted={d['planted']} rows={d['rows']} foot={d['foot']!r}")
        for q,v in d["lines"].items():
            print(f"   {q} bound {v['bound']:.3f} CLEAN {v['clean']} GATED {v['gated']}")
            print("      plants seen by: "+"; ".join(f"{n}={'+'.join(sorted(set(p['why']))) or 'UNSEEN'}" for n,p in v["plants"].items()))
    elif l.startswith("G16 "):
        d=json.loads(l[4:]); print(f"G16 {d['engine']} {d['arm']} {d['theme']} ids={d['ids']} one={d['onePoses']} ground={d['ground']} five={d['five']} margin={d['margin']} falls={d['falls']}")
        print("   ink/perPerson/planted: "+" ".join(f"{n}:{v['ink']}/{v['perPerson']}/{v['planted']}" for n,v in d['table'].items()))
    elif l.startswith("WIDE"):
        print(l.rstrip()[:600])
    elif re.search(r"✓|✘|passed|failed|skipped|^EXIT|^\s+Error:", l):
        print(l.rstrip()[:220])
