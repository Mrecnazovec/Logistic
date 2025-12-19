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
import { useCitySuggest } from '@/hooks/queries/geo/useGetCitySuggest'
import { cn } from '@/lib/utils'
import { nominatimService } from '@/services/nominatim.service'
import { City } from '@/shared/types/Geo.interface'
import type { CityCoordinates } from '@/shared/types/Nominatim.interface'
import { Loader2, MapPin } from 'lucide-react'
import { useState } from 'react'

interface CitySelectorProps {
    value?: string
    displayValue?: string
    onChange: (value: string, city?: City | null) => void
    onCoordinates?: (coordinates: CityCoordinates | null, city: City) => void
    countryCode?: string
    placeholder?: string
    disabled?: boolean
    className?: string
}

export function CitySelector({
    value = '',
    displayValue,
    onChange,
    onCoordinates,
    countryCode,
    placeholder = 'Выберите город',
    disabled,
    className,
}: CitySelectorProps) {
    const isDisabled = disabled
    const [open, setOpen] = useState(false)
    const [selectedCity, setSelectedCity] = useState<City | null>(null)
    const searchQuery = value ?? ''
    const displayText =
        displayValue ?? (selectedCity?.name === value && selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : value ?? '')

    const { data, isLoading } = useCitySuggest(searchQuery, countryCode)
    const cities = data?.results ?? []

    const handleInputChange = (nextValue: string) => {
        setSelectedCity(null)
        onChange(nextValue, null)
    }

    const handleSelect = async (city: City) => {
        setSelectedCity(city)
        onChange(city.name, city)
        setOpen(false)

        const coordinates = await nominatimService.getCityCoordinates(city)

        if (onCoordinates) {
            onCoordinates(coordinates, city)
        }

        console.log('Nominatim coordinates', {
            city: `${city.name}, ${city.country}`,
            coordinates,
        })
    }

    return (
        <div className={cn('w-full', className)}>
            <Popover open={isDisabled ? false : open} onOpenChange={(next) => !isDisabled && setOpen(next)}>
                <PopoverTrigger asChild>
                    <Button
                        type='button'
                        variant='outline'
                        role='combobox'
                        aria-expanded={open}
                        disabled={isDisabled}
                        className={cn(
                            'flex w-full items-center justify-start gap-3 rounded-full border-none bg-grayscale-50 px-4 text-sm font-normal text-grayscale hover:bg-grayscale-100',
                            displayText && 'text-black',
                            isDisabled && 'cursor-not-allowed opacity-70'
                        )}
                    >
                        <MapPin className={cn('size-5 text-grayscale', displayText && 'text-black')} />
                        <span className='truncate'>{displayText || placeholder}</span>
                    </Button>
                </PopoverTrigger>

                <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='start'>
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder='Город'
                            value={displayText}
                            onValueChange={handleInputChange}
                            disabled={isDisabled}
                        />
                        <CommandList className='max-h-60'>
                            {isLoading ? (
                                <div className='flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground'>
                                    <Loader2 className='size-4 animate-spin' />
                                    Загрузка...
                                </div>
                            ) : (
                                <>
                                    <CommandEmpty>Ничего не найдено</CommandEmpty>
                                    <CommandGroup>
                                        {cities.map((city) => (
                                            <CommandItem
                                                key={`${city.name}-${city.country_code}`}
                                                value={`${city.name}, ${city.country}`}
                                                onSelect={() => handleSelect(city)}
                                            >
                                                {city.name}, {city.country}
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
