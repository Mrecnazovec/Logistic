'use client'

import { useState } from 'react'

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { ArrowRight, Search, Settings2, Trash2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/Drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { handleNumericInput } from '@/lib/InputValidation'
import { cn } from '@/lib/utils'
import { NUMERIC_REGEX } from '@/shared/regex/regex'
import { ISearch } from '@/shared/types/Search.interface'
import type { CityCoordinates } from '@/shared/types/Nominatim.interface'
import { useSearchDrawerStore } from '@/store/useSearchDrawerStore'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CurrencySelector } from '../selectors/CurrencySelector'
import { DatePicker } from '../selectors/DateSelector'
import { TransportSelector } from '../selectors/TransportSelector'

interface SearchFieldsProps {
	form: UseFormReturn<ISearch, undefined>
	showOffersFilter?: boolean
	onSubmit: () => void | Promise<void>
}

export function SearchFields({ form, showOffersFilter = true, onSubmit }: SearchFieldsProps) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const priceCurrency = form.watch('price_currency')
	const isPriceEnabled = Boolean(priceCurrency)
	const hasQuery = searchParams.toString().length > 0
	const isTablet = useMediaQuery('(min-width: 768px)')
	const isLarge = useMediaQuery('(min-width: 1280px)')
	const isMobile = !isTablet
	const { isOpen: isDrawerOpen, setOpen: setIsDrawerOpen, close: closeDrawer } = useSearchDrawerStore()
	const [showAdvanced, setShowAdvanced] = useState(false)

	const handleOriginCoordinates = (coordinates: CityCoordinates | null) => {
		form.setValue('origin_lat', coordinates?.lat)
		form.setValue('origin_lng', coordinates?.lon)
	}

	const handleDestinationCoordinates = (coordinates: CityCoordinates | null) => {
		form.setValue('dest_lat', coordinates?.lat)
		form.setValue('dest_lng', coordinates?.lon)
	}

	const handleDeleteFilter = () => {
		router.push(pathname)
		form.reset({}, { keepDefaultValues: false })
	}

	const renderCurrencyBadge = () => (
		<span className='w-5 h-5 rounded-sm border border-grayscale-200 bg-grayscale-50 text-[10px] leading-[14px] text-black flex items-center justify-center'>
			{priceCurrency ?? '???'}
		</span>
	)

	const searchButton = (
		<Button
			type={'submit'}
			className='max-xl:w-full'
			onClick={
				() => {
					onSubmit()
					closeDrawer()
				}
			}
		>
			<Search className='size-5' />
			Поиск
		</Button>
	)

	const primaryRow = (
		<>
			<div className='flex items-center gap-3 mb-6 max-xs:flex-wrap'>
				<FormField
					control={form.control}
					name='uuid'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormControl>
								<InputGroup>
									<InputGroupInput placeholder='Поиск по номеру id' {...field} value={field.value ?? ''} />
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
						<Button variant={'outline'} className='bg-transparent border border-brand text-brand hover:bg-transparent hover:text-brand max-xs:w-full'>
							<Settings2 className='size-5' />
							Фильтры
						</Button>
					</PopoverTrigger>
					<PopoverContent align='end' className='space-y-3'>
						<div className='flex items-center justify-between pb-3 border-b'>
							<p className='text-sm font-medium'>Фильтры</p>
						</div>
						<FormField
							control={form.control}
							name='price_currency'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-grayscale flex items-center gap-2'>
										Валюта
										{renderCurrencyBadge()}
									</FormLabel>
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
												<InputGroupInput
													placeholder='От'
													{...field}
													disabled={!isPriceEnabled}
													value={field.value ?? ''}
													className='pl-4'
													onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)}
												/>
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
												<InputGroupInput
													placeholder='До'
													{...field}
													disabled={!isPriceEnabled}
													value={field.value ?? ''}
													className='pl-4'
													onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)}
												/>
											</InputGroup>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						{showOffersFilter ? (
							<FormField
								control={form.control}
								name='has_offers'
								render={({ field }) => {
									const value =
										field.value === undefined ? '' : field.value === true ? 'true' : field.value === false ? 'false' : String(field.value)

									return (
										<FormItem>
											<FormLabel className='text-grayscale'>Наличие предложений</FormLabel>
											<FormControl>
												<RadioGroup
													className=''
													value={value}
													onValueChange={(next) => field.onChange(next === 'true')}
												>
													<label className='flex items-center gap-2 rounded-4xl px-3 py-2 text-sm cursor-pointer bg-grayscale-50 h-13'>
														<RadioGroupItem value='true' />
														Есть предложения
													</label>
													<label className='flex items-center gap-2 rounded-4xl px-3 py-2 text-sm cursor-pointer bg-grayscale-50 h-13'>
														<RadioGroupItem value='false' />
														Нет предложений
													</label>
												</RadioGroup>
											</FormControl>
										</FormItem>
									)
								}}
							/>
						) : null}
						<div className='flex items-end gap-1'>
							<FormField
								control={form.control}
								name='min_weight'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-grayscale'>Масса</FormLabel>
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
				{hasQuery ? (
					<Button
						variant='destructive'
						type='button'
						onClick={handleDeleteFilter}
						title='Сбросить фильтры'
					>
						<Trash2 className='size-4' />
					</Button>
				) : null}
			</div>
		</>
	)

	const advancedFields = (
		<div className='flex xl:flex-row flex-col justify-between items-center gap-3'>
			<div className='flex gap-3 w-full max-xs:flex-wrap'>
				<FormField
					control={form.control}
					name='origin_city'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormControl>
								<CitySelector
									{...field}
									countryCode={undefined}
									placeholder='Откуда'
									onCoordinates={handleOriginCoordinates}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='origin_radius_km'
					render={({ field }) => (
						<FormItem className='max-xs:w-full'>
							<FormControl>
								<InputGroup>
									<InputGroupInput placeholder='Радиус, км' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
								</InputGroup>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<ArrowRight className='size-5 flex text-grayscale shrink-0 max-xl:rotate-90' />
			<div className='flex gap-3 w-full max-xs:flex-wrap'>
				<FormField
					control={form.control}
					name='destination_city'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormControl>
								<CitySelector
									{...field}
									countryCode={' '}
									placeholder='Куда'
									onCoordinates={handleDestinationCoordinates}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='dest_radius_km'
					render={({ field }) => (
						<FormItem className='max-xs:w-full'>
							<FormControl>
								<InputGroup>
									<InputGroupInput placeholder='Радиус, км' {...field} value={field.value ?? ''} className='pl-4' onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)} />
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
					<FormItem className='max-xl:w-full'>
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
					<FormItem className='flex flex-col max-xl:w-full'>
						<FormControl>
							<DatePicker
								value={field.value}
								onChange={field.onChange}
								placeholder='Выберите дату загрузки'
							/>
						</FormControl>
					</FormItem>
				)}
			/>
			{isLarge ? searchButton : null}
		</div>
	)

	if (isMobile) {
		return (
			<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
				<DrawerContent className='max-h-[90vh] overflow-y-auto pb-6'>
					<DrawerHeader>
						<DrawerTitle>Поиск</DrawerTitle>
					</DrawerHeader>
					<div className='space-y-6 px-4 max-md:overflow-y-scroll'>
						{primaryRow}
						{advancedFields}
						{!isLarge ? searchButton : null}
					</div>
				</DrawerContent>
			</Drawer>
		)
	}

	return (
		<div className='space-y-4'>
			{primaryRow}
			{!isLarge && (
				<div className='flex flex-wrap gap-3 justify-end'>
					{searchButton}
					<Button
						type='button'
						variant='outline'
						size={'icon'}
						onClick={() => setShowAdvanced((prev) => !prev)}
						className='max-md:w-full'
					>
						{showAdvanced ? <ArrowRight className='-rotate-90 w-3/4 h-3/4' /> : <ArrowRight className='rotate-90 w-3/4 h-3/4' />}
					</Button>
				</div>
			)}
			{isLarge || showAdvanced ? advancedFields : null}
		</div>
	)
}

