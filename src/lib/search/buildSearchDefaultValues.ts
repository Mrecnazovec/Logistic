'use client'

import { ISearch } from '@/shared/types/Search.interface'

const numericKeys = new Set([
	'id',
	'min_weight',
	'max_weight',
	'min_price',
	'max_price',
	'min_axles',
	'max_axles',
	'min_volume_m3',
	'max_volume_m3',
	'origin_lat',
	'origin_lng',
	'origin_radius_km',
	'dest_lat',
	'dest_lng',
	'dest_radius_km',
	'lat',
	'lng',
])

const booleanKeys = new Set(['has_offers'])

type SearchParamsLike = Pick<URLSearchParams, 'forEach'>

const parseParamValue = (key: string, value: string): ISearch[keyof ISearch] => {
	if (numericKeys.has(key)) {
		const parsedNumber = Number(value)
		return (Number.isNaN(parsedNumber) ? value : parsedNumber) as ISearch[keyof ISearch]
	}

	if (booleanKeys.has(key)) {
		return (value === 'true') as ISearch[keyof ISearch]
	}

	return value as ISearch[keyof ISearch]
}

export const buildSearchDefaultValues = (searchParams: SearchParamsLike): Partial<ISearch> => {
	const params: Partial<ISearch> = {}

	searchParams.forEach((value, key) => {
		const parsedValue = parseParamValue(key, value)
		;(params as Record<string, ISearch[keyof ISearch]>)[key] = parsedValue as ISearch[keyof ISearch]
	})

	return params
}
