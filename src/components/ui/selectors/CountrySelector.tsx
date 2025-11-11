'use client'

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
import { cn } from '@/lib/utils'
import { Country } from '@/shared/types/Geo.interface'
import { Globe2, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface CountrySelectorProps {
    value?: Country | null
    onChange: (country: Country) => void
    placeholder?: string
    disabled?: boolean
    className?: string
}

export function CountrySelector({
    value = null,
    onChange,
    placeholder = 'Select country',
    disabled,
    className,
}: CountrySelectorProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState(value?.name ?? '')

    const { data, isLoading } = useCountrySuggest(search)
    const countries = data?.results ?? []

    const filteredCountries = useMemo(() => {
        if (!search) return countries
        const normalized = search.toLowerCase()
        return countries.filter((country) => country.name.toLowerCase().includes(normalized))
    }, [countries, search])

    useEffect(() => {
        setSearch(value?.name ?? '')
    }, [value])

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
                        <span className='truncate'>{search || placeholder}</span>
                    </Button>
                </PopoverTrigger>

                <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='start'>
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder='Страна'
                            value={search}
                            onValueChange={(nextValue) => setSearch(nextValue)}
                        />
                        <CommandList className='max-h-60'>
                            {isLoading ? (
                                <div className='flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground'>
                                    <Loader2 className='size-4 animate-spin' />
                                    Loading...
                                </div>
                            ) : (
                                <>
                                    <CommandEmpty>Ничего не найдено</CommandEmpty>
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
