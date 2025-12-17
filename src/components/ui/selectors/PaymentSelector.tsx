'use client'

import { CreditCard } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { cn } from '@/lib/utils'
import { PaymentMethodEnum, PaymentMethodSelector } from '@/shared/enums/PaymentMethod.enum'

interface PaymentSelectorProps {
	value?: PaymentMethodEnum | ''
	onChange: (value: PaymentMethodEnum) => void
	placeholder?: string
	disabled?: boolean
	className?: string
}

export function PaymentSelector({ value, onChange, placeholder = 'Способ оплаты', disabled, className }: PaymentSelectorProps) {
	return (
		<Select onValueChange={(newValue) => onChange(newValue as PaymentMethodEnum)} value={value ?? ''} disabled={disabled}>
			<SelectTrigger
				className={cn('w-full rounded-full border-none bg-grayscale-50', value && '[&_span]:text-black', className)}
			>
				<div className='flex gap-4'>
					<CreditCard className='size-5' />
					<SelectValue placeholder={placeholder} />
				</div>
			</SelectTrigger>
			<SelectContent>
				{PaymentMethodSelector.map((item) => (
					<SelectItem value={item.type} key={item.type}>
						{item.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
