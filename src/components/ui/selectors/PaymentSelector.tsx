'use client'

import { CreditCard } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { PaymentMethodEnum, PaymentMethodSelector } from '@/shared/enums/PaymentMethod.enum'

interface PaymentSelectorProps {
	value?: PaymentMethodEnum | ''
	onChange: (value: PaymentMethodEnum) => void
	placeholder?: string
	disabled?: boolean
	className?: string
}

export function PaymentSelector({ value, onChange, placeholder, disabled, className }: PaymentSelectorProps) {
	const { t } = useI18n()
	const resolvedPlaceholder = placeholder ?? t('components.select.payment.placeholder')

	return (
		<Select onValueChange={(newValue) => onChange(newValue as PaymentMethodEnum)} value={value ?? ''} disabled={disabled}>
			<SelectTrigger
				className={cn('w-full rounded-full border-none bg-grayscale-50', value && '[&_span]:text-black', className)}
			>
				<div className='flex gap-4'>
					<CreditCard className='size-5' />
					<SelectValue placeholder={resolvedPlaceholder} />
				</div>
			</SelectTrigger>
			<SelectContent>
				{PaymentMethodSelector.map((item) => (
					<SelectItem value={item.type} key={item.type}>
						{t(item.nameKey)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
