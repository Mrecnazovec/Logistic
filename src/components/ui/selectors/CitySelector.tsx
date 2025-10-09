'use client'

import { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/Command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Button } from '@/components/ui/Button'
import { Loader2, MapPin } from 'lucide-react'
import { City } from '@/shared/types/Geo.interface'
import { useCitySuggest } from '@/hooks/queries/geo/useGetCitySuggest'

interface CitySelectProps {
	value?: City
	onChange: (city: City) => void
	countryCode?: string
	placeholder?: string
	disabled?: boolean
}

export function CitySelect({ value, onChange, countryCode, placeholder = 'Выберите город', disabled }: CitySelectProps) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')

	const { data, isLoading } = useCitySuggest(query, countryCode)
	const cities = data?.results ?? []

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					className='w-full justify-start font-normal shadow-xs outline-none border-none hover:text-muted-foreground bg-grayscale-50 text-grayscale gap-4'
					disabled={disabled || !countryCode}
				>
					<MapPin className='size-5 opacity-50 shrink-0' />
					{value ? `${value.name}, ${value.country}` : placeholder}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[320px] p-0'>
				<Command shouldFilter={false}>
					<CommandInput placeholder='Введите город...' value={query} onValueChange={setQuery} disabled={!countryCode} />
					{isLoading ? (
						<div className='flex items-center justify-center py-4 text-sm text-muted-foreground'>
							<Loader2 className='h-4 w-4 animate-spin mr-2' />
							Загрузка...
						</div>
					) : (
						<CommandGroup>
							{cities.length ? (
								cities.map((city) => (
									<CommandItem
										key={`${city.name}-${city.country_code}`}
										value={city.name}
										onSelect={() => {
											onChange(city)
											setOpen(false)
										}}
									>
										{city.name}, {city.country}
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
