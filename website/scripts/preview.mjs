/** Local-only static preview. This process serves only the generated out directory. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {basePath} from '../lib/deployment.mjs';
const base=basePath();
const root=path.resolve('out');
if(!fs.existsSync(path.join(root,'index.html')))throw new Error('Build the static website before previewing.');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.csv':'text/csv; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain','.xml':'application/xml'};
http.createServer((request,response)=>{
 if(!['GET','HEAD'].includes(request.method)){response.writeHead(405);response.end();return;}
 let name;try{name=decodeURIComponent(new URL(request.url,'http://preview.invalid').pathname);}catch{response.writeHead(400);response.end();return;}
 if(name.includes('\0') || name.split('/').includes('..')){response.writeHead(403);response.end();return;}
 if(base){if(!(name===base||name.startsWith(base+'/'))){response.writeHead(404);response.end();return;}name=name.slice(base.length)||'/';}
 let target=path.resolve(root,'.'+name);
 if(!target.startsWith(root+path.sep) && target!==root){response.writeHead(403);response.end();return;}
 if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
 if(!fs.existsSync(target)||!fs.statSync(target).isFile()){response.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});response.end(fs.readFileSync(path.join(root,'404.html')));return;}
 const real=fs.realpathSync(target);if(!real.startsWith(root+path.sep)){response.writeHead(403);response.end();return;}
 response.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});
 response.end(request.method==='HEAD'?undefined:fs.readFileSync(target));
}).listen(3000,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:3000'+base+'/'));
