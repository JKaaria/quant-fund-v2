/** Public build metadata only. A local build never invents a deployment address. */
export function siteOrigin(environment=process.env){
 const explicit=environment.PUBLIC_SITE_ORIGIN;
 const host=environment.VERCEL_PROJECT_PRODUCTION_URL;
 if(!explicit&&!host)return null;
 const u=new URL(explicit||`https://${host}`);
 if(u.protocol!=='https:'||u.username||u.password||u.port||u.pathname!=='/'||u.search||u.hash||!u.hostname.includes('.')||/^(localhost|127\.)/.test(u.hostname))throw new Error('INVALID_PUBLIC_SITE_ORIGIN');
 return u.origin;
}
export function repositoryUrl(environment=process.env){
 const value=environment.PUBLIC_REPOSITORY_URL;
 if(!value)return null;
 const u=new URL(value);
 if(u.protocol!=='https:'||u.host!=='github.com'||u.username||u.password||u.search||u.hash||!/^\/[A-Za-z0-9_.-]+\/quant-fund-v2\/?$/.test(u.pathname))throw new Error('INVALID_PUBLIC_REPOSITORY_URL');
 return u.href.replace(/\/$/,'');
}
