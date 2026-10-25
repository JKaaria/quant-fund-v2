/** Validate the actual deployable static tree, not only a successful framework build. */
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {basePath,siteBaseUrl} from '../lib/deployment.mjs';
import {loadDataset,readPublicFiles} from '../lib/publication.mjs';
import {allRoutes} from '../lib/routes.mjs';
import {directoryFiles} from '../lib/repository.mjs';
import {scanBytes} from '../lib/privacy.mjs';
export function verifyStaticOutput(directory='out',environment=process.env){
 const files=directoryFiles(directory),data=loadDataset(),base=basePath(environment),origin=siteBaseUrl(environment);
 let references=0;
 function reference(value){
  value=value.replaceAll('&amp;','&');
  if(value.startsWith('#')||value.startsWith('https://')||value.startsWith('data:'))return;
  if(!value.startsWith('/')||value.startsWith('//'))throw new Error('NONCANONICAL_STATIC_REFERENCE');
  const url=new URL(value,'https://static.invalid');
  if(base&&!(url.pathname===base||url.pathname.startsWith(base+'/')))throw new Error('STATIC_REFERENCE_MISSING_BASE_PATH');
  let name=decodeURIComponent(url.pathname.slice(base.length));
  name=name.replace(/^\//,'');
  if(!name||name.endsWith('/'))name+='index.html';
  if(!files.has(name)&&!files.has(name+'/index.html'))throw new Error('MISSING_STATIC_TARGET:'+name);
  references++;
 }
 for(const[name,bytes]of files){
  if(name.split('/').some(p=>['.git','.next','node_modules'].includes(p))||name.endsWith('.map')||name.startsWith('.env'))throw new Error('UNAPPROVED_STATIC_ARTIFACT');
  scanBytes(bytes,name);
  if(name.endsWith('.html'))for(const m of bytes.toString().matchAll(/\b(?:href|src)=["']([^"']+)["']/g))reference(m[1]);
 }
 for(const route of allRoutes(data)){
  const name=(route==='/'?'':route.slice(1)+'/')+'index.html',bytes=files.get(name);
  if(!bytes||!bytes.toString().includes('Paper trading / research only'))throw new Error('MISSING_STATIC_ROUTE_OR_DISCLOSURE');
 }
 const expected=readPublicFiles(),actual=directoryFiles(path.join(directory,'data'));
 if(actual.size!==expected.size)throw new Error('STATIC_DATA_INVENTORY_MISMATCH');
 for(const[n,b]of expected)if(!actual.get(n)?.equals(b))throw new Error('STATIC_DATA_BYTES_MISMATCH');
 if(!files.has('.nojekyll'))throw new Error('STATIC_PAGES_MARKER_MISSING');
 if(!files.get('robots.txt')?.toString().includes('Allow: /'))throw new Error('PUBLIC_INDEXING_NOT_ENABLED');
 const sitemap=files.get('sitemap.xml')?.toString()||'';
 if(origin){
  const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
  const routes=allRoutes(data).map(r=>origin+(r==='/'?'/':r+'/'));
  if(urls.length!==routes.length||routes.some(r=>!urls.includes(r)))throw new Error('SITEMAP_BASE_OR_ROUTES_MISMATCH');
  if(!files.get('robots.txt').toString().includes(origin+'/sitemap.xml'))throw new Error('ROBOTS_SITEMAP_MISMATCH');
 }
 return {status:'PASS',routes:allRoutes(data).length,files:files.size,internal_reference_checks:references,public_data_files:expected.size,public_data:'BYTE_IDENTICAL',privacy:'PASS',base_path:base,sitemap:origin?'ALL_ROUTES':'NO_UNASSIGNED_ORIGIN_INVENTED'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)console.log(JSON.stringify(verifyStaticOutput()));
