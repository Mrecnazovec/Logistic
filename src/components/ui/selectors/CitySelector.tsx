'use client'

import { useCitySuggest } from '@/hooks/queries/geo/useGetCitySuggest'
import { cn } from '@/lib/utils'
import { City } from '@/shared/types/Geo.interface'
import { Loader2, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Input } from '../form-control/Input'

interface CitySelectorProps {
	value?: string
	onChange: (value: string, city?: City | null) => void
	countryCode?: string
	placeholder?: string
	disabled?: boolean
	className?: string
}

export function CitySelector({
	value = '',
	onChange,
	countryCode,
	placeholder = 'Введите город...',
	disabled,
	className,
}: CitySelectorProps) {
	const [query, setQuery] = useState(value)
	const [isFocused, setIsFocused] = useState(false)
	const [activeIndex, setActiveIndex] = useState(-1)
	const listRef = useRef<HTMLDivElement | null>(null)

	const { data, isLoading } = useCitySuggest(query, countryCode)
	const cities = data?.results ?? []

	useEffect(() => {
		if (!value) setQuery('')
	}, [value])

	const handleSelect = (city: City) => {
		setQuery(`${city.name}, ${city.country}`)

		onChange(city.name, city)

		setIsFocused(false)
		setActiveIndex(-1)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!cities.length) return
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setActiveIndex((prev) => (prev + 1) % cities.length)
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setActiveIndex((prev) => (prev <= 0 ? cities.length - 1 : prev - 1))
		} else if (e.key === 'Enter' && activeIndex >= 0) {
			e.preventDefault()
			handleSelect(cities[activeIndex])
		}
	}

	return (
		<div className={cn('relative w-full', className)}>
			<MapPin className='absolute left-3 top-1/2 -translate-y-1/2 text-grayscale size-5' />
			<Input
				type='text'
				value={query}
				onChange={(e) => {
					setQuery(e.target.value)
					onChange(e.target.value)
					setIsFocused(true)
				}}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setTimeout(() => setIsFocused(false), 150)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				disabled={disabled || !countryCode}
				className={cn('pl-10 bg-grayscale-50 border-none text-sm', disabled && 'cursor-not-allowed opacity-70')}
			/>

			{isFocused && query && (
				<div
					ref={listRef}
					className='absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-[240px] overflow-auto z-50'
				>
					{isLoading ? (
						<div className='flex items-center justify-center py-3 text-sm text-muted-foreground'>
							<Loader2 className='h-4 w-4 animate-spin mr-2' />
							Загрузка...
						</div>
					) : cities.length ? (
						cities.map((city, i) => (
							<div
								key={`${city.name}-${city.country_code}`}
								className={cn(
									'px-4 py-2 text-sm text-gray-700 cursor-pointer transition-colors',
									i === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
								)}
								onClick={() => handleSelect(city)}
							>
								{city.name}, {city.country}
							</div>
						))
					) : (
						<div className='py-3 text-center text-sm text-muted-foreground'>Ничего не найдено</div>
					)}
				</div>
			)}
		</div>
	)
}
