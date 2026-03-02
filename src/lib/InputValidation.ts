import { ChangeEvent } from 'react'

const DECIMAL_SEPARATOR_REGEX = /,/g
const NON_DIGIT_REGEX = /\D/g
const SPACE_REGEX = /\s+/g
const PRICE_MAX_DIGITS = 12
const PRICE_DECIMAL_TAIL_REGEX = /[.,]\d{1,2}$/

const shouldAllowNumericInput = (value: string, regex: RegExp) => value === '' || regex.test(value)

export const handleNumericInput = (event: ChangeEvent<HTMLInputElement>, regex: RegExp, onChange: (value: string) => void) => {
	const normalizedValue = event.target.value.replace(DECIMAL_SEPARATOR_REGEX, '.')

	if (shouldAllowNumericInput(normalizedValue, regex)) {
		onChange(normalizedValue)
	}
}

export const formatPriceInputValue = (value: string) => {
	const integerPart = value.trim().replace(PRICE_DECIMAL_TAIL_REGEX, '')
	const digitsOnly = integerPart.replace(NON_DIGIT_REGEX, '').slice(0, PRICE_MAX_DIGITS)
	if (!digitsOnly) return ''
	return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const normalizePriceValueForPayload = (value?: string | null) => {
	if (!value) return null
	const integerPart = value.trim().replace(PRICE_DECIMAL_TAIL_REGEX, '')
	const digitsOnly = integerPart.replace(SPACE_REGEX, '').replace(NON_DIGIT_REGEX, '')
	return digitsOnly || null
}

export const handlePriceInput = (event: ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
	onChange(formatPriceInputValue(event.target.value))
}
