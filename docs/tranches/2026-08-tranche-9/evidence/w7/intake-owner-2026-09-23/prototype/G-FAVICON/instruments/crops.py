# The lane's four crops from the n1 photographs (nearest-neighbour magnified; labels in the margin).
# usage: python3 crops.py <shots> <census.json> <touch.png> <outdir>
import sys, json, numpy as np
from PIL import Image, ImageDraw, ImageFont
SH, JS, TOUCH, OUT = sys.argv[1:5]
rows = json.load(open(JS))
F = ImageFont.load_default()
def shot(en, d, strip, arm, size, pad=2):
    im = Image.open(f'{SH}/{en}_dpr{d}_{strip}_{arm}_{size}_n1.png'); m = (4 - pad) * d
    return im.crop((m, m, im.width - m, im.height - m))  # the tile plus `pad` css px of strip
def mag(im, px): k = max(1, px // im.width); return im.resize((im.width * k, im.height * k), Image.NEAREST)
def sheet(cells, cols, cw, ch, title, lh=12):
    n = len(cells); r = (n + cols - 1) // cols
    S = Image.new('RGB', (cols * cw, r * ch + 16), 'white'); D = ImageDraw.Draw(S); D.text((4, 2), title, fill='black', font=F)
    for i, (im, lab) in enumerate(cells):
        x, y = (i % cols) * cw, (i // cols) * ch + 16
        S.paste(im, (x + 4, y + 4));
        for j, t in enumerate(lab.split('\n')): D.text((x + 4, y + 6 + im.height + j * lh), t, fill='black', font=F)
    return S
def get(**k): return next(r for r in rows if all(r[a] == b for a, b in k.items()))
# crop 1: contact sheet, main vs W
cells = []
for en in ('chromium', 'webkit'):
    for d in (1, 2):
        for strip in ('light-active', 'dark-strip'):
            for arm in ('main', 'W'):
                for size in (16, 32, 48):
                    cells.append((mag(shot(en, d, strip, arm, size), 104), f'{en[:2]} dpr{d} {strip[:5]}\n{arm} {size}'))
sheet(cells, 12, 118, 150, 'crop 1 · chromium+webkit · DPR1/2 · light-active #fff / dark-strip #202124 · main vs W at 16/32/48 · pointer n/a · nearest').convert('P', palette=Image.ADAPTIVE, colors=64).save(f'{OUT}/c1-contact-sheet-chromium-webkit-dpr1-2-light-dark-16-32-48-main-vs-W-pointer-na.png', optimize=True)
# crop 2: THE DECIDER, 16 DPR1 x10
cells = []
for en in ('chromium', 'webkit'):
    for strip in ('light-active', 'light-strip', 'dark-active', 'dark-strip'):
        for arm in ('main', 'W'):
            r = get(engine=en, dpr=1, strip=strip, arm=arm, size=16)
            cells.append((mag(shot(en, 1, strip, arm, 16, 1), 180), f'{en} {strip}\n{arm} cov {r["cov"]:.3f} core {r["core_median"]:.1f}\napert {r["apertures"]} <4.5 {r["frac_under45"]:.2f}'))
sheet(cells, 8, 196, 236, 'crop 2 · THE DECIDER · 16x16 DPR1 x10 nearest · both engines · light and dark schemes, both strips each · main (shipped) vs W (the cut) · pointer n/a').convert('P', palette=Image.ADAPTIVE, colors=64).save(f'{OUT}/c2-decider-16px-dpr1-x10-chromium-webkit-light-dark-main-vs-W-pointer-na.png', optimize=True)
# crop 3: the touch icon on white and black
t = Image.open(TOUCH).convert('RGB'); cells = []
def lum(c):
    c = np.array(c, float) / 255; c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
paper = t.getpixel((4, 4))
for bg in ((255, 255, 255), (0, 0, 0)):
    B = Image.new('RGB', (212, 212), bg); B.paste(t, (16, 16)); a, b = sorted([lum(paper), lum(bg)])
    k = (b + 0.05) / (a + 0.05); ink = min((t.getpixel((x, y)) for x in range(180) for y in range(180)), key=lum); a2, b2 = sorted([lum(ink), lum(paper)])
    cells.append((B, f'on #{bg[0]:02x}{bg[1]:02x}{bg[2]:02x}: paper vs ground {k:.2f}:1\ndarkest ink {ink} on paper {(b2 + 0.05) / (a2 + 0.05):.2f}:1'))
sheet(cells, 2, 260, 250, 'crop 3 · apple-touch-icon.png 180x180 (sharp/librsvg, light arm) · 1:1 · pointer n/a').save(f'{OUT}/c3-apple-touch-icon-180-on-white-and-black-librsvg-pointer-na.png', optimize=True)
# crop 4: the lawful pairs + siblings
cells = []
for strip in ('light-active', 'dark-strip'):
    for size in (16, 32):
        for arm, lab in (('W', 'B-FAV-1 W (default)'), ('P', 'B-FAV-1 P wght550'), ('B', 'B-FAV-2 B sw5'), ('fable', 'sibling Fable 16x25'), ('opus', 'sibling Opus 23x22'), ('main', 'control main')):
            r = get(engine='chromium', dpr=2, strip=strip, arm=arm, size=size); r1 = get(engine='chromium', dpr=1, strip=strip, arm=arm, size=16)
            cells.append((mag(shot('chromium', 2, strip, arm, size), 128), f'{lab}\n{strip[:5]} {size} DPR2 cov {r["cov"]:.3f}\nmax/med {r["max_over_med"]:.2f} s/H {r["stroke_over_h"]:.3f}\n16dpr1 apert {r1["apertures"]}'))
sheet(cells, 6, 150, 200, 'crop 4 · lawful pairs B-FAV-1 W|P and B-FAV-2 A(=W)|B, siblings Fable/Opus, main control · chromium DPR2 · light-active / dark-strip · 16 and 32 · pointer n/a · each cell its G-TAB-2 row').convert('P', palette=Image.ADAPTIVE, colors=96).save(f'{OUT}/c4-ballot-pairs-W-P-A-B-siblings-chromium-dpr2-light-dark-16-32-pointer-na.png', optimize=True)
print('ok')
