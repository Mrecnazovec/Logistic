'use client'

import { Phone } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { ContactPrefEnum, ContactPrefSelector } from '@/shared/enums/ContactPref.enum'

interface CurrencySelectProps {
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
	disableEmailOptions?: boolean
	className?: string
}

export function ContactSelector({ value, onChange, placeholder, disabled, disableEmailOptions, className }: CurrencySelectProps) {
	const { t } = useI18n()
	const resolvedPlaceholder = placeholder ?? t('components.select.contact.placeholder')

	return (
		<Select onValueChange={onChange} value={value ?? ''} disabled={disabled}>
			<SelectTrigger
				className={cn(
					'w-full rounded-full bg-grayscale-50 border-none ',
					value && '[&_span]:text-black',
					className
				)}
			>
				<div className='flex gap-4'>
					<Phone className='size-5' />
					<SelectValue placeholder={resolvedPlaceholder} />
				</div>
			</SelectTrigger>
			<SelectContent>
				{ContactPrefSelector.map((item) => {
					const isDisabled =
						disableEmailOptions && (item.type === ContactPrefEnum.EMAIL || item.type === ContactPrefEnum.BOTH)

					return (
						<SelectItem value={item.type} key={item.type} disabled={isDisabled}>
						{t(item.nameKey)}
						</SelectItem>
					)
				})}
			</SelectContent>
		</Select>
	)
}
