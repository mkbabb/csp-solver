#!/bin/bash
# mirror the tree's web/frontend (product files) into the out-of-tree build copy; no rm, no --delete of foreign files
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8
rsync -a --delete --exclude node_modules --exclude 'dist*' --exclude '.acc6p8' --exclude '.vite*' "$W/" "$S/bt/web/frontend/"
ln -sfn "$W/node_modules" "$S/bt/web/frontend/node_modules"
echo synced
