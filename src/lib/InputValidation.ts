import { ChangeEvent } from 'react'

const DECIMAL_SEPARATOR_REGEX = /,/g

const shouldAllowNumericInput = (value: string, regex: RegExp) => value === '' || regex.test(value)

export const handleNumericInput = (event: ChangeEvent<HTMLInputElement>, regex: RegExp, onChange: (value: string) => void) => {
	const normalizedValue = event.target.value.replace(DECIMAL_SEPARATOR_REGEX, '.')

	if (shouldAllowNumericInput(normalizedValue, regex)) {
		onChange(normalizedValue)
	}
}
