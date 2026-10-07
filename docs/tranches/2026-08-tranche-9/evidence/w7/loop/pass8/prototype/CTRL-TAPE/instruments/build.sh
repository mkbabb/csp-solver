#!/bin/bash
# build.sh <arch-name> — vite build of an archive, private cacheDir, outDir inside the archive
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tape8
cd $S/arch-$1/web/frontend
npx vite build --config .tape8-build.mts --outDir dist --emptyOutDir > $S/build-$1.log 2>&1
echo "EXIT $?" >> $S/build-$1.log
