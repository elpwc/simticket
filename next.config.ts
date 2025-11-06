import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	output: 'export',
	images: { unoptimized: true },
	//basePath: '/simticket',
	//assetPrefix: '/simticket',
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
