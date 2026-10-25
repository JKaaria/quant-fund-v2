/** Owner-approved scopes; holder finalization is a separate release gate. */
import fs from 'node:fs';
import {sha} from './publication.mjs';
export const copyrightHolder='KACAP Holdings LTD';
export const licenseStatus=copyrightHolder?'APPROVED':'APPROVED_SCOPES_HOLDER_PENDING';
export const LICENSE_FILES=['LICENSE.md','NOTICE','THIRD_PARTY_NOTICES.txt','LICENSES/Apache-2.0.txt','LICENSES/CC-BY-NC-SA-4.0.txt','LICENSES/CC-BY-NC-4.0.txt'];
export const licensingReadme=`## Licensing\n\n- Software: Apache License 2.0.\n- Research/methodology/documentation: CC BY-NC-SA 4.0.\n- Public performance/observation dataset: CC BY-NC 4.0.\n- Third-party material retains its respective rights.\n- Quant Fund V2 branding/trademarks are not licensed except as necessary for attribution.\n\nSee LICENSE.md and NOTICE for precise scopes and attribution. Commercial licensing of original research/data may be separately available from the rights holder. Legal exceptions, including fair dealing, remain unaffected.\n`;
export function licenseFiles(){return new Map(LICENSE_FILES.map(n=>[n,fs.readFileSync(`licensing/${n}`)]));}
export function classify(name){
 if(name==='manifest.json'||name==='rights-audit.json'||name.endsWith('/manifest.json')||name.endsWith('package-lock.json'))return ['GENERATED','Underlying rights retained'];
 if(name.endsWith('LICENSE.md')||name.endsWith('NOTICE'))return ['RESEARCH_CONTENT','Licensing and attribution notice'];
 if(name.includes('/licensing/')||name.startsWith('LICENSES/')||name.endsWith('THIRD_PARTY_NOTICES.txt'))return ['THIRD_PARTY','Upstream canonical terms/notices; not relicensed'];
 if(name.endsWith('favicon.svg'))return ['SOFTWARE','Branding asset excluded from software grant'];
 if(name.startsWith('data/')||name.includes('/public/data/')){
  if(name.includes('/methodology/')||name.includes('/strategies/'))return ['RESEARCH_CONTENT','CC-BY-NC-SA-4.0'];
  if(name.includes('/schema/'))return ['SOFTWARE','Apache-2.0'];
  return ['PUBLIC_DATA','CC-BY-NC-4.0'];
 }
 if(name.endsWith('.md'))return ['RESEARCH_CONTENT','CC-BY-NC-SA-4.0'];
 if(/\.(?:mjs|tsx|ts|css|json|yml|yaml)$/.test(name)||name.endsWith('.gitignore')||name.endsWith('.nojekyll'))return ['SOFTWARE','Apache-2.0; embedded original research prose retains its content license'];
 return ['UNKNOWN','Exclude until reviewed'];
}
export function rightsAudit(files){
 const rows=[...files].sort(([a],[b])=>a.localeCompare(b)).map(([name,bytes])=>{const[category,rights]=classify(name);return {path:name,category,rights,sha256:sha(bytes)};});
 if(rows.some(r=>r.category==='UNKNOWN'))throw new Error('UNREVIEWED_PUBLIC_RIGHTS');
 return {version:'QUANT_FUND_PUBLIC_LAUNCH_V1',copyright_holder:copyrightHolder,license_status:licenseStatus,
  review:'Original software, original explanatory research and fund-derived observations only. No raw market/exchange/broker datasets, third-party images, external fonts or icon packs. Dependencies are registry references; upstream notices retained. Branding reserved.',
  third_party:'No third-party source or binaries vendored. License texts/notices retain upstream rights. Lock metadata does not relicense dependencies.',
  excluded:['Private production source/history','Raw external market data','Installed dependencies','Build cache and compiled output','Local adversarial QA fixtures'],
  coverage:'Every exported file except this audit and the enclosing manifest; those are generated checksum metadata.',files:rows};
}
