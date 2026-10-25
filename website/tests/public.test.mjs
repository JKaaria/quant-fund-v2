import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadDataset,IDS,parsePerformance} from '../lib/publication.mjs';
import {valuation,returnValue,number,metricNote} from '../lib/format.mjs';
import {allRoutes} from '../lib/routes.mjs';
const data=loadDataset();
test('The public dataset validates before rendering',()=>{assert.equal(data.manifest.schema_version,'QUANT_FUND_PUBLICATION_LAYER_V1');assert.equal(data.fund.paper_trading,true);});
test('Exactly seven frozen strategy pages exist',()=>{assert.deepEqual(data.strategies.map(s=>s.strategy_id),IDS);for(const id of IDS)assert.ok(allRoutes(data).includes(`/strategies/${id}`));assert.ok(!allRoutes(data).includes('/strategies/S999'));});
test('Null financial values remain unavailable',()=>{assert.equal(valuation(null),'Pending authoritative valuation');assert.equal(returnValue(null),'Pending authoritative valuation');assert.equal(number(null),'Unavailable');});
test('Actual published zero is displayed as zero',()=>{assert.equal(number(0,'percent'),'0.00%');});
test('CSV distinguishes an unavailable value from zero',()=>{const header='date,observation_status,nav,nav_status,daily_pnl,daily_return,cumulative_return,publication_hash\n';const rows=parsePerformance(header+'2026-01-01,NO_ACTIONABLE_EXPOSURE,,UNAVAILABLE_NOT_MARKED,,0,,example\n');assert.equal(rows[0].nav,null);assert.equal(rows[0].daily_return,0);});
test('No-action observations remain present',()=>{assert.ok(data.observations.length>0);for(const o of data.observations)assert.ok(allRoutes(data).includes(`/performance/${o.date}`));});

test('An unavailable individual metric is not labelled available by overall status',()=>{assert.equal(metricNote(null,'AVAILABLE'),'Unavailable in the public record');assert.equal(metricNote(null,'INSUFFICIENT_FORWARD_HISTORY'),'Insufficient forward history');assert.equal(metricNote(0,'AVAILABLE'),'Published statistic');});

import {siteOrigin,repositoryUrl} from '../lib/deployment.mjs';
test('Public metadata never invents an owner or deployment address',()=>{assert.equal(siteOrigin({}),null);assert.equal(repositoryUrl({}),null);assert.equal(siteOrigin({PUBLIC_SITE_ORIGIN:'https://example.org'}),'https://example.org');});
test('Public metadata refuses credentials, local origins and unintended repository destinations',()=>{for(const v of ['http://example.org','https://localhost','https://user:pass@example.org','https://example.org/private'])assert.throws(()=>siteOrigin({PUBLIC_SITE_ORIGIN:v}));for(const v of ['https://example.org/owner/quant-fund-v2','https://github.com/owner/private-engine','https://user:pass@github.com/owner/quant-fund-v2'])assert.throws(()=>repositoryUrl({PUBLIC_REPOSITORY_URL:v}));});

import {basePath,publicHref,siteBaseUrl} from '../lib/deployment.mjs';
test('Project Pages links and public data use the configured mount path',()=>{const env={PUBLIC_BASE_PATH:'/quant-fund-v2',PUBLIC_SITE_ORIGIN:'https://example.org'};assert.equal(publicHref('/performance/',env),'/quant-fund-v2/performance/');assert.equal(publicHref('/data/latest.json',env),'/quant-fund-v2/data/latest.json');assert.equal(publicHref('#main',env),'#main');assert.equal(publicHref('https://github.com/example/quant-fund-v2',env),'https://github.com/example/quant-fund-v2');assert.equal(siteBaseUrl(env),'https://example.org/quant-fund-v2');});
test('Root hosting remains compatible with a future separately approved custom domain',()=>{const env={PUBLIC_BASE_PATH:'',PUBLIC_SITE_ORIGIN:'https://example.org'};assert.equal(basePath(env),'');assert.equal(publicHref('/strategies/S001/',env),'/strategies/S001/');assert.equal(siteBaseUrl(env),'https://example.org');assert.equal(basePath({PUBLIC_BASE_PATH:'/'}),'');});
test('Unsafe mount paths and protocol-relative links fail before export',()=>{for(const value of ['../private','/../private','//example.org','/data?value=x','/encoded%2fpath','/trailing/'])assert.throws(()=>basePath({PUBLIC_BASE_PATH:value}));for(const value of ['//example.org','../data','file:example'])assert.throws(()=>publicHref(value,{}));});

test('A new approved observation date automatically adds its daily static route',()=>{const fixture={...data,observations:[...data.observations,{date:'2030-01-02'}]};assert.ok(allRoutes(fixture).includes('/performance/2030-01-02'));assert.equal(allRoutes(fixture).length,allRoutes(data).length+1);assert.ok(!allRoutes(data).includes('/performance/2030-01-02'));});
