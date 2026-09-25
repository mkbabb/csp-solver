#!/bin/zsh
# PAL-TIN pass 7 · the WHOLE spec file (or a -g filter), one engine per call; exit per engine logged.
source /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/paltin7.env
export T9_INSTRUMENTS=${INSTR:-$T9_INSTRUMENTS}
cd $FE || exit 1
d=${1:-1}; tag=${2:-tree}; g=${3:-}
for eng in ${=ENGINES:-chromium webkit}; do
  if [ -n "$g" ]; then extra=(-g "$g"); else extra=(); fi
  lg=.paltin7/logs/spec-$tag-$eng-dpr$d.log
  echo "instruments $T9_INSTRUMENTS · load $(uptime | sed 's/.*averages*: //') · siblings $(pgrep -f 'vitest|playwright' | wc -l | tr -d ' ')" > $lg
  PLAYWRIGHT_BASE_URL=${BASE:-http://127.0.0.1:4245} TIN_DPR=$d TIN_OUT=$S/paltin7-out/tr-$tag-$eng \
    npx playwright test --config .paltin7/pw.mts --project $eng "${extra[@]}" >> $lg 2>&1
  echo "EXIT=$?" >> $lg
done
echo done > .paltin7/logs/spec-$tag-dpr$d.done
