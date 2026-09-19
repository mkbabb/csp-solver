/** T9-W7 pass 2 · MRK-ABS — what the dark alias moves, and the chair's §6.11 gate-2 question.
 *  Tokens read from index.css: light card hsl(48 12% 99%), dark card hsl(24 6% 7%),
 *  --color-focus-sketch light #3a7bc4; dark arm (proposed) = --color-crayon-blue dark #6aabeb;
 *  --color-teacher-red = --color-crayon-rose (light #ff5c7c? no: light rose is the light token). */
const hsl = (h, s, l) => { s/=100; l/=100; const k=n=>(n+h/30)%12, a=s*Math.min(l,1-l);
  const f=n=>l-a*Math.max(-1,Math.min(Math.min(k(n)-3,9-k(n)),1));
  return [f(0),f(8),f(4)].map(v=>Math.round(v*255)); };
const hex = h => [1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const over = (fg, a, bg) => fg.map((c,i)=>Math.round(a*c+(1-a)*bg[i]));
const lum = ([r,g,b]) => { const f=x=>{const v=x/255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4);}; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
const cr = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return Math.round(((x+0.05)/(y+0.05))*100)/100; };

const cardL = hsl(48,12,99), bgL = hsl(48,15,98), cardD = hsl(24,6,7), bgD = hsl(24,8,6);
const sketchL = hex("#3a7bc4"), crayonBlueD = hex("#6aabeb"), roseL = hex("#e8315b"), roseD = hex("#ff5c7c");

console.log("TOKEN RING (opaque 2px) over the four grounds:");
console.log("  light  on card", cr(sketchL, cardL), " on background", cr(sketchL, bgL));
console.log("  dark   HEAD (no arm, #3a7bc4) on card", cr(sketchL, cardD), " on background", cr(sketchL, bgD));
console.log("  dark   ALIAS (#6aabeb)        on card", cr(crayonBlueD, cardD), " on background", cr(crayonBlueD, bgD));

console.log("\nBOARD RING (stroke-opacity 0.9) over the card:");
console.log("  light", cr(over(sketchL,0.9,cardL), cardL));
console.log("  dark HEAD ", cr(over(sketchL,0.9,cardD), cardD));
console.log("  dark ALIAS", cr(over(crayonBlueD,0.9,cardD), cardD));

console.log("\nTHE CHAIR'S §6.11 GATE 2 — the hint RIM against the SELECTION BODY (fill-opacity 0.08):");
for (const [name, ink, card] of [["light", sketchL, cardL], ["dark HEAD", sketchL, cardD], ["dark ALIAS", crayonBlueD, cardD]]) {
  const body = over(ink, 0.08, card);
  const rose = name === "light" ? roseL : roseD;
  const rim50 = over(rose, 0.5, body);
  console.log(`  ${name.padEnd(10)} selection body ${JSON.stringify(body)}  rim(50% teacher-red) ${cr(rim50, body)}:1  rim(100%) ${cr(rose, body)}:1`);
}

console.log("\nTHE FADE'S START (Tailwind's grey), for AA during the 150ms:");
const grey = [115,115,115];
console.log("  rgb(115,115,115) on card light", cr(grey, cardL), " on background light", cr(grey, bgL));
console.log("  the 80ms midpoint rgb(70,121,178) on card light", cr([70,121,178], cardL));

console.log("\nHEAD's two bespoke rings, painted (the born-RED rows):");
const fg = hsl(24,10,10); // approximate --color-foreground light; measured ink was rgb(10,10,10)
console.log("  logo/card 40% fg over paper ->", cr(over([10,10,10],0.4,cardL), cardL), "(measured 2.69 on the deck card)");
console.log("  staging/guard 45% fg over paper ->", cr(over([10,10,10],0.45,cardL), cardL), "(measured 3.14)");
