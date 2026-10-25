import {publicHref} from '../lib/deployment.mjs';
import type { Metadata } from 'next';
import './globals.css';
const description='An open quantitative investment research project documenting the prospective performance of a systematic multi-strategy paper portfolio.';
export const metadata:Metadata={title:{default:'Quant Fund V2 — Systematic Investment Research',template:'%s — Quant Fund V2'},description,
 icons:{icon:publicHref('/favicon.svg')},openGraph:{title:'Quant Fund V2 — Systematic Investment Research',description,type:'website',siteName:'Quant Fund V2'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><head><meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'"/></head><body>{children}</body></html>;}
