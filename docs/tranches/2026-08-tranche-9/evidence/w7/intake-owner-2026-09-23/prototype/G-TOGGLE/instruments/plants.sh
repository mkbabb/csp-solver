#!/bin/zsh
# plants.sh — born-RED checks of the storybook vitest: each plant applied, run, reverted from a backup
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/web/frontend
T=src/pencil/celestial/DarkModeToggle.vue; C=src/assets/index.css
cp $T ../../.gt/plant-toggle.bak; cp $C ../../.gt/plant-index.bak
plant() { echo "== $1"; npx vitest run src/pencil/config/storybook.test.ts 2>&1 | grep -E "Tests |FAIL .*>" | head -4; cp ../../.gt/plant-toggle.bak $T; cp ../../.gt/plant-index.bak $C; }
# G11: a typed 560ms star delay
sed -i '' 's|    opacity 0s linear v-bind("sb.star0") !important;|    opacity 0s linear 560ms !important;|' $T; plant "G11 typed 560ms star delay"
# G9: the hover fence removed
python3 - <<'EOF'
p='src/pencil/celestial/DarkModeToggle.vue'; s=open(p).read()
s=s.replace('@media (hover: hover) {\n  .sun-moon-toggle:hover {\n    outline: none;\n    transform: scale(1.08);\n  }\n}','.sun-moon-toggle:hover {\n  outline: none;\n  transform: scale(1.08);\n}',1)
open(p,'w').write(s)
EOF
plant "G9 fence removed"
# G4/G5: the hinge token at 0ms (the snap)
sed -i '' 's|  --motion-hinge-dark: 120ms;|  --motion-hinge-dark: 0ms;|' $C; plant "G4 hinge 0ms (the snap)"
# G5: dark grid token at 70%
sed -i '' 's|--grid-line-color: hsl(48 10% 80%);|--grid-line-color: hsl(48 10% 70%);|' $C; plant "G5 dark grid token 70%"
# G5: a var() fallback on a measured token
sed -i '' 's|stroke 0s linear var(--motion-hinge-dark),|stroke 0s linear var(--motion-hinge-dark, 120ms),|' $C; plant "G11 var() fallback on a measured token"
cmp $T ../../.gt/plant-toggle.bak && cmp $C ../../.gt/plant-index.bak && echo "restored clean"
