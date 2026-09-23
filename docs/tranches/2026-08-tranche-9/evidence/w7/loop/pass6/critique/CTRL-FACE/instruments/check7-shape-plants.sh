#!/bin/zsh
# CHECK 7 plants the lane did not plant, on a scratch COPY of web/frontend (src/ + scripts/), bare exit codes.
OS=src/pencil/chrome/OptionSelector/OptionSelector.vue; cp $OS /tmp/os.bak.$$
plant() { cp /tmp/os.bak.$$ $OS; perl -0pi -e "$1" $OS; node scripts/check-font-coverage.mjs > /dev/null 2>&1; echo "$2 EXIT $?"; }
plant 's|^\.ctrl-word \{|.ctrl-word { font: var(--w, 400) 1rem "Comic Sans MS", cursive;|m' "P1 shorthand led by var()"
plant 's|<span class="ctrl-word">|<span class="ctrl-word" style="font-family: Comic Sans MS">|' "P2 template style= attribute"
plant 's|<span class="ctrl-word">|<span class="ctrl-word" :style="{ fontFamily: \x27Comic Sans MS\x27 }">|' "P3 :style binding"
plant 's|<span class="ctrl-word">|<span class="ctrl-word font-serif">|' "P4 Tailwind named font-serif"
plant 's|^\.ctrl-word \{|.ctrl-word { font: 1rem "Comic Sans MS";|m' "P6 plain shorthand (the lane's shape)"
cp /tmp/os.bak.$$ $OS
