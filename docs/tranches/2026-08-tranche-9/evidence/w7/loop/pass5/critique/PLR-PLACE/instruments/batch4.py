import hashlib, subprocess, time, os
FE="<work>"; S="<scratch>"
MARK=f"{FE}/src/pencil/chrome/PlayerMark/PlayerMark.vue"
sha=lambda p: hashlib.sha1(open(p,'rb').read()).hexdigest()
log=open(f"{S}/logs/batch4.log","a")
def pw(tag, spec):
    r=subprocess.run(["npx","playwright","test","-c",".plr-place-crit/pw.config.ts",spec,"--reporter=list"],cwd=FE,capture_output=True,text=True,env=dict(os.environ,PLC_PORT="4246"))
    open(f"{S}/logs/b4-{tag}.log","w").write(r.stdout+r.stderr)
    lines=[l for l in r.stdout.splitlines() if 'BELOW' in l or 'GHOST' in l or '✘' in l or '✓' in l or 'passed' in l or 'failed' in l]
    log.write(f"## {tag} exit={r.returncode}\n"+"\n".join(lines)+"\n"); log.flush()
def planted(tag, a, b, spec):
    keep=open(MARK).read(); h=sha(MARK)
    assert keep.count(a)==1, tag
    open(MARK,'w').write(keep.replace(a,b)); time.sleep(4)
    try: pw(tag, spec)
    finally:
        open(MARK,'w').write(keep); ok=sha(MARK)==h; log.write(f"   restored-sha1={'OK' if ok else 'MISMATCH'}\n"); log.flush(); time.sleep(4)
pw("below-tree", ".plr-place-crit/k-below.spec.ts")
planted("below-E4", '    :chart="chart"\n    @click="close"\n', '    :chart="chart"\n', ".plr-place-crit/k-below.spec.ts")
old="""  for (const id of Object.keys(settled.value)) {
    if (id in now) continue;
    clearTimeout(timers[id]);
    delete timers[id];
    const"""
new="""  for (const id of new Set([...Object.keys(settled.value), ...Object.keys(timers)])) {
    if (id in now) continue;
    clearTimeout(timers[id]);
    delete timers[id];
    if (!(id in settled.value)) continue;
    const"""
planted("ghost-cured", old, new, ".plr-place-crit/k-ghost.spec.ts")
log.write("DONE\n")
