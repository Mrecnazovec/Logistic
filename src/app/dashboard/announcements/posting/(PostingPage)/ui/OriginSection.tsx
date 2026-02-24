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

type OriginSectionProps = {
	form: UseFormReturn<CargoPublishRequestDto>
	isLoadingCreate: boolean
	originCountryValue?: string
	yandexApiKey?: string
}

export function OriginSection({ form, isLoadingCreate, originCountryValue, yandexApiKey }: OriginSectionProps) {
	const { t } = useI18n()
	const [cityCoordinates, setCityCoordinates] = useState<CityCoordinates | null>(null)
	const [exactCoordinates, setExactCoordinates] = useState<{ lat: number; lng: number } | null>(null)
	const [isMapOpen, setIsMapOpen] = useState(false)
	const originCity = form.watch('origin_city')
	const originAddress = form.watch('origin_address')
	const canOpenMapFromAddress = Boolean(originCity?.trim())

	return (
		<div className={POSTING_SECTION_CLASS}>
			<FormField
				control={form.control}
				name='origin_city'
				rules={{ required: t('announcements.posting.origin.cityRequired') }}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormLabel className='text-brand mb-6 font-bold text-xl'>
							{t('announcements.posting.origin.title')}
						</FormLabel>
						<FormControl>
							<CitySelector
								value={field.value || ''}
								countryName={originCountryValue}
								onChange={(val, city) => {
									field.onChange(val)
									form.setValue('origin_country', city?.country ?? '')
									form.setValue('origin_address', '', { shouldDirty: true, shouldTouch: true })
									form.setValue('origin_lat', undefined)
									form.setValue('origin_lng', undefined)
									setExactCoordinates(null)
								}}
								onCoordinates={(coordinates) => {
									setCityCoordinates(coordinates)
								}}
								countryCode={undefined}
								placeholder={t('announcements.posting.origin.cityPlaceholder')}
								disabled={isLoadingCreate}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='origin_address'
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
														placeholder={t('announcements.posting.origin.addressPlaceholder')}
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
									type='origin'
									apiKey={yandexApiKey}
									city={originCity}
									country={originCountryValue}
									address={originAddress}
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
										form.setValue('origin_lat', selection.lat, { shouldDirty: true })
										form.setValue('origin_lng', selection.lng, { shouldDirty: true })
										if (selection.address) {
											form.setValue('origin_address', selection.address, { shouldDirty: true, shouldTouch: true })
										}
									}}
									disabled={isLoadingCreate}
									compact
									disabledCityTooltip='Требуется указать город'
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
				name='load_date'
				rules={{ required: t('announcements.posting.origin.dateRequired') }}
				render={({ field }) => (
					<FormItem className='flex flex-col'>
						<FormControl>
							<DatePicker
								value={field.value}
								onChange={field.onChange}
								placeholder={t('announcements.posting.origin.datePlaceholder')}
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
