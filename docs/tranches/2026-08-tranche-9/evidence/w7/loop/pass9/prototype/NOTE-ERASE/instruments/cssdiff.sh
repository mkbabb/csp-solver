#!/bin/bash
# cssdiff.sh <distA> <distB> — every index-*.css rule present in one and not the other (rules split on '}')
a=$(ls $1/assets/index-*.css) b=$(ls $2/assets/index-*.css)
echo "A $(basename $a) $(wc -c < $a) B · $(basename $b) $(wc -c < $b) B"
diff <(tr '}' '\n' < $a | sort) <(tr '}' '\n' < $b | sort) | grep '^[<>]' | cut -c1-160 | head -${3:-20}
echo "rules differing: $(diff <(tr '}' '\n' < $a | sort) <(tr '}' '\n' < $b | sort) | grep -c '^[<>]')"
