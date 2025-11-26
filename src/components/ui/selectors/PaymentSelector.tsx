'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { cn } from '@/lib/utils'
import { PaymentMethodSelector } from '@/shared/enums/PaymentMethod.enum'
import { CreditCard } from 'lucide-react'

interface CurrencySelectProps {
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
	className?: string
}

export function PaymentSelector({ value, onChange, placeholder = 'Метод оплаты', disabled, className }: CurrencySelectProps) {
	return (
		<Select onValueChange={onChange} value={value ?? ''} disabled={disabled}>
			<SelectTrigger
				className={cn(
					'w-full rounded-full bg-grayscale-50 border-none ', value && '[&_span]:text-black',
					className
				)}
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
