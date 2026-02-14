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

type DestinationSectionProps = {
	form: UseFormReturn<CargoPublishRequestDto>
	isLoadingCreate: boolean
	destinationCountryValue?: string
	yandexApiKey?: string
	showMap?: boolean
}

export function DestinationSection({
	form,
	isLoadingCreate,
	destinationCountryValue,
	yandexApiKey,
	showMap = true,
}: DestinationSectionProps) {
	const { t } = useI18n()
	const [cityCoordinates, setCityCoordinates] = useState<CityCoordinates | null>(null)
	const [exactCoordinates, setExactCoordinates] = useState<{ lat: number; lng: number } | null>(null)
	const destinationCity = form.watch('destination_city')
	const destinationAddress = form.watch('destination_address')

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
						{showMap ? (
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
									if (selection.address) {
										form.setValue('destination_address', selection.address, { shouldDirty: true, shouldTouch: true })
									}
								}}
								disabled={isLoadingCreate}
							/>
						) : null}
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
							<InputGroup>
								<InputGroupInput
									placeholder={t('announcements.posting.destination.addressPlaceholder')}
									{...field}
									value={field.value ?? ''}
									disabled={isLoadingCreate || showMap}
								/>
								<InputGroupAddon className='pr-2'>
									<Home className={cn('text-grayscale size-5', field.value && 'text-black')} />
								</InputGroupAddon>
							</InputGroup>
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
