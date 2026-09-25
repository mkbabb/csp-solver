# TAB-PEN pass-7 copy of the intake's gate2.py: arm H added; main's own fraction under 4.5 printed beside each arm's (T9-B28's loss, LAWS P6 §G);
# the stroke/H row printed against the painted digits (0.103-0.115) and the wordmark (0.171), a tab-size legibility window.
# G-TAB-2 rollup per arm from analyze.py's JSON: every row of the gate, min/median/max, PASS/FAIL.
# usage: python3 gate2.py <census.json>
import sys, json, statistics as st
R = json.load(open(sys.argv[1]))
def mm(v): v = [x for x in v if x is not None]; return f"{min(v):.3f}/{st.median(v):.3f}/{max(v):.3f}" if v else "n/a"
for arm in ['W', 'H', 'B', 'P', 'fable', 'opus', 'main']:
    A = [r for r in R if r['arm'] == arm]; M = [r for r in R if r['arm'] == 'main']
    print(f"\n== {arm} ==")
    cov = [r['cov'] for r in A]; print(f" coverage min/med/max {mm(cov)}  [0.18,0.32] {'PASS' if 0.18 <= min(cov) and max(cov) <= 0.32 else 'FAIL'}")
    mo = [r['max_over_med'] for r in A if r['device_px'] in (32, 180)]; print(f" skel max/med @32,180 dev px {mm(mo)}  <=1.25 {'PASS' if max(mo) <= 1.25 else 'FAIL'}")
    sh = [r['stroke_over_h'] for r in A if r['size'] in (32, 48, 180)]; print(f" stroke/H @32/48/180 css {mm(sh)}  median in [0.15,0.17] (a tab-size legibility window; digits paint 0.103-0.115, wordmark median 0.171) {'PASS' if 0.15 <= st.median(sh) <= 0.17 else 'FAIL'}; cells in window {sum(0.15 <= x <= 0.17 for x in sh)}/{len(sh)}")
    s16 = [r['stroke_over_h'] for r in A if r['size'] == 16]; print(f" stroke/H @16 (printed, not gated) {mm(s16)}")
    ap = {(r['engine'], r['strip']): r['apertures'] for r in A if r['size'] == 16 and r['dpr'] == 1}
    ok = all(len(v) >= 2 and sorted(v)[-2] >= 3 for v in ap.values()); print(f" apertures @16 DPR1 {sorted(set(map(str, ap.values())))}  two >=3 {'PASS' if ok else 'FAIL'}")
    for sch in ('light', 'dark'):
        t = sorted({tuple(r['tile_rgb']) for r in A if r['strip'].startswith(sch)}); print(f" tile under {sch}: {t}")
    for s in ('light-active', 'light-strip', 'dark-active', 'dark-strip'):
        v = [r['tile_on_strip'] for r in A if r['strip'] == s]; print(f" tile-on-strip {s}: {mm(v)}")
    for sch in ('light', 'dark'):
        for en in ('chromium', 'webkit'):
            v = [r['core_median'] for r in A if r['strip'].startswith(sch) and r['engine'] == en]; print(f" core median {sch} {en}: {mm(v)}")
    for s in ('light-active', 'dark-strip', 'light-strip', 'dark-active'):
        c = {r['engine']: r for r in A if r['size'] == 16 and r['dpr'] == 1 and r['strip'] == s}
        m = {r['engine']: r for r in M if r['size'] == 16 and r['dpr'] == 1 and r['strip'] == s}
        print(f" 16 DPR1 {s}: core ch {c['chromium']['core_median']:.2f} wk {c['webkit']['core_median']:.2f} (Δ {abs(c['chromium']['core_median'] - c['webkit']['core_median']):.2f})"
              f" · frac<4.5 ch {c['chromium']['frac_under45']:.3f} wk {c['webkit']['frac_under45']:.3f} · sub-4.5 n ch {c['chromium']['sub45_n']} wk {c['webkit']['sub45_n']} (main {m['chromium']['sub45_n']}/{m['webkit']['sub45_n']}; main frac<4.5 ch {m['chromium']['frac_under45']:.3f} wk {m['webkit']['frac_under45']:.3f})"
              f" · frac<3 ch {c['chromium']['frac_under3']:.3f} wk {c['webkit']['frac_under3']:.3f} · paper regions ch {c['chromium']['paper_regions']} wk {c['webkit']['paper_regions']}")
    bs = {(r['engine'], r['dpr'], r['size']): r.get('blur_sigma') for r in A if 'blur_sigma' in r}
    print(f" blurfit sigma (engine,dpr,size): {sorted(set((k[0], k[1], k[2], v) for k, v in bs.items()))[:8]}")
    print(f" two-photograph Δ max {max(r['photo_delta'] for r in A):.0f}")
