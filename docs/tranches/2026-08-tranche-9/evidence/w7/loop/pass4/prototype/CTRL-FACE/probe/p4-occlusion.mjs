// T9-W7 pass 4 · CTRL-FACE — THE CASE-WIDE OCCLUSION SCAN, PAIRED against 74a2b5d9.
// The e2e row asserts; this probe answers the only question that decides who owns a hit:
// is it on HEAD too? A pseudo-element's box is reconstructed from BOTH axes here (top/bottom,
// left/right) — the first form defaulted an unresolvable `top` to the host's top edge, which
// puts a `bottom: 0` fade at the WRONG end of its bar and invents a 100% cover.
import { chromium, webkit } from "playwright";
const TREES = [["proto","http://127.0.0.1:4234"],["head","http://127.0.0.1:4235"]];
const CELLS = [["390x844 coarse",{width:390,height:844},true],["1280x800 fine",{width:1280,height:800},false]];
const NAME_SEL = ".washi-tag, .zone-row-label, .section-heading, .ctrl-word, .heading-value";
const scan = (nameSel) => {
  const px=(n)=>Math.round(n*100)/100;
  const inter=(a,b)=>{const w=Math.min(a.right,b.right)-Math.max(a.left,b.left);const h=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);return w>0&&h>0?w*h:0;};
  const clipTo=(r,p)=>{if(!p)return r;const l=Math.max(r.left,p.left),t=Math.max(r.top,p.top),ri=Math.min(r.right,p.right),b=Math.min(r.bottom,p.bottom);return new DOMRect(l,t,Math.max(0,ri-l),Math.max(0,b-t));};
  const port=(el)=>{for(let p=el.parentElement;p;p=p.parentElement){const cs=getComputedStyle(p);if(/(auto|scroll|hidden|clip)/.test(cs.overflow+cs.overflowX+cs.overflowY))return p.getBoundingClientRect();}return null;};
  const paints=(cs)=>{const bg=cs.backgroundColor;const ob=!!bg&&bg!=="transparent"&&!/rgba?\([^)]*,\s*0\s*\)$/.test(bg);
    return ob||cs.backgroundImage!=="none"||(cs.boxShadow!=="none"&&cs.boxShadow!=="")||(cs.backdropFilter!=="none"&&cs.backdropFilter!=="");};
  const cases=[...document.querySelectorAll(".controls-card, .card-foot, .drawer-case")];
  const root=cases.find(c=>c.getClientRects().length)??document.body;
  const names=[];
  for(const el of root.querySelectorAll(nameSel)){
    if(!el.getClientRects().length)continue;
    const rng=document.createRange();rng.selectNodeContents(el);
    const rects=[...rng.getClientRects()].filter(r=>r.width>0&&r.height>0);
    for(const raw of rects){const r=clipTo(raw,port(el));if(r.width<=0||r.height<=0)continue;
      names.push({text:(el.textContent??"").trim().slice(0,20),rect:r,area:r.width*r.height,el});}
  }
  const surfaces=[];const num=(v)=>/px$/.test(v)?parseFloat(v):NaN;
  for(const el of root.querySelectorAll("*")){
    const cs=getComputedStyle(el),box=el.getBoundingClientRect(),p=port(el);
    const opaque=cs.visibility!=="hidden"&&cs.display!=="none"&&parseFloat(cs.opacity)>0.02;
    const nm=`${el.tagName.toLowerCase()}.${(el.className||"").toString().split(/\s+/)[0]}`;
    if(opaque&&paints(cs)&&/^(sticky|fixed|absolute)$/.test(cs.position)&&box.width&&box.height)
      surfaces.push({what:nm,rect:clipTo(box,p),el,kind:"element"});
    for(const pe of ["::before","::after"]){
      const ps=getComputedStyle(el,pe);
      if(ps.content==="none"||ps.content==="normal")continue;
      if(!/^(sticky|fixed|absolute)$/.test(ps.position))continue;
      if(parseFloat(ps.opacity)<=0.02||ps.visibility==="hidden")continue;
      if(!paints(ps))continue;
      const w=num(ps.width),h=num(ps.height),l=num(ps.left),t=num(ps.top),r=num(ps.right),b=num(ps.bottom);
      if(Number.isNaN(w)||Number.isNaN(h)){surfaces.push({what:`${nm}${pe} UNRESOLVED-SIZE`,rect:new DOMRect(0,0,0,0),el,kind:"pseudo"});continue;}
      let x,y;
      if(!Number.isNaN(l))x=box.left+l; else if(!Number.isNaN(r))x=box.right-r-w; else x=NaN;
      if(!Number.isNaN(t))y=box.top+t;  else if(!Number.isNaN(b))y=box.bottom-b-h; else y=NaN;
      if(Number.isNaN(x)||Number.isNaN(y)){surfaces.push({what:`${nm}${pe} UNRESOLVED-POS(t${ps.top}/b${ps.bottom}/l${ps.left}/r${ps.right})`,rect:new DOMRect(0,0,0,0),el,kind:"pseudo"});continue;}
      surfaces.push({what:`${nm}${pe}`,rect:clipTo(new DOMRect(x,y,w,h),p),el,kind:"pseudo"});
    }
  }
  const hits=[];
  for(const n of names)for(const s of surfaces){
    if(!s.rect.width||!s.rect.height)continue;
    if(s.el&&(s.el.contains(n.el)||n.el.contains(s.el)))continue;
    const a=inter(n.rect,s.rect);if(a<=0)continue;
    hits.push(`"${n.text}" ${px(a/n.area*100)}% by ${s.what}`);
  }
  return {names:names.length,surfaces:surfaces.filter(s=>s.rect.width&&s.rect.height).length,
    unresolved:surfaces.filter(s=>/UNRESOLVED/.test(s.what)).map(s=>s.what),hits};
};
for(const [engine,L] of [["chromium",chromium],["webkit",webkit]])
 for(const [label,vp,coarse] of CELLS){
  console.log(`\n== ${engine} · ${label} ==`);
  for(const [tree,base] of TREES){
    const b=await L.launch();
    const ctx=await b.newContext({viewport:vp,baseURL:base,hasTouch:coarse,isMobile:coarse&&engine==="chromium"});
    const p=await ctx.newPage();
    await p.emulateMedia({reducedMotion:"reduce"});
    await p.goto("/?size=3&difficulty=EASY",{waitUntil:"networkidle"});
    await p.waitForSelector("svg.handwritten-logo",{timeout:20000});
    const card=p.locator(".controls-card:visible").first();
    if(!(await card.isVisible().catch(()=>false))){await p.locator(".drawer-tab").tap().catch(async()=>{await p.locator(".drawer-tab").click();});await p.waitForTimeout(900);}
    await p.waitForTimeout(400);
    const r=await p.evaluate(scan,NAME_SEL);
    console.log(`  ${tree}: ${r.names} names × ${r.surfaces} surfaces → ${r.hits.length} hits${r.unresolved.length?` (${r.unresolved.length} unresolved: ${r.unresolved.join("; ")})`:""}`);
    for(const h of r.hits)console.log(`      ${h}`);
    await b.close();
  }
}
