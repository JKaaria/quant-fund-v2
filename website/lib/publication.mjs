/** Build-time consumer. The only filesystem it opens is this package's public/data. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import Ajv2020 from 'ajv/dist/2020.js';
import { scanBytes } from './privacy.mjs';

export const IDS = Object.freeze(['S001','S031','S051','S076','S111','S122','S128']);
export const VERSION = 'QUANT_FUND_PUBLICATION_LAYER_V1';
export const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const baseFiles = ['manifest.json','latest.json','fund.json','metrics.json','benchmark.json','performance.csv',
  'methodology/methodology.json','schema/publication_v1.schema.json',...IDS.map(id=>`strategies/${id}.json`)];
export function allowedArtifact(name) {
  return baseFiles.includes(name) || /^(?:observations\/\d{4}-\d{2}-\d{2}\.json|(?:corrections|revisions)\/\d{4}-\d{2}-\d{2}\/[a-f0-9]{64}\.json)$/.test(name);
}
export function readPublicFiles() {
  const root = path.resolve(process.cwd(), 'public/data');
  const result = new Map();
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error('SYMLINKED_PUBLIC_INPUT');
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile()) {
        const name = path.relative(root,target).split(path.sep).join('/');
        if (!allowedArtifact(name)) throw new Error('UNAPPROVED_PUBLIC_INPUT');
        result.set(name, fs.readFileSync(target));
      }
    }
  }
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error('SYMLINKED_PUBLIC_INPUT');
  visit(root); return result;
}
export function parsePerformance(csv) {
  const rows = csv.trimEnd().split('\n').map(line=>line.replace(/\r$/,'').split(','));
  const expected = ['date','observation_status','nav','nav_status','daily_pnl','daily_return','cumulative_return','publication_hash'];
  if (JSON.stringify(rows[0])!==JSON.stringify(expected)) throw new Error('INVALID_PERFORMANCE_HEADER');
  const seen=new Set();
  return rows.slice(1).map(columns=>{
    if (columns.length!==expected.length || seen.has(columns[0])) throw new Error('INVALID_PERFORMANCE_ROW');
    seen.add(columns[0]);
    const row=Object.fromEntries(expected.map((name,index)=>[name, columns[index]]));
    for (const field of ['nav','daily_pnl','daily_return','cumulative_return']) {
      if (row[field]==='') row[field]=null;
      else {
        if (!/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(row[field])) throw new Error('INVALID_FINANCIAL_NUMBER');
        row[field]=Number(row[field]);
        if (!Number.isFinite(row[field])) throw new Error('NONFINITE_FINANCIAL_NUMBER');
      }
    }
    return row;
  });
}
export function decodeDataset(files) {
  for (const name of baseFiles) if (!files.has(name)) throw new Error(`MISSING_PUBLIC_ARTIFACT:${name}`);
  for (const [name,bytes] of files) { if (!allowedArtifact(name)) throw new Error('UNAPPROVED_PUBLIC_INPUT'); scanBytes(bytes,name); }
  const get = name=>JSON.parse(files.get(name).toString('utf8'));
  const manifest=get('manifest.json');
  const manifestFields=['schema_version','fund_version','strategy_set_version','forward_inception_date','latest_observation_date','observation_count','latest_publication_hash','files'];
  if (JSON.stringify(Object.keys(manifest).sort())!==JSON.stringify(manifestFields.sort()) || manifest.schema_version!==VERSION) throw new Error('INVALID_PUBLIC_MANIFEST');
  const listed=Object.keys(manifest.files).sort();
  if (JSON.stringify(listed)!==JSON.stringify([...files.keys()].filter(n=>n!=='manifest.json').sort())) throw new Error('PUBLIC_INVENTORY_MISMATCH');
  for (const name of listed) if (sha(files.get(name))!==manifest.files[name]) throw new Error('PUBLIC_CHECKSUM_MISMATCH');
  const schema=get('schema/publication_v1.schema.json');
  const ajv=new Ajv2020({ strict:false, allErrors:true });
  const check=(value,definition)=>{
    const validator=ajv.compile(definition);
    if(!validator(value)) throw new Error('PUBLIC_SCHEMA_VIOLATION:'+JSON.stringify(validator.errors));
    return value;
  };
  const observations=listed.filter(n=>n.startsWith('observations/')).map(name=>{
    const value=check(get(name),schema);
    if(name!==`observations/${value.date}.json` || value.schema_version!==VERSION) throw new Error('OBSERVATION_IDENTITY_MISMATCH');
    return value;
  }).sort((a,b)=>a.date.localeCompare(b.date));
  if(!observations.length || new Set(observations.map(r=>r.date)).size!==observations.length) throw new Error('INVALID_OBSERVATION_DATES');
  const latest=check(get('latest.json'),schema);
  if(JSON.stringify(latest)!==JSON.stringify(observations.at(-1)) || manifest.observation_count!==observations.length ||
    manifest.latest_publication_hash!==latest.publication_hash || manifest.latest_observation_date!==latest.date ||
    manifest.forward_inception_date!==observations[0].date) throw new Error('PUBLIC_RECORD_MISMATCH');
  const performance=parsePerformance(files.get('performance.csv').toString('utf8'));
  if(performance.length!==observations.length) throw new Error('PERFORMANCE_SERIES_MISMATCH');
  performance.forEach((row,i)=>{for(const field of Object.keys(row)) if(row[field]!==observations[i][field]) throw new Error('PERFORMANCE_SERIES_MISMATCH');});
  const fund=check(get('fund.json'),schema.$defs.fund);
  if(JSON.stringify(fund.strategy_ids)!==JSON.stringify(IDS) || fund.forward_inception_date!==manifest.forward_inception_date) throw new Error('FROZEN_FUND_MISMATCH');
  const strategies=IDS.map(id=>{
    const value=check(get(`strategies/${id}.json`),schema.$defs.strategy);
    if(value.strategy_id!==id) throw new Error('STRATEGY_IDENTITY_MISMATCH');return value;
  });
  const metrics=check(get('metrics.json'),schema.$defs.metrics);
  const methodology=check(get('methodology/methodology.json'),schema.$defs.methodology);
  const benchmark=check(get('benchmark.json'),schema.$defs.benchmark);
  const corrections=listed.filter(n=>n.startsWith('corrections/')).map(name=>{
    const value=get(name);
    const keys=['date','original_hash','corrected_hash','correction_timestamp','reason','source_evidence'];
    if(JSON.stringify(Object.keys(value).sort())!==JSON.stringify(keys.sort()) || !/^\d{4}-\d{2}-\d{2}$/.test(value.date) ||
      !['original_hash','corrected_hash','source_evidence'].every(k=>/^[a-f0-9]{64}$/.test(value[k])) || typeof value.reason!=='string' || !value.reason.trim() ||
      !Number.isFinite(Date.parse(value.correction_timestamp))) throw new Error('INVALID_PUBLIC_CORRECTION');
    const originalName=`revisions/${value.date}/${value.original_hash}.json`;
    if(!files.has(originalName)) throw new Error('MISSING_CORRECTION_ORIGINAL');
    const original=check(get(originalName),schema);
    if(original.publication_hash!==value.original_hash || original.date!==value.date) throw new Error('CORRECTION_ORIGINAL_MISMATCH');
    const candidates=[...observations,...listed.filter(n=>n.startsWith('revisions/')).map(n=>check(get(n),schema))];
    if(!candidates.some(r=>r.date===value.date && r.publication_hash===value.corrected_hash)) throw new Error('MISSING_CORRECTED_OBSERVATION');
    return value;
  });
  return {manifest,fund,latest,observations,performance,strategies,metrics,methodology,benchmark,corrections};
}
export const loadDataset=()=>decodeDataset(readPublicFiles());
