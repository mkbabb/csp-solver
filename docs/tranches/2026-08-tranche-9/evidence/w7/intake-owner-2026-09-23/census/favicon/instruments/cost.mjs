import { createRequire } from 'node:module'; const sharp=createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json')('sharp');
import fs from 'node:fs'; import zlib from 'node:zlib';
const svg=fs.readFileSync('favicon.svg');
const full=Buffer.from(svg.toString().replace(/rx="6" ry="6"/g,'rx="0" ry="0"'));
for (const [n,s,src] of [['png16',16,svg],['png32',32,svg],['apple180-fullbleed',180,full],['m192',192,full],['m512',512,full]]) {
  const b=await sharp(src,{density:72*s/32}).resize(s,s).png({compressionLevel:9,palette:true,quality:90}).toBuffer();
  const b2=await sharp(src,{density:72*s/32}).resize(s,s).png({compressionLevel:9}).toBuffer();
  console.log(n,s,'palette',b.length,'truecolor',b2.length);
}
console.log('favicon.svg raw',svg.length,'gzip',zlib.gzipSync(svg,{level:9}).length,'brotli',zlib.brotliCompressSync(svg).length);
