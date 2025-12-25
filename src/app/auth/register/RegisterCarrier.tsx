import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form-control/Form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/form-control/InputGroup'
import { CitySelector } from '@/components/ui/selectors/CitySelector'
import { CountrySelector } from '@/components/ui/selectors/CountrySelector'
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
	const [country, setCountry] = useState<Country | null>(null)

	return (
		<>
			{/* Ф.И.О. */}
			<FormField
				control={form.control}
				name='first_name'
				rules={{ required: 'Ф.И.О. обязательно' }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>Введите Ф.И.О.</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput placeholder='Введите Ф.И.О.' disabled={isPending} {...field} value={field.value ?? ''} />
								<InputGroupAddon className='pr-2'>
									<User className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			{/* Ф.И.О. */}
			<FormField
				control={form.control}
				name='email'
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>Введите email</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput placeholder='Введите email' disabled={isPending} {...field} value={field.value ?? ''} />
								<InputGroupAddon className='pr-2'>
									<Mail className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			{/* Номер телефона */}
			<FormField
				control={form.control}
				name='phone'
				rules={{ required: 'Телефон обязателен' }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>Введите номер</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput placeholder='Номер телефона' disabled={isPending} {...field} value={field.value ?? ''} />
								<InputGroupAddon className='pr-2'>
									<Phone className='text-grayscale size-5' />
								</InputGroupAddon>
							</InputGroup>
						</FormControl>
					</FormItem>
				)}
			/>

			{/* Страна / Город */}
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
				<FormField
					control={form.control}
					name='country'
					render={() => (
						<FormItem>
							<FormLabel>Выберите страну</FormLabel>
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
							<FormLabel className='text-grayscale'>Выберите город</FormLabel>
							<FormControl>
								<CitySelector
									value={form.watch('city')}
									onChange={(cityName) => {
										form.setValue('city', cityName)
									}}
									countryCode={form.watch('country_code')}
									placeholder='Выберите город'
									disabled={!form.watch('country') || isPending}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>

			{/* Название компании */}
			<FormField
				control={form.control}
				name='company_name'
				rules={{ required: 'Название компании обязательно' }}
				render={({ field }) => (
					<FormItem className='mb-6'>
						<FormLabel className='text-grayscale'>Введите название компании</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									className='pl-3'
									placeholder='Введите название компании'
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
	label = 'Транспорт',
	placeholder = 'Введите название транспорта',
	onChange,
}: RegisterTransportFieldProps) {
	return (
		<FormField
			control={form.control}
			name='transport_name'
			render={({ field }) => (
				<FormItem className='mb-6'>
					<FormLabel className='text-grayscale'>{label}</FormLabel>
					<FormControl>
						<InputGroup>
							<InputGroupInput
								placeholder={placeholder}
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
	return (
		<>
			{showTransportName && (
				<FormField
					control={form.control}
					name='transport_name'
					render={({ field }) => (
						<FormItem className='mb-6'>
							<FormLabel className='text-grayscale'>Введите название машины перевозчика</FormLabel>
							<FormControl>
								<InputGroup>
									<InputGroupInput
										className='pl-2'
										placeholder='Введите название машины перевозчика'
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
						<FormLabel className='text-grayscale'>Введите номер машины</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									className='pl-2'
									placeholder='Введите номер машины'
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
						<FormLabel className='text-grayscale'>Введите номер прицепа</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									className='pl-2'
									placeholder='Введите номер прицепа'
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
						<FormLabel className='text-grayscale'>Введите номер/серию водительского удостоверения</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupInput
									className='pl-2'
									placeholder='Введите номер/серию водительского удостоверения'
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
