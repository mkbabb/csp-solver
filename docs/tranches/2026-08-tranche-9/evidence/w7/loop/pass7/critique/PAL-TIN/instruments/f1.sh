#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tincrit7
F=$S/g4/web/frontend; cd $F || exit 9
U=src/games/shared/useSession.ts; cp $U $S/logs/useSession.orig
t() { npx vitest run src/games/shared/useSession.test.ts --no-cache > $S/logs/f1-$1.log 2>&1; echo "$1 EXIT=$? $(grep -E 'Tests +[0-9]' $S/logs/f1-$1.log)" >> $S/logs/f1.txt; }
: > $S/logs/f1.txt
echo "sha1 $(shasum $U | cut -c1-8)" >> $S/logs/f1.txt
t clean
sed 's/    takesAHand \&\& Object.keys/    SELF_TAKES_A_HAND \&\& Object.keys/' $S/logs/useSession.orig > $U; grep -c "SELF_TAKES_A_HAND && Object.keys" $U >> $S/logs/f1.txt; t plant-ignores-switch
sed 's/known.value = withSelfInk(next);/known.value = withSelfInk(next, false);/; s/withSelfInk({ ...known.value, \[id\]: mint(id) })/withSelfInk({ ...known.value, [id]: mint(id) }, false)/' $S/logs/useSession.orig > $U; grep -c "false)" $U >> $S/logs/f1.txt; t plant-callsite-false
sed 's/known.value = withSelfInk(next);/known.value = withSelfInk(next, false);/' $S/logs/useSession.orig > $U; t plant-callsite657-only
cp $S/logs/useSession.orig $U; cmp -s $U $S/logs/useSession.orig && echo restored >> $S/logs/f1.txt
echo DONE >> $S/logs/f1.txt
