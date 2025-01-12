import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**'
			}
		]
	},
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb'
        }
    }
}

export default nextConfig
