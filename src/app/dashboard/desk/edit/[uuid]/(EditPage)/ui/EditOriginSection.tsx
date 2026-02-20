'use client'

import { UuidCopy } from '@/components/ui/actions/UuidCopy'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { DatePicker } from '@/components/ui/selectors/DateSelector'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip'
import { LocationMapPicker } from '@/app/dashboard/announcements/posting/(PostingPage)/ui/LocationMapPicker'
import { useI18n } from '@/i18n/I18nProvider'
import { cn } from '@/lib/utils'
import { Home } from 'lucide-react'
import { EDIT_SECTION_CLASS } from '../constants/editLayout'
import type { EditSectionCommonProps, EditFormMapState } from '../types/EditForm.types'

type EditOriginSectionProps = EditSectionCommonProps & {
	loadUuid?: string
	originCountryValue?: string
	originCityLabel?: string
	yandexApiKey?: string
	showMap: boolean
	mapState: EditFormMapState
}

export function EditOriginSection({
	form,
	isLoadingPatch,
	loadUuid,
	originCountryValue,
	originCityLabel,
	yandexApiKey,
	showMap,
	mapState,
}: EditOriginSectionProps) {
	const { t } = useI18n()

	return (
		<div className={EDIT_SECTION_CLASS}>
			<FormField
				control={form.control}
				name='origin_city'
				rules={{ required: t('desk.edit.origin.cityRequired') }}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormLabel className='flex flex-wrap items-center justify-between mb-6'>
							<p className='text-brand font-bold text-xl'>{t('desk.edit.origin.title')}</p>
							<UuidCopy uuid={loadUuid} isPlaceholder />
						</FormLabel>
						<FormControl>
							<div className='flex items-center gap-2'>
								<div className='flex-1'>
									<CitySelector
										value={field.value || ''}
										displayValue={originCityLabel}
										countryName={originCountryValue}
										onChange={(val, city) => {
											field.onChange(val)
											form.setValue('origin_country', city?.country ?? '')
											form.setValue('origin_address', '', { shouldDirty: true, shouldTouch: true })
											mapState.setOriginExactCoordinates(null)
										}}
										onCoordinates={mapState.setOriginCityCoordinates}
										countryCode={undefined}
										placeholder={t('desk.edit.origin.cityPlaceholder')}
										disabled={isLoadingPatch}
									/>
								</div>
								{showMap ? (
									<LocationMapPicker
										type='origin'
										apiKey={yandexApiKey}
										city={mapState.originCity}
										country={originCountryValue}
										address={mapState.originAddress}
										fallbackPoint={
											mapState.originCityCoordinates
												? {
														lat: Number(mapState.originCityCoordinates.lat),
														lng: Number(mapState.originCityCoordinates.lon),
												  }
												: null
										}
										value={mapState.originExactCoordinates}
										onSelect={(selection) => {
											mapState.setOriginExactCoordinates({ lat: selection.lat, lng: selection.lng })
											if (selection.address) {
												form.setValue('origin_address', selection.address, { shouldDirty: true, shouldTouch: true })
											}
										}}
										disabled={isLoadingPatch}
										compact
										disabledCityTooltip='Требуется указать город'
									/>
								) : null}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='origin_address'
				rules={{ required: t('desk.edit.origin.addressRequired') }}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormControl>
							{showMap ? (
								<Tooltip>
									<TooltipTrigger asChild>
										<span className='inline-flex w-full'>
											<InputGroup>
												<InputGroupInput
													placeholder={t('desk.edit.origin.addressPlaceholder')}
													{...field}
													value={field.value ?? ''}
													disabled
												/>
												<InputGroupAddon className='pr-2'>
													<Home className={cn('text-grayscale size-5', field.value && 'text-black')} />
												</InputGroupAddon>
											</InputGroup>
										</span>
									</TooltipTrigger>
									<TooltipContent side='top' className='text-black' sideOffset={6}>
										Укажите адрес на карте
									</TooltipContent>
								</Tooltip>
							) : (
								<InputGroup>
									<InputGroupInput
										placeholder={t('desk.edit.origin.addressPlaceholder')}
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
				name='load_date'
				rules={{ required: t('desk.edit.origin.dateRequired') }}
				render={({ field }) => (
					<FormItem className='flex flex-col'>
						<FormControl>
							<DatePicker
								value={field.value}
								onChange={field.onChange}
								placeholder={t('desk.edit.origin.datePlaceholder')}
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
