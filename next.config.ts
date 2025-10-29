import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	cacheComponents: true,
	cacheLife: {
		frequent: {
			stale: 60,
			revalidate: 300,
			expire: 1800,
		},
		minutes: {
			stale: 300,
			revalidate: 600,
			expire: 3600,
		},
		hours: {
			stale: 300,
			revalidate: 3600,
			expire: 86400,
		},
	},
	env: {
		APP_ENV: process.env.APP_ENV,
		APP_URL: process.env.APP_URL,
		APP_DOMAIN: process.env.APP_DOMAIN,
		SERVER_URL: process.env.SERVER_URL,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
		],
	},
	async rewrites() {
		return [{ source: '/uploads/:path*', destination: `${process.env.SERVER_URL}/uploads/:path*` }]
	},
}

export default nextConfig
