'use client'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { DatePicker } from '@/components/ui/selectors/DateSelector'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip'
import { LocationMapPicker } from '@/app/dashboard/announcements/posting/(PostingPage)/ui/LocationMapPicker'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { Home } from 'lucide-react'
import { useState } from 'react'
import { EDIT_SECTION_CLASS } from '../constants/editLayout'
import type { EditSectionCommonProps, EditFormMapState } from '../types/EditForm.types'

type EditDestinationSectionProps = EditSectionCommonProps & {
	destinationCountryValue?: string
	destinationCityLabel?: string
	yandexApiKey?: string
	showMap: boolean
	mapState: EditFormMapState
}

export function EditDestinationSection({
	form,
	isLoadingPatch,
	destinationCountryValue,
	destinationCityLabel,
	yandexApiKey,
	showMap,
	mapState,
}: EditDestinationSectionProps) {
	const { t } = useI18n()
	const [isMapOpen, setIsMapOpen] = useState(false)
	const canOpenMapFromAddress = Boolean(mapState.destinationCity?.trim())

	return (
		<div className={EDIT_SECTION_CLASS}>
			<FormField
				control={form.control}
				name='destination_city'
				rules={{ required: t('desk.edit.destination.cityRequired') }}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormLabel className='text-brand mb-6 font-bold text-xl'>{t('desk.edit.destination.title')}</FormLabel>
						<FormControl>
							<CitySelector
								value={field.value || ''}
								displayValue={destinationCityLabel}
								countryName={destinationCountryValue}
								onChange={(val, city) => {
									field.onChange(val)
									form.setValue('destination_country', city?.country ?? '')
									form.setValue('destination_address', '', { shouldDirty: true, shouldTouch: true })
									mapState.setDestinationExactCoordinates(null)
								}}
								onCoordinates={mapState.setDestinationCityCoordinates}
								countryCode={undefined}
								placeholder={t('desk.edit.destination.cityPlaceholder')}
								disabled={isLoadingPatch}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='destination_address'
				rules={{ required: t('desk.edit.destination.addressRequired') }}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormControl>
							{showMap ? (
								<div className='flex items-center gap-2'>
									<div className='flex-1'>
										<Tooltip>
											<TooltipTrigger asChild>
												<span
													className={cn('inline-flex w-full', canOpenMapFromAddress ? 'cursor-pointer' : 'cursor-not-allowed')}
													onClick={() => {
														if (canOpenMapFromAddress) setIsMapOpen(true)
													}}
												>
													<InputGroup>
														<InputGroupInput
															placeholder={t('desk.edit.destination.addressPlaceholder')}
															{...field}
															value={field.value ?? ''}
															disabled
															className={cn(
																canOpenMapFromAddress ? 'cursor-pointer' : 'cursor-not-allowed',
																field.value ? 'text-black disabled:text-black disabled:opacity-100' : undefined,
															)}
														/>
														<InputGroupAddon className='pr-2'>
															<Home className={cn('text-grayscale size-5', field.value && 'text-black')} />
														</InputGroupAddon>
													</InputGroup>
												</span>
											</TooltipTrigger>
											<TooltipContent side='top' className='text-black' sideOffset={6}>
												{canOpenMapFromAddress ? 'Укажите адрес на карте' : 'Требуется указать город'}
											</TooltipContent>
										</Tooltip>
									</div>
									<LocationMapPicker
										type='destination'
										apiKey={yandexApiKey}
										city={mapState.destinationCity}
										country={destinationCountryValue}
										address={mapState.destinationAddress}
										fallbackPoint={
											mapState.destinationCityCoordinates
												? {
														lat: Number(mapState.destinationCityCoordinates.lat),
														lng: Number(mapState.destinationCityCoordinates.lon),
													}
												: null
										}
										value={mapState.destinationExactCoordinates}
										onSelect={(selection) => {
											mapState.setDestinationExactCoordinates({ lat: selection.lat, lng: selection.lng })
											if (selection.address) {
												form.setValue('destination_address', selection.address, { shouldDirty: true, shouldTouch: true })
											}
										}}
										disabled={isLoadingPatch}
										compact
										disabledCityTooltip='Требуется указать город'
										open={isMapOpen}
										onOpenChange={setIsMapOpen}
									/>
								</div>
							) : (
								<InputGroup>
									<InputGroupInput
										placeholder={t('desk.edit.destination.addressPlaceholder')}
										{...field}
										value={field.value ?? ''}
										disabled={isLoadingPatch}
									/>
									<InputGroupAddon className='pr-2'>
										<Home className={cn('text-grayscale size-5', field.value && 'text-black')} />
									</InputGroupAddon>
								</InputGroup>
							)}
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='delivery_date'
				rules={{ required: t('desk.edit.destination.dateRequired') }}
				render={({ field }) => (
					<FormItem className='flex flex-col'>
						<FormControl>
							<DatePicker
								value={field.value ?? undefined}
								onChange={field.onChange}
								placeholder={t('desk.edit.destination.datePlaceholder')}
								disabled={isLoadingPatch}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}
