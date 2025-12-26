'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'

interface DatePickerProps {
	value?: string | Date
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
}

export function DatePicker({ value, onChange, placeholder, disabled }: DatePickerProps) {
	const { t, locale } = useI18n()
	const [open, setOpen] = useState(false)
	const dateLocale = locale === 'en' ? enUS : ru
	const resolvedPlaceholder = placeholder ?? t('components.select.date.placeholder')

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					disabled={disabled}
					className={cn(
						'justify-start text-left bg-grayscale-50 border-none font-normal px-3',
						!value && 'text-grayscale hover:text-grayscale '
					)}
				>
					<CalendarIcon className='size-5 mr-2' />
					{value
						? format(new Date(value), 'dd MMMM yyyy', { locale: dateLocale })
						: resolvedPlaceholder}
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
