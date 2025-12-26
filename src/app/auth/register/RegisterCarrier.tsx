import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { CountrySelector } from '@/components/ui/selectors/CountrySelector'
import { useI18n } from '@/i18n/I18nProvider'
import { Country } from '@/shared/types/Geo.interface'
import { RegisterDto } from '@/shared/types/Registration.interface'
import { Mail, Phone, User } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface RegisterFieldsProps {
	form: UseFormReturn<RegisterDto, undefined>
	isPending: boolean
}

interface RegisterVehicleFieldsProps extends RegisterFieldsProps {
	showTransportName?: boolean
}

interface RegisterTransportFieldProps extends RegisterFieldsProps {
	label?: string
	placeholder?: string
	onChange?: (value: string) => void
}

export function RegisterCompanyFields({ form, isPending }: RegisterFieldsProps) {
	const { t } = useI18n()
	const [country, setCountry] = useState<Country | null>(null)

	return (
		<>
			<FormField
				control={form.control}
				name='first_name'
				rules={{ required: t('register.company.firstNameRequired') }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.company.firstNameLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									placeholder={t('register.company.firstNamePlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
								/>
								<InputGroupAddon className='pr-2'>
									<User className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='email'
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.company.emailLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									placeholder={t('register.company.emailPlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
								/>
								<InputGroupAddon className='pr-2'>
									<Mail className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='phone'
				rules={{ required: t('register.company.phoneRequired') }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.company.phoneLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									placeholder={t('register.company.phonePlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
								/>
								<InputGroupAddon className='pr-2'>
									<Phone className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
				<FormField
					control={form.control}
					name='country'
					render={() => (
						<FormItem>
							<FormLabel>{t('register.company.countryLabel')}</FormLabel>
							<FormControl>
								<CountrySelector
									value={country}
									onChange={(selected: Country) => {
										setCountry(selected)
										form.setValue('country', selected.name)
										form.setValue('country_code', selected.code)
										form.setValue('city', '')
									}}
									disabled={isPending}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='city'
					render={() => (
						<FormItem>
							<FormLabel className='text-grayscale'>{t('register.company.cityLabel')}</FormLabel>
							<FormControl>
								<CitySelector
									value={form.watch('city')}
									onChange={(cityName) => {
										form.setValue('city', cityName)
									}}
									countryCode={form.watch('country_code')}
									placeholder={t('register.company.cityPlaceholder')}
									disabled={!form.watch('country') || isPending}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name='company_name'
				rules={{ required: t('register.company.companyNameRequired') }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.company.companyNameLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									className='pl-3'
									placeholder={t('register.company.companyNamePlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
								/>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>
		</>
	)
}

export function RegisterTransportField({
	form,
	isPending,
	label,
	placeholder,
	onChange,
}: RegisterTransportFieldProps) {
	const { t } = useI18n()
	const resolvedLabel = label ?? t('register.transport.label')
	const resolvedPlaceholder = placeholder ?? t('register.transport.placeholder')

	return (
		<FormField
			control={form.control}
			name='transport_name'
			render={({ field }) => (
				<FormItem className='mb-6'>
					<FormLabel className='text-grayscale'>{resolvedLabel}</FormLabel>
					<FormControl>
						<InputGroup>
							<InputGroupInput
								placeholder={resolvedPlaceholder}
								className='pl-3'
								disabled={isPending}
								{...field}
								value={field.value ?? ''}
								onChange={(event) => {
									field.onChange(event)
									onChange?.(event.target.value)
								}}
							/>
						</InputGroup>
					</FormControl>
				</FormItem>
			)}
		/>
	)
}

export function RegisterVehicleFields({ form, isPending, showTransportName = true }: RegisterVehicleFieldsProps) {
	const { t } = useI18n()

	return (
		<>
			{showTransportName && (
				<FormField
					control={form.control}
					name='transport_name'
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel className='text-grayscale'>{t('register.vehicle.transportNameLabel')}</FormLabel>
							<FormControl>
								<InputGroup>
									<InputGroupInput
										className='pl-2'
										placeholder={t('register.vehicle.transportNamePlaceholder')}
										disabled={isPending}
										{...field}
										value={field.value ?? ''}
									/>
								</InputGroup>
							</FormControl>
						</FormItem>
					)}
				/>
			)}

			<FormField
				control={form.control}
				name='car_number'
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.vehicle.carNumberLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									className='pl-2'
									placeholder={t('register.vehicle.carNumberPlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
								/>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='trailer_number'
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.vehicle.trailerNumberLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									className='pl-2'
									placeholder={t('register.vehicle.trailerNumberPlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
								/>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='driver_license'
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>{t('register.vehicle.driverLicenseLabel')}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									className='pl-2'
									placeholder={t('register.vehicle.driverLicensePlaceholder')}
									disabled={isPending}
									{...field}
									value={field.value ?? ''}
								/>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>
		</>
	)
}
