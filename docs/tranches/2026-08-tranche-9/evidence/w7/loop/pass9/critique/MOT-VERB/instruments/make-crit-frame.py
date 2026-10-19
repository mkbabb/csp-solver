# make-crit-frame.py <e2e-dir> : writes crit-frame.spec.ts beside frame-halfstroke.spec.ts (plant rows only, all rigs, clip from CV_CLIP)
import sys; d = sys.argv[1]; src = open(f"{d}/frame-halfstroke.spec.ts").read()
a = "const PLANT_CSS = '.grid-ink { clip-path: inset(0.9% 0 0.9% 0); }';"; assert src.count(a) == 1
src = src.replace(a, "const CLIP = process.env.CV_CLIP ?? '0.9';\nconst PLANT_CSS = `.grid-ink { clip-path: inset(${CLIP}% 0 ${CLIP}% 0); }`;")
i = src.index("for (const rig of RIGS)\n  for (const scheme of SCHEMES)"); j = src.index("// THE NEGATIVE, in-run"); src = src[:i] + src[j:]
src = src.replace("for (const rig of [RIGS[0], RIGS[1]])", "for (const rig of RIGS)").replace("test(`PLANT half-stroke reds", "test(`CRIT clip ${CLIP}% PLANT half-stroke reds")
open(f"{d}/crit-frame.spec.ts", "w").write(src)
