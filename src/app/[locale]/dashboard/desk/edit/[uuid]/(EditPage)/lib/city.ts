import { City } from '@/shared/types/Geo.interface'

export const formatCityLabel = (city: City | null) => {
	if (!city) return undefined
	return [city.name, city.country].filter(Boolean).join(', ')
}

export const createCityFromValues = (name?: string | null, country?: string | null): City | null => {
	if (!name) return null
	return { name, country: country ?? '', country_code: '' }
}
