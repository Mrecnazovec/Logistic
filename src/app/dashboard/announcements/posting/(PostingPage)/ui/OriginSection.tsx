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
	showMap?: boolean
}

export function OriginSection({ form, isLoadingCreate, originCountryValue, yandexApiKey, showMap = true }: OriginSectionProps) {
	const { t } = useI18n()
	const [cityCoordinates, setCityCoordinates] = useState<CityCoordinates | null>(null)
	const [exactCoordinates, setExactCoordinates] = useState<{ lat: number; lng: number } | null>(null)
	const originCity = form.watch('origin_city')
	const originAddress = form.watch('origin_address')

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
							<div className='flex items-center gap-2'>
								<div className='flex-1'>
									<CitySelector
										value={field.value || ''}
										countryName={originCountryValue}
										onChange={(val, city) => {
											field.onChange(val)
											form.setValue('origin_country', city?.country ?? '')
											form.setValue('origin_address', '', { shouldDirty: true, shouldTouch: true })
											setExactCoordinates(null)
										}}
										onCoordinates={(coordinates) => {
											setCityCoordinates(coordinates)
										}}
										countryCode={undefined}
										placeholder={t('announcements.posting.origin.cityPlaceholder')}
										disabled={isLoadingCreate}
									/>
								</div>
								{showMap ? (
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
											if (selection.address) {
												form.setValue('origin_address', selection.address, { shouldDirty: true, shouldTouch: true })
											}
										}}
										disabled={isLoadingCreate}
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
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormControl>
							{showMap ? (
								<Tooltip>
									<TooltipTrigger asChild>
										<span className='inline-flex w-full'>
											<InputGroup>
												<InputGroupInput
													placeholder={t('announcements.posting.origin.addressPlaceholder')}
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
										placeholder={t('announcements.posting.origin.addressPlaceholder')}
										{...field}
										value={field.value ?? ''}
										disabled={isLoadingCreate}
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
