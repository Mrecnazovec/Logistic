'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { cn } from '@/lib/utils'
import { PriceSelector } from '@/shared/enums/PriceCurrency.enum'

interface CurrencySelectProps {
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
	className?: string
}

export function CurrencySelector({ value, onChange, placeholder = 'Выберите валюту', disabled, className }: CurrencySelectProps) {
	return (
		<Select onValueChange={onChange} value={value ?? ''} disabled={disabled}>
			<SelectTrigger
				className={cn(
					'w-full rounded-full bg-grayscale-50 border-none ',
					value && '[&_span]:text-black',
					className,
				)}
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{PriceSelector.map((item) => (
					<SelectItem value={item.type} key={item.type}>
						{item.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
