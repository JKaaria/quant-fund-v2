/** Deterministic source-only export. Every copied filename is explicit. */
import fs from 'node:fs';
import path from 'node:path';
import {loadDataset,readPublicFiles,sha} from './publication.mjs';
import {scanBytes} from './privacy.mjs';
import {licenseFiles,licensingReadme,licenseStatus,rightsAudit} from './licensing.mjs';
export const SOURCE_FILES=Object.freeze([
 'public/.nojekyll','deployment/pages.yml','public/favicon.svg','package.json','package-lock.json','next.config.mjs','tsconfig.json','.gitignore','README.md',
 'app/robots.ts','app/sitemap.ts','app/layout.tsx','app/page.tsx','app/not-found.tsx','app/globals.css','app/[...path]/page.tsx',
 'components/Chart.tsx','components/UI.tsx','components/Pages.tsx','components/Shell.tsx',
 'lib/licensing.mjs','lib/deployment.mjs','lib/publication.mjs','lib/privacy.mjs','lib/format.mjs','lib/routes.mjs','lib/types.ts','lib/repository.mjs',
 'scripts/check-static.mjs','scripts/status.mjs','scripts/validate.mjs','scripts/preview.mjs','scripts/export.mjs','scripts/check-export.mjs',
 'tests/public.test.mjs'
]);
const stable=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
export function publicDocuments(data) {
 const f=data.fund;
 return new Map(Object.entries({
 'README.md':`# Quant Fund V2\n\n**PAPER TRADING / RESEARCH ONLY**\n\nAn open quantitative investment research project documenting the prospective performance of a systematic multi-strategy paper portfolio.\n\n## Current public record\n\nForward inception: ${f.forward_inception_date}, explicitly ${data.observations[0].observation_timing}. There are ${data.observations.length} observations in this dataset. Current NAV and returns are ${data.latest.nav===null?'unavailable because authoritative valuations are absent':'shown in the public data'}. No artificial performance history is constructed.\n\nFrozen strategies: ${f.strategy_ids.join(', ')}. Their roles and hypotheses are in data/strategies/. S122 retains its documented validation concern. Frozen rules do not establish prospective profitability.\n\n## Methodology\n\n${data.methodology.pipeline.join(' → ')}. Historical research and prospective paper evidence remain distinct. This repository contains only the published forward paper series, never a backtest splice.\n\n## Repository\n\n- data/: published JSON, CSV, dated observations, strategies, methodology, schema and manifest.\n- docs/: methodology, performance, transparency and architecture notes.\n- website/: self-contained static Next.js website source and a validated public-data copy.\n- manifest.json: repository file checksums. The data/manifest.json independently binds the emitted dataset.\n\n## Reproducibility\n\nPublication hashes fingerprint individual observations. The public manifest binds emitted files. The website validates schema and checksums before building; it neither calculates competing performance statistics nor connects to production systems.\n\nTo build: use Node.js 22+, enter website/, run npm ci, npm test and npm run build. The out/ directory is a portable static website. The .github/workflows/pages.yml workflow builds and deploys only this sanitized source to GitHub Pages after approved main-branch changes. GitHub Pages determines the public origin and base path; no private machine serves the website. No private version history is included.\n\n## Disclosure\n\n${f.disclaimer}\n\n${licensingReadme}\n## Contributions\n\nIssues and website contributions do not authorize or enter the private production trading system. This repository is not the production trading engine.\n`,
 'DISCLAIMER.md':`# Research disclosure\n\n${f.disclaimer}\n`,
 'docs/methodology.md':`# Methodology\n\n${data.methodology.pipeline.join(' → ')}\n\n${data.methodology.attribution}\n\n${data.methodology.scientific_limitations.join('\n\n')}\n`,
 'docs/performance.md':`# Forward paper performance\n\n${data.methodology.accounting}\n\n${data.methodology.costs}\n\nAnnualized metrics require ${data.methodology.minimum_return_observations} return observations under the publication policy. Unavailable values are null in JSON and empty cells in CSV. The website displays published values and does not estimate missing valuations.\n\n${data.methodology.benchmarks}\n`,
 'docs/transparency.md':`# Transparency\n\n${data.methodology.inception}\n\n${data.methodology.position_delay_policy}\n\nNormal daily observations are append-only. Controlled corrections retain original/corrected hashes, timestamps and a public reason. The website visibly labels corrected observations. Missing data remains unavailable. Publication fingerprints are hashes, not identity signatures.\n\n${data.methodology.data_rights}\n\nSee LICENSE.md for the approved split licenses. No external publication is performed by this repository generator.\n`,
 'docs/architecture.md':'# Public platform architecture\n\nPublished public artifacts → validation → static website.\n\nThe application opens only its own public/data directory. There is no runtime backend, database, broker connection, trading control or publication-generation endpoint. Source-only exports begin in an empty staging directory and use explicit filename allowlists. No private version history is included.\n\nFuture daily publication must copy only newly emitted public artifacts, validate their manifest/privacy, build the static website and deploy separately. Trading remains independent of website and deployment availability.\n\nThe approved deployment builds this public repository with GitHub Actions and deploys only website/out to GitHub Pages. It requires no private credentials, backend or paid hosting. The public Pages origin and base path come from actions/configure-pages; a future custom domain can use the same workflow after separate authorization. Public repository contributions never enter the private trading engine automatically. Internet publication remains separate from fund operation.\n',
 }));
}
export function candidateFiles() {
 const root=process.cwd(),data=loadDataset(),result=new Map();
 for(const name of SOURCE_FILES){
  const p=path.join(root,name);
  if(fs.lstatSync(p).isSymbolicLink())throw new Error('SYMLINKED_EXPORT_SOURCE');
  if(name==='package.json'){
   const original=JSON.parse(fs.readFileSync(p,'utf8'));
   const publicPackage={name:original.name,version:original.version,private:true,description:original.description,license:original.license,engines:original.engines,
    scripts:{...original.scripts,test:'node --test tests/public.test.mjs'},dependencies:original.dependencies,devDependencies:original.devDependencies};
   delete publicPackage.scripts['test:built'];
   result.set('website/package.json',stable(publicPackage));
  }else result.set(`website/${name}`,fs.readFileSync(p));
 }
 // The public candidate's tests exercise only public data; adversarial private-boundary fixtures are local QA only.
 for(const [name,bytes] of readPublicFiles()){result.set(`data/${name}`,bytes);result.set(`website/public/data/${name}`,bytes);}
 result.set('.github/workflows/pages.yml',fs.readFileSync('deployment/pages.yml'));
 for(const [name,text] of publicDocuments(data))result.set(name,Buffer.from(text));
 for(const [name,bytes] of licenseFiles()){result.set(name,bytes);result.set(`website/licensing/${name}`,bytes);}
 result.set('rights-audit.json',stable(rightsAudit(result)));
 for(const [name,bytes] of result)scanBytes(bytes,name);
 result.set('manifest.json',stable({version:'QUANT_FUND_PUBLIC_PLATFORM_V1',license_status:licenseStatus,
  publication_schema:data.manifest.schema_version,latest_publication_hash:data.latest.publication_hash,
  files:Object.fromEntries([...result].sort(([a],[b])=>a.localeCompare(b)).map(([n,b])=>[n,sha(b)]))}));
 return result;
}
export function directoryFiles(root) {
 const result=new Map();
 function visit(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
  const p=path.join(directory,entry.name);
  if(entry.isSymbolicLink())throw new Error('SYMLINKED_PUBLIC_REPOSITORY');
  if(entry.isDirectory())visit(p);else if(entry.isFile())result.set(path.relative(root,p).split(path.sep).join('/'),fs.readFileSync(p));
 }}visit(root);return result;
}
export function verifyRepository(directory=path.resolve('exports/quant-fund-v2')) {
 const actual=directoryFiles(directory),expected=candidateFiles();
 if(actual.size!==expected.size)throw new Error('PUBLIC_REPOSITORY_INVENTORY_MISMATCH');
 for(const [name,bytes] of expected)if(!actual.get(name)?.equals(bytes))throw new Error('PUBLIC_REPOSITORY_BYTES_MISMATCH:'+name);
 for(const [name,bytes] of actual){if(name.split('/').includes('.git') || name.endsWith('.env') || name.includes('node_modules/'))throw new Error('PRIVATE_REPOSITORY_CONTENT');scanBytes(bytes,name);}
 return {status:'PASS',files:actual.size,privacy:'PASS',deterministic:'BYTE_IDENTICAL',license:licenseStatus};
}
export function exportRepository() {
 const destination=path.resolve('exports/quant-fund-v2'),parent=path.dirname(destination);
 if(fs.existsSync(parent)&&fs.lstatSync(parent).isSymbolicLink())throw new Error('UNSAFE_EXPORT_DESTINATION');
 fs.mkdirSync(parent,{recursive:true});const staging=fs.mkdtempSync(path.join(parent,'.candidate-'));
 try{
  const files=candidateFiles();
  for(const [name,bytes] of files){const target=path.join(staging,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
  verifyRepository(staging);
  if(fs.existsSync(destination)){if(fs.lstatSync(destination).isSymbolicLink())throw new Error('UNSAFE_EXPORT_DESTINATION');fs.rmSync(destination,{recursive:true});}
  fs.renameSync(staging,destination);return verifyRepository(destination);
 }finally{if(fs.existsSync(staging))fs.rmSync(staging,{recursive:true});}
}
