#!/bin/bash
# build.sh <copy root> <out dist> <tag> : vite build through a two-line .mts config with a private cacheDir outside the project
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
R=$1/web/frontend; OUT=$2; TAG=$3
cat > $P/cfg/build-$TAG.mts <<EOC
import base from "$R/vite.config.ts";
export default { ...base, cacheDir: "$P/vite-cache-$TAG" };
EOC
cd $R && npx vite build --config $P/cfg/build-$TAG.mts --outDir $OUT --emptyOutDir > $P/logs/build-$TAG.log 2>&1
echo "build $TAG exit=$? $(ls $OUT/assets | grep -E '^index-.*\.(js|css)$' | tr '\n' ' ')"
