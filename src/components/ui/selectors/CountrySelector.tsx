'use client'

import { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/Command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Button } from '@/components/ui/Button'
import { Globe2, Loader2 } from 'lucide-react'
import { Country } from '@/shared/types/Geo.interface'
import { useCountrySuggest } from '@/hooks/queries/geo/useGetCountrySuggest'

interface CountrySelectProps {
	value?: Country
	onChange: (country: Country) => void
	placeholder?: string
	disabled?: boolean
}

export function CountrySelect({ value, onChange, placeholder = 'Выберите страну', disabled }: CountrySelectProps) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')

	const { data, isLoading } = useCountrySuggest(query)
	const countries = data?.results ?? []

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					role='combobox'
					variant={'outline'}
					className='w-full justify-start font-normal shadow-xs outline-none border-none hover:text-muted-foreground bg-grayscale-50 text-grayscale gap-4'
					disabled={disabled}
				>
					<Globe2 className='size-5 opacity-50 shrink-0' />
					{value ? value.name : placeholder}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[320px] p-0'>
				<Command shouldFilter={false}>
					<CommandInput placeholder='Введите страну...' value={query} onValueChange={setQuery} />
					{isLoading ? (
						<div className='flex items-center justify-center py-4 text-sm text-muted-foreground'>
							<Loader2 className='h-4 w-4 animate-spin mr-2' />
							Загрузка...
						</div>
					) : (
						<CommandGroup>
							{countries.length ? (
								countries.map((country) => (
									<CommandItem
										key={country.code}
										value={country.name}
										onSelect={() => {
											onChange(country)
											setOpen(false)
										}}
									>
										{country.name}
									</CommandItem>
								))
							) : (
								<CommandEmpty>Ничего не найдено</CommandEmpty>
							)}
						</CommandGroup>
					)}
				</Command>
			</PopoverContent>
		</Popover>
	)
}
