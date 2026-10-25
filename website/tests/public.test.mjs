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
test('Public metadata never invents an owner or deployment address',()=>{assert.equal(siteOrigin({}),null);assert.equal(repositoryUrl({}),null);assert.equal(siteOrigin({VERCEL_PROJECT_PRODUCTION_URL:'example.vercel.app'}),'https://example.vercel.app');assert.equal(siteOrigin({PUBLIC_SITE_ORIGIN:'https://example.org'}),'https://example.org');});
test('Public metadata refuses credentials, local origins and unintended repository destinations',()=>{for(const v of ['http://example.org','https://localhost','https://user:pass@example.org','https://example.org/private'])assert.throws(()=>siteOrigin({PUBLIC_SITE_ORIGIN:v}));for(const v of ['https://example.org/owner/quant-fund-v2','https://github.com/owner/private-engine','https://user:pass@github.com/owner/quant-fund-v2'])assert.throws(()=>repositoryUrl({PUBLIC_REPOSITORY_URL:v}));});
