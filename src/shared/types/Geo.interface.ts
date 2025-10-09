export interface City {
	name: string
	country: string
	country_code: string
}

export interface CitySuggestResponse {
	results: City[]
}

export interface Country {
	code: string
	name: string
}

export interface CountrySuggestResponse {
	results: Country[]
}
