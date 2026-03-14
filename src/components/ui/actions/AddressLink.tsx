import { DEFAULT_PLACEHOLDER } from '@/lib/formatters'
import { cn } from '@/lib/utils'

type AddressLinkProps = {
	address?: string | null
	city?: string | null
	country?: string | null
	lat?: number | string | null
	lng?: number | string | null
	className?: string
	placeholder?: string
}

const YANDEX_MAPS_SEARCH_URL = 'https://yandex.ru/maps/?text='
const YANDEX_MAPS_POINT_URL = 'https://yandex.ru/maps/?z=16'

const trimValue = (value?: string | null) => {
	const normalized = value?.trim()
	return normalized ? normalized : null
}

const toFiniteNumber = (value?: number | string | null) => {
	if (typeof value === 'number') return Number.isFinite(value) ? value : null
	if (typeof value === 'string') {
		const parsed = Number(value)
		return Number.isFinite(parsed) ? parsed : null
	}
	return null
}

export function AddressLink({
	address,
	city,
	country,
	lat,
	lng,
	className,
	placeholder = DEFAULT_PLACEHOLDER,
}: AddressLinkProps) {
	const addressValue = trimValue(address)
	const query = [country, city, address].map(trimValue).filter(Boolean).join(', ')
	const latitude = toFiniteNumber(lat)
	const longitude = toFiniteNumber(lng)
	const hasCoordinates = latitude !== null && longitude !== null
	const href = hasCoordinates
		? `${YANDEX_MAPS_POINT_URL}&ll=${longitude},${latitude}&pt=${longitude},${latitude},pm2rdm`
		: `${YANDEX_MAPS_SEARCH_URL}${encodeURIComponent(query)}`

	if (!addressValue || (!query && !hasCoordinates)) {
		return <span className={cn('text-end font-medium', className)}>{placeholder}</span>
	}

	return (
		<a
			className={cn('text-end font-medium text-brand hover:text-brand/80', className)}
			href={href}
			target='_blank'
			rel='noreferrer noopener'
		>
			{addressValue}
		</a>
	)
}
