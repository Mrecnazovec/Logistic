'use client'

import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface DatePickerProps {
	value?: string | Date
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
}

export function DatePicker({ value, onChange, placeholder = 'Выберите дату', disabled }: DatePickerProps) {
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					disabled={disabled}
					className={cn(
						'justify-start text-left bg-grayscale-50 border-none font-normal',
						!value && 'text-grayscale hover:text-grayscale'
					)}
				>
					<CalendarIcon className='size-5 mr-2' />
					{value
						? format(new Date(value), 'dd MMMM yyyy', { locale: ru })
						: placeholder}
				</Button>
			</PopoverTrigger>

			<PopoverContent className='w-auto p-0' align='start'>
				<Calendar
					mode='single'
					selected={value ? new Date(value) : undefined}
					onSelect={(date) => {
						if (!date) return onChange('')
						const localDate = date.toLocaleDateString('en-CA')
						onChange(localDate)
						setOpen(false)
					}}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	)
}
