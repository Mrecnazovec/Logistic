'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { PriceSelector } from '@/shared/enums/PriceCurrency.enum'

interface CurrencySelectProps {
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
	className?: string
}

export function CurrencySelector({ value, onChange, placeholder, disabled, className }: CurrencySelectProps) {
	const { t } = useI18n()
	const resolvedPlaceholder = placeholder ?? t('components.select.currency.placeholder')

	return (
		<Select onValueChange={onChange} value={value ?? ''} disabled={disabled}>
			<SelectTrigger
				className={cn(
					'w-full rounded-full bg-grayscale-50 border-none ',
					value && '[&_span]:text-black',
					className,
				)}
			>
				<SelectValue placeholder={resolvedPlaceholder} />
			</SelectTrigger>
			<SelectContent>
				{PriceSelector.map((item) => (
					<SelectItem value={item.type} key={item.type}>
						{t(item.nameKey)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
