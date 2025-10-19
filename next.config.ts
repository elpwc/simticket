import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
	/* config options here */
	//output: 'export',
	images: { unoptimized: true },
	//basePath: '/simticket',
	//assetPrefix: '/simticket',
	eslint: {
		ignoreDuringBuilds: true,
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
