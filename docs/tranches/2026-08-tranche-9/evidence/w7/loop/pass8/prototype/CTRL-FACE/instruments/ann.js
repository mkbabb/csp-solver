const j=require(process.argv[2]);const want=new RegExp(process.argv[3]);
const walk=(s)=>{for(const c of s.suites||[])walk(c);for(const sp of s.specs||[])for(const t of sp.tests)for(const r of t.results){for(const a of (t.annotations||[]).concat(r.annotations||[]))if(want.test(a.type))console.log(`${t.projectName} [${s.title.slice(-24)}] ${a.type}: ${a.description.slice(0,600)}`)}};
j.suites.forEach(walk);
