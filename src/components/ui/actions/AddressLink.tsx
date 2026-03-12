import { DEFAULT_PLACEHOLDER } from '@/lib/formatters'
import { cn } from '@/lib/utils'

type AddressLinkProps = {
	address?: string | null
	city?: string | null
	country?: string | null
	className?: string
	placeholder?: string
}

const YANDEX_MAPS_SEARCH_URL = 'https://yandex.ru/maps/?text='

const trimValue = (value?: string | null) => {
	const normalized = value?.trim()
	return normalized ? normalized : null
}

export function AddressLink({
	address,
	city,
	country,
	className,
	placeholder = DEFAULT_PLACEHOLDER,
}: AddressLinkProps) {
	const addressValue = trimValue(address)
	const query = [country, city, address].map(trimValue).filter(Boolean).join(', ')

	if (!addressValue || !query) {
		return <span className={cn('text-end font-medium', className)}>{placeholder}</span>
	}

	return (
		<a
			className={cn('text-end font-medium text-brand hover:text-brand/80', className)}
			href={`${YANDEX_MAPS_SEARCH_URL}${encodeURIComponent(query)}`}
			target='_blank'
			rel='noreferrer noopener'
		>
			{addressValue}
		</a>
	)
}
