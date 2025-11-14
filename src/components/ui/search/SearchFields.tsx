'use client'

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { City } from '@/shared/types/Geo.interface'
import { ArrowLeftRight, Search, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { handleNumericInput } from '@/lib/InputValidation'
import { cn } from '@/lib/utils'
import { NUMERIC_REGEX } from '@/shared/regex/regex'
import { ISearch } from '@/shared/types/Search.interface'
import { usePathname, useRouter } from 'next/navigation'
import { CurrencySelector } from '../selectors/CurrencySelector'
import { DatePicker } from '../selectors/DateSelector'
import { TransportSelector } from '../selectors/TransportSelector'

interface SearchFieldsProps {
	form: UseFormReturn<ISearch, undefined>
}

export function SearchFields({ form }: SearchFieldsProps) {
	const [originCity, setOriginCity] = useState<City | null>(null)
	const [destinationCity, setDestinationCity] = useState<City | null>(null)
	const router = useRouter()
	const pathname = usePathname()

	const handleDeleteFilter = () => {
		form.reset()
		setOriginCity(null)
		setDestinationCity(null)

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
										<Search className={cn('text-grayscale size-5', field.value && 'text-black')} />
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
							name='price_currency'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-grayscale'>Валюта</FormLabel>
									<FormControl>
										<CurrencySelector value={field.value} onChange={field.onChange} />
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
												<InputGroupInput placeholder='От' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
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
												<InputGroupInput placeholder='До' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
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
												<InputGroupInput placeholder='От' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
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
												<InputGroupInput placeholder='До' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<div className='flex lg:flex-row flex-col justify-between items-center gap-3'>
				<div className='flex gap-3 w-full'>
					<FormField
						control={form.control}
						name='origin_city'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormControl>
									<CitySelector {...field} countryCode={undefined} placeholder='Откуда' />
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
										<InputGroupInput placeholder='Радиус' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
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
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormControl>
									<CitySelector {...field} countryCode={' '} placeholder='Куда' />
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
										<InputGroupInput placeholder='Радиус' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
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
						<FormItem className='max-lg:w-full'>
							<FormControl>
								<TransportSelector value={field.value} onChange={field.onChange} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='load_date'
					render={({ field }) => (
						<FormItem className='flex flex-col max-lg:w-full'>
							<FormControl>
								<DatePicker
									value={field.value}
									onChange={field.onChange}
									placeholder='Выберите дату'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type='submit' className='max-lg:w-full'>
					<Search className='size-5' />
					Поиск
				</Button>
			</div>
		</>
	)
}
