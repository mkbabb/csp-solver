const fs=require('fs'); const [o,out,n]=process.argv.slice(2); const s=fs.readFileSync(o,'utf8');
const SEAT=/(\n  \.margin-note \{\n    min-height: inherit;)/;
const P={
 E1:(x)=>x.replace(SEAT,'$1\n    min-height: 0;'),
 E2:(x)=>x.replace(/<\/style>\s*$/,'</style>\n\n<style scoped>\n@media (max-width: 1023.98px) {\n  .margin-note {\n    min-height: 0;\n  }\n}\n</style>\n'),
 E2b:(x)=>x.replace(/<\/style>\s*$/,'.margin-note-block > .margin-note {\n  min-height: 0;\n}\n</style>\n'),
 E3:(x)=>x.replace('  min-height: 1.3em;\n}','  min-height: 1px;\n}'),
 E4:(x)=>x.replace('@media (max-width: 1023.98px) and (orientation: landscape) {\n','@media (max-width: 1023.98px) and (orientation: landscape) {\n  .margin-note {\n    min-height: 0 !important;\n  }\n'),
};
const t=P[n](s); if(t===s){console.error('ANCHOR');process.exit(3);} fs.writeFileSync(out,t);
