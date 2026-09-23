#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/.gt
for v in chromium-1280-light chromium-390-light chromium-1280-dark chromium-390-dark webkit-1280-light; do
  node picmp.mjs pi/base-$v.json pi/proto-$v.json > pi/cmp-$v.json
  node -e 'const j=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));console.log(process.argv[2],"| onlyControl",j.onlyControl.length,"onlyProto",j.onlyProto.length,"| unclaimed",j.unclaimedN,JSON.stringify(j.unclaimed).slice(0,300),"| claimed",j.claimedN,"| beatOnly",j.beatOnly,"| census",JSON.stringify(j.filterCensus),"| btnAfter",j.btnAfter.join(" / "))' pi/cmp-$v.json $v
done
