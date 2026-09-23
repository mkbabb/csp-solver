#!/bin/bash
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
M=$W/src/pencil/chrome/MarginNote.vue
cd $W
serve() {
  kill $(cat $SP/pid-proto) $(lsof -nP -iTCP:4248 -sTCP:LISTEN -t) 2>/dev/null; sleep 1
  nohup npx vite preview --config .note-erase/vite.preview.mts --outDir dist --host 127.0.0.1 --port 4248 --strictPort > $SP/logs/srv-proto.log 2>&1 &
  echo $! > $SP/pid-proto; sleep 4
  echo "served: $(curl -s http://127.0.0.1:4248/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) listener=$(lsof -nP -iTCP:4248 -sTCP:LISTEN -t)"
}
cp $M $SP/MarginNote.bak; O=$(shasum $M | cut -c1-40); echo "orig $O"
perl -0pi -e 's/\n\s*\@before-leave="stopTheClock"//' $M; echo "hook refs left: $(grep -c 'before-leave' $M)"
npx vite build --config .note-erase/vite.build.mts > $SP/logs/build-broken.log 2>&1; echo "build exit $? identity $(ls dist/assets | grep '^index-.*\.js$')"
serve
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4248 npx playwright test --config .note-erase/pw.e2e.config.ts e2e/affordances.spec.ts -g "drop clock" 2>&1 | grep -E "✓|✘|passed|failed|Expected|Received|expect\(" | head -20; echo "exit=${PIPESTATUS[0]}"
cp $SP/MarginNote.bak $M; echo "restored $(shasum $M | cut -c1-40) want $O"
npx vite build --config .note-erase/vite.build.mts > $SP/logs/build-restored.log 2>&1; echo "build exit $? identity $(ls dist/assets | grep '^index-.*\.js$') (want index-aW5mmGzDOl_l.js)"
serve
