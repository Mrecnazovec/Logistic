'use client'

import { useCountrySuggest } from '@/hooks/queries/geo/useGetCountrySuggest'
import { cn } from '@/lib/utils'
import { Country } from '@/shared/types/Geo.interface'
import { Globe2, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Input } from '../form-control/Input'

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
	placeholder = 'Введите страну...',
	disabled,
	className,
}: CountrySelectorProps) {
	const [query, setQuery] = useState(value?.name || '')
	const [isFocused, setIsFocused] = useState(false)
	const [activeIndex, setActiveIndex] = useState(-1)
	const listRef = useRef<HTMLDivElement | null>(null)

	const { data, isLoading } = useCountrySuggest(query)
	const countries = data?.results ?? []

	const filteredCountries = useMemo(() => {
		if (!query) return countries
		const q = query.toLowerCase()
		return countries.filter((c) => c.name.toLowerCase().includes(q))
	}, [countries, query])

	useEffect(() => {
		setQuery(value?.name || '')
	}, [value])

	const handleSelect = (country: Country) => {
		onChange(country)
		setQuery(country.name)
		setIsFocused(false)
		setActiveIndex(-1)
	}

	const highlightMatch = (text: string, query: string) => {
		if (!query) return text
		const regex = new RegExp(`(${query})`, 'gi')
		const parts = text.split(regex)
		return parts.map((part, i) =>
			regex.test(part) ? (
				<span key={i} className='font-semibold text-black'>
					{part}
				</span>
			) : (
				<span key={i}>{part}</span>
			)
		)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!filteredCountries.length) return
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setActiveIndex((prev) => (prev + 1) % filteredCountries.length)
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setActiveIndex((prev) => (prev <= 0 ? filteredCountries.length - 1 : prev - 1))
		} else if (e.key === 'Enter' && activeIndex >= 0) {
			e.preventDefault()
			handleSelect(filteredCountries[activeIndex])
		}
	}

	useEffect(() => {
		if (listRef.current && activeIndex >= 0) {
			const activeEl = listRef.current.children[activeIndex] as HTMLElement
			activeEl?.scrollIntoView({ block: 'nearest' })
		}
	}, [activeIndex])

	return (
		<div className={cn('relative w-full', className)}>
			<Globe2 className='absolute left-3 top-1/2 -translate-y-1/2 text-grayscale size-5' />
			<Input
				type='text'
				value={query}
				onChange={(e) => {
					setQuery(e.target.value)
					setIsFocused(true)
					setActiveIndex(-1)
				}}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setTimeout(() => setIsFocused(false), 150)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				disabled={disabled}
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
					) : filteredCountries.length ? (
						filteredCountries.map((country, i) => (
							<div
								key={country.code}
								className={cn(
									'px-4 py-2 text-sm text-gray-700 cursor-pointer transition-colors',
									i === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
								)}
								onClick={() => handleSelect(country)}
							>
								{highlightMatch(country.name, query)}
							</div>
						))
					) : (
						<div className='py-3 text-center text-sm text-muted-foreground'>
							Ничего не найдено
						</div>
					)}
				</div>
			)}
		</div>
	)
}
