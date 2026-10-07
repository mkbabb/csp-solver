#!/bin/bash
# usage: unserve.sh <label> <expected cwd suffix> — kills ONLY this critic's own recorded listener+wrapper after checking cwd
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-acc5
L=$1; SUF=$2; LP=$(cat $C/pids/$L.listener); WP=$(cat $C/pids/$L.wrapper)
c=$(lsof -a -p $LP -d cwd -Fn 2>/dev/null | grep ^n | cut -c2-)
case "$c" in *"$SUF") kill $LP $WP 2>/dev/null; echo "KILLED $L listener $LP wrapper $WP cwd $c $(date +%T)";; *) echo "NOT KILLED $L $LP cwd '$c'";; esac
