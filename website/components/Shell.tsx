import type {ReactNode} from 'react';
import type {Dataset} from '../lib/types';
import {day} from '../lib/format.mjs';
const groups=[{name:'The record',links:[['/','Overview','◫'],['/performance','Performance','↗'],['/portfolio','Portfolio','▤'],['/strategies','Strategies','⊞']]},{name:'The framework',links:[['/methodology','Methodology','⤓'],['/transparency','Transparency','◎'],['/about','About the project','⌁'],['/github','GitHub','↗']]}];
function Navigation({current}:{current:string}) {return <nav aria-label="Main navigation">{groups.map(g=><div className="nav-group" key={g.name}><p>{g.name}</p>{g.links.map(([href,label,icon])=><a key={href} href={href==='/'?'/':href+'/'} aria-current={(href==='/'?current==='/':current.startsWith(href))?'page':undefined}><span aria-hidden="true">{icon}</span>{label}</a>)}</div>)}</nav>;}
export function Shell({data,path,children}:{data:Dataset;path:string;children:ReactNode}) {return <>
  <a className="skip-link" href="#main">Skip to content</a>
  <aside className="sidebar"><a className="brand" href="/" aria-label="Quant Fund V2 home"><span className="brand-mark" aria-hidden="true"><i/><i/><i/><i/></span><span>QUANT FUND<span>V2 / RESEARCH</span></span></a><Navigation current={path}/><div className="sidebar-foot"><span className="status-dot"/>Rules frozen. Record open.<small>Independent investment research<br/>Paper portfolio · GBP</small></div></aside>
  <div className="workspace"><header className="topbar"><a href="/" className="mobile-brand">QUANT FUND V2</a><div className="breadcrumb">RESEARCH PLATFORM<span>/</span><span>{path==='/'?'OVERVIEW':path.split('/').filter(Boolean).at(-1)?.replaceAll('-',' ').toUpperCase()}</span></div><div className="top-status"><span className="status-dot"/>DAILY FORWARD RECORD</div><details className="mobile-menu"><summary>Menu</summary><Navigation current={path}/></details></header>
  <main id="main" tabIndex={-1}>{children}</main>
  <footer><div><strong>QUANT FUND V2</strong><p>Paper trading / research only. Simulated capital; no client assets.<br/>No investment advice. Paper results may differ from live results.</p></div><div><a href="/about/">Full disclosure</a><span>Latest observation: {day(data.latest.date)}</span><span>Appearance follows your system</span></div></footer></div>
 </>;}
