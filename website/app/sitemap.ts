import type { MetadataRoute } from 'next';
import {siteOrigin} from '../lib/deployment.mjs';
import {loadDataset} from '../lib/publication.mjs';
import {allRoutes} from '../lib/routes.mjs';
export const dynamic='force-static';
export default function sitemap(): MetadataRoute.Sitemap {
 const origin=siteOrigin();
 return origin?allRoutes(loadDataset()).map((route:string)=>({url:origin+(route==='/'?'/':route+'/')})):[];
}
