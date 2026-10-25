export const fixedRoutes=['/','/performance','/performance/daily','/portfolio','/portfolio/exposure','/portfolio/regime','/strategies',
 '/methodology','/methodology/research','/methodology/regime','/methodology/allocation','/methodology/risk','/methodology/execution','/methodology/accounting','/transparency','/about','/github'];
export const allRoutes=data=>[...fixedRoutes,...data.observations.map(o=>`/performance/${o.date}`),...data.strategies.map(s=>`/strategies/${s.strategy_id}`)];
export function titleFor(route,data) {
 const strategy=data.strategies.find(s=>route===`/strategies/${s.strategy_id}`);
 if(strategy)return `${strategy.strategy_id} · ${strategy.strategy_name}`;
 if(/^\/performance\/\d/.test(route))return `Daily report · ${route.split('/').at(-1)}`;
 const titles={'/':'Systematic Investment Research','/performance':'Forward performance','/performance/daily':'Daily observations','/portfolio':'Portfolio','/portfolio/exposure':'Portfolio exposure','/portfolio/regime':'Regime assessment','/strategies':'Frozen strategy library','/methodology':'Methodology','/transparency':'Research & transparency','/about':'About the project','/github':'Public repository'};
 return titles[route] || route.split('/').at(-1).replace(/^./,c=>c.toUpperCase());
}
