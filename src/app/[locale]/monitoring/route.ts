import type { NextRequest } from 'next/server'

const FORWARDED_HEADERS = [
	'content-type',
	'content-encoding',
	'sentry-trace',
	'baggage',
	'user-agent',
]

const buildForwardHeaders = (request: NextRequest) => {
	const headers = new Headers()

	for (const header of FORWARDED_HEADERS) {
		const value = request.headers.get(header)
		if (value) {
			headers.set(header, value)
		}
	}

	return headers
}

export async function POST(request: NextRequest) {
	const targetUrl = new URL(request.url)
	targetUrl.pathname = '/monitoring'

	const response = await fetch(targetUrl, {
		method: 'POST',
		headers: buildForwardHeaders(request),
		body: await request.arrayBuffer(),
		cache: 'no-store',
		redirect: 'manual',
	})

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
	})
}

export async function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: {
			allow: 'POST, OPTIONS',
		},
	})
}
