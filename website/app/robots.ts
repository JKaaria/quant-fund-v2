import type { MetadataRoute } from 'next';
import {siteOrigin} from '../lib/deployment.mjs';
export const dynamic='force-static';
export default function robots(): MetadataRoute.Robots {
 const origin=siteOrigin();
 return {rules:{userAgent:'*',allow:'/'},...(origin?{sitemap:`${origin}/sitemap.xml`}:{})};
}
