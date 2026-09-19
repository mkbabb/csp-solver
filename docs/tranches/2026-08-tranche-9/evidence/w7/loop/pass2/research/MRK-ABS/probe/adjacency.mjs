/** T9-W7 pass 2 · MRK-ABS — WCAG 1.4.11 asks for 3:1 against ADJACENT colours. At 16x16 the
 *  ring's ink lands ON the grid rule (1.357px of overlap), so the rule IS an adjacent colour. */
const hsl=(h,s,l)=>{s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l);
  const f=n=>l-a*Math.max(-1,Math.min(Math.min(k(n)-3,9-k(n)),1));return [f(0),f(8),f(4)].map(v=>Math.round(v*255));};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const over=(fg,a,bg)=>fg.map((c,i)=>Math.round(a*c+(1-a)*bg[i]));
const lum=([r,g,b])=>{const f=x=>{const v=x/255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);};
const cr=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return Math.round(((x+0.05)/(y+0.05))*100)/100;};

const cardL=hsl(48,12,99), cardD=hsl(24,6,7);
const ruleL=hsl(0,0,15), ruleD=hsl(48,10,80);          // --grid-line-color light / dark
const sketchL=hex("#3a7bc4"), crayonD=hex("#6aabeb");
// the rule paints at stroke-opacity 1 in the grid layer; the ring at 0.9 over whatever is under it
const ringOnPaperL=over(sketchL,0.9,cardL), ringOnPaperD=over(crayonD,0.9,cardD);
const ringOnRuleL=over(sketchL,0.9,ruleL),  ringOnRuleD=over(crayonD,0.9,ruleD);

console.log("1.4.11 ADJACENCY at 16x16, where the ring's ink overlaps the rule's by 1.357px:");
console.log("  light  ring-on-paper vs paper        ", cr(ringOnPaperL, cardL));
console.log("  light  ring-on-paper vs RULE ink     ", cr(ringOnPaperL, ruleL), "  <- the adjacent colour at 16x16");
console.log("  light  ring-over-rule vs rule        ", cr(ringOnRuleL, ruleL));
console.log("  dark   ring-on-paper vs paper        ", cr(ringOnPaperD, cardD));
console.log("  dark   ring-on-paper vs RULE ink     ", cr(ringOnPaperD, ruleD), "  <- the adjacent colour at 16x16");
console.log("  dark   ring-over-rule vs rule        ", cr(ringOnRuleD, ruleD));
console.log("\n  the rule itself vs paper (for scale): light", cr(ruleL,cardL), " dark", cr(ruleD,cardD));
