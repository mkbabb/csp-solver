import re, sys, os
os.chdir(sys.argv[1])
g='web/frontend/src/games/shared/GameScene.vue'
s=open(g).read()
a=s.index("    <!-- THE FOLD'S RIBBON — STANDS"); e='<div id="fold-tools" class="fold-tools" />\n'; b=s.index(e)+len(e)
s=s[:a]+"""    <!-- BALLOT ARM: DELETION (T9-B-TABS). `#fold-tools` is retired: the play tools take the
         board's edge berth in every mobile pose, portrait included. -->
"""+s[b:]
open(g,'w').write(s)
c='web/frontend/src/games/shared/scene.css'
s=open(c).read()
o=".fold-tools,\n.drawer-handle {\n  display: none;\n}"; assert s.count(o)==1; s=s.replace(o,".drawer-handle {\n  display: none;\n}")
a=s.index("  /* THE RIBBON — one row of verbs, under the reserved line (T6.2 mark A). RESTORED")
e="    width: var(--board-col);\n  }\n"; b=s.index(e,a)+len(e); s=s[:a]+s[b:]
open(c,'w').write(s)
i='web/frontend/src/assets/index.css'
s=open(i).read(); o="     is the play-verbs band, and a printed worksheet wants no undo button either. */\n  .fold-tools,\n"; assert s.count(o)==1
s=s.replace(o,"     is the play-verbs band, and a printed worksheet wants no undo button either. */\n"); open(i,'w').write(s)
p='web/frontend/src/games/shared/GameControlPanel.vue'
s=open(p).read()
o='  portraitDock.value ? "#fold-tools" : mobileDock.value ? "#board-edge-tools" : null,'; assert s.count(o)==1
s=s.replace(o,'  mobileDock.value ? "#board-edge-tools" : null,')
s,n=re.subn(r'        <SheetWashiLabel :id="tagId\([^\n]*anchor="tag" />\n','',s); assert n==4
a=s.index("// THE DECLARED FALLBACK KEEPS THE FOUR TAGS"); e="const tagId = (k: TabKey) => `${uid}tag-${k}`;\n"; b=s.index(e)+len(e); s=s[:a]+s[b:]
a=s.index("\n/* The fallback's tag, in flow at the tray's head."); e="  margin: 0 0 0 0.85rem;\n}\n"; b=s.index(e,a)+len(e); s=s[:a]+s[b:]
a=s.index("/* ── THE DECLARED FALLBACK'S PORTRAIT ARM"); e=".fold-tools .edge-tools .icon-btn {\n  padding: 0.3rem 0.5rem;\n  gap: 0.15rem;\n}\n"; b=s.index(e,a)+len(e); s=s[:a]+s[b:]
open(p,'w').write(s)
