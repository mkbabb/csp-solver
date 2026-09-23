#!/bin/zsh
# NOTE-ERASE pass-5 CRITIC: (1) a dead-hook dist (text intact) built with the scratch dir moved OUT of
# the tree; (2) affordances.spec.ts WHOLE on the tree dist, the tree's spec on the control dist, the
# control's own spec on the control dist; (3) the drop-clock row on the dead-hook dist (negative control).
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
CT=$SP/ctrl/web/frontend
cd $W || exit 9
SFC=src/pencil/chrome/MarginNote.vue; S0=$(shasum $SFC|cut -c1-40); cp $SFC $SP/bak3.vue
mv .critic-erase $SP/critic-erase-hold
sed -i '' 's/^function stopTheClock(el: Element): void {/function stopTheClock(el: Element): void {\n  if (el) return;/' $SFC
npx vite build --config $SP/vite.build.critic.mts --outDir $SP/dist-deadhook --emptyOutDir > $SP/logs/build-deadhook.log 2>&1; echo "deadhook build exit=$?"
cp $SP/bak3.vue $SFC; [ "$(shasum $SFC|cut -c1-40)" = "$S0" ] && echo "SFC restored sha1 ok"
mv $SP/critic-erase-hold .critic-erase
echo "deadhook identity: $(ls $SP/dist-deadhook/assets | grep '^index-.*js$')"
cd $W && nohup npx vite preview --config $SP/vite.preview.critic.mts --outDir $SP/dist-deadhook --host 127.0.0.1 --port 4248 --strictPort > $SP/logs/srv-dead.log 2>&1 &
sleep 4; echo "4248 serves: $(curl -s http://127.0.0.1:4248/ | grep -o 'index-[A-Za-z0-9_-]*\.js')"; lsof -nP -iTCP:4248 -sTCP:LISTEN -t > $SP/pid-dead; echo "pid-dead $(cat $SP/pid-dead)"
cat > .critic-erase/pw.e2e.config.ts <<CFG
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "../e2e", timeout: 30000, expect: { timeout: 10000 }, fullyParallel: true, workers: 2, retries: 0,
  reporter: "list", outputDir: "$SP/pw-e2e-out", globalSetup: "../e2e/global-setup.ts",
  projects: [ { name: "chromium", use: { browserName: "chromium" } }, { name: "webkit", use: { browserName: "webkit" } } ],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL, viewport: { width: 1280, height: 800 } },
});
CFG
mkdir -p $CT/.critic; sed "s#\\.\\./e2e#../e2e#g" .critic-erase/pw.e2e.config.ts > $CT/.critic/pw.e2e.config.ts
echo "== E1 tree spec WHOLE on tree dist (4246)"; PLAYWRIGHT_BASE_URL=http://127.0.0.1:4246 npx playwright test --config .critic-erase/pw.e2e.config.ts e2e/affordances.spec.ts > $SP/logs/e1.log 2>&1; echo "E1 exit=$?"; grep -E "passed|failed|flaky" $SP/logs/e1.log | tail -3
echo "== E2 NEGATIVE: drop-clock row on the dead-hook dist (4248)"; PLAYWRIGHT_BASE_URL=http://127.0.0.1:4248 npx playwright test --config .critic-erase/pw.e2e.config.ts e2e/affordances.spec.ts -g "drop clock" > $SP/logs/e2.log 2>&1; echo "E2 exit=$?"; grep -E "passed|failed|Expected|Received" $SP/logs/e2.log | head -8
echo "== E3 tree spec WHOLE on control dist (4247)"; PLAYWRIGHT_BASE_URL=http://127.0.0.1:4247 npx playwright test --config .critic-erase/pw.e2e.config.ts e2e/affordances.spec.ts > $SP/logs/e3.log 2>&1; echo "E3 exit=$?"; grep -E "passed|failed|✘" $SP/logs/e3.log | tail -6
echo "== E4 control's OWN spec WHOLE on control dist (4247)"; cd $CT && PLAYWRIGHT_BASE_URL=http://127.0.0.1:4247 npx playwright test --config .critic/pw.e2e.config.ts e2e/affordances.spec.ts > $SP/logs/e4.log 2>&1; echo "E4 exit=$?"; grep -E "passed|failed" $SP/logs/e4.log | tail -3
kill $(cat $SP/pid-dead) 2>/dev/null; sleep 1; lsof -nP -iTCP:4248 -sTCP:LISTEN -t || echo "4248 freed"
echo DONE
