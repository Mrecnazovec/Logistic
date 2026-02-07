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

type OriginSectionProps = {
	form: UseFormReturn<CargoPublishRequestDto>
	isLoadingCreate: boolean
	originCountryValue?: string
}

export function OriginSection({ form, isLoadingCreate, originCountryValue }: OriginSectionProps) {
	const { t } = useI18n()

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
				rules={{ required: t('announcements.posting.origin.addressRequired') }}
				render={({ field }) => (
					<FormItem className='w-full'>
						<FormControl>
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
