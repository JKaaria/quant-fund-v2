import {number,day} from '../lib/format.mjs';
export type Point={date:string;value:number|null};
export function SeriesChart({title,points,format='number',empty='No published series is available.',compact=false}:{title:string;points:Point[];format?:string;empty?:string;compact?:boolean}) {
  const valid=points.filter(p=>p.value!==null);
  if(!valid.length) return <figure className={`chart empty-chart ${compact?'compact':''}`} aria-label={title}>
    <div className="chart-grid" aria-hidden="true"><i/><i/><i/><i/></div>
    <figcaption><svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="M5 5v24h24M11 21v-6m6 6V9m6 12v-9" stroke="currentColor" strokeWidth="1.5"/><circle cx="27" cy="7" r="4" fill="var(--surface)" stroke="currentColor"/></svg><strong>{empty}</strong><span>No estimates. No reconstructed history.</span></figcaption>
  </figure>;
  const values=valid.map(p=>p.value as number),min=Math.min(...values),max=Math.max(...values);
  const spread=max-min || Math.max(Math.abs(max)*.02,1); const low=min-spread*.15, high=max+spread*.15;
  const x=(index:number)=>62+index/Math.max(points.length-1,1)*680;
  const y=(value:number)=>230-(value-low)/(high-low)*195;
  const segments:string[]=[];let current:string[]=[];
  points.forEach((p,index)=>{if(p.value===null){if(current.length)segments.push(current.join(' '));current=[];}else current.push(`${x(index)},${y(p.value)}`);});
  if(current.length)segments.push(current.join(' '));
  return <figure className="chart populated-chart"><svg viewBox="0 0 800 275" role="img" aria-label={`${title}. ${valid.length} published observations.`}>
    {[0,.5,1].map(t=><g key={t}><line x1="62" x2="750" y1={35+t*195} y2={35+t*195} stroke="var(--line)"/><text x="4" y={39+t*195} fill="var(--muted)" fontSize="11">{number(high-(high-low)*t,format)}</text></g>)}
    {segments.map((line,i)=><polyline key={i} points={line} fill="none" stroke="var(--accent)" strokeWidth="2.2"/>)}
    {points.map((p,i)=>p.value===null?null:<circle key={p.date} cx={x(i)} cy={y(p.value)} r="3.5" fill="var(--accent)"><title>{`${day(p.date)}: ${number(p.value,format)}`}</title></circle>)}
    <text x="62" y="262" fill="var(--muted)" fontSize="11">{day(points[0].date)}</text><text x="750" y="262" textAnchor="end" fill="var(--muted)" fontSize="11">{day(points.at(-1)!.date)}</text>
  </svg><details><summary>View chart data</summary><div className="table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table"><table><caption>{title}: published values</caption><thead><tr><th>Date</th><th>Value</th></tr></thead><tbody>{points.map(p=><tr key={p.date}><th scope="row">{day(p.date)}</th><td>{number(p.value,format)}</td></tr>)}</tbody></table></div></details></figure>;
}
export function ValueBars({title,values}:{title:string;values:{label:string;value:number|null}[]}) {
  const published=values.filter(v=>v.value!==null);
  if(!published.length)return <SeriesChart title={title} points={[]} compact empty="Attribution is not yet available."/>;
  const scale=Math.max(...published.map(v=>Math.abs(v.value!)),1);
  return <figure className="bars"><figcaption className="sr-only">{title}</figcaption>{values.map(v=><div className="bar-row" key={v.label}><span>{v.label}</span><span className="bar-track"><span style={{width:`${v.value===null?0:Math.abs(v.value)/scale*100}%`}}/></span><strong>{number(v.value,'money')}</strong></div>)}</figure>;
}
