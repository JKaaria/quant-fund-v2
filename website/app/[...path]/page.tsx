import {notFound} from 'next/navigation';
import {loadDataset} from '../../lib/publication.mjs';
import {allRoutes,titleFor} from '../../lib/routes.mjs';
import type {Dataset} from '../../lib/types';
import {PlatformPage} from '../../components/Pages';
export const dynamicParams=false;
export function generateStaticParams(){return allRoutes(loadDataset()).filter(route=>route!=='/').map(route=>({path:route.slice(1).split('/')}));}
export async function generateMetadata({params}:{params:Promise<{path:string[]}>}){const p=await params;return {title:titleFor('/'+p.path.join('/'),loadDataset())};}
export default async function Page({params}:{params:Promise<{path:string[]}>}) {const p=await params;const route='/'+p.path.join('/');const data=loadDataset() as Dataset;if(!allRoutes(data).includes(route))notFound();return <PlatformPage data={data} path={route}/>;}
