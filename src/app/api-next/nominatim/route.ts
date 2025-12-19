import axios from 'axios'
import { NextResponse } from 'next/server'

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'

export async function GET(request: Request) {
	const url = new URL(request.url)
	const params = url.searchParams

	try {
		const { data, status } = await axios.get(NOMINATIM_ENDPOINT, {
			headers: {
				Accept: 'application/json',
				'User-Agent': 'kad-one.com',
			},
			params: Object.fromEntries(params.entries()),
		})

		return NextResponse.json(data, { status })
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(error.response?.data ?? { error: 'Ошибка при запросе координат' }, {
				status: error.response?.status ?? 500,
			})
		}

		return NextResponse.json({ error: 'Ошибка при запросе координат' }, { status: 500 })
	}
}
