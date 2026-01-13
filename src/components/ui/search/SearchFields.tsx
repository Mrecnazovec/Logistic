'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { UseFormReturn } from 'react-hook-form'
import { ArrowRight, Search, Settings2, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/Drawer'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { CurrencySelector } from '@/components/ui/selectors/CurrencySelector'
import { DatePicker } from '@/components/ui/selectors/DateSelector'
import { TransportSelector } from '@/components/ui/selectors/TransportSelector'
import { useI18n } from '@/i18n/I18nProvider'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { handleNumericInput } from '@/lib/InputValidation'
import { cn } from '@/lib/utils'
import { NUMERIC_REGEX } from '@/shared/regex/regex'
import { ISearch } from '@/shared/types/Search.interface'
import type { CityCoordinates } from '@/shared/types/Nominatim.interface'
import { useSearchDrawerStore } from '@/store/useSearchDrawerStore'

interface SearchFieldsProps {
	form: UseFormReturn<ISearch, undefined>
	showOffersFilter?: boolean
	showWeightRadiusFields?: boolean
	showAxlesVolumeFields?: boolean
	uuidPlaceholder?: string
	onSubmit: () => void | Promise<void>
}

export function SearchFields({
	form,
	showOffersFilter = true,
	showWeightRadiusFields = true,
	showAxlesVolumeFields = false,
	uuidPlaceholder,
	onSubmit,
}: SearchFieldsProps) {
	const { t } = useI18n()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const priceCurrency = form.watch('price_currency')
	const originCountryValue = form.watch('origin_country')
	const destinationCountryValue = form.watch('destination_country')
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

	const handleAxlesInput = (value: string, onChange: (value: string) => void) => {
		if (value === '') {
			onChange(value)
			return
		}
		const parsed = Number(value)
		if (Number.isNaN(parsed)) {
			onChange(value)
			return
		}
		onChange(String(Math.min(parsed, 10)))
	}

	const renderCurrencyBadge = () => (
		<span className='w-5 h-5 rounded-sm border border-grayscale-200 bg-grayscale-50 text-[10px] leading-[14px] text-black flex items-center justify-center'>
			{priceCurrency ?? '???'}
		</span>
	)

	const searchButton = (
		<Button
			type='submit'
			className='max-xl:w-full'
			onClick={() => {
				onSubmit()
				closeDrawer()
			}}
		>
			<Search className='size-5' />
			{t('components.search.search')}
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
									<InputGroupInput
										placeholder={uuidPlaceholder ?? t('components.search.byId')}
										{...field}
										value={field.value ?? ''}
									/>
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
						<Button variant='outline' className='bg-transparent border border-brand text-brand hover:bg-transparent hover:text-brand max-xs:w-full'>
							<Settings2 className='size-5' />
							{t('components.search.filters')}
						</Button>
					</PopoverTrigger>
					<PopoverContent align='end' className='space-y-3'>
						<div className='flex items-center justify-between pb-3 border-b'>
							<p className='text-sm font-medium'>{t('components.search.filters')}</p>
						</div>
						<FormField
							control={form.control}
							name='price_currency'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-grayscale flex items-center gap-2'>
										{t('components.search.currency')}
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
										<FormLabel className='text-grayscale'>{t('components.search.price')}</FormLabel>
										<FormControl>
											<InputGroup>
												<InputGroupInput
													placeholder={t('components.search.from')}
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
													placeholder={t('components.search.to')}
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
											<FormLabel className='text-grayscale'>{t('components.search.hasOffers')}</FormLabel>
											<FormControl>
												<RadioGroup
													className=''
													value={value}
													onValueChange={(next) => field.onChange(next === 'true')}
												>
													<label className='flex items-center gap-2 rounded-4xl px-3 py-2 text-sm cursor-pointer bg-grayscale-50 h-13'>
														<RadioGroupItem value='true' />
														{t('components.search.hasOffers.yes')}
													</label>
													<label className='flex items-center gap-2 rounded-4xl px-3 py-2 text-sm cursor-pointer bg-grayscale-50 h-13'>
														<RadioGroupItem value='false' />
														{t('components.search.hasOffers.no')}
													</label>
												</RadioGroup>
											</FormControl>
										</FormItem>
									)
								}}
							/>
						) : null}
						{showWeightRadiusFields ? (
							<div className='flex items-end gap-1'>
								<FormField
									control={form.control}
									name='min_weight'
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-grayscale'>{t('components.search.weight')}</FormLabel>
											<FormControl>
												<InputGroup>
													<InputGroupInput
														placeholder={t('components.search.from')}
														{...field}
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
									name='max_weight'
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<InputGroup>
													<InputGroupInput
														placeholder={t('components.search.to')}
														{...field}
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
						) : null}
						{showAxlesVolumeFields ? (
							<>
								<div className='flex items-end gap-1'>
									<FormField
										control={form.control}
										name='min_axles'
										render={({ field }) => (
											<FormItem>
												<FormLabel className='text-grayscale'>{t('components.search.axles')}</FormLabel>
												<FormControl>
													<InputGroup>
														<InputGroupInput
															placeholder={t('components.search.from')}
															{...field}
															value={field.value ?? ''}
															className='pl-4'
															onChange={(event) =>
																handleNumericInput(event, NUMERIC_REGEX, (value) => handleAxlesInput(value, field.onChange))
															}
														/>
													</InputGroup>
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='max_axles'
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<InputGroup>
														<InputGroupInput
															placeholder={t('components.search.to')}
															{...field}
															value={field.value ?? ''}
															className='pl-4'
															onChange={(event) =>
																handleNumericInput(event, NUMERIC_REGEX, (value) => handleAxlesInput(value, field.onChange))
															}
														/>
													</InputGroup>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
								<div className='flex items-end gap-1'>
									<FormField
										control={form.control}
										name='min_volume_m3'
										render={({ field }) => (
											<FormItem>
												<FormLabel className='text-grayscale'>{t('components.search.volume')}</FormLabel>
												<FormControl>
													<InputGroup>
														<InputGroupInput
															placeholder={t('components.search.from')}
															{...field}
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
										name='max_volume_m3'
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<InputGroup>
														<InputGroupInput
															placeholder={t('components.search.to')}
															{...field}
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
							</>
						) : null}
					</PopoverContent>
				</Popover>
				{hasQuery ? (
					<Button
						variant='destructive'
						type='button'
						onClick={handleDeleteFilter}
						title={t('components.search.resetTitle')}
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
									value={field.value ?? ''}
									countryName={originCountryValue}
									countryCode={undefined}
									placeholder={t('components.search.origin')}
									onChange={(value, city) => {
										field.onChange(value)
										form.setValue('origin_country', city?.country ?? '')
									}}
									onCoordinates={handleOriginCoordinates}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				{showWeightRadiusFields ? (
					<FormField
						control={form.control}
						name='origin_radius_km'
						render={({ field }) => (
							<FormItem className='max-xs:w-full'>
								<FormControl>
									<InputGroup>
										<InputGroupInput
											placeholder={t('components.search.radius')}
											{...field}
											value={field.value ?? ''}
											className='pl-4'
											onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)}
										/>
									</InputGroup>
								</FormControl>
							</FormItem>
						)}
					/>
				) : null}
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
									value={field.value ?? ''}
									countryName={destinationCountryValue}
									countryCode=' '
									placeholder={t('components.search.destination')}
									onChange={(value, city) => {
										field.onChange(value)
										form.setValue('destination_country', city?.country ?? '')
									}}
									onCoordinates={handleDestinationCoordinates}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				{showWeightRadiusFields ? (
					<FormField
						control={form.control}
						name='dest_radius_km'
						render={({ field }) => (
							<FormItem className='max-xs:w-full'>
								<FormControl>
									<InputGroup>
										<InputGroupInput
											placeholder={t('components.search.radius')}
											{...field}
											value={field.value ?? ''}
											className='pl-4'
											onChange={(event) => handleNumericInput(event, NUMERIC_REGEX, field.onChange)}
										/>
									</InputGroup>
								</FormControl>
							</FormItem>
						)}
					/>
				) : null}
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
								placeholder={t('components.search.loadDate')}
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
						<DrawerTitle>{t('components.search.search')}</DrawerTitle>
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
						size='icon'
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
