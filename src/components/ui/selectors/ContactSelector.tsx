'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { cn } from '@/lib/utils'
import { ContactPrefSelector } from '@/shared/enums/ContactPref.enum'
import { Phone } from 'lucide-react'

interface CurrencySelectProps {
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
	className?: string
}

export function ContactSelector({ value, onChange, placeholder = 'Способ связи', disabled, className }: CurrencySelectProps) {
	return (
		<Select onValueChange={onChange} value={value ?? ''} disabled={disabled}>
			<SelectTrigger
				className={cn(
					'w-full rounded-full bg-grayscale-50 border-none ', value && '[&_span]:text-black',
					className
				)}
			>
				<div className='flex gap-4'>
					<Phone className='size-5' />
					<SelectValue placeholder={placeholder} />
				</div>
			</SelectTrigger>
			<SelectContent>
				{ContactPrefSelector.map((item) => (
					<SelectItem value={item.type} key={item.type}>
						{item.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
