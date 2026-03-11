import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { DatePicker } from '@/components/ui/selectors/DateSelector'
import { cn } from '@/lib/utils'
import { CargoPublishRequestDto } from '@/shared/types/CargoPublish.interface'
import { Home } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { useI18n } from '@/i18n/I18nProvider'
import { POSTING_SECTION_CLASS } from '../constants/postingLayout'
import { LocationMapPicker } from './LocationMapPicker'
import { useState } from 'react'
import { CityCoordinates } from '@/shared/types/Nominatim.interface'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip'

type DestinationSectionProps = {
	form: UseFormReturn<CargoPublishRequestDto>
	isLoadingCreate: boolean
	destinationCountryValue?: string
	yandexApiKey?: string
}

export function DestinationSection({
	form,
	isLoadingCreate,
	destinationCountryValue,
	yandexApiKey,
}: DestinationSectionProps) {
	const { t } = useI18n()
	const [cityCoordinates, setCityCoordinates] = useState<CityCoordinates | null>(null)
	const [exactCoordinates, setExactCoordinates] = useState<{ lat: number; lng: number } | null>(null)
	const [isMapOpen, setIsMapOpen] = useState(false)
	const destinationCity = form.watch('destination_city')
	const destinationAddress = form.watch('destination_address')
	const canOpenMapFromAddress = Boolean(destinationCity?.trim())

	return (
		<div className={POSTING_SECTION_CLASS}>
			<FormField
				control={form.control}
				name='destination_city'
				rules={{ required: t('announcements.posting.destination.cityRequired') }}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormLabel className='text-brand mb-6 font-bold text-xl'>
							{t('announcements.posting.destination.title')}
						</FormLabel>
						<FormControl>
							<CitySelector
								value={field.value || ''}
								countryName={destinationCountryValue}
								onChange={(val, city) => {
									field.onChange(val)
									form.setValue('destination_country', city?.country ?? '')
									form.setValue('destination_address', '', { shouldDirty: true, shouldTouch: true })
									form.setValue('dest_lat', undefined)
									form.setValue('dest_lng', undefined)
									setExactCoordinates(null)
								}}
								onCoordinates={(coordinates) => {
									setCityCoordinates(coordinates)
								}}
								countryCode={undefined}
								placeholder={t('announcements.posting.destination.cityPlaceholder')}
								disabled={isLoadingCreate}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='destination_address'
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormControl>
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
														placeholder={t('announcements.posting.destination.addressPlaceholder')}
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
											{canOpenMapFromAddress
												? t('announcements.posting.map.pickAddressTooltip')
												: t('announcements.posting.map.cityRequiredTooltip')}
										</TooltipContent>
									</Tooltip>
								</div>
								<LocationMapPicker
									type='destination'
									apiKey={yandexApiKey}
									city={destinationCity}
									country={destinationCountryValue}
									address={destinationAddress}
									fallbackPoint={
										cityCoordinates
											? {
													lat: Number(cityCoordinates.lat),
													lng: Number(cityCoordinates.lon),
												}
											: null
									}
									value={exactCoordinates}
									onSelect={(selection) => {
										setExactCoordinates({ lat: selection.lat, lng: selection.lng })
										form.setValue('dest_lat', selection.lat, { shouldDirty: true })
										form.setValue('dest_lng', selection.lng, { shouldDirty: true })
										if (selection.address) {
											form.setValue('destination_address', selection.address, { shouldDirty: true, shouldTouch: true })
										}
									}}
									disabled={isLoadingCreate}
									compact
									disabledCityTooltip={t('announcements.posting.map.cityRequiredTooltip')}
									open={isMapOpen}
									onOpenChange={setIsMapOpen}
								/>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='delivery_date'
				rules={{ required: t('announcements.posting.destination.dateRequired') }}
				render={({ field }) => (
					<FormItem className='flex flex-col'>
						<FormControl>
							<DatePicker
								value={field.value ?? undefined}
								onChange={field.onChange}
								placeholder={t('announcements.posting.destination.datePlaceholder')}
								disabled={isLoadingCreate}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}
