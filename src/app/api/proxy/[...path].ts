import type { NextApiRequest, NextApiResponse } from 'next'

const BACKEND_URL = process.env.SERVER_URL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const pathArray = Array.isArray(req.query.path) ? req.query.path : [req.query.path]
		const path = pathArray.filter(Boolean).join('/')
		const targetUrl = `${BACKEND_URL}/${path}`

		const headers: Record<string, string> = {}
		for (const [key, value] of Object.entries(req.headers)) {
			if (typeof value === 'string') headers[key] = value
		}

		delete headers.host

		const response = await fetch(targetUrl, {
			method: req.method,
			headers,
			body:
				req.method && ['GET', 'HEAD'].includes(req.method)
					? undefined
					: req.body && typeof req.body === 'object'
					? JSON.stringify(req.body)
					: req.body,
		})

		res.status(response.status)
		response.headers.forEach((value, key) => {
			res.setHeader(key, value)
		})

		const buffer = await response.arrayBuffer()
		res.send(Buffer.from(buffer))
	} catch (error) {
		console.error('Proxy error:', error)
		res.status(500).json({ detail: 'Proxy request failed' })
	}
}
