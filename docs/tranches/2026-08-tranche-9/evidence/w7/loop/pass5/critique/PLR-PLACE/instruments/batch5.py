import hashlib, subprocess, time, os
FE="<work>"; S="<scratch>"; APP=f"{FE}/src/App.vue"
sha=lambda p: hashlib.sha1(open(p,'rb').read()).hexdigest()
log=open(f"{S}/logs/batch5.log","a")
def run(arm):
    env=dict(os.environ, PLC_PORT="4246", PLC_HEAD="4247", PLC_ARM=arm, PLC_OUT=f"{S}/out/kill")
    r=subprocess.run(["npx","playwright","test","-c",".plr-place-crit/pw.config.ts",".plr-place-crit/k-kill.spec.ts","--reporter=list"],cwd=FE,capture_output=True,text=True,env=env)
    open(f"{S}/logs/b5-{arm}.log","w").write(r.stdout+r.stderr)
    log.write(f"## {arm} exit={r.returncode}\n"+"\n".join(l for l in r.stdout.splitlines() if 'KILL|' in l or '✘' in l or 'passed' in l or 'failed' in l)+"\n"); log.flush()
run("chart")
keep=open(APP).read(); h=sha(APP)
a="const PLACE_CHART = true;"; assert keep.count(a)==1
open(APP,'w').write(keep.replace(a,"const PLACE_CHART = false;")); time.sleep(5)
try: run("list")
finally:
    open(APP,'w').write(keep); log.write(f"restored-sha1={'OK' if sha(APP)==h else 'MISMATCH'}\n"); log.flush()
log.write("DONE\n")
