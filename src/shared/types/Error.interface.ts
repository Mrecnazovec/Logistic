import type { components } from './api'

export type FieldError = string | string[]

export type IErrorResponse = components['schemas']['RefreshResponse'] & {
	load_date?: FieldError
	delivery_date?: FieldError
	[key: string]: unknown
}

