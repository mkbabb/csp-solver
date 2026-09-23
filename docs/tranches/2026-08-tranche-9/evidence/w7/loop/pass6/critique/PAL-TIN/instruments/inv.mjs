const toHex=(L,C,h)=>{const a=C*Math.cos(h*Math.PI/180),b=C*Math.sin(h*Math.PI/180);const l=(L+0.3963377774*a+0.2158037573*b)**3,m=(L-0.1055613458*a-0.0638541728*b)**3,s=(L-0.0894841775*a-1.291485548*b)**3;
const r=4.0767416621*l-3.3077115913*m+0.2309699292*s,g=-1.2684380046*l+2.6097574011*m-0.3413193965*s,bb=-0.0041960863*l-0.7034186147*m+1.707614701*s;
const enc=v=>{v=Math.min(1,Math.max(0,v));return Math.round(255*(v<=0.0031308?12.92*v:1.055*v**(1/2.4)-0.055))};return '#'+[r,g,bb].map(enc).map(x=>x.toString(16).padStart(2,'0')).join('')};
for (const [L,C,h] of process.argv.slice(2).map(s=>s.split(',').map(Number))) console.log(L,C,h,toHex(L,C,h));
