export const clampAxlesValue = (value: string, max = 10) => {
	const numericValue = Number(value)
	if (value !== '' && Number.isFinite(numericValue) && numericValue > max) {
		return String(max)
	}

	return value
}
