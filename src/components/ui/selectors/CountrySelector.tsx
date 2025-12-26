'use client'

import { useMemo, useState } from 'react'
import { Globe2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/Command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useCountrySuggest } from '@/hooks/queries/geo/useGetCountrySuggest'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { Country } from '@/shared/types/Geo.interface'

interface CountrySelectorProps {
	value?: Country | null
	onChange: (country: Country) => void
	placeholder?: string
	disabled?: boolean
	className?: string
}

export function CountrySelector(props: CountrySelectorProps) {
	const remountKey = props.value?.code ?? props.value?.name ?? 'empty'
	return <CountrySelectorInner key={remountKey} {...props} />
}

function CountrySelectorInner({
	value = null,
	onChange,
	placeholder,
	disabled,
	className,
}: CountrySelectorProps) {
	const { t } = useI18n()
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState(value?.name ?? '')
	const resolvedPlaceholder = placeholder ?? t('components.select.country.placeholder')

	const { data, isLoading } = useCountrySuggest(search)

	const filteredCountries = useMemo(() => {
		const countries = data?.results ?? []
		if (!search) return countries
		const normalized = search.toLowerCase()
		return countries.filter((country) => country.name.toLowerCase().includes(normalized))
	}, [data?.results, search])

	const handleSelect = (country: Country) => {
		onChange(country)
		setSearch(country.name)
		setOpen(false)
	}

	return (
		<div className={cn('w-full', className)}>
			<Popover open={open} onOpenChange={(next) => !disabled && setOpen(next)}>
				<PopoverTrigger asChild>
					<Button
						type='button'
						variant='outline'
						role='combobox'
						aria-expanded={open}
						disabled={disabled}
						className={cn(
							'flex w-full items-center justify-start gap-3 rounded-full border-none bg-grayscale-50 px-4 text-sm font-normal text-grayscale hover:bg-grayscale-100',
							search && 'text-black',
							disabled && 'cursor-not-allowed opacity-70'
						)}
					>
						<Globe2 className={cn('size-5 text-grayscale', search && 'text-black')} />
						<span className='truncate'>{search || resolvedPlaceholder}</span>
					</Button>
				</PopoverTrigger>

				<PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='start'>
					<Command shouldFilter={false}>
						<CommandInput
							placeholder={t('components.select.country.searchPlaceholder')}
							value={search}
							onValueChange={(nextValue) => setSearch(nextValue)}
						/>
						<CommandList className='max-h-60'>
							{isLoading ? (
								<div className='flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground'>
									<Loader2 className='size-4 animate-spin' />
									{t('components.select.country.loading')}
								</div>
							) : (
								<>
									<CommandEmpty>{t('components.select.country.empty')}</CommandEmpty>
									<CommandGroup>
										{filteredCountries.map((country) => (
											<CommandItem
												key={country.code}
												value={country.name}
												onSelect={() => handleSelect(country)}
											>
												{country.name}
											</CommandItem>
										))}
									</CommandGroup>
								</>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}
