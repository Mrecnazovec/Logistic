import { NextResponse } from 'next/server'

type RouteRequestBody = {
	from?: [number, number]
	to?: [number, number]
}

type YandexRouteStep = {
	polyline?: {
		points?: Array<[number, number]>
	}
	length?: number
}

type YandexRouteLeg = {
	steps?: YandexRouteStep[]
	length?: number
}

type YandexRouteResponse = {
	route?: {
		legs?: YandexRouteLeg[]
	}
}

export async function POST(request: Request) {
	const apiKey = process.env.YANDEX_ROUTING_API_KEY?.trim() || process.env.YANDEX_SECRET_KEY?.trim()
	if (!apiKey) {
		return NextResponse.json(
			{ error: 'Yandex routing key is missing. Set YANDEX_ROUTING_API_KEY (or fallback YANDEX_SECRET_KEY).' },
			{ status: 500 },
		)
	}

	let body: RouteRequestBody
	try {
		body = (await request.json()) as RouteRequestBody
	} catch {
		return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
	}

	const from = body.from
	const to = body.to
	if (!from || !to || from.length !== 2 || to.length !== 2) {
		return NextResponse.json({ error: 'Both "from" and "to" coordinates are required.' }, { status: 400 })
	}

	const waypoints = `${from[0]},${from[1]}|${to[0]},${to[1]}`
	const endpoint = new URL('https://api.routing.yandex.net/v2/route')
	endpoint.searchParams.set('apikey', apiKey)
	endpoint.searchParams.set('waypoints', waypoints)
	endpoint.searchParams.set('mode', 'driving')

	const response = await fetch(endpoint.toString(), {
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
		cache: 'no-store',
	})

	if (!response.ok) {
		const rawError = await response.text()
		return NextResponse.json(
			{
				error: 'Yandex route request failed.',
				status: response.status,
				details: rawError,
				hint:
					response.status === 401
						? 'Routing API key rejected. Verify YANDEX_ROUTING_API_KEY has access to Yandex Routing API.'
						: undefined,
			},
			{ status: response.status },
		)
	}

	const data = (await response.json()) as YandexRouteResponse
	const legs = data.route?.legs ?? []
	const points: Array<[number, number]> = []
	let distanceMeters = 0

	for (const leg of legs) {
		distanceMeters += Number(leg.length ?? 0)
		for (const step of leg.steps ?? []) {
			distanceMeters += Number(step.length ?? 0)
			for (const point of step.polyline?.points ?? []) {
				if (Array.isArray(point) && point.length === 2) {
					points.push([Number(point[0]), Number(point[1])])
				}
			}
		}
	}

	return NextResponse.json({
		points,
		distance_m: Number.isFinite(distanceMeters) ? distanceMeters : 0,
	})
}
