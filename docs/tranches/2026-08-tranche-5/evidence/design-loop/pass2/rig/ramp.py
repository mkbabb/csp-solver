import colorsys
def hsl(h,s,l):
    r,g,b = colorsys.hls_to_rgb(h/360, l/100, s/100)
    return (r*255, g*255, b*255)
def hexc(h):
    h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def lum(c):
    def f(v):
        v/=255
        return v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4
    r,g,b=c; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    la,lb=lum(a),lum(b)
    hi,lo=max(la,lb),min(la,lb)
    return (hi+0.05)/(lo+0.05)
def mix(c,p,bg):  # color-mix(in srgb, c p%, transparent) composited over bg
    return tuple(c[i]*p/100 + bg[i]*(1-p/100) for i in range(3))

TH = {
 "light": dict(card=hsl(48,12,99), bg=hsl(48,15,98), graph=hsl(0,0,15),
               muted=hsl(0,0,45.1), fg=hsl(0,0,3.9),
               rose=hexc("e8315b"), redink=hexc("d02a52")),
 "dark":  dict(card=hsl(24,6,7),  bg=None, graph=hsl(48,10,80),
               muted=hsl(48,5,64), fg=hsl(48,10,92),
               rose=hexc("ff5c7c"), redink=hexc("ff5c7c")),
}
print("=== graphite ramp on --color-card ===")
print(f"{'p%':>4} {'light':>7} {'dark':>7}   min")
for p in [40,45,50,55,58,60,62,65,68,70,72,75,80,85,100]:
    l = cr(mix(TH['light']['graph'],p,TH['light']['card']), TH['light']['card'])
    d = cr(mix(TH['dark']['graph'],p,TH['dark']['card']), TH['dark']['card'])
    print(f"{p:>4} {l:7.3f} {d:7.3f}   {min(l,d):6.3f}")
print()
for th in ("light","dark"):
    t=TH[th]
    print(f"[{th}] muted-fg vs card = {cr(t['muted'],t['card']):.3f}   fg vs card = {cr(t['fg'],t['card']):.3f}")
    print(f"[{th}] crayon-rose vs card = {cr(t['rose'],t['card']):.3f}   red-ink vs card = {cr(t['redink'],t['card']):.3f}")
