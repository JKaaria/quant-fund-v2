/** Public build metadata only; GitHub Pages supplies the origin and mount path. */
export function basePath(environment=process.env){
 const value=environment.PUBLIC_BASE_PATH||'';
 if(value===''||value==='/')return '';
 if(!/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(value))throw new Error('INVALID_PUBLIC_BASE_PATH');
 return value;
}
export function publicHref(value,environment=process.env){
 if(typeof value!=='string')throw new Error('INVALID_PUBLIC_HREF');
 if(value.startsWith('#')||value.startsWith('https://'))return value;
 if(!value.startsWith('/')||value.startsWith('//'))throw new Error('INVALID_PUBLIC_HREF');
 return basePath(environment)+value;
}
export function siteOrigin(environment=process.env){
 const explicit=environment.PUBLIC_SITE_ORIGIN;
 if(!explicit)return null;
 const u=new URL(explicit);
 if(u.protocol!=='https:'||u.username||u.password||u.port||u.pathname!=='/'||u.search||u.hash||!u.hostname.includes('.')||/^(localhost|127\.)/.test(u.hostname))throw new Error('INVALID_PUBLIC_SITE_ORIGIN');
 return u.origin;
}
export function siteBaseUrl(environment=process.env){const origin=siteOrigin(environment);return origin?origin+basePath(environment):null;}
export function repositoryUrl(environment=process.env){
 const value=environment.PUBLIC_REPOSITORY_URL;
 if(!value)return null;
 const u=new URL(value);
 if(u.protocol!=='https:'||u.host!=='github.com'||u.username||u.password||u.search||u.hash||!/^\/[A-Za-z0-9_.-]+\/quant-fund-v2\/?$/.test(u.pathname))throw new Error('INVALID_PUBLIC_REPOSITORY_URL');
 return u.href.replace(/\/$/,'');
}
