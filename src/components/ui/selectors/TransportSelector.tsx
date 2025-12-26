'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { TransportSelect } from '@/shared/enums/TransportType.enum'
import { SquaresIntersect } from 'lucide-react'

interface TransportSelectProps {
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
	className?: string
}

export function TransportSelector({ value, onChange, placeholder, disabled, className }: TransportSelectProps) {
	const { t } = useI18n()
	const resolvedPlaceholder = placeholder ?? t('components.select.transport.placeholder')

	return (
		<Select onValueChange={onChange} value={value ?? ''} disabled={disabled}>
			<SelectTrigger
				className={cn(
					'rounded-full text-grayscale bg-grayscale-50 border-none  w-full',
					value && '[&_span]:text-black',
					className
				)}
			>
				<div className='flex gap-3 items-center'>
					<SquaresIntersect className={cn('size-5', value && 'text-black')} />
					<SelectValue placeholder={resolvedPlaceholder} />
				</div>
			</SelectTrigger>
			<SelectContent>
				{TransportSelect.map((item) => (
					<SelectItem
						className='*:[span]:last:w-full *:[span]:last:flex *:[span]:last:justify-between *:[span]:last:gap-2'
						key={item.type}
						value={item.type}
					>
						<span>{t(item.nameKey)}</span> {t(item.symbKey)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
