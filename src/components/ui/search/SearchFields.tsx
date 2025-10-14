'use client'

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { ArrowLeftRight, CalendarIcon, Search, Settings2, SquaresIntersect } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { CitySelect } from '@/components/ui/selectors/CitySelector'
import { useState } from 'react'
import { City } from '@/shared/types/Geo.interface'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { TransportSelector } from '@/shared/enums/TransportType.enum'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Button } from '@/components/ui/Button'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/Calendar'
import { ru } from 'date-fns/locale'
import { PriceSelector } from '@/shared/enums/PriceCurrency.enum'
import { usePathname, useRouter } from 'next/navigation'
import { ISearch } from '@/shared/types/Search.interface'

interface SearchFieldsProps {
	form: UseFormReturn<ISearch, undefined>
}

export function SearchFields({ form }: SearchFieldsProps) {
	const [originCity, setOriginCity] = useState<City | null>(null)
	const [destinationCity, setDestinationCity] = useState<City | null>(null)
	const router = useRouter()
	const pathname = usePathname()

	const handleOriginCitySelect = (selected: City) => {
		setOriginCity(selected)
		form.setValue('origin_city', selected.name)
	}

	const handleDestinationCitySelect = (selected: City) => {
		setDestinationCity(selected)
		form.setValue('destination_city', selected.name)
	}

	const handleDeleteFilter = () => {
		form.reset()

		router.push(pathname)
	}

	return (
		<>
			<div className='flex items-center gap-3 mb-6'>
				<FormField
					control={form.control}
					name='id'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormControl>
								<InputGroup>
									<InputGroupInput placeholder='Поиск по компании' {...field} value={field.value ?? ''} />
									<InputGroupAddon className='pr-2'>
										<Search className='text-grayscale size-5' />
									</InputGroupAddon>
								</InputGroup>
							</FormControl>
						</FormItem>
					)}
				/>
				<Popover>
					<PopoverTrigger asChild>
						<Button variant={'outline'} className='bg-transparent border border-brand text-brand hover:bg-transparent hover:text-brand'>
							<Settings2 className='size-5' />
							Фильтр
						</Button>
					</PopoverTrigger>
					<PopoverContent align='end' className='space-y-3'>
						<div className='flex items-center justify-between pb-3 border-b'>
							<p className='text-sm font-medium'>Фильтр</p>
							<Button onClick={() => handleDeleteFilter()} type='button' variant={'link'} className='text-brand underline p-0 h-fit text-[10px]'>
								Очистить фильтр
							</Button>
						</div>
						<FormField
							control={form.control}
							name='transport_type'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-grayscale'>Тип транспорта</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value ?? ''}>
											<SelectTrigger className='w-full rounded-full text-grayscale bg-grayscale-50 border-none [&_span]:text-grayscale'>
												<SelectValue className='' placeholder='Тип транспорта' />
											</SelectTrigger>
											<SelectContent>
												{TransportSelector.map((item) => (
													<SelectItem key={item.type} value={item.type}>
														{item.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='price_currency'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-grayscale'>Валюта</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value ?? ''}>
											<SelectTrigger className='w-full rounded-full text-grayscale bg-grayscale-50 border-none [&_span]:text-grayscale'>
												<SelectValue className='' placeholder='Валюта' />
											</SelectTrigger>
											<SelectContent>
												{PriceSelector.map((item) => (
													<SelectItem value={item.type} key={item.type}>
														{item.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className='flex items-end gap-1'>
							<FormField
								control={form.control}
								name='min_price'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-grayscale'>Цена</FormLabel>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder='От' {...field} value={field.value ?? ''} className='pl-4' />
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='max_price'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder='До' {...field} value={field.value ?? ''} className='pl-4' />
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<div className='flex items-end gap-1'>
							<FormField
								control={form.control}
								name='min_weight'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-grayscale'>Габариты</FormLabel>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder='От' {...field} value={field.value ?? ''} className='pl-4' />
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='max_weight'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputGroup>
												<InputGroupInput placeholder='До' {...field} value={field.value ?? ''} className='pl-4' />
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<div className='flex justify-between items-center gap-3'>
				<div className='flex gap-3 w-full'>
					<FormField
						control={form.control}
						name='origin_city'
						render={() => (
							<FormItem className='w-full'>
								<FormControl>
									<CitySelect value={originCity || undefined} onChange={(val) => handleOriginCitySelect(val)} countryCode=' ' placeholder='Откуда' />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='origin_radius_km'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<InputGroup>
										<InputGroupInput placeholder='Радиус' {...field} value={field.value ?? ''} className='pl-4' />
									</InputGroup>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<ArrowLeftRight className='size-5 flex text-grayscale shrink-0' />
				<div className='flex gap-3 w-full'>
					<FormField
						control={form.control}
						name='destination_city'
						render={() => (
							<FormItem className='w-full'>
								<FormControl>
									<CitySelect
										value={destinationCity || undefined}
										onChange={(val) => handleDestinationCitySelect(val)}
										countryCode=' '
										placeholder='Куда'
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='dest_radius_km'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<InputGroup>
										<InputGroupInput placeholder='Радиус' {...field} value={field.value ?? ''} className='pl-4' />
									</InputGroup>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name='transport_type'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value ?? ''}>
									<SelectTrigger className='rounded-full text-grayscale bg-grayscale-50 border-none [&_span]:text-grayscale'>
										<SquaresIntersect className='size-5' />
										<SelectValue className='' placeholder='Тип транспорта' />
									</SelectTrigger>
									<SelectContent>
										{TransportSelector.map((item) => (
											<SelectItem key={item.type} value={item.type}>
												{item.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='load_date'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant='outline'
											className='justify-start text-left text-grayscale bg-grayscale-50 border-none hover:text-grayscale font-normal'
										>
											<CalendarIcon className='size-5 mr-2' />
											{field.value ? format(new Date(field.value), 'dd MMMM yyyy', { locale: ru }) : 'Выберите дату'}
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar
										mode='single'
										selected={field.value ? new Date(field.value) : undefined}
										onSelect={(date) => {
											if (!date) return field.onChange('')
											const localDate = date.toLocaleDateString('en-CA')
											field.onChange(localDate)
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</FormItem>
					)}
				/>
				<Button type='submit'>
					<Search className='size-5' />
					Поиск
				</Button>
			</div>
		</>
	)
}
