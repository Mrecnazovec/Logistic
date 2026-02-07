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

type DestinationSectionProps = {
	form: UseFormReturn<CargoPublishRequestDto>
	isLoadingCreate: boolean
	destinationCountryValue?: string
}

export function DestinationSection({ form, isLoadingCreate, destinationCountryValue }: DestinationSectionProps) {
	const { t } = useI18n()

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
				rules={{ required: t('announcements.posting.destination.addressRequired') }}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									placeholder={t('announcements.posting.destination.addressPlaceholder')}
									{...field}
									value={field.value ?? ''}
									disabled={isLoadingCreate}
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
