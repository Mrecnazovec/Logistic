import axios from 'axios'

import type { City } from '@/shared/types/Geo.interface'
import type { CityCoordinates, NominatimResult } from '@/shared/types/Nominatim.interface'

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'

class NominatimService {
	private client = axios.create({
		baseURL: NOMINATIM_ENDPOINT,
		headers: { Accept: 'application/json' },
	})

	async getCityCoordinates(city: City): Promise<CityCoordinates | null> {
		const query = `${city.name}, ${city.country}`
		const params: Record<string, string> = {
			format: 'json',
			limit: '1',
			q: query,
		}

		if (city.country_code) {
			params.countrycodes = city.country_code.toLowerCase()
		}

		try {
			const { data } = await this.client.get<NominatimResult[]>('', { params })
			const result = data?.[0]
			if (!result) return null

			const lat = Number(result.lat)
			const lon = Number(result.lon)
			if (Number.isNaN(lat) || Number.isNaN(lon)) return null

			return { lat, lon }
		} catch {
			return null
		}
	}
}

export const nominatimService = new NominatimService()
