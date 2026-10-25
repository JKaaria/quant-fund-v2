import type { MetadataRoute } from 'next';
import {siteBaseUrl} from '../lib/deployment.mjs';
export const dynamic='force-static';
export default function robots(): MetadataRoute.Robots {
 const origin=siteBaseUrl();
 return {rules:{userAgent:'*',allow:'/'},...(origin?{sitemap:`${origin}/sitemap.xml`}:{})};
}
