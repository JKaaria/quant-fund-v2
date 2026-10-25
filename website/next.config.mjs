import {basePath} from './lib/deployment.mjs';
/** This app produces files only. There are no runtime endpoints or server actions. */
export default {
  output: 'export',
  basePath: basePath(),
  trailingSlash: true,
  productionBrowserSourceMaps: false,
  images: { unoptimized: true },
  poweredByHeader: false,
  experimental: { cpus: 2 },
  generateBuildId: async () => 'quant-fund-public-platform-v1',
};
