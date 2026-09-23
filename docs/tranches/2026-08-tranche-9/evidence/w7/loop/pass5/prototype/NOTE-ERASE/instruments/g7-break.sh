#!/bin/bash
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
F=$SP/fold13/web/frontend
T=src/pencil/chrome/marginNote.motion.test.ts
C=$W/src/pencil/config/pencilConfig.ts
run() { npx vitest run $T 2>&1 | grep -E "×|Tests |AssertionError" | head -4; echo "exit=${PIPESTATUS[0]}"; }
echo "== my tree, whole file"; cd $W; run
echo "== §13 fold rehearsal (74a2b5d9 + MOT-VERB/pass4.diff + my SFC/test/note block), whole file"; cp $W/$T $F/$T; cd $F; run
echo "== G7 BORN-RED on my tree: the publisher emits a registration again (pass 3's shape)"; cd $W
cp $C $SP/pc.bak; O=$(shasum $C|cut -c1-40)
perl -0pi -e 's/    `:root\{\$\{decls\}\}` \+/    `\@property --motion-whisper{syntax:"<time>";inherits:true;initial-value:0ms}` +\n    `:root{\${decls}}` +/' $C; grep -c '@property --motion-whisper{' $C
npx vitest run $T -t "G7" 2>&1 | grep -E "×|✓|Tests |AssertionError" | head -4; echo "exit=${PIPESTATUS[0]}"
cp $SP/pc.bak $C; echo "restored $(shasum $C|cut -c1-40) want $O"
