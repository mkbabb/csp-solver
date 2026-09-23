import shutil
p='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/web/frontend/src/composables/useTheme.ts'
shutil.copy(p, '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/.gt/useTheme.v4.ts')
s=open(p).read()
a='''  // swap is written one frame AFTER the frame that paints the CSS inks' step (two rAFs off the
  // timer): written before that paint, a cold flip's re-bake held it ~350 ms while the
  // compositor kept dusking the paper, dark digits on dark paper (measured, chromium 1280, with
  // a bare timer and with one rAF). The <image> still paints a decode later; the §13 form is a
  // CSS step on the grid's own ink (MOT-VERB row 36).
  const inkDark = ref(isDark.value);
  let hingeTimer: ReturnType<typeof setTimeout> | undefined;
  watch(
    isDark,
    (dark) => {
      clearTimeout(hingeTimer);
      if (!document.documentElement.classList.contains("theme-turning")) {
        inkDark.value = dark;
        return;
      }
      hingeTimer = setTimeout(
        () =>
          requestAnimationFrame(() =>
            requestAnimationFrame(() => (inkDark.value = isDark.value)),
          ),
        hingeMs(dark),
      );
    },
    { flush: "sync" },
  );'''
assert a in s
s=s.replace(a,'''  // swap runs on the CSS clock, not the click's: the transitions start at the commit of the
  // frame the class lands in (two frames on), and the swap is written the frame AFTER the one
  // that paints the CSS step (two frames off the hinge). Anchored at the click, a cold flip's
  // first frame (~70 ms) put the swap ahead of the step, and the re-bake it starts held the
  // step's paint ~300 ms while the compositor kept dusking the paper: dark digits on dark paper
  // (measured, chromium 1280). The <image> still paints a decode later; the §13 form is a CSS
  // step on the grid's own ink (MOT-VERB row 36).
  const inkDark = ref(isDark.value);
  let hinge = 0;
  watch(
    isDark,
    (dark) => {
      const gen = ++hinge;
      if (!document.documentElement.classList.contains("theme-turning")) {
        inkDark.value = dark;
        return;
      }
      const frame = (fn: () => void) =>
        requestAnimationFrame(() => gen === hinge && fn());
      const twoFrames = (fn: () => void) => frame(() => frame(fn));
      twoFrames(() =>
        setTimeout(() => twoFrames(() => (inkDark.value = dark)), hingeMs(dark)),
      );
    },
    { flush: "sync" },
  );''')
open(p,'w').write(s)
print('v5')
